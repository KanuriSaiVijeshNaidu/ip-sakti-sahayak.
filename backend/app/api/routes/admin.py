"""
backend/app/api/routes/admin.py
─────────────────────────────────
GET/POST /api/admin/trace  — Retrieval trace for Admin Playground.
Returns FULL retrieval internals: BM25/vector scores, RRF, reranker scores.
This endpoint is NEVER exposed to the User UI.
"""
from __future__ import annotations

import logging
from fastapi import APIRouter

from backend.app.models.schemas import AdminTraceResponse, RetrievalCandidate
from backend.app.retrieval.bm25_retriever import bm25_retriever
from backend.app.retrieval.vector_retriever import vector_retriever
from backend.app.retrieval.fusion import retrieve
from backend.app.retrieval.reranker import reranker
from backend.app.retrieval.validator import validate_evidence

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post(
    "/admin/trace",
    response_model=AdminTraceResponse,
    summary="Admin retrieval trace (full scores)",
)
async def admin_trace(
    query: str,
    domain: str | None = None,
    jurisdiction: str | None = None,
    corpus_version: str = "v1",
) -> AdminTraceResponse:
    """
    Returns the full retrieval trace with all intermediate scores.
    Used by the Admin Retrieval Playground (Phase 7).
    """
    if not bm25_retriever.is_built():
        await bm25_retriever.build()
    if not vector_retriever.is_built():
        await vector_retriever.build()
    if not reranker.is_built():
        reranker.build()

    retrieval_result = await retrieve(
        query=query,
        domain=domain,
        jurisdiction=jurisdiction,
        final_top_k=20,
    )

    fused = retrieval_result["fused_candidates"]
    bm25_hits = retrieval_result["bm25_candidates"]
    vec_hits = retrieval_result["vector_candidates"]
    reranked = reranker.rerank(query, fused, top_n=10)
    evidence = validate_evidence(query, reranked, max_citations=10, include_needs_review=True)

    candidates = [
        RetrievalCandidate(
            chunk_id=r.chunk_id,
            text=r.text[:500],
            section_title=r.section_title,
            source_title=r.source_title,
            domain=r.domain,
            jurisdiction=r.jurisdiction,
            bm25_score=r.bm25_score,
            vector_score=r.vector_score,
            rrf_score=r.rrf_score,
            reranker_score=r.reranker_score,
            grounding_score=next(
                (e.grounding_score for e in evidence if e.chunk_id == r.chunk_id), 0.0
            ),
            corpus_version=r.corpus_version,
        )
        for r in reranked
    ]

    return AdminTraceResponse(
        query=query,
        domain=domain,
        jurisdiction=jurisdiction,
        corpus_version=corpus_version,
        bm25_hit_count=len(bm25_hits),
        vector_hit_count=len(vec_hits),
        fused_count=len(fused),
        reranked_count=len(reranked),
        validated_count=len(evidence),
        candidates=candidates,
    )
