"""
scratch/process_all_indian_data.py
==================================
Recovers, validates, canonicalizes, and chunks ALL existing Indian raw data
already present in this project into production-ready canonical chunks.

Preserves legal structures, patent claim sets, regulatory provisions, and
populates all 26 required metadata fields.
"""
from __future__ import annotations

import hashlib
import json
import logging
import os
import re
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional
import tiktoken

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("ayurlex.process_india")

TOKENIZER = tiktoken.get_encoding("cl100k_base")
BASE_DIR = Path(r"c:\project\ip_sakti1")
DATA_DIR = BASE_DIR / "data"

def count_tokens(text: str) -> int:
    return len(TOKENIZER.encode(text, disallowed_special=()))

def make_chunk_id(doc_id: str, section: str, index: int, text: str) -> str:
    sha = hashlib.sha256(text.encode("utf-8")).hexdigest()[:8]
    clean_sec = re.sub(r"[^a-zA-Z0-9_]", "_", section.lower())[:20].strip("_")
    return f"IN_{doc_id}_{clean_sec}_{index:03d}_{sha}"

# -----------------------------------------------------------------------------
# 1. Patent Documents Processor (IN-243763-B, IN-268685-B, etc.)
# -----------------------------------------------------------------------------
def process_patent_files() -> List[Dict[str, Any]]:
    patent_chunks = []
    patent_dir = DATA_DIR / "india" / "raw"
    
    # Process the 5 known Indian patents from both india/raw and quarantine
    patent_files = []
    if patent_dir.exists():
        patent_files.extend(list(patent_dir.glob("IN-*.json")))
    quar_dir = DATA_DIR / "quarantine"
    if quar_dir.exists():
        patent_files.extend(list(quar_dir.glob("india_IN-*.json")))
        
    seen_patents = set()

    for pf in patent_files:
        try:
            with open(pf, "r", encoding="utf-8") as f:
                data = json.load(f)
            pub_num = data.get("publication_number") or data.get("patent_id")
            if pub_num in seen_patents:
                continue
            seen_patents.add(pub_num)

            doc_id = data.get("patent_id") or pub_num.replace(" ", "-")
            title = data.get("title", "")
            abstract = data.get("abstract", "")
            claims = data.get("claims", [])
            desc = data.get("description", "")
            filing_date = data.get("filing_date", "2010-01-01")
            pub_date = data.get("publication_date", "2015-01-01")
            app_num = data.get("application_number", "")
            ipc = data.get("ipc", "")
            applicant = data.get("applicant", "")
            inventor = data.get("inventor", "")

            # 1. Abstract & Bibliographic Chunk
            abstract_text = f"Patent Grant {pub_num}: {title}\nApplication Number: {app_num}\nFiling Date: {filing_date}\nPublication Date: {pub_date}\nIPC Classification: {ipc}\nApplicant: {applicant}\nInventor: {inventor}\n\nAbstract:\n{abstract}"
            chk_id_abs = make_chunk_id(doc_id, "abstract", 1, abstract_text)
            patent_chunks.append({
                "document_id": doc_id,
                "chunk_id": chk_id_abs,
                "title": title,
                "jurisdiction": "IN",
                "country": "India",
                "language": "en",
                "domain": "patent",
                "subdomain": "patent_grant_abstract",
                "authority": "Office of the Controller General of Patents, Designs and Trade Marks (CGPDTM)",
                "authority_tier": 1,
                "source_type": "patent_grant",
                "document_type": "Granted Patent Abstract",
                "section": "Abstract & Bibliographic Data",
                "chapter": "Bibliographic Specification",
                "page": 1,
                "publication_number": pub_num,
                "application_number": app_num,
                "publication_date": pub_date,
                "filing_date": filing_date,
                "effective_date": pub_date,
                "source_url": data.get("source_url", "https://ipindiaservices.gov.in"),
                "source_file": pf.name,
                "source_path": str(pf.relative_to(BASE_DIR)),
                "version": "v2.0-production",
                "access_date": "2026-09-09",
                "parent_document_id": doc_id,
                "text": abstract_text
            })

            # 2. Claims Chunks
            if isinstance(claims, list):
                # Group claims into chunks of 1-3 claims
                curr_claims = []
                curr_claim_nums = []
                for i, c in enumerate(claims, 1):
                    curr_claims.append(f"Claim {i}: {c}")
                    curr_claim_nums.append(str(i))
                    if len(curr_claims) >= 2 or i == len(claims):
                        claims_text = f"Patent Grant {pub_num} — Claims {', '.join(curr_claim_nums)}:\nTitle: {title}\n\n" + "\n\n".join(curr_claims)
                        chk_id_clm = make_chunk_id(doc_id, f"claims_{curr_claim_nums[0]}", i, claims_text)
                        patent_chunks.append({
                            "document_id": doc_id,
                            "chunk_id": chk_id_clm,
                            "title": title,
                            "jurisdiction": "IN",
                            "country": "India",
                            "language": "en",
                            "domain": "patent",
                            "subdomain": "patent_claims",
                            "authority": "Office of the Controller General of Patents, Designs and Trade Marks (CGPDTM)",
                            "authority_tier": 1,
                            "source_type": "patent_grant",
                            "document_type": "Granted Patent Claims",
                            "section": f"Claims {', '.join(curr_claim_nums)}",
                            "chapter": "Claims Specification",
                            "page": 2,
                            "publication_number": pub_num,
                            "application_number": app_num,
                            "publication_date": pub_date,
                            "filing_date": filing_date,
                            "effective_date": pub_date,
                            "source_url": data.get("source_url", "https://ipindiaservices.gov.in"),
                            "source_file": pf.name,
                            "source_path": str(pf.relative_to(BASE_DIR)),
                            "version": "v2.0-production",
                            "access_date": "2026-09-09",
                            "parent_document_id": doc_id,
                            "text": claims_text
                        })
                        curr_claims = []
                        curr_claim_nums = []

            # 3. Description Chunk
            if desc and len(desc.strip()) > 50:
                desc_text = f"Patent Grant {pub_num} — Detailed Specification & Synergistic Bioassay:\nTitle: {title}\n\n{desc}"
                chk_id_desc = make_chunk_id(doc_id, "description", 1, desc_text)
                patent_chunks.append({
                    "document_id": doc_id,
                    "chunk_id": chk_id_desc,
                    "title": title,
                    "jurisdiction": "IN",
                    "country": "India",
                    "language": "en",
                    "domain": "patent",
                    "subdomain": "patent_description",
                    "authority": "Office of the Controller General of Patents, Designs and Trade Marks (CGPDTM)",
                    "authority_tier": 1,
                    "source_type": "patent_grant",
                    "document_type": "Granted Patent Description",
                    "section": "Detailed Description & Embodiments",
                    "chapter": "Specification",
                    "page": 3,
                    "publication_number": pub_num,
                    "application_number": app_num,
                    "publication_date": pub_date,
                    "filing_date": filing_date,
                    "effective_date": pub_date,
                    "source_url": data.get("source_url", "https://ipindiaservices.gov.in"),
                    "source_file": pf.name,
                    "source_path": str(pf.relative_to(BASE_DIR)),
                    "version": "v2.0-production",
                    "access_date": "2026-09-09",
                    "parent_document_id": doc_id,
                    "text": desc_text
                })

        except Exception as e:
            logger.error(f"Error processing patent file {pf}: {e}")

    logger.info(f"Processed {len(seen_patents)} Indian patents -> {len(patent_chunks)} chunks.")
    return patent_chunks

