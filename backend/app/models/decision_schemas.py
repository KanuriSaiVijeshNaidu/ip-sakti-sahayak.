"""
backend/app/models/decision_schemas.py
───────────────────────────────────────
Pydantic schemas and enumerations for Phase 7 Decision & Jurisdiction Reasoning Engine.

DecisionType   — deterministic enumeration (YES / NO / CONDITIONAL_YES / CONDITIONAL_NO / INSUFFICIENT_EVIDENCE)
DecisionConfidence — HIGH / MEDIUM / LOW (independent of CRAG confidence)
UserObjective  — sell / export / market / commercialize / patent_validity / patentability /
                 third_party_patent / regulatory_requirement / legality / fto
QueryIntent    — full extracted intent beyond Phase 5 QueryAnalysis
EvidenceSufficiency — legal/factual sufficiency assessment (separate from CRAG)
DecisionAnalysis — structured breakdown (patent / regulatory / FTO)
DecisionResponse — final structured answer returned to the caller
"""
from __future__ import annotations

from enum import Enum
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


# ─── Enumerations ─────────────────────────────────────────────────────────────

class DecisionType(str, Enum):
    YES = "YES"
    NO = "NO"
    CONDITIONAL_YES = "CONDITIONAL_YES"
    CONDITIONAL_NO = "CONDITIONAL_NO"
    INSUFFICIENT_EVIDENCE = "INSUFFICIENT_EVIDENCE"


class DecisionConfidence(str, Enum):
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"


class UserObjective(str, Enum):
    SELL = "sell"
    EXPORT = "export"
    MARKET = "market"
    COMMERCIALIZE = "commercialize"
    PATENT_VALIDITY = "patent_validity"
    PATENTABILITY = "patentability"
    THIRD_PARTY_PATENT = "third_party_patent"
    REGULATORY_REQUIREMENT = "regulatory_requirement"
    LEGALITY = "legality"
    FTO = "fto"
    GENERAL = "general"


class ProductClassification(str, Enum):
    FOOD = "food"
    DIETARY_SUPPLEMENT = "dietary_supplement"
    COSMETIC = "cosmetic"
    DRUG = "drug"
    TRADITIONAL_MEDICINE = "traditional_medicine"
    UNKNOWN = "unknown"


# ─── Query Intent Model ────────────────────────────────────────────────────────

class QueryIntent(BaseModel):
    """
    Rich intent extracted from the user query.
    Extends Phase 5 QueryAnalysis with commercialization-specific fields.
    """
    origin_country: Optional[str] = Field(
        default=None,
        description="Country/jurisdiction where the user's IP originates (e.g. IN, US)"
    )
    target_country: Optional[str] = Field(
        default=None,
        description="Country/jurisdiction where the user wants to act (e.g. US, JP). PRIORITY for commercialization."
    )
    raw_query: str = Field(
        default="", description="Original user query"
    )
    product: Optional[str] = Field(
        default=None, description="Primary product name extracted from query"
    )
    formulation: Optional[str] = Field(
        default=None, description="Specific formulation or composition description"
    )
    ingredients: List[str] = Field(
        default_factory=list, description="Extracted ingredient / compound names"
    )
    intended_use: Optional[str] = Field(
        default=None, description="Stated intended use of the product"
    )
    health_claims: List[str] = Field(
        default_factory=list, description="Any health or therapeutic claims mentioned"
    )
    patent_number: Optional[str] = Field(
        default=None, description="Specific patent number referenced"
    )
    patent_status: Optional[str] = Field(
        default=None, description="Claimed status of the patent (granted, pending, expired)"
    )
    applicant: Optional[str] = Field(
        default=None, description="Patent applicant or assignee mentioned"
    )
    owner: Optional[str] = Field(
        default=None, description="Patent owner mentioned"
    )
    user_objective: UserObjective = Field(
        default=UserObjective.GENERAL,
        description="Primary user objective extracted from query"
    )
    is_commercialization_question: bool = Field(
        default=False,
        description="True when the question is primarily about sell/export/market/commercialize"
    )
    is_fto_question: bool = Field(
        default=False,
        description="True when the question asks about freedom to operate or IP risk"
    )
    requires_target_jurisdiction_routing: bool = Field(
        default=False,
        description="True when target_country should override origin for retrieval routing"
    )
    detected_intent: Optional[str] = Field(
        default=None,
        description="Intent label if detected by upstream router"
    )


# ─── Evidence Sufficiency Model ────────────────────────────────────────────────

class EvidenceSufficiency(BaseModel):
    """
    Factual/legal sufficiency assessment — independent of CRAG technical confidence.
    CRAG measures retrieval quality; this measures whether the retrieved content
    can actually support a legal/regulatory decision.
    """
    evidence_sufficient: bool = Field(
        ..., description="True if evidence is sufficient to make a responsible decision"
    )
    required_evidence_present: bool = Field(
        ..., description="True if all required evidence categories are represented"
    )
    unresolved_material_conditions: List[str] = Field(
        default_factory=list,
        description="Material conditions that must be resolved before a YES/NO decision"
    )
    jurisdiction_valid: bool = Field(
        ..., description="True if evidence jurisdiction matches the required target jurisdiction"
    )
    source_authority: int = Field(
        default=3,
        ge=1, le=5,
        description="Evidence authority score (1=low, 5=authoritative government/official source)"
    )
    missing_evidence_categories: List[str] = Field(
        default_factory=list,
        description="Evidence categories not represented (patent/regulatory/FTO/classification)"
    )
    decision_reason_codes: List[str] = Field(
        default_factory=list,
        description="Structured diagnostic codes explaining sufficiency evaluation"
    )
    patent_evidence_count: int = Field(
        default=0, description="Count of retrieved patent evidence chunks"
    )
    regulatory_evidence_count: int = Field(
        default=0, description="Count of statutory/regulatory evidence chunks"
    )
    fto_evidence_count: int = Field(
        default=0, description="Count of third-party IP/FTO candidate chunks"
    )
    evidence_note: str = Field(
        default="",
        description="Human-readable summary of evidence sufficiency assessment"
    )


