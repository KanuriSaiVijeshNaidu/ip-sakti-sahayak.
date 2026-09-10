"""
backend/app/api/routes/retrieval.py
───────────────────────────────────
FastAPI router for Phase 5 Intelligent Retrieval Layer.
Endpoint: POST /api/retrieval/search
Returns structured query analysis, routing rationale, candidate counts,
and ranked evidence without generating final LLM answers.
"""
from __future__ import annotations

import logging
from fastapi import APIRouter, HTTPException, status
from backend.app.models.retrieval_schemas import (
    RetrievalSearchRequest,
    RetrievalSearchResponse,
    RetrievalDebugRequest,
    RetrievalDebugResponse,
)
from backend.app.retrieval.production_pipeline import production_retrieval_pipeline
from backend.app.retrieval.jurisdiction_guard import JurisdictionViolationError

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post(
    "/debug",
    response_model=RetrievalDebugResponse,
    summary="Developer Retrieval Debug Inspector Tracing",
    description=(
        "Executes end-to-end retrieval inspection returning detected script, code-switching tokens, "
        "5 query expansions, dense/lexical/fused/reranked candidate pools with scores, and the "
        "Evidence Sufficiency Gate verdict."
    ),
)
async def debug_retrieval(request: RetrievalDebugRequest) -> RetrievalDebugResponse:
    try:
        response = production_retrieval_pipeline.debug_search(request)
        return response
    except JurisdictionViolationError as jve:
        logger.error(f"Jurisdiction safety violation: {jve}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Jurisdiction safety violation: {str(jve)}",
        )
    except ValueError as ve:
        logger.warning(f"Invalid query or jurisdiction: {ve}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(ve),
        )
    except Exception as exc:
        logger.exception(f"Internal retrieval debug error: {exc}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Retrieval debug error: {str(exc)}",
        )



@router.post(
    "/search",
    response_model=RetrievalSearchResponse,
    summary="Intelligent Query Routing + Hybrid Patent Retrieval",
    description=(
        "Executes language detection, entity/intent extraction, safe jurisdiction routing, "
        "dual-stream dense (BGE-M3 + FAISS) and lexical (BM25) search, Reciprocal Rank Fusion, "
        "and multilingual cross-encoder reranking. Stops before answer generation."
    ),
)
async def search_retrieval(request: RetrievalSearchRequest) -> RetrievalSearchResponse:
    try:
        response = production_retrieval_pipeline.search(request)
        return response
    except JurisdictionViolationError as jve:
        logger.error(f"Jurisdiction safety violation: {jve}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Jurisdiction safety violation: {str(jve)}",
        )
    except ValueError as ve:
        logger.warning(f"Invalid query or jurisdiction: {ve}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(ve),
        )
    except Exception as exc:
        logger.exception(f"Internal retrieval error: {exc}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Retrieval error: {str(exc)}",
        )
