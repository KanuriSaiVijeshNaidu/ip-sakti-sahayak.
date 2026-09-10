"""
backend/app/decision/context.py
───────────────────────────────
Defines the AnalysisContext data structure guaranteeing that every user question
generates a fresh, question-specific retrieval and analysis context.
"""
from __future__ import annotations

import uuid
from typing import Dict, List, Any, Optional
from pydantic import BaseModel, Field

from backend.app.models.retrieval_schemas import EvidenceResult
from backend.app.models.decision_schemas import EvidenceSufficiency


class AnalysisContext(BaseModel):
    query_id: str = Field(default_factory=lambda: f"qry_{uuid.uuid4().hex[:12]}")
    original_question: str
    normalized_question: str
    resolved_references: Dict[str, Any] = Field(default_factory=dict)
    detected_intent: str
    domain: str
    jurisdiction: str
    target_market: Optional[str] = None
    language: str = "en"
    retrieval_query: str
    retrieved_evidence: List[Dict[str, Any]] = Field(default_factory=list)
    reranked_evidence: List[Dict[str, Any]] = Field(default_factory=list)
    evidence_sufficiency: Optional[EvidenceSufficiency] = None
    citation_validation: Dict[str, Any] = Field(default_factory=dict)
    claims: List[Dict[str, Any]] = Field(default_factory=list)
    alignment_verified: bool = False
    is_general_knowledge: bool = False
