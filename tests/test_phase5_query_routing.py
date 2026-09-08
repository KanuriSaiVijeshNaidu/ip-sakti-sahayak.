"""
tests/test_phase5_query_routing.py
──────────────────────────────────
Unit tests for Phase 5 Query Analyzer:
- Language detection
- Intent classification
- Safe jurisdiction routing
- HARD constraint: Language != Jurisdiction
- Rejection/prevention of IN and DE
"""
import pytest
from backend.app.retrieval.query_analyzer import analyze_query, detect_language, route_jurisdiction


def test_language_detection():
    assert detect_language("What are the patent requirements in Japan?") == "en"
    assert detect_language("日本の特許要件は何ですか？") == "ja"
    assert detect_language("आयुर्वेदिक फॉर्मूलेशन पेटेंट") == "hi"
    assert detect_language("పేటెంట్ సమాచారం") == "te"


def test_scenario_1_english_us_query():
    qa = analyze_query("What are the US patent requirements?")
    assert qa.detected_language == "en"
    assert qa.jurisdictions == ["US"]
    assert qa.routing_mode == "explicit_single"
    assert qa.intent == "patentability"


def test_scenario_2_english_japan_query():
    qa = analyze_query("What patents exist in Japan for this formulation?")
    assert qa.detected_language == "en"
    assert qa.jurisdictions == ["JP"]
    assert qa.routing_mode == "explicit_single"


def test_scenario_3_japanese_japan_query():
    qa = analyze_query("日本におけるこの処方の特許は何ですか？")
    assert qa.detected_language == "ja"
    assert qa.jurisdictions == ["JP"]
    assert qa.routing_mode == "explicit_single"


def test_scenario_4_english_europe_query():
    qa = analyze_query("Search European patent claims for topical compositions.")
    assert qa.detected_language == "en"
    assert qa.jurisdictions == ["EP"]
    assert qa.routing_mode == "explicit_single"


def test_scenario_5_wipo_pct_query():
    qa = analyze_query("Find international patent applications filed under PCT at WIPO.")
    assert qa.detected_language == "en"
    assert qa.jurisdictions == ["WO"]
    assert qa.routing_mode == "explicit_single"


def test_scenario_6_global_unspecified_query():
    qa = analyze_query("Find patents related to this formulation.")
    assert qa.detected_language == "en"
    assert set(qa.jurisdictions) == {"US", "EP", "WO", "JP"}
    assert qa.routing_mode == "global"


def test_scenario_7_multi_jurisdiction_comparison():
    qa = analyze_query("Compare patent requirements in Japan and the US.")
    assert qa.detected_language == "en"
    assert set(qa.jurisdictions) == {"JP", "US"}
    assert qa.routing_mode == "comparison"
    assert qa.intent == "jurisdiction_comparison"


def test_scenario_8_japanese_language_asking_about_us():
    """
    CRITICAL HARD LOGIC TEST:
    Query written in Japanese, but explicitly asking about US patents.
    Must route to US, NOT Japan!
    """
    qa = analyze_query("米国における特許要件は何ですか？")
    assert qa.detected_language == "ja"
    assert qa.jurisdictions == ["US"]
    assert qa.routing_mode == "explicit_single"


def test_scenario_9_english_asking_about_japan():
    qa = analyze_query("Can I patent this composition in Japan?")
    assert qa.detected_language == "en"
    assert qa.jurisdictions == ["JP"]
    assert qa.routing_mode == "explicit_single"


def test_scenario_10_query_no_jurisdiction():
    qa = analyze_query("Polyherbal synergistic extract novelty")
    assert qa.detected_language == "en"
    assert set(qa.jurisdictions) == {"US", "EP", "WO", "JP"}
    assert qa.routing_mode == "global"


def test_forbidden_jurisdictions_rejected():
    with pytest.raises(ValueError, match="Germany"):
        analyze_query("German patent application requirements at DPMA")

    with pytest.raises(ValueError, match="India"):
        analyze_query("Search Indian Patent Office InPASS")

    with pytest.raises(ValueError, match="forbidden"):
        analyze_query("Search patent", explicit_jurisdiction="DE")

    with pytest.raises(ValueError, match="forbidden"):
        analyze_query("Search patent", explicit_jurisdiction="IN")
