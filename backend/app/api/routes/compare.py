"""
backend/app/api/routes/compare.py
─────────────────────────────────
POST /api/compare/jurisdictions — Cross-jurisdiction comparative patentability endpoint.
"""
from __future__ import annotations

import logging
from fastapi import APIRouter, HTTPException
from backend.app.models.schemas import JurisdictionComparisonRequest, JurisdictionComparisonResponse
from backend.app.services.jurisdiction_engine import compare_jurisdictions

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/compare/jurisdictions", response_model=JurisdictionComparisonResponse, summary="Compare patentability across jurisdictions")
async def compare_jurisdictions_endpoint(req: JurisdictionComparisonRequest) -> JurisdictionComparisonResponse:
    if not req.invention_title:
        raise HTTPException(status_code=400, detail="Invention title cannot be empty.")
    try:
        res = compare_jurisdictions(req)
        return res
    except Exception as e:
        logger.error(f"Compare jurisdictions error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))
