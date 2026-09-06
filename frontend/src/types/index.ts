// Types mirroring the FastAPI Pydantic schemas and frontend state

export type DomainType = "patents" | "trademarks" | "gi" | "ayush" | "fssai";
export type JurisdictionType = "IN" | "WO" | "EU" | "US" | "GLOBAL" | "auto";
export type LanguageCode = "en" | "hi" | "ta" | "te" | "kn" | "ml" | "auto";

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
