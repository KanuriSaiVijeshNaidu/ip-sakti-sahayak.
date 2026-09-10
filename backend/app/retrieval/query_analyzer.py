"""
backend/app/retrieval/query_analyzer.py
───────────────────────────────────────
Language detection, intent classification, and explicit jurisdiction routing.
Strictly respects: LANGUAGE != JURISDICTION.
Routes safely across US, EP, WO, JP; strictly excludes IN and DE.
"""
from __future__ import annotations

import re
from typing import List, Tuple, Optional
from backend.app.models.retrieval_schemas import QueryAnalysis
from backend.app.retrieval.config import retrieval_config


# Regex patterns for script / language identification
_RE_JAPANESE = re.compile(r"[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]")
_RE_DEVANAGARI = re.compile(r"[\u0900-\u097f]")
_RE_TELUGU = re.compile(r"[\u0c00-\u0c7f]")
_RE_TAMIL = re.compile(r"[\u0b80-\u0bff]")

# Code-switching transliteration patterns (Latin script Indic expressions)
_RE_CODESWITCH_TELUGU = re.compile(r"\b(lo|cheyyacha|cheyavacha|chesukovacha|pedathara|avuthunda|gurinchi|cheyali|ivvandi)\b", re.IGNORECASE)
_RE_CODESWITCH_HINDI = re.compile(r"\b(mein|karna|hoga|sakta|sakte|sakenge|hai|kyu|kaise|karein|chahiye|batao|milega)\b", re.IGNORECASE)
_RE_CODESWITCH_TAMIL = re.compile(r"\b(la|kidaikuma|pannalama|vikkalama|theriyuma|seiyalama|patri|vaangalama|eppadi)\b", re.IGNORECASE)

# Entity extraction patterns
_RE_PATENT_NUMBER = re.compile(
    r"\b(US|EP|WO|JP|IN)?[0-9]{4,11}(?:[A-B][0-9]?)?\b|\b(US|EP|WO|JP|IN)\s*[0-9]{4,11}\b|\b[0-9]{3,5}/(?:DEL|MUM|CHE|KOL)/[0-9]{4}\b",
    re.IGNORECASE,
)
_RE_SECTION_LAW = re.compile(
    r"\b(Section\s+[0-9]+[a-z]?|Rule\s+158B|Schedule\s+T|35\s+U\.?S\.?C\.?\s+[0-9]+|EPC\s+Article\s+[0-9]+|PCT\s+Article\s+[0-9]+|Article\s+[0-9]+|特許法第[0-9]+条)\b",
    re.IGNORECASE,
)
_RE_YEAR = re.compile(r"\b(19[5-9][0-9]|20[0-2][0-9])\b")


def detect_language(query: str) -> str:
    """
    Detect language based on script and text features.
    Supports English (en), Telugu (te), Hindi (hi), Tamil (ta), and Japanese (ja).
    Includes code-switching recognition for Latin-transliterated queries.
    """
    # 1. Native script detection
    if _RE_JAPANESE.search(query):
        return "ja"
    if _RE_DEVANAGARI.search(query):
        return "hi"
    if _RE_TELUGU.search(query):
        return "te"
    if _RE_TAMIL.search(query):
        return "ta"

    # 2. Code-switching Latin-script transliteration detection
    if _RE_CODESWITCH_TELUGU.search(query):
        return "te"
    if _RE_CODESWITCH_HINDI.search(query):
        return "hi"
    if _RE_CODESWITCH_TAMIL.search(query):
        return "ta"

    return "en"


