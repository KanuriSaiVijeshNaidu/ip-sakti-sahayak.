export type JurisdictionCode = "IN" | "US" | "EU" | "JP" | "WO" | "GB" | "CA";

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | "UNKNOWN";

export type ReadinessLevel = "READY" | "CONDITIONAL" | "REQUIRES_VERIFICATION" | "BLOCKED" | "INSUFFICIENT_EVIDENCE";

export interface NormalizedIngredient {
  commonName: string;
  botanicalName?: string | null;
  sanskritName?: string | null;
  plantPart?: string | null;
  concentration?: string | null;
  isBiologicalResource: boolean;
  isScheduleE1?: boolean;
  classicalTreatiseReference?: string | null;
  traditionalUse?: string | null;
}

export interface ProductInput {
  productName: string;
  brandName?: string;
  productType: string;
  applicantType?: string;
  ingredients: string[];
  formulation?: string;
  extractionMethod?: string;
  manufacturingMethod?: string;
  intendedUse?: string;
  technicalEffect?: string;
  healthClaims: string[];
  marketingClaims: string[];
  classicalReference?: string;
  biologicalResources?: string[];
  biologicalOrigin?: string;
  manufacturingLocation?: string;
  existingIP?: string;
  notes?: string;
  targetMarkets: JurisdictionCode[];
  userLanguage?: string;
}

export interface ProductDNA {
  productId: string;
  productName: string;
  brandName: string | null;
  productType: string;
  ingredients: string[];
  normalizedIngredients: NormalizedIngredient[];
  botanicalNames: string[];
  plantParts: string[];
  formulation: string | null;
  extractionMethod: string | null;
  manufacturingMethod: string | null;
  intendedUse: string | null;
  technicalEffect: string | null;
  healthClaims: string[];
  marketingClaims: string[];
  classicalReference: string | null;
  biologicalResources: string[];
  biologicalOrigin: string | null;
  manufacturingLocation: string | null;
  targetMarkets: JurisdictionCode[];
  applicantType: string | null;
  existingIP: string | null;
  notes: string | null;
  createdAt: string;
}

export interface EvidenceItem {
  evidenceId: string;
  sourceId: string;
  authority: string;
  jurisdiction: JurisdictionCode | string;
  title: string;
  documentType: string;
  section: string;
  relevantText: string;
  relevanceScore: number;
  verified: boolean;
  sourceURL?: string | null;
}

export interface MarketClassification {
  jurisdiction: JurisdictionCode;
  marketName: string;
  category: string;
  governingAuthority: string;
  governingStatute: string;
  confidence: "HIGH" | "MEDIUM" | "LOW";
  reasoning: string;
  signals: string[];
  missingSignals: string[];
  evidence: EvidenceItem[];
  unresolvedQuestions: string[];
}

export interface PatentPriorArtItem {
  patentNumber: string;
  title: string;
  jurisdiction: string;
  relevanceType: "Related Patent" | "Potentially Relevant Prior Art" | "Potential Claim Overlap";
  keyRelevance: string;
  score: number;
}

export interface PatentabilityAnalysis {
  noveltyVerdict: "LIKELY_NOVEL" | "CONDITIONAL_NOVELTY" | "PRIOR_ART_CHALLENGE" | "UNKNOWN";
  noveltyReasoning: string;
  inventiveStepVerdict: "DEMONSTRABLE_SYNERGY" | "BORDERLINE" | "MERE_ADMIXTURE_RISK";
  inventiveStepReasoning: string;
  statutoryBars: {
    barName: string;
    jurisdiction: string;
    applicable: boolean;
    reasoning: string;
    statutoryChunk?: string;
  }[];
  disclosureRequirements: string;
  recommendedClaimStrategy: string;
}

export interface FTOAnalysis {
  preliminaryRisk: RiskLevel;
  verdictLabel: "Preliminary FTO Risk Scan — Low" | "Preliminary FTO Risk Scan — Medium" | "Preliminary FTO Risk Scan — High" | "Requires Comprehensive Clearance";
  disclaimer: string;
  identifiedPatents: PatentPriorArtItem[];
  potentialClaimOverlapNotes: string;
  activeRightsCaveat: string;
}

export interface TrademarkAnalysis {
  brandEvaluated: string;
  genericHerbalBanRisk: RiskLevel;
  genericHerbalBanNotes: string;
  descriptiveRefusalRisk: RiskLevel;
  niceClassRecommendations: { classNumber: number; description: string; recommended: boolean }[];
  phoneticTransliterationConflicts: string[];
  officialRegisterStatus: string;
}

