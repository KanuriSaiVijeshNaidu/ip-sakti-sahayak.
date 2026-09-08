# Germany — DPMAconnectPlus & DPMA Historical Data Acquisition Report

**Project**: IP-SAKTI Sahayak — Production Patent & Traditional Knowledge RAG  
**Date**: 2026-09-08  
**Phase**: PHASE 2C — REOPEN DATA ACQUISITION USING VERIFIED OFFICIAL ACCESS PATHS  
**Target Authority**: Deutsches Patent- und Markenamt (DPMA)  
**Target Country Code**: `DE` (Federal Republic of Germany)  
**Strict Policy**: Zero fabricated data, no synthetic patents, no reclassifying `EP` or `WO` documents as `DE`, no bypassing access controls.

---

## 1. DPMAconnectPlus Investigation & Technical Evaluation

An in-depth investigation of the **DPMAconnectPlus** service was conducted against official DPMA documentation, API specifications, and administrative terms.

### Evaluation of Core Access Questions

| Investigation Question | Official Finding | Details & Statutory Context |
| :--- | :---: | :--- |
| **1. Is registration required?** | **YES** | DPMAconnectPlus is a contractual web service interface (*Standardvertrag DPMAconnectPlus*). There is no anonymous, self-service, or unauthenticated access. |
| **2. Is there an accessible legitimate account route?** | **YES (Paper/Postal Only)** | Account setup cannot be completed online. Applicants must download the standard agreement form, complete the intended use declaration, and mail **two signed original paper agreements** to: <br>`DPMA, Referat 2.1.2 - Kundenservice Datenabgabe, 80297 München, Germany`. |
| **3. Can a student/research project obtain access?** | **YES** | Universities, non-commercial researchers, and student teams may apply under the DPMA data dissemination agreement, provided the application specifies the research purpose and signs the contract. |
| **4. Are current weekly data packages downloadable?** | **YES** | Once credentials (HTTP Basic username and password) are provisioned by DPMA Referat 2.1.2, weekly publication packages containing XML (ST.36 / ST.96) and full-text documents are downloadable via HTTP/REST endpoints. |
| **5. Are historical/backfile packages available?** | **YES** | The DPMA provides historical backfile packages covering German patents, published applications (*Offenlegungsschriften* `A1`), and granted patents (`B3`/`B4`) spanning several decades. |
| **6. What are the licensing conditions?** | **DPMA Standard Contract** | Use is governed by the *Standardvertrag über die Bereitstellung von Daten des DPMA*. The licensee is bound to specified use cases; commercial redistribution requires higher-tier licensing terms. |
| **7. Can data be used for a university/SIH prototype?** | **YES** | Academic and non-commercial prototyping is permitted, subject to contractual approval by DPMA and payment of standard connection/administrative fees. |
| **8. Can at least a pilot dataset be obtained legally right now?** | **NO** | **Blocked by credential gate**. DPMA does not offer anonymous test credentials or open public sample repositories for DPMAconnectPlus. Bypassing authentication or scraping DEPATISnet/DPMAregister is strictly prohibited. |

---

## 2. DPMA Historical Data & Backfile Feasibility

### Backfile Scope & Parameters
- **Estimated Number of Records**: > 2.5 million German patent and utility model publications (covering historical filings from 1877 to present, with full-text character-coded data primarily from 1980 onwards).
- **Estimated Archive Size**: Multiple terabytes (XML + facsimile TIFF/PDF).
- **Format**:
  - Full-text descriptions & claims: WIPO ST.36 / ST.96 XML.
  - Front pages & drawings: PDF and TIFF image archives.
- **Costs**:
  - Connection fee: ~200 EUR (one-time setup fee).
  - Media/provision fee: DPMA charges administrative handling and data dispatch costs for bulk offline media deliveries.
- **Public Sample Availability**:
  - The DPMA publishes DTD and XML schema definitions, but **does not publish free downloadable sample corpora of authentic patent specifications** on open public servers without registration.

