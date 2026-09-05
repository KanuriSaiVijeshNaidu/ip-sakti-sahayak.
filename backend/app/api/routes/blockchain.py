"""
backend/app/api/routes/blockchain.py
────────────────────────────────────
FastAPI route handlers for sovereign IP Blockchain Notarization & Verification.
Endpoints:
  POST /api/blockchain/notarize
  GET  /api/blockchain/verify/{asset_hash}
  GET  /api/blockchain/ledger
  GET  /api/blockchain/certificate/{certificate_id}
"""
from __future__ import annotations

import logging
from typing import Any, Dict
from fastapi import APIRouter, HTTPException, Path, status

from backend.app.blockchain.schemas import (
    NotarizeIPRequest,
    NotarizeIPResponse,
    VerifyIPResponse,
    BlockchainLedgerResponse,
)
from backend.app.blockchain.service import blockchain_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/blockchain")


@router.post(
    "/notarize",
    response_model=NotarizeIPResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Notarize an Intellectual Property asset onto the immutable ledger",
    description=(
        "Hashes patent claims, trademark descriptions, or Ayurvedic/herbal formulations, "
        "mined into a block with cryptographic Proof-of-Existence and SHA-256 Merkle root."
    ),
)
async def notarize_asset(request: NotarizeIPRequest) -> NotarizeIPResponse:
    try:
        response = blockchain_service.notarize_asset(request)
        return response
    except Exception as e:
        logger.error(f"Blockchain notarization error: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to notarize IP asset: {str(e)}",
        )


@router.get(
    "/verify/{asset_hash}",
    response_model=VerifyIPResponse,
    summary="Cryptographically verify an IP asset's authenticity and block timestamp",
    description="Look up any SHA-256 document hash, transaction ID, or asset ID to verify existence and tamper status.",
)
async def verify_asset(
    asset_hash: str = Path(..., description="SHA-256 document hash or transaction ID"),
) -> VerifyIPResponse:
    try:
        response = blockchain_service.verify_asset(asset_hash)
        return response
    except Exception as e:
        logger.error(f"Blockchain verification error: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Verification failed: {str(e)}",
        )


@router.get(
    "/ledger",
    response_model=BlockchainLedgerResponse,
    summary="Inspect the complete sovereign blockchain ledger",
    description="Returns block summaries, Merkle roots, total notarized IP assets, and chain cryptographic integrity.",
)
async def get_ledger() -> BlockchainLedgerResponse:
    try:
        return blockchain_service.get_ledger_summary()
    except Exception as e:
        logger.error(f"Error fetching ledger: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch ledger: {str(e)}",
        )


@router.get(
    "/certificate/{certificate_id}",
    summary="Retrieve Digital Legal Proof-of-Existence Certificate",
    description="Generates an exportable legal certificate JSON containing full cryptographic proof parameters.",
)
async def get_certificate(
    certificate_id: str = Path(..., description="Certificate ID (e.g. CERT-IPS-0001-A1B2C3D4)"),
) -> Dict[str, Any]:
    cert = blockchain_service.get_certificate(certificate_id)
    if not cert:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Certificate '{certificate_id}' not found on ledger.",
        )
    return cert
