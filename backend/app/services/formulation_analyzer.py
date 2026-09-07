"""
backend/app/services/formulation_analyzer.py
─────────────────────────────────────────────
Comprehensive formulation parsing, ingredient normalization,
classical recipe correlation, and dosage form analysis.
"""
from __future__ import annotations

import logging
from typing import Any, Dict, List, Optional
from backend.app.models.schemas import (
    FormulationAnalysisRequest,
    FormulationAnalysisResponse,
    NormalizedBotanicalEntity,
)
from backend.app.services.entity_extractor import (
    match_botanical_entity,
    extract_entities_from_text,
    BOTANICAL_REGISTRY,
)

logger = logging.getLogger(__name__)

# Classical Formulation Master Reference Registry (AFI / Charaka / Sushruta)
CLASSICAL_FORMULATIONS: List[Dict[str, Any]] = [
    {
        "name": "Trikatu Churna",
        "reference": "Sharangadhara Samhita, Madhyama Khanda 6/12-13; AFI Part I",
        "key_ingredients": ["Shunthi (Zingiber officinale)", "Maricha (Piper nigrum)", "Pippali (Piper longum)"],
        "botanical_keys": ["Zingiber officinale", "Piper nigrum", "Piper longum"],
        "dosage_form": "Churna (Fine Powder)",
        "therapeutic_use": "Deepana (Appetizer), Pachana (Digestive), Shwasa (Respiratory disorders), Synergy enhancer"
    },
    {
        "name": "Triphala Churna",
        "reference": "Charaka Samhita, Chikitsasthana 1/3; AFI Part I",
        "key_ingredients": ["Haritaki (Terminalia chebula)", "Bibhitaki (Terminalia bellirica)", "Amalaki (Phyllanthus emblica)"],
        "botanical_keys": ["Terminalia chebula", "Terminalia bellirica", "Phyllanthus emblica"],
        "dosage_form": "Churna",
        "therapeutic_use": "Rasayana (Rejuvenator), Chakshushya (Ophthalmic), Anulomana (Mild laxative)"
    },
    {
        "name": "Haridra Khanda",
        "reference": "Bhaishajya Ratnavali, Shitarapittaudardakotha Rogadhikara 13-18; AFI Part I",
        "key_ingredients": ["Haridra (Curcuma longa)", "Maricha (Piper nigrum)", "Shunthi (Zingiber officinale)", "Triphala", "Twak", "Ela"],
        "botanical_keys": ["Curcuma longa", "Piper nigrum", "Zingiber officinale"],
        "dosage_form": "Khanda (Granules / Confection)",
        "therapeutic_use": "Kandu (Pruritus), Udarda (Urticaria), Sheetapitta, Allergic rhinitis"
    },
    {
        "name": "Ashwagandhadi Lehya / Churna",
        "reference": "Bhaishajya Ratnavali, Karshya Rogadhikara; AFI Part I",
        "key_ingredients": ["Ashwagandha (Withania somnifera)", "Shatavari (Asparagus racemosus)", "Guduchi (Tinospora cordifolia)"],
        "botanical_keys": ["Withania somnifera", "Asparagus racemosus", "Tinospora cordifolia"],
        "dosage_form": "Avaleha / Churna",
        "therapeutic_use": "Balya (Strength promoter), Brumhana (Nourishing), Vrishya (Aphrodisiac)"
    },
    {
        "name": "Sitopaladi Churna",
        "reference": "Sharangadhara Samhita, Madhyama Khanda 6/134-137; AFI Part I",
        "key_ingredients": ["Sharkara", "Vamshalochana (Bambusa arundinacea)", "Pippali (Piper longum)", "Ela (Elettaria cardamomum)", "Twak (Cinnamomum zeylanicum)"],
        "botanical_keys": ["Piper longum", "Elettaria cardamomum", "Cinnamomum zeylanicum"],
        "dosage_form": "Churna",
        "therapeutic_use": "Kasa (Cough), Shwasa (Asthma), Mandagni (Impaired digestion)"
    },
    {
        "name": "Arjunarishta (Parthadyarishta)",
        "reference": "Bhaishajya Ratnavali, Hridroga Rogadhikara; AFI Part I",
        "key_ingredients": ["Arjuna (Terminalia arjuna)", "Draksha (Vitis vinifera)", "Madhuka (Madhuca indica)"],
        "botanical_keys": ["Terminalia arjuna", "Vitis vinifera"],
        "dosage_form": "Arishta (Naturally Fermented Biomedical Liquid)",
        "therapeutic_use": "Hridroga (Cardioprotective), Moha, Raktapitta"
    }
]


