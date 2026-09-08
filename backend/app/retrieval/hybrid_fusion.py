"""
backend/app/retrieval/hybrid_fusion.py
──────────────────────────────────────
Reciprocal Rank Fusion (RRF) and deduplication for IP-SAKTI retrieval pipeline.
Formula:
    RRF_score(d) = Σ 1 / (k + rank(d))
with configurable constant rrf_k = 60.
Deduplicates strictly by chunk_id while preserving complete score provenance.
"""
from __future__ import annotations

from typing import Dict, List, Any
from backend.app.retrieval.config import retrieval_config


def reciprocal_rank_fusion(
    dense_candidates: List[dict],
    lexical_candidates: List[dict],
    rrf_k: int = 60,
) -> List[dict]:
    """
    Fuses dense and lexical candidates using Reciprocal Rank Fusion.
    Preserves:
      - dense_score
      - dense_rank
      - lexical_score
      - lexical_rank
      - rrf_score
      - full chunk provenance
    """
    fused: Dict[str, dict] = {}

    # Process dense stream
    for item in dense_candidates:
        cid = item["chunk_id"]
        rank = item.get("dense_rank", 1000)
        rrf_contrib = 1.0 / (rrf_k + rank)

        if cid not in fused:
            fused[cid] = {
                **item,
                "dense_score": item.get("dense_score"),
                "dense_rank": rank,
                "lexical_score": None,
                "lexical_rank": None,
                "rrf_score": rrf_contrib,
            }
        else:
            fused[cid]["dense_score"] = item.get("dense_score")
            fused[cid]["dense_rank"] = rank
            fused[cid]["rrf_score"] += rrf_contrib

    # Process lexical stream
    for item in lexical_candidates:
        cid = item["chunk_id"]
        rank = item.get("lexical_rank", 1000)
        rrf_contrib = 1.0 / (rrf_k + rank)

        if cid not in fused:
            fused[cid] = {
                **item,
                "dense_score": None,
                "dense_rank": None,
                "lexical_score": item.get("lexical_score"),
                "lexical_rank": rank,
                "rrf_score": rrf_contrib,
            }
        else:
            fused[cid]["lexical_score"] = item.get("lexical_score")
            fused[cid]["lexical_rank"] = rank
            fused[cid]["rrf_score"] += rrf_contrib
            # If text/title was missing in dense mapping, fill it from lexical chunk
            for field in ["title", "text", "source_url", "filing_date", "publication_date"]:
                if not fused[cid].get(field) and item.get(field):
                    fused[cid][field] = item[field]

    # Sort descending by rrf_score
    ranked_candidates = sorted(fused.values(), key=lambda x: x["rrf_score"], reverse=True)

    return ranked_candidates
