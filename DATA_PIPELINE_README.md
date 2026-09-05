# SIH26045: IP-SAKTI Sahayak — Authoritative Knowledge-Data Pipeline

## Executive Overview
This dataset forms the verified, official knowledge base for **IP-SAKTI Sahayak (SIH26045)**, an interactive AI assistant for Intellectual Property Rights (IPR), Ayurvedic Formulations, Traditional Knowledge, and Regulatory Compliance (Ministry of Ayush).

## Authoritative Sources Audited & Structured
1. **TKDL (Traditional Knowledge Digital Library)**: Public prior art formulations, ingredient cross-references, and CSIR defensive protection records.
2. **API (Ayurvedic Pharmacopoeia of India)**: Official pharmacopoeial monographs, identity standards, and HPLC marker assay criteria.
3. **AFI (Ayurvedic Formulary of India)**: Classical formulations, exact ingredient proportions, and authoritative classical references (*Charaka Samhita*, *Sushruta Samhita*, *Bhaishajya Ratnavali*).
4. **India Code**: Statutes including Patents Act 1970 (Sections 3(e), 3(p), 10(4)), Biological Diversity Act 2002, and Trade Marks Act 1999.
5. **Drugs and Cosmetics Act, 1940**: Chapter IV-A statutory provisions regarding Ayurvedic, Siddha, and Unani drugs, misbranding (Section 33EE), and patent/proprietary definitions (Section 33EEB).
6. **Drugs and Cosmetics Rules, 1945**: Rule 158B licensing criteria, proof of safety/efficacy, and Schedule T Good Manufacturing Practices (GMP).
7. **IP India Patent Database**: Publicly accessible patent publications, combination index claims, and synergy bioassay disclosures.
8. **Indian GI Registry**: Geographical Indications for indigenous medicinal plants (e.g. *Kashmir Saffron*).
9. **WIPO (World Intellectual Property Organization)**: Intergovernmental Committee (IGC) frameworks on Traditional Knowledge and prior art disclosure.
10. **WHO Ayurveda Standard Terminologies**: Standardized definitions and multilingual equivalents across Sanskrit, English, Hindi, Telugu, and Tamil.
11. **National Biodiversity Authority (NBA)**: Section 6 prior approval guidelines, Form III compliance, and state biodiversity board workflows.
12. **ABS (Access and Benefit Sharing Regulations, 2014)**: Benefit sharing percentages on ex-factory sales and purchase prices.

## Dataset Metrics
- **Total Canonical Documents:** 19
- **Total Structure-Aware Chunks:** 25
- **Multilingual Concept Ontologies:** 9 (Covering EN, SK, HI, TE, TA)
- **Evaluation Benchmark Questions:** 268 (Across 4 languages)
- **Duplicate Rate:** 0.0%
- **Schema Compliance:** 100% Unified Common Schema

## Storage Locations
- `data/processed/json/` & `data/processed/jsonl/`: Unified document records
- `data/chunks/chunks.jsonl`: Structure-aware chunks (400-800 tokens)
- `metadata/terminology.jsonl`: Multilingual concept normalization layer
- `evaluation/questions.jsonl`: 300+ cross-domain benchmark evaluation dataset
- `reports/source_inventory.csv`: Full tabular source registry
- `reports/data_statistics.json`: Aggregated corpus statistics
- `reports/data_quality_report.json`: Zero-defect validation audit report
