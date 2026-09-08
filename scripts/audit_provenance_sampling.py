"""
scripts/audit_provenance_sampling.py
───────────────────────────────────
Performs random sampling provenance audit across all 5 jurisdictions
(India, Germany, WIPO, USA, Europe) to verify end-to-end traceability:
Chunk -> Cleaned Document -> Docling Parser Output -> Raw Document -> Official Registry URL & Organization.
Generates reports/provenance_audit_report.json and reports/provenance_audit_report.md.
"""
from __future__ import annotations

import json
import random
from pathlib import Path
from typing import Any, Dict, List

from pipeline.provenance import ProvenanceTracker


def run_provenance_sampling_audit() -> Dict[str, Any]:
    data_root = Path("data")
    reports_dir = Path("reports")
    reports_dir.mkdir(parents=True, exist_ok=True)

    tracker = ProvenanceTracker(data_root=data_root)
    jurisdictions = ["india", "germany", "wipo", "usa", "europe"]
    audit_results: Dict[str, Any] = {
        "date": "2026-09-08",
        "title": "SIH 26045 International Patent Provenance Random Sampling Audit",
        "sample_size_per_jurisdiction": 20,
        "jurisdiction_summary": {},
        "detailed_samples": {}
    }

    random.seed(42)  # For deterministic reproducibility

    for j in jurisdictions:
        summary = tracker.verify_all_chunks_provenance(j)
        chunks_file = data_root / j / "chunks" / "chunks.jsonl"
        chunks: List[Dict[str, Any]] = []

        if chunks_file.exists():
            with open(chunks_file, "r", encoding="utf-8") as f:
                for line in f:
                    if line.strip():
                        chunks.append(json.loads(line))

        sample_count = min(20, len(chunks))
        sampled_chunks = random.sample(chunks, sample_count) if chunks else []

        samples_lineage: List[Dict[str, Any]] = []
        intact_lineages = 0

        for ch in sampled_chunks:
            cid = ch.get("chunk_id")
            lin = tracker.get_chunk_lineage(j, cid)
            if lin:
                # Check whether raw and cleaned and docling files exist
                raw_exists = lin["lineage"]["step_4_raw_document"]["exists"]
                docling_exists = lin["lineage"]["step_3_docling"]["exists"]
                cleaned_exists = lin["lineage"]["step_2_cleaned_doc"]["exists"]
                src_url = lin["lineage"]["step_5_official_source"]["source_url"]

                is_intact = raw_exists and docling_exists and cleaned_exists and bool(src_url)
                if is_intact:
                    intact_lineages += 1

                samples_lineage.append({
                    "chunk_id": cid,
                    "patent_id": ch.get("patent_id"),
                    "section": ch.get("section"),
                    "claim_number": ch.get("claim_number"),
                    "token_count": ch.get("token_count"),
                    "raw_file_exists": raw_exists,
                    "docling_file_exists": docling_exists,
                    "cleaned_file_exists": cleaned_exists,
                    "source_url": src_url,
                    "source_organization": lin["lineage"]["step_5_official_source"]["source_organization"],
                    "lineage_intact": is_intact
                })

        audit_results["jurisdiction_summary"][j] = {
            "total_chunks_in_corpus": len(chunks),
            "sampled_chunks": sample_count,
            "intact_sampled_lineages": intact_lineages,
            "sample_integrity_rate": round(intact_lineages / max(1, sample_count), 4),
            "overall_integrity": summary
        }
        audit_results["detailed_samples"][j] = samples_lineage

    # Write JSON report
    out_json = reports_dir / "provenance_audit_report.json"
    out_json.write_text(json.dumps(audit_results, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"Saved: {out_json}")

    # Write Markdown report
    md_lines = [
        "# SIH 26045 — International Patent Provenance Random Sampling Audit Report",
        "",
        "**Date**: 2026-09-08 | **Auditor**: Pipeline Provenance Subsystem (`pipeline/provenance.py`)",
        "**Integrity Requirement**: Every chunk must trace back 100% to its cleaned doc, Docling schema, raw specification, and authoritative registry URL.",
        "",
        "## 1. Jurisdiction Audit Summary Table",
        "",
        "| Jurisdiction | Total Chunks | Sample Count | Lineage Intact | Sample Integrity Rate | Overall Integrity Rate | Lineage Status |",
        "| :--- | :--- | :--- | :--- | :--- | :--- | :--- |"
    ]

    for j in jurisdictions:
        s = audit_results["jurisdiction_summary"][j]
        status = "100% VERIFIED" if s["sample_integrity_rate"] == 1.0 else "DEFECTS DETECTED"
        md_lines.append(
            f"| **{j.upper()}** | {s['total_chunks_in_corpus']:,} | {s['sampled_chunks']} | "
            f"{s['intact_sampled_lineages']} / {s['sampled_chunks']} | "
            f"{s['sample_integrity_rate']*100:.1f}% | "
            f"{s['overall_integrity']['provenance_integrity_rate']*100:.1f}% | "
            f"**{status}** |"
        )

    md_lines.extend([
        "",
        "## 2. Sample Traceability Audit (Excerpts)",
        ""
    ])

    for j in jurisdictions:
        md_lines.append(f"### {j.upper()} Random Samples")
        samples = audit_results["detailed_samples"][j][:5]
        md_lines.append("| Chunk ID | Patent ID | Section | Raw File | Docling | Cleaned | Source Org / Registry URL |")
        md_lines.append("| :--- | :--- | :--- | :---: | :---: | :---: | :--- |")
        for sm in samples:
            raw_icon = "PASS" if sm["raw_file_exists"] else "FAIL"
            doc_icon = "PASS" if sm["docling_file_exists"] else "FAIL"
            cln_icon = "PASS" if sm["cleaned_file_exists"] else "FAIL"
            md_lines.append(
                f"| `{sm['chunk_id']}` | `{sm['patent_id']}` | {sm['section']} | {raw_icon} | {doc_icon} | {cln_icon} | [{sm['source_organization'][:30]}]({sm['source_url']}) |"
            )
        md_lines.append("")

    out_md = reports_dir / "provenance_audit_report.md"
    out_md.write_text("\n".join(md_lines), encoding="utf-8")
    print(f"Saved: {out_md}")

    return audit_results


if __name__ == "__main__":
    run_provenance_sampling_audit()
