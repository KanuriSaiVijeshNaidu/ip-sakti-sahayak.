# Phase 2H Source Inventory: Comprehensive Jurisdiction Data Matrix

**Project:** IP-SAKTI Sahayak / AYURLEX (SIH 26045)  
**Phase:** Phase 2H — Targeted Jurisdiction Recovery  
**Date:** September 8, 2026  

---

## Comprehensive Evaluated Source Matrix

| Source / Repository | Jurisdiction Focus | Data Format | Access Type | Status | Authentic Full Text | Failure / Boundary Reason |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **Bosch PLS Benchmark (`atazanavir.csv`)** | WIPO / WO | CSV (Structured) | Public GitHub LFS | **ACQUIRED** | **339 Docs Isolated** | Partial volume (339 / 2,000); 252 family-mixed rows quarantined. |
| **Bosch PLS Benchmark (`ritonavir.csv`)** | WIPO / WO | CSV (Structured) | Public GitHub LFS | **EVALUATED** | Candidate WO Docs | Multi-jurisdiction family rows require individual isolation. |
| **Google Patents BigQuery Parquet Shards** | Multi (DE, WO, IN) | Parquet | Public HuggingFace | **REJECTED** | **0% Claims / Desc** | Full-text claims and descriptions are NULL for all non-US patents. |
| **BNNT / PatentMatch (`PatentMatch_en.json`)** | Multi | JSONL | Public HuggingFace | **REJECTED** | 0% Specifications | Reformatted QA/instruction pairs; no complete patent disclosures. |
| **matthias-ehrlich / PatentDesc-355k** | USA (misleading name) | JSON | Public HuggingFace | **REJECTED** | 0% German Patents | IIT Jodhpur dataset of USPTO figure descriptions; 0 German patents. |
| **mhurhangee / patent-ind-claim-en** | Europe (EP) | Parquet | Public HuggingFace | **REJECTED** | 0% Indian Patents | 'ind' refers to EP independent claims; 0 Indian patents. |
| **Zenodo Open Research API** | Multi (IN, DE, WO) | JSON / REST | Automated API | **BLOCKED** | N/A | HTTP 403 Forbidden without personal authenticated developer token. |
| **CGPDTM / InPASS** | India (IN) | ASP.NET Forms | Public Portal | **BLOCKED** | Locked behind CAPTCHA | Mandatory OCR image CAPTCHA; terms prohibit automated bulk harvesting. |
| **CSIR India Patent Database (Patestate)** | India (IN) | Web Portal | Public Search | **INSUFFICIENT** | Search & View Only | Interactive individual search portal; no bulk download endpoints. |
| **DPMAconnectPlus** | Germany (DE) | XML / API | Bilateral Contract | **BLOCKED** | Requires Contract | Requires 2 mailed paper contracts to Munich + 200 EUR fee. |
| **DEPATISnet** | Germany (DE) | Web Portal | Public Search | **BLOCKED** | Rate Limited / Protected | Interactive individual search portal with anti-scraping controls. |
| **WIPO PATENTSCOPE Bulk / PCT Web Service** | WIPO (WO) | XML / Web Service | Paid Subscription | **BLOCKED** | 2,000 CHF/Year Fee | Free endpoint bans IP >10 req/min; commercial service is paid. |
| **USPTO Bulk Patent Data** | USA (US) | XML / JSON | Open Public | **ACCEPTED BASELINE** | 1,159 Documents | Accepted verified production baseline (29,003 chunks). |
| **EPO Open Data / Espacenet** | Europe (EP) | XML / JSON | Open Public | **ACCEPTED BASELINE** | 646 Documents | Accepted verified production baseline (1,912 chunks). |
