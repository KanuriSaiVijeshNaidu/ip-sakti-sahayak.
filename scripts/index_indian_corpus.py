"""
scratch/index_indian_corpus.py
==============================
1. Reads data/india/chunks/canonical_indian_chunks.jsonl (137 chunks).
2. Embeds with BAAI/bge-m3 into 1024-dim normalized vectors on GPU.
3. Writes data/indexes/faiss/in/bge_m3_in_flatip.faiss and in_mapping.jsonl.
4. Updates BM25 partition IN in data/indexes/bm25/jurisdiction_bm25_cache_v2.pkl
   while preserving US, EP, WO, JP completely.
"""
import sys
import os
import json
import pickle
import numpy as np
from pathlib import Path
import faiss
import torch
from rank_bm25 import BM25Okapi

sys.stdout.reconfigure(encoding='utf-8')
BASE_DIR = Path(r"c:\project\ip_sakti1")
sys.path.insert(0, str(BASE_DIR))

from sentence_transformers import SentenceTransformer
from backend.app.retrieval.config import retrieval_config
from backend.app.retrieval.jurisdiction_bm25_retriever import _tokenize_text

def index_indian_corpus():
    print("=== STARTING BGE-M3 EMBEDDING & DUAL INDEX GENERATION FOR INDIA ===")
    
    # 1. Load canonical Indian chunks
    chunks_file = BASE_DIR / "data" / "india" / "chunks" / "canonical_indian_chunks.jsonl"
    if not chunks_file.exists():
        raise FileNotFoundError(f"Canonical chunks not found: {chunks_file}")

    indian_chunks = []
    with open(chunks_file, "r", encoding="utf-8") as f:
        for line in f:
            if line.strip():
                indian_chunks.append(json.loads(line))

    print(f"Loaded {len(indian_chunks)} canonical Indian chunks.")
    
    # 2. Embed with BGE-M3
    device = "cuda" if torch.cuda.is_available() else "cpu"
    print(f"Loading {retrieval_config.embedding_model} on {device}...")
    model = SentenceTransformer(retrieval_config.embedding_model, device=device)

    texts = [c["text"] for c in indian_chunks]
    print(f"Encoding {len(texts)} chunks...")
    embeddings = model.encode(texts, batch_size=16, normalize_embeddings=True, show_progress_bar=True)
    embeddings = np.asarray(embeddings, dtype=np.float32)

    if embeddings.shape[1] != 1024:
        raise ValueError(f"Embedding dimension {embeddings.shape[1]} != 1024")
    if np.isnan(embeddings).any() or np.isinf(embeddings).any():
        raise ValueError("Embeddings contain NaN or Inf values!")

    print(f"Embeddings shape: {embeddings.shape}, dtype: {embeddings.dtype}")

    # 3. Build and Save FAISS Index
    faiss_dir = BASE_DIR / "data" / "indexes" / "faiss" / "in"
    faiss_dir.mkdir(parents=True, exist_ok=True)
    
    index_file = faiss_dir / "bge_m3_in_flatip.faiss"
    mapping_file = faiss_dir / "in_mapping.jsonl"

    idx = faiss.IndexFlatIP(1024)
    idx.add(embeddings)
    faiss.write_index(idx, str(index_file))
    print(f"FAISS index written to {index_file} (Total vectors: {idx.ntotal})")

    # Write mapping file
    with open(mapping_file, "w", encoding="utf-8") as f:
        for c in indian_chunks:
            f.write(json.dumps(c, ensure_ascii=False) + "\n")
    print(f"FAISS metadata mapping written to {mapping_file} (Total records: {len(indian_chunks)})")

    # 4. Update BM25 partition IN
    bm25_file = BASE_DIR / "data" / "indexes" / "bm25" / "jurisdiction_bm25_cache_v2.pkl"
    if not bm25_file.exists():
        raise FileNotFoundError(f"BM25 cache not found: {bm25_file}")

    print(f"Loading existing BM25 cache from {bm25_file}...")
    with open(bm25_file, "rb") as f:
        bm25_data = pickle.load(f)

    existing_jurs = list(bm25_data["indexes"].keys())
    print(f"Existing BM25 jurisdictions: {existing_jurs}")

    # Tokenize Indian corpus
    print("Tokenizing Indian chunks for BM25...")
    tokenized_corpus = []
    for c in indian_chunks:
        # include text, title, section, publication_number
        combined = f"{c['title']} {c.get('section', '')} {c.get('publication_number', '')} {c['text']}"
        tokens = _tokenize_text(combined, is_japanese=False)
        tokenized_corpus.append(tokens)

    bm25_in = BM25Okapi(tokenized_corpus)
    bm25_data["indexes"]["IN"] = bm25_in
    bm25_data["chunks"]["IN"] = indian_chunks

    print(f"Updated BM25 partition IN: {len(tokenized_corpus)} docs.")
    print(f"All BM25 partitions now: {list(bm25_data['indexes'].keys())}")
    for k in bm25_data["indexes"].keys():
        print(f"  - {k}: {len(bm25_data['chunks'][k])} chunks")

    with open(bm25_file, "wb") as f:
        pickle.dump(bm25_data, f, protocol=pickle.HIGHEST_PROTOCOL)
    print(f"Saved updated BM25 cache to {bm25_file}")

    print("=== DUAL INDEX GENERATION COMPLETED SUCCESSFULLY ===")

if __name__ == "__main__":
    index_indian_corpus()
