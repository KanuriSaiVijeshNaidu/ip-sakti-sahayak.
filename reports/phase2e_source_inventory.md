# Phase 2E — Authoritative Patent Source Inventory & Access Audit

**Project**: IP-SAKTI Sahayak — Production Patent & Traditional Knowledge RAG  
**Date**: 2026-09-08  
**Phase**: PHASE 2E — AUTHORITATIVE PATENT DATA ACQUISITION & VALIDATION  
**Policy Enforced**: Strict verification under Rule 1–20. Zero synthetic data, zero threshold dilution, pre-embedding stop condition enforced.

---

## 1. Master Source Inventory Table

The following matrix records the rigorous evaluation of all primary official registries, secondary databases, and research repositories investigated for India, Germany, and WIPO/PCT.

| Source Name | Category | Official / Secondary | URL | Access Method | Format | Claims | Desc | Pub ID | Lang | Bulk DL | License / Terms | Audit Finding |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: | :---: | :---: | :--- | :---: | :--- | :--- |
| **InPASS / CGPDTM** | Primary (IN) | Official | `https://ipindiaservices.gov.in/publicsearch/` | Web Search (Session / CAPTCHA) | HTML / PDF | YES | YES | YES | en / hi | NO | Govt of India Statutory | **BLOCKED**: Anti-bot firewall; no public bulk REST API |
| **The Patent Office Journal** | Primary (IN) | Official | `https://search.ipindia.gov.in/IPOJournal/Journal/Patent` | Weekly PDF Gazette | PDF | NO | NO | YES | en / hi | YES | Govt of India Public Gazette | **DISQUALIFIED (Rule 6)**: Gazette contains S.11A notices only, not claims |
| **CSIR-TKDL** | Primary (IN) | Official / Inter-Gov | Confidential Non-Public | Inter-Office Treaty Access | Structured XML | YES | YES | YES | sa / en | NO | Highly Confidential NDA | **RESTRICTED**: Legally barred from open public dissemination |
| **Kaggle Indian Patent Dataset** | Secondary (IN) | Secondary / Mirror | `https://kaggle.com/datasets/arshpreetsingh/indian-patent-dataset` | Direct CSV Download | CSV | NO | NO | YES | en | YES | CC0: Public Domain | **DISQUALIFIED (Rule 6)**: Bibliographic metadata only; zero claims/desc |
| **DPMAconnectPlus** | Primary (DE) | Official | `https://dpma.de/service/datenabgabe/dpmaconnectplus/` | HTTP Basic Auth REST | XML / PDF | YES | YES | YES | de | YES | Contractual (*Standardvertrag*) | **BLOCKED**: Requires 2 signed paper contracts by mail + 200 EUR fee |
| **DPMA DPMAdatenabgabe** | Primary (DE) | Official | `https://dpma.de/service/datenabgabe/index.html` | Weekly Dispatch / Media | XML (ST.36/96) | YES | YES | YES | de | YES | Standard Contract + Handling Fee | **BLOCKED**: Contractual backfile shipment; no open public link |
| **DEPATISnet** | Primary (DE) | Official | `https://depatisnet.dpma.de/` | Web Search (Interactive) | PDF / TIFF | YES | YES | YES | de | NO | DPMA Terms of Use | **BLOCKED**: Interactive sessions only; scraping barred by Rule 16 |
| **EPO Open Patent Services (OPS)** | Primary (DE/WO) | Official / Regional | `https://developers.epo.org/` | RESTful OAuth2 API | XML (ST.36) | PARTIAL | PARTIAL | YES | en/de/fr | YES (4GB/wk) | Free Developer License | **DISQUALIFIED FOR DE**: EPO explicitly excludes DE from character full-text |
| **WIPO PATENTSCOPE Web** | Primary (WO) | Official | `https://patentscope.wipo.int/` | Web Interface | XML / PDF | YES | YES | YES | Multi | NO | WIPO Terms of Use | **BLOCKED**: Scraping forbidden; >10 actions/min triggers IP ban |
| **WIPO PCT Webservice** | Primary (WO) | Official | `https://wipo.int/patentscope/en/data/` | SOAP XML API | XML | YES | YES | YES | Multi | YES | Commercial (2,000 CHF/year) | **BLOCKED**: Annual enterprise subscription barrier |
| **WIPO PCT Backfiles** | Primary (WO) | Official | `https://wipo.int/patentscope/en/data/products.html` | Hard Drive Media | OCR XML | YES | YES | YES | Multi | YES | Paid Product Purchase | **BLOCKED**: Commercial media order barrier |
| **Google Patents BigQuery** | Secondary (Global) | Secondary | `https://cloud.google.com/marketplace/patents-public-data` | SQL Query (BigQuery) | Cloud Table | NO (non-US) | NO (non-US) | YES | Multi | YES | Open Database License (ODbL) | **DISQUALIFIED (Rule 6)**: Claims & descriptions return NULL for IN, DE, WO |
| **datalyes/DAPFAM_patent** | Secondary (Global) | Research / HF | `https://huggingface.co/datasets/datalyes/DAPFAM_patent` | Parquet Download | Parquet | YES | YES | NO (Hash) | en only | YES | CC-BY-NC-SA-4.0 | **DISQUALIFIED (Rule 7 & 10)**: Family-level Lens hashes; translated to en |
| **NekoNeko512/wipo-semiconductors** | Secondary (WO) | Community / HF | `https://huggingface.co/datasets/NekoNeko512/wipo-semiconductors` | Arrow Download | Arrow | YES | YES | NO | en | YES | Unspecified | **DISQUALIFIED (Rule 1)**: Raw text blobs lacking publication IDs & dates |
| **mhurhangee/ep-patent-all-claims** | Secondary (EP) | Research / HF | `https://huggingface.co/datasets/mhurhangee/ep-patent-all-claims` | Parquet Download | Parquet | YES | NO | YES | en/de/fr | YES | CC-BY-4.0 | **DISQUALIFIED FOR DE (Rule 4 & 13)**: EP jurisdiction; barred from Germany |

---

## 2. Technical and Legal Constraints Summary

1. **Official Registries Gated by Contract or Anti-Bot Controls**:
   - DPMA (Germany) requires physical mail postal contracts and 200 EUR connection fees.
   - WIPO requires 2,000 CHF/year enterprise subscriptions for programmatic full text.
   - InPASS (India) enforces CAPTCHA sessions with no open machine-readable REST API.
2. **Open Aggregators Lack Non-US Full Text**:
   - Google Patents BigQuery populates full-text claims exclusively for US patents; fields for `IN`, `DE`, and `WO` return `NULL`.
   - Kaggle datasets for India contain early publication bibliographic notices without specification text.
3. **Patent Families Cannot Substitute for National Patents**:
   - Research family benchmarks (e.g. DAPFAM) aggregate worldwide filings into a single English translation using 15-character family hashes, violating Section 7 (German language preservation) and Rule 10 (statutory publication identifiers).
