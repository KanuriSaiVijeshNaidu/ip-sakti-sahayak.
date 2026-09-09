import { DemoScenario } from "./types";
import { DEMO_EVIDENCE } from "./demoEvidence";
import { DEFAULT_REGULATORY_CHECKLIST } from "./regulations";

export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: "ashwagandha-nano",
    name: "Ashwagandha Phospholipid Nano-Emulsion Formulation",
    shortTag: "Ashwagandha Nano-Emulsion",
    category: "Neuro-Cognitive & Nootropic",
    shortDesc: "Standardized Withanolide nano-encapsulation designed for enhanced blood-brain barrier permeability and 4.2x higher bioavailability over standard root powder.",
    ingredients: [
      "Withania somnifera (Ashwagandha root extract, 5% total withanolides)",
      "Phosphatidylcholine (Soy lecithin lipid carrier matrix)",
      "Medium Chain Triglycerides (MCT lipid core)",
      "Classical Ayurvedic adjuvant: Piper longum (Pippali, 0.5%)"
    ],
    formulation: "Self-nanoemulsifying drug delivery system (SNEDDS) encapsulated in vegetarian softgels.",
    technicalNovelty: "Sub-100nm lipid encapsulation preventing gastrointestinal degradation of withanolide aglycones, verified by comparative pharmacokinetic AUC in vivo.",
    manufacturingProcess: "High-pressure homogenization at 1200 bar followed by ultrasonic dispersion in an inert nitrogen environment.",
    intendedUse: "Cognitive performance, adaptogenic stress resilience, and neuroprotection.",
    applicantType: "AYUSH Biotech Startup",
    targetJurisdiction: "IN",
    overview: {
      patentability: "MEDIUM",
      traditionalKnowledge: "HIGH",
      regulatory: "MEDIUM",
      marketEntry: "LOW",
      documentation: "MEDIUM",
      filingReadinessScore: 78
    },
    traceSteps: [
      {
        stageNumber: 1,
        stageName: "Product Information Understood",
        status: "completed",
        summary: "Parsed botanical active Withania somnifera and novel lipid encapsulation carrier.",
        details: "Identified combination of standard Ayurvedic root extract with advanced lipid nanotechnology formulation."
      },
      {
        stageNumber: 2,
        stageName: "Jurisdiction Identified: India",
        status: "completed",
        summary: "Primary statutory framework set to Indian Patents Act 1970 and Ministry of Ayush regulations.",
        details: "Applicable legal authorities: Indian Patent Office (CGPDTM), State Licensing Authority (AYUSH), and National Biodiversity Authority (NBA)."
      },
      {
        stageNumber: 3,
        stageName: "Ingredients & Botanical Formulations Extracted",
        status: "completed",
        summary: "Extracted 2 active herbal components: Ashwagandha root and Pippali fruit.",
        details: "Standardized to withanolides (5%) and piperine (0.5%). Biological resources confirmed originating from Madhya Pradesh, India."
      },
      {
        stageNumber: 4,
        stageName: "Patentability Rules Evaluated (§ 3e & § 3p)",
        status: "warning",
        summary: "Section 3(p) TKDL objection likely for raw composition; Section 3(e) requires synergy proof for lipid carrier.",
        details: "Patent strategy recommendation: Claim the specific nano-droplet size distribution (<100nm) and pharmacokinetic enhancement mechanism rather than the herb per se.",
        statuteRef: "Indian Patents Act § 3(e) & § 3(p)",
        evidenceId: "IN-PAT-SEC3E"
      },
      {
        stageNumber: 5,
        stageName: "Traditional Knowledge Overlap Screened",
        status: "flagged",
        summary: "Potential traditional-knowledge overlap verified in classical Ayurvedic texts.",
        details: "Withania somnifera is codified in Charaka Samhita (Sutrasthana Ch. 4), Sushruta Samhita, and Ayurvedic Pharmacopoeia of India (Part I, Vol 1, p. 19) as a Rasayana/Balya tonic.",
        statuteRef: "CSIR-TKDL & AFI Reference Records",
        evidenceId: "IN-PAT-SEC3P"
      },
      {
        stageNumber: 6,
        stageName: "Regulatory Requirements Mapped",
        status: "completed",
        summary: "Classified as Ayurvedic Proprietary Medicine under D&C Act Rule 158B.",
        details: "Eligible for Form 25-D manufacturing license. Requires Schedule T GMP compliance and heavy metal batch testing under Gazette GSR 904(E).",
        statuteRef: "Drugs & Cosmetics Rules 1945 Rule 158B",
        evidenceId: "IN-AYUSH-R158B"
      },
      {
        stageNumber: 7,
        stageName: "Statutory Evidence Retrieved & Grounded",
        status: "completed",
        summary: "Retrieved 4 authoritative statutory provisions and 2 regulatory gazettes.",
        details: "Linked to IP India Manual of Patent Practice and Procedures, BDA Section 6 guidelines, and Rule 158B dossiers."
      },
      {
        stageNumber: 8,
        stageName: "Risk Calculation & Action Plan Generated",
        status: "completed",
        summary: "Filing Readiness calculated at 78% with 3 key mitigations outlined.",
        details: "Prepared sequential action plan prioritizing Form III NBA clearance and comparative bioavailability data."
      }
    ],
    regulatoryChecklist: DEFAULT_REGULATORY_CHECKLIST,
    topRisks: [
      {
        id: "risk-1",
        risk: "Section 3(p) Objection: Traditional Knowledge Bar",
        severity: "HIGH",
        category: "Patentability",
        mitigation: "Frame patent claims strictly around the novel lipid-encapsulation method, surfactant-to-oil ratio, and pharmacokinetic particle stability."
      },
      {
        id: "risk-2",
        risk: "Biological Diversity Act Section 6 Non-Compliance",
        severity: "HIGH",
        category: "Biodiversity",
        mitigation: "File Form III with the National Biodiversity Authority (NBA) prior to receiving the First Examination Report (FER) from the Patent Office."
      },
      {
        id: "risk-3",
        risk: "Section 3(e) Synergistic Admixture Challenge",
        severity: "MEDIUM",
        category: "Patentability",
        mitigation: "Include in vitro Caco-2 cell permeability data and in vivo pharmacokinetic area-under-the-curve (AUC) graphs demonstrating 4.2x enhancement."
      }
    ],
    actionPlan: [
      {
        priority: 1,
        step: "File Form III with National Biodiversity Authority (NBA)",
        authority: "NBA Chennai",
        deadlineDesc: "Prior to patent grant / within 6 months of filing complete specification",
        category: "Biodiversity Clearance"
      },
      {
        priority: 2,
        step: "Incorporate Comparative Bioavailability Data in Specification",
        authority: "Indian Patent Office (CGPDTM)",
        deadlineDesc: "Must be included in Complete Specification on filing date",
        category: "Patent Drafting"
      },
      {
        priority: 3,
        step: "Apply for Ayurvedic Proprietary Medicine License (Form 25-D)",
        authority: "State AYUSH Licensing Authority",
        deadlineDesc: "3-4 months prior to commercial launch",
        category: "Regulatory Compliance"
      },
      {
        priority: 4,
        step: "Complete Heavy Metal & Microbial Testing under Schedule T",
        authority: "NABL Accredited Testing Lab",
        deadlineDesc: "Required per manufacturing batch",
        category: "Quality Assurance"
      }
    ],
    missingInputs: [
      "Exact phospholipid-to-active withanolide molar ratio",
      "Geographical procurement district in Madhya Pradesh (required for Section 10(4) disclosure)",
      "Stability testing data at 40°C / 75% RH for 6 months"
    ],
    evidence: [
      DEMO_EVIDENCE[0],
      DEMO_EVIDENCE[1],
      DEMO_EVIDENCE[2],
      DEMO_EVIDENCE[3],
      DEMO_EVIDENCE[4]
    ]
  },
  {
    id: "curcumin-piperine",
    name: "Curcumin & Piperine Synergistic Polyherbal Bio-Enhancer",
    shortTag: "Curcumin + Piperine",
    category: "Anti-Inflammatory & Bio-Enhancement",
    shortDesc: "Synergistic polyphenol and alkaloid combination formulated to overcome rapid glucuronidation of curcuminoids in metabolic pathways.",
    ingredients: [
      "Curcuma longa (Curcumin extract, 95% total curcuminoids)",
      "Piper nigrum (Piperine extract, 98% alkaloid)",
      "Zingiber officinale (Ginger rhizome dry extract, 5% gingerols)"
    ],
    formulation: "Dual-granulation sustained release oral tablet with aqueous enteric coating.",
    technicalNovelty: "Admixture claiming 2000% bioavailability improvement through hepatic and intestinal glucuronidation inhibition.",
    manufacturingProcess: "Fluidized bed granulation and dry blending under controlled relative humidity (<40%).",
    intendedUse: "Joint inflammation support, cellular protection, and enhanced antioxidant delivery.",
    applicantType: "Ayurvedic Pharmaceutical Enterprise",
    targetJurisdiction: "IN",
    overview: {
      patentability: "HIGH",
      traditionalKnowledge: "HIGH",
      regulatory: "LOW",
      marketEntry: "LOW",
      documentation: "MEDIUM",
      filingReadinessScore: 62
    },
    traceSteps: [
      {
        stageNumber: 1,
        stageName: "Product Information Understood",
        status: "completed",
        summary: "Extracted classic dual-extract pairing: Curcumin 95% + Piperine 98%.",
        details: "Well known combination with prior art citations in both classical Ayurveda and modern patent databases."
      },
      {
        stageNumber: 2,
        stageName: "Jurisdiction Identified: India",
        status: "completed",
        summary: "Statutory jurisdiction: India (IP India Patents Act 1970).",
        details: "Evaluated under Indian Patent Office Guidelines for Examination of Patent Applications in the Field of Pharmaceuticals."
      },
      {
        stageNumber: 3,
        stageName: "Ingredients & Botanical Formulations Extracted",
        status: "completed",
        summary: "Components: Curcuma longa, Piper nigrum, Zingiber officinale.",
        details: "Direct classical equivalent of 'Haridra' and 'Trikatu' classical formulation."
      },
      {
        stageNumber: 4,
        stageName: "Patentability Rules Evaluated (§ 3e & § 3p)",
        status: "flagged",
        summary: "High statutory rejection risk under Section 3(e) and 3(p).",
        details: "Combination of Curcumin and Piperine is documented extensively in prior art (e.g. Sabinsa US5536506 and Indian Patent office rejections). Mere admixture bar applies directly.",
        statuteRef: "Patents Act Section 3(e) & Section 3(p)",
        evidenceId: "IN-PAT-SEC3E"
      },
      {
        stageNumber: 5,
        stageName: "Traditional Knowledge Overlap Screened",
        status: "flagged",
        summary: "Potential traditional-knowledge overlap verified in Charaka Samhita and Bhavaprakasha.",
        details: "The synergistic co-administration of Haridra with Trikatu (Piper nigrum, Piper longum, Zingiber officinale) is an ancient Ayurvedic principle of 'Yogavahi' (carrier synergy) documented in Charaka Samhita Chikitsasthana.",
        statuteRef: "Charaka Samhita Chikitsasthana & Bhavaprakasha Nighantu",
        evidenceId: "IN-PAT-SEC3P"
      },
      {
        stageNumber: 6,
        stageName: "Regulatory Requirements Mapped",
        status: "completed",
        summary: "FSSAI Ayurveda Aahara route readily accessible.",
        details: "Curcuma longa and Piper nigrum are recognized ingredients under FSSAI Ayurveda Aahara Regulations 2022 Schedule A. Low regulatory hurdle for wellness food.",
        statuteRef: "FSSAI Ayurveda Aahara 2022",
        evidenceId: "IN-FSSAI-AAHARA"
      },
      {
        stageNumber: 7,
        stageName: "Statutory Evidence Retrieved & Grounded",
        status: "completed",
        summary: "Retrieved Section 3(e) legal precedence and FSSAI schedules.",
        details: "Found Controller General examination guidelines on synergistic bioenhancers."
      },
      {
        stageNumber: 8,
        stageName: "Risk Calculation & Action Plan Generated",
        status: "completed",
        summary: "Overall patent risk HIGH; commercial wellness market entry LOW risk.",
        details: "Recommended pivoting IP strategy to proprietary manufacturing extraction or trademark brand protection."
      }
    ],
    regulatoryChecklist: DEFAULT_REGULATORY_CHECKLIST,
    topRisks: [
      {
        id: "risk-cur-1",
        risk: "Fatal Section 3(e) Admixture Bar under Indian Patent Law",
        severity: "HIGH",
        category: "Patentability",
        mitigation: "Do not file broad composition-of-matter claims. Limit patent claims strictly to specific sustained-release polymeric microparticle formulation parameters."
      },
      {
        id: "risk-cur-2",
        risk: "Anticipation by Published Classical Treatises (CSIR-TKDL)",
        severity: "HIGH",
        category: "Traditional Knowledge",
        mitigation: "Acknowledge classical Yogavahi tradition in background and differentiate on modified thermodynamic solubility or dissolution kinetics."
      },
      {
        id: "risk-cur-3",
        risk: "Prior Art Overlap with Expired Patents (US5536506)",
        severity: "HIGH",
        category: "Patentability",
        mitigation: "Establish non-obvious differentiation over standard 50:1 curcumin-to-piperine ratios."
      }
    ],
    actionPlan: [
      {
        priority: 1,
        step: "Pivot Patent Strategy to Novel Formulation Delivery Claims",
        authority: "Patent Drafting Counsel",
        deadlineDesc: "Prior to initial patent filing",
        category: "IP Strategy"
      },
      {
        priority: 2,
        step: "Register Trademark for Proprietary Brand Formulation",
        authority: "Trade Marks Registry (IP India)",
        deadlineDesc: "Immediate / 1 month",
        category: "Brand Protection"
      },
      {
        priority: 3,
        step: "Obtain FSSAI Ayurveda Aahara Food Business License",
        authority: "FSSAI Central Licensing",
        deadlineDesc: "2-3 months prior to retail distribution",
        category: "Regulatory Clearance"
      }
    ],
    missingInputs: [
      "Dissolution profile comparison versus non-micronized curcumin",
      "Exact polymorphic crystalline form of curcumin utilized",
      "Biological resource geographical procurement agreement"
    ],
    evidence: [
      DEMO_EVIDENCE[0],
      DEMO_EVIDENCE[1],
      DEMO_EVIDENCE[5]
    ]
  },
  {
    id: "pain-oil-topical",
    name: "Mahanarayan Taila Derivative Topical Pain Micro-Emulsion",
    shortTag: "Topical Pain Relief Oil",
    category: "Musculoskeletal & Analgesic",
    shortDesc: "Targeted transdermal roll-on formulation combining classical Mahanarayan Taila herbal decoction with natural Wintergreen oil and Camphor for deep tissue penetration.",
    ingredients: [
      "Mahanarayan Taila classical processed sesame oil base (35+ herbs)",
      "Gaultheria procumbens (Gandhapura taila / natural methyl salicylate 10%)",
      "Cinnamomum camphora (Karpura / natural camphor crystals 5%)",
      "Eucalyptus globulus (Nilgiri taila 5%)",
      "Mentha piperita (Pudina satva / natural menthol 5%)"
    ],
    formulation: "Micro-emulsified topical oil serum with enhanced transdermal skin permeation enhancers.",
    technicalNovelty: "Biphasic delivery system allowing classical lipid-soluble Ayurvedic phytoconstituents to penetrate stratum corneum 3.8x faster than traditional warm taila massage.",
    manufacturingProcess: "Classical Sneha Kalpana (decoction-oil cooking) followed by modern nitrogen-blanketed cold-stage blending of aromatic volatiles.",
    intendedUse: "Rapid relief from osteoarthritis stiffness, muscular spasms, and cervical spondylosis.",
    applicantType: "Traditional Vaidya / AYUSH Co-operative",
    targetJurisdiction: "IN",
    overview: {
      patentability: "MEDIUM",
      traditionalKnowledge: "HIGH",
      regulatory: "MEDIUM",
      marketEntry: "LOW",
      documentation: "MEDIUM",
      filingReadinessScore: 74
    },
    traceSteps: [
      {
        stageNumber: 1,
        stageName: "Product Information Understood",
        status: "completed",
        summary: "Topical polyherbal pain oil based on classical Mahanarayan formulation.",
        details: "Combines 35+ herb classical taila base with modern transdermal penetration enhancers."
      },
      {
        stageNumber: 2,
        stageName: "Jurisdiction Identified: India",
        status: "completed",
        summary: "Primary jurisdiction: India (D&C Act 1940 & IP India).",
        details: "Evaluated for State AYUSH drug licensing and Section 3(p) prior art overlap."
      },
      {
        stageNumber: 3,
        stageName: "Ingredients & Botanical Formulations Extracted",
        status: "completed",
        summary: "Identified Mahanarayan base, Gandhapura, Karpura, Nilgiri, Pudina satva.",
        details: "All ingredients comply with Ayurvedic Pharmacopoeia of India (API)."
      },
      {
        stageNumber: 4,
        stageName: "Patentability Rules Evaluated (§ 3e & § 3p)",
        status: "warning",
        summary: "Process patent viable; product composition claims barred by Section 3(e)/3(p).",
        details: "The combination of wintergreen, camphor, and herbal oils is well known in classical and modern pain balms. Only the specific low-temperature micro-emulsification process is potentially patentable.",
        statuteRef: "Indian Patents Act § 3(e) & § 3(p)",
        evidenceId: "IN-PAT-SEC3E"
      },
      {
        stageNumber: 5,
        stageName: "Traditional Knowledge Overlap Screened",
        status: "flagged",
        summary: "Potential traditional-knowledge overlap verified in Bhaishajya Ratnavali.",
        details: "Mahanarayan Taila is an authoritative classical formula codified in Bhaishajya Ratnavali (Vataroga Chikitsa, 140-153) and Ayurvedic Formulary of India (Part I).",
        statuteRef: "Bhaishajya Ratnavali & AFI Part I",
        evidenceId: "IN-PAT-SEC3P"
      },
      {
        stageNumber: 6,
        stageName: "Regulatory Requirements Mapped",
        status: "completed",
        summary: "Eligible for Ayurvedic Proprietary Medicine License (Form 25-D).",
        details: "Because natural methyl salicylate and essential oils are added to the classical base, product requires Proprietary license rather than Classical license.",
        statuteRef: "D&C Rules 1945 Rule 158B",
        evidenceId: "IN-AYUSH-R158B"
      },
      {
        stageNumber: 7,
        stageName: "Statutory Evidence Retrieved & Grounded",
        status: "completed",
        summary: "Retrieved Schedule T GMP standards and skin irritation limits.",
        details: "Verified compliance with limits for topical essential oils."
      },
      {
        stageNumber: 8,
        stageName: "Risk Calculation & Action Plan Generated",
        status: "completed",
        summary: "Filing Readiness score: 74%.",
        details: "Focus on process claims and Schedule T GMP manufacturing."
      }
    ],
    regulatoryChecklist: DEFAULT_REGULATORY_CHECKLIST,
    topRisks: [
      {
        id: "risk-oil-1",
        risk: "Section 3(p) Challenge on Classical Mahanarayan Taila Base",
        severity: "HIGH",
        category: "Traditional Knowledge",
        mitigation: "Acknowledge the AFI reference; do not claim the classical oil composition as inventive. Claim the specialized micro-emulsion stabilizer system."
      },
      {
        id: "risk-oil-2",
        risk: "Mandatory Skin Irritation & Dermal Toxicity Documentation",
        severity: "MEDIUM",
        category: "Regulatory",
        mitigation: "Conduct OECD 404 Acute Dermal Irritation testing to validate safety with 10% natural methyl salicylate."
      }
    ],
    actionPlan: [
      {
        priority: 1,
        step: "File Process Patent for Low-Temperature Nitrogen Micro-Emulsification",
        authority: "Indian Patent Office",
        deadlineDesc: "Prior to marketing disclosure",
        category: "Patent Strategy"
      },
      {
        priority: 2,
        step: "Complete OECD 404 Dermal Patch Test for Skin Tolerance",
        authority: "GLP Accredited Preclinical Lab",
        deadlineDesc: "Required for Rule 158B licensing dossier",
        category: "Safety Dossier"
      },
      {
        priority: 3,
        step: "Apply for AYUSH Manufacturing License under Form 25-D",
        authority: "State AYUSH Directorate",
        deadlineDesc: "2-3 months prior to commercial packaging",
        category: "State Licensing"
      }
    ],
    missingInputs: [
      "Skin Franz diffusion cell flux rate measurements",
      "Viscosity and stability specification of the micro-emulsion",
      "Packaging compatibility study with roll-on plastic/glass applicators"
    ],
    evidence: [
      DEMO_EVIDENCE[0],
      DEMO_EVIDENCE[1],
      DEMO_EVIDENCE[4]
    ]
  },
  {
    id: "triphala-extract",
    name: "Standardized Triphala Supercritical CO2 Extract Formulation",
    shortTag: "Triphala Extract",
    category: "Digestive & Metabolic Wellness",
    shortDesc: "Standardized polyphenol fraction from Emblica officinalis, Terminalia chebula, and Terminalia bellerica optimized for gut microbiome balance.",
    ingredients: [
      "Emblica officinalis (Amalaki fruit dry extract, 30% gallic acid equivalents)",
      "Terminalia chebula (Haritaki fruit dry extract, 20% chebulic acid)",
      "Terminalia bellerica (Bibhitaki fruit dry extract, 15% bellericanin)"
    ],
    formulation: "Solvent-free micro-pelletized hard vegetarian capsules.",
    technicalNovelty: "Dual-temperature supercritical CO2 extraction yielding specific bioactive tannin ratios free from organic solvent residues.",
    manufacturingProcess: "Supercritical fluid extraction at 350 bar / 45°C followed by vacuum spray drying on gum acacia matrix.",
    intendedUse: "Digestive motility, cellular detox, and metabolic homeostasis.",
    applicantType: "R&D Institution & AYUSH Co-developer",
    targetJurisdiction: "IN",
    overview: {
      patentability: "MEDIUM",
      traditionalKnowledge: "HIGH",
      regulatory: "LOW",
      marketEntry: "LOW",
      documentation: "MEDIUM",
      filingReadinessScore: 71
    },
    traceSteps: [
      {
        stageNumber: 1,
        stageName: "Product Information Understood",
        status: "completed",
        summary: "Supercritical extraction of classical Triphala triad.",
        details: "Analyzed botanical constituents Amalaki, Haritaki, and Bibhitaki in equal 1:1:1 classical proportions."
      },
      {
        stageNumber: 2,
        stageName: "Jurisdiction Identified: India",
        status: "completed",
        summary: "Jurisdiction: India (with export interest in EU/US).",
        details: "Evaluated under Indian Patent Act and EU Traditional Herbal Medicinal Products Directive."
      },
      {
        stageNumber: 3,
        stageName: "Ingredients & Botanical Formulations Extracted",
        status: "completed",
        summary: "All three classical Myrobalan fruits extracted.",
        details: "High tannin and gallic acid content verified by HPLC."
      },
      {
        stageNumber: 4,
        stageName: "Patentability Rules Evaluated (§ 3e & § 3p)",
        status: "warning",
        summary: "Process claims for supercritical extraction valid; composition barred.",
        details: "Triphala is one of the most famous classical formulations. Section 3(p) bars any monopoly on the composition. Patent focus must remain on the green supercritical extraction process.",
        statuteRef: "Indian Patents Act § 3(e) & § 3(p)",
        evidenceId: "IN-PAT-SEC3P"
      },
      {
        stageNumber: 5,
        stageName: "Traditional Knowledge Overlap Screened",
        status: "flagged",
        summary: "Extensive codification across Charaka Samhita, Sushruta Samhita, and AFI.",
        details: "Triphala is codified in Charaka Samhita (Sutrasthana Ch. 4 and Chikitsasthana Ch. 1), Sushruta Samhita (Sutrasthana Ch. 38), and Ayurvedic Pharmacopoeia of India (Part I Vol 1).",
        statuteRef: "Charaka Samhita & Sushruta Samhita",
        evidenceId: "IN-PAT-SEC3P"
      },
      {
        stageNumber: 6,
        stageName: "Regulatory Requirements Mapped",
        status: "completed",
        summary: "Classical Ayurvedic Medicine under D&C Act Rule 158B.",
        details: "Requires no clinical trials in India if manufactured according to classical text recipes. For EU export, must meet Directive 2004/24/EC 30-year documentation.",
        statuteRef: "D&C Rules 1945 & EU Directive 2004/24/EC",
        evidenceId: "IN-AYUSH-R158B"
      },
      {
        stageNumber: 7,
        stageName: "Statutory Evidence Retrieved & Grounded",
        status: "completed",
        summary: "Retrieved pharmacopoeial monographs and EU herbal guidelines.",
        details: "Grounding verified against API Part I and EMA Community Herbal Monograph."
      },
      {
        stageNumber: 8,
        stageName: "Risk Calculation & Action Plan Generated",
        status: "completed",
        summary: "Filing Readiness score: 71%.",
        details: "Recommendations for dual filing (India AYUSH + EU THMPD preparation)."
      }
    ],
    regulatoryChecklist: DEFAULT_REGULATORY_CHECKLIST,
    topRisks: [
      {
        id: "risk-tri-1",
        risk: "Section 3(p) Traditional Knowledge Bar on Triphala Composition",
        severity: "HIGH",
        category: "Patentability",
        mitigation: "Strictly restrict claims to method of extraction (scCO2 parameters: pressure, temperature, entrainer) rather than herbal substance."
      },
      {
        id: "risk-tri-2",
        risk: "EU 15-Year Community Use Hurdle for THMPD Export",
        severity: "MEDIUM",
        category: "Market Entry",
        mitigation: "Compile bibliographic evidence of sales within European Union member states since 2009, or register initially as food supplement."
      }
    ],
    actionPlan: [
      {
        priority: 1,
        step: "Draft Process Patent Claims on Supercritical CO2 Operating Parameters",
        authority: "Patent Office (CGPDTM)",
        deadlineDesc: "Prior to public commercial display",
        category: "Patent Drafting"
      },
      {
        priority: 2,
        step: "Procure Classical Book Reference Extracts for Form 25-D License",
        authority: "State AYUSH Licensing Authority",
        deadlineDesc: "2 months prior to manufacturing",
        category: "Regulatory Dossier"
      },
      {
        priority: 3,
        step: "Perform Residual Solvent & Heavy Metal Analysis",
        authority: "NABL Laboratory",
        deadlineDesc: "For every commercial batch",
        category: "Quality Assurance"
      }
    ],
    missingInputs: [
      "Exact supercritical extraction pressure and temperature curves",
      "Standardization marker HPLC chromatograms",
      "Biological resource collection permissions from State Forest Department"
    ],
    evidence: [
      DEMO_EVIDENCE[0],
      DEMO_EVIDENCE[1],
      DEMO_EVIDENCE[4],
      DEMO_EVIDENCE[6]
    ]
  }
];
