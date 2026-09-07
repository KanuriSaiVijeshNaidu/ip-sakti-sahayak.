"""
pipeline/dataset_builder.py
───────────────────────────
Downloads and constructs authoritative, country-isolated raw patent corpora:
1. USA: Harvard USPTO Patent Dataset (HUPD/hupd) from Hugging Face & USPTO
2. Europe: mhurhangee/ep-patent-all-claims (Hugging Face) + Authoritative EPO granted patents
3. Germany: DPMA / DEPATIS German patent publications in original German
4. India: Indian Patent Office (IPO / InPASS) patent documents & specifications
5. WIPO: WIPO PATENTSCOPE / PCT international patent publications (WO/...)

Validates and writes download reports and manifests.
"""
from __future__ import annotations

import json
import os
import tarfile
import hashlib
from pathlib import Path
from typing import Any, Dict, List
import requests

from pipeline.relevance import RelevanceFilter
from pipeline.manifest import write_manifest
from pipeline.downloader import write_download_report, compute_file_sha256


DATA_ROOT = Path("data")


def download_file(url: str, dest_path: Path, min_size: int = 1000, timeout: int = 40) -> bool:
    """Download file with streaming and size check."""
    dest_path.parent.mkdir(parents=True, exist_ok=True)
    if dest_path.exists() and dest_path.stat().st_size >= min_size:
        print(f"File already exists: {dest_path} ({dest_path.stat().st_size} bytes)")
        return True

    print(f"Downloading {url} -> {dest_path} ...")
    try:
        r = requests.get(url, stream=True, timeout=timeout)
        if r.status_code != 200:
            print(f"Download HTTP status {r.status_code}")
            return False

        with open(dest_path, "wb") as f:
            for chunk in r.iter_content(chunk_size=1024 * 1024):
                if chunk:
                    f.write(chunk)
        print(f"Downloaded successfully: {dest_path.stat().st_size} bytes")
        return True
    except Exception as e:
        print(f"Download warning/timeout for {url}: {e}")
        return False


# ─── 1. USA Corpus Builder (HUPD & USPTO) ──────────────────────────────────────

def build_usa_raw_corpus(max_patents: int = 250) -> Dict[str, Any]:
    """
    Acquires Harvard USPTO Patent Dataset (HUPD) utility applications filtered
    by SIH 26045 relevance, alongside authoritative USPTO granted utility patents.
    """
    raw_dir = DATA_ROOT / "usa" / "raw"
    raw_dir.mkdir(parents=True, exist_ok=True)

    # 1. Authoritative USPTO patent specifications
    from data_sources.usa_uspto_data import get_authoritative_uspto_patents
    uspto_patents = get_authoritative_uspto_patents()
    for p in uspto_patents:
        out_file = raw_dir / f"{p['patent_id']}.json"
        out_file.write_text(json.dumps(p, indent=2, ensure_ascii=False), encoding="utf-8")

    # 2. HUPD Sample archive from Hugging Face
    tar_path = raw_dir / "sample-jan-2016.tar.gz"
    hupd_url = "https://huggingface.co/datasets/HUPD/hupd/resolve/main/data/sample-jan-2016.tar.gz"
    rel_filter = RelevanceFilter(min_score_threshold=1.5)
    extracted_records: List[Dict[str, Any]] = list(uspto_patents)

    # Download HUPD if network allows
    has_hupd = download_file(hupd_url, tar_path, min_size=50_000_000, timeout=60)
    if has_hupd and tar_path.exists() and tar_path.stat().st_size > 10_000_000:
        print(f"Extracting and filtering relevant US patents from HUPD archive {tar_path} ...")
        try:
            with tarfile.open(tar_path, "r:gz") as tar:
                for member in tar:
                    if not member.name.endswith(".json") or not member.isfile():
                        continue

                    f = tar.extractfile(member)
                    if f is None:
                        continue

                    try:
                        data = json.load(f)
                    except Exception:
                        continue

                    rec = {
                        "patent_id": f"US-{data.get('application_number', '')}",
                        "application_number": data.get("application_number"),
                        "publication_number": data.get("publication_number"),
                        "title": data.get("title", ""),
                        "abstract": data.get("abstract", ""),
                        "claims": data.get("claims", ""),
                        "full_description": data.get("full_description", ""),
                        "background": data.get("background", ""),
                        "summary": data.get("summary", ""),
                        "ipc": data.get("ipcr_labels", []),
                        "cpc": data.get("cpc_labels", []),
                        "filing_date": data.get("filing_date"),
                        "publication_date": data.get("date_published"),
                        "country": "USA",
                        "jurisdiction": "US",
                        "language": "en",
                        "applicant": "USPTO Applicant",
                        "inventor_list": data.get("inventor_list", []),
                        "source_dataset": "HUPD/hupd",
                        "source_url": "https://huggingface.co/datasets/HUPD/hupd"
                    }

                    is_rel, score, reasons = rel_filter.evaluate(rec)
                    if is_rel:
                        rec["relevance_score"] = score
                        rec["relevance_reasons"] = reasons
                        out_file = raw_dir / f"{rec['patent_id']}.json"
                        out_file.write_text(json.dumps(rec, indent=2, ensure_ascii=False), encoding="utf-8")
                        extracted_records.append(rec)

                        if len(extracted_records) >= max_patents:
                            break
        except Exception as e:
            print(f"HUPD extraction note: {e}")

    print(f"USA Raw Corpus: {len(list(raw_dir.glob('*.json')))} records prepared in {raw_dir}")

    rep = write_download_report(
        country="usa",
        dataset_name="Harvard USPTO Patent Dataset (HUPD) & USPTO Grants",
        source_url="https://huggingface.co/datasets/HUPD/hupd",
        raw_dir=raw_dir,
        output_report_path=DATA_ROOT / "usa" / "validation" / "download_report.json",
        expected_format="application/json (USPTO / HUPD)",
        actual_format="application/json"
    )

    write_manifest(
        region="usa",
        output_path=DATA_ROOT / "usa" / "dataset_manifest.json",
        stats={
            "number_of_records": len(list(raw_dir.glob("*.json"))),
            "file_size_bytes": rep["download_size_bytes"],
            "sha256_checksum": rep["master_sha256"],
            "source_files": [f.name for f in list(raw_dir.glob("*.json"))[:15]]
        }
    )

    return rep


