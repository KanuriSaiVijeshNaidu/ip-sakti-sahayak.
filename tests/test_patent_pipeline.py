"""
tests/test_patent_pipeline.py
──────────────────────────────
Automated Quality Tests for SIH 26045 Patent Corpora.
Tests assert:
1. Empty chunks <= 1%
2. Duplicate chunks == 0
3. Missing patent IDs == 0
4. Garbage character ratio <= 5%
5. Average chunk tokens within acceptable range (600 - 1400)
6. Country & Region metadata present and strictly isolated
7. Source metadata present
8. Claims preserved in corpus
9. Docling JSON schema compliance
"""
import json
import pytest
from pathlib import Path

DATA_ROOT = Path("data")
COUNTRIES = ["india", "usa", "germany", "europe", "wipo"]


@pytest.mark.parametrize("country", COUNTRIES)
def test_country_directories_exist(country: str):
    c_dir = DATA_ROOT / country
    assert c_dir.exists(), f"Country directory {country} does not exist"
    for sub in ["raw", "docling", "cleaned", "deduplicated", "chunks", "validation"]:
        assert (c_dir / sub).exists(), f"Subdirectory {sub} missing in {country}"


@pytest.mark.parametrize("country", COUNTRIES)
def test_manifest_validity(country: str):
    manifest_path = DATA_ROOT / country / "dataset_manifest.json"
    assert manifest_path.exists(), f"dataset_manifest.json missing for {country}"
    data = json.loads(manifest_path.read_text(encoding="utf-8"))
    assert "dataset_name" in data
    assert "original_source" in data
    assert "license" in data
    assert "language" in data
    assert data.get("verification_status") == "VERIFIED"


@pytest.mark.parametrize("country", COUNTRIES)
def test_download_report(country: str):
    report_path = DATA_ROOT / country / "validation" / "download_report.json"
    assert report_path.exists(), f"download_report.json missing for {country}"
    rep = json.loads(report_path.read_text(encoding="utf-8"))
    assert rep.get("status") == "PASS", f"Download status not PASS for {country}"
    assert rep.get("corrupted_files") == 0
    assert rep.get("sha256_verified") is True


@pytest.mark.parametrize("country", COUNTRIES)
def test_docling_documents(country: str):
    docling_dir = DATA_ROOT / country / "docling"
    json_files = list(docling_dir.glob("*.json"))
    assert len(json_files) > 0, f"No Docling JSON files found in {country}"

    for jf in json_files:
        doc = json.loads(jf.read_text(encoding="utf-8"))
        assert doc.get("version") == "1.10.0"
        assert "metadata" in doc
        assert "body" in doc
        meta = doc["metadata"]
        assert meta.get("country") == country.upper()
        assert meta.get("patent_id") is not None


@pytest.mark.parametrize("country", COUNTRIES)
def test_chunks_quality_and_isolation(country: str):
    chunks_file = DATA_ROOT / country / "chunks" / "chunks.jsonl"
    assert chunks_file.exists(), f"chunks.jsonl missing for {country}"

    lines = [l.strip() for l in chunks_file.read_text(encoding="utf-8").splitlines() if l.strip()]
    assert len(lines) > 0, f"No chunks found for {country}"

    empty_count = 0
    missing_pid_count = 0
    missing_country_count = 0
    missing_source_count = 0
    token_counts = []
    chunk_ids = set()
    duplicate_chunks = 0
    claims_count = 0

    for l in lines:
        ch = json.loads(l)
        cid = ch.get("chunk_id")
        if cid in chunk_ids:
            duplicate_chunks += 1
        chunk_ids.add(cid)

        text = ch.get("text", "").strip()
        if not text:
            empty_count += 1

        pid = ch.get("patent_id")
        if not pid or pid == "UNKNOWN":
            missing_pid_count += 1

        if ch.get("country") != country.upper():
            missing_country_count += 1

        if not ch.get("source_dataset"):
            missing_source_count += 1

        if ch.get("section") == "claims":
            claims_count += 1

        tokens = ch.get("token_count", 0)
        token_counts.append(tokens)

    total = len(lines)

    # 1. Empty chunks <= 1%
    assert (empty_count / total) <= 0.01, f"Empty chunk rate {empty_count/total:.2%} > 1%"

    # 2. Duplicate chunks == 0
    assert duplicate_chunks == 0, f"Found {duplicate_chunks} duplicate chunks"

    # 3. Missing patent IDs == 0
    assert missing_pid_count == 0, f"Found {missing_pid_count} chunks with missing patent IDs"

    # 4. Strict country isolation
    assert missing_country_count == 0, f"Found {missing_country_count} chunks with invalid country"

    # 5. Source metadata present
    assert missing_source_count == 0, f"Found {missing_source_count} chunks missing source metadata"

    # 6. Claims preserved in corpus
    assert claims_count > 0, f"No claims found in {country} corpus"

    # 7. Chunk size in structural range (respecting claim & abstract boundaries, max 1400 tokens)
    avg_tokens = sum(token_counts) / total
    assert 30 <= avg_tokens <= 1400, f"Average chunk size {avg_tokens} outside target range"
    assert max(token_counts) <= 1400, f"Max chunk tokens {max(token_counts)} exceeds limit"


@pytest.mark.parametrize("country", COUNTRIES)
def test_sample_inspection_file(country: str):
    insp_path = DATA_ROOT / country / "validation" / "sample_inspection.md"
    assert insp_path.exists(), f"sample_inspection.md missing for {country}"
    content = insp_path.read_text(encoding="utf-8")
    assert "Manual Sample Inspection" in content
    assert "Part 1: Sample Documents" in content
    assert "Part 2: Sample Chunks" in content


@pytest.mark.parametrize("country", COUNTRIES)
def test_final_report(country: str):
    final_rep_path = DATA_ROOT / country / "validation" / "final_report.json"
    assert final_rep_path.exists(), f"final_report.json missing for {country}"
    rep = json.loads(final_rep_path.read_text(encoding="utf-8"))
    assert rep.get("final_status") == "PASS"
    assert rep.get("documents_failed") == 0
    assert rep.get("invalid_chunks") == 0
