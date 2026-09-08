# Phase 2F — WIPO / PCT Patent Data Acquisition & Gap Audit Report

**Project**: IP-SAKTI Sahayak / AYURLEX — SIH 26045  
**Jurisdiction**: WIPO / PCT (`WO`)  
**Date**: 2026-09-08  
**Phase**: PHASE 2F — STEP 3 DISCOVERY & ACQUISITION AUDIT  
**Statutory Sufficiency Target**: $\ge 2,000$ verified documents AND $\ge 4,000$ valid chunks

---

## 1. Candidate Source Evaluation for WIPO / PCT

### 1. WIPO PATENTSCOPE Web Portal
- **Source Classification**: TIER 1 (Official Primary International Bureau)
- **Access Interface**: `https://patentscope.wipo.int/`
- **Technical Mechanism**: Browser search interface with export capped at 10,000 bibliographic records.
- **Terms of Use Restrictions**: WIPO explicitly prohibits automated querying, bulk copying, and robot scraping. The fair use filter enforces an automated IP ban for $> 10$ search actions per minute.
- **Authoritative Provenance Requirement**: WIPO explicitly disclaims its OCR XML/HTML output as non-authoritative; legal provenance requires preserving the original scanned Gazette publication PDF.
- **Integrity Rule 17 Compliance**: Scraping against Terms of Use or bypassing IP rate-limits is strictly barred.
- **Status**: **BLOCKED BY TERMS OF SERVICE & RATE LIMITS**.

### 2. WIPO PCT Webservice & PCT Data Products
- **Source Classification**: TIER 1 (Official Commercial Data Dissemination)
- **Access Interface**: `https://www.wipo.int/patentscope/en/data/`
- **Technical Mechanism**: Programmatic SOAP XML Web Service for batch specification retrieval.
- **Financial Barrier**: WIPO charges an annual commercial subscription fee of **2,000 Swiss Francs (CHF) / year**. PCT Backfiles on external hard drives require purchasing physical media licenses.
- **Status**: **BLOCKED BY COMMERCIAL SUBSCRIPTION FEE**.

### 3. European Patent Office Open Patent Services (EPO OPS) for WO
- **Source Classification**: TIER 1 (Official Regional Exchange)
- **Access Interface**: `https://developers.epo.org/`
- **Technical Mechanism**: RESTful OAuth2 API with a 4 GB/week fair use quota. Character-coded full text (claims and descriptions) is supported for `WO` publications.
- **Authentication Barrier**: Programmatic queries require an active OAuth2 `Consumer Key` and `Consumer Secret` registered with the EPO. Unauthenticated requests return 401 Unauthorized.
- **Status**: **REQUIRES OAUTH2 CREDENTIALS**.

### 4. Secondary Repositories (DAPFAM & NekoNeko512)
- **DAPFAM (`datalyes/DAPFAM_patent`)**: Aggregates multi-country patent families using 15-character Lens family hashes rather than statutory publication numbers. All text is synthesized into English. Disqualified under Rule 8 ("NEVER treat a patent family as a national publication").
- **wipo-semiconductors (`NekoNeko512`)**: Contains raw text blobs without publication numbers, filing dates, or country codes. Disqualified under Rule 1.

---

## 2. WIPO / PCT Sufficiency Audit & Gap Analysis

| Parameter | Actual Real-World Metric | Statutory Target | Status |
| :--- | :---: | :---: | :---: |
| **Verified Documents** | **0** | $\ge 2,000$ | **UNMET (Gap: 2,000)** |
| **Valid Production Chunks** | **0** | $\ge 4,000$ | **UNMET (Gap: 4,000)** |
| **Quarantined Placeholders** | 5 | 0 Allowed in Production | **EXCLUDED (Quarantined)** |
| **Docling Processing** | 0% | 100% Required | **PENDING VERIFIED DATA** |
| **Language Preservation** | Multilingual | 100% Original Preserved | **PASS** |
| **Final Sufficiency Status** | **INSUFFICIENT** | SUFFICIENT | **INSUFFICIENT** |

### Next Legitimate Acquisition Route for WIPO / PCT:
Free developer registration at `developers.epo.org` to obtain an OAuth2 API key for querying character-coded `WO` publications within the 4 GB/week fair use limit, or subscribing to the WIPO PCT Webservice.
