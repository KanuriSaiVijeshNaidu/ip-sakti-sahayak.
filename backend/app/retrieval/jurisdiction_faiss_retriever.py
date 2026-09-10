"""
backend/app/retrieval/jurisdiction_faiss_retriever.py
────────────────────────────────────────────────────
Dense retrieval over Phase 4 FAISS indexes using BAAI/bge-m3.
Queries FAISS IndexFlatIP partitioned by jurisdiction (US, EP, WO, JP).
Loads mapping tables to return complete chunk metadata with zero loss of provenance.
"""
from __future__ import annotations

import json
import logging
from pathlib import Path
from typing import Dict, List, Optional
import faiss
import numpy as np
import torch
from sentence_transformers import SentenceTransformer

from backend.app.retrieval.config import retrieval_config

logger = logging.getLogger(__name__)


class JurisdictionFAISSRetriever:
    """
    Manages loading and querying of jurisdiction-specific FAISS indexes
    built in Phase 4.
    """

    def __init__(self):
        self.device = retrieval_config.device
        self.model: Optional[SentenceTransformer] = None
        self.indexes: Dict[str, faiss.Index] = {}
        self.mappings: Dict[str, List[dict]] = {}
        self._initialized = False

    def initialize(self) -> None:
        """Loads BGE-M3 model and all jurisdiction FAISS indexes + mappings."""
        if self._initialized:
            return

        logger.info(f"Loading BGE-M3 model on device={self.device} ...")
        self.model = SentenceTransformer(retrieval_config.embedding_model, device=self.device)

        base_dir = Path(retrieval_config.faiss_base_dir)
        for jur in retrieval_config.active_jurisdictions:
            jur_lower = jur.lower()
            idx_file = base_dir / jur_lower / f"bge_m3_{jur_lower}_flatip.faiss"
            map_file = base_dir / jur_lower / f"{jur_lower}_mapping.jsonl"

            if not idx_file.exists():
                raise FileNotFoundError(f"Missing FAISS index for {jur}: {idx_file}")
            if not map_file.exists():
                raise FileNotFoundError(f"Missing mapping file for {jur}: {map_file}")

            logger.info(f"Loading FAISS index for jurisdiction {jur} from {idx_file} ...")
            idx = faiss.read_index(str(idx_file))
            self.indexes[jur] = idx

            logger.info(f"Loading metadata mapping for {jur} from {map_file} ...")
            records = []
            with open(map_file, "r", encoding="utf-8") as f:
                for line in f:
                    if line.strip():
                        records.append(json.loads(line))
            self.mappings[jur] = records
            logger.info(f"Loaded {jur} FAISS index: {idx.ntotal} vectors, {len(records)} mapping rows.")

        self._initialized = True

    def embed_query(self, query: str) -> np.ndarray:
        """Embeds query into 1024-dim normalized vector."""
        if not self._initialized:
            self.initialize()
        
        # SentenceTransformer encode with normalization (inner product = cosine similarity)
        emb = self.model.encode([query], normalize_embeddings=True, show_progress_bar=False)
        vec = np.asarray(emb, dtype=np.float32)
        if vec.shape[1] != retrieval_config.embedding_dim:
            raise ValueError(f"Query embedding dimension {vec.shape[1]} != expected {retrieval_config.embedding_dim}")
        if np.isnan(vec).any() or np.isinf(vec).any():
            raise ValueError("Query embedding contains NaN or Inf values.")
        return vec

    def search_jurisdiction(self, query_vec: np.ndarray, jurisdiction: str, top_k: int) -> List[dict]:
        """
        Executes dense FAISS inner-product search for a single jurisdiction.
        Returns list of candidate dicts with cosine similarity scores and complete metadata.
        """
        if jurisdiction not in self.indexes:
            raise ValueError(f"Jurisdiction '{jurisdiction}' not loaded in dense FAISS retriever.")

        idx = self.indexes[jurisdiction]
        mapping = self.mappings[jurisdiction]
        k = min(top_k, idx.ntotal)

        scores, indices = idx.search(query_vec, k)
        scores = scores[0]
        indices = indices[0]

        candidates = []
        for rank, (faiss_id, score) in enumerate(zip(indices, scores), start=1):
            if faiss_id < 0 or faiss_id >= len(mapping):
                continue
            meta = mapping[faiss_id]
            # Ensure jurisdiction integrity
            if meta["jurisdiction"] != jurisdiction:
                raise RuntimeError(
                    f"CRITICAL FAISS CONTAMINATION: Index {jurisdiction} contained chunk {meta['chunk_id']} "
                    f"with jurisdiction {meta['jurisdiction']}"
                )

            cand = {
                "chunk_id": meta["chunk_id"],
                "document_id": meta.get("document_id", ""),
                "publication_number": meta.get("publication_number", ""),
                "jurisdiction": meta["jurisdiction"],
                "language": meta.get("language", "en"),
                "section": meta.get("section", ""),
                "title": meta.get("title", ""),
                "text": meta.get("text", ""),
                "source": meta.get("source") or meta.get("authority") or meta.get("source_type", ""),
                "source_url": meta.get("source_url"),
                "authority_tier": meta.get("authority_tier", 1),
                "domain": meta.get("domain", ""),
                "subdomain": meta.get("subdomain", ""),
                "dense_score": float(score),
                "dense_rank": rank,
                "faiss_id": int(faiss_id),
            }
            candidates.append(cand)

        return candidates

    def search(self, query: str, jurisdictions: List[str], top_k: int) -> List[dict]:
        """
        Performs dense search across the specified jurisdictions.
        Returns flattened list of candidates preserving jurisdiction provenance.
        """
        query_vec = self.embed_query(query)
        all_candidates = []
        for jur in jurisdictions:
            if jur in self.indexes:
                cands = self.search_jurisdiction(query_vec, jur, top_k)
                all_candidates.extend(cands)
        return all_candidates


# Global singleton
jurisdiction_faiss_retriever = JurisdictionFAISSRetriever()
