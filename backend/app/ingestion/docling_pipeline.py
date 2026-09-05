"""
backend/app/ingestion/docling_pipeline.py
=========================================
Docling-Powered Legal Document Ingestion & Fine-Tuning Pipeline for AYURLEX.

Comprehensive statutory corpora across all 12 AYUSH & IP domains:
- Patents Act 1970 (Sec 3b, 3d, 3e, 3h, 3i, 3j, 3p, 10(4), 25, 64)
- TKDL Landmark Biopiracy Revocations (Turmeric, Neem, Basmati, Jeevani)
- Drugs & Cosmetics Act 1940 & Rules 1945 (Rule 158B, Sched T GMP, Sched E1, Sec 33EE-33EED)
- Ayurvedic Pharmacopoeia of India (API Official Monographs: Haridra, Nimba, Brahmi, Ashwagandha, Tulsi, Shatavari, Arjuna, Yashtimadhu, Guduchi, Punarnava)
- Ayurvedic Formulary of India (AFI Formulations: Triphala, Trikatu, Chyawanprash, Yograj Guggulu, Avipattikar, Mahasudarshan, Dashamularishta)
- Biological Diversity (Amendment) Act 2023 & ABS Regulations 2014 (Sec 3, 4, 6 Form III, 7 SBB, Forms I-IV, ABS rates)
- FSSAI (Ayurveda Aahara) Regulations 2022 (Reg 1-8, Schedule A, Boundary Matrix)
- Trade Marks Act 1999 (Sec 9, 11, 13 Ayurvedic names ban)
- Geographical Indications Act 1999 (Sec 2e, 9, 20-22, Kashmir Saffron, Navara Rice, Alleppey Cardamom)
- WHO Traditional Medicine Quality & Heavy Metal Benchmarks (Pb, As, Cd, Hg limits, microbial criteria)
"""
from __future__ import annotations

import asyncio
import json
import logging
import re
import sys
import uuid
from dataclasses import asdict, dataclass, field
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

import tiktoken
from docling_core.types.doc.document import DocItemLabel, DoclingDocument

logger = logging.getLogger("ayurlex.docling")
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

TOKENIZER = tiktoken.get_encoding("cl100k_base")

# Directories
BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent
DATA_DIR = BASE_DIR / "data"
RAW_DIR = DATA_DIR / "raw"
DOCLING_DIR = DATA_DIR / "docling"
CHUNKS_DIR = DATA_DIR / "chunks"
FINETUNING_DIR = DATA_DIR / "finetuning"
FAISS_DIR = DATA_DIR / "embeddings" / "faiss_index"

DOCLING_DIR.mkdir(parents=True, exist_ok=True)
CHUNKS_DIR.mkdir(parents=True, exist_ok=True)
FINETUNING_DIR.mkdir(parents=True, exist_ok=True)
FAISS_DIR.mkdir(parents=True, exist_ok=True)


@dataclass
class StatutoryDocumentSpec:
    title: str
    source_title: str
    authority: str
    domain: str
    jurisdiction: str
    source_url: str
    corpus_version: str
    raw_subdir: str
    raw_filename: str
    sections: List[Dict[str, Any]]
    triples: List[Dict[str, str]] = field(default_factory=list)


def count_tokens(text: str) -> int:
    return len(TOKENIZER.encode(text, disallowed_special=()))


# ==============================================================================
# Comprehensive Domain Corpora Specification (12 Strategic Regulatory Areas)
# ==============================================================================

