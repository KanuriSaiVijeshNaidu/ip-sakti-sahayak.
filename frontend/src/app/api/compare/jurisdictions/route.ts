import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const title = body.invention_title || "Herbal Formulation";

    const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL;
    if (backendUrl && backendUrl.startsWith("http") && !backendUrl.includes("localhost")) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 3500);
        const res = await fetch(`${backendUrl}/compare/jurisdictions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
          signal: controller.signal,
        });
        clearTimeout(timeout);
        if (res.ok) return NextResponse.json(await res.json());
      } catch {}
    }

    const response = {
      invention_title: title,
      jurisdictions: ["IN", "US", "EP", "WIPO"],
      comparisons: [
        {
          jurisdiction: "IN",
          jurisdiction_name: "India (CGPDTM / AYUSH)",
          patentability_bar: "Section 3(e) (Synergy required) & Section 3(p) (TK bar)",
          novelty_standard: "Absolute Novelty; TKDL checked automatically",
          biological_resource_mandate: "Mandatory Form III approval from National Biodiversity Authority",
          recommended_filing_path: "Provisional (Form 1) -> Complete with bioassay synergy data",
          risk_summary: "High risk under Sec 3(p) unless synergistic technical effect is demonstrated.",
        },
        {
          jurisdiction: "US",
          jurisdiction_name: "United States (USPTO / FDA)",
          patentability_bar: "35 U.S.C. § 101 (Alice/Mayo natural products doctrine)",
          novelty_standard: "35 U.S.C. § 102 prior art; TKDL cited by USPTO examiners",
          biological_resource_mandate: "No domestic ABS requirement; DSHEA FDA compliance for sales",
          recommended_filing_path: "US Provisional -> Non-Provisional with marked structural differences",
          risk_summary: "Medium risk under § 101 natural products exception unless markedly different.",
        },
        {
          jurisdiction: "EP",
          jurisdiction_name: "European Patent Office (EPO)",
          patentability_bar: "EPC Article 52(4) & Article 53(c) therapy methods exclusion",
          novelty_standard: "EPC Article 54(5) second medical use allowable for botanical extracts",
          biological_resource_mandate: "EU ABS Regulation (Regulation (EU) No 511/2014) Nagoya Protocol",
          recommended_filing_path: "EPO direct filing or Euro-PCT entry with Problem-Solution data",
          risk_summary: "Second medical use allowed under EPC Art 54(5); inventive step requires comparative data.",
        },
        {
          jurisdiction: "WIPO",
          jurisdiction_name: "International PCT (WIPO)",
          patentability_bar: "PCT Article 33 international preliminary examination standards",
          novelty_standard: "Global prior art searching (ISA/IPEA Written Opinion)",
          biological_resource_mandate: "WIPO Treaty on Intellectual Property & Genetic Resources (2024 mandatory disclosure)",
          recommended_filing_path: "PCT International Application claiming 12-month Paris Convention priority",
          risk_summary: "Provides 30-month deferral across 157 member states; mandatory genetic origin disclosure.",
        },
      ],
      cross_jurisdiction_recommendations: [
        "Obtain Indian Foreign Filing License (FFL) under Section 39 before direct international filing.",
        "Establish quantitative synergy (CI < 1.0) to satisfy both CGPDTM Sec 3(e) and EPO Problem-Solution approach.",
        "Ensure compliance with the 2024 WIPO Genetic Resources Treaty disclosure requirements.",
      ],
    };

    return NextResponse.json(response);
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to compare jurisdictions." },
      { status: 500 }
    );
  }
}
