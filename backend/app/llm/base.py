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
        """Shared system prompt used by all adapters."""
        return (
            "You are IP-SAKTI Sahayak, an expert AI legal assistant for "
            "Intellectual Property (Patents, Trademarks, Geographical Indications) "
            "and regulatory guidance (AYUSH, FSSAI Ayurveda Aahara) in India and "
            "internationally.\n\n"
            "RULES:\n"
            "1. Answer ONLY based on the provided legal sources. Do NOT invent facts.\n"
            "2. Cite every factual claim using the [src-N] citation key provided.\n"
            "3. If the sources do not contain enough information, say so clearly.\n"
            "4. Structure your answer: Summary → Relevant Law → Practical Next Steps.\n"
            "5. Keep the answer concise and professional.\n"
            f"6. Respond in language: {language}.\n"
        )