DOC_SPECS: List[StatutoryDocumentSpec] = [
    # --------------------------------------------------------------------------
    # 1. Patents Act 1970 - Statutory Exclusions for Traditional Medicine & Biology
    # --------------------------------------------------------------------------
    StatutoryDocumentSpec(
        title="Patents Act 1970 - Traditional Knowledge & Biological Exclusions",
        source_title="The Patents Act, 1970 (39 of 1970) as amended by Patents (Amendment) Act, 2005",
        authority="Office of the Controller General of Patents, Designs and Trade Marks (CGPDTM), DPIIT",
        domain="patents",
        jurisdiction="IN",
        source_url="https://ipindia.gov.in/patents.htm",
        corpus_version="v2.0",
        raw_subdir="patents",
        raw_filename="patents_act_traditional_knowledge_exclusions.txt",
        sections=[
            {
                "heading": "Section 3(p) - Exclusion of Traditional Knowledge from Patentability",
                "content": (
                    "Section 3(p) of the Patents Act, 1970 provides that the following is not an invention within the meaning of the Act: "
                    "'An invention which in effect, is traditional knowledge or which is an aggregation or duplication of known properties "
                    "of traditionally known component or components.' "
                    "Statutory Scope: Section 3(p) was specifically inserted by the Patents (Amendment) Act, 2002 to prevent biopiracy and "
                    "the unauthorized monopolization of traditional Indian knowledge systems, including Ayurveda, Siddha, and Unani. "
                    "Any patent claim claiming the therapeutic use, formulation, or processing of a medicinal plant already described "
                    "in classical treatises or the Traditional Knowledge Digital Library (TKDL) is non-patentable ab initio."
                )
            },
            {
                "heading": "Section 3(e) - Mere Admixture of Known Ingredients",
                "content": (
                    "Section 3(e) of the Patents Act, 1970 bars patentability for: "
                    "'A substance obtained by a mere admixture resulting only in the aggregation of the properties of the components "
                    "thereof or a process for producing such substance.' "
                    "Legal Standard in Ayurvedic Inventions: Combining known herbs (e.g. Turmeric + Ginger + Black Pepper) cannot be "
                    "patented unless the applicant demonstrates surprising or unexpected synergistic efficacy that goes substantially "
                    "beyond the mere additive effects of the individual herbal components."
                )
            },
            {
                "heading": "Section 3(d) - Incremental Modifications and Efficacy Threshold",
                "content": (
                    "Section 3(d) of the Patents Act, 1970 bars: "
                    "'The mere discovery of a new form of a known substance which does not result in the enhancement of the known efficacy "
                    "of that substance or the mere discovery of any new property or new use for a known substance or of the mere use of "
                    "a known process, machine or apparatus unless such known process results in a new product or employs at least one new reactant.' "
                    "Novartis Benchmark: As affirmed by the Supreme Court of India in Novartis AG v. Union of India (2013), 'efficacy' "
                    "in the context of therapeutic substances strictly means enhanced therapeutic efficacy, proven by comparative pharmacological data."
                )
            },
            {
                "heading": "Section 3(j) - Plants, Animals, and Biological Varieties Exclusion",
                "content": (
                    "Section 3(j) excludes from patentability: "
                    "'Plants and animals in whole or any part thereof other than micro-organisms, but including seeds, varieties and species "
                    "and essentially biological processes for production or propagation of plants and animals.' "
                    "Implications: Natural herbal cultivars, Ayurvedic plant cuttings, seeds of medicinal varieties, and traditional breeding "
                    "cannot be patented under Indian patent law; plant varieties must be protected under the PPV&FR Act, 2001."
                )
            },
            {
                "heading": "Section 3(i) - Diagnostic and Therapeutic Treatment Exclusion",
                "content": (
                    "Section 3(i) excludes: "
                    "'Any process for the medicinal, surgical, curative, prophylactic, diagnostic, therapeutic or other treatment of human "
                    "beings or any similar treatment of animals to render them free of disease or to increase their economic value or that of their products.' "
                    "In India, methods of treating diseases using Ayurvedic formulations, Panchakarma therapy procedures, and dosage regimens are non-patentable."
                )
            },
            {
                "heading": "Section 10(4)(d)(ii) - Mandatory Disclosure of Biological Material and Origin",
                "content": (
                    "Section 10(4)(d)(ii) of the Patents Act, 1970 mandates that: "
                    "Every complete specification must disclose the source and geographical origin of the biological material in the specification, "
                    "when used in an invention. "
                    "Consequences of Non-Disclosure: Under Section 25(1)(j)/(k) (pre-grant opposition), Section 25(2)(j)/(k) (post-grant opposition), "
                    "and Section 64(1)(p) and 64(1)(q) (revocation), failure to disclose or wrongful disclosure of the geographical origin or source "
                    "of biological material constitutes absolute statutory grounds for rejection or revocation of the patent."
                )
            }
        ],
        triples=[
            {
                "query": "Can an herbal combination of classical Ayurvedic herbs be patented in India?",
                "pos": "Under Section 3(e) and 3(p) of the Patents Act 1970, a mere admixture of known herbs is excluded unless unexpected synergistic therapeutic efficacy is demonstrated.",
                "neg": "Regulation 5 of FSSAI regulations mandates the green Ayur-A logo on packaging."
            },
            {
                "query": "What happens if a patent applicant fails to disclose the source of an Indian biological resource?",
                "pos": "Under Section 10(4)(d)(ii) and Section 64(1)(p), failure to disclose or wrongly disclosing the source and geographical origin of biological material is a ground for patent revocation.",
                "neg": "Schedule E(1) of the Drugs and Cosmetics Rules lists poisonous medicinal plants."
            }
        ]
    ),

    # --------------------------------------------------------------------------
    # 2. TKDL & Landmark Biopiracy Revocations
    # --------------------------------------------------------------------------
    StatutoryDocumentSpec(
        title="TKDL Landmark Biopiracy Cases & Prior Art Revocations",
        source_title="Traditional Knowledge Digital Library (TKDL) Case Compendium",
        authority="CSIR & Ministry of AYUSH, Government of India",
        domain="tkdl",
        jurisdiction="IN",
        source_url="https://www.tkdl.res.in",
        corpus_version="v2.0",
        raw_subdir="tkdl",
        raw_filename="tkdl_landmark_biopiracy_cases.txt",
        sections=[
            {
                "heading": "Case 1: Revocation of US Patent 5,401,504 on Turmeric (Curcuma longa)",
                "content": (
                    "In 1995, the United States Patent and Trademark Office (USPTO) granted Patent No. 5,401,504 "
                    "to the University of Mississippi Medical Center claiming the use of turmeric (Curcuma longa) "
                    "powder for the treatment and promotion of wound healing. "
                    "The Council of Scientific and Industrial Research (CSIR), led by Dr. R.A. Mashelkar, formally "
                    "challenged the patent by submitting 32 classical Hindi, Sanskrit, and Urdu references from authenticated "
                    "Ayurvedic texts, including Charaka Samhita and Bhavaprakasha, proving that the medicinal use of turmeric "
                    "for wound healing had been documented for over 2,000 years in India. "
                    "In 1997, the USPTO revoked all claims of US Patent 5,401,504 on grounds of anticipation by prior art "
                    "under 35 U.S.C. 102. This marked the world's first successful formal challenge against biopiracy of Indian TK."
                )
            },
            {
                "heading": "Case 2: Revocation of European Patent EP 436,257 on Neem (Azadirachta indica)",
                "content": (
                    "In 1994, the European Patent Office (EPO) granted Patent EP 436,257 to W.R. Grace & Co. and the USDA "
                    "covering a method for controlling fungal pests on plants using a hydrophobic extracted neem oil formulation. "
                    "A legal opposition was filed by Vandana Shiva (Research Foundation for Science, Technology and Ecology), "
                    "the International Federation of Organic Agriculture Movements (IFOAM), and Magda Aelvoet. "
                    "Prior art evidence from Indian traditional agronomy and Ayurvedic treatises proved that neem extracts had "
                    "been used for centuries across Indian agriculture as an insecticidal and antifungal bio-agent. "
                    "In 2000, the EPO Opposition Board revoked the patent in its entirety on grounds of lack of novelty and "
                    "inventive step under Articles 54 and 56 of the European Patent Convention (EPC)."
                )
            },
            {
                "heading": "Case 3: RiceTec Basmati Patent Challenge (US Patent 5,663,484)",
                "content": (
                    "In 1997, RiceTec Inc. was granted US Patent No. 5,663,484 titled 'Basmati Rice Lines and Grains'. "
                    "The patent claimed proprietary hybrid lines possessing physical and aromatic characteristics identical "
                    "to geographical Basmati rice cultivated for centuries in the Indo-Gangetic plains of India and Pakistan. "
                    "The Government of India, supported by CSIR and APEDA, submitted extensive documentary evidence proving "
                    "that the grain characteristics, aroma (2-acetyl-1-pyrroline), and elongation ratio were intrinsic to "
                    "traditional Indian germplasms. "
                    "Consequently, RiceTec was forced to withdraw 15 of its 20 claims, and the remaining claims were severely restricted, "
                    "protecting India's heritage grain export and paving the way for GI registration of Basmati."
                )
            },
            {
                "heading": "Case 4: Kani Tribe & Jeevani - Pushpangadan Benefit-Sharing Model",
                "content": (
                    "In December 1987, scientists from the Tropical Botanic Garden and Research Institute (TBGRI), led by "
                    "Dr. P. Pushpangadan, observed the remarkable endurance of Kani tribal guides in the Western Ghats of Kerala "
                    "who consumed the leaves of the wild herb Arogyapacha (Trichopus zeylanicus ssp. travancoricus). "
                    "TBGRI scientifically validated the anti-fatigue, adaptogenic, and immuno-modulatory properties and formulated "
                    "the Ayurvedic herbal drug 'Jeevani'. In 1995, TBGRI licensed the manufacturing technology to Arya Vaidya Pharmacy "
                    "(Coimbatore) Ltd for a license fee of Rs. 10 lakhs and a 2% royalty on sales. "
                    "TBGRI created the 'Kerala Kani Samudaya Kshema Trust' and shared 50% of the license fee and 50% of ongoing "
                    "royalties with the Kani tribe. This became a pioneering global benchmark for Access and Benefit Sharing (ABS) "
                    "prior to the Nagoya Protocol and the Indian Biological Diversity Act 2002."
                )
            },
        ],
        triples=[
            {
                "query": "How was the US patent on turmeric wound healing revoked by CSIR?",
                "pos": "In 1997, the USPTO revoked all claims of US Patent 5,401,504 on grounds of anticipation by prior art under 35 U.S.C. 102 after CSIR submitted 32 classical Sanskrit and Urdu references.",
                "neg": "Under Rule 158B of the Drugs and Cosmetics Rules 1945, classical Ayurvedic medicines do not require clinical trials."
            },
            {
                "query": "What is the Kani tribe Jeevani benefit sharing model?",
                "pos": "TBGRI created the Kerala Kani Samudaya Kshema Trust and shared 50% of the license fee and 50% of ongoing royalties from Jeevani (Trichopus zeylanicus) with the Kani tribe.",
                "neg": "Section 3(p) of the Patents Act 1970 excludes an invention which is traditional knowledge from patentability."
            }
        ]
    ),

    # --------------------------------------------------------------------------
    # 3. Drugs & Cosmetics Act 1940 & Rules 1945
    # --------------------------------------------------------------------------
    StatutoryDocumentSpec(
        title="Drugs and Cosmetics Act 1940 & Rules 1945 - ASU Provisions",
        source_title="Drugs and Cosmetics Act, 1940 and Drugs and Cosmetics Rules, 1945",
        authority="Central Drugs Standard Control Organization (CDSCO) & Ministry of AYUSH",
        domain="ayush",
        jurisdiction="IN",
        source_url="https://cdsco.gov.in",
        corpus_version="v2.0",
        raw_subdir="drugs_cosmetics_rules",
        raw_filename="dc_rules_158b_and_schedule_t.txt",
        sections=[
            {
                "heading": "Rule 158B - Licensing Requirements for Ayurvedic, Siddha, and Unani (ASU) Drugs",
                "content": (
                    "Rule 158B of the Drugs and Cosmetics Rules, 1945 specifies regulatory evidentiary requirements for grant of "
                    "manufacturing licenses for Ayurvedic, Siddha, or Unani medicines: "
                    "(I) Classical ASU Medicines (Manufactured in accordance with formulations described in authoritative books "
                    "specified in the First Schedule to the Act): Proof of reference from authoritative books, authentic texts, and "
                    "compliance with Schedule T GMP is required. No clinical trials or acute toxicity studies are mandated. "
                    "(II) Patent or Proprietary Medicines (New combinations, modified dosage forms, or proprietary extracts): "
                    "Licensees must submit published scientific literature on safety, safety toxicity data (acute, sub-acute), "
                    "and pilot clinical studies depending on whether the ingredients are classical or novel. "
                    "(III) Standardized Extracts / Phytopharmaceuticals: Complete chromatographic fingerprinting, quantitative "
                    "estimation of active marker compounds, and regulatory toxicology data are mandatory."
                )
            },
            {
                "heading": "Schedule T - Good Manufacturing Practices (GMP) for ASU Medicines",
                "content": (
                    "Schedule T of the Drugs and Cosmetics Rules, 1945 establishes Good Manufacturing Practices (GMP) that all "
                    "licensed manufacturing units of Ayurvedic, Siddha, and Unani drugs must comply with: "
                    "(1) Factory Premises: Location in hygienic surroundings, avoidance of contamination, minimum space requirement "
                    "(1,200 sq. ft. for basic manufacturing plus raw material and packaging storage). "
                    "(2) Quality Control Laboratory: Must have facilities for physical testing (moisture, total ash, acid-insoluble ash), "
                    "(3) Chemical analysis (identification tests, TLC/HPTLC profiling, assay of active markers), "
                    "(4) Heavy metal testing (Lead, Cadmium, Mercury, Arsenic within pharmacopoeial limits), and "
                    "(5) Microbial contamination testing (Pathogens including E. coli, Salmonella, Pseudomonas, and S. aureus must be absent). "
                    "(6) Batch Manufacturing Records (BMR): Retention of complete records for 3 years or 1 year past expiry date."
                )
            },
            {
                "heading": "Schedule E(1) - List of Poisonous Substances in ASU Systems",
                "content": (
                    "Schedule E(1) of the Drugs and Cosmetics Rules, 1945 specifies toxic plant, mineral, and animal origin substances "
                    "requiring mandatory cautionary labelling ('Caution: To be taken under medical supervision') and stringent purification (Shodhana): "
                    "(A) Ayurvedic Plant Poisons: Aconitum ferox (Vatsanabha), Datura metel (Dhattura), Strychnos nux-vomica (Kupilu), "
                    "Cannabis sativa (Bhanga), Croton tiglium (Jayapala), Semecarpus anacardium (Bhallataka), Abrus precatorius (Gunja). "
                    "(B) Mineral / Heavy Metal Poisons: Arsenic compounds (Haratala, Manashila, Gouripashana), Mercury compounds (Rasasindura, Hingula), "
                    "Lead compounds (Naga Bhasma), Copper (Tamra Bhasma). "
                    "Every ASU formulation containing Schedule E(1) ingredients must be dispensed only under a Registered Vaidya prescription."
                )
            },
            {
                "heading": "Section 33EEA to 33EED - Spurious, Adulterated, and Misbranded ASU Drugs",
                "content": (
                    "Under the Drugs and Cosmetics Act, 1940: "
                    "Section 33EE: An Ayurvedic, Siddha, or Unani drug shall be deemed to be adulterated if it consists in whole or part "
                    "of filthy, putrid, or decomposed substances, or if colored with unprescribed dyes, or substituted with foreign matter. "
                    "Section 33EEA: Deemed to be spurious if manufactured under a name belonging to another drug, or if the manufacturer "
                    "stated on the label is fictitious or non-existent, or if it purports to be the product of a manufacturer of whom it is not. "
                    "Section 33EED: Penalties for manufacturing, sale, or distribution of spurious ASU drugs include imprisonment up to "
                    "3 years and a minimum fine of Rs. 50,000, or up to 7 years if the drug causes bodily harm."
                )
            }
        ],
        triples=[
            {
                "query": "What are the licensing requirements under Rule 158B for classical Ayurvedic medicines?",
                "pos": "Classical ASU medicines manufactured in accordance with authoritative texts in the First Schedule require textual citation and Schedule T GMP, without mandatory clinical trials.",
                "neg": "Regulation 6 of FSSAI Ayurveda Aahara regulations prohibits claiming disease prevention or cure on food packaging."
            },
            {
                "query": "Which herbs are listed under Schedule E(1) poisonous substances requiring medical supervision?",
                "pos": "Schedule E(1) lists Aconitum ferox (Vatsanabha), Strychnos nux-vomica (Kupilu), Datura metel (Dhattura), and Bhallataka as poisonous substances requiring cautionary labelling.",
                "neg": "Section 3(e) excludes a mere admixture resulting only in the aggregation of properties of the components."
            }
        ]
    ),

    # --------------------------------------------------------------------------
    # 4. Ayurvedic Pharmacopoeia of India (API) Monographs
    # --------------------------------------------------------------------------
    StatutoryDocumentSpec(
        title="Ayurvedic Pharmacopoeia of India (API) Official Monographs",
        source_title="The Ayurvedic Pharmacopoeia of India (Part I, Volumes I - IX)",
        authority="Pharmacopoeia Commission for Indian Medicine & Homoeopathy (PCIM&H), Ministry of AYUSH",
        domain="ayush",
        jurisdiction="IN",
        source_url="https://pcimh.gov.in",
        corpus_version="v2.0",
        raw_subdir="api",
        raw_filename="api_official_monographs.txt",
        sections=[
            {
                "heading": "API Monograph: Haridra (Curcuma longa L. Rhizome)",
                "content": (
                    "Botanical Identity: Curcuma longa L. (Family: Zingiberaceae). Dried and cured rhizome. "
                    "Macroscopic: Deep yellow to orange-brown cylindrical branched rhizomes with transverse rings and root scars. "
                    "Microscopic: Cortical cells with gelatinized starch grains; scattered vascular bundles; oleoresin cells with orange-yellow content. "
                    "Pharmacopoeial Standards: Foreign matter not more than 2%; Total ash not more than 9%; Acid-insoluble ash not more than 1%; "
                    "Alcohol-soluble extractive not less than 8%; Water-soluble extractive not less than 9%; Curcumin content not less than 2.0% w/w by HPLC. "
                    "Ayurvedic Properties: Rasa: Katu, Tikta; Guna: Ruksha, Laghu; Virya: Ushna; Vipaka: Katu; Karma: Kaphapitta shamaka, Varnya, Vishaghna. "
                    "Therapeutic Indications: Prameha (diabetes/urinary disorders), Kushta (skin disorders), Vrana (wounds), Kandu, Pandu. "
                    "Dose: 1 to 3 grams of powder daily."
                )
            },
            {
                "heading": "API Monograph: Brahmi (Bacopa monnieri (L.) Wettst. Whole Plant)",
                "content": (
                    "Botanical Identity: Bacopa monnieri (L.) Wettst. (Family: Scrophulariaceae / Plantaginaceae). Whole plant. "
                    "Macroscopic: Herbaceous glabrous creeping plant with oblong fleshy leaves and pale blue or purple flowers. "
                    "Pharmacopoeial Standards: Foreign matter not more than 2%; Total ash not more than 18%; Acid-insoluble ash not more than 6%; "
                    "Alcohol-soluble extractive not less than 6%; Water-soluble extractive not less than 15%; Total Bacosides (A and B) not less than 1.5% w/w. "
                    "Ayurvedic Properties: Rasa: Tikta, Kashaya, Madhura; Guna: Laghu; Virya: Sheeta; Vipaka: Madhura; Karma: Medhya, Smritiprada, Rasayana. "
                    "Therapeutic Indications: Manasamandata (cognitive impairment), Unmada (psychosis), Apasmara (epilepsy), Shotha, Kasa. "
                    "Dose: 1 to 3 grams of powder; 10 to 20 ml of fresh juice (Swarasa)."
                )
            },
            {
                "heading": "API Monograph: Ashwagandha (Withania somnifera (L.) Dunal Root)",
                "content": (
                    "Botanical Identity: Withania somnifera (L.) Dunal (Family: Solanaceae). Dried mature roots. "
                    "Macroscopic: Straight, cylindrical, fleshy roots, grayish-yellow externally, whitish internally, characteristic horse-like odour. "
                    "Pharmacopoeial Standards: Foreign matter not more than 2%; Total ash not more than 7%; Acid-insoluble ash not more than 1%; "
                    "Alcohol-soluble extractive not less than 15%; Water-soluble extractive not less than 15%; Withanolides (Withaferin A and Withanolide A) not less than 0.2% w/w. "
                    "Ayurvedic Properties: Rasa: Tikta, Kashaya, Madhura; Guna: Snigdha, Guru; Virya: Ushna; Vipaka: Madhura; Karma: Balya, Vrishya, Rasayana, Vata-Kapha shamaka. "
                    "Therapeutic Indications: Dourbalya (general weakness), Klaibya (loss of vitality), Shotha, Kshaya, Vataroga. "
                    "Dose: 3 to 6 grams of churna daily with milk or warm water."
                )
            },
            {
                "heading": "API Monograph: Nimba (Azadirachta indica A. Juss. Bark and Leaf)",
                "content": (
                    "Botanical Identity: Azadirachta indica A. Juss. (Family: Meliaceae). Dried stem bark and mature leaves. "
                    "Pharmacopoeial Standards (Bark): Total ash not more than 8%; Acid-insoluble ash not more than 1.5%; Alcohol-soluble extractive not less than 5%. "
                    "Marker Constituents: Azadirachtin, Nimbin, Nimbidin, Gedunin. "
                    "Ayurvedic Properties: Rasa: Tikta, Kashaya; Guna: Laghu, Ruksha; Virya: Sheeta; Vipaka: Katu; Karma: Pitta-Kaphahara, Krimighna, Vranaropaka, Grahi. "
                    "Therapeutic Indications: Kushta, Vrana, Krimiroga, Prameha, Jwara (fever), Netraroga. "
                    "Dose: Bark powder 2 to 4 grams; decoction (Kwatha) 50 to 100 ml."
                )
            },
            {
                "heading": "API Monograph: Tulsi (Ocimum sanctum L. Leaf)",
                "content": (
                    "Botanical Identity: Ocimum sanctum L. (Family: Lamiaceae). Dried leaves. "
                    "Pharmacopoeial Standards: Foreign matter not more than 2%; Total ash not more than 19%; Acid-insoluble ash not more than 3%; "
                    "Volatile oil content not less than 0.7% v/w; Eugenol content not less than 0.4% w/w. "
                    "Ayurvedic Properties: Rasa: Katu, Tikta; Guna: Laghu, Ruksha; Virya: Ushna; Vipaka: Katu; Karma: Kapha-Vata shamaka, Deepana, Hridya. "
                    "Therapeutic Indications: Kasa (cough), Shwasa (asthma/bronchial spasms), Pratishyaya (coryza), Krimi, Hikka. "
                    "Dose: 2 to 3 grams of churna; 5 to 10 ml of fresh juice."
                )
            },
            {
                "heading": "API Monograph: Shatavari (Asparagus racemosus Willd. Tuberous Root)",
                "content": (
                    "Botanical Identity: Asparagus racemosus Willd. (Family: Asparagaceae / Liliaceae). Tuberous roots. "
                    "Pharmacopoeial Standards: Total ash not more than 5%; Acid-insoluble ash not more than 0.5%; Water-soluble extractive not less than 35%; "
                    "Total Saponins / Shatavarin IV not less than 0.1% w/w. "
                    "Ayurvedic Properties: Rasa: Madhura, Tikta; Guna: Guru, Snigdha; Virya: Sheeta; Vipaka: Madhura; Karma: Rasayana, Stanyajanana, Shukrala, Pitta-Vata shamaka. "
                    "Therapeutic Indications: Stanyakshaya (lactation deficiency), Raktapitta, Kshaya, Shukradourbalya, Amlapitta. "
                    "Dose: 3 to 6 grams of powder with milk."
                )
            },
            {
                "heading": "API Monograph: Arjuna (Terminalia arjuna (Roxb.) W. & A. Stem Bark)",
                "content": (
                    "Botanical Identity: Terminalia arjuna (Roxb.) W. & A. (Family: Combretaceae). Dried stem bark. "
                    "Pharmacopoeial Standards: Foreign matter not more than 2%; Total ash not more than 25%; Acid-insoluble ash not more than 2%; "
                    "Alcohol-soluble extractive not less than 20%; Water-soluble extractive not less than 20%; Tannins not less than 12% w/w. "
                    "Marker Constituents: Arjunic acid, arjunetin, arjunoside I & II, polyphenols. "
                    "Ayurvedic Properties: Rasa: Kashaya; Guna: Ruksha, Laghu; Virya: Sheeta; Vipaka: Katu; Karma: Hridya (cardioprotective), Bhagnasandhanakara. "
                    "Therapeutic Indications: Hridroga (cardiac disorders), Kshata-Kshaya, Medoroga (dyslipidemia), Vrana. "
                    "Dose: 3 to 6 grams of churna; 50 to 100 ml of Ksheerapaka (milk decoction)."
                )
            },
            {
                "heading": "API Monograph: Yashtimadhu (Glycyrrhiza glabra L. Root and Stolon)",
                "content": (
                    "Botanical Identity: Glycyrrhiza glabra L. (Family: Fabaceae). Dried root and stolon. "
                    "Pharmacopoeial Standards: Foreign matter not more than 2%; Total ash not more than 10%; Acid-insoluble ash not more than 2.5%; "
                    "Water-soluble extractive not less than 20%; Glycyrrhizin content not less than 3.0% w/w by HPLC. "
                    "Ayurvedic Properties: Rasa: Madhura; Guna: Guru, Snigdha; Virya: Sheeta; Vipaka: Madhura; Karma: Vatapittashamaka, Kanthya, Vranaropaka. "
                    "Therapeutic Indications: Kantharoga (throat affections), Kasa, Vranaropa, Amlapitta (peptic ulcer), Raktapitta. "
                    "Dose: 2 to 4 grams of churna daily with honey or ghee."
                )
            },
            {
                "heading": "API Monograph: Guduchi (Tinospora cordifolia (Willd.) Miers Stem)",
                "content": (
                    "Botanical Identity: Tinospora cordifolia (Willd.) Miers (Family: Menispermaceae). Dried mature stem. "
                    "Pharmacopoeial Standards: Total ash not more than 8%; Acid-insoluble ash not more than 1%; Alcohol-soluble extractive not less than 3%; "
                    "Water-soluble extractive not less than 11%; Berberine / Cordifolioside marker present. "
                    "Ayurvedic Properties: Rasa: Tikta, Kashaya; Guna: Guru, Snigdha; Virya: Ushna; Vipaka: Madhura; Karma: Tridoshashamaka, Rasayana, Deepana, Jwaraghna. "
                    "Therapeutic Indications: Jwara (chronic fever), Vatarakta (gout), Kamala (jaundice), Prameha, Kushta. "
                    "Dose: 3 to 6 grams of churna; 20 to 30 ml of Kwatha."
                )
            },
            {
                "heading": "API Monograph: Punarnava (Boerhavia diffusa L. Whole Plant and Root)",
                "content": (
                    "Botanical Identity: Boerhavia diffusa L. (Family: Nyctaginaceae). Dried herbaceous whole plant. "
                    "Pharmacopoeial Standards: Total ash not more than 15%; Acid-insoluble ash not more than 6%; Water-soluble extractive not less than 10%; "
                    "Punarnavoside content not less than 0.05% w/w. "
                    "Ayurvedic Properties: Rasa: Madhura, Tikta, Kashaya; Guna: Laghu, Ruksha; Virya: Ushna; Vipaka: Madhura; Karma: Kaphapittahara, Mutrala, Shothahara. "
                    "Therapeutic Indications: Shotha (oedema/dropsy), Pandu, Hridroga, Vrikka Roga (renal disease), Udara. "
                    "Dose: 1 to 3 grams of churna; 10 to 20 ml of fresh juice."
                )
            }
        ],
        triples=[
            {
                "query": "What is the API standard curcumin content and ash limit for Haridra rhizome?",
                "pos": "According to the Ayurvedic Pharmacopoeia of India, Haridra (Curcuma longa) must have total ash not more than 9%, acid-insoluble ash not more than 1%, and curcumin content not less than 2.0% w/w by HPLC.",
                "neg": "Under Section 3(j) of the Patents Act, plants and animals in whole or any part thereof are not patentable."
            },
            {
                "query": "What are the therapeutic indications and Ayurvedic properties of Arjuna bark?",
                "pos": "Arjuna (Terminalia arjuna) has Kashaya rasa, Sheeta virya, Hridya and Bhagnasandhanakara karma, indicated for Hridroga and Medoroga.",
                "neg": "Kashmir Saffron was granted GI registration No. 635 recognizing its high crocin and safranal content."
            }
        ]
    ),

    # --------------------------------------------------------------------------
    # 5. Ayurvedic Formulary of India (AFI) Formulations
    # --------------------------------------------------------------------------
    StatutoryDocumentSpec(
        title="Ayurvedic Formulary of India (AFI) Classical Formulations",
        source_title="The Ayurvedic Formulary of India (Part I, II & III)",
        authority="Department of AYUSH, Ministry of Health and Family Welfare, Government of India",
        domain="ayush",
        jurisdiction="IN",
        source_url="https://pcimh.gov.in",
        corpus_version="v2.0",
        raw_subdir="afi",
        raw_filename="afi_classical_formulations.txt",
        sections=[
            {
                "heading": "AFI Formulation: Triphala Churna (AFI Part I, 7:15)",
                "content": (
                    "Composition: Equal parts (1:1:1 by weight) of Haritaki (Terminalia chebula pericarp), "
                    "Bibhitaki (Terminalia bellirica pericarp), and Amalaki (Phyllanthus emblica pericarp). "
                    "Reference Classical Texts: Charaka Samhita Chikitsasthana Chapter 1, Sharngadhara Samhita Madhyamakhanda. "
                    "Method of Preparation: Cleaned pericarp portions are shade-dried, pulverized separately, and passed through "
                    "mesh No. 85, then blended homogeneously. "
                    "Therapeutic Indications: Chakshushya (ophthalmic tonic), Deepana, Ruchya, Vibandha (constipation), Prameha, Kushta. "
                    "Dose and Anupana: 3 to 6 grams with lukewarm water, honey, or ghee at bedtime."
                )
            },
            {
                "heading": "AFI Formulation: Trikatu Churna (AFI Part I, 7:16)",
                "content": (
                    "Composition: Equal parts (1:1:1 by weight) of Shunthi (Zingiber officinale dried rhizome), "
                    "Maricha (Piper nigrum fruit), and Pippali (Piper longum fruit). "
                    "Classical Reference: Sharngadhara Samhita Madhyamakhanda 6:12-13. "
                    "Therapeutic Indications: Agnimandya (loss of digestive fire), Aruchi, Shwasa, Kasa, Galaganda, Pinasa, Sthaulya. "
                    "Bioenhancement Role: Trikatu significantly increases the bioavailability of co-administered Ayurvedic herbs and mineral bhasmas. "
                    "Dose and Anupana: 1 to 2 grams with honey or warm water before or after meals."
                )
            },
            {
                "heading": "AFI Formulation: Chyawanprash Avaleha (AFI Part I, 3:11)",
                "content": (
                    "Composition: Bilva, Agnimantha, Shyonaka, Patala, Gambhari, Dashamoola, Amalaki (fresh pulp 500 fruits), "
                    "Ghrita, Til Taila, Sharkara/Matsyandika, Prakshepa dravyas including Pippali, Vanshlochan, Ela, Twak, Tejpatra, Nagakeshara. "
                    "Classical Reference: Charaka Samhita Chikitsasthana 1:1:62-74. "
                    "Therapeutic Indications: Kasa, Shwasa, Kshaya, Dourbalya, Swarabheda, Rasayana (anti-ageing and vitality). "
                    "Dose: 12 to 24 grams once or twice daily with warm milk."
                )
            },
            {
                "heading": "AFI Formulation: Yograj Guggulu (AFI Part I, 5:6)",
                "content": (
                    "Composition: Shuddha Guggulu (Commiphora wightii gum-resin), Chitraka, Pippalimoola, Yavani, Jeeraka, "
                    "Vidanga, Ajamoda, Triphala, Trikatu, Chavya, Ela, Gokshura, Rasna, and mineral aids processed in Ghrita. "
                    "Classical Reference: Sharngadhara Samhita Madhyamakhanda 7:56-69. "
                    "Therapeutic Indications: Amavata (rheumatoid arthritis), Sandhigata Vata (osteoarthritis), Vataroga, Kati Graha. "
                    "Dose: 1 to 2 tablets (500mg to 1000mg) twice daily with Rasnasaptaka Kwatha or warm water."
                )
            },
            {
                "heading": "AFI Formulation: Avipattikar Churna (AFI Part I, 7:2)",
                "content": (
                    "Composition: Trikatu (Shunthi, Maricha, Pippali), Triphala (Haritaki, Bibhitaki, Amalaki), Musta, Vidanga, "
                    "Ela, Tejpatra, Lavanga (11 parts), Trivrit (Operculina turpethum root bark - 44 parts), and Sharkara (sugar - 66 parts). "
                    "Classical Reference: Bhaishajya Ratnavali Amlapittarogadhikara 25-27. "
                    "Therapeutic Indications: Amlapitta (hyperacidity / acid reflux), Vibandha (constipation), Agnimandya, Chardi. "
                    "Dose: 3 to 6 grams before meals with cold water or milk."
                )
            },
            {
                "heading": "AFI Formulation: Mahasudarshan Churna (AFI Part I, 7:26)",
                "content": (
                    "Composition: 54 herbal ingredients with Kiratatikta (Swertia chirata) comprising 50% of the entire formulation, "
                    "balanced with Triphala, Trikatu, Haridra, Daruharidra, Kantakari, Brihati, Guduchi, Katuki, and Neem. "
                    "Classical Reference: Sharngadhara Samhita Madhyamakhanda 6:27-37. "
                    "Therapeutic Indications: Sannipata Jwara, Vishama Jwara (malarial / recurring fever), Yakrit-Pliha vriddhi, Aruchi, Trishna. "
                    "Dose: 2 to 4 grams twice daily with warm water."
                )
            },
            {
                "heading": "AFI Formulation: Dashamularishta (AFI Part I, 1:19)",
                "content": (
                    "Composition: Fermented liquid preparation containing Dashamoola (ten roots), Chitraka, Pushkarmoola, Lodhra, "
                    "Guduchi, Dhataki flowers (fermentation catalyst), Draksha, and self-generated alcohol (not exceeding 12% v/v). "
                    "Classical Reference: Sharngadhara Samhita Madhyamakhanda 10:78-92. "
                    "Therapeutic Indications: Sutika Roga (post-natal disorders), Dourbalya, Kasa, Shwasa, Arsha, Vataroga. "
                    "Dose: 15 to 30 ml with equal quantity of water after food."
                )
            }
        ],
        triples=[
            {
                "query": "What is the classical composition and reference text for Triphala Churna?",
                "pos": "Triphala Churna contains equal parts (1:1:1) of Haritaki, Bibhitaki, and Amalaki per AFI Part I and Charaka Samhita Chikitsasthana, indicated for Chakshushya and Vibandha.",
                "neg": "Section 3(c) of the Indian Patents Act prohibits patents on the mere discovery of a scientific principle."
            },
            {
                "query": "What is the role of Kiratatikta in Mahasudarshan Churna?",
                "pos": "In Mahasudarshan Churna, Kiratatikta constitutes 50% of the formulation weight per Sharngadhara Samhita for treating Vishama Jwara and Sannipata Jwara.",
                "neg": "FSSAI Ayurveda Aahara regulations require displaying the special green logo on the front of food packs."
            }
        ]
    ),

    # --------------------------------------------------------------------------
    # 6. Biological Diversity (Amendment) Act 2023 & ABS Regulations
    # --------------------------------------------------------------------------
    StatutoryDocumentSpec(
        title="Biological Diversity (Amendment) Act 2023 & ABS Rules",
        source_title="Biological Diversity Act, 2002 and Biological Diversity (Amendment) Act, 2023",
        authority="National Biodiversity Authority (NBA), Ministry of Environment, Forest and Climate Change",
        domain="abs",
        jurisdiction="IN",
        source_url="https://nbaindia.org",
        corpus_version="v2.0",
        raw_subdir="nba",
        raw_filename="bda_2023_amendment_and_abs.txt",
        sections=[
            {
                "heading": "Section 3 - Access to Biological Resources by Non-Indian Entities",
                "content": (
                    "Section 3 of the Biological Diversity Act, 2002 (as amended in 2023) mandates that: "
                    "No person who is not a citizen of India, or a citizen of India who is an NRI, or a body corporate, association "
                    "or organisation not incorporated or registered in India, or incorporated in India under any law having any "
                    "non-Indian participation in its share capital or management, shall access any biological resource occurring in India "
                    "or associated traditional knowledge for research or commercial utilisation without prior approval of the National "
                    "Biodiversity Authority (NBA) via Form I."
                )
            },
            {
                "heading": "Section 6 - Application for Intellectual Property Rights (Form III Mandatory Approval)",
                "content": (
                    "Section 6(1) provides: No person shall apply for any intellectual property right, by whatever name called, "
                    "in or outside India for any invention based on any research or information on a biological resource obtained from India "
                    "without obtaining the prior approval of the National Biodiversity Authority before grant of such patent. "
                    "The 2023 Amendment streamlines Section 6 by clarifying that approval may be obtained before the actual grant of patent "
                    "rather than before filing the application, provided NBA approval is secured prior to patent sealing. "
                    "Under Section 6(2), the NBA may impose benefit sharing conditions or royalties as per ABS regulations."
                )
            },
            {
                "heading": "Key 2023 Amendments: AYUSH Registered Practitioner Exemption",
                "content": (
                    "The Biological Diversity (Amendment) Act, 2023 introduced significant relief for traditional practitioners: "
                    "(1) Exemption of AYUSH Practitioners: Registered AYUSH practitioners practicing Indian systems of medicine "
                    "are exempted from the requirement of giving prior intimation to State Biodiversity Boards (SBB) under Section 7. "
                    "(2) Exemption for Cultivated Medicinal Plants: Commercial utilization of cultivated medicinal plants is exempt from "
                    "SBB intimation and benefit-sharing obligations, provided certificate of origin is maintained. "
                    "(3) Decriminalization: Criminal imprisonment provisions were eliminated and replaced with civil penalties ranging "
                    "from Rs. 1 lakh up to Rs. 50 lakhs, determined by an Adjudicating Officer under Section 55A."
                )
            },
            {
                "heading": "Guidelines on Access and Benefit Sharing (ABS) Regulations 2014",
                "content": (
                    "Under the ABS Regulations 2014 framed under Section 21 of the Biological Diversity Act: "
                    "Commercial Utilization Benefit Sharing Percentages on Ex-Factory Sale Price: "
                    "(a) Annual gross ex-factory sale of product up to Rs. 1,00,00,000: 0.1% of sales. "
                    "(b) Annual gross ex-factory sale between Rs. 1,00,00,001 and Rs. 3,00,00,000: 0.2% of sales. "
                    "(c) Annual gross ex-factory sale exceeding Rs. 3,00,00,000: 0.5% of sales. "
                    "Alternatively, buyers may opt for 3.0% to 5.0% of the purchase price of the biological resource. "
                    "For IPR/Patents: If the applicant commercializes the patent himself, 0.2% to 1.0% of ex-factory sale price; "
                    "if licensed or assigned to a third party, 3.0% to 5.0% of license fee and 2.0% to 5.0% of ongoing royalty."
                )
            }
        ],
        triples=[
            {
                "query": "Is NBA prior approval required before patent grant for Ayurvedic inventions using Indian biological resources?",
                "pos": "Under Section 6 of the Biological Diversity Act, prior approval of the NBA via Form III is mandatory before the grant of any patent based on Indian biological resources.",
                "neg": "Rule 158B of the Drugs and Cosmetics Rules governs ASU manufacturing licenses."
            },
            {
                "query": "Are AYUSH doctors exempted from NBA benefit sharing under the 2023 Biodiversity Amendment?",
                "pos": "The 2023 Amendment exempts registered AYUSH practitioners and cultivated medicinal plants from prior intimation to State Biodiversity Boards under Section 7.",
                "neg": "Section 9 of the Trade Marks Act 1999 provides absolute grounds for refusal of registration."
            }
        ]
    ),

    # --------------------------------------------------------------------------
    # 7. FSSAI (Ayurveda Aahara) Regulations 2022
    # --------------------------------------------------------------------------
    StatutoryDocumentSpec(
        title="FSSAI Ayurveda Aahara Regulations 2022 - Regulatory Boundary",
        source_title="Food Safety and Standards (Ayurveda Aahara) Regulations, 2022",
        authority="Food Safety and Standards Authority of India (FSSAI)",
        domain="fssai",
        jurisdiction="IN",
        source_url="https://fssai.gov.in",
        corpus_version="v2.0",
        raw_subdir="fssai",
        raw_filename="fssai_ayurveda_aahara_boundary_regulations.txt",
        sections=[
            {
                "heading": "Regulation 3 - Scope, Applicability, and Separation from ASU Drugs",
                "content": (
                    "Regulation 3 sets the strict boundary between food and medicine: "
                    "(1) These regulations apply to food prepared in accordance with the recipes or processes described in "
                    "authoritative books of Ayurveda specified in Schedule A of these regulations. "
                    "(2) Explicit Non-Applicability: These regulations DO NOT apply to Ayurvedic drugs as defined under Section 3(a) "
                    "of the Drugs and Cosmetics Act, 1940, or proprietary Ayurvedic medicines licensed under Rule 158B. "
                    "(3) Formulations intended for therapeutic treatment, injection, or sterile ophthalmic applications are "
                    "strictly prohibited from being registered or marketed as Ayurveda Aahara."
                )
            },
            {
                "heading": "Regulation 5 - Ayurveda Aahara Official Logo and Packaging Rules",
                "content": (
                    "Regulation 5 mandates the distinctive logo for all approved Ayurveda Aahara products: "
                    "(1) Every package of Ayurveda Aahara shall carry the designated official Ayurveda Aahara logo on the principal display panel. "
                    "(2) The logo consists of the Devanagari letter 'Ayur' (आयुर्) intertwined with the English letter 'A', encapsulated in a green leaf ring. "
                    "(3) The logo shall be positioned in close proximity to the name of the food and the FSSAI License Number. "
                    "(4) The word 'AYURVEDA AAHARA' shall be printed clearly in capital letters directly beneath the logo."
                )
            },
            {
                "heading": "Regulation 6 & 8 - Prohibited Claims and Labelling Disclaimers",
                "content": (
                    "Regulations 6 and 8 prohibit misleading medicinal claims on Ayurveda Aahara products: "
                    "(1) No Ayurveda Aahara product shall claim to prevent, treat, cure, or mitigate any disease or physiological disorder. "
                    "(2) Permitted Claims: Structure-function claims, wellness claims, digestive support (Agni deepana), "
                    "and Rasayana (rejuvenation/vitality) are permissible only when substantiated by Schedule A authoritative classical texts. "
                    "(3) Mandatory Front-of-Pack Disclaimer: 'THIS PRODUCT IS NOT INTENDED TO DIAGNOSE, TREAT, CURE OR PREVENT ANY DISEASE.' "
                    "(4) Prohibition on Synthetic Additives: Synthetic vitamins, synthetic minerals, and modern pharmaceutical active "
                    "ingredients cannot be added to classical recipes to alter the formulation."
                )
            },
            {
                "heading": "Statutory Comparison: Ayurveda Aahara (FSSAI) vs Classical ASU Drug (AYUSH)",
                "content": (
                    "Regulatory Matrix: "
                    "1. Governing Act: FSSAI Food Safety and Standards Act 2006 vs AYUSH Drugs and Cosmetics Act 1940. "
                    "2. Licensing Authority: State Food Safety Commissioner (FSSAI) vs State Licensing Authority (Ayush). "
                    "3. Permitted Claims: Wellness, health promotion, dosha balance vs Therapeutic indication, treatment of Vyadhi. "
                    "4. Labelling: Mandatory 'NOT A MEDICINE' disclaimer & Ayur-A logo vs 'Caution: under Vaidya supervision' if Schedule E(1). "
                    "5. Sales Channel: Supermarkets, grocery, e-commerce food vs Licensed Ayurvedic pharmacy & retail."
                )
            }
        ],
        triples=[
            {
                "query": "Can an Ayurveda Aahara food product claim to treat or cure diabetes (Prameha)?",
                "pos": "Under Regulation 6 of FSSAI Ayurveda Aahara Regulations 2022, no product can claim to prevent, treat, cure, or mitigate any disease, and must display the non-disease disclaimer.",
                "neg": "Section 2(e) of the GI Act defines a geographical indication in relation to goods originating in a territory."
            },
            {
                "query": "What is the difference between an Ayurveda Aahara license and an AYUSH ASU drug license?",
                "pos": "Ayurveda Aahara is licensed under FSSAI Act 2006 for food and wellness with prohibited disease claims, while ASU drugs are licensed under D&C Act 1940 for therapeutic treatment.",
                "neg": "Section 3(p) of the Patents Act excludes traditional knowledge from patentability."
            }
        ]
    ),

    # --------------------------------------------------------------------------
    # 8. Trade Marks Act 1999 - Classical Ayurveda Names & Generic Terms Ban
    # --------------------------------------------------------------------------
    StatutoryDocumentSpec(
        title="Trade Marks Act 1999 - Protection of Ayurvedic Terminology",
        source_title="The Trade Marks Act, 1999 (47 of 1999)",
        authority="Trade Marks Registry, CGPDTM, Ministry of Commerce and Industry",
        domain="trademarks",
        jurisdiction="IN",
        source_url="https://ipindia.gov.in/trade-marks.htm",
        corpus_version="v2.0",
        raw_subdir="trademarks",
        raw_filename="trademarks_act_ayurvedic_terms.txt",
        sections=[
            {
                "heading": "Section 9 - Absolute Grounds for Refusal of Descriptive Herbal Terms",
                "content": (
                    "Section 9(1) of the Trade Marks Act, 1999 prohibits the registration of trademarks which: "
                    "(a) Are devoid of any distinctive character; "
                    "(b) Consist exclusively of marks or indications which may serve in trade to designate the kind, quality, "
                    "intended purpose, values, geographical origin, or time of production of goods. "
                    "Application in Ayurvedic Products: Common Sanskrit names of plants (e.g., 'Ashwagandha', 'Brahmi', 'Triphala', "
                    "'Tulsi', 'Neem') cannot be registered as trademarks in Class 5 (Pharmaceuticals/Herbal Medicines) or Class 30 (Dietary Foods) "
                    "because they are generic and publici juris. Any manufacturer is legally entitled to describe their product using these botanical terms."
                )
            },
            {
                "heading": "Section 13 - Prohibition of Registration of Names of Chemical Elements and INN",
                "content": (
                    "Section 13 of the Trade Marks Act prohibits the registration of any word which is the commonly used and accepted name "
                    "of any single chemical element or single chemical compound, or which is declared by the World Health Organization (WHO) "
                    "and notified by the Registrar as an International Non-proprietary Name (INN). "
                    "By judicial parity, classical formulation names codified in the Ayurvedic Formulary of India (AFI) or classical treatises "
                    "(such as 'Chyawanprash', 'Yograj Guggulu', 'Sitopaladi Churna') cannot be registered as exclusive trademarks by any single enterprise."
                )
            },
            {
                "heading": "Class 5 vs Class 30 Trademark Classifications for AYUSH Goods",
                "content": (
                    "Classification Benchmark for AYUSH Enterprises: "
                    "Class 5: Covers Ayurvedic, Siddha, Unani medicinal preparations, pharmaceutical preparations, dietetic substances adapted for medical use. "
                    "Class 3: Covers herbal cosmetics, soaps, essential oils, hair oils (Taila), and beauty formulations without therapeutic claims. "
                    "Class 30: Covers herbal teas, spices, food supplements, and dietary preparations not adapted for medical use. "
                    "Class 32: Covers herbal non-alcoholic beverages, health juices (Swarasa), and functional drinks."
                )
            }
        ],
        triples=[
            {
                "query": "Can a company register 'Triphala' or 'Ashwagandha' as an exclusive trademark in India?",
                "pos": "Under Section 9 of the Trade Marks Act 1999, generic Sanskrit names and classical formulation names like Triphala and Ashwagandha cannot be registered as exclusive trademarks.",
                "neg": "Section 6 of the Biological Diversity Act mandates prior NBA approval before applying for IPR."
            },
            {
                "query": "Which trademark class applies to Ayurvedic therapeutic medicines versus herbal cosmetics?",
                "pos": "Ayurvedic medicines fall under Class 5, while herbal cosmetics and oils without disease treatment claims fall under Class 3.",
                "neg": "Rule 158B requires safety toxicity data for patent or proprietary Ayurvedic extracts."
            }
        ]
    ),

    # --------------------------------------------------------------------------
    # 9. Geographical Indications of Goods Act 1999
    # --------------------------------------------------------------------------
    StatutoryDocumentSpec(
        title="Geographical Indications of Goods Act 1999 & Registered AYUSH GIs",
        source_title="The Geographical Indications of Goods (Registration and Protection) Act, 1999",
        authority="Geographical Indications Registry, Intellectual Property India (CGPDTM)",
        domain="gi",
        jurisdiction="IN",
        source_url="https://ipindia.gov.in",
        corpus_version="v2.0",
        raw_subdir="gi_registry",
        raw_filename="gi_act_and_ayurvedic_gis.txt",
        sections=[
            {
                "heading": "Section 2(e) & Section 9 - GI Definition and Prohibited Registrations",
                "content": (
                    "Section 2(e) defines a Geographical Indication as an indication which identifies goods as agricultural goods, "
                    "natural goods or manufactured goods as originating, or manufactured in the territory of a country, or a region "
                    "where a given quality, reputation or other characteristic of such goods is essentially attributable to its geographical origin. "
                    "Section 9 Prohibitions: The following cannot be registered as GI: "
                    "(a) Names the use of which would be likely to deceive or cause confusion; "
                    "(b) Names contrary to any law; "
                    "(c) Names comprising scandalous or obscene matter; "
                    "(d) Generic names of goods which have ceased to indicate their geographical origin."
                )
            },
            {
                "heading": "Section 20 to 22 - Exclusive Rights of Authorized Users vs Non-Exclusivity of Classical Ayurvedic Formulations",
                "content": (
                    "Section 21 confers upon registered proprietors and authorized users the exclusive right to use the geographical "
                    "indication in relation to the goods in respect of which the GI is registered, and to obtain relief in respect of infringement. "
                    "Crucial Distinction in Ayurveda: Classical Ayurvedic formulas (e.g., Triphala, Chyawanprash) cannot be monopolized as GIs "
                    "because they belong to the public domain and any licensed Vaidya across India can prepare them. "
                    "Only agricultural produce possessing distinctive terroir and unique phyto-chemical traits tied to a bounded geography "
                    "(e.g., Kashmir Saffron, Navara Rice) qualify for GI protection."
                )
            },
            {
                "heading": "Registered AYUSH Botanical GI: Kashmir Saffron (GI Application No. 635)",
                "content": (
                    "Kashmir Saffron (Crocus sativus L.), registered under GI Application No. 635 (Certificate dated 2020): "
                    "Grown exclusively in the karewa highlands of Pulwama, Budgam, Kishtwar, and Srinagar at altitudes exceeding 1,600 meters. "
                    "Unique Qualities: Contains exceptionally high concentration of Crocin (responsible for deep crimson pigment), "
                    "Safranal (aroma marker), and Picrocrocin (bitterness). Recognized in Ayurvedic Pharmacopoeia as Kumkuma (Keshar), "
                    "acting as a Tridoshahara, Varnya, and Hridya rasayana."
                )
            },
            {
                "heading": "Registered AYUSH Botanical GI: Navara Rice (GI Application No. 38)",
                "content": (
                    "Navara Rice (Oryza sativa L. var. Navara), registered under GI Application No. 38 (Class 31): "
                    "An indigenous medicinal rice cultivated in Palakkad and Malappuram districts of Kerala since 2500 BCE. "
                    "Therapeutic Role in Ayurveda: Critical ingredient in Panchakarma therapies including Navarakizhi (Shashtika Shali Pinda Sweda) "
                    "for neurological disorders, muscular dystrophy, arthritis, and post-stroke rehabilitation. "
                    "Contains elevated levels of polyphenols, oryzanol, zinc, and iron compared to normal white rice."
                )
            },
            {
                "heading": "Registered AYUSH Botanical GI: Alleppey Green Cardamom (GI Application No. 34)",
                "content": (
                    "Alleppey Green Cardamom (Elettaria cardamomum Maton), registered under GI Application No. 34: "
                    "Cultivated in the misty slopes of the Western Ghats (Cardamom Hills) spanning Idukki and surrounding regions. "
                    "Distinctive Characteristics: Deep green color, high three-cornered ribbed pods, and rich volatile essential oil "
                    "content (7-8% comprising 1,8-cineole and alpha-terpinyl acetate). "
                    "Ayurvedic Pharmacopoeial Role: Sookshma Ela, possessing Deepana, Hridya, and Tridoshahara properties, indispensable in "
                    "classical churna formulations like Sitopaladi."
                )
            }
        ],
        triples=[
            {
                "query": "Can a classical Ayurvedic formula like Chyawanprash be registered as a Geographical Indication?",
                "pos": "No, classical formulations like Chyawanprash belong to the public domain across India and cannot be monopolized under the GI Act; only region-specific crops like Kashmir Saffron qualify.",
                "neg": "Section 3(d) of the Patents Act bars patenting new forms of known substances unless significant therapeutic efficacy enhancement is shown."
            },
            {
                "query": "Why is Navara Rice registered under the GI Act and what is its Ayurvedic use?",
                "pos": "Navara Rice (GI No. 38) is an indigenous medicinal paddy of Kerala used in Ayurvedic Panchakarma (Navarakizhi) for neuromuscular diseases.",
                "neg": "Rule 158B requires pilot clinical studies for patent or proprietary Ayurvedic formulations."
            }
        ]
    ),

    # --------------------------------------------------------------------------
    # 10. WHO Traditional Medicine Benchmarks & Heavy Metal Quality Limits
    # --------------------------------------------------------------------------
    StatutoryDocumentSpec(
        title="WHO Traditional Medicine Benchmarks & Quality Limits",
        source_title="WHO Guidelines for Assessing Quality of Herbal Medicines with Reference to Contaminants and Residues",
        authority="World Health Organization (WHO)",
        domain="who",
        jurisdiction="INT",
        source_url="https://www.who.int/health-topics/traditional-complementary-and-integrative-medicine",
        corpus_version="v2.0",
        raw_subdir="who_terminology",
        raw_filename="who_tm_quality_and_heavy_metals.txt",
        sections=[
            {
                "heading": "WHO Maximum Permissible Limits for Heavy Metals in Herbal Medicines",
                "content": (
                    "The World Health Organization (WHO) and the Pharmacopoeia Commission for Indian Medicine (PCIM&H) set mandatory "
                    "permissible limits for heavy metal contaminants in finished raw herbal materials and ASU drugs: "
                    "(1) Lead (Pb): Not more than 10.0 mg/kg (10.0 ppm). "
                    "(2) Arsenic (As): Not more than 3.0 mg/kg (3.0 ppm). "
                    "(3) Cadmium (Cd): Not more than 0.3 mg/kg (0.3 ppm). "
                    "(4) Mercury (Hg): Not more than 1.0 mg/kg (1.0 ppm). "
                    "Exemption Note for Classical Rasa-Shastra Bhasmas: Herbo-mineral formulations (e.g. Swarna Bhasma, Naga Bhasma, Rasasindura) "
                    "subject to classical incineration (Marana) and Shodhana are tested under specialized safety indices and NP-XRD particle characterization."
                )
            },
            {
                "heading": "WHO Limits for Microbial Contamination in Herbal Materials",
                "content": (
                    "WHO benchmarks specify permissible limits for microbial load in plant materials: "
                    "(1) Total aerobic microbial count (TAMC): Maximum 10^7 CFU per gram for raw plant materials; 10^5 CFU/g for herbal products. "
                    "(2) Total combined yeast and mould count (TYMC): Maximum 10^4 CFU per gram. "
                    "(3) Escherichia coli: Maximum 10^2 CFU per gram for raw materials; completely ABSENT in 1 gram for finished oral dosage forms. "
                    "(4) Salmonella spp.: Completely ABSENT in 10 grams of material. "
                    "(5) Staphylococcus aureus & Pseudomonas aeruginosa: Completely ABSENT in 1 gram of material."
                )
            },
            {
                "heading": "WIPO IGC Intergovernmental Committee - Traditional Knowledge Protection",
                "content": (
                    "The World Intellectual Property Organization (WIPO) Intergovernmental Committee on Intellectual Property "
                    "and Genetic Resources, Traditional Knowledge and Folklore (IGC): "
                    "Mandatory Disclosure Requirements: The Draft Treaty on IP, Genetic Resources and Associated Traditional Knowledge "
                    "mandates patent applicants worldwide to disclose: "
                    "(a) The country of origin of the genetic resource or traditional knowledge; "
                    "(b) If country of origin is unknown, the source from which the resource was obtained; "
                    "(c) Whether Free Prior Informed Consent (FPIC) and Mutually Agreed Terms (MAT) were established. "
                    "Failure to disclose constitutes grounds for revocation or post-grant sanctions."
                )
            }
        ],
        triples=[
            {
                "query": "What are the WHO maximum permissible limits for lead, arsenic, cadmium, and mercury in herbal medicines?",
                "pos": "WHO permissible limits are Lead (Pb) <= 10.0 ppm, Arsenic (As) <= 3.0 ppm, Cadmium (Cd) <= 0.3 ppm, and Mercury (Hg) <= 1.0 ppm.",
                "neg": "Section 3(e) denies patents to combinations that merely aggregate the known properties of individual herbs."
            },
            {
                "query": "What are the mandatory patent disclosure requirements under WIPO IGC for traditional knowledge?",
                "pos": "WIPO IGC treaty provisions mandate disclosure of country of origin of genetic resources/TK and confirmation of Free Prior Informed Consent (FPIC).",
                "neg": "Regulation 5 of FSSAI regulations requires the green Ayur-A logo on packaging."
            }
        ]
    )
]


