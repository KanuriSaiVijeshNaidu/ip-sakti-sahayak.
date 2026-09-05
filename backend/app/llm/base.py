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
    ) -> LLMResponse:
        """
        Generate an answer grounded in the provided context.

        Parameters
        ----------
        query    : The user question.
        context  : Pre-formatted legal evidence block from build_llm_context().
        language : Response language hint ("en", "hi", "ta", ...).
        max_tokens: Max tokens in response.
        """
        ...

    def _system_prompt(self, language: str = "en") -> str:
        """Shared system prompt used by all adapters enforcing strict grounding and procedural routing."""
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
            "3. INTENT CLASSIFICATION & RESPONSE FORMATTING:\n"
            "   - PROCEDURAL / REGISTRATION QUERIES ('How do I register / apply / get license for a product under Ayurveda'):\n"
            "     Provide a structured, step-by-step procedural roadmap: (1) Category Determination (Classical ASU Drug vs "
            "     Proprietary Medicine vs Ayurveda Aahara), (2) Regulatory Authority (State Licensing Authority SLA / AYUSH "
            "     e-Aushadhi vs FSSAI FoSCoS), (3) Mandatory Statutory Forms (Form 24D / 25D, Schedule T GMP Certificate Form 26D), "
            "     (4) Quality & Lab Testing (Heavy metals, microbial, stability), (5) Inspection & Approval Timeline. "
            "     DO NOT dump non-patentability rules (Section 3(p)/3(e)) unless patent protection is explicitly asked.\n"
            "   - DEFINITIONAL / CONCEPTUAL QUERIES ('What is Ayurveda / What is an ASU drug'):\n"
            "     Explain the statutory definition under Section 3(a) of the Drugs & Cosmetics Act 1940 and First Schedule "
            "     recognized texts, regulatory mandate under the Ministry of Ayush, and pharmacopoeial standards (API). "
            "     DO NOT confuse or dump patent bars.\n"
            "   - PATENTABILITY QUERIES ('Can I patent / novelty / invention'):\n"
            "     Evaluate Section 3(p) (TKDL prior art exclusion), Section 3(e) (admixture exclusion without proven synergy "
            "     CI < 1.0), Section 10(4) biological origin disclosure, and Biological Diversity Act Section 6 NBA approval.\n"
            "   - TRADEMARKS & GI QUERIES:\n"
            "     Address Nice Classification (Class 3, 5, 29, 30), Section 9 distinctiveness (barring generic herb names), "
            "     and collective community rights under the GI Act 1999.\n"
            "   - FSSAI AYURVEDA AAHARA QUERIES:\n"
            "     Cite Regulation 2.2 (logo & category name), Regulation 2.3 (strict prohibition on disease cure/prevention claims), "
            "     Schedule A authoritative texts, and Schedule II heavy metal thresholds.\n"
            "4. CITATION REQUIREMENT: Cite every statutory provision using its citation key `[src-N]`.\n"
            f"5. OUTPUT LANGUAGE: Always respond comprehensively in language: {language}.\n"
        )
