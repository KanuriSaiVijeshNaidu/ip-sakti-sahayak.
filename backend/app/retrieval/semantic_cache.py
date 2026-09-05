"""
backend/app/retrieval/semantic_cache.py
───────────────────────────────────────
High-Performance Vector Semantic Cache for IP-SAKTI.
Serves semantically identical or near-identical queries in < 5ms by evaluating
cosine similarity over query dense vector embeddings.
"""
from __future__ import annotations

import time
import logging
from dataclasses import dataclass
from typing import Optional, Dict, Any, List
import numpy as np

from backend.app.core.config import settings

logger = logging.getLogger(__name__)


@dataclass
class CacheEntry:
    query: str
    embedding: np.ndarray
    response_data: Dict[str, Any]
    created_at: float
    hit_count: int = 0


class SemanticCache:
    """In-memory cosine vector semantic cache."""

    def __init__(
        self,
        similarity_threshold: float = 0.95,
        max_entries: int = 500,
    ):
        self.threshold = similarity_threshold
        self.max_entries = max_entries
        self._entries: List[CacheEntry] = []
        self._hits = 0
        self._misses = 0

    def lookup(self, query_embedding: np.ndarray, threshold: Optional[float] = None) -> Optional[Dict[str, Any]]:
        """
        Search cache for an entry exceeding the cosine similarity threshold.
        Assumes query_embedding is L2-normalized.
        """
        if not self._entries:
            self._misses += 1
            return None

        target_threshold = threshold or self.threshold
        best_sim = -1.0
        best_entry: Optional[CacheEntry] = None

        # Compute dot product across all cached vectors (since vectors are L2-normalized, dot product = cosine sim)
        for entry in self._entries:
            sim = float(np.dot(query_embedding, entry.embedding))
            if sim > best_sim:
                best_sim = sim
                best_entry = entry

        if best_entry and best_sim >= target_threshold:
            best_entry.hit_count += 1
            self._hits += 1
            logger.info(
                f"Semantic cache HIT: sim={best_sim:.4f} >= {target_threshold} | "
                f"original='{best_entry.query[:40]}' | hits={best_entry.hit_count}"
            )
            # Clone response data and add cache hit marker
            res = dict(best_entry.response_data)
            res["cached"] = True
            res["similarity_score"] = round(best_sim, 4)
            return res

        self._misses += 1
        return None

    def store(self, query: str, query_embedding: np.ndarray, response_data: Dict[str, Any]):
        """Store a verified response in the semantic cache."""
        # Evict oldest if full
        if len(self._entries) >= self.max_entries:
            # Sort by hit_count and timestamp to keep popular entries
            self._entries.sort(key=lambda e: (e.hit_count, e.created_at))
            evicted = self._entries.pop(0)
            logger.debug(f"Evicted least valuable cache entry: '{evicted.query[:30]}'")

        entry = CacheEntry(
            query=query,
            embedding=query_embedding,
            response_data=response_data,
            created_at=time.time(),
            hit_count=0,
        )
        self._entries.append(entry)
        logger.debug(f"Stored in semantic cache: '{query[:40]}' (total={len(self._entries)})")

    def clear(self):
        """Flush cache."""
        self._entries.clear()
        self._hits = 0
        self._misses = 0

    def stats(self) -> Dict[str, Any]:
        """Return cache health & performance metrics."""
        total = self._hits + self._misses
        hit_rate = (self._hits / total) if total > 0 else 0.0
        return {
            "size": len(self._entries),
            "max_size": self.max_entries,
            "hits": self._hits,
            "misses": self._misses,
            "hit_rate": round(hit_rate, 4),
            "threshold": self.threshold,
        }


# Global singleton semantic cache
semantic_cache = SemanticCache(
    similarity_threshold=settings.semantic_cache_threshold,
    max_entries=settings.semantic_cache_max_entries,
)
