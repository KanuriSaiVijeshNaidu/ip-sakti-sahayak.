"""
backend/app/models/retrieval_schemas.py
───────────────────────────────────────
Pydantic schemas for Phase 5 Retrieval Layer.
Defines QueryAnalysis, EvidenceResult, and API search request/response structures.
"""
from __future__ import annotations

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class QueryAnalysis(BaseModel):
    original_query: str = Field(..., description="Original, raw user query")
    normalized_query: str = Field(..., description="Cleaned and normalized query")
    detected_language: str = Field(..., description="Detected query language: en, ja, hi, te, etc.")
    intent: str = Field(..., description="Classified intent (e.g. patentability, prior_art, etc.)")
    confidence: float = Field(default=1.0, description="Confidence score for intent classification")
    jurisdictions: List[str] = Field(default_factory=list, description="Targeted jurisdictions: US, EP, WO, JP")
    routing_mode: str = Field(..., description="Routing mode: explicit_single, explicit_multi, global, comparison")
    routing_reason: str = Field(..., description="Detailed explanation of routing rationale")
    product_entities: List[str] = Field(default_factory=list, description="Extracted product or formulation terms")
    patent_entities: List[str] = Field(default_factory=list, description="Extracted patent numbers or application numbers")
    legal_entities: List[str] = Field(default_factory=list, description="Extracted statutes, articles or sections")
    temporal_constraints: List[str] = Field(default_factory=list, description="Extracted dates, years or time windows")
    query_type: str = Field(default="general_patent", description="Categorical query classification")
    expanded_representations: Optional[Dict[str, str]] = Field(default=None, description="5 representations: original, en_canonical, statutory, office, domain")


class EvidenceResult(BaseModel):
    chunk_id: str = Field(..., description="Unique chunk identifier")
    document_id: str = Field(..., description="Originating document identifier")
    publication_number: str = Field(..., description="Patent publication number")
    jurisdiction: str = Field(..., description="Jurisdiction code (IN, US, EP, WO, JP)")
    language: str = Field(..., description="Document language (en, ja)")
    section: str = Field(..., description="Patent section (abstract, claims, description, etc.)")
    title: str = Field(default="", description="Patent title")
    text: str = Field(..., description="Full text snippet of the retrieved chunk")
    source: str = Field(default="", description="Dataset origin / archive")
    source_url: Optional[str] = Field(default=None, description="URL to public source if available")
    filing_date: Optional[str] = Field(default=None, description="Patent filing date")
    publication_date: Optional[str] = Field(default=None, description="Patent publication date")
    authority_tier: Optional[int] = Field(default=1, description="Source Authority Tier 1-4 (Tier 1: primary statute/IPO/USPTO/EPO/JPO)")
    domain: Optional[str] = Field(default=None, description="Legal / regulatory domain: patent, trademark, gi, etc.")
    subdomain: Optional[str] = Field(default=None, description="Subdomain / classification")
    
    # Retrieval Scores & Provenance Ranks
    dense_score: Optional[float] = Field(default=None, description="FAISS cosine similarity inner product score")
    dense_rank: Optional[int] = Field(default=None, description="Dense retrieval rank")
    lexical_score: Optional[float] = Field(default=None, description="BM25 Okapi lexical match score")
    lexical_rank: Optional[int] = Field(default=None, description="BM25 retrieval rank")
    rrf_score: Optional[float] = Field(default=None, description="Reciprocal Rank Fusion score")
    rerank_score: Optional[float] = Field(default=None, description="Cross-encoder relevance score")
    final_rank: int = Field(..., description="Final ranked position in evidence set")


class RetrievalSearchRequest(BaseModel):
    query: str = Field(..., min_length=1, description="User search query")
    jurisdiction: Optional[str] = Field(default=None, description="Optional explicit jurisdiction override")
    top_k: Optional[int] = Field(default=None, description="Final top-K evidence results to return")
    dense_top_k: Optional[int] = Field(default=None, description="Dense stage candidate count")
    lexical_top_k: Optional[int] = Field(default=None, description="Lexical stage candidate count")
    rerank_top_k: Optional[int] = Field(default=None, description="Rerank stage candidate count")


class RetrievalSearchResponse(BaseModel):
    query_analysis: QueryAnalysis
    routing_decision: str
    searched_jurisdictions: List[str]
    dense_candidate_count: int
    lexical_candidate_count: int
    fused_candidate_count: int
    reranked_candidate_count: int
    final_candidate_count: int
    results: List[EvidenceResult]
    latencies_ms: Dict[str, float]
    status: str = "success"
    disclaimer: str = (
        "AYURLEX Retrieval Preview: Retrieved statutory and patent evidence only. "
        "Does not constitute legal advice or automated claim synthesis."
    )


class RetrievalCandidateSummary(BaseModel):
    chunk_id: str
    publication_number: str
    jurisdiction: str
    section: str
    title: str
    score: float
    rank: int
    authority_tier: int = 1
    source_url: Optional[str] = None


class SufficiencyGateAudit(BaseModel):
    verdict: str  # PASS / FAIL
    status: str   # GOOD / PARTIAL / INSUFFICIENT / INVALID
    confidence: float
    top_rerank_score: float
    threshold: float
    usable_count: int
    tier1_count: int
    has_authoritative_source: bool
    reason: str


class RetrievalDebugRequest(BaseModel):
    query: str = Field(..., min_length=1, description="Query to inspect")
    jurisdiction: Optional[str] = Field(default=None, description="Optional explicit jurisdiction override")
    top_k: Optional[int] = Field(default=5, description="Number of final candidates to inspect")


class RetrievalDebugResponse(BaseModel):
    query: str
    normalized_query: str
    detected_language: str
    detected_script: str
    code_switching_tokens: List[str]
    target_jurisdictions: List[str]
    routing_mode: str
    routing_reason: str
    expanded_representations: Dict[str, str]
    dense_candidates: List[RetrievalCandidateSummary]
    lexical_candidates: List[RetrievalCandidateSummary]
    fused_candidates: List[RetrievalCandidateSummary]
    reranked_candidates: List[RetrievalCandidateSummary]
    final_evidence: List[EvidenceResult]
    sufficiency_gate: SufficiencyGateAudit
    latencies_ms: Dict[str, float]
    status: str = "success"

