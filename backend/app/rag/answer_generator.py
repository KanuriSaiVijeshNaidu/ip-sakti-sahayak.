"""
backend/app/rag/answer_generator.py
───────────────────────────────────
LLM generation module for Phase 6 RAG pipeline.
Coordinates with configured LLM adapters (OpenAI, Ollama, or Mock) to synthesize
strictly evidence-grounded patent intelligence answers with explicit citation tags [E1], [E2].
"""
from __future__ import annotations

import logging
import asyncio
from typing import List, Tuple, Optional
from backend.app.core.config import settings
from backend.app.llm.factory import get_llm_adapter
from backend.app.models.retrieval_schemas import QueryAnalysis
from backend.app.models.rag_schemas import CitationInfo, CRAGAssessment
from backend.app.rag.config import rag_config

logger = logging.getLogger(__name__)


def build_system_prompt(language: str, jurisdictions: List[str]) -> str:
    jurs_str = ", ".join(jurisdictions)
    return (
        "You are AYURLEX, an expert Patent Intelligence and Regulatory Decision-Support AI.\n\n"
        "### STRICT GROUNDING & JURISDICTION RULES:\n"
        f"1. AUTHORIZED JURISDICTIONS: [{jurs_str}]. You must answer ONLY from the supplied evidence chunks.\n"
        "2. ZERO FABRICATION: Never invent patent numbers, application statuses, filing dates, claims, legal clearances, or commercialization rights.\n"
        "3. CITATION PROTOCOL: You must cite every factual statement with its exact citation tag, e.g. [E1], [E2].\n"
        "   Do NOT use nonexistent tags like [E99]. Cite ONLY tags present in the provided evidence.\n"
        "4. JURISDICTION ATTRIBUTION: In comparison or multi-jurisdiction queries, explicitly state which jurisdiction each fact pertains to.\n"
        "5. COMMERCIALIZATION & FREEDOM-TO-OPERATE: Never declare that an applicant 'can legally sell' or has 'freedom to operate' merely because a patent disclosure exists.\n"
        "6. INSUFFICIENT EVIDENCE: If the provided evidence does not fully answer the question, state what is disclosed and clearly state what cannot be determined.\n"
        f"7. OUTPUT LANGUAGE: Respond in language code '{language}'. If the user asks in Japanese, answer in Japanese while maintaining US/EP/WO/JP citation references accurately.\n"
    )


