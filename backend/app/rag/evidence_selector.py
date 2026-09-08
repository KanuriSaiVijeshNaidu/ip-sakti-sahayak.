"""
backend/app/rag/evidence_selector.py
────────────────────────────────────
Selects a diversified, high-quality subset of EvidenceResult chunks
from Phase 5 retrieval results and constructs structured citation records [E1], [E2], etc.
"""
from __future__ import annotations

from typing import List, Dict, Tuple
from backend.app.models.retrieval_schemas import EvidenceResult
from backend.app.models.rag_schemas import CitationInfo
from backend.app.rag.config import rag_config


class EvidenceSelector:
    """
    Selects balanced evidence chunks for LLM context injection.
    Prevents document over-concentration and maintains complete provenance.
    """

    def select(
        self,
        evidence_results: List[EvidenceResult],
        max_chunks: int = 5,
    ) -> Tuple[List[CitationInfo], str]:
        """
        Selects top chunks while enforcing document and section diversity.
        Returns:
            (citations_list, formatted_llm_context_string)
        """
        selected: List[EvidenceResult] = []
        doc_counts: Dict[str, int] = {}
        deferred: List[EvidenceResult] = []

        for e in evidence_results:
            doc_id = e.document_id or "unknown"
            if doc_counts.get(doc_id, 0) < rag_config.max_chunks_per_doc:
                selected.append(e)
                doc_counts[doc_id] = doc_counts.get(doc_id, 0) + 1
                if len(selected) >= max_chunks:
                    break
            else:
                deferred.append(e)

        # Backfill if needed
        if len(selected) < max_chunks and deferred:
            for e in deferred:
                selected.append(e)
                if len(selected) >= max_chunks:
                    break

        citations: List[CitationInfo] = []
        context_blocks: List[str] = []

        for idx, e in enumerate(selected, start=1):
            cid_tag = f"E{idx}"
            cite_obj = CitationInfo(
                citation_id=cid_tag,
                chunk_id=e.chunk_id,
                publication_number=e.publication_number,
                document_id=e.document_id,
                jurisdiction=e.jurisdiction,
                language=e.language,
                section=e.section,
                title=e.title,
                text=e.text,
                source=e.source,
                source_url=e.source_url,
                filing_date=e.filing_date,
                publication_date=e.publication_date,
                rerank_score=e.rerank_score,
                dense_score=e.dense_score,
                lexical_score=e.lexical_score,
                rrf_score=e.rrf_score,
            )
            citations.append(cite_obj)

            block = (
                f"[{cid_tag}]\n"
                f"Jurisdiction: {cite_obj.jurisdiction}\n"
                f"Publication Number: {cite_obj.publication_number}\n"
                f"Document ID: {cite_obj.document_id}\n"
                f"Section: {cite_obj.section}\n"
                f"Title: {cite_obj.title}\n"
                f"Filing Date: {cite_obj.filing_date or 'N/A'}\n"
                f"Publication Date: {cite_obj.publication_date or 'N/A'}\n"
                f"Text:\n{cite_obj.text}\n"
            )
            context_blocks.append(block)

        llm_context = "\n---\n".join(context_blocks)
        return citations, llm_context


evidence_selector = EvidenceSelector()
