"""
backend/app/decision/intent_extractor.py
────────────────────────────────────────
Phase 7 Intent Extractor.

Extends Phase 5 QueryAnalysis with commercialization-specific intent:
  - origin_country / target_country detection
  - user_objective classification (sell / export / fto / patentability / etc.)
  - product, formulation, ingredient extraction
  - patent number and status extraction
  - health/marketing claim detection

KEY RULE: Target jurisdiction always wins for commercialization routing.
  "I have an Indian patent. Can I sell in USA?" → target=US, origin=IN
"""
from __future__ import annotations

import re
import logging
from typing import Optional, List, Tuple

from backend.app.models.decision_schemas import (
    QueryIntent,
    UserObjective,
)

logger = logging.getLogger(__name__)

# ─── Country / Jurisdiction Keyword Maps ──────────────────────────────────────

_COUNTRY_KEYWORDS: dict[str, list[str]] = {
    "IN": ["india", "indian", "ipo", "cgpdtm", "inpass", "bharat", "indian patent office"],
    "US": ["us", "usa", "united states", "american", "uspto", "35 u.s.c", "us patent"],
    "EP": ["europe", "european", "epo", "european patent office", "ep patent"],
    "WO": ["wipo", "pct", "international patent", "worldwide", "global patent"],
    "JP": ["japan", "japanese", "jpo", "特許庁", "日本", "米国特許", "日本の特許"],
    "DE": ["germany", "german", "dpma", "bundespatentgericht"],
}

# Patterns for "origin → target" phrases like "I have an X patent. Can I sell in Y?"
_ORIGIN_PATTERN = re.compile(
    r"\b(i have|i hold|holding|hold|my|we have|our|filed in|granted in|registered in|issued in|own|assigned in|patented in|originating from|origin in|granted by)\b.{0,60}?\b(indian?|usa?|us|american|european?|japanese?|pct|wipo|japan|india|united states)\b",
    re.IGNORECASE,
)
_TARGET_COUNTRY_PHRASES: dict[str, list[str]] = {
    "US":  ["sell in usa", "sell in the us", "sell in united states", "market in usa",
            "export to usa", "commercialize in usa", "launch in usa", "operate in usa",
            "sell in america", "market in the us", "into usa", "to usa", "to the us"],
    "JP":  ["sell in japan", "market in japan", "export to japan", "commercialize in japan",
            "launch in japan", "operate in japan", "to japan", "into japan", "in japan"],
    "EP":  ["sell in europe", "market in europe", "export to europe", "sell in eu",
            "commercialize in europe", "to europe", "into europe", "in europe"],
    "IN":  ["sell in india", "market in india", "export to india", "commercialize in india",
            "to india", "into india", "in india"],
}

# ─── Objective Keywords ────────────────────────────────────────────────────────

_OBJECTIVE_KEYWORDS: list[Tuple[UserObjective, list[str]]] = [
    (UserObjective.FTO,          ["freedom to operate", "fto", "fto analysis", "ip clearance",
                                  "clear to sell", "clear to market", "侵害"]),
    (UserObjective.SELL,         ["can i sell", "able to sell", "sell it", "selling",
                                  "commercially sell", "販売できるか"]),
    (UserObjective.EXPORT,       ["can i export", "export to", "exporting", "cross-border",
                                  "輸出"]),
    (UserObjective.MARKET,       ["can i market", "marketing", "launch in market",
                                  "market entry", "marketing authorization"]),
    (UserObjective.COMMERCIALIZE,["commercialize", "commercialization", "monetize",
                                  "bring to market", "商業化"]),
    (UserObjective.PATENTABILITY,["can i patent", "patentable", "patentability",
                                  "novelty", "inventive step", "non-obvious", "特許性"]),
    (UserObjective.PATENT_VALIDITY,["patent valid", "is the patent valid", "patent validity",
                                    "patent still active", "patent expired", "特許有効"]),
    (UserObjective.THIRD_PARTY_PATENT,["third party patent", "existing patent", "blocking patent",
                                       "competitor patent", "prior patent"]),
    (UserObjective.REGULATORY_REQUIREMENT,["regulatory requirement", "fda approval", "pmda",
                                           "mhlw", "regulatory compliance", "marketing approval",
                                           "drug approval", "health authority"]),
    (UserObjective.LEGALITY,     ["is it legal", "legally allowed", "permitted by law",
                                  "legal to sell", "lawful"]),
]

