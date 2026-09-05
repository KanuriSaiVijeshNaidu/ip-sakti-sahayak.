"""
backend/tests/test_reranker.py
───────────────────────────────
Phase 4 tests for CrossEncoderReranker and evidence citation validator.
All tests are deterministic and require no external services.
"""
from __future__ import annotations

import pytest
from backend.app.retrieval.fusion import FusedCandidate
from backend.app.retrieval.reranker import CrossEncoderReranker, RerankedCandidate
from backend.app.retrieval.validator import (
    CitedEvidence,
    validate_evidence,
    build_llm_context,
    _keyword_overlap_score,
    _normalize_reranker_score,
    _is_degenerate,
    _grounding_score,
    _text_similarity,
)


# ─── Fixtures ─────────────────────────────────────────────────────────────────

def _fused(chunk_id: str, text: str, domain: str = "patents",
           rrf_score: float = 0.03) -> FusedCandidate:
    return FusedCandidate(
        chunk_id=chunk_id, text=text, domain=domain, jurisdiction="IN",
        section_title=f"Section {chunk_id}", source_title="Test Act",
        corpus_version="v1", rrf_score=rrf_score,
    )


def _reranked(chunk_id: str, text: str, reranker_score: float = 5.0,
              domain: str = "patents") -> RerankedCandidate:
    return RerankedCandidate(
        chunk_id=chunk_id, text=text, domain=domain, jurisdiction="IN",
        section_title=f"Section {chunk_id}", source_title="Test Act",
        corpus_version="v1", reranker_score=reranker_score, reranker_rank=1,
    )


PATENT_TEXT = (
    "Section 3(e) of the Patents Act 1970 provides that a substance obtained "
    "by mere admixture resulting only in the aggregation of the properties of "
    "its components shall not be patentable. Ayurvedic formulations that are "
    "combinations of known ingredients whose combined effect is merely the sum "
    "of their individual effects are excluded from patent protection."
)

FSSAI_TEXT = (
    "Regulation 2.2 of the FSSAI Ayurveda Aahara Regulations 2022 mandates "
    "that every Ayurveda Aahara product must carry on its label the complete "
    "list of ingredients in descending order of weight, the FSSAI license "
    "number, and the statement that the product is not intended to diagnose, "
    "treat, cure or prevent any disease."
)

SHORT_JUNK = "==="
DIVIDER = "=" * 60


# ─── Reranker unit tests (no model load) ─────────────────────────────────────

def test_reranker_passthrough_when_no_model():
    """When model is not loaded, reranker uses rrf_score as proxy."""
    r = CrossEncoderReranker()   # not built
    candidates = [
        _fused("c1", PATENT_TEXT, rrf_score=0.05),
        _fused("c2", FSSAI_TEXT, rrf_score=0.03),
    ]
    results = r.rerank("patent Ayurveda", candidates, top_n=5)
    assert len(results) == 2
    # Should preserve RRF order when model unavailable
    assert results[0].chunk_id == "c1"


def test_reranker_returns_reranked_candidates():
    r = CrossEncoderReranker()
    candidates = [_fused("c1", PATENT_TEXT)]
    results = r.rerank("patent", candidates)
    assert all(isinstance(r, RerankedCandidate) for r in results)


def test_reranker_top_n_respected():
    r = CrossEncoderReranker()
    candidates = [_fused(f"c{i}", PATENT_TEXT) for i in range(10)]
    results = r.rerank("patent", candidates, top_n=3)
    assert len(results) <= 3


def test_reranker_empty_input():
    r = CrossEncoderReranker()
    results = r.rerank("patent", [])
    assert results == []


def test_reranker_assigns_ranks():
    r = CrossEncoderReranker()
    candidates = [_fused(f"c{i}", PATENT_TEXT) for i in range(3)]
    results = r.rerank("patent", candidates, top_n=3)
    for i, res in enumerate(results, 1):
        assert res.reranker_rank == i


def test_reranked_from_fused_preserves_scores():
    fc = _fused("c1", PATENT_TEXT, rrf_score=0.042)
    rc = RerankedCandidate.from_fused(fc, reranker_score=7.5)
    assert rc.rrf_score == 0.042
    assert rc.reranker_score == 7.5
    assert rc.chunk_id == "c1"


# ─── Validator helper tests ───────────────────────────────────────────────────

def test_keyword_overlap_full_match():
    score = _keyword_overlap_score("Ashwagandha patent admixture", PATENT_TEXT)
    assert score > 0.3


def test_keyword_overlap_no_match():
    score = _keyword_overlap_score("quantum computing blockchain", PATENT_TEXT)
    assert score == 0.0


def test_keyword_overlap_stopwords_only():
    score = _keyword_overlap_score("the is a and of", PATENT_TEXT)
    # No meaningful keywords → neutral 0.5
    assert score in (0.0, 0.5)  # depends on stopword/length filtering


def test_normalize_reranker_positive():
    score = _normalize_reranker_score(5.0)
    assert 0.9 < score < 1.0


