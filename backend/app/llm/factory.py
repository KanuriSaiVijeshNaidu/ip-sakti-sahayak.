"""
backend/app/llm/factory.py
────────────────────────────
LLM adapter factory. Returns the right adapter based on LLM_PROVIDER in .env.
Singleton pattern — the adapter is instantiated once and reused.
"""
from __future__ import annotations

import logging
from backend.app.core.config import settings
from backend.app.llm.base import BaseLLMAdapter

logger = logging.getLogger(__name__)
_adapter: BaseLLMAdapter | None = None


def get_llm_adapter() -> BaseLLMAdapter:
    """Return the configured LLM adapter (singleton)."""
    global _adapter
    if _adapter is not None:
        return _adapter

    provider = settings.llm_provider.lower()
    logger.info(f"Initialising LLM adapter: provider={provider}")

    if provider == "openai":
        from backend.app.llm.openai_llm import OpenAILLMAdapter
        _adapter = OpenAILLMAdapter()
    elif provider == "ollama":
        from backend.app.llm.ollama_llm import OllamaLLMAdapter
        _adapter = OllamaLLMAdapter()
    else:
        from backend.app.llm.mock_llm import MockLLMAdapter
        _adapter = MockLLMAdapter()
        if provider != "mock":
            logger.warning(
                f"Unknown LLM_PROVIDER={provider!r}. Falling back to mock."
            )

    return _adapter
