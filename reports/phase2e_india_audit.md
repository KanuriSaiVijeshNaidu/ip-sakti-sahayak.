# Phase 2E — India Patent Data Acquisition & Source Audit Report

**Project**: IP-SAKTI Sahayak / AYURLEX — SIH 26045  
**Jurisdiction**: INDIA (`IN`)  
**Date**: 2026-09-08  
**Phase**: PHASE 2E — STEP 1 DETAILED AUDIT  
**Statutory Target**: $\ge 2,000$ authentic documents and $\ge 4,000$ chunks

---

## 1. Candidate Source Evaluations for India

### Source 1: Indian Patent Advanced Search System (InPASS) / CGPDTM
- **source_name**: Office of the Controller General of Patents, Designs & Trade Marks (CGPDTM / IPO)
- **official_or_secondary**: Official Primary Registry
- **URL**: `https://ipindiaservices.gov.in/publicsearch/`
- **access_method**: Interactive Web Search Portal (Dynamic ASP.NET session state, interactive CAPTCHAs, IP rate-limiting)
- **license/terms**: Government of India statutory database terms; automated data harvesting/scraping strictly prohibited
- **publication_identifier_available**: YES (Official Indian patent numbers, e.g., `IN 268685 B`, application numbers `1456/DEL/2008`)
- **claims_available**: YES (Complete Form 2 claims sets for granted patents)
- **description_available**: YES (Complete Form 2 detailed specification and background)
- **abstract_available**: YES
- **title_available**: YES
- **original_language_available**: English (`en`) and Hindi (`hi`)
- **document_format**: HTML web forms, scanned facsimile PDFs
- **bulk_download_possible**: NO (No public REST API, no open FTP/S3 dump; mass extraction triggers firewall IP ban)
- **jurisdiction_field**: Explicit India (`IN`) jurisdiction
- **provenance_quality**: Authoritative Primary (100% legal statutory standing)
- **legal/use restrictions**: Non-commercial individual search permitted; programmatic scraping barred by Terms of Service and Rule 16
- **Audit Conclusion**: **BLOCKED BY ACCESS CONTROLS (CAPTCHA & Firewall Throttling)**

---

### Source 2: The Patent Office Journal (CGPDTM Official Electronic Gazette)
- **source_name**: The Patent Office Journal (`search.ipindia.gov.in`)
- **official_or_secondary**: Official Government Gazette
- **URL**: `https://search.ipindia.gov.in/IPOJournal/Journal/Patent`
- **access_method**: Direct public HTTP download of weekly PDF issues (published every Friday since 2009)
- **license/terms**: Government of India official gazette publication
- **publication_identifier_available**: YES (Application numbers and grant numbers)
- **claims_available**: **NO** (Contains only Section 11A publication notices, filing dates, applicants, and early abstracts; does NOT publish full claims)
- **description_available**: **NO** (Full specifications are omitted from gazette notices)
- **abstract_available**: YES (Short early publication abstracts)
- **title_available**: YES
- **original_language_available**: English (`en`) and Hindi (`hi`)
- **document_format**: PDF (Electronic Gazette issues)
- **bulk_download_possible**: YES (Weekly PDFs can be retrieved)
- **jurisdiction_field**: Explicit India (`IN`)
- **provenance_quality**: Official Government Notice
- **legal/use restrictions**: Public notices
- **Audit Conclusion**: **DISQUALIFIED UNDER RULE 6**. The gazette acts as an announcement bulletin and does not publish the specification body or claims necessary for prior-art RAG.

---

