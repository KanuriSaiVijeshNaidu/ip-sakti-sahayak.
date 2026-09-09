"""
backend/app/retrieval/query_expander.py
───────────────────────────────────────
Multilingual 5-Representation Query Expander for AYURLEX / IP-SAKTI.
Produces 5 discrete retrieval representations per query:
1. Original user query (with script/language normalization)
2. English semantic translation / canonical expansion
3. Legal terminology / statutory concepts in target jurisdiction
4. Jurisdiction-specific query (citing relevant patent office / act)
5. Domain / formulation query (e.g. AYUSH, herbals, extracts, biological materials)
"""
from __future__ import annotations

import re
import logging
from typing import Dict, List, Tuple

logger = logging.getLogger(__name__)

# Jurisdictional Statutory Terms
JURISDICTION_STATUTES = {
    "IN": (
        "The Patents Act 1970 Section 2(1)(j) Section 2(1)(ja) Section 3(e) synergistic admixture "
        "Section 3(p) traditional knowledge TKDL prior art Section 10(4)(ii)(D) biological source disclosure "
        "Biological Diversity Act 2002 Section 6 Form III National Biodiversity Authority NBA "
        "Drugs and Cosmetics Act 1940 Rule 158B Ayurvedic Patent Proprietary Medicine Schedule T GMP "
        "FSSAI Food Safety and Standards Ayurveda Aahara Regulations 2022 Trade Marks Act 1999 Form TM-A Nice Class 5"
    ),
    "US": (
        "35 U.S.C. 101 patentable subject matter 35 U.S.C. 102 prior art novelty 35 U.S.C. 103 non-obviousness "
        "35 U.S.C. 112 written description enablement USPTO MPEP 21 CFR 111 cGMP dietary supplements "
        "21 CFR 190.6 New Dietary Ingredient NDI notification GRAS Generally Recognized As Safe DSHEA 1994"
    ),
    "EP": (
        "European Patent Convention EPC Article 52(1) patentable inventions Article 52(2) exclusions "
        "Article 53(c) methods for treatment exception Article 54 novelty Article 56 inventive step problem solution approach "
        "THMPD Directive 2004/24/EC traditional herbal medicinal products EMA HMPC herbal monographs"
    ),
    "JP": (
        "日本国特許法 第29条第1項新規性 第29条第2項進歩性 第36条記載要件 明細書 請求項 特許庁 JPO "
        "医薬品医療機器等法 薬機法 PMDA 承認申請 厚生労働省 機能性表示食品 特定保健用食品 トクホ"
    ),
    "WO": (
        "Patent Cooperation Treaty PCT Article 33 international preliminary examination novelty inventive step "
        "PCT Rule 39 subject matter exclusions WIPO Intergovernmental Committee IGC on Intellectual Property "
        "Genetic Resources Traditional Knowledge and Folklore WIPO Standard ST.26"
    ),
}

# Jurisdictional Official Authority Terms
JURISDICTION_OFFICES = {
    "IN": "CGPDTM Controller General of Patents Designs and Trade Marks Indian Patent Office InPASS Ministry of Ayush National Biodiversity Authority NBA CDSCO FSSAI",
    "US": "United States Patent and Trademark Office USPTO Patent Trial and Appeal Board PTAB Food and Drug Administration FDA Federal Register",
    "EP": "European Patent Office EPO Boards of Appeal European Medicines Agency EMA",
    "JP": "日本国特許庁 Japan Patent Office JPO 独立行政法人医薬品医療機器総合機構 PMDA 厚生労働省 MHLW",
    "WO": "World Intellectual Property Organization WIPO International Bureau IB PCT Receiving Office",
}

# Domain formulation mapping
DOMAIN_TERMS = {
    "patents": "patent claims specification composition formulation synergistic ratio combination index efficacy bioassay novelty inventive step prior art",
    "ayush": "Ayurveda Siddha Unani polyherbal hydroalcoholic extract standardized withanolides curcuminoids bioavailability nanoemulsion Schedule T Form 24D Rule 158B",
    "trademarks": "Trade Marks Registry Form TM-A Nice Classification Class 3 Class 5 Class 30 brand name logo trademark clearance distinctiveness",
    "abs": "Biological Diversity Act 2002 National Biodiversity Authority NBA Form III State Biodiversity Board access benefit sharing ABS genetic resources",
    "regulatory": "regulatory compliance manufacturing license cGMP safety evaluation heavy metal microbial limits acute oral toxicity OECD guidelines",
    "gi": "Geographical Indications Registry Geographical Indication GI Act 1999 Kashmir Saffron Navara Rice registered geographical indication",
    "commercialization": "direct to consumer D2C commercialization Ayurvedic manufacturing license Form 25D classical formulation without patent Schedule 1",
}

