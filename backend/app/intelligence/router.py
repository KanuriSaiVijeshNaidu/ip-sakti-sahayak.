"""
backend/app/intelligence/router.py
───────────────────────────────────
AYURLEX Intelligence Router.
Classifies user inquiries to route between:
  1. GENERAL_KNOWLEDGE: Educational, conceptual, or scientific explanations
  2. LEGAL_REGULATORY: Authoritative statutory, patent, or regulatory RAG
  3. PRODUCT_ANALYSIS: Product formulation, FTO, and commercialization
  4. MIXED: Conceptual question applied to a specific product or jurisdiction
"""
from __future__ import annotations

import re
from enum import Enum
from typing import Dict, Any, Optional, Tuple
from pydantic import BaseModel, Field


class QueryCategory(str, Enum):
    GENERAL_KNOWLEDGE = "GENERAL_KNOWLEDGE"
    LEGAL_REGULATORY = "LEGAL_REGULATORY"
    PRODUCT_ANALYSIS = "PRODUCT_ANALYSIS"
    MIXED = "MIXED"


class RoutingDecision(BaseModel):
    category: QueryCategory
    confidence: float = 1.0
    detected_intent: str
    target_jurisdiction: Optional[str] = None
    target_domain: Optional[str] = None
    requires_rag: bool = True
    requires_evidence_gate: bool = True
    is_general_educational: bool = False
    is_unsupported_jurisdiction: bool = False
    unsupported_jurisdiction_code: Optional[str] = None
    reasoning: str


UNINDEXED_JURISDICTIONS = {
    "AU": ("Australia (TGA)", r"\b(australia|tga)\b"),
    "BR": ("Brazil (ANVISA)", r"\b(brazil|brasil|anvisa)\b"),
    "CN": ("China (NMPA / CNIPA)", r"\b(china|nmpa|cnipa)\b"),
    "CA": ("Canada (Health Canada)", r"\b(canada|health canada)\b"),
    "UK": ("United Kingdom (MHRA)", r"\b(united kingdom|uk|mhra|britain|england)\b"),
    "GB": ("United Kingdom (MHRA)", r"\b(great britain|gb)\b"),
    "RU": ("Russia (Rospatent)", r"\b(russia|rospatent)\b"),
    "ZA": ("South Africa (SAHPRA)", r"\b(south africa|sahpra)\b"),
    "NZ": ("New Zealand (Medsafe)", r"\b(new zealand|medsafe)\b"),
}

RE_STATUTORY_ARTICLE = re.compile(
    r"\b("
    r"35\s*u\.?s\.?c\.?(\s*(§|sec\.?|section)?\s*\d+)?|"
    r"section\s+(101|102|103|112|271|3\([a-z]\)|10\(4\)|13|9|28|29)|"
    r"article\s+(29(\(\d+\))?|52|53(\([a-z]\))?|54(\(\d+\))?|56|57|18|19|21|22|33)|"
    r"epc\s+article\s+\d+|pct\s+article\s+\d+|pct\s+chapter(\s+[ivx]+)?|"
    r"rule\s+(158b|43bis)|schedule\s+t|form\s+(25d|24d|tm-a|iii)|"
    r"dshea|21\s*u\.?s\.?c\.?|21\s*cfr|cgmp|"
    r"pmd\s+act|mhlw(\s+circular)?|circular\s+(no\.?\s*)?429|ffc|foods\s+with\s+function\s+claims|"
    r"fssai|ayurveda\s+aahara|nba|biological\s+diversity(\s+act)?|tkdl|traditional\s+knowledge\s+digital\s+library|"
    r"特許法|薬機法"
    r")\b",
    re.IGNORECASE,
)

RE_JURISDICTION_LEGAL = re.compile(
    r"\b("
    r"under\s+(us|usa|united\s+states|japanese?|indian?|epc|epo|pct|wipo|europe|european)\s+(patent\s+law|law|statute|rules?|act)|"
    r"in\s+(the\s+)?(us|usa|united\s+states|japan|india|europe)\s+(patent\s+law|law|patentability)|"
    r"(novelty|inventive\s+step|non-obviousness?|patentability|prior\s+art|infringement)\s+under\s+(us|usa|japan|india|epc|pct|epo|wipo)|"
    r"(food\s+and\s+drug|food-drug)\s+boundary\s+under|"
    r"chapter\s+ii\s+of\s+pct|wo-isa|iprp|isr"
    r")\b",
    re.IGNORECASE,
)

