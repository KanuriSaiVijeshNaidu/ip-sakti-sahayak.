"""
backend/app/intelligence/general_engine.py
──────────────────────────────────────────
AYURLEX General Intelligence Capability Engine.
Provides pedagogical, conceptual, and educational explanations for:
  - Core IP concepts (prior art, novelty, inventive step, FTO)
  - Technical foundations (RAG, vector search, CRAG)
  - Scientific phenomena (botanical extraction, photosynthesis)
  - Ayurvedic regulatory principles (classical vs proprietary formulations)

CRITICAL INVARIANT:
General Intelligence NEVER fabricates legal statutes, patent claims, or jurisdiction approvals.
Any request for concrete legal clearance or specific jurisdiction decisions routes to RAG.
"""
from __future__ import annotations

import logging
from typing import Dict, Any, Optional

logger = logging.getLogger(__name__)

KNOWLEDGE_BASE: Dict[str, Dict[str, Any]] = {
    "patent": {
        "title": "What is a Patent? Intellectual Property Overview",
        "concept": "Patent Grant & Exclusive Rights",
        "explanation": (
            "A patent is an exclusive legal right granted by a sovereign government to an inventor for a limited period "
            "(typically 20 years from the filing date) in exchange for a comprehensive public disclosure of the invention. "
            "A patent confers the negative right to exclude others from making, using, offering for sale, selling, or importing "
            "the claimed invention without authorization. Under international patent standards (including India, the US, and Europe), "
            "a patentable invention must satisfy three core statutory criteria: (1) Novelty (it must not exist anywhere in prior art), "
            "(2) Inventive Step / Non-Obviousness (it must not be obvious to a person skilled in the relevant art), and "
            "(3) Industrial Applicability (it must have practical utility). In traditional medicine and Ayurveda, natural plants and "
            "known classical formulations are legally excluded from patentability as mere discoveries or traditional knowledge (e.g. "
            "Section 3(p) in India), unless an inventive technical effect, novel extraction process, or synergistic adjuvant is established."
        ),
        "follow_up_hint": "To assess whether a specific formulation or process meets patent criteria, ask: 'Can I patent [formulation name] in [target market]?'"
    },
    "trademark": {
        "title": "What is a Trademark? Brand Protection Overview",
        "concept": "Trademark Law & Distinctiveness",
        "explanation": (
            "A trademark is a distinctive sign, design, symbol, name, or combination thereof that identifies and distinguishes the "
            "commercial source of goods or services of one enterprise from those of competitors. Unlike patents (which protect technical "
            "inventions for 20 years), trademarks protect commercial brand identity and consumer goodwill, and can be renewed indefinitely "
            "every 10 years. In the herbal, dietary, and pharmaceutical domains, trademarks are registered under international Nice "
            "Classifications—principally Class 5 (Ayurvedic/herbal medicines and dietetic substances), Class 3 (herbal cosmetics and essential oils), "
            "and Class 30 (herbal teas and dietary supplements). Statutory trademark law (such as Section 13 & 9 of the Indian Trade Marks Act 1999) "
            "strictly prohibits registering generic botanical names (e.g. 'Ashwagandha' or 'Triphala') or International Nonproprietary Names (INNs) "
            "as exclusive marks, requiring brand names to be coined, suggestive, or arbitrary."
        ),
        "follow_up_hint": "To screen a proposed brand name for conflicts or generic exclusions under Class 5 or Class 30, provide your intended brand name."
    },
    "novelty": {
        "title": "Understanding Novelty in Patent Law",
        "concept": "Novelty & Prior Art Anticipation",
        "explanation": (
            "Novelty is a fundamental prerequisite for patentability requiring that an invention must not form part of the state of the art "
            "anywhere in the world prior to the priority filing date. An invention lacks novelty (is 'anticipated') if a single prior art document, "
            "granted patent, scientific publication, public sale, or classical treatise discloses every element of the claimed invention. "
            "In herbal medicine and Ayurveda, documentation in ancient compendia (such as Charaka Samhita or Sushruta Samhita) and the Traditional "
            "Knowledge Digital Library (TKDL) serves as complete novelty-destroying prior art against claims directed to known botanical uses."
        ),
        "follow_up_hint": "To screen whether known Ayurvedic prior art in the TKDL affects your specific formulation, specify your ingredients and target jurisdiction."
    },
    "inventive_step": {
        "title": "Inventive Step and Non-Obviousness Explained",
        "concept": "Inventive Step / Non-Obviousness",
        "explanation": (
            "The inventive step (termed 'non-obviousness' under US 35 U.S.C. 103 and EPC Article 56) requires that, even if an invention is technically novel, "
            "the technical advance must not have been obvious to a Person Having Ordinary Skill in the Art (PHOSITA) having regard to available prior art. "
            "In polyherbal and pharmaceutical formulations, combining known active herbs is presumed obvious as a mere aggregation of known properties "
            "unless the applicant demonstrates unexpected synergistic efficacy (e.g. combination index < 1.0) or an unpredictable technical effect."
        ),
        "follow_up_hint": "To test whether your polyherbal recipe demonstrates patentable synergy overcoming Section 3(e) or obviousness bars, consult the formulation analyzer."
    },
    "freedom_to_operate": {
        "title": "What is Freedom to Operate (FTO)?",
        "concept": "Freedom to Operate & Patent Clearance",
        "explanation": (
            "Freedom to Operate (FTO), also known as patent clearance or right-to-use analysis, is the process of verifying whether commercializing "
            "a product or technology will infringe any active, unexpired patents held by third parties in a specific target jurisdiction. "
            "A crucial legal principle is that owning a granted patent does not automatically give you freedom to operate: your product might still "
            "infringe earlier, broader third-party patents. FTO searches focus on the claims of in-force patents within the jurisdiction where commercial "
            "manufacture or sales will take place."
        ),
        "follow_up_hint": "To conduct an FTO clearance assessment for your product in India, the US, or Japan, provide your delivery format and target launch market."
    },
    "photosynthesis": {
        "title": "Photosynthesis: Biological Process Overview",
        "concept": "Photosynthesis",
        "explanation": (
            "Photosynthesis is the fundamental biological process by which green plants, algae, and certain bacteria "
            "convert light energy (primarily from the sun) into chemical energy stored in glucose. "
            "In plants, water absorbed by roots and carbon dioxide absorbed through stomata react within chlorophyll-containing "
            "chloroplasts to produce glucose and release oxygen (6 CO2 + 6 H2O + light -> C6H12O6 + 6 O2). "
            "In botanical medicine and Ayurveda, photosynthetic secondary metabolites (such as withanolides, curcuminoids, "
            "and polyphenols) form the therapeutic active constituents synthesized by medicinal plants."
        ),
        "follow_up_hint": "To analyze how botanical metabolites from a specific plant (like Ashwagandha or Turmeric) are evaluated for patent eligibility or prior art, ask: 'How does this apply to my formulation?'"
    },
    "prior_art": {
        "title": "Understanding Prior Art in Patent Law",
        "concept": "Prior Art",
        "explanation": (
            "Prior art constitutes any evidence that your invention is already known to the public prior to your patent application filing date. "
            "It includes granted patents, published patent applications, scientific journal articles, public presentations, "
            "commercial sales, and traditional knowledge documented in ancient treatises (such as the Charaka Samhita or Sushruta Samhita). "
            "Under international patent systems, if an examiner or challenger discovers prior art disclosing all elements of your claimed invention, "
            "the patent claim is rejected for lack of novelty (anticipation) or lack of inventive step (obviousness)."
        ),
        "follow_up_hint": "To screen whether known Ayurvedic prior art in the TKDL affects your specific formulation in India, the US, or Europe, select your target jurisdiction and ask for a patentability assessment."
    },
    "patent_novelty": {
        "title": "Patent Novelty and Inventive Step Explained",
        "concept": "Novelty & Inventive Step",
        "explanation": (
            "Novelty requires that an invention must be strictly new and never disclosed anywhere in the world in any public format before the filing date. "
            "Even if an invention is technically novel, it must also satisfy the 'inventive step' (non-obviousness) requirement—meaning the development "
            "would not have been obvious to a person skilled in the relevant art (POSITA) combining existing references. "
            "In herbal medicine, merely mixing two known herbs (e.g. Ashwagandha + Piperine) is generally considered obvious unless experimental data proves "
            "a synergistic enhancement beyond mere additive properties."
        ),
        "follow_up_hint": "To evaluate if your formulation exhibits patentable synergy over known classical admixtures under Indian Patents Act Section 3(e) or EPC Article 56, run a formulation synergy analysis."
    },
    "rag": {
        "title": "Retrieval-Augmented Generation (RAG) Architecture",
        "concept": "Retrieval-Augmented Generation",
        "explanation": (
            "Retrieval-Augmented Generation (RAG) is an AI architecture that anchors language model answers in verifiable external knowledge. "
            "Instead of relying on a model's internal pre-trained memory (which can hallucinate facts or cite outdated laws), RAG retrieves relevant "
            "statutory sections, patent claims, and official gazettes from indexed databases (using BM25 lexical search and BGE-M3 dense vector embeddings). "
            "The retrieved evidence is reranked, verified through Corrective RAG (CRAG), and passed into the LLM context to ensure 100% citation traceability."
        ),
        "follow_up_hint": "You can inspect the live retrieval trace, BM25 scores, and CRAG evidence gate behind any AYURLEX response using the [How AYURLEX reached this answer] panel."
    },
    "classical_vs_proprietary": {
        "title": "Classical vs. Proprietary Ayurvedic Medicines",
        "concept": "Regulatory Formulation Types",
        "explanation": (
            "In Indian drug law under Drugs & Cosmetics Rules 158B, Ayurvedic products fall into two distinct legal classes: "
            "(1) Classical Ayurvedic Medicines: Formulations manufactured strictly according to authoritative recipes listed in the first schedule "
            "treatises (e.g., Ayurvedic Formulary of India, Charaka Samhita, Sharangadhara Samhita). These are exempt from human clinical trials for licensing. "
            "(2) Ayurvedic Proprietary Medicines (Patent or Proprietary ASU Drugs): Novel combinations, new dosage forms, or standardized extracts not found "
            "in classical texts. These require formal proof of safety, acute toxicity studies, and published scientific literature or pilot clinical trials under Rule 158B."
        ),
        "follow_up_hint": "To check whether your specific recipe qualifies as a classical exemption or requires proprietary licensing under Rule 158B, share your ingredient list and target licensing channel."
    },
    "biological_origin": {
        "title": "Why Biological Origin Disclosure is Required",
        "concept": "Biological Diversity Act & ABS",
        "explanation": (
            "Under the Convention on Biological Diversity (CBD) and India's Biological Diversity Act 2002, sovereign nations have sovereign rights over their biological resources. "
            "Section 6 of the Indian Biological Diversity Act mandates that any entity seeking an intellectual property right (in India or abroad) based on research "
            "conducted on biological resources obtained from India must obtain prior approval from the National Biodiversity Authority (NBA Chennai). "
            "Additionally, the Patents Act 1970 Section 10(4)(ii)(D) makes it a mandatory requirement of patent disclosure to state the geographical origin of biological material."
        ),
        "follow_up_hint": "To verify whether your product requires Form III NBA clearance or is exempt as a value-added commercial commodity, request a Biodiversity / ABS assessment."
    }
}


