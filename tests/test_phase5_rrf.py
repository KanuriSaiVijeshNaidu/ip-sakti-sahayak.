"""
tests/test_phase5_rrf.py
────────────────────────
Tests for Reciprocal Rank Fusion and deduplication logic.
Formula:
    RRF_score = Σ 1 / (k + rank)

Validates:
- dense-only candidate
- lexical-only candidate
- candidate appearing in both streams
- duplicate chunk handling
- ranking order mathematical consistency
"""
import pytest
from backend.app.retrieval.hybrid_fusion import reciprocal_rank_fusion


def test_rrf_scoring_and_provenance():
    dense_cands = [
        {"chunk_id": "chunk_1", "dense_score": 0.85, "dense_rank": 1, "jurisdiction": "US"},
        {"chunk_id": "chunk_2", "dense_score": 0.80, "dense_rank": 2, "jurisdiction": "US"},
    ]
    lexical_cands = [
        {"chunk_id": "chunk_2", "lexical_score": 4.5, "lexical_rank": 1, "jurisdiction": "US"},
        {"chunk_id": "chunk_3", "lexical_score": 3.8, "lexical_rank": 2, "jurisdiction": "US"},
    ]

    fused = reciprocal_rank_fusion(dense_cands, lexical_cands, rrf_k=60)

    assert len(fused) == 3  # chunk_1, chunk_2, chunk_3

    # chunk_2 is present in both streams: rank 2 dense and rank 1 lexical
    c2 = next(c for c in fused if c["chunk_id"] == "chunk_2")
    expected_c2_rrf = (1.0 / (60 + 2)) + (1.0 / (60 + 1))
    assert abs(c2["rrf_score"] - expected_c2_rrf) < 1e-6
    assert c2["dense_rank"] == 2
    assert c2["lexical_rank"] == 1
    assert c2["dense_score"] == 0.80
    assert c2["lexical_score"] == 4.5

    # chunk_2 should be ranked 1 overall because it has reciprocal contributions from both streams
    assert fused[0]["chunk_id"] == "chunk_2"


def test_dense_only_candidate_rrf():
    dense_cands = [
        {"chunk_id": "dense_only", "dense_score": 0.92, "dense_rank": 1, "jurisdiction": "US"}
    ]
    lexical_cands = []
    fused = reciprocal_rank_fusion(dense_cands, lexical_cands, rrf_k=60)
    assert len(fused) == 1
    c = fused[0]
    assert c["chunk_id"] == "dense_only"
    assert c["dense_rank"] == 1
    assert c["lexical_rank"] is None
    assert abs(c["rrf_score"] - (1.0 / 61)) < 1e-6


def test_lexical_only_candidate_rrf():
    dense_cands = []
    lexical_cands = [
        {"chunk_id": "lexical_only", "lexical_score": 5.2, "lexical_rank": 1, "jurisdiction": "EP"}
    ]
    fused = reciprocal_rank_fusion(dense_cands, lexical_cands, rrf_k=60)
    assert len(fused) == 1
    c = fused[0]
    assert c["chunk_id"] == "lexical_only"
    assert c["dense_rank"] is None
    assert c["lexical_rank"] == 1
    assert abs(c["rrf_score"] - (1.0 / 61)) < 1e-6


def test_rrf_deduplication_preserves_unique_ids():
    dense_cands = [
        {"chunk_id": "c1", "dense_rank": 1, "jurisdiction": "JP"},
        {"chunk_id": "c2", "dense_rank": 2, "jurisdiction": "JP"},
    ]
    lexical_cands = [
        {"chunk_id": "c1", "lexical_rank": 2, "jurisdiction": "JP"},
        {"chunk_id": "c3", "lexical_rank": 1, "jurisdiction": "JP"},
    ]
    fused = reciprocal_rank_fusion(dense_cands, lexical_cands, rrf_k=60)
    chunk_ids = [c["chunk_id"] for c in fused]
    assert len(chunk_ids) == len(set(chunk_ids))


def test_rrf_ranking_order_consistency():
    dense_cands = [
        {"chunk_id": "c_d1", "dense_rank": 1, "jurisdiction": "WO"},
        {"chunk_id": "c_d2", "dense_rank": 2, "jurisdiction": "WO"},
        {"chunk_id": "c_both", "dense_rank": 3, "jurisdiction": "WO"},
    ]
    lexical_cands = [
        {"chunk_id": "c_both", "lexical_rank": 1, "jurisdiction": "WO"},
        {"chunk_id": "c_l1", "lexical_rank": 2, "jurisdiction": "WO"},
    ]
    fused = reciprocal_rank_fusion(dense_cands, lexical_cands, rrf_k=60)

    # c_both score: 1/(60+3) + 1/(60+1) = 1/63 + 1/61 = 0.015873 + 0.016393 = 0.032266
    # c_d1 score: 1/(60+1) = 0.016393
    # c_l1 score: 1/(60+2) = 0.016129
    # c_d2 score: 1/(60+2) = 0.016129
    assert fused[0]["chunk_id"] == "c_both"
    # Verification that fused scores are monotonic descending
    scores = [c["rrf_score"] for c in fused]
    assert scores == sorted(scores, reverse=True)
