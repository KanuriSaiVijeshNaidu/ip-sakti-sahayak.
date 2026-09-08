"""
pipeline/jurisdiction_validator.py
───────────────────────────────────
Hard Jurisdiction Validator for SIH 26045 International Patent Knowledge Base.

Enforces Section 13 of the mandate:
Strict publication-metadata validator:
- IN publication -> INDIA
- DE publication -> GERMANY
- WO publication -> WIPO/PCT
- US publication -> USA
- EP publication -> EUROPE

CRITICAL RULE:
Do NOT infer jurisdiction solely from:
- language (e.g. German text in an EP patent is EUROPE, NOT Germany)
- source website
- title
- country name appearing inside text
"""
from __future__ import annotations

import re
from typing import Any, Dict, Optional, Tuple


class HardJurisdictionValidator:
    """Strictly validates patent jurisdiction based solely on verified publication identifiers."""

    # Official WIPO ST.3 standard prefixes & regexes
    PATTERNS = {
        "INDIA": [
            re.compile(r"^IN[\s\-]?[0-9]{5,7}([\s\-]?[A-Z][0-9]?)?$", re.IGNORECASE),
            re.compile(r"^[0-9]+/(DEL|MUM|CHE|KOL)/[0-9]{4}$", re.IGNORECASE),
            re.compile(r"^IN[\s\-]?PAT[\s\-]?[0-9]+", re.IGNORECASE),
        ],
        "GERMANY": [
            re.compile(r"^DE[\s\-]?[0-9]{7,12}([\s\-]?[A-Z][0-9]?)?$", re.IGNORECASE),
            re.compile(r"^DE[\s\-]?10[\s\-]?[0-9]{10}([\s\-]?[A-Z][0-9]?)?$", re.IGNORECASE),
            re.compile(r"^DE[\s\-]?[0-9]{1,2}[\s\-]?[0-9]{4}[\s\-]?[0-9]{3,6}", re.IGNORECASE),
        ],
        "WIPO": [
            re.compile(r"^WO[\s\-]?[0-9]{4}/?[0-9]{5,7}([\s\-]?[A-Z][0-9]?)?$", re.IGNORECASE),
            re.compile(r"^PCT/[A-Z]{2}[0-9]{4}/[0-9]{5,7}$", re.IGNORECASE),
        ],
        "USA": [
            re.compile(r"^US[\s\-]?[0-9]{7,11}([\s\-]?[A-Z][0-9]?)?$", re.IGNORECASE),
            re.compile(r"^US[\s\-]?[0-9]{4}/?[0-9]{7}([\s\-]?[A-Z][0-9]?)?$", re.IGNORECASE),
        ],
        "EUROPE": [
            re.compile(r"^EP[\s\-]?[0-9]{7,10}([\s\-]?[A-Z][0-9]?)?$", re.IGNORECASE),
            re.compile(r"^EP[\s\-]?[0-9]{2}[0-9]{6,8}", re.IGNORECASE),
            re.compile(r"^EP[\s\-]?CLAIM[\s\-]?[0-9]+", re.IGNORECASE),
        ],
    }

    @classmethod
    def validate_record(cls, record: Dict[str, Any]) -> Tuple[bool, Optional[str], str]:
        """
        Validates whether a record's claimed jurisdiction matches its publication metadata.
        Returns: (is_valid, resolved_jurisdiction, reason)
        """
        claimed = (record.get("jurisdiction") or record.get("country") or "").upper()
        if claimed in ("DE", "GERMAN"):
            claimed = "GERMANY"
        elif claimed in ("IN", "IND"):
            claimed = "INDIA"
        elif claimed in ("WO", "PCT"):
            claimed = "WIPO"
        elif claimed in ("US", "USA"):
            claimed = "USA"
        elif claimed in ("EP", "EU"):
            claimed = "EUROPE"

        pub_num = str(record.get("publication_number") or record.get("patent_id") or "").strip()
        app_num = str(record.get("application_number") or "").strip()

        if not pub_num and not app_num:
            return False, None, "Missing both publication_number and application_number"

        # Determine true jurisdiction from identifiers alone
        detected_jurisdiction = None
        for j_name, patterns in cls.PATTERNS.items():
            for pat in patterns:
                if (pub_num and pat.match(pub_num)) or (app_num and pat.match(app_num)):
                    detected_jurisdiction = j_name
                    break
            if detected_jurisdiction:
                break

        if not detected_jurisdiction:
            return False, None, f"Identifier '{pub_num or app_num}' does not match any official jurisdiction pattern"

        # Enforce rule: German language does NOT imply GERMANY jurisdiction if EP or WO identifier
        lang = str(record.get("language") or "").lower()
        if lang == "de" and detected_jurisdiction in ("EUROPE", "WIPO"):
            if claimed == "GERMANY":
                return (
                    False,
                    detected_jurisdiction,
                    f"Illegal jurisdiction assignment: Document is written in German but its identifier '{pub_num}' belongs to {detected_jurisdiction}. Rule 13 forbids classifying EP/WO patents as GERMANY."
                )

        if claimed and claimed != detected_jurisdiction:
            return (
                False,
                detected_jurisdiction,
                f"Jurisdiction mismatch: Claimed '{claimed}', but verified identifier '{pub_num or app_num}' belongs to '{detected_jurisdiction}'."
            )

        return True, detected_jurisdiction, f"Successfully verified as {detected_jurisdiction} based on publication metadata."
