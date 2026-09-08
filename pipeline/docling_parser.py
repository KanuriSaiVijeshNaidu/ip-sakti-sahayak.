"""
pipeline/docling_parser.py
──────────────────────────
Docling 1.10.0 Document Structure Extraction Layer.
Parses raw patent documents into structured Docling JSON and Markdown,
preserving hierarchy, headings, claim numbering, paragraphs, and metadata.
"""
from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Any, Dict, List


def parse_patent_to_docling(raw_record: Dict[str, Any], country: str) -> Dict[str, Any]:
    """
    Parse a patent record into Docling 1.10.0 schema representation.
    """
    patent_id = raw_record.get("patent_id") or raw_record.get("publication_number") or raw_record.get("application_number") or "UNKNOWN"
    title = raw_record.get("title") or raw_record.get("title_de") or "Untitled Patent"
    abstract = raw_record.get("abstract") or raw_record.get("abstract_de") or ""
    description = raw_record.get("description") or raw_record.get("full_description") or raw_record.get("description_de") or ""
    claims_raw = raw_record.get("claims") or raw_record.get("claims_de") or []

    # Format claims list into structured claim items
    structured_claims: List[Dict[str, Any]] = []
    if isinstance(claims_raw, list):
        for i, c in enumerate(claims_raw, 1):
            c_text = str(c).strip()
            c_match = re.match(r"^(\d+)[\.\s\)]*(.+)$", c_text, re.DOTALL)
            c_num = c_match.group(1) if c_match else str(i)
            structured_claims.append({
                "claim_number": c_num,
                "text": c_text,
                "is_independent": "according to" not in c_text.lower() and "claim" not in c_text.lower()[:30]
            })
    elif isinstance(claims_raw, str):
        # Split on whitespace/newline followed by claim numbering
        claim_blocks = re.split(r"(?:\s+|\n|^)(?=\d+\.\s+[A-Z])", claims_raw)
        if len(claim_blocks) <= 1:
            claim_blocks = re.split(r"(?:\n|^)(?=\d+[\.\s\)])", claims_raw)
        for i, c_text in enumerate(claim_blocks, 1):
            c_text = c_text.strip()
            if not c_text:
                continue
            c_match = re.match(r"^(\d+)[\.\s\)]*(.+)$", c_text, re.DOTALL)
            c_num = c_match.group(1) if c_match else str(i)
            structured_claims.append({
                "claim_number": c_num,
                "text": c_text,
                "is_independent": "according to" not in c_text.lower() and "claim" not in c_text.lower()[:30]
            })

    # Build Docling 1.10.0 hierarchical structure
    docling_doc: Dict[str, Any] = {
        "schema_name": "docling_core.models.DoclingDocument",
        "version": "1.10.0",
        "name": f"{country.upper()}_{patent_id}",
        "origin": {
            "mimetype": "application/json",
            "binary_hash": raw_record.get("hash", ""),
            "filename": f"{patent_id}.json"
        },
        "metadata": {
            "patent_id": patent_id,
            "application_number": raw_record.get("application_number"),
            "publication_number": raw_record.get("publication_number"),
            "family_id": raw_record.get("family_id"),
            "title": title,
            "country": country.upper(),
            "jurisdiction": raw_record.get("jurisdiction", country.upper()),
            "language": raw_record.get("language", "en"),
            "filing_date": raw_record.get("filing_date"),
            "publication_date": raw_record.get("publication_date"),
            "applicant": raw_record.get("applicant"),
            "inventor": raw_record.get("inventor") or raw_record.get("inventor_list"),
            "ipc": raw_record.get("ipc") or raw_record.get("ipcr_labels") or [],
            "cpc": raw_record.get("cpc") or raw_record.get("cpc_labels") or []
        },
        "body": {
            "title": title,
            "sections": [
                {
                    "heading": "Abstract",
                    "type": "abstract",
                    "text": abstract
                },
                {
                    "heading": "Claims",
                    "type": "claims",
                    "claim_count": len(structured_claims),
                    "claims": structured_claims
                },
                {
                    "heading": "Description",
                    "type": "description",
                    "text": description
                }
            ]
        }
    }

    if raw_record.get("background"):
        docling_doc["body"]["sections"].insert(1, {
            "heading": "Background of the Invention",
            "type": "background",
            "text": raw_record.get("background")
        })
    if raw_record.get("summary"):
        docling_doc["body"]["sections"].insert(2, {
            "heading": "Summary of the Invention",
            "type": "summary",
            "text": raw_record.get("summary")
        })

    return docling_doc


def docling_to_markdown(docling_doc: Dict[str, Any]) -> str:
    """Convert Docling document object to structured Markdown."""
    meta = docling_doc.get("metadata", {})
    body = docling_doc.get("body", {})

    md = [
        f"# {body.get('title', 'Untitled Patent')}",
        "",
        f"**Patent ID:** `{meta.get('patent_id')}` | **Country:** `{meta.get('country')}` | **Language:** `{meta.get('language')}`",
        f"**Publication Date:** {meta.get('publication_date')} | **Filing Date:** {meta.get('filing_date')}",
        f"**IPC:** {', '.join(meta.get('ipc', []))} | **CPC:** {', '.join(meta.get('cpc', []))}",
        f"**Applicant:** {meta.get('applicant') or 'N/A'}",
        "",
        "---",
        ""
    ]

    for sec in body.get("sections", []):
        heading = sec.get("heading", "")
        md.append(f"## {heading}\n")
        if sec.get("type") == "claims":
            for cl in sec.get("claims", []):
                ind_tag = "(Independent)" if cl.get("is_independent") else "(Dependent)"
                md.append(f"### Claim {cl.get('claim_number')} {ind_tag}\n{cl.get('text')}\n")
        else:
            md.append(f"{sec.get('text', '')}\n")

    return "\n".join(md)
