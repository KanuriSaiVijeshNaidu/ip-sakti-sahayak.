"""
backend/app/models/rag_schemas.py
─────────────────────────────────
Pydantic schemas for Phase 6 Evidence-Validated RAG & CRAG.
"""
from __future__ import annotations

from typing import List, Optional, Dict, Any, Literal
from pydantic import BaseModel, Field
from backend.app.models.retrieval_schemas import QueryAnalysis, EvidenceResult


class CitationInfo(BaseModel):
    citation_id: str = Field(..., description="Short internal citation tag: [E1], [E2], etc.")
    chunk_id: str = Field(..., description="Unique chunk ID")
    publication_number: str = Field(..., description="Patent publication number")
    document_id: str = Field(..., description="Document identifier")
    jurisdiction: str = Field(..., description="Jurisdiction code (US, EP, WO, JP)")
    language: str = Field(default="en", description="Language of chunk")
    section: str = Field(default="", description="Patent section")
    title: str = Field(default="", description="Patent title")
    text: str = Field(..., description="Exact raw text snippet from evidence chunk")
    source: str = Field(default="", description="Corpus source")
    source_url: Optional[str] = Field(default=None, description="Public source URL")
    filing_date: Optional[str] = Field(default=None, description="Patent filing date")
    publication_date: Optional[str] = Field(default=None, description="Patent publication date")
    rerank_score: Optional[float] = Field(default=None, description="Cross-encoder rerank score")
    dense_score: Optional[float] = Field(default=None, description="FAISS cosine similarity")
    lexical_score: Optional[float] = Field(default=None, description="BM25 score")
    rrf_score: Optional[float] = Field(default=None, description="RRF fusion score")


class ClaimValidationResult(BaseModel):
    text: str = Field(..., description="Extracted factual claim sentence")
    citations: List[str] = Field(default_factory=list, description="Citation IDs cited by this claim, e.g. ['E1']")
    status: Literal["SUPPORTED", "PARTIALLY_SUPPORTED", "UNSUPPORTED", "UNCITED"] = Field(
        ..., description="Verification status against cited evidence"
    )
    supported_by: List[str] = Field(default_factory=list, description="Citations that legitimately support the statement")
    reason: str = Field(default="", description="Verification rationale")


class EvidenceSupportDecision(BaseModel):
    supported: bool = Field(..., description="Whether this evidence candidate legitimately supports the query")
    jurisdiction_match: bool = Field(..., description="Whether candidate jurisdiction matches query scope")
    domain_match: bool = Field(..., description="Whether candidate domain matches query legal/tech domain")
    source_type_match: bool = Field(..., description="Whether source type is appropriate (e.g. statute vs patent application)")
    intent_match: bool = Field(..., description="Whether candidate matches query intent")
    subject_match: bool = Field(..., description="Whether candidate matches subject matter")
    proposition_supported: bool = Field(..., description="Whether candidate supports the factual/legal proposition")
    authority_sufficient: bool = Field(..., description="Whether authority level is adequate")
    confidence: float = Field(..., description="Decision confidence")
    reason: str = Field(..., description="Diagnostic justification")


class CRAGAssessment(BaseModel):
    status: Literal["GOOD", "PARTIAL", "INSUFFICIENT", "INVALID"] = Field(
        ..., description="CRAG evidence quality status"
    )
    confidence: float = Field(..., description="Technical retrieval confidence score (0.0 to 1.0)")
    reason: str = Field(..., description="Technical explanation for decision")
    evidence_count: int = Field(..., description="Total retrieved evidence chunks")
    usable_evidence_count: int = Field(..., description="Number of evidence chunks passing quality gates")
    jurisdiction_match: bool = Field(..., description="Whether evidence strictly matches requested jurisdictions")
    metadata_complete: bool = Field(..., description="Whether required provenance metadata is fully intact")
    duplicate_ratio: float = Field(..., description="Ratio of repeated document IDs in evidence")
    selected_evidence_ids: List[str] = Field(default_factory=list, description="Chunk IDs passing selection")
    evidence_support_decisions: List[EvidenceSupportDecision] = Field(
        default_factory=list, description="Per-candidate evidence gate compatibility decisions"
    )


class RAGAnswerRequest(BaseModel):
    query: str = Field(..., min_length=1, description="User patent question")
    jurisdiction: Optional[str] = Field(default=None, description="Optional explicit jurisdiction override (US, EP, WO, JP)")
    top_k: Optional[int] = Field(default=5, ge=1, le=15, description="Number of evidence chunks to use")
    language: Optional[str] = Field(default=None, description="Optional forced language code")


class RAGAnswerResponse(BaseModel):
    query: str = Field(..., description="Original user query")
    answer: str = Field(..., description="Grounded, citation-bound answer")
    detected_language: str = Field(..., description="Language detected or requested")
    jurisdictions: List[str] = Field(..., description="Jurisdictions searched & grounded")
    crag_status: Literal["GOOD", "PARTIAL", "INSUFFICIENT", "INVALID"] = Field(..., description="CRAG quality status")
    evidence_count: int = Field(..., description="Number of selected evidence chunks")
    citations: List[CitationInfo] = Field(default_factory=list, description="Deterministic citation metadata list")
    claims: List[ClaimValidationResult] = Field(default_factory=list, description="Claim-to-evidence validation breakdown")
    limitations: List[str] = Field(default_factory=list, description="Evidence gaps, constraints, or caveats")
    status: str = Field(default="SUCCESS", description="Execution status: SUCCESS, GENERATION_UNAVAILABLE, VALIDATION_FAILED, INSUFFICIENT_EVIDENCE")
    latencies_ms: Dict[str, float] = Field(default_factory=dict, description="Stage-by-stage latencies in milliseconds")
    disclaimer: str = Field(
        default=(
            "This information is generated from retrieved patent/document evidence "
            "and is provided for research and decision-support purposes. It is not "
            "legal advice and does not establish patent validity, infringement, "
            "ownership, freedom to operate, or commercialization rights."
        ),
        description="Statutory decision-support disclaimer"
    )
