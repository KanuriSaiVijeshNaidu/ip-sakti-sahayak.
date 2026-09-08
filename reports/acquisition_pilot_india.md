# Pilot Acquisition Report: India (IN)

**Project**: IP-SAKTI Sahayak — Production Patent & Traditional Knowledge RAG  
**Date**: 2026-09-08  
**Phase**: PHASE 2C — REOPEN DATA ACQUISITION USING VERIFIED OFFICIAL ACCESS PATHS  
**Target Authority**: Office of the Controller General of Patents, Designs and Trade Marks (CGPDTM / IPO)  
**Target Jurisdiction**: INDIA (`IN`)  
**Pilot Target**: 100 Authentic Indian Patent Documents

---

## 1. Candidate Source Evaluation

| Candidate Source | Mechanism | Authentication Requirement | Legitimate Zero-Auth Path? | Findings & Outcome |
| :--- | :--- | :--- | :---: | :--- |
| **IP India Public Search (InPASS)** | Web Search Portal | CAPTCHA, dynamic cookies, IP firewall | **NO** | Contains authentic Form 2 specifications, but enforces strict CAPTCHAs and session tokens. Automated mass harvesting violates Terms of Use and is barred by Rule 16. |
| **The Patent Office Journal** | Official PDF Gazette (`search.ipindia.gov.in`) | Free downloadable weekly PDF | **NO (Rule 6 Disqualification)** | While freely published every Friday, the Journal contains only bibliographic publication notices under Section 11A and grant notices. It does **NOT** publish the full specification body or claims. |
| **CSIR-TKDL** | Proprietary Database | Statutory Government Clearance | **NO** | Governed by confidential international access agreements; public access barred. |
| **Kaggle Indian Patent Datasets** | Downloadable CSV | Open | **NO (Rule 6 Disqualification)** | Contains metadata records (application number, filing date, title, applicant), but lacks claims and specifications. |
| **Google Patents BigQuery** | Cloud SQL | GCP Account | **NO** | `patents-public-data.patents.publications` table returns NULL for `claims` on Indian patent records (`IN`). |
| **Lens.org** | API & Bulk Data | Academic Application / Approval | **REQUIRES REGISTRATION** | Provides structured data, but requires individual institutional application, project review, and token issuance. |

---

## 2. Authenticity Audit Metrics (Rule 7)

```json
{
  "jurisdiction": "INDIA",
  "pilot_target": 100,
  "documents_downloaded": 0,
  "documents_valid": 0,
  "documents_rejected": 0,
  "documents_with_claims": 0,
  "documents_with_descriptions": 0,
  "documents_with_abstracts": 0,
  "wrong_jurisdiction": 0,
  "duplicates": 0,
  "docling_success": 0,
  "docling_failure": 0,
  "ocr_quality": null,
  "metadata_completeness": 0.0,
  "pilot_status": "GATE FAILED",
  "root_cause": "InPASS enforces CAPTCHAs and anti-bot blocks; Patent Office Journal contains notices only (no claims); BigQuery returns NULL claims for IN; TKDL is confidential."
}
```

---

## 3. Data Licensing Information (Rule 8)

- **Source**: Controller General of Patents, Designs and Trade Marks (CGPDTM / IPO)
- **Organization**: Department for Promotion of Industry and Internal Trade (DPIIT), Ministry of Commerce and Industry, Government of India
- **Portal URL**: `https://ipindiaservices.gov.in/publicsearch/`
- **Gazette URL**: `https://search.ipindia.gov.in/IPOJournal/Journal/Patent`
- **License Status**: **REQUIRES REVIEW / GOVERNMENT OF INDIA STATUTORY REPOSITORY**
- **Commercial / Research Restrictions**: Manual search permitted for public information; automated mass scraping prohibited without official data dissemination agreement.
- **Redistribution Restrictions**: Government official records; commercial resale prohibited without permission.
- **Retrieval Date**: 2026-09-08

---

## 4. Conclusion & Next Steps

Large-scale acquisition remains halted per Stop Condition Rule 16. India remains **INSUFFICIENT (0 trustworthy production documents)** until an official DPIIT data feed, approved Lens.org token, or authorized university research corpus is made available.
