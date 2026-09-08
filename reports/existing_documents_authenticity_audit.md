# Existing Documents Authenticity Audit Report

**Date**: 2026-09-08  
**Auditor**: Independent Patent Registry & Gazette Cross-Reference Subsystem  
**Scope**: Verification of 15 baseline documents across India, Germany, and WIPO against official patent registries (InPASS, DPMAregister, PATENTSCOPE, Google Patents).

---

## 1. Executive Summary

An independent registry verification was performed for each of the 15 baseline patent documents previously included in the placeholder corpora for **India**, **Germany**, and **WIPO**. 

> [!CAUTION]
> **Audit Finding: ALL 15 PLACEHOLDER DOCUMENTS FAILED INDEPENDENT AUTHENTICITY VERIFICATION.**
> 
> Cross-referencing against Google Patents, WIPO PATENTSCOPE, DPMAregister, and Espacenet revealed that:
> 1. In WIPO, publication numbers mapped to completely unrelated technologies (e.g., `WO 2023/098712 A1` is an official Chinese patent on *Electric Vehicle Chassis Battery Swapping*; `WO 2021/098765 A1` is an official patent on *Video Key-Frame Selection*).
> 2. In India and Germany, the publication numbers and application numbers could not be independently linked to the claimed herbal compositions in official gazette databases.
> 3. Consequently, all 15 documents are classified as **UNVERIFIED / SYNTHETIC PLACEHOLDERS** and are strictly quarantined.

---

## 2. Document-by-Document Independent Authenticity Audit Table

| Jurisdiction | Publication | Source | URL | Retrieved | Identifier Verified | Content Verified | Claims Verified | Result |
| :--- | :--- | :--- | :--- | :--- | :---: | :---: | :---: | :--- |
| **INDIA** | `IN 268685 B` | IPO / InPASS | `https://ipindiaservices.gov.in/publicsearch/patent/268685` | 2026-09-08 | **NO** | **NO** | Text only (Mock) | **UNVERIFIED** |
| **INDIA** | `IN 243763 B` | IPO / InPASS | `https://ipindiaservices.gov.in/publicsearch/patent/243763` | 2026-09-08 | **NO** | **NO** | Text only (Mock) | **UNVERIFIED** |
| **INDIA** | `IN 284123 B` | IPO / InPASS | `https://ipindiaservices.gov.in/publicsearch/patent/284123` | 2026-09-08 | **NO** | **NO** | Text only (Mock) | **UNVERIFIED** |
| **INDIA** | `IN 324590 B` | IPO / InPASS | `https://ipindiaservices.gov.in/publicsearch/patent/324590` | 2026-09-08 | **NO** | **NO** | Text only (Mock) | **UNVERIFIED** |
| **INDIA** | `IN 348215 B` | IPO / InPASS | `https://ipindiaservices.gov.in/publicsearch/patent/348215` | 2026-09-08 | **NO** | **NO** | Text only (Mock) | **UNVERIFIED** |
| **GERMANY** | `DE 10 2014 002 621 A1` | DPMA / DEPATISnet | `https://depatisnet.dpma.de/DepatisNet/depatisnet?action=pdf&docid=DE102014002621A1` | 2026-09-08 | **NO** | **NO** | Text only (Mock) | **UNVERIFIED** |
| **GERMANY** | `DE 10 2012 015 247 A1` | DPMA / DEPATISnet | `https://depatisnet.dpma.de/DepatisNet/depatisnet?action=pdf&docid=DE102012015247A1` | 2026-09-08 | **NO** | **NO** | Text only (Mock) | **UNVERIFIED** |
| **GERMANY** | `DE 10 2016 008 912 A1` | DPMA / DEPATISnet | `https://depatisnet.dpma.de/DepatisNet/depatisnet?action=pdf&docid=DE102016008912A1` | 2026-09-08 | **NO** | **NO** | Text only (Mock) | **UNVERIFIED** |
| **GERMANY** | `DE 10 2017 105 432 A1` | DPMA / DEPATISnet | `https://depatisnet.dpma.de/DepatisNet/depatisnet?action=pdf&docid=DE102017105432A1` | 2026-09-08 | **NO** | **NO** | Text only (Mock) | **UNVERIFIED** |
| **GERMANY** | `DE 10 2021 109 876 A1` | DPMA / DEPATISnet | `https://depatisnet.dpma.de/DepatisNet/depatisnet?action=pdf&docid=DE102021109876A1` | 2026-09-08 | **NO** | **NO** | Text only (Mock) | **UNVERIFIED** |
| **WIPO** | `WO 2018/083696 A1` | WIPO PATENTSCOPE | `https://patentscope.wipo.int/search/en/detail.jsf?docId=WO2018083696` | 2026-09-08 | **NO** | **NO** | Text only (Mock) | **UNVERIFIED** |
| **WIPO** | `WO 2019/123456 A1` | WIPO PATENTSCOPE | `https://patentscope.wipo.int/search/en/detail.jsf?docId=WO2019123456` | 2026-09-08 | **MISMATCH** | **NO** (Actual: HDI Synthesis / Neuropeptides) | Mismatched | **UNVERIFIED** |
| **WIPO** | `WO 2021/098765 A1` | WIPO PATENTSCOPE | `https://patentscope.wipo.int/search/en/detail.jsf?docId=WO2021098765` | 2026-09-08 | **MISMATCH** | **NO** (Actual: Video Keyframe Selection) | Mismatched | **UNVERIFIED** |
| **WIPO** | `WO 2022/034567 A1` | WIPO PATENTSCOPE | `https://patentscope.wipo.int/search/en/detail.jsf?docId=WO2022034567` | 2026-09-08 | **NO** | **NO** | Text only (Mock) | **UNVERIFIED** |
| **WIPO** | `WO 2023/098712 A1` | WIPO PATENTSCOPE | `https://patentscope.wipo.int/search/en/detail.jsf?docId=WO2023098712` | 2026-09-08 | **MISMATCH** | **NO** (Actual: EV Battery Swapping) | Mismatched | **UNVERIFIED** |

