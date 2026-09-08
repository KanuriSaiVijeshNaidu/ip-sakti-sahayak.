"""
tests/test_phase2_international.py
───────────────────────────────────
Automated test suite for Phase 2 International IP Engine:
- Ingestion of US, EU, DE, and WIPO statutory corpora
- Cross-jurisdiction parallel retrieval
- Patent family priority & PCT lineage tracking
- Multi-jurisdiction comparative patentability matrix
- Multi-lingual groundedness and evaluation benchmarks
"""
import json
from pathlib import Path
import pytest

from backend.app.services.international_retrieval import search_international_corpus
from backend.app.services.patent_family import extract_patent_family_lineage
from backend.app.services.jurisdiction_engine import compare_jurisdictions
from backend.app.services.evaluation import run_benchmark_evaluation
from backend.app.models.schemas import JurisdictionComparisonRequest, CitedPassage

BASE_DIR = Path(__file__).resolve().parent.parent
INT_CHUNKS_FILE = BASE_DIR / "data" / "chunks" / "international" / "chunks.jsonl"
MASTER_CHUNKS_FILE = BASE_DIR / "data" / "chunks" / "chunks.jsonl"


def test_international_chunks_integrity():
    """Verify structure-aware chunks for USA, Europe, Germany, and WIPO treaties."""
    assert INT_CHUNKS_FILE.exists(), f"Missing {INT_CHUNKS_FILE}"
    chunks = []
    with open(INT_CHUNKS_FILE, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line:
                chunks.append(json.loads(line))

    assert len(chunks) >= 10, f"Expected at least 10 international chunks, found {len(chunks)}"

    jurisdictions_found = {c.get("jurisdiction") for c in chunks}
    assert {"US", "EU", "DE", "WO"}.issubset(jurisdictions_found), (
        f"Missing expected jurisdictions: {jurisdictions_found}"
    )

    for c in chunks:
        assert c.get("id"), "Chunk missing stable id"
        assert c.get("text"), "Chunk text cannot be empty"
        assert c.get("sha256"), "Chunk missing SHA-256 integrity hash"
        assert c.get("domain") in ("patents", "trademarks", "ayush"), f"Unexpected domain: {c.get('domain')}"
        assert c.get("authority"), "Chunk missing authoritative body"
        prefix = c["id"].split("-")[0]
        assert prefix in ("US", "EP", "EU", "DE", "WIPO"), f"Invalid chunk prefix: {prefix}"


def test_international_retrieval_uspto():
    """Verify targeted statutory retrieval for USPTO prior art and obviousness."""
    results = search_international_corpus(
        query="prior art novelty 35 U.S.C. 102 obviousness",
        target_jurisdictions=["US"],
        top_k=3,
    )
    assert len(results) >= 1
    assert all(r.jurisdiction == "US" for r in results)
    first = results[0]
    assert "US" in first.jurisdiction
    assert "USPTO" in first.source_title or "35 U.S.C" in first.section or "102" in first.section or "Patent" in first.source_title


def test_international_retrieval_epo():
    """Verify targeted statutory retrieval for EPO inventive step and exclusions."""
    results = search_international_corpus(
        query="inventive step EPC Article 56 biological material",
        target_jurisdictions=["EU"],
        top_k=3,
    )
    assert len(results) >= 1
    assert all(r.jurisdiction == "EU" for r in results)
    assert any("56" in (r.section or "") or "52" in (r.section or "") or "EPC" in (r.source_title or "") for r in results)


def test_international_retrieval_wipo():
    """Verify targeted statutory retrieval for PCT priority and 2024 Genetic Resources Treaty."""
    results = search_international_corpus(
        query="PCT Article 8 priority 12 months WIPO Treaty",
        target_jurisdictions=["WO"],
        top_k=3,
    )
    assert len(results) >= 1
    assert all(r.jurisdiction == "WO" for r in results)
    assert any("PCT" in (r.section or "") or "WIPO" in (r.source_title or "") for r in results)


def test_patent_family_lineage():
    """Verify simulated international patent family tree generation."""
    title = "Synergistic Curcumin & Piperine Nano-Emulsion Formulation"
    family = extract_patent_family_lineage(invention_title=title, priority_date="2026-01-15")

    assert family.invention_title == title
    assert family.priority_country == "IN"
    assert family.priority_date == "2026-01-15"
    assert family.pct_number.startswith("PCT/")

    member_jurisdictions = [m.jurisdiction for m in family.members]
    assert "IN" in member_jurisdictions
    assert "WO" in member_jurisdictions
    assert "US" in member_jurisdictions
    assert "EP" in member_jurisdictions
    assert "DE" in member_jurisdictions

    # Check suggested CPC classification classes
    assert len(family.suggested_cpc_classes) >= 3
    assert any("Curcuma longa" in cpc for cpc in family.suggested_cpc_classes)


def test_jurisdiction_engine_matrix():
    """Verify comparative patentability across India, USA, Europe, and WIPO."""
    req = JurisdictionComparisonRequest(
        invention_title="Standardized Haridra and Maricha Formulation",
        ingredients=["Curcuma longa", "Piper nigrum"],
        jurisdictions=["IN", "US", "EU", "WO"],
    )
    res = compare_jurisdictions(req)

    assert res.invention_title == req.invention_title
    assert len(res.comparison_matrix) >= 4

    dimensions = {row.dimension for row in res.comparison_matrix}
    assert "Traditional Knowledge Exclusion" in dimensions
    assert "Biological Resource & CBD Obligations" in dimensions

    # Verify key comparisons
    tk_row = next(r for r in res.comparison_matrix if "Traditional Knowledge" in r.dimension)
    assert "Section 3(p)" in tk_row.india
    assert "35 U.S.C. 102" in tk_row.usa
    assert "EPC Article 56" in tk_row.europe or "Article" in tk_row.europe

    # Action plan & evidence
    assert len(res.action_plan) >= 3
    assert len(res.evidence) >= 1
    assert any(e.jurisdiction in ("IN", "US", "EU", "WO", "GLOBAL") for e in res.evidence)


def test_evaluation_benchmarks():
    """Verify retrieval, groundedness, and multi-lingual evaluation metrics."""
    metrics = run_benchmark_evaluation()
    assert isinstance(metrics, dict)
    assert metrics.get("total_test_queries", 0) > 0

    # Retrieval accuracy
    retrieval = metrics.get("retrieval", {})
    assert 0.80 <= retrieval.get("recall_at_5", 0) <= 1.0
    assert 0.80 <= retrieval.get("ndcg_at_10", 0) <= 1.0
    assert 0.70 <= retrieval.get("mrr", 0) <= 1.0

    # Groundedness & entailment
    grounding = metrics.get("generation_grounding", {})
    assert 0.80 <= grounding.get("groundedness_score", 0) <= 1.0

    # Multilingual metrics
    multilingual = metrics.get("multilingual_performance", {})
    assert "hi" in multilingual
    assert "sk" in multilingual
    assert "ta" in multilingual
    assert "en" in multilingual


def test_indian_to_international_transition():
    """Verify Indian to International IP transition gateway logic, deadlines, and clearances."""
    from backend.app.services.indian_to_international import convert_indian_to_international
    from backend.app.models.schemas import IndianToInternationalRequest

    req = IndianToInternationalRequest(
        indian_application_number="IN202511099234",
        priority_date="2025-11-01",
        title="Synergistic Curcumin Nano-Emulsion Formulation",
        biological_materials=["Curcuma longa L."],
        has_foreign_filing_license=False,
        has_nba_approval=False,
        target_jurisdictions=["WO", "US", "EP", "DE"],
        applicant_type="STARTUP_SME",
    )
    res = convert_indian_to_international(req)

    assert res.indian_application_number == req.indian_application_number
    assert 0 <= res.transition_readiness_score <= 100
    assert len(res.deadlines) == 6
    assert any("PCT" in d.milestone for d in res.deadlines)
    assert any("US National Stage" in d.milestone for d in res.deadlines)
    assert any("European Regional" in d.milestone for d in res.deadlines)

    # Clearance checks
    clearance_reqs = {c.requirement: c for c in res.clearances}
    assert "Foreign Filing License (Section 39 Patents Act)" in clearance_reqs
    assert "National Biodiversity Authority (NBA) Clearance" in clearance_reqs

    # Roadmaps & document checklist
    assert len(res.roadmaps) >= 3
    assert len(res.required_documents) >= 5
    assert len(res.action_plan) >= 4
    assert len(res.evidence) >= 1

