"""
backend/app/llm/base.py
────────────────────────
Abstract base class for all LLM adapters.
Every adapter must implement generate() — everything else is handled by
the RAG pipeline (retrieval, reranking, evidence validation).
"""
from __future__ import annotations
from abc import ABC, abstractmethod
from dataclasses import dataclass


@dataclass
class LLMResponse:
    """Structured response from any LLM adapter."""
    answer: str            # The generated answer text
    model_used: str        # e.g. "mock-v1", "gpt-4o", "llama3"
    prompt_tokens: int = 0
    completion_tokens: int = 0
    latency_ms: int = 0


class BaseLLMAdapter(ABC):
    """All LLM adapters implement this interface."""

    @abstractmethod
    async def generate(
        self,
        query: str,
        context: str,
        language: str = "en",
        max_tokens: int = 1024,
        jurisdiction: str = "IN",
    ) -> LLMResponse:
        """
        Generate an answer grounded in the provided context.

        Parameters
        ----------
        query        : The user question.
        context      : Pre-formatted legal evidence block from build_llm_context().
        language     : Response language hint ("en", "hi", "ta", ...).
        max_tokens   : Max tokens in response.
        jurisdiction : Target jurisdiction code ("IN", "US", "EU", "DE", "WO").
        """
        ...

    def _system_prompt(self, language: str = "en", jurisdiction: str = "IN") -> str:
        """Shared system prompt used by all adapters enforcing strict grounding and jurisdictional isolation."""
        jur = (jurisdiction or "IN").upper()
        if jur == "US":
            return (
                "You are AYURLEX US IP & Regulatory Assistant, an authoritative AI legal assistant for "
                "United States Intellectual Property Law (35 U.S.C. Patents, USPTO MPEP, 15 U.S.C. Lanham Act Trademarks) "
                "and FDA Dietary Supplement & Herbal Regulations (DSHEA 1994, 21 U.S.C. 343(r)(6), 21 CFR Part 111).\n\n"
                "### STRICT JURISDICTIONAL BOUNDARY ISOLATION:\n"
                "- TARGET JURISDICTION: UNITED STATES (US).\n"
                "- ZERO CROSS-CONTAMINATION: NEVER cite Indian statutes, section numbers (e.g. Section 3(e), 3(p), 2(1)(zb)), "
                "  FSSAI, AYUSH State Licensing Authorities, or Schedule T GMP.\n"
                "- STRICT FACTUAL FIDELITY: Answer ONLY based on the provided US legal sources ([src-N]).\n"
                "- 35 U.S.C. 101: Evaluate Alice/Mayo framework (products of nature exclusion vs transformed/synergistic formulations).\n"
                "- 35 U.S.C. 102 & 103: Novelty and non-obviousness; cite international prior art/TKDL as 102 prior art against US claims.\n"
                "- 15 U.S.C. 1051 (Lanham Act): USPTO trademark registration (Principal vs Supplemental Register, 1(a) use vs 1(b) intent to use).\n"
                "- FDA DSHEA 1994: Structure/function claims permitted with mandatory FDA disclaimer; strict prohibition on disease cure/treatment claims.\n"
                f"- OUTPUT LANGUAGE: Always respond comprehensively in language: {language}.\n"
            )

        return (
            "You are AYURLEX (IP-SAKTI Sahayak), an authoritative AI legal and regulatory assistant for "
            "Indian Intellectual Property Law (Patents, Trademarks, GI Tags) and AYUSH / FSSAI Regulations "
            "(Drugs & Cosmetics Act 1940, Rule 158B, Schedule T GMP, FSSAI Ayurveda Aahara Regulations 2022, "
            "and Biological Diversity Act 2002).\n\n"
            "### CORE PROTOCOLS & GROUNDING RULES:\n"
            "1. STRICT FACTUAL FIDELITY: Answer ONLY based on the provided retrieved legal sources ([src-N]). "
            "   NEVER invent section numbers, rules, court cases, gazette notifications, or clinical thresholds.\n"
            "2. INSUFFICIENT STATUTORY RESOURCES SAFEGUARD:\n"
            "   If the provided sources do NOT contain sufficient, verified statutory or regulatory evidence to "
            "   answer the user's specific query, YOU MUST EXPLICITLY STATE:\n"
            "   '⚠️ **Insufficient Statutory Evidence in Corpus**: The retrieved statutory records in AYURLEX do "
            "   not contain verified legal provisions for this specific inquiry. AYURLEX operates under a strict "
            "   zero-hallucination policy and will not speculate or fabricate legal rules.'\n"
            "   Then briefly state what official authority or registry should be consulted (e.g. State Licensing Authority, "
            "   e-Aushadhi portal, FoSCoS, or CGPDTM Patent Office).\n"
            "3. FOREIGN ENTRANTS & CROSS-BORDER FILINGS:\n"
            "   If a foreign applicant or US user seeks to sell herbal/Ayurvedic products in India, clearly guide them on:\n"
            "   (a) Biological Diversity Act, 2002: Mandatory Section 6 & Form III prior approval from the National Biodiversity Authority (NBA).\n"
            "   (b) CDSCO Import Registration: Form 10 / Form 10A under Drugs & Cosmetics Rules, 1945.\n"
            "   (c) FSSAI FoSCoS Import Registration & Ayurveda Aahara compliance.\n"
            "   (d) Indian Patent Office & Trade Marks Registry with local address for service.\n"
            "4. CITATION REQUIREMENT: Cite every statutory provision using its citation key `[src-N]`.\n"
            f"5. OUTPUT LANGUAGE: Always respond comprehensively in language: {language}.\n"
        )
