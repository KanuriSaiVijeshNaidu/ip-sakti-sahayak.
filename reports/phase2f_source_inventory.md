# Phase 2F — Authoritative Source Inventory & Multi-Tier Hierarchy Report

**Project**: IP-SAKTI Sahayak / AYURLEX — SIH 26045  
**Date**: 2026-09-08  
**Phase**: PHASE 2F — MISSING JURISDICTION DATA EXPANSION (OPTION B)  
**Rules Enforced**: Rules 1–25. Hard jurisdiction boundaries, zero synthetic data, pre-embedding halt enforced.

---

## 1. Master Multi-Tier Source Ranking (Step 4)

In accordance with Step 4, all candidate sources investigated for India, Germany, and WIPO/PCT are ranked into four strict evidentiary tiers:
- **TIER 1**: Official Authoritative Primary Patent Office Registries
- **TIER 2**: Trusted Institutional / Research Mirrors with Traceable Lineage
- **TIER 3**: Public Repositories with Independently Verifiable Publication Records
- **TIER 4**: Unverified Community Scrapings / Metadata-Only Listings (Disqualified)

### Comprehensive Source Hierarchy Matrix

| Jurisdiction | Candidate Source | Tier | Official / Secondary | Access Interface | Claims | Description | Pub ID Valid | License / Terms | Gate Status |
| :--- | :--- | :---: | :--- | :--- | :---: | :---: | :---: | :--- | :--- |
| **INDIA** | InPASS (CGPDTM) | **TIER 1** | Official Primary | Interactive Web (ASP.NET / CAPTCHA) | YES | YES | YES | Statutory Registry | **BLOCKED**: Anti-bot firewall; no public REST API |
| **INDIA** | Patent Office Journal | **TIER 1** | Official Government | Downloadable PDF Gazette | NO | NO | YES | Official Gazette | **DISQUALIFIED (Rule 7)**: S.11A notices only, no claims |
| **INDIA** | CSIR-TKDL | **TIER 1** | Official Inter-Gov | Encrypted Treaty Database | YES | YES | YES | Confidential Treaty | **RESTRICTED**: Legally barred from open dissemination |
| **INDIA** | Google Patents BigQuery | **TIER 2** | Secondary Mirror | BigQuery SQL Tables | NO | NO | YES | ODbL License | **DISQUALIFIED (Rule 7)**: Claims return NULL for `IN` |
| **INDIA** | Kaggle Indian Patent | **TIER 4** | Community Mirror | CSV Download | NO | NO | YES | CC0: Public Domain | **DISQUALIFIED (Rule 7)**: Bibliographic metadata only |
| **GERMANY** | DPMAconnectPlus | **TIER 1** | Official Primary | HTTP Basic REST Service | YES | YES | YES | Standard Contract | **BLOCKED**: Requires 2 signed paper contracts + 200 EUR |
| **GERMANY** | DPMA DPMAdatenabgabe | **TIER 1** | Official Primary | Media Dispatch / SFTP | YES | YES | YES | Standard Contract | **BLOCKED**: Contractual backfile media shipment |
| **GERMANY** | DEPATISnet | **TIER 1** | Official Primary | Web Portal (Session / CAPTCHA) | YES | YES | YES | Terms of Use | **BLOCKED**: Interactive sessions only; scraping barred |
| **GERMANY** | EPO OPS (DE Query) | **TIER 1** | Official Regional | RESTful OAuth2 API | NO | NO | YES | Developer (4GB/wk) | **DISQUALIFIED**: EPO OPS excludes DE character full text |
| **GERMANY** | ep-patent-all-claims | **TIER 2** | Research / HF | Parquet Download | YES | NO | YES (`EP`) | CC-BY-4.0 | **EUROPE ONLY (Rule 13)**: German language EP != DE |
| **WIPO / PCT** | PATENTSCOPE Web | **TIER 1** | Official Primary | Web Search Interface | YES | YES | YES | Terms of Use | **BLOCKED**: Scraping forbidden; >10 req/min IP ban |
| **WIPO / PCT** | WIPO PCT Webservice | **TIER 1** | Official Primary | SOAP XML Web Service | YES | YES | YES | Commercial Contract | **BLOCKED**: 2,000 CHF/year enterprise subscription |
| **WIPO / PCT** | EPO OPS (WO Query) | **TIER 1** | Official Regional | RESTful OAuth2 API | YES | YES | YES | Developer (4GB/wk) | **REQUIRES CREDENTIALS**: OAuth2 Consumer Key needed |
| **WIPO / PCT** | DAPFAM Patent | **TIER 3** | Research / HF | Parquet Download | YES | YES | NO | CC-BY-NC-SA-4.0 | **DISQUALIFIED (Rule 8)**: Uses Lens family hashes |
| **WIPO / PCT** | wipo-semiconductors | **TIER 4** | Community Scraping | Arrow Download | YES | YES | NO | Unspecified | **DISQUALIFIED (Rule 1)**: Missing publication IDs |

---

## 2. Option B Baseline Corroboration

In accordance with Option B:
- **USA Corpus**: 1,159 authentic utility patents with 29,003 chunks (524.15 MB raw) sourced from USPTO Bulk Data and Harvard HUPD $\rightarrow$ **CONFIRMED VERIFIED BASELINE**.
- **Europe Corpus**: 646 authentic specifications with 1,912 chunks (18.97 MB raw) sourced from EPO Bulk and `mhurhangee/ep-patent-all-claims` $\rightarrow$ **CONFIRMED VERIFIED BASELINE**.
- Baseline corpora are protected and isolated; zero deletions or unnecessary reprocessing conducted.
