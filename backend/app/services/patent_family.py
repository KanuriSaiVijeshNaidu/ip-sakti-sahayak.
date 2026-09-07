"""
backend/app/services/patent_family.py
─────────────────────────────────────
International patent family relationship extraction and priority lineage tracking.
Maps Priority -> PCT International Phase -> National Phase Entries (IN, US, EP, DE).
"""
from __future__ import annotations

import datetime
from typing import Any, Dict, List, Optional


class PatentFamilyMember:
    def __init__(
        self,
        jurisdiction: str,
        application_number: str,
        filing_date: str,
        publication_number: str,
        status: str,
        stage: str,
    ):
        self.jurisdiction = jurisdiction
        self.application_number = application_number
        self.filing_date = filing_date
        self.publication_number = publication_number
        self.status = status
        self.stage = stage

    def to_dict(self) -> Dict[str, Any]:
        return {
            "jurisdiction": self.jurisdiction,
            "application_number": self.application_number,
            "filing_date": self.filing_date,
            "publication_number": self.publication_number,
            "status": self.status,
            "stage": self.stage,
        }


class PatentFamilyTree:
    def __init__(
        self,
        invention_title: str,
        priority_country: str,
        priority_date: str,
        pct_number: str,
        members: List[PatentFamilyMember],
        suggested_cpc_classes: List[str],
    ):
        self.invention_title = invention_title
        self.priority_country = priority_country
        self.priority_date = priority_date
        self.pct_number = pct_number
        self.members = members
        self.suggested_cpc_classes = suggested_cpc_classes

    def to_dict(self) -> Dict[str, Any]:
        return {
            "invention_title": self.invention_title,
            "priority_country": self.priority_country,
            "priority_date": self.priority_date,
            "pct_number": self.pct_number,
            "members": [m.to_dict() for m in self.members],
            "suggested_cpc_classes": self.suggested_cpc_classes,
        }


def extract_patent_family_lineage(
    invention_title: str,
    priority_date: Optional[str] = None
) -> PatentFamilyTree:
    """
    Construct a simulated international patent family roadmap and statutory timelines.
    """
    today = datetime.date.today()
    p_date = priority_date or today.strftime("%Y-%m-%d")

    # Standard IPC/CPC for traditional medicine
    cpc = [
        "A61K 36/9066 — Curcuma longa (Turmeric rhizomes)",
        "A61K 36/67 — Piperaceae / Piper nigrum (Black pepper)",
        "A61K 36/81 — Withania somnifera (Ashwagandha)",
        "A61P 29/00 — Non-central analgesic, antipyretic or anti-inflammatory agents",
        "A61P 39/06 — Free radical scavengers / Antioxidants (Rasayana)"
    ]

    members = [
        PatentFamilyMember(
            jurisdiction="IN",
            application_number="IN202611029481",
            filing_date=p_date,
            publication_number="IN 2026/04829 A",
            status="Examination Pending (Form 18)",
            stage="Priority Application"
        ),
        PatentFamilyMember(
            jurisdiction="WO",
            application_number="PCT/IB2026/051280",
            filing_date="12 Months from Priority",
            publication_number="WO 2026/184920 A1",
            status="International Search Report Published",
            stage="PCT International Phase"
        ),
        PatentFamilyMember(
            jurisdiction="US",
            application_number="US 18/928,491",
            filing_date="30 Months from Priority",
            publication_number="US 2027/0192841 A1",
            status="National Stage Entry (35 U.S.C. 371)",
            stage="US National Phase"
        ),
        PatentFamilyMember(
            jurisdiction="EP",
            application_number="EP 26829410.4",
            filing_date="31 Months from Priority",
            publication_number="EP 4 192 841 A1",
            status="Under Examination (Rule 161/162 EPC)",
            stage="European Regional Phase"
        ),
        PatentFamilyMember(
            jurisdiction="DE",
            application_number="DE 10 2026 128 491",
            filing_date="31 Months from Priority",
            publication_number="DE 10 2026 128 491 A1",
            status="Designated via European Patent",
            stage="German National Validation"
        )
    ]

    return PatentFamilyTree(
        invention_title=invention_title,
        priority_country="IN",
        priority_date=p_date,
        pct_number="PCT/IB2026/051280",
        members=members,
        suggested_cpc_classes=cpc
    )
