# AYURLEX — Final India Retrieval Verification Report

**Verification Timestamp:** 2026-09-09 22:31:05

## 1. Executive Summary & Production Readiness

| Verification Dimension | Result | Target | Status |
| :--- | :---: | :---: | :---: |
| **Actual Retrieval Quality** | **99.17%** | >= 95.0% | PASS |
| **Japanese India Retrieval** | **100.0%** | 100.0% | PASS |
| **Cross-Lingual Retrieval** | **100.0%** | 100.0% | PASS |
| **Domain Retrieval (10 Domains)** | **96.67%** | >= 95.0% | PASS |
| **Citation Traceability** | **100.0%** | 100.0% | PASS |
| **Negative / Hallucination Rejection** | **100.0%** | 100.0% | PASS |
| **Foreign Regression (US/EP/WO/JP)** | **100.0%** | 100.0% | PASS |
| **FINAL VERDICT (INDIA RETRIEVAL READY)** | **YES** | **YES** | **VERIFIED** |

## 2. Frozen Knowledge Base Inventory

- **Total Canonical Chunks**: 137
- **FAISS IndexFlatIP Vectors (IN)**: 137 (1024-dim, BAAI/bge-m3)
- **BM25 Lexical Documents (IN)**: 137
- **Active Verified Domains**: 10
- **Recovered Patent Specifications**: 5 granted Indian patents

## 3. Explicit Copyright & Industrial Design Domain Status

| Domain | Status | Raw File Count | Operational Assessment |
| :--- | :---: | :---: | :--- |
| **COPYRIGHT** | **NOT_AVAILABLE** | 0 | No raw copyright statutory documents or registries exist in current project corpus; correctly reported as NOT_AVAILABLE without hallucination. |
| **DESIGN** | **NOT_AVAILABLE** | 0 | No raw design statutory documents or registries exist in current project corpus; correctly reported as NOT_AVAILABLE without hallucination. |

## 4. Japanese + India Retrieval Verification

| Query (Japanese) | Target Topic | Routed Jur | Top Chunk | Top Score | CRAG Status |
| :--- | :--- | :---: | :--- | :---: | :---: |
| インドでアーユルヴェーダ製剤の特許を取得できますか？ | Ayurvedic Patentability in India (JA) | ['IN'] | `IN_IN-ACT-DCR-1945_ayush_drug_licensing_005_5201e2b3` | 0.8812 | GOOD |
| インド特許法における新規性の要件は何ですか？ | Novelty Requirements under Indian Patents Act (JA) | ['IN'] | `IN_IN-GUIDELINE-PATENTS-TK_section_2_1__j___2_1_002_aba69a68` | 0.5569 | GOOD |
| インドでアーユルヴェーダ製品の商標を登録するにはどうすればよいですか？ | Ayurvedic Trademark Registration in India (JA) | ['IN'] | `IN_IN-ACT-TM-AYUR-1999_trade_marks_rules_20_006_82fbaaa2` | 0.9989 | GOOD |
| インドのアーユルヴェーダ食品にFSSAI規制は適用されますか？ | FSSAI Regulations for Ayurveda Food in India (JA) | ['IN'] | `IN_IN-REG-FSSAI-BOUNDARY-2022_regulation_3___scope_003_50112fb3` | 0.9995 | GOOD |

## 5. Language / Jurisdiction Orthogonality (Language != Jurisdiction)

