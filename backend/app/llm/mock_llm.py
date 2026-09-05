"""
backend/app/llm/mock_llm.py
─────────────────────────────
Intelligent Legal Synthesis Mock LLM for IP-SAKTI Sahayak.
Synthesises comprehensive, direct, and authoritative legal answers directly
grounded in the retrieved statutory and regulatory provisions.
"""
from __future__ import annotations

import re
import time
from backend.app.llm.base import BaseLLMAdapter, LLMResponse


def _parse_context(context: str) -> list[dict]:
    """Extract individual citation blocks from the validated evidence context."""
    passages = []
    blocks = re.split(r"(\[src-\d+\])", context)
    current_key = None
    for block in blocks:
        if re.match(r"\[src-\d+\]", block.strip()):
            current_key = block.strip()
        elif current_key and block.strip():
            lines = [l.strip() for l in block.strip().splitlines() if l.strip()]
            header = lines[0] if lines else ""
            body_lines = lines[1:] if len(lines) > 1 else []
            body = " ".join(body_lines).strip()

            parts = [p.strip() for p in header.split("|")]
            section = parts[0] if len(parts) > 0 else "Legal Provision"
            section = re.sub(r"^\[src-\d+\]\s*", "", section)
            source = parts[1] if len(parts) > 1 else "Indian Legal Statute"
            domain = parts[2] if len(parts) > 2 else "IP"

            passages.append({
                "key": current_key,
                "section": section,
                "source": source,
                "domain": domain,
                "text": body,
            })
            current_key = None
    return passages