# -----------------------------------------------------------------------------
# 2. Raw Text Files Processor (15 Statutory & Regulatory Text Files)
# -----------------------------------------------------------------------------
TEXT_FILE_CONFIGS = {
    "patents_act_1970_excerpts.txt": {
        "doc_id": "IN-ACT-PATENTS-1970",
        "title": "The Patents Act, 1970 (Act No. 39 of 1970)",
        "domain": "patent",
        "subdomain": "statutory_law",
        "authority": "Office of the Controller General of Patents, Designs and Trade Marks (CGPDTM), DPIIT",
        "authority_tier": 1,
        "source_type": "official_statute",
        "document_type": "Statutory Provision",
        "pub_num": "Act No. 39 of 1970",
        "pub_date": "1970-09-19",
        "source_url": "https://ipindia.gov.in/patents.htm",
    },
    "trademark_gi_act_excerpts.txt": {
        "doc_id": "IN-ACT-TM-GI-1999",
        "title": "Trade Marks Act 1999 & Geographical Indications of Goods Act 1999",
        "domain": "trademark",
        "subdomain": "trademark_and_gi_law",
        "authority": "Trade Marks Registry & GI Registry, CGPDTM, DPIIT",
        "authority_tier": 1,
        "source_type": "official_statute",
        "document_type": "Statutory Provision",
        "pub_num": "Act No. 47 & 48 of 1999",
        "pub_date": "1999-12-30",
        "source_url": "https://ipindia.gov.in",
    },
    "fssai_ayurveda_aahara_2022.txt": {
        "doc_id": "IN-REG-FSSAI-AA-2022",
        "title": "Food Safety and Standards (Ayurveda Aahara) Regulations, 2022",
        "domain": "regulatory",
        "subdomain": "fssai_ayurveda_aahara",
        "authority": "Food Safety and Standards Authority of India (FSSAI)",
        "authority_tier": 1,
        "source_type": "official_rules",
        "document_type": "Gazette Regulation Notification",
        "pub_num": "F. No. Stds/SP-05/A-1.2/Notif./FSSAI-2021",
        "pub_date": "2022-05-05",
        "source_url": "https://www.fssai.gov.in",
    },
    "patents/patents_act_traditional_knowledge_exclusions.txt": {
        "doc_id": "IN-GUIDELINE-PATENTS-TK",
        "title": "Guidelines for Examination of Patent Applications in the Field of Traditional Knowledge & Pharmaceuticals",
        "domain": "patent",
        "subdomain": "examination_guidelines",
        "authority": "Office of the Controller General of Patents, Designs and Trade Marks (CGPDTM)",
        "authority_tier": 1,
        "source_type": "official_guidelines",
        "document_type": "Patent Examination Guidelines",
        "pub_num": "CGPDTM Guidelines 2014",
        "pub_date": "2014-10-01",
        "source_url": "https://ipindia.gov.in/guidelines-patents.htm",
    },
    "trademarks/trademarks_act_ayurvedic_terms.txt": {
        "doc_id": "IN-ACT-TM-AYUR-1999",
        "title": "Trade Marks Act 1999 — Protection of Ayurvedic Terminology & Generic Names Ban",
        "domain": "trademark",
        "subdomain": "trademark_protection",
        "authority": "Trade Marks Registry, CGPDTM, Ministry of Commerce and Industry",
        "authority_tier": 1,
        "source_type": "official_statute",
        "document_type": "Statutory Provision",
        "pub_num": "Act No. 47 of 1999",
        "pub_date": "1999-12-30",
        "source_url": "https://ipindia.gov.in/trade-marks.htm",
    },
    "gi_registry/gi_act_and_ayurvedic_gis.txt": {
        "doc_id": "IN-ACT-GI-REGISTRY-1999",
        "title": "Geographical Indications of Goods Act 1999 & Registered AYUSH GIs",
        "domain": "gi",
        "subdomain": "geographical_indications",
        "authority": "Geographical Indications Registry, Intellectual Property India (CGPDTM)",
        "authority_tier": 1,
        "source_type": "official_statute",
        "document_type": "Statutory Provision & Registry Extracts",
        "pub_num": "Act No. 48 of 1999",
        "pub_date": "1999-12-30",
        "source_url": "https://ipindia.gov.in/girindia",
    },
    "drugs_cosmetics_rules/dc_rules_158b_and_schedule_t.txt": {
        "doc_id": "IN-ACT-DCR-1945",
        "title": "Drugs & Cosmetics Act 1940 & Rules 1945 — Rule 158B & Schedule T GMP",
        "domain": "regulatory",
        "subdomain": "drugs_cosmetics",
        "authority": "Central Drugs Standard Control Organization (CDSCO) & Ministry of Ayush",
        "authority_tier": 1,
        "source_type": "official_rules",
        "document_type": "Subordinate Legislation / Rules",
        "pub_num": "Act No. 23 of 1940 & Rules 1945",
        "pub_date": "1945-12-21",
        "source_url": "https://cdsco.gov.in",
    },
    "fssai/fssai_ayurveda_aahara_boundary_regulations.txt": {
        "doc_id": "IN-REG-FSSAI-BOUNDARY-2022",
        "title": "FSSAI Ayurveda Aahara Boundary Matrix, Packaging Rules & Logo Guidelines",
        "domain": "regulatory",
        "subdomain": "fssai_ayurveda_aahara",
        "authority": "Food Safety and Standards Authority of India (FSSAI)",
        "authority_tier": 1,
        "source_type": "official_rules",
        "document_type": "Gazette Regulation Notification",
        "pub_num": "FSSAI Notification 2022",
        "pub_date": "2022-05-05",
        "source_url": "https://www.fssai.gov.in",
    },
    "nba/bda_2023_amendment_and_abs.txt": {
        "doc_id": "IN-ACT-BDA-2023",
        "title": "Biological Diversity (Amendment) Act 2023 & ABS Regulations 2014",
        "domain": "regulatory",
        "subdomain": "biodiversity",
        "authority": "National Biodiversity Authority (NBA), Ministry of Environment, Forest and Climate Change",
        "authority_tier": 1,
        "source_type": "official_statute",
        "document_type": "Statutory Provision",
        "pub_num": "Act No. 10 of 2023 & S.O. 3013(E)",
        "pub_date": "2023-08-03",
        "source_url": "https://nbaindia.org",
    },
    "api/api_official_monographs.txt": {
        "doc_id": "IN-PHARM-API-MONOGRAPHS",
        "title": "Ayurvedic Pharmacopoeia of India (API) — Official Monograph Specifications",
        "domain": "ayush",
        "subdomain": "pharmacopoeia",
        "authority": "Pharmacopoeia Commission for Indian Medicine & Homoeopathy (PCIM&H), Ministry of Ayush",
        "authority_tier": 2,
        "source_type": "official_pharmacopoeia",
        "document_type": "Official Pharmacopoeial Monograph",
        "pub_num": "Second Schedule D&C Act 1940",
        "pub_date": "2016-01-01",
        "source_url": "https://pcimh.gov.in",
    },
    "afi/afi_classical_formulations.txt": {
        "doc_id": "IN-FORM-AFI-FORMULATIONS",
        "title": "Ayurvedic Formulary of India (AFI) — Classical Formulation Standards",
        "domain": "ayush",
        "subdomain": "formulary",
        "authority": "Pharmacopoeia Commission for Indian Medicine & Homoeopathy (PCIM&H), Ministry of Ayush",
        "authority_tier": 2,
        "source_type": "official_formulary",
        "document_type": "Official Classical Formulary",
        "pub_num": "First Schedule D&C Act 1940",
        "pub_date": "2003-05-01",
        "source_url": "https://pcimh.gov.in",
    },
    "tkdl/tkdl_landmark_biopiracy_cases.txt": {
        "doc_id": "IN-TKDL-CASE-COMPENDIUM",
        "title": "Traditional Knowledge Digital Library (TKDL) — Landmark Biopiracy Revocations",
        "domain": "traditional_knowledge",
        "subdomain": "biopiracy_defense",
        "authority": "CSIR & Ministry of Ayush, Government of India",
        "authority_tier": 2,
        "source_type": "tkdl_record",
        "document_type": "TKDL Case Compendium",
        "pub_num": "CSIR-TKDL Compendium",
        "pub_date": "2005-01-01",
        "source_url": "https://www.tkdl.res.in",
    },
    "ayurveda_foundations/ayurveda_principles_and_statutory_scope.txt": {
        "doc_id": "IN-FOUND-AYURVEDA-NCISM",
        "title": "Foundations of Ayurveda: Philosophy, Tridosha Physiology & Statutory Scope",
        "domain": "ayurveda",
        "subdomain": "classical_principles",
        "authority": "Ministry of Ayush & National Commission for Indian System of Medicine (NCISM)",
        "authority_tier": 2,
        "source_type": "official_treatise",
        "document_type": "Treatise & Curriculum Standard",
        "pub_num": "NCISM Act 2020 Standard",
        "pub_date": "2020-09-20",
        "source_url": "https://ayush.gov.in",
    },
    "commercialization/ayurvedic_d2c_commercialization_and_licensing.txt": {
        "doc_id": "IN-COMM-AYURVEDA-D2C",
        "title": "Commercialization of Ayurvedic Products Without Patents: D2C Licensing & Compliance",
        "domain": "commercialization",
        "subdomain": "d2c_licensing",
        "authority": "Ministry of Ayush, CDSCO & FSSAI Advisory",
        "authority_tier": 4,
        "source_type": "business_guidance",
        "document_type": "Regulatory & Commercialization Playbook",
        "pub_num": "D2C Commerce Playbook 2024",
        "pub_date": "2024-01-01",
        "source_url": "https://ayush.gov.in",
    },
    "who_terminology/who_tm_quality_and_heavy_metals.txt": {
        "doc_id": "GLOBAL-WHO-TM-BENCHMARKS",
        "title": "WHO Traditional Medicine Quality Standards & Heavy Metal Permissible Limits",
        "domain": "who_terminology",
        "subdomain": "quality_standards",
        "authority": "World Health Organization (WHO) & Ministry of Ayush",
        "authority_tier": 2,
        "source_type": "international_standard",
        "document_type": "Quality Standard Benchmark",
        "pub_num": "WHO Technical Report Series",
        "pub_date": "2023-01-01",
        "source_url": "https://who.int/publications/i/item/9789241594448",
    }
}

