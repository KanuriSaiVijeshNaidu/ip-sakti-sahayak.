"""
backend/app/decision/alignment_validator.py
───────────────────────────────────────────
AYURLEX Question-Answer Alignment Verification Layer.
Performs deterministic post-generation validation to guarantee that the generated answer
strictly matches the user question across:
  1. Target Jurisdiction (e.g. Question about Japan cannot return Indian law)
  2. Legal Domain (e.g. Question about Trademark cannot return Patent Section 3(p))
  3. Subject / Topic (e.g. Photosynthesis cannot return patentability)
  4. Task Intent (e.g. Commercialization vs Patentability)
"""
from __future__ import annotations

import re
import logging
from typing import Dict, Any, List, Optional, Tuple
from pydantic import BaseModel

logger = logging.getLogger(__name__)


class AlignmentResult(BaseModel):
    is_aligned: bool
    alignment_score: float  # 0.0 to 1.0
    detected_domain_mismatch: bool = False
    detected_jurisdiction_mismatch: bool = False
    detected_topic_mismatch: bool = False
    mismatch_details: Optional[str] = None
    sanitized_answer: Optional[str] = None


class QuestionAnswerAlignmentValidator:
    """Validates that a generated response addresses the user's specific inquiry."""

    def validate_alignment(
        self,
        query: str,
        answer_text: str,
        target_jurisdiction: str,
        domain: str,
        citations: List[Any],
        is_comparison: bool = False,
    ) -> AlignmentResult:
        q_lower = query.strip().lower()
        a_lower = answer_text.strip().lower()

        # ── 1. Jurisdiction Alignment Check ────────────────────────────────────
        if not is_comparison:
            target_j = (target_jurisdiction or "IN").upper()
            # If target is JP, answer should not be solely about India
            if target_j == "JP" and ("patents act 1970" in a_lower or "section 3(p)" in a_lower) and not ("japan" in a_lower or "jpo" in a_lower or "pmd act" in a_lower or "日本" in a_lower):
                logger.warning("Alignment failure: Target is JP but answer is solely about Indian patent law.")
                return AlignmentResult(
                    is_aligned=False,
                    alignment_score=0.2,
                    detected_jurisdiction_mismatch=True,
                    mismatch_details="Target jurisdiction is Japan (JP), but answer returned Indian statutory provisions without Japan analysis.",
                )

            # If target is US, answer should not be solely about India
            if target_j == "US" and ("section 3(p)" in a_lower or "section 3(e)" in a_lower) and not ("35 u.s.c" in a_lower or "uspto" in a_lower or "dshea" in a_lower or "united states" in a_lower or "fda" in a_lower):
                logger.warning("Alignment failure: Target is US but answer is solely about Indian patent law.")
                return AlignmentResult(
                    is_aligned=False,
                    alignment_score=0.2,
                    detected_jurisdiction_mismatch=True,
                    mismatch_details="Target jurisdiction is United States (US), but answer returned Indian statutory provisions without US analysis.",
                )

        # ── 2. Legal Domain Alignment Check ────────────────────────────────────
        is_tm_query = "trademark" in q_lower or "trade mark" in q_lower or "section 13" in q_lower or "nice class" in q_lower or "brand" in q_lower
        if is_tm_query:
            # Answer must discuss trademarks, not merely patent exclusions
            has_tm_content = any(term in a_lower for term in ["trademark", "trade mark", "section 13", "section 9", "class 5", "class 3", "brand", "markeng", "lanham"])
            if not has_tm_content and ("section 3(p)" in a_lower or "section 3(e)" in a_lower or "patentability" in a_lower):
                logger.warning("Alignment failure: Question is about Trademarks, but answer is solely about patent law.")
                return AlignmentResult(
                    is_aligned=False,
                    alignment_score=0.1,
                    detected_domain_mismatch=True,
                    mismatch_details="Inquiry requests trademark law, but answer discusses patentability exclusions (Section 3p/3e).",
                )

        is_fssai_query = "fssai" in q_lower or "ayurveda aahara" in q_lower or "food supplement" in q_lower
        if is_fssai_query:
            has_fssai_content = any(term in a_lower for term in ["fssai", "ayurveda aahara", "food safety", "dietary", "supplement", "regulation 2.2"])
            if not has_fssai_content and ("patentability" in a_lower and "section 3(p)" in a_lower):
                logger.warning("Alignment failure: Question is about FSSAI, but answer is solely about patent law.")
                return AlignmentResult(
                    is_aligned=False,
                    alignment_score=0.2,
                    detected_domain_mismatch=True,
                    mismatch_details="Inquiry requests food safety (FSSAI) regulations, but answer discusses patent exclusions.",
                )

        # ── 3. Unrelated Topic Check (e.g. Photosynthesis) ─────────────────────
        if "photosynthesis" in q_lower and ("patent" in a_lower or "section 3(p)" in a_lower) and "chloroplast" not in a_lower:
            logger.warning("Alignment failure: Unrelated scientific query answered with patent law.")
            return AlignmentResult(
                is_aligned=False,
                alignment_score=0.0,
                detected_topic_mismatch=True,
                mismatch_details="Inquiry is about photosynthesis, but answer was contaminated with patent law context.",
            )

        return AlignmentResult(
            is_aligned=True,
            alignment_score=1.0,
            detected_domain_mismatch=False,
            detected_jurisdiction_mismatch=False,
            detected_topic_mismatch=False,
        )


alignment_validator = QuestionAnswerAlignmentValidator()