GENERAL_PATTERNS = [
    r"^what\s+is\s+(an?\s+)?(patent|trademark|trade\s+mark|prior\s+art|rag|novelty|patent\s+novelty|inventive\s+step|freedom\s+to\s+operate|fto|photosynthesis|dna|herb|ayurveda|intellectual\s+property)\??$",
    r"^what\s+is\s+(an?\s+)?(patent|trademark|trade\s+mark|prior\s+art|rag|novelty|inventive\s+step|photosynthesis)\b(?!\s+(under|according|in\s+(the\s+)?(us|japan|india|europe)))",
    r"^explain\s+(a\s+)?(patent|trademark|trade\s+mark|rag|prior\s+art|novelty|inventive\s+step|freedom\s+to\s+operate|fto|photosynthesis|how\s+patents\s+work|this\s+simply)\b(?!\s+(under|according|in\s+(the\s+)?(us|japan|india|europe)))",
    r"^how\s+does\s+(photosynthesis|rag|retrieval\s+augmented\s+generation|a\s+patent\s+work|a\s+trademark\s+work)",
    r"^tell\s+me\s+about\s+(photosynthesis|patents?|trademarks?|the\s+history\s+of\s+ayurveda|how\s+plants\s+grow)",
    r"^define\s+(an?\s+)?(patent|trademark|trade\s+mark|prior\s+art|novelty|inventive\s+step|synergy|freedom\s+to\s+operate|fto)\??$",
]

LEGAL_KEYWORDS = [
    "patent", "patentability", "section 3", "3(p)", "3(e)", "3(d)", "10(4)", "cgpdtm",
    "trademark", "trade mark", "nice class", "class 5", "class 3", "class 30", "section 13", "section 9",
    "fssai", "ayurveda aahara", "food safety",
    "drugs and cosmetics", "d&c", "rule 158b", "schedule t", "gmp",
    "biodiversity", "nba", "biological diversity act", "abs", "access and benefit sharing", "section 6",
    "tkdl", "traditional knowledge digital library", "biopiracy",
    "commercialization", "sell", "market", "export", "form 25d", "licensing",
    "who", "heavy metal", "lead", "arsenic", "cadmium", "mercury", "copp",
    "uspto", "35 u.s.c", "dshea", "21 cfr", "fda",
    "jpo", "kampo", "pmd act", "ffc",
    "epo", "epc", "article 54", "article 56", "second medical use",
    "thmpd", "directive 2004/24/ec",
    "pct", "wipo", "patentscope", "genetic resources treaty"
]


