# Phase 2G Final Acquisition Report: India, Germany, and WIPO/PCT Full-Text Investigation

**Project:** IP-SAKTI Sahayak / AYURLEX (SIH 26045)  
**Execution Phase:** Phase 2G — Actual Full-Text Data Acquisition  
**Date:** September 8, 2026  
**Status:** Baseline Corpora Preserved (USA, Europe); Missing Jurisdictions Evaluated (India, Germany, WIPO/PCT)

---

## 1. Sources Investigated

During Phase 2G, a comprehensive, multi-channel technical search was conducted across public open data, cloud research mirrors, academic repositories, and official IP agency distribution services:

1. **Google Patents Public Data via BigQuery / Cloud Storage / Hugging Face:**
   - Evaluated `nbettencourt/google-patents-data-preview` (mirror of Google Patents BigQuery `patents-public-data.patents.publications`).
   - Downloaded and inspected `publications000000000000.parquet` (12,692 rows, 50-shard collection).
2. **Bosch PLS Benchmark (`boschresearch/pls_benchmark_emnlp2022` - EMNLP 2022):**
   - Investigated Git LFS repository containing `atazanavir.csv` (137.1 MB), `ritonavir.csv` (121.9 MB), and `injection_valve.csv` (194.4 MB).
   - Acquired and parsed full dataset for `atazanavir.csv` (640 family records) and examined family structures and country distributions.
3. **PatentMatch & Fine-Tuning Datasets (`BNNT/PatentMatch`, `bhlim/patentmatch_for_finetuning`):**
   - Evaluated HPI PatentMatch instruction datasets on Hugging Face.
4. **Zenodo Open Research API:**
   - Programmatically queried Zenodo REST API (`api/records`) for Indian patent specifications, German patent corpora, and PCT full-text collections.
5. **InPASS / Controller General of Patents, Designs and Trade Marks (CGPDTM, India):**
   - Examined statutory access mechanisms via `iprsearch.ipindia.gov.in` and `ipindiaservices.gov.in`.
6. **CSIR India Patent Database (Patestate) & TKDL:**
   - Analyzed `techindiacsir.anusandhan.net` and institutional compendiums (CLRI, CGCRI).
7. **DPMA / DEPATISnet / DPMAconnectPlus (Germany):**
   - Re-evaluated official DPMAconnectPlus data release terms, DEPATISnet web portals, and DPMAdatenabgabe.
8. **WIPO PATENTSCOPE & PCT Web Services (International):**
   - Evaluated WIPO public data distribution, WIPO Knowledge Repository (`tind.wipo.int`), and bulk PCT Gazettes.
9. **European Patent Office (EPO) Open Patent Services (OPS) & DOCDB:**
   - Evaluated OPS RESTful full-text endpoints and developer terms for `WO`, `DE`, and `IN`.

---

## 2. Sources Accepted

1. **USA Baseline Corpus (`US`):**
   - Source: USPTO Bulk Data / Google Patents authentic full-text extracts.
   - Status: Accepted Verified Baseline (1,159 documents / 29,003 chunks).
2. **Europe Baseline Corpus (`EP`):**
   - Source: EPO Open Data / European Patent Office authentic full-text extracts.
   - Status: Accepted Verified Baseline (646 documents / 1,912 chunks).
3. **WIPO PLS Atazanavir Pilot Candidate Subset (`WO`):**
   - Source: `boschresearch/pls_benchmark_emnlp2022` (derived from official WIPO Patent Landscape Study on Atazanavir).
   - Accepted solely for pilot validation (342 primary WO publication candidates identified with non-empty claims and descriptions). Not promoted to complete production status due to volume insufficiency (342 / 2,000 target) and family aggregation constraints.

---

## 3. Sources Rejected

1. **Google Patents Public Data Parquet (`nbettencourt/google-patents-data-preview`):**
   - *Reason:* Although it contains 752 German (`DE`) records and 110 WIPO (`WO`) records in shard 0, deep inspection revealed `claims_localized: []` (0%) and `description_localized: []` (0%). Non-US records in Google Patents BigQuery public data exports omit full-text claims and descriptions.
2. **BNNT/PatentMatch (`PatentMatch_en.json`):**
   - *Reason:* Reformatted instruction-tuning pairs (`instruction`, `input`, `output`) lacking complete patent specifications, bibliographic identifiers, and descriptions.
3. **Kaggle Indian Patent Metadata (`arshpreetsingh/indian-patent-dataset`):**
   - *Reason:* Disqualified in Phase 2D/2F; confirmed metadata-only (0 claims, 0 descriptions).
4. **datalyes/DAPFAM_patent:**
   - *Reason:* 15-character anonymized Lens family hashes instead of statutory publication numbers; English machine translations.
5. **NekoNeko512/wipo-semiconductors:**
   - *Reason:* Raw unsegmented text dumps without verified publication identifiers or filing dates.

---

## 4. Sources Blocked

1. **InPASS / CGPDTM (India):**
   - *Barrier:* Protected by session-bound ASP.NET architecture and mandatory OCR/image CAPTCHA. Terms of Use legally prohibit automated bulk harvesting. No public bulk XML/JSON download API exists.
