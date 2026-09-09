"""
backend/app/retrieval/evidence_selector.py
──────────────────────────────────────────
Selects final evidence candidates and formats them into standardized EvidenceResult objects.
Applies diversification across sections and documents while preserving top-scoring evidence.
"""
from __future__ import annotations

from typing import List, Dict, Set
from backend.app.models.retrieval_schemas import EvidenceResult


def select_diverse_evidence(
    candidates: List[dict],
    final_top_k: int = 10,
    max_per_document: int = 3,
) -> List[EvidenceResult]:
    """
    Selects top candidates balancing relevance and diversity.
    Ensures not all chunks come from a single small patent section
    while retaining the highest scoring items.
    """
    selected: List[dict] = []
    doc_counts: Dict[str, int] = {}
    deferred: List[dict] = []

    for c in candidates:
        doc_id = c.get("document_id", "unknown")
        count = doc_counts.get(doc_id, 0)
        if count < max_per_document:
            selected.append(c)
            doc_counts[doc_id] = count + 1
            if len(selected) >= final_top_k:
                break
        else:
            deferred.append(c)

    # If we haven't reached final_top_k yet, fill with highest remaining candidates
    if len(selected) < final_top_k and deferred:
        for c in deferred:
            selected.append(c)
            if len(selected) >= final_top_k:
                break

    # Build standardized EvidenceResult objects
    results: List[EvidenceResult] = []
    for rank, c in enumerate(selected, start=1):
        item = EvidenceResult(
            chunk_id=c["chunk_id"],
            document_id=c["document_id"],
            publication_number=c["publication_number"],
            jurisdiction=c["jurisdiction"],
            language=c.get("language", "en"),
            section=c.get("section", ""),
            title=c.get("title", ""),
            text=c.get("text", ""),
            source=c.get("source", ""),
            source_url=c.get("source_url"),
            filing_date=c.get("filing_date"),
            publication_date=c.get("publication_date"),
            dense_score=c.get("dense_score"),
            dense_rank=c.get("dense_rank"),
            lexical_score=c.get("lexical_score"),
            lexical_rank=c.get("lexical_rank"),
            rrf_score=c.get("rrf_score"),
            rerank_score=c.get("rerank_score"),
            authority_tier=c.get("authority_tier", 1),
            domain=c.get("domain"),
            subdomain=c.get("subdomain"),
            final_rank=rank,
        )
        results.append(item)

    return results
