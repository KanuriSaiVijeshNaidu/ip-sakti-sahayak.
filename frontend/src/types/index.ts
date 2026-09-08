// Types mirroring the FastAPI Pydantic schemas and frontend state

export type DomainType = "patents" | "trademarks" | "gi" | "ayush" | "fssai";
// Active Production Jurisdictions: US, EP (EU), WO, JP. (IN is deferred, DE is removed from active scope).
export type JurisdictionType = "IN" | "WO" | "EU" | "EP" | "US" | "JP" | "GLOBAL" | "auto";
export type LanguageCode = "en" | "te" | "hi" | "ja" | "ta" | "kn" | "ml" | "auto";

export type UserRole = "vaidya" | "attorney" | "regulator" | "researcher" | "guest";

export interface UserProfile {
  name: string;
  username?: string;
  email: string;
  role: UserRole;
  registrationNumber?: string;
  institution?: string;
  isLoggedIn: boolean;
  sessionToken?: string;
  lastLogin?: string;
  device?: string;
}

export interface CitedPassage {
  passage_text: string;
  source_title: string;
  source_url?: string;
  section?: string;
  page_number?: number;
  domain: string;
  jurisdiction: string;
  relevance_score: number;
}

export interface ChatRequest {
  query: string;
  language?: LanguageCode;
  domain?: DomainType;
  jurisdiction?: JurisdictionType;
  session_id?: string;
  corpus_version?: string;
}

export interface BlockchainReceipt {
  receipt_id: string;
  sha256_hash: string;
  timestamp: string;
  consensus_status: string;
  block_height: number;
  node_validator: string;
  grounded_score: number;
}

export interface ChatResponse {
  answer: string;
  cited_passages: CitedPassage[];
  model_used: string;
  retrieval_latency_ms?: number;
  llm_latency_ms?: number;
  total_latency_ms?: number;
  corpus_version: string;
  blockchain_receipt?: BlockchainReceipt;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  cited_passages?: CitedPassage[];
  latency_ms?: number;
  timestamp: Date;
  blockchain_receipt?: BlockchainReceipt;
}

export interface ChatSession {
  id: string;
  title: string;
  domain: DomainType | "auto";
  language: string;
  createdAt: number;
  updatedAt: number;
  messages: Message[];
}

// ─── Admin trace types ────────────────────────────────────────────────────────

export interface RetrievalCandidate {
  chunk_id: string;
  text: string;
  section_title?: string;
  source_title?: string;
  domain: string;
  jurisdiction: string;
  corpus_version: string;
  bm25_score?: number;
  vector_score?: number;
  rrf_score?: number;
  reranker_score?: number;
  grounding_score?: number;
}

export interface AdminTraceResponse {
  query: string;
  domain?: string;
  jurisdiction?: string;
  corpus_version: string;
  bm25_hit_count: number;
  vector_hit_count: number;
  fused_count: number;
  reranked_count: number;
  validated_count: number;
  candidates: RetrievalCandidate[];
}

// ─── Phase 1 & 2 Intelligence Types ──────────────────────────────────────────

export interface NormalizedBotanicalEntity {
  common_name: string;
  botanical_name: string;
  sanskrit_name: string;
  family?: string;
  part_used?: string;
  active_compounds: string[];
  classical_treatises: string[];
  ayush_system: string;
}

export interface FormulationAnalysisRequest {
  formulation_name?: string;
  ingredients: string[];
  botanical_names?: string[];
  sanskrit_names?: string[];
  ingredient_quantities?: Record<string, string>;
  ingredient_ratios?: Record<string, number>;
  preparation_method?: string;
  dosage_form?: string;
  intended_use?: string;
  therapeutic_claims?: string[];
  geographical_source?: string;
  language?: LanguageCode;
}

export interface FormulationAnalysisResponse {
  formulation_name: string;
  ingredients: string[];
  botanical_entities: NormalizedBotanicalEntity[];
  traditional_names: string[];
  ratios: Record<string, number>;
  preparation_method: string;
  dosage_form: string;
  claimed_use: string;
  geographical_origin: string;
  taxonomic_hierarchy: Record<string, string>;
  mono_ingredient_flag: boolean;
  classical_formulation_matches: Array<{
    formulation_name: string;
    statutory_reference: string;
    matched_herbs_count: string;
    dosage_form: string;
    classical_indications: string;
  }>;
}

export type TKRiskLevel = "CONFIRMED" | "LIKELY" | "POSSIBLE" | "NOT FOUND" | "INSUFFICIENT EVIDENCE";
export type PatentabilityRiskLevel = "LOW" | "MEDIUM" | "HIGH" | "INSUFFICIENT_EVIDENCE";
export type EvidenceSupportStatus = "SUPPORTED" | "PARTIALLY_SUPPORTED" | "UNSUPPORTED";

export interface IngredientRiskItem {
  ingredient: string;
  botanical_name: string;
  traditional_name: string;
  risk_level: TKRiskLevel;
  citations: string[];
  classical_source?: string;
  rationale: string;
}

