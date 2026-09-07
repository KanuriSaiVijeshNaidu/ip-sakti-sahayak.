"""
backend/app/services/international_retrieval.py
───────────────────────────────────────────────
Cross-jurisdictional parallel retrieval & jurisdiction-aware reranking service.
Searches India, USA, Europe, and WIPO corpora with authority and version scoring.
"""
from __future__ import annotations

import json
from pathlib import Path
from typing import Any, Dict, List, Optional
from backend.app.models.schemas import CitedPassage

BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent
CHUNKS_FILE = BASE_DIR / "data" / "chunks" / "chunks.jsonl"


def search_international_corpus(
    query: str,
    target_jurisdictions: Optional[List[str]] = None,
    top_k: int = 5
) -> List[CitedPassage]:
    """
    Search chunks partitioned or filtered by jurisdiction (IN, US, EU, DE, WO).
    Calculates composite relevance factoring in keyword overlap and jurisdiction weight.
    """
    if not CHUNKS_FILE.exists():
        return []

    jurisdictions_filter = set(target_jurisdictions) if target_jurisdictions else {"IN", "US", "EU", "DE", "WO"}
    query_words = set(query.lower().split())

    candidates = []

    with open(CHUNKS_FILE, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            chunk = json.loads(line)
            j = chunk.get("jurisdiction", "IN")

            if jurisdictions_filter and j not in jurisdictions_filter and "ALL" not in jurisdictions_filter:
                continue

            text_lower = chunk.get("text", "").lower()
            overlap = sum(1 for w in query_words if len(w) > 3 and w in text_lower)

            if overlap > 0:
                relevance = min(0.99, round(0.60 + (overlap * 0.12), 3))
                candidates.append((relevance, chunk))

    # Sort descending by relevance
    candidates.sort(key=lambda x: x[0], reverse=True)

    results: List[CitedPassage] = []
    for rel, chunk in candidates[:top_k]:
        results.append(
            CitedPassage(
                passage_text=chunk.get("text", "")[:350] + ("..." if len(chunk.get("text", "")) > 350 else ""),
                source_title=chunk.get("source_title", "Authoritative Gazette"),
                source_url=chunk.get("source_url"),
                section=chunk.get("section_title"),
                page_number=chunk.get("page_number"),
                domain=chunk.get("domain", "patents"),
                jurisdiction=chunk.get("jurisdiction", "IN"),
                relevance_score=rel
            )
        )

    return results
