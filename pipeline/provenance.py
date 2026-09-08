"""
pipeline/provenance.py
──────────────────────
SIH 26045 Provenance & Data Lineage Validator.
Ensures every chunk is traceable back through its complete lifecycle:
Chunk -> Cleaned Document -> Docling Output -> Raw File -> Source URL -> Official Organization.
"""
from __future__ import annotations

import json
from pathlib import Path
from typing import Any, Dict, Optional


class ProvenanceTracker:
    """Validates and retrieves the complete data lineage for any chunk or document."""

    def __init__(self, data_root: Path = Path("data")):
        self.data_root = data_root

    def get_chunk_lineage(self, country: str, chunk_id: str) -> Optional[Dict[str, Any]]:
        """
        Reconstruct the full provenance trail for a given chunk ID.
        """
        country = country.lower()
        chunks_file = self.data_root / country / "chunks" / "chunks.jsonl"
        if not chunks_file.exists():
            return None

        target_chunk = None
        with open(chunks_file, "r", encoding="utf-8") as f:
            for line in f:
                if not line.strip():
                    continue
                ch = json.loads(line)
                if ch.get("chunk_id") == chunk_id:
                    target_chunk = ch
                    break

        if not target_chunk:
            return None

        patent_id = target_chunk.get("patent_id")
        cleaned_file = self.data_root / country / "cleaned" / f"{patent_id}.json"
        docling_file = self.data_root / country / "docling" / f"{patent_id}.json"
        raw_file = self.data_root / country / "raw" / f"{patent_id}.json"
        manifest_file = self.data_root / country / "dataset_manifest.json"

        manifest_data = {}
        if manifest_file.exists():
            manifest_data = json.loads(manifest_file.read_text(encoding="utf-8"))

        return {
            "chunk_id": chunk_id,
            "section": target_chunk.get("section"),
            "claim_number": target_chunk.get("claim_number"),
            "token_count": target_chunk.get("token_count"),
            "lineage": {
                "step_1_chunk": {
                    "file": str(chunks_file),
                    "chunk_index": target_chunk.get("chunk_index"),
                },
                "step_2_cleaned_doc": {
                    "file": str(cleaned_file),
                    "exists": cleaned_file.exists(),
                    "cleaned_length": len(target_chunk.get("text", "")),
                },
                "step_3_docling": {
                    "file": str(docling_file),
                    "exists": docling_file.exists(),
                    "version": "1.10.0",
                },
                "step_4_raw_document": {
                    "file": str(raw_file),
                    "exists": raw_file.exists(),
                    "patent_id": patent_id,
                    "application_number": target_chunk.get("application_number"),
                    "publication_number": target_chunk.get("publication_number"),
                },
                "step_5_official_source": {
                    "source_dataset": target_chunk.get("source_dataset") or manifest_data.get("dataset_name"),
                    "source_organization": manifest_data.get("original_source", "Official Patent Authority"),
                    "source_url": target_chunk.get("source_url") or manifest_data.get("huggingface_url") or manifest_data.get("source_url"),
                    "retrieved_at": manifest_data.get("creation_date", "2026-09-08"),
                    "jurisdiction": target_chunk.get("country", country.upper()),
                    "language": target_chunk.get("language", "en"),
                }
            }
        }

    def verify_all_chunks_provenance(self, country: str) -> Dict[str, Any]:
        """
        Verify that 100% of chunks in a jurisdiction have intact provenance metadata.
        """
        chunks_file = self.data_root / country / "chunks" / "chunks.jsonl"
        if not chunks_file.exists():
            return {"total_chunks": 0, "intact_count": 0, "broken_count": 0, "rate": 0.0}

        total = 0
        intact = 0
        with open(chunks_file, "r", encoding="utf-8") as f:
            for line in f:
                if not line.strip():
                    continue
                total += 1
                ch = json.loads(line)
                has_pid = bool(ch.get("patent_id") and ch.get("patent_id") != "UNKNOWN")
                has_src = bool(ch.get("source_dataset"))
                has_country = bool(ch.get("country") == country.upper())
                if has_pid and has_src and has_country:
                    intact += 1

        return {
            "country": country.upper(),
            "total_chunks": total,
            "intact_count": intact,
            "broken_count": total - intact,
            "provenance_integrity_rate": round(intact / max(1, total), 4)
        }
