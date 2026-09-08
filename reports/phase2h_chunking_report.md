# Phase 2H Patent-Aware Chunking Report

**Project:** IP-SAKTI Sahayak / AYURLEX (SIH 26045)  
**Chunking Engine:** Patent-Aware Semantic Chunker  

---

## 1. Chunking Methodology
- **Abstracts:** Maintained as standalone single chunks preserving high-level context.
- **Claims:** Segmented strictly along claim boundaries (independent claims and dependent claim hierarchies preserved).
- **Descriptions:** Partitioned into ~500 word blocks with 50-word semantic overlaps.
- **Metadata Retained:** Every chunk stores `country`, `region`, `patent_id`, `publication_number`, `family_id`, `title`, `section`, `chunk_id`, and `token_count`.

## 2. Chunking Statistics

| Jurisdiction | Documents | Total Chunks | Avg Chunks / Doc |
| :--- | :---: | :---: | :---: |
| **USA** | 1,159 | 29,003 | 25.0 |
| **Europe** | 646 | 1,912 | 3.0 |
| **WIPO** | 339 | 13,652 | 40.3 |
| **India** | 0 | 0 | 0.0 |
| **Germany** | 0 | 0 | 0.0 |
| **TOTAL** | **2,144** | **44,567** | **20.8** |
