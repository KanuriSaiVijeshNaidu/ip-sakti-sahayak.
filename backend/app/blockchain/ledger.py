"""
backend/app/blockchain/ledger.py
─────────────────────────────────
Cryptographic Immutable Blockchain Ledger for IP-SAKTI.
Provides decentralized Proof-of-Existence (PoE), tamper-proof priority date
timestamping, and Merkle tree verification for Ayurvedic formulations,
patent specifications, and trademark marks.
"""
from __future__ import annotations

import hashlib
import json
import time
from dataclasses import dataclass, asdict, field
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional, Tuple


def sha256_hex(data: str) -> str:
    """Compute SHA-256 hash string."""
    return hashlib.sha256(data.encode("utf-8")).hexdigest()


class MerkleTree:
    """Binary Merkle Tree for transaction set verification."""

    @staticmethod
    def compute_root(tx_hashes: List[str]) -> str:
        if not tx_hashes:
            return sha256_hex("EMPTY_BLOCK_MERKLE_ROOT")
        if len(tx_hashes) == 1:
            return tx_hashes[0]

        current_level = list(tx_hashes)
        while len(current_level) > 1:
            # If odd number of hashes, duplicate the last one
            if len(current_level) % 2 != 0:
                current_level.append(current_level[-1])

            next_level = []
            for i in range(0, len(current_level), 2):
                combined = current_level[i] + current_level[i + 1]
                next_level.append(sha256_hex(combined))
            current_level = next_level

        return current_level[0]


@dataclass
class IPTransaction:
    """Represents a notarized intellectual property asset."""
    tx_id: str
    asset_id: str
    ip_type: str                  # "patent_specification", "ayush_formulation", "trademark_brand", "trade_secret"
    title: str
    applicant_name: str
    document_hash: str            # SHA-256 of the raw document/formula content
    metadata: Dict[str, Any]
    timestamp: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)

    @classmethod
    def create(
        cls,
        asset_id: str,
        ip_type: str,
        title: str,
        applicant_name: str,
        content_or_hash: str,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> IPTransaction:
        # If content_or_hash is not 64 hex chars, hash it
        if len(content_or_hash) == 64 and all(c in "0123456789abcdefABCDEF" for c in content_or_hash):
            doc_hash = content_or_hash.lower()
        else:
            doc_hash = sha256_hex(content_or_hash)

        ts = datetime.now(timezone.utc).isoformat()
        raw_payload = f"{asset_id}|{ip_type}|{title}|{applicant_name}|{doc_hash}|{ts}"
        tx_id = sha256_hex(raw_payload)

        return cls(
            tx_id=tx_id,
            asset_id=asset_id,
            ip_type=ip_type,
            title=title,
            applicant_name=applicant_name,
            document_hash=doc_hash,
            metadata=metadata or {},
            timestamp=ts,
        )


@dataclass
class Block:
    """Single immutable block in the IP-SAKTI chain."""
    index: int
    timestamp: str
    transactions: List[Dict[str, Any]]
    previous_hash: str
    merkle_root: str
    nonce: int
    hash: str

    def calculate_hash(self) -> str:
        payload = json.dumps({
            "index": self.index,
            "timestamp": self.timestamp,
            "transactions": self.transactions,
            "previous_hash": self.previous_hash,
            "merkle_root": self.merkle_root,
            "nonce": self.nonce,
        }, sort_keys=True)
        return sha256_hex(payload)

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)

    @classmethod
    def from_dict(cls, d: Dict[str, Any]) -> Block:
        return cls(**d)


