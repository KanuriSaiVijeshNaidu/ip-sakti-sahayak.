"""
tests/test_phase5_jurisdiction_isolation.py
───────────────────────────────────────────
Tests for strict jurisdiction safety guard and post-retrieval validation.
Verifies immediate error abort on contamination and complete rejection of IN and DE.
"""
import pytest
from backend.app.retrieval.jurisdiction_guard import (
    verify_jurisdiction_safety,
    JurisdictionViolationError,
)


def test_safety_check_clean():
    candidates = [
        {"chunk_id": "us_1", "jurisdiction": "US"},
        {"chunk_id": "us_2", "jurisdiction": "US"},
    ]
    # Single jurisdiction: must pass cleanly
    verify_jurisdiction_safety(candidates, ["US"], stage_name="Test Clean")


def test_safety_check_contamination_aborts():
    candidates = [
        {"chunk_id": "us_1", "jurisdiction": "US"},
        {"chunk_id": "jp_1", "jurisdiction": "JP"},
    ]
    # Requested US only, but JP was returned -> MUST RAISE ERROR
    with pytest.raises(JurisdictionViolationError, match="JURISDICTION CONTAMINATION"):
        verify_jurisdiction_safety(candidates, ["US"], stage_name="Test Contamination")


def test_safety_check_forbidden_germany_aborts():
    candidates = [
        {"chunk_id": "de_1", "jurisdiction": "DE"},
    ]
    with pytest.raises(JurisdictionViolationError, match="CRITICAL SAFETY VIOLATION.*DE"):
        verify_jurisdiction_safety(candidates, ["US", "EP", "WO", "JP"], stage_name="Test DE Forbidden")


def test_safety_check_forbidden_india_aborts():
    candidates = [
        {"chunk_id": "in_1", "jurisdiction": "IN"},
    ]
    with pytest.raises(JurisdictionViolationError, match="CRITICAL SAFETY VIOLATION.*IN"):
        verify_jurisdiction_safety(candidates, ["US", "EP", "WO", "JP"], stage_name="Test IN Forbidden")