2. **DPMAconnectPlus (Germany):**
   - *Barrier:* Official access requires signing two physical paper contracts, mailing them to DPMA headquarters in Munich, Germany, and paying a 200 EUR fee. Prohibited under Rule 21 and Rule 23.
3. **DEPATISnet (Germany):**
   - *Barrier:* Interactive web interface restricted by strict anti-scraping and rate-limiting measures; commercial bulk access routed through DPMAdatenabgabe.
4. **WIPO PATENTSCOPE Bulk / PCT Web Service:**
   - *Barrier:* Public web endpoint automatically blacklists IP addresses exceeding 10 requests/minute. Official commercial PCT Web Service subscription costs 2,000 CHF/year.
5. **Zenodo REST API:**
   - *Barrier:* Direct programmatic queries blocked with HTTP 403 Forbidden without authenticated personal developer tokens.

---

## 5. India Acquisition Results

- **Target:** >= 2,000 verified documents, >= 4,000 valid chunks.
- **Acquired Authentic Full-Text Documents:** 0.
- **Analysis:**
  - Indian patent specifications are maintained in InPASS and regional patent office gazettes.
  - While bibliographic data exists in academic datasets, full specifications (complete claims + description) are not distributed in open, unencumbered bulk formats without subscription agreements (e.g., Saturo Global, MCPaIRS) or CAPTCHA bypass.
  - Under Rule 1 (No synthetic records), Rule 7 (No metadata-only records), and Rule 21 (No CAPTCHA/TOS bypass), no synthetic or placeholder data was admitted.
- **Status:** **INSUFFICIENT (0 / 2,000)**.

---

## 6. Germany Acquisition Results

- **Target:** >= 2,000 verified documents, >= 4,000 valid chunks.
- **Acquired Authentic Full-Text Documents:** 0.
- **Analysis:**
  - In `boschresearch/pls_benchmark_emnlp2022`, 178 patent families list German (`DE`) family members. However, the text provided is in English (from the US or PCT family member), not the statutory German-language specification.
  - Admitting these records as German patents would violate Rule 10 (No jurisdiction mixing), Rule 11 (No EP -> DE conversion), Rule 12 (No English translation -> DE conversion), and Rule 16 (Preserve original patent language).
  - DPMAconnectPlus remains contractually and financially restricted.
- **Status:** **INSUFFICIENT (0 / 2,000)**.

---

## 7. WIPO Acquisition Results

- **Target:** >= 2,000 verified documents, >= 4,000 valid chunks.
- **Candidate WO Records Identified:** 342 in `atazanavir.csv`.
- **Acquired Production Documents:** 0 admitted to final production corpus.
- **Analysis:**
  - While 342 records have valid WO publication numbers (`WO9825617`, `WO9940063`, etc.) with authentic full-text claims and descriptions, 100% of these records represent aggregated patent families containing multiple international jurisdictions.
  - Isolating individual WO documents without family contamination yields at most 342 records, achieving only 17.1% of the >= 2,000 document mandate.
  - In adherence to strict sufficiency criteria, WIPO is not falsely marked sufficient.
- **Status:** **INSUFFICIENT (0 / 2,000)**.

---

## 8. Pilot Validation Results

A rigorous pilot validation was executed on 100 candidate records from `atazanavir.csv`:
- **Pilot Size:** 100 candidate records.
- **Sample Audit:** 20 randomly drawn records inspected individually.
- **Audit Findings:**
  - Valid Statutory Publication Number: 20 / 20 (100%)
  - Non-empty Statutory Claims: 20 / 20 (100%)
  - Non-empty Description (>= 1,000 chars): 20 / 20 (100%)
  - External Registry Verification (Google Patents / WIPO): 20 / 20 (100% verified authentic)
  - Blended Family Contamination: 20 / 20 (100% of rows contain foreign family members)
- **Gate Decision:** Rejected for production scaling due to family blending and insufficient total population (342 total available vs. 2,000 target).

---

## 9. Full-Text Validation

- **USA Production Corpus:** 100% full-text coverage (1,159 / 1,159 docs with full claims & descriptions).
- **Europe Production Corpus:** 100% full-text coverage (646 / 646 docs with full claims & descriptions).
- **India Candidate Corpora:** Rejected (0% full-text coverage in open datasets).
- **Germany Candidate Corpora:** Rejected (Google Patents BigQuery has 0% claims/desc for DE; Bosch PLS has English family text).
- **WIPO Candidate Corpora:** 100% full-text coverage on the 342 identified pilot records, but rejected for production due to family blending and scale limit.

---

## 10. Publication-ID Validation

Strict publication identifier validators were maintained and verified:
- **India Pattern:** `^IN\d{6,7}[A-Z]?$` or Indian statutory application formats (e.g. `IN02997CN2014`).
- **Germany Pattern:** `^DE\d{7,12}[A-Z]\d?$` (excludes EP/WO).
- **WIPO Pattern:** `^WO\d{4}\d{6}[A-Z]\d?$` or `^WO\d{2}\d{5}[A-Z]\d?$`.
- **USA Pattern:** `^US\d{7,8}[A-Z]\d?$`.
- **Europe Pattern:** `^EP\d{7,8}[A-Z]\d?$`.

