import { ClaimsRiskCheck, QualitativeRisk } from "./types";

export function checkClaimsAndAdvertising(claims: string[]): ClaimsRiskCheck[] {
  return claims.map((claim) => {
    const text = claim.toLowerCase();

    if (text.includes("cure") || text.includes("treat cancer") || text.includes("reverses diabetes") || text.includes("cures arthritis") || text.includes("100% effective against infection")) {
      return {
        claimText: claim,
        riskLevel: "HIGH" as QualitativeRisk,
        violationType: "Disease Treatment / Cure Claim",
        governingStatute: "Drugs and Magic Remedies (Objectionable Advertisements) Act, 1954 & D&C Rule 106",
        saferWording: "Supports musculoskeletal mobility and joint comfort within normal physiological range."
      };
    }

    if (text.includes("instant relief") || text.includes("miracle") || text.includes("guaranteed results in 2 days") || text.includes("permanent cure")) {
      return {
        claimText: claim,
        riskLevel: "HIGH" as QualitativeRisk,
        violationType: "Exaggerated Efficacy",
        governingStatute: "Consumer Protection Act, 2019 (Misleading Advertisements) & ASCI Guidelines",
        saferWording: "Formulated with standardized herbal extracts traditionally recognized to aid daily vitality."
      };
    }

    return {
      claimText: claim,
      riskLevel: "LOW" as QualitativeRisk,
      violationType: "Compliant Structure-Function",
      governingStatute: "FSSAI Regulations 2022 / AYUSH Labeling Guidelines",
      saferWording: claim
    };
  });
}
