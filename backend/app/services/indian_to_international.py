"""
backend/app/services/indian_to_international.py
────────────────────────────────────────────────
Transition gateway engine for converting Indian Intellectual Property (Patents,
Trademarks, and AYUSH Formulations) into International filings (PCT, USPTO, EPO, DPMA).

Key Statutory Compliance Modules:
1. Indian Patents Act, 1970 — Section 39 Foreign Filing License (FFL) & Sec 118 penalty
2. Biological Diversity Act, 2002/2023 — Section 6 Form III mandatory approval from NBA
3. Patent Cooperation Treaty (PCT) — Articles 8, 21, 33 & Rules 4.10, 17.1
4. Strict Statutory Deadlines: 12-Month Paris/PCT deadline, 30/31-Month National Stages
5. Fee schedules for Natural Persons, Startups/SMEs, and Large Entities.
"""
from __future__ import annotations

import datetime
from typing import Dict, List, Optional
from backend.app.models.schemas import (
    IndianToInternationalRequest,
    IndianToInternationalResponse,
    StatutoryDeadline,
    ClearanceCheck,
    JurisdictionRoadmap,
    ActionPlanStep,
    CitedPassage,
)


def _parse_date(date_str: str) -> datetime.date:
    try:
        return datetime.datetime.strptime(date_str.strip(), "%Y-%m-%d").date()
    except Exception:
        return datetime.date.today()


def _add_months(source_date: datetime.date, months: int) -> datetime.date:
    month = source_date.month - 1 + months
    year = source_date.year + month // 12
    month = month % 12 + 1
    day = min(source_date.day, [31, 29 if year % 4 == 0 and (year % 100 != 0 or year % 400 == 0) else 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1])
    return datetime.date(year, month, day)


