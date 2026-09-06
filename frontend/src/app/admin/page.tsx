"use client";

import { useState, useRef, useEffect } from "react";
import { fetchAdminTrace } from "@/lib/api";
import { AdminTraceResponse, DomainType } from "@/types";
import CandidateRow from "@/components/admin/CandidateRow";
import PipelineStats from "@/components/admin/PipelineStats";
import BenchmarkRunner from "@/components/admin/BenchmarkRunner";
import UserDirectory from "@/components/admin/UserDirectory";
import DomainSelector from "@/components/DomainSelector";
import {
  Search,
  ArrowRepeat,
  ExclamationCircleFill,
  Flower1,
  BarChartFill,
  ChevronRight,
  Stars,
  PeopleFill,
} from "react-bootstrap-icons";
import Link from "next/link";

type Tab = "trace" | "benchmark" | "users";

const DOMAIN_SAMPLE_QUERIES: Record<string, string> = {
  patents: "Can I patent an Ayurvedic herbal formulation with Ashwagandha?",
  trademarks: "How to register a trademark for an Ayurveda brand in India?",
  gi: "Geographical indication GI tag registration process for traditional medicine",
  fssai: "What are the mandatory FSSAI labelling requirements for Ayurveda Aahara?",
  ayush: "What are the regulatory compliance guidelines for AYUSH manufacturers?",
  auto: "Can I patent an Ayurvedic formulation under Section 3(e)?",
};

