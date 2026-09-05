"""
backend/tests/test_retrieval.py
────────────────────────────────
Phase 3 tests for BM25, RRF fusion, and (optionally) vector retrieval.

Vector tests are skipped if sentence-transformers is not installed or
the DB has no chunks, so the suite is always runnable in CI.
"""
from __future__ import annotations

import pytest
import asyncio

from backend.app.retrieval.bm25_retriever import (
    BM25Retriever, BM25Candidate, _tokenize
)
from backend.app.retrieval.fusion import (
    FusedCandidate, reciprocal_rank_fusion, metadata_filter
)
from backend.app.retrieval.vector_retriever import VectorCandidate


# ─── Tokeniser tests ─────────────────────────────────────────────────────────

def test_tokenize_basic():
    tokens = _tokenize("What is a patent for Ashwagandha formulation?")
    assert "patent" in tokens
    assert "ashwagandha" in tokens

def test_tokenize_removes_stopwords():
    tokens = _tokenize("the is a and of")
    assert tokens == []

def test_tokenize_nonempty_on_legal_text():
    text = "Section 3(e) of the Patents Act 1970 prohibits mere admixtures."
    tokens = _tokenize(text)
    assert len(tokens) > 2

def test_tokenize_empty_string():
    tokens = _tokenize("")
    assert tokens == []


# ─── BM25 retriever tests (in-memory, no DB) ─────────────────────────────────

def _make_bm25_with_docs(docs: list[str]):
    """Helper: build a BM25Retriever from a list of strings without DB."""
    from rank_bm25 import BM25Okapi
    from backend.app.retrieval.bm25_retriever import _tokenize

    retriever = BM25Retriever()
    corpus = [_tokenize(d) or ["empty"] for d in docs]
    retriever._index = BM25Okapi(corpus)
    retriever._chunks = [
        {
            "chunk_id": f"chunk-{i}",
            "text": doc,
            "domain": "patents",
            "jurisdiction": "IN",
            "section_title": f"Section {i}",
            "source_title": "Test Act",
            "corpus_version": "v1",
            "faiss_id": i,
        }
        for i, doc in enumerate(docs)
    ]
    retriever._built = True
    return retriever


def test_bm25_returns_results():
    docs = [
        "Section 3e prohibits mere admixture of Ayurvedic herbs",
        "A patent grants exclusive rights to the inventor for twenty years",
        "Trademarks distinguish goods in the market",
    ]
    retriever = _make_bm25_with_docs(docs)
    results = retriever.search("Ayurvedic patent admixture", top_k=3)
    assert len(results) > 0


def test_bm25_top_result_relevant():
    docs = [
        "Ashwagandha formulation admixture traditional knowledge patent",
        "Trademark application filing fee class 5",
        "FSSAI labelling requirements for food products",
    ]
    retriever = _make_bm25_with_docs(docs)
    results = retriever.search("Ashwagandha patent traditional knowledge", top_k=3)
    assert results[0].chunk_id == "chunk-0"


def test_bm25_domain_filter():
    docs = [
        "Patent admixture herb formulation",
        "Trademark filing class five goods",
    ]
    retriever = _make_bm25_with_docs(docs)
    # All chunks are domain=patents in our helper
    results = retriever.search("filing goods", domain="fssai")
    assert len(results) == 0


def test_bm25_scores_are_positive():
    docs = ["Patent for herbal formulation with synergistic effect"]
    retriever = _make_bm25_with_docs(docs)
    results = retriever.search("herbal patent synergistic", top_k=5)
    for r in results:
        assert r.score > 0


def test_bm25_not_built_returns_empty():
    retriever = BM25Retriever()
    results = retriever.search("any query")
    assert results == []


# ─── RRF fusion tests ────────────────────────────────────────────────────────

def _make_bm25_candidate(chunk_id: str, score: float, domain: str = "patents") -> BM25Candidate:
    return BM25Candidate(
        chunk_id=chunk_id, text=f"text of {chunk_id}", score=score,
        domain=domain, jurisdiction="IN", section_title="S1",
        source_title="Test", corpus_version="v1",
    )


