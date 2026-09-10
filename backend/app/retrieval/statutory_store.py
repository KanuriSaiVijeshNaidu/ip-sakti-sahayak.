"""
backend/app/retrieval/statutory_store.py
────────────────────────────────────────
High-precision statutory and regulatory anchor store for AYURLEX.
Provides targeted statutory retrieval across US, JP, EP, WO, and IN.
Maintains curated primary statutory articles, precomputed BM25 indexes,
and cached BGE-M3 embeddings for instantaneous sub-millisecond retrieval.
"""
from __future__ import annotations

import glob
import json
import logging
import pickle
from pathlib import Path
from typing import Dict, List, Optional, Any, Set
import numpy as np
from rank_bm25 import BM25Okapi

from backend.app.retrieval.config import retrieval_config
from backend.app.retrieval.jurisdiction_bm25_retriever import _tokenize_text

logger = logging.getLogger(__name__)

STATUTORY_DIR = Path("data/statutory")
EMBEDDINGS_CACHE_FILE = STATUTORY_DIR / "statutory_embeddings.pkl"


KNOWN_STATUTORY_ALIASES: Dict[str, str] = {
    # US
    "STATUTE-US-21USC-343R6": "STATUTE-US-FDCA-403R6",
    "STATUTE-US-FDCA-403R6": "STATUTE-US-FDCA-403R6",
    "STATUTE-US-21CFR-111": "REG-US-FDA-21CFR111",
    "REG-US-FDA-21CFR111": "REG-US-FDA-21CFR111",
    "STATUTE-US-21USC-321FF": "STATUTE-US-FDCA-201FF",
    "STATUTE-US-FDCA-201FF": "STATUTE-US-FDCA-201FF",
    "STATUTE-US-LANHAM-ACT-SEC2": "STATUTE-US-LANHAM-ACT-SEC2",
    "STATUTE-US-FDCA-413-NDI": "STATUTE-US-FDCA-413-NDI",
    "STATUTE-US-37CFR-1321-TERMINAL-DISCLAIMER": "STATUTE-US-37CFR-1321-TERMINAL-DISCLAIMER",
    "STATUTE-US-35USC-154-TERM": "STATUTE-US-35USC-154-TERM",
    
    # JP
    "STATUTE-JP-MHLW-CIRCULAR-429": "REG-JP-MHLW-429-FOOD-DRUG",
    "REG-JP-MHLW-429-FOOD-DRUG": "REG-JP-MHLW-429-FOOD-DRUG",
    "STATUTE-JP-CAA-FFC": "REG-JP-CAA-FFC-FRAMEWORK",
    "REG-JP-CAA-FFC-FRAMEWORK": "REG-JP-CAA-FFC-FRAMEWORK",
    "STATUTE-JP-TRADEMARK-SEC3": "STATUTE-JP-TRADEMARK-SEC3",
    "STATUTE-JP-PATENT-SEC67": "STATUTE-JP-PATENT-SEC67",
    "GUIDE-JP-JPO-MEDICAL-TREATMENT": "GUIDE-JP-JPO-MEDICAL-TREATMENT",
    
    # WO
    "STATUTE-WO-PCT-ART1": "STATUTE-WO-PCT-ART1-3",
    "STATUTE-WO-PCT-ART3": "STATUTE-WO-PCT-ART1-3",
    "STATUTE-WO-PCT-ART1-3": "STATUTE-WO-PCT-ART1-3",
    "STATUTE-WO-PCT-ART21": "STATUTE-WO-PCT-ART21-22",
    "STATUTE-WO-PCT-ART22": "STATUTE-WO-PCT-ART21-22",
    "STATUTE-WO-PCT-ART21-22": "STATUTE-WO-PCT-ART21-22",
    "STATUTE-WO-WIPO-SCOPE-BOUNDARY": "GUIDE-WO-PCT-SCOPE-BOUNDARY",
    "GUIDE-WO-PCT-SCOPE-BOUNDARY": "GUIDE-WO-PCT-SCOPE-BOUNDARY",
    "STATUTE-WO-PCT-ART18": "STATUTE-WO-PCT-ART18-ISR",
    "STATUTE-WO-PCT-ART18-ISR": "STATUTE-WO-PCT-ART18-ISR",
    "STATUTE-WO-PCT-ART19": "STATUTE-WO-PCT-ART19",
    "STATUTE-WO-PCT-CHAPTER2-IPRP": "STATUTE-WO-PCT-CHAPTER2-IPRP",

    # EP / EU
    "STATUTE-EP-EPC-ART83": "STATUTE-EP-EPC-ART83",
    "GUIDE-EP-EPC-ART64-NATIONAL-EFFECT": "GUIDE-EP-EPC-ART64-NATIONAL-EFFECT",
    "REG-EU-DIRECTIVE-2004-24-EC-THMPD": "REG-EU-DIRECTIVE-2004-24-EC-THMPD",
    "STATUTE-EU-THMPD-2004-24": "REG-EU-DIRECTIVE-2004-24-EC-THMPD",
    "DIRECTIVE-2004-24-EC": "REG-EU-DIRECTIVE-2004-24-EC-THMPD",

    # IN Real Corpus Mappings
    "STATUTE-IN-PATENTS-ACT-SEC3E": "IN_doc-india-code-patents-sec3e_section_3_e_001_ac8d41bd",
    "STATUTE-IN-PATENTS-ACT-SEC3P": "IN_doc-india-code-patents-sec3p_section_3_p_001_317e0468",
    "STATUTE-IN-PATENTS-ACT-SEC3D": "IN_IN-GUIDELINE-PATENTS-TK_section_3_d____incre_005_51268b43",
    "STATUTE-IN-PATENTS-ACT-SEC10": "IN_doc-india-code-patents-sec10_section_10_001_1a3f01b2",
    "REG-IN-DCA-RULE158B": "IN_doc-dcr-1945-rule158b_rule_158b_001_ad4e8f43",
    "REG-IN-DCA-SCHEDULE-T": "IN_doc-dcr-1945-schedulet_schedule_t_001_f36e9ccd",
    "REG-IN-FSSAI-AYURVEDA-AAHARA": "IN_IN-REG-FSSAI-AA-2022_regulation_2_2___lab_005_659cf24a",
    "STATUTE-IN-TRADEMARKS-ACT-SEC9": "IN_IN-ACT-TM-AYUR-1999_section_9___absolute_003_272220a1",
    "STATUTE-IN-TRADEMARKS-ACT-SEC11": "IN_IN-ACT-TM-GI-1999_section_11_1____save_006_c70c5088",
    "STATUTE-IN-BDA-SEC6": "IN_IN-ACT-BDA-2023_section_6___applicat_003_1a6ed9c3",
    "STATUTE-IN-PATENTS-ACT-SEC53": "IN_IN-ACT-PATENTS-1970_section_53___term_of_008_c00bdd65",
    "REG-IN-DCA-FORM25D": "IN_IN-COMM-AYURVEDA-D2C_selling_ayurvedic_pr_002_8ed1e929",
    "STATUTE-IN-PATENTS-ACT-SEC2JA": "IN_IN-ACT-PATENTS-1970_section_2_1__j_____i_002_53aef623",
    "STATUTE-IN-PATENTS-ACT-SEC2J": "IN_IN-ACT-PATENTS-1970_section_2_1__j_____i_002_53aef623",
    "STATUTE-IN-GI-ACT-1999": "IN_IN-ACT-GI-REGISTRY-1999_registered_botanical_004_9c343ac6",
    "STATUTE-IN-PATENTS-ACT-SEC3H": "IN_IN-ACT-PATENTS-1970_section_3_h____a_met_004_7cdc92d9",
}