export default function AdminPage() {
  const [query, setQuery] = useState("Can I patent an Ayurvedic herbal formulation with Ashwagandha?");
  const [domain, setDomain] = useState<DomainType | "auto">("patents");
  const [loading, setLoading] = useState(false);
  const [trace, setTrace] = useState<AdminTraceResponse | null>(null);
  const [latency, setLatency] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("trace");
  const inputRef = useRef<HTMLInputElement>(null);

  const executeTrace = async (targetQuery: string, targetDomain: DomainType | "auto") => {
    const q = targetQuery.trim();
    if (!q) return;
    setLoading(true);
    setError(null);
    setTrace(null);
    const t0 = performance.now();
    try {
      const res = await fetchAdminTrace(q, targetDomain === "auto" ? undefined : targetDomain, "IN");
      setLatency(Math.round(performance.now() - t0));
      setTrace(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error connecting to backend");
    } finally {
      setLoading(false);
    }
  };

  const runTrace = () => {
    executeTrace(query, domain);
  };

  const handleDomainChange = (newDomain: DomainType | "auto") => {
    setDomain(newDomain);
    const suggestedQ = DOMAIN_SAMPLE_QUERIES[newDomain] || query;
    setQuery(suggestedQ);
    executeTrace(suggestedQ, newDomain);
  };

  useEffect(() => {
    // Auto-load on mount so the playground is never empty
    executeTrace("Can I patent an Ayurvedic herbal formulation with Ashwagandha?", "patents");
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="bg-gray-900 text-white px-4 py-3 flex items-center gap-3">
        <Flower1 className="w-5 h-5 text-green-400" />
        <span className="font-bold text-sm">AYURLEX Admin Playground</span>
        <span className="text-gray-500 text-xs hidden sm:block">Retrieval Trace & Benchmark Evaluator</span>
        <div className="ml-auto">
          <Link
            href="/"
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
          >
            User UI <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">

        {/* Tab switcher */}
        <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1 w-fit">
          {([
            { key: "trace",     icon: Search,       label: "Retrieval Trace" },
            { key: "benchmark", icon: BarChartFill, label: "Benchmark" },
            { key: "users",     icon: PeopleFill,   label: "Users & Consultation Vaults" },
          ] as { key: Tab; icon: React.ElementType; label: string }[]).map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === key
                  ? "bg-gray-900 text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* ── Retrieval Trace tab ────────────────────────────────────────── */}
        {tab === "trace" && (
          <div className="space-y-5">
            {/* Query input */}
            <div className="bg-white rounded-2xl border border-gray-200 p-4 space-y-4">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && runTrace()}
                  placeholder="Enter a query to trace through the full RAG pipeline..."
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                />
                <button
                  onClick={runTrace}
                  disabled={!query.trim() || loading}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-gray-700 disabled:bg-gray-200 text-white rounded-xl text-sm font-medium transition-colors"
                >
                  {loading
                    ? <ArrowRepeat className="w-4 h-4 animate-spin" />
                    : <Search className="w-4 h-4" />}
                  Trace Pipeline
                </button>
              </div>

              {/* Domain pills */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Select Domain Filter (Clicking auto-traces sample query):
                </p>
                <DomainSelector value={domain} onChange={handleDomainChange} />
              </div>

              {/* Quick sample query pills */}
              <div className="flex flex-wrap gap-2 pt-1 border-t border-gray-100">
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Stars className="w-3 h-3 text-amber-500" /> Quick trace:
                </span>
                {[
                  { q: "Can I patent an Ayurvedic herbal formulation with Ashwagandha?", d: "patents", label: "💡 Patents (Ashwagandha)" },
                  { q: "What are the mandatory FSSAI labelling requirements for Ayurveda Aahara?", d: "fssai", label: "🏷️ FSSAI (Labelling)" },
                  { q: "How to register a trademark for an Ayurveda brand in India?", d: "trademarks", label: "™️ Trademarks (Brand)" },
                  { q: "What is Section 3(e) of the Indian Patents Act 1970?", d: "patents", label: "⚖️ Section 3(e)" },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      setQuery(item.q);
                      setDomain(item.d as DomainType);
                      executeTrace(item.q, item.d as DomainType);
                    }}
                    className="text-xs px-2.5 py-1 rounded-lg bg-gray-50 border border-gray-200 text-gray-700 hover:bg-green-50 hover:border-green-300 hover:text-green-800 transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                <ExclamationCircleFill className="w-4 h-4 mt-0.5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {/* Results */}
            {trace && (
              <div className="space-y-5">

                {/* Pipeline stats overview */}
                <div className="space-y-2">
                  <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                    Pipeline Execution Summary
                  </h2>
                  <PipelineStats trace={trace} latency={latency} />
                </div>

                {/* Query info */}
                <div className="bg-white rounded-xl border border-gray-200 px-4 py-3 text-sm flex flex-wrap items-center gap-3 text-gray-600">
                  <span><strong className="text-gray-900">Active Query:</strong> {trace.query}</span>
                  {trace.domain && (
                    <span className="bg-green-50 text-green-700 font-medium px-2 py-0.5 rounded text-xs">
                      Domain: {trace.domain.toUpperCase()}
                    </span>
                  )}
                  <span><strong className="text-gray-900">Corpus:</strong> {trace.corpus_version}</span>
                </div>

                {/* Candidate rows */}
                {trace.candidates.length > 0 ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                        Reranked Legal Candidates ({trace.candidates.length})
                      </h2>
                      <span className="text-xs text-gray-400">Click any row to view full text & scores</span>
                    </div>
                    {trace.candidates.map((c, i) => (
                      <CandidateRow key={c.chunk_id} candidate={c} rank={i + 1} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-400 text-sm bg-white rounded-xl border border-gray-200">
                    No candidates returned for this query and domain combination.
                  </div>
                )}
              </div>
            )}

            {/* Loading placeholder */}
            {loading && (
              <div className="text-center py-16 space-y-3 bg-white rounded-2xl border border-gray-200">
                <ArrowRepeat className="w-8 h-8 mx-auto text-green-600 animate-spin" />
                <p className="text-gray-600 text-sm font-medium">
                  Running BM25 + BGE-M3 Vector + RRF Fusion + Cross-Encoder Reranker...
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── Benchmark tab ──────────────────────────────────────────────── */}
        {tab === "benchmark" && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <BenchmarkRunner />
          </div>
        )}

        {/* ── Users & Consultation Vaults tab ───────────────────────────────── */}
        {tab === "users" && <UserDirectory />}
      </div>
    </div>
  );
}
