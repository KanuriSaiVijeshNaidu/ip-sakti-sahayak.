"""
backend/app/api/routes/tk_risk.py
─────────────────────────────────
POST /api/tk-risk/assess — Traditional Knowledge and TKDL risk assessment endpoint.
"""
from __future__ import annotations

import logging
from fastapi import APIRouter, HTTPException
from backend.app.models.schemas import TKRiskRequest, TKRiskResponse
from backend.app.services.tk_risk_engine import assess_tk_risk

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/tk-risk/assess", response_model=TKRiskResponse, summary="Assess Traditional Knowledge / TKDL risk")
async def assess_tk_risk_endpoint(req: TKRiskRequest) -> TKRiskResponse:
    if not req.ingredients:
        raise HTTPException(status_code=400, detail="Ingredients list cannot be empty.")
    try:
        res = assess_tk_risk(req)
        return res
    except Exception as e:
        logger.error(f"TK risk error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))
