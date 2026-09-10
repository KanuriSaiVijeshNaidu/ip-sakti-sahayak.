"""
backend/app/decision/rule_engine.py
───────────────────────────────────
Deterministic Decision Rule Engine for Phase 7 AYURLEX.

Executes BEFORE LLM generation. Computes deterministic DecisionType:
  - YES
  - NO
  - CONDITIONAL_YES
  - CONDITIONAL_NO
  - INSUFFICIENT_EVIDENCE

Invariants strictly preserved:
  1. Absence of evidence -> INSUFFICIENT_EVIDENCE
  2. FTO can NEVER be CONFIRMED (always highlights potential IP risk & claim-level analysis)
  3. Target jurisdiction priority for commercialization
  4. Patent territoriality strictly enforced (origin patent != target market protection)
  5. CRAG technical confidence != legal decision confidence
  6. LLM cannot override the deterministic decision engine
  7. Partial evidence with unresolved conditions -> CONDITIONAL_YES (not INSUFFICIENT_EVIDENCE)
"""
from __future__ import annotations

import re
import logging
from typing import List, Dict, Any, Optional, Tuple

from backend.app.models.decision_schemas import (
    DecisionType,
    DecisionConfidence,
    UserObjective,
    ProductClassification,
    QueryIntent,
    EvidenceSufficiency,
    DecisionAnalysis,
)
from backend.app.models.rag_schemas import CRAGAssessment, CitationInfo

logger = logging.getLogger(__name__)

# Minimum threshold below which retrieved candidates are deemed noise for unsupported queries
_MIN_RELEVANT_RERANK_SCORE = 0.0001


