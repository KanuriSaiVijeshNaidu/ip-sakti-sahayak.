"""
backend/app/llm/ollama_llm.py
───────────────────────────────
Ollama adapter for locally-hosted open models (llama3, mistral, etc.).
Activated when LLM_PROVIDER=ollama in .env.
Requires: Ollama running at OLLAMA_BASE_URL (default http://localhost:11434)
"""
from __future__ import annotations

import time
import httpx
from backend.app.llm.base import BaseLLMAdapter, LLMResponse
from backend.app.core.config import settings


class OllamaLLMAdapter(BaseLLMAdapter):

    def __init__(self):
        self._base_url = settings.ollama_base_url.rstrip("/")
        self._model = settings.ollama_model

    async def generate(
        self,
        query: str,
        context: str,
        language: str = "en",
        max_tokens: int = 1024,
    ) -> LLMResponse:
        t0 = time.perf_counter()

        prompt = (
            f"{self._system_prompt(language)}\n\n"
            f"{context}\n\n"
            f"Question: {query}\n\n"
            f"Answer:"
        )

        async with httpx.AsyncClient(timeout=120.0) as client:
            resp = await client.post(
                f"{self._base_url}/api/generate",
                json={
                    "model": self._model,
                    "prompt": prompt,
                    "stream": False,
                    "options": {"num_predict": max_tokens, "temperature": 0.2},
                },
            )
            resp.raise_for_status()
            data = resp.json()

        latency_ms = int((time.perf_counter() - t0) * 1000)
        return LLMResponse(
            answer=data.get("response", ""),
            model_used=self._model,
            prompt_tokens=data.get("prompt_eval_count", 0),
            completion_tokens=data.get("eval_count", 0),
            latency_ms=latency_ms,
        )