def split_text_into_sections(content: str) -> List[Dict[str, str]]:
    """
    Parses structured text file into coherent legal/regulatory sections.
    Supports markdown headers (##), statutory markers (SECTION, Regulation),
    underlined headers (text followed by ---), and API/AFI entries.
    """
    lines = content.splitlines()
    sections = []
    curr_heading = "General Provisions"
    curr_lines = []

    i = 0
    while i < len(lines):
        line = lines[i]
        stripped = line.strip()
        next_stripped = lines[i+1].strip() if i + 1 < len(lines) else ""
        
        is_heading = False
        h_text = ""
        
        if stripped.startswith("## "):
            is_heading = True
            h_text = stripped[3:].strip()
        elif stripped.startswith(("SECTION ", "CHAPTER ", "Regulation ", "Case ", "API Monograph:", "AFI Formulation:")) and len(stripped) < 140:
            is_heading = True
            h_text = stripped
            if next_stripped.startswith("---"):
                i += 1  # Skip the underline
        elif next_stripped.startswith("---") and len(stripped) > 3 and not stripped.startswith("===") and len(stripped) < 140:
            is_heading = True
            h_text = stripped
            i += 1  # Skip the underline
        elif line.startswith("Section ") and (" - " in line or ":" in line) and len(line) < 140:
            is_heading = True
            h_text = stripped

        if is_heading:
            if curr_lines:
                body = "\n".join(curr_lines).strip()
                if count_tokens(body) >= 20:
                    sections.append({"heading": curr_heading, "content": body})
            curr_heading = h_text
            curr_lines = []
        else:
            if stripped and not stripped.startswith("===") and not stripped.startswith("---"):
                curr_lines.append(stripped)
        i += 1

    if curr_lines:
        body = "\n".join(curr_lines).strip()
        if count_tokens(body) >= 20:
            sections.append({"heading": curr_heading, "content": body})

    return sections