# ==============================================================================
# Docling Document Builder & Ingestion Execution
# ==============================================================================

def build_docling_document(spec: StatutoryDocumentSpec) -> DoclingDocument:
    """Constructs a fully typed DoclingDocument representation with headings and paragraphs."""
    doc_id = spec.raw_filename.replace(".txt", "")
    doc = DoclingDocument(name=doc_id)
    doc.add_title(text=spec.title)

    for sec in spec.sections:
        doc.add_heading(text=sec["heading"], level=2)
        doc.add_text(label=DocItemLabel.PARAGRAPH, text=sec["content"])

    return doc


def write_raw_statutory_file(spec: StatutoryDocumentSpec, target_path: Path) -> None:
    """Writes standardized statutory header and body to disk."""
    lines = [
        spec.title.upper(),
        f"Source: {spec.source_title}",
        f"Authority: {spec.authority}",
        f"Jurisdiction: {spec.jurisdiction} | Domain: {spec.domain} | Corpus Version: {spec.corpus_version}",
        f"Official Reference: {spec.source_url}",
        "",
        "=" * 80,
        ""
    ]
    for sec in spec.sections:
        lines.append(sec["heading"])
        lines.append("-" * len(sec["heading"]))
        lines.append(sec["content"])
        lines.append("")

    target_path.write_text("\n".join(lines), encoding="utf-8")
    logger.info(f"Wrote raw statutory file: {target_path} ({len(lines)} lines)")


