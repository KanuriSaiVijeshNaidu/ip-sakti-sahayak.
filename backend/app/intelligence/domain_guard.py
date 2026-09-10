"""
backend/app/intelligence/domain_guard.py
────────────────────────────────────────
AYURLEX Strict Domain Boundary Validator.

Enforces the logical pipeline order:
USER QUERY -> DOMAIN VALIDATION -> JURISDICTION VALIDATION -> RETRIEVAL ...

Rejects arbitrary non-IP, named-person, trivia, entertainment, daily-life,
and out-of-scope inquiries before any decision engine or educational fallback runs.
"""
from __future__ import annotations

import re
from typing import NamedTuple, Optional, List


class DomainValidationResult(NamedTuple):
    is_domain_valid: bool
    reason_code: str
    explanation: str


# ── Explicit Out-of-Domain Blocklist Patterns ──────────────────────────────────
OUT_OF_DOMAIN_PATTERNS: List[tuple[re.Pattern, str, str]] = [
    # 1. Named Persons, Celebrities, Athletes, Politicians
    (
        re.compile(
            r"\b(ms\s+dhoni|dhoni|virat\s+kohli|kohli|sachin\s+tendulkar|tendulkar|rohit\s+sharma|"
            r"elon\s+musk|narendra\s+modi|donald\s+trump|amit\s+shah|rahul\s+gandhi|"
            r"cristiano\s+ronaldo|lionel\s+messi|shah\s*rukh\s*khan|salman\s*khan)\b",
            re.IGNORECASE,
        ),
        "NAMED_PERSON_QUERY",
        "Named person query",
    ),
    (
        re.compile(
            r"\b(who\s+is\s+(the\s+)?(prime\s+minister|pm|president|chief\s+minister|cm|governor|actor|actress|singer|cricketer|captain))\b",
            re.IGNORECASE,
        ),
        "NAMED_PERSON_QUERY",
        "Public figure inquiry",
    ),
    (
        re.compile(
            r"\b(who\s+is\s+[a-z]{3,}\b(?!\s+(a\s+)?(patent|trademark|examiner|inventor|phosita|controller)))",
            re.IGNORECASE,
        ),
        "NAMED_PERSON_QUERY",
        "Generic person inquiry",
    ),
    (
        re.compile(
            r"\b(where\s+was\s+[a-z\s]+born|birthplace\s+of|date\s+of\s+birth\s+of|age\s+of)\b",
            re.IGNORECASE,
        ),
        "NAMED_PERSON_QUERY",
        "Biographical inquiry",
    ),

    # 2. General Trivia, Geography, Weather, Sports
    (
        re.compile(
            r"\b(capital\s+of|tallest\s+mountain|highest\s+peak|longest\s+river|population\s+of|currency\s+of)\b",
            re.IGNORECASE,
        ),
        "GENERAL_TRIVIA",
        "Geographical / demographic trivia",
    ),
    (
        re.compile(
            r"\b(today('?s)?\s+(weather|temperature|forecast|climate)|weather\s+in|rain\s+forecast)\b",
            re.IGNORECASE,
        ),
        "GENERAL_TRIVIA",
        "Weather query",
    ),
    (
        re.compile(
            r"\b(cricket\s+score|match\s+score|ipl\s+score|who\s+won\s+the\s+match|who\s+won\s+the\s+world\s+cup|football\s+score)\b",
            re.IGNORECASE,
        ),
        "GENERAL_TRIVIA",
        "Sports / entertainment query",
    ),

    # 3. Unrelated Practical Daily Life / Automotive / Cooking / Non-IP Licensing / Finance
    (
        re.compile(
            r"\b(cook\s+biryani|cooking\s+biryani|recipe\s+for\s+biryani|how\s+to\s+cook|recipe\s+for|best\s+biryani)\b",
            re.IGNORECASE,
        ),
        "OUT_OF_DOMAIN",
        "Cooking / recipe query",
    ),
    (
        re.compile(
            r"\b(repair\s+a\s+car|car\s+repair|fix\s+a\s+car|car\s+engine|engine\s+oil|puncture\s+repair|bike\s+repair)\b",
            re.IGNORECASE,
        ),
        "OUT_OF_DOMAIN",
        "Automotive repair query",
    ),
    (
        re.compile(
            r"\b(driving\s+license|driver('?s)?\s+license|pilot\s+license|learner('?s)?\s+license|rto\s+driving|traffic\s+fine)\b",
            re.IGNORECASE,
        ),
        "OUT_OF_DOMAIN",
        "Vehicle / driving license query",
    ),
    (
        re.compile(
            r"\b(bitcoin|cryptocurrency|crypto\s+price|crypto\s+wallet|ethereum|dogecoin|stock\s+price|share\s+market|sensex|nifty)\b",
            re.IGNORECASE,
        ),
        "OUT_OF_DOMAIN",
        "Cryptocurrency / stock market query",
    ),
    (
        re.compile(
            r"\b(income\s+tax|gst\s+rates?|gst\s+return|tax\s+filing|pan\s+card|aadhar\s+card|passport\s+renewal|"
            r"train\s+ticket|flight\s+booking|divorce\s+procedure|divorce\s+in\s+india|voting\s+age|legal\s+age\s+for\s+voting)\b",
            re.IGNORECASE,
        ),
        "OUT_OF_DOMAIN",
        "Unrelated civil / tax / governance query",
    ),
    (
        re.compile(
            r"\b(cricket\s+act|movie\s+act|theater\s+act|car\s+insurance|bike\s+insurance)\b",
            re.IGNORECASE,
        ),
        "OUT_OF_DOMAIN",
        "Adversarial keyword mismatch",
    ),
    (
        re.compile(
            r"\b(latest\s+movie|new\s+movie|box\s+office|movie\s+review|cinema\s+show)\b",
            re.IGNORECASE,
        ),
        "OUT_OF_DOMAIN",
        "Movie / entertainment inquiry",
    ),
]

