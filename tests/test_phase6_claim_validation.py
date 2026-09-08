"""
tests/test_phase6_claim_validation.py
─────────────────────────────────────
Tests for factual claim extraction and evidence grounding.
Validates:
- Supported claims: propositions supported by cited text
- Unsupported claims: fabricated dates (e.g. active until 2035) flagged
- Jurisdiction isolation: cited chunk from wrong jurisdiction flagged
"""
import pytest
from backend.app.models.rag_schemas import CitationInfo
from backend.app.rag.claim_validator import claim_validator


def test_claim_validation_supported():
    citations = [
        CitationInfo(
            citation_id="E1",
            chunk_id="C1",
            publication_number="US20160184354A1",
            document_id="D1",
            jurisdiction="US",
            language="en",
            section="claims",
            title="Rosacea treatment",
            text="The regimen includes application of metronidazole composition to facial skin.",
        )
    ]
    answer = "The regimen includes application of metronidazole composition to facial skin [E1]."
    cleaned, claims, valid = claim_validator.validate(answer, citations, ["US"])
    assert valid is True
    assert len(claims) == 1
    assert claims[0].status == "SUPPORTED"


def test_claim_validation_unsupported_year_flagged():
    citations = [
        CitationInfo(
            citation_id="E1",
            chunk_id="C1",
            publication_number="US20160184354A1",
            document_id="D1",
            jurisdiction="US",
            language="en",
            section="claims",
            title="Rosacea treatment",
            text="The regimen includes application of metronidazole composition to facial skin published in 2016.",
        )
    ]
    # Claim fabricates active date until 2035 which is not in text
    answer = "The patent specification remains active until 2035 [E1]."
    cleaned, claims, valid = claim_validator.validate(answer, citations, ["US"])
    assert valid is False
    assert claims[0].status == "UNSUPPORTED"


def test_claim_validation_disallowed_jurisdiction():
    citations = [
        CitationInfo(
            citation_id="E1",
            chunk_id="C1",
            publication_number="JP2020121979A",
            document_id="D1",
            jurisdiction="JP",
            language="ja",
            section="claims",
            title="Composition",
            text="生薬抽出物組成物",
        )
    ]
    # Answer cites JP chunk for US query -> MUST BE FLAGGED AS UNSUPPORTED
    answer = "The disclosure provides composition [E1]."
    cleaned, claims, valid = claim_validator.validate(answer, citations, ["US"])
    assert valid is False
    assert claims[0].status == "UNSUPPORTED"
