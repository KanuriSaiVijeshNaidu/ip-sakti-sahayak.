"""
backend/app/api/routes/answer.py
────────────────────────────────
FastAPI route for Phase 6 RAG generation: POST /api/answer.
Integrates Phase 5 retrieval with CRAG evaluation, LLM generation,
and deterministic citation validation.
"""
from __future__ import annotations

import logging
from fastapi import APIRouter, HTTPException, status
from backend.app.models.rag_schemas import RAGAnswerRequest, RAGAnswerResponse
from backend.app.rag.pipeline import phase6_rag_pipeline
from backend.app.retrieval.jurisdiction_guard import JurisdictionViolationError

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post(
    "",
    response_model=RAGAnswerResponse,
    summary="Evidence-Grounded RAG Answer Generation + CRAG",
    description=(
        "Executes end-to-end evidence-grounded patent intelligence generation. "
        "Consumes Phase 5 hybrid retrieval, validates quality via CRAG, "
        "synthesizes an answer using the configured LLM, and enforces deterministic "
        "citation and claim-level grounding."
    ),
)
async def generate_answer(request: RAGAnswerRequest) -> RAGAnswerResponse:
    try:
        response = await phase6_rag_pipeline.generate_answer(request)
        return response
    except JurisdictionViolationError as jve:
        logger.error(f"Jurisdiction safety breach: {jve}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Jurisdiction safety violation: {str(jve)}",
        )
    except ValueError as ve:
        logger.warning(f"Validation error in RAG query: {ve}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(ve),
        )
    except Exception as exc:
        logger.exception(f"Internal error during RAG answer generation: {exc}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Answer generation error: {str(exc)}",
        )