# ─── Product / Ingredient Terms ────────────────────────────────────────────────

_KNOWN_PRODUCTS = [
    "ashwagandha", "withania somnifera", "turmeric", "curcumin", "brahmi",
    "bacopa monnieri", "neem", "azadirachta", "tulsi", "ocimum", "triphala",
    "rosacea", "metronidazole", "azelaic acid", "ivermectin", "liposome",
    "nanoparticle", "polyherbal", "extract", "formulation", "composition",
    "emulsion", "cream", "gel", "tablet", "capsule", "syrup", "tincture",
    "astaxanthin", "quercetin", "resveratrol", "berberine", "colchicine",
]

_HEALTH_CLAIM_PATTERNS = [
    re.compile(r"\b(treat|cure|prevent|mitigate|alleviate|reduce|manage)\b.{0,40}\b(\w+\s?\w+)\b", re.IGNORECASE),
    re.compile(r"\b(anti-?inflammatory|anti-?microbial|anti-?oxidant|anti-?fungal|anti-?viral)\b", re.IGNORECASE),
]

_PATENT_STATUS_KEYWORDS = {
    "granted":  ["granted", "issued", "registered", "approved", "approved patent"],
    "pending":  ["pending", "applied", "filed", "application", "under examination"],
    "expired":  ["expired", "lapsed", "abandoned", "invalidated"],
}

_RE_PATENT_NUM = re.compile(
    r"\b(US|EP|WO|JP|IN)[\s-]?[0-9]{4,11}(?:[A-B][0-9]?)?\b",
    re.IGNORECASE,
)


# ─── Main Extractor ────────────────────────────────────────────────────────────

