# Phase 2E — WIPO / PCT Patent Data Acquisition & Source Audit Report

**Project**: IP-SAKTI Sahayak / AYURLEX — SIH 26045  
**Jurisdiction**: WIPO / PCT (`WO`)  
**Date**: 2026-09-08  
**Phase**: PHASE 2E — STEP 3 DETAILED AUDIT  
**Statutory Target**: $\ge 2,000$ authentic documents and $\ge 4,000$ chunks

---

## 1. Candidate Source Evaluations for WIPO / PCT

### Source 1: WIPO PATENTSCOPE Web Portal
- **source_name**: World Intellectual Property Organization (WIPO PATENTSCOPE)
- **official_or_secondary**: Official Primary International Organization
- **URL**: `https://patentscope.wipo.int/`
- **access_method**: Web Interface
- **license/terms**: WIPO Terms of Use; automated queries, mass downloading, and scraping strictly prohibited. Excessive traffic ($> 10$ search-related actions per minute) triggers automated IP blocking.
- **publication_identifier_available**: YES (Official PCT publication numbers: `WO yyyy/nnnnnn A1`, `WO ... A2`)
- **claims_available**: YES (HTML OCR claims & scanned PDF)
- **description_available**: YES (HTML OCR descriptions & scanned PDF)
- **abstract_available**: YES
- **title_available**: YES
- **original_language_available**: Multilingual (Original filing language: English, French, German, Spanish, Chinese, Japanese, etc.)
- **document_format**: Scanned facsimile PDF, XML, HTML OCR text
- **bulk_download_possible**: NO (Public web interface limits manual export to 10,000 bibliographic records; bulk automated download prohibited)
- **jurisdiction_field**: Explicit International Patent Cooperation Treaty (`WO`)
- **provenance_quality**: Official Primary International Registry
- **legal/use restrictions**: Individual browser search permitted; programmatic harvesting violates terms of service and is barred by Rule 16
- **Authoritative Provenance Finding**: WIPO OCR text (XML/HTML) is expressly disclaimed as non-authoritative; the original Gazette PDF is legally required for authentic statutory provenance
- **Audit Conclusion**: **BLOCKED BY ANTI-SCRAPING POLICIES & RATE-LIMIT BANS**.

---

### Source 2: WIPO PCT Webservice & PCT Data Products
- **source_name**: WIPO PCT Data Services (International Bureau, Geneva)
- **official_or_secondary**: Official Primary Data Dissemination Service
- **URL**: `https://www.wipo.int/patentscope/en/data/`
- **access_method**: SOAP XML Web Service / Hard Drive Media Shipment
- **license/terms**: Official WIPO Commercial Data Contract
- **publication_identifier_available**: YES (Complete international publication series from 1978 to present)
- **claims_available**: YES
- **description_available**: YES
- **abstract_available**: YES
- **title_available**: YES
- **original_language_available**: Multilingual
- **document_format**: WIPO ST.36 XML, PDF image packages
- **bulk_download_possible**: YES (Batch retrieval supported via authorized client)
- **jurisdiction_field**: Explicit `WO`
- **provenance_quality**: Official Primary
- **legal/use restrictions**: Requires annual commercial contract payment of **2,000 Swiss Francs (CHF) / year**. PCT Backfiles on external hard drives require purchasing physical media licenses.
- **Audit Conclusion**: **BLOCKED BY COMMERCIAL SUBSCRIPTION FEE (2,000 CHF/year)**.

---

### Source 3: EPO Open Patent Services (OPS) for WO Publications
- **source_name**: European Patent Office (EPO OPS)
- **official_or_secondary**: Regional Official Patent Office API
- **URL**: `https://developers.epo.org/`
- **access_method**: RESTful API with OAuth2 Authentication
- **license/terms**: EPO Developer Terms (4 GB/week fair use quota)
- **publication_identifier_available**: YES (`WO` publication numbers supported)
- **claims_available**: YES (Character-coded claims available for `WO`)
- **description_available**: YES (Character-coded descriptions available for `WO`)
- **abstract_available**: YES
- **title_available**: YES
- **original_language_available**: English, German, French
- **document_format**: WIPO ST.36 XML
- **bulk_download_possible**: YES (Within 4 GB/week developer quota)
- **jurisdiction_field**: `WO`
- **provenance_quality**: Official International Exchange
- **legal/use restrictions**: Requires free developer registration and generation of an OAuth2 `Consumer Key` and `Consumer Secret`.
- **Audit Conclusion**: **REQUIRES DEVELOPER API CREDENTIALS**. Unauthenticated queries return 401 Unauthorized; candidate for legitimate acquisition once OAuth2 developer credentials are provisioned.

---

### Source 4: Hugging Face `NekoNeko512/wipo-semiconductors`
- **source_name**: wipo-semiconductors
- **official_or_secondary**: Community Scraping Dataset
- **URL**: `https://huggingface.co/datasets/NekoNeko512/wipo-semiconductors`
- **access_method**: Direct Apache Arrow Download
- **license/terms**: Unspecified
- **publication_identifier_available**: **NO** (0 publication numbers present; features are only `abstract`, `claims`, `description`)
- **claims_available**: YES (Raw unindexed text)
- **description_available**: YES (Raw unindexed text)
- **abstract_available**: YES
- **title_available**: **NO**
- **original_language_available**: English (`en`)
- **document_format**: Apache Arrow
- **bulk_download_possible**: YES (2.5 GB)
- **jurisdiction_field**: **NONE** (Lacks country code or jurisdiction label)
- **provenance_quality**: Unverified Scraping
- **legal/use restrictions**: Missing license and provenance chain
- **Audit Conclusion**: **DISQUALIFIED UNDER RULE 3 & RULE 10**. Lacks publication numbers, filing dates, titles, and verifiable jurisdiction; fails cross-reference against PATENTSCOPE.

---

### Source 5: Hugging Face `FrancophonIA/COVID-19_WIPO`
- **source_name**: COVID-19 WIPO Multilingual Corpus
- **official_or_secondary**: Translation Research Repository
- **URL**: `https://huggingface.co/datasets/FrancophonIA/COVID-19_WIPO`
- **access_method**: Direct Download
- **license/terms**: Open
- **publication_identifier_available**: **NO**
- **claims_available**: **NO**
- **description_available**: **NO**
- **abstract_available**: **NO**
- **title_available**: **NO**
- **original_language_available**: Multilingual translation pairs
- **document_format**: TMX (Translation Memory eXchange)
- **bulk_download_possible**: YES (1.5 MB)
- **jurisdiction_field**: None
- **provenance_quality**: European Language Grid terminology
- **legal/use restrictions**: Research translation
- **Audit Conclusion**: **DISQUALIFIED UNDER RULE 6**. Contains isolated bilingual terminology sentences from the WIPO COVID-19 portal, not patent specifications or claims.

---

## 2. Summary Status for WIPO / PCT

| Audit Check | Status | Evidence |
| :--- | :---: | :--- |
| **Authentic Documents Acquired** | 0 | PATENTSCOPE enforces anti-scraping IP bans; official Webservice requires 2,000 CHF/yr; secondary datasets lack publication numbers |
| **Sufficiency Status** | **INSUFFICIENT** | Target: $\ge 2,000$ documents / $\ge 4,000$ chunks (Current: 0 docs / 0 chunks) |
| **Rule 16 Stop Condition** | **ENFORCED** | Automated unauthenticated harvesting against WIPO terms of use is prohibited; synthetic records strictly forbidden |