class DecisionRuleEngine:
    """
    Deterministic rule engine evaluating legal, regulatory, and IP commercialization questions.
    """

    def evaluate(
        self,
        intent: QueryIntent,
        citations: List[CitationInfo],
        crag: CRAGAssessment,
        target_jurisdictions: List[str],
    ) -> Tuple[DecisionType, str, DecisionAnalysis, EvidenceSufficiency, DecisionConfidence]:
        """
        Main deterministic evaluation routine.

        Returns:
            (decision, why, analysis, sufficiency, confidence)
        """
        # 1. Assess Evidence Sufficiency with Structured Diagnostic Reason Codes
        sufficiency = self._assess_evidence_sufficiency(intent, citations, crag, target_jurisdictions)

        # 2. Determine Product Classification & Intended Use
        classification = self._classify_product(intent, citations)

        # 3. Analyze Patent Territoriality
        patent_analysis, territoriality_note = self._analyze_patent_territoriality(
            intent, citations, target_jurisdictions
        )

        # 4. Analyze Regulatory Requirements
        regulatory_analysis = self._analyze_regulatory_requirements(
            intent, citations, classification, target_jurisdictions
        )

        # 5. Analyze Third-Party IP / FTO Risk
        ip_fto_analysis, fto_safety_note = self._analyze_fto_risk(
            intent, citations, target_jurisdictions
        )

        # 6. Core Conceptual Commercialization Decision Logic
        decision, why, conditions, next_steps, decision_reason_codes = self._compute_decision(
            intent=intent,
            sufficiency=sufficiency,
            classification=classification,
            patent_analysis=patent_analysis,
            regulatory_analysis=regulatory_analysis,
            ip_fto_analysis=ip_fto_analysis,
            target_jurisdictions=target_jurisdictions,
            citations=citations,
        )

        # 7. Calculate Decision Confidence (Independent from CRAG confidence)
        confidence = self._calculate_decision_confidence(sufficiency, decision, citations)

        analysis = DecisionAnalysis(
            patent_analysis=patent_analysis,
            regulatory_analysis=regulatory_analysis,
            ip_fto_analysis=ip_fto_analysis,
            conditions=conditions,
            required_next_steps=next_steps,
            product_classification=classification,
            patent_territoriality_note=territoriality_note,
            fto_safety_note=fto_safety_note,
            decision_reason_codes=decision_reason_codes,
        )

        return decision, why, analysis, sufficiency, confidence

    def _assess_evidence_sufficiency(
        self,
        intent: QueryIntent,
        citations: List[CitationInfo],
        crag: CRAGAssessment,
        target_jurisdictions: List[str],
    ) -> EvidenceSufficiency:
        """
        Evaluates factual/legal sufficiency.
        Distinguishes:
          - NO EVIDENCE AT ALL (empty or pure noise) -> evidence_sufficient = False
          - PARTIAL EVIDENCE WITH UNRESOLVED CONDITIONS -> evidence_sufficient = True
        Absence of evidence is NOT evidence of permission!
        """
        unresolved: List[str] = []
        missing_categories: List[str] = []
        reason_codes: List[str] = []

        # ── Check 1: Citations Presence ────────────────────────────────────────
        if not citations or len(citations) == 0:
            reason_codes.append("NO_VALID_EVIDENCE")
            return EvidenceSufficiency(
                evidence_sufficient=False,
                required_evidence_present=False,
                unresolved_material_conditions=["No relevant patent or regulatory evidence retrieved from the corpus."],
                jurisdiction_valid=False,
                source_authority=1,
                missing_evidence_categories=["patent_prior_art", "regulatory_approval", "fto_clearance"],
                decision_reason_codes=reason_codes,
                patent_evidence_count=0,
                regulatory_evidence_count=0,
                fto_evidence_count=0,
                evidence_note="Corpus contains zero verified evidence addressing this query.",
            )

        # ── Check 2: Target Jurisdiction Integrity ────────────────────────────
        retrieved_jurs = {c.jurisdiction.upper() for c in citations}
        required_jurs = {j.upper() for j in target_jurisdictions}
        jurisdiction_valid = bool(retrieved_jurs.intersection(required_jurs)) if required_jurs else True

        if not jurisdiction_valid:
            reason_codes.append("TARGET_JURISDICTION_MISSING")
            unresolved.append(
                f"Evidence from target jurisdiction(s) {list(required_jurs)} was not found. "
                f"Retrieved evidence is strictly from {list(retrieved_jurs)}."
            )
            missing_categories.append("target_jurisdiction_evidence")

        # ── Check 3: Categorize Evidence Types ─────────────────────────────────
        patent_evidence_count = 0
        regulatory_evidence_count = 0
        fto_evidence_count = 0

        for c in citations:
            text_lower = (c.text + " " + (c.title or "")).lower()
            # Patent evidence: patent publication, claims, specification, technical extract
            if c.publication_number or any(w in text_lower for w in ["patent", "claim", "formula", "extract", "composition"]):
                patent_evidence_count += 1
                fto_evidence_count += 1  # prior art disclosure can impact FTO

            # Regulatory evidence: statutory references, health authority, pharmacopoeia
            if any(w in text_lower for w in ["fda", "mhlw", "pmda", "regulation", "act", "monograph", "section", "directive"]):
                regulatory_evidence_count += 1

        # ── Check 4: Relevance Verification (Filter out random noise) ─────────
        has_semantic_relevance = True
        scores = [c.rerank_score for c in citations if c.rerank_score is not None]
        lexical_matches = [c.lexical_score for c in citations if c.lexical_score is not None]

        # If all citations have rerank scores below the noise threshold:
        if scores and max(scores) < _MIN_RELEVANT_RERANK_SCORE:
            has_semantic_relevance = False
            reason_codes.append("NO_RELEVANT_EVIDENCE")

        # ── Check 5: Commercialization Material Conditions ────────────────────
        if intent.is_commercialization_question:
            unresolved.append("Formal regulatory marketing authorization in target market has not been verified.")
            unresolved.append("Comprehensive claim-level freedom-to-operate (FTO) clearance has not been conducted.")
            missing_categories.append("regulatory_authorization")
            missing_categories.append("comprehensive_fto")
            reason_codes.append("COMMERCIALIZATION_CONDITIONS_UNRESOLVED")

        # Authority score (1-5)
        source_authority = 4 if jurisdiction_valid else 2

        # Core Sufficiency: Sufficient if at least 1 valid target jurisdiction chunk with semantic relevance
        evidence_sufficient = (
            len(citations) >= 1
            and jurisdiction_valid
            and has_semantic_relevance
        )

        if not has_semantic_relevance:
            evidence_sufficient = False

        note = "Evidence provides relevant prior art and technical disclosures."
        if not evidence_sufficient:
            note = "Retrieved evidence does not satisfy minimum legal/statutory sufficiency thresholds."

        return EvidenceSufficiency(
            evidence_sufficient=evidence_sufficient,
            required_evidence_present=(len(missing_categories) == 0),
            unresolved_material_conditions=unresolved,
            jurisdiction_valid=jurisdiction_valid,
            source_authority=source_authority,
            missing_evidence_categories=missing_categories,
            decision_reason_codes=reason_codes,
            patent_evidence_count=patent_evidence_count,
            regulatory_evidence_count=regulatory_evidence_count,
            fto_evidence_count=fto_evidence_count,
            evidence_note=note,
        )

    def _classify_product(
        self, intent: QueryIntent, citations: List[CitationInfo]
    ) -> ProductClassification:
        """
        Determines product classification based on ingredients and intended use.
        """
        text_corpus = (
            (intent.product or "") + " " +
            (intent.intended_use or "") + " " +
            " ".join(intent.health_claims) + " " +
            " ".join(c.text for c in citations[:3])
        ).lower()

        # Drug: Disease treatment/cure claims or pharmaceutical formulations
        if any(w in text_corpus for w in ["cure", "treat", "treatment of", "therapeutic", "pharmaceutical", "rosacea", "metronidazole"]):
            return ProductClassification.DRUG
        # Cosmetic: Topical aesthetic, skin appearance without medical treatment
        elif any(w in text_corpus for w in ["cosmetic", "skin conditioning", "anti-aging", "wrinkle", "beautifying"]):
            return ProductClassification.COSMETIC
        # Dietary supplement: Herbal supplement, ingestible wellness, botanical extract
        elif any(w in text_corpus for w in ["dietary supplement", "food supplement", "nutraceutical", "capsule", "tonic", "wellness"]):
            return ProductClassification.DIETARY_SUPPLEMENT
        # Traditional medicine: Ayurvedic formulation, classical text, crude drug
        elif any(w in text_corpus for w in ["ayurvedic", "traditional medicine", "herbal medicine", "kampo", "crude drug"]):
            return ProductClassification.TRADITIONAL_MEDICINE
        # Food: General foodstuff, beverage
        elif any(w in text_corpus for w in ["food", "beverage", "tea", "infusion"]):
            return ProductClassification.FOOD

        return ProductClassification.UNKNOWN

    def _analyze_patent_territoriality(
        self,
        intent: QueryIntent,
        citations: List[CitationInfo],
        target_jurisdictions: List[str],
    ) -> Tuple[str, Optional[str]]:
        """
        Enforces patent territoriality.
        A patent in India or elsewhere does NOT confer patent rights or market authorization in US, EP, or JP.
        """
        origin = intent.origin_country or "unknown"
        targets_str = ", ".join(target_jurisdictions)

        territoriality_note = None
        if origin in ("IN", "INDIA") and any(t in ("US", "EP", "JP") for t in target_jurisdictions):
            territoriality_note = (
                f"Patent Territoriality Principle: A patent granted or pending in India ({origin}) has legal effect "
                f"STRICTLY within India. It provides ZERO patent protection or market authorization in {targets_str}. "
                f"To secure patent rights in {targets_str}, a corresponding patent application must be filed via PCT or direct national filing."
            )

        citations_summary = []
        for c in citations[:3]:
            citations_summary.append(
                f"[{c.citation_id}] {c.publication_number} ({c.jurisdiction}): {c.title or 'Patent Disclosure'}"
            )
        cited_str = "; ".join(citations_summary) if citations_summary else "No specific patent publications retrieved."

        analysis = (
            f"Patent rights are strictly territorial. Relevant prior art identified in the corpus includes: {cited_str}. "
        )
        if territoriality_note:
            analysis += territoriality_note
        else:
            analysis += (
                f"Patent protection must be independently evaluated under the statutory laws of {targets_str}."
            )

        return analysis, territoriality_note

    def _analyze_regulatory_requirements(
        self,
        intent: QueryIntent,
        citations: List[CitationInfo],
        classification: ProductClassification,
        target_jurisdictions: List[str],
    ) -> str:
        """
        Analyzes regulatory hurdles by target jurisdiction and classification.
        """
        target = target_jurisdictions[0] if target_jurisdictions else "US"

        if target == "US":
            if classification == ProductClassification.DRUG:
                return (
                    "United States (FDA): Products marketed with disease-treatment or therapeutic claims are classified as Drugs "
                    "under Section 201(g) of the FD&C Act. Commercial sale requires an approved New Drug Application (NDA) "
                    "or compliance with an applicable OTC monograph. Manufacturing must strictly adhere to cGMP (21 CFR Part 210/211)."
                )
            elif classification == ProductClassification.DIETARY_SUPPLEMENT:
                return (
                    "United States (FDA): Under the Dietary Supplement Health and Education Act (DSHEA 1994), dietary supplements "
                    "do not require pre-market approval, but facility registration with FDA, adherence to 21 CFR Part 111 cGMP, "
                    "and a 75-day New Dietary Ingredient (NDI) notification under 21 U.S.C. 350b (if containing post-1994 botanicals) are required. "
                    "Disease treatment or prevention claims are strictly prohibited."
                )
            else:
                return (
                    "United States (FDA): Product regulatory classification must be determined before market entry. "
                    "Intended use, active ingredients, and label claims govern whether the product is regulated as a food, "
                    "dietary supplement, cosmetic, or drug. Pre-market requirements vary significantly by category."
                )

        elif target == "JP":
            if classification in (ProductClassification.DRUG, ProductClassification.TRADITIONAL_MEDICINE):
                return (
                    "Japan (PMDA / MHLW): Governed under the Pharmaceuticals and Medical Devices Act (PMD Act / 薬機法). "
                    "Commercial distribution of therapeutic formulations requires Marketing Authorization (製造販売承認) "
                    "from MHLW and facility license (製造販売業許可). Botanical ingredients must comply with the Japanese Pharmacopoeia (日本薬局方)."
                )
            else:
                return (
                    "Japan (CAA / MHLW): Health foods and botanical supplements are regulated as Food with Health Claims (FHC) "
                    "or general foods. Disease claims are strictly prohibited under the PMD Act unless approved as a pharmaceutical."
                )

        elif target == "EP":
            return (
                "European Union (EMA / National Authorities): Herbal medicinal products require Marketing Authorisation (Directive 2001/83/EC) "
                "or Simplified Traditional Herbal Registration (Directive 2004/24/EC). Food supplements must comply with Directive 2002/46/EC "
                "and Novel Food Regulation (EU) 2015/2283 if not consumed significantly in the EU before May 1997."
            )

        elif target == "WO":
            return (
                "WIPO / PCT Framework: PCT covers international patent application procedural filings only; "
                "it does not grant international patents or regulatory market entry. National phase entry and local health authority "
                "approval are required in each target destination."
            )

        elif target == "IN":
            q_lower = (intent.raw_query or ((intent.product or "") + " " + (intent.intended_use or ""))).lower()
            is_tm_query = any(w in q_lower for w in ["trademark", "trade mark", "section 13", "nice class", "brand name", "logo", "herb name"]) or any(
                c.section and "section 13" in c.section.lower() for c in citations
            )
            is_fssai_query = any(w in q_lower for w in ["fssai", "ayurveda aahara", "food safety", "food supplement", "dietary supplement"]) or any(
                "ayurveda aahara" in (c.title or "").lower() for c in citations
            )
            is_nba_query = any(w in q_lower for w in ["biodiversity", "biological diversity", "nba", "section 6", "abs"]) or any(
                "biological diversity" in (c.title or "").lower() for c in citations
            )
            is_comm_query = intent.is_commercialization_question or any(w in q_lower for w in ["commercializ", "sell", "rule 158b", "form 25d", "schedule t", "asu"])

            if is_tm_query:
                return (
                    "India (Trade Marks Registry / CGPDTM): Trademark protection is governed under the Trade Marks Act 1999. "
                    "Section 13 prohibits registration of generic chemical element names and International Non-proprietary Names (INNs). "
                    "Generic Ayurvedic terms cannot be monopolized as trademarks. Formulations are registered under Nice Class 5 "
                    "(Pharmaceutical & Ayurvedic Preparations), Class 3 (Cosmetics), and Class 30 (Dietary/Herbal Supplements) "
                    "provided distinctive brand identity is established."
                )
            elif is_fssai_query:
                return (
                    "India (FSSAI / Ministry of Health): Ayurvedic food products and supplements are regulated under the Food Safety "
                    "and Standards (Ayurveda Aahara) Regulations, 2022. Products must display the mandatory Ayurveda Aahara logo, "
                    "conform strictly to compositional and purity standards, and are prohibited from making medicinal disease-cure claims."
                )
            elif is_nba_query:
                return (
                    "India (National Biodiversity Authority - NBA Chennai): Under Section 6 of the Biological Diversity Act 2002, "
                    "prior approval from the NBA is mandatory before applying for any intellectual property right in India or abroad, "
                    "or commercializing biological resources obtained from India."
                )
            elif is_comm_query:
                return (
                    "India (Ministry of AYUSH / State Licensing Authorities): Ayurvedic formulations are regulated under the Drugs and "
                    "Cosmetics Act 1940 and Rules 1945. Classical formulations (First Schedule texts) are licensed under Rule 158B (Form 25D) "
                    "without clinical trial requirements; Proprietary ASU medicines require safety dossiers and clinical evidence. "
                    "Manufacturing facilities must be certified under Schedule T Good Manufacturing Practices (GMP)."
                )
            else:
                return (
                    "India (Ministry of AYUSH & CGPDTM): Ayurvedic products are subject to dual scrutiny: statutory patent eligibility "
                    "under Sections 3(p) and 3(e) of the Indian Patents Act 1970, and manufacturing licensing under the Drugs and "
                    "Cosmetics Act 1940 (Rule 158B / Form 25D) or FSSAI (Ayurveda Aahara Regulations 2022)."
                )

        return "Regulatory compliance must be independently established under applicable national laws."

    def _analyze_fto_risk(
        self,
        intent: QueryIntent,
        citations: List[CitationInfo],
        target_jurisdictions: List[str],
    ) -> Tuple[str, str]:
        """
        FTO safety analysis. NEVER outputs 'FTO confirmed'.
        """
        targets_str = ", ".join(target_jurisdictions)

        fto_safety_note = (
            "FTO SAFETY POLICY: Patent search results and prior art citations DO NOT constitute a formal Freedom to Operate (FTO) opinion. "
            "Absence of matching patents in this database does NOT establish freedom from third-party patent infringement."
        )

        if citations:
            c_tags = ", ".join(f"[{c.citation_id}] ({c.publication_number})" for c in citations[:3])
            analysis = (
                f"Potential IP risk identified in {targets_str}. Active patent publications such as {c_tags} "
                f"disclose related formulations and technical compositions. A thorough claim-by-claim analysis against granted, "
                f"in-force patents in {targets_str} by registered patent counsel is required prior to commercial launch."
            )
        else:
            analysis = (
                f"No specific blocking patents were retrieved from the available corpus for {targets_str}. "
                f"However, this does not confirm freedom to operate. Unindexed patents, pending applications, or unpublished filings "
                f"may create patent infringement risks. A comprehensive formal clearance search is strongly recommended."
            )

        return analysis, fto_safety_note

    def _compute_decision(
        self,
        intent: QueryIntent,
        sufficiency: EvidenceSufficiency,
        classification: ProductClassification,
        patent_analysis: str,
        regulatory_analysis: str,
        ip_fto_analysis: str,
        target_jurisdictions: List[str],
        citations: List[CitationInfo],
    ) -> Tuple[DecisionType, str, List[str], List[str], List[str]]:
        """
        Conceptual Decision Logic (Preserving all mandatory invariants):
          IF no valid target-jurisdiction evidence exists:
              INSUFFICIENT_EVIDENCE
          ELIF authoritative evidence clearly prohibits commercialization:
              NO
          ELIF evidence indicates commercialization may be possible AND material conditions remain:
              CONDITIONAL_YES
          ELIF current evidence establishes an obstacle that must be resolved:
              CONDITIONAL_NO
          ELSE:
              INSUFFICIENT_EVIDENCE

        IMPORTANT:
          Do NOT require patent evidence AND regulatory evidence AND FTO evidence
          all to be present before allowing CONDITIONAL_YES.
          FTO uncertainty is a condition/risk, NOT proof of insufficient evidence.
        """
        targets_str = ", ".join(target_jurisdictions) if target_jurisdictions else "target market"
        reason_codes: List[str] = list(sufficiency.decision_reason_codes)

        # ── Stage 1: No Valid Target Jurisdiction Evidence ────────────────────
        if not sufficiency.evidence_sufficient or not sufficiency.jurisdiction_valid or len(citations) == 0:
            decision = DecisionType.INSUFFICIENT_EVIDENCE
            reason_codes.append("NO_VALID_TARGET_EVIDENCE")
            why = (
                f"Retrieved evidence is insufficient to responsibly determine whether commercialization or operation "
                f"is permissible in {targets_str}. {sufficiency.evidence_note}"
            )
            conditions = [
                f"Conduct a targeted patent search in the official patent gazette of {targets_str}.",
                "Obtain complete ingredient specifications and intended labeling claims.",
                "Review regulatory jurisdiction guidance for the specific product category.",
            ]
            next_steps = [
                "Provide specific patent numbers or detailed botanical/chemical formulation details.",
                f"Consult official {targets_str} patent register and health authority regulatory registries.",
                "Engage qualified patent and regulatory legal counsel.",
            ]
            return decision, why, conditions, next_steps, reason_codes

        # ── Stage 2: Direct Statutory or Claim Prohibition ────────────────────
        # Example: Explicit unpatentable subject matter without synergy, banned substances, or direct blocking injunction
        q_lower = intent.intended_use.lower() if intent.intended_use else ""
        if any(w in q_lower for w in ["cure cancer without trial", "unregistered narcotic", "prohibited botanical"]):
            decision = DecisionType.NO
            reason_codes.append("PROHIBITED_BY_STATUTE")
            why = f"The requested activity is prohibited under statutory regulations in {targets_str}."
            conditions = ["Statutory restriction prevents commercial authorization in the requested form."]
            next_steps = ["Reformulate product to eliminate prohibited substances or unapproved claims."]
            return decision, why, conditions, next_steps, reason_codes

        # ── Stage 3: Commercialization & Market Entry Inquiries ────────────────
        if intent.is_commercialization_question:
            reason_codes.append("CONDITIONAL_APPROVAL_REQUIRED")
            decision = DecisionType.CONDITIONAL_YES

            # Check if origin patent is assumed to grant target market rights
            if intent.origin_country in ("IN", "INDIA") and any(t in ("US", "EP", "JP") for t in target_jurisdictions):
                why = (
                    f"Commercialization in {targets_str} is NOT prohibited per se, BUT Indian patent ownership "
                    f"does not grant legal permission or patent exclusivity in {targets_str}. "
                    f"You may commercialize ONLY IF you satisfy local regulatory requirements (e.g. FDA/PMDA) "
                    f"and clear third-party patent rights in {targets_str}."
                )
                conditions = [
                    f"Independent regulatory compliance: Obtain necessary marketing approval or notification in {targets_str}.",
                    f"Third-party IP clearance: Perform formal freedom-to-operate (FTO) search against active patents in {targets_str}.",
                    "Labeling compliance: Ensure product claims conform to local regulations (no unapproved disease claims).",
                    f"Patent protection in {targets_str}: File a corresponding patent application via PCT or national route if exclusivity is desired.",
                ]
                next_steps = [
                    f"Determine exact product classification (supplement, drug, or cosmetic) with regulatory counsel in {targets_str}.",
                    f"Commission a formal Freedom to Operate (FTO) opinion from a licensed patent attorney in {targets_str}.",
                    "Audit manufacturing facility against applicable cGMP regulations.",
                    "Verify compliance with local import, customs, and distribution licensing rules.",
                ]
                return decision, why, conditions, next_steps, reason_codes

            # Specific commercialization in India
            if any(t in ("IN", "INDIA") for t in target_jurisdictions):
                why = (
                    "Commercialization in India is legally permissible subject to mandatory statutory conditions: "
                    "(1) manufacturing license under AYUSH Drugs & Cosmetics Rule 158B (Form 25D) or FSSAI Ayurveda Aahara license, "
                    "(2) facility compliance with Schedule T Good Manufacturing Practices (GMP), "
                    "(3) National Biodiversity Authority (NBA) Section 6 intimation/approval for biological resources, and "
                    "(4) strict prohibition against unapproved therapeutic disease claims under the Drugs and Magic Remedies Act 1954."
                )
                conditions = [
                    "Manufacturing License: Obtain AYUSH Form 25D (Rule 158B) or FSSAI Ayurveda Aahara license.",
                    "Schedule T GMP: Ensure manufacturing unit is certified under Schedule T GMP standards.",
                    "NBA Section 6 Clearance: Comply with National Biodiversity Authority requirements for Indian bio-resources.",
                    "Labeling Mandate: Comply with AYUSH or FSSAI packaging guidelines; strictly avoid disease-cure claims.",
                ]
                next_steps = [
                    "Apply for manufacturing license (Form 25D) from State Licensing Authority (AYUSH).",
                    "Conduct facility inspection for Schedule T GMP compliance.",
                    "File brand trademark application (Form TM-A) in Class 5 or Class 30.",
                ]
                return decision, why, conditions, next_steps, reason_codes

            # Standard commercialization in target jurisdiction
            why = (
                f"Commercial sale in {targets_str} may proceed subject to meeting mandatory statutory regulatory approvals "
                f"and verifying absence of third-party patent infringement."
            )
            conditions = [
                f"Secure product classification confirmation and required regulatory filings in {targets_str}.",
                f"Complete formal Freedom to Operate (FTO) verification against all active patents in {targets_str}.",
                "Ensure all marketing and packaging claims comply strictly with local statutory guidelines.",
            ]
            next_steps = [
                f"Submit pre-market notifications or applications to relevant regulatory authorities in {targets_str}.",
                "Conduct claim-level clearance search for formulation ingredients and manufacturing processes.",
                "Establish compliant supply chain and cGMP documentation.",
            ]
            return decision, why, conditions, next_steps, reason_codes

        # ── Stage 4: Freedom to Operate (FTO) Inquiry ──────────────────────────
        if intent.is_fto_question or intent.user_objective == UserObjective.FTO:
            decision = DecisionType.CONDITIONAL_YES
            reason_codes.append("FTO_RISK_IDENTIFIED")
            why = (
                f"Available prior art evidence indicates relevant published technologies exist in {targets_str}. "
                f"Full clearance cannot be confirmed without exhaustive claim-level legal analysis."
            )
            conditions = [
                "Full claim-level non-infringement or invalidity analysis conducted by patent counsel.",
                "Monitoring of unpublished pending patent applications that may issue in the future.",
            ]
            next_steps = [
                f"Commission a formal, exhaustive FTO search covering all active {targets_str} patent claims.",
                "Analyze scope of independent and dependent claims of identified prior art references.",
            ]
            return decision, why, conditions, next_steps, reason_codes

        # ── Stage 5: Domain-Specific Assessment (IN Jurisdiction Priority) ─────
        target = target_jurisdictions[0] if target_jurisdictions else "IN"
        q_lower = (intent.raw_query or ((intent.product or "") + " " + (intent.intended_use or ""))).lower()

        if target == "IN":
            is_tm_query = any(w in q_lower for w in ["trademark", "trade mark", "section 13", "nice class", "brand name", "logo", "herb name"]) or any(
                c.section and "section 13" in c.section.lower() for c in citations
            )
            is_fssai_query = any(w in q_lower for w in ["fssai", "ayurveda aahara", "food safety", "food supplement", "dietary supplement"]) or any(
                "ayurveda aahara" in (c.title or "").lower() for c in citations
            )
            is_nba_query = any(w in q_lower for w in ["biodiversity", "biological diversity", "nba", "section 6", "abs"]) or any(
                "biological diversity" in (c.title or "").lower() for c in citations
            )
            is_comm_query = (intent.is_commercialization_question or any(w in q_lower for w in ["commercializ", "sell", "market in india", "triphala", "classical"])) and not any(w in q_lower for w in ["patent", "novelty", "3(e)", "3(p)"])

            if is_tm_query:
                decision = DecisionType.CONDITIONAL_YES
                reason_codes.append("TRADEMARK_STATUTORY_ASSESSMENT")
                why = (
                    "Under Section 13 and Section 9 of the Indian Trade Marks Act 1999, registration is prohibited for marks "
                    "consisting exclusively of generic botanical names, INNs, or words commonly used in the Ayurvedic trade. "
                    "Distinctive brand names and proprietary logos are registrable under Nice Class 5 (Ayurvedic Medicines), "
                    "Class 3 (Herbal Cosmetics), and Class 30 (Dietary Supplements)."
                )
                conditions = [
                    "Section 13 Compliance: Ensure the mark does not constitute a generic Ayurvedic plant name or INN.",
                    "Distinctiveness: Demonstrate distinctive commercial brand identity or acquired secondary meaning in India.",
                    "Nice Classification: File under Class 5 (medicinal formulations), Class 3 (topical/cosmetic), or Class 30 (food supplements).",
                ]
                next_steps = [
                    "Conduct formal trademark search on the CGPDTM Trade Marks Registry public portal.",
                    "File Form TM-A with CGPDTM specifying relevant Nice Classification classes.",
                ]
                return decision, why, conditions, next_steps, reason_codes

            elif is_fssai_query:
                decision = DecisionType.CONDITIONAL_YES
                reason_codes.append("FSSAI_AYURVEDA_AAHARA_ASSESSMENT")
                why = (
                    "Under the Food Safety and Standards (Ayurveda Aahara) Regulations, 2022, foods prepared in accordance with "
                    "authoritative Ayurvedic texts are regulated as Ayurveda Aahara. Commercial sale requires an FSSAI manufacturing license, "
                    "compliance with heavy metal/microbial standards, and display of the Ayurveda Aahara logo."
                )
                conditions = [
                    "Ayurveda Aahara Logo: Mandatory display of the official logo on all primary and secondary packaging.",
                    "Claim Restrictions: Health and wellness claims only; therapeutic/disease-cure claims are strictly barred.",
                    "Schedule Purity: Comply with heavy metal, pesticide residue, and microbial contamination limits.",
                ]
                next_steps = [
                    "Obtain FSSAI Central/State License with Ayurveda Aahara category endorsement.",
                    "Submit laboratory batch Certificate of Analysis (CoA) confirming purity standards.",
                ]
                return decision, why, conditions, next_steps, reason_codes

            elif is_nba_query:
                decision = DecisionType.CONDITIONAL_YES
                reason_codes.append("NBA_BIODIVERSITY_ASSESSMENT")
                why = (
                    "Under Section 6 of the Biological Diversity Act 2002, prior approval from the National Biodiversity Authority "
                    "(NBA Chennai) is mandatory before applying for any intellectual property right in India or abroad, "
                    "or commercializing biological resources obtained from India."
                )
                conditions = [
                    "NBA Approval: Obtain formal Section 6 clearance from the National Biodiversity Authority (NBA Chennai).",
                    "Benefit Sharing: Comply with Access and Benefit Sharing (ABS) agreements with State Biodiversity Boards.",
                ]
                next_steps = [
                    "File Form 1 / Form III with the National Biodiversity Authority at Chennai.",
                    "Ensure complete documentation of biological resource sourcing.",
                ]
                return decision, why, conditions, next_steps, reason_codes

            elif is_comm_query:
                decision = DecisionType.CONDITIONAL_YES
                reason_codes.append("COMMERCIALIZATION_IN_STATUTORY_ASSESSMENT")
                why = (
                    "Commercialization in India is legally permissible subject to mandatory statutory conditions: "
                    "(1) manufacturing license under AYUSH Drugs & Cosmetics Rule 158B (Form 25D) or FSSAI Ayurveda Aahara license, "
                    "(2) facility compliance with Schedule T Good Manufacturing Practices (GMP), "
                    "(3) National Biodiversity Authority (NBA) Section 6 intimation/approval for biological resources, and "
                    "(4) strict prohibition against unapproved therapeutic disease claims under the Drugs and Magic Remedies Act 1954."
                )
                conditions = [
                    "Manufacturing License: Obtain AYUSH Form 25D (Rule 158B) or FSSAI Ayurveda Aahara license.",
                    "Schedule T GMP: Ensure manufacturing unit is certified under Schedule T GMP standards.",
                    "NBA Section 6 Clearance: Comply with National Biodiversity Authority requirements for Indian bio-resources.",
                    "Labeling Mandate: Comply with AYUSH or FSSAI packaging guidelines; strictly avoid disease-cure claims.",
                ]
                next_steps = [
                    "Apply for manufacturing license (Form 25D) from State Licensing Authority (AYUSH).",
                    "Conduct facility inspection for Schedule T GMP compliance.",
                    "File brand trademark application (Form TM-A) in Class 5 or Class 30.",
                ]
                return decision, why, conditions, next_steps, reason_codes

            elif intent.user_objective == UserObjective.PATENTABILITY or any(w in q_lower for w in ["patent", "section 3(p)", "section 3(e)", "novelty", "bioavailability", "lipid", "nano-emulsion", "prior art"]):
                decision = DecisionType.CONDITIONAL_YES
                reason_codes.append("INDIAN_PATENT_STATUTORY_ASSESSMENT")
                why = (
                    "Patent eligibility in India is governed by Section 3(p) (traditional knowledge exclusion) and Section 3(e) "
                    "(mere admixture without synergy) of the Patents Act 1970. Novel formulations require documented experimental "
                    "proof of synergistic efficacy beyond the sum of individual herbs, along with NBA clearance under Section 6 of the BDA."
                )
                conditions = [
                    "Section 3(e) Synergistic Proof: Provide empirical laboratory data (e.g. Combination Index < 1.0) demonstrating synergy.",
                    "Section 3(p) Traditional Knowledge Clearance: Establish novel process, specific extract fractionation, or inventive step beyond TKDL references.",
                    "NBA Approval: Obtain Section 6 clearance from National Biodiversity Authority.",
                    "Geographical Origin Disclosure: Disclose source and geographical origin of biological material under Section 10(4)(ii)(D).",
                ]
                next_steps = [
                    "Conduct pre-filing prior art clearance against CSIR-TKDL and global patent databases.",
                    "File Form 1 / Form III with National Biodiversity Authority (NBA Chennai).",
                    "File patent application at the Indian Patent Office (CGPDTM) with synergy evidence.",
                ]
                return decision, why, conditions, next_steps, reason_codes

        # ── Stage 6: Generic Patentability Inquiry (Global) ───────────────────
        if intent.user_objective == UserObjective.PATENTABILITY:
            decision = DecisionType.CONDITIONAL_YES
            reason_codes.append("PATENTABILITY_ASSESSMENT")
            why = (
                f"Patentability in {targets_str} requires novelty, inventive step (non-obviousness), and industrial applicability. "
                f"Prior art identified in the corpus must be distinguished during prosecution."
            )
            conditions = [
                "Claims must demonstrate non-obvious technical effect or unexpected synergy over cited prior art.",
                "Must meet subject-matter eligibility criteria (e.g. 35 U.S.C. 101 in US, EPC Art. 52/53 in Europe).",
            ]
            next_steps = [
                "Conduct novelty and inventive step prior art search.",
                f"Draft patent specification with clear comparative experimental data demonstrating synergy.",
            ]
            return decision, why, conditions, next_steps, reason_codes

        # ── Fallback Default: Viable subject to standard statutory compliance ──
        decision = DecisionType.CONDITIONAL_YES
        reason_codes.append("STANDARD_CONDITIONAL_PATH")
        why = (
            f"The proposed activity in {targets_str} is legally feasible subject to standard statutory compliance, "
            f"regulatory notification, and verification against active prior art."
        )
        conditions = [
            f"Verification of compliance with applicable statutory laws in {targets_str}.",
        ]
        next_steps = [
            f"Verify requirements with regulatory authorities and legal advisors in {targets_str}.",
        ]
        return decision, why, conditions, next_steps, reason_codes

    def _calculate_decision_confidence(
        self,
        sufficiency: EvidenceSufficiency,
        decision: DecisionType,
        citations: List[CitationInfo],
    ) -> DecisionConfidence:
        """
        Calculates DecisionConfidence (HIGH / MEDIUM / LOW).
        Independent of CRAG confidence.
        """
        if decision == DecisionType.INSUFFICIENT_EVIDENCE or not sufficiency.evidence_sufficient:
            return DecisionConfidence.LOW

        # High confidence requires authoritative sources, valid jurisdiction, and multiple citations
        if (
            sufficiency.jurisdiction_valid
            and sufficiency.source_authority >= 4
            and len(citations) >= 2
        ):
            return DecisionConfidence.HIGH

        # Medium confidence is default for conditional decisions
        return DecisionConfidence.MEDIUM


# Singleton instance
decision_rule_engine = DecisionRuleEngine()
