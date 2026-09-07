"""
backend/app/api/routes/convert.py
─────────────────────────────────
POST /api/convert/indian-to-international — Transition gateway endpoint for
converting Indian Intellectual Property to International filings (PCT, USPTO, EPO, DPMA).
"""
from __future__ import annotations

import logging
from fastapi import APIRouter, HTTPException
from backend.app.models.schemas import (
    IndianToInternationalRequest,
    IndianToInternationalResponse,
)
from backend.app.services.indian_to_international import convert_indian_to_international

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post(
    "/convert/indian-to-international",
    response_model=IndianToInternationalResponse,
    summary="Transition Indian IP to International Filings (PCT, USPTO, EPO)",
)
async def convert_indian_to_international_endpoint(
    req: IndianToInternationalRequest,
) -> IndianToInternationalResponse:
    if not req.indian_application_number:
        raise HTTPException(status_code=400, detail="Indian Application Number is required.")
    if not req.priority_date:
        raise HTTPException(status_code=400, detail="Indian Priority Date is required.")
    try:
        res = convert_indian_to_international(req)
        return res
    except Exception as e:
        logger.error(f"Indian to international conversion error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))
