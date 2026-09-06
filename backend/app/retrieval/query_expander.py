"""
backend/app/retrieval/query_expander.py
───────────────────────────────────────
Intelligent Legal Query Expander for IP-SAKTI RAG Pipeline.
Enriches short, colloquial, or ambiguous legal queries with exact statutory
sections, official Act titles, and relevant classification terms to dramatically
boost BM25 lexical recall and dense vector semantic matching.
"""
from __future__ import annotations

import re
import logging
from typing import Tuple

logger = logging.getLogger(__name__)

# Statutory legal expansion dictionary for Indian IP and AYUSH/FSSAI frameworks
LEGAL_EXPANSION_RULES = [
    # Trademarks
    {
        "pattern": r"\b(trademark|trade mark|tm|brand name|logo protection|brand logo)\b",
        "domain": "trademarks",
        "expansion": (
            "The Trade Marks Act 1999 Section 2(1)(zb) graphical representation mark distinguishing goods services "
            "Section 2(1)(m) device brand heading label name signature word numeral shape of goods packaging "
            "Nice Classification Class 5 pharmaceutical Class 3 cosmetics Class 30 food Form TM-A Section 28 exclusive rights"
        )
    },
    # Patents general
    {
        "pattern": r"\b(patent|patents|inventor|invention|inventive step|prior art)\b",
        "domain": "patents",
        "expansion": (
            "The Patents Act 1970 Section 2(1)(j) invention Section 2(1)(ja) inventive step Section 2(1)(l) novelty "
            "industrial applicability Section 48 exclusive rights Section 53 20 year term Form 1 Form 2 Complete Specification"
        )
    },
    # Patents & Ayurvedic formulations
    {
        "pattern": r"\b(ashwagandha|curcumin|herbal formulation|ayurvedic patent|synergy|admixture)\b",
        "domain": "patents",
        "expansion": (
            "Section 3(p) traditional knowledge TKDL prior art exclusion Section 3(e) mere admixture synergistic effect "
            "Combination Index CI bioassay data Biological Diversity Act 2002 Section 6 National Biodiversity Authority NBA Form III"
        )
    },
    # AYUSH Drug Licensing & GMP
    {
        "pattern": r"\b(ayush license|register.*ayurvedic|register.*product|manufacturing license|form 24d|form 25d|schedule t|gmp)\b",
        "domain": "ayush",
        "expansion": (
            "Drugs and Cosmetics Act 1940 Chapter IV-A Section 3(a) Ayurvedic Siddha Unani drug First Schedule authoritative texts "
            "Drugs and Cosmetics Rules 1945 Rule 158B Patent or Proprietary medicine Schedule T Good Manufacturing Practices "
            "State Licensing Authority SLA e-Aushadhi Form 24D Form 25D loan license Form 26D"
        )
    },
    # Ayurveda Aahara & FSSAI
    {
        "pattern": r"\b(fssai|ayurveda aahara|food supplement|dietary supplement|herbal tea|label.*ayurveda)\b",
        "domain": "fssai",
        "expansion": (
            "Food Safety and Standards Ayurveda Aahara Regulations 2022 Regulation 2.2 official logo category name "
            "Regulation 2.3 prohibition of disease diagnosis cure mitigation claims Schedule A Schedule II heavy metal limits FoSCoS"
        )
    },
    # Geographical Indications
    {
        "pattern": r"\b(gi tag|geographical indication|kashmir saffron|navara rice)\b",
        "domain": "gi",
        "expansion": (
            "The Geographical Indications of Goods Registration and Protection Act 1999 Section 2(e) territory region locality "
            "goods originating Section 8 collective community ownership Section 66 infringement"
        )
    },
    # Biodiversity & NBA
    {
        "pattern": r"\b(nba|biodiversity|biological diversity|access and benefit sharing|abs)\b",
        "domain": "ayush",
        "expansion": (
            "Biological Diversity Act 2002 Section 6 mandatory prior approval Form III National Biodiversity Authority NBA "
            "State Biodiversity Board biological resources fair equitable benefit sharing ABS"
        )
    },
    # Ayurveda Foundations & Principles
    {
        "pattern": r"\b(what is ayurveda|tridosha|dosha|vata|pitta|kapha|sapta dhatu|samadosha|principles of ayurveda|why ayurveda|swasthya|science of life)\b",
        "domain": "ayurveda_foundations",
        "expansion": (
            "Ayurveda Science of Life Tridosha Vata Pitta Kapha Sapta Dhatus Samadosha "
            "Swasthasya Swasthya Rakshanam Aturasya Vikara Prashamanam First Schedule Drugs and Cosmetics Act 1940 Section 3(a) NCISM Act 2020"
        )
    },
    # D2C Commercialization, Selling without patent, and Brand protection
    {
        "pattern": r"\b(sell.*without.*patent|without.*patent|don't patent|dont.*patent|d2c|commercializ.*|sell.*direct|sell.*consumer|start.*ayurvedic.*brand|trade secret.*ayurvedic|licenses.*sell|non-patent)\b",
        "domain": "ayurveda_commercialization",
        "expansion": (
            "Direct-to-consumer D2C commercialization without patent Form 25D manufacturing license "
            "Schedule T GMP FSSAI Ayurveda Aahara Regulations 2022 Trade Marks Act 1999 Class 5 Class 3 trade secrets public domain classical formulation"
        )
    }
]


def expand_query(query: str, max_expansion_tokens: int = 40) -> Tuple[str, list[str]]:
    """
    Expands a user query with relevant statutory terminology.
    Returns:
        (expanded_query_string, matched_domains)
    """
    q_lower = query.lower().strip()
    expansions = []
    detected_domains = []

    for rule in LEGAL_EXPANSION_RULES:
        if re.search(rule["pattern"], q_lower, re.IGNORECASE):
            expansions.append(rule["expansion"])
            if rule["domain"] not in detected_domains:
                detected_domains.append(rule["domain"])

    if not expansions:
        return query, []

    # Join unique expansion tokens to prevent bloat
    expansion_text = " ".join(expansions)
    words = [w for w in expansion_text.split() if len(w) > 2]
    # Deduplicate while preserving order
    seen = set()
    unique_words = []
    for w in words:
        w_lower = w.lower()
        if w_lower not in seen and w_lower not in q_lower:
            seen.add(w_lower)
            unique_words.append(w)
        if len(unique_words) >= max_expansion_tokens:
            break

    expanded_query = f"{query} {' '.join(unique_words)}"
    logger.debug(f"Query expanded: '{query}' -> '{expanded_query[:100]}...'")
    return expanded_query, detected_domains
