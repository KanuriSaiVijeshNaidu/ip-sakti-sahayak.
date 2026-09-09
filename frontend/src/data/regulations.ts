import { RegulatoryChecklistItem } from "./types";

export const DEFAULT_REGULATORY_CHECKLIST: RegulatoryChecklistItem[] = [
  {
    id: "reg-classification",
    area: "Product Classification",
    label: "Ayurvedic Medicine vs. Ayurveda Aahara",
    status: "review_required",
    reason: "Polyherbal composition qualifies either as Ayurvedic Proprietary Medicine (D&C Act Form 25-D) or Ayurveda Aahara food (FSSAI 2022). Depends on claimed therapeutic vs wellness intent.",
    requiredDocument: "Clinical / Traditional justification dossier or Form 25-D application",
    sourceStatute: "Drugs & Cosmetics Act 1940 Rule 158B / FSSAI Regulations 2022",
    jurisdiction: "IN",
    nextAction: "Select either AYUSH State Drug License route or FSSAI Central Ayurveda Aahara license."
  },
  {
    id: "reg-ingredient",
    area: "Ingredient Compliance",
    label: "Schedule E(1) & Herbal Safety Verification",
    status: "compliant",
    reason: "None of the active botanical ingredients belong to Schedule E(1) (list of poisonous herbs requiring medical supervision under D&C Act).",
    requiredDocument: "Pharmacopoeial Identity & Purity Certificate (API Part I)",
    sourceStatute: "Drugs & Cosmetics Rules 1945, Schedule E(1)",
    jurisdiction: "IN",
    nextAction: "Maintain batch testing records for heavy metals (Lead, Arsenic, Cadmium, Mercury)."
  },
  {
    id: "reg-manufacturing",
    area: "Manufacturing Standards",
    label: "Schedule T Good Manufacturing Practices (GMP)",
    status: "review_required",
    reason: "Manufacturing facility must possess valid AYUSH Schedule T GMP certification with certified HVAC, extraction, and clean room facilities.",
    requiredDocument: "Schedule T GMP Certificate from State Licensing Authority",
    sourceStatute: "Drugs & Cosmetics Rules 1945, Schedule T",
    jurisdiction: "IN",
    nextAction: "Audit contract manufacturing partner or captive facility for Schedule T compliance."
  },
  {
    id: "reg-labeling",
    area: "Labeling & Disclaimers",
    label: "Mandatory Disclaimers & Cautionary Notice",
    status: "action_needed",
    reason: "Labels must display Ayurvedic license number, batch details, manufacturing date, and statutory disclaimer against self-medication.",
    requiredDocument: "Draft Pack Label & Artwork Approval Copy",
    sourceStatute: "D&C Rules 1945 Rule 161 & FSSAI Packaging Regulations",
    jurisdiction: "IN",
    nextAction: "Include required 'Ayurvedic Proprietary Medicine' wording and recommended dosage on outer carton."
  },
  {
    id: "reg-biodiversity",
    area: "Biological Resource Clearance",
    label: "NBA Form III Clearance for Commercialization",
    status: "action_needed",
    reason: "Commercial use of biological resources obtained from India requires intimation to State Biodiversity Board (SBB) or NBA approval.",
    requiredDocument: "Form III Application Acknowledgement / SBB Intimation Copy",
    sourceStatute: "Biological Diversity Act 2002 Section 6 & 7",
    jurisdiction: "IN",
    nextAction: "File Form III with National Biodiversity Authority, Chennai prior to commercial patent grant."
  },
  {
    id: "reg-safety",
    area: "Safety & Quality Dossier",
    label: "Heavy Metals, Pesticide Residues & Microbial Limits",
    status: "compliant",
    reason: "Safety profile requires batch-wise compliance with limits established in Ayurvedic Pharmacopoeia of India (API).",
    requiredDocument: "Certificate of Analysis (CoA) with NABL-accredited laboratory test reports",
    sourceStatute: "Gazette Notification GSR 904(E) Quality Parameters",
    jurisdiction: "IN",
    nextAction: "Obtain NABL test reports for lead (<10 ppm), arsenic (<3 ppm), and aflatoxins."
  }
];
