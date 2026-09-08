# Phase 2H India Acquisition Report: Forensic Investigation & Status

**Project:** IP-SAKTI Sahayak / AYURLEX (SIH 26045)  
**Jurisdiction:** India (`IN`)  
**Target:** >= 2,000 Verified Documents / >= 4,000 Valid Chunks  
**Status:** **INSUFFICIENT (0 / 2,000 Verified Documents)**  

---

## 1. Targeted Routes Investigated

1. **Official CGPDTM / InPASS Portal (`iprsearch.ipindia.gov.in`):**
   - The statutory database of the Indian Patent Office was inspected.
   - Access to full patent specifications requires submitting ASP.NET session tokens and solving dynamic image-based CAPTCHAs.
   - CGPDTM terms legally forbid automated scripts and bulk crawlers. Bypassing CAPTCHA or scraping is strictly forbidden under Rule 21 and Rule 22.
2. **CSIR Patestate & Institutional Repositories:**
   - CSIR-TechIndia (`techindiacsir.anusandhan.net`) provides bibliographic summaries and abstracts for CSIR inventions, but full claims and descriptions must be retrieved individually from InPASS.
   - Traditional Knowledge Digital Library (TKDL) is a specialized prior-art defense database, not a public patent specification distribution dump.
3. **Public Academic & Cloud Datasets:**
   - Kaggle `arshpreetsingh/indian-patent-dataset`: Confirmed metadata-only (0 claims, 0 descriptions).
   - Google Patents BigQuery public data (`patents-public-data`): Contains 0 full-text claims or descriptions for Indian patents (`NULL`).
   - Hugging Face `mhurhangee/patent-ind-claim-en`: Confirmed to contain European (`EP`) independent claims, not Indian patents.

## 2. Forensic Findings & Legal Realities
- No open, unencumbered, public bulk dump of full Indian patent specifications (complete claims + description) exists without commercial contracts (e.g., Saturo Global, MCPaIRS) or institutional agreements with CGPDTM.
- In strict adherence to Rule 1 (Zero synthetic data), Rule 5 (Zero invented numbers), and Rule 7 (Zero metadata-only records), no synthetic or placeholder data was admitted.