---

## 3. Discrepancy Case Studies

### 1. `WO 2023/098712 A1`
- **Claimed in Baseline Corpus**: "Synergistic composition containing standardized extracts of Tinospora cordifolia and Piper longum for immunomodulation" (Aurea Biolabs).
- **Actual WIPO Gazette Record**: Published June 1, 2023. Title: *适用于电动车辆的底盘换电方法 (Chassis Battery Swapping Method Suitable for Electric Vehicles)*. Designated to EV charging stations.
- **Finding**: Critical mismatch. The publication identifier was fabricated or randomly borrowed.

### 2. `WO 2021/098765 A1`
- **Claimed in Baseline Corpus**: "Process for preparation of purified bioactive withanolide fractions from Withania somnifera" (NutraGenesis LLC).
- **Actual WIPO Gazette Record**: Published May 27, 2021. Title: *Key frame selection method and apparatus based on motion state* (Tencent Technology).
- **Finding**: Critical mismatch.

### 3. `WO 2019/123456 A1`
- **Claimed in Baseline Corpus**: "Standardized botanical extract of Curcuma longa and Zingiber officinale (SEDDS)" (OmniActive).
- **Actual WIPO Gazette Record**: Chemical synthesis and bio-based isocyanate (HDI) synthesis literature citations.
- **Finding**: Critical mismatch.

---

## 4. Conclusion & Quarantine Action
1. All 15 placeholder documents are **rejected and quarantined** from production consideration.
2. They will be relegated strictly to `data/test_fixtures/` as mock unit test fixtures only.
3. The production corpus document count for India, Germany, and WIPO is **officially reset to 0 authentic documents**, requiring legitimate bulk acquisition.
