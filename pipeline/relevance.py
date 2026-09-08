"""
pipeline/relevance.py
──────────────────────
SIH 26045 Relevance Filter for Patents.
Evaluates patent metadata and text against botanical entities, traditional
medicine concepts, IPC/CPC classification codes, and formulation terms.
"""
from __future__ import annotations

import re
from typing import Any, Dict, List, Tuple


# ─── IPC / CPC Classifications relevant to SIH 26045 ─────────────────────────
RELEVANT_IPC_PREFIXES = [
    "A61K36",    # Medicinal preparations of undetermined constitution containing material from algae, lichens, fungi or plants
    "A61K8/97",   # Cosmetics from plant origin
    "A61K9",      # Medicinal preparations characterized by special physical form
    "A61P",       # Specific therapeutic activity of chemical compounds or medicinal preparations
    "A61K35",     # Medicinal preparations containing material from mammals, non-mammals, etc.
    "A23L33/105", # Plant extracts in food/dietary supplements
    "A61Q",       # Specific use of cosmetics or similar toilet preparations
    "C11B9",      # Essential oils, perfumes
    "C07D",       # Heterocyclic compounds (phytochemical isolates)
]

# ─── Ayurvedic & Traditional Knowledge Keywords ──────────────────────────────
AYURVEDA_KEYWORDS = [
    "ayurveda", "ayurvedic", "ayush", "traditional medicine", "traditional knowledge",
    "tkdl", "unani", "siddha", "rasayana", "bhasma", "asava", "arishta",
    "churna", "taila", "ghrita", "kashayam", "polyherbal", "phytotherapy",
    "indigenous medicine", "ethnobotany", "ethnomedicine", "classical formulation"
]

# ─── Botanical & Phytochemical Entities ──────────────────────────────────────
BOTANICAL_ENTITIES = [
    # Latin binomials
    "withania somnifera", "curcuma longa", "zingiber officinale", "ocimum sanctum",
    "ocimum tenuiflorum", "tinospora cordifolia", "azadirachta indica", "phyllanthus emblica",
    "emblica officinalis", "commiphora mukul", "boswellia serrata", "bacopa monnieri",
    "tribulus terrestris", "asparagus racemosus", "terminalia arjuna", "terminalia chebula",
    "terminalia bellerica", "glycyrrhiza glabra", "allium sativum", "aloe barbadensis",
    "aloe vera", "andrographics paniculata", "centella asiatica", "commiphora wightii",
    "gymnema sylvestre", "piper nigrum", "piper longum", "cinnamomum verum",
    "cinnamomum zeylanicum", "syzygium aromaticum", "foeniculum vulgare",
    # Common / Ayurvedic names
    "ashwagandha", "turmeric", "curcumin", "ginger", "tulsi", "holy basil",
    "giloy", "guduchi", "neem", "amla", "guggul", "shallaki", "brahmi",
    "gokshura", "shatavari", "arjuna", "triphala", "licorice", "yashtimadhu",
    "garlic", "kalmegh", "gotu kola", "gurmar", "black pepper", "pippali"
]

# ─── Formulation & Pharmacognosy Terms ────────────────────────────────────────
FORMULATION_TERMS = [
    "plant extract", "herbal extract", "botanical extract", "herbal formulation",
    "herbal composition", "botanical composition", "medicinal plant", "herbal medicine",
    "phytochemical", "bioactive compound", "active ingredient", "therapeutic composition",
    "medicinal preparation", "pharmaceutical composition", "synergistic combination",
    "synergistic extract", "standardized extract", "aqueous extract", "alcoholic extract",
    "hydroalcoholic extract", "fractionation", "maceration", "percolation", "drug-to-extract"
]

# ─── German Specific Botanical & Patent Terms ─────────────────────────────────
GERMAN_BOTANICAL_TERMS = [
    "pflanzlicher extrakt", "pflanzliches arzneimittel", "pflanzenextrakt",
    "heilpflanze", "phytopharmaka", "phytotherapie", "traditionelles pflanzliches arzneimittel",
    "kräuterzubereitung", "drogen-extrakt-verhältnis", "wirkstoff", "arzneipflanze",
    "curcuma", "kurkuma", "ashwagandha", "ingwer", "weihrauch", "ginkgo",
    "johanniskraut", "kamille", "baldrian", "sonnenhut", "mönchspfeffer"
]


class RelevanceFilter:
    """Configurable relevance classifier for SIH 26045 patent records."""

    def __init__(
        self,
        min_score_threshold: float = 1.0,
        require_botanical_or_ayurvedic: bool = False
    ):
        self.min_score_threshold = min_score_threshold
        self.require_botanical_or_ayurvedic = require_botanical_or_ayurvedic

    def evaluate(self, record: Dict[str, Any]) -> Tuple[bool, float, List[str]]:
        """
        Evaluate a patent record for SIH 26045 relevance.
        Returns: (is_relevant, score, matched_reasons)
        """
        score = 0.0
        reasons = []

        title = str(record.get("title") or "").lower()
        abstract = str(record.get("abstract") or "").lower()
        claims_text = str(record.get("claims") or record.get("claims_text") or "").lower()
        ipc_list = record.get("ipc") or record.get("ipcr_labels") or []
        cpc_list = record.get("cpc") or record.get("cpc_labels") or []

        all_text = f"{title} {abstract} {claims_text[:2000]}"

        # 1. IPC / CPC Code Match (+3.0)
        matched_ipc = []
        for code in list(ipc_list) + list(cpc_list):
            clean_code = str(code).replace(" ", "").upper()
            for pref in RELEVANT_IPC_PREFIXES:
                if clean_code.startswith(pref.replace(" ", "").upper()):
                    matched_ipc.append(clean_code)
                    break
        if matched_ipc:
            score += 3.0
            reasons.append(f"IPC/CPC match: {', '.join(list(set(matched_ipc))[:3])}")

        # 2. Ayurvedic & Traditional Medicine Terms (+2.5)
        matched_ayur = [kw for kw in AYURVEDA_KEYWORDS if kw in all_text]
        if matched_ayur:
            score += 2.5
            reasons.append(f"Ayurveda/TM terms: {', '.join(matched_ayur[:3])}")

        # 3. Botanical Entities / Plant Names (+2.5)
        matched_botanical = [b for b in BOTANICAL_ENTITIES if b in all_text]
        if matched_botanical:
            score += 2.5
            reasons.append(f"Botanicals: {', '.join(matched_botanical[:3])}")

        # 4. German Botanical Terms (+2.5)
        matched_de_botanical = [b for b in GERMAN_BOTANICAL_TERMS if b in all_text]
        if matched_de_botanical:
            score += 2.5
            reasons.append(f"German botanicals: {', '.join(matched_de_botanical[:3])}")

        # 5. Formulation Concepts (+1.5)
        matched_formulation = [f for f in FORMULATION_TERMS if f in all_text]
        if matched_formulation:
            score += 1.5
            reasons.append(f"Formulation: {', '.join(matched_formulation[:3])}")

        # Decision
        is_relevant = score >= self.min_score_threshold
        if self.require_botanical_or_ayurvedic:
            has_botanical = bool(matched_ayur or matched_botanical or matched_de_botanical)
            is_relevant = is_relevant and has_botanical

        return is_relevant, score, reasons
