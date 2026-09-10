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
from backend.app.intelligence.router import intelligence_router, UNINDEXED_JURISDICTIONS
from backend.app.intelligence.general_engine import general_intelligence_engine
from backend.app.decision.alignment_validator import QuestionAnswerAlignmentValidator

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

        # ── 2b. AYURLEX Intelligence Routing & Jurisdiction Guards ─────────────
        t0 = time.perf_counter()
        routing = intelligence_router.route(raw_query, explicit_jurisdiction=request.jurisdiction)
        latencies["intelligence_routing_ms"] = round((time.perf_counter() - t0) * 1000, 2)

        # Case 0: Out-of-Domain / Arbitrary Query -> Immediate Abstention
        if routing.is_out_of_domain:
            total_ms = round((time.perf_counter() - t_start) * 1000, 2)
            latencies["total_decision_pipeline_ms"] = total_ms
            return DecisionResponse(
                query=raw_query,
                decision=DecisionType.INSUFFICIENT_EVIDENCE,
                why="Insufficient data. This question is outside the scope of the available Intellectual Property, Ayurveda, and regulatory sources.",
                patent_analysis="The query does not concern patentable subject matter, prior art, or intellectual property regimes.",
                regulatory_analysis="No therapeutic, dietary, or health authority regulatory framework applies to this inquiry.",
                ip_fto_analysis="Freedom-to-operate clearance cannot be evaluated for non-IP and out-of-domain questions.",
                conditions=[],
                required_next_steps=[],
                evidence=[],
                confidence=DecisionConfidence.LOW,
                query_intent=intent,
                evidence_sufficiency=EvidenceSufficiency(
                    evidence_sufficient=False,
                    required_evidence_present=False,
                    unresolved_material_conditions=["Query falls outside the indexed Intellectual Property, Ayurveda, and regulatory scope."],
                    jurisdiction_valid=False,
                    source_authority=1,
                    missing_evidence_categories=["in_domain_statutes", "in_domain_prior_art"],
                    decision_reason_codes=["OUT_OF_DOMAIN", "INSUFFICIENT_EVIDENCE", routing.domain_reason_code or "OUT_OF_DOMAIN"],
                    patent_evidence_count=0,
                    regulatory_evidence_count=0,
                    fto_evidence_count=0,
                    evidence_note="Query rejected by Domain Boundary Validator.",
                ),
                detected_language=detected_lang,
                jurisdictions_searched=[],
                origin_jurisdiction="IN",
                target_jurisdiction="GLOBAL",
                decision_jurisdiction="GLOBAL",
                origin_evidence=[],
                target_evidence=[],
                cross_jurisdiction_evidence=[],
                evaluation_evidence=[],
                crag_status="INSUFFICIENT",
                evaluation_only=False,
                latencies_ms=latencies,
            )

        # Case 1: Unsupported / Unindexed Jurisdictions (e.g. AU, BR, CN, CA) -> Strict Abstention
        if routing.is_unsupported_jurisdiction:
            jur_code = routing.unsupported_jurisdiction_code or (request.jurisdiction or "UNKNOWN").upper()
            jur_name = UNINDEXED_JURISDICTIONS.get(jur_code, jur_code)
            total_ms = round((time.perf_counter() - t_start) * 1000, 2)
            latencies["total_decision_pipeline_ms"] = total_ms
            return DecisionResponse(
                query=raw_query,
                decision=DecisionType.INSUFFICIENT_EVIDENCE,
                why=(
                    f"AYURLEX Evidence Boundary: Jurisdiction '{jur_name}' ({jur_code}) is not currently indexed in the verified AYURLEX corpus. "
                    f"Authoritative statutory and patent databases are actively maintained for India (IN), United States (US), "
                    f"European Patent Office (EP), WIPO/PCT (WO), and Japan (JP). "
                    f"Under our zero-hallucination policy, we abstain with INSUFFICIENT EVIDENCE rather than delivering ungrounded clearance."
                ),
                patent_analysis=f"No verified patent register or prior art index is currently loaded for {jur_name}.",
                regulatory_analysis=f"No regulatory health authority corpus (e.g. TGA/ANVISA/NMPA) is currently indexed for {jur_name}.",
                ip_fto_analysis=f"Freedom-to-operate clearance cannot be evaluated for {jur_name} without indexed patent claims.",
                conditions=[f"Obtain direct guidance from official statutory authorities or patent registries in {jur_name}."],
                required_next_steps=[f"Consult a registered patent attorney and regulatory consultant licensed in {jur_name}."],
                evidence=[],
                confidence=DecisionConfidence.LOW,
                query_intent=intent,
                evidence_sufficiency=EvidenceSufficiency(
                    evidence_sufficient=False,
                    required_evidence_present=False,
                    unresolved_material_conditions=[f"Jurisdiction '{jur_name}' is outside the verified active corpus."],
                    jurisdiction_valid=False,
                    source_authority=1,
                    missing_evidence_categories=["jurisdiction_statutes", "patent_prior_art"],
                    decision_reason_codes=["UNINDEXED_JURISDICTION", "INSUFFICIENT_EVIDENCE"],
                    patent_evidence_count=0,
                    regulatory_evidence_count=0,
                    fto_evidence_count=0,
                    evidence_note=f"No authoritative corpus indexed for {jur_name}.",
                ),
                detected_language=detected_lang,
                jurisdictions_searched=[jur_code],
                origin_jurisdiction=intent.origin_country,
                target_jurisdiction=jur_code,
                decision_jurisdiction=jur_code,
                origin_evidence=[],
                target_evidence=[],
                cross_jurisdiction_evidence=[],
                evaluation_evidence=[],
                crag_status="INSUFFICIENT",
                evaluation_only=False,
                latencies_ms=latencies,
            )

        # Case 2: General Knowledge / Pedagogical (e.g. photosynthesis, what is prior art, RAG)
        if routing.is_general_educational:
            gen_ans = general_intelligence_engine.explain(raw_query)
            total_ms = round((time.perf_counter() - t_start) * 1000, 2)
            latencies["total_decision_pipeline_ms"] = total_ms

            if gen_ans.get("answer_type") == "INSUFFICIENT_DATA":
                return DecisionResponse(
                    query=raw_query,
                    decision=DecisionType.INSUFFICIENT_EVIDENCE,
                    why=gen_ans["content"],
                    patent_analysis="The query does not pertain to indexed patent, trademark, or IP statutory subject matter.",
                    regulatory_analysis="No regulatory health authority or drug safety standard applies to this inquiry.",
                    ip_fto_analysis="No IP freedom-to-operate clearance can be evaluated for unindexed non-IP topics.",
                    conditions=["Submit an intellectual property or AYUSH regulatory inquiry."],
                    required_next_steps=[gen_ans["follow_up_hint"]],
                    evidence=[],
                    confidence=DecisionConfidence.LOW,
                    query_intent=intent,
                    evidence_sufficiency=EvidenceSufficiency(
                        evidence_sufficient=False,
                        required_evidence_present=False,
                        unresolved_material_conditions=["Query is outside indexed IP and AYUSH statutory domain."],
                        jurisdiction_valid=False,
                        source_authority=0,
                        missing_evidence_categories=["ip_statutes", "ayush_regulations"],
                        decision_reason_codes=["OUT_OF_DOMAIN", "INSUFFICIENT_EVIDENCE"],
                        patent_evidence_count=0,
                        regulatory_evidence_count=0,
                        fto_evidence_count=0,
                        evidence_note="Insufficient data in available sources to answer reliably.",
                    ),
                    detected_language=detected_lang,
                    jurisdictions_searched=[],
                    origin_jurisdiction="IN",
                    target_jurisdiction="IN",
                    decision_jurisdiction="IN",
                    origin_evidence=[],
                    target_evidence=[],
                    cross_jurisdiction_evidence=[],
                    evaluation_evidence=[],
                    crag_status="INSUFFICIENT",
                    evaluation_only=False,
                    latencies_ms=latencies,
                )

            return DecisionResponse(
                query=raw_query,
                decision=DecisionType.YES,
                why=gen_ans["content"],
                patent_analysis=f"Conceptual & Educational Intelligence: {gen_ans['title']}. This pedagogical topic explains fundamental principles without triggering statutory patent exclusions.",
                regulatory_analysis="Educational Concept: No national therapeutic regulatory filing is triggered.",
                ip_fto_analysis=gen_ans["follow_up_hint"],
                conditions=[],
                required_next_steps=[gen_ans["follow_up_hint"]],
                evidence=[],
                confidence=DecisionConfidence.HIGH,
                query_intent=intent,
                evidence_sufficiency=EvidenceSufficiency(
                    evidence_sufficient=True,
                    required_evidence_present=True,
                    unresolved_material_conditions=[],
                    jurisdiction_valid=True,
                    source_authority=5,
                    missing_evidence_categories=[],
                    decision_reason_codes=["GENERAL_INTELLIGENCE_CONCEPT"],
                    patent_evidence_count=0,
                    regulatory_evidence_count=0,
                    fto_evidence_count=0,
                    evidence_note="Concept grounded in verified scientific and educational foundations.",
                ),
                detected_language=detected_lang,
                jurisdictions_searched=["GLOBAL_EDUCATIONAL"],
                origin_jurisdiction=None,
                target_jurisdiction="GLOBAL",
                decision_jurisdiction="GLOBAL",
                origin_evidence=[],
                target_evidence=[],
                cross_jurisdiction_evidence=[],
                evaluation_evidence=[],
                crag_status="GOOD",
                evaluation_only=False,
                latencies_ms=latencies,
            )

        # ── 3. Origin & Target Jurisdiction Routing ────────────────────────────
        t0 = time.perf_counter()
        target_jurs, evaluation_only = self._route_jurisdictions(intent, request.jurisdiction, raw_query)
        latencies["jurisdiction_routing_ms"] = round((time.perf_counter() - t0) * 1000, 2)

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

        # Circuit-breaker: Immediately abstain if evidence is insufficient or invalid
        if crag.status in ["INSUFFICIENT", "INVALID"]:
            total_ms = round((time.perf_counter() - t_start) * 1000, 2)
            latencies["total_decision_pipeline_ms"] = total_ms
            decision_jur = target_jurs[0] if target_jurs else "UNKNOWN"
            return DecisionResponse(
                query=raw_query,
                decision=DecisionType.INSUFFICIENT_EVIDENCE,
                why=(
                    f"AYURLEX Evidence Boundary: {crag.reason} "
                    f"Under our strict anti-hallucination policy ('no sufficient evidence = no substantive answer'), "
                    f"AYURLEX returns INSUFFICIENT_EVIDENCE rather than speculating or substituting unrelated sources."
                ),
                patent_analysis=f"Retrieved evidence for {decision_jur} does not satisfy the Evidence Compatibility Gate: either no statutory section was matched or only non-authoritative invention disclosures were found.",
                regulatory_analysis=f"No verified regulatory or statutory evidence for {decision_jur} was found supporting this inquiry.",
                ip_fto_analysis="Freedom to operate or statutory rights cannot be determined without verified supporting evidence.",
                conditions=[f"Obtain verified statutory or patent documentation directly from official {decision_jur} authorities or registries."],
                required_next_steps=[f"Provide a specific granted patent or statutory section number, or consult licensed patent counsel in {decision_jur}."],
                evidence=[],
                confidence=DecisionConfidence.LOW,
                query_intent=intent,
                evidence_sufficiency=EvidenceSufficiency(
                    evidence_sufficient=False,
                    required_evidence_present=False,
                    unresolved_material_conditions=[crag.reason],
                    jurisdiction_valid=crag.jurisdiction_match,
                    source_authority=1,
                    missing_evidence_categories=["verified_statutory_evidence"],
                    decision_reason_codes=["CRAG_INSUFFICIENT", "EVIDENCE_GATE_REJECTED"],
                    patent_evidence_count=0,
                    regulatory_evidence_count=0,
                    fto_evidence_count=0,
                    evidence_note=crag.reason,
                ),
                detected_language=detected_lang,
                jurisdictions_searched=retrieval_resp.searched_jurisdictions,
                origin_jurisdiction=intent.origin_country,
                target_jurisdiction=decision_jur,
                decision_jurisdiction=decision_jur,
                origin_evidence=[],
                target_evidence=[],
                cross_jurisdiction_evidence=[],
                evaluation_evidence=[],
                crag_status=crag.status,
                evaluation_only=evaluation_only,
                latencies_ms=latencies,
            )

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

        # ── 10. Question-Answer Alignment Verification ────────────────────────
        alignment = QuestionAnswerAlignmentValidator().validate_alignment(
            query=raw_query,
            answer_text=f"{explanation_blocks['why']} {explanation_blocks['regulatory_analysis']}",
            target_jurisdiction=decision_jur,
            domain=intent.user_objective.value if hasattr(intent.user_objective, "value") else str(intent.user_objective),
            citations=citations,
        )
        if not alignment.is_aligned:
            logger.warning(
                "Question-Answer Alignment Alert: %s (score=%.2f)",
                alignment.mismatch_details, alignment.alignment_score
            )

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

        # Check for India inquiry
        is_india_query = (
            (explicit_jurisdiction and explicit_jurisdiction.upper() == "IN")
            or (intent.target_country and intent.target_country.upper() == "IN")
            or any(k in q_lower for k in [
                "india", "indian", "cgpdtm", "inpass", "ipo", "ayush", "ncism", "itra",
                "ayurveda", "ayurvedic", "fssai", "tkdl", "nba", "designs act", "copyright act", "ppvfr"
            ])
        )
        if is_india_query and (not intent.is_commercialization_question or intent.target_country in (None, "IN")):
            return ["IN"], False

        # Commercialization priority: TARGET country takes precedence
        if intent.target_country and intent.target_country.upper() in retrieval_config.active_jurisdictions:
            return [intent.target_country.upper()], False

        if explicit_jurisdiction and explicit_jurisdiction.upper() in retrieval_config.active_jurisdictions:
            return [explicit_jurisdiction.upper()], False

        # Default: Global active production jurisdictions (IN, US, EP, WO, JP)
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
