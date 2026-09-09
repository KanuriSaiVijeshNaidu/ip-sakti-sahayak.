"""
backend/app/retrieval/config.py
───────────────────────────────
Centralized configuration for Phase 5 Retrieval Layer.
Consolidates all tunable retrieval hyperparameters to eliminate scattered magic numbers.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import List, Literal
import torch


@dataclass
class RetrievalConfig:
    # Top-K candidate counts for each stage
    dense_top_k: int = 30
    lexical_top_k: int = 30
    rrf_k: int = 60
    rerank_top_k: int = 20
    final_top_k: int = 10

    # Similarity & Reranking thresholds
    dense_similarity_threshold: float = 0.0
    rerank_score_threshold: float = -10.0

    # Supported and active jurisdictions
    # IN is fully enabled as premier jurisdiction, DE is REMOVED permanently
    active_jurisdictions: List[str] = field(default_factory=lambda: ["IN", "US", "EP", "WO", "JP"])
    forbidden_jurisdictions: List[str] = field(default_factory=lambda: ["DE"])

    # Model identifiers
    embedding_model: str = "BAAI/bge-m3"
    embedding_dim: int = 1024
    reranker_model: str = "BAAI/bge-reranker-v2-m3"
    reranker_fallback_model: str = "cross-encoder/ms-marco-MiniLM-L-6-v2"

    # Hardware preferences
    device: str = "cuda" if torch.cuda.is_available() else "cpu"
    reranker_batch_size: int = 16

    # Paths
    canonical_chunks_path: str = "data/embedding_ready/canonical_chunks.jsonl"
    faiss_base_dir: str = "data/indexes/faiss"
    bm25_cache_dir: str = "data/indexes/bm25"


# Global singleton instance
retrieval_config = RetrievalConfig()
