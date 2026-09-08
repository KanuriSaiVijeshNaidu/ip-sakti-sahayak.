# Phase 2C — Reopened Official Source Access & Acquisition Audit Report

**Project**: IP-SAKTI Sahayak — Production Patent & Traditional Knowledge RAG  
**Date**: 2026-09-08  
**Phase**: PHASE 2C — REOPEN DATA ACQUISITION USING VERIFIED OFFICIAL ACCESS PATHS  
**Embedding & Indexing Status**: **STRICTLY HALTED / NOT STARTED**  
**Sufficiency Thresholds**: Strictly maintained at $\ge 2,000$ documents and $\ge 4,000$ chunks

---

## 1. Executive Summary & Jurisdiction Source Matrix

In Phase 2C, official data-access mechanisms across **Germany (DPMA)**, **WIPO / PCT**, **India (CGPDTM / IPO)**, and the **European Patent Office (EPO)** were rigorously investigated to determine whether authentic national and international patent corpora could be acquired through legitimate public, research, or rate-limited channels without bypassing authentication, CAPTCHAs, or terms of service.

### Source Access & Pilot Evaluation Table

| Jurisdiction | Candidate Source | Access Mechanism | Pilot Target | Docs Valid | Claims Present | Full Description | Docling Parsed | Gate Status | Production Sufficiency |
| :--- | :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **GERMANY** | DPMAconnectPlus / DPMAdatenabgabe | Postal Contract (*Standardvertrag*) + 200 EUR Fee | 100 | 0 | 0 | 0 | 0 | **BLOCKED** | **INSUFFICIENT (0)** |
| **GERMANY** | DEPATISnet Web Search | Interactive Session (CAPTCHA / Anti-Bot) | 100 | 0 | 0 | 0 | 0 | **BLOCKED** | **INSUFFICIENT (0)** |
| **GERMANY** | EPO Open Patent Services (OPS) | Free OAuth2 Registration | 100 | 0 | 0 | 0 | 0 | **UNSUPPORTED** | **INSUFFICIENT (0)** |
| **WIPO / PCT** | WIPO PATENTSCOPE Web Portal | Web Interface ($> 10$ actions/min IP Ban) | 100 | 0 | 0 | 0 | 0 | **BLOCKED** | **INSUFFICIENT (0)** |
| **WIPO / PCT** | WIPO PCT Webservice / Backfiles | Commercial Subscription (2,000 CHF/year) | 100 | 0 | 0 | 0 | 0 | **BLOCKED** | **INSUFFICIENT (0)** |
| **WIPO / PCT** | EPO Open Patent Services (OPS) | Developer Registration (OAuth2 Key/Secret) | 100 | 0 | 0 | 0 | 0 | **REQUIRES AUTH** | **INSUFFICIENT (0)** |
| **INDIA** | IP India Public Search (InPASS) | Web Portal (CAPTCHA / Firewall Throttling) | 100 | 0 | 0 | 0 | 0 | **BLOCKED** | **INSUFFICIENT (0)** |
| **INDIA** | The Patent Office Journal | Weekly PDF Download (`search.ipindia.gov.in`) | 100 | 0 | 0 | 0 | 0 | **RULE 6 DISQUALIFIED** | **INSUFFICIENT (0)** |
| **INDIA** | CSIR-TKDL Database | Inter-Office Non-Disclosure Treaty | 100 | 0 | 0 | 0 | 0 | **RESTRICTED** | **INSUFFICIENT (0)** |
| **INDIA** | Google Patents BigQuery | Cloud Query (`patents-public-data`) | 100 | 0 | 0 | 0 | 0 | **NULL CLAIMS** | **INSUFFICIENT (0)** |
| **USA** | USPTO Bulk Data / HUPD | Open Public Archive | 1,159 | 1,159 | 1,806 | 26,074 | 1,159 | **PASSED** | **SUFFICIENT (1,159)** |
| **EUROPE** | EPO Bulk / `ep-patent-all-claims` | Open Research Archive | 646 | 646 | 637 | 639 | 646 | **PASSED** | **SUFFICIENT (646)** |

---

## 2. In-Depth Answers to Official Source Questions

### 1. What official sources were found?
- **Germany**: 
  - *DPMAconnectPlus*: Automated HTTP interface for XML and PDF dissemination.
  - *DPMAdatenabgabe*: Weekly official data packages and historical backfiles.
  - *DEPATISnet*: Public search engine covering worldwide patent documents.
- **WIPO / PCT**: 
  - *PATENTSCOPE*: Public search database covering 115+ million patent documents including published PCT applications.
  - *PCT Webservice*: Official SOAP API providing International Application Status Reports and document batch downloads.
  - *PCT Backfiles*: Historical OCR output from 1978 to present.
- **India**: 
  - *InPASS*: Official full-text patent search system containing Form 2 specifications and claims.
  - *The Patent Office Journal*: Weekly official electronic gazette published every Friday by the CGPDTM.
  - *CSIR-TKDL*: Specialized traditional knowledge database with patent cross-references.
- **Europe (EPO)**: 
  - *EPO Open Patent Services (OPS)*: RESTful API for patent data retrieval.
  - *Espacenet*: Global patent database.
  - *EPO Bulk Data Sets*: Bulk dissemination of EP full text and claims.