def _make_vector_candidate(chunk_id: str, score: float, domain: str = "patents") -> VectorCandidate:
    return VectorCandidate(
        chunk_id=chunk_id, text=f"text of {chunk_id}", score=score,
        domain=domain, jurisdiction="IN", section_title="S1",
        source_title="Test", corpus_version="v1",
    )


def test_rrf_basic():
    bm25 = [_make_bm25_candidate("c1", 5.0), _make_bm25_candidate("c2", 3.0)]
    vec  = [_make_vector_candidate("c1", 0.9), _make_vector_candidate("c3", 0.8)]
    fused = reciprocal_rank_fusion(bm25, vec)
    ids = [c.chunk_id for c in fused]
    assert "c1" in ids   # appeared in both → highest RRF score


def test_rrf_deduplication():
    bm25 = [_make_bm25_candidate("c1", 5.0), _make_bm25_candidate("c1", 5.0)]
    vec  = [_make_vector_candidate("c1", 0.9)]
    fused = reciprocal_rank_fusion(bm25, vec)
    assert len([c for c in fused if c.chunk_id == "c1"]) == 1


def test_rrf_scores_populated():
    bm25 = [_make_bm25_candidate("c1", 4.0)]
    vec  = [_make_vector_candidate("c1", 0.85)]
    fused = reciprocal_rank_fusion(bm25, vec)
    assert fused[0].rrf_score > 0
    assert fused[0].bm25_score == 4.0
    assert fused[0].vector_score == 0.85


def test_rrf_k_constant_effect():
    bm25 = [_make_bm25_candidate("c1", 1.0)]
    vec  = [_make_vector_candidate("c1", 1.0)]
    fused_k1  = reciprocal_rank_fusion(bm25, vec, k=1)
    fused_k60 = reciprocal_rank_fusion(bm25, vec, k=60)
    # Lower k = higher score per rank
    assert fused_k1[0].rrf_score > fused_k60[0].rrf_score


def test_rrf_empty_inputs():
    fused = reciprocal_rank_fusion([], [])
    assert fused == []


def test_rrf_only_bm25():
    bm25 = [_make_bm25_candidate("c1", 3.0), _make_bm25_candidate("c2", 1.0)]
    fused = reciprocal_rank_fusion(bm25, [])
    assert len(fused) == 2


def test_rrf_only_vector():
    vec = [_make_vector_candidate("v1", 0.9), _make_vector_candidate("v2", 0.7)]
    fused = reciprocal_rank_fusion([], vec)
    assert len(fused) == 2


# ─── Metadata filter tests ───────────────────────────────────────────────────

def _fused(chunk_id: str, domain: str, jurisdiction: str) -> FusedCandidate:
    return FusedCandidate(
        chunk_id=chunk_id, text="t", domain=domain, jurisdiction=jurisdiction,
        section_title="", source_title="", corpus_version="v1",
    )


def test_metadata_filter_by_domain():
    candidates = [
        _fused("c1", "patents", "IN"),
        _fused("c2", "fssai", "IN"),
    ]
    result = metadata_filter(candidates, domain="patents")
    assert all(c.domain == "patents" for c in result)
    assert len(result) == 1


def test_metadata_filter_by_jurisdiction():
    candidates = [
        _fused("c1", "patents", "IN"),
        _fused("c2", "patents", "WO"),
    ]
    result = metadata_filter(candidates, jurisdiction="IN")
    assert all(c.jurisdiction == "IN" for c in result)


def test_metadata_filter_auto_passes_all():
    candidates = [
        _fused("c1", "patents", "IN"),
        _fused("c2", "fssai", "WO"),
    ]
    result = metadata_filter(candidates, domain="auto", jurisdiction="auto")
    assert len(result) == 2


def test_metadata_filter_empty_input():
    assert metadata_filter([], domain="patents") == []


# ─── Async DB-backed BM25 test ───────────────────────────────────────────────

@pytest.mark.asyncio
async def test_bm25_build_from_db():
    """Build BM25 from real DB (requires Phase 2 ingestion to have run)."""
    retriever = BM25Retriever()
    await retriever.build()
    if not retriever.is_built():
        pytest.skip("DB empty — run ingestion first")
    results = retriever.search("traditional knowledge patent Ayurveda", top_k=5)
    # If DB has chunks, we expect results
    assert isinstance(results, list)
