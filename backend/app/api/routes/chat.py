"""
backend/app/api/routes/chat.py
────────────────────────────────
POST /api/chat  — Full RAG pipeline endpoint.

Request  → ChatRequest  (query, domain, jurisdiction, language, corpus_version)
Response → ChatResponse (answer, cited_passages, trace metadata)

Pipeline stages (all wired here):
  1. BM25 + Vector retrieval (parallel)
  2. RRF fusion + metadata filter
  3. Cross-encoder reranker
  4. Evidence validator  → CitedEvidence[]
  5. LLM generation     → answer string
  6. Return ChatResponse (user-facing, NO raw chunk IDs or embeddings)
"""
from __future__ import annotations

import time
import logging
from fastapi import APIRouter, Depends, HTTPException

from backend.app.models.schemas import (
    ChatRequest, ChatResponse, CitedPassage
)
from backend.app.retrieval.bm25_retriever import bm25_retriever
from backend.app.retrieval.vector_retriever import vector_retriever
from backend.app.retrieval.fusion import retrieve
from backend.app.retrieval.reranker import reranker
from backend.app.retrieval.validator import validate_evidence, build_llm_context
from backend.app.llm.factory import get_llm_adapter

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/chat", response_model=ChatResponse, summary="RAG chat endpoint")
async def chat(request: ChatRequest) -> ChatResponse:
    """
    Main conversational RAG endpoint.

    Runs the full retrieval pipeline (BM25 + BGE-M3 → RRF → Cross-encoder
    → Evidence validation) then calls the configured LLM to synthesise
    a source-cited answer.
    """
    t0 = time.perf_counter()
    query = request.query.strip()

    if not query:
        raise HTTPException(status_code=400, detail="Query cannot be empty.")

    # ── 1. Ensure indexes are ready ───────────────────────────────────────────
    if not bm25_retriever.is_built():
        logger.warning("BM25 not built at request time — building now.")
        await bm25_retriever.build()
    if not vector_retriever.is_built():
        logger.warning("Vector index not built at request time — building now.")
        await vector_retriever.build()
    if not reranker.is_built():
        reranker.build()

    # ── 2. Retrieve (BM25 + Vector → RRF) ────────────────────────────────────
    retrieval_result = await retrieve(
        query=query,
        domain=request.domain,
        jurisdiction=request.jurisdiction,
        final_top_k=10,
    )
    fused = retrieval_result["fused_candidates"]

    # ── 3. Rerank ─────────────────────────────────────────────────────────────
    reranked = reranker.rerank(query, fused, top_n=5)

    # ── 4. Validate evidence ──────────────────────────────────────────────────
    evidence = validate_evidence(
        query=query,
        candidates=reranked,
        max_citations=5,
        include_needs_review=True,   # show needs_review too; UI filters on grounding_score
    )

    # ── 5. Build LLM context + generate answer ────────────────────────────────
    context = build_llm_context(query, evidence)
    llm = get_llm_adapter()
    llm_response = await llm.generate(
        query=query,
        context=context,
        language=request.language,
    )

    # ── 6. Build user-facing cited passages (no internal scores) ──────────────
    cited_passages = [
        CitedPassage(
            passage_text=ev.passage_text,
            source_title=ev.source_title or ev.section_title,
            source_url=ev.source_url,
            section=ev.section_title,
            page_number=None,
            domain=ev.domain,
            jurisdiction=ev.jurisdiction,
            relevance_score=round(ev.grounding_score, 3),
        )
        for ev in evidence
    ]

    total_ms = int((time.perf_counter() - t0) * 1000)
    logger.info(
        f"chat | query={query[:60]!r} | "
        f"fused={len(fused)} reranked={len(reranked)} "
        f"evidence={len(evidence)} latency={total_ms}ms"
    )

    return ChatResponse(
        answer=llm_response.answer,
        cited_passages=cited_passages,
        model_used=llm_response.model_used,
        retrieval_latency_ms=total_ms - llm_response.latency_ms,
        llm_latency_ms=llm_response.latency_ms,
        total_latency_ms=total_ms,
        corpus_version=request.corpus_version or "v1",
    )