def format_insufficient_evidence(lang: str, jurs: List[str], reason: str, query: str) -> str:
    jurs_str = ", ".join(jurs) if jurs else "Global"
    
    authorities_map = {
        "IN": "Controller General of Patents, Designs and Trade Marks (CGPDTM / InPASS: ipindiaservices.gov.in) and Ministry of Ayush (ayush.gov.in)",
        "US": "United States Patent and Trademark Office (USPTO Patent Center: patentcenter.uspto.gov) and US FDA (fda.gov)",
        "EP": "European Patent Office (EPO Espacenet: worldwide.espacenet.com) and European Medicines Agency (EMA)",
        "JP": "日本国特許庁 (JPO / J-PlatPat: j-platpat.inpit.go.jp) 及び 医薬品医療機器総合機構 (PMDA)",
        "WO": "World Intellectual Property Organization (WIPO Patentscope: patentscope.wipo.int)",
    }
    auth_str = authorities_map.get(jurs[0] if jurs else "IN", authorities_map["IN"])

    if lang == "te":
        return f"""### ⚠️ ధృవీకరించబడిన ఆధారాలు సరిపోవు (Insufficient Verified Evidence)
**న్యాయ పరిధి:** {jurs_str}

AYURLEX కార్పస్‌లో మీ ప్రశ్నకు సంబంధించి చట్టబద్ధమైన మరియు ఖచ్చితమైన సమాధానం ఇవ్వడానికి తగినంత ప్రామాణిక ఆధారాలు లభించలేదు.

#### 1. కార్పస్‌లో గుర్తించబడిన పరిస్థితి:
- **కారణం:** {reason}
- మా **యాంటీ-హాలూసినేషన్ పాలసీ** (`ఆధారం లేనిదే — సమాధానం లేదు`) ప్రకారం, ఊహాజనిత లేదా ధృవీకరించని సమాధానాలను AYURLEX అందించదు.

#### 2. సమాధానం కోసం అవసరమైన వివరాలు:
- సంబంధిత పేటెంట్ లేదా దరఖాస్తు సంఖ్య (Application / Patent Number).
- నిర్దిష్ట మూలికా సూత్రీకరణ (Botanical ingredients & standardized extracts).
- లక్ష్యిత నియంత్రణ వర్గం (Ayurvedic Medicine vs Ayurveda Aahara / Dietary Supplement).

#### 3. సంప్రదించవలసిన అధికారిక సంస్థ:
- **అధికారిక రిజిస్ట్రీ:** {auth_str}
- అధికారిక చట్టపరమైన నిర్ధారణ కోసం పై పోర్టల్‌ను లేదా రిజిస్టర్డ్ పేటెంట్ అటార్నీని సంప్రదించండి."""

    elif lang == "hi":
        return f"""### ⚠️ अपर्याप्त सत्यापित वैधानिक साक्ष्य (Insufficient Verified Evidence)
**अधिकार क्षेत्र:** {jurs_str}

AYURLEX डेटाबेस में आपके प्रश्न का निश्चित एवं कानूनी रूप से बाध्यकारी उत्तर देने के लिए पर्याप्त प्रामाणिक साक्ष्य उपलब्ध नहीं हैं।

#### 1. डेटाबेस विश्लेषण स्थिति:
- **कारण:** {reason}
- हमारी **सख्त गैर-काल्पनिक नीति** (`पर्याप्त साक्ष्य नहीं = कोई उत्तर नहीं`) के अनुसार, सामान्य ज्ञान से अनुमानित उत्तर नहीं दिए जाते हैं।

#### 2. सटीक उत्तर के लिए आवश्यक जानकारी:
- विशिष्ट पेटेंट आवेदन संख्या या प्रकाशन संख्या (Patent Publication Number).
- वानस्पतिक सामग्री और मानकीकृत अर्क (Standardized Herbal Extracts & marker compounds).
- नियामक श्रेणी (आयुर्वेदिक औषधि, आहार पूरक, या पेटेंट दावा).

#### 3. अनुशंसित आधिकारिक निकाय:
- **आधिकारिक रजिस्ट्री:** {auth_str}
- कानूनी रूप से मान्य परामर्श के लिए कृपया आधिकारिक राष्ट्रीय पेटेंट कार्यालय अथवा पंजीकृत पेटेंट अटॉर्नी से संपर्क करें।"""

    elif lang == "ta":
        return f"""### ⚠️ சரிபார்க்கப்பட்ட சட்டப்பூர்வ சான்றுகள் போதுமானதாக இல்லை (Insufficient Verified Evidence)
**நீதி வரம்பு:** {jurs_str}

AYURLEX தரவுத்தளத்தில் உங்கள் கேள்விக்கு சட்டப்பூர்வமாக துல்லியமான பதிலை வழங்குவதற்கான போதுமான அதிகாரப்பூர்வ ஆவணங்கள் கிடைக்கவில்லை.

#### 1. தரவுத்தள ஆய்வு நிலை:
- **காரணம்:** {reason}
- எங்களின் **உறுதியான உண்மை வழிகாட்டுதல் விதி** (`போதிய ஆதாரங்கள் இன்றி — பதில்கள் இல்லை`) படி, கற்பனையான அல்லது யூகமான பதில்கள் வழங்கப்பட மாட்டாது.

#### 2. சரியான தீர்வுக்கு தேவையான விவரங்கள்:
- குறிப்பிட்ட காப்புரிமை விண்ணப்ப எண் (Patent Application / Grant Number).
- மூலிகைக் கலவை மற்றும் சாறு விவரங்கள் (Botanical formulation details & extracts).
- ஒழுங்குமுறை வகைப்பாடு (ஆயுர்வேத மருந்து அல்லது உணவு துணைப்பொருள்).

#### 3. தொடர்பு கொள்ள வேண்டிய அதிகாரப்பூர்வ அமைப்பு:
- **அதிகாரப்பூர்வ காப்புரிமைப் பதிவகம்:** {auth_str}
- கூடுதல் அதிகாரப்பூர்வ ஆலோசனைகளுக்கு சம்பந்தப்பட்ட தேசிய காப்புரிமை அலுவலகத்தை அல்லது தகுதிவாய்ந்த வழக்கறிஞரை அணுகவும்."""

    elif lang == "ja":
        return f"""### ⚠️ 検証済み特許証拠の不足（Insufficient Verified Evidence）
**対象法域:** {jurs_str}

AYURLEXコーパスから検索された公報および法令データには、この質問に対して確定的な回答を構成するのに十分な技術的・法的根拠が含まれていません。

#### 1. 検索結果および不足の理由:
- **判定理由:** {reason}
- 当システムの**厳格な反幻覚ポリシー**（`十分な証拠なし＝実質的回答なし`）に基づき、学習データの記憶からの推測や未検証の引用生成は行いません。

#### 2. 回答を特定するために必要な追加情報:
- 具体的な特許出願番号または公開公報番号（Publication Number）
- 対象とする生薬配合・標準化エキスおよび有効成分の特定
- 申請区分（医薬品、医薬部外品、機能性表示食品、または特定保健用食品）

#### 3. 参照すべき公式当局・特許庁:
- **管轄機関:** {auth_str}
- 法的権利の確認および出願手続きについては、上記公式特許情報プラットフォームまたは認定弁理士にご相談ください。"""

    else:
        return f"""### ⚠️ Insufficient Verified Evidence in Corpus
**Target Jurisdiction:** {jurs_str}

The AYURLEX evidence corpus does not contain sufficient authoritative statutory or patent evidence to synthesize a conclusive answer to this inquiry without speculation.

#### 1. Verification Finding:
- **Reason:** {reason}
- In compliance with our **Anti-Hallucination Policy** (`NO SUFFICIENT EVIDENCE = NO SUBSTANTIVE ANSWER`), AYURLEX will not extrapolate from general model pretraining or manufacture unverified citations.

#### 2. Information Required to Proceed:
- Specific patent publication number (e.g. IN/US/EP/JP/WO application number).
- Exact botanical ingredients, standardized extracts, or marker compound percentages.
- Regulatory filing category (e.g. ASU proprietary medicine, dietary supplement, botanical drug substance).

#### 3. Recommended Authoritative Registries:
- **Official Authority:** {auth_str}
- Please consult the official statutory intellectual property portal or licensed patent counsel for formal determination."""


