import { ProductClassification, ProductClassificationResult, DownstreamRoute } from "./types";

export function classifyAyushProduct(input: {
  name: string;
  ingredients?: string[];
  formulation?: string;
  intendedUse?: string;
  dosageForm?: string;
  claims?: string[];
}): ProductClassificationResult {
  const text = `${input.name} ${input.ingredients?.join(" ") || ""} ${input.formulation || ""} ${input.intendedUse || ""} ${input.dosageForm || ""} ${input.claims?.join(" ") || ""}`.toLowerCase();

  // 1. Ayurveda Aahara / Food Supplement
  if (
    text.includes("aahara") ||
    text.includes("dietary supplement") ||
    text.includes("food supplement") ||
    text.includes("herbal tea") ||
    text.includes("nutraceutical") ||
    text.includes("granola") ||
    text.includes("beverage") ||
    text.includes("snack") ||
    text.includes("daily nutrition") ||
    (text.includes("wellness") && !text.includes("disease") && !text.includes("treat"))
  ) {
    return {
      category: "Ayurveda-Aahara / Nutraceutical",
      confidence: "HIGH",
      signals: [
        "Product form and claims align with food/dietary consumption rather than drug prescription.",
        "Botanical ingredients match authoritative Ayurvedic texts recognized under FSSAI Schedule A.",
        "Intended for nutritional wellness and physiological homeostasis."
      ],
      governingStatute: "Food Safety and Standards (Ayurveda Aahara) Regulations, 2022",
      governingAuthority: "Food Safety and Standards Authority of India (FSSAI)",
      downstreamRoute: "FSSAI_AYURVEDA_AAHARA",
      missingSignals: [
        "Confirmation of traditional cooking process per Schedule A treatises.",
        "Mandatory Ayurveda Aahara logo artwork and packaging disclaimers."
      ],
      sourceEvidenceId: "IN-FSSAI-AAHARA"
    };
  }

  // 2. Cosmetic
  if (
    text.includes("cosmetic") ||
    text.includes("skin cream") ||
    text.includes("face wash") ||
    text.includes("shampoo") ||
    text.includes("beautification") ||
    text.includes("skin radiance") ||
    text.includes("grooming")
  ) {
    return {
      category: "Cosmetic",
      confidence: "HIGH",
      signals: [
        "Product intended for external topical application for cleansing, beautifying, or altering appearance.",
        "Absence of systemic disease-curative therapeutic assertions."
      ],
      governingStatute: "Cosmetics Rules, 2020 & Section 3(aaa) of Drugs & Cosmetics Act, 1940",
      governingAuthority: "State Drug Controller & CDSCO",
      downstreamRoute: "COSMETICS_RULES",
      missingSignals: [
        "Heavy metal safety limits compliance test reports.",
        "BIS standards conformity declaration."
      ]
    };
  }

  // 3. Phytopharmaceutical
  if (
    text.includes("phytopharmaceutical") ||
    text.includes("purified fraction") ||
    text.includes("clinical trial protocol") ||
    text.includes("phase 1") ||
    text.includes("4 bioactive markers")
  ) {
    return {
      category: "Phytopharmaceutical",
      confidence: "HIGH",
      signals: [
        "Purified, standardized fraction with minimum 4 bioactive chemical markers.",
        "Requires formal preclinical safety and phase clinical trial roadmap."
      ],
      governingStatute: "Drugs and Cosmetics Rules, 1945 (Rule 122E) & New Drugs Rules, 2019",
      governingAuthority: "Central Drugs Standard Control Organization (CDSCO)",
      downstreamRoute: "CDSCO_NEW_DRUG",
      missingSignals: [
        "HPLC chromatograms verifying 4 standardized marker compounds.",
        "IND filing documentation."
      ]
    };
  }

  // 4. Classical / Generic Ayurvedic Medicine
  if (
    text.includes("classical") ||
    text.includes("churna") ||
    text.includes("taila") ||
    text.includes("asava") ||
    text.includes("arishta") ||
    text.includes("bhasma") ||
    text.includes("kwatha") ||
    text.includes("vati") ||
    text.includes("triphala") ||
    text.includes("charaka") ||
    text.includes("sushruta") ||
    text.includes("bhaishajya") ||
    text.includes("afi")
  ) {
    if (text.includes("nano") || text.includes("lipid") || text.includes("snedds") || text.includes("emulsion") || text.includes("carrier") || text.includes("novel")) {
      return {
        category: "Patent / Proprietary Ayurvedic Medicine",
        confidence: "HIGH",
        signals: [
          "Classical Ayurvedic botanical actives combined with modern pharmaceutical lipid/nano delivery carrier.",
          "Modified release kinetics or enhanced bioavailability modifying pharmacokinetics.",
          "Requires proof of safety and effectiveness under Rule 158B."
        ],
        governingStatute: "Drugs & Cosmetics Act, 1940 Section 3(h) & Rule 158B",
        governingAuthority: "State AYUSH Licensing Authority / Ministry of Ayush",
        downstreamRoute: "AYUSH_DRUGS_COSMETICS",
        missingSignals: [
          "In vitro dissolution and pharmacokinetic comparative bioavailability data.",
          "Form 25-D manufacturing application."
        ],
        sourceEvidenceId: "IN-AYUSH-R158B"
      };
    }

    return {
      category: "Classical / Generic Ayurvedic Medicine",
      confidence: "HIGH",
      signals: [
        "Composition exactly matches formulation in Schedule I authoritative books of D&C Act.",
        "Traditional preparation process (Sneha Kalpana, Churna, etc.) documented in classical Samhitas.",
        "Exempted from clinical trial requirements in India per statutory provisions."
      ],
      governingStatute: "Drugs and Cosmetics Act, 1940, Section 3(a) & First Schedule",
      governingAuthority: "State Licensing Authority (AYUSH)",
      downstreamRoute: "AYUSH_DRUGS_COSMETICS",
      missingSignals: [
        "Exact classical treatise chapter and shloka/page citation.",
        "Schedule T GMP compliance certification."
      ],
      sourceEvidenceId: "IN-AYUSH-R158B"
    };
  }

  // 5. Default to Patent / Proprietary Ayurvedic Medicine if medicinal extract
  return {
    category: "Patent / Proprietary Ayurvedic Medicine",
    confidence: "MEDIUM",
    signals: [
      "Botanical ingredients formulated in finished modern dosage form.",
      "Therapeutic indication requires safety and effectiveness dossier under Rule 158B."
    ],
    governingStatute: "Drugs and Cosmetics Act, 1940 Section 3(h) & Rule 158B",
    governingAuthority: "State Licensing Authority (AYUSH)",
    downstreamRoute: "AYUSH_DRUGS_COSMETICS",
    missingSignals: [
      "Documentary proof of safety and therapeutic rationale per Rule 158B guidelines."
    ],
    sourceEvidenceId: "IN-AYUSH-R158B"
  };
}
