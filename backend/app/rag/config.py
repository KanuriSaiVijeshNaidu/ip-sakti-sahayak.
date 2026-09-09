"""
backend/app/rag/config.py
─────────────────────────
Configuration settings for Phase 6 RAG generation, CRAG quality thresholds,
citation validation, and model timeouts.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import List


@dataclass
class RAGConfig:
    # Evidence Selection & Limits
    min_evidence_chunks: int = 1
    max_evidence_chunks: int = 8
    default_top_k: int = 5
    max_chunks_per_doc: int = 2

    # CRAG Quality Thresholds (Calibrated for BGE-Reranker-v2-m3)
    # Scores >= 0.35: High confidence statutory grounding
    # Scores < 0.15: Insufficient verified evidence (triggers Circuit Breaker)
    good_rerank_threshold: float = 0.35
    partial_rerank_threshold: float = 0.15
    min_content_length: int = 30
    max_duplicate_ratio: float = 0.85

    # LLM Generation Hyperparameters
    max_generation_tokens: int = 1200
    generation_timeout_seconds: float = 45.0
    max_regeneration_attempts: int = 2

    # Claim & Citation Validation
    strict_citation_enforcement: bool = True
    reject_unsupported_claims: bool = True
    allow_partial_fallback: bool = True


rag_config = RAGConfig()
