"""
backend/app/retrieval/jurisdiction_guard.py
───────────────────────────────────────────
Strict jurisdiction safety enforcement module.
JURISDICTION IS A HARD LOGIC / SECURITY CONSTRAINT.
Validates candidate records after every stage (Dense, Lexical, RRF, Reranking).
Aborts execution immediately and logs an error if contamination or forbidden
jurisdictions (IN, DE) are detected.
"""
from __future__ import annotations

import logging
from typing import List, Set
from backend.app.retrieval.config import retrieval_config

logger = logging.getLogger(__name__)


class JurisdictionViolationError(Exception):
    """Raised when jurisdiction isolation is breached."""
    pass


def verify_jurisdiction_safety(
    candidates: List[dict],
    requested_jurisdictions: List[str],
    stage_name: str = "retrieval",
) -> None:
    """
    Enforces that:
    1. No candidate has a forbidden jurisdiction (IN or DE).
    2. All candidate jurisdictions are a subset of requested_jurisdictions.
    3. For single jurisdiction requests, 100% of candidates match that exact jurisdiction.
    """
    allowed_set: Set[str] = set(requested_jurisdictions)
    forbidden_set: Set[str] = set(retrieval_config.forbidden_jurisdictions)

    for cand in candidates:
        jur = cand.get("jurisdiction")
        cid = cand.get("chunk_id", "unknown")

        # Check 1: Forbidden jurisdictions
        if jur in forbidden_set:
            msg = (
                f"CRITICAL SAFETY VIOLATION at {stage_name}: Forbidden jurisdiction '{jur}' "
                f"detected in chunk {cid}. Active jurisdictions are only US, EP, WO, JP."
            )
            logger.error(msg)
            raise JurisdictionViolationError(msg)

        # Check 2: Contamination beyond requested jurisdictions
        if jur not in allowed_set:
            msg = (
                f"JURISDICTION CONTAMINATION at {stage_name}: Chunk {cid} has jurisdiction '{jur}', "
                f"which was NOT in requested jurisdictions {list(allowed_set)}."
            )
            logger.error(msg)
            raise JurisdictionViolationError(msg)
