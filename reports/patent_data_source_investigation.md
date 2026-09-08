# Patent Data Source Investigation Report: International Patent Knowledge Base (SIH 26045)

**Date**: 2026-09-08  
**Auditor**: SIH 26045 Data Engineering & Legal Compliance Team  
**Objective**: Comprehensive investigation into official, institutional, and open bulk-download resources across all candidate sources to identify authentic patent corpora for **India (IN)**, **Germany (DE)**, and **WIPO / PCT (WO)**.

---

## 1. Candidate Source Investigation Table

| Organization | Dataset Name | Source URL | Format | Approx. Records | Languages | Jurisdiction | Claims Included? | Description Included? | License / Terms | Commercial Credentials? | Automated Bulk Permitted? |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---: | :---: | :--- | :---: | :---: |
| **Google / IFI CLAIMS / EPO / USPTO / WIPO** | Google Patents Public Datasets (BigQuery) | `https://console.cloud.google.com/marketplace/details/google_patents_public_datasets/google-patents-public-data` | BigQuery / Parquet / Avro / JSONL | 140M+ global publications | Multilingual (`en`, `de`, `fr`, `es`, `zh`, etc.) | Global (`IN`, `DE`, `WO`, `US`, `EP`, etc.) | **YES** (`claims_localized`) | **YES** (`description_localized`) | Open Public Dataset (Public Domain / CC0 equivalent) | No (Free GCP tier up to 1 TB/mo query) | **YES** (Standard SQL export) |
| **CGPDTM / IPO (Govt of India)** | InPASS (Indian Patent Advanced Search System) | `https://ipindiaservices.gov.in/publicsearch` | Dynamic HTML / Individual PDF | ~500k+ Indian filings & grants | English, Hindi | India (`IN`) exclusively | **YES** (Form 2 Complete Spec) | **YES** (Form 2 Complete Spec) | Govt of India Open Records (§ 147 Patents Act 1970) | No (Public portal) | **NO** (Strict CAPTCHA, dynamic cookies, anti-bot firewall) |
| **CSIR & Ministry of AYUSH (India)** | TKDL (Traditional Knowledge Digital Library) | `https://www.tkdl.res.in/` | Relational proprietary database | ~430k formulations | Multilingual translations (`en`, `de`, `fr`, `ja`, `es`) | India Traditional Knowledge | N/A (Formulation prior art) | **YES** (Ayurvedic/Unani/Siddha texts) | Confidential inter-office treaty access only | Institutional Treaty Agreements only | **NO** (Public/developer access strictly prohibited) |
| **DPMA (Germany)** | DPMAdatenabgabe (Official Data Dissemination) | `https://www.dpma.de/service/dienste/datenabgabe/index.html` | XML (WIPO ST.36/ST.96), PDF, TIFF | Millions of German patents & utility models | German (`de`) exclusively | Germany (`DE`) exclusively | **YES** (*Patentansprüche*) | **YES** (*Beschreibung*) | Official German DPMA Data Terms | Yes (*DPMAdatenabgabe-Vereinbarung* contract required) | **YES** (Via contracted FTP/carrier dispatch) |
| **DPMA (Germany)** | DEPATISnet Online Database | `https://depatisnet.dpma.de/` | HTML / PDF | Multi-million worldwide & DE patents | German, English | Germany (`DE`), Global | **YES** | **YES** | Free public search | No | **NO** (Interactive web search only; throttled) |
| **WIPO (United Nations)** | WIPO PATENTSCOPE Bulk Data Service | `https://www.wipo.int/patentscope/en/data/` | XML (ST.36 / ST.96), PDF packages | ~4.5M published PCT applications | Multilingual (EN, FR, DE, ES, ZH, JA, etc.) | WIPO / PCT (`WO/...`) | **YES** | **YES** | WIPO Public Data Dissemination Terms | Yes (Bulk high-speed FTP requires subscription contract) | **YES** (For contracted subscription accounts) |
| **WIPO (United Nations)** | WIPO PATENTSCOPE Public Web Search | `https://patentscope.wipo.int/search/` | Web HTML / PDF | ~4.5M PCT records | Multilingual | WIPO / PCT (`WO/...`) | **YES** | **YES** | Public inspection rights | No | **NO** (Enforces CAPTCHAs and session limits) |
| **European Patent Office (EPO)** | `mhurhangee/ep-patent-all-claims` | `https://huggingface.co/datasets/mhurhangee/ep-patent-all-claims` | Parquet / Arrow | Millions of European patent claims | English, German, French | Europe (`EP`) | **YES** (Line-by-line granted claims) | No (Claims only) | Open Research / MIT License | No | **YES** (Hugging Face streaming/parquet) |
| **DAPFAM Project (Research)** | `datalyes/DAPFAM_patent` | `https://huggingface.co/datasets/datalyes/DAPFAM_patent` | Parquet / JSONL | 45,336 patent families | Multilingual | Global (`US`, `EP`, `WO`, `DE`) | **YES** | **YES** (Title, Abstract, Claims, Description) | Open Access Research Benchmark | No | **YES** (Hugging Face streaming) |
| **Max Planck Institute (Research)** | `mpi-inno-comp/paecter_dataset` | `https://huggingface.co/datasets/mpi-inno-comp/paecter_dataset` | Parquet | 300,000 EPO/PCT citation triplets | English | Europe (`EP`), WIPO (`WO`) | No (Metadata/citation triplets only) | No | Research Only | No | **YES** |
| **Harvard University / USPTO** | `HUPD/hupd` | `https://huggingface.co/datasets/HUPD/hupd` | JSON / TAR.GZ | 4.5M utility applications | English | United States (`US`) | **YES** | **YES** | Open Research License | No | **YES** (Hugging Face direct download) |

