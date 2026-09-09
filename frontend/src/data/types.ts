export type SourceType = 
  | "official" 
  | "government" 
  | "registry" 
  | "primary-law" 
  | "academic" 
  | "secondary" 
  | "demo" 
  | "unverified";

export type TrustLevel = 
  | "official" 
  | "secondary" 
  | "demo" 
  | "unverified";

export type QualitativeRisk = 
  | "LOW" 
  | "MEDIUM" 
  | "HIGH" 
  | "UNKNOWN";

export type ComplianceStatus = 
  | "compliant" 
  | "review_required" 
  | "missing_documentation" 
  | "action_needed";

export type SourceStatus = 
  | "current" 
  | "superseded" 
  | "draft" 
  | "historical" 
  | "unknown";

export type ProductClassification = 
  | "Classical / Generic Ayurvedic Medicine"
  | "Patent / Proprietary Ayurvedic Medicine"
  | "New / Non-Classical Drug"
  | "Phytopharmaceutical"
  | "Ayurveda-Aahara / Nutraceutical"
  | "Cosmetic"
  | "Other / Unclear"
  | "Unknown / Requires Expert Review";

export type DownstreamRoute = 
  | "FSSAI_AYURVEDA_AAHARA" 
  | "AYUSH_DRUGS_COSMETICS" 
  | "CDSCO_NEW_DRUG" 
  | "COSMETICS_RULES" 
  | "EXPERT_CLARIFICATION";

export interface EvidenceItem {
  id: string;
  title: string;
  sourceName: string;
  sourceAuthority?: string;
  sourceType: SourceType;
  trustLevel: TrustLevel;
  jurisdiction: string;
  documentType: string;
  referenceNumber?: string;
  section?: string;
  publicationDate?: string;
  effectiveDate?: string;
  lastVerified?: string;
  retrievedAt?: string;
  url?: string;
  excerpt?: string;
  relevanceScore?: number;
  confidence?: number;
  tags?: string[];
  status?: SourceStatus;
}

export interface AssessmentRule {
  id: string;
  name: string;
  jurisdiction: string;
  category: "patentability" | "traditional_knowledge" | "regulatory" | "market_entry" | "biodiversity" | "multi_ip";
  description: string;
  applicability: string;
  severity: "low" | "medium" | "high";
  source?: EvidenceItem;
  recommendation: string;
}

export interface RegulatoryChecklistItem {
  id: string;
  area: string;
  label: string;
  status: ComplianceStatus;
  reason: string;
  requiredDocument: string;
  sourceStatute: string;
  jurisdiction: string;
  nextAction: string;
}

export interface AnalysisTraceStep {
  stageNumber: number;
  stageName: string;
  status: "completed" | "warning" | "flagged";
  summary: string;
  details: string;
  statuteRef?: string;
  evidenceId?: string;
}

export interface TopRiskItem {
  id: string;
  risk: string;
  severity: "HIGH" | "MEDIUM" | "LOW";
  category: string;
  mitigation: string;
}

export interface ActionPlanItem {
  priority: number;
  step: string;
  authority: string;
  deadlineDesc: string;
  category: string;
}

export interface ProductClassificationResult {
  category: ProductClassification;
  confidence: "HIGH" | "MEDIUM" | "LOW";
  signals: string[];
  governingStatute: string;
  governingAuthority: string;
  downstreamRoute: DownstreamRoute;
  missingSignals: string[];
  sourceEvidenceId?: string;
}

export interface IngredientInfo {
  commonName: string;
  botanicalName: string;
  sanskritName?: string;
  plantPart?: string;
  concentration?: string;
  isBiologicalResource: boolean;
  isScheduleE1: boolean;
  classicalTreatiseReference?: string;
  traditionalUse?: string;
}