class IntelligenceRouter:
    """Classifies user query and determines RAG / General Intelligence routing."""

    def route(
        self,
        query: str,
        explicit_jurisdiction: Optional[str] = None,
        conversation_context: Optional[Dict[str, Any]] = None,
    ) -> RoutingDecision:
        q_raw = query.strip()
        q_lower = q_raw.lower()

        # ── 1. Check for Unsupported Jurisdictions ─────────────────────────────
        target_jur = (explicit_jurisdiction or "").strip().upper()
        # Check if query mentions an unindexed country
        for code, (name, pattern) in UNINDEXED_JURISDICTIONS.items():
            if re.search(pattern, q_lower) or target_jur == code:
                return RoutingDecision(
                    category=QueryCategory.LEGAL_REGULATORY,
                    confidence=1.0,
                    detected_intent="unsupported_jurisdiction",
                    target_jurisdiction=code[:2],
                    requires_rag=False,
                    requires_evidence_gate=True,
                    is_unsupported_jurisdiction=True,
                    unsupported_jurisdiction_code=code[:2],
                    reasoning=f"Jurisdiction '{name}' is not indexed in the verified AYURLEX corpus.",
                )

        # ── Resolve Target Jurisdiction Helper ─────────────────────────────────
        detected_jur = target_jur
        if not detected_jur:
            if re.search(r"\b(jp|japan|japanese|jpo|pmda|mhlw|特許法|薬機法)\b", q_lower) or "日本" in query:
                detected_jur = "JP"
            elif re.search(r"\b(us|usa|united states|uspto|35\s*u\.?s\.?c|fda|dshea|21\s*cfr|21\s*u\.?s\.?c)\b", q_lower) or "米国" in query or "アメリカ" in query:
                detected_jur = "US"
            elif re.search(r"\b(wo|wipo|pct|international preliminary|international application|patentscope|iprp|isr|wo-isa)\b", q_lower) or "国際出願" in query:
                detected_jur = "WO"
            elif re.search(r"\b(ep|epo|european|europe|epc|thmpd)\b", q_lower) or "欧州" in query:
                detected_jur = "EP"
            elif re.search(r"\b(in|india|indian|cgpdtm|ipo|ayush|fssai|section 3|tkdl|nba|rule 158b)\b", q_lower) or any(k in query for k in ["भारत", "भारतीय", "భారత"]):
                detected_jur = "IN"
            else:
                detected_jur = "IN"

        # ── Detect Specific Legal / Regulatory Domain Helper ───────────────────
        target_domain = "patent_law"
        if "trademark" in q_lower or "trade mark" in q_lower or "section 13" in q_lower or "class 5" in q_lower:
            target_domain = "trademarks"
        elif "fssai" in q_lower or "ayurveda aahara" in q_lower or "food supplement" in q_lower or "dietary" in q_lower or "ffc" in q_lower:
            target_domain = "food_safety_fssai"
        elif "rule 158b" in q_lower or "schedule t" in q_lower or "drugs and cosmetics" in q_lower or "asu" in q_lower or "pmd act" in q_lower:
            target_domain = "drugs_cosmetics_rules"
        elif "biodiversity" in q_lower or "nba" in q_lower or "biological diversity" in q_lower or "abs" in q_lower:
            target_domain = "access_benefit_sharing"
        elif "tkdl" in q_lower or "traditional knowledge" in q_lower or "biopiracy" in q_lower or "turmeric" in q_lower:
            target_domain = "traditional_knowledge"
        elif "commercializ" in q_lower or "sell" in q_lower or "market" in q_lower or "d2c" in q_lower or "form 25d" in q_lower:
            target_domain = "commercialization_d2c"
        elif "heavy metal" in q_lower or "export" in q_lower or "who" in q_lower or "copp" in q_lower:
            target_domain = "export_compliance"

        # ── 2. Priority 1: Explicit Statutory / Jurisdiction Legal Inquiries ───
        is_statutory = bool(RE_STATUTORY_ARTICLE.search(q_lower))
        is_jurisdiction_legal = bool(RE_JURISDICTION_LEGAL.search(q_lower))

        if is_statutory or is_jurisdiction_legal:
            return RoutingDecision(
                category=QueryCategory.LEGAL_REGULATORY,
                confidence=0.98,
                detected_intent=f"{target_domain}_statutory_inquiry",
                target_jurisdiction=detected_jur,
                target_domain=target_domain,
                requires_rag=True,
                requires_evidence_gate=True,
                is_general_educational=False,
                reasoning=f"Identified Priority 1 statutory/jurisdiction legal inquiry targeting {detected_jur} under {target_domain}.",
            )

        # ── 3. Priority 2: Concrete Product / Commercial Formulation Clearance
        is_concrete_application = any(
            term in q_lower for term in [
                "my product", "this product", "formulation", "extract", "patentable", "can i", "sell", "export",
                "market", "infringe", "infringement", "ashwagandha", "curcumin", "piperine", "triphala", "brahmi",
                "churna", "taila", "capsule", "tablet", "syrup", "in india", "in usa", "in japan", "in europe", "under pmd",
                "find patents", "prior art for", "patents related to"
            ]
        )
        is_product = any(term in q_lower for term in [
            "this formulation", "my product", "extract", "capsule", "syrup", "churna", "taila", "softgel", "tablet",
            "curcumin", "ashwagandha", "piperine", "supplement", "dietary supplement"
        ])

        if is_concrete_application:
            category = QueryCategory.PRODUCT_ANALYSIS if is_product else QueryCategory.LEGAL_REGULATORY
            return RoutingDecision(
                category=category,
                confidence=0.95,
                detected_intent=f"{target_domain}_inquiry",
                target_jurisdiction=detected_jur,
                target_domain=target_domain,
                requires_rag=True,
                requires_evidence_gate=True,
                is_general_educational=False,
                reasoning=f"Identified {category.value} application query targeting {detected_jur} under {target_domain}.",
            )

        # ── 4. Priority 3: Pure Conceptual / General Knowledge Questions ───────
        is_general = False
        for pat in GENERAL_PATTERNS:
            if re.search(pat, q_lower):
                is_general = True
                break

        is_pure_concept = (
            q_lower in ["what is a patent?", "what is a patent", "what is a trademark?", "what is a trademark",
                        "what is novelty?", "what is novelty", "what is inventive step?", "what is inventive step",
                        "what is prior art?", "what is prior art", "how does photosynthesis work?", "how does photosynthesis work"]
            or (q_lower.startswith(("what is ", "explain ", "how does ", "define ", "tell me about "))
                and not any(k in q_lower for k in ["us", "japan", "india", "europe", "pct", "epc", "act", "section", "article", "law", "statute", "supplement", "fda", "pmd"]))
        )

        if is_general or is_pure_concept:
            return RoutingDecision(
                category=QueryCategory.GENERAL_KNOWLEDGE,
                confidence=0.95,
                detected_intent="general_educational",
                target_jurisdiction=None,
                requires_rag=False,
                requires_evidence_gate=False,
                is_general_educational=True,
                reasoning="General educational/scientific/conceptual query that does not require statutory evidence grounding.",
            )

        # ── 5. Default Fallback ───────────────────────────────────────────────
        category = QueryCategory.PRODUCT_ANALYSIS if is_product else QueryCategory.LEGAL_REGULATORY
        return RoutingDecision(
            category=category,
            confidence=0.90,
            detected_intent=f"{target_domain}_inquiry",
            target_jurisdiction=detected_jur,
            target_domain=target_domain,
            requires_rag=True,
            requires_evidence_gate=True,
            is_general_educational=False,
            reasoning=f"Defaulted to {category.value} query targeting {detected_jur} under {target_domain}.",
        )


intelligence_router = IntelligenceRouter()