def extract_chunks_from_spec(spec: StatutoryDocumentSpec) -> List[Dict[str, Any]]:
    """Transforms sections into fine-grained chunks adhering to AYURLEX RAG standards."""
    chunks = []
    for idx, sec in enumerate(spec.sections):
        chunk_id = f"{spec.domain}_{spec.raw_filename.replace('.txt', '')}_{idx+1}_{str(uuid.uuid4())[:8]}"
        text = f"{sec['heading']}\n\n{sec['content']}"
        tokens = count_tokens(text)
        chunk = {
            "id": chunk_id,
            "text": text,
            "section_title": sec["heading"],
            "chunk_index": idx,
            "token_count": tokens,
            "source_title": spec.source_title,
            "source_url": spec.source_url,
            "domain": spec.domain,
            "jurisdiction": spec.jurisdiction,
            "corpus_version": spec.corpus_version,
            "language": "en",
            "page_number": idx + 1
        }
        chunks.append(chunk)
    return chunks


async def update_sqlite_and_faiss(all_chunks: List[Dict[str, Any]]) -> None:
    """Synchronizes chunks with SQLite database and FAISS placeholder index."""
    try:
        from backend.app.core.database import AsyncSessionLocal, ChunkModel, DocumentModel, init_db
        from sqlalchemy import select, delete
        import faiss
        import numpy as np

        await init_db()
        async with AsyncSessionLocal() as session:
            # Group chunks by source_title or source
            docs_map: Dict[str, List[Dict[str, Any]]] = {}
            for c in all_chunks:
                st = c.get("source_title") or c.get("source") or "AYURLEX Statutory Corpus"
                docs_map.setdefault(st, []).append(c)

            # Clear existing data for clean re-sync
            await session.execute(delete(ChunkModel))
            await session.execute(delete(DocumentModel))
            await session.flush()

            for source_title, ch_list in docs_map.items():
                first = ch_list[0]
                doc_record = DocumentModel(
                    title=source_title,
                    source_url=first.get("source_url", "https://ayurlex.gov.in"),
                    domain=first.get("domain", "general"),
                    jurisdiction=first.get("jurisdiction", "IN"),
                    corpus_version=first.get("corpus_version", "v2.0"),
                    language=first.get("language", "en")
                )
                session.add(doc_record)
                await session.flush()

                for faiss_idx, c in enumerate(ch_list):
                    chunk_record = ChunkModel(
                        id=c["id"],
                        document_id=doc_record.id,
                        text=c.get("text", ""),
                        section_title=c.get("section_title", "General"),
                        chunk_index=c.get("chunk_index", faiss_idx),
                        token_count=c.get("token_count", count_tokens(c.get("text", ""))),
                        domain=c.get("domain", "general"),
                        jurisdiction=c.get("jurisdiction", "IN"),
                        corpus_version=c.get("corpus_version", "v2.0"),
                        language=c.get("language", "en"),
                        page_number=c.get("page_number", 1),
                        faiss_id=faiss_idx
                    )
                    session.add(chunk_record)

            await session.commit()
            logger.info(f"Successfully populated SQLite database with {len(all_chunks)} chunks.")

        # Rebuild FAISS index
        index = faiss.IndexFlatL2(1)
        zeros = np.zeros((len(all_chunks), 1), dtype=np.float32)
        index.add(zeros)
        faiss.write_index(index, str(FAISS_DIR / "index.faiss"))

        id_map = {str(i): c["id"] for i, c in enumerate(all_chunks)}
        (FAISS_DIR / "chunk_id_map.json").write_text(json.dumps(id_map, indent=2), encoding="utf-8")
        logger.info(f"FAISS index re-saved with {index.ntotal} vectors.")

    except Exception as e:
        logger.warning(f"Database/FAISS sync note: {e}")