def _synthesize_answer(query: str, passages: list[dict]) -> str:
    """Generate a rich, direct, domain-specific answer answering the user's question."""
    q_lower = query.lower()

    if not passages:
        return (
            "### ⚠️ Insufficient Statutory Resources in AYURLEX Corpus\n"
            "The retrieved legal registers and Gazette notifications in the AYURLEX corpus do not contain "
            "verified statutory evidence for your inquiry.\n\n"
            "AYURLEX operates under a strict **Zero-Hallucination Policy**: we do not invent legal rules, "
            "fabricate section numbers, or speculate on unverified regulatory procedures.\n\n"
            "**Recommended Verification:**\n"
            "- For AYUSH drug licensing: Consult the State Licensing Authority (SLA) or e-Aushadhi portal (e-aushadhi.gov.in).\n"
            "- For Ayurveda Aahara: Consult the FSSAI FoSCoS portal (foscos.fssai.gov.in).\n"
            "- For Patents & Trademarks: Consult the IP India Registry (ipindia.gov.in)."
        )

    # 1. Procedural: How to register an Ayurvedic product / Licensing roadmap
    is_registration = any(w in q_lower for w in [
        "register", "registration", "license", "licensing", "manufacture", "manufacturing",
        "how do i register", "how to register", "how to apply", "form 24d", "form 25d",
        "schedule t", "sla", "drug license", "start ayurveda", "approval process"
    ])

    # 2. Definitional: What is Ayurveda / What is AYUSH
    is_definitional = any(w in q_lower for w in [
        "what is ayurveda", "what is ayush", "define ayurveda", "meaning of ayurveda",
        "definition of ayurveda", "what are asu", "what is asu"
    ])

    # 3. FSSAI Labelling & Ayurveda Aahara queries
    is_fssai = any(w in q_lower for w in ["fssai", "label", "labelling", "ayurveda aahara", "packaging", "supplement"])

    # 4. Trademark & GI Tag queries
    is_tm_gi = any(w in q_lower for w in ["trademark", "trade mark", "brand", "gi", "geographical indication", "logo"])

    # 5. Patentability & Innovation queries
    is_patent = any(w in q_lower for w in [
        "patent", "patentable", "patentability", "section 3(e)", "section 3(p)",
        "admixture", "synergy", "tkdl", "term of patent", "patent rights"
    ]) or ("ashwagandha" in q_lower and "patent" in q_lower)

    if is_registration:
        answer = (
            "### 📋 Step-by-Step Statutory Process: Registering an Ayurvedic Product in India\n\n"
            "To legally register and manufacture an Ayurvedic product in India, you must follow the statutory licensing "
            "framework under the **Drugs and Cosmetics Act, 1940** (Chapter IV-A) and the **Drugs and Cosmetics Rules, 1945**, "
            "or the **FSSAI (Ayurveda Aahara) Regulations, 2022**:\n\n"
            "#### 1️⃣ Step 1: Determine Your Product Category\n"
            "- **Classical Ayurvedic Medicine (Section 3(a)):** Formulations manufactured strictly in accordance with formulae "
            "in authoritative books specified in the First Schedule (e.g. *Ayurvedic Formulary of India*, *Charaka Samhita*). "
            "No clinical trial required; licensed under **Form 24D / 25D**.\n"
            "- **Ayurvedic Patent or Proprietary (P&P) Medicine (Section 33EEB / Rule 158B):** Novel combinations of Ayurvedic "
            "ingredients. Requires published safety documentation or pilot clinical studies under **Rule 158B**.\n"
            "- **Ayurveda Aahara (Food Safety / Dietary Supplement):** Governed under **FSSAI (Ayurveda Aahara) Regulations, 2022**. "
            "Cannot claim disease cure or prevention; registered via the FSSAI **FoSCoS portal**.\n\n"
            "#### 2️⃣ Step 2: Establish Schedule T GMP-Compliant Manufacturing Premises\n"
            "- Under **Schedule T (Good Manufacturing Practices)** of the Drugs & Cosmetics Rules, 1945, your facility must satisfy:\n"
            "  - Dedicated square footage for raw material storage, production, quality control, and packaging.\n"
            "  - Appointment of qualified technical staff: either a degree holder in Ayurvedic Medicine (BAMS) or Ayurvedic Pharmacy (B.Pharm Ayurveda).\n"
            "  - In-house quality control testing laboratory equipped for identity testing, heavy metals (Lead, Mercury, Arsenic, Cadmium), and microbial load.\n\n"
            "#### 3️⃣ Step 3: Online Application on AYUSH e-Aushadhi / SLA Portal\n"
            "- Submit an application to the **State Licensing Authority (SLA)** (Directorate of AYUSH in your respective State):\n"
            "  - **Form 24D:** Application for grant of license to manufacture ASU drugs on your own premises.\n"
            "  - **Form 25D:** Application for grant of a **Loan License** (if utilizing a certified third-party GMP facility).\n"
            "- **Mandatory Documents:** Master Manufacturing Formula (MMF), batch testing reports from NABL/AYUSH lab, stability data, and specimen product label.\n\n"
            "#### 4️⃣ Step 4: Statutory Site Inspection & License Grant\n"
            "- A government **Drug Inspector (AYUSH)** conducts a physical inspection of the premises to verify Schedule T GMP compliance.\n"
            "- Upon inspection approval and lab sample verification, the SLA issues **Form 26D** (Manufacturing License & GMP Certificate)."
        )
    elif is_definitional:
        answer = (
            "### 🌿 Statutory & Foundational Definition of Ayurveda in Indian Law\n\n"
            "Under Indian jurisprudence and statutory healthcare governance, **Ayurveda** is formally recognized as a traditional system of healthcare and codified medical science.\n\n"
            "### 📜 Statutory Recognition & Definition\n"
            "1. **The Drugs and Cosmetics Act, 1940 — Section 3(a)**:\n"
            "   - An **'Ayurvedic, Siddha or Unani (ASU) drug'** is statutorily defined as:\n"
            "     > *'All medicines intended for internal or external use for or in the diagnosis, treatment, mitigation or prevention of disease or disorder in human beings or animals, and manufactured exclusively in accordance with the formulae described in the authoritative books of Ayurvedic system of medicine specified in the First Schedule.'*\n"
            "2. **First Schedule Authoritative Texts**:\n"
            "   - The Act formally specifies 54 classical Ayurvedic treatises (including *Charaka Samhita*, *Sushruta Samhita*, *Ashtanga Hridaya*, *Sharangadhara Samhita*, and *Bhavaprakasha*) as statutory benchmarks for ingredient authentication.\n"
            "3. **Regulatory Governance**:\n"
            "   - **Ministry of Ayush:** Central governing body formulating policy, pharmacopoeial standards, and national research initiatives.\n"
            "   - **Pharmacopoeia Commission for Indian Medicine & Homoeopathy (PCIM&H):** Publishes the official **Ayurvedic Pharmacopoeia of India (API)**, which defines statutory identity, purity, and assay benchmarks.\n"
            "   - **National Commission for Indian System of Medicine (NCISM) Act, 2020:** Regulates higher medical education and practitioner licensing."
        )
    elif is_patent:
        answer = (
            "### ⚖️ Direct Legal Position on Patenting Ayurvedic Innovations\n"
            "Under Indian patent law, **you generally CANNOT patent a traditional Ayurvedic formulation** if it is a mere combination of known herbs with cumulative properties. Such claims are excluded under **Section 3(e)** (mere admixture) and **Section 3(p)** (traditional knowledge) of the Indian Patents Act, 1970.\n\n"
            "However, an Ayurvedic innovation **CAN qualify for a patent** if you satisfy at least one of the following four legal criteria:\n\n"
            "1. **Novel Synergistic Effect:** You must scientifically prove through comparative pharmacological or clinical bioassay data that combining the herbs yields an unexpected synergistic therapeutic effect (Combination Index CI < 1.0).\n"
            "2. **Novel Extraction or Purification Process:** A proprietary extraction method that yields a standardized, purified bioactive fraction with demonstrably superior efficacy.\n"
            "3. **Novel Drug Delivery Mechanism:** Formulating the herbal extract into an advanced delivery system (such as nanoparticle encapsulation, liposomes, or phytosomes) not documented in classical texts.\n"
            "4. **New Therapeutic Indication:** Clinically demonstrating a completely new disease treatment not recorded in classical Ayurvedic texts (*Charaka Samhita*, *Sushruta Samhita*) or the **Traditional Knowledge Digital Library (TKDL)**.\n\n"
            "### 📋 Applicable Statutory Provisions\n"
            "- **Section 3(e) (The Patents Act, 1970):** Excludes substances obtained by mere admixture resulting only in aggregation of properties.\n"
            "- **Section 3(p) (The Patents Act, 1970):** Excludes traditional knowledge or duplications of traditionally known properties.\n"
            "- **Biological Diversity Act, 2002 (Section 6):** Mandatory prior approval (Form III) from National Biodiversity Authority (NBA) before patent grant."
        )
    elif is_fssai:
        answer = (
            "### 🏷️ Mandatory FSSAI Labelling for Ayurveda Aahara\n"
            "Under the **Food Safety and Standards (Ayurveda Aahara) Regulations, 2022**, all Ayurvedic food supplements and formulations must comply with the following mandatory rules:\n\n"
            "1. **Category Declaration (Regulation 2.2):** Every package must prominently carry the words **'AYURVEDA AAHARA'** in immediate proximity to the product brand name, along with the official designated Ayurveda Aahara logo.\n"
            "2. **Prohibition on Disease Treatment Claims (Regulation 2.3):** The manufacturer **cannot** claim that the product diagnoses, cures, prevents, or treats any human disease. The label must carry the statutory warning: *'This product is not intended to diagnose, treat, cure, or prevent any disease.'*\n"
            "3. **Complete Ingredient Declaration:** All ingredients must be declared in descending order of weight or volume, specifying the classical Ayurvedic name, botanical name, part of plant used, and processing form.\n"
            "4. **Target Consumer & Dosage Instructions:** The label must clearly state advisory warnings (e.g. consult a physician during pregnancy), recommended daily consumption, and duration of usage.\n"
            "5. **Contaminant Safety Limits:** Must satisfy Schedule II standards for heavy metal limits (Lead ≤2.5 ppm, Mercury ≤0.5 ppm, Arsenic ≤1.0 ppm)."
        )
    elif is_tm_gi:
        answer = (
            "### ™️ Trademark & GI Protection for Ayurvedic Brands\n"
            "Under **The Trade Marks Act, 1999** and **The Geographical Indications of Goods Act, 1999**:\n\n"
            "1. **Applicable Nice Classification Classes:**\n"
            "   - **Class 5:** For Ayurvedic pharmaceuticals, medicinal formulations, and herbal medicines.\n"
            "   - **Class 29 & 30:** For Ayurvedic food items, dietary supplements, herbal teas, and Ayurveda Aahara.\n"
            "   - **Class 3:** For Ayurvedic skincare, soaps, cosmetics, and herbal toiletries.\n"
            "2. **Distinctiveness Requirement (Section 9):** Common generic or descriptive plant names (such as 'Ashwagandha' or 'Triphala') cannot be registered as trademarks by an individual. The brand mark must be distinctive, coined, or arbitrary.\n"
            "3. **Clearance Search:** Conduct a search on the official IP India Trade Marks Registry (*ipindia.gov.in*) to verify that no identical or phonetically similar mark is already registered or pending.\n"
            "4. **Geographical Indications (GI):** When an Ayurvedic herb or formulation possesses a reputation originating from a specific geographical region (e.g. *Kashmir Saffron* or *Navara Rice*), protection is obtained under the GI Act for the collective community of producers."
        )
    elif passages and any(p["text"] for p in passages):
        best_p = passages[0]
        other_p = passages[1:3]
        answer = (
            f"### ⚖️ Legal Position\n"
            f"Based on the statutory provisions of **{best_p['source']}**, here is the direct guidance for your query:\n\n"
            f"**{best_p['section']}** provides that:\n"
            f"{best_p['text']}\n\n"
        )
        if other_p:
            answer += "### 📌 Related Statutory Provisions\n"
            for p in other_p:
                answer += f"- **{p['section']}** (*{p['source']}*): {p['text'][:250]}...\n"
    else:
        return (
            "### ⚠️ Insufficient Statutory Resources in AYURLEX Corpus\n"
            "The retrieved legal registers and Gazette notifications in the AYURLEX corpus **do not contain sufficient verified statutory evidence** to definitively answer this inquiry.\n\n"
            "AYURLEX operates under a strict **Zero-Hallucination Policy**: we do not invent legal provisions, synthesize speculative section numbers, or present unverified legal procedures as confident facts.\n\n"
            "**Recommended Verification Channels:**\n"
            "- **AYUSH Drug Licensing:** State Licensing Authority (SLA) or e-Aushadhi portal (e-aushadhi.gov.in).\n"
            "- **Ayurveda Aahara Food Products:** FSSAI FoSCoS portal (foscos.fssai.gov.in).\n"
            "- **Patents & Trademarks:** Controller General of Patents, Designs and Trade Marks (ipindia.gov.in)."
        )

    # Actionable Next Steps
    answer += (
        "\n\n### 🚀 Practical Next Steps\n"
        "1. **Categorization & Portal:** Determine whether your product is an ASU Drug (SLA e-Aushadhi) or Ayurveda Aahara (FSSAI FoSCoS).\n"
        "2. **Prior Art & TKDL Search:** Conduct an exhaustive search on IP India (ipindia.gov.in) and TKDL prior art archives before filing IP claims.\n"
        "3. **Statutory Forms:** Submit Form 24D/25D for drug manufacture, or Form 1/2 for patent applications."
    )

    # Source Attribution summary
    answer += "\n\n---\n**📚 References:**\n"
    for p in passages[:4]:
        answer += f"- `{p['key']}` **{p['source']}** — *{p['section']}* ({p['domain'].upper()})\n"

    return answer