### Source 3: CSIR-TKDL (Traditional Knowledge Digital Library)
- **source_name**: Council of Scientific & Industrial Research (CSIR) - TKDL
- **official_or_secondary**: Official Inter-Governmental Repository
- **URL**: `http://www.tkdl.res.in/`
- **access_method**: Restricted Access (Bilateral International Access Agreements with EPO, USPTO, JPO, etc.)
- **license/terms**: Strict Non-Disclosure Agreement; confidentiality clauses under international patent office treaties
- **publication_identifier_available**: YES (Ayurvedic formulations mapped to patent application prior art)
- **claims_available**: YES (Formula formulations and traditional knowledge citations)
- **description_available**: YES (Detailed preparation methods, Sanskrit shloka translations)
- **abstract_available**: YES
- **title_available**: YES
- **original_language_available**: Sanskrit, Hindi, English, German, French, Spanish, Japanese
- **document_format**: Proprietary XML / Encrypted Database
- **bulk_download_possible**: NO (Public open bulk download strictly barred)
- **jurisdiction_field**: Traditional Indian Knowledge / India
- **provenance_quality**: Authoritative International Reference
- **legal/use restrictions**: Strictly confidential; cannot be distributed or ingested without statutory government authorization
- **Audit Conclusion**: **RESTRICTED BY TREATY / UNAVAILABLE TO PUBLIC**

---

### Source 4: Kaggle Indian Patent Dataset (arshpreetsingh)
- **source_name**: Indian Patent Dataset
- **official_or_secondary**: Secondary / Open Aggregator
- **URL**: `https://www.kaggle.com/datasets/arshpreetsingh/indian-patent-dataset`
- **access_method**: Direct CSV Download
- **license/terms**: CC0: Public Domain
- **publication_identifier_available**: YES (Application numbers: `2010/DEL/...`, `2011/MUM/...`)
- **claims_available**: **NO** (0 claims present in dataset)
- **description_available**: **NO** (0 descriptions present in dataset)
- **abstract_available**: **NO**
- **title_available**: YES
- **original_language_available**: English (`en`)
- **document_format**: CSV tabular records
- **bulk_download_possible**: YES (28.4 MB)
- **jurisdiction_field**: Application Office (Delhi, Mumbai, Kolkata, Chennai)
- **provenance_quality**: Scraped Bibliographic Metadata
- **legal/use restrictions**: Open public domain
- **Audit Conclusion**: **DISQUALIFIED UNDER RULE 6 (Metadata Only)**. Contains 54,231 rows of filing metadata but zero patent claims or specifications.

---

### Source 5: Google Patents BigQuery (`patents-public-data`)
- **source_name**: Google Patents Public Datasets
- **official_or_secondary**: Secondary Cloud Repository
- **URL**: `https://cloud.google.com/marketplace/product/google_patents_public_datasets/google-patents-public-data`
- **access_method**: Google BigQuery SQL queries
- **license/terms**: Open Database License (ODbL)
- **publication_identifier_available**: YES (`IN-xxxxxx-B`, `xxxx/DEL/xxxx`)
- **claims_available**: **NO** (Returns `NULL` for country code `IN`)
- **description_available**: **NO** (Returns `NULL` for country code `IN`)
- **abstract_available**: PARTIAL (Short bibliographic abstracts)
- **title_available**: YES
- **original_language_available**: English (`en`)
- **document_format**: Cloud Database Tables
- **bulk_download_possible**: YES (via Cloud Storage export)
- **jurisdiction_field**: `country_code = 'IN'`
- **provenance_quality**: DOCDB bibliographic feed
- **legal/use restrictions**: Open query access
- **Audit Conclusion**: **DISQUALIFIED UNDER RULE 6**. Full text claims and descriptions are populated only for US patents; non-US records are metadata only.

---

## 2. Summary Status for India

| Audit Check | Status | Evidence |
| :--- | :---: | :--- |
| **Authentic Documents Acquired** | 0 | All candidate sources are either metadata-only, confidential, or protected by anti-bot firewalls |
| **Sufficiency Status** | **INSUFFICIENT** | Target: $\ge 2,000$ documents / $\ge 4,000$ chunks (Current: 0 docs / 0 chunks) |
| **Rule 16 Stop Condition** | **ENFORCED** | Programmatic scraping of InPASS against terms of service is prohibited; synthetic records strictly forbidden |
