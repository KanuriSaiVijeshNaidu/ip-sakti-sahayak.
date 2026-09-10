# IP-SAKTI / SIH26045 — India Legal Dataset Upgrade Report

```
================================================================================
                         IP-SAKTI INDIA DATA UPGRADE
================================================================================
Existing datasets:
  - Indian Patent Office (IPO) Grants: 5 patents (21 chunks)
  - The Patents Act, 1970 (Act No. 39 of 1970) (9 statutory chunks)
  - Trade Marks Act 1999 & GI Act 1999 (8 statutory chunks)
  - FSSAI Ayurveda Aahara Regulations 2022 (9 chunks)
  - CGPDTM Guidelines for Examination in TK & Pharma (4 chunks)
  - Trade Marks Act Generic Names Ban & Class 5/3 Schedule (4 chunks)
  - Geographical Indications of Goods Act & AYUSH GIs (3 chunks)
  - Drugs & Cosmetics Act 1940 & Rules 1945 (Rule 158B & Sched T) (6 chunks)
  - FSSAI Boundary Matrix & Packaging Guidelines (5 chunks)
  - Biological Diversity Act 2002 & Amendment Act 2023 (5 chunks)
  - CSIR-TKDL Classical Prior Art Formulations (5 chunks)
  - Ayurvedic Pharmacopoeia (API) & Formulary (AFI) Monographs (17 chunks)
  - NCISM / CCIM Treatises (Charaka, Sushruta, Ashtanga) (4 chunks)
  - D2C Ayurveda Brand Protection & e-Aushadhi Licensing (5 chunks)
  - WHO Traditional Medicine Guidelines (4 chunks)
  - Statutory Anchors Store (71 verified anchors across IN)

New dataset: KanoonGPT Indian Legal Documents
Downloaded: YES (8 Parquet shards from Hugging Face)
Original source: https://huggingface.co/datasets/KanoonGPT/indian-legal-documents
License: Apache 2.0
Raw size: 449.4 MB (35,851 documents across 8 shards)
Original documents: 35,851
Selected documents: 18 high-priority instruments (Patents, Designs, Copyright, GI, Plant Varieties, AYUSH, Biodiversity)
Rejected documents: 35,833 (general non-IP Indian legislation: tenancy, motor vehicles, state taxes, etc.)
Final chunks: 1,494 structure-aware chunks
Embeddings added: 1,494 vectors (1024-dim, BAAI/bge-m3, normalized)
Vector store: FAISS (data/indexes/faiss/in/bge_m3_in_flatip.faiss, 1,631 total vectors) + BM25 (1,631 chunks)

Indian IP coverage:
  - Patents: Expanded with Guidelines for Examination of Biotechnology Inventions, Computer-Related Inventions (CRIs), and Draft Patent Rules 2023.
  - Designs: Added full statutory coverage of The Designs Act 2000 (Act No. 16 of 2000), The Designs Rules 2001, and Manual of Designs Practice & Procedure.
  - Copyright: Added full statutory coverage of The Copyright Act 1957 (Act No. 14 of 1957) and Copyright Rules for software/database protection.
  - Geographical Indications: Added The Geographical Indications of Goods Rules 2002 and Manual of GI Practice & Procedure.
  - Plant Varieties: Added The Protection of Plant Varieties and Farmers' Rights Act 2001 & Amendment Rules.

Ayurveda coverage:
  - Added The National Commission for Indian System of Medicine Act, 2020 (No. 14 of 2020) & Board of Ayurveda powers.
  - Added The Institute of Teaching and Research in Ayurveda Act, 2020.
  - Added The Gujarat Ayurved University Act, 2021.

Traditional knowledge coverage:
  - Preserved existing TKDL formulations and Charaka/Sushruta treatise definitions.
  - Reinforced non-patentability rules under Section 3(p) with biotechnology and TK examination guidelines.

Regulatory coverage:
  - Added full Biological Diversity (Amendment) Act 2023 & Guidelines for Biodiversity Heritage Sites.
  - Added Trade Marks (Amendment) Act 2010 and State Emblem of India (Prohibition of Improper Use) Act 2005.
  - Preserved existing FSSAI Ayurveda Aahara 2022 and Drugs & Cosmetics Rule 158B.

Retrieval changes:
  - Updated backend/app/rag/evidence_gate.py to recognize KanoonGPT secondary legal statutes (source_type="secondary_legal_statute").
  - Preserved Tier-1 priority for existing government statutory anchors (Patents Act, TM Act, DCA, FSSAI, BDA) while tagging KanoonGPT chunks as authority_tier=2 / SECONDARY_DATASET.

Files changed:
  - backend/app/rag/evidence_gate.py (updated is_statutory_source to support KanoonGPT secondary legal sources)
  - backend/app/ingestion/kanoongpt_chunker.py (new structure-aware legal chunker preserving Act -> Chapter -> Section hierarchy)
  - backend/app/ingestion/kanoongpt_ingest.py (new selective ingestion and dual-index merger)
  - data/india/chunks/canonical_indian_chunks.jsonl (expanded from 137 to 1,631 chunks)
  - data/indexes/faiss/in/bge_m3_in_flatip.faiss (expanded from 137 to 1,631 vectors)
  - data/indexes/faiss/in/in_mapping.jsonl (updated mapping rows to 1,631)
  - data/indexes/bm25/jurisdiction_bm25_cache_v2.pkl (updated IN partition with 1,631 chunks)

Tests performed:
  1. India Legal Evaluation Benchmark (20 queries: Patents, Trademarks, TK, Biodiversity, Copyright, Designs, Abstention)
  2. Full 17-Test Core Regression Suite (US, EP, JP, WO, IN, Educational, Product Intelligence)
  3. Unseen Evidence Boundary Suite (21 unseen queries + 4 adversarial candidate injections)

Before vs After:
  - India Legal Evaluation Benchmark:
      Before: 18 / 20 Passed (90.0%) [NCISM Act 2020 and Copyright Act 1957 failed with INSUFFICIENT_EVIDENCE]
      After:  20 / 20 Passed (100.0%) [Both NCISM Act and Copyright Act now answered with genuine statutory citations]
  - Designs Act 2000 Coverage:
      Before: Incidental mentions only.
      After:  Grounded statutory citations from THE DESIGNS ACT, 2000 & Designs Rules 2001.
  - 17-Test Regression Suite:
      Before: 17 / 17 Passed (100.0%)
      After:  17 / 17 Passed (100.0%)
  - Unseen Boundary Suite & Adversarial Injections:
      Before: 21 / 21 Passed, 4 / 4 Adversarial Rejected, 0 False Supported Answers
      After:  21 / 21 Passed, 4 / 4 Adversarial Rejected, 0 False Supported Answers
  - Abstention on Unsupported Inquiries:
      Maintained 100.0% clean abstention for Australia, Brazil, and ungrounded queries.

Known limitations:
  - Case law judgments from KanoonGPT/indian-case-laws were excluded from this sprint to focus strictly on statutory instruments and rules.
  - Only English-language Indian statutes and official rules were selected.

Recommended next step:
  - Post-hackathon: Index landmark IPAB / High Court IP decisions (e.g. Novartis v. Union of India on Section 3(d)).
================================================================================
```
