# Acquisition Pilot Report: Pilot Validation for India, Germany & WIPO/PCT

**Date**: 2026-09-08  
**Audit Target**: Pilot acquisition and validation of 100 authentic records per jurisdiction:
- India (`IN`): Target 100 authentic patent specifications
- Germany (`DE`): Target 100 authentic DPMA patent specifications
- WIPO / PCT (`WO`): Target 100 authentic PCT international publications  
**Policy Enforced**: Strict adherence to Section 8, Section 13 (Hard Jurisdiction Validator), Section 14 (Real Metrics Only), and Section 16 (Stop Conditions). **ZERO FABRICATED DATA ALLOWED.**

---

## 1. Pilot Evaluation Criteria & Gate Matrix

To qualify for large-scale acquisition, every candidate source in the pilot must pass all 8 statutory criteria:

| Evaluation Criterion | Minimum Threshold | Validation Method |
| :--- | :--- | :--- |
| **1. Publication Identifiers** | 100% verified against official registries | Cross-reference with InPASS, DPMAregister, PATENTSCOPE, Google Patents |
| **2. Jurisdiction Accuracy** | 100% matching country code (`IN`, `DE`, `WO`) | Hard metadata validation; no inference from language or source website |
| **3. Text Availability** | Substantial technical/legal text | Title, Abstract, and Description required (Rule 6: no metadata-only lists) |
| **4. Claims Availability** | ≥ 90% of documents with full claims | Verifiable numbered claims (*Patentansprüche*, Form 2 claims, PCT claims) |
| **5. Original Language** | Original filing language preserved | `de` for Germany; `en`/`hi` for India; `en` for WIPO |
| **6. Legal Access** | Zero credential violation / no anti-bot bypass | Open access, public domain, or open research license |
| **7. Docling Parseability** | Docling 1.10.0 schema compliance | Successful extraction of titles, sections, claims, paragraphs |
| **8. Deduplication** | 0 duplicates across Level 1–4 | Strict hash and identifier uniqueness |

---

## 2. Pilot Acquisition Testing & Gate Results

### A. INDIA (`IN`) Pilot Attempt
- **Candidate Source 1**: Indian Patent Office (InPASS / CGPDTM) Direct Extraction
  - *Identifier Check*: Official publication format (`IN ... B`, `.../DEL/...`).
  - *Accessibility Result*: **FAILED**. The official portal `ipindiaservices.gov.in` enforces session-based CAPTCHAs, dynamic cookies, and cloud firewall IP throttling. Automated programmatic retrieval of 100 complete Form 2 specifications is technically blocked.
  - *Legal Barrier*: Terms of use prohibit automated data harvesting. Under Section 16, scraping protected endpoints is strictly forbidden.
- **Candidate Source 2**: Kaggle Indian Patent Dataset (2010, 2011, 2019 filings)
  - *Identifier Check*: Contains authentic application and publication numbers.
  - *Text Availability Result*: **FAILED RULE 6**. Contains bibliographic metadata (Title, Application Date, Status, IPC, Applicant), but **lacks claims and detailed specifications**. Rule 6 explicitly mandates: *"Do not count metadata-only datasets; patent-number lists without document text."*
- **Candidate Source 3**: CSIR-TKDL Database
  - *Accessibility Result*: **FAILED**. Public access is barred under international treaties.
- **Candidate Source 4**: Indian Legal Records (Court judgments)
  - *Eligibility Result*: **DISQUALIFIED BY RULE 3**: *"Do NOT use Indian court judgments as a replacement for patent specifications."*
- **India Pilot Result**: **GATE FAILED (0 / 100 ACQUIRED)**. Legitimate public zero-auth full-text dump is unavailable.

---