def classify_intent(query: str) -> Tuple[str, float]:
    """
    Lightweight deterministic/rule-based intent classifier.
    Returns (intent, confidence).
    """
    q_lower = query.lower()

    # Priority 1: Comparison
    if any(w in q_lower for w in ["compare", "comparison", "difference between", "versus", "vs", "differ", "対比", "比較"]):
        return "jurisdiction_comparison", 0.95

    # Priority 2: Patentability
    if any(w in q_lower for w in ["patentable", "patentability", "can i patent", "how to patent", "novelty", "inventive step", "non-obvious", "patent requirements", "patent requirement", "patent criteria", "特許性", "特許可能", "特許要件"]):
        return "patentability", 0.90

    # Priority 3: Prior Art
    if any(w in q_lower for w in ["prior art", "existing patent", "earlier publication", "anticipate", "anticipation", "先行技術", "先行特許"]):
        return "prior_art", 0.90

    # Priority 4: Infringement / Freedom to Operate
    if any(w in q_lower for w in ["infringe", "infringement", "freedom to operate", "fto", "clearance", "侵害"]):
        return "infringement", 0.85

    # Priority 5: Formulation Search
    if any(w in q_lower for w in ["formulation", "composition", "extract", "herbal mixture", "synergy", "admixture", "処方", "組成物"]):
        return "formulation_search", 0.85

    # Priority 6: Licensing / Commercialization
    if any(w in q_lower for w in ["license", "licensing", "royalty", "commercialize", "commercialization", "ライセンス"]):
        return "licensing", 0.85

    # Priority 7: Ownership
    if any(w in q_lower for w in ["assignee", "inventor", "owner", "applicant", "出願人", "発明者"]):
        return "ownership", 0.80

    # Priority 8: General Patent Search
    if any(w in q_lower for w in ["patent", "patents", "published application", "claim", "claims", "特許"]):
        return "patent_search", 0.80

    # Priority 9: Regulatory Information
    if any(w in q_lower for w in ["fda", "mhlw", "pmda", "regulation", "regulatory", "compliance", "規制"]):
        return "regulatory_information", 0.80

    return "general_information", 0.60


def route_jurisdiction(query: str, explicit_override: Optional[str] = None) -> Tuple[List[str], str, str]:
    """
    Determines target jurisdictions and routing mode.
    Enforces HARD logic constraint: Language != Jurisdiction.
    
    Returns (jurisdictions_list, routing_mode, routing_reason)
    """
    if explicit_override:
        jur = explicit_override.strip().upper()
        if jur in retrieval_config.forbidden_jurisdictions:
            raise ValueError(f"Jurisdiction '{jur}' is forbidden/deferred in Phase 5 active scope.")
        if jur in retrieval_config.active_jurisdictions:
            return [jur], "explicit_single", f"Explicit override provided: {jur}"
        if jur == "GLOBAL":
            return list(retrieval_config.active_jurisdictions), "global", "Explicit GLOBAL override requested"

    q_lower = query.lower()

    # Reject forbidden jurisdictions if explicitly queried
    if any(w in q_lower for w in ["germany", "german patent", "dpma", "bundespatentgericht"]):
        raise ValueError("Germany (DE) has been REMOVED from the active target jurisdictions.")

    # Match jurisdiction keywords across all 5 languages
    has_in = bool(
        re.search(r"\b(india|indian|cgpdtm|inpass|ipo|ayush|tkdl|nba|national biodiversity authority|fssai|ayurveda aahara|rule 158b|form 24d|form 25d|schedule t|form tm-a)\b", q_lower)
        or "भारत" in query
        or "भारतीय" in query
        or "భారత" in query
        or "భారతదేశ" in query
        or "இந்தியா" in query
        or "இந்திய" in query
        or "インド" in query
    )
    has_us = bool(re.search(r"\b(us|usa|united states|american patent|uspto|35\s*u\.?s\.?c|fda|ndi|gras|dshea|21\s*u\.?s\.?c|21\s*cfr|cgmp)\b", q_lower) or "米国" in query or "アメリカ" in query)
    has_ep = bool(
        re.search(r"\b(ep|epo|epc|epü|epa|european patent|european patent office|europe|european|europäische|europäisches|ema|hmpc)\b", q_lower)
        or "欧州" in query
        or "ヨーロッパ" in query
        or "epü" in q_lower
        or "epu" in q_lower
    )
    has_wo = bool(re.search(r"\b(wo|wipo|pct|international patent|international application|patentscope|iprp|isr|wo-isa)\b", q_lower) or "国際出願" in query or "世界知的所有権機関" in query)
    has_jp = bool(
        re.search(r"\b(jp|japan|japanese|jpo|pmda|mhlw|pmd act|ffc)\b", q_lower)
        or "日本" in query
        or "特許法" in query
        or "薬機法" in query
        or ("特許庁" in query and not any(f"{p}特許庁" in query for p in ["インド", "米国", "欧州", "世界"]))
    )

    # Check for comparison
    is_compare = any(w in q_lower for w in ["compare", "comparison", "difference between", "versus", "vs", "differ", "対比", "比較"])

    detected_jurs: List[str] = []
    if has_in:
        detected_jurs.append("IN")
    if has_us:
        detected_jurs.append("US")
    if has_ep:
        detected_jurs.append("EP")
    if has_wo:
        detected_jurs.append("WO")
    if has_jp:
        detected_jurs.append("JP")

    if is_compare and len(detected_jurs) >= 2:
        return detected_jurs, "comparison", f"Comparison query across explicit jurisdictions: {', '.join(detected_jurs)}"

    if len(detected_jurs) == 1:
        return detected_jurs, "explicit_single", f"Explicit single jurisdiction matched: {detected_jurs[0]}"
    elif len(detected_jurs) > 1:
        return detected_jurs, "explicit_multi", f"Explicit multi-jurisdiction matched: {', '.join(detected_jurs)}"

    # If query concerns traditional medicine / AYUSH / botanical herbs without foreign indicators, default to India (IN)
    is_ayush_domain = any(w in q_lower for w in [
        "ayush", "ayurveda", "ayurvedic", "ashwagandha", "curcumin", "turmeric", "triphala",
        "neem", "tulsi", "bhasma", "churna", "taila", "arishta", "asava", "synergy", "admixture",
        "ఆయుర్వేద", "పేటెంట్", "आयुर्वेद", "पेटेंट", "பாரம்பரிய", "காப்புரிமை"
    ])
    if is_ayush_domain:
        return ["IN"], "domain_default", "AYUSH / Traditional formulation domain inferred; routing to India (IN) primary statutory registry"

    # Global / Unspecified: search all active jurisdictions
    return list(retrieval_config.active_jurisdictions), "global", "No explicit jurisdiction specified; searching all active jurisdictions (IN, US, EP, WO, JP)"


