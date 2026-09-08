"""
backend/app/retrieval/jurisdiction_bm25_retriever.py
────────────────────────────────────────────────────
Jurisdiction-partitioned BM25Okapi lexical retriever over canonical_chunks.jsonl.
Builds BM25 indexes for US, EP, WO, and JP.
Caches pre-built tokenized corpora on disk for rapid startup.
Prioritizes: text, title, abstract, claims, section, publication number.

Uses Janome morphological tokenization for Japanese (JP) text to ensure
accurate lexical matching without altering the raw text or translating documents.
"""
from __future__ import annotations

import json
import logging
import pickle
import re
import string
from pathlib import Path
from typing import Dict, List, Optional
from rank_bm25 import BM25Okapi

from backend.app.retrieval.config import retrieval_config

logger = logging.getLogger(__name__)

# Basic punctuation and English stopwords
_PUNCT = set(string.punctuation)
_EN_STOPWORDS = {
    "a", "an", "and", "are", "as", "at", "be", "by", "for", "from",
    "has", "he", "in", "is", "it", "its", "of", "on", "that", "the",
    "to", "was", "were", "will", "with"
}

# Regex for Japanese script detection
_RE_JAPANESE = re.compile(r"[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]")

# Lazy loaded Janome tokenizer
_JANOME_TOKENIZER = None

def _get_janome():
    global _JANOME_TOKENIZER
    if _JANOME_TOKENIZER is None:
        try:
            from janome.tokenizer import Tokenizer
            _JANOME_TOKENIZER = Tokenizer()
        except ImportError:
            logger.warning("Janome is not installed; falling back to CJK character sequence tokenization.")
            _JANOME_TOKENIZER = False
    return _JANOME_TOKENIZER


def _tokenize_text(text: str, is_japanese: bool = False) -> List[str]:
    """
    Multilingual-safe tokenization:
    - Normalizes lowercase.
    - If Japanese text or Japanese jurisdiction, uses Janome morphological analyzer
      for high-quality morpheme tokenization.
    - Otherwise extracts alphanumeric tokens and handles CJK appropriately.
    """
    text = text.lower()
    if is_japanese or _RE_JAPANESE.search(text):
        janome = _get_janome()
        if janome:
            try:
                tokens = []
                for token in janome.tokenize(text):
                    surf = token.surface.strip()
                    if surf and surf not in _PUNCT and surf not in _EN_STOPWORDS:
                        tokens.append(surf)
                # Also include alphanumeric tokens (e.g. publication numbers, dates)
                alphanums = re.findall(r"[a-z0-9]+", text)
                tokens.extend(alphanums)
                return tokens
            except Exception as e:
                logger.warning(f"Janome tokenization failed: {e}. Falling back to character regex.")

    # Standard alphanumeric + CJK character extraction fallback
    tokens = re.findall(r"[a-z0-9]+|[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]", text)
    return [t for t in tokens if t not in _EN_STOPWORDS and t not in _PUNCT and len(t.strip()) > 0]


