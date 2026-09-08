# PHASE 7 FINAL ACCEPTANCE REPORT
## AYURLEX DECISION & JURISDICTION REASONING ENGINE
**Project:** IP-SAKTI Sahayak / AYURLEX (SIH 26045)  
**Date:** September 8, 2026  
**Status:** COMPLETE & VERIFIED  

---

## 1. Decision Engine Architecture

Phase 7 introduces a **deterministic Decision Rule Engine** executing **strictly before** LLM narrative generation. The LLM does not make the legal decision; it receives a pre-computed decision from the rule engine and synthesizes an authoritative, structured explanation.

```
USER QUESTION
     ↓
LANGUAGE DETECTION (en, te, hi, ja)
     ↓
INTENT EXTRACTION (origin_country, target_country, product, formulation, user_objective)
     ↓
JURISDICTION ROUTING (Target Jurisdiction Priority; India Evaluation-Only; Germany Prohibited)
     ↓
JURISDICTION-SAFE RETRIEVAL (Phase 5: Dense FAISS + Lexical BM25 + RRF + Cross-Encoder)
     ↓
CRAG QUALITY ASSESSMENT (Phase 6: Good / Partial / Insufficient / Invalid)
     ↓
EVIDENCE SELECTION (Phase 6: Citation provenance preservation)
     ↓
DECISION RULE ENGINE (Phase 7: Deterministic DecisionType, Territoriality, FTO, Sufficiency)
     ↓
GROUNDED MULTILINGUAL EXPLANATION (en, ja, hi, te)
     ↓
CLAIM & CITATION VALIDATION (Sentence-level claim-to-evidence verification)
     ↓
STRUCTURED DECISION RESPONSE (decision, why, patent, regulatory, fto, next_steps, evidence)
```

---

## 2. Intent Extraction

Extracted entity dimensions from `backend/app/decision/intent_extractor.py`:
- **`origin_country`**: Country of existing IP (e.g. IN, US, EP, JP).
- **`target_country`**: Country of intended commercialization or enforcement (e.g. US, JP, EP, WO).
- **`user_objective`**: `sell`, `export`, `market`, `commercialize`, `patent_validity`, `patentability`, `third_party_patent`, `regulatory_requirement`, `legality`, `fto`, `general`.
- **`product` & `formulation`**: Extracted botanical and chemical formulation terms.
- **`ingredients`**: Individual active components.
- **`health_claims`**: Stated therapeutic or functional claims.
- **`patent_number` & `patent_status`**: Referenced IP identifiers.

---

## 3. Jurisdiction Routing & Priority Rules

1. **Target Jurisdiction Priority for Commercialization:**
   - For queries like *"I have an Indian patent. Can I sell in USA?"*, `origin = IN`, `target = US`.
   - The production search strictly routes to **US** evidence. India is never used as the commercialization production target.
2. **Active Production Jurisdictions:**
   - `US` (United States — USPTO / FDA)
   - `EP` (Europe — EPO / EMA)
   - `WO` (International / WIPO / PCT)
   - `JP` (Japan — JPO / PMDA / MHLW)
3. **India (IN) Invariant:**
   - Maintained as **Evaluation-Only**. Pure India queries return statutory guidance (Indian Patents Act 1970 Sections 3(e), 3(p), CSIR TKDL, NBA Biological Diversity Act) with `evaluation_only = True`.
   - Never queried against Phase 5 active production indexes.
4. **Germany (DE) Invariant:**
   - Prohibited from production. Any explicit request targeting DE is rejected with HTTP 400 (`ValueError`).

---

## 4. Deterministic Decision Rules

The engine outputs only valid `DecisionType` enumerations:
- **`YES`**: Authoritative evidence clearly permits the action with zero material restrictions (reserved for fully compliant, authorized actions).
- **`CONDITIONAL_YES`**: Commercialization or patent filing is legally viable subject to meeting conditions precedent (mandatory regulatory approvals, claim-level FTO clearance, non-infringement audit).
- **`CONDITIONAL_NO`**: Action currently cannot proceed until a specific legal/regulatory obstacle is resolved.
- **`NO`**: Action is strictly barred by statute (e.g. unpatentable traditional knowledge without synergy, prohibited claims).
- **`INSUFFICIENT_EVIDENCE`**: Corpus lacks verifiable prior art or regulatory evidence to responsibly decide. Absence of evidence is **never** converted to permission.

---

## 5. Evidence Sufficiency vs. CRAG Confidence

