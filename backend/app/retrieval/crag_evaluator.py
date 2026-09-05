"""
backend/app/retrieval/crag_evaluator.py
───────────────────────────────────────
Corrective RAG (CRAG) Evaluator for IP-SAKTI.
Evaluates the quality and confidence of retrieved statutory passages before
synthesis, categorising into CORRECT, AMBIGUOUS, or INCORRECT (Zero-Hallucination).
"""
from __future__ import annotations

import logging
from dataclasses import dataclass
from enum import Enum
from typing import List

from backend.app.retrieval.validator import CitedEvidence

logger = logging.getLogger(__name__)


class CRAGGrade(str, Enum):
    CORRECT = "correct"         # High relevance, strong statutory grounding
    AMBIGUOUS = "ambiguous"     # Marginal relevance, requires cautious synthesis
    INCORRECT = "incorrect"     # Irrelevant or out-of-domain, triggers strict fallback


@dataclass
class CRAGAssessment:
    grade: CRAGGrade
    confidence_score: float
    reason: str
    filtered_evidence: List[CitedEvidence]


def evaluate_retrieval_confidence(
    query: str,
    evidence: List[CitedEvidence],
    min_correct_threshold: float = 0.35,
    min_ambiguous_threshold: float = 0.15,
) -> CRAGAssessment:
    """
    Evaluates retrieval evidence quality against CRAG criteria.
    """
    if not evidence:
        return CRAGAssessment(
            grade=CRAGGrade.INCORRECT,
            confidence_score=0.0,
            reason="Zero statutory passages retrieved.",
            filtered_evidence=[],
        )

    # Average grounding score of top 3 evidence items
    top_scores = [ev.grounding_score for ev in evidence[:3]]
    avg_score = sum(top_scores) / len(top_scores)
    max_score = max(ev.grounding_score for ev in evidence)

    # Weighted confidence metric
    confidence = (0.7 * max_score) + (0.3 * avg_score)

    if confidence >= min_correct_threshold:
        grade = CRAGGrade.CORRECT
        reason = f"High statutory confidence ({confidence:.3f} >= {min_correct_threshold})"
        filtered = [ev for ev in evidence if ev.grounding_score >= min_ambiguous_threshold]
    elif confidence >= min_ambiguous_threshold:
        grade = CRAGGrade.AMBIGUOUS
        reason = f"Marginal statutory confidence ({confidence:.3f})"
        # Keep only the top 2 highest scoring items
        filtered = sorted(evidence, key=lambda x: x.grounding_score, reverse=True)[:2]
    else:
        grade = CRAGGrade.INCORRECT
        reason = f"Insufficient grounding confidence ({confidence:.3f} < {min_ambiguous_threshold})"
        filtered = []

    logger.debug(f"CRAG Evaluation: grade={grade.value}, confidence={confidence:.3f}, reason={reason}")
    return CRAGAssessment(
        grade=grade,
        confidence_score=round(confidence, 4),
        reason=reason,
        filtered_evidence=filtered,
    )
