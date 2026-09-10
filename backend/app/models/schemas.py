"""
backend/app/models/schemas.py
──────────────────────────────
Shared Pydantic v2 request/response schemas for all API phases.
These are the ONLY data shapes exposed in the public API.
No internal retrieval details (raw chunk IDs, embeddings) leak to User UI.
"""
from __future__ import annotations

from datetime import datetime
from typing import Any, Dict, List, Literal, Optional
from pydantic import BaseModel, Field


# ─── Shared enums ─────────────────────────────────────────────────────────────

DomainType = Literal["patents", "trademarks", "gi", "ayush", "fssai", "auto"]
# Active Production Jurisdictions: US, EP (EU), WO, JP. (IN is deferred, DE is removed from active scope).
JurisdictionType = Literal["IN", "WO", "EU", "EP", "US", "JP", "DE", "GLOBAL", "auto"]
LanguageCode = Literal["en", "hi", "ta", "te", "kn", "ml", "ja", "de", "auto"]


# ─── Health ───────────────────────────────────────────────────────────────────

class HealthResponse(BaseModel):
    status: Literal["ok", "degraded", "error"] = "ok"
    version: str
    environment: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    services: Dict[str, str] = Field(default_factory=dict)


# ─── Chat (User UI) ───────────────────────────────────────────────────────────

class ChatRequest(BaseModel):
    query: str = Field(..., min_length=3, max_length=2000)
    language: LanguageCode = "en"
    domain: Optional[DomainType] = None
    jurisdiction: Optional[JurisdictionType] = "IN"
    target_market_country: Optional[str] = None
    session_id: Optional[str] = None
    corpus_version: Optional[str] = None


class CitedPassage(BaseModel):
    """Evidence passage shown to the user with full provenance. No raw scores."""
    passage_text: str
    source_title: str
    source_url: Optional[str] = None
    section: Optional[str] = None
    page_number: Optional[int] = None
    domain: str
    jurisdiction: str
    relevance_score: float = Field(ge=0.0, le=1.0)


class ChatResponse(BaseModel):
    model_config = {"protected_namespaces": ()}
    answer: str
    cited_passages: List[CitedPassage] = Field(default_factory=list)
    model_used: str = "mock-v1"
    retrieval_latency_ms: Optional[int] = None
    llm_latency_ms: Optional[int] = None
    total_latency_ms: Optional[int] = None
    corpus_version: str = "v1"
    session_id: Optional[str] = None


# ─── Product Guidance (User UI) ───────────────────────────────────────────────

class ProductGuidanceRequest(BaseModel):
    product_name: Optional[str] = Field(None, max_length=500)
    query: Optional[str] = Field(None, max_length=2000)
    ingredients: List[str] = Field(default_factory=list)
    claims: List[str] = Field(default_factory=list)
    jurisdiction: Optional[JurisdictionType] = "IN"
    language: LanguageCode = "en"
    corpus_version: Optional[str] = None


class ProductGuidanceResponse(BaseModel):
    model_config = {"protected_namespaces": ()}
    product_name: str = ""
    guidance: str
    cited_passages: List[CitedPassage] = Field(default_factory=list)
    applicable_regulations: List[str] = Field(default_factory=list)
    model_used: str = "mock-v1"
    total_latency_ms: Optional[int] = None


# ─── Admin Retrieval Trace (Admin UI only) ────────────────────────────────────

class RetrievalCandidate(BaseModel):
    """Full retrieval trace row — contains ALL scores. Never sent to User UI."""
    chunk_id: str
    text: str
    section_title: Optional[str] = None
    source_title: Optional[str] = None
    domain: str
    jurisdiction: str
    corpus_version: str = "v1"
    bm25_score: Optional[float] = None
    vector_score: Optional[float] = None
    rrf_score: Optional[float] = None
    reranker_score: Optional[float] = None
    grounding_score: Optional[float] = None


class AdminTraceResponse(BaseModel):
    query: str
    domain: Optional[str] = None
    jurisdiction: Optional[str] = None
    corpus_version: str = "v1"
    bm25_hit_count: int = 0
    vector_hit_count: int = 0
    fused_count: int = 0
    reranked_count: int = 0
    validated_count: int = 0
    candidates: List[RetrievalCandidate] = Field(default_factory=list)


# ─── Phase 1 & 2 Intelligence Schemas ────────────────────────────────────────