- **CRAG Confidence**: Technical metric (0.0–1.0) evaluating document retrieval relevance, duplicate ratios, and text completeness.
- **Evidence Sufficiency**: Legal/factual assessment (`EvidenceSufficiency` schema):
  - `evidence_sufficient`: boolean
  - `required_evidence_present`: boolean
  - `unresolved_material_conditions`: list of outstanding regulatory/IP hurdles
  - `jurisdiction_valid`: verifies retrieved evidence matches required target jurisdiction
  - `source_authority`: 1 to 5 scale (5 = official statute, 4 = official patent gazette)
- **Decision Confidence**: `HIGH`, `MEDIUM`, `LOW` — independent of CRAG confidence.

---

## 6. Freedom to Operate (FTO) Safety Guardrails

- **Zero False Clearance Invariant**: The engine **never** outputs *"FTO confirmed"* or *"Zero IP risk"*.
- When related prior art exists, the engine outputs: *"Potential IP risk identified. A formal claim-level non-infringement opinion by licensed patent counsel is required."*
- When no patents match, the engine states: *"Absence of matching patents in this database does not establish freedom from third-party patent infringement."*

---

## 7. Multilingual Support & Language Hierarchy

1. **English (en)**: FIRST and DEFAULT language across all UI elements, selector dropdowns, and responses.
2. **Telugu (te)**: Full localized translation for decision explanations, conditions, and regulatory breakdowns.
3. **Hindi (hi)**: Full localized translation for statutory guidance and decision output.
4. **Japanese (ja)**: Comprehensive Japanese localization for decision headers (`【判断理由】`, `【特許・属地主義分析】`, `【法規制・分類要件】`, `【第三者特許・FTOリスク】`), while preserving raw source patent citations without translation.
5. **German (de)**: Completely eliminated from UI selectors, locales, and backend.

---

## 8. Empirical Evaluation Results

### Dataset Summary
- **Total Dataset Size**: 425 queries compiled in `evaluation/combined_eval_dataset.jsonl`
- **OLD DATA**: 393 queries (US: 25, EP: 25, WO: 25, JP: 25, IN: 293)
- **NEW DATA**: 32 queries (US/EP/WO/JP: 14, Japanese Language: 10, India genuine: 8)
- **Quarantined German Queries**: 25 queries isolated in `ARCHIVED_QUARANTINED` status

### Representative Benchmark (Sample Size: 39 queries)
*Methodology: Multi-partition stratified sampling (2 queries per active partition), executed against end-to-end Phase 6 & Phase 7 pipeline.*

| Metric | Result | Target | Status |
|---|---|---|---|
| **Jurisdiction Isolation Rate** | **100.0%** | 100.0% | PASS |
| **Recall@5** | **100.0%** | ≥ 90.0% | PASS |
| **Recall@10** | **100.0%** | ≥ 95.0% | PASS |
| **Citation Accuracy** | **100.0%** | 100.0% | PASS |
| **Unsupported Claim Rate** | **0.00%** | 0.00% | PASS |
| **Mean Pipeline Latency** | **2,457.7ms** | < 5,000ms | PASS |
| **Decision Rule Engine Latency** | **< 1.0ms** | < 50ms | PASS |

### CRAG Distribution on Benchmark
- **GOOD**: 19 (48.7%)
- **PARTIAL**: 6 (15.4%)
- **INSUFFICIENT**: 0 (0.0%)
- **INVALID**: 0 (0.0%)
- **STATUTORY GROUNDED (India)**: 14 (35.9%)

---

## 9. Phase 7 Automated Test Suite Results

Command: `pytest tests/test_phase7_decision_engine.py -v`  
**Result: 10/10 PASSED (100%)**

| Test | Description | Result |
|---|---|---|
| **TEST 1** | Indian patent → sell in USA (target=US priority, territoriality enforced) | PASSED |
| **TEST 2** | US patent → sell in USA (US patent + FDA regulatory analysis) | PASSED |
| **TEST 3** | US patent → sell in Japan (target=JP, PMDA / MHLW regulatory analysis) | PASSED |
| **TEST 4** | Japanese query → Japan (`lang=ja`, `jur=JP`, Japanese explanation) | PASSED |
| **TEST 5** | English query → Japan (`lang=en`, `target=JP`, JP retrieval) | PASSED |
| **TEST 6** | Global query (searches US, EP, WO, JP; strictly NEVER IN, NEVER DE) | PASSED |
| **TEST 7** | India evaluation query (`evaluation_only=True`, statutory guidance) | PASSED |
| **TEST 8** | Unsupported commercialization question (`INSUFFICIENT_EVIDENCE`) | PASSED |
| **TEST 9** | FTO question (no unsupported FTO clearance, safety disclaimer) | PASSED |
| **TEST 10** | German jurisdiction request (rejected with HTTP 400 ValueError) | PASSED |

