# Pilot Acquisition Report: WIPO / PCT (WO)

**Project**: IP-SAKTI Sahayak — Production Patent & Traditional Knowledge RAG  
**Date**: 2026-09-08  
**Phase**: PHASE 2C — REOPEN DATA ACQUISITION USING VERIFIED OFFICIAL ACCESS PATHS  
**Target Authority**: World Intellectual Property Organization (WIPO / PCT International Bureau)  
**Target Jurisdiction**: WIPO / PCT (`WO`)  
**Pilot Target**: 100 Authentic PCT Patent Documents

---

## 1. Candidate Source Evaluation

| Candidate Source | Mechanism | Authentication Requirement | Legitimate Zero-Auth Path? | Findings & Outcome |
| :--- | :--- | :--- | :---: | :--- |
| **WIPO PATENTSCOPE Web Portal** | HTTP Web Portal | IP rate limits, bot filtering, CAPTCHAs | **NO** | WIPO Terms of Use explicitly forbid bulk downloading, copying, and automated querying. Activity $> 10$ actions/min triggers immediate IP bans. Scraping prohibited by Rule 16. |
| **WIPO PCT Webservice** | SOAP XML API | Commercial subscription (2,000 CHF/year) | **NO** | Official programmatic route requires an annual commercial contract. Instant open access is not available. |
| **WIPO PCT Backfiles** | Hard drive shipment | Paid product license | **NO** | Requires physical media purchase and data agreement. |
| **EPO Open Patent Services (OPS)** | OAuth2 REST API | Free developer account (`developers.epo.org`) | **REQUIRES REGISTRATION** | Official EPO OPS coverage includes `WO` character-coded full text (claims & descriptions). However, programmatic queries require an OAuth2 Consumer Key/Secret. Unauthenticated calls return 401 Unauthorized. |
| **Max Planck PaECTER** | Hugging Face | Unauthenticated | **NO (Disqualified)** | Disqualified under Rule 6: contains citation graphs and publication numbers, but zero full claims or patent descriptions. |
| **Google Patents BigQuery** | Cloud SQL | GCP Account | **NO** | BigQuery `patents-public-data.patents.publications` table contains NULL/empty claims for non-US (`WO`) patents. |

---

## 2. Authenticity Audit Metrics (Rule 7)

```json
{
  "jurisdiction": "WIPO",
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
  "root_cause": "PATENTSCOPE prohibits automated querying (>10 req/min ban); official PCT Webservice requires 2,000 CHF/yr; EPO OPS requires OAuth2 developer credentials."
}
```

---

## 3. Data Licensing & Authoritative Provenance (Rule 8)

- **Source**: World Intellectual Property Organization (WIPO)
- **Organization**: WIPO International Bureau (Geneva, Switzerland)
- **Portal URL**: `https://patentscope.wipo.int/`
- **Terms URL**: `https://www.wipo.int/tools/en/disclaim.html`
- **License Status**: **REQUIRES REVIEW / PROPRIETARY TERMS OF USE**
- **Commercial / Research Restrictions**: Manual research search permitted via browser; automated programmatic harvesting strictly prohibited without PCT Webservice license.
- **Authoritative Provenance Note**: WIPO OCR text (XML/HTML) is expressly disclaimed as non-authoritative. Official legal provenance requires retaining the scanned Gazette PDF.
- **Redistribution Restrictions**: Re-dissemination of bulk PATENTSCOPE data is restricted.
- **Retrieval Date**: 2026-09-08

---

## 4. Conclusion & Next Steps

Large-scale acquisition remains halted per Stop Condition Rule 16. WIPO remains **INSUFFICIENT (0 trustworthy production documents)** until an official EPO developer key or WIPO Webservice license is provisioned.
