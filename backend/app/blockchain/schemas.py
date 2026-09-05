"""
backend/app/blockchain/schemas.py
──────────────────────────────────
Pydantic v2 schemas for Blockchain IP Notarization & Verification.
"""
from __future__ import annotations

from typing import Dict, Any, List, Optional, Literal
from pydantic import BaseModel, Field

IPAssetType = Literal[
    "patent_specification",
    "ayush_formulation",
    "trademark_brand",
    "trade_secret",
    "tkdl_defensive"
]


class NotarizeIPRequest(BaseModel):
    title: str = Field(..., min_length=3, max_length=200, description="Title of the IP asset or formulation")
    ip_type: IPAssetType = Field(default="ayush_formulation", description="Type of intellectual property")
    applicant_name: str = Field(..., min_length=2, max_length=150, description="Inventor, doctor, or entity name")
    applicant_email: Optional[str] = Field(None, description="Contact email for notification and certificate delivery")
    specification_text: Optional[str] = Field(None, description="Raw text of the invention claims, herbal formula, or trade secret")
    document_hash: Optional[str] = Field(None, description="Pre-computed SHA-256 hash if uploading pre-hashed confidential file")
    metadata: Dict[str, Any] = Field(default_factory=dict, description="Supplementary details like botanical herbs, Nice class, etc.")


class NotarizeIPResponse(BaseModel):
    status: str = "notarized"
    certificate_id: str
    tx_id: str
    block_index: int
    block_hash: str
    document_hash: str
    merkle_root: str
    timestamp: str
    verification_url: str


class VerifyIPResponse(BaseModel):
    is_verified: bool
    certificate_id: Optional[str] = None
    tx_id: Optional[str] = None
    block_index: Optional[int] = None
    timestamp: Optional[str] = None
    title: Optional[str] = None
    applicant_name: Optional[str] = None
    ip_type: Optional[str] = None
    document_hash: Optional[str] = None
    tamper_status: Literal["authentic", "tampered", "not_found"]
    details: str


class BlockSummary(BaseModel):
    index: int
    timestamp: str
    hash: str
    previous_hash: str
    merkle_root: str
    transaction_count: int
    nonce: int


class BlockchainLedgerResponse(BaseModel):
    chain_length: int
    chain_valid: bool
    latest_block_hash: str
    total_notarized_assets: int
    blocks: List[BlockSummary]
