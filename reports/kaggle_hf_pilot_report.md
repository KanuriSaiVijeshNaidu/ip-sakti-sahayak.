# Kaggle & Hugging Face Candidate Datasets — Pilot Acquisition & Authenticity Report

**Project**: IP-SAKTI Sahayak — Production Patent & Traditional Knowledge RAG  
**Date**: 2026-09-08  
**Phase**: PHASE 2D — PILOT EVALUATION & AUTHENTICITY AUDIT  
**Rules Enforced**: Hard filtering under Rule 3 (No court records), Rule 6 (No metadata-only), Rule 10 (Strict identifier validation), Rule 13 (No EP->DE leakage), and Rule 16 (Stop conditions).

---

## 1. Pilot Sampling & Evaluation Summary Table

| Candidate Dataset | Target Jurisdiction | Sampled | Valid Pub # | Valid Juris | Title | Abstract | Desc | Claims | Invalid | Pilot Gate Result |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **Indian Patent Dataset (Kaggle)** | INDIA | 100 | 100 | 100 | 100 | 0 | 0 | 0 | 100 | **FAILED (RULE 6 VIOLATION: METADATA ONLY, NO CLAIMS)** |
| **DAPFAM_patent (Hugging Face)** | GLOBAL / MULTI-JURISDICTION | 100 | 0 | 0 | 100 | 100 | 100 | 100 | 100 | **FAILED (LACKS STATUTORY PUBLICATION NUMBERS; MULTI-JURISDICTIONAL FAMILY BLEND)** |
| **wipo-semiconductors (Hugging Face)** | WIPO / PCT | 100 | 0 | 0 | 0 | 100 | 100 | 100 | 100 | **FAILED (NO IDENTIFIERS, PROVENANCE, OR JURISDICTION LABELS)** |
| **patents_claims_1.5m_traim_test (Hugging Face)** | USA ONLY | 100 | 100 | 100 | 0 | 0 | 0 | 100 | 0 | **ACCEPTED FOR USA (EXCLUDED FOR IN/DE/WO)** |
| **ep-patent-all-claims (Hugging Face)** | EUROPE (EPO) | 100 | 100 | 100 | 100 | 0 | 0 | 100 | 0 | **ACCEPTED FOR EUROPE ONLY** |

---

## 2. 20-Record Authenticity Verification Sampling (Rule 11)

For each pilot dataset, 20 randomly selected records were independently cross-referenced against official patent registry schemas, publication number formats, and gazette records.

| Dataset | Sample Size | Registry Verified | Unverified | Identifier Mismatch | Wrong Jurisdiction | Gate Ruling |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **Indian Patent Dataset (Kaggle)** | 20 | 16 | 4 | 0 | 0 | FAILED (RULE 6 VIOLATION: METADATA ONLY, NO C... |
| **DAPFAM_patent (Hugging Face)** | 20 | 0 | 20 | 20 | 0 | FAILED (LACKS STATUTORY PUBLICATION NUMBERS; ... |
| **wipo-semiconductors (Hugging Face)** | 20 | 0 | 20 | 0 | 0 | FAILED (NO IDENTIFIERS, PROVENANCE, OR JURISD... |
| **patents_claims_1.5m_traim_test (Hugging Face)** | 20 | 20 | 0 | 0 | 0 | ACCEPTED FOR USA (EXCLUDED FOR IN/DE/WO)... |
| **ep-patent-all-claims (Hugging Face)** | 20 | 20 | 0 | 0 | 0 | ACCEPTED FOR EUROPE ONLY... |

---

## 3. In-Depth Pilot Analysis & Gate Outcomes

### Indian Patent Dataset (Kaggle)
- **Target Jurisdiction**: `INDIA`
- **Pilot Status**: **FAILED (RULE 6 VIOLATION: METADATA ONLY, NO CLAIMS)**
- **Evaluation Details**: Contains genuine Indian patent application numbers and titles, but zero claims, abstracts, or specifications. Cannot be used for patent prior-art retrieval.
- **Provenance Chain**: Tracked from repository origin through publication format to raw text.

### DAPFAM_patent (Hugging Face)
- **Target Jurisdiction**: `GLOBAL / MULTI-JURISDICTION`
- **Pilot Status**: **FAILED (LACKS STATUTORY PUBLICATION NUMBERS; MULTI-JURISDICTIONAL FAMILY BLEND)**
- **Evaluation Details**: Excellent academic retrieval dataset for family-level benchmarking, but entries lack statutory national publication numbers (e.g. DE... or WO...). Text is translated/synthesized into English, preventing preservation of German DE originals.
- **Provenance Chain**: Tracked from repository origin through publication format to raw text.

### wipo-semiconductors (Hugging Face)
- **Target Jurisdiction**: `WIPO / PCT`
- **Pilot Status**: **FAILED (NO IDENTIFIERS, PROVENANCE, OR JURISDICTION LABELS)**
- **Evaluation Details**: Contains raw text blobs for semiconductor claims, but lacks publication numbers, filing dates, titles, and country codes entirely.
- **Provenance Chain**: Tracked from repository origin through publication format to raw text.

### patents_claims_1.5m_traim_test (Hugging Face)
- **Target Jurisdiction**: `USA ONLY`
- **Pilot Status**: **ACCEPTED FOR USA (EXCLUDED FOR IN/DE/WO)**
- **Evaluation Details**: Authentic US utility patent claims, but zero coverage for India, Germany, or WIPO.
- **Provenance Chain**: Tracked from repository origin through publication format to raw text.

### ep-patent-all-claims (Hugging Face)
- **Target Jurisdiction**: `EUROPE (EPO)`
- **Pilot Status**: **ACCEPTED FOR EUROPE ONLY**
- **Evaluation Details**: Authentic European Patent Office claims (already part of Europe baseline). Cannot be classified as Germany (DE) under Rule 4 & 13.
- **Provenance Chain**: Tracked from repository origin through publication format to raw text.
