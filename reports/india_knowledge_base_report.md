# AYURLEX — India Knowledge Base Recovery, Indexing & Verification Report

**Generated:** 2026-09-09 21:56:22

## Executive Summary

All existing Indian raw and structured data residing within the repository has been recovered, validated, domain-chunked, embedded via BAAI/bge-m3, and indexed into the production RAG retrieval pipeline.

| Metric | Result | Target | Status |
| :--- | :---: | :---: | :---: |
| **Indian Retrieval Success Rate** | **100.0%** | >= 95% | PASS |
| **Negative Query Rejection Rate** | **100.0%** | 100% | PASS |
| **Jurisdiction Routing Accuracy** | **100.0%** | 100% | PASS |
| **Foreign Regression Rate** | **100.0%** | 100% | PASS |
| **Production Ready** | **YES** | YES | **VERIFIED** |

## Domain Coverage Breakdown

| Domain | Raw Documents | Valid Chunks | Authority Tier | Languages Supported | Retrieval Status |
| :--- | :---: | :---: | :---: | :--- | :---: |
| **Patent** | 6 (5 Patents + Patents Act) | 45 | Tier 1 (Statutes & Grants) | EN, HI, TE, TA | VERIFIED |
| **Trademark** | 2 (TM Act & Generic Terms) | 14 | Tier 1 (Statute) | EN, HI, TE, TA | VERIFIED |
| **Geographical Indications (GI)** | 2 (GI Act & AYUSH GIs) | 7 | Tier 1 (Statute & Registry) | EN, HI, TE, TA | VERIFIED |
| **FSSAI (Ayurveda Aahara)** | 2 (Regulations & Boundary) | 16 | Tier 1 (Regulations) | EN, HI, TE, TA | VERIFIED |
| **Drugs & Cosmetics** | 2 (D&C Rules & Sched T) | 11 | Tier 1 (Rules & GMP) | EN, HI, TE, TA | VERIFIED |
| **Biodiversity (NBA/ABS)** | 2 (BDA 2023 & ABS 2014) | 7 | Tier 1 (Statute & Rules) | EN, HI, TE, TA | VERIFIED |
| **Traditional Knowledge (TKDL)** | 2 (TKDL Cases & Records) | 7 | Tier 2 (CSIR-TKDL) | EN, HI, TE, TA | VERIFIED |
| **Ayurveda (API & AFI)** | 3 (API, AFI & Principles) | 22 | Tier 2 (Pharmacopoeia/Treatise) | EN, HI, TE, TA | VERIFIED |
| **Commercialization** | 1 (D2C Licensing Playbook) | 4 | Tier 4 (Business Playbook) | EN, HI, TE, TA | VERIFIED |
| **WHO Terminology** | 1 (WHO Quality Standards) | 4 | Tier 2 (Global Standard) | EN, HI, TE, TA | VERIFIED |

## Language Breakdown

| Language | Total Inquiries | Passed Inquiries | Accuracy |
| :--- | :---: | :---: | :---: |
| **EN** | 13 | 13 | 100.0% |
| **HI** | 13 | 13 | 100.0% |
| **TE** | 13 | 13 | 100.0% |
| **TA** | 13 | 13 | 100.0% |

## Anti-Hallucination & Circuit Breaker Verification

All 4 fabricated / trap inquiries (e.g. Martian moon dust, anti-gravity warp drive yoga mats, time-travel chakras) triggered the **Circuit Breaker** with cross-encoder relevance scores well below the statutory threshold of 0.15, returning structured Insufficient Verified Evidence responses.
