# Phase 2H Provenance Report: Cryptographic Lineage & Licensing

**Project:** IP-SAKTI Sahayak / AYURLEX (SIH 26045)  
**Jurisdictions Covered:** USA, Europe, WIPO  

---

## 1. Provenance Architecture
Every accepted production document in `data/<jurisdiction>/raw/` has a corresponding provenance record stored in `data/provenance/<jurisdiction>/`:
- `document_id`
- `publication_number`
- `jurisdiction`
- `country_code`
- `source`
- `source_url`
- `download_timestamp`
- `sha256`
- `license`
- `language`
- `verification_status`

## 2. Jurisdiction Provenance Statistics

| Jurisdiction | Verified Documents | Provenance Records | SHA-256 Verification | License Model |
| :--- | :---: | :---: | :---: | :--- |
| **USA** | 1,159 | 1,159 | 100% Validated | US Government Public Domain (17 U.S.C. § 105) |
| **Europe** | 646 | 646 | 100% Validated | EPO Open Access / Fair Use |
| **WIPO** | 339 | 339 | 100% Validated | MIT / WIPO Public Open Access |
| **India** | 0 | 0 | N/A | N/A |
| **Germany** | 0 | 0 | N/A | N/A |
| **TOTAL** | **2,144** | **2,144** | **100% Validated** | **Compliant** |
