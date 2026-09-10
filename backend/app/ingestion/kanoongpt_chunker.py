"""
backend/app/ingestion/kanoongpt_chunker.py
──────────────────────────────────────────
Structure-aware legal chunker for KanoonGPT Indian Legal Documents.
Preserves Act -> Chapter -> Section / Rule / Clause legal hierarchy.
Attaches full provenance metadata with authority_tier=2 and authority_level="SECONDARY_DATASET".
"""
from __future__ import annotations

import re
import json
import hashlib
from pathlib import Path
from typing import Dict, List, Any, Optional

SECTION_REGEX = re.compile(
    r"(?:\n|^)(?:CHAPTER\s+([IVXLCDM0-9]+)[^\n]*\n+)?(?:"
    r"Section\s+(\d+[A-Za-z]?)|"
    r"Rule\s+(\d+[A-Za-z]?)|"
    r"(\d+[A-Za-z]?)\.\s+"
    r")\s*[-–—:]?\s*([^\n]+)",
    re.IGNORECASE
)

def make_kanoon_chunk_id(doc_id: str, sec_label: str, chunk_idx: int, text: str) -> str:
    sha = hashlib.sha256(text.encode("utf-8")).hexdigest()[:8]
    clean_sec = re.sub(r"[^a-zA-Z0-9_]", "_", sec_label.lower())[:20].strip("_")
    clean_doc = re.sub(r"[^a-zA-Z0-9_]", "_", doc_id)[:25].strip("_")
    return f"IN_KANOON_{clean_doc}_{clean_sec}_{chunk_idx:03d}_{sha}"

def chunk_legal_document(doc: Dict[str, Any], max_chunk_chars: int = 1500) -> List[Dict[str, Any]]:
    title = doc.get("title", "").strip()
    raw_text = doc.get("full_text", "") or doc.get("text", "")
    authority = doc.get("authority", "Government of India")
    target_dom = doc.get("target_domain", "intellectual_property")
    doc_type = doc.get("doc_type", "statute")
    doc_id = str(doc.get("doc_id", "doc"))
    issue_date = doc.get("issue_date", "")

    # Determine ip_type
    ip_type_map = {
        "patent": "patent",
        "trademark": "trademark",
        "copyright": "copyright",
        "design": "design",
        "gi": "geographical_indication",
        "plant_variety": "plant_variety",
        "biodiversity": "biodiversity",
        "ayurveda_legislation": "ayurveda",
        "drug_regulation": "drug_regulation",
        "food_regulation": "food_regulation"
    }
    ip_type = ip_type_map.get(target_dom, "general_legal")

    # Clean text
    clean_text = re.sub(r"\r\n", "\n", raw_text)
    clean_text = re.sub(r"\n{3,}", "\n\n", clean_text).strip()

    # Split by legal sections if present
    matches = list(SECTION_REGEX.finditer(clean_text))
    chunks = []

    if len(matches) >= 3:
        # Structured act / rules with identifiable sections
        for i, match in enumerate(matches):
            chap = match.group(1) or ""
            sec_num = match.group(2) or match.group(3) or match.group(4) or f"{i+1}"
            sec_heading = match.group(5).strip()
            sec_label = f"Section {sec_num} - {sec_heading}" if "rule" not in doc_type.lower() else f"Rule {sec_num} - {sec_heading}"

            start_pos = match.start()
            end_pos = matches[i+1].start() if i + 1 < len(matches) else len(clean_text)
            body = clean_text[start_pos:end_pos].strip()

            if len(body) < 80:
                continue

            # Subchunk if section is exceptionally long (> 2000 chars)
            if len(body) > max_chunk_chars:
                paragraphs = body.split("\n\n")
                current_p = []
                current_len = 0
                part_idx = 1
                for p in paragraphs:
                    current_p.append(p)
                    current_len += len(p)
                    if current_len >= max_chunk_chars:
                        p_body = "\n\n".join(current_p)
                        header = f"{title}\n{sec_label} (Part {part_idx})\nAuthority: {authority}\nJurisdiction: India\n\n"
                        chunk_text = header + p_body
                        chk_id = make_kanoon_chunk_id(doc_id, f"sec_{sec_num}_p{part_idx}", len(chunks) + 1, chunk_text)
                        chunks.append(_build_chunk_record(doc, doc_id, chk_id, title, sec_label, chunk_text, ip_type, target_dom, authority, issue_date))
                        current_p = []
                        current_len = 0
                        part_idx += 1
                if current_p:
                    p_body = "\n\n".join(current_p)
                    header = f"{title}\n{sec_label} (Part {part_idx})\nAuthority: {authority}\nJurisdiction: India\n\n"
                    chunk_text = header + p_body
                    chk_id = make_kanoon_chunk_id(doc_id, f"sec_{sec_num}_p{part_idx}", len(chunks) + 1, chunk_text)
                    chunks.append(_build_chunk_record(doc, doc_id, chk_id, title, sec_label, chunk_text, ip_type, target_dom, authority, issue_date))
            else:
                header = f"{title}\n{sec_label}\nAuthority: {authority}\nJurisdiction: India\n\n"
                chunk_text = header + body
                chk_id = make_kanoon_chunk_id(doc_id, f"sec_{sec_num}", len(chunks) + 1, chunk_text)
                chunks.append(_build_chunk_record(doc, doc_id, chk_id, title, sec_label, chunk_text, ip_type, target_dom, authority, issue_date))
    else:
        # Unstructured guidelines / circular / notification - split by paragraphs / headings
        paragraphs = clean_text.split("\n\n")
        current_p = []
        current_len = 0
        part_idx = 1

        for p in paragraphs:
            p_strip = p.strip()
            if not p_strip:
                continue
            current_p.append(p_strip)
            current_len += len(p_strip)

            if current_len >= 1200:
                body = "\n\n".join(current_p)
                sec_label = f"Provision (Part {part_idx})"
                header = f"{title}\n{sec_label}\nAuthority: {authority}\nJurisdiction: India\n\n"
                chunk_text = header + body
                chk_id = make_kanoon_chunk_id(doc_id, f"part_{part_idx}", len(chunks) + 1, chunk_text)
                chunks.append(_build_chunk_record(doc, doc_id, chk_id, title, sec_label, chunk_text, ip_type, target_dom, authority, issue_date))
                current_p = []
                current_len = 0
                part_idx += 1

        if current_p and current_len >= 100:
            body = "\n\n".join(current_p)
            sec_label = f"Provision (Part {part_idx})"
            header = f"{title}\n{sec_label}\nAuthority: {authority}\nJurisdiction: India\n\n"
            chunk_text = header + body
            chk_id = make_kanoon_chunk_id(doc_id, f"part_{part_idx}", len(chunks) + 1, chunk_text)
            chunks.append(_build_chunk_record(doc, doc_id, chk_id, title, sec_label, chunk_text, ip_type, target_dom, authority, issue_date))

    return chunks