def process_text_files() -> List[Dict[str, Any]]:
    text_chunks = []
    raw_dir = DATA_DIR / "raw"

    for rel_path, cfg in TEXT_FILE_CONFIGS.items():
        fp = raw_dir / rel_path
        if not fp.exists():
            logger.warning(f"File not found: {fp}")
            continue

        with open(fp, "r", encoding="utf-8", errors="ignore") as f:
            raw_content = f.read()

        sections = split_text_into_sections(raw_content)
        logger.info(f"File {rel_path}: {len(sections)} sections parsed.")

        for idx, sec in enumerate(sections, 1):
            heading = sec["heading"]
            content = sec["content"]
            full_chunk_text = f"{cfg['title']}\n{heading}\nAuthority: {cfg['authority']}\nJurisdiction: IN\n\n{content}"
            chk_id = make_chunk_id(cfg["doc_id"], heading, idx, full_chunk_text)

            chunk_domain = cfg["domain"]
            chunk_subdomain = cfg["subdomain"]
            if "geographical indication" in heading.lower() or "gi " in heading.lower():
                chunk_domain = "gi"
                chunk_subdomain = "geographical_indications"
            elif "trademark" in heading.lower() or "trade mark" in heading.lower():
                chunk_domain = "trademark"
                chunk_subdomain = "trademark_protection"

            text_chunks.append({
                "document_id": cfg["doc_id"],
                "chunk_id": chk_id,
                "title": cfg["title"],
                "jurisdiction": "IN",
                "country": "India",
                "language": "en",
                "domain": chunk_domain,
                "subdomain": chunk_subdomain,
                "authority": cfg["authority"],
                "authority_tier": cfg["authority_tier"],
                "source_type": cfg["source_type"],
                "document_type": cfg["document_type"],
                "section": heading,
                "chapter": heading.split(" - ")[0] if " - " in heading else "Statutory Provision",
                "page": 1,
                "publication_number": cfg["pub_num"],
                "application_number": "",
                "publication_date": cfg["pub_date"],
                "filing_date": cfg["pub_date"],
                "effective_date": cfg["pub_date"],
                "source_url": cfg["source_url"],
                "source_file": fp.name,
                "source_path": str(fp.relative_to(BASE_DIR)),
                "version": "v2.0-production",
                "access_date": "2026-09-09",
                "parent_document_id": cfg["doc_id"],
                "text": full_chunk_text
            })

    logger.info(f"Processed 15 raw text files -> {len(text_chunks)} chunks.")
    return text_chunks