export interface TKRiskRequest {
  formulation_name?: string;
  ingredients: string[];
  botanical_names?: string[];
  therapeutic_claims?: string[];
  language?: LanguageCode;
}

export interface TKRiskResponse {
  overall_tk_risk: TKRiskLevel;
  ingredient_risks: IngredientRiskItem[];
  potential_traditional_knowledge_overlap: string;
  classical_formulation_matches: string[];
  historical_revocation_precedents: string[];
  evidence: CitedPassage[];
  limitations: string[];
}

export interface ClaimVerification {
  claim_text: string;
  status: EvidenceSupportStatus;
  supporting_passage?: string;
  source_title?: string;
  section?: string;
  authority?: string;
  confidence_score: number;
}

export interface ActionPlanStep {
  step_number: number;
  title: string;
  description: string;
  authority_or_portal: string;
  statutory_basis?: string;
  urgency: "REQUIRED" | "RECOMMENDED" | "OPTIONAL";
}

export interface ConfidenceExplanation {
  level: "HIGH" | "MEDIUM" | "LOW";
  score: number;
  reasons_positive: string[];
  warnings: string[];
  abstain: boolean;
  abstention_message?: string;
}

export interface PatentabilityRequest {
  invention_title: string;
  abstract_or_summary: string;
  ingredients?: string[];
  is_combination?: boolean;
  claims?: string[];
  jurisdiction?: JurisdictionType;
  biological_source_country?: string;
  language?: LanguageCode;
  user_role?: string;
}

export interface PatentabilityResponse {
  invention_title: string;
  overall_risk: PatentabilityRiskLevel;
  novelty_risk: PatentabilityRiskLevel;
  section_3e_risk: PatentabilityRiskLevel;
  section_3p_risk: PatentabilityRiskLevel;
  tk_risk: TKRiskLevel;
  biodiversity_review: string;
  claim_verifications: ClaimVerification[];
  confidence: ConfidenceExplanation;
  evidence: CitedPassage[];
  action_plan: ActionPlanStep[];
  limitations: string[];
  role_adapted_guidance: string;
}

export interface JurisdictionComparisonRow {
  dimension: string;
  india: string;
  usa: string;
  europe: string;
  wipo_pct: string;
  key_statutory_difference: string;
  evidence_citation: string;
}

export interface JurisdictionComparisonRequest {
  invention_title: string;
  ingredients?: string[];
  claims?: string[];
  therapeutic_claims?: string[];
  jurisdictions?: string[];
  language?: LanguageCode;
}

export interface JurisdictionComparisonResponse {
  invention_title: string;
  comparison_matrix: JurisdictionComparisonRow[];
  overall_summary: string;
  action_plan: ActionPlanStep[];
  evidence: CitedPassage[];
}

export interface StatutoryDeadline {
  milestone: string;
  deadline_date: string;
  months_from_priority: number;
  days_remaining: number;
  status: "PASSED" | "URGENT" | "UPCOMING";
  statutory_basis: string;
  description: string;
}

export interface ClearanceCheck {
  requirement: string;
  status: "COMPLIANT" | "ACTION_REQUIRED" | "CRITICAL_BAR" | "NOT_APPLICABLE";
  governing_statute: string;
  details: string;
  remedy_step?: string | null;
}

export interface JurisdictionRoadmap {
  jurisdiction: string;
  jurisdiction_name: string;
  authority: string;
  filing_route: string;
  key_statutory_requirements: string[];
  estimated_official_fee: string;
  recommended_action: string;
}

export interface IndianToInternationalRequest {
  indian_application_number: string;
  priority_date: string; // YYYY-MM-DD
  title: string;
  ip_type?: "PATENT" | "TRADEMARK" | "FORMULATION";
  biological_materials?: string[];
  has_foreign_filing_license?: boolean;
  has_nba_approval?: boolean;
  target_jurisdictions?: string[];
  applicant_type?: "NATURAL_PERSON" | "STARTUP_SME" | "LARGE_ENTITY";
  language?: LanguageCode;
}

export interface IndianToInternationalResponse {
  indian_application_number: string;
  title: string;
  priority_date: string;
  transition_readiness_score: number;
  overall_status: string;
  deadlines: StatutoryDeadline[];
  clearances: ClearanceCheck[];
  roadmaps: JurisdictionRoadmap[];
  estimated_fees: Record<string, string>;
  required_documents: string[];
  action_plan: ActionPlanStep[];
  evidence: CitedPassage[];
}

// ─── Phase 5 Intelligent Retrieval Types ──────────────────────────────────────

export interface Phase5QueryAnalysis {
  original_query: string;
  normalized_query: string;
  detected_language: string;
  intent: string;
  confidence: number;
  jurisdictions: string[];
  routing_mode: string;
  routing_reason: string;
  product_entities: string[];
  patent_entities: string[];
  legal_entities: string[];
  temporal_constraints: string[];
  query_type: string;
}

