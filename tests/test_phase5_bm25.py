"""
tests/test_phase5_bm25.py
─────────────────────────
Tests for BM25Okapi lexical retriever partitioned per jurisdiction.
Verifies keyword matching, publication number indexing, Janome Japanese morphological
tokenization, and jurisdiction isolation.
"""
import pytest
from backend.app.retrieval.jurisdiction_bm25_retriever import (
    jurisdiction_bm25_retriever,
    _tokenize_text,
)


@pytest.fixture(scope="module")
def retriever():
    jurisdiction_bm25_retriever.build_or_load()
    return jurisdiction_bm25_retriever


def test_japanese_janome_tokenization():
    tokens = _tokenize_text("日本における抽出物組成物の特許", is_japanese=True)
    assert len(tokens) >= 4
    assert any(t in tokens for t in ["日本", "抽出", "組成", "特許"])


def test_bm25_us_search(retriever):
    cands = retriever.search_jurisdiction("rosacea metronidazole", "US", top_k=5)
    assert len(cands) > 0
    for c in cands:
        assert c["jurisdiction"] == "US"
        assert c["lexical_score"] > 0.0
        assert "text" in c
        assert "title" in c


def test_bm25_jp_search(retriever):
    cands = retriever.search_jurisdiction("抽出物", "JP", top_k=5)
    assert len(cands) > 0
    for c in cands:
        assert c["jurisdiction"] == "JP"
        assert c["language"] == "ja"


def test_bm25_jp_morphological_query(retriever):
    # Query with combined Japanese compound words
    cands = retriever.search_jurisdiction("抗炎症組成物", "JP", top_k=5)
    assert len(cands) > 0
    for c in cands:
        assert c["jurisdiction"] == "JP"
        assert c["lexical_score"] > 0.0


def test_bm25_publication_number_exact_match(retriever):
    # US20160184354A1-20160630 is in canonical chunks
    cands = retriever.search_jurisdiction("US20160184354A1-20160630", "US", top_k=3)
    assert len(cands) > 0
    assert any("US20160184354A1" in c["publication_number"] for c in cands)


def test_bm25_isolation(retriever):
    ep_cands = retriever.search_jurisdiction("patent", "EP", top_k=10)
    for c in ep_cands:
        assert c["jurisdiction"] == "EP"
