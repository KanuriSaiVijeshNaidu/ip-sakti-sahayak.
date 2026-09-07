"""
backend/app/services/intent_router.py
─────────────────────────────────────
Legal and regulatory intent classification and multi-domain routing layer.
Routes complex queries to multiple statutory domains without artificial silos.
"""
from __future__ import annotations

import re
from typing import Dict, List, Set

# Comprehensive Legal & Regulatory Intent Definitions
INTENT_KEYWORDS: Dict[str, List[str]] = {
    "PATENTABILITY": [
        "patent", "patentable", "patentability", "invention", "novelty", "inventive step",
        "non-obvious", "specification", "claims", "infringement", "prior art", "section 3"
    ],
    "SECTION_3_E": [
        "section 3(e)", "3(e)", "mere admixture", "admixture", "synergy", "synergistic",
        "aggregation of properties", "combination index", "chou-talalay"
    ],
    "SECTION_3_P": [
        "section 3(p)", "3(p)", "traditional knowledge", "traditional component",
        "aggregation of known", "biopiracy", "ancient knowledge"
    ],
    "TRADITIONAL_KNOWLEDGE": [
        "traditional knowledge", "tkdl", "classical formulation", "charaka", "sushruta",
        "bhavaprakasha", "ashtanga hridaya", "bhaishajya ratnavali", "afi", "api", "sloka"
    ],
    "TKDL_RISK": [
        "tkdl risk", "prior art in tkdl", "csir challenge", "biopiracy challenge",
        "ancient prior art", "turmeric patent", "neem patent"
    ],
    "FORMULATION_ANALYSIS": [
        "formulation", "ingredients", "botanical", "ratio", "dosage form", "churna",
        "vati", "asava", "arishta", "kwatha", "extract", "percentage", "composition"
    ],
    "AYUSH_COMPLIANCE": [
        "ayush", "ayurveda", "siddha", "unani", "sowa-rigpa", "homoeopathy",
        "ministry of ayush", "ayush license", "copp", "who gmp"
    ],
    "DRUG_REGULATION": [
        "drugs and cosmetics act", "rule 158b", "rule 158", "schedule t", "gmp",
        "state licensing authority", "sla", "clinical trial", "safety study", "shelf life"
    ],
    "FSSAI": [
        "fssai", "ayurveda aahara", "food safety", "dietary supplement", "nutraceutical",
        "rda", "permissible daily allowance", "fssai license"
    ],
    "BIODIVERSITY": [
        "biological diversity act", "bda", "national biodiversity authority", "nba",
        "section 6", "form iii", "access and benefit sharing", "abs", "state biodiversity board"
    ],
    "GI": [
        "geographical indication", "gi tag", "gi registry", "kashmir saffron",
        "appellation of origin", "geographical origin"
    ],
    "TRADEMARK": [
        "trademark", "trade mark", "brand name", "class 5", "deceptive similarity",
        "passing off", "ayurvedic brand"
    ],
    "PATENT_PROCEDURE": [
        "form 1", "form 2", "form 3", "form 5", "form 18", "inpass", "fer",
        "first examination report", "examination fee", "provisional specification"
    ],
    "INTERNATIONAL_IP": [
        "pct", "wipo", "uspto", "epo", "european patent", "us patent", "35 usc",
        "patent family", "priority date", "international application"
    ],
    "LICENSING": [
        "loan license", "manufacturing license", "third party manufacturing",
        "white labeling", "contract manufacturing", "gmp certification"
    ],
    "EXPORT_COMPLIANCE": [
        "export", "who-gmp", "certificate of pharmaceutical product", "copp",
        "heavy metal limits", "microbial limits", "pesticide residue"
    ],
}


class IntentClassificationResult:
    def __init__(
        self,
        query: str,
        primary_intents: List[str],
        target_domains: List[str],
        recommended_actions: List[str],
        extracted_entities: List[str],
    ):
        self.query = query
        self.primary_intents = primary_intents
        self.target_domains = target_domains
        self.recommended_actions = recommended_actions
        self.extracted_entities = extracted_entities

    def to_dict(self) -> Dict[str, any]:
        return {
            "query": self.query,
            "primary_intents": self.primary_intents,
            "target_domains": self.target_domains,
            "recommended_actions": self.recommended_actions,
            "extracted_entities": self.extracted_entities,
        }


def classify_and_route(query: str) -> IntentClassificationResult:
    """
    Classify user query into legal/regulatory intents and determine multi-domain routing.
    """
    q_lower = query.lower()
    matched_intents: Set[str] = set()

    for intent, keywords in INTENT_KEYWORDS.items():
        for kw in keywords:
            pattern = r"\b" + re.escape(kw) + r"\b"
            if re.search(pattern, q_lower):
                matched_intents.add(intent)
                break

    # Default fallback
    if not matched_intents:
        matched_intents.add("GENERAL_LEGAL_INFORMATION")

    # Map intents to authoritative search domains
    target_domains: Set[str] = set()

    if any(i in matched_intents for i in ("PATENTABILITY", "SECTION_3_E", "SECTION_3_P", "PATENT_PROCEDURE")):
        target_domains.add("patents")

    if any(i in matched_intents for i in ("TRADITIONAL_KNOWLEDGE", "TKDL_RISK", "SECTION_3_P")):
        target_domains.add("tkdl")
        target_domains.add("ayush")

    if any(i in matched_intents for i in ("DRUG_REGULATION", "LICENSING", "EXPORT_COMPLIANCE")):
        target_domains.add("ayush")

    if "FSSAI" in matched_intents:
        target_domains.add("fssai")

    if "BIODIVERSITY" in matched_intents:
        target_domains.add("patents")
        target_domains.add("ayush")

    if "GI" in matched_intents:
        target_domains.add("gi")

    if "TRADEMARK" in matched_intents:
        target_domains.add("trademarks")

    if "INTERNATIONAL_IP" in matched_intents:
        target_domains.add("patents")

    if not target_domains:
        target_domains.add("ayush")
        target_domains.add("patents")

    # Determine recommended operational steps
    recommended_actions: List[str] = []
    if "SECTION_3_E" in matched_intents or "PATENTABILITY" in matched_intents:
        recommended_actions.append("Evaluate synergistic bioassay data (Combination Index CI < 1.0)")
    if "SECTION_3_P" in matched_intents or "TRADITIONAL_KNOWLEDGE" in matched_intents:
        recommended_actions.append("Perform classical TKDL and AFI prior-art clearance")
    if "BIODIVERSITY" in matched_intents:
        recommended_actions.append("Initiate Form III approval with National Biodiversity Authority (NBA)")
    if "DRUG_REGULATION" in matched_intents:
        recommended_actions.append("Review State Licensing Authority (SLA) Rule 158B proof of safety dossier")

    return IntentClassificationResult(
        query=query,
        primary_intents=sorted(list(matched_intents)),
        target_domains=sorted(list(target_domains)),
        recommended_actions=recommended_actions,
        extracted_entities=[],
    )
