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
    "AU": "Australia (TGA)",
    "AUSTRALIA": "Australia (TGA)",
    "BR": "Brazil (ANVISA)",
    "BRAZIL": "Brazil (ANVISA)",
    "CN": "China (NMPA / CNIPA)",
    "CHINA": "China (NMPA / CNIPA)",
    "CA": "Canada (Health Canada)",
    "CANADA": "Canada (Health Canada)",
    "UK": "United Kingdom (MHRA)",
    "GB": "United Kingdom (MHRA)",
    "RU": "Russia (Rospatent)",
    "RUSSIA": "Russia (Rospatent)",
    "ZA": "South Africa (SAHPRA)",
    "NZ": "New Zealand (Medsafe)",
}

GENERAL_PATTERNS = [
    r"^what\s+is\s+(an?\s+)?(patent|trademark|trade\s+mark|prior\s+art|rag|novelty|patent\s+novelty|inventive\s+step|freedom\s+to\s+operate|fto|photosynthesis|dna|herb|ayurveda|intellectual\s+property)",
    r"^explain\s+(a\s+)?(patent|trademark|trade\s+mark|rag|prior\s+art|novelty|patent\s+novelty|inventive\s+step|freedom\s+to\s+operate|fto|photosynthesis|how\s+patents\s+work|this\s+simply)",
    r"^how\s+does\s+(photosynthesis|rag|retrieval\s+augmented\s+generation|a\s+patent\s+work|a\s+trademark\s+work)",
    r"^tell\s+me\s+about\s+(photosynthesis|patents?|trademarks?|the\s+history\s+of\s+ayurveda|how\s+plants\s+grow)",
    r"^define\s+(an?\s+)?(patent|trademark|trade\s+mark|prior\s+art|novelty|inventive\s+step|synergy|freedom\s+to\s+operate|fto)",
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
        for code, name in UNINDEXED_JURISDICTIONS.items():
            pattern = rf"\b{code.lower()}\b|\b{name.lower().split()[0]}\b"
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
                    reasoning=f"Jurisdiction '{code}' is not indexed in the verified AYURLEX corpus.",
                )

        # ── 2. Check for Pure General / Educational Questions ─────────────────
        is_general = False
        for pat in GENERAL_PATTERNS:
            if re.search(pat, q_lower):
                is_general = True
                break

        # Check if query is directed at a concrete formulation, commercial action, or jurisdiction clearance
        is_concrete_application = any(
            term in q_lower for term in [
                "my product", "this product", "formulation", "extract", "patentable", "can i", "sell", "export",
                "market", "infringe", "infringement", "ashwagandha", "curcumin", "piperine", "triphala", "brahmi",
                "churna", "taila", "capsule", "tablet", "syrup", "in india", "in usa", "in japan", "in europe", "under pmd"
            ]
        )

        has_legal_kw = any(kw in q_lower for kw in LEGAL_KEYWORDS)

        # Pure concept queries ("What is a patent?", "What is a trademark?", "How does photosynthesis work?", "What is novelty in patent law?")
        is_conceptual_question = (
            q_lower.startswith("what is") or
            q_lower.startswith("explain") or
            q_lower.startswith("how does") or
            q_lower.startswith("define") or
            q_lower.startswith("tell me about")
        )

        if (is_general or (is_conceptual_question and not is_concrete_application)):
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

        # ── 3. Resolve Target Jurisdiction from Query ─────────────────────────
        detected_jur = target_jur or "IN"
        if "japan" in q_lower or "jpo" in q_lower or "kampo" in q_lower or "日本" in q_lower:
            detected_jur = "JP"
        elif "usa" in q_lower or "united states" in q_lower or "uspto" in q_lower or "fda" in q_lower:
            detected_jur = "US"
        elif "europe" in q_lower or "epo" in q_lower or "thmpd" in q_lower:
            detected_jur = "EP"
        elif "wipo" in q_lower or "pct" in q_lower or "international" in q_lower or "treaty" in q_lower:
            detected_jur = "WO"
        elif "india" in q_lower or "cgpdtm" in q_lower or "ayush" in q_lower or "fssai" in q_lower:
            detected_jur = "IN"

        # ── 4. Detect Specific Legal / Regulatory Domain ──────────────────────
        target_domain = "patent_law"
        if "trademark" in q_lower or "trade mark" in q_lower or "section 13" in q_lower or "class 5" in q_lower:
            target_domain = "trademarks"
        elif "fssai" in q_lower or "ayurveda aahara" in q_lower or "food supplement" in q_lower or "dietary" in q_lower:
            target_domain = "food_safety_fssai"
        elif "rule 158b" in q_lower or "schedule t" in q_lower or "drugs and cosmetics" in q_lower or "asu" in q_lower:
            target_domain = "drugs_cosmetics_rules"
        elif "biodiversity" in q_lower or "nba" in q_lower or "biological diversity" in q_lower or "abs" in q_lower:
            target_domain = "access_benefit_sharing"
        elif "tkdl" in q_lower or "traditional knowledge" in q_lower or "biopiracy" in q_lower or "turmeric" in q_lower:
            target_domain = "traditional_knowledge"
        elif "commercializ" in q_lower or "sell" in q_lower or "market" in q_lower or "d2c" in q_lower or "form 25d" in q_lower:
            target_domain = "commercialization_d2c"
        elif "heavy metal" in q_lower or "export" in q_lower or "who" in q_lower or "copp" in q_lower:
            target_domain = "export_compliance"

        # ── 5. Classify between Product Analysis and General Legal ────────────
        is_product = any(term in q_lower for term in ["this formulation", "my product", "extract", "capsule", "syrup", "churna", "taila", "softgel", "tablet"])
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
            reasoning=f"Identified {category.value} query targeting {detected_jur} under {target_domain}.",
        )


intelligence_router = IntelligenceRouter()
