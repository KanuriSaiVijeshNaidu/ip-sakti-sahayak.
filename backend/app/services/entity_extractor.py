"""
backend/app/services/entity_extractor.py
────────────────────────────────────────
Entity extraction and taxonomic normalization layer for botanical,
Sanskrit, vernacular, and pharmacopoeial entities.
"""
from __future__ import annotations

import re
from typing import Dict, List, Optional, Tuple
from backend.app.models.schemas import NormalizedBotanicalEntity

# Comprehensive Ayurvedic & Botanical Knowledge Registry
BOTANICAL_REGISTRY: Dict[str, Dict[str, any]] = {
    "haridra": {
        "common_name": "Turmeric",
        "botanical_name": "Curcuma longa L.",
        "sanskrit_name": "Haridra (हरिद्रा / निशा)",
        "family": "Zingiberaceae",
        "part_used": "Rhizome",
        "active_compounds": ["Curcumin", "Demethoxycurcumin", "Bisdemethoxycurcumin", "Turmerone"],
        "classical_treatises": ["Charaka Samhita", "Sushruta Samhita", "Bhavaprakasha"],
        "synonyms": ["turmeric", "haldi", "pasupu", "manjal", "curcumin", "nisha", "kanchani", "curcuma longa", "curcuma"]
    },
    "maricha": {
        "common_name": "Black Pepper",
        "botanical_name": "Piper nigrum L.",
        "sanskrit_name": "Maricha (मरिच / कृष्ण)",
        "family": "Piperaceae",
        "part_used": "Dried Fruit",
        "active_compounds": ["Piperine", "Piperidine", "Chavicine"],
        "classical_treatises": ["Charaka Samhita", "Ashtanga Hridaya", "Sharangadhara Samhita"],
        "synonyms": ["black pepper", "kali mirch", "miriyalu", "milagu", "piperine", "maricha", "krishna", "piper nigrum"]
    },
    "shunthi": {
        "common_name": "Dry Ginger",
        "botanical_name": "Zingiber officinale Roscoe",
        "sanskrit_name": "Shunthi (शुण्ठी / नागर)",
        "family": "Zingiberaceae",
        "part_used": "Dried Rhizome",
        "active_compounds": ["Gingerol", "Shogaol", "Zingiberene"],
        "classical_treatises": ["Charaka Samhita", "Bhaishajya Ratnavali"],
        "synonyms": ["ginger", "dry ginger", "sonth", "shonti", "sukku", "zingiber officinale", "nagara", "shunthi", "ardraka"]
    },
    "ashwagandha": {
        "common_name": "Indian Ginseng / Winter Cherry",
        "botanical_name": "Withania somnifera (L.) Dunal",
        "sanskrit_name": "Ashwagandha (अश्वगन्धा / वराहकर्णी)",
        "family": "Solanaceae",
        "part_used": "Root",
        "active_compounds": ["Withaferin A", "Withanolide A", "Withanolide D", "Sominone"],
        "classical_treatises": ["Charaka Samhita", "Sushruta Samhita", "Bhavaprakasha"],
        "synonyms": ["ashwagandha", "indian ginseng", "asgandh", "asvagandha", "pennerugadda", "amukkarakizhangu", "withania somnifera", "withania"]
    },
    "guduchi": {
        "common_name": "Heart-leaved Moonseed",
        "botanical_name": "Tinospora cordifolia (Willd.) Miers",
        "sanskrit_name": "Guduchi (गुडूची / अमृता)",
        "family": "Menispermaceae",
        "part_used": "Stem",
        "active_compounds": ["Tinosporide", "Cordifolide", "Berberine", "Tinosporine"],
        "classical_treatises": ["Charaka Samhita", "Sushruta Samhita", "Ashtanga Hridaya"],
        "synonyms": ["giloy", "guduchi", "amrita", "tippateega", "seenthilkodi", "tinospora cordifolia", "tinospora"]
    },
    "amalaki": {
        "common_name": "Indian Gooseberry",
        "botanical_name": "Phyllanthus emblica L. (syn. Emblica officinalis)",
        "sanskrit_name": "Amalaki (आमलकी / धात्री)",
        "family": "Phyllanthaceae",
        "part_used": "Pericarp / Fresh Fruit",
        "active_compounds": ["Ascorbic Acid (Vitamin C)", "Emblicanin A", "Emblicanin B", "Gallic Acid"],
        "classical_treatises": ["Charaka Samhita", "Sushruta Samhita", "AFI Part I"],
        "synonyms": ["amla", "amalaki", "usirikaya", "nellikai", "indian gooseberry", "emblica officinalis", "phyllanthus emblica", "dhatri"]
    },
    "haritaki": {
        "common_name": "Chebulic Myrobalan",
        "botanical_name": "Terminalia chebula Retz.",
        "sanskrit_name": "Haritaki (हरीतकी / अभया)",
        "family": "Combretaceae",
        "part_used": "Pericarp of Fruit",
        "active_compounds": ["Chebulinic Acid", "Chebulagic Acid", "Corilagin", "Tannins"],
        "classical_treatises": ["Charaka Samhita", "Bhavaprakasha", "AFI Part I"],
        "synonyms": ["haritaki", "harad", "karakkaya", "kadukkai", "terminalia chebula", "abhaya"]
    },
    "bibhitaki": {
        "common_name": "Belliric Myrobalan",
        "botanical_name": "Terminalia bellirica (Gaertn.) Roxb.",
        "sanskrit_name": "Bibhitaki (विभीतकी / कलिद्रुम)",
        "family": "Combretaceae",
        "part_used": "Dried Fruit Pericarp",
        "active_compounds": ["Bellericanin", "Gallic Acid", "Ellagic Acid"],
        "classical_treatises": ["Charaka Samhita", "AFI Part I"],
        "synonyms": ["bibhitaki", "baheda", "thanikkaya", "thandi", "terminalia bellirica", "vibhitaki"]
    },
    "brahmi": {
        "common_name": "Water Hyssop",
        "botanical_name": "Bacopa monnieri (L.) Wettst.",
        "sanskrit_name": "Brahmi (ब्राह्मी / ऐन्द्री)",
        "family": "Plantaginaceae",
        "part_used": "Whole Plant",
        "active_compounds": ["Bacoside A", "Bacoside B", "Bacopasaponins"],
        "classical_treatises": ["Charaka Samhita", "Sushruta Samhita", "Ashtanga Hridaya"],
        "synonyms": ["brahmi", "bacopa monnieri", "bacopa", "saraswathi aaku", "vallarai", "aindri"]
    },
    "tulsi": {
        "common_name": "Holy Basil",
        "botanical_name": "Ocimum sanctum L. (syn. Ocimum tenuiflorum)",
        "sanskrit_name": "Tulasi (तुलसी / सुरसा)",
        "family": "Lamiaceae",
        "part_used": "Leaves and Seeds",
        "active_compounds": ["Eugenol", "Ursolic Acid", "Rosmarinic Acid", "Caryophyllene"],
        "classical_treatises": ["Bhavaprakasha", "Charaka Samhita"],
        "synonyms": ["tulsi", "tulasi", "holy basil", "ocimum sanctum", "ocimum tenuiflorum", "surasa"]
    },
    "shatavari": {
        "common_name": "Wild Asparagus",
        "botanical_name": "Asparagus racemosus Willd.",
        "sanskrit_name": "Shatavari (शतावरी / बहुसुता)",
        "family": "Asparagaceae",
        "part_used": "Tuberous Root",
        "active_compounds": ["Shatavarin I-IV", "Sarsasapogenin", "Isoflavones"],
        "classical_treatises": ["Charaka Samhita", "Ashtanga Hridaya"],
        "synonyms": ["shatavari", "satavari", "asparagus racemosus", "satavar", "pillithithara"]
    },
    "guggulu": {
        "common_name": "Indian Bdellium",
        "botanical_name": "Commiphora mukul (Stocks) Hook. (syn. Commiphora wightii)",
        "sanskrit_name": "Guggulu (गुग्गुलु / महिशाक्ष)",
        "family": "Burseraceae",
        "part_used": "Exudate / Oleo-gum-resin",
        "active_compounds": ["Guggulsterone E", "Guggulsterone Z", "Myrcene"],
        "classical_treatises": ["Sushruta Samhita", "Charaka Samhita", "Bhaishajya Ratnavali"],
        "synonyms": ["guggulu", "guggul", "commiphora mukul", "commiphora wightii", "guggilam"]
    },
    "neem": {
        "common_name": "Margosa Tree / Neem",
        "botanical_name": "Azadirachta indica A. Juss.",
        "sanskrit_name": "Nimba (निम्ब / अरिष्ट)",
        "family": "Meliaceae",
        "part_used": "Bark, Leaves, Seeds",
        "active_compounds": ["Azadirachtin", "Nimbin", "Nimbidin", "Salannin"],
        "classical_treatises": ["Charaka Samhita", "Sushruta Samhita"],
        "synonyms": ["neem", "nimba", "azadirachta indica", "veppa", "vepam", "arishta"]
    },
    "arjuna": {
        "common_name": "Arjuna Bark",
        "botanical_name": "Terminalia arjuna (Roxb. ex DC.) Wight & Arn.",
        "sanskrit_name": "Arjuna (अर्जुन / धवल)",
        "family": "Combretaceae",
        "part_used": "Stem Bark",
        "active_compounds": ["Arjunic Acid", "Arjunolic Acid", "Arjungenin", "Terminic Acid"],
        "classical_treatises": ["Charaka Samhita", "Chakradatta"],
        "synonyms": ["arjuna", "terminalia arjuna", "maddi", "marudham"]
    },
    "vasa": {
        "common_name": "Malabar Nut",
        "botanical_name": "Justicia adhatoda L. (syn. Adhatoda vasica Nees)",
        "sanskrit_name": "Vasa (वासा / वाशक)",
        "family": "Acanthaceae",
        "part_used": "Leaves and Root",
        "active_compounds": ["Vasicine", "Vasicinone", "Adhatodine"],
        "classical_treatises": ["Charaka Samhita", "Bhaishajya Ratnavali"],
        "synonyms": ["vasa", "adhatoda vasica", "justicia adhatoda", "adulsa", "vasaka"]
    },
    "kumkuma": {
        "common_name": "Saffron",
        "botanical_name": "Crocus sativus L.",
        "sanskrit_name": "Kumkuma (कुङ्कुम / केशर)",
        "family": "Iridaceae",
        "part_used": "Stigma and Style",
        "active_compounds": ["Crocin", "Crocetin", "Safranal", "Picrocrocin"],
        "classical_treatises": ["Bhavaprakasha", "Raja Nighantu"],
        "synonyms": ["saffron", "kesar", "kumkuma", "kunkumapuvvu", "kungumapoo", "crocus sativus", "kashmir saffron"]
    }
}