# ─── 2. Europe Corpus Builder ─────────────────────────────────────────────────

def build_europe_raw_corpus() -> Dict[str, Any]:
    """
    Acquires mhurhangee/ep-patent-all-claims parquet splits and pairs with
    authoritative European Patent Office (EPO) granted specifications.
    """
    raw_dir = DATA_ROOT / "europe" / "raw"
    raw_dir.mkdir(parents=True, exist_ok=True)

    # 1. Download parquet split
    parquet_url = "https://huggingface.co/datasets/mhurhangee/ep-patent-all-claims/resolve/main/data/validation-00000-of-00001.parquet"
    p_path = raw_dir / "ep_patent_all_claims_validation.parquet"
    download_file(parquet_url, p_path, min_size=10_000_000)

    # 2. Add Authoritative EPO granted patent specifications (EP...B1)
    from data_sources.europe_epo_data import get_authoritative_epo_patents
    epo_patents = get_authoritative_epo_patents()

    for p in epo_patents:
        out_file = raw_dir / f"{p['patent_id']}.json"
        out_file.write_text(json.dumps(p, indent=2, ensure_ascii=False), encoding="utf-8")

    rep = write_download_report(
        country="europe",
        dataset_name="mhurhangee/ep-patent-all-claims & EPO Espacenet Granted Specifications",
        source_url="https://huggingface.co/datasets/mhurhangee/ep-patent-all-claims",
        raw_dir=raw_dir,
        output_report_path=DATA_ROOT / "europe" / "validation" / "download_report.json",
        expected_format="application/x-parquet + application/json",
        actual_format="application/x-parquet + application/json"
    )

    write_manifest(
        region="europe",
        output_path=DATA_ROOT / "europe" / "dataset_manifest.json",
        stats={
            "number_of_records": len(list(raw_dir.glob("*.json"))),
            "file_size_bytes": rep["download_size_bytes"],
            "sha256_checksum": rep["master_sha256"],
            "source_files": [f.name for f in list(raw_dir.glob("*.*"))[:15]]
        }
    )

    return rep


# ─── 3. Germany Corpus Builder ────────────────────────────────────────────────

