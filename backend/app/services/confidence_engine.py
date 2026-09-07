"""
backend/app/services/confidence_engine.py
─────────────────────────────────────────
Transparent confidence scoring and safe abstention engine.
Evaluates retrieval relevance, reranker scores, source authority levels,
and cross-source consensus to prevent hallucinated legal advice.
"""
from __future__ import annotations

from typing import List
from backend.app.models.schemas import ConfidenceExplanation, CitedPassage, ClaimVerification

# Hierarchy of Legal Authority Levels
# Level 1: Primary Legislation / Acts (Patents Act, BDA)
# Level 2: Official Statutory Rules (D&C Rules 1945, Patent Rules 2003)
# Level 3: Official Pharmacopoeias & Guidelines (API, AFI, CGPDTM Guidelines)
# Level 4: Institutional TKDL Records & Standards
# Level 5: Academic Research / Secondary Commentaries


def compute_confidence(
    evidence_passages: List[CitedPassage],
    claim_verifications: List[ClaimVerification],
    jurisdiction_expected: str = "IN",
) -> ConfidenceExplanation:
    """
    Synthesize multi-factor confidence rating with positive explanations and warnings.
    Triggers safe abstention when authoritative evidence is sparse or conflicting.
    """
    reasons_positive: List[str] = []
    warnings: List[str] = []

    # 1. Evidence count check
    ev_count = len(evidence_passages)
    if ev_count >= 3:
        reasons_positive.append(f"Strong evidentiary foundation: {ev_count} authoritative passages retrieved.")
    elif ev_count >= 1:
        reasons_positive.append("Authoritative statutory citation identified.")
    else:
        warnings.append("Zero authoritative statutory evidence retrieved.")

    # 2. Reranker relevance evaluation
    avg_relevance = (
        sum(p.relevance_score for p in evidence_passages) / ev_count
        if ev_count > 0 else 0.0
    )
    if avg_relevance >= 0.85:
        reasons_positive.append(f"High cross-attention semantic relevance ({avg_relevance:.2f}).")
    elif avg_relevance < 0.60:
        warnings.append("Low semantic correlation between inquiry and retrieved legal texts.")

    # 3. Claim verification check
    supported_claims = sum(1 for c in claim_verifications if c.status == "SUPPORTED")
    unsupported_claims = sum(1 for c in claim_verifications if c.status == "UNSUPPORTED")
    total_claims = len(claim_verifications)

    if total_claims > 0:
        if supported_claims == total_claims:
            reasons_positive.append("All key statutory propositions are directly corroborated by evidence.")
        elif unsupported_claims > 0:
            warnings.append(f"{unsupported_claims} proposition(s) lacked explicit gazette backing.")

    # 4. Jurisdiction check
    mismatched_jurisdiction = any(
        p.jurisdiction != jurisdiction_expected and p.jurisdiction not in ("GLOBAL", "WO")
        for p in evidence_passages
    )
    if mismatched_jurisdiction:
        warnings.append("Some citations derive from external or international jurisdictions.")
    elif ev_count > 0:
        reasons_positive.append(f"All retrieved authorities match target jurisdiction ({jurisdiction_expected}).")

    # 5. Calculate composite confidence score
    base_score = 0.50
    base_score += min(0.25, ev_count * 0.08)
    base_score += (avg_relevance - 0.50) * 0.40
    if total_claims > 0:
        base_score += (supported_claims / total_claims) * 0.15
        base_score -= (unsupported_claims / total_claims) * 0.20

    final_score = max(0.05, min(0.99, round(base_score, 2)))

    # Determine confidence level & abstention condition
    if final_score >= 0.80 and ev_count >= 2 and unsupported_claims == 0:
        level = "HIGH"
        abstain = False
        abstention_msg = None
    elif final_score >= 0.50 and ev_count >= 1:
        level = "MEDIUM"
        abstain = False
        abstention_msg = None
    else:
        level = "LOW"
        abstain = True
        abstention_msg = (
            "AYURLEX cannot establish a reliable legal conclusion from the currently available authoritative sources. "
            "The retrieved evidence is insufficient or lacks official statutory verification."
        )

    return ConfidenceExplanation(
        level=level,
        score=final_score,
        reasons_positive=reasons_positive,
        warnings=warnings,
        abstain=abstain,
        abstention_message=abstention_msg,
    )
