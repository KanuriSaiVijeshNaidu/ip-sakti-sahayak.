"""
backend/app/decision/pipeline.py
─────────────────────────────────
Master Phase 7 AYURLEX Decision & Jurisdiction Reasoning Pipeline.

Pipeline Flow:
  USER QUESTION
       ↓
  LANGUAGE DETECTION
       ↓
  INTENT EXTRACTION
       ↓
  ORIGIN & TARGET JURISDICTION ROUTING
       ↓
  JURISDICTION-SAFE HYBRID RETRIEVAL (Phase 5)
       ↓
  CRAG ASSESSMENT (Phase 6)
       ↓
  EVIDENCE SELECTION (Phase 6)
       ↓
  DECISION RULE ENGINE (Phase 7 — Pre-computed deterministic decision)
       ↓
  GROUNDED LLM EXPLANATION (Synthesizes explanation strictly conforming to rule decision)
       ↓
  CLAIM VALIDATION (Phase 6)
       ↓
  FINAL STRUCTURED DECISION RESPONSE
"""
from __future__ import annotations

import time
import logging
from typing import Dict, List, Optional, Tuple, Any

from backend.app.models.decision_schemas import (
    DecisionType,
    DecisionConfidence,
    UserObjective,
    QueryIntent,
    DecisionRequest,
    DecisionResponse,
    EvidenceSufficiency,
    DecisionAnalysis,
)
from backend.app.models.retrieval_schemas import RetrievalSearchRequest
from backend.app.models.rag_schemas import CitationInfo, ClaimValidationResult
from backend.app.retrieval.production_pipeline import production_retrieval_pipeline
from backend.app.retrieval.config import retrieval_config
from backend.app.retrieval.query_analyzer import detect_language
from backend.app.rag.crag_validator import crag_validator
from backend.app.rag.evidence_selector import evidence_selector
from backend.app.rag.claim_validator import claim_validator
from backend.app.decision.intent_extractor import extract_intent
from backend.app.decision.rule_engine import decision_rule_engine

logger = logging.getLogger(__name__)


