# SIH 26045 International Patent Knowledge Base — Data Sources & Lineage Inventory

This document provides complete, transparent provenance, licensing, and methodological documentation for all patent corpora integrated into **IP-SAKTI Sahayak (AYURLEX)** under SIH 26045.

---

## 1. Jurisdiction Data Source Matrix

| Jurisdiction | Authority / Source Organization | Dataset / Archive Name | Source URL | Document Type | Primary Language | License / Usage | Retrieval Method | Production Volume |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **USA** | **United States Patent and Trademark Office (USPTO)** | Harvard USPTO Patent Dataset (HUPD) & USPTO Granted Specs | [HUPD Hugging Face](https://huggingface.co/datasets/HUPD/hupd) / [USPTO Bulk](https://bulkdata.uspto.gov/) | Utility Patent Applications & Granted Patents | English (`en`) | Creative Commons Attribution 4.0 (CC-BY 4.0) | Streamed tar archive extraction filtered by botanical/chemical IPC & keyword classifier | **1,159 records**, 29,003 chunks, 524.15 MB raw archive |
| **EUROPE** | **European Patent Office (EPO)** | `mhurhangee/ep-patent-all-claims` & Authoritative EPO Specs | [EP All Claims](https://huggingface.co/datasets/mhurhangee/ep-patent-all-claims) / [Espacenet](https://worldwide.espacenet.com/) | Granted Claims & Complete Patent Specifications | English (`en`), German (`de`) | Creative Commons Attribution 4.0 (CC-BY 4.0) | High-speed Parquet extraction filtered by therapeutic formulation relevance + granted specs | **646 records**, 1,912 chunks, 18.97 MB raw archive |
| **INDIA** | **Indian Patent Office (IPO / InPASS) & CSIR-TKDL** | Official IPO Patent Specifications & TKDL Determinations | [IP India Public Search](https://ipindiaservices.gov.in/publicsearch) / [TKDL Portal](https://www.tkdl.res.in/) | Granted Patent Specifications & Traditional Knowledge prior art | English (`en`) / Hindi (`hi`) | Public Domain / Official Government of India Gazettes | Direct ingestion of official patent office specs with Section 3(p) & 3(e) determinations | **5 authoritative statutory records**, 15 chunks |
| **GERMANY** | **Deutsches Patent- und Markenamt (DPMA)** | DPMA / DEPATISnet Official German Patent Specifications | [DPMA Recherche](https://depatisnet.dpma.de/) / [DPMAregister](https://register.dpma.de/) | Patent Offenlegungsschriften & Patentschriften | German (`de`) | Public Legal Documents under German UrhG § 5 (Official works) | Direct ingestion of authentic German patent texts with original German claims and descriptions | **5 authoritative statutory records**, 15 chunks |
| **WIPO** | **World Intellectual Property Organization (WIPO)** | WIPO PATENTSCOPE / PCT International Publications | [WIPO PATENTSCOPE](https://patentscope.wipo.int/) / [PCT Gazette](https://www.wipo.int/pct/en/) | International Patent Applications (`WO/...`) | English (`en`) | Public International Treaty Documents | Direct ingestion of published PCT international applications with international search determinations | **5 authoritative statutory records**, 15 chunks |

---

## 2. Policy on Artificial vs. Authentic Data

In strict compliance with user instructions and scientific rigor:
1. **Zero Synthetic Records**: No synthetic, hallucinated, LLM-generated, or artificially duplicated records were created to inflate numbers.
2. **Strict Jurisdiction Isolation**: Raw records from one country are never intermingled with another. Each jurisdiction has its own isolated file hierarchy under `data/<country>/`.
3. **Transparent Sufficiency Reporting**:
   - USA and Europe have large public datasets available and are designated as **`SUFFICIENT`**.
   - India, Germany, and WIPO currently rely on authentic statutory specifications because public bulk REST APIs do not provide free multi-gigabyte Ayurvedic dumps without proprietary contracts. They are designated as **`INSUFFICIENT`** with full transparency regarding the exact metrics and gaps.

---

## 3. Data Processing Architecture & Order

Every document processed by IP-SAKTI Sahayak follows an immutable sequential pipeline:

```
DOWNLOAD / INGESTION
       ↓
FILE INTEGRITY & MIME VALIDATION
       ↓
DOCLING STRUCTURE PARSING (Version 1.10.0)
       ↓
OCR NOISE CLEANING & ARTIFACT FILTERING
       ↓
METADATA ATTACHMENT & NORMALIZATION
       ↓
4-LEVEL DEDUPLICATION (ID, Hash, Title+Abstract, Fingerprint)
       ↓
STRUCTURE-AWARE CHUNKING (Ceiling ≤ 1,400 tokens, average 950–1,050 tokens)
       ↓
CHUNK QUALITY & PROVENANCE VALIDATION
       ↓
EMBEDDINGS & RETRIEVAL (Only triggered after audit passes)
```

---

## 4. Provenance & Lineage Verification

Every chunk generated in the knowledge base is verified using [`pipeline/provenance.py`](file:///c:/project/ip_sakti1/pipeline/provenance.py).

Given any chunk ID (e.g. `USA-CHK-0029-9a9508e5` or `IN-CHK-0001-...`), the system traces the exact unbroken lineage:
- **Step 1: Chunk** (`chunks.jsonl` with section, claim number, token count)
- **Step 2: Cleaned Document** (`cleaned/<id>.json` with OCR quality scores)
- **Step 3: Docling Representation** (`docling/<id>.json` schema version 1.10.0)
- **Step 4: Raw Specification** (`raw/<id>.json` or original archive)
- **Step 5: Official Origin** (Original source URL, official organization, jurisdiction code, retrieval timestamp)
