"""
tests/test_phase7_regression.py
───────────────────────────────
Regression test suite across Phase 2 through Phase 7.
Ensures Phase 7 additions do not break Phase 2-6 core invariants:
  - Phase 3/4 corpus & FAISS integrity (dim=1024, BGE-M3)
  - Phase 5 hybrid retrieval & jurisdiction isolation (US, EP, WO, JP; NO DE, NO IN in production)
  - Phase 6 CRAG & evidence-grounded answer generation
  - Phase 7 Decision engine determinism
"""
import pytest
from backend.app.retrieval.config import retrieval_config
from backend.app.retrieval.jurisdiction_guard import verify_jurisdiction_safety, JurisdictionViolationError
from backend.app.models.retrieval_schemas import RetrievalSearchRequest
from backend.app.retrieval.production_pipeline import production_retrieval_pipeline
from backend.app.models.rag_schemas import RAGAnswerRequest
from backend.app.rag.pipeline import phase6_rag_pipeline
from backend.app.models.decision_schemas import DecisionRequest, DecisionType, DecisionConfidence
from backend.app.decision.pipeline import phase7_decision_pipeline


def test_regression_active_jurisdictions():
    """Verify active jurisdictions remain US, EP, WO, JP and DE/IN are forbidden in production."""
    assert set(retrieval_config.active_jurisdictions) == {"US", "EP", "WO", "JP"}
    assert "DE" in retrieval_config.forbidden_jurisdictions
    assert "IN" in retrieval_config.forbidden_jurisdictions


def test_regression_jurisdiction_guard_blocks_de():
    """Verify Jurisdiction Guard strictly blocks DE in candidate lists."""
    bad_candidates = [{"jurisdiction": "DE", "chunk_id": "c1"}]
    with pytest.raises(JurisdictionViolationError):
        verify_jurisdiction_safety(bad_candidates, ["US"], stage_name="Test")


def test_regression_phase5_hybrid_retrieval():
    """Verify Phase 5 production retrieval pipeline returns ranked results safely."""
    req = RetrievalSearchRequest(query="topical rosacea metronidazole formulation", jurisdiction="US", top_k=3)
    resp = production_retrieval_pipeline.search(req)
    assert resp.status == "success"
    assert len(resp.results) > 0
    assert all(r.jurisdiction == "US" for r in resp.results)


@pytest.mark.asyncio
async def test_regression_phase6_rag_pipeline():
    """Verify Phase 6 RAG pipeline generates grounded citations."""
    req = RAGAnswerRequest(query="What is disclosed in US patent for topical rosacea?", jurisdiction="US", top_k=3)
    resp = await phase6_rag_pipeline.generate_answer(req)
    assert resp.status in ("SUCCESS", "PARTIALLY_VALIDATED")
    assert resp.crag_status in ("GOOD", "PARTIAL")
    assert len(resp.citations) > 0


@pytest.mark.asyncio
async def test_regression_phase7_decision_pipeline():
    """Verify Phase 7 Decision engine deterministically returns DecisionResponse."""
    req = DecisionRequest(query="Can I sell an ashwagandha extract supplement in the USA?", jurisdiction="US", top_k=3)
    resp = await phase7_decision_pipeline.execute(req)
    assert resp.decision == DecisionType.CONDITIONAL_YES
    assert "US" in resp.jurisdictions_searched
    assert len(resp.evidence) > 0


@pytest.mark.asyncio
async def test_regression_valid_retrieval_does_not_produce_insufficient_evidence():
    """
    CRITICAL REGRESSION TEST:
    Valid retrieval evidence must NOT produce INSUFFICIENT_EVIDENCE.
    Real end-to-end query with valid evidence must produce CONDITIONAL_YES.
    """
    req = DecisionRequest(
        query="I have an Ayurvedic product patented in India. Can I sell it in USA?",
        top_k=5
    )
    resp = await phase7_decision_pipeline.execute(req)
    assert resp.decision == DecisionType.CONDITIONAL_YES
    assert resp.decision != DecisionType.INSUFFICIENT_EVIDENCE
    assert resp.confidence in (DecisionConfidence.HIGH, DecisionConfidence.MEDIUM)
    assert len(resp.evidence) > 0
    assert "US" in resp.jurisdictions_searched


@pytest.mark.asyncio
async def test_regression_unsupported_query_produces_insufficient_evidence():
    """
    Genuinely unsupported inquiry with noise-only retrieval must produce INSUFFICIENT_EVIDENCE.
    """
    req = DecisionRequest(
        query="Can I sell xyzzy9999_unsupported_nonexistent in USA?",
        top_k=5
    )
    resp = await phase7_decision_pipeline.execute(req)
    assert resp.decision == DecisionType.INSUFFICIENT_EVIDENCE
    assert resp.confidence == DecisionConfidence.LOW