def convert_indian_to_international(req: IndianToInternationalRequest) -> IndianToInternationalResponse:
    today = datetime.date.today()
    p_date = _parse_date(req.priority_date)

    days_since_priority = (today - p_date).days

    # ── 1. Calculate Statutory Deadlines ─────────────────────────────────────
    # Standard PCT milestones from Priority Date:
    # 12 Months: Paris Convention / PCT Filing deadline
    # 16 Months: Certified copy of priority document
    # 18 Months: International Publication
    # 22 Months: Demand for Chapter II International Preliminary Examination
    # 30 Months: US National Stage (35 U.S.C. 371)
    # 31 Months: European Regional Phase (Rule 159 EPC) & German Validation

    d12 = _add_months(p_date, 12)
    d16 = _add_months(p_date, 16)
    d18 = _add_months(p_date, 18)
    d22 = _add_months(p_date, 22)
    d30 = _add_months(p_date, 30)
    d31 = _add_months(p_date, 31)

    deadlines: List[StatutoryDeadline] = []

    def make_deadline(name: str, date_obj: datetime.date, months: int, statute: str, desc: str) -> StatutoryDeadline:
        rem = (date_obj - today).days
        if rem < 0:
            status = "PASSED"
        elif rem <= 60:
            status = "URGENT"
        else:
            status = "UPCOMING"
        return StatutoryDeadline(
            milestone=name,
            deadline_date=date_obj.strftime("%Y-%m-%d"),
            months_from_priority=months,
            days_remaining=rem,
            status=status,
            statutory_basis=statute,
            description=desc,
        )

    deadlines.append(make_deadline(
        "PCT & Paris Convention International Filing Deadline",
        d12,
        12,
        "PCT Article 8 & Paris Convention Article 4C",
        "Absolute, non-extendable deadline to file an international PCT application claiming Indian priority.",
    ))
    deadlines.append(make_deadline(
        "Certified Copy of Indian Priority Document Submission",
        d16,
        16,
        "PCT Rule 17.1(a)",
        "Submit certified copy of Indian priority application to WIPO International Bureau or request Indian Patent Office to transmit via DAS.",
    ))
    deadlines.append(make_deadline(
        "International Publication of PCT Application",
        d18,
        18,
        "PCT Article 21",
        "WIPO automatically publishes the application with the International Search Report (ISR) in the PATENTSCOPE database.",
    ))
    deadlines.append(make_deadline(
        "Chapter II International Preliminary Examination Demand",
        d22,
        22,
        "PCT Article 31 & Form PCT/IPEA/401",
        "Optional filing of demand with International Preliminary Examining Authority (IPEA) to establish an IPER.",
    ))
    deadlines.append(make_deadline(
        "US National Stage Entry Deadline (USPTO)",
        d30,
        30,
        "35 U.S.C. 371 & 37 C.F.R. § 1.495",
        "Mandatory deadline to enter US National Stage with preliminary claim amendments and inventor declarations.",
    ))
    deadlines.append(make_deadline(
        "European Regional Phase Entry Deadline (EPO)",
        d31,
        31,
        "Rule 159 EPC & German PatG § 34",
        "Mandatory deadline to enter European Regional Phase, pay filing/search fees, and submit claim specification in English/German/French.",
    ))

    # ── 2. Statutory Clearance Verification ─────────────────────────────────
    clearances: List[ClearanceCheck] = []
    readiness_score = 100

    # A. Section 39 Foreign Filing License (FFL)
    if req.has_foreign_filing_license:
        clearances.append(ClearanceCheck(
            requirement="Foreign Filing License (Section 39 Patents Act)",
            status="COMPLIANT",
            governing_statute="Patents Act 1970 Sec 39 & Rule 71 (Form 25)",
            details="Form 25 written permit has been granted by the Indian Controller of Patents.",
        ))
    elif days_since_priority >= 42:
        clearances.append(ClearanceCheck(
            requirement="Foreign Filing License (Section 39 Patents Act)",
            status="COMPLIANT",
            governing_statute="Patents Act 1970 Sec 39(1)",
            details=f"Statutory 6-week waiting period ({days_since_priority} days elapsed) has passed without secrecy directions from the Controller.",
        ))
    else:
        readiness_score -= 35
        remaining_wait = 42 - days_since_priority
        clearances.append(ClearanceCheck(
            requirement="Foreign Filing License (Section 39 Patents Act)",
            status="CRITICAL_BAR",
            governing_statute="Patents Act 1970 Sec 39 & Sec 118",
            details=f"Only {days_since_priority} days elapsed since Indian filing. Filing abroad right now without written permission violates Section 39. Section 118 prescribes imprisonment up to 2 years + abandonment of Indian application.",
            remedy_step=f"Either wait {remaining_wait} more days OR immediately file Form 25 with CGPDTM with prescribed fee for expedited FFL clearance.",
        ))

    # B. Biological Diversity Act (BDA) Section 6 Clearance
    has_bio = len(req.biological_materials) > 0
    if has_bio:
        if req.has_nba_approval:
            clearances.append(ClearanceCheck(
                requirement="National Biodiversity Authority (NBA) Clearance",
                status="COMPLIANT",
                governing_statute="Biological Diversity Act 2002/2023 Sec 6 & Rule 18 (Form III)",
                details=f"NBA Form III approval granted for {len(req.biological_materials)} biological resource(s): {', '.join(req.biological_materials[:3])}.",
            ))
        else:
            readiness_score -= 25
            clearances.append(ClearanceCheck(
                requirement="National Biodiversity Authority (NBA) Clearance",
                status="ACTION_REQUIRED",
                governing_statute="Biological Diversity Act 2002/2023 Sec 6",
                details=f"Formulation utilizes Indian biological material ({', '.join(req.biological_materials[:3])}). Under Section 6 BDA, prior approval of NBA is mandatory before filing patent applications abroad.",
                remedy_step="Submit Form III electronically via the NBA ABS e-filing portal (absefiling.nic.in) prior to international grant.",
            ))
    else:
        clearances.append(ClearanceCheck(
            requirement="National Biodiversity Authority (NBA) Clearance",
            status="NOT_APPLICABLE",
            governing_statute="Biological Diversity Act 2002 Sec 6",
            details="No Indian biological or genetic resources specified in application profile.",
        ))

    # C. Section 3(p) Traditional Knowledge Pre-Screening
    clearances.append(ClearanceCheck(
        requirement="TKDL Prior Art Pre-Screening (Section 3(p))",
        status="COMPLIANT" if readiness_score > 60 else "ACTION_REQUIRED",
        governing_statute="Patents Act 1970 Sec 3(p) vs USPTO 35 U.S.C. 102 vs EPC Art 54",
        details="Pre-screen claims against ancient Ayurvedic treatises (Charaka, Sushruta) and TKDL to ensure therapeutic indications possess non-obvious synergistic efficacy.",
        remedy_step="Structure claims around specific pharmaceutical compositions, isolated fractions, or bioavailability-enhanced extracts.",
    ))

    # Adjust readiness score based on deadlines
    pct_deadline = deadlines[0]
    if pct_deadline.status == "PASSED":
        readiness_score -= 40
    elif pct_deadline.days_remaining <= 30:
        readiness_score -= 15

    readiness_score = max(5, min(100, readiness_score))

    # ── 3. Country-by-Country Transition Roadmaps ────────────────────────────
    roadmaps: List[JurisdictionRoadmap] = []
    target_set = set(req.target_jurisdictions)

    if "WO" in target_set or "PCT" in target_set:
        roadmaps.append(JurisdictionRoadmap(
            jurisdiction="WO",
            jurisdiction_name="WIPO — Patent Cooperation Treaty (PCT)",
            authority="World Intellectual Property Organization (WIPO) / CGPDTM Receiving Office",
            filing_route="ePCT or Indian Patent Office Receiving Office (RO/IN)",
            key_statutory_requirements=[
                "File Form PCT/RO/101 with English translation of complete specification.",
                "Select International Searching Authority (ISA/IN, ISA/EP, or ISA/US).",
                "WIPO DAS code transmission for electronic certified priority copy.",
                "Formalities compliance within 12 months of Indian priority date."
            ],
            estimated_official_fee="INR 18,000 - 45,000 (RO/IN transmittal + ISA search fee)",
            recommended_action="Submit Request PCT/RO/101 electronically via ePCT with Indian Receiving Office.",
        ))

    if "US" in target_set:
        roadmaps.append(JurisdictionRoadmap(
            jurisdiction="US",
            jurisdiction_name="United States — USPTO",
            authority="United States Patent and Trademark Office (USPTO)",
            filing_route="35 U.S.C. 371 National Stage Entry or Direct Paris Convention",
            key_statutory_requirements=[
                "Inventor Oath / Declaration under 37 C.F.R. § 1.63.",
                "Information Disclosure Statement (IDS) citing all TKDL references and Indian search reports.",
                "Overcoming 35 U.S.C. 101 Alice/Mayo natural product eligibility hurdles with technical dosage formulation.",
                "Rebuttal of 35 U.S.C. 103 obviousness through synergistic combination data."
            ],
            estimated_official_fee="USD 400 (Micro-Entity) / USD 800 (Small Entity) / USD 1,820 (Large Entity)",
            recommended_action="File USPTO National Stage under 35 U.S.C. 371 with Preliminary Amendment prior to Month 30.",
        ))

    if "EP" in target_set or "EU" in target_set:
        roadmaps.append(JurisdictionRoadmap(
            jurisdiction="EP",
            jurisdiction_name="European Union — EPO",
            authority="European Patent Office (EPO)",
            filing_route="Rule 159 EPC Regional Phase Entry",
            key_statutory_requirements=[
                "Translation of specification into English, French, or German (Rule 159(1)(a) EPC).",
                "Payment of national basic fee, search fee, designation fee, and claims fees for > 15 claims.",
                "Compliance with Article 53(a) public order / biological resource origin disclosure.",
                "Problem-solution approach demonstrating non-obvious synergistic effect under Article 56."
            ],
            estimated_official_fee="EUR 1,450 (Base) + EUR 265 per claim above 15",
            recommended_action="Enter European Regional Phase before Month 31 via MyEPO Portfolio.",
        ))

    if "DE" in target_set:
        roadmaps.append(JurisdictionRoadmap(
            jurisdiction="DE",
            jurisdiction_name="Germany — DPMA",
            authority="Deutsches Patent- und Markenamt (DPMA)",
            filing_route="National Validation of Granted EP or Direct National Phase via PatG § 34",
            key_statutory_requirements=[
                "German language translation of claims upon European grant (London Agreement Art 1).",
                "Adherence to DPMA phytopharmaceutical extraction examination standards.",
                "Recognition of classical Ayurvedic literature as prior art under PatG § 3."
            ],
            estimated_official_fee="EUR 350 - 600 (National validation & publication fee)",
            recommended_action="Designate Germany via European Patent (EP) or enter DPMA national phase directly.",
        ))

    # ── 4. Fee Estimates ────────────────────────────────────────────────────
    is_person = req.applicant_type == "NATURAL_PERSON"
    is_startup = req.applicant_type == "STARTUP_SME"

    estimated_fees = {
        "Indian_Transmittal_Fee": "INR 3,200" if (is_person or is_startup) else "INR 16,000",
        "WIPO_International_Filing_Fee": "CHF 133 (90% reduction for Indian individuals)" if is_person else "CHF 1,330",
        "Search_Fee_ISA_IN": "INR 4,000" if (is_person or is_startup) else "INR 10,000",
        "US_National_Stage_371": "USD 400 (Micro)" if is_person else ("USD 800 (Small)" if is_startup else "USD 1,820"),
        "EPO_Regional_Phase_159": "EUR 1,450 (Statutory Base Entry)",
        "Currency_Notice": "Official government fees only. Excludes professional attorney drafting and translation costs.",
    }

    # ── 5. Required Documents Checklist ─────────────────────────────────────
    required_docs = [
        "Certified Copy of Indian Priority Application (Form 1 & Provisional/Complete Specification)",
        "WIPO DAS (Digital Access Service) Code from Indian Patent Office",
        "Form PCT/RO/101 (Request for International Application)",
        "Foreign Filing License (Section 39 approval copy or Form 25 grant)",
        "National Biodiversity Authority (NBA) Form III Application / Approval Certificate",
        "Inventor Power of Attorney (Form PCT/RO/101 Annex or Form 26)",
        "Assignment of Invention Deed (from Ayurvedic Vaidyas / Inventors to Applicant Entity)",
        "Statement & Undertaking under Section 8 (Form 3) regarding foreign filings",
        "English Translation & Verification Certificate (if priority filed in Hindi/regional language)",
    ]

    # ── 6. Sequential Action Plan ───────────────────────────────────────────
    action_plan = [
        ActionPlanStep(
            step_number=1,
            title="Verify Section 39 FFL Status & Wait Period",
            description=f"Ensure at least 6 weeks have elapsed since Indian filing date ({req.priority_date}) or file Form 25 with CGPDTM before submitting foreign applications.",
            authority_or_portal="Patent Office CGPDTM (ipindiaonline.gov.in)",
            statutory_basis="Indian Patents Act 1970 Section 39 & Section 118",
            urgency="REQUIRED" if not req.has_foreign_filing_license and days_since_priority < 42 else "RECOMMENDED",
        ),
        ActionPlanStep(
            step_number=2,
            title="Secure NBA Form III Approval for Biological Resources",
            description="If utilizing Indian flora (e.g., Curcuma longa, Withania somnifera), file Form III on NBA ABS portal to ensure ABS compliance.",
            authority_or_portal="National Biodiversity Authority (absefiling.nic.in)",
            statutory_basis="Biological Diversity Act 2002 Section 6",
            urgency="REQUIRED" if has_bio and not req.has_nba_approval else "OPTIONAL",
        ),
        ActionPlanStep(
            step_number=3,
            title="File PCT International Application before Month 12",
            description=f"Submit Form PCT/RO/101 via ePCT designating CGPDTM as Receiving Office prior to the strict 12-month deadline ({d12.strftime('%Y-%m-%d')}).",
            authority_or_portal="WIPO ePCT Portal (pct.wipo.int)",
            statutory_basis="Patent Cooperation Treaty Article 8",
            urgency="REQUIRED" if pct_deadline.days_remaining <= 60 else "RECOMMENDED",
        ),
        ActionPlanStep(
            step_number=4,
            title="Draft Synergistic Technical Evidence for US & EPO",
            description="Restructure claims from broad herbal extracts into standardized pharmaceutical compositions with demonstrated bioavailability enhancement.",
            authority_or_portal="USPTO Patent Center & MyEPO Portfolio",
            statutory_basis="35 U.S.C. 103 & EPC Article 56",
            urgency="RECOMMENDED",
        ),
        ActionPlanStep(
            step_number=5,
            title="Enter National Phases at Month 30 (US) & Month 31 (Europe)",
            description=f"Instruct local US and European patent attorneys to enter national stage before {d30.strftime('%Y-%m-%d')} (US) and {d31.strftime('%Y-%m-%d')} (EPO).",
            authority_or_portal="USPTO & European Patent Office",
            statutory_basis="35 U.S.C. 371 & Rule 159 EPC",
            urgency="OPTIONAL",
        ),
    ]

    # ── 7. Evidence Citations ───────────────────────────────────────────────
    evidence = [
        CitedPassage(
            passage_text="Section 39(1) of Indian Patents Act 1970: No person resident in India shall make any application outside India for the grant of a patent for an invention unless an application for a patent for the same invention has been made in India not less than six weeks before the application outside India, or the written permission of the Controller has been obtained.",
            source_title="Indian Patents Act, 1970 (Section 39 - Residents not to apply for patents outside India)",
            source_url="https://ipindia.gov.in",
            section="Section 39: Residents not to apply for patents outside India without prior permission",
            page_number=39,
            domain="patents",
            jurisdiction="IN",
            relevance_score=0.98,
        ),
        CitedPassage(
            passage_text="PCT Article 8(1): The international application may contain a declaration claiming the priority of one or more earlier applications filed in or for any country party to the Paris Convention for the Protection of Industrial Property. The priority period is 12 months from the date of filing of the earliest application.",
            source_title="Patent Cooperation Treaty (PCT Articles 8 & 33)",
            source_url="https://www.wipo.int/pct/en/",
            section="PCT Article 8: Claiming Priority",
            page_number=8,
            domain="patents",
            jurisdiction="WO",
            relevance_score=0.96,
        ),
        CitedPassage(
            passage_text="Biological Diversity Act, 2002 Section 6(1): No person shall apply for any intellectual property right, by whatever name called, in or outside India for any invention based on any research or information on a biological resource obtained from India without obtaining the previous approval of the National Biodiversity Authority.",
            source_title="Biological Diversity Act, 2002 (Section 6 - Application for IPRs)",
            source_url="https://nbaindia.org",
            section="Section 6: Application for intellectual property rights",
            page_number=6,
            domain="biodiversity",
            jurisdiction="IN",
            relevance_score=0.95,
        ),
    ]

    overall_status = "Ready for International Filing" if readiness_score >= 80 else ("Action Required before Filing" if readiness_score >= 50 else "Critical Statutory Bars Detected")

    return IndianToInternationalResponse(
        indian_application_number=req.indian_application_number,
        title=req.title,
        priority_date=req.priority_date,
        transition_readiness_score=readiness_score,
        overall_status=overall_status,
        deadlines=deadlines,
        clearances=clearances,
        roadmaps=roadmaps,
        estimated_fees=estimated_fees,
        required_documents=required_docs,
        action_plan=action_plan,
        evidence=evidence,
    )
