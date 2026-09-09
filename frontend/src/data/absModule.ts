import { ABSAssessment } from "./types";

export function evaluateABS(product: {
  usesIndianBioResource: boolean;
  commercialUtilization: boolean;
  foreignParticipation: boolean;
  geographicOrigin?: string;
}): ABSAssessment {
  const isRelevant = product.usesIndianBioResource;

  if (!isRelevant) {
    return {
      relevance: "LOW",
      biologicalResourceUsed: false,
      indianOriginResource: false,
      foreignParticipation: false,
      commercialUtilization: product.commercialUtilization,
      potentialObligation: "No Indian biological resources identified in current formulation.",
      statuteRef: "Biological Diversity Act, 2002",
      authority: "National Biodiversity Authority (NBA)",
      formRequired: "None",
      missingInformation: [],
      recommendedNextStep: "Proceed with standard regulatory filings.",
      isConfirmedObligation: false
    };
  }

  return {
    relevance: "HIGH",
    biologicalResourceUsed: true,
    indianOriginResource: true,
    foreignParticipation: product.foreignParticipation,
    commercialUtilization: product.commercialUtilization,
    potentialObligation: "Potential obligation to obtain prior statutory approval (Form III) from the National Biodiversity Authority before patent grant, and to intimate the State Biodiversity Board (SBB) for commercial utilization.",
    statuteRef: "Biological Diversity Act, 2002 Section 6(1) & Section 7",
    authority: "National Biodiversity Authority (NBA), Chennai & State Biodiversity Board",
    formRequired: "Form III (Approval for applying for IPR) & SBB Intimation",
    missingInformation: [
      "Exact geographical harvest district in India (required for NBA source disclosure).",
      "Agreement terms with local Biodiversity Management Committees (BMCs) if direct commercial wild collection occurs."
    ],
    recommendedNextStep: "File Form III with the National Biodiversity Authority immediately upon filing complete patent specification.",
    isConfirmedObligation: false
  };
}
