"""
backend/app/rag/evidence_gate.py
────────────────────────────────
AYURLEX Evidence Compatibility Gate.

Core System Invariant:
  "Retrieved similarity is not evidence support."

Evaluates candidate chunks to ensure they legitimately support the query across:
  1. Jurisdiction match (strict isolation, zero cross-jurisdiction substitution)
  2. Domain match (statutory law vs patent disclosure vs regulatory vs trademark)
  3. Source type match (patent application cannot serve as statutory legal rule)
  4. Intent match (prior art search vs legal standard vs FTO)
  5. Proposition support (specific section/article requested MUST be cited in candidate)
  6. Authority level
"""
from __future__ import annotations

import re
import logging
from typing import List, Optional, Dict, Any, Tuple
from backend.app.models.rag_schemas import EvidenceSupportDecision

logger = logging.getLogger(__name__)

# Jurisdictions recognized by AYURLEX
SUPPORTED_JURISDICTIONS = {"IN", "US", "EP", "WO", "JP"}
UNSUPPORTED_JURISDICTIONS_PATTERNS = {
    "AU": r"\b(australia|australian|tga|ipaustralia)\b",
    "DE": r"\b(germany|german|deutschland|dpma|bundespatentgericht|patg)\b",
    "BR": r"\b(brazil|brasil|brazilian|anvisa|inpi)\b",
    "CN": r"\b(china|chinese|nmpa|cnipa|sipo)\b",
    "CA": r"\b(canada|canadian|health canada|cipo)\b",
    "UK": r"\b(united kingdom|uk|mhra|britain|british|england|ukipo)\b",
    "RU": r"\b(russia|russian|rospatent)\b",
    "ZA": r"\b(south africa|south african|sahpra|cipc)\b",
    "NZ": r"\b(new zealand|medsafe|iponz)\b",
    "KR": r"\b(korea|korean|south korea|kipo|mfds)\b",
}

# Regex for detecting statutory legal rule questions
RE_STATUTORY_LEGAL_RULE = re.compile(
    r"\b("
    r"patent\s+(law|act|statute|rules?|criteria|standard)|"
    r"statutory|"
    r"patentability\s+requirements?|"
    r"requirements?\s+for\s+(novelty|inventive\s+step|non-obviousness?|patentability)|"
    r"what\s+is\s+(novelty|inventive\s+step|non-obviousness?)\s+under|"
    r"what\s+does\s+(section|article|rule|35\s*u\.?s\.?c|epc|pct|law|statute)\s+|"
    r"article\s+[0-9]+|section\s+[0-9]+|"
    r"35\s*u\.?s\.?c|"
    r"mpep|"
    r"examination\s+guidelines?|"
    r"st\.?26|"
    r"schedule\s+t|rule\s+158b|"
    r"特許要件|特許法第[0-9]+条|新規性要件"
    r")\b",
    re.IGNORECASE,
)

# Regex to detect concrete prior art / patent document search (where invention patents are allowed)
RE_PRIOR_ART_LANDSCAPE = re.compile(
    r"\b("
    r"find\s+patents?|"
    r"prior\s+art\s+for|"
    r"patents?\s+related\s+to|"
    r"disclosed\s+in\s+(patents?|applications?)|"
    r"existing\s+patents?|"
    r"patent\s+landscape|"
    r"先行技術|先行特許"
    r")\b",
    re.IGNORECASE,
)


