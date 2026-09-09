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
    productDNA: {
      id: "ashwagandha-nano",
      name: "Ashwagandha Phospholipid Nano-Emulsion Formulation",
      productType: "Patent / Proprietary Ayurvedic Medicine",
      classification: {
        category: "Patent / Proprietary Ayurvedic Medicine",
        confidence: "HIGH",
        signals: ["Contains classical botanicals in non-classical lipid carrier", "Rule 158B licensing criteria satisfied", "Novel delivery mechanism claimed"],
        governingStatute: "Drugs and Cosmetics Act 1940, Section 3(h) & Rule 158B",
        governingAuthority: "Ministry of AYUSH / State Licensing Authority",
        downstreamRoute: "AYUSH_DRUGS_COSMETICS",
        missingSignals: []
      },
      ingredients: [
        {
          commonName: "Ashwagandha",
          botanicalName: "Withania somnifera (L.) Dunal",
          sanskritName: "Ashwagandha",
          plantPart: "Root",
          concentration: "250 mg / dose",
          isBiologicalResource: true,
          isScheduleE1: false,
          classicalTreatiseReference: "Bhavaprakasha Nighantu, Guduchyadi Varga",
          traditionalUse: "Balya, Rasayana, Medhya (strength, rejuvenation, cognitive nourishment)"
        },
        {
          commonName: "Pippali",
          botanicalName: "Piper longum L.",
          sanskritName: "Pippali",
          plantPart: "Dried catkins",
          concentration: "10 mg / dose",
          isBiologicalResource: true,
          isScheduleE1: false,
          classicalTreatiseReference: "Charaka Samhita, Sutrasthana",
          traditionalUse: "Yogavahi (bioenhancer, synergistic bioavailability amplifier)"
        },
        {
          commonName: "Soy Phosphatidylcholine",
          botanicalName: "Glycine max (L.) Merr.",
          plantPart: "Seed phospholipid fraction",
          concentration: "150 mg / dose",
          isBiologicalResource: true,
          isScheduleE1: false
        }
      ],
      formulation: "Self-nanoemulsifying drug delivery system (SNEDDS) softgel",
      dosageForm: "Liquid-filled soft gelatin capsule",
      manufacturingMethod: "High-pressure microfluidization at 1200 bar followed by ultrasonic degassing",
      intendedUse: "Cognitive performance, adaptogenic stress resilience, and neuroprotection",
      therapeuticClaims: [
        "Reverses Alzheimer's cognitive decline and cures clinical dementia",
        "Clinically studied adaptogen supporting cognitive stamina, memory retention, and healthy stress response"
      ],
      commercialClaims: ["100% natural memory cure with zero side effects"],
      classicalReference: "Bhavaprakasha Nighantu & Charaka Samhita",
      traditionalUse: "Medhya Rasayana (cognitive revitalization and nervous system rejuvenation)",
      geographicOrigin: "Madhya Pradesh and Rajasthan, India",
      applicantType: "AYUSH Biotech Startup",
      targetMarkets: ["IN", "US", "EU"]
    },
    plainLanguageExplanation: "In plain words: You cannot patent the Ashwagandha or Pippali plants themselves because both have been revered in classical Ayurvedic texts like Charaka Samhita for centuries (Indian Patent Act Section 3(p)). However, you CAN potentially patent your specific, high-tech nanoparticle delivery carrier if you scientifically prove it produces non-obvious, synergistic absorption enhancements (Section 3(d) and 3(e)). Crucially: because your formulation uses Indian biological herbs, you are legally required to obtain Form III permission from the National Biodiversity Authority (NBA) before filing foreign patents or seeking commercial patent rights.",
    overview: {
      patentability: "MEDIUM",
      traditionalKnowledge: "HIGH",
      regulatory: "MEDIUM",
      marketEntry: "LOW",
      documentation: "MEDIUM",
      filingReadinessScore: 78
    },
    classification: {
      category: "Patent / Proprietary Ayurvedic Medicine",
      confidence: "HIGH",
      signals: ["Contains classical botanicals in non-classical lipid carrier", "Rule 158B licensing criteria satisfied", "Novel delivery mechanism claimed"],
      governingStatute: "Drugs and Cosmetics Act 1940, Section 3(h) & Rule 158B",
      governingAuthority: "Ministry of AYUSH / State Licensing Authority",
      downstreamRoute: "AYUSH_DRUGS_COSMETICS",
      missingSignals: []
    },
    multiIPStrategy: [
      {
        id: "ip-1",
        regime: "Patent",
        relevant: true,
        risk: "MEDIUM",
        why: "Delivery system formulation claim: Focus exclusively on the specific nano-carrier matrix ratio and synergistic pharmacokinetic absorption profile (surmounting Section 3(e) synergy burden).",
        whatToProtect: "Specific sub-100nm phospholipid-to-MCT ratio that enhances oral bioavailability of Withanolide aglycones across the blood-brain barrier.",
        recommendedAction: "File provisional patent focusing strictly on process/formulation claims supported by comparative in-vivo pharmacokinetic AUC data.",
        governingAuthority: "Indian Patent Office (CGPDTM)",
        statuteRef: "Indian Patents Act 1970, Section 3(d), 3(e), 3(p)"
      },
      {
        id: "ip-2",
        regime: "Trademark",
        relevant: true,
        risk: "LOW",
        why: "Brand name, proprietary technology trademark under Nice Class 5 (Pharmaceuticals & Dietetic) and Class 42.",
        whatToProtect: "Coined distinctive brand names and delivery technology badges (e.g., 'WithaNano™', 'NeuroSomn™').",
        recommendedAction: "Perform comprehensive TM search on IP India portal to ensure non-descriptiveness and absence of generic Ayurvedic terms in the primary mark.",
        governingAuthority: "Trade Marks Registry, Mumbai/Delhi",
        statuteRef: "Trade Marks Act 1999, Section 9 & 11"
      },
      {
        id: "ip-3",
        regime: "Trade Secret",
        relevant: true,
        risk: "LOW",
        why: "Exact microfluidization pressure gradients, cavitation nozzle geometry, and surfactant emulsification temperature windows.",
        whatToProtect: "Proprietary high-pressure homogenization operating parameters and temperature stability curves.",
        recommendedAction: "Implement strict NDAs, compartmentalized standard operating procedures (SOPs), and encrypted manufacturing batch records.",
        governingAuthority: "Civil Courts (Common Law & Contract Act)",
        statuteRef: "Indian Contract Act 1872 & Common Law Breach of Confidence"
      },
      {
        id: "ip-4",
        regime: "Biological Resource / ABS",
        relevant: true,
        risk: "HIGH",
        why: "Mandatory statutory clearance for utilizing Indian biological resources (Withania somnifera and Piper longum) for IP and commercialization.",
        whatToProtect: "Legal compliance and right to commercialize derived intellectual property without confiscation or criminal fines.",
        recommendedAction: "Submit Form III application to the National Biodiversity Authority (NBA) at Chennai prior to filing any foreign patent applications.",
        governingAuthority: "National Biodiversity Authority (NBA), Chennai",
        statuteRef: "Biological Diversity Act 2002, Section 6(1) & Rule 18"
      },
      {
        id: "ip-5",
        regime: "Traditional Knowledge Safeguards",
        relevant: true,
        risk: "HIGH",
        why: "Defensive avoidance of CSIR-TKDL public literature conflicts regarding classical neurological indications of Ashwagandha.",
        whatToProtect: "Patent validity against pre-grant and post-grant opposition by CSIR-TKDL or competitors.",
        recommendedAction: "Explicitly disclaim broad therapeutical treatment of anxiety or memory loss as stand-alone patent claims; confine claims to the novel physical nanostructure.",
        governingAuthority: "CSIR-TKDL Directorate & Indian Patent Office",
        statuteRef: "CSIR-TKDL Public Literature Database & Section 3(p)"
      },
      {
        id: "ip-6",
        regime: "Industrial Design",
        relevant: false,
        risk: "LOW",
        why: "Standard softgel capsule shape does not possess sufficient aesthetic novelty unless custom dual-chamber packaging is engineered.",
        whatToProtect: "Custom ergonomic blister packaging if custom-tooled.",
        recommendedAction: "Evaluate custom packaging tooling prior to public launch.",
        governingAuthority: "Patent Office, Designs Wing, Kolkata",
        statuteRef: "Designs Act 2000"
      },
      {
        id: "ip-7",
        regime: "Geographical Indication",
        relevant: false,
        risk: "LOW",
        why: "Ashwagandha root is cultivated across multiple states without an exclusive registered GI protection.",
        whatToProtect: "Ensure supply chain traceability certificates without making deceptive GI claims.",
        recommendedAction: "Maintain procurement records.",
        governingAuthority: "GI Registry, Chennai",
        statuteRef: "Geographical Indications of Goods Act 1999"
      },
      {
        id: "ip-8",
        regime: "Copyright",
        relevant: true,
        risk: "LOW",
        why: "Original technical whitepaper diagrams, educational patient guidance booklets, and proprietary PK visualization software.",
        whatToProtect: "Package insert educational literature, technical brochures, and digital UI software.",
        recommendedAction: "Register copyright for brand artwork and technical patient booklets.",
        governingAuthority: "Copyright Office, New Delhi",
        statuteRef: "Copyright Act 1957"
      },
      {
        id: "ip-9",
        regime: "Plant Variety Protection",
        relevant: false,
        risk: "LOW",
        why: "Purchasing harvested botanical roots does not involve breeding a novel, distinct, uniform, and stable (DUS) plant variety.",
        whatToProtect: "N/A for downstream extracted formulations.",
        recommendedAction: "Maintain procurement invoices.",
        governingAuthority: "PPV&FR Authority, New Delhi",
        statuteRef: "Protection of Plant Varieties and Farmers' Rights Act 2001"
      }
    ],
    absAssessment: {
      relevance: "HIGH",
      biologicalResourceUsed: true,
      indianOriginResource: true,
      foreignParticipation: false,
      commercialUtilization: true,
      potentialObligation: "Form III approval required from NBA Chennai prior to applying for intellectual property rights based on Indian biological resources.",
      statuteRef: "Biological Diversity Act 2002, Section 6(1) & Rule 18",
      authority: "National Biodiversity Authority (NBA), Chennai",
      formRequired: "Form III (Application for approval of NBA for applying for intellectual property right)",
      missingInformation: [
        "Foreign equity or non-resident shareholding proportion in applicant entity",
        "Exact GPS coordinates of cultivating farms or APMC mandi procurement receipts"
      ],
      recommendedNextStep: "Submit Form III to NBA Chennai immediately with draft patent specification.",
      isConfirmedObligation: true
    },
    claimsCheck: [
      {
        claimText: "Reverses Alzheimer's cognitive decline and cures clinical dementia",
        riskLevel: "HIGH",
        violationType: "Disease Treatment / Cure Claim",
        governingStatute: "Drugs and Magic Remedies (Objectionable Advertisements) Act 1954, Section 3 & Schedule Item 7",
        saferWording: "Formulated with standardized Withania somnifera to support cognitive vitality, memory recall speed, and normal neuronal health in healthy adults."
      },
      {
        claimText: "100% natural memory cure with zero side effects",
        riskLevel: "MEDIUM",
        violationType: "Exaggerated Efficacy",
        governingStatute: "Consumer Protection Act 2019 & ASCI Guidelines for AYUSH Advertising",
        saferWording: "Ayurvedic proprietary formulation crafted with standardized herbal extracts to nourish mental performance."
      },
      {
        claimText: "Clinically studied adaptogen supporting cognitive stamina, memory retention, and healthy stress response",
        riskLevel: "LOW",
        violationType: "Compliant Structure-Function",
        governingStatute: "AYUSH Advertising Guidelines & FSSAI Structure-Function Standards",
        saferWording: "Clinically studied adaptogen supporting cognitive stamina, memory retention, and healthy stress response."
      }
    ],
    expertReviewBrief: {
      executiveSummary: "Ashwagandha Phospholipid Nano-Emulsion Formulation represents a high-potential proprietary Ayurvedic innovation with significant delivery-system novelty. Patent strategy must strictly avoid claiming the botanical ingredients per se (Section 3(p)) and instead defend the synergistic bioavailability amplification (Section 3(d)/(e)). Regulatory licensing proceeds through AYUSH Rule 158B. Immediate priority is Form III submission to the NBA.",
      keyLegalQuestions: [
        "Does our in-vivo AUC pharmacokinetic ratio satisfy the Section 3(e) non-obvious synergistic enhancement threshold before the Controller of Patents?",
        "What is the current average timeline for National Biodiversity Authority Form III approval in Chennai?",
        "Should we initiate PCT national phase filings simultaneously with the NBA application under Rule 18?"
      ],
      requiredFilings: [
        "Form III with National Biodiversity Authority (NBA), Chennai",
        "Provisional Patent Application at Indian Patent Office with PK synergy data",
        "Form 24D License Application under AYUSH Rule 158B to State Licensing Authority",
        "Class 5 Trademark application for proprietary brand and technology names"
      ],
      statutoryDeadlines: [
        "NBA Form III must be filed prior to the grant of any patent or commercial export",
        "Complete Patent Specification must be filed within 12 months of provisional filing"
      ],
      specialistConsultantType: "Senior Registered Patent Agent with Life Sciences & AYUSH Specialization"
    },
    whatIfSimulations: [
      {
        scenarioId: "sim-1",
        label: "Market as Dietary Supplement (Ayurveda-Aahara)",
        changeDescription: "Drop medicinal drug positioning and re-route under FSSAI Ayurveda-Aahara Regulations 2022 rather than AYUSH Rule 158B.",
        originalPathway: "AYUSH Rule 158B Proprietary Ayurvedic Medicine",
        simulatedPathway: "FSSAI Ayurveda-Aahara Food Category",
        originalRisk: "MEDIUM",
        simulatedRisk: "LOW",
        impactAnalysis: "Accelerates time-to-market by 8 months. Eliminates clinical efficacy mandate for drug licensing, but restricts permitted label claims strictly to physiological wellness."
      },
      {
        scenarioId: "sim-2",
        label: "Introduce Synthetic Polymer Carriers",
        changeDescription: "Substitute soy phosphatidylcholine with synthetic pegylated block copolymers (PEG-PLA).",
        originalPathway: "AYUSH Rule 158B Proprietary Ayurvedic Medicine",
        simulatedPathway: "CDSCO New Drug / Phytopharmaceutical Route",
        originalRisk: "MEDIUM",
        simulatedRisk: "HIGH",
        impactAnalysis: "Triggers CDSCO New Drugs & Clinical Trials Rules 2019. Requires formal Phase I-III clinical trial dossier before DCGI, extending regulatory timeline by 24-36 months."
      }
    ],
    traceSteps: [
      {
        stageNumber: 1,
        stageName: "Product Information Understood",
        status: "completed",
        summary: "Parsed canonical ProductDNA: Withania somnifera + Piper longum in SNEDDS lipid core with 4.2x AUC enhancement data.",
        details: "Analyzed composition, dosage form, botanical origin, and technical novelty parameters."
      },
      {
        stageNumber: 2,
        stageName: "Target Country / Market Identified",
        status: "completed",
        summary: "Primary jurisdiction: India (IN) with export targets (US, EU).",
        details: "Evaluated Indian Patents Act, Biological Diversity Act, and AYUSH Rule 158B."
      },
      {
        stageNumber: 3,
        stageName: "Product Classification Assessed",
        status: "completed",
        summary: "Classified as 'Patent / Proprietary Ayurvedic Medicine' under Drugs & Cosmetics Act Rule 158B.",
        details: "Downstream route: AYUSH_DRUGS_COSMETICS governed by State Licensing Authority."
      },
      {
        stageNumber: 4,
        stageName: "Multi-IP Strategy Mapped",
        status: "completed",
        summary: "Mapped 9 IP regimes: Viable formulation patent (Section 3(e)), essential Trademark Class 5, mandatory NBA Form III.",
        details: "Highlighted critical need to surmount Section 3(e) synergistic burden."
      },
      {
        stageNumber: 5,
        stageName: "ABS & Biological Resource Risk Evaluated",
        status: "warning",
        summary: "Form III clearance mandatory under Biological Diversity Act 2002.",
        details: "Section 40 NTC exemption does not apply to commercial patenting or research extraction."
      },
      {
        stageNumber: 6,
        stageName: "Claims & Advertising Risk Screened",
        status: "flagged",
        summary: "Flagged prohibited Alzheimer's cure claim under DMRA 1954; provided compliant structure-function alternatives.",
        details: "Replaced curative statements with permissible adaptogenic cognitive vitality claims."
      },
      {
        stageNumber: 7,
        stageName: "Decision Synthesized with Grounded Evidence",
        status: "completed",
        summary: "Readiness Score: 78/100. High scientific merit with manageable regulatory and patent obstacles.",
        details: "Comprehensive actionable guidance generated with statutory citations."
      }
    ],
    regulatoryChecklist: DEFAULT_REGULATORY_CHECKLIST,
    topRisks: [
      {
        id: "risk-1",
        risk: "Traditional Knowledge Rejection under Indian Patent Act Section 3(p)",
        severity: "HIGH",
        category: "Patent Law",
        mitigation: "Submit comparative bioavailability study (AUC data) proving the lipid carrier delivers technical effect unobtainable by traditional churna."
      },
      {
        id: "risk-2",
        risk: "Mandatory National Biodiversity Authority (NBA) Form III Approval",
        severity: "HIGH",
        category: "Biological Diversity Law",
        mitigation: "Submit Form III to NBA Chennai immediately. Ensure traceability receipts from certified farmers/mandis."
      },
      {
        id: "risk-3",
        risk: "Prohibited Therapeutic Advertising Claims under DMRA 1954",
        severity: "HIGH",
        category: "Advertising Law",
        mitigation: "Adopt structure-function wording: 'Supports cognitive vitality, healthy stress adaptation, and mental alertness.'"
      }
    ],
    actionPlan: [
      {
        priority: 1,
        step: "Submit NBA Form III Clearance Application",
        authority: "National Biodiversity Authority, Chennai",
        deadlineDesc: "Immediate (Within 15 days)",
        category: "Biological Diversity Compliance"
      },
      {
        priority: 2,
        step: "File Provisional Patent with Comparative Synergistic Data",
        authority: "Indian Patent Office",
        deadlineDesc: "Month 1-2",
        category: "Intellectual Property"
      },
      {
        priority: 3,
        step: "Obtain AYUSH Rule 158B Manufacturing License",
        authority: "State AYUSH Licensing Authority",
        deadlineDesc: "Month 2-4",
        category: "Regulatory Licensing"
      },
      {
        priority: 4,
        step: "Register Class 5 Trademark and Secure Trade Secret SOPs",
        authority: "Trade Marks Registry",
        deadlineDesc: "Month 1-3",
        category: "Brand & Know-How Protection"
      }
    ],
    missingInputs: [
      "Exact batch-to-batch variation coefficient for Withanolide A vs Withaferin A",
      "Full foreign equity holding breakdown of the applicant entity (to confirm Section 3(2) NBA status)",
      "Long-term real-time stability data at 30°C/75% RH for 12 months"
    ],
    evidence: DEMO_EVIDENCE
  },
  {
    id: "triphala-curcumin",
    name: "Triphala-Curcumin Synergistic Metabolic Complex",
    shortTag: "Triphala-Curcumin Complex",
    category: "Metabolic & Gastrointestinal",
    shortDesc: "Fixed-ratio synergistic polyphenol-curcuminoid phytocomplex demonstrating potent inhibition of intestinal advanced glycation end-products (AGEs).",
    ingredients: [
      "Terminalia chebula (Haritaki fruit extract)",
      "Terminalia bellerica (Bibhitaki fruit extract)",
      "Emblica officinalis (Amalaki fruit extract)",
      "Curcuma longa (95% standardized Curcuminoids)",
      "Zingiber officinale (Shunti adjuvant extract)"
    ],
    formulation: "Standardized micro-granules packaged in enteric-coated delayed-release capsules.",
    technicalNovelty: "Specific stoichiometric ratio (3:2:1:1.5) producing unexpected 3.8x synergistic reduction of cellular AGE formation compared to individual components.",
    manufacturingProcess: "Aqueous ethanolic hydro-alcoholic extraction followed by vacuum spray drying with maltodextrin carrier at controlled temperatures.",
    intendedUse: "Support for healthy glucose metabolism, lipid profile maintenance, and cellular antioxidant defense.",
    applicantType: "Established AYUSH Manufacturer",
    targetJurisdiction: "IN",
    productDNA: {
      id: "triphala-curcumin",
      name: "Triphala-Curcumin Synergistic Metabolic Complex",
      productType: "Patent / Proprietary Ayurvedic Medicine",
      classification: {
        category: "Patent / Proprietary Ayurvedic Medicine",
        confidence: "HIGH",
        signals: ["Classical botanicals combined in non-classical ratio", "Supported by clinical pilot evidence", "Enteric dosage form"],
        governingStatute: "Drugs and Cosmetics Act 1940, Section 3(h) & Rule 158B",
        governingAuthority: "State AYUSH Licensing Authority",
        downstreamRoute: "AYUSH_DRUGS_COSMETICS",
        missingSignals: []
      },
      ingredients: [
        {
          commonName: "Haritaki",
          botanicalName: "Terminalia chebula Retz.",
          sanskritName: "Haritaki",
          plantPart: "Fruit pericarp",
          concentration: "200 mg",
          isBiologicalResource: true,
          isScheduleE1: false,
          classicalTreatiseReference: "Charaka Samhita, Chikitsasthana",
          traditionalUse: "Deepana, Pachana, Rasayana"
        },
        {
          commonName: "Amalaki",
          botanicalName: "Phyllanthus emblica L.",
          sanskritName: "Amalaki",
          plantPart: "Fresh fruit rind",
          concentration: "200 mg",
          isBiologicalResource: true,
          isScheduleE1: false,
          classicalTreatiseReference: "Charaka Samhita, Rasayana Adhyaya",
          traditionalUse: "Vayasthapana, Chakshushya, Pramehaghna"
        },
        {
          commonName: "Curcuminoids 95%",
          botanicalName: "Curcuma longa L.",
          sanskritName: "Haridra",
          plantPart: "Rhizome extract",
          concentration: "250 mg",
          isBiologicalResource: true,
          isScheduleE1: false,
          classicalTreatiseReference: "Bhavaprakasha Nighantu",
          traditionalUse: "Lekhana, Varnya, Pramehaghna"
        }
      ],
      formulation: "Delayed-release enteric vegetable capsules",
      dosageForm: "Enteric-coated capsule",
      manufacturingMethod: "Hydro-ethanolic extraction, low-temperature vacuum evaporation, and fluidized-bed coating",
      intendedUse: "Support for healthy glucose metabolism, lipid profile maintenance, and cellular antioxidant defense",
      therapeuticClaims: [
        "Cures Type 2 Diabetes Mellitus and permanently eliminates diabetic neuropathy",
        "Supports healthy glucose metabolism and normal insulin sensitivity when used alongside balanced diet"
      ],
      commercialClaims: ["Guaranteed cure for high cholesterol and arterial plaque"],
      classicalReference: "Charaka Samhita & Bhavaprakasha",
      traditionalUse: "Prameha Chikitsa (metabolic disorder balance)",
      geographicOrigin: "Maharashtra and Kerala, India",
      applicantType: "Established AYUSH Manufacturer",
      targetMarkets: ["IN", "US", "JP", "EU"]
    },
    plainLanguageExplanation: "In plain words: Triphala and Haldi (Curcuma) are among the most celebrated classical remedies in Ayurvedic history. You cannot patent their combination for general health or diabetes because this is already part of traditional Indian knowledge protected under Section 3(p). You can, however, claim a patent on the exact quantitative ratio that yields an unexpected, statistically proven synergistic biochemical interaction (Section 3(e)), or register a distinctive brand trademark. Because all herbs are sourced within India, NBA Form III approval is mandatory before foreign filing.",
    overview: {
      patentability: "MEDIUM",
      traditionalKnowledge: "HIGH",
      regulatory: "LOW",
      marketEntry: "LOW",
      documentation: "LOW",
      filingReadinessScore: 84
    },
    classification: {
      category: "Patent / Proprietary Ayurvedic Medicine",
      confidence: "HIGH",
      signals: ["Classical botanicals combined in non-classical ratio", "Supported by clinical pilot evidence", "Enteric dosage form"],
      governingStatute: "Drugs and Cosmetics Act 1940, Section 3(h) & Rule 158B",
      governingAuthority: "State AYUSH Licensing Authority",
      downstreamRoute: "AYUSH_DRUGS_COSMETICS",
      missingSignals: []
    },
    multiIPStrategy: [
      {
        id: "ip-1",
        regime: "Patent",
        relevant: true,
        risk: "MEDIUM",
        why: "Synergistic combination claims restricted to the precise ratio (3:2:1:1.5) supported by in-vitro AGE-inhibition synergy index (>1.5) and RCT clinical data.",
        whatToProtect: "Specific stoichiometric ratio delivering super-additive AGE inhibition.",
        recommendedAction: "File patent application presenting Chou-Talalay Combination Index data demonstrating true super-additive synergy.",
        governingAuthority: "Indian Patent Office",
        statuteRef: "Indian Patents Act Section 3(e), 3(p)"
      },
      {
        id: "ip-2",
        regime: "Trademark",
        relevant: true,
        risk: "LOW",
        why: "Coined distinctive brand name across Class 5 and Class 30.",
        whatToProtect: "Brand names (e.g., 'GlycoTriphalin™', 'CurcuPhala™').",
        recommendedAction: "File trademark application immediately before commercial trade show announcements.",
        governingAuthority: "Trade Marks Registry",
        statuteRef: "Trade Marks Act 1999"
      },
      {
        id: "ip-3",
        regime: "Biological Resource / ABS",
        relevant: true,
        risk: "HIGH",
        why: "All ingredients are Indian biological resources sourced from Maharashtra and Kerala.",
        whatToProtect: "Statutory legitimacy of commercial operations and patent rights.",
        recommendedAction: "Submit Form III to National Biodiversity Authority Chennai.",
        governingAuthority: "National Biodiversity Authority (NBA)",
        statuteRef: "Biological Diversity Act 2002 Section 6(1)"
      },
      {
        id: "ip-4",
        regime: "Trade Secret",
        relevant: true,
        risk: "LOW",
        why: "Enteric polymer coating mixture ratio and fluid-bed temperature curves.",
        whatToProtect: "Manufacturing process parameters and coating ratios.",
        recommendedAction: "Maintain protected manufacturing batch formulas.",
        governingAuthority: "Civil Courts",
        statuteRef: "Indian Contract Act 1872"
      },
      {
        id: "ip-5",
        regime: "Traditional Knowledge Safeguards",
        relevant: true,
        risk: "HIGH",
        why: "Avoid claims on generalized digestive or metabolic balance already documented in Charaka Samhita.",
        whatToProtect: "Patent validity against TKDL prior art citations.",
        recommendedAction: "Draft claims focusing strictly on specific biochemical AGE inhibition pathways.",
        governingAuthority: "CSIR-TKDL",
        statuteRef: "CSIR-TKDL Prior Art Safeguards"
      }
    ],
    absAssessment: {
      relevance: "HIGH",
      biologicalResourceUsed: true,
      indianOriginResource: true,
      foreignParticipation: false,
      commercialUtilization: true,
      potentialObligation: "Form III approval required from NBA Chennai prior to commercial export or patent grant.",
      statuteRef: "Biological Diversity Act 2002, Section 6(1)",
      authority: "National Biodiversity Authority (NBA)",
      formRequired: "Form III (NBA Prior Approval for IPR)",
      missingInformation: ["Export distributor entity citizenship breakdown"],
      recommendedNextStep: "Submit Form III to NBA Chennai before foreign filings.",
      isConfirmedObligation: true
    },
    claimsCheck: [
      {
        claimText: "Cures Type 2 Diabetes Mellitus and permanently eliminates diabetic neuropathy",
        riskLevel: "HIGH",
        violationType: "Disease Treatment / Cure Claim",
        governingStatute: "Drugs and Magic Remedies (Objectionable Advertisements) Act 1954, Section 3, Schedule Item 13",
        saferWording: "Formulated with standardized botanical extracts to help maintain healthy blood sugar levels already within normal range."
      },
      {
        claimText: "Supports healthy glucose metabolism and normal insulin sensitivity when used alongside balanced diet and exercise",
        riskLevel: "LOW",
        violationType: "Compliant Structure-Function",
        governingStatute: "AYUSH & FSSAI Permissible Health Claims",
        saferWording: "Supports healthy glucose metabolism and normal insulin sensitivity when used alongside balanced diet and exercise."
      }
    ],
    expertReviewBrief: {
      executiveSummary: "Triphala-Curcumin Metabolic Complex is clinically well-substantiated with clear synergy data. Patentability hinges entirely on surmounting Section 3(e) non-obvious combination requirements. The formulation holds high commercial promise under AYUSH Rule 158B.",
      keyLegalQuestions: [
        "Will the Controller require human clinical synergy data or does our in-vitro Caco-2 Chou-Talalay index suffice for Section 3(e)?"
      ],
      requiredFilings: [
        "NBA Form III Application at Chennai",
        "Form 24D dossier to State Licensing Authority",
        "Class 5 Trademark application"
      ],
      statutoryDeadlines: ["Form III must be filed prior to patent grant"],
      specialistConsultantType: "AYUSH Regulatory Advisor & Life Sciences Patent Attorney"
    },
    whatIfSimulations: [
      {
        scenarioId: "sim-1",
        label: "Register as Ayurveda-Aahara Nutraceutical under FSSAI",
        changeDescription: "Transition product from AYUSH drug license to FSSAI Ayurveda-Aahara Schedule A compliance.",
        originalPathway: "AYUSH Rule 158B Proprietary Medicine",
        simulatedPathway: "FSSAI Ayurveda-Aahara Food Channel",
        originalRisk: "LOW",
        simulatedRisk: "LOW",
        impactAnalysis: "Enables broader distribution in grocery and wellness retail channels without needing a licensed drug pharmacist on premises."
      }
    ],
    traceSteps: [
      { stageNumber: 1, stageName: "Product Information Understood", status: "completed", summary: "Standardized Triphala + 95% Curcuminoids in synergistic 3:2:1:1.5 ratio.", details: "Analyzed botanical composition and clinical RCT evidence." },
      { stageNumber: 2, stageName: "Target Country / Market Identified", status: "completed", summary: "India primary (IN) with global export roadmap (US, JP, EU).", details: "Assessed regulatory frameworks across 4 target markets." },
      { stageNumber: 3, stageName: "Product Classification Assessed", status: "completed", summary: "Patent / Proprietary Ayurvedic Medicine under AYUSH Rule 158B.", details: "Downstream route: AYUSH_DRUGS_COSMETICS." },
      { stageNumber: 4, stageName: "Multi-IP Strategy Mapped", status: "completed", summary: "Section 3(e) synergistic patent, distinctive Class 5 trademark, NBA Form III.", details: "Outlined balanced IP portfolio." },
      { stageNumber: 5, stageName: "ABS & Biological Resource Risk Evaluated", status: "warning", summary: "Form III required under BDA 2002 for all botanical components.", details: "Cleared for domestic commercialization, export requires clearance." },
      { stageNumber: 6, stageName: "Claims & Advertising Risk Screened", status: "flagged", summary: "Flagged prohibited diabetes cure claim under DMRA 1954; established compliant structure-function alternatives.", details: "Rewrote claims to avoid criminal DMRA enforcement." },
      { stageNumber: 7, stageName: "Decision Synthesized with Grounded Evidence", status: "completed", summary: "Readiness score: 84/100. High clinical strength, well-managed regulatory path.", details: "Detailed legal action plan generated." }
    ],
    regulatoryChecklist: DEFAULT_REGULATORY_CHECKLIST,
    topRisks: [
      {
        id: "risk-1",
        risk: "Section 3(p) Traditional Knowledge Anticipation",
        severity: "HIGH",
        category: "Patent Law",
        mitigation: "Present clear Chou-Talalay quantitative synergy indexes."
      }
    ],
    actionPlan: [
      {
        priority: 1,
        step: "Submit NBA Form III Application",
        authority: "National Biodiversity Authority, Chennai",
        deadlineDesc: "Immediate",
        category: "Biological Diversity"
      }
    ],
    missingInputs: ["Exact batch standardization data for Chebulic and Ellagic acid markers"],
    evidence: DEMO_EVIDENCE
  },
  {
    id: "brahmi-gummies",
    name: "Brahmi-Shankhpushpi Fortified Pediatric Focus Gummies",
    shortTag: "Brahmi Pediatric Gummies",
    category: "Pediatric & Cognitive Food Supplement",
    shortDesc: "Pectin-based chewable herbal gummy containing water-soluble Brahmi and Shankhpushpi standardized bacoside extracts for childhood focus and academic stamina.",
    ingredients: [
      "Bacopa monnieri (Brahmi water extract, 20% bacosides)",
      "Convolvulus pluricaulis (Shankhpushpi whole plant extract)",
      "Citrus pectin (gelling matrix)",
      "Organic raw cane sugar & Natural strawberry flavour"
    ],
    formulation: "Pectin-based, gelatin-free chewable gummy confectionery.",
    technicalNovelty: "Taste-masking encapsulation neutralizing bitter bacoside saponins without synthetic sweeteners, delivering child-friendly palatability.",
    manufacturingProcess: "Low-temperature vacuum cooking of pectin-sugar syrup followed by botanical extract blending at 65°C and starchless mould deposition.",
    intendedUse: "Supports cognitive focus, attention span, and mental calm in school-age children.",
    applicantType: "Food-Tech Startup",
    targetJurisdiction: "IN",
    productDNA: {
      id: "brahmi-gummies",
      name: "Brahmi-Shankhpushpi Fortified Pediatric Focus Gummies",
      productType: "Ayurveda-Aahara / Nutraceutical",
      classification: {
        category: "Ayurveda-Aahara / Nutraceutical",
        confidence: "HIGH",
        signals: ["Food gummy format", "Botanicals listed in Schedule A classical texts", "Mandatory dietary advisory compliant"],
        governingStatute: "Food Safety and Standards (Ayurveda Aahara) Regulations 2022 & FSSAI Act 2006",
        governingAuthority: "Food Safety and Standards Authority of India (FSSAI)",
        downstreamRoute: "FSSAI_AYURVEDA_AAHARA",
        missingSignals: []
      },
      ingredients: [
        {
          commonName: "Brahmi",
          botanicalName: "Bacopa monnieri (L.) Wettst.",
          sanskritName: "Brahmi",
          plantPart: "Whole herb",
          concentration: "100 mg / gummy",
          isBiologicalResource: true,
          isScheduleE1: false,
          classicalTreatiseReference: "Charaka Samhita, Sharirasthana",
          traditionalUse: "Medhya (intellect-promoting, memory revitalizing)"
        },
        {
          commonName: "Shankhpushpi",
          botanicalName: "Convolvulus pluricaulis Choisy",
          sanskritName: "Shankhpushpi",
          plantPart: "Whole plant",
          concentration: "50 mg / gummy",
          isBiologicalResource: true,
          isScheduleE1: false,
          classicalTreatiseReference: "Sushruta Samhita",
          traditionalUse: "Manasadoshahara (calming mental agitation, enhancing recall)"
        }
      ],
      formulation: "Chewable pectin gummy (Ayurveda-Aahara Food)",
      dosageForm: "Chewable gummy",
      manufacturingMethod: "Low-temperature vacuum confectionery deposition",
      intendedUse: "Supports memory retention, cognitive endurance, and concentration in growing children",
      therapeuticClaims: ["Cures ADHD, autism spectrum disorder, and guarantees 100% exam topper focus"],
      commercialClaims: ["Herbal dietary supplement supporting memory retention and everyday focus in children"],
      classicalReference: "Charaka Samhita & Sushruta Samhita",
      traditionalUse: "Medhya Rasayana",
      geographicOrigin: "Assam and West Bengal, India",
      applicantType: "Food-Tech Startup",
      targetMarkets: ["IN", "US", "UK"]
    },
    plainLanguageExplanation: "In plain words: Because this product is a chewable gummy food rather than a medicinal tablet, its fastest and cleanest legal path in India is under FSSAI Ayurveda-Aahara Regulations 2022. You cannot claim it 'cures ADHD' (which would trigger criminal penalties under DMRA 1954 and FSSAI advertising violations). You CAN protect your brand name with a trademark, safeguard your secret taste-masking recipe as a trade secret, and potentially patent the taste-masking technology if it involves novel structural encapsulation.",
    overview: {
      patentability: "LOW",
      traditionalKnowledge: "HIGH",
      regulatory: "LOW",
      marketEntry: "LOW",
      documentation: "LOW",
      filingReadinessScore: 90
    },
    classification: {
      category: "Ayurveda-Aahara / Nutraceutical",
      confidence: "HIGH",
      signals: ["Food gummy format", "Botanicals listed in Schedule A classical texts", "Mandatory dietary advisory compliant"],
      governingStatute: "Food Safety and Standards (Ayurveda Aahara) Regulations 2022 & FSSAI Act 2006",
      governingAuthority: "Food Safety and Standards Authority of India (FSSAI)",
      downstreamRoute: "FSSAI_AYURVEDA_AAHARA",
      missingSignals: []
    },
    multiIPStrategy: [
      {
        id: "ip-1",
        regime: "Trademark",
        relevant: true,
        risk: "LOW",
        why: "Consumer lifestyle brand trademark in Nice Class 29, 30, and Class 5.",
        whatToProtect: "Distinctive brand names (e.g., 'BrahmiBites™', 'MindSprout™').",
        recommendedAction: "File trademark applications for word mark and logo design across confectionery and health categories.",
        governingAuthority: "Trade Marks Registry",
        statuteRef: "Trade Marks Act 1999"
      },
      {
        id: "ip-2",
        regime: "Trade Secret",
        relevant: true,
        risk: "LOW",
        why: "Exact temperature-controlled pectin mixing ratio, pH buffering curve, and natural flavour blending protocol that eliminates bacoside bitterness.",
        whatToProtect: "Taste-masking formulation recipe and operating parameters.",
        recommendedAction: "Strict supply chain compartmentalization and vendor non-compete agreements.",
        governingAuthority: "Civil Courts",
        statuteRef: "Indian Contract Act 1872"
      },
      {
        id: "ip-3",
        regime: "Industrial Design",
        relevant: true,
        risk: "LOW",
        why: "Custom 3D gummy shape (e.g., stylized brain or leaf motif) and child-resistant pop-lock packaging container.",
        whatToProtect: "3D gummy shape and packaging dispenser design.",
        recommendedAction: "Register 3D industrial design before public launch.",
        governingAuthority: "Designs Office, Kolkata",
        statuteRef: "Designs Act 2000"
      },
      {
        id: "ip-4",
        regime: "Patent",
        relevant: false,
        risk: "HIGH",
        why: "General gummy compositions using known herbs face heavy Section 3(e) and 3(p) objections.",
        whatToProtect: "Taste-masking complex only if structurally novel.",
        recommendedAction: "Rely primarily on Trade Secret + Trademark rather than costly patent litigation.",
        governingAuthority: "Indian Patent Office",
        statuteRef: "Indian Patents Act Section 3(e)"
      },
      {
        id: "ip-5",
        regime: "Biological Resource / ABS",
        relevant: true,
        risk: "MEDIUM",
        why: "Bacopa monnieri and Convolvulus pluricaulis sourced from Indian biodiversity.",
        whatToProtect: "Compliance with State Biodiversity Board requirements.",
        recommendedAction: "Submit prior intimation to the concerned State Biodiversity Board (SBB) per Section 7.",
        governingAuthority: "State Biodiversity Board (SBB)",
        statuteRef: "Biological Diversity Act 2002 Section 7"
      }
    ],
    absAssessment: {
      relevance: "MEDIUM",
      biologicalResourceUsed: true,
      indianOriginResource: true,
      foreignParticipation: false,
      commercialUtilization: true,
      potentialObligation: "Section 7 prior intimation to State Biodiversity Board for commercial utilization by Indian citizens.",
      statuteRef: "Biological Diversity Act 2002, Section 7",
      authority: "State Biodiversity Board (SBB)",
      formRequired: "Form I (Prior intimation to SBB)",
      missingInformation: ["State of manufacturing plant"],
      recommendedNextStep: "Submit intimation to State Biodiversity Board in state of manufacture.",
      isConfirmedObligation: true
    },
    claimsCheck: [
      {
        claimText: "Cures ADHD, autism spectrum disorder, and guarantees 100% exam topper focus",
        riskLevel: "HIGH",
        violationType: "Disease Treatment / Cure Claim",
        governingStatute: "Drugs & Magic Remedies Act 1954 & FSSAI Advertising Regulations 2018",
        saferWording: "Ayurvedic herbal supplement formulated to support everyday focus, concentration, and calm learning in children."
      },
      {
        claimText: "Herbal dietary supplement supporting memory retention and everyday focus in children",
        riskLevel: "LOW",
        violationType: "Compliant Structure-Function",
        governingStatute: "FSSAI (Ayurveda Aahara) Regulations 2022",
        saferWording: "Herbal dietary supplement supporting memory retention and everyday focus in children."
      }
    ],
    expertReviewBrief: {
      executiveSummary: "Brahmi-Shankhpushpi Gummies represent an ideal commercial candidate under FSSAI Ayurveda-Aahara Regulations 2022. Patenting the gummy composition is high risk under Section 3(e)/(p); recommended strategy is aggressive Trademark protection, registered Industrial Design for the gummy shape, and Trade Secret protection for the taste-masking formulation.",
      keyLegalQuestions: [
        "Does our state SBB require ABS benefit-sharing fees on cultivated Brahmi herbs under the recent BDA 2023 amendment rules?"
      ],
      requiredFilings: [
        "FSSAI Central License under Ayurveda-Aahara category",
        "Class 29/30 Trademark applications",
        "3D Industrial Design registration"
      ],
      statutoryDeadlines: ["FSSAI license must be granted prior to commercial sale"],
      specialistConsultantType: "FSSAI Food Regulatory Consultant & Trademark Attorney"
    },
    whatIfSimulations: [
      {
        scenarioId: "sim-1",
        label: "Fortify with Synthetic Vitamins",
        changeDescription: "Add synthetic Vitamin B12 and zinc gluconate to the herbal gummy matrix.",
        originalPathway: "FSSAI Ayurveda-Aahara",
        simulatedPathway: "FSSAI General Health Supplements (Nutraceutical)",
        originalRisk: "LOW",
        simulatedRisk: "MEDIUM",
        impactAnalysis: "CRITICAL VIOLATION: Ayurveda-Aahara strictly prohibits synthetic vitamin fortification. Product loses authentic traditional Ayurveda-Aahara branding and must re-route through conventional nutraceutical channels."
      }
    ],
    traceSteps: [
      { stageNumber: 1, stageName: "Product Information Understood", status: "completed", summary: "Brahmi + Shankhpushpi chewable pectin gummy with proprietary taste-masking.", details: "Analyzed formulation and ingredients." },
      { stageNumber: 2, stageName: "Target Country / Market Identified", status: "completed", summary: "Primary India (IN) retail/e-commerce.", details: "Identified domestic wellness channel." },
      { stageNumber: 3, stageName: "Product Classification Assessed", status: "completed", summary: "Classified as Ayurveda-Aahara under FSSAI Regulations 2022.", details: "Downstream route: FSSAI_AYURVEDA_AAHARA." },
      { stageNumber: 4, stageName: "Multi-IP Strategy Mapped", status: "completed", summary: "Primary: Brand Trademark (Class 29/30/5) + 3D Shape Design + Trade Secret taste-masking.", details: "Optimized non-patent IP protection." },
      { stageNumber: 5, stageName: "ABS & Biological Resource Risk Evaluated", status: "completed", summary: "Section 7 SBB prior intimation for commercial food utilization.", details: "Evaluated domestic BDA compliance." },
      { stageNumber: 6, stageName: "Claims & Advertising Risk Screened", status: "flagged", summary: "Filtered prohibited ADHD/autism disease claims; established compliant wellness statements.", details: "Prevented severe FSSAI advertising violations." },
      { stageNumber: 7, stageName: "Decision Synthesized with Grounded Evidence", status: "completed", summary: "Readiness score: 90/100. Fast-track commercial readiness under FSSAI.", details: "Generated operational action items." }
    ],
    regulatoryChecklist: DEFAULT_REGULATORY_CHECKLIST,
    topRisks: [
      {
        id: "risk-1",
        risk: "Misbranding Risks under FSSAI Advertising Regulations 2018",
        severity: "HIGH",
        category: "Food Regulatory",
        mitigation: "Strictly adhere to general well-being statements and display mandatory Ayurveda-Aahara advisory."
      }
    ],
    actionPlan: [
      {
        priority: 1,
        step: "Apply for FSSAI Ayurveda-Aahara License on FoSCoS portal",
        authority: "FSSAI",
        deadlineDesc: "Month 1",
        category: "Regulatory Licensing"
      }
    ],
    missingInputs: ["Shelf-life moisture migration test in tropical packaging"],
    evidence: DEMO_EVIDENCE
  },
  {
    id: "manjistha-serum",
    name: "Manjistha-Bakuchiol Phyto-Retinol Night Renewal Serum",
    shortTag: "Manjistha Phyto-Retinol Serum",
    category: "Ayurvedic Cosmeceutical & Skincare",
    shortDesc: "Supercritical CO2 extracted Manjistha and Babchi (Bakuchiol 99%) botanical serum formulated in cold-pressed Kumkumadi oil matrix for topical skin radiance.",
    ingredients: [
      "Rubia cordifolia (Manjistha stem extract, purpurin-standardized)",
      "Psoralea corylifolia (Bakuchiol 99% pure isolate from Babchi seeds)",
      "Crocus sativus (Kashmir Saffron stigmata extract)",
      "Sesamum indicum (Cold-pressed Sesame seed oil carrier)"
    ],
    formulation: "Anhydrous active lipid facial elixir serum in UV-protective dropper bottles.",
    technicalNovelty: "Synergistic stabilization of Bakuchiol against photo-oxidation using Manjistha quinone polyphenols, delivering retinol-equivalent skin turnover without dermal erythema.",
    manufacturingProcess: "Supercritical fluid CO2 extraction at 280 bar / 45°C followed by vacuum lipid centrifugation.",
    intendedUse: "Topical application for hyperpigmentation reduction, skin texture refinement, and radiant glow.",
    applicantType: "D2C Cosmetics Enterprise",
    targetJurisdiction: "IN",
    productDNA: {
      id: "manjistha-serum",
      name: "Manjistha-Bakuchiol Phyto-Retinol Night Renewal Serum",
      productType: "Cosmetic",
      classification: {
        category: "Cosmetic",
        confidence: "HIGH",
        signals: ["Topical aesthetic application", "Beautifying & appearance enhancing claims", "Cosmetics Rules 2020 compliance"],
        governingStatute: "Cosmetics Rules 2020 & Drugs and Cosmetics Act 1940 Section 3(aaa)",
        governingAuthority: "CDSCO & State Licensing Authority",
        downstreamRoute: "COSMETICS_RULES",
        missingSignals: []
      },
      ingredients: [
        {
          commonName: "Manjistha",
          botanicalName: "Rubia cordifolia L.",
          sanskritName: "Manjistha",
          plantPart: "Dried stem",
          concentration: "2.0%",
          isBiologicalResource: true,
          isScheduleE1: false,
          classicalTreatiseReference: "Charaka Samhita, Varnya Mahakashaya",
          traditionalUse: "Varnya (complexion promoting, skin brightening)"
        },
        {
          commonName: "Bakuchiol (Babchi isolate)",
          botanicalName: "Psoralea corylifolia L.",
          sanskritName: "Bakuchi",
          plantPart: "Purified seed isolate",
          concentration: "1.0%",
          isBiologicalResource: true,
          isScheduleE1: false,
          classicalTreatiseReference: "Sushruta Samhita",
          traditionalUse: "Kushthaghna, Twachya (skin rejuvenation)"
        }
      ],
      formulation: "Anhydrous active lipid facial serum",
      dosageForm: "Topical oil serum",
      manufacturingMethod: "Supercritical CO2 fluid extraction and sterile cold filtration",
      intendedUse: "Topical skin rejuvenation, hyperpigmentation fading, and barrier enhancement",
      therapeuticClaims: ["Permanently cures psoriasis, chronic melasma, and eliminates all facial wrinkles"],
      commercialClaims: ["Clinical phyto-retinol alternative that smooths skin texture, reduces the look of dark spots, and promotes radiant skin"],
      classicalReference: "Charaka Samhita (Varnya Mahakashaya)",
      traditionalUse: "Varnya & Twachya (skin luminosity)",
      geographicOrigin: "Uttarakhand and Kashmir, India",
      applicantType: "D2C Cosmetics Enterprise",
      targetMarkets: ["IN", "US", "EU", "UAE"]
    },
    plainLanguageExplanation: "In plain words: Skincare products in India that cleanse, beautify, or alter appearance without claiming to cure skin diseases are regulated as Cosmetics under the Cosmetics Rules 2020. You cannot advertise that this serum 'cures chronic melasma or psoriasis' because that would reclassify it as a drug and trigger DMRA violations. You CAN patent the specific chemical stabilization of Bakuchiol by Manjistha polyphenols if it prevents degradation, register your trademark brand, and protect your bottle industrial design. NBA Form III clearance is required for patenting because Indian botanicals are utilized.",
    overview: {
      patentability: "MEDIUM",
      traditionalKnowledge: "MEDIUM",
      regulatory: "LOW",
      marketEntry: "LOW",
      documentation: "LOW",
      filingReadinessScore: 86
    },
    classification: {
      category: "Cosmetic",
      confidence: "HIGH",
      signals: ["Topical aesthetic application", "Beautifying & appearance enhancing claims", "Cosmetics Rules 2020 compliance"],
      governingStatute: "Cosmetics Rules 2020 & Drugs and Cosmetics Act 1940 Section 3(aaa)",
      governingAuthority: "CDSCO & State Licensing Authority",
      downstreamRoute: "COSMETICS_RULES",
      missingSignals: []
    },
    multiIPStrategy: [
      {
        id: "ip-1",
        regime: "Patent",
        relevant: true,
        risk: "MEDIUM",
        why: "Formulation patent claiming the specific polyphenol-to-meroterpene molar ratio that stabilizes Bakuchiol against photochemical degradation.",
        whatToProtect: "Novel chemical stabilization matrix of Bakuchiol.",
        recommendedAction: "File patent application with photostability kinetic degradation curves comparing stabilized vs unstabilized Bakuchiol.",
        governingAuthority: "Indian Patent Office",
        statuteRef: "Indian Patents Act Section 3(e)"
      },
      {
        id: "ip-2",
        regime: "Trademark",
        relevant: true,
        risk: "LOW",
        why: "Premium beauty brand name and logo in Nice Class 3 (Cosmetics and cleaning preparations).",
        whatToProtect: "Brand names (e.g., 'PhytoRadiancy™', 'VarnyaBotanics™').",
        recommendedAction: "File Class 3 trademark application immediately.",
        governingAuthority: "Trade Marks Registry",
        statuteRef: "Trade Marks Act 1999"
      },
      {
        id: "ip-3",
        regime: "Industrial Design",
        relevant: true,
        risk: "LOW",
        why: "Proprietary frosted glass dropper bottle design with gradient emerald-amber tinting and ergonomic pipette collar.",
        whatToProtect: "Aesthetic glass bottle contour and dropper pipette shape.",
        recommendedAction: "File design registration prior to Instagram or commercial e-commerce reveal.",
        governingAuthority: "Designs Office, Kolkata",
        statuteRef: "Designs Act 2000, Locarno Class 09-01"
      },
      {
        id: "ip-4",
        regime: "Trade Secret",
        relevant: true,
        risk: "LOW",
        why: "Supercritical CO2 fractional separation pressure and temperature setpoints.",
        whatToProtect: "Extraction parameters and cold-filtration protocol.",
        recommendedAction: "Maintain strict equipment access protocols at manufacturing facility.",
        governingAuthority: "Civil Courts",
        statuteRef: "Indian Contract Act 1872"
      },
      {
        id: "ip-5",
        regime: "Biological Resource / ABS",
        relevant: true,
        risk: "HIGH",
        why: "Rubia cordifolia and Psoralea corylifolia harvested in India.",
        whatToProtect: "Statutory legitimacy of export and patent claims.",
        recommendedAction: "File Form III with National Biodiversity Authority for patenting or foreign export.",
        governingAuthority: "National Biodiversity Authority (NBA)",
        statuteRef: "Biological Diversity Act 2002 Section 6(1)"
      }
    ],
    absAssessment: {
      relevance: "HIGH",
      biologicalResourceUsed: true,
      indianOriginResource: true,
      foreignParticipation: false,
      commercialUtilization: true,
      potentialObligation: "Form III clearance prior to grant of patent or commercial exploitation outside India.",
      statuteRef: "Biological Diversity Act 2002, Section 6(1)",
      authority: "National Biodiversity Authority (NBA)",
      formRequired: "Form III (Approval for IPR on biological resource)",
      missingInformation: ["Export packaging distributor verification"],
      recommendedNextStep: "Submit Form III to NBA Chennai.",
      isConfirmedObligation: true
    },
    claimsCheck: [
      {
        claimText: "Permanently cures psoriasis, chronic melasma, and eliminates all facial wrinkles",
        riskLevel: "HIGH",
        violationType: "Disease Treatment / Cure Claim",
        governingStatute: "Drugs & Magic Remedies Act 1954 & Cosmetics Rules 2020",
        saferWording: "Formulated with Bakuchiol and Manjistha to visually brighten skin appearance, diminish the look of dark spots, and smooth fine lines."
      },
      {
        claimText: "Clinical phyto-retinol alternative that smooths skin texture, reduces the look of dark spots, and promotes radiant skin",
        riskLevel: "LOW",
        violationType: "Compliant Structure-Function",
        governingStatute: "Cosmetics Rules 2020 & ASCI Guidelines",
        saferWording: "Clinical phyto-retinol alternative that smooths skin texture, reduces the look of dark spots, and promotes radiant skin."
      }
    ],
    expertReviewBrief: {
      executiveSummary: "Manjistha-Bakuchiol Serum represents a commercially lucrative crossover between traditional Ayurvedic knowledge (Varnya Mahakashaya) and modern clean beauty cosmeceuticals. Regulated cleanly as a Cosmetic under Cosmetics Rules 2020. The technical stabilization of Bakuchiol provides a viable patent claim; design registration for the custom dropper bottle will safeguard shelf appeal.",
      keyLegalQuestions: [
        "Does our dermatological HRIPT study satisfy the substantiation burden for 'clinically tested' claims under ASCI beauty guidelines?"
      ],
      requiredFilings: [
        "Cosmetic Manufacturing License application (Form COS-8)",
        "Class 3 Trademark and 3D Bottle Design applications",
        "NBA Form III application for stabilization formulation patent"
      ],
      statutoryDeadlines: ["Form COS-8 required before manufacturing commercial batches"],
      specialistConsultantType: "Cosmetics Regulatory Specialist & Design Patent Attorney"
    },
    whatIfSimulations: [
      {
        scenarioId: "sim-1",
        label: "Claim Eczema and Psoriasis Cure",
        changeDescription: "Change packaging label to claim cure for eczema and psoriasis.",
        originalPathway: "Cosmetics Rules 2020",
        simulatedPathway: "Unlicensed Drug under Drugs & Cosmetics Act",
        originalRisk: "LOW",
        simulatedRisk: "HIGH",
        impactAnalysis: "DISASTROUS REGULATORY FALLOUT: Product immediately stripped of Cosmetic status. Reclassified as an unapproved drug under Section 3(b), resulting in product seizure and criminal charges."
      }
    ],
    traceSteps: [
      { stageNumber: 1, stageName: "Product Information Understood", status: "completed", summary: "CO2 extracted Manjistha + 99% Bakuchiol in lipid carrier for topical skincare.", details: "Analyzed cosmetic formulation parameters." },
      { stageNumber: 2, stageName: "Target Country / Market Identified", status: "completed", summary: "Primary India (IN) D2C beauty with export roadmap (US, EU, UAE).", details: "Assessed cosmetics regulations in target regions." },
      { stageNumber: 3, stageName: "Product Classification Assessed", status: "completed", summary: "Classified as Cosmetic under Cosmetics Rules 2020.", details: "Downstream route: COSMETICS_RULES." },
      { stageNumber: 4, stageName: "Multi-IP Strategy Mapped", status: "completed", summary: "Formulation patent (Bakuchiol chemical stabilization), Class 3 Trademark, 3D Bottle Industrial Design.", details: "Mapped comprehensive IP suite." },
      { stageNumber: 5, stageName: "ABS & Biological Resource Risk Evaluated", status: "warning", summary: "Form III required for patenting Indian botanical isolates.", details: "Biological Diversity Act clearance needed." },
      { stageNumber: 6, stageName: "Claims & Advertising Risk Screened", status: "flagged", summary: "Filtered prohibited melasma/psoriasis cures; confirmed cosmetic brightening claims.", details: "Strictly aligned with cosmetic appearance guidelines." },
      { stageNumber: 7, stageName: "Decision Synthesized with Grounded Evidence", status: "completed", summary: "Readiness score: 86/100. Commercial launch ready under Cosmetics Rules 2020.", details: "High commercial readiness." }
    ],
    regulatoryChecklist: DEFAULT_REGULATORY_CHECKLIST,
    topRisks: [
      {
        id: "risk-1",
        risk: "Psoralen Phototoxicity Safety Threshold",
        severity: "HIGH",
        category: "Safety & Compliance",
        mitigation: "Include certified HPLC batch analysis verifying psoralens < 50 ppm with every manufacturing release."
      }
    ],
    actionPlan: [
      {
        priority: 1,
        step: "Apply for Cosmetic Manufacturing License (Form COS-8)",
        authority: "State Licensing Authority",
        deadlineDesc: "Month 1",
        category: "Cosmetics Regulatory"
      }
    ],
    missingInputs: ["Accelerated photostability testing data at 40°C/75% RH"],
    evidence: DEMO_EVIDENCE
  }
];
