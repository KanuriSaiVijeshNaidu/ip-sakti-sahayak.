"""
backend/app/api/routes/decision.py
──────────────────────────────────
FastAPI route for Phase 7 Decision & Jurisdiction Reasoning Engine: POST /api/decision.
Consumes DecisionRequest, routes via Phase 7 Decision Pipeline, and returns
structured, deterministic DecisionResponse.
"""
from __future__ import annotations

import logging
from fastapi import APIRouter, HTTPException, status

from backend.app.models.decision_schemas import DecisionRequest, DecisionResponse
from backend.app.decision.pipeline import phase7_decision_pipeline
from backend.app.retrieval.jurisdiction_guard import JurisdictionViolationError

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post(
    "",
    response_model=DecisionResponse,
    summary="AYURLEX Phase 7 Decision & Jurisdiction Reasoning Engine",
    description=(
        "Executes deterministic decision support for cross-border IP commercialization, "
        "patent territoriality, regulatory classification, and freedom-to-operate questions. "
        "Executes a deterministic rule engine prior to grounded explanation generation."
    ),
)
async def evaluate_decision(request: DecisionRequest) -> DecisionResponse:
    """
    Evaluates commercialization and regulatory questions with pre-computed deterministic decision.
    """
    try:
        response = await phase7_decision_pipeline.execute(request)
        return response
    except JurisdictionViolationError as jve:
        logger.error(f"Jurisdiction safety breach in decision endpoint: {jve}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Jurisdiction safety violation: {str(jve)}",
        )
    except ValueError as ve:
        logger.warning(f"Validation error in decision request: {ve}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(ve),
        )
    except Exception as exc:
        logger.exception(f"Internal error during decision pipeline execution: {exc}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Decision engine error: {str(exc)}",
        )
