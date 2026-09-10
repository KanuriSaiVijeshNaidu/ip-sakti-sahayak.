"""
backend/app/ingestion/kanoongpt_ingest.py
─────────────────────────────────────────
Ingestion and index integration pipeline for KanoonGPT Indian Legal Documents.
Preserves existing 137 canonical chunks and 71 statutory anchors.
Only embeds genuinely new high-value chunks using BAAI/bge-m3.
Updates FAISS index (bge_m3_in_flatip.faiss) and BM25 index for jurisdiction IN.
"""
from __future__ import annotations

import os
import sys
import json
import pickle
import hashlib
import logging
from pathlib import Path
from typing import Dict, List, Any, Set
import numpy as np
import faiss
import torch
from rank_bm25 import BM25Okapi

sys.path.insert(0, str(Path(__file__).resolve().parents[3]))

from backend.app.ingestion.kanoongpt_chunker import chunk_legal_document
from backend.app.retrieval.config import retrieval_config
from backend.app.retrieval.jurisdiction_bm25_retriever import _tokenize_text

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("ayurlex.kanoongpt_ingest")

BASE_DIR = Path(r"c:\project\ip_sakti1")
DATA_DIR = BASE_DIR / "data"
SCRATCH_DIR = Path("C:/Users/kanur/.gemini/antigravity/brain/92e202c3-b289-47ab-9ff5-9096753efd02/scratch")

# High-priority legal instruments addressing specific coverage gaps
PRIORITY_INSTRUMENTS = [
    # Designs
    r"designs act, 2000",
    r"designs rules, 2001",
    r"manual of designs practice",
    # Copyright
    r"copyright act, 1957",
    # Plant Varieties
    r"protection of plant varieties and farmers",
    # Geographical Indications
    r"geographical indications of goods.*rules, 2002",
    r"manual of geographical indications practice",
    # Ayurveda & AYUSH
    r"national commission for indian system of medicine act, 2020",
    r"national commission for indian system of medicine \(amendment\)",
    r"institute of teaching and research in ayurveda act, 2020",
    r"gujarat ayurved university act",
    # Biodiversity
    r"biological diversity \(amendment\) act, 2023",
    r"biodiversity heritage sites",
    # Trademarks
    r"trade marks \(amendment\) act, 2010",
    r"state emblem of india.*prohibition",
    r"draft trade marks.*rules, 2024",
    # Patents
    r"guidelines for examination of biotechnology",
    r"guidelines for examination of computer related inventions",
    r"draft patent \(amendment\) rules, 2023",
]