# ── Explicit In-Domain Concept Matchers ─────────────────────────────────────────
IN_DOMAIN_KEYWORDS = [
    # Core IP
    "patent", "patents", "patentability", "patentable", "prior art", "novelty", "inventive step",
    "non-obviousness", "freedom to operate", "fto", "infringe", "infringement", "provisional application",
    "complete specification", "patent claim", "patent claims", "patent office", "cgpdtm", "uspto", "jpo",
    "epo", "epc", "pct", "wipo", "patentscope", "third party observation", "pre-grant opposition", "post-grant opposition",

    # Trademarks
    "trademark", "trade mark", "trademarks", "trade marks", "nice class", "class 5", "class 3", "class 30",
    "class 32", "form tm-a", "trade marks act", "deceptive similarity", "coined mark", "arbitrary mark",

    # Other IP Regimes
    "copyright", "copyrights", "copyright act", "fair dealing", "literary work", "design registration",
    "designs act", "industrial design", "geographical indication", "geographical indications", "gi tag",
    "gi act", "plant variety", "ppvfr", "dus", "extant variety", "farmers' rights", "breeder",

    # Traditional Knowledge & Biodiversity
    "traditional knowledge", "tkdl", "traditional knowledge digital library", "biopiracy",
    "biological diversity", "biological resources", "nba chennai", "national biodiversity authority",
    "state biodiversity board", "access and benefit sharing", "abs",

    # Statutory Articles & Rules
    "section 3(p)", "section 3(e)", "section 3(d)", "section 3(a)", "section 3(b)", "section 3(c)",
    "section 3(h)", "section 3(i)", "section 3(j)", "section 10(4)", "section 13", "section 9",
    "section 28", "section 29", "section 48", "35 u.s.c", "section 101", "section 102", "section 103",
    "section 112", "epc article 54", "epc article 56", "pmd act", "circular 429", "dshea", "21 cfr",
    "rule 158b", "schedule t", "form 25d", "form 24d", "form iii", "itra act", "ncism act",

    # Ayurveda / AYUSH / ASU Medicine
    "ayurveda", "ayurvedic", "ayush", "asu", "siddha", "unani", "sowa-rigpa", "homeopathy",
    "classical formulation", "proprietary ayurvedic", "herbal formulation", "polyherbal", "churna",
    "taila", "ghrita", "bhasma", "asava", "arishta", "kwatha", "rasayana", "decoction",
    "charaka", "sushruta", "ashtanga", "bhavaprakasha", "sharangadhara", "bhaishajya",
    "ayurvedic pharmacopoeia", "api", "ayurvedic formulary", "afi",

    # Specific Ayurvedic Herbs & Phytochemicals
    "ashwagandha", "withania somnifera", "withanolide", "curcumin", "turmeric", "curcuma longa",
    "piperine", "black pepper", "triphala", "brahmi", "bacopa monnieri", "neem", "azadirachta indica",
    "tulsi", "ocimum sanctum", "amla", "emblica officinalis", "guduchi", "tinospora cordifolia",
    "shatavari", "guggulu", "shilajit", "arjuna", "haritaki", "bibhitaki",

    # Food / Health Authority & Regulatory
    "fssai", "ayurveda aahara", "food safety and standards", "schedule a", "asu drug", "asu medicine",
    "cdsco", "state licensing authority", "e-aushadhi", "heavy metal limit", "microbial limit",
    "certificate of analysis", "good manufacturing practice", "gmp",

    # Pedagogical Life-Science / AI Concepts
    "photosynthesis", "chloroplast", "secondary metabolite", "rag", "crag",
    "retrieval augmented generation", "corrective rag",
]

