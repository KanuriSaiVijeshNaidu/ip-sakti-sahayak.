import { ProductInput } from "@/types/productIntelligence";

export interface ProductPreset extends ProductInput {
  presetId: string;
  badge: string;
  shortSummary: string;
  avatarIcon: string;
}

export const PRODUCT_PRESETS: ProductPreset[] = [
  {
    presetId: "preset-ashwagandha-nano",
    badge: "Bioavailability Nano-Delivery",
    shortSummary: "Standardized Withania extract in self-emulsifying liposomal softgel for 4.8x higher AUC bioavailability.",
    avatarIcon: "FlaskConical",
    productName: "Ashwagandha Nano-Emulsion Bio-Complex",
    brandName: "NeuroVeda NanoLipid",
    productType: "Proprietary Ayurvedic Medicine / Liposomal Softgel",
    ingredients: [
      "Withania somnifera standardized root extract (5% withanolides) - 500mg",
      "Piperine extract (Piper longum / nigrum, 95% alkaloid fraction) - 5mg",
      "Medium Chain Triglycerides (Phytolipid carrier matrix) - 250mg",
      "Sunflower Lecithin (Phospholipid emulsifier) - 100mg"
    ],
    formulation: "Self-emulsifying nano-liposomal softgel dispersion with sub-100nm droplet size",
    extractionMethod: "Supercritical CO2 extraction followed by hydro-ethanolic crystallization",
    manufacturingMethod: "High-pressure homogenization at 1200 bar under nitrogen blanketing",
    intendedUse: "Adaptogenic neural resilience, sleep architecture optimization, and cortisol modulation",
    technicalEffect: "Demonstrated 4.8x higher systemic AUC bioavailability compared to unformulated ashwagandha churna in human crossover pharmacokinetic trial",
    healthClaims: [
      "Supports resistance to stress and helps normalize evening serum cortisol levels",
      "Promotes deep restorative sleep architecture and mental vitality",
      "Supports cognitive stamina and executive focus during fatigue"
    ],
    marketingClaims: [
      "Advanced Phytosomal Nano-Delivery",
      "Standardized to 5% withanolides",
      "Clinically proven enhanced bioavailability"
    ],
    classicalReference: "Bhavaprakasha Nighantu, Guduchyadi Varga (Ashwagandha - Balya & Rasayana); Charaka Samhita Sutrasthana Ch. 4",
    biologicalOrigin: "India (Rajasthan & Madhya Pradesh native cultivation)",
    manufacturingLocation: "Gujarat, India (Schedule T GMP certified facility)",
    targetMarkets: ["IN", "US", "EU", "JP"],
    applicantType: "Ayurvedic Biotech Enterprise",
    existingIP: "Indian Provisional Patent Filed for Nano-Emulsion Carrier Matrix (App No. 202411098231)",
    notes: "Demonstrates synergistic bioavailability enhancement with piperine. Requires NBA Form III for PCT filing."
  },
  {
    presetId: "preset-curcumin-phytosome",
    badge: "Dual Botanical Synergy",
    shortSummary: "Phosphatidylcholine-curcumin complex paired with Boswellia AKBA for joint comfort and anti-inflammatory action.",
    avatarIcon: "Layers",
    productName: "Curcumin Phytosome Joint Shield",
    brandName: "CurcuShield PhytoFlex",
    productType: "Nutraceutical / Enteric Vegetable Capsule",
    ingredients: [
      "Curcuma longa rhizome extract (95% curcuminoids) - 250mg",
      "Phosphatidylcholine complex (Soy-free sunflower source) - 250mg",
      "Boswellia serrata gum resin extract (30% AKBA) - 100mg",
      "Zingiber officinale (Ginger rhizome gingerols 5%) - 50mg"
    ],
    formulation: "Enteric coated targeted-release hydroxypropyl methylcellulose (HPMC) capsule",
    extractionMethod: "Selective solvent fractionation and vacuum spray drying",
    manufacturingMethod: "Molecular complexation in anhydrous ethanol followed by co-lyophilization",
    intendedUse: "Joint cartilage support, systemic anti-inflammatory response, and exercise recovery",
    technicalEffect: "Complexation creates amphiphilic phytosomes increasing lipophilic curcumin intestinal permeation by 29-fold",
    healthClaims: [
      "Promotes joint comfort, flexibility, and physical ease",
      "Supports healthy inflammatory cascade response in connective tissue",
      "Protects cellular membranes from oxidative lipid peroxidation"
    ],
    marketingClaims: [
      "Phytosome Enhanced Absorption",
      "Standardized AKBA + Curcuminoid Synergy",
      "Gastro-Resistant Targeted Intestinal Delivery"
    ],
    classicalReference: "Charaka Samhita Chikitsasthana Ch. 28; Sushruta Samhita Sutrasthana (Haridra & Sallaki)",
    biologicalOrigin: "India (Kerala and Karnataka native reserves)",
    manufacturingLocation: "Karnataka, India (WHO-GMP certified facility)",
    targetMarkets: ["IN", "US", "EU"],
    applicantType: "Botanical Pharmaceuticals Ltd",
    existingIP: "PCT International Application under preparation",
    notes: "Dual botanical synergy (Curcuma + Boswellia). FSSAI Ayurveda Aahara compliant for India."
  },
  {
    presetId: "preset-triphala-enteric",
    badge: "Classical Recipe in Novel Carrier",
    shortSummary: "Ancient 1:1:1 ratio in pH-targeted gastro-resistant caplets bypassing stomach acid to reach the colon intact.",
    avatarIcon: "ShieldCheck",
    productName: "Triphala Gastro-Resistant Colon Modulator",
    brandName: "Triguna ColonCare",
    productType: "Classical Formulation in Novel Delivery Form / Caplet",
    ingredients: [
      "Phyllanthus emblica (Amalaki fruit pericarp) - 250mg",
      "Terminalia chebula (Haritaki fruit pericarp) - 250mg",
      "Terminalia bellirica (Bibhitaki fruit pericarp) - 250mg",
      "Gastro-resistant plant cellulose coating - 35mg"
    ],
    formulation: "pH-sensitive enteric coated biphasic release caplets targeting terminal ileum and colon",
    extractionMethod: "Hydro-ethanolic triple decoction according to AFI standardized method",
    manufacturingMethod: "Fluid bed granulation followed by aqueous polymer film coating",
    intendedUse: "Colonic motility, microbiome diversity enrichment, and gentle gastrointestinal detoxification",
    technicalEffect: "Bypasses gastric acid degradation, ensuring 92% intact polyphenols reach distal gut microbiota",
    healthClaims: [
      "Supports daily natural bowel regularity and colon health",
      "Nourishes beneficial bifidobacteria and gut microbiome equilibrium",
      "Provides potent broad-spectrum antioxidant protection"
    ],
    marketingClaims: [
      "Classical 1:1:1 Sacred Ratio",
      "Gastric Acid Protected Caplets",
      "Gentle Daily Colon Cleanse"
    ],
    classicalReference: "Charaka Samhita Sutrasthana Ch. 25; Bhavaprakasha Nighantu, Haritakyadi Varga",
    biologicalOrigin: "India (Western Ghats wild harvest)",
    manufacturingLocation: "Maharashtra, India (Schedule T GMP)",
    targetMarkets: ["IN", "US", "WO"],
    applicantType: "Traditional Knowledge Herbals Pvt Ltd",
    existingIP: "None yet — evaluating formulation patent vs classical proprietary license",
    notes: "Classical Triphala composition. Process/coating is novel; herbal ratio is classical prior art."
  },
  {
    presetId: "preset-brahmi-chewable",
    badge: "Taste-Masked Functional Confection",
    shortSummary: "Micro-encapsulated Bacopa monnieri chewable gummy eliminating bitter taste for cognitive stamina and focus.",
    avatarIcon: "Sparkles",
    productName: "Brahmi Memory & Focus Chewable",
    brandName: "MedhyaBrite Chewables",
    productType: "Functional Confectionery / Pectin Gummy",
    ingredients: [
      "Bacopa monnieri whole plant extract (20% bacosides A&B) - 300mg",
      "Centella asiatica (Mandukaparni standardized leaf extract 10% asiaticosides) - 150mg",
      "Citrus bioflavonoids & Natural berry juice concentrate - 1200mg",
      "Apple pectin base & Organic tapioca syrup - 1800mg"
    ],
    formulation: "Gelatin-free pectin chewable gummy with micro-encapsulated bitter herbal fraction",
    extractionMethod: "Low-temperature ultrasonic assisted water extraction",
    manufacturingMethod: "Continuous starchless depositing into silicone molding lines",
    intendedUse: "Cognitive retention, executive attention span, and mental clarity under academic/work stress",
    technicalEffect: "Micro-encapsulation masks intense herbal bitterness while preserving bacoside thermal stability up to 90°C",
    healthClaims: [
      "Supports cognitive function, memory acquisition, and learning speed",
      "Helps sustain alertness and focused concentration during mental work",
      "Promotes natural mental tranquility and calmness"
    ],
    marketingClaims: [
      "Tasty Berry Chewable — Zero Bitter Aftertaste",
      "Pure Medhya Rasayana Synergy",
      "Sugar-Free, 100% Vegan Pectin"
    ],
    classicalReference: "Charaka Samhita Chikitsasthana Ch. 1-3 (Medhya Rasayana Rasayana Adhyaya)",
    biologicalOrigin: "India (Assam and West Bengal wetlands)",
    manufacturingLocation: "Himachal Pradesh, India",
    targetMarkets: ["IN", "US", "JP"],
    applicantType: "Modern Ayurveda Innovations LLP",
    existingIP: "Design patent for gummy geometry; Provisional for bitter-masking formulation",
    notes: "High market potential in US and Japan as functional supplement / health food."
  }
];