---

## 2. Jurisdiction Analysis & Feasibility Evaluation

### A. INDIA (`IN`)
1. **Primary Authority Barrier**:
   - The official IPO InPASS portal (`ipindiaservices.gov.in`) has **no programmatic bulk download facility** or public REST API. Automated querying is blocked by Cloudflare/Govt NIC anti-bot controls and dynamic session tokens.
   - CSIR-TKDL is legally protected under international non-disclosure agreements signed only with sovereign patent offices.
2. **Open Mirror Investigation**:
   - Kaggle Indian Patent Dataset contains bibliographic metadata (Application Number, Publication Number, Dates, Status, Title, IPC), but lacks full-text claims and descriptions.
   - Court datasets (e.g. `lh2-data-labs/indian-legal-records`) contain court decisions, which are legally barred from being substituted for patent specifications per Rule 3 of the mandate.
   - **Google Patents Public Data**: Contains authentic Indian patent publication records (`country_code = 'IN'`). However, full-text OCR coverage for historical Indian specifications is heterogeneous, requiring careful schema extraction.

### B. GERMANY (`DE`)
1. **Primary Authority Barrier**:
   - DPMA's *DPMAdatenabgabe* provides official, complete German patent specifications in original German (`de`). However, accessing the bulk archive requires signing a formal contract (*DPMAdatenabgabe-Vereinbarung*) with DPMA and paying dispatch media fees.
2. **Legitimate Open Research Alternatives**:
   - European Patent Office datasets and patent family collections (`datalyes/DAPFAM_patent`) contain authentic German patent documents with verified `DE` publication identifiers, German titles, abstracts, and claims.
   - **Critical Filter Enforced**: Only documents with explicit `DE` publication metadata (`DE...A1`, `DE...B4`) qualify for the GERMANY jurisdiction. Documents in German language originating from EPO (`EP`) or WIPO (`WO`) are strictly excluded from GERMANY and routed to their respective jurisdictions.

### C. WIPO / PCT (`WO`)
1. **Primary Authority Barrier**:
   - WIPO PATENTSCOPE bulk XML feeds require commercial subscription credentials.
2. **Legitimate Open Research Alternatives**:
   - Datasets derived from WIPO/PATSTAT disclosures containing authentic international publication identifiers (`WO yyyy/nnnnnn A1`) with title, abstract, and claims are accessible via open research corpora (`DAPFAM_patent`, Google Patents public extracts).
   - **Critical Filter Enforced**: Only records with valid `WO` publication numbers are admitted to the WIPO corpus.

---

## 3. Dataset Selection Strategy (Rule 7 Compliance)

To maximize authenticity, jurisdiction accuracy, full-text claims availability, provenance, and legal reproducibility:
1. **Pilot Phase Execution**:
   - We must pilot-test genuine candidate records:
     - 100 authentic **India** records
     - 100 authentic **Germany** (`DE`) records
     - 100 authentic **WIPO** (`WO`) records
2. **Pilot Gate**:
   - Validate format, publication IDs, country code, claims existence, Docling parseability, OCR quality, and zero duplicates before large-scale ingestion.
