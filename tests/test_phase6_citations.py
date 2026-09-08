"""
tests/test_phase6_citations.py
──────────────────────────────
Tests for deterministic citation mechanism.
Validates:
- Citation tag format: [E1], [E2]
- Tag rejection: Fabricated tags like [E99] purged
- Complete provenance preserved in CitationInfo
"""
import pytest
from backend.app.models.retrieval_schemas import EvidenceResult
from backend.app.rag.evidence_selector import evidence_selector
from backend.app.rag.claim_validator import claim_validator


def test_citation_generation_and_provenance():
    evidence = [
        EvidenceResult(
            chunk_id="CHK-100",
            document_id="DOC-100",
            publication_number="US20160184354A1",
            jurisdiction="US",
            language="en",
            section="claims",
            title="Formulation Kit",
            text="Kit comprising metronidazole cleanser and protective cream.",
            source="USPTO",
            source_url="https://patents.google.com/patent/US20160184354A1",
            filing_date="2016-01-22",
            publication_date="2016-06-30",
            final_rank=1,
        )
    ]
    citations, context = evidence_selector.select(evidence, max_chunks=2)
    assert len(citations) == 1
    c = citations[0]
    assert c.citation_id == "E1"
    assert c.publication_number == "US20160184354A1"
    assert c.chunk_id == "CHK-100"
    assert c.jurisdiction == "US"
    assert c.source_url == "https://patents.google.com/patent/US20160184354A1"
    assert "[E1]" in context


def test_fabricated_citation_purged():
    evidence = [
        EvidenceResult(
            chunk_id="CHK-1",
            document_id="DOC-1",
            publication_number="US123",
            jurisdiction="US",
            language="en",
            section="claims",
            text="Metronidazole composition.",
            final_rank=1,
        )
    ]
    citations, _ = evidence_selector.select(evidence, max_chunks=1)
    # Only E1 exists! Answer contains hallucinated [E99]
    answer = "The patent describes metronidazole [E1], and it is claimed to cure dermatitis [E99]."
    cleaned, claims, valid = claim_validator.validate(answer, citations, ["US"])
    assert "[E99]" not in cleaned
    assert "[E1]" in cleaned