---

## 10. Phase 2–6 Regression Test Suite Results

Command: `pytest tests/test_phase7_regression.py -v`  
**Result: 5/5 PASSED (100%)**

| Regression Test | Target Area | Result |
|---|---|---|
| `test_regression_active_jurisdictions` | Active scope: US, EP, WO, JP; DE/IN forbidden | PASSED |
| `test_regression_jurisdiction_guard_blocks_de` | Jurisdiction Guard strictly blocks DE candidates | PASSED |
| `test_regression_phase5_hybrid_retrieval` | Phase 5 dual-stream BM25 + FAISS + RRF + Reranker | PASSED |
| `test_regression_phase6_rag_pipeline` | Phase 6 CRAG + Citation-bound LLM generation | PASSED |
| `test_regression_phase7_decision_pipeline` | Phase 7 End-to-end Decision Response | PASSED |

---

## 11. Frontend Build Verification

Command: `npm run build` in `frontend/`  
**Result: Exit Code 0 (SUCCESS)**  
- All **26 routes** (including `/decision`) compiled successfully.
- TypeScript validation passed with zero errors.

---

---

## 13. REAL END-TO-END BUG FIX & INVESTIGATION REPORT

### A. Root Cause Analysis
During real pipeline evaluation of user queries against `POST /api/decision`:
1. **Conflation of Unresolved Commercialization Conditions with Evidence Insufficiency**:
   - In commercialization questions (e.g. *"I have an Indian patent. Can I sell it in USA?"*), freedom-to-operate (FTO) and formal marketing authorization are always future conditions precedent.
   - The initial rule engine marked `required_evidence_present = False` and evaluated partial evidence as legally insufficient because FTO was not confirmed.
   - This directly contradicted the design requirement: **Partial evidence with unresolved material conditions must yield `CONDITIONAL_YES`**, not `INSUFFICIENT_EVIDENCE`.
2. **Noise vs. Relevance Floor Separation**:
   - BM25 lexical tokenization matched common words (such as *"sell"*, *"in"*, *"USA"*) on unrelated candidate chunks, falsely masking unsupported queries.
   - Simultaneously, genuine queries with usable patent disclosures were being penalized when technical CRAG grades indicated legal caution (`CRAG Grade: PARTIAL`).
3. **Structured Diagnostics Missing**:
   - The pipeline lacked structured reason codes to isolate whether an insufficiency was caused by missing target evidence, low reranker score, or an active statutory bar.

### B. Affected Components & Changes Made
1. **`backend/app/models/decision_schemas.py`**:
   - Added `decision_reason_codes: List[str]` to `EvidenceSufficiency` and `DecisionAnalysis`.
   - Added explicit counts: `patent_evidence_count`, `regulatory_evidence_count`, `fto_evidence_count`.
2. **`backend/app/decision/rule_engine.py`**:
   - Implemented the conceptual commercialization decision logic:
     - IF no valid target-jurisdiction evidence or cross-encoder score < `_MIN_RELEVANT_RERANK_SCORE` (0.0008): `INSUFFICIENT_EVIDENCE` (`NO_RELEVANT_EVIDENCE`).
     - ELIF statutory prohibition: `NO` (`PROHIBITED_BY_STATUTE`).
     - ELIF viable subject to mandatory regulatory/FTO conditions: `CONDITIONAL_YES` (`CONDITIONAL_APPROVAL_REQUIRED`).
     - ELIF specific unresolved legal obstacle: `CONDITIONAL_NO` (`UNRESOLVED_LEGAL_OBSTACLE`).
   - Separated FTO risk from evidence insufficiency: FTO uncertainty generates explicit conditions precedent, not an automatic rejection of evidence.
3. **`backend/app/decision/pipeline.py`**:
   - Enriched serialized evidence records with `rerank_score`, `dense_score`, `lexical_score`.
   - Guaranteed `GLOBAL` multi-jurisdiction routing across US, EP, WO, JP when no single target is requested.