class GeneralIntelligenceEngine:
    """Generates pedagogical and conceptual answers for non-statutory or general questions."""

    def explain(self, query: str, conversation_context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        q_lower = query.strip().lower()

        # Match specific known concepts (prioritize longer/more specific phrases first)
        ordered_keys = sorted(KNOWLEDGE_BASE.keys(), key=lambda k: len(k), reverse=True)
        for key in ordered_keys:
            entry = KNOWLEDGE_BASE[key]
            norm_key = key.replace("_", " ")
            if norm_key in q_lower or key in q_lower or (key == "rag" and "retrieval augmented" in q_lower) or (key == "classical_vs_proprietary" and ("classical" in q_lower or "proprietary" in q_lower)):
                return {
                    "answer_type": "GENERAL_KNOWLEDGE",
                    "title": entry["title"],
                    "concept": entry["concept"],
                    "content": entry["explanation"],
                    "follow_up_hint": entry["follow_up_hint"],
                    "requires_rag": False,
                    "evidence_status": "CONCEPTUAL_EXPLANATION",
                    "jurisdiction": "GLOBAL_EDUCATIONAL",
                    "citations": []
                }

        # Fallback for unrecognized non-IP / non-AYUSH inquiries
        return {
            "answer_type": "INSUFFICIENT_DATA",
            "title": "Insufficient Data in Verified Sources",
            "concept": "Out-of-Scope / Non-IP Inquiry",
            "content": (
                "Insufficient data in the available sources to answer this question reliably.\n\n"
                "AYURLEX is an evidence-grounded intelligence assistant specialized in intellectual property (patents, "
                "trademarks, designs, plant varieties, geographical indications) and Ayurvedic / AYUSH regulatory frameworks. "
                "The requested topic is outside the verified conceptual and statutory knowledge base."
            ),
            "follow_up_hint": "Please submit an intellectual property or AYUSH/FSSAI regulatory inquiry.",
            "requires_rag": False,
            "evidence_status": "INSUFFICIENT_DATA",
            "jurisdiction": "GLOBAL_EDUCATIONAL",
            "citations": []
        }


general_intelligence_engine = GeneralIntelligenceEngine()
