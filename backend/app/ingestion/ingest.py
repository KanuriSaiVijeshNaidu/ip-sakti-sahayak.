"""
backend/app/ingestion/ingest.py
????????????????????????????????
Phase 2 ingestion pipeline for IP-SAKTI Sahayak.

What it does
????????????
1. Reads all .txt / .pdf / .docx files from data/raw/
2. Chunks them using the domain-aware legal chunker
3. Stores chunk metadata in SQLite (via SQLAlchemy async)
4. Stores chunk texts in a FAISS flat index (saved to disk)
   ? No embeddings yet (Phase 3 adds BGE-M3).  The FAISS index
     is a placeholder that gets replaced with real vectors in Phase 3.
     For now we store a zero-vector of dim=1 just to assign FAISS IDs.

Run this script directly:
    python -m backend.app.ingestion.ingest

Or import and call ingest_directory() from tests / other modules.
"""
from __future__ import annotations

import asyncio
import json
import logging
import sys
import time
from pathlib import Path

import numpy as np

from backend.app.core.config import settings
from backend.app.core.database import ChunkModel, DocumentModel, init_db, AsyncSessionLocal
from backend.app.ingestion.chunker import Chunk, chunk_directory

logger = logging.getLogger(__name__)

# ??? Paths ???????????????????????????????????????????????????????????????????

RAW_DIR         = Path("data/raw")
FAISS_DIR       = Path(settings.faiss_index_path if hasattr(settings, "faiss_index_path") else "data/embeddings/faiss_index")
FAISS_META_PATH = FAISS_DIR / "chunk_id_map.json"   # faiss_row_id -> chunk_id

# ??? FAISS helpers (placeholder ? real embeddings in Phase 3) ????????????????

def _init_faiss_index(dim: int = 1):
    """
    Create a simple FAISS flat L2 index.
    dim=1 placeholder until Phase 3 replaces with 1024-dim BGE-M3 vectors.
    """
    try:
        import faiss
        index = faiss.IndexFlatL2(dim)
        return index
    except ImportError:
        raise RuntimeError("faiss-cpu is not installed. Run: pip install faiss-cpu")


def _load_or_create_faiss(dim: int = 1):
    """Load existing index from disk or create a fresh one."""
    import faiss
    FAISS_DIR.mkdir(parents=True, exist_ok=True)
    index_path = FAISS_DIR / "index.faiss"
    if index_path.exists():
        logger.info(f"Loading existing FAISS index from {index_path}")
        index = faiss.read_index(str(index_path))
    else:
        logger.info("Creating new FAISS index (dim=1 placeholder)")
        index = _init_faiss_index(dim)
    return index


def _save_faiss(index, id_map: dict) -> None:
    """Persist FAISS index and chunk-id map to disk."""
    import faiss
    FAISS_DIR.mkdir(parents=True, exist_ok=True)
    faiss.write_index(index, str(FAISS_DIR / "index.faiss"))
    FAISS_META_PATH.write_text(json.dumps(id_map, indent=2), encoding="utf-8")
    logger.info(f"FAISS index saved: {index.ntotal} vectors | map: {FAISS_META_PATH}")


def _add_to_faiss(index, chunks: list[Chunk]) -> list[int]:
    """
    Add placeholder zero-vectors for each chunk.
    Returns list of assigned FAISS row IDs (= index before adding).
    Phase 3 will replace this with real BGE-M3 embeddings.
    """
    start_id = index.ntotal
    placeholder = np.zeros((len(chunks), index.d), dtype=np.float32)
    index.add(placeholder)
    return list(range(start_id, start_id + len(chunks)))


# ??? DB helpers ??????????????????????????????????????????????????????????????

async def _get_or_create_document(
    session,
    source_title: str,
    domain: str,
    jurisdiction: str,
    corpus_version: str,
    language: str,
) -> str:
    """Return existing document id or create a new one."""
    from sqlalchemy import select
    result = await session.execute(
        select(DocumentModel).where(
            DocumentModel.title == source_title,
            DocumentModel.corpus_version == corpus_version,
        )
    )
    doc = result.scalars().first()
    if doc:
        return doc.id
    doc = DocumentModel(
        title=source_title,
        domain=domain,
        jurisdiction=jurisdiction,
        corpus_version=corpus_version,
        language=language,
    )
    session.add(doc)
    await session.flush()   # get the id without committing
    return doc.id


async def _chunk_exists(session, chunk_id: str) -> bool:
    from sqlalchemy import select
    result = await session.execute(
        select(ChunkModel.id).where(ChunkModel.id == chunk_id)
    )
    return result.scalars().first() is not None


# ??? Core ingestion ???????????????????????????????????????????????????????????

