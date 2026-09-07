"""
backend/app/services/evidence_verifier.py
─────────────────────────────────────────
Evidence verification and claim entailment layer.
Validates generated legal statements against retrieved authoritative passages.
Assigns SUPPORTED, PARTIALLY_SUPPORTED, or UNSUPPORTED statuses.
"""
from __future__ import annotations

import re
from typing import List, Tuple
from backend.app.models.schemas import ClaimVerification, CitedPassage, EvidenceSupportStatus


def verify_claims_against_evidence(
    claims: List[str],
    evidence_passages: List[CitedPassage]
) -> List[ClaimVerification]:
    """
    Verify each legal claim against the retrieved authoritative passages.
    Returns structured verification results with provenance.
    """
    verifications: List[ClaimVerification] = []

    for claim in claims:
        claim_clean = claim.strip()
        if not claim_clean:
            continue

        best_passage: CitedPassage | None = None
        best_overlap_score = 0.0

        # Tokenize claim keywords, filtering generic stopwords
        STOPWORDS = {"section", "patent", "patents", "under", "which", "shall", "requires", "thereof", "known", "other", "about"}
        raw_words = set(re.findall(r"\b[a-zA-Z0-9_-]{3,}\b", claim_clean.lower()))
        claim_words = {w for w in raw_words if w not in STOPWORDS}
        if not claim_words:
            claim_words = raw_words

        for passage in evidence_passages:
            passage_text = passage.passage_text.lower()
            overlap_count = sum(1 for w in claim_words if w in passage_text)
            overlap_ratio = overlap_count / max(len(claim_words), 1)

            if overlap_ratio > best_overlap_score:
                best_overlap_score = overlap_ratio
                best_passage = passage

        # Entailment classification thresholds
        if best_overlap_score >= 0.40:
            status: EvidenceSupportStatus = "SUPPORTED"
            confidence = min(0.99, round(0.70 + best_overlap_score * 0.3, 2))
        elif best_overlap_score >= 0.20:
            status = "PARTIALLY_SUPPORTED"
            confidence = min(0.75, round(0.50 + best_overlap_score * 0.25, 2))
        else:
            status = "UNSUPPORTED"
            confidence = 0.20

        verifications.append(
            ClaimVerification(
                claim_text=claim_clean,
                status=status,
                supporting_passage=best_passage.passage_text[:250] + "..." if best_passage else None,
                source_title=best_passage.source_title if best_passage else "No Authoritative Gazette Corroboration",
                section=best_passage.section if best_passage else None,
                authority=None,
                confidence_score=confidence,
            )
        )

    return verifications