def normalize_entity_text(text: str) -> str:
    """Strip punctuation and standardize string."""
    clean = re.sub(r"[^\w\s-]", "", text.strip().lower())
    return re.sub(r"\s+", " ", clean)


def match_botanical_entity(query_term: str) -> Optional[NormalizedBotanicalEntity]:
    """Match any common, botanical, Sanskrit, or vernacular term to canonical record."""
    normalized = normalize_entity_text(query_term)
    
    # Direct key lookup
    if normalized in BOTANICAL_REGISTRY:
        data = BOTANICAL_REGISTRY[normalized]
        return NormalizedBotanicalEntity(**{k: v for k, v in data.items() if k != "synonyms"})
        
    # Synonym search
    for key, data in BOTANICAL_REGISTRY.items():
        if any(syn == normalized or syn in normalized or normalized in syn for syn in data["synonyms"]):
            return NormalizedBotanicalEntity(**{k: v for k, v in data.items() if k != "synonyms"})
            
    return None


def extract_entities_from_text(text: str) -> Tuple[List[NormalizedBotanicalEntity], List[str]]:
    """Scan natural text and return matched canonical botanical entities and unmatched terms."""
    matched_entities: List[NormalizedBotanicalEntity] = []
    unmatched_tokens: List[str] = []
    seen_botanical = set()
    
    # Check multi-word synonyms first
    for key, data in BOTANICAL_REGISTRY.items():
        for syn in data["synonyms"]:
            pattern = r"\b" + re.escape(syn) + r"\b"
            if re.search(pattern, text, re.IGNORECASE):
                if data["botanical_name"] not in seen_botanical:
                    seen_botanical.add(data["botanical_name"])
                    matched_entities.append(
                        NormalizedBotanicalEntity(**{k: v for k, v in data.items() if k != "synonyms"})
                    )
                break
                
    return matched_entities, unmatched_tokens
