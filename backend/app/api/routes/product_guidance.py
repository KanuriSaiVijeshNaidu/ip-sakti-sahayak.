"""
backend/app/api/routes/product_guidance.py
────────────────────────────────────────────
POST /api/product-guidance
Specialised endpoint for FSSAI / AYUSH product compliance queries.
Automatically forces domain=fssai and adds a product-compliance prefix
to the query before running the standard RAG pipeline.
"""
from __future__ import annotations

import time
import logging
from fastapi import APIRouter, HTTPException

from backend.app.models.schemas import (
    ProductGuidanceRequest, ProductGuidanceResponse, CitedPassage
)
from backend.app.retrieval.bm25_retriever import bm25_retriever
from backend.app.retrieval.vector_retriever import vector_retriever
from backend.app.retrieval.fusion import retrieve
from backend.app.retrieval.reranker import reranker
from backend.app.retrieval.validator import validate_evidence, build_llm_context
from backend.app.llm.factory import get_llm_adapter

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post(
    "/product-guidance",
    response_model=ProductGuidanceResponse,
    summary="FSSAI/AYUSH product compliance guidance",
)
async def product_guidance(request: ProductGuidanceRequest) -> ProductGuidanceResponse:
    """
    FSSAI / AYUSH product compliance guidance endpoint.

    Combines the product name and query, forces domain=fssai,
    and runs the full RAG pipeline to return compliance guidance
    with exact regulatory citations.
    """
    t0 = time.perf_counter()

    product = (request.product_name or "").strip()
    query = (request.query or "").strip()

    if not query and not product:
        raise HTTPException(
            status_code=400, detail="Provide at least a product name or query."
        )

    # Enrich query with product context
    enriched_query = (
        f"FSSAI Ayurveda Aahara compliance for product '{product}': {query}"
        if product else
        f"FSSAI Ayurveda Aahara compliance: {query}"
    )

    # ── Ensure indexes ready ──────────────────────────────────────────────────
    if not bm25_retriever.is_built():
        await bm25_retriever.build()
    if not vector_retriever.is_built():
        await vector_retriever.build()
    if not reranker.is_built():
        reranker.build()

    # ── Retrieve — force domain=fssai ────────────────────────────────────────
    retrieval_result = await retrieve(
        query=enriched_query,
        domain="fssai",
        jurisdiction=request.jurisdiction or "IN",
        final_top_k=10,
    )
    fused = retrieval_result["fused_candidates"]
    reranked = reranker.rerank(enriched_query, fused, top_n=5)
    evidence = validate_evidence(
        query=enriched_query,
        candidates=reranked,
        max_citations=5,
        include_needs_review=True,  # more lenient for product guidance
    )

    # ── Generate guidance ─────────────────────────────────────────────────────
    context = build_llm_context(enriched_query, evidence)
    llm = get_llm_adapter()
    llm_response = await llm.generate(
        query=enriched_query,
        context=context,
        language=request.language or "en",
    )

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
        f"product-guidance | product={product!r} | "
        f"evidence={len(evidence)} latency={total_ms}ms"
    )

    return ProductGuidanceResponse(
        product_name=product,
        guidance=llm_response.answer,
        cited_passages=cited_passages,
        applicable_regulations=[ev.section_title for ev in evidence],
        model_used=llm_response.model_used,
        total_latency_ms=total_ms,
    )