def analyze_query(query: str, explicit_jurisdiction: Optional[str] = None) -> QueryAnalysis:
    """
    End-to-end query understanding pipeline.
    Extracts entities, detects language, classifies intent, and computes safe jurisdiction route.
    """
    clean_query = query.strip()
    norm_query = re.sub(r"\s+", " ", clean_query)

    lang = detect_language(norm_query)
    intent, confidence = classify_intent(norm_query)
    jurisdictions, routing_mode, routing_reason = route_jurisdiction(norm_query, explicit_jurisdiction)

    # Extract patent entities
    patent_entities = [m.group(0).strip() for m in _RE_PATENT_NUMBER.finditer(norm_query)]
    
    # Extract legal entities
    legal_entities = [m.group(0).strip() for m in _RE_SECTION_LAW.finditer(norm_query)]

    # Extract temporal constraints
    temporal_constraints = [m.group(0).strip() for m in _RE_YEAR.finditer(norm_query)]

    # Product/formulation terms: extract capitalized keywords or known terms
    product_entities: List[str] = []
    for term in [
        "rosacea", "metronidazole", "curcumin", "turmeric", "ashwagandha", "polyherbal",
        "liposome", "nanoparticle", "extract", "triphala", "brahmi", "tulsi", "neem",
        "guggulu", "amla", "piperine", "ginger", "withanolide", "berberine", "resveratrol",
        "shatavari", "boswellia", "tinospora", "giloy", "chyawanprash"
    ]:
        if term in norm_query.lower():
            product_entities.append(term)

    # Generate 5 retrieval representations
    from backend.app.retrieval.query_expander import build_5_representations
    expanded_reps = build_5_representations(
        query=norm_query,
        detected_language=lang,
        target_jurisdictions=jurisdictions,
        intent=intent,
    )

    return QueryAnalysis(
        original_query=query,
        normalized_query=norm_query,
        detected_language=lang,
        intent=intent,
        confidence=confidence,
        jurisdictions=jurisdictions,
        routing_mode=routing_mode,
        routing_reason=routing_reason,
        product_entities=product_entities,
        patent_entities=patent_entities,
        legal_entities=legal_entities,
        temporal_constraints=temporal_constraints,
        query_type="patent_comparative" if routing_mode == "comparison" else "patent_search",
        expanded_representations=expanded_reps,
    )
