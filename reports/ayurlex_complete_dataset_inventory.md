# AYURLEX / IP-SAKTI Sahayak — Complete Dataset Inventory & Audit
**Document ID:** REP-DATA-INV-V2  
**Audit Date:** 2026-09-09 23:59:42  
**System Version:** V2.0-Production  
**Problem Statement:** SIH 26045  
**Dense Embedding Model:** `BAAI/bge-m3 (1024 dimensions, multilingual)`  
**Lexical Search Engine:** `BM25 Okapi with jurisdiction partitioning (jurisdiction_bm25_cache_v2.pkl)`  
**Reranker:** `cross-encoder/ms-marco-MiniLM-L-6-v2`  

---

## 1. Executive Summary & Forensic Truth

AYURLEX is an AI-powered Intellectual Property and Regulatory Intelligence Platform engineered specifically for traditional knowledge, Ayurvedic medicine, botanical compositions, and global patent clearance. 

Following a rigorous forensic audit of the entire filesystem, data directories, FAISS vector indexes, BM25 lexical partitions, and raw statutory texts:
- **Total Production Indexed Chunks:** **70,745 chunks**
- **Total Production FAISS Vectors:** **70,745 vectors (1024-dim BGE-M3)**
- **Total BM25 Lexical Partitions:** **5 active production partitions (US, JP, WO, EP, IN)**
- **Raw Statutory Texts Processed:** **26 statutory files across 19 subdirectories**
- **Docling Parsed Documents:** **38 structured Markdown and JSON artifacts**
- **Quarantined Datasets:** **17 files (isolated to maintain strict zero-hallucination standards)**
- **Dedicated Specialized Chunks:** **108 global chunks, 47 international chunks, 15 German chunks**

---

## 2. Production Indexed Corpora (Primary Retrieval Partitions)

| Partition Code | Jurisdiction / System | System Type | Corpus Origin | Total Chunks / Vectors | Primary Language(s) | Status | FAISS Vector Store |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **US** | United States (USPTO) | **National** | Harvard USPTO Dataset (HUPD) | 29,003 | English (`en`) | **Fully Supported** | `data/indexes/faiss/us_flatip.faiss` (113.3 MB) |
| **JP** | Japan (JPO) | **National** | LLM-jp Kokai Tokkyo Koho | 26,041 | Japanese (`ja`) | **Fully Supported** | `data/indexes/faiss/jp_flatip.faiss` (101.7 MB) |
| **WO** | WIPO / PCT (Patentscope) | **International** | WIPO PATENTSCOPE PCT Applications | 13,652 | English (`en`) | **Fully Supported** | `data/indexes/faiss/wo_flatip.faiss` (53.3 MB) |
| **EP** | European Patent Office (EPO) | **Regional** | EPO European Patent Bulletin & Claims | 1,912 | English (`en`) | **Fully Supported** | `data/indexes/faiss/ep_flatip.faiss` (7.5 MB) |
| **IN** | India (CGPDTM / Statutory / AFI / API) | **National** | Canonical Indian IP & Regulatory Corpus | 137 | Multi (`en`, `hi`, `te`, `ta`, `sa`) | **Fully Supported** | `data/indexes/faiss/in_flatip.faiss` (0.5 MB) |
| **GLOBAL** | Global Unified Flat Index | **Unified** | All 5 Jurisdictions Consolidated | 70,745 | Multilingual | **Fully Supported** | `data/indexes/faiss/bge_m3_global_flatip.faiss` (289.4 MB) |

> **Total Live Searchable Corpus:** **70,745 Chunks / Vectors**

---

## 3. Specialized & Curated Knowledge Stores

In addition to the primary 70,745 patent vectors, AYURLEX maintains specialized statutory and regulatory knowledge repositories:

1. **Canonical Indian Multi-Domain Store (`data/chunks/chunks.jsonl` - 108 Chunks)**:
   - **Domains Covered:** Patent Law (Sec 3p, 3e, 10.4), Trade Marks Act 1999 (Sec 9, 13), GI Act 1999, FSSAI Ayurveda Aahara 2022, Drugs & Cosmetics Rules 158B & Schedule T, Biological Diversity Act 2002 Sec 6, TKDL standards, D2C commercialization, WHO heavy metal benchmarks.
   - **Provenance:** Canonical government gazettes, treatises, and regulatory notifications.

2. **International Cross-Border Regulatory Store (`data/chunks/international/chunks.jsonl` - 47 Chunks)**:
   - **Jurisdictions:** US (FDA DSHEA), EU (Directive 2004/24/EC THMPD, EFSA), Germany (AMG, MarkenG), WO (PCT Regulations, WIPO Genetic Resources Treaty 2024).
   - **Scope:** Export compliance, allowable structure-function claims, traditional herbal registration dossiers.

3. **German Statutory & Patent Store (`data/germany/chunks/chunks.jsonl` - 15 Chunks)**:
   - **Language:** German (`de`).
   - **Statutory Scope:** German Patent Act (PatG), German Medicines Act (AMG §§ 39a-39d), Trade Mark Act (MarkenG), BfArM Commission E Monographs, Federal Nature Conservation Act (BNatSchG / Nagoya).

4. **Raw Statutory Repository (`data/raw/` - 26 Files, 19 Subdirectories)**:
   - Covers AFI (Ayurvedic Formulary of India), API (Ayurvedic Pharmacopoeia of India), classical foundations, D&C Rules, FSSAI regulations, GI registry statutes, and international treaties.

5. **Docling Parsed Documents (`data/docling/` - 38 Files)**:
   - Full structural parsing of complex gazettes, tabular drug-herb interactions, and patent claim trees.

---

## 4. Quarantined Data Records & Integrity Safeguards (`data/quarantine/`)

AYURLEX implements an uncompromising **Evidence Gate and Zero-Hallucination Policy**. Files that fail strict provenance verification, contain incomplete claim structures, or lack legal authenticity are isolated in `data/quarantine/`:
- **5 German DPMA raw scrapings:** Incomplete OCR and missing bibliographic verification.
- **10 Indian raw patent scrapings:** Truncated claims missing formal CGPDTM gazette publication numbers.
- **2 Malformed WIPO records:** Missing English/French abstracts.

*These 17 quarantined files are strictly excluded from the active retrieval index, ensuring 100% citation traceability.*

---

## 5. Architectural Taxonomies: Invariants & Truths

- **National vs. Regional vs. International:**
  - **National:** India (`IN`), United States (`US`), Japan (`JP`), Germany (`DE`).
  - **Regional:** European Patent Convention (`EP` / EPO patent claims), European Union (`EU` regulatory: THMPD / EFSA).
  - **International:** WIPO (`WO` / PCT patents, Genetic Resources Treaty 2024), WHO (Traditional Medicine benchmarks).
  - *Invariant:* `WO` is an international filing system, NOT a country. `EP` is a patent treaty, NOT identical to EU food/drug law. WIPO is NOT a national patent granting office.
- **Language != Jurisdiction:**
  - AYURLEX separates query linguistic syntax from legal jurisdiction routing.
  - A Japanese query can search Indian Section 3(p) prior art.
  - A Hindi query can evaluate US patent claims or Japanese herbal patents.
  - Cross-lingual dense vector projection is performed through BGE-M3's unified 1024-dimensional multilingual vector space.