# ── Verified Standalone Pedagogical Concepts ───────────────────────────────────
VERIFIED_PEDAGOGICAL_CONCEPTS = [
    "photosynthesis",
    "how does photosynthesis work",
    "what is photosynthesis",
    "what is a patent",
    "what is a trademark",
    "what is prior art",
    "what is novelty",
    "what is inventive step",
    "what is freedom to operate",
    "what is fto",
    "what is intellectual property",
    "what is rag",
    "what is crag",
    "what is retrieval augmented generation",
    "novelty vs inventive step",
    "difference between novelty and inventive step",
]


def validate_domain(raw_query: str) -> DomainValidationResult:
    """
    Validates whether a user query belongs to the AYURLEX domain.
    """
    query = (raw_query or "").strip()
    if not query:
        return DomainValidationResult(
            is_domain_valid=False,
            reason_code="OUT_OF_DOMAIN",
            explanation="Empty query provided.",
        )

    q_lower = query.lower()

    # 1. Check explicit out-of-domain blocklist patterns first
    for pattern, code, label in OUT_OF_DOMAIN_PATTERNS:
        if pattern.search(q_lower):
            return DomainValidationResult(
                is_domain_valid=False,
                reason_code=code,
                explanation=f"Insufficient data. This question is outside the scope of the available Intellectual Property, Ayurveda, and regulatory sources ({label}).",
            )

    # 2. Check verified standalone pedagogical concepts
    for concept in VERIFIED_PEDAGOGICAL_CONCEPTS:
        if q_lower == concept or q_lower == f"{concept}?" or q_lower.startswith(f"{concept} "):
            return DomainValidationResult(
                is_domain_valid=True,
                reason_code="IN_DOMAIN",
                explanation="Verified pedagogical life-science / IP concept.",
            )

    # 3. Check for presence of genuine in-domain keywords
    has_in_domain_keyword = False
    for kw in IN_DOMAIN_KEYWORDS:
        escaped = re.escape(kw)
        if re.search(rf"(^|[^a-z0-9]){escaped}([^a-z0-9]|$)", q_lower, re.IGNORECASE):
            has_in_domain_keyword = True
            break

    if has_in_domain_keyword:
        return DomainValidationResult(
            is_domain_valid=True,
            reason_code="IN_DOMAIN",
            explanation="Matched verified IP, Ayurveda, or regulatory terminology.",
        )

    # 4. Reject queries with generic words lacking in-domain context
    return DomainValidationResult(
        is_domain_valid=False,
        reason_code="OUT_OF_DOMAIN",
        explanation="Insufficient data. This question is outside the scope of the available Intellectual Property, Ayurveda, and regulatory sources.",
    )
