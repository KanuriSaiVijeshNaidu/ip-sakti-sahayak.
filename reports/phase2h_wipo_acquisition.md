# Phase 2H WIPO Acquisition Report: Forensic Recovery & Isolation

**Project:** IP-SAKTI Sahayak / AYURLEX (SIH 26045)  
**Jurisdiction:** WIPO / PCT (`WO`)  
**Target:** >= 2,000 Verified Documents / >= 4,000 Valid Chunks  
**Status:** **INSUFFICIENT (339 Verified Production Documents / 13,652 Valid Chunks)**  

---

## 1. Forensic Discovery & Document Isolation

In Phase 2H, an exhaustive forensic analysis was performed on the Bosch PLS Benchmark dataset (`atazanavir.csv`, 137.1 MB, 640 family records), derived from WIPO Patent Landscape Report No. 265E:
- **Total Rows Inspected:** 640
- **WIPO_ACCEPTABLE (Isolated WO Documents):** **339 records**
- **WIPO_FAMILY_MIXED (Foreign Family Entanglements):** 252 records (quarantined)
- **WIPO_REJECTED (No WO ID or Insufficient Text):** 49 records

## 2. Document Isolation Criteria
A record was accepted into `WIPO_ACCEPTABLE` only if:
1. The primary publication number is a valid international publication (`WO...`).
2. The claims are substantial (>200 chars, averaging >25,000 chars) and structurally authentic.
3. The description is comprehensive (>1,000 chars, averaging >150,000 chars).
4. Preamble and disclosure contain no foreign-jurisdiction national office headers (e.g. 'United States Patent').

## 3. Production Ingestion & Pipeline Execution
All 339 isolated WO documents were processed through the full production pipeline:
- **Raw Files:** 339 JSON records in `data/wipo/raw/`
- **Docling Conversion:** 339 structured layout JSON files in `data/wipo/docling/`
- **Patent-Aware Chunking:** 13,652 valid chunks produced in `data/wipo/chunks/`
- **Immutable Provenance:** 339 provenance records with SHA-256 hashes in `data/provenance/wipo/`
- **Manifest:** Recorded in `data/manifests/wipo_manifest.jsonl`

## 4. Sufficiency Status
While 339 authentic documents and 13,652 chunks significantly exceed the chunk target (>=4,000), the document count (339) represents 17.0% of the 2,000 document target. In adherence to strict integrity standards, WIPO is honestly reported as **INSUFFICIENT (339 / 2,000 Verified Documents)**.