def _build_chunk_record(
    doc: Dict[str, Any],
    doc_id: str,
    chk_id: str,
    title: str,
    sec_label: str,
    chunk_text: str,
    ip_type: str,
    target_dom: str,
    authority: str,
    issue_date: str
) -> Dict[str, Any]:
    return {
        "document_id": f"IN-KANOON-{doc_id}",
        "chunk_id": chk_id,
        "title": title,
        "jurisdiction": "IN",
        "country": "India",
        "language": "en",
        "domain": target_dom,
        "subdomain": doc.get("target_subdomain", target_dom),
        "ip_type": ip_type,
        "authority": authority,
        "authority_tier": 2,
        "authority_level": "SECONDARY_DATASET",
        "source_type": "secondary_legal_statute",
        "document_type": doc.get("doc_type", "Statutory Document"),
        "section": sec_label,
        "chapter": "Substantive Provisions",
        "page": 1,
        "publication_number": f"KanoonGPT-{doc_id}",
        "application_number": "",
        "publication_date": issue_date or "2020-01-01",
        "filing_date": issue_date or "2020-01-01",
        "effective_date": issue_date or "2020-01-01",
        "source_url": "https://huggingface.co/datasets/KanoonGPT/indian-legal-documents",
        "source_file": doc.get("shard", "kanoongpt"),
        "source_path": f"data/raw/india/kanoongpt/{doc.get('shard', 'kanoongpt')}",
        "version": "v2.0-production",
        "access_date": "2026-09-10",
        "dataset_name": "KanoonGPT Indian Legal Documents",
        "parent_document_id": f"IN-KANOON-{doc_id}",
        "text": chunk_text,
        "source": f"KanoonGPT Indian Legal Documents ({authority})"
    }
