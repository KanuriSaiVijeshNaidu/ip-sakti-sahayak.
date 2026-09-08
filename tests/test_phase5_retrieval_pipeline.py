"""
tests/test_phase5_retrieval_pipeline.py
───────────────────────────────────────
End-to-end integration tests for Phase 5 hybrid retrieval pipeline across
the 10 required real-world scenarios.
Verifies Query Analysis, Dual-Stream retrieval, RRF, CrossEncoder reranking,
Jurisdiction Isolation, and EvidenceResult formatting.
"""
import pytest
from backend.app.models.retrieval_schemas import RetrievalSearchRequest
from backend.app.retrieval.production_pipeline import production_retrieval_pipeline


@pytest.fixture(scope="module")
def pipeline():
    production_retrieval_pipeline.warm_up()
    return production_retrieval_pipeline


def test_scenario_1_us_end_to_end(pipeline):
    req = RetrievalSearchRequest(query="What are the US patent requirements for rosacea treatments?", top_k=5)
    resp = pipeline.search(req)

    assert resp.status == "success"
    assert resp.query_analysis.detected_language == "en"
    assert resp.searched_jurisdictions == ["US"]
    assert len(resp.results) <= 5
    assert len(resp.results) > 0
    for res in resp.results:
        assert res.jurisdiction == "US"
        assert res.text != ""
        assert res.final_rank >= 1


def test_scenario_2_japan_english_end_to_end(pipeline):
    req = RetrievalSearchRequest(query="What patents exist in Japan for formulation compositions?", top_k=5)
    resp = pipeline.search(req)

    assert resp.status == "success"
    assert resp.query_analysis.detected_language == "en"
    assert resp.searched_jurisdictions == ["JP"]
    for res in resp.results:
        assert res.jurisdiction == "JP"


def test_scenario_3_japan_japanese_end_to_end(pipeline):
    req = RetrievalSearchRequest(query="日本における抽出物組成物の特許", top_k=5)
    resp = pipeline.search(req)

    assert resp.status == "success"
    assert resp.query_analysis.detected_language == "ja"
    assert resp.searched_jurisdictions == ["JP"]
    for res in resp.results:
        assert res.jurisdiction == "JP"
        assert res.language == "ja"


def test_scenario_4_europe_end_to_end(pipeline):
    req = RetrievalSearchRequest(query="Search European patent specifications for pharmaceuticals", top_k=5)
    resp = pipeline.search(req)

    assert resp.status == "success"
    assert resp.searched_jurisdictions == ["EP"]
    for res in resp.results:
        assert res.jurisdiction == "EP"


def test_scenario_5_wipo_pct_end_to_end(pipeline):
    req = RetrievalSearchRequest(query="PCT international patent applications for medical treatments", top_k=5)
    resp = pipeline.search(req)

    assert resp.status == "success"
    assert resp.searched_jurisdictions == ["WO"]
    for res in resp.results:
        assert res.jurisdiction == "WO"


def test_scenario_6_global_unspecified_end_to_end(pipeline):
    req = RetrievalSearchRequest(query="Novel bioactive formulations and delivery systems", top_k=8)
    resp = pipeline.search(req)

    assert resp.status == "success"
    assert set(resp.searched_jurisdictions) == {"US", "EP", "WO", "JP"}
    for res in resp.results:
        assert res.jurisdiction in {"US", "EP", "WO", "JP"}


def test_scenario_7_comparison_end_to_end(pipeline):
    req = RetrievalSearchRequest(query="Compare patent requirements in Japan and the US", top_k=6)
    resp = pipeline.search(req)

    assert resp.status == "success"
    assert set(resp.searched_jurisdictions) == {"JP", "US"}
    for res in resp.results:
        assert res.jurisdiction in {"JP", "US"}


def test_scenario_8_japanese_asking_about_us(pipeline):
    """
    CRITICAL TEST: Japanese language query explicitly asking about US.
    Verifies that language detection != jurisdiction routing.
    """
    req = RetrievalSearchRequest(query="米国特許の要件は何ですか？", top_k=5)
    resp = pipeline.search(req)

    assert resp.status == "success"
    assert resp.query_analysis.detected_language == "ja"
    assert resp.searched_jurisdictions == ["US"]
    for res in resp.results:
        assert res.jurisdiction == "US"


def test_scenario_9_english_asking_about_japan(pipeline):
    req = RetrievalSearchRequest(query="Can I patent this composition in Japan?", top_k=5)
    resp = pipeline.search(req)

    assert resp.status == "success"
    assert resp.query_analysis.detected_language == "en"
    assert resp.searched_jurisdictions == ["JP"]
    for res in resp.results:
        assert res.jurisdiction == "JP"


def test_scenario_10_unspecified_query(pipeline):
    req = RetrievalSearchRequest(query="Synergistic antioxidant compositions", top_k=5)
    resp = pipeline.search(req)

    assert resp.status == "success"
    assert resp.query_analysis.routing_mode == "global"
    assert set(resp.searched_jurisdictions) == {"US", "EP", "WO", "JP"}
    assert len(resp.results) > 0
    # Provenance fields must be intact
    first = resp.results[0]
    assert first.chunk_id != ""
    assert first.publication_number != ""
    assert first.final_rank == 1
