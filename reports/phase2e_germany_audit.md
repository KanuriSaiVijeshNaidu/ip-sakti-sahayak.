# Phase 2E — Germany Patent Data Acquisition & Source Audit Report

**Project**: IP-SAKTI Sahayak / AYURLEX — SIH 26045  
**Jurisdiction**: GERMANY (`DE`)  
**Date**: 2026-09-08  
**Phase**: PHASE 2E — STEP 2 DETAILED AUDIT  
**Statutory Target**: $\ge 2,000$ authentic documents and $\ge 4,000$ chunks

---

## 1. Candidate Source Evaluations for Germany

### Source 1: DPMAconnectPlus / Deutsches Patent- und Markenamt (DPMA)
- **source_name**: Deutsches Patent- und Markenamt (DPMAconnectPlus)
- **official_or_secondary**: Official Primary National Patent Office
- **URL**: `https://www.dpma.de/service/datenabgabe/dpmaconnectplus/index.html`
- **access_method**: HTTP Basic Authenticated Web Service Interface
- **license/terms**: Standard DPMA Agreement (*Standardvertrag DPMAconnectPlus*). Strict permitted-use clauses.
- **publication_identifier_available**: YES (Official German publication numbers: `DE 10 20xx xxx xxx A1`, `DE ... B4`)
- **claims_available**: YES (Original German claims: *Patentansprüche*)
- **description_available**: YES (Original German descriptions: *Beschreibung*)
- **abstract_available**: YES (Original German summaries: *Zusammenfassung*)
- **title_available**: YES (Original German titles: *Bezeichnung*)
- **original_language_available**: German (`de`) primary
- **document_format**: WIPO ST.36 / ST.96 XML and facsimile PDF
- **bulk_download_possible**: YES (Weekly publication packages downloadable via HTTP once account provisioned)
- **jurisdiction_field**: Explicit Federal Republic of Germany (`DE`)
- **provenance_quality**: Official Primary Registry (100% statutory legal standing)
- **legal/use restrictions**: Requires submitting **two signed original paper contract documents** by postal mail to `DPMA, Referat 2.1.2 - Kundenservice Datenabgabe, 80297 München, Germany` and paying a mandatory one-time **200 EUR connection fee**.
- **Audit Conclusion**: **BLOCKED BY CONTRACTUAL CREDENTIAL GATE**. Legitimate channel exists for universities, but cannot be downloaded anonymously without the postal contract execution.

---

### Source 2: DPMA DPMAdatenabgabe (Historical Backfiles)
- **source_name**: DPMA Bulk Data Supply (*DPMAdatenabgabe*)
- **official_or_secondary**: Official Primary Data Dissemination Service
- **URL**: `https://www.dpma.de/service/datenabgabe/index.html`
- **access_method**: Contractual Media Dispatch / SFTP
- **license/terms**: *Standardvertrag über die Bereitstellung von Daten des DPMA*
- **publication_identifier_available**: YES (> 2.5 million German publications)
- **claims_available**: YES
- **description_available**: YES
- **abstract_available**: YES
- **title_available**: YES
- **original_language_available**: German (`de`)
- **document_format**: WIPO ST.36/ST.96 XML, TIFF/PDF drawings
- **bulk_download_possible**: YES (Multi-terabyte backfiles)
- **jurisdiction_field**: Explicit Germany (`DE`)
- **provenance_quality**: Official Primary Historical Archive
- **legal/use restrictions**: Requires formal contract, administrative processing, and media dispatch handling fees. No open public server download.
- **Audit Conclusion**: **BLOCKED BY CONTRACTUAL & FINANCIAL REQUIREMENTS**.

---

