# Pilot Acquisition Report: Germany (DE)

**Project**: IP-SAKTI Sahayak — Production Patent & Traditional Knowledge RAG  
**Date**: 2026-09-08  
**Phase**: PHASE 2C — REOPEN DATA ACQUISITION USING VERIFIED OFFICIAL ACCESS PATHS  
**Target Authority**: Deutsches Patent- und Markenamt (DPMA)  
**Target Jurisdiction**: GERMANY (`DE`)  
**Pilot Target**: 100 Authentic German National Patent Documents

---

## 1. Candidate Source Evaluation

| Candidate Source | Mechanism | Authentication Requirement | Legitimate Zero-Auth Path? | Findings & Outcome |
| :--- | :--- | :--- | :---: | :--- |
| **DPMAconnectPlus** | REST API / HTTP Basic | Postal paper agreement (*Standardvertrag*) + 200 EUR connection fee | **NO** | Legitimate channel exists, but requires physical postal contract submission to DPMA Munich and administrative setup time. Immediate unauthenticated pilot download is not supported. |
| **DEPATISnet Public Search** | Web Portal | Session cookies, interactive CAPTCHAs | **NO** | Automated bulk extraction violates Terms of Service. Scraping prohibited by Rule 16. |
| **EPO Open Patent Services (OPS)** | OAuth2 REST API | Free developer registration | **NO** | Official EPO OPS coverage documentation explicitly excludes German national (`DE`) patents from character-coded full text (claims and descriptions). |
| **Hugging Face / mhurhangee** | Open Dataset | Unauthenticated | **NO (Disqualified)** | Claims written in German carry `EP` country code. Disqualified by Rule 4 & 13 (Jurisdiction Validator forbids reclassifying EP as DE). |
| **Google Patents BigQuery** | Cloud SQL | GCP Account | **NO** | BigQuery `patents-public-data.patents.publications` table contains NULL/empty claims for non-US (`DE`) patents. |

---

## 2. Authenticity Audit Metrics (Rule 7)

```json
{
  "jurisdiction": "GERMANY",
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
  "root_cause": "Official DPMA automated access is gated by postal contract agreement and 200 EUR fee; EPO OPS excludes DE full-text; scraping DEPATISnet is prohibited."
}
```

---

## 3. Data Licensing Information (Rule 8)

- **Source**: Deutsches Patent- und Markenamt (DPMA)
- **Organization**: DPMA Referat 2.1.2 — Kundenservice Datenabgabe
- **URL**: `https://www.dpma.de/service/datenabgabe/index.html`
- **License Status**: **REQUIRES REVIEW / CONTRACTUAL LICENSE**
- **Terms**: Regulated under *Standardvertrag DPMAconnectPlus*.
- **Commercial / Research Restrictions**: Student/research use permitted, but only following formal execution of agreement.
- **Download Restrictions**: IP-restricted credentials issued after contract approval.
- **Redistribution Restrictions**: Prohibited without express contractual grant.
- **Retrieval Date**: 2026-09-08

---

## 4. Conclusion & Next Steps

Large-scale acquisition remains halted per Stop Condition Rule 16. Germany remains **INSUFFICIENT (0 trustworthy production documents)** until official DPMA credentials can be established.