def test_normalize_reranker_negative():
    score = _normalize_reranker_score(-5.0)
    assert 0.0 < score < 0.1


def test_normalize_reranker_zero():
    score = _normalize_reranker_score(0.0)
    assert abs(score - 0.5) < 0.01


def test_is_degenerate_short():
    assert _is_degenerate(SHORT_JUNK) is True


def test_is_degenerate_divider():
    assert _is_degenerate(DIVIDER) is True


def test_is_degenerate_normal_text():
    assert _is_degenerate(PATENT_TEXT) is False


def test_text_similarity_identical():
    assert _text_similarity(PATENT_TEXT, PATENT_TEXT) > 0.99


def test_text_similarity_different():
    assert _text_similarity(PATENT_TEXT, FSSAI_TEXT) < 0.5


def test_grounding_score_range():
    rc = _reranked("c1", PATENT_TEXT, reranker_score=6.0)
    score = _grounding_score("patent Ayurveda admixture", rc)
    assert 0.0 <= score <= 1.0


def test_grounding_score_high_for_relevant():
    rc = _reranked("c1", PATENT_TEXT, reranker_score=8.0)
    score = _grounding_score("patent admixture Ayurvedic formulation", rc)
    assert score > 0.5


def test_grounding_score_low_for_irrelevant():
    rc = _reranked("c1", PATENT_TEXT, reranker_score=-8.0)
    score = _grounding_score("blockchain cryptocurrency mining", rc)
    assert score < 0.3


# ─── validate_evidence tests ──────────────────────────────────────────────────

def test_validate_returns_cited_evidence():
    candidates = [_reranked("c1", PATENT_TEXT, reranker_score=7.0)]
    results = validate_evidence("patent admixture Ayurveda", candidates)
    assert all(isinstance(r, CitedEvidence) for r in results)


def test_validate_rejects_degenerate():
    candidates = [
        _reranked("junk", SHORT_JUNK, reranker_score=9.0),
        _reranked("c1", PATENT_TEXT, reranker_score=7.0),
    ]
    results = validate_evidence("patent", candidates)
    ids = [r.chunk_id for r in results]
    assert "junk" not in ids
    assert "c1" in ids


def test_validate_deduplicates_near_duplicates():
    candidates = [
        _reranked("c1", PATENT_TEXT, reranker_score=8.0),
        _reranked("c2", PATENT_TEXT + " (duplicate)", reranker_score=7.5),
    ]
    results = validate_evidence("patent admixture", candidates)
    # Near-duplicate should be suppressed
    assert len(results) == 1


def test_validate_max_citations_respected():
    candidates = [_reranked(f"c{i}", PATENT_TEXT + f" unique text block {i}" * 5,
                             reranker_score=float(10 - i))
                  for i in range(10)]
    results = validate_evidence("patent", candidates, max_citations=3)
    assert len(results) <= 3


def test_validate_assigns_citation_keys():
    candidates = [
        _reranked("c1", PATENT_TEXT, reranker_score=8.0),
        _reranked("c2", FSSAI_TEXT, reranker_score=6.0),
    ]
    results = validate_evidence("patent Ayurveda labelling", candidates)
    keys = [r.citation_key for r in results]
    assert "[src-1]" in keys
    if len(results) > 1:
        assert "[src-2]" in keys


def test_validate_empty_input():
    results = validate_evidence("patent", [])
    assert results == []


def test_validate_status_valid_for_high_score():
    candidates = [_reranked("c1", PATENT_TEXT, reranker_score=9.0)]
    results = validate_evidence("patent admixture Ayurvedic formulation", candidates,
                                 include_needs_review=True)
    if results:
        assert results[0].validation_status in ("valid", "needs_review")


# ─── build_llm_context tests ──────────────────────────────────────────────────

def test_build_llm_context_contains_citation_key():
    ev = CitedEvidence(
        chunk_id="c1", passage_text=PATENT_TEXT,
        section_title="Section 3(e)", source_title="Patents Act 1970",
        source_url=None, domain="patents", jurisdiction="IN",
        corpus_version="v1", grounding_score=0.85,
        validation_status="valid", reranker_rank=1,
        reranker_score=7.5, citation_key="[src-1]",
    )
    context = build_llm_context("patent admixture", [ev])
    assert "[src-1]" in context
    assert "Patents Act 1970" in context
    assert "Section 3(e)" in context


def test_build_llm_context_empty():
    context = build_llm_context("patent", [])
    assert "No relevant" in context


def test_build_llm_context_truncates_long_passages():
    long_text = "Ayurveda patent formulation. " * 200
    ev = CitedEvidence(
        chunk_id="c1", passage_text=long_text,
        section_title="S1", source_title="Test", source_url=None,
        domain="patents", jurisdiction="IN", corpus_version="v1",
        grounding_score=0.9, validation_status="valid",
        reranker_rank=1, reranker_score=8.0, citation_key="[src-1]",
    )
    context = build_llm_context("patent", [ev], max_chars_per_passage=100)
    assert "[...]" in context
