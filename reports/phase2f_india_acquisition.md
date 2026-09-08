# Phase 2F — India Patent Data Acquisition & Gap Audit Report

**Project**: IP-SAKTI Sahayak / AYURLEX — SIH 26045  
**Jurisdiction**: INDIA (`IN`)  
**Date**: 2026-09-08  
**Phase**: PHASE 2F — STEP 1 DISCOVERY & ACQUISITION AUDIT  
**Statutory Sufficiency Target**: $\ge 2,000$ verified documents AND $\ge 4,000$ valid chunks

---

## 1. Candidate Source Evaluation for India

### 1. InPASS / Controller General of Patents, Designs and Trade Marks (CGPDTM)
- **Source Classification**: TIER 1 (Official Primary Registry)
- **Access Interface**: `https://ipindiaservices.gov.in/publicsearch/`
- **Technical Controls Encountered**: Dynamic session tokens (`__VIEWSTATE`, ASP.NET session cookies), client-side JavaScript execution, interactive CAPTCHAs, and IP rate throttles.
- **Bulk Download Status**: NO public bulk REST API, open FTP directory, or S3 bucket is hosted by the CGPDTM.
- **Legal Barrier**: CGPDTM Terms of Service explicitly prohibit automated data harvesting, web scraping, and bot indexing.
- **Integrity Rule 17 Compliance**: In strict adherence to Rule 17, no CAPTCHAs were bypassed, no scraping scripts were run against government servers, and no unofficial access methods were attempted.
- **Status**: **BLOCKED BY ACCESS CONTROLS**.

### 2. The Patent Office Journal (`search.ipindia.gov.in`)
- **Source Classification**: TIER 1 (Official Government Gazette)
- **Access Interface**: `https://search.ipindia.gov.in/IPOJournal/Journal/Patent`
- **Download Feasibility**: Weekly PDF issues published every Friday are freely downloadable.
- **Content Inspection**: Comprehensive review of weekly gazettes confirmed that the journal acts as an announcement gazette containing Section 11A publication notifications, applicant names, filing dates, and early bibliographic abstracts. It does **NOT publish the complete specification body or claims**.
- **Integrity Rule 7 Compliance**: Under Rule 7 ("NEVER treat metadata as full text"), the Patent Office Journal cannot serve as a full-text RAG corpus for Ayurvedic claim drafting or novelty assessment.
- **Status**: **DISQUALIFIED UNDER RULE 7**.

### 3. CSIR-TKDL Database
- **Source Classification**: TIER 1 (Official Inter-Governmental Traditional Knowledge Archive)
- **Access Interface**: Restricted portal under bilateral non-disclosure agreements with global patent offices.
- **Legal Barrier**: Access is strictly limited to patent examiners under international treaties to prevent biopiracy; public commercial or open research dissemination is barred by law.
- **Status**: **RESTRICTED BY TREATY**.

### 4. Secondary Mirrors & Aggregators (Kaggle & BigQuery)
- **Kaggle (`arshpreetsingh/indian-patent-dataset`)**: Contains 54,231 filing records with application numbers, titles, and dates, but 0 claims and 0 descriptions. Disqualified under Rule 7.
- **Google Patents BigQuery (`patents-public-data`)**: `claims` and `description` columns return `NULL` for country code `IN`. Disqualified under Rule 7.

---

## 2. India Sufficiency Audit & Gap Analysis

| Parameter | Actual Real-World Metric | Statutory Target | Status |
| :--- | :---: | :---: | :---: |
| **Verified Documents** | **0** | $\ge 2,000$ | **UNMET (Gap: 2,000)** |
| **Valid Production Chunks** | **0** | $\ge 4,000$ | **UNMET (Gap: 4,000)** |
| **Quarantined Placeholders** | 5 | 0 Allowed in Production | **EXCLUDED (Quarantined)** |
| **Docling Processing** | 0% | 100% Required | **PENDING VERIFIED DATA** |
| **Provenance Coverage** | 100% (Quarantine Ledger) | 100% Required | **PASS** |
| **Final Sufficiency Status** | **INSUFFICIENT** | SUFFICIENT | **INSUFFICIENT** |

### Next Legitimate Acquisition Route for India:
Formal institutional application to the Office of the Controller General of Patents (CGPDTM / DPIIT) for academic research bulk data access, or academic clearance via Lens.org API token provisioning.