class NormalizedBotanicalEntity(BaseModel):
    common_name: str
    botanical_name: str
    sanskrit_name: str
    family: Optional[str] = None
    part_used: Optional[str] = None
    active_compounds: List[str] = Field(default_factory=list)
    classical_treatises: List[str] = Field(default_factory=list)
    ayush_system: str = "Ayurveda"


class FormulationAnalysisRequest(BaseModel):
    formulation_name: Optional[str] = Field(None, max_length=200)
    ingredients: List[str] = Field(..., min_length=1)
    botanical_names: List[str] = Field(default_factory=list)
    sanskrit_names: List[str] = Field(default_factory=list)
    ingredient_quantities: Dict[str, str] = Field(default_factory=dict)
    ingredient_ratios: Dict[str, float] = Field(default_factory=dict)
    preparation_method: Optional[str] = None
    dosage_form: Optional[str] = None  # e.g., Churna, Vati, Kwatha, Asava, Extract
    intended_use: Optional[str] = None
    therapeutic_claims: List[str] = Field(default_factory=list)
    geographical_source: Optional[str] = None
    language: LanguageCode = "en"


class FormulationAnalysisResponse(BaseModel):
    model_config = {"protected_namespaces": ()}
    formulation_name: str
    ingredients: List[str]
    botanical_entities: List[NormalizedBotanicalEntity] = Field(default_factory=list)
    traditional_names: List[str] = Field(default_factory=list)
    ratios: Dict[str, float] = Field(default_factory=dict)
    preparation_method: str = "Standard Classical Preparation"
    dosage_form: str = "Unspecified"
    claimed_use: str = ""
    geographical_origin: str = "India (Native Biodiversity)"
    taxonomic_hierarchy: Dict[str, str] = Field(default_factory=dict)
    mono_ingredient_flag: bool = False
    classical_formulation_matches: List[Dict[str, Any]] = Field(default_factory=list)


TKRiskLevel = Literal["CONFIRMED", "LIKELY", "POSSIBLE", "NOT FOUND", "INSUFFICIENT EVIDENCE"]
PatentabilityRiskLevel = Literal["LOW", "MEDIUM", "HIGH", "INSUFFICIENT_EVIDENCE"]
EvidenceSupportStatus = Literal["SUPPORTED", "PARTIALLY_SUPPORTED", "UNSUPPORTED"]


class IngredientRiskItem(BaseModel):
    ingredient: str
    botanical_name: str
    traditional_name: str
    risk_level: TKRiskLevel
    citations: List[str] = Field(default_factory=list)
    classical_source: Optional[str] = None
    rationale: str


class TKRiskRequest(BaseModel):
    formulation_name: Optional[str] = None
    ingredients: List[str] = Field(..., min_length=1)
    botanical_names: List[str] = Field(default_factory=list)
    therapeutic_claims: List[str] = Field(default_factory=list)
    language: LanguageCode = "en"


class TKRiskResponse(BaseModel):
    model_config = {"protected_namespaces": ()}
    overall_tk_risk: TKRiskLevel
    ingredient_risks: List[IngredientRiskItem] = Field(default_factory=list)
    potential_traditional_knowledge_overlap: str
    classical_formulation_matches: List[str] = Field(default_factory=list)
    historical_revocation_precedents: List[str] = Field(default_factory=list)
    evidence: List[CitedPassage] = Field(default_factory=list)
    limitations: List[str] = Field(default_factory=list)


class ClaimVerification(BaseModel):
    claim_text: str
    status: EvidenceSupportStatus
    supporting_passage: Optional[str] = None
    source_title: Optional[str] = None
    section: Optional[str] = None
    authority: Optional[str] = None
    confidence_score: float = 0.0


class ActionPlanStep(BaseModel):
    step_number: int
    title: str
    description: str
    authority_or_portal: str
    statutory_basis: Optional[str] = None
    urgency: Literal["REQUIRED", "RECOMMENDED", "OPTIONAL"] = "REQUIRED"


class ConfidenceExplanation(BaseModel):
    level: Literal["HIGH", "MEDIUM", "LOW"]
    score: float = Field(ge=0.0, le=1.0)
    reasons_positive: List[str] = Field(default_factory=list)
    warnings: List[str] = Field(default_factory=list)
    abstain: bool = False
    abstention_message: Optional[str] = None