class AnswerGenerator:
    """
    Synthesizes citation-bound answers using the active LLM adapter with fallback safety.
    """

    async def generate(
        self,
        query: str,
        query_analysis: QueryAnalysis,
        crag: CRAGAssessment,
        citations: List[CitationInfo],
        llm_context: str,
    ) -> Tuple[str, str]:
        """
        Generates grounded response.
        Returns:
            (generated_text, generation_status)
        """
        lang = query_analysis.detected_language
        jurs = query_analysis.jurisdictions

        # Case 1: Insufficient or Invalid Evidence
        if crag.status == "INSUFFICIENT":
            msg = format_insufficient_evidence(lang, jurs, crag.reason, query)
            return msg, "INSUFFICIENT_EVIDENCE"

        if crag.status == "INVALID":
            msg = (
                "### ❌ Evidence Validation Failure\n"
                f"The retrieval pipeline aborted due to a security/jurisdiction safety policy violation: {crag.reason}"
            )
            return msg, "VALIDATION_FAILED"

        # Case 2: Legal Guarantee / Commercialization Queries (Safety Guard)
        q_lower = query.lower()
        if any(w in q_lower for w in ["can i legally sell", "can i sell", "freedom to operate", "販売できるか"]):
            c_tags = " ".join(f"[{c.citation_id}]" for c in citations[:3])
            if lang == "ja":
                msg = (
                    "### ⚖️ 商用販売・特許権に関する法的留意点\n"
                    f"取得された特許公報 {c_tags} は先行技術および公開された技術仕様を開示していますが、"
                    "これらは法的な商用販売許可や他社特許非侵害（FTO）を保証するものではありません。\n\n"
                    "- 取得された証拠は技術的開示事項を証明するものです。\n"
                    "- 商用販売に際しては、管轄当局（FDA、PMDA等）の許認可規制および第三者特許クリアランスを別途専門弁理士に確認する必要があります。"
                )
            else:
                msg = (
                    "### ⚖️ Legal Disclaimer & Patent Scope Notice\n"
                    f"The retrieved patent publications {c_tags} disclose relevant prior art and technical specifications, "
                    "but patent publication alone does not grant statutory freedom-to-operate or legal authorization to commercially sell this formulation.\n\n"
                    "- Retrieved documents establish prior published disclosures and claim scopes.\n"
                    "- Commercialization requires independent regulatory marketing approval (e.g. FDA, PMDA) and formal freedom-to-operate patent clearance by licensed patent counsel."
                )
            return msg, "SUCCESS"

        # Case 3: Standard Grounded Synthesis
        try:
            adapter = get_llm_adapter()
            prompt = (
                f"{build_system_prompt(lang, jurs)}\n\n"
                f"### RETRIEVED PATENT EVIDENCE CHUNKS:\n"
                f"{llm_context}\n\n"
                f"### USER QUERY:\n{query}\n\n"
                f"Synthesize an authoritative, structured, and factually grounded response citing each claim with [E1], [E2], etc."
            )

            # Execution with timeout protection
            coro = adapter.generate(
                query=query,
                context=llm_context,
                language=lang,
                max_tokens=rag_config.max_generation_tokens,
                jurisdiction=jurs[0] if jurs else "US",
            )
            llm_resp = await asyncio.wait_for(coro, timeout=rag_config.generation_timeout_seconds)
            raw_answer = llm_resp.answer if hasattr(llm_resp, "answer") else str(llm_resp)

            # If mock or base adapter produced empty output, build deterministic grounded synthesis
            if not raw_answer or "mock" in settings.llm_provider.lower():
                raw_answer = self._synthesize_deterministic_grounding(query, citations, lang, jurs)

            return raw_answer, "SUCCESS"

        except asyncio.TimeoutError:
            logger.error("LLM generation timed out.")
            fallback = self._synthesize_deterministic_grounding(query, citations, lang, jurs)
            return fallback, "GENERATION_UNAVAILABLE"
        except Exception as e:
            logger.error(f"Error during LLM generation: {e}")
            fallback = self._synthesize_deterministic_grounding(query, citations, lang, jurs)
            return fallback, "GENERATION_UNAVAILABLE"

    def _synthesize_deterministic_grounding(
        self,
        query: str,
        citations: List[CitationInfo],
        language: str,
        jurisdictions: List[str],
    ) -> str:
        """Deterministic grounding fallback for mock or offline operation."""
        if not citations:
            return "No evidence available."

        first = citations[0]
        other_cites = citations[1:4]

        if language == "te":
            lines = [
                f"### 📋 ధృవీకరించబడిన చట్టపరమైన ఆధారాల విశ్లేషణ (న్యాయ పరిధి: {', '.join(jurisdictions)})\n",
                f"అధికారిక రికార్డు [{first.citation_id}] ({first.publication_number}, న్యాయ పరిధి: {first.jurisdiction}, సెక్షన్: {first.section}) ప్రకారం, "
                f"*'{first.title or 'చట్టబద్ధమైన పత్రం'}'* క్రింది సాంకేతిక & చట్టపరమైన అంశాలను నిర్దేశిస్తుంది [{first.citation_id}]:\n",
                f"> {first.text[:280]}... [{first.citation_id}]\n",
            ]
            if other_cites:
                lines.append("\n**అనుబంధ ధృవీకరణ ఆధారాలు:**\n")
                for c in other_cites:
                    lines.append(f"- **{c.publication_number}** ({c.jurisdiction}, {c.section}): {c.title or 'చట్టబద్ధమైన పత్రం'} [{c.citation_id}]")
            return "\n".join(lines)

        if language == "hi":
            lines = [
                f"### 📋 सत्यापित वैधानिक साक्ष्य विश्लेषण (अधिकार क्षेत्र: {', '.join(jurisdictions)})\n",
                f"प्रामाणिक दस्तावेज़ [{first.citation_id}] ({first.publication_number}, अधिकार क्षेत्र: {first.jurisdiction}, अनुभाग: {first.section}) के अनुसार, "
                f"*'{first.title or 'वैधानिक दस्तावेज़'}'* निम्नलिखित कानूनी व तकनीकी तथ्यों को निर्धारित करता है [{first.citation_id}]:\n",
                f"> {first.text[:280]}... [{first.citation_id}]\n",
            ]
            if other_cites:
                lines.append("\n**संबंधित संपोषक साक्ष्य:**\n")
                for c in other_cites:
                    lines.append(f"- **{c.publication_number}** ({c.jurisdiction}, {c.section}): {c.title or 'वैधानिक संदर्भ'} [{c.citation_id}]")
            return "\n".join(lines)

        if language == "ta":
            lines = [
                f"### 📋 சரிபார்க்கப்பட்ட சட்டப்பூர்வ சான்றுகள் பகுப்பாய்வு (நீதி வரம்பு: {', '.join(jurisdictions)})\n",
                f"அதிகாரப்பூர்வ ஆவணம் [{first.citation_id}] ({first.publication_number}, நீதி வரம்பு: {first.jurisdiction}, பிரிவு: {first.section}) இன் படி, "
                f"*'{first.title or 'சட்டப்பூர்வ ஆவணம்'}'* பின்வரும் தொழில்நுட்ப மற்றும் சட்ட விதிகளை விவரிக்கிறது [{first.citation_id}]:\n",
                f"> {first.text[:280]}... [{first.citation_id}]\n",
            ]
            if other_cites:
                lines.append("\n**தொடர்புடைய கூடுதல் சான்றுகள்:**\n")
                for c in other_cites:
                    lines.append(f"- **{c.publication_number}** ({c.jurisdiction}, {c.section}): {c.title or 'சட்டக் குறிப்பு'} [{c.citation_id}]")
            return "\n".join(lines)

        if language == "ja":
            lines = [
                f"### 📋 特許証拠分析結果（管轄: {', '.join(jurisdictions)}）\n",
                f"取得された特許文献 [{first.citation_id}] ({first.publication_number}、管轄: {first.jurisdiction}、セクション: {first.section}) によると、"
                f"表題「{first.title or '特許開示'}」において次の技術的事項が開示されています [{first.citation_id}]：\n",
                f"> {first.text[:280]}... [{first.citation_id}]\n",
            ]
            if other_cites:
                lines.append("\n**関連する補足証拠:**\n")
                for c in other_cites:
                    lines.append(f"- **{c.publication_number}** ({c.jurisdiction}, {c.section}): {c.title or '技術文献'} [{c.citation_id}]")
            return "\n".join(lines)

        lines = [
            f"### 📋 Patent Evidence Analysis (Jurisdiction: {', '.join(jurisdictions)})\n",
            f"Based on the retrieved patent disclosure [{first.citation_id}] ({first.publication_number}, jurisdiction: {first.jurisdiction}, section: {first.section}), "
            f"the document titled *'{first.title or 'Patent Disclosure'}'* specifies the following technical disclosures [{first.citation_id}]:\n",
            f"> {first.text[:300]}... [{first.citation_id}]\n",
        ]
        if other_cites:
            lines.append("\n**Corroborating Retrieved Evidence:**\n")
            for c in other_cites:
                lines.append(f"- **{c.publication_number}** ({c.jurisdiction}, {c.section}): {c.title or 'Patent Specification'} [{c.citation_id}]")

        return "\n".join(lines)


answer_generator = AnswerGenerator()
