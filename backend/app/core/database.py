"""
backend/app/core/database.py
?????????????????????????????
Async SQLite database layer (Phase 2 local dev).
Provides the table schema for documents and chunks,
and a simple async session factory.

Swap DATABASE_URL to postgresql+asyncpg://... in .env to use pgvector.
The ORM models are compatible with both SQLite and PostgreSQL.
"""
from __future__ import annotations

import json
import uuid
from datetime import datetime
from typing import AsyncGenerator

from sqlalchemy import (
    Column, DateTime, Integer, String, Text, ForeignKey, JSON
)
from sqlalchemy.ext.asyncio import (
    AsyncSession, async_sessionmaker, create_async_engine
)
from sqlalchemy.orm import DeclarativeBase, relationship

from backend.app.core.config import settings

# ??? Engine ??????????????????????????????????????????????????????????????????

engine = create_async_engine(
    settings.database_url,
    echo=settings.debug,
    future=True,
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

# ??? Base ????????????????????????????????????????????????????????????????????

class Base(DeclarativeBase):
    pass

# ??? ORM Models ??????????????????????????????????????????????????????????????

class DocumentModel(Base):
    __tablename__ = "documents"

    id              = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    title           = Column(String, nullable=False)
    source_url      = Column(String, nullable=True)
    domain          = Column(String, nullable=False)
    jurisdiction    = Column(String, nullable=False)
    corpus_version  = Column(String, nullable=False, default="v1")
    language        = Column(String, nullable=False, default="en")
    created_at      = Column(DateTime, default=datetime.utcnow)

    chunks          = relationship("ChunkModel", back_populates="document",
                                   cascade="all, delete-orphan")


class ChunkModel(Base):
    __tablename__ = "chunks"

    id              = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    document_id     = Column(String, ForeignKey("documents.id"), nullable=False)
    chunk_index     = Column(Integer, nullable=False)
    text            = Column(Text, nullable=False)
    section_title   = Column(String, nullable=True)
    token_count     = Column(Integer, nullable=False, default=0)
    domain          = Column(String, nullable=False)
    jurisdiction    = Column(String, nullable=False)
    corpus_version  = Column(String, nullable=False, default="v1")
    language        = Column(String, nullable=False, default="en")
    page_number     = Column(Integer, nullable=True)
    # FAISS vector index is stored separately on disk;
    # this column stores the FAISS row id for fast lookup
    faiss_id        = Column(Integer, nullable=True)
    meta_json       = Column(JSON, nullable=True, default=dict)
    created_at      = Column(DateTime, default=datetime.utcnow)

    document        = relationship("DocumentModel", back_populates="chunks")


class QueryLogModel(Base):
    __tablename__ = "query_logs"

    id              = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    query_text      = Column(Text, nullable=False)
    language        = Column(String, nullable=True)
    domain          = Column(String, nullable=True)
    jurisdiction    = Column(String, nullable=True)
    bm25_scores     = Column(JSON, default=list)
    vector_scores   = Column(JSON, default=list)
    rrf_scores      = Column(JSON, default=list)
    reranked_scores = Column(JSON, default=list)
    llm_response    = Column(Text, nullable=True)
    latency_ms      = Column(Integer, nullable=True)
    corpus_version  = Column(String, default="v1")
    created_at      = Column(DateTime, default=datetime.utcnow)


# ??? Session dependency ???????????????????????????????????????????????????????

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """FastAPI dependency: yields an async DB session."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise


async def init_db() -> None:
    """Create all tables if they do not exist. Called at startup."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