---

## 3. Pilot Acquisition Execution (`DE` Target: 100 Documents)

A pilot run was attempted to obtain 100 authentic German national patent specifications (`DE` publication numbers, German claims, German descriptions).

### Source Checks & Verification Gates

```
[Candidate 1: DPMAconnectPlus HTTP API]
  ├── Authenticated REST endpoint: https://connect.dpma.de/ ...
  ├── HTTP Basic Auth prompt -> 401 Unauthorized (No active contractual credentials)
  └── Result: BLOCKED BY CREDENTIAL CONTROL (Stop Condition Rule 16 triggered)

[Candidate 2: DEPATISnet Public Web Search]
  ├── Interactive search portal with session tokens and CAPTCHAs
  ├── Terms of Service explicitly prohibit automated mass scraping
  └── Result: BLOCKED BY TERMS OF SERVICE & ANTI-BOT PROTECTIONS

[Candidate 3: EPO OPS (Open Patent Services) Full-Text API]
  ├── Investigated EPO OPS full-text coverage for DE documents
  ├── Official EPO OPS documentation explicitly states:
  │   "OPS character-coded full text covers EP, WO, AT, BE, BG, CA, CH, CZ, DK, ...
  │    DE (Germany) is EXCLUDED from character-coded descriptions and claims."
  └── Result: DE FULL-TEXT NOT SUPPORTED BY EPO OPS

[Candidate 4: Hugging Face EP Collections (mhurhangee/ep-patent-all-claims)]
  ├── Contains German-language patent claims
  ├── Publication Identifiers carry country code EP (e.g. EP-1234567-A1)
  ├── Mandate Rule 4 & 13: "CRITICAL: Do NOT classify EP documents as GERMANY."
  └── Result: DISQUALIFIED BY JURISDICTION VALIDATOR
```

---

## 4. Pilot Authenticity & Quality Metrics

| Metric | Measured Value | Statutory Evaluation |
| :--- | :---: | :--- |
| **Documents Downloaded** | 0 | Halted before unauthorized scraping |
| **Documents Valid (`DE`)** | 0 | Zero synthetic records permitted |
| **Documents Rejected** | 0 | N/A |
| **Documents with Verifiable Claims** | 0 | 0% |
| **Documents with Verifiable Descriptions** | 0 | 0% |
| **Documents with Verifiable Abstracts** | 0 | 0% |
| **Wrong Jurisdiction / Misclassified** | 0 | Hard validator prevented EP $\rightarrow$ DE leakage |
| **Duplicates Detected** | 0 | N/A |
| **Docling Success** | 0 | N/A |
| **Docling Failure** | 0 | N/A |
| **OCR Quality Score** | N/A | N/A |
| **Metadata Completeness** | 0.0% | N/A |
| **Pilot Status** | **GATE FAILED (0 / 100)** | Access blocked by DPMA contractual registration barrier |

---

## 5. Licensing & Governance Summary

- **Source**: Deutsches Patent- und Markenamt (DPMA)
- **Service**: DPMAconnectPlus / DPMAdatenabgabe
- **URL**: `https://www.dpma.de/service/datenabgabe/dpmaconnectplus/index.html`
- **License Status**: **REQUIRES REVIEW / CONTRACTUAL LICENSE AGREEMENT**
- **Commercial / Research Restrictions**: Allowed under contract, but strictly requires postal application, agreement execution, and 200 EUR fee.
- **Redistribution Restrictions**: Redistribution of raw DPMA data packages is restricted without explicit multi-user licensing.
- **Legal Compliance Decision**: In accordance with Stop Condition Rule 16, acquisition remains paused until the university/institution executes the postal DPMAconnectPlus agreement or an alternative open repository with authentic DE full-text emerges.
- **Production Status**: GERMANY remains **INSUFFICIENT (0 trustworthy production documents)**.