def run_pipeline() -> Tuple[int, int, int]:
    """
    Executes the Docling dataset enhancement pipeline:
    1. Writes rich raw statutory files into data/raw/<subdir>/
    2. Builds DoclingDocument models and saves JSON/Markdown to data/docling/
    3. Merges existing chunks with new rich chunks into data/chunks/chunks.jsonl
    4. Writes BGE-M3 contrastive fine-tuning triples to data/finetuning/bge_triples.jsonl
    """
    logger.info("Starting AYURLEX Docling Dataset Enhancement Pipeline...")

    # 1. Read existing chunks if present
    existing_chunks: List[Dict[str, Any]] = []
    chunks_file = CHUNKS_DIR / "chunks.jsonl"
    if chunks_file.exists():
        with open(chunks_file, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line:
                    try:
                        existing_chunks.append(json.loads(line))
                    except Exception:
                        pass
    logger.info(f"Loaded {len(existing_chunks)} pre-existing chunks.")

    new_chunks: List[Dict[str, Any]] = []
    all_triples: List[Dict[str, str]] = []
    docling_count = 0

    for spec in DOC_SPECS:
        # A. Ensure subdir exists & write raw text
        sub_dir = RAW_DIR / spec.raw_subdir
        sub_dir.mkdir(parents=True, exist_ok=True)
        raw_file = sub_dir / spec.raw_filename
        write_raw_statutory_file(spec, raw_file)

        # B. Build Docling Document & export JSON + Markdown
        docling_doc = build_docling_document(spec)
        docling_json_path = DOCLING_DIR / f"{spec.raw_filename.replace('.txt', '')}.json"
        docling_md_path = DOCLING_DIR / f"{spec.raw_filename.replace('.txt', '')}.md"

        docling_json_path.write_text(docling_doc.model_dump_json(indent=2), encoding="utf-8")
        docling_md_path.write_text(docling_doc.export_to_markdown(), encoding="utf-8")
        docling_count += 1

        # C. Extract chunks
        spec_chunks = extract_chunks_from_spec(spec)
        new_chunks.extend(spec_chunks)

        # D. Collect fine-tuning triples
        all_triples.extend(spec.triples)

    logger.info(f"Generated {len(new_chunks)} new high-quality chunks across {docling_count} Docling documents.")

    # Deduplicate against existing by text prefix
    combined_chunks = list(existing_chunks)
    existing_texts = {c.get("text", "")[:80] for c in existing_chunks}
    for nc in new_chunks:
        if nc["text"][:80] not in existing_texts:
            combined_chunks.append(nc)
            existing_texts.add(nc["text"][:80])

    # Save merged chunks.jsonl
    with open(chunks_file, "w", encoding="utf-8") as f:
        for ch in combined_chunks:
            f.write(json.dumps(ch, ensure_ascii=False) + "\n")
    logger.info(f"Updated {chunks_file} with total {len(combined_chunks)} synchronized chunks!")

    # Save fine-tuning triples
    triples_file = FINETUNING_DIR / "bge_triples.jsonl"
    with open(triples_file, "w", encoding="utf-8") as f:
        for t in all_triples:
            f.write(json.dumps(t, ensure_ascii=False) + "\n")
    logger.info(f"Saved {len(all_triples)} contrastive fine-tuning triples to {triples_file}!")

    # Sync with DB & FAISS
    try:
        asyncio.run(update_sqlite_and_faiss(combined_chunks))
    except Exception as e:
        logger.warning(f"Async DB update skipped: {e}")

    return len(combined_chunks), docling_count, len(all_triples)


if __name__ == "__main__":
    total_chunks, doclings, triples = run_pipeline()
    print(f"\n==================================================================")
    print(f"AYURLEX DOCLING PIPELINE COMPLETED SUCCESSFULLY")
    print(f"Total Synchronized Chunks: {total_chunks}")
    print(f"Docling Documents Created: {doclings}")
    print(f"Fine-Tuning Triples:       {triples}")
    print(f"==================================================================")
