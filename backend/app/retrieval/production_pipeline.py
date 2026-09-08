"""
backend/app/retrieval/production_pipeline.py
────────────────────────────────────────────
Master Phase 5 Retrieval Pipeline.
Connects Query Analyzer, Dense FAISS, Lexical BM25, RRF, CrossEncoder Reranker,
Jurisdiction Guard, and Evidence Selector with comprehensive audit logging and
precise latency tracking.
STOP — DOES NOT GENERATE FINAL LLM ANSWERS.
"""
from __future__ import annotations

import logging
import time
from typing import Dict, List, Optional

from backend.app.models.retrieval_schemas import (
    QueryAnalysis,
    EvidenceResult,
    RetrievalSearchRequest,
    RetrievalSearchResponse,
)
from backend.app.retrieval.config import retrieval_config
from backend.app.retrieval.query_analyzer import analyze_query
from backend.app.retrieval.jurisdiction_faiss_retriever import jurisdiction_faiss_retriever
from backend.app.retrieval.jurisdiction_bm25_retriever import jurisdiction_bm25_retriever
from backend.app.retrieval.hybrid_fusion import reciprocal_rank_fusion
from backend.app.retrieval.cross_encoder_reranker import cross_encoder_reranker
from backend.app.retrieval.jurisdiction_guard import verify_jurisdiction_safety
from backend.app.retrieval.evidence_selector import select_diverse_evidence

logger = logging.getLogger(__name__)


class ProductionRetrievalPipeline:
    """
    End-to-end production hybrid retrieval engine.
    """

    def __init__(self):
        self._warm = False

    def warm_up(self) -> None:
        """Initializes both retrievers and reranker model into memory."""
        if self._warm:
            return
        logger.info("Warming up Production Retrieval Pipeline components ...")
        jurisdiction_faiss_retriever.initialize()
        jurisdiction_bm25_retriever.build_or_load()
        cross_encoder_reranker.initialize()
        self._warm = True
        logger.info("Production Retrieval Pipeline successfully warmed up.")

    def search(self, request: RetrievalSearchRequest) -> RetrievalSearchResponse:
        """
        Executes the full retrieval flow.
        """
        if not self._warm:
            self.warm_up()

        t_start = time.perf_counter()
        latencies: Dict[str, float] = {}

        # 1. Query Understanding & Routing
        t0 = time.perf_counter()
        query_analysis = analyze_query(request.query, explicit_jurisdiction=request.jurisdiction)
        latencies["query_analysis_ms"] = round((time.perf_counter() - t0) * 1000, 2)

        target_jurisdictions = query_analysis.jurisdictions
        dense_k = request.dense_top_k or retrieval_config.dense_top_k
        lexical_k = request.lexical_top_k or retrieval_config.lexical_top_k
        rerank_k = request.rerank_top_k or retrieval_config.rerank_top_k
        final_k = request.top_k or retrieval_config.final_top_k

        # 2. Parallel Dual-Stream Retrieval
        # Stream A: Dense FAISS
        t0 = time.perf_counter()
        dense_candidates = jurisdiction_faiss_retriever.search(
            query=query_analysis.normalized_query,
            jurisdictions=target_jurisdictions,
            top_k=dense_k,
        )
        latencies["dense_retrieval_ms"] = round((time.perf_counter() - t0) * 1000, 2)
        verify_jurisdiction_safety(dense_candidates, target_jurisdictions, stage_name="Dense FAISS Retrieval")

        # Stream B: Lexical BM25
        t0 = time.perf_counter()
        lexical_candidates = jurisdiction_bm25_retriever.search(
            query=query_analysis.normalized_query,
            jurisdictions=target_jurisdictions,
            top_k=lexical_k,
        )
        latencies["lexical_retrieval_ms"] = round((time.perf_counter() - t0) * 1000, 2)
        verify_jurisdiction_safety(lexical_candidates, target_jurisdictions, stage_name="Lexical BM25 Retrieval")

        # If dense candidates lack text/title, enrich them from BM25 corpus mapping
        bm25_chunks_by_id = {}
        for jur in target_jurisdictions:
            if jur in jurisdiction_bm25_retriever.chunks:
                for c in jurisdiction_bm25_retriever.chunks[jur]:
                    bm25_chunks_by_id[c["chunk_id"]] = c

        for dc in dense_candidates:
            cid = dc["chunk_id"]
            if cid in bm25_chunks_by_id:
                meta = bm25_chunks_by_id[cid]
                dc["text"] = meta.get("text", "")
                dc["title"] = meta.get("title", "")
                dc["source_url"] = meta.get("source_url")
                dc["filing_date"] = meta.get("filing_date")
                dc["publication_date"] = meta.get("publication_date")

        # 3. Reciprocal Rank Fusion (RRF) & Deduplication
        t0 = time.perf_counter()
        fused_candidates = reciprocal_rank_fusion(
            dense_candidates=dense_candidates,
            lexical_candidates=lexical_candidates,
            rrf_k=retrieval_config.rrf_k,
        )
        latencies["rrf_ms"] = round((time.perf_counter() - t0) * 1000, 2)
        verify_jurisdiction_safety(fused_candidates, target_jurisdictions, stage_name="RRF Fusion")

        # 4. Cross-Encoder Reranking
        t0 = time.perf_counter()
        rerank_pool = fused_candidates[:rerank_k]
        reranked_candidates = cross_encoder_reranker.rerank(
            query=query_analysis.normalized_query,
            candidates=rerank_pool,
            top_k=rerank_k,
        )
        latencies["reranking_ms"] = round((time.perf_counter() - t0) * 1000, 2)
        verify_jurisdiction_safety(reranked_candidates, target_jurisdictions, stage_name="Cross-Encoder Reranking")

        # 5. Evidence Selection & Formatting
        t0 = time.perf_counter()
        final_evidence = select_diverse_evidence(
            candidates=reranked_candidates,
            final_top_k=final_k,
        )
        latencies["evidence_selection_ms"] = round((time.perf_counter() - t0) * 1000, 2)

        total_ms = round((time.perf_counter() - t_start) * 1000, 2)
        latencies["total_pipeline_ms"] = total_ms

        # Audit Log
        logger.info(
            "Phase 5 Retrieval complete: query='%s', lang='%s', mode='%s', jurs=%s, dense=%d, lexical=%d, fused=%d, reranked=%d, final=%d, total_ms=%.2f",
            request.query,
            query_analysis.detected_language,
            query_analysis.routing_mode,
            target_jurisdictions,
            len(dense_candidates),
            len(lexical_candidates),
            len(fused_candidates),
            len(reranked_candidates),
            len(final_evidence),
            total_ms,
        )

        return RetrievalSearchResponse(
            query_analysis=query_analysis,
            routing_decision=f"Mode: {query_analysis.routing_mode} -> {', '.join(target_jurisdictions)}",
            searched_jurisdictions=target_jurisdictions,
            dense_candidate_count=len(dense_candidates),
            lexical_candidate_count=len(lexical_candidates),
            fused_candidate_count=len(fused_candidates),
            reranked_candidate_count=len(reranked_candidates),
            final_candidate_count=len(final_evidence),
            results=final_evidence,
            latencies_ms=latencies,
            status="success",
        )


# Global singleton
production_retrieval_pipeline = ProductionRetrievalPipeline()
