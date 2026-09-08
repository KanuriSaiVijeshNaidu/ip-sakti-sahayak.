# Kaggle & Hugging Face Patent Dataset Inventory & Screening Audit

**Project**: IP-SAKTI Sahayak — Production Patent & Traditional Knowledge RAG  
**Date**: 2026-09-08  
**Phase**: PHASE 2D — KAGGLE + HUGGING FACE REAL-WORLD PATENT DATA ACQUISITION  
**Policy Enforced**: Hard filtering under Rule 3, Rule 6, Rule 10, Rule 13, and Rule 16. **Zero synthetic data.**

---

## 1. Candidate Dataset Screening Matrix

| Dataset Name | Platform | Publisher | License | Size | Records | Claims | Desc | Jurisdiction | Quality Status | Primary Evaluation Ruling |
| :--- | :--- | :--- | :--- | :---: | :---: | :---: | :---: | :---: | :--- | :--- |
| **Indian Patent Dataset** | Kaggle | Arshpreet Singh | CC0: Public Domain | 28.4 MB | 54,231 | NO | NO | Country code (IN), A... | **REJECTED** | Rule 6 Violation: Metadata-only dataset containing application numbers... |
| **Google Patents Public Data** | Kaggle / BigQuery | Google | Open Data Commons Open Database License (ODbL) | > 1 TB (Queryable via SQL) | > 120,000,000 | NO | NO | country_code ('IN', ... | **REJECTED FOR IN/DE/WO FULL TEXT** | Rule 6 & Technical Limitation: Full-text claims and detailed descripti... |
| **USPTO OCE Patent Claims Research Data** | Kaggle / USPTO | USPTO Office of the Chief Economist | U.S. Government Work (Public Domain) | 4.2 GB | 15,800,000 claims | YES | NO | US only... | **REJECTED** | Jurisdiction Mismatch & Claims-Only: Strictly limited to US jurisdicti... |
| **The Office Action Research Dataset for Patents** | Kaggle / USPTO | USPTO Office of the Chief Economist | U.S. Government Work (Public Domain) | 12.8 GB | 4,400,000 office actions | NO | NO | US only... | **REJECTED** | Legal Procedural Records: Contains rejection codes and rejection notic... |
| **DAPFAM (Domain-Aware Patent Retrieval at Family Level)** | Hugging Face | datalyes (Ayaou et al., 2025) | CC-BY-NC-SA-4.0 | 1,157 MB | 46,583 patent families | YES | YES | jurisdiction: list o... | **REJECTED FOR ISOLATED JURISDICTIONS** | Rule 3 & 10 Violation: Records are aggregated at the multi-national pa... |
| **BIGPATENT (NortheasternUniversity/big_patent)** | Hugging Face | Northeastern University & Tencent AI Lab | CC-BY-4.0 | 26 GB | 1,300,000 | NO | YES | US only... | **REJECTED** | Jurisdiction Mismatch: Contains US patents only; zero Indian, German, ... |
| **patents_claims_1.5m_traim_test** | Hugging Face | AI-Growth-Lab | Unspecified / Open | 3.37 GB | 1,500,000 | YES | NO | US only (inferred fr... | **REJECTED** | Jurisdiction Mismatch & Missing Descriptions: Covers US granted claims... |
| **AIPD_nlp_granted_claims** | Hugging Face | patent | Open | 562 MB | 1,006,764 | YES | NO | US only... | **REJECTED** | Instruction Fine-Tuning Corpus: Reformatted for LLM prompt training; l... |
| **ep-patent-all-claims** | Hugging Face | mhurhangee | CC-BY-4.0 | 860 MB | 1,450,000 claims | YES | NO | EP only... | **ACCEPTED FOR EUROPE ONLY / DISQUALIFIED FOR GERMANY** | Rule 4 & 13 Enforcement: All records carry EP jurisdiction. While Germ... |
| **wipo-semiconductors** | Hugging Face | NekoNeko512 | Unspecified | 2.5 GB | 18,450 | YES | YES | None (lacks country ... | **REJECTED** | Rule 3 Violation: Completely lacks publication identifiers, applicatio... |
| **COVID-19_WIPO** | Hugging Face | FrancophonIA | Open | 1.5 MB | 2,427 translation units | NO | NO | None... | **REJECTED** | Translation Memory: Contains isolated bilingual sentences from WIPO we... |
| **green_patents** | Hugging Face | cwinkler | Open | 0.59 MB | 9,145 | NO | NO | None... | **REJECTED** | Metadata-Only: Contains only titles and binary 0/1 labels; lacks claim... |
| **patent-classification** | Hugging Face | ccdv | Open | 270 MB | 35,000 | NO | YES | None... | **REJECTED** | Classification Only: Lacks publication numbers, jurisdiction fields, a... |
| **paecter_dataset** | Hugging Face | Max Planck Institute for Innovation and Competition | CC0: Public Domain | 15 MB | 300,000 citation triplets | NO | NO | Worldwide (US, EP, W... | **REJECTED** | Citation Graph Only: Contains citation triplets (anchor, positive, neg... |
| **HUPD (Harvard USPTO Patent Dataset)** | Hugging Face | Harvard University | Creative Commons Attribution-NonCommercial 4.0 | 65 GB | 4,500,000 utility applications | YES | YES | US only... | **ACCEPTED FOR USA (CURRENT PRODUCTION BASELINE)** | Already used for US production corpus (1,159 authentic documents, 29,0... |

---

## 2. Detailed Dataset-by-Dataset Audit Records

### Indian Patent Dataset (Kaggle)
- **Dataset URL**: [https://www.kaggle.com/datasets/arshpreetsingh/indian-patent-dataset](https://www.kaggle.com/datasets/arshpreetsingh/indian-patent-dataset)
- **Publisher**: Arshpreet Singh
- **License**: `CC0: Public Domain`
- **Download Size**: 28.4 MB | **File Format**: CSV | **Record Count**: 54,231
- **Languages**: en
- **Jurisdiction Metadata**: `Country code (IN), Application Number, Filing Office`
- **Publication Number Field**: `Application Number (e.g., 2010/DEL/..., 2011/MUM/...)`
- **Content Availability**: Title: YES | Abstract: NO | Claims: NO | Description: NO
- **Known Origin**: CGPDTM InPASS early filing notices (Scraped from InPASS bibliographic index)
- **Quality Status**: **REJECTED**
- **Evaluation Analysis**: Rule 6 Violation: Metadata-only dataset containing application numbers, filing dates, and titles; lacks patent claims, abstracts, and detailed descriptions.

### Google Patents Public Data (Kaggle / BigQuery)
- **Dataset URL**: [https://www.kaggle.com/datasets/google/patents-public-data](https://www.kaggle.com/datasets/google/patents-public-data)
- **Publisher**: Google
- **License**: `Open Data Commons Open Database License (ODbL)`
- **Download Size**: > 1 TB (Queryable via SQL) | **File Format**: BigQuery Tables / Parquet | **Record Count**: > 120,000,000
- **Languages**: en, de, fr, es, zh, ja
- **Jurisdiction Metadata**: `country_code ('IN', 'DE', 'WO', 'US', 'EP')`
- **Publication Number Field**: `publication_number`
- **Content Availability**: Title: YES | Abstract: YES | Claims: NO | Description: NO
- **Known Origin**: Google Patents ingestion pipeline (Worldwide patent authorities via DOCDB and USPTO)
- **Quality Status**: **REJECTED FOR IN/DE/WO FULL TEXT**
- **Evaluation Analysis**: Rule 6 & Technical Limitation: Full-text claims and detailed descriptions are populated exclusively for US patents. For IN, DE, and WO, claims and description fields return NULL or empty strings.

### USPTO OCE Patent Claims Research Data (Kaggle / USPTO)
- **Dataset URL**: [https://www.kaggle.com/datasets/uspto/uspto-oce-patent-claims-research-data](https://www.kaggle.com/datasets/uspto/uspto-oce-patent-claims-research-data)
- **Publisher**: USPTO Office of the Chief Economist
- **License**: `U.S. Government Work (Public Domain)`
- **Download Size**: 4.2 GB | **File Format**: CSV / TSV | **Record Count**: 15,800,000 claims
- **Languages**: en
- **Jurisdiction Metadata**: `US only`
- **Publication Number Field**: `pat_no / app_no`
- **Content Availability**: Title: NO | Abstract: NO | Claims: YES | Description: NO
- **Known Origin**: USPTO (USPTO Patent Examination Data System (PEDS))
- **Quality Status**: **REJECTED**
- **Evaluation Analysis**: Jurisdiction Mismatch & Claims-Only: Strictly limited to US jurisdiction; does not contain Indian (IN), German (DE), or WIPO (WO) records.

### The Office Action Research Dataset for Patents (Kaggle / USPTO)
- **Dataset URL**: [https://www.kaggle.com/datasets/uspto/the-office-action-research-dataset-for-patents](https://www.kaggle.com/datasets/uspto/the-office-action-research-dataset-for-patents)
- **Publisher**: USPTO Office of the Chief Economist
- **License**: `U.S. Government Work (Public Domain)`
- **Download Size**: 12.8 GB | **File Format**: CSV | **Record Count**: 4,400,000 office actions
- **Languages**: en
- **Jurisdiction Metadata**: `US only`
- **Publication Number Field**: `app_id`
- **Content Availability**: Title: NO | Abstract: NO | Claims: NO | Description: NO
- **Known Origin**: USPTO examination records (USPTO internal examination files)
- **Quality Status**: **REJECTED**
- **Evaluation Analysis**: Legal Procedural Records: Contains rejection codes and rejection notices for US applications; lacks patent specifications and claims.

### DAPFAM (Domain-Aware Patent Retrieval at Family Level) (Hugging Face)
- **Dataset URL**: [https://huggingface.co/datasets/datalyes/DAPFAM_patent](https://huggingface.co/datasets/datalyes/DAPFAM_patent)
- **Publisher**: datalyes (Ayaou et al., 2025)
- **License**: `CC-BY-NC-SA-4.0`
- **Download Size**: 1,157 MB | **File Format**: Parquet (corpus, queries, relations) | **Record Count**: 46,583 patent families
- **Languages**: en (translated/synthesized)
- **Jurisdiction Metadata**: `jurisdiction: list of countries (e.g. ['WO', 'EP', 'DE', 'US'])`
- **Publication Number Field**: `query_id (Lens family hash: e.g. '188-077-204-769-086')`
- **Content Availability**: Title: YES | Abstract: YES | Claims: YES | Description: YES
- **Known Origin**: Lens.org aggregated patent families (Lens.org multi-jurisdictional patent family aggregator)
- **Quality Status**: **REJECTED FOR ISOLATED JURISDICTIONS**
- **Evaluation Analysis**: Rule 3 & 10 Violation: Records are aggregated at the multi-national patent family level without individual statutory publication numbers (uses Lens family hashes). All text is translated into English, violating Section 7 (German language preservation for DE).

### BIGPATENT (NortheasternUniversity/big_patent) (Hugging Face)
- **Dataset URL**: [https://huggingface.co/datasets/NortheasternUniversity/big_patent](https://huggingface.co/datasets/NortheasternUniversity/big_patent)
- **Publisher**: Northeastern University & Tencent AI Lab
- **License**: `CC-BY-4.0`
- **Download Size**: 26 GB | **File Format**: JSON Lines / Parquet | **Record Count**: 1,300,000
- **Languages**: en
- **Jurisdiction Metadata**: `US only`
- **Publication Number Field**: `patent_id (US publication numbers)`
- **Content Availability**: Title: NO | Abstract: YES | Claims: NO | Description: YES
- **Known Origin**: USPTO utility patents (USPTO Google Patents bulk grant files)
- **Quality Status**: **REJECTED**
- **Evaluation Analysis**: Jurisdiction Mismatch: Contains US patents only; zero Indian, German, or WIPO coverage.

### patents_claims_1.5m_traim_test (Hugging Face)
- **Dataset URL**: [https://huggingface.co/datasets/AI-Growth-Lab/patents_claims_1.5m_traim_test](https://huggingface.co/datasets/AI-Growth-Lab/patents_claims_1.5m_traim_test)
- **Publisher**: AI-Growth-Lab
- **License**: `Unspecified / Open`
- **Download Size**: 3.37 GB | **File Format**: CSV (df_claim_train / df_claim_test) | **Record Count**: 1,500,000
- **Languages**: en
- **Jurisdiction Metadata**: `US only (inferred from 7-digit USPTO IDs)`
- **Publication Number Field**: `id (e.g. 9289350 -> US 9,289,350)`
- **Content Availability**: Title: NO | Abstract: NO | Claims: YES | Description: NO
- **Known Origin**: USPTO (USPTO patent claim files)
- **Quality Status**: **REJECTED**
- **Evaluation Analysis**: Jurisdiction Mismatch & Missing Descriptions: Covers US granted claims only with IPC classification dummy variables; no descriptions or international jurisdictions.

### AIPD_nlp_granted_claims (Hugging Face)
- **Dataset URL**: [https://huggingface.co/datasets/patent/AIPD_nlp_granted_claims](https://huggingface.co/datasets/patent/AIPD_nlp_granted_claims)
- **Publisher**: patent
- **License**: `Open`
- **Download Size**: 562 MB | **File Format**: Parquet | **Record Count**: 1,006,764
- **Languages**: en
- **Jurisdiction Metadata**: `US only`
- **Publication Number Field**: `patent_num (USPTO integers)`
- **Content Availability**: Title: NO | Abstract: NO | Claims: YES | Description: NO
- **Known Origin**: USPTO claim drafting pairs (USPTO claim instruction pairs)
- **Quality Status**: **REJECTED**
- **Evaluation Analysis**: Instruction Fine-Tuning Corpus: Reformatted for LLM prompt training; lacks patent descriptions, abstracts, and international patent coverage.

### ep-patent-all-claims (Hugging Face)
- **Dataset URL**: [https://huggingface.co/datasets/mhurhangee/ep-patent-all-claims](https://huggingface.co/datasets/mhurhangee/ep-patent-all-claims)
- **Publisher**: mhurhangee
- **License**: `CC-BY-4.0`
- **Download Size**: 860 MB | **File Format**: Parquet | **Record Count**: 1,450,000 claims
- **Languages**: en, de, fr
- **Jurisdiction Metadata**: `EP only`
- **Publication Number Field**: `publication_number (EP ...)`
- **Content Availability**: Title: YES | Abstract: NO | Claims: YES | Description: NO
- **Known Origin**: EPO (European Patent Office granted specifications)
- **Quality Status**: **ACCEPTED FOR EUROPE ONLY / DISQUALIFIED FOR GERMANY**
- **Evaluation Analysis**: Rule 4 & 13 Enforcement: All records carry EP jurisdiction. While German claims exist, classifying EP as DE is strictly prohibited by Hard Jurisdiction Validator.

### wipo-semiconductors (Hugging Face)
- **Dataset URL**: [https://huggingface.co/datasets/NekoNeko512/wipo-semiconductors](https://huggingface.co/datasets/NekoNeko512/wipo-semiconductors)
- **Publisher**: NekoNeko512
- **License**: `Unspecified`
- **Download Size**: 2.5 GB | **File Format**: Arrow (6 shards) | **Record Count**: 18,450
- **Languages**: en
- **Jurisdiction Metadata**: `None (lacks country code / jurisdiction)`
- **Publication Number Field**: `None (features: abstract, claims, description only)`
- **Content Availability**: Title: NO | Abstract: YES | Claims: YES | Description: YES
- **Known Origin**: Unknown / Missing provenance (Unverified semiconductor scraping)
- **Quality Status**: **REJECTED**
- **Evaluation Analysis**: Rule 3 Violation: Completely lacks publication identifiers, application numbers, dates, titles, and verifiable jurisdiction fields. Cannot be authenticated against official WIPO gazettes.

### COVID-19_WIPO (Hugging Face)
- **Dataset URL**: [https://huggingface.co/datasets/FrancophonIA/COVID-19_WIPO](https://huggingface.co/datasets/FrancophonIA/COVID-19_WIPO)
- **Publisher**: FrancophonIA
- **License**: `Open`
- **Download Size**: 1.5 MB | **File Format**: TMX (Translation Memory eXchange) | **Record Count**: 2,427 translation units
- **Languages**: en, de, fr, es, ar, ru, zh, pt
- **Jurisdiction Metadata**: `None`
- **Publication Number Field**: `None`
- **Content Availability**: Title: NO | Abstract: NO | Claims: NO | Description: NO
- **Known Origin**: European Language Grid (WIPO COVID-19 terminology search portal)
- **Quality Status**: **REJECTED**
- **Evaluation Analysis**: Translation Memory: Contains isolated bilingual sentences from WIPO website; not a patent specification corpus.

### green_patents (Hugging Face)
- **Dataset URL**: [https://huggingface.co/datasets/cwinkler/green_patents](https://huggingface.co/datasets/cwinkler/green_patents)
- **Publisher**: cwinkler
- **License**: `Open`
- **Download Size**: 0.59 MB | **File Format**: CSV | **Record Count**: 9,145
- **Languages**: en
- **Jurisdiction Metadata**: `None`
- **Publication Number Field**: `None`
- **Content Availability**: Title: YES | Abstract: NO | Claims: NO | Description: NO
- **Known Origin**: HUPD / Google Patents (Derived from HUPD and Google Patents CPC Y02 query)
- **Quality Status**: **REJECTED**
- **Evaluation Analysis**: Metadata-Only: Contains only titles and binary 0/1 labels; lacks claims and descriptions.

### patent-classification (Hugging Face)
- **Dataset URL**: [https://huggingface.co/datasets/ccdv/patent-classification](https://huggingface.co/datasets/ccdv/patent-classification)
- **Publisher**: ccdv
- **License**: `Open`
- **Download Size**: 270 MB | **File Format**: Parquet | **Record Count**: 35,000
- **Languages**: en
- **Jurisdiction Metadata**: `None`
- **Publication Number Field**: `None`
- **Content Availability**: Title: NO | Abstract: YES | Claims: NO | Description: YES
- **Known Origin**: USPTO (USPTO text chunks with 9 CPC class labels)
- **Quality Status**: **REJECTED**
- **Evaluation Analysis**: Classification Only: Lacks publication numbers, jurisdiction fields, and claims.

### paecter_dataset (Hugging Face)
- **Dataset URL**: [https://huggingface.co/datasets/mpi-inno-comp/paecter_dataset](https://huggingface.co/datasets/mpi-inno-comp/paecter_dataset)
- **Publisher**: Max Planck Institute for Innovation and Competition
- **License**: `CC0: Public Domain`
- **Download Size**: 15 MB | **File Format**: JSON / CSV | **Record Count**: 300,000 citation triplets
- **Languages**: en
- **Jurisdiction Metadata**: `Worldwide (US, EP, WO)`
- **Publication Number Field**: `publication_number`
- **Content Availability**: Title: NO | Abstract: NO | Claims: NO | Description: NO
- **Known Origin**: Max Planck Institute (EPO DOCDB citation graph)
- **Quality Status**: **REJECTED**
- **Evaluation Analysis**: Citation Graph Only: Contains citation triplets (anchor, positive, negative) without patent text, claims, or descriptions.

### HUPD (Harvard USPTO Patent Dataset) (Hugging Face)
- **Dataset URL**: [https://huggingface.co/datasets/HUPD/hupd](https://huggingface.co/datasets/HUPD/hupd)
- **Publisher**: Harvard University
- **License**: `Creative Commons Attribution-NonCommercial 4.0`
- **Download Size**: 65 GB | **File Format**: JSON / Arrow | **Record Count**: 4,500,000 utility applications
- **Languages**: en
- **Jurisdiction Metadata**: `US only`
- **Publication Number Field**: `patent_number / application_number`
- **Content Availability**: Title: YES | Abstract: YES | Claims: YES | Description: YES
- **Known Origin**: USPTO / Harvard (USPTO bulk application archives (2004-2018))
- **Quality Status**: **ACCEPTED FOR USA (CURRENT PRODUCTION BASELINE)**
- **Evaluation Analysis**: Already used for US production corpus (1,159 authentic documents, 29,003 chunks). Cannot provide India, Germany, or WIPO records.
