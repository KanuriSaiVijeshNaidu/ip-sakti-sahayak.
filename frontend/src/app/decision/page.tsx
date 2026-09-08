"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  DecisionRequest,
  DecisionResponse,
  DecisionType,
  DecisionConfidence,
  LanguageCode,
} from "@/types";
import { callDecisionEngine } from "@/lib/api";

const CORE_LANGUAGES: { code: LanguageCode; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "te", label: "తెలుగు", flag: "🇮🇳" },
  { code: "hi", label: "हिन्दी", flag: "🇮🇳" },
  { code: "ja", label: "日本語", flag: "🇯🇵" },
  { code: "ta", label: "தமிழ்", flag: "🇮🇳" },
  { code: "kn", label: "ಕನ್ನಡ", flag: "🇮🇳" },
  { code: "ml", label: "മലയാളം", flag: "🇮🇳" },
];

const SAMPLE_QUERIES = [
  {
    title: "India Patent → Sell in USA",
    query: "I have an Ayurvedic product patented in India. Can I legally sell it in the USA?",
    target: "US",
  },
  {
    title: "US Formulation → Sell in Japan",
    query: "I have a patented herbal formulation in the USA. Can I market it in Japan?",
    target: "JP",
  },
  {
    title: "Japan → Sell in USA",
    query: "I hold a Japanese patent for Kampo herbal medicine. Can I sell it in the United States?",
    target: "US",
  },
  {
    title: "India — Evaluation Only Inquiry",
    query: "Is an Ayurvedic polyherbal formulation patentable under Indian Section 3(e) and 3(p)?",
    target: "IN",
  },
  {
    title: "Japanese Herbal Commercialization",
    query: "日本において生薬抽出物を含有する医薬品組成物を販売することは可能ですか？",
    target: "JP",
  },
];

