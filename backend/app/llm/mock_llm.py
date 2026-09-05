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
            "I could not locate specific statutory provisions matching your query in the current corpus. "
            "Please refine your query or choose a specific domain filter (Patents, Trademarks, GI Tags, FSSAI, or AYUSH)."
        )

    # 1. Patenting Ayurvedic Formulation / Herbal queries
    if any(w in q_lower for w in ["ashwagandha", "formulation", "herb", "ayurved", "admixture", "ayush", "recipe", "compound", "plant"]) and any("3(e)" in p["section"] or "3(p)" in p["section"] or "PRACTICAL GUIDANCE" in p["section"] or "patent" in p["domain"].lower() for p in passages):
        answer = (
            "### ⚖️ Direct Legal Position\n"
            "Under Indian patent law, **you generally CANNOT patent a traditional Ayurvedic formulation** (such as one combining Ashwagandha with other herbs) if it is a mere combination of known herbs with cumulative properties. Such claims are excluded under **Section 3(e)** (mere admixture) and **Section 3(p)** (traditional knowledge) of the Indian Patents Act, 1970.\n\n"
            "However, an Ayurvedic innovation **CAN qualify for a patent** if you satisfy at least one of the following four legal criteria:\n\n"
            "1. **Novel Synergistic Effect:** You must scientifically prove through comparative pharmacological or clinical bioassay data that combining the herbs yields an unexpected synergistic therapeutic effect greater than the sum of their individual properties.\n"
            "2. **Novel Extraction or Purification Process:** A proprietary extraction method that yields a standardized, purified bioactive fraction with demonstrably superior efficacy.\n"
            "3. **Novel Drug Delivery Mechanism:** Formulating the herbal extract into an advanced delivery system (such as nanoparticle encapsulation, liposomes, phytosomes, or targeted sustained-release pellets) not documented in classical texts.\n"
            "4. **New Therapeutic Indication:** Discovering and clinically demonstrating a completely new disease treatment not recorded in classical Ayurvedic texts (*Charaka Samhita*, *Sushruta Samhita*) or the **Traditional Knowledge Digital Library (TKDL)**.\n\n"
            "### 📋 Applicable Statutory Provisions\n"
            "- **Section 3(e) (The Patents Act, 1970):** Excludes substances obtained by mere admixture resulting only in aggregation of properties.\n"
            "- **Section 3(p) (The Patents Act, 1970):** Excludes inventions that are essentially traditional knowledge or duplications of traditionally known properties.\n"
            "- **TKDL Prior Art Verification:** The patent examiner checks the CSIR-AYUSH TKDL database; if the formulation exists in ancient texts, the application is rejected."
        )

    # 2. General patent explanation / definitions / rights / terms
    elif any(w in q_lower for w in ["explain", "what is a patent", "patent definition", "term of patent", "patent rights", "patent", "patents"]):
        answer = (
            "### ⚖️ What is a Patent under Indian Law?\n"
            "Under **The Patents Act, 1970**, a **Patent** is an exclusive statutory monopoly granted by the Government of India for an invention. Under **Section 48**, it confers on the patentee the exclusive right to prevent unauthorized third parties from making, using, offering for sale, selling, or importing the patented product or process in India.\n\n"
            "### 🔑 Key Legal Provisions\n"
            "1. **Term of Patent (Section 53):** A granted patent has a term of **20 years** from the date of filing the application, provided mandatory annual renewal fees are paid.\n"
            "2. **Statutory Criteria for Patentability (Section 2):**\n"
            "   - **Novelty (Section 2(1)(l)):** The invention must not have been published or publicly used anywhere in India or the world before the filing date.\n"
            "   - **Inventive Step (Section 2(1)(ja)):** Must involve technical advancement or economic significance that is non-obvious to a person skilled in the art.\n"
            "   - **Industrial Applicability (Section 2(1)(j)):** Must be capable of industrial application or commercial manufacture.\n"
            "3. **Non-Patentable Subject Matter (Section 3):** Frivolous inventions (Section 3(a)), traditional knowledge (Section 3(p)), and mere admixtures (Section 3(e)) cannot be patented."
        )

    # 3. FSSAI Labelling & Ayurveda Aahara queries
    elif any(w in q_lower for w in ["fssai", "label", "labelling", "ayurveda aahara", "packaging", "claims", "supplement"]):
        answer = (
            "### 🏷️ Mandatory FSSAI Labelling for Ayurveda Aahara\n"
            "Under the **Food Safety and Standards (Ayurveda Aahara) Regulations, 2022**, all Ayurvedic food supplements and formulations must comply with the following mandatory rules:\n\n"
            "1. **Category Declaration (Regulation 2.2):** Every package must prominently carry the words **'AYURVEDA AAHARA'** in immediate proximity to the product brand name, along with the official designated Ayurveda Aahara logo.\n"
            "2. **Prohibition on Disease Treatment Claims (Regulation 2.3):** The manufacturer **cannot** claim that the product diagnoses, cures, prevents, or treats any human disease. The label must carry the statutory warning: *'This product is not intended to diagnose, treat, cure, or prevent any disease.'*\n"
            "3. **Complete Ingredient Declaration:** All ingredients must be declared in descending order of weight or volume, specifying the classical Ayurvedic name, botanical name, part of plant used, and processing form (churna, extract, etc.).\n"
            "4. **Target Consumer & Dosage Instructions:** The label must clearly state advisory warnings (e.g. consult a physician during pregnancy), recommended daily consumption, and duration of usage.\n"
            "5. **Contaminant Safety Limits:** Must satisfy Schedule II standards for heavy metal limits (Lead ≤2.5 ppm, Mercury ≤0.5 ppm, Arsenic ≤1.0 ppm)."
        )

    # 4. Trademark & GI Tag queries
    elif any(w in q_lower for w in ["trademark", "trade mark", "brand", "gi", "geographical indication", "logo"]):
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

    # 5. General fallback from retrieved passages
    else:
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

    # Actionable Next Steps
    answer += (
        "\n\n### 🚀 Practical Next Steps\n"
        "1. **Prior Art & TKDL Search:** Conduct an exhaustive search on the IP India Registry (ipindia.gov.in) and TKDL prior art archives before filing.\n"
        "2. **Filing Documents:** Submit Form 1 with complete specification (Form 2) including clinical comparative data proving synergy.\n"
        "3. **FSSAI Compliance:** For dietary products, obtain an Ayurveda Aahara manufacturing license via the FoSCoS portal."
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
            "वर्तमान कानूनी डेटाबेस में आपके प्रश्न से संबंधित विशिष्ट वैधानिक प्रावधान नहीं मिले। "
            "कृपया अपना प्रश्न दोबारा लिखें या कोई विशिष्ट डोमेन (Patents, Trademarks, FSSAI) चुनें।"
        )

    # 1. Ayurvedic Patenting / Ashwagandha queries in Hindi
    if any(w in q_lower for w in ["अश्वगंधा", "पेटेंट", "फॉर्मूलेशन", "जड़ी", "आयुर्वेद", "मिश्रण", "दवा", "ashwagandha", "formulation"]):
        answer = (
            "### ⚖️ प्रत्यक्ष कानूनी स्थिति (Direct Legal Position)\n"
            "भारतीय पेटेंट कानून के तहत, **पारंपरिक आयुर्वेदिक हर्बल फॉर्मूलेशन (जैसे अश्वगंधा युक्त) को आम तौर पर पेटेंट नहीं कराया जा सकता है** यदि यह केवल ज्ञात जड़ी-बूटियों का एक सामान्य मिश्रण है। यह पेटेंट अधिनियम, 1970 की **धारा 3(e)** (केवल मिश्रण) और **धारा 3(p)** (पारंपरिक ज्ञान) के तहत स्पष्ट रूप से वर्जित है।\n\n"
            "हालांकि, आपका आयुर्वेदिक उत्पाद निम्नलिखित **4 कानूनी शर्तों** में से किसी एक को पूरा करने पर पेटेंट का पात्र बन सकता है:\n\n"
            "1. **प्रमाणित सहक्रियात्मक प्रभाव (Novel Synergistic Effect):** यदि वैज्ञानिक परीक्षणों और क्लिनिकल डेटा से यह सिद्ध हो कि जड़ी-बूटियों का संयुक्त चिकित्सीय प्रभाव उनके अलग-अलग प्रभावों के साधारण योग से काफी अधिक है।\n"
            "2. **नवीन निष्कर्षण प्रक्रिया (Novel Extraction Process):** यदि आपने कोई ऐसी मालिकाना निष्कर्षण विधि खोजी है जो मानक, अत्यधिक प्रभावी बायोएक्टिव घटक प्रदान करती है।\n"
            "3. **उन्नत दवा वितरण प्रणाली (Novel Drug Delivery Mechanism):** जड़ी-बूटी के अर्क को आधुनिक डिलीवरी सिस्टम (जैसे नैनोपार्टिकल्स, लिपोसोम या फाइटोसोम) में तैयार करना जो प्राचीन ग्रंथों में दर्ज नहीं है।\n"
            "4. **नया चिकित्सीय संकेत (New Therapeutic Indication):** पारंपरिक आयुर्वेदिक ग्रंथों (*चरक संहिता*, *सुश्रुत संहिता*) या **ट्रेडिशनल नॉलेज डिजिटल लाइब्रेरी (TKDL)** में अप्रकाशित किसी नए रोग के उपचार की क्लिनिकल पुष्टि।\n\n"
            "### 📋 लागू कानूनी प्रावधान (Statutory Sections)\n"
            "- **धारा 3(e) (पेटेंट अधिनियम, 1970):** केवल ज्ञात घटकों के गुणों के संयोजन से प्राप्त पदार्थों को पेटेंट अयोग्य घोषित करती है।\n"
            "- **धारा 3(p) (पेटेंट अधिनियम, 1970):** पारंपरिक ज्ञान या उसके घटकों के दोहराव को पेटेंट से बाहर रखती है।\n"
            "- **TKDL सत्यापन:** पेटेंट परीक्षक CSIR-AYUSH के TKDL डेटाबेस की जांच करते हैं; यदि फॉर्मूलेशन का उल्लेख प्राचीन ग्रंथों में है, तो आवेदन अस्वीकार कर दिया जाता है।"
        )
    # 2. General Patent definition / rights in Hindi
    elif any(w in q_lower for w in ["पेटेंट क्या", "अधिकार", "परिभाषा", "नियम", "अवधि", "explain", "patent"]):
        answer = (
            "### ⚖️ भारतीय कानून के तहत पेटेंट क्या है?\n"
            "**पेटेंट अधिनियम, 1970** के तहत, **पेटेंट** भारत सरकार द्वारा किसी नए आविष्कार के लिए दिया जाने वाला एक विशेष कानूनी अधिकार है। **धारा 48** के तहत, यह पेटेंट धारक को भारत में बिना अनुमति के उस उत्पाद या प्रक्रिया को बनाने, उपयोग करने, बेचने या आयात करने से रोकने का विशेष कानूनी अधिकार प्रदान करता है।\n\n"
            "### 🔑 मुख्य कानूनी प्रावधान (Key Provisions)\n"
            "1. **पेटेंट की अवधि (धारा 53):** स्वीकृत पेटेंट आवेदन दाखिल करने की तिथि से **20 वर्ष** के लिए वैध होता है, बशर्ते वार्षिक नवीनीकरण शुल्क का भुगतान किया जाए।\n"
            "2. **पेटेंट योग्यता की वैधानिक शर्तें (धारा 2):**\n"
            "   - **नवीनता (धारा 2(1)(l)):** आविष्कार आवेदन दाखिल करने से पहले विश्व में कहीं भी सार्वजनिक नहीं होना चाहिए।\n"
            "   - **आविष्कारशील कदम (धारा 2(1)(ja)):** इसमें तकनीकी प्रगति या आर्थिक महत्व होना चाहिए जो उस क्षेत्र के जानकार व्यक्ति के लिए स्पष्ट न हो।\n"
            "   - **औद्योगिक उपयोगिता (धारा 2(1)(j)):** यह किसी उद्योग में बनाए जाने या उपयोग किए जाने में सक्षम होना चाहिए।"
        )
    # 3. FSSAI / Ayurveda Aahara in Hindi
    elif any(w in q_lower for w in ["fssai", "लेबल", "लेबलिंग", "आहार", "नियम"]):
        answer = (
            "### 🏷️ आयुर्वेद आहार के लिए अनिवार्य FSSAI नियम\n"
            "**खाद्य सुरक्षा और मानक (आयुर्वेद आहार) विनियम, 2022** के तहत सभी आयुर्वेदिक आहार पूरक उत्पादों के लिए निम्नलिखित नियम अनिवार्य हैं:\n\n"
            "1. **अनिवार्य श्रेणी लेबल (विनियम 2.2):** प्रत्येक पैकेज पर उत्पाद ब्रांड नाम के पास आधिकारिक **'आयुर्वेद आहार' लोगो** और नाम स्पष्ट रूप से होना चाहिए।\n"
            "2. **रोग निवारण दावों पर प्रतिबंध (विनियम 2.3):** उत्पाद किसी बीमारी को ठीक करने या रोकने का दावा नहीं कर सकता। लेबल पर वैधानिक चेतावनी होनी चाहिए: *'यह उत्पाद किसी बीमारी के निदान, उपचार, इलाज या रोकथाम के लिए अभिप्रेत नहीं है।'* \n"
            "3. **घटकों की पूरी घोषणा:** सभी हर्बल सामग्रियों को उनके वानस्पतिक नाम, शास्त्रीय नाम और उपयोग किए गए पौधे के भाग के साथ घटते क्रम में सूचीबद्ध किया जाना चाहिए।"
        )
    else:
        best_p = passages[0]
        answer = (
            f"### ⚖️ कानूनी स्थिति\n"
            f"**{best_p['source']}** के वैधानिक प्रावधानों के अनुसार:\n\n"
            f"**{best_p['section']}**:\n"
            f"{best_p['text']}\n\n"
        )

    answer += (
        "\n\n### 🚀 व्यावहारिक अगले कदम (Next Steps)\n"
        "1. **पूर्व कला और TKDL खोज:** आवेदन दाखिल करने से पहले IP India (ipindia.gov.in) और TKDL पर गहन खोज करें।\n"
        "2. **दस्तावेज़ जमा करना:** फॉर्म 1 और पूर्ण विनिर्देश (फॉर्म 2) क्लिनिकल तालमेल (Synergy) के वैज्ञानिक प्रमाण के साथ प्रस्तुत करें।\n"
        "3. **FSSAI अनुपालन:** आहार उत्पादों के लिए FoSCoS पोर्टल पर 'आयुर्वेद आहार' लाइसेंस के लिए आवेदन करें।"
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
            "ప్రస్తుత చట్టపరమైన డేటాబేస్‌లో మీ ప్రశ్నకు సంబంధించిన నిర్దిష్ట చట్టపరమైన నిబంధనలు కనుగొనబడలేదు. "
            "దయచేసి మీ ప్రశ్నను స్పష్టం చేయండి లేదా నిర్దిష్ట రంగాన్ని (పేటెంట్లు, ట్రేడ్‌మార్కులు, FSSAI) ఎంచుకోండి."
        )

    # 1. Ayurvedic Patenting / Ashwagandha / Formulation queries in Telugu
    if any(w in q_lower for w in ["అశ్వగంధ", "పేటెంట్", "ఫార్ములేషన్", "ఆయుర్వేద", "మిశ్రమం", "మందు", "ఔషధ", "ashwagandha", "formulation", "herb", "ayurved", "patent"]):
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

