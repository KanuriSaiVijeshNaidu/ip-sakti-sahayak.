"""
pipeline/deduplicator.py
────────────────────────
Multi-Level Deduplication Engine (Levels 1 - 4).
Level 1: Exact patent/application ID.
Level 2: Exact SHA-256 text hash.
Level 3: Near-duplicate Title + Abstract (Jaccard similarity >= 0.95).
Level 4: Near-duplicate document text (similarity >= 0.98).
Preserves family linkages (family_id, priority_id).
"""
from __future__ import annotations

import hashlib
import re
from typing import Any, Dict, List, Set, Tuple


def compute_sha256(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def _get_shingle_set(text: str, k: int = 3) -> Set[str]:
    words = re.findall(r"\b\w+\b", text.lower())
    if not words:
        return set()
    if len(words) < k:
        return {" ".join(words)}
    return {" ".join(words[i:i+k]) for i in range(len(words) - k + 1)}


def jaccard_similarity(s1: Set[str], s2: Set[str]) -> float:
    if not s1 and not s2:
        return 1.0
    if not s1 or not s2:
        return 0.0
    return len(s1 & s2) / len(s1 | s2)


class Deduplicator:
    """Multi-level deduplicator for patent documents."""

    def __init__(
        self,
        level3_threshold: float = 0.95,
        level4_threshold: float = 0.98
    ):
        self.level3_threshold = level3_threshold
        self.level4_threshold = level4_threshold
        self.seen_patent_ids: Set[str] = set()
        self.seen_exact_hashes: Set[str] = set()
        self.seen_title_abstract_shingles: List[Tuple[str, Set[str]]] = []
        self.seen_doc_shingles: List[Tuple[str, Set[str]]] = []

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

        # Level 3: Near-duplicate Title + Abstract (Jaccard >= 0.95)
        ta_text = f"{title} {abstract}".strip()
        if len(ta_text) > 30:
            ta_shingles = _get_shingle_set(ta_text, k=3)
            for ref_id, ref_shingles in self.seen_title_abstract_shingles:
                sim = jaccard_similarity(ta_shingles, ref_shingles)
                if sim >= self.level3_threshold:
                    return True, f"Level 3 (Title+Abstract Similarity {sim:.3f})", ref_id

        # Level 4: Near-duplicate Document Text (Jaccard >= 0.98)
        if len(text) > 100:
            doc_shingles = _get_shingle_set(text, k=4)
            for ref_id, ref_shingles in self.seen_doc_shingles:
                sim = jaccard_similarity(doc_shingles, ref_shingles)
                if sim >= self.level4_threshold:
                    return True, f"Level 4 (Document Similarity {sim:.3f})", ref_id

        # Not duplicate -> Register in indexes
        if patent_id:
            self.seen_patent_ids.add(patent_id)
        self.seen_exact_hashes.add(text_hash)
        if len(ta_text) > 30:
            self.seen_title_abstract_shingles.append((patent_id, _get_shingle_set(ta_text, k=3)))
        if len(text) > 100:
            self.seen_doc_shingles.append((patent_id, _get_shingle_set(text, k=4)))

        return False, "NONE", ""