class IPBlockchain:
    """Complete cryptographic blockchain ledger."""

    def __init__(self, difficulty: int = 2):
        self.chain: List[Block] = []
        self.pending_transactions: List[IPTransaction] = []
        self.difficulty = difficulty
        self._initialize_chain()

    def _initialize_chain(self):
        """Build Genesis Block if chain is empty."""
        if not self.chain:
            genesis_tx = IPTransaction(
                tx_id=sha256_hex("GENESIS_TX_IP_SAKTI_SOVEREIGN_REGISTRY"),
                asset_id="IP-GENESIS-0000",
                ip_type="genesis_declaration",
                title="IP-SAKTI Sahayak Sovereign Legal & Traditional Knowledge Ledger",
                applicant_name="Government of India / AYUSH-IP Consortium",
                document_hash=sha256_hex("AUTHENTIC_GENESIS_ROOT_AYURLEX_2026"),
                metadata={"network": "IP-SAKTI-MAINNET-01", "jurisdiction": "IN"},
                timestamp="2026-01-01T00:00:00Z",
            )
            merkle = MerkleTree.compute_root([genesis_tx.tx_id])
            genesis_block = Block(
                index=0,
                timestamp="2026-01-01T00:00:00Z",
                transactions=[genesis_tx.to_dict()],
                previous_hash="0" * 64,
                merkle_root=merkle,
                nonce=0,
                hash="",
            )
            genesis_block.hash = genesis_block.calculate_hash()
            self.chain.append(genesis_block)

    def get_latest_block(self) -> Block:
        return self.chain[-1]

    def add_transaction(self, transaction: IPTransaction) -> str:
        """Add transaction to pending pool. Returns tx_id."""
        self.pending_transactions.append(transaction)
        return transaction.tx_id

    def mine_block(self) -> Block:
        """
        Package pending transactions into a new Block with proof-of-work/timestamping.
        """
        if not self.pending_transactions:
            raise ValueError("No pending transactions to mine.")

        tx_dicts = [tx.to_dict() for tx in self.pending_transactions]
        tx_hashes = [tx.tx_id for tx in self.pending_transactions]
        merkle_root = MerkleTree.compute_root(tx_hashes)

        prev_block = self.get_latest_block()
        new_block = Block(
            index=prev_block.index + 1,
            timestamp=datetime.now(timezone.utc).isoformat(),
            transactions=tx_dicts,
            previous_hash=prev_block.hash,
            merkle_root=merkle_root,
            nonce=0,
            hash="",
        )

        # Simple proof-of-work target (difficulty leading zeros)
        prefix = "0" * self.difficulty
        while True:
            candidate_hash = new_block.calculate_hash()
            if candidate_hash.startswith(prefix):
                new_block.hash = candidate_hash
                break
            new_block.nonce += 1

        self.chain.append(new_block)
        self.pending_transactions = []
        return new_block

    def verify_chain(self) -> Tuple[bool, Optional[str]]:
        """Verify the integrity of the entire chain from Genesis to tip."""
        for i in range(len(self.chain)):
            current = self.chain[i]

            # 1. Verify block self-hash
            if current.calculate_hash() != current.hash:
                return False, f"Block {current.index} hash mismatch (tampered content)."

            # 2. Verify previous hash linkage (skip genesis)
            if i > 0:
                prev = self.chain[i - 1]
                if current.previous_hash != prev.hash:
                    return False, f"Block {current.index} previous_hash does not match Block {prev.index} hash."

            # 3. Verify Merkle root
            tx_hashes = [tx["tx_id"] for tx in current.transactions]
            expected_merkle = MerkleTree.compute_root(tx_hashes)
            if current.merkle_root != expected_merkle:
                return False, f"Block {current.index} Merkle root mismatch."

        return True, None

    def find_transaction(self, query_hash_or_id: str) -> Optional[Tuple[Block, Dict[str, Any]]]:
        """Search the blockchain for an asset by tx_id or document_hash."""
        q = query_hash_or_id.lower().strip()
        for block in reversed(self.chain):
            for tx in block.transactions:
                if tx["tx_id"].lower() == q or tx["document_hash"].lower() == q or tx["asset_id"].lower() == q:
                    return block, tx
        return None

    def to_dict(self) -> Dict[str, Any]:
        return {
            "chain": [b.to_dict() for b in self.chain],
            "pending_transactions": [tx.to_dict() for tx in self.pending_transactions],
            "difficulty": self.difficulty,
            "total_blocks": len(self.chain),
        }

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> IPBlockchain:
        bc = cls(difficulty=data.get("difficulty", 2))
        bc.chain = [Block.from_dict(b) for b in data.get("chain", [])]
        bc.pending_transactions = [
            IPTransaction(**tx) for tx in data.get("pending_transactions", [])
        ]
        return bc
