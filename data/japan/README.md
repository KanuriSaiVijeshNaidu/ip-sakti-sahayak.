# Japan (JP) Patent Corpus - AYURLEX / IP-SAKTI Sahayak (SIH 26045)

## Overview
This directory contains the authentic, isolated Japanese patent corpus (JP) acquired for the AYURLEX cross-jurisdiction patent intelligence system. The corpus specifically covers Ayurvedic, Kampo, traditional oriental medicine, herbal formulations, plant extracts, functional foods, nutraceuticals, and botanical cosmetic patents.

## Source & Provenance
- Repository: Podtech/llm-jp-corpus-v4-ja_patent (Hugging Face)
- Upstream Origin: National Institute of Informatics (NII) LLM-jp Project / Japan Patent Office (JPO)
- License: Creative Commons Attribution 4.0 International (CC BY 4.0)
- Shards Processed: 6 compressed shards (0000.jsonl.gz to 0005.jsonl.gz)
- Total Raw Records Screened: 44,410 patent documents (3,240.33 MB uncompressed text)
- Retained Filtered Documents: 735 authentic AYURLEX patents (89.15 MB JSONL)
- Total Chunks Generated: 26,041 structured chunks (51.26 MB JSONL)

## Directory Structure
- raw/: 735 raw JSON patent documents
- processed/: 735 Docling-structured sectioned JSON files
- chunks/: 26,041 individual chunk JSON files + japan_chunks.jsonl
- metadata/: Ingestion and schema metadata
- validation/: Forensic audit reports (dataset_report.json, quality_report.json, sample_audit.json)
- japan_cleaned.jsonl: Consolidated document-level cleaned JSONL
- source_manifest.json: Machine-readable provenance and acquisition manifest

## Jurisdiction Isolation & Language Integrity
- Namespace: Exclusively stored under data/japan/. Never mixed with USA, Europe, WIPO, or India corpora.
- Jurisdiction Metadata: Every document and chunk is tagged with jurisdiction: 'JP', country: 'Japan'.
- Language Preservation: Authoritative text is original Japanese (language: 'ja'). It has NOT been replaced or degraded with machine translation.
- Section Demarcation: Chunks strictly preserve JPO legal structure (abstract, claims, description).

## Pre-Embedding Status
- PRE-EMBEDDING HALT: Vector embeddings and FAISS index generation remain strictly suspended pending validation review.