All baseline and candidate records strictly adhere to their respective national office syntax.

---

## 11. Jurisdiction Audit

- **Zero Leakage:** No EP patent was reclassified as DE.
- **Zero Language-Based Classification:** No English document was attributed to DE national status.
- **Zero Applicant-Based Classification:** No German or Indian corporate applicant patent was reclassified outside its statutory filing office.
- **Zero Synthetic Inventions:** No mock or template records exist in production.

---

## 12. Language Audit

- **USA Corpus:** 100% English (`en`).
- **Europe Corpus:** Preserves authentic EPO filing languages (English, German, French) as published.
- **Germany Candidates:** Audited against language integrity; English family translations were explicitly rejected to avoid corrupting German national corpus authenticity.
- **India Candidates:** English specifications required under Indian Patent Act Section 10.

---

## 13. Deduplication Audit

- Deduplication pipeline verified:
  - Exact SHA-256 duplicate removal active.
  - SimHash near-duplicate detection active (threshold 0.85).
  - 46 redundant baseline duplicates successfully removed in Phase 2E/2F.

---

## 14. Family Audit

- Cross-jurisdiction family tracking maintained in `data/family_relationship_report.json`.
- Legitimate family members sharing priority dates (e.g., US, EP, WO counterparts) are preserved as distinct jurisdiction documents with mutual reference metadata, never merged into a single blended record.

---

## 15. Docling Audit

- Layout-aware parser (Docling 1.10.0) architecture verified.
- Pipeline structure: Raw JSON/XML/PDF -> Docling Layout Processing -> Section Extraction -> Patent-Aware Chunking.
- Docling success rate on verified baseline: 100% (1,159 USA, 646 Europe).

---

## 16. Chunking Audit

- Patent-aware chunking rules:
  - Claim boundaries preserved; independent and dependent claim hierarchy retained.
  - Detailed descriptions partitioned with 10% semantic overlap.
  - Chunk metrics:
    - USA: 29,003 chunks (avg 25.0 chunks/doc)
    - Europe: 1,912 chunks (avg 3.0 chunks/doc)
    - India: 0 chunks
    - Germany: 0 chunks
    - WIPO: 0 chunks

---

## 17. Provenance Audit

- Every accepted production document has an immutable provenance entry in `data/provenance/` and `reports/provenance_audit_report.json`:
  - `document_id`, `publication_number`, `jurisdiction`, `source`, `source_url`, `download_timestamp`, `sha256`, `license`, `language`.
- Provenance integrity: 100% for all 1,805 verified production documents.

---

## 18. Actual Document Counts

| Jurisdiction | Verified Production Documents | Target | Status |
| :--- | :---: | :---: | :---: |
| **USA** | **1,159** | Verified Baseline | **ACCEPTED BASELINE** |
| **Europe** | **646** | Verified Baseline | **ACCEPTED BASELINE** |
| **India** | **0** | >= 2,000 | **INSUFFICIENT** |
| **Germany** | **0** | >= 2,000 | **INSUFFICIENT** |
| **WIPO/PCT** | **0** | >= 2,000 | **INSUFFICIENT** |
| **TOTAL** | **1,805** | — | — |

---

## 19. Actual Chunk Counts

| Jurisdiction | Preserved Production Chunks | Target | Status |
| :--- | :---: | :---: | :---: |
| **USA** | **29,003** | Verified Baseline | **ACCEPTED BASELINE** |
| **Europe** | **1,912** | Verified Baseline | **ACCEPTED BASELINE** |
| **India** | **0** | >= 4,000 | **INSUFFICIENT** |
| **Germany** | **0** | >= 4,000 | **INSUFFICIENT** |
| **WIPO/PCT** | **0** | >= 4,000 | **INSUFFICIENT** |
| **TOTAL** | **30,915** | — | — |

---

## 20. Remaining Gaps & Legal/Access Realities

1. **India Gap:** Remaining deficit of 2,000 documents. Closing this gap lawfully requires either:
   - Official institutional data partnership with CGPDTM / CSIR for direct bulk specification dumps.
   - Commercial licensing of an authenticated full-text feed (e.g. MCPaIRS or Saturo Global).
2. **Germany Gap:** Remaining deficit of 2,000 documents. Closing this gap lawfully requires:
   - Formal bilateral contract with DPMA for DPMAconnectPlus (200 EUR fee + physical contract submission to Munich).
3. **WIPO Gap:** Remaining deficit of 2,000 documents. Closing this gap lawfully requires:
   - Official WIPO PCT Data Web Services subscription (2,000 CHF/year).

---

## 21. Embedding Readiness

- **EMBEDDING STATUS:** **STRICTLY HALTED / NOT STARTED**.
- Zero BGE-M3 embeddings generated.
- Zero FAISS vector indexes constructed.
- Zero premature retrieval metrics claimed.
- Pipeline remains halted at the data boundary awaiting user instructions.
