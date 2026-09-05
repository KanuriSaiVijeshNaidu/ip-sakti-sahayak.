"""
backend/app/llm/openai_llm.py
───────────────────────────────
OpenAI adapter (GPT-4o / GPT-4o-mini).
Activated when LLM_PROVIDER=openai in .env.
Requires: OPENAI_API_KEY set in .env
"""
from __future__ import annotations

import time
from backend.app.llm.base import BaseLLMAdapter, LLMResponse
from backend.app.core.config import settings


class OpenAILLMAdapter(BaseLLMAdapter):

    def __init__(self):
        try:
            from openai import AsyncOpenAI
            self._client = AsyncOpenAI(api_key=settings.openai_api_key)
            self._model = settings.openai_model   # "gpt-4o" or "gpt-4o-mini"
        except ImportError:
            raise RuntimeError(
                "openai package not installed. Run: pip install openai"
            )

    async def generate(
        self,
        query: str,
        context: str,
        language: str = "en",
        max_tokens: int = 1024,
    ) -> LLMResponse:
        t0 = time.perf_counter()

        messages = [
            {"role": "system", "content": self._system_prompt(language)},
            {"role": "user", "content": f"{context}\n\nQuestion: {query}"},
        ]

        response = await self._client.chat.completions.create(
            model=self._model,
            messages=messages,
            max_tokens=max_tokens,
            temperature=0.2,
        )

        latency_ms = int((time.perf_counter() - t0) * 1000)
        choice = response.choices[0]
        usage = response.usage

        return LLMResponse(
            answer=choice.message.content or "",
            model_used=self._model,
            prompt_tokens=usage.prompt_tokens if usage else 0,
            completion_tokens=usage.completion_tokens if usage else 0,
            latency_ms=latency_ms,
        )