class JurisdictionBM25Retriever:
    """
    In-memory BM25Okapi retriever partitioned strictly by jurisdiction.
    """

    def __init__(self):
        self.indexes: Dict[str, BM25Okapi] = {}
        self.chunks: Dict[str, List[dict]] = {}
        self._initialized = False

    def build_or_load(self, force_rebuild: bool = False) -> None:
        """
        Loads cached BM25 indexes or builds them from canonical_chunks.jsonl.
        """
        if self._initialized and not force_rebuild:
            return

        cache_dir = Path(retrieval_config.bm25_cache_dir)
        cache_dir.mkdir(parents=True, exist_ok=True)
        cache_file = cache_dir / "jurisdiction_bm25_cache_v2.pkl"

        if cache_file.exists() and not force_rebuild:
            try:
                logger.info(f"Loading cached BM25 indexes from {cache_file} ...")
                with open(cache_file, "rb") as f:
                    data = pickle.load(f)
                    self.indexes = data["indexes"]
                    self.chunks = data["chunks"]
                    self._initialized = True
                    logger.info("BM25 cache successfully loaded for jurisdictions: %s", list(self.indexes.keys()))
                    return
            except Exception as e:
                logger.warning(f"Failed to load BM25 cache: {e}. Rebuilding from canonical chunks.")

        logger.info("Building BM25 indexes from canonical_chunks.jsonl ...")
        canonical_path = Path(retrieval_config.canonical_chunks_path)
        if not canonical_path.exists():
            raise FileNotFoundError(f"Canonical chunks file missing: {canonical_path}")

        raw_chunks: Dict[str, List[dict]] = {jur: [] for jur in retrieval_config.active_jurisdictions}
        corpus_tokens: Dict[str, List[List[str]]] = {jur: [] for jur in retrieval_config.active_jurisdictions}

        with open(canonical_path, "r", encoding="utf-8") as f:
            for line in f:
                if not line.strip():
                    continue
                item = json.loads(line)
                jur = item.get("jurisdiction")
                if jur in raw_chunks:
                    # Index fields prioritized: text, title, section, publication number
                    combined_text = f"{item.get('title', '')} {item.get('section', '')} {item.get('publication_number', '')} {item.get('text', '')}"
                    is_jp = (jur == "JP")
                    tokens = _tokenize_text(combined_text, is_japanese=is_jp)
                    corpus_tokens[jur].append(tokens)
                    raw_chunks[jur].append({
                        "chunk_id": item["chunk_id"],
                        "document_id": item["document_id"],
                        "publication_number": item["publication_number"],
                        "jurisdiction": jur,
                        "language": item.get("language", "en"),
                        "section": item.get("section", ""),
                        "title": item.get("title", ""),
                        "text": item.get("text", ""),
                        "source": item.get("source", ""),
                        "source_url": item.get("source_url"),
                        "filing_date": item.get("filing_date"),
                        "publication_date": item.get("publication_date"),
                    })

        for jur in retrieval_config.active_jurisdictions:
            logger.info(f"Building BM25Okapi for {jur} ({len(corpus_tokens[jur])} chunks) ...")
            if corpus_tokens[jur]:
                self.indexes[jur] = BM25Okapi(corpus_tokens[jur])
                self.chunks[jur] = raw_chunks[jur]
            else:
                logger.warning(f"No chunks found for jurisdiction {jur} in canonical corpus.")

        # Cache to disk for instantaneous future reloads
        try:
            with open(cache_file, "wb") as f:
                pickle.dump({"indexes": self.indexes, "chunks": self.chunks}, f, protocol=pickle.HIGHEST_PROTOCOL)
            logger.info(f"BM25 indexes saved to cache: {cache_file}")
        except Exception as e:
            logger.warning(f"Could not persist BM25 cache: {e}")

        self._initialized = True

    def search_jurisdiction(self, query: str, jurisdiction: str, top_k: int) -> List[dict]:
        """
        Executes BM25 search for a single jurisdiction.
        Returns list of candidate dicts with lexical scores and complete metadata.
        """
        if not self._initialized:
            self.build_or_load()

        if jurisdiction not in self.indexes:
            raise ValueError(f"Jurisdiction '{jurisdiction}' not found in BM25 indexes.")

        is_jp = (jurisdiction == "JP")
        tokens = _tokenize_text(query, is_japanese=is_jp)
        if not tokens:
            tokens = [query.lower()]

        bm25 = self.indexes[jurisdiction]
        chunk_list = self.chunks[jurisdiction]

        scores = bm25.get_scores(tokens)
        top_indices = sorted(range(len(scores)), key=lambda i: scores[i], reverse=True)[:top_k]

        candidates = []
        for rank, idx in enumerate(top_indices, start=1):
            score = float(scores[idx])
            if score <= 0.0:
                continue
            item = chunk_list[idx]
            cand = {
                "chunk_id": item["chunk_id"],
                "document_id": item["document_id"],
                "publication_number": item["publication_number"],
                "jurisdiction": item["jurisdiction"],
                "language": item["language"],
                "section": item["section"],
                "title": item["title"],
                "text": item["text"],
                "source": item["source"],
                "source_url": item.get("source_url"),
                "filing_date": item.get("filing_date"),
                "publication_date": item.get("publication_date"),
                "lexical_score": score,
                "lexical_rank": rank,
            }
            candidates.append(cand)

        return candidates

    def search(self, query: str, jurisdictions: List[str], top_k: int) -> List[dict]:
        """
        Performs lexical BM25 search across requested jurisdictions.
        """
        all_candidates = []
        for jur in jurisdictions:
            cands = self.search_jurisdiction(query, jur, top_k)
            all_candidates.extend(cands)
        return all_candidates


# Global singleton
jurisdiction_bm25_retriever = JurisdictionBM25Retriever()
