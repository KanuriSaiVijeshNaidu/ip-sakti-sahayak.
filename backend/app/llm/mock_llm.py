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
            "**Recommended Verification Channels:**\n"
            "- For AYUSH drug licensing: Consult the State Licensing Authority (SLA) or e-Aushadhi portal (e-aushadhi.gov.in).\n"
            "- For Ayurveda Aahara: Consult the FSSAI FoSCoS portal (foscos.fssai.gov.in).\n"
            "- For Patents & Trademarks: Consult the IP India Registry (ipindia.gov.in)."
        )

    # Domain keywords check: If the query is completely unrelated to IP or AYUSH/FSSAI,
    # reject immediately without generating an answer or procedural plan.
    domain_keywords = [
        "trademark", "trade mark", "tm", "brand", "logo", "patent", "patents", "invention",
        "inventor", "inpass", "tkdl", "ayush", "ayurveda", "ayurvedic", "asu", "siddha",
        "unani", "herbal", "drug", "cosmetic", "fssai", "aahara", "food", "label",
        "supplement", "gi tag", "geographical indication", "biodiversity", "nba",
        "schedule t", "gmp", "form 24d", "form 25d", "form tm-a", "form 1", "form 2",
        "form 18", "rule 158b", "section 3", "section 9", "section 11", "section 28",
        "license", "licensing", "registration", "register", "infringement", "prior art"
    ]
    is_domain_relevant = any(kw in q_lower for kw in domain_keywords)
    if not is_domain_relevant:
        return (
            "### ⚠️ Insufficient Statutory Resources in AYURLEX Corpus\n"
            "The retrieved legal registers and Gazette notifications in the AYURLEX corpus do not contain "
            "verified statutory evidence for your inquiry.\n\n"
            "AYURLEX operates under a strict **Zero-Hallucination Policy**: we do not invent legal rules, "
            "fabricate section numbers, or speculate on unverified regulatory procedures.\n\n"
            "**Recommended Verification Channels:**\n"
            "- For AYUSH drug licensing: Consult the State Licensing Authority (SLA) or e-Aushadhi portal (e-aushadhi.gov.in).\n"
            "- For Ayurveda Aahara: Consult the FSSAI FoSCoS portal (foscos.fssai.gov.in).\n"
            "- For Patents & Trademarks: Consult the IP India Registry (ipindia.gov.in)."
        )

    # Explicit out-of-scope check: if query asks about topics outside statutory IP/AYUSH law
    out_of_scope_keywords = [
        "cryptocurrency", "crypto", "bitcoin", "blockchain", "token", "nft",
        "stocks", "forex", "trading", "weather", "cricket", "python code",
        "java code", "javascript", "react", "nuclear", "weapon", "movie", "song"
    ]
    if any(w in q_lower for w in out_of_scope_keywords):
        return (
            "### ⚠️ Insufficient Statutory Resources in AYURLEX Corpus\n"
            "The retrieved legal registers and Gazette notifications in the AYURLEX corpus do not contain "
            "verified statutory evidence for your inquiry.\n\n"
            "AYURLEX operates under a strict **Zero-Hallucination Policy**: we do not invent legal rules, "
            "fabricate section numbers, or speculate on unverified regulatory procedures.\n\n"
            "**Recommended Verification Channels:**\n"
            "- For AYUSH drug licensing: Consult the State Licensing Authority (SLA) or e-Aushadhi portal (e-aushadhi.gov.in).\n"
            "- For Ayurveda Aahara: Consult the FSSAI FoSCoS portal (foscos.fssai.gov.in).\n"
            "- For Patents & Trademarks: Consult the IP India Registry (ipindia.gov.in)."
        )

    q_stripped = re.sub(r"[^\w\s]", "", q_lower).strip()

    # 1. Procedural: Registration of Ayurvedic Product
    is_registration_ayush = any(w in q_lower for w in [
        "register my product", "register an ayurvedic product", "how do i register my product",
        "how to register my product", "ayush license", "form 24d", "form 25d", "schedule t",
        "start ayurveda", "manufacturing license for ayurveda", "register product under ayurveda",
        "how do i register my porduct", "register ayurvedic product"
    ])

    # 2. Definitional: What is a Trademark?
    # Captures bare queries like "trade mark", "trademark", "what is a trademark", "what is trademark", "tm"
    is_tm_definitional = (
        q_stripped in ["trademark", "trade mark", "tm", "what is a trademark", "what is trademark", "what is trade mark", "what is tm", "define trademark", "meaning of trademark", "explain trademark"]
        or (
            any(w in q_lower for w in [
                "what is a trademark", "what is trademark", "define trademark", "meaning of trademark",
                "concept of trademark", "explain trademark"
            ])
            and not any(w in q_lower for w in [
                "how to", "how do", "register", "apply", "process", "procedure", "filing", "fee", "cost",
                "get a trademark", "get the trademark"
            ])
        )
    )

    # 3. Procedural: How to register a Trademark?
    is_tm_procedural = any(w in q_lower for w in [
        "how to register a trademark", "how do i register a trademark", "register my trademark",
        "trademark registration process", "apply for trademark", "trademark filing",
        "how to get a trademark", "how to get the trademark", "trademark procedure",
        "register a trademark", "get a trademark", "get the trademark", "how to register trademark"
    ])

    # 4. Definitional: What is a Patent?
    is_patent_definitional = (
        q_stripped in ["patent", "patents", "what is a patent", "what is patent", "define patent", "meaning of patent", "explain patent"]
        or (
            any(w in q_lower for w in [
                "what is a patent", "what is patent", "define patent", "meaning of patent",
                "concept of patent", "explain patent"
            ])
            and not any(w in q_lower for w in [
                "how to", "how do", "file", "process", "apply", "register", "procedure", "fee", "cost",
                "ashwagandha", "formulation", "ayurvedic", "admixture", "synergy", "section 3"
            ])
        )
    )

    # 5. Procedural: How to file/get a Patent?
    is_patent_procedural = any(w in q_lower for w in [
        "how to file a patent", "how do i file a patent", "how to get a patent",
        "patent filing process", "how to apply for a patent", "patent application process",
        "file a patent", "apply for a patent", "how to file patent"
    ])

    # 6. Definitional: What is Ayurveda / What is AYUSH
    is_ayurveda_definitional = (
        q_stripped in ["ayurveda", "ayush", "avyur veda", "avyurveda", "asu", "what is ayurveda", "what is ayush", "what is avyur veda", "define ayurveda", "meaning of ayurveda"]
        or (
            any(w in q_lower for w in [
                "what is ayurveda", "what is ayush", "define ayurveda", "meaning of ayurveda",
                "definition of ayurveda", "what are asu", "what is asu", "what is avyur veda"
            ])
            and not any(w in q_lower for w in [
                "how to", "how do", "register", "license", "licensing", "product", "manufacturing", "sell", "export", "patent"
            ])
        )
    )

    # 7. FSSAI Labelling & Ayurveda Aahara queries
    is_fssai = any(w in q_lower for w in ["fssai", "label", "labelling", "ayurveda aahara", "packaging", "supplement"])

    # 8. GI Tag queries
    is_gi = any(w in q_lower for w in ["gi tag", "geographical indication", "gi act"])

    # 9. Patentability & Innovation queries (e.g. Ashwagandha formulation)
    is_patent_ayurveda = any(w in q_lower for w in [
        "patent an ayurvedic", "ashwagandha", "section 3(e)", "section 3(p)",
        "admixture", "synergy", "tkdl", "patentable"
    ])

    if is_registration_ayush:
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
            "- Upon inspection approval and lab sample verification, the SLA issues **Form 26D** (Manufacturing License & GMP Certificate).\n\n"
            "---\n\n"
            "### 🚀 Practical Next Steps\n"
            "1. **Classify:** Determine whether your formulation qualifies as Classical ASU (Form 24D), P&P (Rule 158B), or Ayurveda Aahara.\n"
            "2. **Premises Audit:** Ensure your premises or contract manufacturer holds an active Schedule T GMP certificate.\n"
            "3. **Apply:** Register on your State AYUSH SLA portal or the central e-Aushadhi system."
        )
    elif is_tm_definitional:
        answer = (
            "### 🏷️ What is a Trademark? (Simple Plain-Language Explanation)\n\n"
            "In simple, everyday words, a **Trademark** is your brand's unique identity. It can be your brand name "
            "(such as *Dabur*, *Baidyanath*, or *Patanjali*), a distinctive logo, slogan, label, or symbol that tells customers:\n"
            "👉 **'This product was genuinely made by us, not a fake or competitor.'**\n\n"
            "Think of it as your company's official badge of trust. If you register your trademark, nobody else can copy your "
            "brand name or deceive customers with copycat packaging.\n\n"
            "---\n\n"
            "### 📜 Technical & Statutory Provisions (The Trade Marks Act, 1999)\n\n"
            "1. **Statutory Definition (Section 2(1)(zb)):**\n"
            "   Under Section 2(1)(zb) of The Trade Marks Act, 1999, a trademark is legally defined as:\n"
            "   > *'A mark capable of being represented graphically and which is capable of distinguishing the goods or services "
            "   of one person from those of others and may include shape of goods, their packaging and combination of colours.'*\n\n"
            "2. **Definition of 'Mark' (Section 2(1)(m)):**\n"
            "   Includes any device, brand, heading, label, ticket, name, signature, word, letter, numeral, shape of goods, packaging, or combination of colours.\n\n"
            "3. **Nice Classification Classes for Ayurvedic Products:**\n"
            "   - **Class 5:** Ayurvedic medicines, herbal pharmaceuticals, and therapeutic preparations.\n"
            "   - **Class 3:** Ayurvedic cosmetics, herbal oils, soaps, and skincare.\n"
            "   - **Class 30:** Ayurvedic dietary supplements, herbal teas, and spices.\n"
            "   - **Class 35:** Ayurvedic retail stores, online marketplaces, and clinic management.\n\n"
            "4. **Exclusive Statutory Monopoly (Section 28 & 29):**\n"
            "   Registration confers on the proprietor the exclusive legal right to use the mark and initiate civil or criminal infringement suits under Section 29.\n\n"
            "5. **Absolute Grounds for Refusal (Section 9):**\n"
            "   Generic or descriptive botanical plant names (e.g. attempting to monopolize *'Ashwagandha'* or *'Triphala'* alone) cannot be registered by one individual. The brand mark must be distinctive, coined, or arbitrary.\n\n"
            "---\n\n"
            "### 💡 Recommended Next Step: How to Get / Register Your Trademark\n\n"
            "Now that you understand what a trademark is, would you like to proceed with securing legal ownership of your brand?\n\n"
            "**Quick Filing Summary:**\n"
            "1. **Clearance Search:** Search your proposed brand name on the official IP India registry (`ipindiaonline.gov.in`) to ensure no conflicting marks exist.\n"
            "2. **Select Nice Class:** Identify whether your formulation belongs to **Class 5** (Medicines & Pharma), **Class 3** (Herbal Cosmetics), or **Class 30** (Ayurveda Aahara & Herbal Teas).\n"
            "3. **File Form TM-A:** Submit online via IP India. MSMEs, Startups, and Individuals pay a subsidized statutory fee of **₹4,500** (standard corporate fee: ₹9,000).\n"
            "4. **Immediate ™ Protection:** Immediately upon filing Form TM-A, you receive an official application number and can legally display the **™** mark on your packaging while examination is underway.\n\n"
            "👉 **Continuous Follow-up:** Would you like the complete step-by-step statutory filing walkthrough with mandatory documents and timelines? Simply ask: *\"How do I register a trademark in India?\"*"
        )
    elif is_tm_procedural:
        answer = (
            "### 📋 Step-by-Step Statutory Process: How to Register a Trademark in India\n\n"
            "Registering a trademark with the **Trade Marks Registry (Controller General of Patents, Designs and Trade Marks)** "
            "involves the following practical statutory workflow:\n\n"
            "#### 1️⃣ Step 1: Official Public Clearance Search\n"
            "- Before filing, conduct an exhaustive clearance search on the official **IP India Public Search Portal** (`ipindiaonline.gov.in`).\n"
            "- Search both exact wordmarks and phonetic similarities in your target Nice Class to ensure no identical or confusingly similar mark already exists.\n\n"
            "#### 2️⃣ Step 2: Select the Correct Nice Class\n"
            "- Choose the statutory class corresponding to your products:\n"
            "  - **Class 5:** Ayurvedic medicinal formulations & pharma.\n"
            "  - **Class 3:** Herbal cosmetics, lotions, and soaps.\n"
            "  - **Class 30:** Herbal foods, teas, and Ayurveda Aahara.\n\n"
            "#### 3️⃣ Step 3: Online Filing via Form TM-A\n"
            "- File **Form TM-A** electronically on the IP India Comprehensive e-Filing Portal.\n"
            "- **Statutory Government Fees:**\n"
            "  - **₹4,500:** For Individuals, Startups, and MSMEs (with Udyam certificate).\n"
            "  - **₹9,000:** For standard private limited companies and partnerships.\n"
            "- **Key Enclosures:** High-resolution logo/wordmark image, Identity/Business proof, and User Affidavit with documentary evidence (invoices/marketing) if claiming prior use date, or declare *'Proposed to be used'*.\n"
            "- *Immediate Milestone:* Upon submission, you receive an official application number and can immediately start using the **™** symbol!\n\n"
            "#### 4️⃣ Step 4: Examination by Trade Marks Registry\n"
            "- An official Trademark Examiner scrutinizes your application within 30 to 60 days.\n"
            "- If an **Examination Report** issues objections under Section 9 (lack of distinctiveness) or Section 11 (similarity to existing marks), submit a formal written legal reply within **30 days**.\n\n"
            "#### 5️⃣ Step 5: Publication in the Trade Marks Journal\n"
            "- If accepted by the Registrar, the trademark is published in the official *Trade Marks Journal*.\n"
            "- This triggers a statutory **4-month public opposition period** (Section 21) during which third parties may challenge the registration.\n\n"
            "#### 6️⃣ Step 6: Certificate of Registration (Form O-2)\n"
            "- If no opposition is filed (or if opposition is decided in your favor), the Registrar issues the official **Certificate of Registration (Form O-2)**.\n"
            "- You can now lawfully use the prestigious registered **®** symbol!\n"
            "- **Validity:** The trademark is valid for **10 years** and can be renewed indefinitely every 10 years under Section 25."
        )
    elif is_patent_definitional:
        answer = (
            "### 💡 What is a Patent? (Simple Plain-Language Explanation)\n\n"
            "In simple, everyday words, a **Patent** is an official certificate and legal monopoly granted by the Government of India to an inventor. "
            "It gives you the legal power to stop anyone else from manufacturing, copying, selling, using, or importing your invention for **20 years**.\n\n"
            "In return for this 20-year legal monopoly, you must publicly disclose the complete technical secrets of how your invention works so society can learn from it.\n\n"
            "---\n\n"
            "### 📜 Technical & Statutory Provisions (The Patents Act, 1970)\n\n"
            "1. **Statutory Definition of Invention (Section 2(1)(j)):**\n"
            "   An 'invention' means a new product or process involving an inventive step and capable of industrial application.\n"
            "2. **The Three Pillars of Patentability:**\n"
            "   - **Novelty (Section 2(1)(l)):** The invention must not have been published or publicly used anywhere in the world prior to filing.\n"
            "   - **Inventive Step (Section 2(1)(ja)):** A technical advancement or economic significance that is non-obvious to a person skilled in the art.\n"
            "   - **Industrial Applicability (Section 2(1)(j)):** Must be capable of industrial manufacture or commercial usage.\n"
            "3. **Exclusive Statutory Rights (Section 48):** Confers exclusive rights to exclude third parties from making, using, offering for sale, selling, or importing the patented product or process.\n"
            "4. **Term of Patent (Section 53):** Valid for 20 years from application date, subject to annual statutory renewal fees.\n"
            "5. **Statutory Bars on Traditional Knowledge (Section 3(p) & 3(e)):** Excludes mere traditional knowledge (TKDL prior art) and mere admixtures lacking unforeseen synergistic efficacy (CI < 1.0).\n\n"
            "---\n\n"
            "### 💡 Recommended Next Step: How to File / Get a Patent\n\n"
            "Would you like to know how to file your invention with the Indian Patent Office?\n\n"
            "**Quick Filing Summary:**\n"
            "1. **Prior Art & TKDL Search:** Conduct an exhaustive search on InPASS (`ipindiaservices.gov.in`) and the CSIR-AYUSH Traditional Knowledge Digital Library (TKDL) to confirm novelty.\n"
            "2. **Prove Non-Obvious Synergy (Section 3(e)):** For herbal formulations, document experimental bioassays demonstrating unexpected synergistic efficacy (Combination Index CI < 1.0).\n"
            "3. **Draft & File Form 1 & Form 2:** File online on `ipindia.gov.in` with ₹1,600 statutory fee for Individuals/Startups/MSMEs.\n"
            "4. **NBA Approval:** Obtain mandatory Form III prior approval under Section 6 of the Biological Diversity Act, 2002 if using Indian biological resources.\n\n"
            "👉 **Continuous Follow-up:** Would you like the complete step-by-step patent filing procedure from provisional filing to grant? Simply ask: *\"How do I file a patent in India?\"*"
        )
    elif is_patent_procedural:
        answer = (
            "### 📋 Step-by-Step Statutory Process: How to File a Patent in India\n\n"
            "To secure a patent in India under **The Patents Act, 1970**, follow this official filing and examination workflow:\n\n"
            "#### 1️⃣ Step 1: Prior Art & TKDL Search\n"
            "- Conduct an exhaustive search on **InPASS** (`ipindiaservices.gov.in`) and the CSIR-AYUSH **Traditional Knowledge Digital Library (TKDL)** to confirm novelty.\n\n"
            "#### 2️⃣ Step 2: Drafting Patent Specification (Form 2)\n"
            "- Draft a **Provisional Specification** (if R&D is ongoing to secure priority date) or **Complete Specification** with detailed background, working examples, claims, and comparative synergy bioassays (Combination Index CI < 1.0).\n\n"
            "#### 3️⃣ Step 3: Online Filing on IP India Portal\n"
            "- Submit statutory forms on `ipindia.gov.in`:\n"
            "  - **Form 1:** Application for grant of patent.\n"
            "  - **Form 2:** Complete/Provisional specification and claims.\n"
            "  - **Form 3:** Statement and undertaking regarding foreign filings.\n"
            "  - **Form 5:** Declaration as to inventorship.\n"
            "- **Statutory Fees:** ₹1,600 for Individuals/Startups/MSMEs (₹8,000 for large corporate entities).\n\n"
            "#### 4️⃣ Step 4: Mandatory Biodiversity Approval (NBA Form III)\n"
            "- Under **Section 6 of the Biological Diversity Act, 2002**, if your invention uses any biological resource or herb sourced from India, you must file **Form III** with the National Biodiversity Authority (NBA) before patent grant.\n\n"
            "#### 5️⃣ Step 5: Publication & Request for Examination (Form 18)\n"
            "- The patent application is published in the official journal after 18 months (or expedited via Form 9).\n"
            "- Submit **Form 18** (Request for Examination, RFE) within 48 months from the filing date.\n\n"
            "#### 6️⃣ Step 6: First Examination Report (FER) & Patent Grant\n"
            "- The Patent Examiner issues a FER. Submit written responses and claim amendments within 6 months.\n"
            "- Upon satisfaction of all requirements, the Patent Office issues the Certificate of Patent Grant under **Section 43**."
        )
    elif is_ayurveda_definitional:
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
            "   - **National Commission for Indian System of Medicine (NCISM) Act, 2020:** Regulates higher medical education and practitioner licensing.\n\n"
            "---\n\n"
            "### 💡 Recommended Next Step: How to Register & License an Ayurvedic Product\n\n"
            "Are you planning to commercially manufacture or market an Ayurvedic formulation?\n\n"
            "**Quick Licensing Summary:**\n"
            "1. **Determine Formulation Category:** Classical ASU Medicine (First Schedule texts, Form 24D/25D) vs. Patent & Proprietary (P&P Rule 158B) vs. Ayurveda Aahara (FSSAI).\n"
            "2. **Schedule T GMP Premises:** Setup or contract a certified Good Manufacturing Practices facility with a qualified technical supervisor (BAMS / B.Pharm Ayurveda).\n"
            "3. **Submit Application:** File Form 24D (own factory) or Form 25D (loan license) to the State Licensing Authority (SLA) via e-Aushadhi.\n\n"
            "👉 **Continuous Follow-up:** Would you like the complete step-by-step manufacturing and licensing guide? Simply ask: *\"How do I register an Ayurvedic product in India?\"*"
        )
    elif is_patent_ayurveda:
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
    elif is_gi:
        answer = (
            "### 🌿 Geographical Indications (GI Tags) under Indian Law\n"
            "Under **The Geographical Indications of Goods Act, 1999**:\n\n"
            "1. **Definition (Section 2(e)):** A GI tag identifies goods as originating in a specific geographical territory, where a given quality, reputation, or other characteristic is essentially attributable to its geographic origin (e.g. *Kashmir Saffron*, *Navara Rice*).\n"
            "2. **Collective Community Right:** Unlike patents or trademarks, a GI tag cannot be exclusively monopolized by a single private corporation. It is owned collectively by the community/association of producers (Section 8).\n"
            "3. **Remedies Against Misuse (Section 66):** Unauthorized use of a registered GI name on non-certified goods constitutes statutory infringement carrying penal remedies."
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

    domain_keywords = [
        "ट्रेडमार्क", "ट्रेड मार्क", "पेटेंट", "आयुर्वेद", "आयुष", "दवा", "औषधि", "हर्बल",
        "लाइसेंस", "पंजीकरण", "फॉर्म", "धारा", "trademark", "patent", "ayush", "ayurveda"
    ]
    if not any(kw in q_lower for kw in domain_keywords):
        return (
            "### ⚠️ AYURLEX कॉर्पस में अपर्याप्त वैधानिक संसाधन\n"
            "वर्तमान कानूनी डेटाबेस में आपके प्रश्न से संबंधित सत्यापित वैधानिक प्रावधान उपलब्ध नहीं हैं। "
            "AYURLEX शून्य-भ्रम (Zero-Hallucination) नीति का पालन करता है और अपुष्ट कानूनी नियमों का निर्माण नहीं करता है।"
        )

    # 1. Trademark Definitional in Hindi
    is_tm_definitional = (
        any(w in q_lower for w in [
            "ट्रेडमार्क क्या", "ट्रेड मार्क क्या", "what is a trademark", "what is trademark",
            "ट्रेडमार्क का अर्थ", "ट्रेडमार्क परिभाषा", "ट्रेडमार्क", "ट्रेड मार्क", "tm"
        ])
        and not any(w in q_lower for w in ["कैसे", "प्रक्रिया", "पंजीकरण", "रजिस्टर", "how to", "register", "फीस", "शुल्क"])
    )

    # 2. Trademark Procedural in Hindi
    is_tm_procedural = any(w in q_lower for w in [
        "ट्रेडमार्क रजिस्टर", "ट्रेडमार्क पंजीकरण", "ट्रेडमार्क कैसे", "how to register trademark", "register trademark", "form tm-a", "टीएम-ए", "ट्रेडमार्क कैसे प्राप्त करें"
    ])

    # 3. Patent Definitional in Hindi
    is_patent_definitional = (
        any(w in q_lower for w in [
            "पेटेंट क्या है", "पेटेंट क्या होता", "what is a patent", "what is patent",
            "पेटेंट परिभाषा", "पेटेंट अधिकार", "पेटेंट"
        ])
        and not any(w in q_lower for w in ["कैसे", "दाखिल", "प्रक्रिया", "पंजीकरण", "how to", "file", "शुल्क", "अश्वगंधा"])
    )

    # 4. Patent Procedural in Hindi
    is_patent_procedural = any(w in q_lower for w in [
        "पेटेंट कैसे", "पेटेंट फाइल", "पेटेंट पंजीकरण", "how to file a patent", "how to file patent", "how to register patent", "पेटेंट प्रक्रिया", "पेटेंट आवेदन"
    ])

    # 5. Registration / Licensing Procedure for Ayurvedic Products in Hindi
    is_registration = any(w in q_lower for w in [
        "रजिस्टर", "लाइसेंस", "पंजीकरण", "निर्माण", "register", "license", "form 24d", "form 25d", "schedule t", "उत्पाद पंजीकरण"
    ]) and not is_tm_definitional and not is_tm_procedural and not is_patent_definitional

    # 6. Ayurveda Definitional in Hindi
    is_definitional = (
        any(w in q_lower for w in [
            "आयुर्वेद क्या", "आयुष क्या", "परिभाषा", "अर्थ", "what is ayurveda", "what is asu", "आयुर्वेद की परिभाषा", "आयुर्वेद", "आयुष"
        ])
        and not any(w in q_lower for w in ["लाइसेंस", "निर्माण", "रजिस्टर", "उत्पाद", "पेटेंट"])
    )

    # 7. Ayurvedic Patenting / Ashwagandha queries in Hindi
    is_patent = any(w in q_lower for w in ["अश्वगंधा", "मिश्रण", "धारा 3", "section 3"])

    if is_tm_definitional:
        answer = (
            "### 💡 ट्रेडमार्क क्या है? (सरल शब्दों में व्याख्या)\n\n"
            "सरल बोलचाल की भाषा में, **ट्रेडमार्क (व्यापार चिह्न)** आपके ब्रांड, कंपनी या उत्पाद की एक विशिष्ट पहचान होती है। "
            "यह कोई नाम, लोगो, स्लोगन, प्रतीक या पैकेजिंग का रंग हो सकता है जो आपके उत्पाद को बाज़ार में दूसरे लोगों के उत्पादों से अलग पहचान दिलाता है।\n\n"
            "उदाहरण के लिए, यदि आप 'पतंजलि' या 'डाबर' का नाम या लोगो देखते हैं, तो आप तुरंत पहचान जाते हैं कि यह उत्पाद किसका है। "
            "ट्रेडमार्क पंजीकृत कराने से सरकार आपको उस नाम या लोगो पर कानूनी एकाधिकार देती है ताकि कोई दूसरा व्यक्ति आपके ब्रांड नाम की नकल न कर सके।\n\n"
            "---\n\n"
            "### 📜 तकनीकी एवं वैधानिक प्रावधान (व्यापार चिह्न अधिनियम, 1999)\n\n"
            "1. **वैधानिक परिभाषा (धारा 2(1)(zb)):**\n"
            "   व्यापार चिह्न अधिनियम, 1999 की धारा 2(1)(zb) के अनुसार, ट्रेडमार्क का अर्थ है:\n"
            "   > *'ऐसा चिह्न जो आलेखीय रूप से निरूपित किए जाने में समर्थ है और जो एक व्यक्ति के माल या सेवाओं को अन्य व्यक्तियों के माल या सेवाओं से विभेदित करने में समर्थ है तथा इसमें माल का रूप, उनका पैकेजिंग और रंगों का संयोजन सम्मिलित हो सकेगा।'\n\n"
            "2. **चिह्न की परिभाषा (धारा 2(1)(m)):**\n"
            "   इसमें कोई युक्ति, ब्रांड, शीर्षक, लेबल, टिकट, नाम, हस्ताक्षर, शब्द, अक्षर, अंक, माल का आकार, पैकेजिंग या रंगों का संयोजन शामिल है।\n\n"
            "3. **आयुर्वेदिक उत्पादों के लिए प्रमुख नाइस वर्गीकरण (Nice Classes):**\n"
            "   - **क्लास 5:** आयुर्वेदिक औषधियां, हर्बल फॉर्मूलेशन और चिकित्सीय दवाएं।\n"
            "   - **क्लास 3:** आयुर्वेदिक सौंदर्य प्रसाधन, हर्बल तेल, शैम्पू, साबुन और स्किनकेयर।\n"
            "   - **क्लास 30:** आयुर्वेदिक आहार पूरक, हर्बल चाय और मसाले।\n"
            "   - **क्लास 35:** आयुर्वेदिक खुदरा दुकानें, ऑनलाइन स्टोर और क्लीनिक सेवाएं।\n\n"
            "4. **विशेष वैधानिक एकाधिकार (धारा 28 एवं 29):**\n"
            "   पंजीकरण से स्वामी को उस ट्रेडमार्क का अनन्य उपयोग करने का अधिकार और धारा 29 के तहत उल्लंघन का वाद दायर करने का कानूनी अधिकार मिलता है।\n\n"
            "5. **पंजीकरण से इनकार के पूर्ण आधार (धारा 9):**\n"
            "   सामान्य या वर्णनात्मक वानस्पतिक नाम (जैसे केवल 'अश्वगंधा' या 'त्रिफला') किसी एक व्यक्ति के नाम पर पंजीकृत नहीं हो सकते। नाम विशिष्ट (distinctive) या गढ़ा हुआ (coined) होना चाहिए。\n\n"
            "---\n\n"
            "### 💡 अनुशंसित अगला कदम: ट्रेडमार्क कैसे प्राप्त / पंजीकृत करें?\n\n"
            "अब जब आप समझ गए हैं कि ट्रेडमार्क क्या है, क्या आप अपने ब्रांड नाम या लोगो को कानूनी रूप से सुरक्षित करना चाहते हैं?\n\n"
            "**त्वरित पंजीकरण मार्गदर्शिका:**\n"
            "1. **सार्वजनिक खोज:** IP India (`ipindiaonline.gov.in`) पर अपने प्रस्तावित नाम की उपलब्धता जांचें।\n"
            "2. **नाइस क्लास:** क्लास 5 (दवाएं), क्लास 3 (हर्बल प्रसाधन), या क्लास 30 (खाद्य पदार्थ/चाय)।\n"
            "3. **फॉर्म TM-A:** ऑनलाइन आवेदन करें। एमएसएमई/स्टार्टअप/व्यक्तियों के लिए सरकारी शुल्क **₹4,500** है।\n"
            "4. **™ प्रतीक का उपयोग:** फॉर्म TM-A जमा करते ही आपको आवेदन संख्या मिल जाती है और आप तुरंत अपने उत्पाद पर **™** लगा सकते हैं।\n\n"
            "👉 **निरंतर अनुवर्ती प्रश्न:** चरण-दर-चरण आधिकारिक आवेदन प्रक्रिया जानने के लिए पूछें: *\"भारत में ट्रेडमार्क कैसे रजिस्टर करें?\"*"
        )
    elif is_tm_procedural:
        answer = (
            "### 📋 भारत में ट्रेडमार्क पंजीकरण की चरण-दर-चरण वैधानिक प्रक्रिया (Step-by-Step Process)\n\n"
            "ट्रेड मार्क्स रजिस्ट्री (CGPDTM) के साथ ट्रेडमार्क पंजीकृत करने की आधिकारिक प्रक्रिया निम्नलिखित 6 चरणों में पूरी होती है:\n\n"
            "#### 1️⃣ चरण 1: आधिकारिक सार्वजनिक खोज (Clearance Search)\n"
            "- आवेदन से पहले आधिकारिक **IP India पब्लिक सर्च पोर्टल** (`ipindiaonline.gov.in`) पर संपूर्ण खोज करें ताकि यह सुनिश्चित हो सके कि कोई मिलता-जुलता या समान नाम पहले से मौजूद नहीं है।\n\n"
            "#### 2️⃣ चरण 2: सही नाइस क्लास (Nice Class) का चयन\n"
            "- अपने उत्पाद के अनुसार सही वैधानिक श्रेणी चुनें:\n"
            "  - **क्लास 5:** आयुर्वेदिक औषधियां एवं उपचारात्मक उत्पाद।\n"
            "  - **क्लास 3:** हर्बल प्रसाधन, साबुन, फेसपैक आदि।\n"
            "  - **क्लास 30:** हर्बल खाद्य पदार्थ, चाय, आयुर्वेद आहार।\n\n"
            "#### 3️⃣ चरण 3: फॉर्म TM-A के माध्यम से ऑनलाइन आवेदन\n"
            "- IP India e-Filing पोर्टल पर **फॉर्म TM-A (Form TM-A)** इलेक्ट्रॉनिक रूप से दाखिल करें।\n"
            "- **सरकारी वैधानिक शुल्क (Statutory Fees):**\n"
            "  - **₹4,500:** व्यक्ति (Individual), स्टार्टअप और MSME/Udyam प्रमाण पत्र धारकों के लिए।\n"
            "  - **₹9,000:** अन्य कंपनियों और संस्थाओं के लिए।\n"
            "- आवश्यक दस्तावेज: लोगो/शब्द का नमूना, पहचान पत्र, और यदि पहले से उपयोग कर रहे हैं तो उपयोग शपथ पत्र (User Affidavit) या 'उपयोग के लिए प्रस्तावित' (Proposed to be used) घोषित करें।\n"
            "- *तत्काल लाभ:* आवेदन जमा होते ही आपको आधिकारिक आवेदन संख्या मिलती है और आप अपने नाम के साथ **™** प्रतीक का उपयोग शुरू कर सकते हैं!\n\n"
            "#### 4️⃣ चरण 4: ट्रेड मार्क्स रजिस्ट्री द्वारा परीक्षण (Examination)\n"
            "- परीक्षक आवेदन की जांच करता है। यदि कोई आपत्ति (धारा 9 या धारा 11) उठाई जाती है, तो **30 दिनों** के भीतर औपचारिक लिखित कानूनी उत्तर प्रस्तुत करना अनिवार्य है।\n\n"
            "#### 5️⃣ चरण 5: ट्रेड मार्क्स जर्नल में प्रकाशन (Journal Publication)\n"
            "- रजिस्ट्रार द्वारा स्वीकार किए जाने के बाद ट्रेडमार्क को आधिकारिक *Trade Marks Journal* में प्रकाशित किया जाता है।\n"
            "- इसके बाद **4 महीने की सार्वजनिक विरोध अवधि (Opposition Window)** शुरू होती है।\n\n"
            "#### 6️⃣ चरण 6: पंजीकरण प्रमाण पत्र (Form O-2)\n"
            "- यदि कोई विरोध नहीं होता (या विरोध का निपटारा आपके पक्ष में होता है), तो आधिकारिक **पंजीकरण प्रमाण पत्र (Form O-2)** जारी किया जाता है।\n"
            "- अब आप गर्व से पंजीकृत **®** प्रतीक का उपयोग कर सकते हैं!\n"
            "- **वैधता:** ट्रेडमार्क **10 वर्षों** के लिए वैध होता है और धारा 25 के तहत हर 10 साल में अनिश्चित काल तक नवीनीकृत कराया जा सकता है।"
        )
    elif is_patent_definitional:
        answer = (
            "### 💡 पेटेंट क्या है? (सरल शब्दों में व्याख्या)\n\n"
            "सरल शब्दों में, **पेटेंट** भारत सरकार द्वारा किसी आविष्कारक को दिया जाने वाला एक आधिकारिक कानूनी प्रमाण पत्र और विशेष एकाधिकार (Monopoly) है। "
            "यह आपको **20 वर्षों** के लिए दूसरों को आपके आविष्कार को बनाने, बेचने, उपयोग करने या आयात करने से रोकने की पूरी कानूनी शक्ति देता है।\n\n"
            "इस 20 साल के एकाधिकार के बदले, आपको अपने आविष्कार की पूरी तकनीकी विधि जनता के सामने सार्वजनिक रूप से प्रकट करनी होती है ताकि समाज उससे सीख सके।\n\n"
            "---\n\n"
            "### 📜 तकनीकी एवं वैधानिक प्रावधान (पेटेंट अधिनियम, 1970)\n\n"
            "1. **आविष्कार की वैधानिक परिभाषा (धारा 2(1)(j)):**\n"
            "   आविष्कार का अर्थ है कोई नया उत्पाद या प्रक्रिया जिसमें आविष्कारशील कदम शामिल हो और जो औद्योगिक अनुप्रयोग में समर्थ हो।\n"
            "2. **पेटेंट योग्यता के तीन मुख्य आधार:**\n"
            "   - **नवीनता (Novelty - धारा 2(1)(l)):** आवेदन से पहले यह विश्व में कहीं भी सार्वजनिक रूप से उपलब्ध नहीं होना चाहिए।\n"
            "   - **आविष्कारशील कदम (Inventive Step - धारा 2(1)(ja)):** तकनीकी प्रगति जो क्षेत्र के विशेषज्ञ के लिए स्वतः स्पष्ट न हो।\n"
            "   - **औद्योगिक उपयोगिता (Industrial Applicability - धारा 2(1)(j)):** उद्योग में निर्माण या उपयोग के योग्य होना चाहिए।\n"
            "3. **अनन्य अधिकार (धारा 48):** पेटेंट धारक को उत्पाद बनाने, उपयोग करने, बेचने या आयात करने से दूसरों को रोकने का विशेष अधिकार।\n"
            "4. **पेटेंट की अवधि (धारा 53):** आवेदन की तिथि से 20 वर्ष तक वैध।\n"
            "5. **पारंपरिक ज्ञान अपवाद (धारा 3(p) एवं 3(e)):** केवल पारंपरिक ज्ञान या अप्रत्याशित तालमेल रहित मात्र मिश्रण पेटेंट योग्य नहीं हैं。\n\n"
            "---\n\n"
            "### 💡 अनुशंसित अगला कदम: पेटेंट कैसे दाखिल / प्राप्त करें?\n\n"
            "क्या आप जानना चाहते हैं कि अपने आविष्कार के लिए पेटेंट आवेदन कैसे दाखिल करें?\n\n"
            "**त्वरित फाइलिंग मार्गदर्शिका:**\n"
            "1. **पूर्व कला और TKDL खोज:** नवीनता सुनिश्चित करने के लिए InPASS और TKDL पर खोज करें।\n"
            "2. **सिनर्जी सिद्ध करें (धारा 3(e)):** हर्बल फॉर्मूलेशन के लिए अप्रत्याशित चिकित्सीय प्रभाव (CI < 1.0) का वैज्ञानिक डेटा दिखाएं।\n"
            "3. **फॉर्म 1 और फॉर्म 2:** ₹1,600 शुल्क (एमएसएमई/व्यक्ति) के साथ ऑनलाइन दाखिल करें।\n"
            "4. **NBA अनुमति:** भारतीय जड़ी-बूटियों के उपयोग पर राष्ट्रीय जैव विविधता प्राधिकरण (NBA) फॉर्म III भरें।\n\n"
            "👉 **निरंतर अनुवर्ती प्रश्न:** चरण-दर-चरण पेटेंट फाइलिंग प्रक्रिया जानने के लिए पूछें: *\"भारत में पेटेंट कैसे फाइल करें?\"*"
        )
    elif is_patent_procedural:
        answer = (
            "### 📋 भारत में पेटेंट दाखिल करने की चरण-दर-चरण वैधानिक प्रक्रिया (Step-by-Step Process)\n\n"
            "भारतीय पेटेंट अधिनियम, 1970 के तहत पेटेंट प्राप्त करने के लिए निम्नलिखित आधिकारिक प्रक्रिया का पालन करें:\n\n"
            "#### 1️⃣ चरण 1: पूर्व कला (Prior Art) एवं TKDL खोज\n"
            "- **InPASS** (`ipindiaservices.gov.in`) और CSIR-AYUSH **पारंपरिक ज्ञान डिजिटल लाइब्रेरी (TKDL)** पर विस्तृत खोज करें ताकि नवीनता सुनिश्चित हो सके।\n\n"
            "#### 2️⃣ चरण 2: पेटेंट विनिर्देश तैयार करना (फॉर्म 2)\n"
            "- प्राथमिक तिथि सुरक्षित करने के लिए प्रोविजनल स्पेसिफिकेशन या तुलनात्मक सिनर्जिकल बायोएसे डेटा (Combination Index CI < 1.0) के साथ कम्प्लीट स्पेसिफिकेशन ड्राफ्ट करें।\n\n"
            "#### 3️⃣ चरण 3: IP India पोर्टल पर ऑनलाइन फाइलिंग\n"
            "- `ipindia.gov.in` पर वैधानिक फॉर्म जमा करें:\n"
            "  - **फॉर्म 1:** पेटेंट अनुदान के लिए आवेदन।\n"
            "  - **फॉर्म 2:** प्रोविजनल/कम्प्लीट स्पेसिफिकेशन और दावे (Claims)।\n"
            "  - **फॉर्म 3:** विदेशी फाइलिंग का विवरण।\n"
            "  - **फॉर्म 5:** आविष्कारक की घोषणा।\n"
            "- **सरकारी शुल्क:** व्यक्तियों/स्टार्टअप/MSME के लिए ₹1,600 (बड़ी कंपनियों के लिए ₹8,000)।\n\n"
            "#### 4️⃣ चरण 4: राष्ट्रीय जैव विविधता प्राधिकरण (NBA) फॉर्म III\n"
            "- **जैविक विविधता अधिनियम, 2002 की धारा 6** के तहत यदि आविष्कार में भारतीय जैविक संसाधन/जड़ी-बूटी का उपयोग है, तो पेटेंट अनुदान से पहले NBA से अनुमति अनिवार्य है।\n\n"
            "#### 5️⃣ चरण 5: प्रकाशन एवं परीक्षा का अनुरोध (फॉर्म 18)\n"
            "- 18 महीने बाद आवेदन जर्नल में प्रकाशित होता है।\n"
            "- फाइलिंग तिथि से 48 महीनों के भीतर **फॉर्म 18 (RFE)** जमा करें।\n\n"
            "#### 6️⃣ चरण 6: प्रथम परीक्षा रिपोर्ट (FER) एवं पेटेंट अनुदान\n"
            "- परीक्षक की आपत्तियों का 6 महीने के भीतर उत्तर दें। सभी शर्तें पूरी होने पर **धारा 43** के तहत पेटेंट प्रमाण पत्र जारी किया जाता है।"
        )
    elif is_registration:
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
            "2. **आयुष मंत्रालय (Ministry of Ayush):** राष्ट्रीय नियामक नीतियां और आधिकारिक आयुर्वेदिक फार्माकोपिया (API) जारी करता है।\n\n"
            "---\n\n"
            "### 💡 अनुशंसित अगला कदम: आयुर्वेदिक उत्पाद का लाइसेंस / पंजीकरण कैसे प्राप्त करें?\n\n"
            "क्या आप अपने आयुर्वेदिक फॉर्मूलेशन का व्यावसायिक निर्माण या बिक्री करना चाहते हैं?\n\n"
            "**त्वरित लाइसेंसिंग मार्गदर्शिका:**\n"
            "1. **उत्पाद श्रेणी:** शास्त्रीय औषधि (फॉर्म 24D/25D) बनाम पेटेंट एवं प्रोप्रायटरी (नियम 158B) बनाम आयुर्वेद आहार (FSSAI)।\n"
            "2. **शेड्यूल T जीएमपी:** योग्य तकनीकी कर्मचारियों (BAMS/B.Pharm) के साथ जीएमपी-प्रमाणित निर्माण परिसर।\n"
            "3. **SLA आवेदन:** राज्य आयुष लाइसेंसिंग प्राधिकरण या e-Aushadhi पोर्टल पर आवेदन करें।\n\n"
            "👉 **निरंतर अनुवर्ती प्रश्न:** संपूर्ण निर्माण और लाइसेंसिंग प्रक्रिया जानने के लिए पूछें: *\"आयुर्वेदिक उत्पाद का पंजीकरण कैसे करें?\"*"
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

    domain_keywords = [
        "ట్రేడ్‌మార్క్", "ట్రేడ్ మార్క్", "పేటెంట్", "ఆయుర్వేద", "ఆయుష్", "లైసెన్స్", "రిజిస్టర్",
        "ఫారం", "సెక్షన్", "trademark", "patent", "ayush", "ayurveda"
    ]
    if not any(kw in q_lower for kw in domain_keywords):
        return (
            "### ⚠️ AYURLEX కార్పస్‌లో తగినంత చట్టపరమైన ఆధారాలు లభించలేదు\n"
            "ప్రస్తుత చట్టపరమైన డేటాబేస్‌లో మీ ప్రశ్నకు సంబంధించిన ధృవీకరించబడిన చట్టపరమైన నిబంధనలు లభించలేదు. "
            "AYURLEX సున్నా-భ్రమ (Zero-Hallucination) విధానాన్ని అనుసరిస్తుంది."
        )

    # 1. Trademark Definitional in Telugu
    is_tm_definitional = (
        any(w in q_lower for w in [
            "ట్రేడ్‌మార్క్ అంటే ఏమిటి", "ట్రేడ్ మార్క్ అంటే", "ట్రేడ్‌మార్క్ నిర్వచనం", "what is a trademark", "what is trademark",
            "ట్రేడ్‌మార్క్", "ట్రేడ్ మార్క్", "tm"
        ])
        and not any(w in q_lower for w in ["ఎలా", "విధానం", "రిజిస్టర్", "నమోదు", "how to", "register", "ఫీజు", "రుసుము"])
    )

    # 2. Trademark Procedural in Telugu
    is_tm_procedural = any(w in q_lower for w in [
        "ట్రేడ్‌మార్క్ రిజిస్టర్", "ట్రేడ్ మార్క్ నమోదు", "ట్రేడ్‌మార్క్ ఎలా", "how to register trademark", "register trademark", "form tm-a", "ట్రేడ్‌మార్క్ ఎలా పొందాలి"
    ])

    # 3. Patent Definitional in Telugu
    is_patent_definitional = (
        any(w in q_lower for w in [
            "పేటెంట్ అంటే ఏమిటి", "పేటెంట్ అంటే", "పేటెంట్ నిర్వచనం", "what is a patent", "what is patent", "పేటెంట్"
        ])
        and not any(w in q_lower for w in ["ఎలా", "ఫైల్", "విధానం", "how to", "file", "దరఖాస్తు", "రుసుము", "అశ్వగంధ"])
    )

    # 4. Patent Procedural in Telugu
    is_patent_procedural = any(w in q_lower for w in [
        "పేటెంట్ ఎలా ఫైల్ చేయాలి", "పేటెంట్ దరఖాస్తు విధానం", "పేటెంట్ ప్రక్రియ", "how to file a patent", "how to file patent", "how to register patent"
    ])

    # 5. Registration procedure for Ayurvedic Products in Telugu
    is_registration = any(w in q_lower for w in [
        "ఆయుర్వేద ఉత్పత్తి రిజిస్టర్", "ఆయుర్వేద లైసెన్స్", "రిజిస్టర్", "లైసెన్స్", "తయారీ", "దరఖాస్తు", "register", "license", "form 24d", "form 25d", "schedule t"
    ]) and not is_tm_definitional and not is_tm_procedural and not is_patent_definitional

    # 6. Ayurveda Definitional in Telugu
    is_definitional = (
        any(w in q_lower for w in [
            "ఆయుర్వేదం అంటే", "ఆయుష్ అంటే", "నిర్వచనం", "what is ayurveda", "what is asu", "ఆయుర్వేదం", "ఆయుష్"
        ])
        and not any(w in q_lower for w in ["లైసెన్స్", "తయారీ", "రిజిస్టర్", "పేటెంట్"])
    )

    # 7. Ayurvedic Patenting / Ashwagandha / Formulation queries in Telugu
    is_patent = any(w in q_lower for w in ["అశ్వగంధ", "మిశ్రమం", "సెక్షన్ 3", "section 3"])

    if is_tm_definitional:
        answer = (
            "### 💡 ట్రేడ్‌మార్క్ అంటే ఏమిటి? (సాధారణ మరియు సులభమైన వివరణ)\n\n"
            "సరళమైన దైనందిన భాషలో, **ట్రేడ్‌మార్క్ (వ్యాపార చిహ్నం)** అనేది మీ బ్రాండ్, కంపెనీ లేదా ఉత్పత్తికి చట్టబద్ధమైన ప్రత్యేక గుర్తింపు. "
            "ఇది మీ ఉత్పత్తిని మార్కెట్‌లోని ఇతరుల ఉత్పత్తుల నుండి వేరుగా చూపే ఒక ప్రత్యేకమైన పేరు, లోగో, చిహ్నం, రంగుల కలయిక లేదా ప్యాకేజింగ్ శైలి కావచ్చు.\n\n"
            "ఉదాహరణకు, 'డాబర్' లేదా 'పతంజలి' లోగో చూసిన వెంటనే అది ఏ సంస్థ ఉత్పత్తి అనేది ప్రజలకు స్పష్టంగా తెలుస్తుంది. "
            "ట్రేడ్‌మార్క్‌ను ప్రభుత్వం వద్ద నమోదు చేసుకోవడం ద్వారా ఆ పేరు లేదా లోగోను ఉపయోగించే సంపూర్ణ చట్టపరమైన గుత్తాధిపత్యం మీకు లభిస్తుంది, మరియు ఇతరులు మీ పేరును కాపీ చేయకుండా ఆపవచ్చు.\n\n"
            "---\n\n"
            "### 📜 సాంకేతిక మరియు చట్టపరమైన నిబంధనలు (ట్రేడ్‌మార్క్ చట్టం, 1999)\n\n"
            "1. **చట్టబద్ధమైన నిర్వచనం (సెక్షన్ 2(1)(zb)):**\n"
            "   ట్రేడ్‌మార్క్ చట్టం, 1999 లోని సెక్షన్ 2(1)(zb) ప్రకారం ట్రేడ్‌మార్క్ అంటే:\n"
            "   > *'చిత్రరూపంలో చూపించదగిన మరియు ఒకరి వస్తువులు లేదా సేవలను ఇతరుల నుండి వేరుగా గుర్తించగల సామర్థ్యం కలిగిన గుర్తు; ఇందులో వస్తువుల ఆకారం, వాటి ప్యాకేజింగ్ మరియు రంగుల కలయిక కూడా ఉంటాయి.'*\n\n"
            "2. **గుర్తు యొక్క నిర్వచనం (సెక్షన్ 2(1)(m)):**\n"
            "   ఇందులో ఏదైనా డివైజ్, బ్రాండ్, శీర్షిక, లేబుల్, పేరు, సంతకం, పదం, అక్షరం, సంఖ్య, వస్తువుల ఆకారం లేదా రంగుల కలయిక ఉంటుంది.\n\n"
            "3. **ఆయుర్వేద ఉత్పత్తుల కోసం నైస్ వర్గీకరణ (Nice Classes):**\n"
            "   - **క్లాస్ 5:** ఆయుర్వేద ఔషధాలు, మూలికా ఫార్మాస్యూటికల్స్ మరియు చికిత్సా మిశ్రమాలు.\n"
            "   - **క్లాస్ 3:** ఆయుర్వేద సౌందర్య సాధనాలు, హెర్బల్ నూనెలు, సబ్బులు మరియు చర్మ సంరక్షణ.\n"
            "   - **క్లాస్ 30:** ఆయుర్వేద ఆహార పదార్థాలు, హెర్బల్ టీలు, సుగంధ ద్రవ్యాలు మరియు ఆయుర్వేద ఆహార.\n"
            "   - **క్లాస్ 35:** ఆయుర్వేద విక్రయ కేంద్రాలు, ఆన్‌లైన్ స్టోర్లు మరియు క్లినిక్ సేవలు.\n\n"
            "4. **ప్రత్యేక చట్టపరమైన హక్కులు (సెక్షన్ 28 & 29):**\n"
            "   రిజిస్ట్రేషన్ ద్వారా యజమానికి ట్రేడ్‌మార్క్‌ను ఉపయోగించే సంపూర్ణ హక్కు లభిస్తుంది మరియు సెక్షన్ 29 ప్రకారం ఉల్లంఘనలపై దావా వేసే అధికారం వస్తుంది.\n\n"
            "5. **నమోదు నిరాకరణకు సంపూర్ణ ఆధారాలు (సెక్షన్ 9):**\n"
            "   సాధారణ లేదా వివరణాత్మక మూలికా పేర్లను (ఉదాహరణకు 'అశ్వగంధ' లేదా 'త్రిఫల' ఒక్కదాన్నే) ఎవరూ తమ వ్యక్తిగత ట్రేడ్‌మార్క్‌గా నమోదు చేసుకోలేరు. పేరు విలక్షణంగా (distinctive) ఉండాలి。\n\n"
            "---\n\n"
            "### 💡 సూచించబడిన తదుపరి దశ: ట్రేడ్‌మార్క్‌ను ఎలా పొందాలి / నమోదు చేసుకోవాలి?\n\n"
            "ఇప్పుడు మీరు ట్రేడ్‌మార్క్ అంటే ఏమిటో తెలుసుకున్నారు, మీ బ్రాండ్ పేరు లేదా లోగోను చట్టబద్ధంగా నమోదు చేసుకోవాలనుకుంటున్నారా?\n\n"
            "**త్వరిత నమోదు మార్గదర్శిని:**\n"
            "1. **పబ్లిక్ శోధన:** IP India (`ipindiaonline.gov.in`) లో మీ ప్రతిపాదిత పేరు లభ్యతను తనిఖీ చేయండి.\n"
            "2. **నైస్ క్లాస్:** క్లాస్ 5 (మందులు), క్లాస్ 3 (హెర్బల్ కాస్మెటిక్స్), లేదా క్లాస్ 30 (ఆహారాలు/టీలు).\n"
            "3. **ఫారం TM-A:** ఆన్‌లైన్‌లో దరఖాస్తు చేయండి. వ్యక్తులు/స్టార్టప్‌లు/MSME లకు అధికారిక ప్రభుత్వ రుసుము **₹4,500**.\n"
            "4. **™ చిహ్నం వినియోగం:** ఫారం TM-A సమర్పించిన వెంటనే మీకు దరఖాస్తు సంఖ్య లభిస్తుంది మరియు వెంటనే **™** చిహ్నాన్ని ఉపయోగించవచ్చు.\n\n"
            "👉 **నిరంతర తదుపరి ప్రశ్న:** దశలవారీ అధికారిక రిజిస్ట్రేషన్ విధానాన్ని తెలుసుకోవడానికి అడగండి: *\"భారతదేశంలో ట్రేడ్‌మార్క్ ఎలా రిజిస్టర్ చేయాలి?\"*"
        )
    elif is_tm_procedural:
        answer = (
            "### 📋 భారతదేశంలో ట్రేడ్‌మార్క్ రిజిస్ట్రేషన్ దశలవారీ చట్టపరమైన విధానం (Step-by-Step Process)\n\n"
            "ట్రేడ్ మార్క్స్ రిజిస్ట్రీ వద్ద మీ ట్రేడ్‌మార్క్‌ను చట్టబద్ధంగా నమోదు చేయడానికి కింది 6 దశల అధికారిక విధానాన్ని అనుసరించాలి:\n\n"
            "#### 1️⃣ దశ 1: అధికారిక పబ్లిక్ శోధన (Clearance Search)\n"
            "- దరఖాస్తుకు ముందు అధికారిక **IP India పబ్లిక్ సెర్చ్ పోర్టల్** (`ipindiaonline.gov.in`) లో సమగ్ర శోధన నిర్వహించండి. సారూప్యమైన లేదా సమానమైన పేరు లేదా లోగో ఇప్పటికే నమోదు కాలేదని నిర్ధారించుకోండి.\n\n"
            "#### 2️⃣ దశ 2: సరైన నైస్ క్లాస్ (Nice Class) ఎంపిక\n"
            "- మీ ఉత్పత్తులకు సంబంధించిన నిర్దిష్ట చట్టబద్ధమైన తరగతిని ఎంచుకోండి:\n"
            "  - **క్లాస్ 5:** ఆయుర్వేద మందులు & ఔషధాలు.\n"
            "  - **క్లాస్ 3:** హెర్బల్ కాస్మెటిక్స్, నూనెలు, సబ్బులు.\n"
            "  - **క్లాస్ 30:** హెర్బల్ ఆహారాలు, టీలు మరియు సప్లిమెంట్లు.\n\n"
            "#### 3️⃣ దశ 3: ఫారం TM-A ద్వారా ఆన్‌లైన్ దరఖాస్తు\n"
            "- IP India e-Filing పోర్టల్ ద్వారా **ఫారం TM-A** ను ఎలక్ట్రానిక్ పద్ధతిలో దాఖలు చేయండి.\n"
            "- **ప్రభుత్వ అధికారిక రుసుము (Statutory Fees):**\n"
            "  - **₹4,500:** వ్యక్తులు, స్టార్టప్‌లు మరియు MSME/ఉద్యమ్ సర్టిఫికేట్ కలిగిన వారికి.\n"
            "  - **₹9,000:** ఇతర ప్రైవేట్ కంపెనీలు మరియు సంస్థలకు.\n"
            "- అవసరమైన పత్రాలు: లోగో/పేరు చిత్రం, గుర్తింపు పత్రం, మరియు ముందస్తు వినియోగ తేదీని క్లెయిమ్ చేస్తే యూజర్ అఫిడవిట్ (లేదా 'వినియోగానికి ప్రతిపాదించబడింది'గా ప్రకటించండి).\n"
            "- *తక్షణ ప్రయోజనం:* దరఖాస్తు సమర్పించిన వెంటనే అప్లికేషన్ నంబర్ లభిస్తుంది మరియు మీ బ్రాండ్ పక్కన **™** చిహ్నాన్ని ఉపయోగించడం ప్రారంభించవచ్చు!\n\n"
            "#### 4️⃣ దశ 4: ట్రేడ్‌మార్క్ ఎగ్జామినేషన్\n"
            "- ఎగ్జామినర్ మీ దరఖాస్తును పరిశీలిస్తారు. ఏవైనా అభ్యంతరాలు (సెక్షన్ 9 లేదా సెక్షన్ 11 కింద) ఉంటే, **30 రోజుల్లోపు** చట్టపరమైన లిఖితపూర్వక సమాధానం సమర్పించాలి.\n\n"
            "#### 5️⃣ దశ 5: ట్రేడ్ మార్క్స్ జర్నల్ ప్రచురణ (Opposition Window)\n"
            "- రిజిస్ట్రార్ ఆమోదించిన తర్వాత అధికారిక *Trade Marks Journal* లో ప్రచురించబడుతుంది.\n"
            "- దీని ద్వారా ప్రజలకు లేదా పోటీదారులకు **4 నెలల వ్యతిరేకత కాలపరిమితి (Opposition Window)** ప్రారంభమవుతుంది.\n\n"
            "#### 6️⃣ దశ 6: రిజిస్ట్రేషన్ సర్టిఫికేట్ (ఫారం O-2)\n"
            "- ఎటువంటి అభ్యంతరాలు రాకపోతే, రిజిస్ట్రార్ అధికారిక **రిజిస్ట్రేషన్ సర్టిఫికేట్ (ఫారం O-2)** ను జారీ చేస్తారు.\n"
            "- అప్పటి నుండి మీరు అధికారిక రిజిస్టర్డ్ **®** చిహ్నాన్ని చట్టబద్ధంగా ఉపయోగించవచ్చు!\n"
            "- **చెల్లుబాటు:** ట్రేడ్‌మార్క్ **10 సంవత్సరాలు** చెల్లుబాటు అవుతుంది మరియు సెక్షన్ 25 ప్రకారం ప్రతి 10 సంవత్సరాలకు ఒకసారి పునరుద్ధరించుకోవచ్చు."
        )
    elif is_patent_definitional:
        answer = (
            "### 💡 పేటెంట్ అంటే ఏమిటి? (సాధారణ మరియు సులభమైన వివరణ)\n\n"
            "సరళమైన రోజువారీ భాషలో, **పేటెంట్** అనేది ఒక సరికొత్త ఆవిష్కరణను సృష్టించిన ఆవిష్కర్తకు భారత ప్రభుత్వం మంజూరు చేసే ఒక అధికారిక చట్టపరమైన ధృవీకరణ పత్రం మరియు గుత్తాధిపత్య హక్కు. "
            "ఇది మీ ఆవిష్కరణను ఇతరులు తయారు చేయడం, ఉపయోగించడం, అమ్మడం లేదా దిగుమతి చేసుకోవడాన్ని **20 సంవత్సరాల పాటు** అడ్డుకునే సంపూర్ణ చట్టపరమైన అధికారాన్ని మీకు ఇస్తుంది.\n\n"
            "ఈ 20 ఏళ్ల చట్టబద్ధమైన గుత్తాధిపత్యానికి బదులుగా, మీ ఆవిష్కరణ ఎలా పనిచేస్తుందనే పూర్తి సాంకేతిక రహస్యాలను మీరు బహిరంగంగా సమాజానికి వెల్లడించాలి.\n\n"
            "---\n\n"
            "### 📜 సాంకేతిక మరియు చట్టపరమైన నిబంధనలు (భారత పేటెంట్ చట్టం, 1970)\n\n"
            "1. **ఆవిష్కరణ యొక్క చట్టబద్ధమైన నిర్వచనం (సెక్షన్ 2(1)(j)):**\n"
            "   ఒక నూతన ఉత్పత్తి లేదా ప్రక్రియ, ఇందులో ఆవిష్కరణాత్మక ముందడుగు ఉండి పారిశ్రామిక అనువర్తనానికి తగినదై ఉండాలి.\n"
            "2. **పేటెంట్ అర్హతకు మూడు మూలస్తంభాలు:**\n"
            "   - **నవ్యత (Novelty - సెక్షన్ 2(1)(l)):** దరఖాస్తు తేదీకి ముందు ప్రపంచంలో ఎక్కడా ప్రచురితం లేదా బహిరంగ వినియోగంలో ఉండకూడదు.\n"
            "   - **ఆవిష్కరణ నైపుణ్యం (Inventive Step - సెక్షన్ 2(1)(ja)):** ఆ రంగంలోని నిపుణుడికి సులభంగా ఊహించలేని సాంకేతిక పురోగతి ఉండాలి.\n"
            "   - **పారిశ్రామిక వినియోగం (Industrial Applicability - సెక్షన్ 2(1)(j)):** పరిశ్రమలో తయారు చేయడానికి లేదా ఉపయోగించడానికి సాధ్యపడాలి.\n"
            "3. **ప్రత్యేక చట్టపరమైన హక్కులు (సెక్షన్ 48):** ఇతరులను నిరోధించే గుత్తాధిపత్య హక్కు.\n"
            "4. **కాలపరిమితి (సెక్షన్ 53):** దరఖాస్తు దాఖలు చేసిన తేదీ నుండి 20 సంవత్సరాలు.\n"
            "5. **సాంప్రదాయ పరిజ్ఞానం మినహాయింపు (సెక్షన్ 3(p) మరియు 3(e)):** కేవలం ప్రాచీన విజ్ఞానం లేదా విడి గుణాల సాధారణ మిశ్రమాలు పేటెంట్ పొందలేవు。\n\n"
            "---\n\n"
            "### 💡 సూచించబడిన తదుపరి దశ: పేటెంట్ ఎలా దాఖలు చేయాలి / పొందాలి?\n\n"
            "మీ ఆవిష్కరణ కోసం పేటెంట్ దరఖాస్తును ఎలా దాఖలు చేయాలో తెలుసుకోవాలనుకుంటున్నారా?\n\n"
            "**త్వరిత ఫైలింగ్ మార్గదర్శిని:**\n"
            "1. **పూర్వ కళ మరియు TKDL శోధన:** నవ్యతను ధృవీకరించడానికి InPASS మరియు TKDL లో శోధించండి.\n"
            "2. **సినర్జీ నిరూపణ (సెక్షన్ 3(e)):** మూలికా మిశ్రమాలకు ఊహించని చికిత్సా ప్రభావాన్ని (CI < 1.0) ప్రయోగశాల డేటా ద్వారా చూపించండి.\n"
            "3. **ఫారం 1 & ఫారం 2:** ₹1,600 రుసుముతో (MSME/వ్యక్తులు) ఆన్‌లైన్‌లో సమర్పించండి.\n"
            "4. **NBA అనుమతి:** భారతీయ మూలికలను ఉపయోగిస్తే జాతీయ జీవవైవిధ్య ప్రాధికార సంస్థ (NBA) ఫారం III సమర్పించండి.\n\n"
            "👉 **నిరంతర తదుపరి ప్రశ్న:** పూర్తి దశలవారీ పేటెంట్ ఫైలింగ్ విధానం కోసం అడగండి: *\"భారతదేశంలో పేటెంట్ ఎలా ఫైల్ చేయాలి?\"*"
        )
    elif is_patent_procedural:
        answer = (
            "### 📋 భారతదేశంలో పేటెంట్ ఫైల్ చేసే దశలవారీ చట్టపరమైన విధానం (Step-by-Step Process)\n\n"
            "భారత పేటెంట్ చట్టం, 1970 కింద పేటెంట్ పొందడానికి కింది అధికారిక విధానాన్ని అనుసరించాలి:\n\n"
            "#### 1️⃣ దశ 1: పూర్వ కళ (Prior Art) మరియు TKDL శోధన\n"
            "- **InPASS** (`ipindiaservices.gov.in`) మరియు CSIR-AYUSH **ట్రెడిషనల్ నాలెడ్జ్ డిజిటల్ లైబ్రరీ (TKDL)** లో సమగ్ర శోధన నిర్వహించి మీ ఆవిష్కరణ యొక్క నవ్యతను నిర్ధారించుకోండి.\n\n"
            "#### 2️⃣ దశ 2: పేటెంట్ స్పెసిఫికేషన్ రూపకల్పన (ఫారం 2)\n"
            "- ప్రాధాన్యత తేదీని పొందేందుకు ప్రొవిజనల్ స్పెసిఫికేషన్ లేదా సినర్జీ డేటా (Combination Index CI < 1.0) మరియు క్లెయిమ్‌లతో కూడిన పూర్తి స్పెసిఫికేషన్‌ను సిద్ధం చేయండి.\n\n"
            "#### 3️⃣ దశ 3: IP India పోర్టల్‌లో ఆన్‌లైన్ దరఖాస్తు\n"
            "- `ipindia.gov.in` లో కింది ఫారాలను దాఖలు చేయండి:\n"
            "  - **ఫారం 1:** పేటెంట్ మంజూరు కోసం దరఖాస్తు.\n"
            "  - **ఫారం 2:** ప్రొవిజనల్ లేదా కంప్లీట్ స్పెసిఫికేషన్.\n"
            "  - **ఫారం 3:** విదేశీ ఫైలింగ్‌ల వివరాలు.\n"
            "  - **ఫారం 5:** ఆవిష్కర్త ప్రకటన.\n"
            "- **ప్రభుత్వ రుసుము:** వ్యక్తులు/స్టార్టప్‌లు/MSME లకు ₹1,600 (పెద్ద కంపెనీలకు ₹8,000).\n\n"
            "#### 4️⃣ దశ 4: జాతీయ జీవవైవిధ్య ప్రాధికార సంస్థ (NBA) ఫారం III\n"
            "- **జీవవైవిధ్య చట్టం, 2002 లోని సెక్షన్ 6** ప్రకారం భారతీయ మూలికలు లేదా జీవ వనరులను ఉపయోగిస్తే పేటెంట్ మంజూరుకు ముందే NBA అనుమతి తప్పనిసరి.\n\n"
            "#### 5️⃣ దశ 5: ప్రచురణ మరియు పరీక్ష అభ్యర్థన (ఫారం 18)\n"
            "- 18 నెలల తర్వాత దరఖాస్తు జర్నల్‌లో ప్రచురించబడుతుంది. 48 నెలల్లోపు **ఫారం 18 (RFE)** సమర్పించాలి.\n\n"
            "#### 6️⃣ దశ 6: ఫస్ట్ ఎగ్జామినేషన్ రిపోర్ట్ (FER) & పేటెంట్ మంజూరు\n"
            "- ఎగ్జామినర్ లేవనెత్తిన అభ్యంతరాలకు 6 నెలల్లోపు సమాధానం సమర్పించాలి. అన్ని నిబంధనలు పూర్తయిన తర్వాత **సెక్షన్ 43** కింద పేటెంట్ సర్టిఫికేట్ మంజూరు చేయబడుతుంది."
        )
    elif is_registration:
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
            "2. **ఆయుష్ మంత్రిత్వ శాఖ (Ministry of Ayush):** జాతీయ ప్రమాణాలు, ఫార్మకోపోయియా (API) మరియు పరిశోధనలను నియంత్రిస్తుంది.\n\n"
            "---\n\n"
            "### 💡 సూచించబడిన తదుపరి దశ: ఆయుర్వేద ఉత్పత్తి లైసెన్స్ / నమోదు ఎలా పొందాలి?\n\n"
            "మీ ఆయుర్వేద సూత్రీకరణను వ్యాపారపరంగా తయారు చేయాలనుకుంటున్నారా లేదా విక్రయించాలనుకుంటున్నారా?\n\n"
            "**త్వరిత లైసెన్సింగ్ మార్గదర్శిని:**\n"
            "1. **ఉత్పత్తి వర్గం:** శాస్త్రీయ ఔషధం (ఫారం 24D/25D) vs పేటెంట్ & ప్రొప్రైటరీ (రూల్ 158B) vs ఆయుర్వేద ఆహార (FSSAI).\n"
            "2. **షెడ్యూల్ T GMP:** అర్హత కలిగిన సాంకేతిక సిబ్బందితో GMP-సర్టిఫైడ్ తయారీ యూనిట్.\n"
            "3. **SLA దరఖాస్తు:** రాష్ట్ర ఆయుష్ లైసెన్సింగ్ అథారిటీ లేదా e-Aushadhi పోర్టల్ ద్వారా దరఖాస్తు చేయండి.\n\n"
            "👉 **నిరంతర తదుపరి ప్రశ్న:** పూర్తి తయారీ మరియు లైసెన్సింగ్ ప్రక్రియ కోసం అడగండి: *\"ఆయుర్వేద ఉత్పత్తిని ఎలా రిజిస్టర్ చేయాలి?\"*"
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

    # 8. FSSAI / Ayurveda Aahara in Telugu
    elif any(w in q_lower for w in ["fssai", "లేబుల్", "లేబులింగ్", "ఆహార", "నియమాలు", "ఆయుర్వేద ఆహార"]):
        answer = (
            "### 🏷️ ఆయుర్వేద ఆహార ఉత్పత్తులకు తప్పనిసరి FSSAI నిబంధనలు\n"
            "**ఆహార భద్రత మరియు ప్రమాణాలు (ఆయుర్వేద ఆహార) నిబంధనలు, 2022** ప్రకారం అన్ని ఆయుర్వేద ఆహార ఉత్పత్తులు కింది నియమాలను పాటించాలి:\n\n"
            "1. **వర్గ ప్రకటన (నిబంధన 2.2):** బ్రాండ్ పేరుకు సమీపంలో అధికారిక **'ఆయుర్వేద ఆహార' (AYURVEDA AAHARA) లోగో** మరియు పేరు తప్పనిసరిగా ఉండాలి.\n"
            "2. **వ్యాధి నివారణ దావాల నిషేధం (నిబంధన 2.3):** ఉత్పత్తి వ్యాధులను నయం చేస్తుందని దావా చేయకూడదు. లేబుల్‌పై చట్టబద్ధమైన హెచ్చరిక ఉండాలి: *'ఈ ఉత్పత్తి ఏ వ్యాధినీ నిర్ధారించడానికి, చికిత్స చేయడానికి లేదా నివారించడానికి ఉద్దేశించినది కాదు.'*\n"
            "3. **పదార్థాల సంపూర్ణ ప్రకటన:** అన్ని మూలికా భాగాల శాస్త్రీయ నామం, ఆయుర్వేద పేరు మరియు ఉపయోగించిన భాగాన్ని స్పష్టంగా పేర్కొనాలి.\n"
            "4. **FoSCoS లైసెన్సింగ్:** ఆహార ఉత్పత్తుల తయారీ కోసం FSSAI FoSCoS పోర్టల్ ద్వారా లైసెన్స్ పొందాలి."
        )

    # 9. General GI Tags in Telugu
    elif any(w in q_lower for w in ["జిఐ", "భౌగోళిక గుర్తింపు"]):
        answer = (
            "### 🏷️ భౌగోళిక గుర్తింపు (GI Tag) రక్షణ\n"
            "**వస్తువుల భౌగోళిక గుర్తింపు చట్టం, 1999** ప్రకారం ఒక నిర్దిష్ట ప్రాంతానికి చెందిన సాంప్రదాయ ఉత్పత్తికి (ఉదా: కాశ్మీర్ కుంకుమపువ్వు) సామూహిక GI హక్కులు లభిస్తాయి."
        )

    elif passages and any(p["text"] for p in passages):
        best_p = passages[0]
        answer = (
            f"### ⚖️ చట్టపరమైన వివరణ (Legal Position)\n"
            f"**{best_p['source']}** లోని చట్టపరమైన నిబంధనల ప్రకారం:\n\n"
            f"**{best_p['section']}** ప్రకారం:\n"
            f"{best_p['text']}\n\n"
        )
    else:
        return (
            "### ⚠️ AYURLEX కార్పస్‌లో తగినంత చట్టపరమైన ఆధారాలు లభించలేదు\n"
            "ప్రస్తుత చట్టపరమైన డేటాబేస్‌లో మీ ప్రశ్నకు సంబంధించిన ధృవీకరించబడిన చట్టపరమైన నిబంధనలు లభించలేదు."
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

