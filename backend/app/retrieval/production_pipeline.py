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
    RetrievalDebugRequest,
    RetrievalDebugResponse,
    RetrievalCandidateSummary,
    SufficiencyGateAudit,
)
from backend.app.retrieval.config import retrieval_config
from backend.app.retrieval.query_analyzer import (
    analyze_query,
    _RE_JAPANESE,
    _RE_DEVANAGARI,
    _RE_TELUGU,
    _RE_TAMIL,
    _RE_CODESWITCH_TELUGU,
    _RE_CODESWITCH_HINDI,
    _RE_CODESWITCH_TAMIL,
)
from backend.app.retrieval.jurisdiction_faiss_retriever import jurisdiction_faiss_retriever
from backend.app.retrieval.jurisdiction_bm25_retriever import jurisdiction_bm25_retriever
from backend.app.retrieval.hybrid_fusion import reciprocal_rank_fusion
from backend.app.retrieval.cross_encoder_reranker import cross_encoder_reranker
from backend.app.retrieval.jurisdiction_guard import verify_jurisdiction_safety
from backend.app.retrieval.evidence_selector import select_diverse_evidence
from backend.app.retrieval.statutory_store import statutory_store
from backend.app.rag.crag_validator import crag_validator
from backend.app.rag.config import rag_config

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
        statutory_store.initialize()
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
        lexical_query = query_analysis.normalized_query
        if query_analysis.expanded_representations and "en_canonical" in query_analysis.expanded_representations:
            en_trans = query_analysis.expanded_representations["en_canonical"]
            if en_trans and en_trans != lexical_query:
                lexical_query = f"{lexical_query} {en_trans}"

        lexical_candidates = jurisdiction_bm25_retriever.search(
            query=lexical_query,
            jurisdictions=target_jurisdictions,
            top_k=lexical_k,
        )
        latencies["lexical_retrieval_ms"] = round((time.perf_counter() - t0) * 1000, 2)
        verify_jurisdiction_safety(lexical_candidates, target_jurisdictions, stage_name="Lexical BM25 Retrieval")

        # Stream C: Statutory Anchors Retrieval
        t0 = time.perf_counter()
        statutory_candidates = statutory_store.search(
            query=query_analysis.normalized_query,
            jurisdictions=target_jurisdictions,
            top_k=10,
        )
        latencies["statutory_retrieval_ms"] = round((time.perf_counter() - t0) * 1000, 2)
        verify_jurisdiction_safety(statutory_candidates, target_jurisdictions, stage_name="Statutory Anchor Retrieval")

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
                dc["domain"] = meta.get("domain", "")
                dc["subdomain"] = meta.get("subdomain", "")
                dc["authority_tier"] = meta.get("authority_tier", 1)

        # 3. Reciprocal Rank Fusion (RRF) & Deduplication
        t0 = time.perf_counter()
        fused_candidates = reciprocal_rank_fusion(
            dense_candidates=dense_candidates,
            lexical_candidates=lexical_candidates,
            rrf_k=retrieval_config.rrf_k,
        )
        latencies["rrf_ms"] = round((time.perf_counter() - t0) * 1000, 2)
        verify_jurisdiction_safety(fused_candidates, target_jurisdictions, stage_name="RRF Fusion")

        # 4. Cross-Encoder Reranking Candidate Pool Assembly
        t0 = time.perf_counter()
        seen_cids = set()
        rerank_pool = []

        # Verified Tier-1 statutory anchors are prioritized in rerank candidate pool
        for sc in statutory_candidates:
            if sc["chunk_id"] not in seen_cids:
                rerank_pool.append(sc)
                seen_cids.add(sc["chunk_id"])

        for fc in fused_candidates:
            if fc["chunk_id"] not in seen_cids:
                rerank_pool.append(fc)
                seen_cids.add(fc["chunk_id"])
            if len(rerank_pool) >= rerank_k + len(statutory_candidates):
                break

        rerank_query = query_analysis.normalized_query
        if query_analysis.expanded_representations:
            en_trans = query_analysis.expanded_representations.get("en_canonical", "")
            if en_trans and en_trans != rerank_query:
                rerank_query = f"{rerank_query} ({en_trans})"

        reranked_candidates = cross_encoder_reranker.rerank(
            query=rerank_query,
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

    def debug_search(self, request: RetrievalDebugRequest) -> RetrievalDebugResponse:
        """
        Executes full retrieval pipeline with full diagnostic tracing for Developer Retrieval Debug Inspector.
        """
        if not self._warm:
            self.warm_up()

        t_start = time.perf_counter()
        latencies: Dict[str, float] = {}

        # 1. Query Analysis & Script Detection
        t0 = time.perf_counter()
        query_analysis = analyze_query(request.query, explicit_jurisdiction=request.jurisdiction)
        latencies["query_analysis_ms"] = round((time.perf_counter() - t0) * 1000, 2)

        # Detect script and code-switching tokens
        script_name = "Latin (English)"
        code_tokens: List[str] = []
        if _RE_JAPANESE.search(request.query):
            script_name = "Japanese (Kanji/Kana)"
        elif _RE_TELUGU.search(request.query):
            script_name = "Telugu"
        elif _RE_DEVANAGARI.search(request.query):
            script_name = "Devanagari (Hindi)"
        elif _RE_TAMIL.search(request.query):
            script_name = "Tamil"
        else:
            te_matches = _RE_CODESWITCH_TELUGU.findall(request.query)
            hi_matches = _RE_CODESWITCH_HINDI.findall(request.query)
            ta_matches = _RE_CODESWITCH_TAMIL.findall(request.query)
            if te_matches:
                script_name = "Latin (Telugu Code-Switched)"
                code_tokens = list(set(te_matches))
            elif hi_matches:
                script_name = "Latin (Hindi Code-Switched)"
                code_tokens = list(set(hi_matches))
            elif ta_matches:
                script_name = "Latin (Tamil Code-Switched)"
                code_tokens = list(set(ta_matches))

        target_jurisdictions = query_analysis.jurisdictions
        dense_k = retrieval_config.dense_top_k
        lexical_k = retrieval_config.lexical_top_k
        rerank_k = retrieval_config.rerank_top_k
        final_k = request.top_k or retrieval_config.final_top_k

        # 2. Dense FAISS Retrieval
        t0 = time.perf_counter()
        dense_candidates = jurisdiction_faiss_retriever.search(
            query=query_analysis.normalized_query,
            jurisdictions=target_jurisdictions,
            top_k=dense_k,
        )
        latencies["dense_retrieval_ms"] = round((time.perf_counter() - t0) * 1000, 2)

        # 3. Lexical BM25 Retrieval
        t0 = time.perf_counter()
        lexical_query = query_analysis.normalized_query
        if query_analysis.expanded_representations and "en_canonical" in query_analysis.expanded_representations:
            en_trans = query_analysis.expanded_representations["en_canonical"]
            if en_trans and en_trans != lexical_query:
                lexical_query = f"{lexical_query} {en_trans}"

        lexical_candidates = jurisdiction_bm25_retriever.search(
            query=lexical_query,
            jurisdictions=target_jurisdictions,
            top_k=lexical_k,
        )
        latencies["lexical_retrieval_ms"] = round((time.perf_counter() - t0) * 1000, 2)

        # 4. Stream C: Statutory Anchors Retrieval
        t0 = time.perf_counter()
        statutory_candidates = statutory_store.search(
            query=query_analysis.normalized_query,
            jurisdictions=target_jurisdictions,
            top_k=10,
        )
        latencies["statutory_retrieval_ms"] = round((time.perf_counter() - t0) * 1000, 2)

        # Enrich dense candidates
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
                dc["domain"] = meta.get("domain", "")
                dc["subdomain"] = meta.get("subdomain", "")
                dc["authority_tier"] = meta.get("authority_tier", 1)

        # 5. RRF Fusion
        t0 = time.perf_counter()
        fused_candidates = reciprocal_rank_fusion(
            dense_candidates=dense_candidates,
            lexical_candidates=lexical_candidates,
            rrf_k=retrieval_config.rrf_k,
        )
        latencies["rrf_ms"] = round((time.perf_counter() - t0) * 1000, 2)

        # 6. Cross-Encoder Reranking Candidate Pool Assembly
        t0 = time.perf_counter()
        seen_cids = set()
        rerank_pool = []

        # Verified Tier-1 statutory anchors are prioritized in rerank candidate pool
        for sc in statutory_candidates:
            if sc["chunk_id"] not in seen_cids:
                rerank_pool.append(sc)
                seen_cids.add(sc["chunk_id"])

        for fc in fused_candidates:
            if fc["chunk_id"] not in seen_cids:
                rerank_pool.append(fc)
                seen_cids.add(fc["chunk_id"])
            if len(rerank_pool) >= rerank_k + len(statutory_candidates):
                break

        rerank_query = query_analysis.normalized_query
        if query_analysis.detected_language in ["te", "hi", "ta", "ja"] and query_analysis.expanded_representations:
            en_trans = query_analysis.expanded_representations.get("en_canonical", "")
            if en_trans and en_trans != rerank_query:
                rerank_query = f"{rerank_query} ({en_trans})"

        reranked_candidates = cross_encoder_reranker.rerank(
            query=rerank_query,
            candidates=rerank_pool,
            top_k=rerank_k,
        )
        latencies["reranking_ms"] = round((time.perf_counter() - t0) * 1000, 2)

        # 6. Evidence Selection
        t0 = time.perf_counter()
        final_evidence = select_diverse_evidence(
            candidates=reranked_candidates,
            final_top_k=final_k,
        )
        latencies["evidence_selection_ms"] = round((time.perf_counter() - t0) * 1000, 2)

        # 7. Evidence Sufficiency Gate Audit
        t0 = time.perf_counter()
        crag = crag_validator.evaluate(
            query=request.query,
            evidence_results=final_evidence,
            target_jurisdictions=target_jurisdictions,
        )
        latencies["sufficiency_gate_ms"] = round((time.perf_counter() - t0) * 1000, 2)

        rerank_scores = [e.rerank_score for e in final_evidence if e.rerank_score is not None]
        top_score = max(rerank_scores) if rerank_scores else 0.0
        tier1_count = sum(1 for e in final_evidence if getattr(e, "authority_tier", 1) == 1)
        tier2_count = sum(1 for e in final_evidence if getattr(e, "authority_tier", 1) == 2)
        has_auth = (tier1_count >= 1) or (tier2_count >= 2)
        verdict = "PASS" if crag.status in ["GOOD", "PARTIAL"] else "FAIL"

        sufficiency_gate = SufficiencyGateAudit(
            verdict=verdict,
            status=crag.status,
            confidence=crag.confidence,
            top_rerank_score=round(top_score, 4),
            threshold=rag_config.partial_rerank_threshold,
            usable_count=len(final_evidence),
            tier1_count=tier1_count,
            has_authoritative_source=has_auth,
            reason=crag.reason,
        )

        total_ms = round((time.perf_counter() - t_start) * 1000, 2)
        latencies["total_pipeline_ms"] = total_ms

        def make_summary(c: dict, score_key: str, rank: int) -> RetrievalCandidateSummary:
            return RetrievalCandidateSummary(
                chunk_id=c.get("chunk_id", ""),
                publication_number=c.get("publication_number", ""),
                jurisdiction=c.get("jurisdiction", ""),
                section=c.get("section", ""),
                title=c.get("title", ""),
                score=round(float(c.get(score_key, 0.0) or 0.0), 4),
                rank=rank,
                authority_tier=int(c.get("authority_tier", 1) or 1),
                source_url=c.get("source_url"),
            )

        dense_summaries = [make_summary(c, "dense_score", i + 1) for i, c in enumerate(dense_candidates[:10])]
        lexical_summaries = [make_summary(c, "lexical_score", i + 1) for i, c in enumerate(lexical_candidates[:10])]
        fused_pool_display = []
        seen_fused = set()
        for sc in statutory_candidates:
            if sc["chunk_id"] not in seen_fused:
                fused_pool_display.append(sc)
                seen_fused.add(sc["chunk_id"])
        for fc in fused_candidates:
            if fc["chunk_id"] not in seen_fused:
                fused_pool_display.append(fc)
                seen_fused.add(fc["chunk_id"])
        fused_summaries = [make_summary(c, "rrf_score", i + 1) for i, c in enumerate(fused_pool_display[:10])]
        reranked_summaries = [make_summary(c, "rerank_score", i + 1) for i, c in enumerate(reranked_candidates[:10])]

        return RetrievalDebugResponse(
            query=request.query,
            normalized_query=query_analysis.normalized_query,
            detected_language=query_analysis.detected_language,
            detected_script=script_name,
            code_switching_tokens=code_tokens,
            target_jurisdictions=target_jurisdictions,
            routing_mode=query_analysis.routing_mode,
            routing_reason=query_analysis.routing_reason,
            expanded_representations=query_analysis.expanded_representations or {},
            dense_candidates=dense_summaries,
            lexical_candidates=lexical_summaries,
            fused_candidates=fused_summaries,
            reranked_candidates=reranked_summaries,
            final_evidence=final_evidence,
            sufficiency_gate=sufficiency_gate,
            latencies_ms=latencies,
            status="success",
        )


# Global singleton
production_retrieval_pipeline = ProductionRetrievalPipeline()

