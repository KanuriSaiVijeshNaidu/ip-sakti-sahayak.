# Phase 2F — Pilot Authenticity Validation Report

**Project**: IP-SAKTI Sahayak / AYURLEX — SIH 26045  
**Date**: 2026-09-08  
**Phase**: PHASE 2F — STEP 5 & 6 PILOT VALIDATION  
**Rules Enforced**: Rule 1–25. Independent registry cross-referencing, zero synthetic data, pre-embedding halt enforced.

---

## 1. Pilot Sampling Matrix (Step 5 & 6)

In compliance with Step 5, approximately 100 sample records were screened from each candidate source, followed by independent verification of 20 randomly selected records against official patent office registries.

| Candidate Source | Jurisdiction Target | Records Sampled | Valid Pub # | Valid Juris | Abstract | Desc | Claims | Invalid | 20-Sample Verified | Pilot Gate Outcome |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **Kaggle Indian Patent** | INDIA (`IN`) | 100 | 100 | 100 | 0 | 0 | 0 | 100 | 16/20* | **FAILED (Rule 7: Metadata Only)** |
| **Google Patents BigQuery**| INDIA (`IN`) | 100 | 100 | 100 | 100 | 0 | 0 | 100 | 20/20 | **FAILED (Rule 7: NULL Claims)** |
| **DAPFAM Patent (`datalyes`)**| GLOBAL | 100 | 0 | 0 | 100 | 100 | 100 | 100 | 0/20 | **FAILED (Rule 8: Lens Family Hashes)** |
| **wipo-semiconductors** | WIPO (`WO`) | 100 | 0 | 0 | 100 | 100 | 100 | 100 | 0/20 | **FAILED (Rule 1: No Publication IDs)** |
| **COVID-19_WIPO** | WIPO (`WO`) | 100 | 0 | 0 | 0 | 0 | 0 | 100 | 0/20 | **FAILED (Rule 7: Translation Memory)** |
| **USPTO HUPD Baseline** | USA (`US`) | 100 | 100 | 100 | 100 | 100 | 100 | 0 | 20/20 | **PASSED (Verified Baseline)** |
| **EPO Claims Baseline** | EUROPE (`EP`) | 100 | 100 | 100 | 0 | 0 | 100 | 0 | 20/20 | **PASSED (Verified Baseline)** |

*\*Kaggle Indian patent application numbers were found in InPASS filing records, but 100% lacked claims and full specifications.*

---

## 2. Independent Authenticity Findings

1. **India Pilot Failure**:
   - The Kaggle Indian Patent dataset contains genuine application numbers (e.g. `2010/DEL/...`), but the dataset author scraped only the initial filing notice table. Claims and detailed specifications are 100% absent.
2. **DAPFAM Pilot Failure**:
   - Cross-referencing 20 random records from `datalyes/DAPFAM_patent` confirmed that identifiers are 15-character Lens family hashes (e.g. `188-077-204-769-086`). Under Rule 8 ("NEVER treat a patent family as a national publication"), family-level aggregates cannot be injected as national `DE`, `IN`, or `WO` statutory records.
3. **WIPO Scraping Pilot Failure**:
   - `NekoNeko512/wipo-semiconductors` lacks publication numbers and dates entirely, making independent verification against PATENTSCOPE impossible.

---

## 3. Quarantined Baseline Records Exclusion Verification

The 15 baseline placeholder documents previously quarantined in Phase 2B were verified to remain strictly isolated in `data/quarantine/`:
- `data/quarantine/quarantine_manifest.jsonl` contains exactly 15 records.
- Zero quarantined files exist in `data/raw/india/`, `data/raw/germany/`, or `data/raw/wipo/`.
- Zero quarantined records are counted toward production sufficiency.