# Multilingual term normalization dictionary
MULTILINGUAL_GLOSSARY = {
    # Telugu terms
    "పేటెంట్": "patent",
    "ట్రేడ్‌మార్క్": "trademark",
    "ట్రేడ్ మార్క్": "trademark",
    "ఆయుర్వేదం": "ayurveda",
    "ఆయుష్": "ayush",
    "మిశ్రమం": "admixture formulation",
    "సహజీవనం": "synergistic effect",
    "సాంప్రదాయ విజ్ఞానం": "traditional knowledge",
    "రిజిస్ట్రేషన్": "registration licensing",
    "భౌగోళిక సూచిక": "geographical indication GI",
    "వినియోగదారులకు": "direct to consumers D2C",
    "విక్రయించవచ్చా": "commercialize sell Form 25D without patent",
    "క్లెయిమ్‌లు": "patent claims",
    "క్లెయిమ్‌లను": "patent claims",
    "తిప్పతీగ": "tinospora cordifolia guduchi",
    "అశ్వగంధ": "ashwagandha withania somnifera",
    "మంజూరైన": "granted patent claims",
    # Hindi terms
    "पेटेंट": "patent",
    "ट्रेडमार्क": "trademark",
    "आयुर्वेद": "ayurveda",
    "आयुष": "ayush",
    "मिश्रण": "admixture composition",
    "पारंपरिक ज्ञान": "traditional knowledge",
    "पंजीकरण": "registration filing",
    "अनुमति": "regulatory approval license",
    "व्यावसायीकरण": "commercialization commercialize direct to consumers D2C without patent",
    "उपभोक्ताओं": "direct to consumers D2C",
    "बेच": "sell commercialize Form 25D",
    "भौगोलिक उपदर्शन": "geographical indication GI Kashmir Saffron",
    "कश्मीर केसर": "Kashmir Saffron GI",
    "दावे": "patent claims claim 1",
    "दावों": "patent claims",
    "विथानिया सोम्निफेरा": "Withania somnifera ashwagandha",
    "टिनोस्पोरा कोर्डिफोलिया": "Tinospora cordifolia guduchi giloy",
    "अश्वगंधा": "ashwagandha Withania somnifera",
    "गिलोय": "giloy Tinospora cordifolia",
    # Tamil terms
    "காப்புரிமை": "patent",
    "வணிக முத்திரை": "trademark",
    "வர்த்தக முத்திரை": "trademark",
    "ஆயுர்வேதம்": "ayurveda",
    "சித்த மருத்துவம்": "siddha medicine",
    "பாரம்பரிய அறிவு": "traditional knowledge",
    "சேர்க்கை": "admixture composition",
    "பதிவு": "registration licensing",
    "அஸ்வகந்தா": "Ashwagandha Withania somnifera",
    "சீந்தில் கொடி": "Tinospora cordifolia guduchi giloy",
    "சீந்தில்": "Tinospora cordifolia",
    "உரிமைகோரல்களை": "patent claims claim 1 granted claims",
    "உரிமைகோரல்": "patent claims",
    "காட்டுங்கள்": "show granted patent claims",
    "புவியியல் குறியீடு": "geographical indication GI Act Kashmir Saffron",
    "காஷ்மீர் குங்குமப்பூ": "Kashmir Saffron GI",
    "நுகர்வோருக்கு": "direct to consumers D2C",
    "விற்க": "commercialize sell Form 25D without patent",
    "விற்பனை": "commercial sale D2C",
    "வணிகமயமாக்கல்": "commercialization commercialize D2C",
    "தயாரிப்பை": "Ayurvedic product formulation",
    "திரிபலா": "Triphala Churna",
    "சியவன்பிராச": "Chyawanprash Avaleha",
    # Japanese terms
    "インド": "India Indian",
    "アーユルヴェーダ": "ayurveda ayurvedic",
    "製剤": "formulation composition",
    "食品": "food Ayurveda Aahara",
    "規制": "regulations compliance",
    "特許": "patent",
    "商標": "trademark",
    "生薬": "herbal botanical drug",
    "漢方": "traditional medicine",
    "伝統知識": "traditional knowledge",
    "新規性": "novelty",
    "進歩性": "inventive step",
    "配合": "formulation composition",
    "相乗効果": "synergistic effect",
    "請求項": "patent claims",
    "地理的表示": "geographical indication GI",
}

