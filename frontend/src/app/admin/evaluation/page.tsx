"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { HouseDoorFill, Speedometer2, ArrowRepeat, CheckCircleFill, ShieldCheck, Filter } from "react-bootstrap-icons";
import { fetchEvaluationMetrics } from "@/lib/api";

export default function AdminEvaluationPage() {
  const [jurisdiction, setJurisdiction] = useState("ALL");
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const loadMetrics = async (j = jurisdiction) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchEvaluationMetrics(j);
      setMetrics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load evaluation metrics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMetrics("ALL");
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center px-4 py-8 relative">
      <header className="w-full max-w-5xl flex items-center justify-between pb-6 border-b border-slate-800/80 mb-8">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
            अ
          </div>
          <div>
            <h1 className="text-base font-bold text-white flex items-center gap-2">
              <span>AYURLEX</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                BENCHMARK EVALUATION
              </span>
            </h1>
            <p className="text-[10px] text-slate-400">Admin Telemetry & RAG Verification Dashboard</p>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/admin"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-700 transition-all"
          >
            <span>Retrieval Trace</span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 rounded-xl border border-slate-700 transition-all"
          >
            <HouseDoorFill className="w-3.5 h-3.5 text-emerald-400" />
            <span>Chat Workspace</span>
          </Link>
        </div>
      </header>

      <main className="w-full max-w-5xl flex flex-col gap-6 text-left">
        {/* Controls & Filter */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 shadow-xl backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Speedometer2 className="w-5 h-5 text-emerald-400" />
              <span>Real-Time Model Evaluation Benchmark</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Empirical recall, nDCG, citation accuracy, and groundedness statistics
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1 bg-slate-950 border border-slate-700 rounded-xl px-2 py-1 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={jurisdiction}
                onChange={(e) => {
                  setJurisdiction(e.target.value);
                  loadMetrics(e.target.value);
                }}
                className="bg-transparent text-white text-xs outline-none cursor-pointer"
              >
                <option value="ALL">All Jurisdictions</option>
                <option value="IN">India (IN)</option>
                <option value="US">United States (US)</option>
                <option value="EP">Europe (EP)</option>
                <option value="WO">WIPO / PCT (WO)</option>
              </select>
            </div>

            <button
              onClick={() => loadMetrics(jurisdiction)}
              disabled={loading}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <ArrowRepeat className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-950/60 border border-red-800 text-xs text-red-300">
            {error}
          </div>
        )}

        {metrics && (
          <div className="space-y-6">
            {/* Top Metrics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Retrieval Recall@5
                </span>
                <span className="text-2xl font-black font-mono text-emerald-400 block mt-1">
                  {(metrics.retrieval.recall_at_5 * 100).toFixed(1)}%
                </span>
                <span className="text-[10px] text-slate-500 mt-0.5 block">Dual BM25 + FAISS</span>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Reranker nDCG@5
                </span>
                <span className="text-2xl font-black font-mono text-purple-400 block mt-1">
                  {(metrics.reranking_bge_m3.ndcg_at_5 * 100).toFixed(1)}%
                </span>
                <span className="text-[10px] text-slate-500 mt-0.5 block">BAAI/bge-reranker-v2-m3</span>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Groundedness Score
                </span>
                <span className="text-2xl font-black font-mono text-blue-400 block mt-1">
                  {(metrics.generation_grounding.groundedness_score * 100).toFixed(1)}%
                </span>
                <span className="text-[10px] text-slate-500 mt-0.5 block">Evidence-Entailed Claims</span>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Average Latency
                </span>
                <span className="text-2xl font-black font-mono text-amber-400 block mt-1">
                  {metrics.system_telemetry.average_latency_ms} ms
                </span>
                <span className="text-[10px] text-slate-500 mt-0.5 block">P95: {metrics.system_telemetry.p95_latency_ms}ms</span>
              </div>
            </div>

            {/* Grounding & Verification Telemetry */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 shadow-xl backdrop-blur-xl space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Statutory Grounding & Abstention Accuracy</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-xl text-xs space-y-1">
                  <span className="text-slate-400 font-mono text-[10px] uppercase">Citation Accuracy</span>
                  <div className="text-lg font-bold text-white font-mono">
                    {(metrics.generation_grounding.citation_accuracy * 100).toFixed(1)}%
                  </div>
                  <p className="text-[10px] text-slate-500">Official section & schedule attribution</p>
                </div>

                <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-xl text-xs space-y-1">
                  <span className="text-slate-400 font-mono text-[10px] uppercase">Unsupported Claim Rate</span>
                  <div className="text-lg font-bold text-emerald-400 font-mono">
                    {(metrics.generation_grounding.unsupported_claim_rate * 100).toFixed(1)}%
                  </div>
                  <p className="text-[10px] text-slate-500">Strictly suppressed & verified</p>
                </div>

                <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-xl text-xs space-y-1">
                  <span className="text-slate-400 font-mono text-[10px] uppercase">Safe Abstention Accuracy</span>
                  <div className="text-lg font-bold text-purple-400 font-mono">
                    {(metrics.generation_grounding.safe_abstention_accuracy * 100).toFixed(1)}%
                  </div>
                  <p className="text-[10px] text-slate-500">Zero-hallucination policy compliance</p>
                </div>
              </div>
            </div>

            {/* Multilingual Benchmark */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 shadow-xl backdrop-blur-xl space-y-3">
              <h3 className="text-sm font-bold text-white">
                Multilingual Performance Across 7 Languages
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-7 gap-2 pt-1 text-center font-mono">
                {Object.entries(metrics.multilingual_performance).map(([lang, data]: [string, any]) => (
                  <div key={lang} className="bg-slate-950/70 border border-slate-800 p-2.5 rounded-xl">
                    <span className="text-xs font-bold text-white uppercase block">{lang}</span>
                    <span className="text-xs text-emerald-400 font-bold block mt-1">
                      {Math.round(data.recall * 100)}%
                    </span>
                    <span className="text-[9px] text-slate-500 block">Recall</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
