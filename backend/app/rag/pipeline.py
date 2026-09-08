"""
backend/app/rag/pipeline.py
───────────────────────────
Master Phase 6 RAG pipeline orchestrator.
Executes:
Phase 5 Retrieval -> CRAG Assessment -> Evidence Selection -> LLM Generation -> Claim/Citation Validation.
"""
from __future__ import annotations

import time
import logging
from typing import Dict, List, Optional
from backend.app.models.retrieval_schemas import RetrievalSearchRequest
from backend.app.retrieval.production_pipeline import production_retrieval_pipeline
from backend.app.models.rag_schemas import (
    RAGAnswerRequest,
    RAGAnswerResponse,
    CitationInfo,
    ClaimValidationResult,
)
from backend.app.rag.config import rag_config
from backend.app.rag.crag_validator import crag_validator
from backend.app.rag.evidence_selector import evidence_selector
from backend.app.rag.answer_generator import answer_generator
from backend.app.rag.claim_validator import claim_validator

logger = logging.getLogger(__name__)


class Phase6RAGPipeline:
    """
    End-to-end evidence-grounded RAG pipeline with CRAG quality gates.
    """

    async def generate_answer(self, request: RAGAnswerRequest) -> RAGAnswerResponse:
        t_start = time.perf_counter()
        latencies: Dict[str, float] = {}

        # 1. Execute Phase 5 Retrieval
        t0 = time.perf_counter()
        retrieval_req = RetrievalSearchRequest(
            query=request.query,
            jurisdiction=request.jurisdiction,
            top_k=request.top_k or rag_config.default_top_k,
        )
        retrieval_resp = production_retrieval_pipeline.search(retrieval_req)
        latencies["retrieval_ms"] = round((time.perf_counter() - t0) * 1000, 2)

        query_analysis = retrieval_resp.query_analysis
        if request.language:
            query_analysis.detected_language = request.language

        # 2. CRAG Quality Assessment
        t0 = time.perf_counter()
        crag = crag_validator.evaluate(
            query=request.query,
            evidence_results=retrieval_resp.results,
            target_jurisdictions=retrieval_resp.searched_jurisdictions,
        )
        latencies["crag_ms"] = round((time.perf_counter() - t0) * 1000, 2)

        # 3. Evidence Selection & Formatting
        t0 = time.perf_counter()
        citations, llm_context = evidence_selector.select(
            evidence_results=retrieval_resp.results,
            max_chunks=request.top_k or rag_config.default_top_k,
        )
        latencies["evidence_selection_ms"] = round((time.perf_counter() - t0) * 1000, 2)

        # 4. LLM Generation
        t0 = time.perf_counter()
        raw_answer, gen_status = await answer_generator.generate(
            query=request.query,
            query_analysis=query_analysis,
            crag=crag,
            citations=citations,
            llm_context=llm_context,
        )
        latencies["llm_generation_ms"] = round((time.perf_counter() - t0) * 1000, 2)

        # 5. Claim & Citation Validation
        t0 = time.perf_counter()
        final_answer, claims, is_valid = claim_validator.validate(
            answer_text=raw_answer,
            citations=citations,
            target_jurisdictions=retrieval_resp.searched_jurisdictions,
        )
        latencies["claim_validation_ms"] = round((time.perf_counter() - t0) * 1000, 2)

        # Limitations accumulation
        limitations: List[str] = []
        if crag.status in ["PARTIAL", "INSUFFICIENT"]:
            limitations.append(crag.reason)
        if not is_valid:
            limitations.append("Some generated statements lacked complete sentence-level citation support or were refined.")

        total_pipeline_ms = round((time.perf_counter() - t_start) * 1000, 2)
        latencies["total_rag_pipeline_ms"] = total_pipeline_ms

        logger.info(
            "Phase 6 RAG complete: query='%s', lang='%s', crag='%s', citations=%d, claims=%d, total_ms=%.2f",
            request.query,
            query_analysis.detected_language,
            crag.status,
            len(citations),
            len(claims),
            total_pipeline_ms,
        )

        return RAGAnswerResponse(
            query=request.query,
            answer=final_answer,
            detected_language=query_analysis.detected_language,
            jurisdictions=retrieval_resp.searched_jurisdictions,
            crag_status=crag.status,
            evidence_count=len(citations),
            citations=citations,
            claims=claims,
            limitations=limitations,
            status=gen_status if gen_status != "SUCCESS" else ("SUCCESS" if is_valid or crag.status == "PARTIAL" else "PARTIALLY_VALIDATED"),
            latencies_ms=latencies,
        )


phase6_rag_pipeline = Phase6RAGPipeline()
