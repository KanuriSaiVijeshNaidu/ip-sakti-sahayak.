"""
backend/app/ingestion/ingest_international.py
─────────────────────────────────────────────
Phase 2 Ingestion pipeline for international patent documents (USA, Europe, Germany, WIPO).
Implements SHA-256 verification, section-aware chunking, metadata enrichment, and deduplication.
"""
import hashlib
import json
import os
import re
from pathlib import Path
from typing import Dict, List, Any

BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent
RAW_INT_DIR = BASE_DIR / "data" / "raw" / "international"
PROCESSED_INT_DIR = BASE_DIR / "data" / "processed" / "international"
CHUNKS_INT_DIR = BASE_DIR / "data" / "chunks" / "international"
MASTER_CHUNKS_FILE = BASE_DIR / "data" / "chunks" / "chunks.jsonl"

DOCUMENTS_CONFIG = [
    {
        "file_path": RAW_INT_DIR / "usa" / "uspto_patent_statutes_and_mpep.txt",
        "doc_id": "US-PATENT-STATUTES-MPEP",
        "title": "United States Patent Code (35 U.S.C. 101, 102, 103) & MPEP Examination Guidelines",
        "authority": "United States Patent and Trademark Office (USPTO)",
        "jurisdiction": "US",
        "source_url": "https://www.uspto.gov/patents/laws-and-regulations",
        "domain": "patents",
        "prefix": "US-PATENT"
    },
    {
        "file_path": RAW_INT_DIR / "usa" / "lanham_act_trademarks_uspto.txt",
        "doc_id": "US-LANHAM-TRADEMARKS-USPTO",
        "title": "United States Trademark Statutes (15 U.S.C. Lanham Act) & USPTO Examination Standards",
        "authority": "United States Patent and Trademark Office (USPTO)",
        "jurisdiction": "US",
        "source_url": "https://www.uspto.gov/trademarks",
        "domain": "trademarks",
        "prefix": "US-TM"
    },
    {
        "file_path": RAW_INT_DIR / "usa" / "fda_dshea_dietary_supplements.txt",
        "doc_id": "US-FDA-DSHEA-SUPPLEMENTS",
        "title": "U.S. FDA Dietary Supplement Health and Education Act (DSHEA 1994 & 21 CFR Part 111)",
        "authority": "U.S. Food and Drug Administration (FDA)",
        "jurisdiction": "US",
        "source_url": "https://www.fda.gov/food/dietary-supplements",
        "domain": "ayush",
        "prefix": "US-FDA"
    },
    {
        "file_path": RAW_INT_DIR / "europe" / "epc_articles_and_guidelines.txt",
        "doc_id": "EP-EPC-ARTICLES-GUIDELINES",
        "title": "European Patent Convention (EPC Articles 52, 53, 54, 56) & EPO Guidelines",
        "authority": "European Patent Office (EPO)",
        "jurisdiction": "EU",
        "source_url": "https://www.epo.org/en/legal/epc",
        "domain": "patents",
        "prefix": "EP-PATENT"
    },
    {
        "file_path": RAW_INT_DIR / "germany" / "dpma_german_patent_act.txt",
        "doc_id": "DE-DPMA-PATG",
        "title": "German Patent Act (Patentgesetz - PatG) & DPMA Examination Standards",
        "authority": "Deutsches Patent- und Markenamt (DPMA)",
        "jurisdiction": "DE",
        "source_url": "https://www.gesetze-im-internet.de/patg/",
        "domain": "patents",
        "prefix": "DE-PATENT"
    },
    {
        "file_path": RAW_INT_DIR / "wipo" / "pct_articles_and_wipo_tk_framework.txt",
        "doc_id": "WIPO-PCT-TREATY-TK",
        "title": "Patent Cooperation Treaty (PCT Articles 8, 33) & WIPO Genetic Resources Treaty (2024)",
        "authority": "World Intellectual Property Organization (WIPO)",
        "jurisdiction": "WO",
        "source_url": "https://www.wipo.int/pct/en/",
        "domain": "patents",
        "prefix": "WIPO-PCT"
    },
]


