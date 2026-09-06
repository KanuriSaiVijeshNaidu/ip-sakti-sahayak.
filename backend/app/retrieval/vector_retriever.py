"""
backend/app/retrieval/vector_retriever.py
──────────────────────────────────────────
BGE-M3 multilingual dense vector retriever for IP-SAKTI.

What it does
────────────
1. Loads the BAAI/bge-m3 SentenceTransformer model (1024-dim, multilingual).
2. Embeds all chunks in the DB, stores vectors in FAISS (replacing the
   Phase 2 placeholder zero-vectors).
3. At query time, embeds the query and does ANN search in FAISS.
4. Returns VectorCandidate list with cosine similarity scores.

FAISS index type: IndexFlatIP (inner product on L2-normalised vectors
= cosine similarity). For production scale, swap to IndexHNSWFlat.

Model fallback: if BGE-M3 is not downloaded yet, falls back to
'all-MiniLM-L6-v2' (90MB) automatically for development.
"""
from __future__ import annotations

import json
import logging
from dataclasses import dataclass
from pathlib import Path
from typing import Optional

import numpy as np
from sqlalchemy import select

from backend.app.core.config import settings
from backend.app.core.database import AsyncSessionLocal, ChunkModel

logger = logging.getLogger(__name__)

FAISS_DIR = Path(settings.faiss_index_path)
FAISS_INDEX_FILE = FAISS_DIR / "index.faiss"
FAISS_MAP_FILE = FAISS_DIR / "chunk_id_map.json"
EMBED_DIM = settings.embed_dim   # 1024 for BGE-M3


# ─── Data model ───────────────────────────────────────────────────────────────

@dataclass
class VectorCandidate:
    chunk_id: str
    text: str
    score: float          # cosine similarity [0, 1]
    domain: str
    jurisdiction: str
    section_title: str
    source_title: str
    corpus_version: str
    faiss_id: Optional[int] = None


# ─── Model loader ─────────────────────────────────────────────────────────────

def _load_model(model_name: str):
    """Load SentenceTransformer, with graceful fallback for dev environments."""
    from sentence_transformers import SentenceTransformer
    try:
        logger.info(f"Loading embedding model: {model_name} ...")
        try:
            model = SentenceTransformer(model_name, device=settings.embed_device, local_files_only=True)
        except Exception:
            model = SentenceTransformer(model_name, device=settings.embed_device)
        # Quick dimension check
        test_vec = model.encode(["test"], normalize_embeddings=True)
        actual_dim = test_vec.shape[1]
        logger.info(f"Model loaded — dim={actual_dim} device={settings.embed_device}")
        return model, actual_dim
    except Exception as exc:
        fallback = "all-MiniLM-L6-v2"
        logger.warning(
            f"Failed to load {model_name} ({exc}). "
            f"Falling back to {fallback} (dim=384)."
        )
        model = SentenceTransformer(fallback, device=settings.embed_device)
        actual_dim = 384
        return model, actual_dim


# ─── FAISS helpers ────────────────────────────────────────────────────────────

def _make_faiss_index(dim: int):
    import faiss
    # IndexFlatIP + L2-normalised vectors = cosine similarity
    return faiss.IndexFlatIP(dim)


def _load_faiss(dim: int):
    import faiss
    if FAISS_INDEX_FILE.exists():
        idx = faiss.read_index(str(FAISS_INDEX_FILE))
        # If dim changed (e.g. switched model), rebuild
        if idx.d != dim:
            logger.warning(
                f"FAISS index dim={idx.d} != embed_dim={dim}. Rebuilding."
            )
            return _make_faiss_index(dim)
        return idx
    return _make_faiss_index(dim)


def _save_faiss(index, id_map: dict[int, str]) -> None:
    import faiss
    FAISS_DIR.mkdir(parents=True, exist_ok=True)
    faiss.write_index(index, str(FAISS_INDEX_FILE))
    FAISS_MAP_FILE.write_text(
        json.dumps({str(k): v for k, v in id_map.items()}, indent=2),
        encoding="utf-8",
    )
    logger.info(f"FAISS saved: {index.ntotal} vectors | {FAISS_INDEX_FILE}")


# ─── Vector Retriever ─────────────────────────────────────────────────────────