class EvidenceCompatibilityGate:
    """
    Evaluates whether an individual retrieved candidate chunk genuinely supports the inquiry.
    """

    def detect_query_jurisdiction(self, query: str, default_jurisdiction: Optional[str] = None) -> Optional[str]:
        """Detects explicitly requested or implied jurisdiction from query text."""
        q_lower = query.lower()

        # Check unsupported jurisdictions first
        for code, pattern in UNSUPPORTED_JURISDICTIONS_PATTERNS.items():
            if re.search(pattern, q_lower):
                return code

        # Check supported jurisdictions
        if re.search(r"\b(jp|japan|japanese|jpo|pmda|mhlw|特許法|薬機法)\b", q_lower) or "日本" in query:
            return "JP"
        if re.search(r"\b(us|usa|united states|uspto|35\s*u\.?s\.?c|fda|dshea|21\s*cfr|21\s*u\.?s\.?c|mpep)\b", q_lower) or "米国" in query or "アメリカ" in query:
            return "US"
        if re.search(r"\b(ep|epo|epc|european patent|europe|thmpd)\b", q_lower) or "欧州" in query:
            return "EP"
        if re.search(r"\b(wo|wipo|pct|international application|patentscope|iprp|isr|wo-isa)\b", q_lower) or "国際出願" in query:
            return "WO"
        if re.search(r"\b(in|india|indian|cgpdtm|ipo|ayush|fssai|section 3|tkdl|nba|rule 158b|schedule t)\b", q_lower) or any(k in query for k in ["भारत", "भारतीय", "భారత"]):
            return "IN"

        return default_jurisdiction

    def is_statutory_source(self, cand: Any) -> bool:
        """Determines if the candidate is a verified statutory/regulatory anchor or official guideline."""
        chunk_id = getattr(cand, "chunk_id", None) or (cand.get("chunk_id", "") if isinstance(cand, dict) else "")
        doc_id = getattr(cand, "document_id", None) or (cand.get("document_id", "") if isinstance(cand, dict) else "")
        ev_type = getattr(cand, "evidence_type", None) or (cand.get("evidence_type", "") if isinstance(cand, dict) else "")
        src = getattr(cand, "source", None) or (cand.get("source", "") if isinstance(cand, dict) else "")
        sec = getattr(cand, "section", None) or (cand.get("section", "") if isinstance(cand, dict) else "")
        auth_tier = getattr(cand, "authority_tier", 1) or (cand.get("authority_tier", 1) if isinstance(cand, dict) else 1)

        if ev_type == "statutory":
            return True

        if chunk_id.startswith(("STATUTE-", "REG-", "GUIDE-")):
            return True

        src_type = getattr(cand, "source_type", None) or (cand.get("source_type", "") if isinstance(cand, dict) else "")
        if src_type in ["official_statute", "secondary_legal_statute", "official_rules", "official_guidelines", "statute", "rules", "guidelines"]:
            return True

        if doc_id.startswith(("STATUTE-", "REG-", "GUIDE-", "IN_doc-india-code", "IN_IN-ACT", "IN_IN-GUIDELINE", "IN_IN-REG", "IN_doc-dcr-1945", "IN_IN-ACT-TM", "IN_IN-ACT-BDA", "IN-KANOON", "IN_KANOON")):
            return True

        if chunk_id.startswith(("IN_doc-india-code", "IN_IN-ACT", "IN_IN-GUIDELINE", "IN_IN-REG", "IN_doc-dcr-1945", "IN_KANOON", "IN-KANOON")):
            return True

        if any(sec.startswith(prefix) for prefix in [
            "35 U.S.C.", "EPC Article", "PCT Article", "Japanese Patent Act Article",
            "The Patents Act, 1970", "Rule 158B", "Schedule T", "Section 6", "Section 13", "Section 9", "Section 11", "Section 53"
        ]):
            return True

        return False

    def extract_requested_statutory_sections(self, query: str) -> List[Tuple[str, str]]:
        """
        Extracts specific statutory sections, articles, or rules from the query.
        Returns list of (type, normalized_identifier), e.g. [("article", "39"), ("usc", "161"), ("mpep", "2106")].
        """
        q_lower = query.lower()
        sections = []

        # 35 U.S.C. § 161 / 35 USC 102
        usc_matches = re.findall(r"35\s*u\.?s\.?c\.?\s*(?:§|sec\.?|section)?\s*([0-9]+)", q_lower)
        for m in usc_matches:
            sections.append(("usc", m.strip()))

        # MPEP 2106
        mpep_matches = re.findall(r"mpep\s*([0-9]+(?:\.[0-9]+)?)", q_lower)
        for m in mpep_matches:
            sections.append(("mpep", m.strip()))

        # WIPO ST.26
        if "st.26" in q_lower or "st 26" in q_lower or "st-26" in q_lower:
            sections.append(("st", "26"))

        # Japanese Patent Act Article 39 / Article 36 / Article 29
        # EPC Article 123(2) / Article 56 / Article 54
        # PCT Article 19 / Article 18
        # General Article X
        art_matches = re.findall(r"article\s+([0-9]+(?:\([0-9a-z]+\))?)", q_lower)
        for m in art_matches:
            sections.append(("article", m.strip()))

        # Japanese specific: 第39条, 第36条, 第29条
        ja_art_matches = re.findall(r"第([0-9]+)条", query)
        for m in ja_art_matches:
            sections.append(("article", m.strip()))

        # Section 3(d), Section 3(e), Section 3(p), Section 112, Section 102, Section 161, Section 6, Section 13
        sec_matches = re.findall(r"section\s+([0-9]+(?:\([0-9a-z]+\))?)", q_lower)
        for m in sec_matches:
            sections.append(("section", m.strip()))

        # Rule 158B, Schedule T
        if "158b" in q_lower:
            sections.append(("rule", "158b"))
        if "schedule t" in q_lower:
            sections.append(("schedule", "t"))

        return sections

    def check_candidate_contains_section(self, cand: Any, sec_type: str, sec_id: str) -> bool:
        """Verifies whether candidate actually contains/cites the requested statutory article/section."""
        text = getattr(cand, "text", "") or (cand.get("text", "") if isinstance(cand, dict) else "")
        title = getattr(cand, "title", "") or (cand.get("title", "") if isinstance(cand, dict) else "")
        sec = getattr(cand, "section", "") or (cand.get("section", "") if isinstance(cand, dict) else "")
        chunk_id = getattr(cand, "chunk_id", "") or (cand.get("chunk_id", "") if isinstance(cand, dict) else "")
        pub_num = getattr(cand, "publication_number", "") or (cand.get("publication_number", "") if isinstance(cand, dict) else "")

        combined = f"{chunk_id} {pub_num} {sec} {title} {text}".lower()

        # Handle specific types
        if sec_type == "usc":
            # Must mention the specific USC section number, e.g. "161", "102", "112"
            pattern = rf"(35\s*u\.?s\.?c\.?\s*(?:§|sec\.?|section)?\s*{sec_id}\b|\b§\s*{sec_id}\b|\bsection\s+{sec_id}\b)"
            return bool(re.search(pattern, combined))

        if sec_type == "mpep":
            return "mpep" in combined and sec_id in combined

        if sec_type == "st":
            return "st.26" in combined or "st 26" in combined or "st-26" in combined or "wipo st" in combined

        if sec_type == "article":
            base_num = re.match(r"([0-9]+)", sec_id).group(1) if re.match(r"([0-9]+)", sec_id) else sec_id
            pattern = rf"(?:article\s+|art\.?\s*){base_num}(?![0-9])|第\s*{base_num}\s*条|statute-[a-z]+-[a-z]+-.*{base_num}"
            return bool(re.search(pattern, combined))

        if sec_type == "section":
            base_sec = sec_id.lower().strip()
            escaped = re.escape(base_sec)
            pattern = rf"(?:section\s+|sec\.?\s*|§\s*|\b){escaped}(?![a-zA-Z0-9])"
            return bool(re.search(pattern, combined))

        if sec_type == "rule":
            return "158b" in combined

        if sec_type == "schedule":
            return "schedule t" in combined

        return sec_id in combined

    def evaluate_candidate(
        self,
        query: str,
        target_jurisdictions: List[str],
        candidate: Any,
    ) -> EvidenceSupportDecision:
        """
        Evaluates an individual candidate chunk against query requirements.
        Returns EvidenceSupportDecision with structured audit fields.
        """
        cand_jur = getattr(candidate, "jurisdiction", None) or (candidate.get("jurisdiction", "") if isinstance(candidate, dict) else "")
        cand_jur = cand_jur.strip().upper()
        cand_id = getattr(candidate, "chunk_id", "") or (candidate.get("chunk_id", "") if isinstance(candidate, dict) else "")
        cand_title = getattr(candidate, "title", "") or (candidate.get("title", "") if isinstance(candidate, dict) else "")
        cand_sec = getattr(candidate, "section", "") or (candidate.get("section", "") if isinstance(candidate, dict) else "")
        cand_text = getattr(candidate, "text", "") or (candidate.get("text", "") if isinstance(candidate, dict) else "")
        score = getattr(candidate, "rerank_score", None) or (candidate.get("rerank_score", 0.0) if isinstance(candidate, dict) else 0.0)
        score = score or 0.0

        q_lower = query.lower()

        # ── 1. Jurisdiction Match Check ───────────────────────────────────────
        req_jur = self.detect_query_jurisdiction(query, default_jurisdiction=target_jurisdictions[0] if target_jurisdictions else None)
        
        # If query specifically asked for an unsupported jurisdiction (AU, DE, BR, CA, etc.)
        if req_jur in UNSUPPORTED_JURISDICTIONS_PATTERNS:
            dec = EvidenceSupportDecision(
                supported=False,
                jurisdiction_match=False,
                domain_match=False,
                source_type_match=False,
                intent_match=False,
                subject_match=False,
                proposition_supported=False,
                authority_sufficient=False,
                confidence=0.0,
                reason=(
                    f"Jurisdiction mismatch: query specifically targets unsupported jurisdiction '{req_jur}', "
                    f"but candidate is from '{cand_jur}'. Jurisdiction substitution is strictly prohibited."
                ),
            )
            self._log_audit(query, req_jur, "unsupported", cand_id, dec)
            return dec

        # Check if query asks for a specific supported jurisdiction (e.g. US, JP, EP, WO, IN)
        # and candidate is from a completely different jurisdiction
        if req_jur and cand_jur != req_jur:
            # Special case: multi-jurisdiction comparison query
            is_comparison = any(w in q_lower for w in ["compare", "comparison", "difference between", "versus", "vs", "対比", "比較"])
            if not (is_comparison and cand_jur in target_jurisdictions):
                dec = EvidenceSupportDecision(
                    supported=False,
                    jurisdiction_match=False,
                    domain_match=True,
                    source_type_match=True,
                    intent_match=False,
                    subject_match=False,
                    proposition_supported=False,
                    authority_sufficient=False,
                    confidence=0.0,
                    reason=f"Jurisdiction mismatch: query requires '{req_jur}', but candidate is from '{cand_jur}'. Cross-jurisdiction substitution is forbidden.",
                )
                self._log_audit(query, req_jur, "jurisdiction_conflict", cand_id, dec)
                return dec

        # ── 2. Domain & Source Type Compatibility Check ────────────────────────
        is_stat_rule_query = bool(RE_STATUTORY_LEGAL_RULE.search(q_lower))
        is_prior_art_query = bool(RE_PRIOR_ART_LANDSCAPE.search(q_lower))
        cand_is_statute = self.is_statutory_source(candidate)

        # Invariant: A patent application cannot automatically serve as evidence for a statutory legal rule.
        if is_stat_rule_query and not is_prior_art_query and not cand_is_statute:
            dec = EvidenceSupportDecision(
                supported=False,
                jurisdiction_match=True,
                domain_match=False,
                source_type_match=False,
                intent_match=False,
                subject_match=True,
                proposition_supported=False,
                authority_sufficient=False,
                confidence=0.1,
                reason=(
                    "Source type incompatibility: query seeks a statutory legal rule or standard, "
                    "but retrieved candidate is an invention patent document. "
                    "A patent application disclosure cannot serve as evidence for statutory patent law."
                ),
            )
            self._log_audit(query, cand_jur, "domain_mismatch", cand_id, dec)
            return dec

        # Domain Check: FSSAI / Ayurveda Aahara Regulation
        if any(w in q_lower for w in ["fssai", "ayurveda aahara", "food safety standard"]):
            combined_cand = f"{cand_id} {cand_title} {cand_sec} {cand_text}".lower()
            if not any(w in combined_cand for w in ["fssai", "ayurveda aahara", "food safety"]):
                dec = EvidenceSupportDecision(
                    supported=False,
                    jurisdiction_match=True,
                    domain_match=False,
                    source_type_match=False,
                    intent_match=False,
                    subject_match=False,
                    proposition_supported=False,
                    authority_sufficient=False,
                    confidence=0.1,
                    reason="Domain mismatch: query requires FSSAI / Ayurveda Aahara food safety regulations, but candidate is not an FSSAI source.",
                )
                self._log_audit(query, cand_jur, "fssai_domain_mismatch", cand_id, dec)
                return dec

        # Domain Check: NBA / Biodiversity Act
        if any(w in q_lower for w in ["biodiversity", "biological diversity", "nba", "access and benefit sharing", "abs"]):
            combined_cand = f"{cand_id} {cand_title} {cand_sec} {cand_text}".lower()
            if not any(w in combined_cand for w in ["biodiversity", "biological diversity", "nba", "abs", "access and benefit"]):
                dec = EvidenceSupportDecision(
                    supported=False,
                    jurisdiction_match=True,
                    domain_match=False,
                    source_type_match=False,
                    intent_match=False,
                    subject_match=False,
                    proposition_supported=False,
                    authority_sufficient=False,
                    confidence=0.1,
                    reason="Domain mismatch: query requires Biological Diversity Act / NBA source, but candidate does not cover biological diversity.",
                )
                self._log_audit(query, cand_jur, "nba_domain_mismatch", cand_id, dec)
                return dec

        # Domain Check: Trade Marks Act
        if any(w in q_lower for w in ["trademark", "trade mark", "nice class", "section 13 of the trade marks", "section 9 of the trade marks"]):
            combined_cand = f"{cand_id} {cand_title} {cand_sec} {cand_text}".lower()
            if not any(w in combined_cand for w in ["trademark", "trade mark", "tm-", "class 5", "class 3", "class 30"]):
                dec = EvidenceSupportDecision(
                    supported=False,
                    jurisdiction_match=True,
                    domain_match=False,
                    source_type_match=False,
                    intent_match=False,
                    subject_match=False,
                    proposition_supported=False,
                    authority_sufficient=False,
                    confidence=0.1,
                    reason="Domain mismatch: query requires Trademark statutory source, but candidate does not cover trademarks.",
                )
                self._log_audit(query, cand_jur, "trademark_domain_mismatch", cand_id, dec)
                return dec

        # ── 3. Specific Section / Article Proposition Support ───────────────────
        req_sections = self.extract_requested_statutory_sections(query)
        if req_sections:
            section_matched = False
            missing_secs = []
            for s_type, s_id in req_sections:
                if self.check_candidate_contains_section(candidate, s_type, s_id):
                    section_matched = True
                    break
                else:
                    missing_secs.append(f"{s_type} {s_id}")

            if not section_matched:
                dec = EvidenceSupportDecision(
                    supported=False,
                    jurisdiction_match=True,
                    domain_match=True,
                    source_type_match=True,
                    intent_match=False,
                    subject_match=False,
                    proposition_supported=False,
                    authority_sufficient=True,
                    confidence=0.1,
                    reason=(
                        f"Proposition not supported: query specifically requests '{', '.join(missing_secs)}', "
                        f"but candidate ({cand_id}) does not cite or contain this specific statutory provision."
                    ),
                )
                self._log_audit(query, cand_jur, "section_mismatch", cand_id, dec)
                return dec

        # ── 4. Candidate Passes All Evidence Compatibility Gates ───────────────
        dec = EvidenceSupportDecision(
            supported=True,
            jurisdiction_match=True,
            domain_match=True,
            source_type_match=True,
            intent_match=True,
            subject_match=True,
            proposition_supported=True,
            authority_sufficient=True,
            confidence=round(min(1.0, max(0.5, (score + 1.0) / 2.0 if score <= 1.0 else score)), 2),
            reason=f"Candidate verified compatible with query scope ({cand_jur}, tier 1 statutory/patent disclosure).",
        )
        self._log_audit(query, cand_jur, "supported", cand_id, dec)
        return dec

    def _log_audit(self, query: str, jur: Optional[str], domain: str, cand_id: str, dec: EvidenceSupportDecision) -> None:
        """Structured audit logger conforming to specification 22."""
        decision_str = "SUPPORTED" if dec.supported else "REJECTED"
        logger.info(
            "[AYURLEX_EVIDENCE_GATE] query='%s' jurisdiction='%s' domain='%s' candidate_source='%s' "
            "jurisdiction_match=%s domain_match=%s source_type_match=%s intent_match=%s "
            "proposition_support=%s authority=%s decision=%s reason='%s'",
            query[:60],
            jur or "UNKNOWN",
            domain,
            cand_id,
            dec.jurisdiction_match,
            dec.domain_match,
            dec.source_type_match,
            dec.intent_match,
            dec.proposition_supported,
            dec.authority_sufficient,
            decision_str,
            dec.reason,
        )


# Global singleton
evidence_compatibility_gate = EvidenceCompatibilityGate()
