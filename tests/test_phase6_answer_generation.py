"""
tests/test_phase6_answer_generation.py
──────────────────────────────────────
End-to-end integration tests for Phase 6 answer generation.
Tests normal US inquiry, global inquiry, and provenance mapping.
"""
import pytest
from backend.app.models.rag_schemas import RAGAnswerRequest
from backend.app.rag.pipeline import phase6_rag_pipeline


@pytest.fixture(scope="module")
def pipeline():
    return phase6_rag_pipeline


@pytest.mark.asyncio
async def test_normal_us_question_end_to_end(pipeline):
    req = RAGAnswerRequest(query="What are the US patent requirements for rosacea treatments?", top_k=3)
    resp = await pipeline.generate_answer(req)
    assert resp.status in ["SUCCESS", "PARTIALLY_VALIDATED"]
    assert resp.detected_language == "en"
    assert resp.jurisdictions == ["US"]
    assert len(resp.citations) > 0
    assert "[E1]" in resp.answer
    assert resp.disclaimer != ""


@pytest.mark.asyncio
async def test_global_query_end_to_end(pipeline):
    req = RAGAnswerRequest(query="Novel bioactive formulations and delivery systems", top_k=4)
    resp = await pipeline.generate_answer(req)
    assert resp.status in ["SUCCESS", "PARTIALLY_VALIDATED"]
    assert set(resp.jurisdictions) == {"US", "EP", "WO", "JP"}
    assert len(resp.citations) > 0
    for c in resp.citations:
        assert c.jurisdiction in ["US", "EP", "WO", "JP"]
