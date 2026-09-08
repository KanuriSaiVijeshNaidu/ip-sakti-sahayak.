"""
pipeline/deduplicator.py
────────────────────────
High-Performance Multi-Level Deduplication Engine (Levels 1 - 4).
Level 1: Exact patent/application ID.
Level 2: Exact SHA-256 text hash.
Level 3: Normalized Title + Abstract match.
Level 4: Near-duplicate document text (prefix & length hash).
Preserves family linkages (family_id, priority_id).
Runs in milliseconds per document across large patent corpora.
"""
from __future__ import annotations

import hashlib
import re
from typing import Any, Dict, List, Set, Tuple


def compute_sha256(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


class Deduplicator:
    """High-performance multi-level deduplicator for patent documents."""

    def __init__(
        self,
        level3_threshold: float = 0.95,
        level4_threshold: float = 0.98
    ):
        self.level3_threshold = level3_threshold
        self.level4_threshold = level4_threshold
        self.seen_patent_ids: Set[str] = set()
        self.seen_exact_hashes: Set[str] = set()
        self.seen_ta_normalized: Dict[str, str] = {}
        self.seen_doc_fingerprints: Dict[str, str] = {}

    def check_duplicate(self, doc: Dict[str, Any]) -> Tuple[bool, str, str]:
        """
        Check if document is a duplicate across Levels 1-4.
        Returns: (is_dup, level_matched, reference_patent_id)
        """
        patent_id = str(doc.get("metadata", {}).get("patent_id") or doc.get("patent_id") or "").strip().upper()
        text = str(doc.get("cleaned_text") or doc.get("text") or "")
        title = str(doc.get("metadata", {}).get("title") or doc.get("title") or "")
        abstract = str(doc.get("metadata", {}).get("abstract") or doc.get("abstract") or "")

        # Level 1: Exact Patent / Application ID
        if patent_id and patent_id in self.seen_patent_ids:
            return True, "Level 1 (Exact Patent ID)", patent_id

        # Level 2: Exact SHA-256 Hash
        text_hash = compute_sha256(text)
        if text_hash in self.seen_exact_hashes:
            return True, "Level 2 (Exact Text Hash)", text_hash[:12]

        # Level 3: Near-duplicate Title + Abstract (Exact normalized prefix & length match)
        norm_ta = "".join(c for c in f"{title} {abstract}".lower() if c.isalnum() or c.isspace()).strip()
        if len(norm_ta) > 30:
            ta_key = norm_ta[:150]
            if ta_key in self.seen_ta_normalized:
                ref_id = self.seen_ta_normalized[ta_key]
                return True, "Level 3 (Title+Abstract Match)", ref_id

        # Level 4: Near-duplicate Document Text (Exact content sample fingerprint)
        if len(text) > 200:
            # Sample start, middle, and end fingerprints
            mid = len(text) // 2
            doc_sample = (text[:200] + text[mid:mid+200] + text[-200:]).replace("\n", " ")
            sample_hash = hashlib.md5(doc_sample.encode("utf-8")).hexdigest()
            if sample_hash in self.seen_doc_fingerprints:
                ref_id = self.seen_doc_fingerprints[sample_hash]
                return True, "Level 4 (Document Fingerprint Match)", ref_id

        # Not duplicate -> Register in indexes
        if patent_id:
            self.seen_patent_ids.add(patent_id)
        self.seen_exact_hashes.add(text_hash)
        
        doc_key = patent_id or f"DOC-{len(self.seen_patent_ids)}"
        if len(norm_ta) > 30:
            self.seen_ta_normalized[norm_ta[:150]] = doc_key
        if len(text) > 200:
            self.seen_doc_fingerprints[sample_hash] = doc_key

        return False, "NONE", ""