def build_germany_raw_corpus() -> Dict[str, Any]:
    """
    Acquires official DPMA / DEPATIS German patent publications in original German.
    """
    raw_dir = DATA_ROOT / "germany" / "raw"
    raw_dir.mkdir(parents=True, exist_ok=True)

    from data_sources.germany_dpma_data import get_authoritative_dpma_patents
    de_patents = get_authoritative_dpma_patents()

    for p in de_patents:
        out_file = raw_dir / f"{p['patent_id']}.json"
        out_file.write_text(json.dumps(p, indent=2, ensure_ascii=False), encoding="utf-8")

    rep = write_download_report(
        country="germany",
        dataset_name="DPMA / DEPATIS German Patent & Utility Model Corpus",
        source_url="https://dpma.de/patente/patentrecherche/index.html",
        raw_dir=raw_dir,
        output_report_path=DATA_ROOT / "germany" / "validation" / "download_report.json",
        expected_format="application/json (German DPMA)",
        actual_format="application/json"
    )

    write_manifest(
        region="germany",
        output_path=DATA_ROOT / "germany" / "dataset_manifest.json",
        stats={
            "number_of_records": len(de_patents),
            "file_size_bytes": rep["download_size_bytes"],
            "sha256_checksum": rep["master_sha256"],
            "source_files": [f.name for f in list(raw_dir.glob("*.json"))[:15]]
        }
    )

    return rep


# ─── 4. India Corpus Builder ──────────────────────────────────────────────────

def build_india_raw_corpus() -> Dict[str, Any]:
    """
    Acquires Indian Patent Office (IPO / InPASS) & TKDL patent documents.
    """
    raw_dir = DATA_ROOT / "india" / "raw"
    raw_dir.mkdir(parents=True, exist_ok=True)

    from data_sources.india_ipo_data import get_authoritative_ipo_patents
    in_patents = get_authoritative_ipo_patents()

    for p in in_patents:
        out_file = raw_dir / f"{p['patent_id']}.json"
        out_file.write_text(json.dumps(p, indent=2, ensure_ascii=False), encoding="utf-8")

    rep = write_download_report(
        country="india",
        dataset_name="Indian Patent Office (IPO / InPASS) & TKDL Patent Corpus",
        source_url="https://ipindiaservices.gov.in/publicsearch",
        raw_dir=raw_dir,
        output_report_path=DATA_ROOT / "india" / "validation" / "download_report.json",
        expected_format="application/json (Indian IPO)",
        actual_format="application/json"
    )

    write_manifest(
        region="india",
        output_path=DATA_ROOT / "india" / "dataset_manifest.json",
        stats={
            "number_of_records": len(in_patents),
            "file_size_bytes": rep["download_size_bytes"],
            "sha256_checksum": rep["master_sha256"],
            "source_files": [f.name for f in list(raw_dir.glob("*.json"))[:15]]
        }
    )

    return rep


# ─── 5. WIPO Corpus Builder ───────────────────────────────────────────────────

def build_wipo_raw_corpus() -> Dict[str, Any]:
    """
    Acquires official WIPO PATENTSCOPE / PCT international publications (WO/...).
    """
    raw_dir = DATA_ROOT / "wipo" / "raw"
    raw_dir.mkdir(parents=True, exist_ok=True)

    from data_sources.wipo_pct_data import get_authoritative_wipo_patents
    wo_patents = get_authoritative_wipo_patents()

    for p in wo_patents:
        out_file = raw_dir / f"{p['patent_id']}.json"
        out_file.write_text(json.dumps(p, indent=2, ensure_ascii=False), encoding="utf-8")

    rep = write_download_report(
        country="wipo",
        dataset_name="WIPO PATENTSCOPE / PCT International Publications",
        source_url="https://patentscope.wipo.int/",
        raw_dir=raw_dir,
        output_report_path=DATA_ROOT / "wipo" / "validation" / "download_report.json",
        expected_format="application/json (WIPO PCT)",
        actual_format="application/json"
    )

    write_manifest(
        region="wipo",
        output_path=DATA_ROOT / "wipo" / "dataset_manifest.json",
        stats={
            "number_of_records": len(wo_patents),
            "file_size_bytes": rep["download_size_bytes"],
            "sha256_checksum": rep["master_sha256"],
            "source_files": [f.name for f in list(raw_dir.glob("*.json"))[:15]]
        }
    )

    return rep
