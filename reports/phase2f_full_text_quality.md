# Phase 2F — Full-Text Quality Filter Report

**Project**: IP-SAKTI Sahayak / AYURLEX — SIH 26045  
**Date**: 2026-09-08  
**Phase**: PHASE 2F — STEP 7 FULL-TEXT QUALITY FILTER  
**Quality Rule Enforced**: Step 7 mandatory 6-field statutory gate (`publication_number`, `title`, `claims`, `description`, `jurisdiction`, `provenance`).

---

## 1. Quality Filter Criteria & Gate Matrix

Every candidate patent record must pass all 6 statutory fields to enter production:

| Field | Statutory Requirement | Rejection Condition |
| :--- | :--- | :--- |
| **1. `publication_number`** | Verifiable official publication identifier (`IN...`, `DE...`, `WO...`, `US...`, `EP...`) | Reject if missing, synthetic, or family hash |
| **2. `title`** | Complete descriptive invention title | Reject if empty or truncated to generic codes |
| **3. `claims`** | Numbered statutory claims defining legal boundary of protection | Reject if empty, metadata-only, or missing |
| **4. `description`** | Detailed technical specification, background art, and embodiments | Reject if empty or abstract-only |
| **5. `jurisdiction`** | Verified ISO country code matching the issuing authority | Reject if ambiguous, multi-national blend, or applicant-inferred |
| **6. `provenance`** | Documented source URL, license, retrieval timestamp, and SHA-256 hash | Reject if unverified scraping without origin |

---

## 2. Gate Audit Results by Jurisdiction

### USA (`US`) — PASSED
- `publication_number`: 100% verified USPTO utility patent numbers.
- `title`: 100% present.
- `claims`: 1,806 preserved claim blocks.
- `description`: 26,074 preserved technical description sections.
- `jurisdiction`: 100% US national jurisdiction.
- `provenance`: Traceable to Harvard HUPD and USPTO bulk archives.
- **Result**: **1,159 Documents Accepted (Verified Baseline)**.

### EUROPE (`EP`) — PASSED
- `publication_number`: 100% verified EPO publication numbers (`EP ...`).
- `title`: 100% present.
- `claims`: 637 preserved European claim sets.
- `description`: 639 preserved technical description sections.
- `jurisdiction`: 100% European Patent Office (`EP`) jurisdiction.
- `provenance`: Traceable to EPO bulk dissemination and `mhurhangee/ep-patent-all-claims`.
- **Result**: **646 Documents Accepted (Verified Baseline)**.

### INDIA (`IN`) — GATE FAILED
- **Candidate Data Evaluated**: Kaggle Indian Patent dataset, Google Patents BigQuery (`IN`), Patent Office Journal.
- **Failures**: Claims and descriptions are 100% absent across all accessible public open datasets.
- **Result**: **0 Documents Accepted (INSUFFICIENT)**.

### GERMANY (`DE`) — GATE FAILED
- **Candidate Data Evaluated**: DPMAconnectPlus (contract-gated), DEPATISnet (anti-bot), EPO OPS (DE excluded), `ep-patent-all-claims` (EP country code).
- **Failures**: Legitimate bulk full text is locked behind DPMA postal contracts; EP German-language patents carry `EP` jurisdiction and cannot be classified as `DE`.
- **Result**: **0 Documents Accepted (INSUFFICIENT)**.

### WIPO / PCT (`WO`) — GATE FAILED
- **Candidate Data Evaluated**: PATENTSCOPE (anti-scraping ban), PCT Webservice (2,000 CHF/yr fee), DAPFAM (family hashes), NekoNeko512 (missing IDs).
- **Failures**: No legitimate open dataset provides verified `WO` publication numbers with full claims without subscription fees or terms-of-service violations.
- **Result**: **0 Documents Accepted (INSUFFICIENT)**.