def sha256_hash(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def split_into_sections(text: str) -> List[Dict[str, str]]:
    """Split text on '## Section' boundaries."""
    sections = []
    chunks = re.split(r"(?m)^##\s+", text)
    for c in chunks:
        c = c.strip()
        if not c or c.startswith("# USPTO") or c.startswith("# European") or c.startswith("# German") or c.startswith("# Patent"):
            continue
        lines = c.split("\n", 1)
        title = lines[0].strip()
        body = lines[1].strip() if len(lines) > 1 else ""
        sections.append({"title": title, "content": f"{title}\n\n{body}"})
    return sections


def run_international_ingestion():
    os.makedirs(PROCESSED_INT_DIR, exist_ok=True)
    os.makedirs(CHUNKS_INT_DIR, exist_ok=True)

    int_chunks: List[Dict[str, Any]] = []

    for cfg in DOCUMENTS_CONFIG:
        if not cfg["file_path"].exists():
            print(f"File not found: {cfg['file_path']}")
            continue

        with open(cfg["file_path"], "r", encoding="utf-8") as f:
            raw_text = f.read()

        doc_hash = sha256_hash(raw_text)
        sections = split_into_sections(raw_text)

        processed_doc = {
            "document_id": cfg["doc_id"],
            "title": cfg["title"],
            "authority": cfg["authority"],
            "jurisdiction": cfg["jurisdiction"],
            "domain": cfg["domain"],
            "source_url": cfg["source_url"],
            "document_hash": doc_hash,
            "section_count": len(sections),
            "sections": sections
        }

        # Save processed JSON
        processed_file = PROCESSED_INT_DIR / f"{cfg['doc_id'].lower()}.json"
        with open(processed_file, "w", encoding="utf-8") as f:
            json.dump(processed_doc, f, indent=2, ensure_ascii=False)

        # Generate structure-aware chunks
        for idx, sec in enumerate(sections):
            chunk_id = f"{cfg['prefix']}-{cfg['jurisdiction']}-{idx + 1:03d}-{doc_hash[:8]}"
            chunk_text = sec["content"]
            token_count = len(chunk_text.split())

            chunk_obj = {
                "id": chunk_id,
                "text": chunk_text,
                "section_title": sec["title"],
                "chunk_index": idx,
                "token_count": token_count,
                "source_title": cfg["title"],
                "source_url": cfg["source_url"],
                "authority": cfg["authority"],
                "domain": cfg["domain"],
                "jurisdiction": cfg["jurisdiction"],
                "corpus_version": "v2.0-international",
                "language": "en",
                "page_number": idx + 1,
                "sha256": sha256_hash(chunk_text)
            }
            int_chunks.append(chunk_obj)

    # 1. Write data/chunks/international/chunks.jsonl
    int_chunks_path = CHUNKS_INT_DIR / "chunks.jsonl"
    with open(int_chunks_path, "w", encoding="utf-8") as f:
        for c in int_chunks:
            f.write(json.dumps(c, ensure_ascii=False) + "\n")
    print(f"Generated {len(int_chunks)} international structure-aware chunks at {int_chunks_path}")

    # 2. Append non-duplicate chunks into data/chunks/chunks.jsonl
    existing_ids = set()
    if MASTER_CHUNKS_FILE.exists():
        with open(MASTER_CHUNKS_FILE, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line:
                    data = json.loads(line)
                    existing_ids.add(data.get("id"))

    added_count = 0
    with open(MASTER_CHUNKS_FILE, "a", encoding="utf-8") as f:
        for c in int_chunks:
            if c["id"] not in existing_ids:
                f.write(json.dumps(c, ensure_ascii=False) + "\n")
                existing_ids.add(c["id"])
                added_count += 1

    print(f"Merged {added_count} new chunks into master {MASTER_CHUNKS_FILE}")

    # 3. Synchronize all chunks with SQLite and FAISS
    try:
        import asyncio
        from backend.app.ingestion.docling_pipeline import update_sqlite_and_faiss
        all_chunks = []
        with open(MASTER_CHUNKS_FILE, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line:
                    all_chunks.append(json.loads(line))
        asyncio.run(update_sqlite_and_faiss(all_chunks))
        print(f"Synchronized {len(all_chunks)} chunks into SQLite and FAISS.")
    except Exception as e:
        print(f"SQLite/FAISS sync warning: {e}")

    return len(int_chunks)


if __name__ == "__main__":
    run_international_ingestion()