### Source 3: DEPATISnet Public Patent Search
- **source_name**: DEPATISnet
- **official_or_secondary**: Official Public Document Archive
- **URL**: `https://depatisnet.dpma.de/`
- **access_method**: Interactive Web Browser Portal (Session cookies, request throttling, CAPTCHAs)
- **license/terms**: DPMA website terms of use; automated mass downloading and robot queries explicitly prohibited
- **publication_identifier_available**: YES
- **claims_available**: YES (Scanned PDF facsimiles)
- **description_available**: YES (Scanned PDF facsimiles)
- **abstract_available**: YES
- **title_available**: YES
- **original_language_available**: German (`de`)
- **document_format**: PDF / TIFF page images
- **bulk_download_possible**: NO (Manual single-document download only)
- **jurisdiction_field**: Germany (`DE`)
- **provenance_quality**: Authoritative Official Portal
- **legal/use restrictions**: Bulk scraping barred by terms of service and Rule 16
- **Audit Conclusion**: **BLOCKED BY TERMS OF SERVICE & ANTI-BOT POLICIES**.

---

### Source 4: European Patent Office Open Patent Services (EPO OPS)
- **source_name**: EPO Open Patent Services (OPS)
- **official_or_secondary**: Regional Official Patent Office API
- **URL**: `https://developers.epo.org/`
- **access_method**: RESTful API with OAuth2 Authentication (Free developer registration)
- **license/terms**: EPO Fair Use Policy (4 GB per week free quota)
- **publication_identifier_available**: YES (`DE` bibliographic data supported)
- **claims_available**: **NO FOR DE**. Official EPO OPS coverage documentation explicitly confirms: *OPS character-coded full text (descriptions and claims) covers EP, WO, AT, BE, BG, CA, CH, CZ, DK, EE, ES, FR, GB, ... DE (Germany) is EXCLUDED from character-coded descriptions and claims.*
- **description_available**: **NO FOR DE** (Excluded from OPS full-text endpoint)
- **abstract_available**: YES
- **title_available**: YES
- **original_language_available**: German (`de`)
- **document_format**: WIPO ST.36 XML
- **bulk_download_possible**: YES (within 4 GB/week quota for supported authorities)
- **jurisdiction_field**: Excludes `DE` full text
- **provenance_quality**: Official Regional Authority
- **legal/use restrictions**: Developer account required
- **Audit Conclusion**: **EXCLUDED BY EPO SPECIFICATION**. German national (`DE`) claims and specifications are not served by EPO OPS full-text services.

---

### Source 5: Hugging Face `mhurhangee/ep-patent-all-claims`
- **source_name**: EP Patent All Claims
- **official_or_secondary**: Secondary Open Research Dataset
- **URL**: `https://huggingface.co/datasets/mhurhangee/ep-patent-all-claims`
- **access_method**: Direct Parquet Download
- **license/terms**: CC-BY-4.0
- **publication_identifier_available**: YES (Carries `EP` publication numbers, e.g. `EP 1234567 B1`)
- **claims_available**: YES (Contains German-language claims)
- **description_available**: NO (Claims only)
- **abstract_available**: NO
- **title_available**: YES
- **original_language_available**: German (`de`), English (`en`), French (`fr`)
- **document_format**: Parquet
- **bulk_download_possible**: YES (860 MB)
- **jurisdiction_field**: **EUROPE (`EP`) ONLY**
- **provenance_quality**: EPO granted patent claims
- **legal/use restrictions**: Open research use
- **Audit Conclusion**: **DISQUALIFIED UNDER RULE 4 & RULE 13 (Jurisdiction Validator)**. The mandate explicitly commands: *"German language != German jurisdiction. An EP document written in German MUST remain EUROPE. Never classify EP documents as GERMANY."*

---

## 2. Summary Status for Germany

| Audit Check | Status | Evidence |
| :--- | :---: | :--- |
| **Authentic Documents Acquired** | 0 | DPMA bulk access requires postal contract & fee; EPO OPS excludes DE full text; EP claims cannot be reclassified as DE |
| **Sufficiency Status** | **INSUFFICIENT** | Target: $\ge 2,000$ documents / $\ge 4,000$ chunks (Current: 0 docs / 0 chunks) |
| **Rule 16 Stop Condition** | **ENFORCED** | Unauthenticated automated scraping of DEPATISnet is prohibited; German language EP patents preserved in Europe corpus only |