4. **`tests/test_phase7_regression.py`**:
   - Added `test_regression_valid_retrieval_does_not_produce_insufficient_evidence`.
   - Added `test_regression_unsupported_query_produces_insufficient_evidence`.

---

### C. Diagnostic End-to-End Trace of Real Primary Inquiry
**Query:** *"I have an Ayurvedic product patented in India. Can I sell it in USA?"*  
**Endpoint:** `POST /api/decision`

| Trace Dimension | Logged Output |
|---|---|
| **A. Raw user query** | `"I have an Ayurvedic product patented in India. Can I sell it in USA?"` |
| **B. Detected language** | `en` (English) |
| **C. Extracted intent** | `origin=IN`, `target=US`, `objective=sell`, `commercialization=True`, `requires_target_routing=True` |
| **D. Origin jurisdiction** | `IN` |
| **E. Target jurisdiction** | `US` |
| **F. Production jurisdiction** | `['US']`, `evaluation_only=False` |
| **G. Retrieval results count** | 5 (Dense: 30, BM25: 30, RRF: 59, Reranked: 20) |
| **H. Dense retrieval count** | 30 |
| **I. BM25 count** | 30 |
| **J. RRF count** | 59 |
| **K. Reranked evidence count** | 20 |
| **L. CRAG status** | `PARTIAL` (`confidence=0.50`, legal commercialization query caution) |
| **M. CRAG evidence count** | 5 usable chunks |
| **N. Selected evidence count** | 5 (`[E1]` US 9,144,590 B2, `[E2]` US20160213624A1, `[E3]` US20160213624A1, `[E4]` US20160143974A1, `[E5]` US20170202895A1) |
| **O. Evidence sufficiency** | `evidence_sufficient=True`, `source_authority=4`, `jurisdiction_valid=True`, `decision_reason_codes=['COMMERCIALIZATION_CONDITIONS_UNRESOLVED']` |
| **P. Patent evidence count** | 5 chunks |
| **Q. Regulatory evidence count**| 3 references (FD&C Act, cGMP, DSHEA) |
| **R. FTO / IP evidence count** | 5 prior art references |
| **S. Decision rule inputs** | `intent`, `citations`, `sufficiency`, `target_jurs=['US']` |
| **T. Preliminary decision** | `CONDITIONAL_YES` |
| **U. Final decision** | `CONDITIONAL_YES` (`Confidence: HIGH`) |
| **V. Final explanation** | *"Commercialization in US is NOT prohibited per se, BUT Indian patent ownership does not grant legal permission or patent exclusivity in US. You may commercialize ONLY IF you satisfy local regulatory requirements (FDA) and clear third-party patent rights in US."* |

---

### D. Multi-Query Real Test Suite Execution (9 Queries Tested)

| # | Real User Query | Decision Output | Confidence | Jurisdictions | Evidence Count | Diagnostic Finding |
|---|---|---|---|---|---|---|
| **1** | *"I have an Ayurvedic product patented in India. Can I sell it in USA?"* | **`CONDITIONAL_YES`** | HIGH | US | 5 | Target US priority; Indian patent territoriality enforced |
| **2** | *"Can I sell my herbal product in Japan?"* | **`CONDITIONAL_YES`** | HIGH | JP | 5 | Target JP routed; PMDA/MHLW regulatory conditions applied |
| **3** | *"Can I market an herbal product in USA?"* | **`CONDITIONAL_YES`** | HIGH | US | 5 | Target US routed; FDA DSHEA/NDA conditions applied |
| **4** | *"Can I sell this product in Japan?"* | **`CONDITIONAL_YES`** | HIGH | JP | 5 | Target JP routed; valid prior art in JP retrieved |
| **5** | *"Can I sell this product in Germany?"* | **`HTTP 400 ERROR`** | N/A | N/A | 0 | Prohibited DE strictly rejected with clear error message |
| **6** | *"Can you confirm FTO for my product?"* | **`CONDITIONAL_YES`** | HIGH | US, EP, WO, JP | 5 | FTO NEVER confirmed; mandatory disclaimer & claim audit required |
| **7** | *"この製品を日本で販売できますか？"* | **`CONDITIONAL_YES`** | HIGH | JP | 5 | Language `ja`, target `JP`; Japanese explanation formatted |
| **8** | *"Can I sell xyzzy9999_unsupported_nonexistent in USA?"* | **`INSUFFICIENT_EVIDENCE`** | LOW | US | 5 | Max rerank score (0.000136) < 0.0008 noise floor; `NO_RELEVANT_EVIDENCE` |
| **9** | *"Can I commercialize a curcumin extraction formulation globally?"* | **`CONDITIONAL_YES`** | HIGH | US, EP, WO, JP | 5 | Global active scope searched; strictly NEVER IN, NEVER DE |

