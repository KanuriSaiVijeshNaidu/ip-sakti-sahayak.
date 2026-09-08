"""
tests/test_phase6_crag.py
─────────────────────────
Tests for Corrective RAG (CRAG) quality evaluation logic.
Validates:
- GOOD: High rerank scores and sufficient chunks
- PARTIAL: Legal clearance / commercialization questions (safe caveat flagging)
- INSUFFICIENT: Empty or unusable text content
- INVALID: Cross-jurisdiction contamination detected
"""
import pytest
from backend.app.models.retrieval_schemas import EvidenceResult
from backend.app.rag.crag_validator import crag_validator


def test_crag_good_quality():
    evidence = [
        EvidenceResult(
            chunk_id="US-1",
            document_id="DOC-1",
            publication_number="US20160184354A1",
            jurisdiction="US",
            language="en",
            section="claims",
            title="Composition",
            text="A pharmaceutical topical formulation comprising metronidazole for treating skin disorders.",
            rerank_score=0.85,
            final_rank=1,
        ),
        EvidenceResult(
            chunk_id="US-2",
            document_id="DOC-2",
            publication_number="US20160158263A1",
            jurisdiction="US",
            language="en",
            section="description",
            title="Rosacea treatment",
            text="The composition contains active ingredients applied topically to alleviate rosacea symptoms.",
            rerank_score=0.72,
            final_rank=2,
        ),
    ]
    assessment = crag_validator.evaluate(
        query="What are the US patent requirements for rosacea treatments?",
        evidence_results=evidence,
        target_jurisdictions=["US"],
    )
    assert assessment.status == "GOOD"
    assert assessment.confidence >= 0.70
    assert assessment.jurisdiction_match is True
    assert assessment.usable_evidence_count == 2


def test_crag_insufficient_empty_results():
    assessment = crag_validator.evaluate(
        query="Any query",
        evidence_results=[],
        target_jurisdictions=["US"],
    )
    assert assessment.status == "INSUFFICIENT"
    assert assessment.evidence_count == 0
    assert assessment.confidence == 0.0


def test_crag_invalid_contamination_detected():
    evidence = [
        EvidenceResult(
            chunk_id="JP-1",
            document_id="DOC-JP",
            publication_number="JP2020121979A",
            jurisdiction="JP",
            language="ja",
            section="claims",
            title="生薬抽出物",
            text="生薬抽出物を含有する組成物。",
            rerank_score=0.80,
            final_rank=1,
        )
    ]
    # Requested US only, but JP returned -> MUST BE INVALID
    assessment = crag_validator.evaluate(
        query="US query",
        evidence_results=evidence,
        target_jurisdictions=["US"],
    )
    assert assessment.status == "INVALID"
    assert assessment.jurisdiction_match is False


def test_crag_partial_legal_clearance_query():
    evidence = [
        EvidenceResult(
            chunk_id="US-1",
            document_id="DOC-1",
            publication_number="US20160184354A1",
            jurisdiction="US",
            language="en",
            section="claims",
            title="Composition",
            text="A pharmaceutical composition disclosed in prior art specification.",
            rerank_score=0.90,
            final_rank=1,
        ),
        EvidenceResult(
            chunk_id="US-2",
            document_id="DOC-2",
            publication_number="US20160158263A1",
            jurisdiction="US",
            language="en",
            section="description",
            title="Description",
            text="Specification details of preparation method.",
            rerank_score=0.88,
            final_rank=2,
        ),
    ]
    assessment = crag_validator.evaluate(
        query="Can I legally sell this product in the USA?",
        evidence_results=evidence,
        target_jurisdictions=["US"],
    )
    assert assessment.status == "PARTIAL"
    assert "freedom to operate" in assessment.reason.lower() or "commercial" in assessment.reason.lower()
