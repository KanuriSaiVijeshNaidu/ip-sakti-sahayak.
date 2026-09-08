"""
tests/test_phase5_reranking.py
──────────────────────────────
Tests for cross-encoder reranking safety and multilingual guarantees.
Verifies that:
1. BAAI/bge-reranker-v2-m3 is loaded and verified as multilingual.
2. English-only models are never used as a silent fallback for Japanese.
3. Reranker produces valid relevance scores for multi-language pairs.
"""
import pytest
from backend.app.retrieval.cross_encoder_reranker import cross_encoder_reranker


@pytest.fixture(scope="module")
def reranker():
    cross_encoder_reranker.initialize()
    return cross_encoder_reranker


def test_reranker_model_loaded_and_multilingual(reranker):
    assert reranker._initialized is True
    assert reranker.is_multilingual_available() is True
    assert reranker.loaded_model_name == "BAAI/bge-reranker-v2-m3"
    assert reranker.model is not None


def test_reranker_scores_japanese_candidates(reranker):
    query = "日本における抽出物組成物の特許"
    candidates = [
        {
            "chunk_id": "JP-CHK-0001",
            "title": "生薬抽出物を含有する医薬組成物",
            "text": "本発明は、新規な植物抽出物とその抗炎症作用に関する。",
            "jurisdiction": "JP",
            "rrf_score": 0.03,
        },
        {
            "chunk_id": "JP-CHK-0002",
            "title": "無関係な半導体装置",
            "text": "半導体基板の上にゲート電極を形成する方法。",
            "jurisdiction": "JP",
            "rrf_score": 0.02,
        },
    ]

    reranked = reranker.rerank(query, candidates, top_k=2)
    assert len(reranked) == 2
    assert reranked[0]["chunk_id"] == "JP-CHK-0001"
    assert reranked[0]["rerank_score"] > reranked[1]["rerank_score"]
    assert reranked[0]["rerank_rank"] == 1


def test_reranker_safety_when_unavailable_preserves_rrf(monkeypatch):
    from backend.app.retrieval.cross_encoder_reranker import CrossEncoderReranker
    safe_reranker = CrossEncoderReranker()
    # Simulate unavailable model
    safe_reranker._initialized = True
    safe_reranker.model = None
    safe_reranker._is_multilingual = False

    candidates = [
        {"chunk_id": "c1", "rrf_score": 0.05, "text": "sample text"},
        {"chunk_id": "c2", "rrf_score": 0.03, "text": "sample text 2"},
    ]

    result = safe_reranker.rerank("any query", candidates, top_k=2)
    assert len(result) == 2
    # Must preserve RRF order and not invent fake neural scores
    assert result[0]["chunk_id"] == "c1"
    assert result[0]["rerank_score"] == 0.05
    assert result[0]["rerank_rank"] == 1