export interface MultiIPRegime {
  id: string;
  regime: 
    | "Patent" 
    | "Trademark" 
    | "Geographical Indication" 
    | "Copyright" 
    | "Industrial Design" 
    | "Trade Secret" 
    | "Plant Variety Protection" 
    | "Traditional Knowledge Safeguards" 
    | "Biological Resource / ABS";
  relevant: boolean;
  risk: QualitativeRisk;
  why: string;
  whatToProtect: string;
  recommendedAction: string;
  governingAuthority: string;
  statuteRef: string;
}

export interface ABSAssessment {
  relevance: QualitativeRisk;
  biologicalResourceUsed: boolean;
  indianOriginResource: boolean;
  foreignParticipation: boolean;
  commercialUtilization: boolean;
  potentialObligation: string;
  statuteRef: string;
  authority: string;
  formRequired: string;
  missingInformation: string[];
  recommendedNextStep: string;
  isConfirmedObligation: boolean;
}

export interface ClaimsRiskCheck {
  claimText: string;
  riskLevel: QualitativeRisk;
  violationType: 
    | "Disease Treatment / Cure Claim" 
    | "Exaggerated Efficacy" 
    | "Misleading Certainty" 
    | "Compliant Structure-Function";
  governingStatute: string;
  saferWording: string;
}

export interface ExpertReviewBrief {
  executiveSummary: string;
  keyLegalQuestions: string[];
  requiredFilings: string[];
  statutoryDeadlines: string[];
  specialistConsultantType: string;
}

export interface WhatIfSimulation {
  scenarioId: string;
  label: string;
  changeDescription: string;
  originalPathway: string;
  simulatedPathway: string;
  originalRisk: QualitativeRisk;
  simulatedRisk: QualitativeRisk;
  impactAnalysis: string;
}

export interface ProductDNA {
  id: string;
  name: string;
  productType?: string;
  classification: ProductClassificationResult;
  ingredients: IngredientInfo[];
  formulation?: string;
  dosageForm?: string;
  preparationMethod?: string;
  manufacturingMethod?: string;
  intendedUse?: string;
  therapeuticClaims?: string[];
  commercialClaims?: string[];
  classicalReference?: string;
  traditionalUse?: string;
  geographicOrigin?: string;
  sourceCommunity?: string;
  applicantType?: string;
  targetMarkets?: string[];
  notes?: string;
}

export interface SourceRegistryRecord {
  sourceId: string;
  authority: string;
  domain: string;
  category: string;
  jurisdiction: string;
  documentType: string;
  officialUrl: string;
  accessMethod: "Public Web" | "Open Access Gazette" | "Authorized Access Only";
  lastChecked: string;
  updateFrequency: string;
  allowedForRetrieval: boolean;
  notes: string;
}

export interface EvaluationCase {
  id: string;
  category: string;
  query: string;
  expectedIntent: string;
  expectedJurisdiction: string;
  expectedClassification?: ProductClassification;
  expectedSourceIds: string[];
  expectedOutcome: string;
  shouldAbstain: boolean;
}

export interface DemoScenario {
  id: string;
  name: string;
  shortTag: string;
  category: string;
  shortDesc: string;
  ingredients?: string[];
  formulation?: string;
  technicalNovelty?: string;
  manufacturingProcess?: string;
  intendedUse?: string;
  applicantType?: string;
  targetJurisdiction?: string;
  productDNA: ProductDNA;
  plainLanguageExplanation: string;
  overview: {
    patentability: QualitativeRisk;
    traditionalKnowledge: QualitativeRisk;
    regulatory: QualitativeRisk;
    marketEntry: QualitativeRisk;
    documentation: QualitativeRisk;
    filingReadinessScore: number;
  };
  classification: ProductClassificationResult;
  multiIPStrategy: MultiIPRegime[];
  absAssessment: ABSAssessment;
  claimsCheck: ClaimsRiskCheck[];
  expertReviewBrief: ExpertReviewBrief;
  whatIfSimulations: WhatIfSimulation[];
  traceSteps: AnalysisTraceStep[];
  regulatoryChecklist: RegulatoryChecklistItem[];
  topRisks: TopRiskItem[];
  actionPlan: ActionPlanItem[];
  missingInputs: string[];
  evidence: EvidenceItem[];
}
