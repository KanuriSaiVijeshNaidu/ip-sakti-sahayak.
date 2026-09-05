"""
backend/scripts/ingest_unified_chunks.py
────────────────────────────────────────
Ingests the newly generated 12-source canonical chunks from data/chunks/chunks.jsonl
into data/ipsakti_dev.db and updates both BM25 and BGE-M3 FAISS vector indexes.
"""
from __future__ import annotations

import asyncio
import json
import logging
from pathlib import Path
from sqlalchemy import select

from backend.app.core.database import AsyncSessionLocal, ChunkModel, DocumentModel, init_db
from backend.app.retrieval.bm25_retriever import bm25_retriever
from backend.app.retrieval.vector_retriever import vector_retriever

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

CHUNKS_FILE = Path("data/chunks/chunks.jsonl")

async def ingest_new_chunks():
    await init_db()
    if not CHUNKS_FILE.exists():
        logger.error(f"{CHUNKS_FILE} not found!")
        return

    with open(CHUNKS_FILE, "r", encoding="utf-8") as f:
        chunks_data = [json.loads(line) for line in f if line.strip()]

    logger.info(f"Loaded {len(chunks_data)} chunks from {CHUNKS_FILE}.")

    async with AsyncSessionLocal() as session:
        # Group by document
        doc_map = {}
        for c in chunks_data:
            doc_id = c["document_id"]
            if doc_id not in doc_map:
                doc_map[doc_id] = {
                    "title": c["title"],
                    "source_url": c["source_url"],
                    "domain": c["domain"],
                    "jurisdiction": c["jurisdiction"],
                    "language": c["language"],
                }

        # 1. Insert or get documents
        db_doc_ids = {}
        for doc_id, meta in doc_map.items():
            result = await session.execute(
                select(DocumentModel).where(DocumentModel.id == doc_id)
            )
            existing = result.scalars().first()
            if not existing:
                new_doc = DocumentModel(
                    id=doc_id,
                    title=meta["title"],
                    source_url=meta["source_url"],
                    domain=meta["domain"],
                    jurisdiction=meta["jurisdiction"],
                    corpus_version="v2",
                    language=meta["language"],
                )
                session.add(new_doc)
                db_doc_ids[doc_id] = doc_id
            else:
                db_doc_ids[doc_id] = existing.id

        await session.flush()

        # 2. Insert chunks
        added_chunks = 0
        for c in chunks_data:
            cid = c["chunk_id"]
            result = await session.execute(
                select(ChunkModel).where(ChunkModel.id == cid)
            )
            if result.scalars().first():
                continue

            chunk_obj = ChunkModel(
                id=cid,
                document_id=c["document_id"],
                chunk_index=int(cid.split("-chk-")[-1]) if "-chk-" in cid else 0,
                text=c["text"],
                section_title=c.get("section", "Section"),
                token_count=len(c["text"].split()),
                domain=c["domain"],
                jurisdiction=c["jurisdiction"],
                corpus_version="v2",
                language=c.get("language", "en"),
                page_number=c.get("page"),
                meta_json=json.dumps({
                    "source": c.get("source"),
                    "authority": c.get("authority"),
                    "topics": c.get("topic", []),
                    "keywords": c.get("keywords", []),
                    "botanical_names": c.get("botanical_names", []),
                    "content_hash": c.get("content_hash"),
                })
            )
            session.add(chunk_obj)
            added_chunks += 1

        await session.commit()
        logger.info(f"Ingested {added_chunks} new chunks into SQLite.")

    # 3. Rebuild BM25 & FAISS Vector indexes
    logger.info("Rebuilding BM25 index from SQLite...")
    await bm25_retriever.build()

    logger.info("Rebuilding BGE-M3 vector index with force_reembed=True...")
    await vector_retriever.build(force_reembed=True)

    logger.info("Ingestion and re-indexing complete!")

if __name__ == "__main__":
    asyncio.run(ingest_new_chunks())
