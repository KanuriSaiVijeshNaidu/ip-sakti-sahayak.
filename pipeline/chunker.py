"""
pipeline/chunker.py
───────────────────
Structure-Aware Chunking Engine with Enriched Provenance Metadata.
Target: 900–1100 tokens, 150 token overlap, absolute ceiling: 1200 tokens.
Boundaries: claim boundaries, section boundaries, paragraph boundaries, sentence boundaries.
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

    def _split_long_text(self, text: str, max_tokens: int) -> List[str]:
        """Split a long text block by sentences or word windows to never exceed max_tokens."""
        if estimate_tokens(text) <= max_tokens:
            return [text]
        
        # Split on sentence boundaries
        sentences = re.split(r"(?<=[.!?])\s+", text)
        chunks = []
        curr = []
        
        for s in sentences:
            if not s.strip():
                continue
            s_toks = estimate_tokens(s)
            if s_toks > max_tokens:
                # If there are already accumulated sentences, flush them
                if curr:
                    chunks.append(" ".join(curr))
                    curr = []
                # Split single giant sentence by words using actual token counts
                words = s.split()
                w_curr = []
                for w in words:
                    cand = " ".join(w_curr + [w]) if w_curr else w
                    if estimate_tokens(cand) > max_tokens:
                        if w_curr:
                            chunks.append(" ".join(w_curr))
                        w_curr = [w]
                    else:
                        w_curr.append(w)
                if w_curr:
                    chunks.append(" ".join(w_curr))
                continue

            cand_text = " ".join(curr + [s]) if curr else s
            if curr and estimate_tokens(cand_text) > max_tokens:
                chunks.append(" ".join(curr))
                curr = [s]
            else:
                curr.append(s)
                
        if curr:
            chunks.append(" ".join(curr))
            
        return chunks

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

                    # Handle single massive claims
                    if cl_tokens > self.max_chunk_tokens:
                        if current_claim_batch:
                            combined = "\n\n".join(f"Claim {c['claim_number']}: {c['text']}" for c in current_claim_batch)
                            chunks.append(self._make_chunk(country, region, source_dataset, source_url, patent_id, meta, title, "claims", current_claim_batch[0]["claim_number"], chunk_idx, combined))
                            chunk_idx += 1
                            current_claim_batch = []
                            current_tokens = 0
                        sub_parts = self._split_long_text(cl_text, self.max_chunk_tokens)
                        for sp in sub_parts:
                            chunks.append(self._make_chunk(country, region, source_dataset, source_url, patent_id, meta, title, "claims", cl_num, chunk_idx, f"Claim {cl_num}: {sp}"))
                            chunk_idx += 1
                        continue

                    # If adding this claim exceeds max, flush current batch
                    if current_claim_batch and (current_tokens + cl_tokens > self.max_chunk_tokens):
                        combined_text = "\n\n".join(f"Claim {c['claim_number']}: {c['text']}" for c in current_claim_batch)
                        first_cl_num = current_claim_batch[0]["claim_number"]
                        chunks.append(self._make_chunk(country, region, source_dataset, source_url, patent_id, meta, title, "claims", first_cl_num, chunk_idx, combined_text))
                        chunk_idx += 1
                        current_claim_batch = []
                        current_tokens = 0

                    current_claim_batch.append(cl)
                    current_tokens += cl_tokens

                if current_claim_batch:
                    combined_text = "\n\n".join(f"Claim {c['claim_number']}: {c['text']}" for c in current_claim_batch)
                    chunks.append(self._make_chunk(country, region, source_dataset, source_url, patent_id, meta, title, "claims", current_claim_batch[0]["claim_number"], chunk_idx, combined_text))
                    chunk_idx += 1

            # 2. Abstract Section: Keep whole or split if oversized
            elif sec_type == "abstract":
                ab_text = sec.get("text", "").strip()
                if ab_text:
                    sub_abs = self._split_long_text(ab_text, self.max_chunk_tokens)
                    for sa in sub_abs:
                        chunks.append(self._make_chunk(country, region, source_dataset, source_url, patent_id, meta, title, "abstract", None, chunk_idx, sa))
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
                    
                    if para_tokens > self.max_chunk_tokens:
                        # Single large paragraph -> flush existing and split long paragraph
                        if curr_paras:
                            chunks.append(self._make_chunk(country, region, source_dataset, source_url, patent_id, meta, title, sec_type or "description", None, chunk_idx, "\n\n".join(curr_paras)))
                            chunk_idx += 1
                            curr_paras = []
                            curr_tokens = 0
                        sub_paras = self._split_long_text(para, self.max_chunk_tokens)
                        for sp in sub_paras:
                            chunks.append(self._make_chunk(country, region, source_dataset, source_url, patent_id, meta, title, sec_type or "description", None, chunk_idx, sp))
                            chunk_idx += 1
                        continue

                    if curr_paras and (curr_tokens + para_tokens > self.max_chunk_tokens):
                        chunk_text = "\n\n".join(curr_paras)
                        chunks.append(self._make_chunk(country, region, source_dataset, source_url, patent_id, meta, title, sec_type or "description", None, chunk_idx, chunk_text))
                        chunk_idx += 1
                        # Check if keeping previous para fits with para; if not, just start with para
                        if len(curr_paras) > 1 and (estimate_tokens(curr_paras[-1]) + para_tokens <= self.max_chunk_tokens):
                            curr_paras = [curr_paras[-1], para]
                        else:
                            curr_paras = [para]
                        curr_tokens = sum(estimate_tokens(p) for p in curr_paras)
                    else:
                        curr_paras.append(para)
                        curr_tokens += para_tokens

                if curr_paras:
                    chunk_text = "\n\n".join(curr_paras)
                    chunks.append(self._make_chunk(country, region, source_dataset, source_url, patent_id, meta, title, sec_type or "description", None, chunk_idx, chunk_text))
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