def run_kanoongpt_ingest():
    logger.info("=== STARTING KANOONGPT INDIA DATA INGESTION ===")

    # 1. Load curated instruments
    curated_file = SCRATCH_DIR / "kanoongpt_curated_instruments.json"
    if not curated_file.exists():
        raise FileNotFoundError(f"Curated instruments file not found: {curated_file}")

    with open(curated_file, "r", encoding="utf-8") as f:
        instruments = json.load(f)

    logger.info(f"Loaded {len(instruments)} curated instruments from scratch.")

    # 2. Select priority gap-filling instruments
    selected_for_ingest = []
    import re
    for inst in instruments:
        title = inst.get("title", "")
        for pat in PRIORITY_INSTRUMENTS:
            if re.search(pat, title, re.IGNORECASE):
                selected_for_ingest.append(inst)
                break

    logger.info(f"Selected {len(selected_for_ingest)} high-priority instruments for ingestion:")
    for inst in selected_for_ingest:
        logger.info(f"  * {inst.get('title')} ({inst.get('target_domain')}) - {inst.get('text_length')} chars")

    # 3. Load existing canonical chunks to ensure strict deduplication
    canonical_chunks_file = DATA_DIR / "india" / "chunks" / "canonical_indian_chunks.jsonl"
    existing_chunks = []
    existing_hashes = set()
    existing_cids = set()

    if canonical_chunks_file.exists():
        with open(canonical_chunks_file, "r", encoding="utf-8") as f:
            for line in f:
                if line.strip():
                    c = json.loads(line)
                    existing_chunks.append(c)
                    existing_cids.add(c["chunk_id"])
                    text_hash = hashlib.sha256(c["text"].strip().encode("utf-8")).hexdigest()
                    existing_hashes.add(text_hash)

    logger.info(f"Existing canonical Indian chunks: {len(existing_chunks)}")

    # 4. Generate structure-aware chunks and deduplicate
    new_chunks = []
    dup_count = 0

    for inst in selected_for_ingest:
        chunks = chunk_legal_document(inst)
        for c in chunks:
            # Check hash
            h = hashlib.sha256(c["text"].strip().encode("utf-8")).hexdigest()
            if h in existing_hashes or c["chunk_id"] in existing_cids:
                dup_count += 1
                continue
            
            # Additional semantic check: ensure chunk is substantial
            if len(c["text"].strip()) < 150:
                continue

            existing_hashes.add(h)
            existing_cids.add(c["chunk_id"])
            new_chunks.append(c)

    logger.info(f"Generated {len(new_chunks)} new high-value chunks (Filtered {dup_count} duplicates/stubs).")

    # Save new chunks to dedicated KanoonGPT directory
    kanoon_dir = DATA_DIR / "india" / "kanoongpt"
    kanoon_dir.mkdir(parents=True, exist_ok=True)
    new_chunks_file = kanoon_dir / "kanoongpt_chunks.jsonl"
    with open(new_chunks_file, "w", encoding="utf-8") as f:
        for c in new_chunks:
            f.write(json.dumps(c, ensure_ascii=False) + "\n")
    logger.info(f"Saved {len(new_chunks)} KanoonGPT chunks to {new_chunks_file}")

    # 5. Embed only the new chunks using BAAI/bge-m3
    device = "cuda" if torch.cuda.is_available() else "cpu"
    logger.info(f"Loading {retrieval_config.embedding_model} on {device}...")
    from sentence_transformers import SentenceTransformer
    if torch.cuda.is_available():
        torch.cuda.empty_cache()
    model = SentenceTransformer(retrieval_config.embedding_model, device=device)
    model.max_seq_length = 512

    new_texts = [c["text"] for c in new_chunks]
    logger.info(f"Encoding {len(new_texts)} new chunks with BGE-M3 (batch_size=8, max_seq_length=512)...")
    new_embeddings = model.encode(new_texts, batch_size=8, normalize_embeddings=True, show_progress_bar=True)
    new_embeddings = np.asarray(new_embeddings, dtype=np.float32)
    logger.info(f"New embeddings generated: shape {new_embeddings.shape}")

    # 6. Append to FAISS index and mapping file
    faiss_dir = DATA_DIR / "indexes" / "faiss" / "in"
    index_file = faiss_dir / "bge_m3_in_flatip.faiss"
    mapping_file = faiss_dir / "in_mapping.jsonl"

    if index_file.exists():
        idx = faiss.read_index(str(index_file))
        logger.info(f"Existing FAISS index has {idx.ntotal} vectors.")
        idx.add(new_embeddings)
        faiss.write_index(idx, str(index_file))
        logger.info(f"FAISS index updated: {idx.ntotal} total vectors.")
    else:
        idx = faiss.IndexFlatIP(1024)
        idx.add(new_embeddings)
        faiss.write_index(idx, str(index_file))

    # Append to in_mapping.jsonl
    with open(mapping_file, "a", encoding="utf-8") as f:
        for c in new_chunks:
            f.write(json.dumps(c, ensure_ascii=False) + "\n")
    logger.info(f"Updated FAISS metadata mapping in {mapping_file}")

    # 7. Append to canonical_indian_chunks.jsonl
    with open(canonical_chunks_file, "a", encoding="utf-8") as f:
        for c in new_chunks:
            f.write(json.dumps(c, ensure_ascii=False) + "\n")
    logger.info(f"Updated canonical_indian_chunks.jsonl (Now {len(existing_chunks) + len(new_chunks)} total chunks)")

    # 8. Rebuild BM25 index for jurisdiction IN while preserving other jurisdictions
    bm25_file = DATA_DIR / "indexes" / "bm25" / "jurisdiction_bm25_cache_v2.pkl"
    logger.info(f"Loading BM25 cache from {bm25_file}...")
    with open(bm25_file, "rb") as f:
        bm25_data = pickle.load(f)

    all_indian_chunks = existing_chunks + new_chunks
    logger.info(f"Tokenizing {len(all_indian_chunks)} Indian chunks for BM25...")
    tokenized_corpus = []
    for c in all_indian_chunks:
        combined = f"{c.get('title', '')} {c.get('section', '')} {c.get('publication_number', '')} {c.get('text', '')}"
        tokens = _tokenize_text(combined, is_japanese=False)
        tokenized_corpus.append(tokens)

    bm25_in = BM25Okapi(tokenized_corpus)
    bm25_data["indexes"]["IN"] = bm25_in
    bm25_data["chunks"]["IN"] = all_indian_chunks

    with open(bm25_file, "wb") as f:
        pickle.dump(bm25_data, f)
    logger.info(f"BM25 cache successfully updated for IN ({len(all_indian_chunks)} chunks). Preserved US, EP, WO, JP.")

    logger.info("=== KANOONGPT INGESTION & DUAL-INDEX MERGE COMPLETE ===")
    return {
        "new_chunks_count": len(new_chunks),
        "total_indian_chunks": len(all_indian_chunks),
        "total_faiss_vectors": idx.ntotal,
        "duplicate_count": dup_count
    }

if __name__ == "__main__":
    res = run_kanoongpt_ingest()
    print("INGESTION RESULT:", res)