async def ingest_directory(
    raw_dir: Path = RAW_DIR,
    corpus_version: str | None = None,
    clear_existing: bool = False,
) -> dict:
    """
    Main ingestion function.

    Parameters
    ----------
    raw_dir:          Directory containing source documents.
    corpus_version:   Override corpus version tag (default: from .env).
    clear_existing:   If True, wipe DB tables and FAISS index before ingesting.

    Returns
    -------
    dict with keys: chunks_added, documents_added, skipped, elapsed_s
    """
    corpus_version = corpus_version or settings.corpus_version
    t0 = time.perf_counter()

    # 1. Init DB schema
    await init_db()

    if clear_existing:
        from sqlalchemy import text
        async with AsyncSessionLocal() as session:
            await session.execute(text("DELETE FROM chunks"))
            await session.execute(text("DELETE FROM documents"))
            await session.commit()
        if (FAISS_DIR / "index.faiss").exists():
            (FAISS_DIR / "index.faiss").unlink()
        if FAISS_META_PATH.exists():
            FAISS_META_PATH.unlink()
        logger.info("Cleared existing DB chunks, documents, and FAISS index.")

    # 2. Chunk all source files
    logger.info(f"Chunking files in {raw_dir} ...")
    chunks: list[Chunk] = chunk_directory(raw_dir)
    logger.info(f"  --> {len(chunks)} chunks produced from {raw_dir}")

    if not chunks:
        logger.warning("No chunks produced -- check that data/raw/ has files.")
        return {"chunks_added": 0, "documents_added": 0, "skipped": 0, "elapsed_s": 0}

    # 3. Load / create FAISS index
    index = _load_or_create_faiss(dim=1)

    # Load existing chunk-id map
    id_map: dict[int, str] = {}  # faiss_row_id -> chunk.id
    if FAISS_META_PATH.exists():
        id_map = {int(k): v for k, v in json.loads(FAISS_META_PATH.read_text()).items()}

    # 4. Persist to DB + FAISS
    chunks_added = 0
    docs_added: set[str] = set()
    skipped = 0

    async with AsyncSessionLocal() as session:
        # Group chunks by source document
        by_doc: dict[str, list[Chunk]] = {}
        for chunk in chunks:
            by_doc.setdefault(chunk.source_title, []).append(chunk)

        for source_title, doc_chunks in by_doc.items():
            sample = doc_chunks[0]
            doc_id = await _get_or_create_document(
                session,
                source_title=source_title,
                domain=sample.domain,
                jurisdiction=sample.jurisdiction,
                corpus_version=corpus_version,
                language=sample.language,
            )
            if doc_id not in docs_added:
                docs_added.add(doc_id)

            # Filter out already-ingested chunks
            new_chunks = []
            for c in doc_chunks:
                exists = await _chunk_exists(session, c.id)
                if exists:
                    skipped += 1
                else:
                    new_chunks.append(c)

            if not new_chunks:
                continue

            # Assign FAISS IDs
            faiss_ids = _add_to_faiss(index, new_chunks)

            # Write chunk rows
            for chunk, faiss_id in zip(new_chunks, faiss_ids):
                id_map[faiss_id] = chunk.id
                db_chunk = ChunkModel(
                    id=chunk.id,
                    document_id=doc_id,
                    chunk_index=chunk.chunk_index,
                    text=chunk.text,
                    section_title=chunk.section_title,
                    token_count=chunk.token_count,
                    domain=chunk.domain,
                    jurisdiction=chunk.jurisdiction,
                    corpus_version=corpus_version,
                    language=chunk.language,
                    page_number=chunk.page_number,
                    faiss_id=faiss_id,
                    meta_json={},
                )
                session.add(db_chunk)
                chunks_added += 1

        await session.commit()

    # 5. Save FAISS to disk
    _save_faiss(index, id_map)

    elapsed = round(time.perf_counter() - t0, 2)
    result = {
        "chunks_added": chunks_added,
        "documents_added": len(docs_added),
        "skipped": skipped,
        "elapsed_s": elapsed,
        "total_faiss_vectors": index.ntotal,
    }
    logger.info(f"Ingestion complete: {result}")
    return result


# ??? CLI entry point ??????????????????????????????????????????????????????????

async def _main() -> None:
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s | %(levelname)s | %(message)s",
        stream=sys.stdout,
    )
    print("\n????????????????????????????????????")
    print("?  IP-SAKTI Phase 2 Ingestion CLI  ?")
    print("????????????????????????????????????\n")

    result = await ingest_directory(RAW_DIR)

    print("\n?? Ingestion Summary")
    print(f"   Documents processed : {result['documents_added']}")
    print(f"   Chunks added        : {result['chunks_added']}")
    print(f"   Chunks skipped      : {result['skipped']} (already in DB)")
    print(f"   FAISS vectors total : {result.get('total_faiss_vectors', 'N/A')}")
    print(f"   Time taken          : {result['elapsed_s']}s")
    print("\n? Phase 2 ingestion complete!\n")


if __name__ == "__main__":
    asyncio.run(_main())
