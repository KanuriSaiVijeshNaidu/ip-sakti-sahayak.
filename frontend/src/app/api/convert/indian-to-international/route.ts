import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const appNum = body.indian_application_number || "202411000000";
    const priorityDate = body.priority_date || new Date().toISOString().split("T")[0];

    const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL;
    if (backendUrl && backendUrl.startsWith("http") && !backendUrl.includes("localhost")) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 3500);
        const res = await fetch(`${backendUrl}/convert/indian-to-international`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
          signal: controller.signal,
        });
        clearTimeout(timeout);
        if (res.ok) return NextResponse.json(await res.json());
      } catch {}
    }

    const pDate = new Date(priorityDate);
    const m12 = new Date(pDate);
    m12.setMonth(m12.getMonth() + 12);
    const m30 = new Date(pDate);
    m30.setMonth(m30.getMonth() + 30);

    const response = {
      indian_application_number: appNum,
      priority_date: priorityDate,
      pct_deadline_12m: m12.toISOString().split("T")[0],
      national_phase_deadline_30m: m30.toISOString().split("T")[0],
      section_39_ffl_required: true,
      section_39_ffl_status: "Required under Section 39 of The Patents Act, 1970 unless 6 weeks have lapsed post Indian filing without objection.",
      nba_clearance_required: true,
      nba_clearance_status: "Mandatory approval (Form III) required under Section 6 of the Biological Diversity Act, 2002 before commercial grant.",
      target_jurisdiction_protocols: [
        {
          target_office: "WIPO PCT (International Phase)",
          filing_deadline: m12.toISOString().split("T")[0],
          forms_required: ["PCT/RO/101 (Request)", "Form 1 (Indian Priority Claim)", "Power of Attorney"],
          estimated_official_fee: "₹1,25,000 - ₹1,65,000",
          strategic_guidance: "Filing PCT application preserves worldwide priority across 157 member states and grants 30 months for commercial assessment.",
        },
        {
          target_office: "USPTO (United States)",
          filing_deadline: m30.toISOString().split("T")[0],
          forms_required: ["PTO/SB/01 (Declaration)", "ADS (Application Data Sheet)", "IDS (Information Disclosure Statement)"],
          estimated_official_fee: "USD $1,820 (Large) / $728 (Small) / $364 (Micro)",
          strategic_guidance: "Disclose Indian TKDL references in IDS to prevent inequitable conduct allegations; format claims to overcome 35 U.S.C. 101 natural products bar.",
        },
        {
          target_office: "EPO (European Union)",
          filing_deadline: m30.toISOString().split("T")[0],
          forms_required: ["Form 1001 (Request for Grant)", "Designation of Inventor", "Priority Document"],
          estimated_official_fee: "€2,500 - €3,400",
          strategic_guidance: "Draft second medical use claims under EPC Article 54(5); satisfy inventive step via Problem-Solution approach comparative bioassays.",
        },
      ],
      compliance_checklist: [
        {
          task: "Obtain Foreign Filing License (FFL) under Section 39 or verify 6-week lapse",
          completed: false,
          statute: "Patents Act 1970, Section 39",
        },
        {
          task: "File NBA Form III for approval to apply for intellectual property outside India",
          completed: false,
          statute: "Biological Diversity Act 2002, Section 6",
        },
        {
          task: "Submit certified priority document (Form 1 transcript) to WIPO International Bureau",
          completed: false,
          statute: "PCT Rule 17.1",
        },
      ],
    };

    return NextResponse.json(response);
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to transition Indian IP to International filings." },
      { status: 500 }
    );
  }
}
