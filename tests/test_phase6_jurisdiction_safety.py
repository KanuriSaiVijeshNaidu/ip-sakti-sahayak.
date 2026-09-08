"""
tests/test_phase6_jurisdiction_safety.py
────────────────────────────────────────
Tests for strict jurisdiction preservation across RAG generation:
- US-only query returns only US citations
- JP-only query returns only JP citations
- EP-only query returns only EP citations
- WO-only query returns only WO citations
- Comparison query (US + JP) includes both with correct attribution
- Forbidden queries (IN, DE) are blocked
"""
import pytest
from backend.app.models.rag_schemas import RAGAnswerRequest
from backend.app.rag.pipeline import phase6_rag_pipeline


@pytest.fixture(scope="module")
def pipeline():
    return phase6_rag_pipeline


@pytest.mark.asyncio
async def test_us_jurisdiction_safety(pipeline):
    req = RAGAnswerRequest(query="What are the US patent requirements for rosacea treatments?", top_k=3)
    resp = await pipeline.generate_answer(req)
    assert resp.jurisdictions == ["US"]
    assert len(resp.citations) > 0
    for c in resp.citations:
        assert c.jurisdiction == "US"


@pytest.mark.asyncio
async def test_jp_jurisdiction_safety(pipeline):
    req = RAGAnswerRequest(query="What patents exist in Japan for formulation compositions?", top_k=3)
    resp = await pipeline.generate_answer(req)
    assert resp.jurisdictions == ["JP"]
    for c in resp.citations:
        assert c.jurisdiction == "JP"


@pytest.mark.asyncio
async def test_ep_jurisdiction_safety(pipeline):
    req = RAGAnswerRequest(query="Search European patent specifications for pharmaceuticals", top_k=3)
    resp = await pipeline.generate_answer(req)
    assert resp.jurisdictions == ["EP"]
    for c in resp.citations:
        assert c.jurisdiction == "EP"


@pytest.mark.asyncio
async def test_wo_jurisdiction_safety(pipeline):
    req = RAGAnswerRequest(query="PCT international patent applications for medical treatments", top_k=3)
    resp = await pipeline.generate_answer(req)
    assert resp.jurisdictions == ["WO"]
    for c in resp.citations:
        assert c.jurisdiction == "WO"


@pytest.mark.asyncio
async def test_comparison_jurisdiction_safety(pipeline):
    req = RAGAnswerRequest(query="Compare US and Japanese patent evidence for formulation compositions", top_k=4)
    resp = await pipeline.generate_answer(req)
    assert set(resp.jurisdictions) == {"JP", "US"}
    for c in resp.citations:
        assert c.jurisdiction in ["JP", "US"]


@pytest.mark.asyncio
async def test_forbidden_jurisdiction_rejection(pipeline):
    req = RAGAnswerRequest(query="German patent application at DPMA", top_k=3)
    with pytest.raises(ValueError, match="Germany"):
        await pipeline.generate_answer(req)