export interface Phase5EvidenceResult {
  chunk_id: string;
  document_id: string;
  publication_number: string;
  jurisdiction: string;
  language: string;
  section: string;
  title: string;
  text: string;
  source: string;
  source_url?: string;
  filing_date?: string;
  publication_date?: string;
  dense_score?: number;
  dense_rank?: number;
  lexical_score?: number;
  lexical_rank?: number;
  rrf_score?: number;
  rerank_score?: number;
  final_rank: number;
}

export interface Phase5RetrievalSearchRequest {
  query: string;
  jurisdiction?: string;
  top_k?: number;
  dense_top_k?: number;
  lexical_top_k?: number;
  rerank_top_k?: number;
}

export interface Phase5RetrievalSearchResponse {
  query_analysis: Phase5QueryAnalysis;
  routing_decision: string;
  searched_jurisdictions: string[];
  dense_candidate_count: number;
  lexical_candidate_count: number;
  fused_candidate_count: number;
  reranked_candidate_count: number;
  final_candidate_count: number;
  results: Phase5EvidenceResult[];
  latencies_ms: Record<string, number>;
  status: string;
  disclaimer: string;
}

// ─── Phase 6 RAG Answer Types ─────────────────────────────────────────────────

export interface CitationInfo {
  citation_id: string;
  chunk_id: string;
  publication_number: string;
  document_id: string;
  jurisdiction: string;
  language: string;
  section: string;
  title: string;
  text: string;
  source: string;
  source_url?: string;
  filing_date?: string;
  publication_date?: string;
  rerank_score?: number;
  dense_score?: number;
  lexical_score?: number;
  rrf_score?: number;
}

export interface ClaimValidationResult {
  text: string;
  citations: string[];
  status: "SUPPORTED" | "PARTIALLY_SUPPORTED" | "UNSUPPORTED" | "UNCITED";
  supported_by: string[];
  reason: string;
}

export interface RAGAnswerRequest {
  query: string;
  jurisdiction?: string;
  top_k?: number;
  language?: string;
}

export interface RAGAnswerResponse {
  query: string;
  answer: string;
  detected_language: string;
  jurisdictions: string[];
  crag_status: "GOOD" | "PARTIAL" | "INSUFFICIENT" | "INVALID";
  evidence_count: number;
  citations: CitationInfo[];
  claims: ClaimValidationResult[];
  limitations: string[];
  status: string;
  latencies_ms: Record<string, number>;
  disclaimer: string;
}

// ─── Phase 7 Decision & Jurisdiction Reasoning Engine Types ─────────────────

export type DecisionType =
  | "YES"
  | "NO"
  | "CONDITIONAL_YES"
  | "CONDITIONAL_NO"
  | "INSUFFICIENT_EVIDENCE";

export type DecisionConfidence = "HIGH" | "MEDIUM" | "LOW";

export type UserObjective =
  | "sell"
  | "export"
  | "market"
  | "commercialize"
  | "patent_validity"
  | "patentability"
  | "third_party_patent"
  | "regulatory_requirement"
  | "legality"
  | "fto"
  | "general";

export interface QueryIntent {
  origin_country?: string;
  target_country?: string;
  product?: string;
  formulation?: string;
  ingredients: string[];
  intended_use?: string;
  health_claims: string[];
  patent_number?: string;
  patent_status?: string;
  applicant?: string;
  owner?: string;
  user_objective: UserObjective;
  is_commercialization_question: boolean;
  is_fto_question: boolean;
  requires_target_jurisdiction_routing: boolean;
}

export interface EvidenceSufficiency {
  evidence_sufficient: boolean;
  required_evidence_present: boolean;
  unresolved_material_conditions: string[];
  jurisdiction_valid: boolean;
  source_authority: number;
  missing_evidence_categories: string[];
  decision_reason_codes?: string[];
  patent_evidence_count?: number;
  regulatory_evidence_count?: number;
  fto_evidence_count?: number;
  evidence_note: string;
}

export interface DecisionRequest {
  query: string;
  jurisdiction?: string;
  top_k?: number;
  language?: string;
}

export interface DecisionResponse {
  query: string;
  decision: DecisionType;
  why: string;
  patent_analysis: string;
  regulatory_analysis: string;
  ip_fto_analysis: string;
  conditions: string[];
  required_next_steps: string[];
  evidence: Array<{
    citation_id: string;
    publication_number: string;
    document_id: string;
    jurisdiction: string;
    section: string;
    title: string;
    text: string;
    source: string;
    source_url?: string;
    filing_date?: string;
    publication_date?: string;
  }>;
  confidence: DecisionConfidence;
  query_intent: QueryIntent;
  evidence_sufficiency: EvidenceSufficiency;
  detected_language: string;
  jurisdictions_searched: string[];
  origin_jurisdiction?: string;
  target_jurisdiction?: string;
  decision_jurisdiction: string;
  origin_evidence?: Array<any>;
  target_evidence?: Array<any>;
  cross_jurisdiction_evidence?: Array<any>;
  evaluation_evidence?: Array<any>;
  origin_evidence_note?: string;
  target_evidence_note?: string;
  crag_status: string;
  evaluation_only: boolean;
  latencies_ms: Record<string, number>;
  disclaimer: string;
}