LEGAL_EXPANSION_RULES = [
    {
        "pattern": r"\b(trademark|trade mark|tm|brand name|logo protection|brand logo|ట్రేడ్‌మార్క్|ट्रेडमार्क|வணிக முத்திரை|வர்த்தக முத்திரை|商標)\b",
        "domain": "trademarks",
        "expansion": (
            "The Trade Marks Act 1999 Section 2(1)(zb) graphical representation mark distinguishing goods services "
            "Section 2(1)(m) device brand heading label name signature word numeral shape of goods packaging "
            "Nice Classification Class 5 pharmaceutical Class 3 cosmetics Class 30 food Form TM-A Section 28 exclusive rights"
        ),
    },
    {
        "pattern": r"\b(patent|patents|inventor|invention|inventive step|prior art|పేటెంట్|पेटेंट|காப்புரிமை|特許)\b",
        "domain": "patents",
        "expansion": (
            "The Patents Act 1970 Section 2(1)(j) invention Section 2(1)(ja) inventive step Section 2(1)(l) novelty "
            "industrial applicability Section 48 exclusive rights Section 53 20 year term Form 1 Form 2 Complete Specification"
        ),
    },
    {
        "pattern": r"\b(claim|claims|granted.*claim|withania|tinospora|cordifolia|somnifera|உரிமைகோரல்|दावे|క్లెయిమ్|அஸ்வகந்தா|சீந்தில்)\b",
        "domain": "patents",
        "expansion": (
            "Indian patent claims Claim 1 synergistic composition Withania somnifera Tinospora cordifolia "
            "process for preparation withanolides extraction yield percentage IN-243763-B IN-268685-B IN-284123-B IN-324590-B IN-348215-B"
        ),
    },
    {
        "pattern": r"\b(ashwagandha|curcumin|herbal formulation|ayurvedic patent|synergy|admixture|withania|turmeric|triphala)\b",
        "domain": "patents",
        "expansion": (
            "Section 3(p) traditional knowledge TKDL prior art exclusion Section 3(e) mere admixture synergistic effect "
            "Combination Index CI bioassay data Biological Diversity Act 2002 Section 6 National Biodiversity Authority NBA Form III"
        ),
    },
    {
        "pattern": r"\b(gi|geographical indication|geographical indications|kashmir saffron|navara rice|புவியியல் குறியீடு|भौगोलिक उपदर्शन|భౌగోళిక సూచిక)\b",
        "domain": "gi",
        "expansion": (
            "Geographical Indications of Goods Registration and Protection Act 1999 Section 2(1)(e) "
            "Geographical Indications Registry Chennai Kashmir Saffron GI application 635 Navara Rice GI application 47"
        ),
    },
    {
        "pattern": r"\b(commercializ|direct to consumer|d2c|sell.*without.*patent|sell.*product|व्यावसायीकरण|விற்க|விற்பனை|விక్రయించ|வணிகமயமாக்கல்)\b",
        "domain": "commercialization",
        "expansion": (
            "Ayurvedic product commercialization without patent Form 25D direct to consumer D2C "
            "Drugs and Cosmetics Rules Rule 158B classical Ayurvedic text Schedule 1 no patent required "
            "manufacturing license State Licensing Authority proprietary Ayurvedic medicine"
        ),
    },
    {
        "pattern": r"\b(ayush license|register.*ayurvedic|register.*product|manufacturing license|form 24d|form 25d|schedule t|gmp)\b",
        "domain": "ayush",
        "expansion": (
            "Drugs and Cosmetics Act 1940 Chapter IV-A Section 3(a) Ayurvedic Siddha Unani drug First Schedule authoritative texts "
            "Drugs and Cosmetics Rules 1945 Rule 158B Patent or Proprietary medicine Schedule T Good Manufacturing Practices "
            "State Licensing Authority SLA e-Aushadhi Form 24D Form 25D loan license Form 26D"
        ),
    },
    {
        "pattern": r"\b(fssai|ayurveda aahara|food supplement|dietary supplement|herbal tea|label.*ayurveda)\b",
        "domain": "fssai",
        "expansion": (
            "Food Safety and Standards Ayurveda Aahara Regulations 2022 Regulation 2.2 official logo category name "
            "Regulation 2.3 prohibition of disease diagnosis cure mitigation claims Schedule A Schedule II heavy metal limits FoSCoS"
        ),
    },
    {
        "pattern": r"\b(nba|biodiversity|biological diversity|access and benefit sharing|abs)\b",
        "domain": "abs",
        "expansion": (
            "Biological Diversity Act 2002 Section 6 mandatory prior approval Form III National Biodiversity Authority NBA "
            "State Biodiversity Board biological resources fair equitable benefit sharing ABS"
        ),
    },
    {
        "pattern": r"\b(uspto|35\s*u\.?s\.?c|fda|ndi|gras|dietary supplement)\b",
        "domain": "patents",
        "expansion": (
            "35 U.S.C. 101 102 103 112 USPTO MPEP 21 CFR 111 cGMP 21 CFR 190.6 NDI DSHEA 1994"
        ),
    },
    {
        "pattern": r"\b(epc|epo|thmpd|directive 2004/24/ec|european patent|hmpc|ema)\b",
        "domain": "patents",
        "expansion": (
            "European Patent Convention EPC Article 52 Article 53c Article 54 Article 56 THMPD Directive 2004 24 EC EMA HMPC"
        ),
    },
    {
        "pattern": r"\b(特許|薬機法|進歩性|新規性|pmda|jpo|機能性表示食品)\b",
        "domain": "patents",
        "expansion": (
            "日本国特許法 第29条新規性 進歩性 薬機法 医薬品医療機器等法 先行技術文献 PMDA JPO"
        ),
    },
]