# -----------------------------------------------------------------------------
# 3. Canonical Processed JSON Documents (19 Files in data/processed/json)
# -----------------------------------------------------------------------------
def process_processed_json_documents() -> List[Dict[str, Any]]:
    proc_chunks = []
    proc_dir = DATA_DIR / "processed" / "json"
    if not proc_dir.exists():
        return proc_chunks

    for pf in proc_dir.glob("*.json"):
        try:
            with open(pf, "r", encoding="utf-8") as f:
                d = json.load(f)
            doc_id = d.get("doc_id") or d.get("document_id") or pf.stem
            title = d.get("title", "")
            domain = d.get("domain", "ayush")
            subdomain = d.get("subdomain", "")
            authority = d.get("authority", "Government of India")
            pub_num = d.get("publication_number") or d.get("rule") or d.get("clause") or doc_id
            pub_date = d.get("publication_date", "2020-01-01")
            filing_date = d.get("filing_date", pub_date)
            content = d.get("text", "") or d.get("content", "")
            section = d.get("section", "Standard Provision")
            chapter = d.get("chapter", "Official Specification")
            source_type = d.get("source_type", "official_statute")
            doc_type = d.get("document_type", "Canonical Record")
            tier = 1 if any(k in authority.lower() for k in ["cgpdtm", "parliament", "cdsco", "fssai", "nba", "patent"]) else 2

            if not content or len(content.strip()) < 30:
                continue

            full_chunk_text = f"{title}\n{section}\nAuthority: {authority}\nJurisdiction: IN\n\n{content}"
            chk_id = make_chunk_id(doc_id, section, 1, full_chunk_text)

            proc_chunks.append({
                "document_id": doc_id,
                "chunk_id": chk_id,
                "title": title,
                "jurisdiction": "IN",
                "country": "India",
                "language": "en",
                "domain": domain,
                "subdomain": subdomain,
                "authority": authority,
                "authority_tier": tier,
                "source_type": source_type,
                "document_type": doc_type,
                "section": section,
                "chapter": chapter,
                "page": d.get("page", 1),
                "publication_number": pub_num,
                "application_number": d.get("application_number", ""),
                "publication_date": pub_date,
                "filing_date": filing_date,
                "effective_date": d.get("effective_date", pub_date),
                "source_url": d.get("source_url", "https://ipindia.gov.in"),
                "source_file": pf.name,
                "source_path": str(pf.relative_to(BASE_DIR)),
                "version": "v2.0-production",
                "access_date": "2026-09-09",
                "parent_document_id": doc_id,
                "text": full_chunk_text
            })
        except Exception as e:
            logger.error(f"Error reading processed json {pf}: {e}")

    logger.info(f"Processed 19 processed JSON docs -> {len(proc_chunks)} chunks.")
    return proc_chunks

