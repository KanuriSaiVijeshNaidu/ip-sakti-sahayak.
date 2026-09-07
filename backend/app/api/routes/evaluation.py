"""
backend/app/api/routes/evaluation.py
────────────────────────────────────
GET /api/evaluation/metrics — Benchmark evaluation and telemetry metrics endpoint.
"""
from __future__ import annotations

import logging
from typing import Any, Dict
from fastapi import APIRouter, Query
from backend.app.services.evaluation import run_benchmark_evaluation

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get("/evaluation/metrics", response_model=Dict[str, Any], summary="Get system evaluation benchmark metrics")
async def get_evaluation_metrics(jurisdiction: str = Query("ALL", description="Filter by jurisdiction: ALL, IN, US, EP, WO")):
    try:
        metrics = run_benchmark_evaluation(jurisdiction_filter=jurisdiction.upper())
        return metrics
    except Exception as e:
        logger.error(f"Evaluation metrics error: {e}", exc_info=True)
        return {"status": "error", "message": str(e)}
