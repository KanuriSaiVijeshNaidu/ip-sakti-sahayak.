export type SourceType = "official" | "database" | "demo";
export type TrustLevel = "official" | "secondary" | "demo" | "unverified";
export type QualitativeRisk = "LOW" | "MEDIUM" | "HIGH" | "UNKNOWN";
export type ComplianceStatus = "compliant" | "review_required" | "missing_documentation" | "action_needed";

export interface EvidenceItem {
  id: string;
  title: string;
  sourceName: string;
  sourceType: SourceType;
  trustLevel: TrustLevel;
  jurisdiction: string;
  documentType: string;
  referenceNumber?: string;
  section?: string;
  publicationDate?: string;
  lastVerified?: string;
  url?: string;
  excerpt?: string;
  relevanceScore?: number;
  confidence?: number;
  tags?: string[];
}

export interface AssessmentRule {
  id: string;
  name: string;
  jurisdiction: string;
  category: "patentability" | "traditional_knowledge" | "regulatory" | "market_entry" | "biodiversity";
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

export interface DemoScenario {
  id: string;
  name: string;
  shortTag: string;
  category: string;
  shortDesc: string;
  ingredients: string[];
  formulation: string;
  technicalNovelty: string;
  manufacturingProcess: string;
  intendedUse: string;
  applicantType: string;
  targetJurisdiction: string;
  overview: {
    patentability: QualitativeRisk;
    traditionalKnowledge: QualitativeRisk;
    regulatory: QualitativeRisk;
    marketEntry: QualitativeRisk;
    documentation: QualitativeRisk;
    filingReadinessScore: number;
  };
  traceSteps: AnalysisTraceStep[];
  regulatoryChecklist: RegulatoryChecklistItem[];
  topRisks: TopRiskItem[];
  actionPlan: ActionPlanItem[];
  missingInputs: string[];
  evidence: EvidenceItem[];
}
