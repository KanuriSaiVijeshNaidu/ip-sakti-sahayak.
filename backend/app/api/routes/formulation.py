"""
backend/app/api/routes/formulation.py
─────────────────────────────────────
POST /api/formulation/analyze — Formulation analyzer endpoint.
"""
from __future__ import annotations

import logging
from fastapi import APIRouter, HTTPException
from backend.app.models.schemas import FormulationAnalysisRequest, FormulationAnalysisResponse
from backend.app.services.formulation_analyzer import analyze_formulation

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/formulation/analyze", response_model=FormulationAnalysisResponse, summary="Analyze formulation components")
async def analyze_formulation_endpoint(req: FormulationAnalysisRequest) -> FormulationAnalysisResponse:
    if not req.ingredients and not req.intended_use:
        raise HTTPException(status_code=400, detail="Must provide at least one ingredient or intended use.")
    try:
        res = analyze_formulation(req)
        return res
    except Exception as e:
        logger.error(f"Formulation analysis error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))
