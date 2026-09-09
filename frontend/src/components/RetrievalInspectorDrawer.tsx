"use client";

import React, { useState } from "react";
import {
  X,
  Terminal,
  Cpu,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Search,
  Layers,
  Clock,
  Copy,
  Check,
  ExternalLink,
  ChevronRight,
  AlertTriangle,
  Globe,
  FileText,
  Sliders,
} from "lucide-react";

export interface RetrievalDebugData {
  query: string;
  normalized_query: string;
  detected_language: string;
  detected_script: string;
  code_switching_tokens: string[];
  target_jurisdictions: string[];
  routing_mode: string;
  routing_reason: string;
  expanded_representations: Record<string, string>;
  dense_candidates: Array<{
    chunk_id: string;
    publication_number: string;
    jurisdiction: string;
    section: string;
    title: string;
    score: number;
    rank: number;
    authority_tier: number;
    source_url?: string;
  }>;
  lexical_candidates: Array<{
    chunk_id: string;
    publication_number: string;
    jurisdiction: string;
    section: string;
    title: string;
    score: number;
    rank: number;
    authority_tier: number;
    source_url?: string;
  }>;
  fused_candidates: Array<{
    chunk_id: string;
    publication_number: string;
    jurisdiction: string;
    section: string;
    title: string;
    score: number;
    rank: number;
    authority_tier: number;
    source_url?: string;
  }>;
  reranked_candidates: Array<{
    chunk_id: string;
    publication_number: string;
    jurisdiction: string;
    section: string;
    title: string;
    score: number;
    rank: number;
    authority_tier: number;
    source_url?: string;
  }>;
  final_evidence: Array<{
    chunk_id: string;
    publication_number: string;
    jurisdiction: string;
    section: string;
    title: string;
    text: string;
    authority_tier?: number;
    dense_score?: number;
    lexical_score?: number;
    rrf_score?: number;
    rerank_score?: number;
    source_url?: string;
  }>;
  sufficiency_gate: {
    verdict: string; // "PASS" | "FAIL"
    status: string; // "GOOD" | "PARTIAL" | "INSUFFICIENT" | "INVALID"
    confidence: number;
    top_rerank_score: number;
    threshold: number;
    usable_count: number;
    tier1_count: number;
    has_authoritative_source: boolean;
    reason: string;
  };
  latencies_ms: Record<string, number>;
  status: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  data: RetrievalDebugData | null;
  loading?: boolean;
}