class PatentabilityRequest(BaseModel):
    invention_title: str
    abstract_or_summary: str
    ingredients: List[str] = Field(default_factory=list)
    is_combination: bool = True
    claims: List[str] = Field(default_factory=list)
    jurisdiction: JurisdictionType = "IN"
    biological_source_country: str = "India"
    language: LanguageCode = "en"
    user_role: Optional[str] = "attorney"


class PatentabilityResponse(BaseModel):
    model_config = {"protected_namespaces": ()}
    invention_title: str
    overall_risk: PatentabilityRiskLevel
    novelty_risk: PatentabilityRiskLevel
    section_3e_risk: PatentabilityRiskLevel  # Synergistic admixture hurdle
    section_3p_risk: PatentabilityRiskLevel  # Traditional knowledge exclusion
    tk_risk: TKRiskLevel
    biodiversity_review: str
    claim_verifications: List[ClaimVerification] = Field(default_factory=list)
    confidence: ConfidenceExplanation
    evidence: List[CitedPassage] = Field(default_factory=list)
    action_plan: List[ActionPlanStep] = Field(default_factory=list)
    limitations: List[str] = Field(default_factory=list)
    role_adapted_guidance: str = ""


class JurisdictionComparisonRequest(BaseModel):
    invention_title: str
    ingredients: List[str] = Field(default_factory=list)
    claims: List[str] = Field(default_factory=list)
    therapeutic_claims: List[str] = Field(default_factory=list)
    jurisdictions: List[str] = Field(default_factory=lambda: ["IN", "US", "EP", "WO"])
    language: LanguageCode = "en"


class JurisdictionComparisonRow(BaseModel):
    dimension: str
    india: str
    usa: str
    europe: str
    wipo_pct: str
    key_statutory_difference: str
    evidence_citation: str


class JurisdictionComparisonResponse(BaseModel):
    model_config = {"protected_namespaces": ()}
    invention_title: str
    comparison_matrix: List[JurisdictionComparisonRow] = Field(default_factory=list)
    overall_summary: str
    action_plan: List[ActionPlanStep] = Field(default_factory=list)
    evidence: List[CitedPassage] = Field(default_factory=list)


# ─── Indian IP to International Conversion Models ─────────────────────────────

class StatutoryDeadline(BaseModel):
    milestone: str
    deadline_date: str
    months_from_priority: int
    days_remaining: int
    status: Literal["PASSED", "URGENT", "UPCOMING"]
    statutory_basis: str
    description: str


class ClearanceCheck(BaseModel):
    requirement: str
    status: Literal["COMPLIANT", "ACTION_REQUIRED", "CRITICAL_BAR", "NOT_APPLICABLE"]
    governing_statute: str
    details: str
    remedy_step: Optional[str] = None


class JurisdictionRoadmap(BaseModel):
    jurisdiction: str
    jurisdiction_name: str
    authority: str
    filing_route: str
    key_statutory_requirements: List[str]
    estimated_official_fee: str
    recommended_action: str


class IndianToInternationalRequest(BaseModel):
    indian_application_number: str
    priority_date: str  # YYYY-MM-DD
    title: str
    ip_type: Literal["PATENT", "TRADEMARK", "FORMULATION"] = "PATENT"
    biological_materials: List[str] = Field(default_factory=list)
    has_foreign_filing_license: bool = False
    has_nba_approval: bool = False
    target_jurisdictions: List[str] = Field(default_factory=lambda: ["WO", "US", "EP", "DE"])
    applicant_type: Literal["NATURAL_PERSON", "STARTUP_SME", "LARGE_ENTITY"] = "STARTUP_SME"
    language: LanguageCode = "en"


class IndianToInternationalResponse(BaseModel):
    model_config = {"protected_namespaces": ()}
    indian_application_number: str
    title: str
    priority_date: str
    transition_readiness_score: int = Field(ge=0, le=100)
    overall_status: str
    deadlines: List[StatutoryDeadline] = Field(default_factory=list)
    clearances: List[ClearanceCheck] = Field(default_factory=list)
    roadmaps: List[JurisdictionRoadmap] = Field(default_factory=list)
    estimated_fees: Dict[str, str] = Field(default_factory=dict)
    required_documents: List[str] = Field(default_factory=list)
    action_plan: List[ActionPlanStep] = Field(default_factory=list)
    evidence: List[CitedPassage] = Field(default_factory=list)