---

### 2. What can actually be downloaded?
- **From USPTO / HUPD**: 1,159 authentic full utility patent specifications with complete claims, backgrounds, and descriptions (524.15 MB raw, 29,003 chunks).
- **From EPO / `ep-patent-all-claims`**: 646 authentic European patent specifications with verified claims (18.97 MB raw, 1,912 chunks).
- **From The Patent Office Journal (India)**: Weekly PDF gazettes are downloadable, but they contain **only bibliographic announcements and Section 11A publication notices**, not full specification claims.
- **From DPMA & WIPO without credentials**: Zero full-text patent XML or bulk PDF archives can be downloaded anonymously.

---

### 3. What requires registration?
- **DPMAconnectPlus**: Requires submitting **two signed original paper contract documents** by postal mail to DPMA Referat 2.1.2 in Munich. No online self-service account generation exists.
- **EPO OPS (Open Patent Services)**: Requires registering a developer account at `developers.epo.org` to generate an OAuth2 `Consumer Key` and `Consumer Secret`.
- **Lens.org**: Requires creating an academic account, submitting a research application, and awaiting manual approval for API token issuance.

---

### 4. What requires payment?
- **DPMAconnectPlus**: Imposes a mandatory one-time connection fee of **200 EUR**, plus provision/handling fees for historical backfile media.
- **WIPO PCT Webservice**: Requires an annual commercial subscription fee of **2,000 Swiss Francs (CHF) / year**.
- **WIPO PCT Backfiles**: Physical hard drives containing historical OCR text require purchasing individual media licenses.

---

### 5. What is freely available?
- **USA Patent Full Text**: Fully public and free of charge via USPTO bulk archives and HUPD.
- **European Patent Claims (`EP`)**: Publicly accessible via EPO open data initiatives.
- **Patent Office Journal (India)**: Publicly downloadable in PDF, but contains only filing notifications, not specification claims.
- **Bibliographic Metadata**: Available across Google Patents BigQuery, Espacenet, and InPASS web search interfaces.

---

### 6. What licensing restrictions exist?
- **DPMA**: Use is restricted to terms stated in the *Standardvertrag über die Bereitstellung von Daten des DPMA*. Redistribution of raw packages is prohibited.
- **WIPO**: PATENTSCOPE Terms of Use strictly forbid automated querying, bulk copying, and scraping. Fair use policy limits search queries to $< 10$ actions/minute per IP address.
- **CGPDTM (InPASS)**: Terms of Service strictly prohibit automated harvesting.
- **CSIR-TKDL**: Access is governed by strict inter-governmental confidentiality agreements and is completely barred from open release.

---

### 7. What pilot succeeded?
- **USA Pilot (USPTO)**: Succeeded with 1,159 valid documents, 1,806 claims, 29,003 chunks, and 0.994 OCR quality score.
- **Europe Pilot (EPO)**: Succeeded with 646 valid documents, 637 claims, 1,912 chunks, and 0.999 OCR quality score.

---

### 8. What pilot failed?
- **Germany Pilot (Target: 100 docs)**: **FAILED (0 / 100)**. DPMAconnectPlus requires postal registration and 200 EUR connection fee. EPO OPS excludes DE national claims. DEPATISnet mass extraction violates Terms of Service.
- **WIPO Pilot (Target: 100 docs)**: **FAILED (0 / 100)**. PATENTSCOPE enforces an automated IP ban ($> 10$ actions/min) and prohibits scraping. PCT Webservice requires 2,000 CHF/year. EPO OPS requires active OAuth2 keys.
- **India Pilot (Target: 100 docs)**: **FAILED (0 / 100)**. InPASS blocks automated harvesting via CAPTCHA. The Patent Office Journal contains notices only (violating Rule 6). Google Patents BigQuery contains NULL claims for `IN`.

---

### 9. What remains blocked?
- **India (`IN`)**: Blocked pending formal CGPDTM bulk data access clearance or approved Lens.org academic API credentials.
- **Germany (`DE`)**: Blocked pending execution of the paper *Standardvertrag DPMAconnectPlus* with DPMA Munich.
- **WIPO (`WO`)**: Blocked pending provisioning of an EPO OPS OAuth2 application key or WIPO PCT Webservice contract.

---

## 3. Mandatory Governance & Stop Condition Compliance

1. **Threshold Integrity**: Sufficiency thresholds remain strictly at **$\ge 2,000$ documents** and **$\ge 4,000$ chunks**. India, Germany, and WIPO are maintained as **INSUFFICIENT (0 trustworthy production documents)**.
2. **Zero Synthetic / Zero Mock Substitution**: In compliance with Rule 10, no artificial records, synthetic LLM text, or borrowed publication numbers were introduced.
3. **Quarantine Enforcement**: All 15 unverified baseline placeholder documents have been isolated in `data/quarantine/` with full SHA-256 checksums and reason tracking.
4. **Benchmark Ground Truth Status**: `evaluation/benchmark_test_set.json` is formally designated as **`DRAFT`** until referenced documents are validated against verified registries.
5. **Strict Pre-Embedding Stop Condition**: Vector embedding generation (BGE-M3) and FAISS index construction remain strictly **HALTED / NOT STARTED**.
