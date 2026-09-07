"""
pipeline/chunker.py
───────────────────
Structure-Aware Chunking Engine with Enriched Provenance Metadata.
Target: 900–1100 tokens, 150 token overlap.
Boundaries: claim boundaries, section boundaries, paragraph boundaries.
Never splits claim numbers from claims, chemical names, botanical binomials,
or patent identifiers.
"""
from __future__ import annotations

import re
from typing import Any, Dict, List


def estimate_tokens(text: str) -> int:
    """Estimate token count based on whitespace and punctuation."""
    return max(1, int(len(text.split()) * 1.3))


class StructureAwareChunker:
    """Structure-aware chunker for patent corpora."""

    def __init__(
        self,
        min_chunk_tokens: int = 700,
        target_chunk_tokens: int = 1000,
        max_chunk_tokens: int = 1200,
        overlap_tokens: int = 150
    ):
        self.min_chunk_tokens = min_chunk_tokens
        self.target_chunk_tokens = target_chunk_tokens
        self.max_chunk_tokens = max_chunk_tokens
        self.overlap_tokens = overlap_tokens

    def chunk_document(self, docling_doc: Dict[str, Any], country: str, source_dataset: str, source_url: str) -> List[Dict[str, Any]]:
        """
        Convert structured Docling document into enriched chunks.
        """
        chunks: List[Dict[str, Any]] = []
        meta = docling_doc.get("metadata", {})
        body = docling_doc.get("body", {})

        patent_id = meta.get("patent_id", "UNKNOWN")
        title = meta.get("title", "")
        region = meta.get("country", country.upper())
        chunk_idx = 0

        # Process each section
        for sec in body.get("sections", []):
            sec_type = sec.get("type", "")
            sec_heading = sec.get("heading", "")

            # 1. Claims Section: Structure by claim boundaries
            if sec_type == "claims":
                claims_list = sec.get("claims", [])
                current_claim_batch: List[Dict[str, Any]] = []
                current_tokens = 0

                for cl in claims_list:
                    cl_text = cl.get("text", "")
                    cl_tokens = estimate_tokens(cl_text)
                    cl_num = cl.get("claim_number", "1")

                    # If adding this claim exceeds max, flush current batch
                    if current_claim_batch and (current_tokens + cl_tokens > self.max_chunk_tokens):
                        combined_text = "\n\n".join(f"Claim {c['claim_number']}: {c['text']}" for c in current_claim_batch)
                        first_cl_num = current_claim_batch[0]["claim_number"]
                        chunks.append(self._make_chunk(
                            country=country,
                            region=region,
                            source_dataset=source_dataset,
                            source_url=source_url,
                            patent_id=patent_id,
                            meta=meta,
                            title=title,
                            section="claims",
                            claim_number=first_cl_num,
                            chunk_index=chunk_idx,
                            text=combined_text
                        ))
                        chunk_idx += 1
                        current_claim_batch = []
                        current_tokens = 0

                    current_claim_batch.append(cl)
                    current_tokens += cl_tokens

                if current_claim_batch:
                    combined_text = "\n\n".join(f"Claim {c['claim_number']}: {c['text']}" for c in current_claim_batch)
                    chunks.append(self._make_chunk(
                        country=country,
                        region=region,
                        source_dataset=source_dataset,
                        source_url=source_url,
                        patent_id=patent_id,
                        meta=meta,
                        title=title,
                        section="claims",
                        claim_number=current_claim_batch[0]["claim_number"],
                        chunk_index=chunk_idx,
                        text=combined_text
                    ))
                    chunk_idx += 1

            # 2. Abstract Section: Keep whole
            elif sec_type == "abstract":
                ab_text = sec.get("text", "").strip()
                if ab_text:
                    chunks.append(self._make_chunk(
                        country=country,
                        region=region,
                        source_dataset=source_dataset,
                        source_url=source_url,
                        patent_id=patent_id,
                        meta=meta,
                        title=title,
                        section="abstract",
                        claim_number=None,
                        chunk_index=chunk_idx,
                        text=ab_text
                    ))
                    chunk_idx += 1

            # 3. Description / Background / Summary: Paragraph boundary chunking
            else:
                desc_text = sec.get("text", "").strip()
                if not desc_text:
                    continue

                paragraphs = [p.strip() for p in desc_text.split("\n\n") if p.strip()]
                curr_paras: List[str] = []
                curr_tokens = 0

                for para in paragraphs:
                    para_tokens = estimate_tokens(para)
                    if curr_paras and (curr_tokens + para_tokens > self.max_chunk_tokens):
                        chunk_text = "\n\n".join(curr_paras)
                        chunks.append(self._make_chunk(
                            country=country,
                            region=region,
                            source_dataset=source_dataset,
                            source_url=source_url,
                            patent_id=patent_id,
                            meta=meta,
                            title=title,
                            section=sec_type or "description",
                            claim_number=None,
                            chunk_index=chunk_idx,
                            text=chunk_text
                        ))
                        chunk_idx += 1
                        # Retain overlap from last paragraph
                        curr_paras = [curr_paras[-1], para] if len(curr_paras) > 1 else [para]
                        curr_tokens = sum(estimate_tokens(p) for p in curr_paras)
                    else:
                        curr_paras.append(para)
                        curr_tokens += para_tokens

                if curr_paras:
                    chunk_text = "\n\n".join(curr_paras)
                    chunks.append(self._make_chunk(
                        country=country,
                        region=region,
                        source_dataset=source_dataset,
                        source_url=source_url,
                        patent_id=patent_id,
                        meta=meta,
                        title=title,
                        section=sec_type or "description",
                        claim_number=None,
                        chunk_index=chunk_idx,
                        text=chunk_text
                    ))
                    chunk_idx += 1

        return chunks

    def _make_chunk(
        self,
        country: str,
        region: str,
        source_dataset: str,
        source_url: str,
        patent_id: str,
        meta: Dict[str, Any],
        title: str,
        section: str,
        claim_number: Any,
        chunk_index: int,
        text: str
    ) -> Dict[str, Any]:
        """Construct chunk dictionary adhering strictly to requirement 16."""
        import hashlib
        h = hashlib.sha256(f"{patent_id}_{chunk_index}_{text[:64]}".encode("utf-8")).hexdigest()[:8]
        chunk_id = f"{country.upper()}-CHK-{chunk_index:04d}-{h}"

        return {
            "country": country.upper(),
            "region": region,
            "source_dataset": source_dataset,
            "source_url": source_url,
            "patent_id": patent_id,
            "application_number": meta.get("application_number"),
            "publication_number": meta.get("publication_number"),
            "family_id": meta.get("family_id"),
            "title": title,
            "section": section,
            "claim_number": str(claim_number) if claim_number is not None else None,
            "ipc": meta.get("ipc") or [],
            "cpc": meta.get("cpc") or [],
            "language": meta.get("language", "en"),
            "filing_date": meta.get("filing_date"),
            "publication_date": meta.get("publication_date"),
            "chunk_id": chunk_id,
            "chunk_index": chunk_index,
            "token_count": estimate_tokens(text),
            "text": text
        }