def build_5_representations(
    query: str,
    detected_language: str,
    target_jurisdictions: List[str],
    intent: str = "general_patent",
) -> Dict[str, str]:
    """
    Builds 5 distinct query representations for hybrid retrieval:
    1. 'original': normalized user query
    2. 'en_canonical': English canonical semantic translation
    3. 'statutory': jurisdiction-specific statutory codes
    4. 'office': official patent office and regulatory authority terms
    5. 'domain': technical formulation / botanical / pharmacological concepts
    """
    norm_query = re.sub(r"\s+", " ", query.strip())
    
    # 1. Original
    q_original = norm_query

    # 2. English Canonical Translation
    q_en_canonical = norm_query
    for term, en_trans in MULTILINGUAL_GLOSSARY.items():
        if term in q_en_canonical:
            q_en_canonical = q_en_canonical.replace(term, en_trans)

    # 3. Statutory Representation
    statutory_parts = []
    for jur in target_jurisdictions:
        if jur in JURISDICTION_STATUTES:
            statutory_parts.append(JURISDICTION_STATUTES[jur])
    q_statutory = " ".join(statutory_parts) if statutory_parts else JURISDICTION_STATUTES["IN"]

    # 4. Office Representation
    office_parts = []
    for jur in target_jurisdictions:
        if jur in JURISDICTION_OFFICES:
            office_parts.append(JURISDICTION_OFFICES[jur])
    q_office = " ".join(office_parts) if office_parts else JURISDICTION_OFFICES["IN"]

    # 5. Domain Formulation Representation
    domain_key = "patents"
    q_lower = norm_query.lower()
    if any(w in q_lower for w in ["trademark", "brand", "logo", "tm", "ట్రేడ్‌మార్క్", "ट्रेडमार्क", "வணிக முத்திரை", "商標"]):
        domain_key = "trademarks"
    elif any(w in q_lower for w in ["license", "gmp", "manufacturing", "sla", "24d", "25d", "158b"]):
        domain_key = "ayush"
    elif any(w in q_lower for w in ["nba", "biodiversity", "biological diversity", "abs"]):
        domain_key = "abs"
    elif any(w in q_lower for w in ["fda", "pmda", "ema", "cdsco", "fssai"]):
        domain_key = "regulatory"
    elif any(w in q_lower for w in ["gi", "geographical indication", "geographical indications", "புவியியல் குறியீடு", "भौगोलिक उपदर्शन", "భౌగోళిక సూచిక"]):
        domain_key = "gi"
    elif any(w in q_lower for w in ["commercializ", "d2c", "consumer", "व्यावसायीकरण", "விற்க", "விற்பனை", "வணிகமயமாக்கல்", "விక్రయించ"]):
        domain_key = "commercialization"
    
    q_domain = DOMAIN_TERMS.get(domain_key, DOMAIN_TERMS["patents"])

    return {
        "original": q_original,
        "en_canonical": q_en_canonical,
        "statutory": q_statutory,
        "office": q_office,
        "domain": q_domain,
    }


def expand_query(query: str, max_expansion_tokens: int = 40) -> Tuple[str, List[str]]:
    """
    Expands a user query with relevant statutory terminology.
    Maintains backward compatibility with fusion pipelines.
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
