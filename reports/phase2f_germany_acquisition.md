# Phase 2F — Germany Patent Data Acquisition & Gap Audit Report

**Project**: IP-SAKTI Sahayak / AYURLEX — SIH 26045  
**Jurisdiction**: GERMANY (`DE`)  
**Date**: 2026-09-08  
**Phase**: PHASE 2F — STEP 2 DISCOVERY & ACQUISITION AUDIT  
**Statutory Sufficiency Target**: $\ge 2,000$ verified documents AND $\ge 4,000$ valid chunks

---

## 1. Candidate Source Evaluation for Germany

### 1. DPMAconnectPlus / Deutsches Patent- und Markenamt (DPMA)
- **Source Classification**: TIER 1 (Official Primary National Patent Office)
- **Access Interface**: `https://www.dpma.de/service/datenabgabe/dpmaconnectplus/index.html`
- **Technical Mechanism**: HTTP Basic Authenticated REST interface providing weekly publication packages in WIPO ST.36 / ST.96 XML and PDF.
- **Contractual Barrier**: DPMAconnectPlus is strictly contractual. Access requires completing the *Standardvertrag DPMAconnectPlus*, declaring the intended purpose of use, and mailing **two signed original paper agreements** to `DPMA Referat 2.1.2, 80297 München, Germany`.
- **Financial Barrier**: A mandatory one-time connection fee of **200 EUR** is charged by the German Patent Office.
- **Integrity Rule 17 & 18 Compliance**: No unauthenticated bypass was attempted. The formal paper contract barrier is documented honestly.
- **Status**: **BLOCKED BY CONTRACTUAL & FEE GATE**.

### 2. DPMA DPMAdatenabgabe (Historical Backfiles)
- **Source Classification**: TIER 1 (Official Bulk Dissemination)
- **Content Scope**: Over 2.5 million German patent and utility model publications from 1877 to present in XML/TIFF/PDF.
- **Access Requirement**: Governed by the DPMA standard agreement and recurring media dispatch fees. No open public server download is hosted.
- **Status**: **BLOCKED BY CONTRACTUAL & MEDIA DISPATCH FEES**.

### 3. DEPATISnet Web Search
- **Source Classification**: TIER 1 (Official Document Search Portal)
- **Access Interface**: `https://depatisnet.dpma.de/`
- **Technical Controls**: Interactive browser sessions, cookie validation, and strict request rate limiting. Automated mass scraping violates DPMA Terms of Use and is barred by Rule 17.
- **Status**: **BLOCKED BY TERMS OF SERVICE**.

### 4. European Patent Office Open Patent Services (EPO OPS)
- **Source Classification**: TIER 1 (Official Regional Patent Office API)
- **Technical Discovery**: Official EPO OPS documentation explicitly states that **German national patents (`DE`) are excluded from character-coded full text (claims and descriptions)**. OPS serves bibliographic data for DE, but full-text endpoints do not support German national patents.
- **Status**: **DISQUALIFIED BY TECHNICAL EXCLUSION**.

### 5. Hugging Face European Datasets (`mhurhangee/ep-patent-all-claims`)
- **Source Classification**: TIER 2 (Research Repository)
- **Content**: Millions of European Patent Office granted claims, including claims written in German.
- **Jurisdiction Boundary Check**: Every publication identifier carries the `EP` country code (e.g. `EP-1234567-B1`).
- **Integrity Rule 12 & 13 Compliance**: The mandate strictly enforces: *"German language != Germany jurisdiction. EP publication != Germany jurisdiction. NEVER classify an EP publication as Germany merely because the text is German."* All German-language EP patents remain isolated in the Europe corpus.
- **Status**: **ISOLATED TO EUROPE CORPUS**.

---

## 2. Germany Sufficiency Audit & Gap Analysis

| Parameter | Actual Real-World Metric | Statutory Target | Status |
| :--- | :---: | :---: | :---: |
| **Verified Documents** | **0** | $\ge 2,000$ | **UNMET (Gap: 2,000)** |
| **Valid Production Chunks** | **0** | $\ge 4,000$ | **UNMET (Gap: 4,000)** |
| **Quarantined Placeholders** | 5 | 0 Allowed in Production | **EXCLUDED (Quarantined)** |
| **Docling Processing** | 0% | 100% Required | **PENDING VERIFIED DATA** |
| **Language Preservation** | German (`de`) Primary | 100% Original Preserved | **PASS** |
| **Final Sufficiency Status** | **INSUFFICIENT** | SUFFICIENT | **INSUFFICIENT** |

### Next Legitimate Acquisition Route for Germany:
Execution of the paper *Standardvertrag DPMAconnectPlus* by the university/institution with DPMA Munich to obtain official HTTP Basic API credentials.
