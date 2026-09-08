"""
backend/app/retrieval/cross_encoder_reranker.py
───────────────────────────────────────────────
Multilingual cross-encoder reranker for Phase 5 retrieval pipeline.
Uses BAAI/bge-reranker-v2-m3.

SAFETY GUARANTEE:
- BAAI/bge-reranker-v2-m3 is natively multilingual (100+ languages including Japanese).
- An English-only fallback MUST NEVER be silently used for Japanese or multilingual queries.
- If BAAI/bge-reranker-v2-m3 fails to load, reranker explicitly marks multilingual reranking
  as unavailable and falls back to RRF rank order rather than corrupting multilingual scores.
"""
from __future__ import annotations

import logging
from typing import List, Optional
import torch
from sentence_transformers import CrossEncoder

from backend.app.retrieval.config import retrieval_config

logger = logging.getLogger(__name__)


class CrossEncoderReranker:
    """
    Cross-encoder reranker wrapper handling multilingual scoring.
    """

    def __init__(self):
        self.device = retrieval_config.device
        self.model: Optional[CrossEncoder] = None
        self.loaded_model_name: Optional[str] = None
        self._is_multilingual: bool = False
        self._initialized: bool = False

    def initialize(self) -> None:
        """Loads cross-encoder model with strict safety guarantees."""
        if self._initialized:
            return

        model_name = retrieval_config.reranker_model
        logger.info(f"Loading primary multilingual cross-encoder: {model_name} on {self.device} ...")
        try:
            try:
                self.model = CrossEncoder(model_name, max_length=512, device=self.device, local_files_only=True)
            except Exception:
                self.model = CrossEncoder(model_name, max_length=512, device=self.device)
            self.loaded_model_name = model_name
            self._is_multilingual = True
            logger.info(f"Primary multilingual cross-encoder successfully loaded: {model_name}")
        except Exception as exc:
            logger.error(
                f"FAILED to load primary multilingual cross-encoder {model_name}: {exc}. "
                f"Safety invariant enforced: will NOT silently substitute an English-only fallback for multilingual queries."
            )
            self.model = None
            self.loaded_model_name = None
            self._is_multilingual = False

        self._initialized = True

    def is_multilingual_available(self) -> bool:
        """Returns whether a verified multilingual reranker is active."""
        if not self._initialized:
            self.initialize()
        return self._is_multilingual and self.model is not None

    def rerank(self, query: str, candidates: List[dict], top_k: int) -> List[dict]:
        """
        Scores candidates against query using cross-encoder.
        Updates each candidate with rerank_score and rerank_rank.
        If multilingual reranker is unavailable, safely preserves RRF order.
        """
        if not candidates:
            return []

        if not self._initialized:
            self.initialize()

        if self.model is None or not self._is_multilingual:
            logger.warning("Multilingual cross-encoder unavailable. Safely preserving RRF rank order without falsifying scores.")
            for rank, c in enumerate(candidates, start=1):
                c["rerank_score"] = float(c.get("rrf_score", 0.0))
                c["rerank_rank"] = rank
            return candidates[:top_k]

        # Build query-passage pairs for scoring
        pairs = []
        for c in candidates:
            text = c.get("text", "")
            title = c.get("title", "")
            passage = f"{title}\n{text}" if title else text
            pairs.append((query, passage[:1000]))

        batch_size = retrieval_config.reranker_batch_size
        try:
            scores = self.model.predict(pairs, batch_size=batch_size, show_progress_bar=False)
        except Exception as e:
            logger.error(f"Error during cross-encoder prediction: {e}. Preserving RRF order.")
            for rank, c in enumerate(candidates, start=1):
                c["rerank_score"] = float(c.get("rrf_score", 0.0))
                c["rerank_rank"] = rank
            return candidates[:top_k]

        scored_candidates = []
        for cand, score in zip(candidates, scores):
            updated = dict(cand)
            updated["rerank_score"] = float(score)
            scored_candidates.append(updated)

        scored_candidates.sort(key=lambda x: x["rerank_score"], reverse=True)

        for rank, c in enumerate(scored_candidates, start=1):
            c["rerank_rank"] = rank

        return scored_candidates[:top_k]


# Global singleton
cross_encoder_reranker = CrossEncoderReranker()