### B. GERMANY (`DE`) Pilot Attempt
- **Candidate Source 1**: DPMA Official *DPMAdatenabgabe*
  - *Identifier Check*: Official German publication numbers (`DE ... A1`, `DE ... B4`).
  - *Accessibility Result*: **FAILED**. Access requires a formal commercial data dispatch contract (*DPMAdatenabgabe-Vereinbarung*) with DPMA and media dispatch fees. No anonymous bulk REST API exists.
- **Candidate Source 2**: DEPATISnet Public Search
  - *Accessibility Result*: **FAILED**. Enforces interactive search sessions with CAPTCHAs and strict request rate-limiting.
- **Candidate Source 3**: European Patent Office / Hugging Face Claims Collections (`mhurhangee/ep-patent-all-claims`)
  - *Jurisdiction Check*: **DISQUALIFIED BY RULE 4 & RULE 13**. While thousands of claims are written in German, their publication metadata indicates European Patent Office (`EP`) jurisdiction. The mandate strictly prohibits classifying German-language EP patents as German national patents: *"CRITICAL: Do not confuse German-language document with German-jurisdiction patent. A document written in German but having EP/WO/US jurisdiction must NOT automatically be classified as GERMANY."*
- **Germany Pilot Result**: **GATE FAILED (0 / 100 ACQUIRED)**. Legitimate public zero-auth `DE` full-text dump is unavailable.

---

### C. WIPO / PCT (`WO`) Pilot Attempt
- **Candidate Source 1**: WIPO PATENTSCOPE Bulk XML Services
  - *Identifier Check*: Official PCT international publication numbers (`WO yyyy/nnnnnn A1`).
  - *Accessibility Result*: **FAILED**. Bulk data dispatch requires a paid subscription contract with WIPO International Bureau.
- **Candidate Source 2**: WIPO PATENTSCOPE Web Portal
  - *Accessibility Result*: **FAILED**. Automated extraction of 100 full specifications is blocked by bot detection and rate limits.
- **Candidate Source 3**: Max Planck Institute `paecter_dataset`
  - *Text Availability Result*: **DISQUALIFIED BY RULE 6**. Contains 300,000 publication numbers and citation triplets, but **zero document full-text claims**.
- **WIPO Pilot Result**: **GATE FAILED (0 / 100 ACQUIRED)**. Legitimate public zero-auth `WO` full-text dump is unavailable.

---

## 3. Summary Pilot Gate Matrix

| Jurisdiction | Candidate Sources Evaluated | Authentic Full-Text Acquired | Claims Present | Valid Identifiers | Pilot Status | Root Failure Cause |
| :--- | :--- | :---: | :---: | :---: | :---: | :--- |
| **INDIA** | InPASS, TKDL, Kaggle, Legal Records | 0 / 100 | 0 | 0 | **FAIL** | InPASS anti-bot blocks; Kaggle metadata-only (no claims) |
| **GERMANY** | DPMA DPMAdatenabgabe, DEPATISnet, EPO German | 0 / 100 | 0 | 0 | **FAIL** | DPMA requires contract; EP German text barred by Rule 13 |
| **WIPO** | PATENTSCOPE Bulk, PaECTER, Web Search | 0 / 100 | 0 | 0 | **FAIL** | WIPO requires subscription; PaECTER is citation-only |

---

## 4. Decision & Next Steps (Rule 8 & 16 Compliance)

1. **Gate Decision**: Because the pilot acquisition failed the availability gates across all three jurisdictions, **large-scale acquisition is STOPPED**.
2. **Strict Adherence to Rule 16**:
   - We will **NOT** scrape protected endpoints against terms of service.
   - We will **NOT** bypass CAPTCHA controls or use leaked credentials.
   - We will **NOT** fabricate synthetic patent records or invent publication numbers.
   - We will **NOT** weaken sufficiency thresholds to force a "PASS".
3. **Threshold & Sufficiency Ruling**:
   - Sufficiency target remains strictly at **≥ 2,000 documents** and **≥ 4,000 chunks**.
   - India, Germany, and WIPO are formally marked **INSUFFICIENT**.