export default function DecisionEnginePage() {
  const [query, setQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>("en");
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<string>("US");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<DecisionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"why" | "patent" | "regulatory" | "fto" | "steps" | "evidence">("why");

  // Load language from localStorage, default to 'en'
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem("ip_sakti_lang") as LanguageCode;
      if (savedLang && ["en", "te", "hi", "ja", "ta", "kn", "ml"].includes(savedLang)) {
        setSelectedLanguage(savedLang);
      } else {
        setSelectedLanguage("en");
      }
    } catch {
      setSelectedLanguage("en");
    }
  }, []);

  const handleLanguageChange = (lang: LanguageCode) => {
    setSelectedLanguage(lang);
    try {
      localStorage.setItem("ip_sakti_lang", lang);
    } catch {}
  };

  const handleExecute = async (overrideQuery?: string, overrideJur?: string) => {
    const q = (overrideQuery || query).trim();
    if (!q) return;
    setLoading(true);
    setError(null);
    try {
      const jur = overrideJur || (selectedJurisdiction === "GLOBAL" ? undefined : selectedJurisdiction);
      const res = await callDecisionEngine({
        query: q,
        jurisdiction: jur,
        language: selectedLanguage,
        top_k: 5,
      });
      setResponse(res);
      setActiveTab("why");
    } catch (err: any) {
      setError(err?.message || "Failed to evaluate decision query. Please verify backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const getDecisionBadge = (decision: DecisionType) => {
    switch (decision) {
      case "YES":
        return {
          label: "YES",
          bg: "bg-emerald-600/20 border-emerald-500/50 text-emerald-400",
          icon: "✓",
          desc: "Action permitted under authoritative evidence with no material restrictions.",
        };
      case "CONDITIONAL_YES":
        return {
          label: "CONDITIONAL YES",
          bg: "bg-amber-500/20 border-amber-500/50 text-amber-400",
          icon: "⚠️",
          desc: "Action may proceed subject to meeting mandatory regulatory approvals & FTO clearance.",
        };
      case "CONDITIONAL_NO":
        return {
          label: "CONDITIONAL NO",
          bg: "bg-orange-500/20 border-orange-500/50 text-orange-400",
          icon: "✋",
          desc: "Cannot proceed until specific legal/regulatory obstacles are formally resolved.",
        };
      case "NO":
        return {
          label: "NO",
          bg: "bg-rose-600/20 border-rose-500/50 text-rose-400",
          icon: "✕",
          desc: "Action is prohibited by authoritative statute, regulation, or active blocking IP.",
        };
      case "INSUFFICIENT_EVIDENCE":
      default:
        return {
          label: "INSUFFICIENT EVIDENCE",
          bg: "bg-slate-700/40 border-slate-600 text-slate-300",
          icon: "❓",
          desc: "Corpus evidence is inadequate to responsibly decide. Formal clearance required.",
        };
    }
  };

  const getConfidenceBadge = (confidence: DecisionConfidence) => {
    switch (confidence) {
      case "HIGH":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
      case "MEDIUM":
        return "bg-amber-500/20 text-amber-300 border-amber-500/40";
      case "LOW":
      default:
        return "bg-slate-700 text-slate-400 border-slate-600";
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur sticky top-0 z-30 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span className="text-amber-400">⚖️ AYURLEX</span>
            <span className="text-xs uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Phase 7 Decision Engine
            </span>
          </Link>
        </div>

        {/* Language selector — STRICT ORDER: EN, TE, HI, JA */}
        <div className="flex items-center gap-3">
          <label className="text-xs text-slate-400 font-medium">Language:</label>
          <select
            value={selectedLanguage}
            onChange={(e) => handleLanguageChange(e.target.value as LanguageCode)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          >
            {CORE_LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.flag} {l.label}
              </option>
            ))}
          </select>
          <Link
            href="/international"
            className="text-xs text-slate-400 hover:text-amber-400 transition-colors px-2 py-1"
          >
            ← Back to Search
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-6 space-y-6">
        {/* Banner */}
        <div className="rounded-xl border border-amber-500/20 bg-gradient-to-r from-amber-950/30 via-slate-900 to-slate-950 p-6">
          <h1 className="text-2xl font-bold text-white mb-2">
            Cross-Border Decision & Jurisdiction Reasoning Engine
          </h1>
          <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
            Deterministic evaluation of cross-border IP commercialization, patent territoriality,
            regulatory classification, and freedom-to-operate (FTO). The decision rule engine executes
            <strong> before</strong> narrative generation to prevent automated hallucination of legal rights.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
              Active Scope: 🇺🇸 US · 🇪🇺 EP · 🌐 WO · 🇯🇵 JP
            </span>
            <span className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300">
              🇮🇳 India: Evaluation-Only
            </span>
            <span className="px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-400">
              🚫 Germany (DE): Removed from Production
            </span>
          </div>
        </div>

        {/* Query Input Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <label className="text-sm font-semibold text-slate-200">
              Commercialization / Legal Question:
            </label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Target Jurisdiction:</span>
              <div className="flex flex-wrap items-center gap-1">
                {[
                  { id: "US", label: "🇺🇸 US" },
                  { id: "JP", label: "🇯🇵 JP" },
                  { id: "EP", label: "🇪🇺 EP" },
                  { id: "WO", label: "🌐 WO" },
                  { id: "GLOBAL", label: "🌐 Global" },
                  { id: "IN", label: "🇮🇳 India (Eval Only)" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedJurisdiction(item.id)}
                    className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                      selectedJurisdiction === item.id
                        ? item.id === "IN"
                          ? "bg-amber-400 text-slate-950 font-bold"
                          : "bg-amber-500 text-slate-950 font-semibold"
                        : "bg-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="relative">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. I have an Indian patent for an ashwagandha-curcumin formulation. Can I legally sell it in the USA?"
              rows={3}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-400">Sample Inquiries:</span>
              {SAMPLE_QUERIES.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setQuery(sample.query);
                    setSelectedJurisdiction(sample.target);
                    handleExecute(sample.query, sample.target);
                  }}
                  className="text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  {sample.title}
                </button>
              ))}
            </div>

            <button
              type="button"
              disabled={loading || !query.trim()}
              onClick={() => handleExecute()}
              className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-semibold text-sm transition-colors flex items-center gap-2"
            >
              {loading ? (
                <>
                  <span className="animate-spin">🔄</span>
                  <span>Evaluating Decision...</span>
                </>
              ) : (
                <>
                  <span>Evaluate Decision</span>
                  <span>→</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-start gap-2">
            <span>⚠️</span>
            <div>{error}</div>
          </div>
        )}

        {/* Decision Response View */}
        {response && (
          <div className="space-y-6">
            {/* Primary Decision Banner */}
            {(() => {
              const badge = getDecisionBadge(response.decision);
              return (
                <div className={`p-6 rounded-xl border ${badge.bg} space-y-3`}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{badge.icon}</span>
                      <div>
                        <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                          AYURLEX DETERMINISTIC DECISION
                        </div>
                        <div className="text-3xl font-black tracking-tight">{badge.label}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${getConfidenceBadge(
                          response.confidence
                        )}`}
                      >
                        Confidence: {response.confidence}
                      </span>
                      <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                        CRAG: {response.crag_status}
                      </span>
                      {response.evaluation_only && (
                        <span className="text-xs px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          India Evaluation-Only
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-slate-300">{badge.desc}</p>
                </div>
              );
            })()}

            {/* Navigation Tabs */}
            <div className="border-b border-slate-800 flex gap-2">
              {[
                { id: "why", label: "🎯 Why (Rationale)" },
                { id: "patent", label: "📜 Patent Territoriality" },
                { id: "regulatory", label: "🏛️ Regulatory Classification" },
                { id: "fto", label: "🛡️ IP / FTO Risk" },
                { id: "steps", label: "📋 Next Steps & Conditions" },
                { id: "evidence", label: `📚 Evidence (${response.evidence.length})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2.5 text-xs font-semibold transition-colors border-b-2 -mb-px ${
                    activeTab === tab.id
                      ? "border-amber-400 text-amber-400"
                      : "border-transparent text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              {activeTab === "why" && (
                <div className="space-y-4">
                  <h3 className="text-base font-semibold text-white">Primary Rationale</h3>
                  <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                    {response.why}
                  </p>
                  <div className="mt-4 p-4 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-3">
                    <div className="font-semibold text-slate-400 uppercase tracking-wider">
                      Jurisdiction & Commercialization Scope:
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {/* Target Jurisdiction Card - Primary */}
                      <div className="p-3 rounded-md bg-amber-500/10 border border-amber-500/30">
                        <div className="flex items-center justify-between font-bold text-amber-300 mb-1">
                          <span>🎯 Target Decision Market: {response.target_jurisdiction || response.decision_jurisdiction}</span>
                          <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-200">
                            Governing Jurisdiction
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300">
                          {response.target_evidence_note || "Target jurisdiction evidence evaluated for commercialization decision."}
                        </p>
                      </div>

                      {/* Origin Jurisdiction Card - Context Only */}
                      <div className="p-3 rounded-md bg-slate-900 border border-slate-700">
                        <div className="flex items-center justify-between font-bold text-slate-300 mb-1">
                          <span>📍 Origin Context: {response.origin_jurisdiction || "Not Specified"}</span>
                          <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                            Context Only
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          {response.origin_evidence_note || "Origin patent grants territorial rights strictly within origin borders. Commercialization rights in target market are evaluated under target laws."}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-300">
                      <div>
                        Objective: <span className="text-white font-medium">{response.query_intent.user_objective}</span>
                      </div>
                      <div>
                        Product: <span className="text-white font-medium">{response.query_intent.product || "Unspecified"}</span>
                      </div>
                      <div>
                        Decision Authority: <span className="text-white font-medium">{response.decision_jurisdiction}</span>
                      </div>
                      <div>
                        Target Evidence Count: <span className="text-emerald-400 font-medium">{response.target_evidence?.length || (response.evidence.filter(e => e.jurisdiction === response.decision_jurisdiction).length)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "patent" && (
                <div className="space-y-4">
                  <h3 className="text-base font-semibold text-white">
                    Patent Scope & Territoriality Analysis
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                    {response.patent_analysis}
                  </p>
                </div>
              )}

              {activeTab === "regulatory" && (
                <div className="space-y-4">
                  <h3 className="text-base font-semibold text-white">
                    Regulatory Classification & Statutory Compliance
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                    {response.regulatory_analysis}
                  </p>
                </div>
              )}

              {activeTab === "fto" && (
                <div className="space-y-4">
                  <h3 className="text-base font-semibold text-white">
                    Third-Party IP & Freedom to Operate (FTO) Safety
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                    {response.ip_fto_analysis}
                  </p>
                </div>
              )}

              {activeTab === "steps" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold text-amber-400 mb-3 uppercase tracking-wider">
                      Conditions Precedent to Commercialization:
                    </h3>
                    <ul className="space-y-2">
                      {response.conditions.map((c, idx) => (
                        <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                          <span className="text-amber-400 font-bold">•</span>
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-emerald-400 mb-3 uppercase tracking-wider">
                      Required Next Steps:
                    </h3>
                    <ol className="space-y-2">
                      {response.required_next_steps.map((step, idx) => (
                        <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                          <span className="text-emerald-400 font-bold">{idx + 1}.</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              )}

              {activeTab === "evidence" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-semibold text-white mb-1">
                      Retrieved Patent & Statutory Evidence
                    </h3>
                    <p className="text-xs text-slate-400">
                      Partitioned by governing target authority, origin patent context, and prior art disclosures.
                    </p>
                  </div>

                  {/* Target Evidence Section */}
                  {response.target_evidence && response.target_evidence.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                          <span>🎯 Target Decision Evidence ({response.target_jurisdiction || response.decision_jurisdiction})</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                            Governing Market
                          </span>
                        </h4>
                        <span className="text-xs text-slate-400">{response.target_evidence.length} citation(s)</span>
                      </div>
                      <div className="space-y-3">
                        {response.target_evidence.map((c: any, idx: number) => (
                          <div key={idx} className="p-4 rounded-lg bg-slate-950 border border-amber-500/30 space-y-2">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <span className="text-xs font-bold text-amber-300">
                                [{c.citation_id || idx + 1}] {c.publication_number}
                              </span>
                              <div className="flex gap-2">
                                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                                  {c.jurisdiction}
                                </span>
                                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                                  {c.section}
                                </span>
                              </div>
                            </div>
                            <div className="text-xs font-medium text-slate-200">
                              {c.title || "Target Patent / Regulatory Document"}
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                              {c.text}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Origin Evidence Section */}
                  {response.origin_evidence && response.origin_evidence.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-2">
                          <span>📍 Origin Context Evidence ({response.origin_jurisdiction})</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">
                            Context Only
                          </span>
                        </h4>
                        <span className="text-xs text-slate-400">{response.origin_evidence.length} citation(s)</span>
                      </div>
                      <div className="space-y-3">
                        {response.origin_evidence.map((c: any, idx: number) => (
                          <div key={idx} className="p-4 rounded-lg bg-slate-950 border border-blue-500/30 space-y-2">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <span className="text-xs font-bold text-blue-300">
                                [{c.citation_id || idx + 1}] {c.publication_number}
                              </span>
                              <div className="flex gap-2">
                                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40">
                                  {c.jurisdiction}
                                </span>
                                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                                  {c.section}
                                </span>
                              </div>
                            </div>
                            <div className="text-xs font-medium text-slate-200">
                              {c.title || "Origin Patent Document"}
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                              {c.text}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Fallback / General Evidence List */}
                  {(!response.target_evidence || response.target_evidence.length === 0) &&
                   (!response.origin_evidence || response.origin_evidence.length === 0) && (
                    <div>
                      {response.evidence.length === 0 ? (
                        <p className="text-xs text-slate-400">No citations retrieved.</p>
                      ) : (
                        <div className="space-y-3">
                          {response.evidence.map((c, idx) => (
                            <div key={idx} className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <span className="text-xs font-bold text-amber-400">
                                  [{c.citation_id}] {c.publication_number}
                                </span>
                                <div className="flex gap-2">
                                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                                    {c.jurisdiction}
                                  </span>
                                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                                    {c.section}
                                  </span>
                                </div>
                              </div>
                              <div className="text-xs font-medium text-slate-200">
                                {c.title || "Patent Specification"}
                              </div>
                              <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                                {c.text}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Disclaimer & Latency Footer */}
            <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2 text-amber-400 font-semibold">
                <span>⚖️ Statutory Notice & Disclaimer:</span>
              </div>
              <p>{response.disclaimer}</p>
              <div className="pt-2 border-t border-slate-800 flex flex-wrap gap-4 text-[11px] text-slate-500">
                <span>Total Pipeline: {response.latencies_ms.total_decision_pipeline_ms}ms</span>
                <span>Retrieval: {response.latencies_ms.retrieval_ms}ms</span>
                <span>CRAG: {response.latencies_ms.crag_ms}ms</span>
                <span>Decision Engine: {response.latencies_ms.decision_engine_ms}ms</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