export interface OtherIPAnalysis {
  geographicalIndications: {
    status: string;
    relevantGI: string | null;
    notes: string;
  };
  copyright: {
    status: "NOT_AVAILABLE";
    notes: string;
  };
  design: {
    status: "NOT_AVAILABLE";
    notes: string;
  };
  tradeSecrets: {
    recommendation: string;
    elementsToKeepSecret: string[];
  };
  plantVarieties: {
    status: string;
    notes: string;
  };
}

export interface TraditionalKnowledgeAnalysis {
  classicalAyurvedaRelevance: RiskLevel;
  treatiseOverlapIdentified: boolean;
  tkdlAccessStatus: "Potential traditional-knowledge relevance detected. Exact TKDL verification requires authorized access.";
  priorArtDefenseNotes: string;
  permittedEvidence: EvidenceItem[];
}

export interface ABSAnalysis {
  biologicalResourceOrigin: string;
  isIndianBioResource: boolean;
  nbaApprovalRequired: boolean;
  formType: "Form III (IP Application)" | "Form I (Commercial Utilization)" | "Exempted / Not Required" | "Nagoya Protocol (Foreign)";
  reasoning: string;
  regulatoryReference: string;
}

export interface MarketEntryDetails {
  jurisdiction: JurisdictionCode;
  marketName: string;
  classification: string;
  regulator: string;
  framework: string;
  registrationRequirements: string[];
  manufacturingStandards: string;
  labelingRules: string[];
  claimsAllowed: string[];
  importRules: string;
  evidence: EvidenceItem[];
}

export interface ClaimRiskItem {
  originalClaim: string;
  market: JurisdictionCode;
  marketName: string;
  riskLevel: RiskLevel;
  reason: string;
  evidenceReference: string;
  saferWording: string;
  recommendedAction: string;
}

export interface GlobalRiskSummary {
  jurisdiction: JurisdictionCode;
  marketName: string;
  patentRisk: RiskLevel;
  ftoRisk: RiskLevel;
  trademarkRisk: RiskLevel;
  tkRisk: RiskLevel;
  absRisk: RiskLevel;
  regulatoryRisk: RiskLevel;
  claimsRisk: RiskLevel;
  evidenceCoverageRisk: RiskLevel;
  overallMarketRisk: RiskLevel;
}

export interface LaunchReadinessAssessment {
  overallScore: number;
  overallVerdict: ReadinessLevel;
  marketReadiness: {
    jurisdiction: JurisdictionCode;
    marketName: string;
    score: number;
    status: ReadinessLevel;
    summary: string;
    criticalBlockers: string[];
  }[];
  actionPlan: {
    phase: string;
    timeframe: string;
    action: string;
    owner: string;
  }[];
}

export interface RelatedDiscovery {
  id: string;
  category: "PATENT_CONFLICT" | "TRADEMARK_ALERT" | "ABS_MANDATE" | "CLAIM_RESTRICTION" | "PROTECTION_OPPORTUNITY" | "DATA_LIMITATION";
  title: string;
  description: string;
  severity: "INFO" | "WARNING" | "CRITICAL";
  statutoryBasis?: string;
  actionRequired: string;
}

export interface AnalysisTraceStep {
  stepNumber: number;
  stepName: string;
  status: "COMPLETED" | "PARTIAL" | "SKIPPED";
  durationMs: number;
  details: string;
}

export interface ProductIntelligenceReport {
  reportId: string;
  generatedAt: string;
  engineVersion: string;
  productDNA: ProductDNA;
  classifications: MarketClassification[];
  patentability: PatentabilityAnalysis;
  ftoScan: FTOAnalysis;
  trademarkAnalysis: TrademarkAnalysis;
  otherIP: OtherIPAnalysis;
  traditionalKnowledge: TraditionalKnowledgeAnalysis;
  absBiodiversity: ABSAnalysis;
  marketEntry: MarketEntryDetails[];
  claimsAnalysis: ClaimRiskItem[];
  globalRiskDashboard: GlobalRiskSummary[];
  launchReadiness: LaunchReadinessAssessment[];
  overallLaunchReadiness: LaunchReadinessAssessment;
  whatToProtect: {
    protectionType: string;
    asset: string;
    rationale: string;
    priority: "HIGH" | "MEDIUM" | "LOW";
    recommendedJurisdictions: JurisdictionCode[];
  }[];
  relatedDiscoveries: RelatedDiscovery[];
  evidenceCoverage: {
    totalCitations: number;
    verifiedCitations: number;
    citationsByJurisdiction: Record<string, number>;
    items: EvidenceItem[];
  };
  unknownsAndVerifications: {
    category: string;
    issue: string;
    impact: string;
    nextStep: string;
  }[];
  analysisTrace: AnalysisTraceStep[];
  dataLimitations: {
    domain: string;
    status: string;
    explanation: string;
  }[];
}
