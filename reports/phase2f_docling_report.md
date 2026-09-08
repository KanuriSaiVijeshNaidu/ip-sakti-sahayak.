# Phase 2F — Docling Layout Processing & Preprocessing Report

**Project**: IP-SAKTI Sahayak / AYURLEX — SIH 26045  
**Date**: 2026-09-08  
**Phase**: PHASE 2F — STEP 10 DOCLING-FIRST PREPROCESSING  
**Mandate Enforced**: Docling layout structure extraction MUST precede patent-aware chunking. No chunking of raw PDFs.

---

## 1. Docling Execution Architecture

The pipeline strictly enforces the following processing order:

```
[RAW PATENT SPECIFICATION / PDF / XML]
                │
                ▼
[DOCLING 1.10.0 DOCUMENT PARSER]
  ├── Document Layout & Visual Heading Detection
  ├── Tabular Data Extraction
  ├── Paragraph & Section Boundary Identification
  └── Optical Character Normalization
                │
                ▼
[STRUCTURED JSON REPRESENTATION]
                │
                ▼
[PATENT SECTION EXTRACTION]
  ├── Bibliographic Metadata Block
  ├── Technical Field & Background
  ├── Summary of the Invention
  ├── Detailed Embodiments / Drawings
  └── Statutory Numbered Claims (Independent / Dependent)
                │
                ▼
[PATENT-AWARE CHUNKING]
  └── Preserves Complete Claim Boundaries & Hierarchies
```

---

## 2. Docling Execution Metrics (Calculated from Actual Production Files)

| Jurisdiction | Documents Submitted | Docling Success | Docling Failure | Success Rate | Claims Blocks Extracted | Description Sections | Tabular Structures |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **USA** (`US`) | 1,159 | 1,159 | 0 | **100.0%** | 1,806 | 26,074 | 3,412 |
| **EUROPE** (`EP`) | 646 | 646 | 0 | **100.0%** | 637 | 639 | 421 |
| **INDIA** (`IN`) | 0 | 0 | 0 | N/A | 0 | 0 | 0 |
| **GERMANY** (`DE`) | 0 | 0 | 0 | N/A | 0 | 0 | 0 |
| **WIPO / PCT** (`WO`) | 0 | 0 | 0 | N/A | 0 | 0 | 0 |
| **TOTAL** | **1,805** | **1,805** | **0** | **100.0%** | **2,443** | **26,713** | **3,833** |

---

## 3. OCR & Layout Quality Metrics

- **USA**: OCR Noise Quality Score = `0.9944` (Clean digital layout from USPTO).
- **Europe**: OCR Noise Quality Score = `0.9989` (Clean digital layout from EPO).
- **Docling Cache Verification**: Verified that all 1,805 processed documents possess valid structured JSON schemas in `data/usa/docling/` and `data/europe/docling/`.
- **Pre-Chunking Compliance**: Verified that 100% of production chunks trace back directly to Docling section spans.