def extract_intent(query: str, explicit_jurisdiction: Optional[str] = None) -> QueryIntent:
    """
    Extract rich intent from a user query for Phase 7 decision routing.

    Args:
        query: Raw user query string.
        explicit_jurisdiction: Optional frontend-supplied jurisdiction override.

    Returns:
        QueryIntent with all extracted fields.
    """
    q = query.strip()
    q_lower = q.lower()

    # ── Objective ──────────────────────────────────────────────────────────────
    user_objective = UserObjective.GENERAL
    for obj, keywords in _OBJECTIVE_KEYWORDS:
        if any(kw in q_lower for kw in keywords):
            user_objective = obj
            break

    is_commercialization = user_objective in (
        UserObjective.SELL, UserObjective.EXPORT,
        UserObjective.MARKET, UserObjective.COMMERCIALIZE,
    )
    is_fto = user_objective == UserObjective.FTO

    # ── Origin Country ─────────────────────────────────────────────────────────
    origin_country: Optional[str] = None
    origin_pat = _ORIGIN_PATTERN.search(q_lower)
    if origin_pat:
        word = origin_pat.group(2)
        origin_country = _word_to_jurisdiction(word)

    # ── Target Country ─────────────────────────────────────────────────────────
    target_country: Optional[str] = None

    # Explicit override always wins
    if explicit_jurisdiction and explicit_jurisdiction.upper() not in ("GLOBAL", "ALL"):
        target_country = explicit_jurisdiction.upper()
    else:
        # Regex checks for prepositional targets: in/to/into Japan, USA, Europe
        if re.search(r"\b(in|into|to|for)\s+(japan|jp)\b", q_lower) or "日本" in q:
            target_country = "JP"
        elif re.search(r"\b(in|into|to|for)\s+(usa?|the us|united states|america)\b", q_lower) or "米国" in q:
            target_country = "US"
        elif re.search(r"\b(in|into|to|for)\s+(europe|the eu|eu)\b", q_lower) or "欧州" in q:
            target_country = "EP"
        elif re.search(r"\b(in|into|to|for)\s+(india)\b", q_lower) or "भारत" in q:
            target_country = "IN"

        # Phrase-based detection
        if not target_country:
            for jur, phrases in _TARGET_COUNTRY_PHRASES.items():
                if any(ph in q_lower for ph in phrases):
                    target_country = jur
                    break

        # Fallback: check other country keywords (skipping origin)
        # Note: Do NOT match global/worldwide as single-target WO
        if not target_country and not any(w in q_lower for w in ["global", "worldwide", "international"]):
            for jur, keywords in [
                ("JP", ["japan", "japanese", "jpo", "特許庁"]),
                ("US", ["us", "usa", "united states", "uspto"]),
                ("EP", ["europe", "european", "epo"]),
                ("IN", ["india", "indian", "ipo"]),
            ]:
                if any(kw in q_lower for kw in keywords):
                    if jur != origin_country:
                        target_country = jur
                        break

    # For commercialization: if target found, use it for retrieval routing
    requires_target_routing = is_commercialization and target_country is not None

    # ── Product / Formulation ──────────────────────────────────────────────────
    found_products = [p for p in _KNOWN_PRODUCTS if p in q_lower]
    product = found_products[0] if found_products else None
    formulation = None
    if any(w in q_lower for w in ["formulation", "composition", "mixture", "blend", "extract"]):
        # Extract the phrase around formulation keyword
        m = re.search(r"(\w+\s+){0,3}(formulation|composition|mixture|blend|extract)(\s+\w+){0,3}", q_lower)
        if m:
            formulation = m.group(0).strip()

    ingredients = found_products[1:6]  # additional products treated as ingredients

    # ── Health / Marketing Claims ──────────────────────────────────────────────
    health_claims: List[str] = []
    for pat in _HEALTH_CLAIM_PATTERNS:
        for m in pat.finditer(q):
            health_claims.append(m.group(0).strip())
    health_claims = list(set(health_claims))[:5]

    # ── Patent Number ──────────────────────────────────────────────────────────
    patent_numbers = [m.group(0) for m in _RE_PATENT_NUM.finditer(q)]
    patent_number = patent_numbers[0] if patent_numbers else None

    # ── Patent Status ──────────────────────────────────────────────────────────
    patent_status: Optional[str] = None
    for status, keywords in _PATENT_STATUS_KEYWORDS.items():
        if any(kw in q_lower for kw in keywords):
            patent_status = status
            break

    # ── Applicant / Owner ──────────────────────────────────────────────────────
    applicant = _extract_entity(q_lower, ["applicant", "filed by", "applied by"])
    owner = _extract_entity(q_lower, ["owned by", "assigned to", "assignee", "owner"])

    # ── Intended Use ──────────────────────────────────────────────────────────
    intended_use: Optional[str] = None
    for phrase in ["for treating", "for curing", "for preventing", "for managing", "for use as", "intended for"]:
        if phrase in q_lower:
            m = re.search(rf"{re.escape(phrase)}.{{0,60}}", q_lower)
            if m:
                intended_use = m.group(0).strip()[:120]
                break

    logger.debug(
        "Intent extracted: objective=%s, origin=%s, target=%s, product=%s, commercialization=%s",
        user_objective, origin_country, target_country, product, is_commercialization,
    )

    return QueryIntent(
        origin_country=origin_country,
        target_country=target_country,
        product=product,
        formulation=formulation,
        ingredients=ingredients,
        intended_use=intended_use,
        health_claims=health_claims,
        patent_number=patent_number,
        patent_status=patent_status,
        applicant=applicant,
        owner=owner,
        user_objective=user_objective,
        is_commercialization_question=is_commercialization,
        is_fto_question=is_fto,
        requires_target_jurisdiction_routing=requires_target_routing,
    )


# ─── Helpers ───────────────────────────────────────────────────────────────────

def _word_to_jurisdiction(word: str) -> Optional[str]:
    mapping = {
        "indian": "IN", "india": "IN",
        "american": "US", "us": "US", "usa": "US", "united states": "US",
        "european": "EP", "europe": "EP",
        "japanese": "JP", "japan": "JP",
        "pct": "WO", "wipo": "WO", "international": "WO",
    }
    return mapping.get(word.lower())


def _extract_entity(q_lower: str, triggers: list[str]) -> Optional[str]:
    for trigger in triggers:
        idx = q_lower.find(trigger)
        if idx != -1:
            snippet = q_lower[idx + len(trigger):idx + len(trigger) + 60].strip()
            words = snippet.split()[:4]
            if words:
                return " ".join(words)
    return None
