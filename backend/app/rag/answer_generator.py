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
            if lang == "ja":
                msg = (
                    "### ⚠️ 検索された特許証拠の不足\n"
                    "データベースから取得された特許証拠には、この質問に対する十分な技術的・法的根拠が含まれていません。\n\n"
                    f"**理由:** {crag.reason}\n\n"
                    "**推奨:** より具体的な特許番号、化合物名、または法域を指定して再検索してください。"
                )
            else:
                msg = (
                    "### ⚠️ Insufficient Patent Evidence in Corpus\n"
                    "The retrieved patent evidence does not provide sufficient technical or statutory basis "
                    "to answer this inquiry with certainty.\n\n"
                    f"**Reason:** {crag.reason}\n\n"
                    "**Recommendation:** Please refine your search by providing specific patent publication numbers, "
                    "formulation ingredients, or jurisdiction keywords."
                )
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
