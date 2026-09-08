"""
tests/test_phase6_insufficient_evidence.py
──────────────────────────────────────────
Tests for insufficient evidence and unsupported legal conclusion handling:
- Unsupported legal clearance question ("Can I legally sell this product in the USA?")
  must return an evidence-limited response rather than a flat "Yes" or "No".
- Empty retrieval results trigger CRAG INSUFFICIENT with clear user guidance.
"""
import pytest
from backend.app.models.rag_schemas import RAGAnswerRequest
from backend.app.rag.pipeline import phase6_rag_pipeline


@pytest.fixture(scope="module")
def pipeline():
    return phase6_rag_pipeline


@pytest.mark.asyncio
async def test_unsupported_legal_clearance_query(pipeline):
    req = RAGAnswerRequest(query="Can I legally sell this product in the USA?", jurisdiction="US", top_k=3)
    resp = await pipeline.generate_answer(req)
    assert resp.crag_status == "PARTIAL"
    ans_lower = resp.answer.lower()
    # Must NOT give an unconditional "Yes, you can sell"
    assert "freedom-to-operate" in ans_lower or "regulatory" in ans_lower or "commercial" in ans_lower
    assert len(resp.limitations) > 0


@pytest.mark.asyncio
async def test_insufficient_evidence_response(monkeypatch, pipeline):
    from backend.app.retrieval.production_pipeline import production_retrieval_pipeline
    from backend.app.models.retrieval_schemas import RetrievalSearchResponse, QueryAnalysis

    # Mock empty retrieval
    def mock_empty_search(req):
        return RetrievalSearchResponse(
            query_analysis=QueryAnalysis(
                original_query=req.query,
                normalized_query=req.query,
                detected_language="en",
                intent="patent_search",
                routing_mode="explicit_single",
                routing_reason="test",
                jurisdictions=["US"],
            ),
            routing_decision="test",
            searched_jurisdictions=["US"],
            dense_candidate_count=0,
            lexical_candidate_count=0,
            fused_candidate_count=0,
            reranked_candidate_count=0,
            final_candidate_count=0,
            results=[],
            latencies_ms={},
        )

    monkeypatch.setattr(production_retrieval_pipeline, "search", mock_empty_search)
    req = RAGAnswerRequest(query="xyz nonexistent query", jurisdiction="US", top_k=3)
    resp = await pipeline.generate_answer(req)
    assert resp.crag_status == "INSUFFICIENT"
    assert "insufficient" in resp.answer.lower()
