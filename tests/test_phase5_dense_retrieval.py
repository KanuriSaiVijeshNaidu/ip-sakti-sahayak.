"""
tests/test_phase5_dense_retrieval.py
────────────────────────────────────
Tests for dense retrieval via BGE-M3 and FAISS IndexFlatIP.
Verifies embedding dimension (1024), no NaN/Inf, and strict jurisdiction isolation.
"""
import numpy as np
import pytest
from backend.app.retrieval.jurisdiction_faiss_retriever import jurisdiction_faiss_retriever


@pytest.fixture(scope="module")
def retriever():
    jurisdiction_faiss_retriever.initialize()
    return jurisdiction_faiss_retriever


def test_query_embedding_properties(retriever):
    vec = retriever.embed_query("Topical formulations for dermatological inflammatory disorders")
    assert vec.shape == (1, 1024)
    assert not np.isnan(vec).any()
    assert not np.isinf(vec).any()
    norm = np.linalg.norm(vec)
    assert abs(norm - 1.0) < 1e-4


def test_dense_retrieval_us(retriever):
    vec = retriever.embed_query("rosacea metronidazole cleanser")
    cands = retriever.search_jurisdiction(vec, "US", top_k=10)
    assert len(cands) == 10
    for c in cands:
        assert c["jurisdiction"] == "US"
        assert c["dense_score"] is not None
        assert "chunk_id" in c
        assert "document_id" in c


def test_dense_retrieval_jp(retriever):
    vec = retriever.embed_query("抗炎症 生薬 抽出物")
    cands = retriever.search_jurisdiction(vec, "JP", top_k=5)
    assert len(cands) == 5
    for c in cands:
        assert c["jurisdiction"] == "JP"
        assert c["language"] == "ja"


def test_dense_retrieval_ep(retriever):
    vec = retriever.embed_query("pharmaceutical formulation")
    cands = retriever.search_jurisdiction(vec, "EP", top_k=5)
    assert len(cands) == 5
    for c in cands:
        assert c["jurisdiction"] == "EP"


def test_dense_retrieval_wo(retriever):
    vec = retriever.embed_query("international patent application")
    cands = retriever.search_jurisdiction(vec, "WO", top_k=5)
    assert len(cands) == 5
    for c in cands:
        assert c["jurisdiction"] == "WO"