export default function RetrievalInspectorDrawer({ isOpen, onClose, data, loading }: Props) {
  const [activeTab, setActiveTab] = useState<"routing" | "candidates" | "gate" | "latency">("gate");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const isPass = data?.sufficiency_gate?.verdict === "PASS";

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-3xl h-full bg-slate-900 border-l border-emerald-500/20 text-slate-100 flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-white text-base">Retrieval & Sufficiency Inspector</h3>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                  DEV MODE
                </span>
                {data?.sufficiency_gate && (
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                      isPass
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                        : "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                    }`}
                  >
                    GATE: {data.sufficiency_gate.verdict} ({data.sufficiency_gate.status})
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 truncate max-w-md">
                {data ? data.query : "Retrieval Diagnostic Pipeline"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800 bg-slate-950 px-4">
          <button
            onClick={() => setActiveTab("gate")}
            className={`px-4 py-2.5 text-xs font-medium border-b-2 flex items-center gap-2 transition ${
              activeTab === "gate"
                ? "border-emerald-400 text-emerald-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Sufficiency Gate
          </button>
          <button
            onClick={() => setActiveTab("routing")}
            className={`px-4 py-2.5 text-xs font-medium border-b-2 flex items-center gap-2 transition ${
              activeTab === "routing"
                ? "border-emerald-400 text-emerald-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Globe className="w-4 h-4" />
            Language & Routing
          </button>
          <button
            onClick={() => setActiveTab("candidates")}
            className={`px-4 py-2.5 text-xs font-medium border-b-2 flex items-center gap-2 transition ${
              activeTab === "candidates"
                ? "border-emerald-400 text-emerald-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Layers className="w-4 h-4" />
            Candidate Pools ({data?.reranked_candidates?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab("latency")}
            className={`px-4 py-2.5 text-xs font-medium border-b-2 flex items-center gap-2 transition ${
              activeTab === "latency"
                ? "border-emerald-400 text-emerald-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Clock className="w-4 h-4" />
            Latencies ({data?.latencies_ms?.total_pipeline_ms ? `${data.latencies_ms.total_pipeline_ms}ms` : "0ms"})
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-3">
              <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-slate-400">Running diagnostic retrieval pipeline...</p>
            </div>
          ) : !data ? (
            <div className="text-center py-16 text-slate-400">
              <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto mb-2" />
              <p>No retrieval diagnostic data available for this query.</p>
            </div>
          ) : (
            <>
              {/* TAB 1: SUFFICIENCY GATE */}
              {activeTab === "gate" && (
                <div className="space-y-4">
                  {/* Verdict Banner */}
                  <div
                    className={`p-4 rounded-xl border ${
                      isPass
                        ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-200"
                        : "bg-rose-950/40 border-rose-500/40 text-rose-200"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {isPass ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <ShieldAlert className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-base">
                            Gate Verdict: {data.sufficiency_gate.verdict} ({data.sufficiency_gate.status})
                          </h4>
                        </div>
                        <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                          {data.sufficiency_gate.reason}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Diagnostic Metric Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                      <div className="text-xs text-slate-400">Top Rerank Score</div>
                      <div className="text-lg font-bold text-white mt-1">
                        {data.sufficiency_gate.top_rerank_score.toFixed(4)}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Threshold: {data.sufficiency_gate.threshold.toFixed(2)}
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                      <div className="text-xs text-slate-400">Tier 1 Statutory Chunks</div>
                      <div className="text-lg font-bold text-white mt-1">
                        {data.sufficiency_gate.tier1_count}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {data.sufficiency_gate.has_authoritative_source ? "Verified primary" : "None retrieved"}
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                      <div className="text-xs text-slate-400">Usable Evidence</div>
                      <div className="text-lg font-bold text-white mt-1">
                        {data.sufficiency_gate.usable_count}
                      </div>
                      <div className="text-[11px] text-slate-500">Chunks passing length filter</div>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                      <div className="text-xs text-slate-400">Confidence Rating</div>
                      <div className="text-lg font-bold text-white mt-1">
                        {(data.sufficiency_gate.confidence * 100).toFixed(0)}%
                      </div>
                      <div className="text-[11px] text-slate-500">CRAG Confidence</div>
                    </div>
                  </div>

                  {/* Evidence Selected for Answer Generation */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                      <span>Grounding Evidence Set ({data.final_evidence.length})</span>
                      <span className="text-[11px] font-normal text-emerald-400">
                        {data.final_evidence.length > 0 ? "Strictly cited in generation" : "Empty (Zero Hallucination)"}
                      </span>
                    </h4>

                    {data.final_evidence.length === 0 ? (
                      <div className="p-4 rounded-lg bg-slate-950 border border-dashed border-slate-800 text-center text-xs text-slate-400">
                        Circuit breaker halted generative synthesis. No unverified text passed to LLM.
                      </div>
                    ) : (
                      data.final_evidence.map((chunk, idx) => (
                        <div key={chunk.chunk_id || idx} className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-emerald-400">
                              [E{idx + 1}] {chunk.publication_number}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">
                                {chunk.jurisdiction}
                              </span>
                              <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px]">
                                Rerank: {chunk.rerank_score?.toFixed(4) ?? "N/A"}
                              </span>
                            </div>
                          </div>
                          <div className="text-xs font-medium text-white">{chunk.title}</div>
                          <div className="text-[11px] text-slate-300 line-clamp-3 bg-slate-900/60 p-2 rounded border border-slate-800/80">
                            {chunk.text}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: LANGUAGE & ROUTING */}
              {activeTab === "routing" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                      <div className="text-xs text-slate-400">Detected Language</div>
                      <div className="text-sm font-semibold text-white mt-1 uppercase">
                        {data.detected_language}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">{data.detected_script}</div>
                    </div>
                    <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                      <div className="text-xs text-slate-400">Target Jurisdictions</div>
                      <div className="text-sm font-semibold text-white mt-1">
                        {data.target_jurisdictions.join(", ")}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">Mode: {data.routing_mode}</div>
                    </div>
                  </div>

                  {data.code_switching_tokens && data.code_switching_tokens.length > 0 && (
                    <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                      <div className="text-xs text-slate-400 mb-1.5">Code-Switching Tokens Identified</div>
                      <div className="flex flex-wrap gap-1.5">
                        {data.code_switching_tokens.map((token, i) => (
                          <span
                            key={i}
                            className="text-xs px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono"
                          >
                            {token}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                    <div className="text-xs text-slate-400">Routing Rationale</div>
                    <div className="text-xs text-slate-300 mt-1">{data.routing_reason}</div>
                  </div>

                  {/* 5 Expansions */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      5-Representation Query Expander
                    </h4>
                    {Object.entries(data.expanded_representations).map(([key, value]) => (
                      <div key={key} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-mono text-emerald-400 uppercase text-[11px]">
                            [{key}]
                          </span>
                          <button
                            onClick={() => handleCopy(value, key)}
                            className="text-slate-400 hover:text-white transition"
                          >
                            {copiedKey === key ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                        <p className="text-xs text-slate-300 break-words">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: CANDIDATE POOLS */}
              {activeTab === "candidates" && (
                <div className="space-y-6">
                  {/* Reranked */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-semibold uppercase text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Stage 4: Cross-Encoder Reranked ({data.reranked_candidates.length})
                      </h4>
                    </div>
                    <div className="space-y-1.5">
                      {data.reranked_candidates.map((c) => (
                        <div
                          key={c.chunk_id}
                          className="p-2.5 bg-slate-950 rounded border border-slate-800 flex items-center justify-between text-xs"
                        >
                          <div className="truncate max-w-sm">
                            <span className="text-emerald-400 font-mono mr-2">#{c.rank}</span>
                            <span className="text-white font-medium">{c.publication_number}</span>
                            <span className="text-slate-400 ml-2 truncate">{c.title || c.section}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                              Tier {c.authority_tier}
                            </span>
                            <span className="font-mono text-emerald-400 font-semibold">
                              {c.score.toFixed(4)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Fused */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold uppercase text-slate-400">
                      Stage 3: Reciprocal Rank Fusion (RRF)
                    </h4>
                    <div className="space-y-1.5">
                      {data.fused_candidates.slice(0, 5).map((c) => (
                        <div
                          key={c.chunk_id}
                          className="p-2 bg-slate-950 rounded border border-slate-850 flex items-center justify-between text-xs text-slate-300"
                        >
                          <span className="truncate max-w-sm">
                            #{c.rank} {c.publication_number} - {c.title || c.section}
                          </span>
                          <span className="font-mono text-slate-400">{c.score.toFixed(6)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Dense & Lexical side by side */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold uppercase text-slate-400">
                        Dense FAISS ({data.dense_candidates.length})
                      </h4>
                      <div className="space-y-1">
                        {data.dense_candidates.slice(0, 5).map((c) => (
                          <div
                            key={c.chunk_id}
                            className="p-1.5 bg-slate-950 rounded border border-slate-850 flex items-center justify-between text-[11px] text-slate-300"
                          >
                            <span className="truncate max-w-[180px]">#{c.rank} {c.publication_number}</span>
                            <span className="font-mono text-cyan-400">{c.score.toFixed(4)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold uppercase text-slate-400">
                        Lexical BM25 ({data.lexical_candidates.length})
                      </h4>
                      <div className="space-y-1">
                        {data.lexical_candidates.slice(0, 5).map((c) => (
                          <div
                            key={c.chunk_id}
                            className="p-1.5 bg-slate-950 rounded border border-slate-850 flex items-center justify-between text-[11px] text-slate-300"
                          >
                            <span className="truncate max-w-[180px]">#{c.rank} {c.publication_number}</span>
                            <span className="font-mono text-amber-400">{c.score.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: LATENCY TRACE */}
              {activeTab === "latency" && (
                <div className="space-y-4">
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                    <div className="text-xs text-slate-400">Total Pipeline Duration</div>
                    <div className="text-2xl font-bold text-white mt-1">
                      {data.latencies_ms.total_pipeline_ms?.toFixed(1) || "0.0"} ms
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    {Object.entries(data.latencies_ms).map(([key, ms]) => {
                      if (key === "total_pipeline_ms") return null;
                      const pct = Math.min(100, Math.max(5, (ms / (data.latencies_ms.total_pipeline_ms || 1)) * 100));
                      return (
                        <div key={key} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-300 capitalize">{key.replace(/_ms$/, "").replace(/_/g, " ")}</span>
                            <span className="font-mono text-slate-400">{ms.toFixed(1)} ms</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-emerald-400 rounded-full"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/90 text-[11px] text-slate-400 flex items-center justify-between">
          <span>AYURLEX Intelligent Retrieval Diagnostic Mode</span>
          <span>BGE-M3 · BM25 · BGE-Reranker-v2-M3</span>
        </div>
      </div>
    </div>
  );
}