# ─── Decision Analysis ─────────────────────────────────────────────────────────

class DecisionAnalysis(BaseModel):
    """
    Structured analysis from the Decision Rule Engine across key domains.
    """
    patent_analysis: str = Field(
        default="",
        description="Patent territoriality and protection scope analysis"
    )
    regulatory_analysis: str = Field(
        default="",
        description="Regulatory classification and approval requirement analysis"
    )
    ip_fto_analysis: str = Field(
        default="",
        description="Freedom-to-operate and third-party IP risk analysis"
    )
    conditions: List[str] = Field(
        default_factory=list,
        description="Conditions that must be satisfied to achieve a YES outcome"
    )
    required_next_steps: List[str] = Field(
        default_factory=list,
        description="Ordered list of required actions for the user"
    )
    product_classification: ProductClassification = Field(
        default=ProductClassification.UNKNOWN,
        description="Regulatory product classification"
    )
    patent_territoriality_note: Optional[str] = Field(
        default=None,
        description="Explicit note about patent territoriality if relevant"
    )
    fto_safety_note: Optional[str] = Field(
        default=None,
        description="FTO safety disclaimer when FTO question is detected"
    )
    decision_reason_codes: List[str] = Field(
        default_factory=list,
        description="Structured reason codes driving the decision outcome"
    )


# ─── Request / Response ────────────────────────────────────────────────────────

class DecisionRequest(BaseModel):
    """Request schema for POST /api/decision."""
    query: str = Field(..., min_length=1, description="User's commercialization or IP question")
    jurisdiction: Optional[str] = Field(
        default=None,
        description="Optional explicit jurisdiction override (US, EP, WO, JP)"
    )
    top_k: Optional[int] = Field(default=5, ge=1, le=15)
    language: Optional[str] = Field(
        default=None,
        description="Optional forced output language code (en, te, hi, ja)"
    )


class DecisionResponse(BaseModel):
    """Structured Phase 7 Decision Response."""
    query: str = Field(..., description="Original user query")
    decision: DecisionType = Field(..., description="Deterministic decision enumeration")
    why: str = Field(..., description="Primary rationale for the decision")
    patent_analysis: str = Field(default="", description="Patent protection scope and territoriality")
    regulatory_analysis: str = Field(default="", description="Regulatory classification and requirements")
    ip_fto_analysis: str = Field(default="", description="Freedom-to-operate and third-party IP analysis")
    conditions: List[str] = Field(
        default_factory=list,
        description="Conditions under which a conditional decision may become YES"
    )
    required_next_steps: List[str] = Field(
        default_factory=list,
        description="Ordered list of recommended next steps"
    )
    evidence: List[Dict[str, Any]] = Field(
        default_factory=list,
        description="Evidence citations supporting the decision"
    )
    confidence: DecisionConfidence = Field(
        ...,
        description="Decision confidence (HIGH/MEDIUM/LOW) — independent of CRAG confidence"
    )
    query_intent: QueryIntent = Field(..., description="Extracted query intent")
    evidence_sufficiency: EvidenceSufficiency = Field(..., description="Evidence sufficiency assessment")
    detected_language: str = Field(default="en", description="Detected or forced output language")
    jurisdictions_searched: List[str] = Field(
        default_factory=list, description="Production jurisdictions searched"
    )
    # Explicit Jurisdiction Separation Model
    origin_jurisdiction: Optional[str] = Field(
        default=None, description="Origin jurisdiction of patent/product context (e.g. IN)"
    )
    target_jurisdiction: Optional[str] = Field(
        default=None, description="Target jurisdiction where commercialization/operation is proposed (e.g. US)"
    )
    decision_jurisdiction: str = Field(
        default="US", description="Primary jurisdiction governing the commercialization decision"
    )
    # Scoped Evidence Buckets
    origin_evidence: List[Dict[str, Any]] = Field(
        default_factory=list, description="Evidence relevant strictly to origin patent context"
    )
    target_evidence: List[Dict[str, Any]] = Field(
        default_factory=list, description="Evidence governing the target commercialization decision"
    )
    cross_jurisdiction_evidence: List[Dict[str, Any]] = Field(
        default_factory=list, description="Cross-jurisdiction prior art or international filings"
    )
    evaluation_evidence: List[Dict[str, Any]] = Field(
        default_factory=list, description="Evaluation-only evidence (e.g. Indian Patents Act statutory data)"
    )
    origin_evidence_note: Optional[str] = Field(
        default=None, description="Explicit scoped note explaining origin evidence status"
    )
    target_evidence_note: Optional[str] = Field(
        default=None, description="Explicit scoped note explaining target evidence status"
    )
    crag_status: str = Field(default="GOOD", description="Underlying CRAG technical status")
    evaluation_only: bool = Field(
        default=False,
        description="True if query was routed to India evaluation-only path"
    )
    latencies_ms: Dict[str, float] = Field(
        default_factory=dict, description="Stage-level latencies in milliseconds"
    )
    disclaimer: str = Field(
        default=(
            "DECISION SUPPORT ONLY. This analysis is generated from retrieved patent/regulatory "
            "evidence and does not constitute legal advice. It does not establish patent validity, "
            "infringement determination, freedom to operate, or commercialization rights. "
            "Consult a qualified patent attorney or regulatory professional before taking action."
        ),
        description="Mandatory legal disclaimer"
    )
