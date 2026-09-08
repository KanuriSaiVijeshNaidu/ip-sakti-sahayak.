"""
tests/test_phase7_decision_engine.py
────────────────────────────────────
Automated unit & integration test suite for Phase 7 Decision & Jurisdiction Reasoning Engine.

Validates all 10 mandatory Phase 7 test specifications:
  TEST 1: Indian patent -> sell in USA (target=US, India not production target)
  TEST 2: US patent -> sell in USA (US patent + US regulatory analysis)
  TEST 3: US patent -> sell in Japan (target=JP)
  TEST 4: Japanese query -> Japan (lang=ja, jurisdiction=JP)
  TEST 5: English query -> Japan (lang=en, target=JP)
  TEST 6: Global query (production jurs: US, EP, WO, JP; NEVER IN, NEVER DE)
  TEST 7: India evaluation query (evaluation-only, not production retrieval)
  TEST 8: Unsupported commercialization question (INSUFFICIENT_EVIDENCE)
  TEST 9: FTO question (no unsupported FTO clearance, disclaimer present)
  TEST 10: German jurisdiction request (rejected, not available in active scope)
"""
import pytest
import asyncio
from backend.app.models.decision_schemas import (
    DecisionType,
    DecisionConfidence,
    UserObjective,
    QueryIntent,
    DecisionRequest,
    DecisionResponse,
)
from backend.app.decision.intent_extractor import extract_intent
from backend.app.decision.rule_engine import decision_rule_engine
from backend.app.decision.pipeline import phase7_decision_pipeline
from backend.app.retrieval.config import retrieval_config


# ─── TEST 1: Indian Patent -> Sell in USA ─────────────────────────────────────
@pytest.mark.asyncio
async def test_1_indian_patent_sell_in_usa():
    """
    User query: 'I have an Indian patent for curcumin formulation. Can I sell it in the USA?'
    Expected:
      - origin = IN, target = US
      - Target jurisdiction US takes priority for commercialization
      - Searched jurisdiction must be US (NOT IN)
      - Decision must enforce patent territoriality (Indian patent != US rights)
    """
    query = "I have an Indian patent for curcumin formulation. Can I sell it in the USA?"
    intent = extract_intent(query)
    assert intent.origin_country == "IN"
    assert intent.target_country == "US"
    assert intent.is_commercialization_question is True

    req = DecisionRequest(query=query, top_k=3)
    resp: DecisionResponse = await phase7_decision_pipeline.execute(req)

    # Target jurisdiction priority
    assert "US" in resp.jurisdictions_searched
    assert "IN" not in resp.jurisdictions_searched
    assert resp.evaluation_only is False
    assert resp.decision in (DecisionType.CONDITIONAL_YES, DecisionType.INSUFFICIENT_EVIDENCE)

    # Patent territoriality check: must mention territoriality or India does not grant US rights
    full_text = resp.why + " " + resp.patent_analysis
    assert "territorial" in full_text.lower() or "india" in full_text.lower()


# ─── TEST 2: US Patent -> Sell in USA ─────────────────────────────────────────
@pytest.mark.asyncio
async def test_2_us_patent_sell_in_usa():
    """
    User query: 'Can I commercially sell a topical rosacea formulation in USA?'
    Expected:
      - Target jurisdiction: US
      - US regulatory analysis (FDA / FD&C Act / NDA / OTC)
      - Deterministic decision: CONDITIONAL_YES
    """
    query = "Can I commercially sell a topical rosacea formulation in USA?"
    req = DecisionRequest(query=query, top_k=3)
    resp: DecisionResponse = await phase7_decision_pipeline.execute(req)

    assert "US" in resp.jurisdictions_searched
    assert "FDA" in resp.regulatory_analysis or "United States" in resp.regulatory_analysis
    assert resp.decision == DecisionType.CONDITIONAL_YES


# ─── TEST 3: US Patent -> Sell in Japan ───────────────────────────────────────
@pytest.mark.asyncio
async def test_3_us_patent_sell_in_japan():
    """
    User query: 'I hold a US patent. Can I export and sell my herbal extract in Japan?'
    Expected:
      - origin = US, target = JP
      - Target jurisdiction = JP
      - PMDA / MHLW / 薬機法 reference in regulatory analysis
    """
    query = "I hold a US patent. Can I export and sell my herbal extract in Japan?"
    intent = extract_intent(query)
    assert intent.target_country == "JP"

    req = DecisionRequest(query=query, top_k=3)
    resp: DecisionResponse = await phase7_decision_pipeline.execute(req)

    assert "JP" in resp.jurisdictions_searched
    assert resp.decision == DecisionType.CONDITIONAL_YES
    assert "Japan" in resp.regulatory_analysis or "PMDA" in resp.regulatory_analysis or "MHLW" in resp.regulatory_analysis


# ─── TEST 4: Japanese Query -> Japan ──────────────────────────────────────────
@pytest.mark.asyncio
async def test_4_japanese_query_japan():
    """
    User query in Japanese for Japan market.
    Expected:
      - detected_language = ja
      - target jurisdiction = JP
      - Response includes Japanese structured fields
    """
    query = "日本において生薬抽出物を含有する医薬品組成物を販売することは可能ですか？"
    req = DecisionRequest(query=query, top_k=3)
    resp: DecisionResponse = await phase7_decision_pipeline.execute(req)

    assert resp.detected_language == "ja"
    assert "JP" in resp.jurisdictions_searched
    # Check Japanese formatting in response
    assert "【判断理由】" in resp.why or "要件" in str(resp.conditions)