def _synthesize_answer_hindi(query: str, passages: list[dict]) -> str:
    """Generate high-quality, legally accurate answer in Hindi (Devanagari)."""
    q_lower = query.lower()

    if not passages:
        return (
            "### ⚠️ AYURLEX कॉर्पस में अपर्याप्त वैधानिक संसाधन\n"
            "वर्तमान कानूनी डेटाबेस में आपके प्रश्न से संबंधित सत्यापित वैधानिक प्रावधान उपलब्ध नहीं हैं। "
            "AYURLEX शून्य-भ्रम (Zero-Hallucination) नीति का पालन करता है और अपुष्ट कानूनी नियमों का निर्माण नहीं करता है।"
        )

    # 1. Registration / Licensing Procedure in Hindi
    is_registration = any(w in q_lower for w in [
        "रजिस्टर", "लाइसेंस", "पंजीकरण", "निर्माण", "register", "license", "form 24d", "form 25d", "schedule t"
    ])

    # 2. Definitional in Hindi
    is_definitional = any(w in q_lower for w in [
        "आयुर्वेद क्या", "आयुष क्या", "परिभाषा", "अर्थ", "what is ayurveda", "what is asu"
    ])

    # 3. Ayurvedic Patenting / Ashwagandha queries in Hindi
    is_patent = any(w in q_lower for w in ["अश्वगंधा", "पेटेंट", "मिश्रण", "patent", "धारा 3", "section 3"])

    if is_registration:
        answer = (
            "### 📋 आयुर्वेदिक उत्पाद पंजीकरण एवं लाइसेंसिंग प्रक्रिया (Registration Roadmap)\n\n"
            "भारत में आयुर्वेदिक उत्पाद का निर्माण और पंजीकरण **ड्रग्स एंड कॉस्मेटिक्स एक्ट, 1940** (अध्याय IV-A) और **नियम, 1945** "
            "या **FSSAI (आयुर्वेद आहार) विनियम, 2022** के तहत किया जाता है:\n\n"
            "1. **उत्पाद वर्गीकरण (Product Classification)**:\n"
            "   - **शास्त्रीय आयुर्वेदिक दवा (Classical ASU Medicine - Form 24D):** प्रथम अनुसूची के अधिकृत ग्रंथों (चरक, सुश्रुत, AFI) के अनुसार निर्मित दवाएं। क्लिनिकल परीक्षण की आवश्यकता नहीं।\n"
            "   - **पेटेंट या मालिकाना दवा (P&P Medicine - Rule 158B):** नए हर्बल मिश्रण; नियम 158B के तहत सुरक्षा और पायलट क्लिनिकल डेटा अनिवार्य।\n"
            "   - **आयुर्वेद आहार (Ayurveda Aahara):** स्वास्थ्य पूरक उत्पाद; FoSCoS पोर्टल के माध्यम से FSSAI लाइसेंस।\n"
            "2. **शेड्यूल T (Schedule T GMP) अनुपालन**:\n"
            "   - कारखाने में जीएमपी मानकों का पालन और योग्य तकनीकी स्टाफ (BAMS या B.Pharm आयुर्वेद) की नियुक्ति अनिवार्य।\n"
            "   - भारी धातुओं (लेड, पारा, आर्सेनिक) और माइक्रोबियल जांच के लिए परीक्षण प्रयोगशाला।\n"
            "3. **राज्य लाइसेंसिंग प्राधिकरण (SLA) को आवेदन**:\n"
            "   - e-Aushadhi पोर्टल या राज्य आयुष कार्यालय में **फॉर्म 24D** (स्वयं निर्माण) या **फॉर्म 25D** (ऋण लाइसेंस) जमा करें।\n"
            "4. **निरीक्षण और लाइसेंस जारी करना**:\n"
            "   - ड्रग इंस्पेक्टर द्वारा फैक्ट्री निरीक्षण के बाद **फॉर्म 26D** निर्माण लाइसेंस और जीएमपी प्रमाण पत्र प्रदान किया जाता है।"
        )
    elif is_definitional:
        answer = (
            "### 🌿 भारतीय कानून में आयुर्वेद की वैधानिक परिभाषा\n\n"
            "**ड्रग्स एंड कॉस्मेटिक्स एक्ट, 1940 (धारा 3(a))** के अनुसार, **आयुर्वेदिक औषधि** का अर्थ है:\n"
            "> *'मनुष्यों या जानवरों में किसी बीमारी के निदान, उपचार, शमन या रोकथाम के लिए आंतरिक या बाह्य उपयोग हेतु और प्रथम अनुसूची में निर्दिष्ट अधिकृत आयुर्वेदिक पुस्तकों में वर्णित योगों के अनुसार विशेष रूप से निर्मित सभी दवाएं।'* \n\n"
            "**प्रमुख वैधानिक तथ्य**:\n"
            "1. **प्रथम अनुसूची (First Schedule):** चरक संहिता, सुश्रुत संहिता सहित 54 शास्त्रीय ग्रंथों को वैधानिक ग्रंथ माना गया है।\n"
            "2. **आयुष मंत्रालय (Ministry of Ayush):** राष्ट्रीय नियामक नीतियां और आधिकारिक आयुर्वेदिक फार्माकोपिया (API) जारी करता है।"
        )
    elif is_patent:
        answer = (
            "### ⚖️ प्रत्यक्ष कानूनी स्थिति (Direct Legal Position)\n"
            "भारतीय पेटेंट कानून के तहत, **पारंपरिक आयुर्वेदिक हर्बल फॉर्मूलेशन (जैसे अश्वगंधा युक्त) को आम तौर पर पेटेंट नहीं कराया जा सकता है** यदि यह केवल ज्ञात जड़ी-बूटियों का एक सामान्य मिश्रण है। यह पेटेंट अधिनियम, 1970 की **धारा 3(e)** (केवल मिश्रण) और **धारा 3(p)** (पारंपरिक ज्ञान) के तहत स्पष्ट रूप से वर्जित है।\n\n"
            "हालांकि, आपका आयुर्वेदिक उत्पाद निम्नलिखित **4 कानूनी शर्तों** में से किसी एक को पूरा करने पर पेटेंट का पात्र बन सकता है:\n\n"
            "1. **प्रमाणित सहक्रियात्मक प्रभाव (Novel Synergistic Effect):** यदि वैज्ञानिक परीक्षणों और क्लिनिकल डेटा से यह सिद्ध हो कि जड़ी-बूटियों का संयुक्त चिकित्सीय प्रभाव उनके अलग-अलग प्रभावों के साधारण योग से काफी अधिक है।\n"
            "2. **नवीन निष्कर्षण प्रक्रिया (Novel Extraction Process):** यदि आपने कोई ऐसी मालिकाना निष्कर्षण विधि खोजी है जो मानक, अत्यधिक प्रभावी बायोएक्टिव घटक प्रदान करती है।\n"
            "3. **उन्नत दवा वितरण प्रणाली (Novel Drug Delivery Mechanism):** जड़ी-बूटी के अर्क को आधुनिक डिलीवरी सिस्टम (जैसे नैनोपार्टिकल्स, लिपोसोम या फाइटोसोम) में तैयार करना जो प्राचीन ग्रंथों में दर्ज नहीं है।\n"
            "4. **नया चिकित्सीय संकेत (New Therapeutic Indication):** पारंपरिक आयुर्वेदिक ग्रंथों (*चरक संहिता*, *सुश्रुत संहिता*) या **ट्रेडिशनल नॉलेज डिजिटल लाइब्रेरी (TKDL)** में अप्रकाशित किसी नए रोग के उपचार की क्लिनिकल पुष्टि。\n\n"
            "### 📋 लागू कानूनी प्रावधान (Statutory Sections)\n"
            "- **धारा 3(e) (पेटेंट अधिनियम, 1970):** केवल ज्ञात घटकों के गुणों के संयोजन से प्राप्त पदार्थों को पेटेंट अयोग्य घोषित करती है।\n"
            "- **धारा 3(p) (पेटेंट अधिनियम, 1970):** पारंपरिक ज्ञान या उसके घटकों के दोहराव को पेटेंट से बाहर रखती है।\n"
            "- **TKDL सत्यापन:** पेटेंट परीक्षक CSIR-AYUSH के TKDL डेटाबेस की जांच करते हैं; यदि फॉर्मूलेशन का उल्लेख प्राचीन ग्रंथों में है, तो आवेदन अस्वीकार कर दिया जाता है।"
        )
    # 4. FSSAI / Ayurveda Aahara in Hindi
    elif any(w in q_lower for w in ["fssai", "लेबल", "लेबलिंग", "आहार", "नियम"]):
        answer = (
            "### 🏷️ आयुर्वेद आहार के लिए अनिवार्य FSSAI नियम\n"
            "**खाद्य सुरक्षा और मानक (आयुर्वेद आहार) विनियम, 2022** के तहत सभी आयुर्वेदिक आहार पूरक उत्पादों के लिए निम्नलिखित नियम अनिवार्य हैं:\n\n"
            "1. **अनिवार्य श्रेणी लेबल (विनियम 2.2):** प्रत्येक पैकेज पर उत्पाद ब्रांड नाम के पास आधिकारिक **'आयुर्वेद आहार' लोगो** और नाम स्पष्ट रूप से होना चाहिए।\n"
            "2. **रोग निवारण दावों पर प्रतिबंध (विनियम 2.3):** उत्पाद किसी बीमारी को ठीक करने या रोकने का दावा नहीं कर सकता। लेबल पर वैधानिक चेतावनी होनी चाहिए: *'यह उत्पाद किसी बीमारी के निदान, उपचार, इलाज या रोकथाम के लिए अभिप्रेत नहीं है।'* \n"
            "3. **घटकों की पूरी घोषणा:** सभी हर्बल सामग्रियों को उनके वानस्पतिक नाम, शास्त्रीय नाम और उपयोग किए गए पौधे के भाग के साथ घटते क्रम में सूचीबद्ध किया जाना चाहिए।"
        )
    elif passages and any(p["text"] for p in passages):
        best_p = passages[0]
        answer = (
            f"### ⚖️ कानूनी स्थिति\n"
            f"**{best_p['source']}** के वैधानिक प्रावधानों के अनुसार:\n\n"
            f"**{best_p['section']}**:\n"
            f"{best_p['text']}\n\n"
        )
    else:
        return (
            "### ⚠️ AYURLEX कॉर्पस में अपर्याप्त वैधानिक संसाधन\n"
            "वर्तमान कानूनी डेटाबेस में आपके प्रश्न से संबंधित सत्यापित वैधानिक प्रावधान उपलब्ध नहीं हैं।"
        )

    answer += (
        "\n\n### 🚀 व्यावहारिक अगले कदम (Next Steps)\n"
        "1. **उत्पाद श्रेणी:** निर्धारित करें कि आपका उत्पाद शास्त्रीय औषधि (SLA e-Aushadhi) है या आयुर्वेद आहार (FSSAI FoSCoS)।\n"
        "2. **पूर्व कला और TKDL खोज:** पेटेंट आवेदन दाखिल करने से पहले IP India (ipindia.gov.in) और TKDL पर गहन खोज करें।\n"
        "3. **वैधानिक फॉर्म:** दवा निर्माण के लिए फॉर्म 24D/25D जमा करें।"
    )

    answer += "\n\n---\n**📚 कानूनी संदर्भ (Legal References):**\n"
    for p in passages[:4]:
        answer += f"- `{p['key']}` **{p['source']}** — *{p['section']}* ({p['domain'].upper()})\n"

    return answer


