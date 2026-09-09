import { MultiIPRegime } from "./types";

export function evaluateMultiIPStrategy(product: {
  name: string;
  category: string;
  hasNovelProcess: boolean;
  hasSynergy: boolean;
  isClassicalFormula: boolean;
  usesIndianBioResource: boolean;
  brandName?: string;
  novelPackaging?: boolean;
}): MultiIPRegime[] {
  return [
    {
      id: "ip-patent",
      regime: "Patent",
      relevant: product.hasNovelProcess || product.hasSynergy,
      risk: product.isClassicalFormula ? "HIGH" : "MEDIUM",
      why: product.isClassicalFormula 
        ? "Raw herbal compositions face statutory objections under Section 3(p) TKDL and Section 3(e) admixture bars unless technical synergy is demonstrated."
        : "Novel delivery system and specialized extraction parameters provide strong patentable subject matter.",
      whatToProtect: product.hasNovelProcess 
        ? "Process claims on extraction method, temperature curves, and nanoparticle dispersion."
        : "Composition claims with demonstrable synergistic efficacy index (< 1.0).",
      recommendedAction: "Draft complete specification emphasizing non-obvious technical synergy and specific sub-micron particle distributions.",
      governingAuthority: "Indian Patent Office (Controller General of Patents, Designs & Trade Marks)",
      statuteRef: "Indian Patents Act, 1970 § 3(e) & § 3(p)"
    },
    {
      id: "ip-trademark",
      regime: "Trademark",
      relevant: true,
      risk: "LOW",
      why: "Brand names and distinctive product identifiers provide renewable, long-term commercial exclusivity independent of patent terms.",
      whatToProtect: `Distinctive proprietary brand identity for "${product.name}".`,
      recommendedAction: "Conduct clearance search on IP India Trade Marks Public Search in Class 5 (Pharmaceuticals) and Class 30 (Dietary Foods).",
      governingAuthority: "Trade Marks Registry, IP India",
      statuteRef: "Trade Marks Act, 1999"
    },
    {
      id: "ip-trade-secret",
      regime: "Trade Secret",
      relevant: true,
      risk: "LOW",
      why: "Confidential manufacturing parameters, extraction solvent recovery ratios, and supplier networks can be protected perpetually without public disclosure.",
      whatToProtect: "Critical processing variables: homogenization pressure, inert gas temperature, and proprietary blend timing.",
      recommendedAction: "Execute Non-Disclosure Agreements (NDAs) with manufacturing personnel and establish role-based digital access controls.",
      governingAuthority: "Common Law Breach of Confidence & Contract Act, 1872",
      statuteRef: "Indian Contract Act, 1872 Section 27"
    },
    {
      id: "ip-design",
      regime: "Industrial Design",
      relevant: !!product.novelPackaging,
      risk: product.novelPackaging ? "LOW" : "UNKNOWN",
      why: "Aesthetic shapes of packaging, specialized applicator caps, roll-on dispensers, and bottles prevent competitor copycats.",
      whatToProtect: "Novel three-dimensional shape, surface ornamentation, and ergonomic container geometry.",
      recommendedAction: "File Design Application before publishing packaging images or commercial product distribution.",
      governingAuthority: "Designs Office, IP India, Kolkata",
      statuteRef: "Designs Act, 2000"
    },
    {
      id: "ip-copyright",
      regime: "Copyright",
      relevant: true,
      risk: "LOW",
      why: "Protects original pack artwork, promotional brochures, user instructional leaflets, and technical clinical documentation.",
      whatToProtect: "Artistic packaging artwork, label layout graphics, and patient dosage guide literature.",
      recommendedAction: "Obtain Form IV clearance from Trade Marks Registry before registering artistic work used in commercial trade.",
      governingAuthority: "Copyright Office, DPIIT",
      statuteRef: "Copyright Act, 1957 Section 45"
    },
    {
      id: "ip-abs",
      regime: "Biological Resource / ABS",
      relevant: product.usesIndianBioResource,
      risk: product.usesIndianBioResource ? "HIGH" : "LOW",
      why: "Mandatory statutory checkpoint under Biological Diversity Act 2002 before filing for intellectual property protection based on Indian bio-resources.",
      whatToProtect: "Statutory freedom-to-operate and legal protection against retrospective revocation of patent grants.",
      recommendedAction: "File Form III with the National Biodiversity Authority (NBA), Chennai before patent examination or grant.",
      governingAuthority: "National Biodiversity Authority (NBA), Chennai",
      statuteRef: "Biological Diversity Act, 2002 Section 6(1)"
    },
    {
      id: "ip-tk",
      regime: "Traditional Knowledge Safeguards",
      relevant: product.isClassicalFormula,
      risk: "HIGH",
      why: "Avoids frivolous patent disputes and costly litigation by defensive prior-art citation of classical Samhita verses.",
      whatToProtect: "Freedom-to-practice classical Ayurvedic heritage while claiming solely distinct technological inventions.",
      recommendedAction: "Cite relevant Charaka/Sushruta/AFI references voluntarily in the patent background to establish transparency.",
      governingAuthority: "CSIR-TKDL Directorate & Indian Patent Office",
      statuteRef: "Guidelines for Patent Applications in Traditional Knowledge & Biological Materials"
    }
  ];
}