# ─── TEST 5: English Query -> Japan ───────────────────────────────────────────
@pytest.mark.asyncio
async def test_5_english_query_japan():
    """
    English query explicitly targeting Japan.
    Expected:
      - language = en
      - target = JP
      - JP retrieval
    """
    query = "What are the patent and regulatory requirements to sell herbal extract formulations in Japan?"
    req = DecisionRequest(query=query, top_k=3)
    resp: DecisionResponse = await phase7_decision_pipeline.execute(req)

    assert resp.detected_language == "en"
    assert "JP" in resp.jurisdictions_searched
    assert "Japan" in resp.regulatory_analysis or "PMDA" in resp.regulatory_analysis


# ─── TEST 6: Global Query ─────────────────────────────────────────────────────
@pytest.mark.asyncio
async def test_6_global_query():
    """
    General query with no explicit single jurisdiction.
    Expected:
      - Production jurisdictions: US, EP, WO, JP
      - Strictly NEVER IN in production search
      - Strictly NEVER DE
    """
    query = "What are the global patent trends for synergistic polyherbal compositions?"
    req = DecisionRequest(query=query, top_k=4)
    resp: DecisionResponse = await phase7_decision_pipeline.execute(req)

    for jur in ["US", "EP", "WO", "JP"]:
        assert jur in resp.jurisdictions_searched

    assert "IN" not in resp.jurisdictions_searched
    assert "DE" not in resp.jurisdictions_searched


# ─── TEST 7: India Evaluation Query ───────────────────────────────────────────
@pytest.mark.asyncio
async def test_7_india_evaluation_query():
    """
    Query specifically asking about Indian patent law / Section 3(e) / Section 3(p).
    Expected:
      - Routed to evaluation-only mode (evaluation_only = True)
      - IN is NOT treated as a production commercialization target
    """
    query = "How does the Indian Patent Office evaluate Section 3(e) traditional knowledge patent applications in India?"
    req = DecisionRequest(query=query, jurisdiction="IN", top_k=3)
    resp: DecisionResponse = await phase7_decision_pipeline.execute(req)

    assert resp.evaluation_only is True


# ─── TEST 8: Unsupported Commercialization Question ───────────────────────────
def test_8_unsupported_commercialization():
    """
    When evidence is completely absent or empty.
    Expected:
      - DecisionType = INSUFFICIENT_EVIDENCE
      - Confidence = LOW
      - Missing categories identified
    """
    intent = QueryIntent(
        product="UnknownSubstanceXYZ999",
        user_objective=UserObjective.SELL,
        is_commercialization_question=True,
    )
    from backend.app.models.rag_schemas import CRAGAssessment
    crag = CRAGAssessment(
        status="INSUFFICIENT",
        confidence=0.1,
        reason="No citations found",
        evidence_count=0,
        usable_evidence_count=0,
        jurisdiction_match=False,
        metadata_complete=False,
        duplicate_ratio=0.0,
    )

    decision, why, analysis, sufficiency, confidence = decision_rule_engine.evaluate(
        intent=intent,
        citations=[],
        crag=crag,
        target_jurisdictions=["US"],
    )

    assert decision == DecisionType.INSUFFICIENT_EVIDENCE
    assert confidence == DecisionConfidence.LOW
    assert sufficiency.evidence_sufficient is False


# ─── TEST 9: FTO Question (No Unsupported FTO Clearance) ─────────────────────
@pytest.mark.asyncio
async def test_9_fto_safety():
    """
    FTO inquiries must NEVER conclude 'FTO confirmed'.
    Must include clear safety disclaimer and indicate further claim-level analysis is required.
    """
    query = "Do I have complete freedom to operate to sell curcumin capsules in the USA?"
    req = DecisionRequest(query=query, top_k=3)
    resp: DecisionResponse = await phase7_decision_pipeline.execute(req)

    # Must NEVER claim FTO is confirmed
    full_output = (resp.why + " " + resp.ip_fto_analysis + " " + resp.disclaimer).lower()
    assert "fto confirmed" not in full_output
    assert "freedom to operate confirmed" not in full_output
    assert "potential ip risk" in full_output or "formal freedom to operate" in full_output or "claim-by-claim" in full_output or "clearance" in full_output


# ─── TEST 10: German Jurisdiction Request Rejected ────────────────────────────
@pytest.mark.asyncio
async def test_10_german_jurisdiction_rejected():
    """
    Request explicitly targeting Germany (DE) must be rejected with an exception (HTTP 400).
    """
    query = "Can I sell this ayurvedic cream in Germany under DPMA patents?"
    req = DecisionRequest(query=query, jurisdiction="DE", top_k=3)

    with pytest.raises(ValueError) as excinfo:
        await phase7_decision_pipeline.execute(req)

    assert "Germany (DE) has been REMOVED" in str(excinfo.value)
