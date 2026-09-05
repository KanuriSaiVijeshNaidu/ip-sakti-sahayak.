"""
backend/app/main.py
─────────────────────
FastAPI application factory for IP-SAKTI Sahayak.

Lifespan
────────
On startup:
  1. Create SQLite tables (init_db)
  2. Build BM25 index from all chunks
  3. Load BGE-M3 vector index (pre-embedded from embed_corpus script)
  4. Load cross-encoder reranker model
  5. Warm up LLM adapter (validates API keys / connectivity)

On shutdown: graceful cleanup (logging).

Routes
──────
  GET  /api/health
  POST /api/chat
  POST /api/product-guidance
  POST /api/admin/trace
"""
from __future__ import annotations

import logging
from contextlib import asynccontextmanager

import structlog
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.core.config import settings
from backend.app.core.logging import configure_logging

logger = structlog.get_logger(__name__)


# ─── Lifespan ─────────────────────────────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Build all retrieval indexes at startup."""
    configure_logging()
    logger.info("IP-SAKTI startup", version=settings.app_version, env=settings.app_env)

    # 1. Init database schema
    from backend.app.core.database import init_db
    await init_db()
    logger.info("Database schema ready")

    # 2. Build BM25 index
    from backend.app.retrieval.bm25_retriever import bm25_retriever
    await bm25_retriever.build()
    logger.info("BM25 index ready", chunks=len(bm25_retriever._chunks))

    # 3. Load vector index (pre-embedded; will embed if index missing)
    from backend.app.retrieval.vector_retriever import vector_retriever
    await vector_retriever.build(force_reembed=False)
    logger.info(
        "Vector index ready",
        vectors=vector_retriever._index.ntotal if vector_retriever._index else 0,
        dim=vector_retriever._dim,
    )

    # 4. Load cross-encoder reranker
    from backend.app.retrieval.reranker import reranker
    reranker.build()
    logger.info("Cross-encoder reranker ready")

    # 5. Warm up LLM adapter (no-op for mock; validates key for openai/ollama)
    from backend.app.llm.factory import get_llm_adapter
    llm = get_llm_adapter()
    logger.info("LLM adapter ready", provider=settings.llm_provider)

    logger.info("IP-SAKTI startup complete — all systems ready")
    yield

    logger.info("IP-SAKTI shutdown")


# ─── App factory ──────────────────────────────────────────────────────────────

def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.app_name,
        version=settings.app_version,
        description=(
            "IP-SAKTI Sahayak: Multilingual RAG-based AI assistant for "
            "Intellectual Property and AYUSH/FSSAI regulatory guidance."
        ),
        docs_url="/docs",
        redoc_url="/redoc",
        lifespan=lifespan,
    )

    # ── CORS ──────────────────────────────────────────────────────────────────
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.allowed_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # ── Routes ────────────────────────────────────────────────────────────────
    from backend.app.api.routes.chat import router as chat_router
    from backend.app.api.routes.product_guidance import router as pg_router
    from backend.app.api.routes.admin import router as admin_router
    from backend.app.api.routes.blockchain import router as blockchain_router

    prefix = settings.api_prefix  # "/api"
    app.include_router(chat_router, prefix=prefix, tags=["Chat"])
    app.include_router(pg_router, prefix=prefix, tags=["Product Guidance"])
    app.include_router(admin_router, prefix=prefix, tags=["Admin"])
    app.include_router(blockchain_router, prefix=prefix, tags=["Blockchain"])

    @app.get(f"{prefix}/health", tags=["Health"])
    async def health():
        from backend.app.models.schemas import HealthResponse
        from datetime import datetime
        from backend.app.blockchain.service import blockchain_service
        ledger_summary = blockchain_service.get_ledger_summary()
        return HealthResponse(
            status="ok",
            version=settings.app_version,
            environment=settings.app_env,
            timestamp=datetime.utcnow(),
            services={
                "bm25": "ready" if bm25_retriever.is_built() else "not_ready",
                "vector": "ready" if vector_retriever.is_built() else "not_ready",
                "reranker": "ready" if reranker.is_built() else "not_ready",
                "blockchain": "ready" if ledger_summary.chain_valid else "error",
                "llm": settings.llm_provider,
                "db": "sqlite",
            },
        )

    return app


# ─── Module-level refs (used in health route closure) ────────────────────────
from backend.app.retrieval.bm25_retriever import bm25_retriever
from backend.app.retrieval.vector_retriever import vector_retriever
from backend.app.retrieval.reranker import reranker

app = create_app()
