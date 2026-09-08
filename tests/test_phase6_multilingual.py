"""
tests/test_phase6_multilingual.py
─────────────────────────────────
Tests for multilingual behavior in Phase 6:
- Japanese query asking about US (Language != Jurisdiction):
  Answer is in Japanese, citations are strictly US.
- Japanese query asking about Japan:
  Answer is in Japanese, citations are strictly JP.
- English query asking about Japan:
  Answer is in English, citations are strictly JP.
"""
import pytest
from backend.app.models.rag_schemas import RAGAnswerRequest
from backend.app.rag.pipeline import phase6_rag_pipeline


@pytest.fixture(scope="module")
def pipeline():
    return phase6_rag_pipeline


@pytest.mark.asyncio
async def test_japanese_query_asking_about_us(pipeline):
    """
    CRITICAL TEST: Language != Jurisdiction.
    User asks in Japanese about US patents.
    Expected: Answer in Japanese, Citations strictly US, zero JP citations.
    """
    req = RAGAnswerRequest(query="米国特許の要件は何ですか？", top_k=3)
    resp = await pipeline.generate_answer(req)
    assert resp.detected_language == "ja"
    assert resp.jurisdictions == ["US"]
    assert len(resp.citations) > 0
    for c in resp.citations:
        assert c.jurisdiction == "US"


@pytest.mark.asyncio
async def test_japanese_query_asking_about_japan(pipeline):
    req = RAGAnswerRequest(query="日本における抽出物組成物の特許", top_k=3)
    resp = await pipeline.generate_answer(req)
    assert resp.detected_language == "ja"
    assert resp.jurisdictions == ["JP"]
    for c in resp.citations:
        assert c.jurisdiction == "JP"
        assert c.language == "ja"


@pytest.mark.asyncio
async def test_english_query_asking_about_japan(pipeline):
    req = RAGAnswerRequest(query="Can I patent this composition in Japan?", top_k=3)
    resp = await pipeline.generate_answer(req)
    assert resp.detected_language == "en"
    assert resp.jurisdictions == ["JP"]
    for c in resp.citations:
        assert c.jurisdiction == "JP"
