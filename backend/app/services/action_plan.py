"""
backend/app/services/action_plan.py
───────────────────────────────────
Evidence-based action plan generator for procedural,
patent examination, licensing, and compliance workflows.
"""
from __future__ import annotations

from typing import List
from backend.app.models.schemas import ActionPlanStep


def generate_action_plan(
    intents: List[str],
    has_tk_overlap: bool = False,
    is_multi_ingredient: bool = False,
    requires_nba: bool = True,
    user_role: str = "attorney",
) -> List[ActionPlanStep]:
    """
    Generate tailored statutory compliance roadmap with official authorities and legal basis.
    """
    steps: List[ActionPlanStep] = []
    curr = 1

    # 1. Botanical and Prior-Art Search
    steps.append(
        ActionPlanStep(
            step_number=curr,
            title="Standardize Botanical & Taxonomic Nomenclature",
            description="Verify all plant species against the Ayurvedic Pharmacopoeia of India (API) and World Flora Online (WFO) to eliminate vernacular ambiguities.",
            authority_or_portal="Pharmacopoeia Commission for Indian Medicine & Homoeopathy (PCIM&H)",
            statutory_basis="Rule 158(B) Drugs & Cosmetics Rules, 1945",
            urgency="REQUIRED",
        )
    )
    curr += 1

    # 2. TKDL Clearance
    if has_tk_overlap or "TRADITIONAL_KNOWLEDGE" in intents or "SECTION_3_P" in intents:
        steps.append(
            ActionPlanStep(
                step_number=curr,
                title="Execute TKDL & Classical Treatise Clearance",
                description="Cross-reference the formulation against CSIR-TKDL prior-art formulation codes and classical treatises (Charaka, Sushruta, AFI) to identify novelty anticipation.",
                authority_or_portal="CSIR-TKDL & National Institute of Science Communication",
                statutory_basis="Section 3(p) Patents Act, 1970",
                urgency="REQUIRED",
            )
        )
        curr += 1

    # 3. Synergy Bioassays
    if is_multi_ingredient or "SECTION_3_E" in intents or "PATENTABILITY" in intents:
        steps.append(
            ActionPlanStep(
                step_number=curr,
                title="Establish Synergistic Bio-Enhancement (Combination Index CI < 1.0)",
                description="Perform in-vitro / in-vivo comparative pharmacological bioassays demonstrating non-additive therapeutic synergy to overcome Section 3(e) mere admixture bar.",
                authority_or_portal="NABL / GLP Accredited Biomedical Testing Facility",
                statutory_basis="Section 3(e) Patents Act, 1970",
                urgency="REQUIRED",
            )
        )
        curr += 1

    # 4. National Biodiversity Authority Form III
    if requires_nba or "BIODIVERSITY" in intents:
        steps.append(
            ActionPlanStep(
                step_number=curr,
                title="Submit Form III Approval to National Biodiversity Authority (NBA)",
                description="File statutory Form III for commercial biological resource utilization and intellectual property grant before patent issuance.",
                authority_or_portal="National Biodiversity Authority (NBA India, Chennai)",
                statutory_basis="Section 6 Biological Diversity Act, 2002",
                urgency="REQUIRED",
            )
        )
        curr += 1

    # 5. Regulatory Licensing / Commercialization alternative
    if "DRUG_REGULATION" in intents or "AYUSH_COMPLIANCE" in intents or user_role == "vaidya" or user_role == "manufacturer":
        steps.append(
            ActionPlanStep(
                step_number=curr,
                title="Compile Rule 158B Proof of Safety & Efficacy Dossier",
                description="Prepare pilot clinical documentation, classical textual citations, and heavy-metal microbial stability data for State Licensing Authority (SLA) approval.",
                authority_or_portal="State AYUSH Licensing Authority / e-AUSHADHI Portal",
                statutory_basis="Rule 158B & Schedule T (GMP) Drugs and Cosmetics Rules, 1945",
                urgency="REQUIRED" if user_role == "manufacturer" else "RECOMMENDED",
            )
        )
        curr += 1

    # 6. Formal Legal Review
    steps.append(
        ActionPlanStep(
            step_number=curr,
            title="Engage Registered Patent Attorney / AYUSH Regulatory Counsel",
            description="Obtain formal Freedom-to-Operate (FTO) opinion and professional specification drafting from an accredited patent attorney registered with CGPDTM.",
            authority_or_portal="Indian Patent Bar / CGPDTM Registry",
            statutory_basis="Section 127 Patents Act, 1970",
            urgency="REQUIRED",
        )
    )

    return steps