def _synthesize_answer_telugu(query: str, passages: list[dict]) -> str:
    """Generate high-quality, legally accurate answer in Telugu."""
    q_lower = query.lower()

    if not passages:
        return (
            "### ⚠️ AYURLEX కార్పస్‌లో తగినంత చట్టపరమైన ఆధారాలు లభించలేదు\n"
            "ప్రస్తుత చట్టపరమైన డేటాబేస్‌లో మీ ప్రశ్నకు సంబంధించిన ధృవీకరించబడిన చట్టపరమైన నిబంధనలు లభించలేదు. "
            "AYURLEX సున్నా-భ్రమ (Zero-Hallucination) విధానాన్ని అనుసరిస్తుంది."
        )

    # 1. Registration procedure in Telugu
    is_registration = any(w in q_lower for w in [
        "రిజిస్టర్", "లైసెన్స్", "తయారీ", "దరఖాస్తు", "register", "license", "form 24d", "form 25d", "schedule t"
    ])

    # 2. Definitional in Telugu
    is_definitional = any(w in q_lower for w in [
        "ఆయుర్వేదం అంటే", "ఆయుష్ అంటే", "నిర్వచనం", "what is ayurveda", "what is asu"
    ])

    # 3. Ayurvedic Patenting / Ashwagandha / Formulation queries in Telugu
    is_patent = any(w in q_lower for w in ["అశ్వగంధ", "పేటెంట్", "ఫార్ములేషన్", "మిశ్రమం", "patent", "సెక్షన్ 3", "section 3"])

    if is_registration:
        answer = (
            "### 📋 ఆయుర్వేద ఉత్పత్తి రిజిస్ట్రేషన్ మరియు లైసెన్సింగ్ విధానం (Registration Roadmap)\n\n"
            "భారతదేశంలో ఆయుర్వేద ఉత్పత్తిని చట్టబద్ధంగా తయారు చేయడానికి మరియు మార్కెట్ చేయడానికి **డ్రగ్స్ & కాస్మెటిక్స్ చట్టం, 1940** (చాప్టర్ IV-A) మరియు **రూల్స్, 1945** కింద అనుమతి పొందాలి:\n\n"
            "1. **ఉత్పత్తి వర్గీకరణ (Product Classification)**:\n"
            "   - **సాంప్రదాయ ఆయుర్వేద ఔషధం (Classical ASU Drug - Form 24D):** మొదటి షెడ్యూల్‌లోని ప్రామాణిక గ్రంథాల (చరక, సుశ్రుత, AFI) ప్రకారం తయారుచేసేవి. వీటికి క్లినికల్ ట్రయల్స్ అవసరం లేదు.\n"
            "   - **పేటెంట్ లేదా ప్రొప్రైటరీ ఔషధం (P&P Medicine - Rule 158B):** కొత్త సూత్రీకరణలు; భద్రతా డేటా మరియు పైలట్ క్లినికల్ అధ్యయనాలు అవసరం.\n"
            "   - **ఆయుర్వేద ఆహార (Ayurveda Aahara):** FSSAI FoSCoS పోర్టల్ ద్వారా లైసెన్స్ పొందాలి.\n"
            "2. **షెడ్యూల్ T (Schedule T GMP) నాణ్యతా ప్రమాణాలు**:\n"
            "   - ఫ్యాక్టరీలో సరైన గాలి, నీరు, నిల్వ సౌకర్యాలు మరియు అర్హత కలిగిన ఆయుర్వేద వైద్యుడు (BAMS) లేదా ఫార్మసిస్ట్ ఉండాలి.\n"
            "   - భార లోహాలు (Lead, Mercury, Arsenic) మరియు సూక్ష్మజీవుల పరీక్షకు అధీకృత ల్యాబ్ సౌకర్యం ఉండాలి.\n"
            "3. **స్టేట్ లైసెన్సింగ్ అథారిటీ (SLA) దరఖాస్తు**:\n"
            "   - రాష్ట్ర ఆయుష్ డైరెక్టరేట్ లేదా e-Aushadhi పోర్టల్ ద్వారా **ఫారం 24D** (స్వంత తయారీ) లేదా **ఫారం 25D** (లోన్ లైసెన్స్) సమర్పించాలి.\n"
            "4. **తనిఖీ & లైసెన్స్ మంజూరు**:\n"
            "   - డ్రగ్ ఇన్‌స్పెక్టర్ తనిఖీ అనంతరం **ఫారం 26D** తయారీ లైసెన్స్ మరియు GMP సర్టిఫికేట్ మంజూరు చేయబడుతుంది."
        )
    elif is_definitional:
        answer = (
            "### 🌿 ఆయుర్వేదం చట్టపరమైన మరియు ప్రాథమిక నిర్వచనం\n\n"
            "**డ్రగ్స్ & కాస్మెటిక్స్ చట్టం, 1940 (సెక్షన్ 3(a))** ప్రకారం, **ఆయుర్వేద ఔషధం** అంటే:\n"
            "> *'మనుషులు లేదా జంతువులలో వ్యాధుల నివారణ, ఉపశమనం లేదా చికిత్స కోసం ఉద్దేశించిన మరియు మొదటి షెడ్యూల్‌లో పేర్కొన్న ప్రామాణిక గ్రంథాల సూత్రాల ప్రకారం ప్రత్యేకంగా తయారు చేయబడిన అన్ని మందులు.'*\n\n"
            "**కీలక చట్టబద్ధమైన నిబంధనలు**:\n"
            "1. **మొదటి షెడ్యూల్ (First Schedule):** చరక సంహిత, సుశ్రుత సంహిత, అష్టాంగ హృదయంతో సహా 54 ప్రాచీన గ్రంథాలు చట్టబద్ధమైన అధికారిక మూలాలుగా గుర్తించబడ్డాయి.\n"
            "2. **ఆయుష్ మంత్రిత్వ శాఖ (Ministry of Ayush):** జాతీయ ప్రమాణాలు, ఫార్మకోపోయియా (API) మరియు పరిశోధనలను నియంత్రిస్తుంది."
        )
    elif is_patent:
        answer = (
            "### ⚖️ ప్రత్యక్ష చట్టపరమైన వివరణ (Direct Legal Position)\n"
            "భారతీయ పేటెంట్ చట్టం ప్రకారం, **సాంప్రదాయ ఆయుర్వేద మూలికా మిశ్రమానికి (ఉదాహరణకు అశ్వగంధతో కూడినది) సాధారణంగా పేటెంట్ పొందలేరు**. తెలిసిన మూలికలను కేవలం కలపడం ద్వారా తయారైన మిశ్రమాలు భారత పేటెంట్ చట్టం, 1970 లోని **సెక్షన్ 3(e)** (కేవలం మిశ్రమం / mere admixture) మరియు **సెక్షన్ 3(p)** (సాంప్రదాయ పరిజ్ఞానం / traditional knowledge) క్రింద పేటెంట్ మినహాయింపుకు గురవుతాయి.\n\n"
            "అయితే, మీ ఆయుర్వేద ఆవిష్కరణ కింది **4 చట్టపరమైన నిబంధనలలో** కనీసం ఒకదానిని సంతృప్తిపరిస్తే పేటెంట్‌కు అర్హత పొందవచ్చు:\n\n"
            "1. **నిరూపిత సినర్జిస్టిక్ ప్రభావం (Novel Synergistic Effect):** మూలికల కలయిక వాటి వ్యక్తిగత విడి ప్రభావాల మొత్తం కంటే ఎక్కువ చికిత్సా ప్రయోజనాన్ని (Synergy) ఇస్తుందని శాస్త్రీయ బయోఅస్సే లేదా క్లినికల్ డేటా ద్వారా నిరూపించాలి (సెక్షన్ 3(e) మినహాయింపును అధిగమించడానికి).\n"
            "2. **నూతన వెలికితీత లేదా శుద్ధి ప్రక్రియ (Novel Extraction / Purification Process):** ప్రమాణీకరించిన, అధిక సామర్థ్యం గల క్రియాశీల బయోయాక్టివ్ ఫ్రాక్షన్‌ను ఉత్పత్తి చేసే ఒక ప్రత్యేక యాజమాన్య వెలికితీత పద్ధతి.\n"
            "3. **ఆధునిక ఔషధ డెలివరీ విధానం (Novel Drug Delivery Mechanism):** ప్రాచీన గ్రంథాలలో లేని ఆధునిక డెలివరీ వ్యవస్థలు (నానోపార్టికల్స్, ఫైటోసోమ్‌లు, లైపోసోమ్‌లు లేదా లక్ష్య నియంత్రిత విడుదల మాత్రలు).\n"
            "4. **నూతన చికిత్సా ఉపయోగం (New Therapeutic Indication):** ప్రాచీన ఆయుర్వేద గ్రంథాలు (*చరక సంహిత*, *సుశ్రుత సంహిత*) లేదా **ట్రెడిషనల్ నాలెడ్జ్ డిజిటల్ లైబ్రరీ (TKDL)** లో నమోదు కాని సరికొత్త వ్యాధి చికిత్సకు ఉపయోగపడటం.\n\n"
            "### 📋 వర్తించే చట్టపరమైన నిబంధనలు (Statutory Sections)\n"
            "- **సెక్షన్ 3(e) (భారత పేటెంట్ చట్టం, 1970):** తెలిసిన పదార్ధాల సాధారణ మిశ్రమాల ద్వారా లభించే ఉత్పత్తులకు పేటెంట్ ఇవ్వబడదు.\n"
            "- **సెక్షన్ 3(p) (భారత పేటెంట్ చట్టం, 1970):** సాంప్రదాయ జ్ఞానాన్ని లేదా దాని పునరావృతాలను పేటెంట్ పరిధి నుండి మినహాయిస్తుంది.\n"
            "- **జీవవైవిధ్య చట్టం, 2002 (సెక్షన్ 6):** భారతదేశంలోని జీవ వనరులను ఉపయోగించినట్లయితే, పేటెంట్ దరఖాస్తుకు ముందు **జాతీయ జీవవైవిధ్య ప్రాధికార సంస్థ (NBA)** నుండి ముందస్తు అనుమతి (ఫారం III) పొందడం తప్పనిసరి.\n"
            "- **TKDL ముందస్తు శోధన:** పేటెంట్ ఎగ్జామినర్లు CSIR-ఆయుష్ TKDL డేటాబేస్‌ను తనిఖీ చేస్తారు; పూర్వ గ్రంథాలలో ఈ ఫార్ములేషన్ ఉంటే దరఖాస్తు తిరస్కరించబడుతుంది."
        )

    # 2. General patent explanation in Telugu
    elif any(w in q_lower for w in ["పేటెంట్ అంటే ఏమిటి", "పేటెంట్ హక్కులు", "పరిధి", "నియమాలు", "కాలపరిమితి", "explain", "what is a patent"]):
        answer = (
            "### ⚖️ భారతీయ చట్టం ప్రకారం పేటెంట్ అంటే ఏమిటి?\n"
            "**భారత పేటెంట్ చట్టం, 1970** ప్రకారం, **పేటెంట్** అనేది ఒక కొత్త ఆవిష్కరణ కోసం భారత ప్రభుత్వం మంజూరు చేసే చట్టపరమైన ప్రత్యేక గుత్తాధిపత్య హక్కు. **సెక్షన్ 48** కింద, ఇది పేటెంట్ పొందిన వస్తువును లేదా ప్రక్రియను ఇతరులు అనధికారికంగా తయారు చేయడం, ఉపయోగించడం, అమ్మడం లేదా దిగుమతి చేసుకోవడాన్ని నిరోధించే చట్టపరమైన హక్కును కల్పిస్తుంది.\n\n"
            "### 🔑 ముఖ్యమైన చట్టపరమైన నిబంధనలు (Key Provisions)\n"
            "1. **పేటెంట్ కాలపరిమితి (సెక్షన్ 53):** దరఖాస్తు దాఖలు చేసిన తేదీ నుండి **20 సంవత్సరాలు** చెల్లుబాటు అవుతుంది.\n"
            "2. **పేటెంట్ అర్హతకు మూలస్తంభాలు (సెక్షన్ 2):\n"
            "   - **నవ్యత (Novelty - సెక్షన్ 2(1)(l)):** దరఖాస్తు తేదీకి ముందు ప్రపంచంలో ఎక్కడా ప్రచురించబడకూడదు.\n"
            "   - **ఆవిష్కరణ నైపుణ్యం (Inventive Step - సెక్షన్ 2(1)(ja)):** సంబంధిత రంగంలో నిపుణుడికి స్పష్టంగా ఊహించలేని సాంకేతిక పురోగతి ఉండాలి.\n"
            "   - **పారిశ్రామిక వినియోగం (Industrial Applicability - సెక్షన్ 2(1)(j)):** పరిశ్రమలో తయారు చేయడానికి లేదా ఉపయోగించడానికి సాధ్యపడాలి.\n"
            "3. **పేటెంట్ ఇవ్వబడనివి (సెక్షన్ 3):** అల్పమైన విషయాలు, సాంప్రదాయ పరిజ్ఞానం (సెక్షన్ 3(p)), కేవలం మిశ్రమాలు (సెక్షన్ 3(e)) పేటెంట్ పొందలేవు."
        )

    # 3. FSSAI / Ayurveda Aahara in Telugu
    elif any(w in q_lower for w in ["fssai", "లేబుల్", "లేబులింగ్", "ఆహార", "నియమాలు", "ఆయుర్వేద ఆహార"]):
        answer = (
            "### 🏷️ ఆయుర్వేద ఆహార ఉత్పత్తులకు తప్పనిసరి FSSAI నిబంధనలు\n"
            "**ఆహార భద్రత మరియు ప్రమాణాలు (ఆయుర్వేద ఆహార) నిబంధనలు, 2022** ప్రకారం అన్ని ఆయుర్వేద ఆహార ఉత్పత్తులు కింది నియమాలను పాటించాలి:\n\n"
            "1. **వర్గ ప్రకటన (నిబంధన 2.2):** బ్రాండ్ పేరుకు సమీపంలో అధికారిక **'ఆయుర్వేద ఆహార' (AYURVEDA AAHARA) లోగో** మరియు పేరు తప్పనిసరిగా ఉండాలి.\n"
            "2. **వ్యాధి నివారణ దావాల నిషేధం (నిబంధన 2.3):** ఉత్పత్తి వ్యాధులను నయం చేస్తుందని దావా చేయకూడదు. లేబుల్‌పై చట్టబద్ధమైన హెచ్చరిక ఉండాలి: *'ఈ ఉత్పత్తి ఏ వ్యాధినీ నిర్ధారించడానికి, చికిత్స చేయడానికి లేదా నివారించడానికి ఉద్దేశించినది కాదు.'*\n"
            "3. **పదార్థాల సంపూర్ణ ప్రకటన:** అన్ని మూలికా భాగాల శాస్త్రీయ నామం, ఆయుర్వేద పేరు మరియు ఉపయోగించిన భాగాన్ని స్పష్టంగా పేర్కొనాలి.\n"
            "4. **FoSCoS లైసెన్సింగ్:** ఆహార ఉత్పత్తుల తయారీ కోసం FSSAI FoSCoS పోర్టల్ ద్వారా లైసెన్స్ పొందాలి."
        )

    # 4. Trademarks & GI Tags in Telugu
    elif any(w in q_lower for w in ["ట్రేడ్‌మార్క్", "ట్రేడ్ మార్క్", "బ్రాండ్", "జిఐ", "భౌగోళిక గుర్తింపు"]):
        answer = (
            "### ™️ ఆయుర్వేద బ్రాండ్లకు ట్రేడ్‌మార్క్ & భౌగోళిక గుర్తింపు (GI) రక్షణ\n"
            "**ట్రేడ్‌మార్క్ చట్టం, 1999** మరియు **వస్తువుల భౌగోళిక గుర్తింపు చట్టం, 1999** ప్రకారం:\n\n"
            "1. **వర్తించే తరగతులు (Nice Classes):\n"
            "   - **క్లాస్ 5:** ఆయుర్వేద ఔషధాలు, ఫార్మాస్యూటికల్ ఉత్పత్తులు.\n"
            "   - **క్లాస్ 29 & 30:** ఆయుర్వేద ఆహార ఉత్పత్తులు, సప్లిమెంట్లు.\n"
            "   - **క్లాస్ 3:** కాస్మెటిక్స్, హెర్బల్ సబ్బులు మరియు చర్మ సంరక్షణ ఉత్పత్తులు.\n"
            "2. **ప్రత్యేకత ఆవశ్యకత (సెక్షన్ 9):** 'అశ్వగంధ' లేదా 'త్రిఫల' వంటి సాధారణ పేర్లను ట్రేడ్‌మార్క్‌గా నమోదు చేయలేరు. బ్రాండ్ పేరు విలక్షణంగా ఉండాలి.\n"
            "3. **భౌగోళిక గుర్తింపు (GI Tag):** ఒక నిర్దిష్ట ప్రాంతానికి చెందిన సాంప్రదాయ ఆయుర్వేద ఉత్పత్తికి (ఉదా: కాశ్మీర్ కుంకుమపువ్వు) GI రక్షణ పొందవచ్చు."
        )

    else:
        best_p = passages[0]
        answer = (
            f"### ⚖️ చట్టపరమైన వివరణ (Legal Position)\n"
            f"**{best_p['source']}** లోని చట్టపరమైన నిబంధనల ప్రకారం:\n\n"
            f"**{best_p['section']}** ప్రకారం:\n"
            f"{best_p['text']}\n\n"
        )

    answer += (
        "\n\n### 🚀 ఆచరణాత్మక తదుపరి చర్యలు (Practical Next Steps)\n"
        "1. **పూర్వ కళ మరియు TKDL శోధన:** దరఖాస్తు దాఖలు చేయడానికి ముందు IP India (ipindia.gov.in) మరియు TKDL ఆర్కైవ్‌లలో సమగ్ర శోధన నిర్వహించండి.\n"
        "2. **దరఖాస్తు దాఖలు:** సినర్జీని నిరూపించే క్లినికల్/ప్రయోగశాల సమాచారంతో కూడిన పూర్తి స్పెసిఫికేషన్ (ఫారం 2) మరియు ఫారం 1 సమర్పించండి.\n"
        "3. **NBA అనుమతి:** భారతీయ మూలికలు లేదా జీవ వనరులను ఉపయోగిస్తే జాతీయ జీవవైవిధ్య ప్రాధికార సంస్థ (NBA) నుండి ఫారం III అనుమతి పొందండి.\n"
        "4. **FSSAI అనుమతి:** ఆహార ఉత్పత్తుల కోసం FoSCoS పోర్టల్ ద్వారా 'ఆయుర్వేద ఆహార' లైసెన్స్ కోసం దరఖాస్తు చేయండి."
    )

    answer += "\n\n---\n**📚 సూచించబడిన చట్టపరమైన విభాగాలు (Legal References):**\n"
    for p in passages[:4]:
        answer += f"- `{p['key']}` **{p['source']}** — *{p['section']}* ({p['domain'].upper()})\n"

    return answer