def analyze_formulation(req: FormulationAnalysisRequest) -> FormulationAnalysisResponse:
    """
    Parse formulation request, normalize botanical entities, detect classical formulation matches,
    and structure dosage form & preparation method.
    """
    normalized_entities: List[NormalizedBotanicalEntity] = []
    seen_botanical = set()
    traditional_names: List[str] = []
    taxonomic_hierarchy: Dict[str, str] = {}

    # 1. Process explicit ingredients
    all_raw_terms = list(req.ingredients) + list(req.botanical_names) + list(req.sanskrit_names)
    for term in all_raw_terms:
        if not term or not term.strip():
            continue
        entity = match_botanical_entity(term)
        if entity and entity.botanical_name not in seen_botanical:
            seen_botanical.add(entity.botanical_name)
            normalized_entities.append(entity)
            traditional_names.append(entity.sanskrit_name)
            if entity.family:
                taxonomic_hierarchy[entity.botanical_name] = f"Family: {entity.family}"

    # 2. Extract from intended use or therapeutic claims if ingredients were sparse
    if len(normalized_entities) == 0 and req.intended_use:
        extracted, _ = extract_entities_from_text(req.intended_use)
        for entity in extracted:
            if entity.botanical_name not in seen_botanical:
                seen_botanical.add(entity.botanical_name)
                normalized_entities.append(entity)
                traditional_names.append(entity.sanskrit_name)

    # 3. Calculate / normalize ingredient ratios
    ratios: Dict[str, float] = {}
    if req.ingredient_ratios:
        total = sum(req.ingredient_ratios.values()) or 1.0
        ratios = {k: round(v / total, 4) for k, v in req.ingredient_ratios.items()}
    elif normalized_entities:
        # Default equal ratio distribution
        eq_ratio = round(1.0 / len(normalized_entities), 4)
        for ent in normalized_entities:
            ratios[ent.common_name] = eq_ratio

    # 4. Check classical formulation overlap
    botanical_names_set = {ent.botanical_name.split()[0] for ent in normalized_entities}
    classical_matches: List[Dict[str, Any]] = []

    for classical in CLASSICAL_FORMULATIONS:
        match_count = 0
        for b_key in classical["botanical_keys"]:
            genus = b_key.split()[0]
            if genus in botanical_names_set:
                match_count += 1
        
        if match_count >= 2 or (match_count == 1 and len(classical["botanical_keys"]) == 1):
            classical_matches.append({
                "formulation_name": classical["name"],
                "statutory_reference": classical["reference"],
                "matched_herbs_count": f"{match_count}/{len(classical['botanical_keys'])}",
                "dosage_form": classical["dosage_form"],
                "classical_indications": classical["therapeutic_use"],
            })

    # 5. Format and return response
    formulation_title = req.formulation_name or (
        f"Polyherbal Formulation ({' + '.join(e.common_name for e in normalized_entities[:3])})"
        if normalized_entities else "Ayurvedic Proprietary Compound"
    )

    claimed_use = req.intended_use or (
        ", ".join(req.therapeutic_claims) if req.therapeutic_claims else "General Health & Well-being"
    )

    return FormulationAnalysisResponse(
        formulation_name=formulation_title,
        ingredients=req.ingredients,
        botanical_entities=normalized_entities,
        traditional_names=traditional_names,
        ratios=ratios,
        preparation_method=req.preparation_method or "Classical Aqueous/Hydro-alcoholic Extraction or Shodhita Churna",
        dosage_form=req.dosage_form or "Solid Oral Dosage Form / Churna",
        claimed_use=claimed_use,
        geographical_origin=req.geographical_source or "India (Native Bioresource)",
        taxonomic_hierarchy=taxonomic_hierarchy,
        mono_ingredient_flag=(len(normalized_entities) == 1),
        classical_formulation_matches=classical_matches,
    )