class StatutoryStore:
    """
    In-memory hybrid retrieval store for curated statutory and regulatory anchors.
    Ensures legal articles (35 U.S.C., EPC, JPO Patent Act, PCT, Patents Act 1970)
    are readily retrieved and prioritized for statutory legal questions.
    """

    def __init__(self):
        self.anchors_by_jur: Dict[str, List[dict]] = {}
        self.all_anchors: List[dict] = []
        self.anchor_by_id: Dict[str, dict] = {}
        self.alias_to_canonical: Dict[str, str] = dict(KNOWN_STATUTORY_ALIASES)
        self.bm25_by_jur: Dict[str, BM25Okapi] = {}
        self.bm25_all: Optional[BM25Okapi] = None
        self.embeddings: Optional[np.ndarray] = None  # (N, 1024)
        self.chunk_id_to_idx: Dict[str, int] = {}
        self._initialized = False

    def resolve_canonical_id(self, chunk_id: str) -> str:
        """Resolves any statutory alias to its canonical chunk ID."""
        return self.alias_to_canonical.get(chunk_id, chunk_id)

    def get_anchor(self, chunk_id: str) -> Optional[dict]:
        """Retrieves a statutory anchor by canonical ID or alias."""
        canonical = self.resolve_canonical_id(chunk_id)
        return self.anchor_by_id.get(canonical) or self.anchor_by_id.get(chunk_id)

    def initialize(self, force_recompute: bool = False) -> None:
        """Loads all statutory JSONL files, builds BM25 indexes, and loads cached embeddings."""
        if self._initialized and not force_recompute:
            return

        logger.info("Initializing Statutory Store ...")
        self.anchors_by_jur = {}
        self.all_anchors = []
        self.anchor_by_id = {}
        self.alias_to_canonical = dict(KNOWN_STATUTORY_ALIASES)

        # 1. Load statutory JSONL files
        statutory_files = sorted(glob.glob(str(STATUTORY_DIR / "**" / "*.jsonl"), recursive=True))
        for file_path in statutory_files:
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    for line in f:
                        if not line.strip():
                            continue
                        chunk = json.loads(line)
                        cid = chunk.get("chunk_id") or chunk.get("source_id")
                        if not cid:
                            continue
                        chunk["chunk_id"] = cid
                        chunk["publication_number"] = chunk.get("publication_number") or cid
                        chunk["document_id"] = chunk.get("document_id") or cid
                        chunk["authority_tier"] = 1
                        chunk["evidence_type"] = chunk.get("evidence_type") or "statutory"

                        # Register aliases
                        for alias in chunk.get("aliases", []):
                            self.alias_to_canonical[alias] = cid
                            self.anchor_by_id[alias] = chunk

                        jur = chunk.get("jurisdiction", "").upper()
                        if jur not in self.anchors_by_jur:
                            self.anchors_by_jur[jur] = []
                        self.anchors_by_jur[jur].append(chunk)
                        self.all_anchors.append(chunk)
                        self.anchor_by_id[cid] = chunk
            except Exception as e:
                logger.error(f"Failed loading statutory file {file_path}: {e}")

        # Ensure all known aliases point to loaded canonical chunks
        for alias, canon in self.alias_to_canonical.items():
            if canon in self.anchor_by_id and alias not in self.anchor_by_id:
                self.anchor_by_id[alias] = self.anchor_by_id[canon]

        logger.info(
            "Loaded %d statutory anchors across jurisdictions: %s",
            len(self.all_anchors),
            {j: len(c) for j, c in self.anchors_by_jur.items()}
        )

        # 2. Build BM25 Okapi lexical indexes
        all_tokens = []
        for jur, chunks in self.anchors_by_jur.items():
            jur_tokens = []
            is_jp = (jur == "JP")
            for c in chunks:
                comb_text = f"{c.get('title', '')} {c.get('section', '')} {c.get('text', '')}"
                toks = _tokenize_text(comb_text, is_japanese=is_jp)
                jur_tokens.append(toks)
                all_tokens.append(toks)
            if jur_tokens:
                self.bm25_by_jur[jur] = BM25Okapi(jur_tokens)

        if all_tokens:
            self.bm25_all = BM25Okapi(all_tokens)

        # 3. Load or compute BGE-M3 embeddings
        self.chunk_id_to_idx = {c["chunk_id"]: idx for idx, c in enumerate(self.all_anchors)}
        
        cached_valid = False
        if EMBEDDINGS_CACHE_FILE.exists() and not force_recompute:
            try:
                with open(EMBEDDINGS_CACHE_FILE, "rb") as f:
                    cache_data = pickle.load(f)
                    cached_ids = cache_data.get("chunk_ids", [])
                    cached_emb = cache_data.get("embeddings")
                    if cached_ids == [c["chunk_id"] for c in self.all_anchors] and cached_emb is not None:
                        self.embeddings = cached_emb
                        cached_valid = True
                        logger.info("Loaded cached statutory embeddings of shape %s", str(self.embeddings.shape))
            except Exception as e:
                logger.warning("Failed loading cached statutory embeddings: %s. Will recompute.", e)

        if not cached_valid and self.all_anchors:
            logger.info("Computing statutory embeddings with BGE-M3 ...")
            import torch
            from sentence_transformers import SentenceTransformer
            dev = "cuda" if torch.cuda.is_available() else "cpu"
            model = SentenceTransformer(retrieval_config.embedding_model, device=dev)
            texts = [f"{a.get('title', '')}. {a.get('section', '')}. {a.get('text', '')}" for a in self.all_anchors]
            emb = model.encode(texts, normalize_embeddings=True, show_progress_bar=False)
            self.embeddings = np.asarray(emb, dtype=np.float32)
            try:
                with open(EMBEDDINGS_CACHE_FILE, "wb") as f:
                    pickle.dump({"chunk_ids": [c["chunk_id"] for c in self.all_anchors], "embeddings": self.embeddings}, f)
                logger.info("Saved statutory embeddings cache to %s", EMBEDDINGS_CACHE_FILE)
            except Exception as e:
                logger.warning("Could not persist statutory embeddings cache: %s", e)

        self._initialized = True
        logger.info("Statutory Store successfully initialized.")

    def search(
        self,
        query: str,
        jurisdictions: List[str],
        top_k: int = 10,
        query_vec: Optional[np.ndarray] = None,
        min_dense_sim: float = 0.25,
    ) -> List[dict]:
        """
        Executes hybrid (dense + BM25) retrieval over statutory anchors for target jurisdictions.
        Returns candidates formatted identically to retrieval pipeline candidates.
        """
        if not self._initialized:
            self.initialize()

        if not self.all_anchors:
            return []

        # Filter candidates by target jurisdictions
        jurs_set = set(j.upper() for j in jurisdictions)
        candidate_indices = [
            i for i, a in enumerate(self.all_anchors)
            if a.get("jurisdiction", "").upper() in jurs_set
        ]

        if not candidate_indices:
            return []

        # 1. Lexical BM25 Scoring
        q_tokens = _tokenize_text(query, is_japanese=("JP" in jurs_set))
        lexical_scores = np.zeros(len(candidate_indices), dtype=np.float32)
        if q_tokens and self.bm25_all is not None:
            all_scores = self.bm25_all.get_scores(q_tokens)
            for idx, c_idx in enumerate(candidate_indices):
                lexical_scores[idx] = all_scores[c_idx]

        # 2. Dense Cosine Similarity Scoring
        dense_scores = np.zeros(len(candidate_indices), dtype=np.float32)
        if self.embeddings is not None:
            if query_vec is None:
                from backend.app.retrieval.jurisdiction_faiss_retriever import jurisdiction_faiss_retriever
                if not jurisdiction_faiss_retriever._initialized:
                    jurisdiction_faiss_retriever.initialize()
                query_vec = jurisdiction_faiss_retriever.embed_query(query)

            q_vec_flat = query_vec.reshape(1, -1)
            cand_embeddings = self.embeddings[candidate_indices]  # (K, 1024)
            sims = np.matmul(cand_embeddings, q_vec_flat.T).flatten()  # (K,)
            dense_scores = sims

        # 3. Reciprocal Rank Fusion (RRF)
        lex_order = np.argsort(-lexical_scores)
        lex_rank_map = {idx: rank + 1 for rank, idx in enumerate(lex_order)}

        dense_order = np.argsort(-dense_scores)
        dense_rank_map = {idx: rank + 1 for rank, idx in enumerate(dense_order)}

        rrf_scores = []
        rrf_k = 60
        for idx in range(len(candidate_indices)):
            l_rank = lex_rank_map.get(idx, 999)
            d_rank = dense_rank_map.get(idx, 999)
            score = (1.0 / (rrf_k + l_rank)) + (1.0 / (rrf_k + d_rank))
            rrf_scores.append(score)

        ranked_order = np.argsort(-np.array(rrf_scores))

        results: List[dict] = []
        for r_idx in ranked_order[:top_k]:
            c_idx = candidate_indices[r_idx]
            anchor = self.all_anchors[c_idx]
            d_score = float(dense_scores[r_idx])
            l_score = float(lexical_scores[r_idx])
            r_score = float(rrf_scores[r_idx])

            # Filter out completely irrelevant anchors if dense similarity is below floor and lexical didn't match
            if d_score < min_dense_sim and l_score <= 0.0:
                continue

            item = dict(anchor)
            item["score"] = round(r_score, 4)
            item["dense_score"] = round(d_score, 4)
            item["lexical_score"] = round(l_score, 4)
            item["rrf_score"] = round(r_score, 4)
            item["authority_tier"] = 1
            item["evidence_type"] = "statutory"
            results.append(item)

        return results


# Global singleton instance
statutory_store = StatutoryStore()