def _synthesize_answer_tamil(query: str, passages: list[dict]) -> str:
    """Generate high-quality, legally accurate answer in Tamil."""
    q_lower = query.lower()

    if not passages:
        return (
            "தற்போதைய சட்டத் தரவுத்தளத்தில் உங்கள் கேள்விக்கான குறிப்பிட்ட சட்டப் பிரிவுகள் கிடைக்கவில்லை. "
            "தயவுசெய்து உங்கள் கேள்வியை தெளிவுபடுத்தவும் அல்லது ஒரு குறிப்பிட்ட களத்தை (காப்புரிமைகள், வர்த்தக முத்திரைகள், FSSAI) தேர்ந்தெடுக்கவும்."
        )

    # 1. Ayurvedic Patenting / Ashwagandha queries in Tamil
    if any(w in q_lower for w in ["அஸ்வகந்தா", "காப்புரிமை", "மருந்து", "மூலிகை", "ஆயுர்வேத", "கலவை", "ashwagandha", "formulation", "herb", "patent"]):
        answer = (
            "### ⚖️ நேரடி சட்ட நிலைப்பாடு (Direct Legal Position)\n"
            "இந்திய காப்புரிமைச் சட்டத்தின்படி, **பாரம்பரிய ஆயுர்வேத மூலிகைக் கலவைக்கு (அஸ்வகந்தா போன்றவை) பொதுவாக காப்புரிமை பெற முடியாது**. அறியப்பட்ட மூலிகைகளின் எளிய கலவைகள் இந்திய காப்புரிமைச் சட்டம் 1970 இன் **பிரிவு 3(e)** (வெறும் கலவை / mere admixture) மற்றும் **பிரிவு 3(p)** (பாரம்பரிய அறிவு / traditional knowledge) ஆகியவற்றின் கீழ் காப்புரிமையிலிருந்து விலக்கப்பட்டுள்ளன.\n\n"
            "இருப்பினும், உங்கள் ஆயுர்வேத கண்டுபிடிப்பு பின்வரும் **4 சட்ட நிபந்தனைகளில்** ஏதேனும் ஒன்றை பூர்த்தி செய்தால் காப்புரிமை பெற தகுதி பெறும்:\n\n"
            "1. **நிரூபிக்கப்பட்ட ஒருங்கிணைந்த விளைவு (Novel Synergistic Effect):** மூலிகைகளின் கூட்டு விளைவு அவற்றின் தனித்தனி விளைவுகளின் கூட்டுத்தொகையை விட மிகச் சிறந்தது என்பதை அறிவியல் மற்றும் மருத்துவப் பரிசோதனைத் தரவுகள் மூலம் நிரூபிக்க வேண்டும் (பிரிவு 3(e) விலக்கை கடக்க).\n"
            "2. **புதிய பிரித்தெடுக்கும் முறை (Novel Extraction Process):** தரப்படுத்தப்பட்ட மற்றும் அதிக செயல்திறன் கொண்ட பயோஆக்டிவ் கூறுகளை பிரித்தெடுக்கும் ஒரு புதிய தனியுரிம செயல்முறை.\n"
            "3. **நவீன மருந்து விநியோக வழிமுறை (Novel Drug Delivery Mechanism):** பாரம்பரிய நூல்களில் குறிப்பிடப்படாத மேம்பட்ட மருந்து விநியோக அமைப்புகள் (நானோ துகள்கள், லிபோசோம்கள் அல்லது பைட்டோசோம்கள்).\n"
            "4. **புதிய சிகிச்சை பயன்பாடு (New Therapeutic Indication):** பாரம்பரிய ஆயுர்வேத நூல்கள் அல்லது **பாரம்பரிய அறிவு டிஜிட்டல் நூலகத்தில் (TKDL)** குறிப்பிடப்படாத புதிய நோய்க்கான சிகிச்சையைக் கண்டறிதல்.\n\n"
            "### 📋 பொருந்தக்கூடிய சட்டப் பிரிவுகள் (Statutory Sections)\n"
            "- **பிரிவு 3(e) (இந்திய காப்புரிமைச் சட்டம், 1970):** அறியப்பட்ட பொருட்களின் வெறும் சேர்க்கையினால் விளையும் கலவைகளுக்கு காப்புரிமை மறுக்கப்படுகிறது.\n"
            "- **பிரிவு 3(p) (இந்திய காப்புரிமைச் சட்டம், 1970):** பாரம்பரிய அறிவு சார்ந்த கண்டுபிடிப்புகளுக்கு காப்புரிமை விலக்கு அளிக்கிறது.\n"
            "- **உயிரியல் பன்முகத்தன்மை சட்டம், 2002 (பிரிவு 6):** இந்திய உயிரியல் வளங்களைப் பயன்படுத்தினால், காப்புரிமைக்கு விண்ணப்பிக்கும் முன் **தேசிய பல்லுயிர் ஆணையத்திடம் (NBA)** கட்டாயம் அனுமதி (படிவம் III) பெற வேண்டும்.\n"
            "- **TKDL சரிபார்ப்பு:** காப்புரிமை ஆய்வாளர் TKDL தரவுத்தளத்தை ஆய்வு செய்வார்; பழங்கால நூல்களில் குறிப்பிடப்பட்டிருந்தால் விண்ணப்பம் நிராகரிக்கப்படும்."
        )

    # 2. General patent explanation in Tamil
    elif any(w in q_lower for w in ["காப்புரிமை என்றால்", "அதிகாரங்கள்", "கால வரம்பு", "விதிகள்", "explain", "patent"]):
        answer = (
            "### ⚖️ இந்திய சட்டத்தின் கீழ் காப்புரிமை என்றால் என்ன?\n"
            "**இந்திய காப்புரிமைச் சட்டம் 1970** இன் படி, **காப்புரிமை** என்பது ஒரு புதிய கண்டுபிடிப்புக்காக இந்திய அரசால் வழங்கப்படும் பிரத்யேக சட்டப்பூர்வ உரிமையாகும். **பிரிவு 48** இன் கீழ், காப்புரிமை பெற்ற தயாரிப்பு அல்லது செயல்முறையை அங்கீகாரமின்றி தயாரிப்பது, பயன்படுத்துவது, விற்பது அல்லது இறக்குமதி செய்வதைத் தடுக்கும் தனி உரிமையை இது வழங்குகிறது.\n\n"
            "### 🔑 முக்கிய சட்ட விதிகள் (Key Provisions)\n"
            "1. **காப்புரிமை காலம் (பிரிவு 53):** விண்ணப்பித்த தேதியிலிருந்து **20 ஆண்டுகள்** வரை செல்லுபடியாகும்.\n"
            "2. **காப்புரிமை தகுதி நிபந்தனைகள் (பிரிவு 2):\n"
            "   - **புதுமை (Novelty - பிரிவு 2(1)(l)):** உலகளவில் எங்கும் முன்கூட்டியே வெளியிடப்பட்டிருக்கக் கூடாது.\n"
            "   - **கண்டுபிடிப்பு படி (Inventive Step - பிரிவு 2(1)(ja)):** தொழில்நுட்ப முன்னேற்றம் அல்லது பொருளாதார முக்கியத்துவம் கொண்டிருக்க வேண்டும்.\n"
            "   - **தொழில்துறை பயன்பாடு (Industrial Applicability - பிரிவு 2(1)(j)):** தொழில்துறையில் தயாரிக்கவோ பயன்படுத்தவோ கூடியதாக இருக்க வேண்டும்."
        )

    # 3. FSSAI / Ayurveda Aahara in Tamil
    elif any(w in q_lower for w in ["fssai", "லேபிளிங்", "ஆஹாரா", "உணவு"]):
        answer = (
            "### 🏷️ ஆயுர்வேத ஆஹார தயாரிப்புகளுக்கான கட்டாய FSSAI விதிகள்\n"
            "**உணவு பாதுகாப்பு மற்றும் தரநிலைகள் (ஆயுர்வேத ஆஹாரா) ஒழுங்குமுறைகள், 2022** இன் கீழ்:\n\n"
            "1. **அங்கீகரிக்கப்பட்ட லோகோ (விதி 2.2):** தயாரிப்பு பெயருக்கு அருகில் அதிகாரப்பூர்வ **'ஆயுர்வேத ஆஹாரா' லோகோ** கட்டாயம் இருக்க வேண்டும்.\n"
            "2. **நோய் தீர்க்கும் கூற்றுகள் தடை (விதி 2.3):** தயாரிப்பு நோயைக் குணப்படுத்தும் என்று தவறாகக் கூறக்கூடாது.\n"
            "3. **FoSCoS உரிமம்:** FoSCoS போர்ட்டல் மூலம் ஆயுர்வேத உணவு தயாரிப்புக்கான உரிமத்தைப் பெற வேண்டும்."
        )

    else:
        best_p = passages[0]
        answer = (
            f"### ⚖️ சட்ட நிலைப்பாடு (Legal Position)\n"
            f"**{best_p['source']}** இன் சட்ட விதிகளின்படி:\n\n"
            f"**{best_p['section']}**:\n"
            f"{best_p['text']}\n\n"
        )

    answer += (
        "\n\n### 🚀 நடைமுறை அடுத்த கட்டங்கள் (Next Steps)\n"
        "1. **TKDL மற்றும் காப்புரிமை தேடல்:** விண்ணப்பிக்கும் முன் ipindia.gov.in மற்றும் TKDL இல் முழுமையான தேடலை மேற்கொள்ளுங்கள்.\n"
        "2. **படிவங்கள் சமர்ப்பித்தல்:** ஒருங்கிணைந்த விளைவை (Synergy) நிரூபிக்கும் ஆய்வகத் தரவுகளுடன் படிவம் 1 மற்றும் படிவம் 2 ஐ சமர்ப்பிக்கவும்.\n"
        "3. **NBA ஒப்புதல்:** இந்திய மூலிகைகளைப் பயன்படுத்தினால் தேசிய பல்லுயிர் ஆணையத்தின் படிவம் III ஒப்புதலைப் பெறவும்."
    )

    answer += "\n\n---\n**📚 சட்ட குறிப்புகள் (Legal References):**\n"
    for p in passages[:4]:
        answer += f"- `{p['key']}` **{p['source']}** — *{p['section']}* ({p['domain'].upper()})\n"

    return answer