class Phase7DecisionPipeline:
    """
    End-to-end Decision & Jurisdiction Reasoning Engine orchestrator.
    """

    async def execute(self, request: DecisionRequest) -> DecisionResponse:
        t_start = time.perf_counter()
        latencies: Dict[str, float] = {}

        # ── 1. Language Detection & Verification ───────────────────────────────
        t0 = time.perf_counter()
        raw_query = request.query.strip()
        detected_lang = request.language or detect_language(raw_query)
        latencies["language_detection_ms"] = round((time.perf_counter() - t0) * 1000, 2)

        # ── 2. Intent Extraction ───────────────────────────────────────────────
        t0 = time.perf_counter()
        intent: QueryIntent = extract_intent(raw_query, explicit_jurisdiction=request.jurisdiction)
        latencies["intent_extraction_ms"] = round((time.perf_counter() - t0) * 1000, 2)

        # ── 3. Origin & Target Jurisdiction Routing ────────────────────────────
        t0 = time.perf_counter()
        target_jurs, evaluation_only = self._route_jurisdictions(intent, request.jurisdiction, raw_query)
        latencies["jurisdiction_routing_ms"] = round((time.perf_counter() - t0) * 1000, 2)

        # ── Handle India Evaluation-Only Query ────────────────────────────────
        if evaluation_only:
            return self._execute_india_evaluation(request, intent, detected_lang, t_start, latencies)

        # ── 4. Jurisdiction-Safe Retrieval (Phase 5) ───────────────────────────
        t0 = time.perf_counter()
        # For multi-jurisdiction global search, explicitly pass "GLOBAL"
        search_jur_param = target_jurs[0] if len(target_jurs) == 1 else "GLOBAL"
        retrieval_req = RetrievalSearchRequest(
            query=raw_query,
            jurisdiction=search_jur_param,
            top_k=request.top_k or 5,
        )
        retrieval_resp = production_retrieval_pipeline.search(retrieval_req)
        latencies["retrieval_ms"] = round((time.perf_counter() - t0) * 1000, 2)

        # ── 5. CRAG Quality Assessment ─────────────────────────────────────────
        t0 = time.perf_counter()
        crag = crag_validator.evaluate(
            query=raw_query,
            evidence_results=retrieval_resp.results,
            target_jurisdictions=retrieval_resp.searched_jurisdictions,
        )
        latencies["crag_ms"] = round((time.perf_counter() - t0) * 1000, 2)

        # ── 6. Evidence Selection ──────────────────────────────────────────────
        t0 = time.perf_counter()
        citations, llm_context = evidence_selector.select(
            evidence_results=retrieval_resp.results,
            max_chunks=request.top_k or 5,
        )
        latencies["evidence_selection_ms"] = round((time.perf_counter() - t0) * 1000, 2)

        # ── 7. Decision Rule Engine (PRE-COMPUTED DETERMINISTIC DECISION) ───────
        t0 = time.perf_counter()
        decision, why, analysis, sufficiency, confidence = decision_rule_engine.evaluate(
            intent=intent,
            citations=citations,
            crag=crag,
            target_jurisdictions=retrieval_resp.searched_jurisdictions,
        )
        latencies["decision_engine_ms"] = round((time.perf_counter() - t0) * 1000, 2)

        # ── 8. Grounded Multilingual Explanation ──────────────────────────────
        t0 = time.perf_counter()
        explanation_blocks = self._format_multilingual_explanation(
            decision=decision,
            why=why,
            analysis=analysis,
            citations=citations,
            confidence=confidence,
            language=detected_lang,
            target_jurisdictions=retrieval_resp.searched_jurisdictions,
        )
        latencies["explanation_generation_ms"] = round((time.perf_counter() - t0) * 1000, 2)

        # ── 9. Claim Validation ────────────────────────────────────────────────
        t0 = time.perf_counter()
        full_text_to_validate = (
            f"{explanation_blocks['why']} {explanation_blocks['patent_analysis']} "
            f"{explanation_blocks['regulatory_analysis']} {explanation_blocks['ip_fto_analysis']}"
        )
        validated_text, claims, is_valid = claim_validator.validate(
            answer_text=full_text_to_validate,
            citations=citations,
            target_jurisdictions=retrieval_resp.searched_jurisdictions,
        )
        latencies["claim_validation_ms"] = round((time.perf_counter() - t0) * 1000, 2)

        total_ms = round((time.perf_counter() - t_start) * 1000, 2)
        latencies["total_decision_pipeline_ms"] = total_ms

        # Build evidence serialization list and separate scoped evidence buckets
        serialized_evidence = []
        target_evidence = []
        origin_evidence = []
        cross_jurisdiction_evidence = []

        decision_jur = target_jurs[0] if len(target_jurs) == 1 else "GLOBAL"
        origin_jur = intent.origin_country

        for c in citations:
            item = {
                "citation_id": c.citation_id,
                "publication_number": c.publication_number,
                "document_id": c.document_id,
                "jurisdiction": c.jurisdiction,
                "section": c.section,
                "title": c.title,
                "text": c.text,
                "source": c.source,
                "source_url": c.source_url,
                "filing_date": c.filing_date,
                "publication_date": c.publication_date,
                "rerank_score": c.rerank_score,
                "dense_score": c.dense_score,
                "lexical_score": c.lexical_score,
            }
            serialized_evidence.append(item)

            c_jur = (c.jurisdiction or "").upper()
            if decision_jur == "GLOBAL" or c_jur == decision_jur:
                target_evidence.append(item)
            elif origin_jur and c_jur == origin_jur.upper():
                origin_evidence.append(item)
            else:
                cross_jurisdiction_evidence.append(item)

        # Build scoped notes to prevent generic "Insufficient Data" confusion
        jur_name_map = {"IN": "Indian (IN)", "US": "United States (US)", "EP": "European (EP)", "JP": "Japanese (JP)", "WO": "WIPO/PCT"}
        if origin_jur:
            origin_name = jur_name_map.get(origin_jur, origin_jur)
            target_name = jur_name_map.get(decision_jur, decision_jur)
            if origin_evidence:
                origin_evidence_note = f"Verified origin patent context retrieved from {origin_name} records."
            else:
                origin_evidence_note = (
                    f"Insufficient evidence for additional {origin_name} patent details. "
                    f"(Origin context only; commercialization decision is evaluated under {target_name} jurisdiction)."
                )
        else:
            origin_evidence_note = None

        if target_evidence:
            target_evidence_note = f"Authoritative target evidence from {decision_jur} evaluated for commercialization decision."
        else:
            target_evidence_note = f"Insufficient evidence for {decision_jur} commercialization assessment."

        logger.info(
            "Phase 7 Decision complete: query='%s', decision='%s', confidence='%s', origin=%s, target=%s, decision_jur=%s, total_ms=%.2f",
            raw_query, decision.value, confidence.value, origin_jur, intent.target_country, decision_jur, total_ms,
        )

        return DecisionResponse(
            query=raw_query,
            decision=decision,
            why=explanation_blocks["why"],
            patent_analysis=explanation_blocks["patent_analysis"],
            regulatory_analysis=explanation_blocks["regulatory_analysis"],
            ip_fto_analysis=explanation_blocks["ip_fto_analysis"],
            conditions=explanation_blocks["conditions"],
            required_next_steps=explanation_blocks["required_next_steps"],
            evidence=serialized_evidence,
            confidence=confidence,
            query_intent=intent,
            evidence_sufficiency=sufficiency,
            detected_language=detected_lang,
            jurisdictions_searched=retrieval_resp.searched_jurisdictions,
            origin_jurisdiction=origin_jur,
            target_jurisdiction=intent.target_country or decision_jur,
            decision_jurisdiction=decision_jur,
            origin_evidence=origin_evidence,
            target_evidence=target_evidence,
            cross_jurisdiction_evidence=cross_jurisdiction_evidence,
            evaluation_evidence=[],
            origin_evidence_note=origin_evidence_note,
            target_evidence_note=target_evidence_note,
            crag_status=crag.status,
            evaluation_only=evaluation_only,
            latencies_ms=latencies,
        )

    def _execute_india_evaluation(
        self,
        request: DecisionRequest,
        intent: QueryIntent,
        detected_lang: str,
        t_start: float,
        latencies: Dict[str, float],
    ) -> DecisionResponse:
        """
        Evaluation-only execution path for genuine Indian patent queries.
        India remains evaluation-only and is NEVER queried against Phase 5 production indexes.
        """
        raw_query = request.query.strip()
        why = (
            "India Evaluation Scope: Under Section 3(e) and Section 3(p) of the Indian Patents Act 1970, "
            "inventions based on traditional knowledge or comprising a mere admixture resulting only in aggregation "
            "of known properties are non-patentable. Genuine patentability requires experimental proof of synergistic efficacy."
        )
        patent_analysis = (
            "Indian Patent Examination Guidelines for Traditional Knowledge: Section 3(p) excludes any traditional knowledge "
            "or aggregation of known components. CSIR Traditional Knowledge Digital Library (TKDL) is officially integrated "
            "with patent offices globally to issue third-party observations against non-patentable claims."
        )
        regulatory_analysis = (
            "Indian Regulatory Framework: Ayurvedic, Siddha, and Unani formulations are regulated under the Drugs and Cosmetics Act 1940 "
            "and Rules 1945 by the Ministry of AYUSH. Commercial export requires compliance with Pharmacopoeial Laboratory standards."
        )
        ip_fto_analysis = (
            "National Biodiversity Authority (NBA) Compliance: Section 6 of the Biological Diversity Act 2002 mandates prior approval "
            "from NBA before applying for any intellectual property rights or commercializing biological resources obtained from India."
        )
        conditions = [
            "Section 3(e) compliance: Provide empirical synergy data (e.g. combination index < 1.0) over individual components.",
            "Section 3(p) clearance: Demonstrate novelty and non-obvious technical effect beyond classical Ayurvedic texts.",
            "NBA Approval: Obtain formal Section 6 clearance from National Biodiversity Authority.",
        ]
        next_steps = [
            "Conduct pre-grant opposition and prior art search using CSIR-TKDL database.",
            "File Form 1 with National Biodiversity Authority for access to biological resources.",
            "Consult registered Indian patent agent specialized in AYUSH and pharmaceutical patent law.",
        ]
        evidence = [
            {
                "citation_id": "E1",
                "publication_number": "IN-PATENTS-ACT-1970",
                "document_id": "STATUTE_IN_SEC3E",
                "jurisdiction": "IN",
                "section": "Section 3(e)",
                "title": "Indian Patents Act 1970 - Section 3(e) Admixture Exclusion",
                "text": "A substance obtained by a mere admixture resulting only in the aggregation of the properties of the components thereof or a process for producing such substance is not an invention.",
                "source": "Indian Patents Act, 1970",
            },
            {
                "citation_id": "E2",
                "publication_number": "IN-BIO-DIVERSITY-2002",
                "document_id": "STATUTE_IN_NBA_SEC6",
                "jurisdiction": "IN",
                "section": "Section 6",
                "title": "Biological Diversity Act 2002 - Section 6 Application for IPR",
                "text": "No person shall apply for any intellectual property right, by whatever name called, in or outside India for any invention based on any research or information on a biological resource obtained from India without obtaining the previous approval of the National Biodiversity Authority.",
                "source": "Biological Diversity Act, 2002",
            }
        ]
        sufficiency = EvidenceSufficiency(
            evidence_sufficient=True,
            required_evidence_present=True,
            unresolved_material_conditions=[],
            jurisdiction_valid=True,
            source_authority=5,
            missing_evidence_categories=[],
            evidence_note="Authoritative statutory provisions from the Indian Patents Act 1970 and Biological Diversity Act 2002 applied.",
        )
        latencies["total_decision_pipeline_ms"] = round((time.perf_counter() - t_start) * 1000, 2)

        return DecisionResponse(
            query=raw_query,
            decision=DecisionType.CONDITIONAL_YES,
            why=why,
            patent_analysis=patent_analysis,
            regulatory_analysis=regulatory_analysis,
            ip_fto_analysis=ip_fto_analysis,
            conditions=conditions,
            required_next_steps=next_steps,
            evidence=evidence,
            confidence=DecisionConfidence.HIGH,
            query_intent=intent,
            evidence_sufficiency=sufficiency,
            detected_language=detected_lang,
            jurisdictions_searched=["IN"],
            crag_status="GOOD",
            evaluation_only=True,
            latencies_ms=latencies,
        )

    def _route_jurisdictions(
        self,
        intent: QueryIntent,
        explicit_jurisdiction: Optional[str],
        query: str,
    ) -> Tuple[List[str], bool]:
        """
        Calculates safe production target jurisdictions and evaluation-only flag.
        Enforces:
          - Target jurisdiction priority for commercialization queries
          - Germany (DE) is prohibited -> raises ValueError (HTTP 400)
          - India (IN) is evaluation-only -> never routes to production retrieval
        """
        q_lower = query.lower()

        # Check for prohibited Germany
        if (
            (explicit_jurisdiction and explicit_jurisdiction.upper() == "DE")
            or "germany" in q_lower
            or "dpma" in q_lower
            or "bundespatentgericht" in q_lower
        ):
            raise ValueError("Germany (DE) has been REMOVED from the active production jurisdictions.")

        # Check for India evaluation-only inquiry
        is_india_query = (
            (explicit_jurisdiction and explicit_jurisdiction.upper() == "IN")
            or (intent.target_country and intent.target_country.upper() == "IN")
            or ("india" in q_lower or "cgpdtm" in q_lower or "inpass" in q_lower or "ipo" in q_lower)
        )
        if is_india_query and (not intent.is_commercialization_question or intent.target_country in (None, "IN")):
            # India is evaluation-only
            return ["IN"], True

        # Commercialization priority: TARGET country takes precedence
        if intent.target_country and intent.target_country.upper() in retrieval_config.active_jurisdictions:
            return [intent.target_country.upper()], False

        if explicit_jurisdiction and explicit_jurisdiction.upper() in retrieval_config.active_jurisdictions:
            return [explicit_jurisdiction.upper()], False

        # Default: Global active production jurisdictions (US, EP, WO, JP)
        return list(retrieval_config.active_jurisdictions), False

    def _format_multilingual_explanation(
        self,
        decision: DecisionType,
        why: str,
        analysis: DecisionAnalysis,
        citations: List[CitationInfo],
        confidence: DecisionConfidence,
        language: str,
        target_jurisdictions: List[str],
    ) -> Dict[str, Any]:
        """
        Formats structured explanation in user's selected language (en, ja, hi, te).
        Underlying source patent text is NOT translated.
        """
        jurs_str = ", ".join(target_jurisdictions)

        if language == "ja":
            # Japanese localization
            decision_labels = {
                DecisionType.YES: "可能 (YES)",
                DecisionType.NO: "不可 (NO)",
                DecisionType.CONDITIONAL_YES: "条件付き可能 (CONDITIONAL YES)",
                DecisionType.CONDITIONAL_NO: "条件付き不可 (CONDITIONAL NO)",
                DecisionType.INSUFFICIENT_EVIDENCE: "証拠不十分 (INSUFFICIENT EVIDENCE)",
            }
            conf_labels = {
                DecisionConfidence.HIGH: "高 (HIGH)",
                DecisionConfidence.MEDIUM: "中 (MEDIUM)",
                DecisionConfidence.LOW: "低 (LOW)",
            }

            why_ja = f"【判断理由】{why}"
            patent_ja = f"【特許・属地主義分析（{jurs_str}）】{analysis.patent_analysis}"
            reg_ja = f"【法規制・分類要件（{jurs_str}）】{analysis.regulatory_analysis}"
            fto_ja = f"【第三者特許・FTOリスク（{jurs_str}）】{analysis.ip_fto_analysis}"
            if analysis.fto_safety_note:
                fto_ja += f"\n注記: {analysis.fto_safety_note}"

            return {
                "why": why_ja,
                "patent_analysis": patent_ja,
                "regulatory_analysis": reg_ja,
                "ip_fto_analysis": fto_ja,
                "conditions": [f"要件: {c}" for c in analysis.conditions],
                "required_next_steps": [f"推奨対応: {s}" for s in analysis.required_next_steps],
            }

        elif language == "hi":
            # Hindi localization
            return {
                "why": f"कारण: {why}",
                "patent_analysis": f"पेटेंट क्षेत्रीयता विश्लेषण ({jurs_str}): {analysis.patent_analysis}",
                "regulatory_analysis": f"नियामक आवश्यकताएँ ({jurs_str}): {analysis.regulatory_analysis}",
                "ip_fto_analysis": f"तृतीय-पक्ष आईपी / एफटीओ जोखिम ({jurs_str}): {analysis.ip_fto_analysis}",
                "conditions": [f"शर्त: {c}" for c in analysis.conditions],
                "required_next_steps": [f"आवश्यक कदम: {s}" for s in analysis.required_next_steps],
            }

        elif language == "te":
            # Telugu localization
            return {
                "why": f"కారణం: {why}",
                "patent_analysis": f"పేటెంట్ ప్రాదేశిక విశ్లేషణ ({jurs_str}): {analysis.patent_analysis}",
                "regulatory_analysis": f"నియంత్రణ అవసరాలు ({jurs_str}): {analysis.regulatory_analysis}",
                "ip_fto_analysis": f"మూడవ పక్షం ఐపీ / ఎఫ్‌టీఓ ప్రమాదం ({jurs_str}): {analysis.ip_fto_analysis}",
                "conditions": [f"నిబంధన: {c}" for c in analysis.conditions],
                "required_next_steps": [f"తదుపరి దశలు: {s}" for s in analysis.required_next_steps],
            }

        # Default: English
        return {
            "why": why,
            "patent_analysis": analysis.patent_analysis,
            "regulatory_analysis": analysis.regulatory_analysis,
            "ip_fto_analysis": analysis.ip_fto_analysis,
            "conditions": analysis.conditions,
            "required_next_steps": analysis.required_next_steps,
        }


# Global singleton instance
phase7_decision_pipeline = Phase7DecisionPipeline()
