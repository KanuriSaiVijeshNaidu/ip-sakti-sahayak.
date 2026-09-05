"""
backend/scripts/build_knowledge_pipeline.py
─────────────────────────────────────────────
SIH26045: IP-SAKTI Sahayak Knowledge-Data Pipeline Builder.
Collects, structures, validates, and chunks data from all 12 authoritative sources:
1. TKDL (Traditional Knowledge Digital Library)
2. API (Ayurvedic Pharmacopoeia of India)
3. AFI (Ayurvedic Formulary of India)
4. India Code (Patents Act, BD Act, TM Act, GI Act)
5. Drugs & Cosmetics Act, 1940
6. Drugs & Cosmetics Rules, 1945
7. IP India Patent Database
8. Indian GI Registry
9. WIPO Traditional Knowledge & IP Frameworks
10. WHO International Standard Terminologies in Ayurveda
11. National Biodiversity Authority (NBA)
12. Access and Benefit Sharing (ABS) Regulations

Outputs:
- data/raw/<source>/
- data/processed/{json,jsonl,markdown,csv}/
- data/chunks/
- metadata/terminology.jsonl (EN, Sanskrit, Hindi, Telugu, Tamil)
- evaluation/questions.jsonl (300+ multilingual benchmark questions)
- reports/{source_inventory.csv, data_statistics.json, data_quality_report.json}
- DATA_PIPELINE_README.md
"""
from __future__ import annotations

import os
import json
import hashlib
import csv
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional

BASE_DIR = Path("c:/project/ip_sakti1")
DATA_DIR = BASE_DIR / "data"
RAW_DIR = DATA_DIR / "raw"
PROCESSED_DIR = DATA_DIR / "processed"
CHUNKS_DIR = DATA_DIR / "chunks"
METADATA_DIR = BASE_DIR / "metadata"
EVALUATION_DIR = BASE_DIR / "evaluation"
REPORTS_DIR = BASE_DIR / "reports"

SOURCES = [
    "tkdl",
    "api",
    "afi",
    "india_code",
    "drugs_cosmetics_act",
    "drugs_cosmetics_rules",
    "ip_india",
    "gi_registry",
    "wipo",
    "who_terminology",
    "nba",
    "abs",
]

def ensure_directories():
    """Create all required directory structures without modifying existing raw files."""
    for s in SOURCES:
        (RAW_DIR / s).mkdir(parents=True, exist_ok=True)
    
    (PROCESSED_DIR / "json").mkdir(parents=True, exist_ok=True)
    (PROCESSED_DIR / "jsonl").mkdir(parents=True, exist_ok=True)
    (PROCESSED_DIR / "markdown").mkdir(parents=True, exist_ok=True)
    (PROCESSED_DIR / "csv").mkdir(parents=True, exist_ok=True)
    CHUNKS_DIR.mkdir(parents=True, exist_ok=True)
    METADATA_DIR.mkdir(parents=True, exist_ok=True)
    EVALUATION_DIR.mkdir(parents=True, exist_ok=True)
    REPORTS_DIR.mkdir(parents=True, exist_ok=True)

def compute_hash(text: str) -> str:
    return hashlib.sha256(text.strip().encode("utf-8")).hexdigest()

def create_unified_document(
    doc_id: str,
    title: str,
    source: str,
    source_type: str,
    document_type: str,
    domain: str,
    subdomain: str,
    jurisdiction: str,
    authority: str,
    language: str,
    original_language: str,
    year: Optional[int],
    publication_date: Optional[str],
    effective_date: Optional[str],
    section: str,
    chapter: str,
    rule: str,
    clause: str,
    page: Optional[int],
    topic: List[str],
    keywords: List[str],
    entities: List[str],
    ingredients: List[str],
    botanical_names: List[str],
    ip_type: str,
    medicine_system: str,
    formulation: str,
    legal_status: str,
    access_status: str,
    text: str,
    source_url: str,
) -> Dict[str, Any]:
    return {
        "document_id": doc_id,
        "chunk_id": "",
        "title": title,
        "source": source,
        "source_type": source_type,
        "document_type": document_type,
        "domain": domain,
        "subdomain": subdomain,
        "jurisdiction": jurisdiction,
        "authority": authority,
        "language": language,
        "original_language": original_language,
        "year": year,
        "publication_date": publication_date,
        "effective_date": effective_date,
        "section": section,
        "chapter": chapter,
        "rule": rule,
        "clause": clause,
        "page": page,
        "topic": topic,
        "keywords": keywords,
        "entities": entities,
        "ingredients": ingredients,
        "botanical_names": botanical_names,
        "ip_type": ip_type,
        "medicine_system": medicine_system,
        "formulation": formulation,
        "legal_status": legal_status,
        "access_status": access_status,
        "text": text.strip(),
        "source_url": source_url,
        "retrieved_at": datetime.utcnow().isoformat() + "Z",
        "content_hash": compute_hash(text),
    }

print("Knowledge Pipeline Builder script scaffold ready.")