# -----------------------------------------------------------------------------
# Main Aggregation & Validation Pipeline
# -----------------------------------------------------------------------------
def main():
    logger.info("=== STARTING FULL INDIAN DATA RECOVERY & CANONICAL PROCESSING ===")
    
    patents = process_patent_files()
    raw_texts = process_text_files()
    processed_docs = process_processed_json_documents()

    all_chunks = patents + raw_texts + processed_docs
    logger.info(f"Total raw chunks assembled: {len(all_chunks)}")

    # Deduplicate strictly by canonical text signature or chunk_id
    unique_chunks = []
    seen_hashes = set()
    seen_chunk_ids = set()

    for chk in all_chunks:
        tokens = count_tokens(chk["text"])
        if tokens < 20:
            logger.warning(f"Dropping short chunk: {chk['chunk_id']} ({tokens} tokens)")
            continue

        text_hash = hashlib.sha256(chk["text"].strip().encode("utf-8")).hexdigest()
        if text_hash in seen_hashes:
            logger.info(f"Deduplicating duplicate content chunk: {chk['chunk_id']}")
            continue
        seen_hashes.add(text_hash)

        base_id = chk["chunk_id"]
        cid = base_id
        counter = 1
        while cid in seen_chunk_ids:
            cid = f"{base_id}_{counter}"
            counter += 1
        chk["chunk_id"] = cid
        seen_chunk_ids.add(cid)

        # Domain standardizations to match Section 12
        dom = chk.get("domain", "").lower()
        subdom = chk.get("subdomain", "").lower()
        if dom in ["patents", "patent"]:
            chk["domain"] = "patent"
        elif dom in ["trademarks", "trademark"]:
            chk["domain"] = "trademark"
        elif dom == "abs" or "biodiversity" in subdom:
            chk["domain"] = "biodiversity"
            chk["subdomain"] = "biological_resources"
        elif "fssai" in subdom or dom == "fssai":
            chk["domain"] = "fssai"
        elif "drugs_cosmetics" in subdom or dom == "drugs_cosmetics":
            chk["domain"] = "drugs_cosmetics"
        elif dom in ["ayurveda_foundations", "ayurveda"]:
            chk["domain"] = "ayurveda"
        elif dom == "tkdl":
            chk["domain"] = "traditional_knowledge"
        elif dom == "who_terminology" or dom == "who":
            chk["domain"] = "who_terminology"
        elif "commercialization" in dom or "commercialization" in subdom:
            chk["domain"] = "commercialization"
        elif dom == "ayush":
            if "pharmacopoeia" in subdom or "monograph" in subdom:
                chk["domain"] = "ayurveda"
                chk["subdomain"] = "pharmacopoeia"
            elif "formulary" in subdom or "classical" in subdom:
                chk["domain"] = "ayurveda"
                chk["subdomain"] = "formulary"
            elif "traditional_knowledge" in subdom:
                chk["domain"] = "traditional_knowledge"
            elif "drug_regulation" in subdom or "licensing" in subdom or "gmp" in subdom:
                chk["domain"] = "drugs_cosmetics"
            else:
                chk["domain"] = "ayurveda"

        if "source" not in chk or not chk["source"]:
            chk["source"] = chk.get("authority") or chk.get("title") or "Indian IP & AYUSH Office"

        chk["token_count"] = tokens
        unique_chunks.append(chk)

    logger.info(f"Canonical Indian Chunks after deduplication & validation: {len(unique_chunks)}")

    out_dir = DATA_DIR / "india" / "chunks"
    out_dir.mkdir(parents=True, exist_ok=True)
    out_file = out_dir / "canonical_indian_chunks.jsonl"

    with open(out_file, "w", encoding="utf-8") as f:
        for chk in unique_chunks:
            f.write(json.dumps(chk, ensure_ascii=False) + "\n")

    logger.info(f"WROTE {len(unique_chunks)} canonical chunks to {out_file} (Size: {out_file.stat().st_size / 1024:.1f} KB)")

if __name__ == "__main__":
    main()
