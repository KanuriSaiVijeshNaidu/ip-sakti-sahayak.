"""
backend/app/rag/crag_validator.py
─────────────────────────────────
Corrective RAG (CRAG) Evidence Quality Validator.
Evaluates the retrieval candidate set to determine whether the system has
sufficient, high-quality evidence to generate an answer.
Returns status: GOOD, PARTIAL, INSUFFICIENT, or INVALID.
"""
from __future__ import annotations

import logging
from typing import List
from backend.app.models.retrieval_schemas import EvidenceResult
from backend.app.models.rag_schemas import CRAGAssessment
from backend.app.rag.config import rag_config

logger = logging.getLogger(__name__)


class CRAGValidator:
    """
    Evaluates evidence quality and produces structured assessment.
    Does NOT fabricate accuracy or semantic correctness metrics.
    """

    def evaluate(
        self,
        query: str,
        evidence_results: List[EvidenceResult],
        target_jurisdictions: List[str],
    ) -> CRAGAssessment:
        if not evidence_results:
            return CRAGAssessment(
                status="INSUFFICIENT",
                confidence=0.0,
                reason="Phase 5 retrieval returned zero evidence chunks.",
                evidence_count=0,
                usable_evidence_count=0,
                jurisdiction_match=True,
                metadata_complete=True,
                duplicate_ratio=0.0,
                selected_evidence_ids=[],
            )

        # 1. Check Jurisdiction Invariants
        allowed_jurs = set(target_jurisdictions)
        jur_match = True
        for e in evidence_results:
            if e.jurisdiction not in allowed_jurs:
                jur_match = False
                break

        if not jur_match:
            return CRAGAssessment(
                status="INVALID",
                confidence=0.0,
                reason="Jurisdiction contamination detected: retrieved evidence contains disallowed jurisdictions.",
                evidence_count=len(evidence_results),
                usable_evidence_count=0,
                jurisdiction_match=False,
                metadata_complete=False,
                duplicate_ratio=0.0,
                selected_evidence_ids=[],
            )

        # 2. Check Metadata Completeness
        metadata_complete = True
        usable_chunks: List[EvidenceResult] = []
        for e in evidence_results:
            if not e.chunk_id or not e.publication_number or not e.text:
                metadata_complete = False
            elif len(e.text.strip()) >= rag_config.min_content_length:
                usable_chunks.append(e)

        if not metadata_complete:
            logger.warning("Retrieved evidence has incomplete metadata fields.")

        # 3. Duplicate Document Ratio
        doc_ids = [e.document_id for e in evidence_results if e.document_id]
        unique_docs = set(doc_ids)
        duplicate_ratio = 1.0 - (len(unique_docs) / len(doc_ids)) if doc_ids else 0.0

        usable_count = len(usable_chunks)
        if usable_count == 0:
            return CRAGAssessment(
                status="INSUFFICIENT",
                confidence=0.1,
                reason="Retrieved chunks contain no usable or answerable text content.",
                evidence_count=len(evidence_results),
                usable_evidence_count=0,
                jurisdiction_match=True,
                metadata_complete=metadata_complete,
                duplicate_ratio=duplicate_ratio,
                selected_evidence_ids=[],
            )

        # 4. Score Distribution & Relevance Assessment
        rerank_scores = [e.rerank_score for e in usable_chunks if e.rerank_score is not None]
        top_score = max(rerank_scores) if rerank_scores else 0.0
        avg_score = (sum(rerank_scores) / len(rerank_scores)) if rerank_scores else 0.0

        # Technical confidence score derived from score distribution and candidate availability
        confidence = min(1.0, max(0.2, (top_score + 1.0) / 2.0 if top_score <= 1.0 else top_score))

        # Check legal uncertainty queries (e.g. asking "can I legally sell" or "infringement guarantee")
        q_lower = query.lower()
        is_legal_guarantee_query = any(w in q_lower for w in [
            "can i legally sell", "can i sell", "guarantee", "freedom to operate", "infringe or not",
            "販売できるか", "合法的に販売"
        ])

        if is_legal_guarantee_query:
            # Retrieved patent chunks document prior technical disclosures, not commercialization clearances
            return CRAGAssessment(
                status="PARTIAL",
                confidence=0.50,
                reason=(
                    "Query seeks a conclusive legal clearance/commercialization determination. "
                    "Retrieved patent documents establish prior technical art but cannot conclusively "
                    "guarantee commercial freedom to operate or non-infringement."
                ),
                evidence_count=len(evidence_results),
                usable_evidence_count=usable_count,
                jurisdiction_match=True,
                metadata_complete=metadata_complete,
                duplicate_ratio=duplicate_ratio,
                selected_evidence_ids=[e.chunk_id for e in usable_chunks],
            )

        # General Quality Decision
        if top_score >= rag_config.good_rerank_threshold and usable_count >= 2:
            status = "GOOD"
            reason = f"High-confidence evidence available (top rerank score: {top_score:.3f}, {usable_count} usable chunks)."
        elif top_score >= rag_config.partial_rerank_threshold or usable_count >= 1:
            status = "PARTIAL"
            reason = f"Limited or moderate-confidence evidence (top rerank score: {top_score:.3f})."
        else:
            status = "INSUFFICIENT"
            reason = f"Retrieved evidence relevance scores are below minimum threshold (top rerank score: {top_score:.3f})."

        return CRAGAssessment(
            status=status,
            confidence=round(confidence, 2),
            reason=reason,
            evidence_count=len(evidence_results),
            usable_evidence_count=usable_count,
            jurisdiction_match=True,
            metadata_complete=metadata_complete,
            duplicate_ratio=round(duplicate_ratio, 2),
            selected_evidence_ids=[e.chunk_id for e in usable_chunks],
        )


crag_validator = CRAGValidator()
