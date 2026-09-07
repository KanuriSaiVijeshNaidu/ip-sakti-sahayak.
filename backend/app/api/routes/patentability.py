"""
backend/app/api/routes/patentability.py
───────────────────────────────────────
POST /api/patentability/assess — Comprehensive patentability evaluation endpoint.
"""
from __future__ import annotations

import logging
from fastapi import APIRouter, HTTPException
from backend.app.models.schemas import PatentabilityRequest, PatentabilityResponse
from backend.app.services.patentability_engine import assess_patentability

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/patentability/assess", response_model=PatentabilityResponse, summary="Assess patentability and Section 3 risks")
async def assess_patentability_endpoint(req: PatentabilityRequest) -> PatentabilityResponse:
    if not req.invention_title:
        raise HTTPException(status_code=400, detail="Invention title cannot be empty.")
    try:
        res = assess_patentability(req)
        return res
    except Exception as e:
        logger.error(f"Patentability assessment error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))
