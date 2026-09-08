# Phase 5 — Intelligent Query Routing + Hybrid Retrieval Architecture

## Executive Summary
Phase 5 implements the production-grade hybrid retrieval engine for **IP-SAKTI Sahayak / AYURLEX (SIH 26045)**. Operating strictly on the verified multi-jurisdictional Phase 4 BGE-M3 embeddings and FAISS index assets (70,608 chunks across US, EP, WO, and JP), the pipeline achieves multi-stage candidate retrieval, Reciprocal Rank Fusion (RRF), cross-encoder reranking, and hard jurisdiction isolation.

**Phase 5 Scope Constraint**: Retrieval only. Stops immediately after ranked `EvidenceResult` candidate selection without invoking downstream LLM generation or legal synthesis.

---

## 1. High-Level Retrieval Flow

```
                      USER QUERY
                          │
                          ▼
                 QUERY UNDERSTANDING
                          │
           ┌──────────────┴──────────────┐
           │                             │
    LANGUAGE DETECTION           JURISDICTION ROUTER
     (en, ja, hi, te)          (US, EP, WO, JP, GLOBAL)
           │                             │
           └──────────────┬──────────────┘
                          │
                          ▼
               JURISDICTION-SAFE ROUTE
                          │
           ┌──────────────┴──────────────┐
           │                             │
           ▼                             ▼
    DENSE RETRIEVAL               LEXICAL RETRIEVAL
   (BGE-M3 1024-dim +           (Jurisdiction-partitioned
     FAISS IndexFlatIP)          Janome/BM25 on chunks)
           │                             │
           └──────────────┬──────────────┘
                          │
                          ▼
             RECIPROCAL RANK FUSION (RRF)
                  k = 60 (configurable)
                          │
                          ▼
                    DEDUPLICATION
                   (by chunk_id)
                          │
                          ▼
                CROSS-ENCODER RERANKING
               (BAAI/bge-reranker-v2-m3)
                          │
                          ▼
              JURISDICTION SAFETY CHECK
          (Fail/abort if contamination)
                          │
                          ▼
                  EVIDENCE SELECTION
            (Diversity across sections/docs)
                          │
                          ▼
               STRUCTURED RETRIEVAL RESULT
                          │
                          X
                STOP — NO LLM GENERATION
```

---

## 2. Core Architectural Pillars

### 2.1 Language Detection != Jurisdiction Routing
A core architectural invariant of IP-SAKTI Sahayak:
- **Language Detection**: Identifies the linguistic script (English `en`, Japanese `ja`, Devanagari `hi`, Telugu `te`).
- **Multilingual Support**: Because `BAAI/bge-m3` and `BAAI/bge-reranker-v2-m3` are natively multilingual, non-English queries are processed directly without artificial machine translation.
- **Jurisdiction Independence**: Querying in Japanese about US patents (e.g. `米国特許の要件は何ですか？`) routes strictly to **US** patent indexes, **not** Japanese patent indexes.

### 2.2 Strict Jurisdiction Security & Isolation
- **Active Jurisdictions**: `US`, `EP`, `WO`, `JP`.
- **Deferred**: `IN` (retained in base statutory schemas but deferred from retrieval).
- **Removed**: `DE` (permanently quarantined; attempts to query DPMA/DE return HTTP 400 Bad Request).
- **Post-Stage Verification**: `JurisdictionGuard` inspects candidate chunks after Dense retrieval, Lexical retrieval, RRF, and Reranking. Any foreign chunk or contamination aborts retrieval immediately.

### 2.3 Dual-Stream Candidate Retrieval
1. **Stream A (Dense)**:
   - Embeds query with `BAAI/bge-m3` (1024-dim, L2-normalized).
   - Queries `IndexFlatIP` on target jurisdiction partitions (`bge_m3_{jur}_flatip.faiss`).
   - Retrieves top 30 candidates with exact cosine similarity scores.
2. **Stream B (Lexical)**:
   - BM25Okapi partitioned per jurisdiction over `data/embedding_ready/canonical_chunks.jsonl`.
   - **Japanese Morphological Tokenization**: Employs `Janome` morphological analyzer on Japanese text and compound terms, preserving exact Japanese kanji/hiragana/katakana boundaries.
   - Retrieves top 30 lexical candidates.

### 2.4 Reciprocal Rank Fusion (RRF) & Deduplication
- Candidates from both streams are merged using:
  $$RRF\_score(d) = \sum_{m \in \{dense, lexical\}} \frac{1}{k + rank_m(d)}$$
  where $k=60$ (configurable in `RetrievalConfig`).
- Uniquely deduplicates by `chunk_id` while preserving complete provenance (`dense_score`, `dense_rank`, `lexical_score`, `lexical_rank`).

### 2.5 Multilingual Cross-Encoder Reranking Safety
- Primary model: `BAAI/bge-reranker-v2-m3` on GPU (RTX 4050 6GB).
- **Safety Invariant**: Under no circumstances is an English-only model (like `ms-marco-MiniLM`) silently substituted for multilingual/Japanese queries. If the multilingual cross-encoder is unavailable, the pipeline safely falls back to RRF rank ordering without fabricating neural relevance scores.

### 2.6 Standardized Evidence Result Object
Every returned evidence object strictly implements the `EvidenceResult` schema:
- `chunk_id`, `document_id`, `publication_number`
- `jurisdiction`, `language`, `section`, `title`, `text`, `source`, `source_url`
- `dense_score`, `dense_rank`, `lexical_score`, `lexical_rank`, `rrf_score`, `rerank_score`, `final_rank`

---

## 3. Configuration Hyperparameters (`retrieval_config`)

| Parameter | Value | Description |
|-----------|-------|-------------|
| `dense_top_k` | 30 | Dense candidates retrieved per jurisdiction |
| `lexical_top_k` | 30 | BM25 candidates retrieved per jurisdiction |
| `rrf_k` | 60 | Smoothing constant in Reciprocal Rank Fusion formula |
| `rerank_top_k` | 20 | Candidates fed to cross-encoder reranker |
| `final_top_k` | 10 | Final evidence results presented |
| `embedding_model` | `BAAI/bge-m3` | 1024-dimensional dense multilingual model |
| `reranker_model` | `BAAI/bge-reranker-v2-m3` | 568M multilingual cross-encoder |
| `active_jurisdictions`| `["US", "EP", "WO", "JP"]` | Authorized active patent jurisdictions |
| `forbidden_jurisdictions` | `["IN", "DE"]` | Strictly blocked and rejected jurisdictions |
