"""
backend/app/retrieval/fusion.py
────────────────────────────────
Reciprocal Rank Fusion (RRF) + metadata filtering for IP-SAKTI.

RAG Pipeline steps covered here
────────────────────────────────
  [BM25 candidates] ─┐
                     ├──> Merge & Deduplicate ──> Metadata Filter ──> RRF ──> Top-K
  [Vector candidates]┘

RRF formula (Cormack et al. 2009):
    score(d) = sum_r [ 1 / (k + rank_r(d)) ]
where k=60 (settings.rrf_k) and rank_r is 1-indexed rank in result list r.

The fused list is the input to the Cross-Encoder reranker in Phase 4.
"""
from __future__ import annotations

import logging
from dataclasses import dataclass, field
from typing import List, Optional

from backend.app.core.config import settings
from backend.app.retrieval.bm25_retriever import BM25Candidate, bm25_retriever
from backend.app.retrieval.vector_retriever import VectorCandidate, vector_retriever

logger = logging.getLogger(__name__)


# ─── Unified candidate ────────────────────────────────────────────────────────

@dataclass
class FusedCandidate:
    """Single candidate after RRF merge — carries all scores for Admin UI trace."""
    chunk_id: str
    text: str
    domain: str
    jurisdiction: str
    section_title: str
    source_title: str
    corpus_version: str
    bm25_score: float = 0.0
    bm25_rank: Optional[int] = None
    vector_score: float = 0.0
    vector_rank: Optional[int] = None
    rrf_score: float = 0.0
    faiss_id: Optional[int] = None


# ─── Core RRF logic ───────────────────────────────────────────────────────────

def reciprocal_rank_fusion(
    bm25_results: list[BM25Candidate],
    vector_results: list[VectorCandidate],
    k: int | None = None,
) -> list[FusedCandidate]:
    """
    Merge BM25 and vector ranked lists using Reciprocal Rank Fusion.

    Parameters
    ----------
    bm25_results   : Ranked BM25 candidates (index 0 = best).
    vector_results : Ranked vector candidates (index 0 = best).
    k              : RRF constant (default: settings.rrf_k = 60).

    Returns
    -------
    Deduplicated list of FusedCandidate, sorted by rrf_score descending.
    """
    k = k if k is not None else settings.rrf_k
    fused: dict[str, FusedCandidate] = {}

    # ── BM25 contributions ────────────────────────────────────────────────────
    for rank, candidate in enumerate(bm25_results, start=1):
        cid = candidate.chunk_id
        rrf_contrib = 1.0 / (k + rank)
        if cid not in fused:
            fused[cid] = FusedCandidate(
                chunk_id=cid,
                text=candidate.text,
                domain=candidate.domain,
                jurisdiction=candidate.jurisdiction,
                section_title=candidate.section_title,
                source_title=candidate.source_title,
                corpus_version=candidate.corpus_version,
                faiss_id=candidate.faiss_id,
            )
        fused[cid].bm25_score = candidate.score
        fused[cid].bm25_rank = rank
        fused[cid].rrf_score += rrf_contrib

    # ── Vector contributions ──────────────────────────────────────────────────
    for rank, candidate in enumerate(vector_results, start=1):
        cid = candidate.chunk_id
        rrf_contrib = 1.0 / (k + rank)
        if cid not in fused:
            fused[cid] = FusedCandidate(
                chunk_id=cid,
                text=candidate.text,
                domain=candidate.domain,
                jurisdiction=candidate.jurisdiction,
                section_title=candidate.section_title,
                source_title=candidate.source_title,
                corpus_version=candidate.corpus_version,
                faiss_id=candidate.faiss_id,
            )
        fused[cid].vector_score = candidate.score
        fused[cid].vector_rank = rank
        fused[cid].rrf_score += rrf_contrib

    result = sorted(fused.values(), key=lambda c: c.rrf_score, reverse=True)
    return result


def metadata_filter(
    candidates: list[FusedCandidate],
    domain: str | None = None,
    jurisdiction: str | None = None,
) -> list[FusedCandidate]:
    """
    Hard filter: remove candidates that do not match domain/jurisdiction.
    'auto' and None mean no filtering on that dimension.
    """
    filtered = []
    for c in candidates:
        if domain and domain not in ("auto", "unknown") and c.domain != domain:
            continue
        if jurisdiction and jurisdiction not in ("auto", "GLOBAL") and c.jurisdiction != jurisdiction:
            continue
        filtered.append(c)

    if len(filtered) < len(candidates):
        logger.debug(
            f"Metadata filter: {len(candidates)} → {len(filtered)} "
            f"(domain={domain}, jurisdiction={jurisdiction})"
        )
    return filtered


# ─── In-memory LRU cache for retrieval ─────────────────────────────────────────
_RETRIEVAL_CACHE: dict = {}
_MAX_CACHE_SIZE = 256

async def retrieve(
    query: str,
    domain: str | None = None,
    jurisdiction: str | None = None,
    bm25_top_k: int | None = None,
    vector_top_k: int | None = None,
    final_top_k: int | None = None,
    rrf_k: int | None = None,
) -> dict:
    """
    Full Phase 3 retrieval pipeline with caching:
      Query -> Cache Check -> BM25 + Vector (parallel) -> Merge -> Metadata Filter -> RRF -> Top-K
    """
    cache_key = (query.strip().lower(), domain or "", jurisdiction or "", final_top_k or 0)
    if cache_key in _RETRIEVAL_CACHE:
        logger.debug(f"Retrieval cache HIT for: '{query[:50]}'")
        cached = _RETRIEVAL_CACHE[cache_key]
        return {
            "bm25_candidates": list(cached["bm25_candidates"]),
            "vector_candidates": list(cached["vector_candidates"]),
            "fused_candidates": list(cached["fused_candidates"]),
        }

    bm25_k = bm25_top_k or settings.bm25_top_k
    vec_k = vector_top_k or settings.vector_top_k
    final_k = final_top_k or settings.final_top_k

    # ── Parallel retrieval ────────────────────────────────────────────────────
    import asyncio
    import concurrent.futures

    # BM25 is synchronous (CPU-bound in-memory)
    loop = asyncio.get_event_loop()
    with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
        bm25_future = loop.run_in_executor(
            pool,
            lambda: bm25_retriever.search(query, bm25_k, domain, jurisdiction)
        )
        vector_future = loop.run_in_executor(
            pool,
            lambda: vector_retriever.search(query, vec_k, domain, jurisdiction)
        )
        bm25_results, vector_results = await asyncio.gather(bm25_future, vector_future)

    logger.debug(
        f"BM25: {len(bm25_results)} hits | Vector: {len(vector_results)} hits | "
        f"query='{query[:60]}'"
    )

    # ── RRF fusion ────────────────────────────────────────────────────────────
    fused = reciprocal_rank_fusion(bm25_results, vector_results, k=rrf_k)

    # ── Metadata filter (post-fusion for recall, pre-reranker for precision) ──
    fused = metadata_filter(fused, domain, jurisdiction)

    # ── Top-K cut ─────────────────────────────────────────────────────────────
    fused = fused[:final_k]

    result = {
        "bm25_candidates": bm25_results,
        "vector_candidates": vector_results,
        "fused_candidates": fused,
    }

    if len(_RETRIEVAL_CACHE) >= _MAX_CACHE_SIZE:
        _RETRIEVAL_CACHE.pop(next(iter(_RETRIEVAL_CACHE)))
    _RETRIEVAL_CACHE[cache_key] = result

    return result
