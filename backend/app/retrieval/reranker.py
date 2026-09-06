"""
backend/app/retrieval/reranker.py
──────────────────────────────────
Cross-Encoder reranker for IP-SAKTI RAG pipeline.

Position in pipeline
────────────────────
  RRF fused candidates (top-K)
    └──> CrossEncoder.predict(query, passage) for each candidate
    └──> Sort by reranker score (desc)
    └──> Return top-N RerankedCandidates  (input to evidence validator)

Model
─────
  cross-encoder/ms-marco-MiniLM-L-6-v2
  - Size: ~22 MB (tiny, downloads fast)
  - Trained on MS-MARCO passage ranking
  - Input: (query, passage) pair
  - Output: relevance logit (higher = more relevant)
  - Latency: ~5-15 ms per pair on CPU

Design
──────
- Batches all (query, passage) pairs into a single CrossEncoder.predict()
  call for maximum throughput.
- Falls back gracefully if model cannot load — returns input order unchanged.
- Exposes raw reranker_score on every candidate for Admin UI trace.
"""
from __future__ import annotations

import logging
from dataclasses import dataclass
from typing import Optional

from backend.app.core.config import settings
from backend.app.retrieval.fusion import FusedCandidate

logger = logging.getLogger(__name__)


# ─── Data model ───────────────────────────────────────────────────────────────

@dataclass
class RerankedCandidate:
    """FusedCandidate enriched with cross-encoder reranker score."""
    chunk_id: str
    text: str
    domain: str
    jurisdiction: str
    section_title: str
    source_title: str
    corpus_version: str
    # Scores — all preserved for Admin UI trace
    bm25_score: float = 0.0
    bm25_rank: Optional[int] = None
    vector_score: float = 0.0
    vector_rank: Optional[int] = None
    rrf_score: float = 0.0
    reranker_score: float = 0.0
    reranker_rank: Optional[int] = None
    faiss_id: Optional[int] = None

    @classmethod
    def from_fused(cls, fc: FusedCandidate, reranker_score: float = 0.0) -> "RerankedCandidate":
        return cls(
            chunk_id=fc.chunk_id,
            text=fc.text,
            domain=fc.domain,
            jurisdiction=fc.jurisdiction,
            section_title=fc.section_title,
            source_title=fc.source_title,
            corpus_version=fc.corpus_version,
            bm25_score=fc.bm25_score,
            bm25_rank=fc.bm25_rank,
            vector_score=fc.vector_score,
            vector_rank=fc.vector_rank,
            rrf_score=fc.rrf_score,
            reranker_score=reranker_score,
            faiss_id=fc.faiss_id,
        )


# ─── CrossEncoder loader ──────────────────────────────────────────────────────

def _load_cross_encoder(model_name: str):
    """Load CrossEncoder with graceful error handling."""
    try:
        from sentence_transformers.cross_encoder import CrossEncoder
        logger.info(f"Loading cross-encoder: {model_name} ...")
        try:
            model = CrossEncoder(model_name, device=settings.embed_device, local_files_only=True)
        except Exception:
            model = CrossEncoder(model_name, device=settings.embed_device)
        logger.info(f"Cross-encoder loaded: {model_name}")
        return model
    except Exception as exc:
        logger.warning(f"CrossEncoder load failed ({exc}) — reranker disabled.")
        return None


# ─── Reranker ────────────────────────────────────────────────────────────────

class CrossEncoderReranker:
    """
    Reranks RRF-fused candidates using a cross-encoder relevance model.
    Call reranker.build() once at startup to load the model.
    """

    def __init__(self):
        self._model = None
        self._built = False

    def build(self) -> None:
        """Load the cross-encoder model. Safe to call multiple times."""
        if self._built:
            return
        self._model = _load_cross_encoder(settings.reranker_model)
        self._built = True

    def is_built(self) -> bool:
        return self._built

    def rerank(
        self,
        query: str,
        candidates: list[FusedCandidate],
        top_n: int | None = None,
    ) -> list[RerankedCandidate]:
        """
        Score each (query, passage) pair with the cross-encoder and
        return candidates sorted by reranker_score descending.

        Parameters
        ----------
        query      : The user query string.
        candidates : RRF-fused candidates from fusion.retrieve().
        top_n      : How many to return (default: settings.reranker_top_n).

        Returns
        -------
        List of RerankedCandidate sorted by reranker_score desc.
        If model unavailable, returns input order with score=rrf_score.
        """
        top_n = top_n or settings.reranker_top_n

        if not candidates:
            return []

        # ── Model unavailable: passthrough with rrf_score as proxy ───────────
        if self._model is None:
            logger.warning("Cross-encoder not loaded — using RRF score as proxy.")
            results = [
                RerankedCandidate.from_fused(c, reranker_score=c.rrf_score)
                for c in candidates
            ]
            for i, r in enumerate(results, 1):
                r.reranker_rank = i
            return results[:top_n]

        # ── Build (query, passage) pairs ─────────────────────────────────────
        pairs = [[query, c.text] for c in candidates]

        try:
            scores: list[float] = self._model.predict(pairs).tolist()
        except Exception as exc:
            logger.error(f"CrossEncoder.predict failed: {exc} — falling back to RRF order.")
            results = [
                RerankedCandidate.from_fused(c, reranker_score=c.rrf_score)
                for c in candidates
            ]
            for i, r in enumerate(results, 1):
                r.reranker_rank = i
            return results[:top_n]

        # ── Pair scores with candidates and sort ─────────────────────────────
        scored = [
            RerankedCandidate.from_fused(c, reranker_score=float(s))
            for c, s in zip(candidates, scores)
        ]
        scored.sort(key=lambda r: r.reranker_score, reverse=True)

        for i, r in enumerate(scored, 1):
            r.reranker_rank = i

        logger.debug(
            f"Reranker: {len(candidates)} → {min(top_n, len(scored))} candidates | "
            f"top score={scored[0].reranker_score:.4f}"
        )
        return scored[:top_n]


# ─── Module-level singleton ───────────────────────────────────────────────────

reranker = CrossEncoderReranker()