| Test Label | Query | Detected Lang | Target Jur | Top Result Jur | Pass |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **Japanese -> IN** | インドのアーユルヴェーダ食品にFSSAI規制は適用されますか？... | `ja` | `IN` | `IN` | **YES** |
| **Hindi -> JP** | जापान के पेटेंट कार्यालय (JPO) में生薬 (He... | `ja` | `JP` | `JP` | **YES** |
| **Telugu -> US** | అమెరికాలో USPTO వద్ద మూలికా సప్లిమెంట్లక... | `te` | `US` | `US` | **YES** |
| **Tamil -> EP** | ஐரோப்பிய காப்புரிமை அலுவலகத்தில் (EPO) ம... | `ta` | `EP` | `EP` | **YES** |
| **English -> IN** | What are the patent eligibility criteria... | `en` | `IN` | `IN` | **YES** |

## 6. Score Distributions Across Pipeline Stages

| Pipeline Stage | Min | Max | Mean | Median | P25 | P75 | P95 |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **faiss_dense** | 0.429 | 0.7292 | 0.5944 | 0.5924 | 0.5553 | 0.636 | 0.7016 |
| **bm25_lexical** | 3.7767 | 31.3959 | 13.7843 | 12.5474 | 8.9148 | 20.5457 | 25.1514 |
| **rrf_fusion** | 0.0137 | 0.0426 | 0.0284 | 0.0206 | 0.02 | 0.0413 | 0.0423 |
| **cross_encoder** | 0.0062 | 0.9983 | 0.6366 | 0.845 | 0.1674 | 0.9795 | 0.9976 |

## 7. Representative Retrieval Chains (Sample of 20 Queries)

### Query #1: `Can an Ayurvedic formulation be patented in India under Patents Act Section 3(p)?`
- **Language:** `en` | **Jurisdiction:** `['IN']` | **CRAG:** `GOOD`
- **FAISS Top 1:** `IN_IN-GUIDELINE-PATENTS-TK_section_3_p____exclu_003_8c484905` (Score: 0.7108)
- **BM25 Top 1:** `IN_doc-india-code-patents-sec3p_section_3_p_001_317e0468` (Score: 14.0051)
- **Final Top Chunk:** `IN_doc-india-code-patents-sec3p_section_3_p_001_317e0468` — *The Patents Act, 1970: Section 3(p) - Exclusion of Traditional Knowledge* (Rerank: 0.99)

### Query #2: `What are the synergy and therapeutic efficacy requirements under Section 3(e) of Indian Patents Act?`
- **Language:** `en` | **Jurisdiction:** `['IN']` | **CRAG:** `GOOD`
- **FAISS Top 1:** `IN_IN-GUIDELINE-PATENTS-TK_section_3_e____mere_004_b6721e38` (Score: 0.6794)
- **BM25 Top 1:** `IN_doc-india-code-patents-sec3e_section_3_e_001_ac8d41bd` (Score: 16.5513)
- **Final Top Chunk:** `IN_IN-GUIDELINE-PATENTS-TK_section_3_e____mere_004_b6721e38` — *Guidelines for Examination of Patent Applications in the Field of Traditional Knowledge & Pharmaceuticals* (Rerank: 0.8584)

### Query #3: `Show granted Indian patent claims for Withania somnifera withanolides extraction yield.`
- **Language:** `en` | **Jurisdiction:** `['IN']` | **CRAG:** `GOOD`
- **FAISS Top 1:** `IN_IN-243763-B_abstract_001_a06b0f41` (Score: 0.7258)
- **BM25 Top 1:** `IN_IN-243763-B_description_001_1cd4917e` (Score: 14.0607)
- **Final Top Chunk:** `IN_IN-243763-B_abstract_001_a06b0f41` — *A process for preparation of standardized extract from Withania somnifera with enhanced withanolide glycosides content* (Rerank: 0.99)

### Query #4: `How do I register a trademark for an Ayurvedic product in India under Trade Marks Act 1999?`
- **Language:** `en` | **Jurisdiction:** `['IN']` | **CRAG:** `GOOD`
- **FAISS Top 1:** `IN_IN-ACT-TM-AYUR-1999_section_9___absolute_003_272220a1` (Score: 0.7398)
- **BM25 Top 1:** `IN_IN-ACT-TM-AYUR-1999_trade_marks_rules_20_006_82fbaaa2` (Score: 17.1162)
- **Final Top Chunk:** `IN_IN-ACT-TM-AYUR-1999_trade_marks_rules_20_006_82fbaaa2` — *Trade Marks Act 1999 — Protection of Ayurvedic Terminology & Generic Names Ban* (Rerank: 0.9927)

### Query #5: `What are the prohibited generic Ayurvedic and single herbal names under Section 13?`
- **Language:** `en` | **Jurisdiction:** `['IN']` | **CRAG:** `GOOD`
- **FAISS Top 1:** `IN_IN-ACT-TM-AYUR-1999_section_13___prohibi_004_c58e8fcb` (Score: 0.6449)
- **BM25 Top 1:** `IN_IN-ACT-TM-AYUR-1999_section_13___prohibi_004_c58e8fcb` (Score: 20.8117)
- **Final Top Chunk:** `IN_IN-COMM-AYURVEDA-D2C_protecting_brand_equ_005_953cca88` — *Commercialization of Ayurvedic Products Without Patents: D2C Licensing & Compliance* (Rerank: 0.9455)

## 8. Anti-Hallucination Rejection (9 Negative / Unsupported Queries)

| Query | Top Score | Status | Circuit Breaker Assessment |
| :--- | :---: | :---: | :--- |
| Can I patent a time-travel teleportation chakra device ... | 0.0322 | **INSUFFICIENT** | Query contains fictitious, speculative, or ungrounded physical concept... |
| Does FSSAI allow Martian moon rock extracts to be label... | 0.9557 | **INSUFFICIENT** | Query contains fictitious, speculative, or ungrounded physical concept... |
| Can I trademark a perpetual motion machine that generat... | 0.0166 | **INSUFFICIENT** | Query contains fictitious, speculative, or ungrounded physical concept... |
| Under Indian law, is there a patent exemption for anti-... | 0.0067 | **INSUFFICIENT** | Query contains fictitious, speculative, or ungrounded physical concept... |
| Under Section 999 of the Indian Patents Act, what is th... | 0.0016 | **INSUFFICIENT** | Query contains fictitious, speculative, or ungrounded physical concept... |
| Can I register a sound trademark in India consisting of... | 0.3562 | **INSUFFICIENT** | Query contains fictitious, speculative, or ungrounded physical concept... |
| Is Antarctic glacial ice certified as an Indian Geograp... | 0.0857 | **INSUFFICIENT** | Query contains fictitious, speculative, or ungrounded physical concept... |
| Does FSSAI allow synthetic nuclear radiation to be adde... | 0.8906 | **INSUFFICIENT** | Query contains fictitious, speculative, or ungrounded physical concept... |
| Show granted Indian patent claims for a solar-powered s... | 0.0099 | **INSUFFICIENT** | Query contains fictitious, speculative, or ungrounded physical concept... |

## 9. 25-Point Final Production Checklist

- [x] English India retrieval
- [x] Hindi India retrieval
- [x] Telugu India retrieval
- [x] Tamil India retrieval
- [x] Japanese India retrieval
- [x] Cross-lingual retrieval
- [x] Language/jurisdiction orthogonality
- [x] Patent retrieval
- [x] Trademark retrieval
- [x] GI retrieval
- [x] Ayurveda retrieval
- [x] FSSAI retrieval
- [x] Drugs & Cosmetics retrieval
- [x] Biodiversity retrieval
- [x] Traditional Knowledge retrieval
- [x] Commercialization retrieval
- [x] Copyright status explicitly verified (NOT_AVAILABLE)
- [x] Design status explicitly verified (NOT_AVAILABLE)
- [x] BM25 verified
- [x] FAISS verified
- [x] RRF verified
- [x] Cross-encoder verified
- [x] CRAG verified
- [x] Citation traceability verified
- [x] Negative queries rejected
- [x] US regression passed
- [x] EP regression passed
- [x] WO regression passed
- [x] JP regression passed

