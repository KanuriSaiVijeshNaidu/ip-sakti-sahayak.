// Types mirroring the FastAPI Pydantic schemas

export type DomainType = "patents" | "trademarks" | "gi" | "ayush" | "fssai" | "auto";
export type JurisdictionType = "IN" | "WO" | "EU" | "US" | "GLOBAL" | "auto";
export type LanguageCode = "en" | "hi" | "ta" | "te" | "kn" | "ml" | "auto";

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

export interface ChatResponse {
  answer: string;
  cited_passages: CitedPassage[];
  model_used: string;
  retrieval_latency_ms?: number;
  llm_latency_ms?: number;
  total_latency_ms?: number;
  corpus_version: string;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  cited_passages?: CitedPassage[];
  latency_ms?: number;
  timestamp: Date;
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
