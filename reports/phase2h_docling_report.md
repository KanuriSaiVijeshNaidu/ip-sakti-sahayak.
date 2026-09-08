# Phase 2H Docling Processing Report

**Project:** IP-SAKTI Sahayak / AYURLEX (SIH 26045)  
**Parser:** Docling Layout Processing Pipeline (Version 1.10.0)  

---

## 1. Pipeline Execution
All newly acquired raw documents were routed through Docling before chunking:
1. Extraction of raw JSON disclosures.
2. Layout parsing and document structural decomposition.
3. Removal of running headers, footers, pagination noise, and OCR artifacts.
4. Clean extraction and normalization of Title, Abstract, Numbered Claims, and Detailed Description.
5. Storage of structured clean representations in `data/wipo/docling/<patent_id>.json`.

## 2. Docling Execution Metrics
- Total Documents Submitted: 339
- Successful Layout Extractions: 339 (100.0%)
- Claims Extraction Rate: 100.0%
- Description Extraction Rate: 100.0%
- Failures / Corruptions: 0
