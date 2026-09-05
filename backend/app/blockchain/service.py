"""
backend/app/blockchain/service.py
──────────────────────────────────
Persistent Blockchain IP Notarization & Proof-of-Existence Service.
Manages disk storage, Merkle certificate issuance, and cryptographic verification.
"""
from __future__ import annotations

import json
import logging
import os
import threading
from pathlib import Path
from typing import Optional, Dict, Any, List

from backend.app.core.config import settings
from backend.app.blockchain.ledger import IPBlockchain, IPTransaction, sha256_hex
from backend.app.blockchain.schemas import (
    NotarizeIPRequest,
    NotarizeIPResponse,
    VerifyIPResponse,
    BlockchainLedgerResponse,
    BlockSummary,
)

logger = logging.getLogger(__name__)


class BlockchainService:
    """Singleton service managing the on-disk IP-SAKTI Blockchain."""

    def __init__(self, ledger_file_path: Optional[str] = None):
        self.file_path = Path(ledger_file_path or settings.blockchain_ledger_path)
        self._lock = threading.Lock()
        self.blockchain: IPBlockchain = self._load_or_create_ledger()

    def _load_or_create_ledger(self) -> IPBlockchain:
        if self.file_path.exists():
            try:
                with open(self.file_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                bc = IPBlockchain.from_dict(data)
                is_valid, err = bc.verify_chain()
                if not is_valid:
                    logger.warning(f"Ledger file integrity compromised: {err}")
                else:
                    logger.info(f"Loaded valid blockchain ledger: {len(bc.chain)} blocks from {self.file_path}")
                return bc
            except Exception as e:
                logger.error(f"Error reading ledger file: {e}. Initializing fresh sovereign chain.")

        bc = IPBlockchain(difficulty=settings.blockchain_difficulty)
        self._save_ledger_unlocked(bc)
        logger.info(f"Initialized new sovereign IP-SAKTI blockchain ledger at {self.file_path}")
        return bc

    def _save_ledger_unlocked(self, bc: IPBlockchain):
        self.file_path.parent.mkdir(parents=True, exist_ok=True)
        with open(self.file_path, "w", encoding="utf-8") as f:
            json.dump(bc.to_dict(), f, indent=2)

    def notarize_asset(self, req: NotarizeIPRequest) -> NotarizeIPResponse:
        """
        Timestamp and notarize an intellectual property asset onto the immutable ledger.
        """
        with self._lock:
            # Generate unique asset ID
            total_assets = sum(len(b.transactions) for b in self.blockchain.chain) + len(self.blockchain.pending_transactions)
            asset_id = f"IP-NOTARY-{req.ip_type.upper()[:4]}-{total_assets + 1:04d}"

            # Document content or precomputed hash
            payload = req.specification_text if req.specification_text else (req.document_hash or req.title)

            tx = IPTransaction.create(
                asset_id=asset_id,
                ip_type=req.ip_type,
                title=req.title,
                applicant_name=req.applicant_name,
                content_or_hash=payload,
                metadata={
                    **req.metadata,
                    "applicant_email": req.applicant_email,
                },
            )

            # Add to pending and mine block immediately for instantaneous proof-of-existence
            self.blockchain.add_transaction(tx)
            new_block = self.blockchain.mine_block()
            self._save_ledger_unlocked(self.blockchain)

            cert_id = f"CERT-IPS-{new_block.index:04d}-{tx.tx_id[:8].upper()}"

            logger.info(
                f"Notarized IP: title='{req.title[:30]}' asset_id={asset_id} "
                f"block={new_block.index} hash={new_block.hash[:12]}"
            )

            return NotarizeIPResponse(
                status="notarized",
                certificate_id=cert_id,
                tx_id=tx.tx_id,
                block_index=new_block.index,
                block_hash=new_block.hash,
                document_hash=tx.document_hash,
                merkle_root=new_block.merkle_root,
                timestamp=tx.timestamp,
                verification_url=f"https://{settings.domain_name}/api/blockchain/verify/{tx.document_hash}",
            )

    def verify_asset(self, hash_or_id: str) -> VerifyIPResponse:
        """
        Verify the existence and cryptographic tamper status of an asset on the blockchain.
        """
        with self._lock:
            # First check overall chain integrity
            chain_valid, err = self.blockchain.verify_chain()
            if not chain_valid:
                return VerifyIPResponse(
                    is_verified=False,
                    tamper_status="tampered",
                    details=f"CRITICAL: Blockchain ledger integrity compromised ({err})",
                )

            found = self.blockchain.find_transaction(hash_or_id)
            if not found:
                return VerifyIPResponse(
                    is_verified=False,
                    tamper_status="not_found",
                    details="No notarized record found on the IP-SAKTI blockchain ledger for this hash or ID.",
                )

            block, tx = found
            cert_id = f"CERT-IPS-{block.index:04d}-{tx['tx_id'][:8].upper()}"

            return VerifyIPResponse(
                is_verified=True,
                certificate_id=cert_id,
                tx_id=tx["tx_id"],
                block_index=block.index,
                timestamp=tx["timestamp"],
                title=tx["title"],
                applicant_name=tx["applicant_name"],
                ip_type=tx["ip_type"],
                document_hash=tx["document_hash"],
                tamper_status="authentic",
                details=(
                    f"Verified authentic and immutable in Block #{block.index} "
                    f"(Merkle Root: {block.merkle_root[:12]}...). Registered on {tx['timestamp']}."
                ),
            )

    def get_ledger_summary(self) -> BlockchainLedgerResponse:
        """Inspect the complete state of the blockchain."""
        with self._lock:
            chain_valid, _ = self.blockchain.verify_chain()
            total_assets = sum(len(b.transactions) for b in self.blockchain.chain)

            summaries = [
                BlockSummary(
                    index=b.index,
                    timestamp=b.timestamp,
                    hash=b.hash,
                    previous_hash=b.previous_hash,
                    merkle_root=b.merkle_root,
                    transaction_count=len(b.transactions),
                    nonce=b.nonce,
                )
                for b in self.blockchain.chain
            ]

            return BlockchainLedgerResponse(
                chain_length=len(self.blockchain.chain),
                chain_valid=chain_valid,
                latest_block_hash=self.blockchain.get_latest_block().hash,
                total_notarized_assets=total_assets,
                blocks=summaries,
            )

    def get_certificate(self, certificate_id: str) -> Optional[Dict[str, Any]]:
        """Retrieve full legal digital certificate payload."""
        with self._lock:
            # Parse block index from certificate ID (e.g. CERT-IPS-0001-A1B2C3D4)
            parts = certificate_id.split("-")
            target_tx_prefix = parts[-1].lower() if len(parts) >= 4 else ""

            for block in reversed(self.blockchain.chain):
                for tx in block.transactions:
                    if tx["tx_id"].lower().startswith(target_tx_prefix) or certificate_id.lower() in tx["asset_id"].lower():
                        return {
                            "certificate_id": certificate_id,
                            "legal_declaration": (
                                "This Certificate of Cryptographic Proof of Existence confirms that the "
                                "associated Intellectual Property or Traditional Knowledge formulation was sealed "
                                "in an immutable, tamper-proof blockchain block on the stated UTC timestamp."
                            ),
                            "asset_id": tx["asset_id"],
                            "title": tx["title"],
                            "applicant_name": tx["applicant_name"],
                            "ip_type": tx["ip_type"],
                            "document_hash_sha256": tx["document_hash"],
                            "tx_id": tx["tx_id"],
                            "block_index": block.index,
                            "block_hash": block.hash,
                            "merkle_root": block.merkle_root,
                            "notarized_timestamp_utc": tx["timestamp"],
                            "sovereign_network": f"AYURLEX Sovereign Legal Ledger ({settings.domain_name})",
                        }
            return None


# Global singleton instance
blockchain_service = BlockchainService()