@pytest.mark.asyncio
async def test_origin_india_target_us():
    """
    Verify origin = IN, target = US routes decision to US jurisdiction,
    target evidence drives decision, and origin is labeled as context only.
    """
    req = DecisionRequest(
        query="I have an Ayurvedic product patented in India. Can I sell it in USA?",
        top_k=5
    )
    resp = await phase7_decision_pipeline.execute(req)
    assert resp.origin_jurisdiction == "IN"
    assert resp.target_jurisdiction == "US"
    assert resp.decision_jurisdiction == "US"
    assert resp.decision == DecisionType.CONDITIONAL_YES
    assert resp.origin_evidence_note is not None
    assert "India" in resp.origin_evidence_note or "Indian" in resp.origin_evidence_note
    assert resp.target_evidence_note is not None
    assert len(resp.target_evidence) > 0


@pytest.mark.asyncio
async def test_origin_us_target_japan():
    """
    Verify origin = US, target = JP routes decision to JP jurisdiction.
    """
    req = DecisionRequest(
        query="I have a patented herbal formulation in the USA. Can I market it in Japan?",
        top_k=5
    )
    resp = await phase7_decision_pipeline.execute(req)
    assert resp.origin_jurisdiction == "US"
    assert resp.target_jurisdiction == "JP"
    assert resp.decision_jurisdiction == "JP"
    assert resp.target_evidence_note is not None


@pytest.mark.asyncio
async def test_origin_japan_target_us():
    """
    Verify origin = JP, target = US routes decision to US jurisdiction.
    """
    req = DecisionRequest(
        query="I hold a Japanese patent for Kampo herbal medicine. Can I sell it in the United States?",
        top_k=5
    )
    resp = await phase7_decision_pipeline.execute(req)
    assert resp.origin_jurisdiction == "JP"
    assert resp.target_jurisdiction == "US"
    assert resp.decision_jurisdiction == "US"
    assert resp.decision != DecisionType.INSUFFICIENT_EVIDENCE


@pytest.mark.asyncio
async def test_missing_origin_evidence_does_not_make_target_insufficient():
    """
    Missing or low evidence for the origin jurisdiction must NOT cause
    the target commercialization decision to become INSUFFICIENT_EVIDENCE.
    """
    req = DecisionRequest(
        query="I have an Ayurvedic product patented in India. Can I sell it in USA?",
        top_k=5
    )
    resp = await phase7_decision_pipeline.execute(req)
    # Even if origin_evidence is empty or minimal, target decision must succeed
    assert resp.decision == DecisionType.CONDITIONAL_YES
    assert resp.evidence_sufficiency.evidence_sufficient is True


@pytest.mark.asyncio
async def test_missing_target_evidence_returns_target_specific_insufficient():
    """
    When evidence for the target jurisdiction is absent/noise,
    decision must be INSUFFICIENT_EVIDENCE scoped to the target jurisdiction.
    """
    req = DecisionRequest(
        query="I have a product patented in India. Can I sell xyzzy9999_unsupported_nonexistent in USA?",
        top_k=5
    )
    resp = await phase7_decision_pipeline.execute(req)
    assert resp.decision == DecisionType.INSUFFICIENT_EVIDENCE
    assert resp.decision_jurisdiction == "US"


@pytest.mark.asyncio
async def test_india_evaluation_data_never_enters_us_production():
    """
    Verify India evaluation data never contaminates US production retrieval.
    """
    req = DecisionRequest(
        query="I have an Ayurvedic product patented in India. Can I sell it in USA?",
        top_k=5
    )
    resp = await phase7_decision_pipeline.execute(req)
    # Production jurisdictions searched must strictly NOT contain IN
    assert "IN" not in resp.jurisdictions_searched
    assert "US" in resp.jurisdictions_searched
    # Production target evidence must all be US
    assert all(e["jurisdiction"] == "US" for e in resp.target_evidence)


@pytest.mark.asyncio
async def test_ui_labels_insufficient_evidence_with_scope():
    """
    Verify evidence notes provide explicit scoping rather than generic 'Insufficient Data'.
    """
    req = DecisionRequest(
        query="I have an Ayurvedic product patented in India. Can I sell it in USA?",
        top_k=5
    )
    resp = await phase7_decision_pipeline.execute(req)
    assert "origin context" in resp.origin_evidence_note.lower()
    assert "target" in resp.target_evidence_note.lower()