class VectorRetriever:
    """
    BGE-M3 dense retriever.
    Call await retriever.build() to load model + embed all chunks.
    """

    def __init__(self):
        self._model = None
        self._index = None
        self._id_map: dict[int, str] = {}          # faiss_row_id -> chunk_id
        self._chunk_meta: dict[str, dict] = {}      # chunk_id -> metadata
        self._dim: int = EMBED_DIM
        self._built = False

    # ── Build / rebuild ───────────────────────────────────────────────────────

    async def build(self, force_reembed: bool = False) -> None:
        """
        Load model, embed all chunks, update FAISS + DB faiss_id column.

        force_reembed=True : re-embed even if FAISS index already exists.
        """
        self._model, self._dim = _load_model(settings.embed_model)

        from sqlalchemy.orm import joinedload

        # Load chunk metadata from DB
        async with AsyncSessionLocal() as session:
            result = await session.execute(select(ChunkModel).options(joinedload(ChunkModel.document)))
            rows = result.scalars().all()

        if not rows:
            logger.warning("No chunks in DB — vector index will be empty.")
            self._index = _make_faiss_index(self._dim)
            self._built = True
            return

        for row in rows:
            self._chunk_meta[row.id] = {
                "text": row.text,
                "domain": row.domain,
                "jurisdiction": row.jurisdiction,
                "section_title": row.section_title or "",
                "source_title": row.document.title if (hasattr(row, "document") and row.document) else "",
                "corpus_version": row.corpus_version,
            }

        # Check if real embeddings already exist
        index = _load_faiss(self._dim)
        map_exists = FAISS_MAP_FILE.exists()
        already_embedded = (
            map_exists
            and index.ntotal == len(rows)
            and not force_reembed
        )

        if already_embedded:
            logger.info(
                f"Existing FAISS index with {index.ntotal} vectors loaded "
                f"(use force_reembed=True to re-embed)."
            )
            id_map_raw = json.loads(FAISS_MAP_FILE.read_text(encoding="utf-8"))
            self._id_map = {int(k): v for k, v in id_map_raw.items()}
            self._index = index
            self._built = True
            return

        # Re-embed all chunks
        logger.info(f"Embedding {len(rows)} chunks with {settings.embed_model} ...")
        texts = [row.text for row in rows]
        chunk_ids = [row.id for row in rows]

        batch = settings.embed_batch_size
        all_vecs: list[np.ndarray] = []
        for i in range(0, len(texts), batch):
            batch_texts = texts[i : i + batch]
            vecs = self._model.encode(
                batch_texts,
                batch_size=batch,
                normalize_embeddings=True,
                show_progress_bar=False,
            )
            all_vecs.append(vecs)
            logger.info(f"  Embedded {min(i + batch, len(texts))}/{len(texts)}")

        matrix = np.vstack(all_vecs).astype(np.float32)

        # Rebuild FAISS with real vectors
        new_index = _make_faiss_index(self._dim)
        new_index.add(matrix)

        new_id_map: dict[int, str] = {i: chunk_ids[i] for i in range(len(chunk_ids))}

        # Update DB faiss_id column
        async with AsyncSessionLocal() as session:
            for faiss_id, chunk_id in new_id_map.items():
                result = await session.execute(
                    select(ChunkModel).where(ChunkModel.id == chunk_id)
                )
                chunk = result.scalars().first()
                if chunk:
                    chunk.faiss_id = faiss_id
            await session.commit()

        _save_faiss(new_index, new_id_map)
        self._index = new_index
        self._id_map = new_id_map
        self._built = True
        logger.info(f"Vector index built: {new_index.ntotal} vectors (dim={self._dim})")

    def is_built(self) -> bool:
        return self._built

    # ── Embed query ───────────────────────────────────────────────────────────

    def embed_query(self, text: str) -> np.ndarray:
        """Return L2-normalised query embedding (shape: [dim])."""
        if self._model is None:
            raise RuntimeError("VectorRetriever not built. Call build() first.")
        vec = self._model.encode(
            [text], normalize_embeddings=True, show_progress_bar=False
        )
        return vec[0].astype(np.float32)

    # ── Search ────────────────────────────────────────────────────────────────

    def search(
        self,
        query: str,
        top_k: int | None = None,
        domain: str | None = None,
        jurisdiction: str | None = None,
    ) -> list[VectorCandidate]:
        """
        Embed query and search FAISS index.
        Returns VectorCandidate list sorted by cosine similarity (desc).
        """
        if not self._built or self._index is None:
            logger.warning("Vector index not built — returning empty.")
            return []

        top_k = top_k or settings.vector_top_k
        query_vec = self.embed_query(query).reshape(1, -1)

        # Search more than top_k so we have room to filter by domain/jurisdiction
        search_k = min(top_k * 4, self._index.ntotal) if self._index.ntotal > 0 else 1
        scores, faiss_ids = self._index.search(query_vec, search_k)
        scores = scores[0].tolist()
        faiss_ids = faiss_ids[0].tolist()

        candidates: list[VectorCandidate] = []
        for score, fid in zip(scores, faiss_ids):
            if fid < 0:
                continue
            chunk_id = self._id_map.get(fid)
            if chunk_id is None:
                continue
            meta = self._chunk_meta.get(chunk_id, {})
            if domain and domain != "auto" and meta.get("domain") != domain:
                continue
            if jurisdiction and jurisdiction != "auto" and meta.get("jurisdiction") != jurisdiction:
                continue
            candidates.append(VectorCandidate(
                chunk_id=chunk_id,
                text=meta.get("text", ""),
                score=float(score),
                domain=meta.get("domain", ""),
                jurisdiction=meta.get("jurisdiction", ""),
                section_title=meta.get("section_title", ""),
                source_title=meta.get("source_title", ""),
                corpus_version=meta.get("corpus_version", settings.corpus_version),
                faiss_id=fid,
            ))
            if len(candidates) >= top_k:
                break

        return candidates


# ─── Module-level singleton ───────────────────────────────────────────────────

vector_retriever = VectorRetriever()