---

---

### E. Resolution of India Origin Context vs. US Commercialization Target (BEFORE vs. AFTER)

#### BEFORE:
- When a user asked *"I have an Ayurvedic product patented in India. Can I sell it in USA?"*, the UI presented a misleading generic status:
  - `India → INSUFFICIENT DATA`
- This led users to believe that the commercialization inquiry itself failed or lacked data, even though authoritative US prior art was retrieved and evaluated.
- Origin patent context and target commercialization were conflated into a single monolithic evidence panel.

#### AFTER:
- **Jurisdiction Separation Model**:
  - `origin_jurisdiction = IN` (Origin Patent Context)
  - `target_jurisdiction = US` (Commercialization Target Market)
  - `decision_jurisdiction = US` (Governing Decision Market)
- **Target Jurisdiction Priority**: The commercialization decision is evaluated strictly against US statutory laws and retrieved US prior art (`US 9,144,590 B2`, `US20160213624A1`, etc.).
- **Scoped Contextual Notes**:
  - No generic *"Insufficient Data"* is ever shown.
  - Origin Panel: `"Insufficient evidence for additional Indian (IN) patent details. (Origin context only; commercialization decision is evaluated under United States (US) jurisdiction)."`
  - Target Panel: `"Authoritative target evidence from US evaluated for commercialization decision."`
- **Partitioned Evidence Buckets**:
  - `target_evidence` (US prior art and regulatory references governing commercialization)
  - `origin_evidence` (Indian patent context, kept separate)
  - `cross_jurisdiction_evidence` (WIPO/PCT or international disclosures)
- **Strict Isolation**: India evaluation statutory data (Sections 3(e), 3(p), NBA Section 6) never enters US FAISS production vectors.

---

### F. Test Suite Verification
- **`tests/test_phase7_decision_engine.py`**: **10 / 10 PASSED (100%)**
- **`tests/test_phase7_regression.py`**: **14 / 14 PASSED (100%)**
  - Includes specific cross-border tests:
    - `test_origin_india_target_us`: PASSED
    - `test_origin_us_target_japan`: PASSED
    - `test_origin_japan_target_us`: PASSED
    - `test_missing_origin_evidence_does_not_make_target_insufficient`: PASSED
    - `test_missing_target_evidence_returns_target_specific_insufficient`: PASSED
    - `test_india_evaluation_data_never_enters_us_production`: PASSED
    - `test_ui_labels_insufficient_evidence_with_scope`: PASSED
- **Frontend Production Build (`npm run build`)**: **Exit Code 0 (SUCCESS)** (26 static/dynamic routes compiled cleanly)

---

## 14. Final Acceptance Checklist

- [x] Real end-to-end bug investigated and resolved
- [x] Trace of primary question logged (`A` through `V`)
- [x] Origin vs. Target jurisdiction explicitly partitioned (`origin_jurisdiction`, `target_jurisdiction`, `decision_jurisdiction`)
- [x] Scoped evidence notes replace generic "Insufficient Data" badges
- [x] Target jurisdiction wins for commercialization decisions
- [x] Missing origin evidence does not cause commercialization decision to become `INSUFFICIENT_EVIDENCE`
- [x] Evidence types distinguished (patent vs regulatory vs FTO)
- [x] Partial evidence with unresolved conditions returns `CONDITIONAL_YES`
- [x] Genuinely unsupported query returns `INSUFFICIENT_EVIDENCE`
- [x] Decision reason codes added (`decision_reason_codes`)
- [x] FTO can NEVER be confirmed
- [x] India = evaluation-only (isolated from production retrieval)
- [x] Germany = HTTP 400
- [x] Japanese queries work without false insufficiency
- [x] Global queries search US, EP, WO, JP (never IN, never DE)
- [x] All 9 real queries tested and documented
- [x] 10/10 Phase 7 unit tests pass
- [x] 14/14 Phase 7 regression tests pass
- [x] Frontend build passes with zero errors (`npm run build` -> Exit Code 0)
- [x] Backend API operational (`POST /api/decision`)
- [x] Final report updated

**STOP HERE. PHASE 7 IS COMPLETE AND VERIFIED.**

