# Phase 5 — Retrieval Validation & Final Technical Hardening Report

## 1. Validation Summary

The Phase 5 test suite rigorously verifies all retrieval components across 45 automated tests without any synthetic or fabricated patent records.

| Test Suite | Total Tests | Passed | Failed | Status |
|------------|-------------|--------|--------|--------|
| `tests/test_phase5_query_routing.py` | 12 | 12 | 0 | PASSED |
| `tests/test_phase5_dense_retrieval.py` | 5 | 5 | 0 | PASSED |
| `tests/test_phase5_bm25.py` (with Janome) | 6 | 6 | 0 | PASSED |
| `tests/test_phase5_rrf.py` (full math) | 5 | 5 | 0 | PASSED |
| `tests/test_phase5_reranking.py` (multilingual safety) | 3 | 3 | 0 | PASSED |
| `tests/test_phase5_jurisdiction_isolation.py` | 4 | 4 | 0 | PASSED |
| `tests/test_phase5_retrieval_pipeline.py` | 10 | 10 | 0 | PASSED |
| **Total Phase 5 Tests** | **45** | **45** | **0** | **100% PASS** |

---

## 2. Final Hardening Review

### 2.1 Japanese BM25 Quality
- **Implementation**: Integrated `Janome` pure-Python morphological tokenizer for all Japanese patent texts and query parsing.
- **Verification**: Tested against actual compound Japanese terms (`日本における抽出物組成物の特許`, `抗炎症組成物`).
- **Result**: Successfully extracts morphemes (`日本`, `抽出`, `物`, `組成`, `物`, `特許`) producing non-empty lexical candidate lists with exact kanji/kana boundary preservation.
- **Corpus Integrity**: No canonical chunk files were modified or translated.

### 2.2 Multilingual Reranker Safety
- **Primary Model**: `BAAI/bge-reranker-v2-m3` loaded and verified on GPU (NVIDIA GeForce RTX 4050 6GB).
- **Safety Invariant**: English-only models (such as `ms-marco-MiniLM-L-6-v2`) are **strictly blocked** from silently substituting for multilingual or Japanese queries.
- **Fallback Behavior**: If the multilingual reranker is unavailable, the pipeline safely falls back to RRF rank order without falsifying neural relevance scores.

### 2.3 Strict Jurisdiction Isolation
- Single-jurisdiction requests (`US`, `EP`, `WO`, `JP`) return 100% compliant candidates.
- Comparison queries (`JP + US`) strictly restrict candidates to `JP` and `US`.
- `IN` is deferred and `DE` is permanently quarantined. Any query targeting forbidden jurisdictions fails with HTTP 400 Bad Request. Contamination triggers immediate abort.

### 2.4 Mathematical RRF & Provenance Invariants
- Verified mathematically:
  - Candidates in both streams: $RRF = \frac{1}{60 + dense\_rank} + \frac{1}{60 + lexical\_rank}$.
  - Candidates in a single stream: $RRF = \frac{1}{60 + rank}$.
- Full provenance chain (`chunk_id`, `document_id`, `publication_number`, `jurisdiction`, `language`, `section`, `text`, `source`, `source_url`, and all stage scores) survives from FAISS/BM25 through RRF and Reranking into `EvidenceResult`.

---

## 3. Real Corpus Query Audit Table

Captured from live execution against the 70,608-chunk corpus:

| Scenario | Query | Lang | Intent | Routed | Dense | BM25 | RRF | Reranked | Final | Top 3 Pub Numbers | Top Jurisdictions | Latency |
|----------|-------|------|--------|--------|-------|------|-----|----------|-------|-------------------|-------------------|---------|
| **US** | *"What are the US patent requirements for rosacea treatments?"* | en | patentability | US | 30 | 30 | 50 | 20 | 5 | US20160158263A1, US20160184342A1, US20160184354A1 | US, US, US | 53.1s |
| **JP English** | *"What patents exist in Japan for formulation compositions?"* | en | formulation_search | JP | 30 | 30 | 60 | 20 | 5 | JP2020121979A, JP2020019789A, JP2020138967A | JP, JP, JP | 76.4s |
| **JP Japanese** | *"日本における抽出物組成物の特許"* | ja | formulation_search | JP | 30 | 30 | 57 | 20 | 5 | JP2020164495A, JP2020063225A, JP2020138967A | JP, JP, JP | 76.0s |
| **Europe** | *"Search European patent specifications for pharmaceuticals"* | en | patent_search | EP | 30 | 30 | 58 | 20 | 5 | EP 2054556 A1, EP 2074418 A1, EP 2001797 A1 | EP, EP, EP | 17.3s |
| **WIPO PCT** | *"PCT international patent applications for medical treatments"* | en | patent_search | WO | 30 | 30 | 52 | 20 | 5 | WO2009051840A2, WO2009008924A2, WO2007014514A1 | WO, WO, WO | 43.2s |
| **Cross-Lingual** | *"米国特許の要件は何ですか？"* | ja | patent_search | US | 30 | 0 | 30 | 20 | 5 | US20160235800A1, US20160137989A1, US20160168154A1 | US, US, US | 49.8s |
| **Global** | *"Novel bioactive formulations and delivery systems"* | en | formulation_search | US, EP, WO, JP | 120 | 109 | 212 | 20 | 5 | US20170202786A1, US20160250297A1, WO2011000106A1 | US, US, WO | 61.5s |

*Note: In accordance with SIH 26045 directives, no semantic retrieval quality metrics (Precision/Recall/F1/MRR) are fabricated. Latencies reflect real hardware execution on the target machine.*

---

## 4. Final Verdict

- Phase 5 Hybrid Retrieval: **VERIFIED & HARDENED**
- All Hard Constraints (`LANGUAGE != JURISDICTION`, strict isolation, no IN/DE): **ENFORCED**
- Core Regression Tests (Phases 2–4): **40/40 PASSED**
- Decision: **PHASE 5 COMPLETE**
