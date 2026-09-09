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


# Source Authority Tiers & Weights
TIER_WEIGHTS = {
    1: 1.30,  # Tier 1: Primary statutes & official registries (CGPDTM, USPTO, EPO, JPO, WIPO, Ayush, FDA)
    2: 1.15,  # Tier 2: Official Pharmacopoeias (API, AFI, USP, JP) & Gazettes
    3: 1.00,  # Tier 3: Scientific research bodies (CSIR, CCRAS, ICMR, clinical trials)
    4: 0.85,  # Tier 4: Secondary summaries & commercial guidelines
}


def get_authority_tier(item: dict) -> int:
    """
    Computes or retrieves source authority tier (1 to 4).
    """
    if item.get("authority_tier"):
        try:
            return int(item["authority_tier"])
        except (ValueError, TypeError):
            pass

    source = (item.get("source") or "").lower()
    title = (item.get("title") or "").lower()
    doc_id = (item.get("document_id") or "").lower()
    pub_num = (item.get("publication_number") or "").lower()
    sec = (item.get("section") or "").lower()

    # Tier 1: Official government patent registries & primary statutory acts
    tier1_keywords = [
        "patents act", "uspto", "cgpdtm", "inpass", "jpo", "epo", "wipo", "pct",
        "ayush", "cdsco", "fda", "pmda", "fssai", "statute", "act 1970", "rule 158b",
        "schedule t", "35 u.s.c", "epc", "特許法", "薬機法", "hupd"
    ]
    if any(k in source or k in title or k in doc_id or k in pub_num for k in tier1_keywords):
        return 1
    if any(pub_num.startswith(prefix) for prefix in ["IN", "US", "EP", "JP", "WO", "IN-", "US-", "EP-", "JP-", "WO-"]):
        return 1

    # Tier 2: Official Pharmacopoeias, Formularies, Gazettes
    tier2_keywords = [
        "pharmacopoeia", "formulary", "api", "afi", "gazette", "monograph",
        "hmpc", "thmpd", "kommission e", "national formulary"
    ]
    if any(k in source or k in title or k in doc_id for k in tier2_keywords):
        return 2

    # Tier 3: Scientific research bodies, CSIR, CCRAS, ICMR, clinical trials
    tier3_keywords = ["csir", "ccras", "icmr", "clinical trial", "pubmed", "journal", "research"]
    if any(k in source or k in title or k in doc_id for k in tier3_keywords):
        return 3

    return 4


def reciprocal_rank_fusion(
    dense_candidates: List[dict],
    lexical_candidates: List[dict],
    rrf_k: int = 60,
) -> List[dict]:
    """
    Fuses dense and lexical candidates using Authority-Weighted Reciprocal Rank Fusion.
    Preserves:
      - dense_score, dense_rank
      - lexical_score, lexical_rank
      - authority_tier
      - rrf_score
      - full chunk provenance
    """
    fused: Dict[str, dict] = {}

    # Process dense stream
    for item in dense_candidates:
        cid = item["chunk_id"]
        rank = item.get("dense_rank", 1000)
        tier = get_authority_tier(item)
        tier_weight = TIER_WEIGHTS.get(tier, 1.0)
        rrf_contrib = (1.0 / (rrf_k + rank)) * tier_weight

        if cid not in fused:
            fused[cid] = {
                **item,
                "authority_tier": tier,
                "dense_score": item.get("dense_score"),
                "dense_rank": rank,
                "lexical_score": None,
                "lexical_rank": None,
                "rrf_score": rrf_contrib,
            }
        else:
            fused[cid]["authority_tier"] = min(fused[cid].get("authority_tier", 4), tier)
            fused[cid]["dense_score"] = item.get("dense_score")
            fused[cid]["dense_rank"] = rank
            fused[cid]["rrf_score"] += rrf_contrib

    # Process lexical stream
    for item in lexical_candidates:
        cid = item["chunk_id"]
        rank = item.get("lexical_rank", 1000)
        tier = get_authority_tier(item)
        tier_weight = TIER_WEIGHTS.get(tier, 1.0)
        rrf_contrib = (1.0 / (rrf_k + rank)) * tier_weight

        if cid not in fused:
            fused[cid] = {
                **item,
                "authority_tier": tier,
                "dense_score": None,
                "dense_rank": None,
                "lexical_score": item.get("lexical_score"),
                "lexical_rank": rank,
                "rrf_score": rrf_contrib,
            }
        else:
            fused[cid]["authority_tier"] = min(fused[cid].get("authority_tier", 4), tier)
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
