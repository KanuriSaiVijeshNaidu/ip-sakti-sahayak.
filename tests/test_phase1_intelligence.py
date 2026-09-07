"""
tests/test_phase1_intelligence.py
──────────────────────────────────
Automated verification test suite for Phase 1 India-First Intelligence Engine
and multi-jurisdiction comparative services.
"""
import pytest
from backend.app.services.entity_extractor import match_botanical_entity, extract_entities_from_text
from backend.app.services.formulation_analyzer import analyze_formulation
from backend.app.services.tk_risk_engine import assess_tk_risk
from backend.app.services.patentability_engine import assess_patentability
from backend.app.services.intent_router import classify_and_route
from backend.app.services.evidence_verifier import verify_claims_against_evidence
from backend.app.services.confidence_engine import compute_confidence
from backend.app.services.action_plan import generate_action_plan
from backend.app.services.knowledge_graph import query_knowledge_graph
from backend.app.services.jurisdiction_engine import compare_jurisdictions
from backend.app.services.evaluation import run_benchmark_evaluation
from backend.app.models.schemas import (
    FormulationAnalysisRequest,
    TKRiskRequest,
    PatentabilityRequest,
    JurisdictionComparisonRequest,
    CitedPassage,
)


def test_entity_extractor():
    """Verify botanical and Sanskrit normalization."""
    turmeric = match_botanical_entity("Turmeric")
    assert turmeric is not None
    assert turmeric.botanical_name == "Curcuma longa L."
    assert "Zingiberaceae" in turmeric.family
    assert "Curcumin" in turmeric.active_compounds

    pepper = match_botanical_entity("Piper nigrum")
    assert pepper is not None
    assert pepper.common_name == "Black Pepper"


def test_formulation_analyzer():
    """Verify formulation component normalization and classical recipe correlation."""
    req = FormulationAnalysisRequest(
        formulation_name="Test Deepana Compound",
        ingredients=["Turmeric", "Black Pepper", "Dry Ginger"],
        dosage_form="Churna",
    )
    res = analyze_formulation(req)
    assert len(res.botanical_entities) == 3
    assert len(res.classical_formulation_matches) >= 1
    assert any("Trikatu" in m["formulation_name"] or "Haridra" in m["formulation_name"] for m in res.classical_formulation_matches)


def test_tk_risk_engine():
    """Verify TKDL overlap and graded risk classification."""
    req = TKRiskRequest(ingredients=["Turmeric", "Black Pepper"])
    res = assess_tk_risk(req)
    assert res.overall_tk_risk in ("CONFIRMED", "LIKELY")
    assert len(res.historical_revocation_precedents) >= 1
    assert len(res.evidence) >= 1


def test_patentability_engine():
    """Verify Section 3(e) admixture and Section 3(p) rejection risk analysis."""
    req = PatentabilityRequest(
        invention_title="Herbal Bio-enhancer Synergistic Complex",
        abstract_or_summary="Turmeric with piperine synergy for anti-inflammatory treatment",
        ingredients=["Turmeric", "Black Pepper"],
        is_combination=True,
        claims=["A synergistic herbal composition comprising curcumin and piperine."],
        jurisdiction="IN",
        user_role="attorney"
    )
    res = assess_patentability(req)
    assert res.section_3e_risk == "HIGH"
    assert res.section_3p_risk == "HIGH"
    assert res.overall_risk == "HIGH"
    assert len(res.action_plan) >= 3
    assert "attorney" in res.role_adapted_guidance.lower()


def test_intent_router():
    """Verify multi-domain legal routing."""
    res1 = classify_and_route("Can I patent a turmeric and black pepper formulation?")
    assert "PATENTABILITY" in res1.primary_intents or "SECTION_3_E" in res1.primary_intents
    assert "patents" in res1.target_domains

    res2 = classify_and_route("What are the FSSAI Ayurveda Aahara licensing criteria?")
    assert "FSSAI" in res2.primary_intents
    assert "fssai" in res2.target_domains


def test_evidence_verifier_and_confidence():
    """Verify claim entailment and transparent confidence."""
    passage = CitedPassage(
        passage_text="Section 3(e) excludes mere admixture of known components from patentability.",
        source_title="The Patents Act, 1970",
        domain="patents",
        jurisdiction="IN",
        relevance_score=0.95
    )
    claims = [
        "Section 3(e) excludes mere admixture",
        "Section 999 requires planetary alignment",
    ]
    verifications = verify_claims_against_evidence(claims, [passage])
    assert len(verifications) == 2
    assert verifications[0].status == "SUPPORTED"
    assert verifications[1].status == "UNSUPPORTED"

    conf = compute_confidence([passage], verifications, jurisdiction_expected="IN")
    assert conf.level in ("HIGH", "MEDIUM")


def test_jurisdiction_comparison():
    """Verify cross-jurisdiction comparison matrix across IN, US, EP, WIPO."""
    req = JurisdictionComparisonRequest(
        invention_title="Ashwagandha & Guduchi Extract",
        ingredients=["Ashwagandha", "Guduchi"]
    )
    res = compare_jurisdictions(req)
    assert len(res.comparison_matrix) >= 3
    assert len(res.action_plan) >= 2


def test_evaluation_benchmark():
    """Verify evaluation metrics output."""
    metrics = run_benchmark_evaluation(jurisdiction_filter="IN")
    assert metrics["retrieval"]["recall_at_5"] >= 0.90
    assert metrics["generation_grounding"]["groundedness_score"] >= 0.90
