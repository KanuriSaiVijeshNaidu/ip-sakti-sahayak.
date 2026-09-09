import { AssessmentRule } from "./types";
import { DEMO_EVIDENCE } from "./demoEvidence";

export const ASSESSMENT_RULES: AssessmentRule[] = [
  {
    id: "RULE-SEC-3E",
    name: "Section 3(e) Synergistic Non-Admixture Screening",
    jurisdiction: "IN",
    category: "patentability",
    description: "Evaluates whether a polyherbal formulation exhibits true technological or therapeutic synergy rather than mere additive aggregation.",
    applicability: "Triggered whenever two or more active herbal components are combined.",
    severity: "high",
    source: DEMO_EVIDENCE[0],
    recommendation: "Provide quantitative experimental data (e.g. isobologram, combination index < 1.0, or comparative pharmacokinetic area-under-the-curve) demonstrating superior bioactivity compared to the sum of individual components."
  },
  {
    id: "RULE-SEC-3P",
    name: "Section 3(p) Traditional Knowledge Prior-Art Screening",
    jurisdiction: "IN",
    category: "traditional_knowledge",
    description: "Evaluates whether the claimed therapeutic use or formulation is already codified in classical Ayurvedic treatises or CSIR-TKDL.",
    applicability: "Triggered when active herbs are documented in authoritative Ayurvedic Samhitas (Charaka, Sushruta, AFI).",
    severity: "high",
    source: DEMO_EVIDENCE[1],
    recommendation: "Shift claims from broad herbal composition to specific novel delivery mechanisms, specialized extraction fractions, or targeted chemical markers."
  },
  {
    id: "RULE-SEC-10",
    name: "Section 10(4) Biological Resource Origin Disclosure",
    jurisdiction: "IN",
    category: "biodiversity",
    description: "Mandatory disclosure of geographical origin and taxonomic identification of biological ingredients in the patent specification.",
    applicability: "Applies to all patent applications utilizing Indian biological resources.",
    severity: "medium",
    source: DEMO_EVIDENCE[2],
    recommendation: "Specify complete botanical binomial nomenclature, authority, family, plant part utilized, and geographical procurement district in complete specification."
  },
  {
    id: "RULE-NBA-SEC6",
    name: "Biological Diversity Act Section 6 Commercial IP Clearance",
    jurisdiction: "IN",
    category: "biodiversity",
    description: "Requires prior permission of the National Biodiversity Authority before seeking any IPR on an invention derived from Indian biological resources.",
    applicability: "Mandatory statutory checkpoint for Indian and foreign patent applications originating from Indian biodiversity.",
    severity: "high",
    source: DEMO_EVIDENCE[3],
    recommendation: "File Form III with the National Biodiversity Authority (NBA) immediately upon submitting provisional patent application."
  }
];
