"""
backend/app/retrieval/bm25_retriever.py
────────────────────────────────────────
BM25Okapi lexical retriever for IP-SAKTI.

Loads all chunks from SQLite at startup, builds a BM25 index in memory,
and returns ranked candidates with domain/jurisdiction metadata for the
RRF fusion step.

Design notes
------------
- Uses rank_bm25.BM25Okapi (Robertson/Okapi variant).
- Tokenises with NLTK word_tokenize + stopword removal (English only).
  Hindi/multilingual tokenisation is a Phase 3.1 enhancement.
- Index is rebuilt on demand via rebuild() or at startup.
- Thread-safe for concurrent FastAPI requests (index is read-only after build).
"""
from __future__ import annotations

import asyncio
import logging
import re
import string
from dataclasses import dataclass
from typing import List, Optional

import nltk
from rank_bm25 import BM25Okapi
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.core.config import settings
from backend.app.core.database import AsyncSessionLocal, ChunkModel

logger = logging.getLogger(__name__)

# Download NLTK data once (idempotent, safe to call repeatedly)
import nltk as _nltk_mod
_nltk_mod.download("punkt_tab", quiet=True)
_nltk_mod.download("punkt", quiet=True)
_nltk_mod.download("stopwords", quiet=True)

from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

_STOPWORDS_EN = set(stopwords.words("english"))
_PUNCT = set(string.punctuation)


# ─── Data model ───────────────────────────────────────────────────────────────

@dataclass
class BM25Candidate:
    chunk_id: str
    text: str
    score: float
    domain: str
    jurisdiction: str
    section_title: str
    source_title: str
    corpus_version: str
    faiss_id: Optional[int] = None


# ─── Tokeniser ────────────────────────────────────────────────────────────────

def _tokenize(text: str) -> list[str]:
    """Lowercase, word-tokenize, remove stopwords and punctuation."""
    text = text.lower()
    # Remove decorative characters (unicode box chars etc.)
    text = re.sub(r"[^\x00-\x7F]+", " ", text)
    tokens = word_tokenize(text)
    return [
        t for t in tokens
        if t not in _STOPWORDS_EN and t not in _PUNCT and len(t) > 1
    ]


# ─── BM25 Retriever ───────────────────────────────────────────────────────────

class BM25Retriever:
    """
    In-memory BM25Okapi index over all ingested chunks.
    Call await retriever.build() before first use.
    """

    def __init__(self):
        self._index: Optional[BM25Okapi] = None
        self._chunks: list[dict] = []   # parallel list to the BM25 corpus
        self._built = False

    # ── Build / rebuild ───────────────────────────────────────────────────────

    async def build(self) -> None:
        """Load all chunks from DB and build BM25 index."""
        from sqlalchemy.orm import joinedload

        logger.info("Building BM25 index ...")
        async with AsyncSessionLocal() as session:
            result = await session.execute(select(ChunkModel).options(joinedload(ChunkModel.document)))
            rows = result.scalars().all()

        if not rows:
            logger.warning("No chunks in DB — BM25 index will be empty.")
            self._chunks = []
            self._index = None
            self._built = True
            return

        corpus_tokens: list[list[str]] = []
        self._chunks = []

        for row in rows:
            tokens = _tokenize(row.text)
            corpus_tokens.append(tokens if tokens else ["<empty>"])
            self._chunks.append({
                "chunk_id": row.id,
                "text": row.text,
                "domain": row.domain,
                "jurisdiction": row.jurisdiction,
                "section_title": row.section_title or "",
                "source_title": row.document.title if (hasattr(row, "document") and row.document) else "",
                "corpus_version": row.corpus_version,
                "faiss_id": row.faiss_id,
            })

        self._index = BM25Okapi(corpus_tokens)
        self._built = True
        logger.info(f"BM25 index built: {len(self._chunks)} chunks")

    def is_built(self) -> bool:
        return self._built

    # ── Search ────────────────────────────────────────────────────────────────

    def search(
        self,
        query: str,
        top_k: int | None = None,
        domain: str | None = None,
        jurisdiction: str | None = None,
    ) -> list[BM25Candidate]:
        """
        Returns ranked BM25Candidate list.

        Parameters
        ----------
        query        : Natural-language query string.
        top_k        : Max candidates to return (default: settings.bm25_top_k).
        domain       : Optional domain filter ("patents", "fssai", ...).
        jurisdiction : Optional jurisdiction filter ("IN", "WO", ...).
        """
        if not self._built or self._index is None:
            logger.warning("BM25 index not built — returning empty results.")
            return []

        top_k = top_k or settings.bm25_top_k
        query_tokens = _tokenize(query)
        if not query_tokens:
            query_tokens = query.lower().split()

        scores: list[float] = self._index.get_scores(query_tokens).tolist()

        # Pair with metadata and apply filters
        candidates: list[BM25Candidate] = []
        for chunk_meta, score in zip(self._chunks, scores):
            if score <= 0:
                continue
            if domain and domain != "auto" and chunk_meta["domain"] != domain:
                continue
            if jurisdiction and jurisdiction != "auto" and chunk_meta["jurisdiction"] != jurisdiction:
                continue
            candidates.append(BM25Candidate(
                chunk_id=chunk_meta["chunk_id"],
                text=chunk_meta["text"],
                score=float(score),
                domain=chunk_meta["domain"],
                jurisdiction=chunk_meta["jurisdiction"],
                section_title=chunk_meta["section_title"],
                source_title=chunk_meta["source_title"],
                corpus_version=chunk_meta["corpus_version"],
                faiss_id=chunk_meta["faiss_id"],
            ))

        candidates.sort(key=lambda c: c.score, reverse=True)
        return candidates[:top_k]


# ─── Module-level singleton ───────────────────────────────────────────────────

bm25_retriever = BM25Retriever()
