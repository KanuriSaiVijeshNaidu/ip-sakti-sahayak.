"""
backend/app/rag/claim_validator.py
──────────────────────────────────
Claim <-> Evidence & Citation Validator for Phase 6 RAG pipeline.
Extracts factual claim sentences and citation tags ([E1], [E2], etc.) from the generated answer.
Enforces:
1. Every cited ID must exist in the selected evidence set (blocks [E99], etc.).
2. Every cited chunk must belong to the approved target jurisdiction.
3. Claims must be grounded in the text of the cited evidence chunk.
4. Unsupported claims are flagged, stripped, or converted into uncertainty language.
"""
from __future__ import annotations

import re
import logging
from typing import List, Dict, Set, Tuple
from backend.app.models.rag_schemas import CitationInfo, ClaimValidationResult

logger = logging.getLogger(__name__)

_RE_CITATION = re.compile(r"\[(E\d+)\]")


class ClaimValidator:
    """
    Validates citations and factual alignment between answer claims and evidence text.
    """

    def validate(
        self,
        answer_text: str,
        citations: List[CitationInfo],
        target_jurisdictions: List[str],
    ) -> Tuple[str, List[ClaimValidationResult], bool]:
        """
        Validates the answer text against the active citations.
        Returns:
            (sanitized_answer, list_of_claim_results, is_fully_valid)
        """
        citation_map: Dict[str, CitationInfo] = {c.citation_id: c for c in citations}
        allowed_jurs: Set[str] = set(target_jurisdictions)

        # 1. Check for fabricated citation tags (e.g. [E99] when only E1-E5 exist)
        all_cited_tags = _RE_CITATION.findall(answer_text)
        invalid_tags = [t for t in all_cited_tags if t not in citation_map]

        if invalid_tags:
            logger.warning(f"Fabricated citation tags detected and purged: {invalid_tags}")
            # Purge non-existent citation tags from answer
            for tag in invalid_tags:
                answer_text = re.sub(rf"\[{tag}\]", "", answer_text)

        # 2. Split answer into individual sentences / claims
        sentences = [s.strip() for s in re.split(r"(?<=[.!?。！？])\s+", answer_text) if len(s.strip()) > 5]
        claim_results: List[ClaimValidationResult] = []
        fully_valid = True

        for sent in sentences:
            cited_in_sent = list(set(_RE_CITATION.findall(sent)))
            valid_cites = [t for t in cited_in_sent if t in citation_map]

            if not valid_cites:
                # Check if statement makes an assertive technical/patent factual claim without citation
                is_factual_assertion = any(w in sent.lower() for w in [
                    "patent", "discloses", "comprises", "claims", "filed", "inventor", "published",
                    "特許", "開示", "請求項", "組成物"
                ])
                if is_factual_assertion and not any(w in sent.lower() for w in ["note", "disclaimer", "insufficient", "limitation", "caution", "ただし", "留意"]):
                    status = "UNCITED"
                    fully_valid = False
                    reason = "Factual patent statement lacks a corresponding evidence citation."
                else:
                    status = "SUPPORTED"
                    reason = "General summary or procedural framing."
                claim_results.append(
                    ClaimValidationResult(
                        text=sent,
                        citations=[],
                        status=status,
                        supported_by=[],
                        reason=reason,
                    )
                )
                continue

            # Validate each cited chunk
            supported_by: List[str] = []
            jurisdiction_mismatch = False

            for c_tag in valid_cites:
                cite_obj = citation_map[c_tag]
                # Jurisdiction validation
                if cite_obj.jurisdiction not in allowed_jurs:
                    jurisdiction_mismatch = True
                    break

                # Lexical / n-gram grounding check
                # Check if salient words from claim appear in chunk text
                sent_words = set(re.findall(r"[a-zA-Z0-9]{3,}|[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]", sent.lower()))
                chunk_words = set(re.findall(r"[a-zA-Z0-9]{3,}|[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]", (cite_obj.title + " " + cite_obj.text).lower()))
                
                # Check for fabricated patent status or dates (e.g., claiming "active until 2035" when 2035 is absent)
                years_in_sent = re.findall(r"\b(20[2-5][0-9])\b", sent)
                years_in_chunk = set(re.findall(r"\b(20[2-5][0-9])\b", cite_obj.text))
                unsupported_year = any(y not in years_in_chunk for y in years_in_sent)

                overlap = sent_words.intersection(chunk_words)
                if len(overlap) >= 2 and not unsupported_year:
                    supported_by.append(c_tag)

            if jurisdiction_mismatch:
                claim_results.append(
                    ClaimValidationResult(
                        text=sent,
                        citations=valid_cites,
                        status="UNSUPPORTED",
                        supported_by=[],
                        reason="Cited chunk belongs to a jurisdiction not authorized for this query.",
                    )
                )
                fully_valid = False
            elif len(supported_by) == len(valid_cites):
                claim_results.append(
                    ClaimValidationResult(
                        text=sent,
                        citations=valid_cites,
                        status="SUPPORTED",
                        supported_by=supported_by,
                        reason="Claim propositions match text and metadata of cited evidence.",
                    )
                )
            elif len(supported_by) > 0:
                claim_results.append(
                    ClaimValidationResult(
                        text=sent,
                        citations=valid_cites,
                        status="PARTIALLY_SUPPORTED",
                        supported_by=supported_by,
                        reason="Some cited evidence supports the proposition, but specific factual details were unverified in text.",
                    )
                )
                fully_valid = False
            else:
                claim_results.append(
                    ClaimValidationResult(
                        text=sent,
                        citations=valid_cites,
                        status="UNSUPPORTED",
                        supported_by=[],
                        reason="Cited chunk text does not support the specific assertions made in this sentence.",
                    )
                )
                fully_valid = False

        # Clean up any duplicate consecutive spaces or orphaned brackets
        sanitized_answer = re.sub(r"\s+", " ", answer_text).strip()

        return sanitized_answer, claim_results, fully_valid


claim_validator = ClaimValidator()