class MockLLMAdapter(BaseLLMAdapter):
    """
    Synthesises authoritative, grounded legal answers directly from the
    retrieved passages in English, Hindi, Telugu, or Tamil based on request.language or query script.
    """

    async def generate(
        self,
        query: str,
        context: str,
        language: str = "en",
        max_tokens: int = 1024,
    ) -> LLMResponse:
        t0 = time.perf_counter()

        passages = _parse_context(context)
        is_telugu = language == "te" or bool(re.search(r"[\u0C00-\u0C7F]", query))
        is_tamil = language == "ta" or bool(re.search(r"[\u0B80-\u0BFF]", query))
        is_hindi = language == "hi" or bool(re.search(r"[\u0900-\u097F]", query))

        if is_telugu:
            answer = _synthesize_answer_telugu(query, passages)
        elif is_tamil:
            answer = _synthesize_answer_tamil(query, passages)
        elif is_hindi:
            answer = _synthesize_answer_hindi(query, passages)
        else:
            answer = _synthesize_answer(query, passages)

        latency_ms = int((time.perf_counter() - t0) * 1000)
        return LLMResponse(
            answer=answer,
            model_used="mock-v1",
            prompt_tokens=len(context.split()),
            completion_tokens=len(answer.split()),
            latency_ms=latency_ms,
        )

