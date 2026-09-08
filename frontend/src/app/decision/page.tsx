"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
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

const JURISDICTION_OPTIONS = [
  { id: "US", label: "🇺🇸 United States (US)", desc: "USPTO / FDA DSHEA (Default Production)" },
  { id: "JP", label: "🇯🇵 Japan (JP)", desc: "JPO / MHLW PMD Act (薬機法)" },
  { id: "EP", label: "🇪🇺 European Union (EP)", desc: "EPO / EMA THMPD Directive" },
  { id: "WO", label: "🌐 International / WIPO (WO)", desc: "PCT International Phase" },
  { id: "GLOBAL", label: "🌐 Multi-Jurisdiction Global", desc: "US · JP · EP · WO Combined" },
  { id: "IN", label: "🇮🇳 India (Evaluation-Only)", desc: "Patents Act 1970 § 3(e)/3(p) & NBA § 6" },
];

const SAMPLE_QUERIES = [
  {
    title: "India Patent → Sell in USA",
    query: "I have an Ayurvedic product patented in India. Can I legally sell it in the USA?",
    target: "US",
    tag: "Cross-Border Commercialization",
  },
  {
    title: "US Formulation → Sell in Japan",
    query: "I have a patented herbal formulation in the USA. Can I market it in Japan?",
    target: "JP",
    tag: "Japan Market Entry",
  },
  {
    title: "Japan → Sell in USA",
    query: "I hold a Japanese patent for Kampo herbal medicine. Can I sell it in the United States?",
    target: "US",
    tag: "US Commercialization",
  },
  {
    title: "India — Evaluation Only Inquiry",
    query: "Is an Ayurvedic polyherbal formulation patentable under Indian Section 3(e) and 3(p)?",
    target: "IN",
    tag: "India Statutory Benchmark",
  },
  {
    title: "Japanese Herbal Commercialization",
    query: "日本において生薬抽出物を含有する医薬品組成物を販売することは可能ですか？",
    target: "JP",
    tag: "Japanese Inquiry (JA)",
  },
];

export default function DecisionEnginePage() {
  const [query, setQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>("en");
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<string>("US");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<DecisionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // UI state for Three-Dots Dropdown Menus
  const [isQueryMenuOpen, setIsQueryMenuOpen] = useState(false);
  const [isDecisionMenuOpen, setIsDecisionMenuOpen] = useState(false);
  const [displayMode, setDisplayMode] = useState<"divided" | "tabs">("divided");
  const [activeTab, setActiveTab] = useState<"why" | "patent" | "regulatory" | "fto" | "steps" | "evidence">("why");

  const queryMenuRef = useRef<HTMLDivElement>(null);
  const decisionMenuRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (queryMenuRef.current && !queryMenuRef.current.contains(event.target as Node)) {
        setIsQueryMenuOpen(false);
      }
      if (decisionMenuRef.current && !decisionMenuRef.current.contains(event.target as Node)) {
        setIsDecisionMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    setIsQueryMenuOpen(false);
    setIsDecisionMenuOpen(false);
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

  const handleCopyReport = () => {
    if (!response) return;
    const text = `AYURLEX Phase 7 Deterministic Decision Report
==================================================
Query: ${response.query}
Verdict: ${response.decision} (Confidence: ${response.confidence})
CRAG Status: ${response.crag_status}
Decision Authority: ${response.decision_jurisdiction}
Origin Context: ${response.origin_jurisdiction || "N/A"}
Target Market: ${response.target_jurisdiction || response.decision_jurisdiction}

1. PRIMARY RATIONALE:
${response.why}

2. PATENT SCOPE & TERRITORIALITY:
${response.patent_analysis}

3. REGULATORY CLASSIFICATION:
${response.regulatory_analysis}

4. THIRD-PARTY IP & FTO RISK:
${response.ip_fto_analysis}

5. CONDITIONS PRECEDENT:
${response.conditions.map((c, i) => `  [${i + 1}] ${c}`).join("\n")}

6. REQUIRED NEXT STEPS:
${response.required_next_steps.map((s, i) => `  [${i + 1}] ${s}`).join("\n")}

7. STATUTORY DISCLAIMER:
${response.disclaimer}
`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
    setIsDecisionMenuOpen(false);
  };

  const getDecisionBadge = (decision: DecisionType) => {
    switch (decision) {
      case "YES":
        return {
          label: "YES",
          bg: "bg-emerald-950/40 border-emerald-500/60 text-emerald-400",
          border: "border-emerald-500/40",
          icon: "✓",
          desc: "Action permitted under authoritative evidence with no material restrictions.",
        };
      case "CONDITIONAL_YES":
        return {
          label: "CONDITIONAL YES",
          bg: "bg-amber-950/40 border-amber-500/60 text-amber-400",
          border: "border-amber-500/40",
          icon: "⚠️",
          desc: "Action may proceed subject to meeting mandatory regulatory approvals & FTO clearance.",
        };
      case "CONDITIONAL_NO":
        return {
          label: "CONDITIONAL NO",
          bg: "bg-orange-950/40 border-orange-500/60 text-orange-400",
          border: "border-orange-500/40",
          icon: "✋",
          desc: "Cannot proceed until specific legal/regulatory obstacles are formally resolved.",
        };
      case "NO":
        return {
          label: "NO",
          bg: "bg-rose-950/40 border-rose-500/60 text-rose-400",
          border: "border-rose-500/40",
          icon: "✕",
          desc: "Action is prohibited by authoritative statute, regulation, or active blocking IP.",
        };
      case "INSUFFICIENT_EVIDENCE":
      default:
        return {
          label: "INSUFFICIENT EVIDENCE",
          bg: "bg-slate-900/60 border-slate-700 text-slate-300",
          border: "border-slate-700",
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
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/70 backdrop-blur sticky top-0 z-30 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span className="text-amber-400">⚖️ AYURLEX</span>
            <span className="text-xs uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Phase 7 Decision Engine
            </span>
          </Link>
        </div>

        {/* Header Navigation & Quick Language Indicator */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs">
            <span className="text-slate-400">Market:</span>
            <span className="font-semibold text-amber-400">
              {JURISDICTION_OPTIONS.find((j) => j.id === selectedJurisdiction)?.label.split(" ")[0] || "🇺🇸"} {selectedJurisdiction}
            </span>
          </div>

          <Link
            href="/international"
            className="text-xs text-slate-400 hover:text-amber-400 transition-colors px-2 py-1"
          >
            ← Back to Search
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Banner */}
        <div className="rounded-xl border border-amber-500/20 bg-gradient-to-r from-amber-950/30 via-slate-900 to-slate-950 p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">
                Cross-Border Decision & Jurisdiction Reasoning Engine
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
                Deterministic evaluation of cross-border IP commercialization, patent territoriality,
                regulatory classification, and freedom-to-operate (FTO). The decision rule engine executes
                <strong> before</strong> narrative generation to prevent automated hallucination of legal rights.
              </p>
            </div>
          </div>

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

        {/* Query Input Section with Three-Dots Menu in Right Top */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <span>Commercialization / Legal Question:</span>
              </label>
              <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-amber-300 font-mono">
                Target: {selectedJurisdiction}
              </span>
            </div>

            {/* THREE-DOTS (⋮) MENU IN RIGHT TOP */}
            <div className="relative" ref={queryMenuRef}>
              <button
                type="button"
                onClick={() => setIsQueryMenuOpen(!isQueryMenuOpen)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                  isQueryMenuOpen
                    ? "bg-amber-500 text-slate-950 border-amber-400 shadow-md"
                    : "bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 hover:border-slate-600"
                }`}
                title="Open Options Menu"
              >
                <span className="text-base leading-none font-black">⋮</span>
                <span>Options</span>
              </button>

              {/* VERTICAL OPTIONS DROPDOWN */}
              {isQueryMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 p-4 space-y-4 max-h-[80vh] overflow-y-auto backdrop-blur-md">
                  {/* Vertical Section 1: Target Jurisdictions */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                        1. Target Jurisdiction (Vertical List)
                      </span>
                      <span className="text-[10px] text-slate-400">Select Market</span>
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      {JURISDICTION_OPTIONS.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            setSelectedJurisdiction(item.id);
                            setIsQueryMenuOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all flex flex-col ${
                            selectedJurisdiction === item.id
                              ? item.id === "IN"
                                ? "bg-amber-500/20 border border-amber-400 text-amber-200 font-bold"
                                : "bg-amber-500 text-slate-950 font-bold shadow-md"
                              : "bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold">{item.label}</span>
                            {selectedJurisdiction === item.id && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/30">Active</span>
                            )}
                          </div>
                          <span className={`text-[10px] mt-0.5 ${selectedJurisdiction === item.id && item.id !== "IN" ? "text-slate-900" : "text-slate-400"}`}>
                            {item.desc}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-slate-800" />

                  {/* Vertical Section 2: Sample Queries */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                        2. Sample Scenarios (Vertical List)
                      </span>
                      <span className="text-[10px] text-slate-400">Click to Load & Run</span>
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      {SAMPLE_QUERIES.map((sample, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setQuery(sample.query);
                            setSelectedJurisdiction(sample.target);
                            setIsQueryMenuOpen(false);
                            handleExecute(sample.query, sample.target);
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs transition-all flex flex-col"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-slate-200">{sample.title}</span>
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 border border-slate-700">
                              {sample.target}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                            {sample.query}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-slate-800" />

                  {/* Vertical Section 3: Interface Language */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                        3. Interface Language (Vertical List)
                      </span>
                      <span className="text-[10px] text-slate-400">Select</span>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      {CORE_LANGUAGES.map((l) => (
                        <button
                          key={l.code}
                          type="button"
                          onClick={() => {
                            handleLanguageChange(l.code);
                            setIsQueryMenuOpen(false);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs text-left transition-colors flex items-center gap-2 ${
                            selectedLanguage === l.code
                              ? "bg-amber-500 text-slate-950 font-bold"
                              : "bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800"
                          }`}
                        >
                          <span>{l.flag}</span>
                          <span>{l.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-slate-800 pt-2 flex justify-between items-center text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setQuery("");
                        setIsQueryMenuOpen(false);
                      }}
                      className="text-slate-400 hover:text-rose-400 transition-colors"
                    >
                      🧹 Clear Question
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsQueryMenuOpen(false)}
                      className="text-amber-400 font-semibold hover:underline"
                    >
                      Close Menu ✕
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Text Area */}
          <div className="relative">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. I have an Indian patent for an Ayurvedic formulation. Can I legally sell it in the USA?"
              rows={3}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors shadow-inner"
            />
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Quick Switch:</span>
              {["US", "JP", "EP", "IN"].map((jur) => (
                <button
                  key={jur}
                  type="button"
                  onClick={() => setSelectedJurisdiction(jur)}
                  className={`text-xs px-2 py-0.5 rounded font-medium transition-colors ${
                    selectedJurisdiction === jur
                      ? "bg-amber-500 text-slate-950 font-bold"
                      : "bg-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {jur}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setIsQueryMenuOpen(true)}
                className="text-xs text-amber-400 hover:text-amber-300 font-medium ml-1 underline"
              >
                More options in ⋮
              </button>
            </div>

            <button
              type="button"
              disabled={loading || !query.trim()}
              onClick={() => handleExecute()}
              className="px-6 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-sm transition-all shadow-lg hover:shadow-amber-500/20 flex items-center gap-2 ml-auto"
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
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-start gap-3 shadow-lg">
            <span className="text-lg">⚠️</span>
            <div>
              <div className="font-semibold text-rose-200">Execution Error</div>
              <div className="text-xs text-rose-300/90 mt-0.5">{error}</div>
            </div>
          </div>
        )}

        {/* DECISION MARKER WITH DIVIDED SECTIONS & THREE-DOTS MENU IN RIGHT TOP */}
        {response && (
          <div className="space-y-6">
            {/* ─── SECTION 1: PRIMARY DECISION VERDICT MARKER ─── */}
            {(() => {
              const badge = getDecisionBadge(response.decision);
              return (
                <div
                  className={`p-6 rounded-xl border ${badge.bg} relative shadow-2xl transition-all space-y-4`}
                >
                  {/* Top Bar inside Decision Marker with Three-Dots in Right Top */}
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="text-3xl sm:text-4xl p-2 rounded-xl bg-slate-950/60 border border-slate-700/60">
                        {badge.icon}
                      </div>
                      <div>
                        <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold flex items-center gap-2">
                          <span>AYURLEX DETERMINISTIC VERDICT</span>
                          <span className="text-[9px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                            RULE ENGINE PRE-COMPUTED
                          </span>
                        </div>
                        <div className="text-2xl sm:text-4xl font-black tracking-tight mt-1 text-white">
                          {badge.label}
                        </div>
                        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1 leading-relaxed">
                          {badge.desc}
                        </p>
                      </div>
                    </div>

                    {/* Right Top Controls & Three-Dots Menu */}
                    <div className="flex items-center gap-2 ml-auto">
                      <span
                        className={`text-xs px-3 py-1 rounded-full border font-bold ${getConfidenceBadge(
                          response.confidence
                        )}`}
                      >
                        Confidence: {response.confidence}
                      </span>
                      <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                        CRAG: {response.crag_status}
                      </span>

                      {/* THREE-DOTS (⋮) MENU IN RIGHT TOP OF DECISION MARKER */}
                      <div className="relative" ref={decisionMenuRef}>
                        <button
                          type="button"
                          onClick={() => setIsDecisionMenuOpen(!isDecisionMenuOpen)}
                          className="p-2 px-3 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 font-bold text-sm transition-all shadow-md flex items-center gap-1.5"
                          title="Decision Actions Menu"
                        >
                          <span className="text-base leading-none">⋮</span>
                          <span className="text-xs hidden sm:inline font-semibold">View</span>
                        </button>

                        {/* VERTICAL DECISION MENU */}
                        {isDecisionMenuOpen && (
                          <div className="absolute right-0 top-full mt-2 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 p-3 space-y-3 backdrop-blur-md">
                            <div>
                              <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-2">
                                Display Layout
                              </div>
                              <div className="flex flex-col space-y-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setDisplayMode("divided");
                                    setIsDecisionMenuOpen(false);
                                  }}
                                  className={`text-left px-3 py-2 rounded-lg text-xs transition-colors flex items-center justify-between ${
                                    displayMode === "divided"
                                      ? "bg-amber-500 text-slate-950 font-bold"
                                      : "bg-slate-950 hover:bg-slate-800 text-slate-300"
                                  }`}
                                >
                                  <span>📑 All Divided Sections</span>
                                  {displayMode === "divided" && <span>✓</span>}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setDisplayMode("tabs");
                                    setIsDecisionMenuOpen(false);
                                  }}
                                  className={`text-left px-3 py-2 rounded-lg text-xs transition-colors flex items-center justify-between ${
                                    displayMode === "tabs"
                                      ? "bg-amber-500 text-slate-950 font-bold"
                                      : "bg-slate-950 hover:bg-slate-800 text-slate-300"
                                  }`}
                                >
                                  <span>🗂️ Tabbed Navigation</span>
                                  {displayMode === "tabs" && <span>✓</span>}
                                </button>
                              </div>
                            </div>

                            <div className="border-t border-slate-800" />

                            <div>
                              <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-2">
                                Jump to Section
                              </div>
                              <div className="flex flex-col space-y-1">
                                {[
                                  { id: "sec-rationale", label: "🎯 Primary Rationale" },
                                  { id: "sec-jurisdictions", label: "📍 Territorial Separation" },
                                  { id: "sec-analysis", label: "📜 Legal Analysis Matrix" },
                                  { id: "sec-conditions", label: "⚠️ Conditions & Next Steps" },
                                  { id: "sec-evidence", label: `📚 Evidence (${response.evidence.length})` },
                                ].map((sec) => (
                                  <button
                                    key={sec.id}
                                    type="button"
                                    onClick={() => {
                                      setIsDecisionMenuOpen(false);
                                      const el = document.getElementById(sec.id);
                                      if (el) el.scrollIntoView({ behavior: "smooth" });
                                    }}
                                    className="text-left px-3 py-1.5 rounded-lg text-xs bg-slate-950 hover:bg-slate-800 text-slate-300 transition-colors"
                                  >
                                    {sec.label}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="border-t border-slate-800" />

                            <div>
                              <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-2">
                                Export & Actions
                              </div>
                              <div className="flex flex-col space-y-1">
                                <button
                                  type="button"
                                  onClick={handleCopyReport}
                                  className="text-left px-3 py-2 rounded-lg text-xs bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold transition-colors flex items-center justify-between"
                                >
                                  <span>📋 Copy Full Report</span>
                                  {copied && <span className="text-[10px] text-emerald-400">Copied!</span>}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setIsDecisionMenuOpen(false);
                                    window.print();
                                  }}
                                  className="text-left px-3 py-1.5 rounded-lg text-xs bg-slate-950 hover:bg-slate-800 text-slate-300 transition-colors"
                                >
                                  🖨️ Print / Save PDF
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Decision Reason Codes Tags */}
                  {response.evidence_sufficiency?.decision_reason_codes && (
                    <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                        Diagnostic Codes:
                      </span>
                      {response.evidence_sufficiency.decision_reason_codes.map((code, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 font-mono"
                        >
                          #{code}
                        </span>
                      ))}
                      {response.evaluation_only && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 font-semibold">
                          India Evaluation-Only
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* TAB CONTROLS (IF USER PREFERS TABBED VIEW VIA THREE-DOTS) */}
            {displayMode === "tabs" && (
              <div className="border-b border-slate-800 flex flex-wrap gap-2">
                {[
                  { id: "why", label: "🎯 Rationale & Scope" },
                  { id: "patent", label: "📜 Patent Territoriality" },
                  { id: "regulatory", label: "🏛️ Regulatory Standards" },
                  { id: "fto", label: "🛡️ IP / FTO Risk" },
                  { id: "steps", label: "📋 Conditions & Steps" },
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
            )}

            {/* ─── SECTION 2: PRIMARY RATIONALE & SCOPE ─── */}
            {(displayMode === "divided" || activeTab === "why") && (
              <div
                id="sec-rationale"
                className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-4 shadow-lg"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                    <span className="text-amber-400 text-lg">🎯</span>
                    <span>Divided Section: Primary Decision Rationale</span>
                  </h3>
                  <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                    Statutory Synthesis
                  </span>
                </div>

                <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line bg-slate-950/70 p-4 rounded-lg border border-slate-800/80">
                  {response.why}
                </p>

                {/* ─── SECTION 3: TERRITORIAL JURISDICTION SEPARATION ─── */}
                <div id="sec-jurisdictions" className="space-y-3 pt-2">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                    <span>Divided Section: Territorial Jurisdiction Routing</span>
                    <span className="text-[10px] text-amber-400 font-normal">Target Market Governs Decision</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Target Decision Market Card */}
                    <div className="p-4 rounded-xl bg-gradient-to-br from-amber-950/30 to-slate-950 border border-amber-500/40 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-amber-300 flex items-center gap-1.5">
                          <span>🎯 Target Decision Market:</span>
                          <span className="text-white font-mono font-black">
                            {response.target_jurisdiction || response.decision_jurisdiction}
                          </span>
                        </span>
                        <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-200 font-bold border border-amber-500/30">
                          Governing Law
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {response.target_evidence_note ||
                          "Authoritative target evidence evaluated for commercialization decision."}
                      </p>
                      <div className="pt-2 border-t border-amber-500/20 text-[11px] text-amber-400/90 font-medium">
                        ✓ Commercialization permission and FTO are strictly determined by this target market.
                      </div>
                    </div>

                    {/* Origin Patent Context Card */}
                    <div className="p-4 rounded-xl bg-gradient-to-br from-blue-950/20 to-slate-950 border border-slate-700 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-blue-300 flex items-center gap-1.5">
                          <span>📍 Origin Context:</span>
                          <span className="text-white font-mono font-black">
                            {response.origin_jurisdiction || "Not Specified"}
                          </span>
                        </span>
                        <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                          Context Only
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {response.origin_evidence_note ||
                          "Origin patent grants territorial rights strictly within origin borders. Commercialization rights in target market are evaluated under target laws."}
                      </p>
                      <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 font-medium">
                        ℹ️ Absence of origin patent data does NOT block foreign commercialization.
                      </div>
                    </div>
                  </div>

                  {/* Metadata Grid */}
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-300">
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase">Objective</span>
                      <span className="text-white font-semibold">{response.query_intent.user_objective}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase">Product</span>
                      <span className="text-white font-semibold truncate block">
                        {response.query_intent.product || "Herbal Formulation"}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase">Governing Authority</span>
                      <span className="text-amber-400 font-semibold">{response.decision_jurisdiction}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase">Target Evidence</span>
                      <span className="text-emerald-400 font-semibold">
                        {response.target_evidence?.length ||
                          response.evidence.filter((e) => e.jurisdiction === response.decision_jurisdiction).length}{" "}
                        Citation(s)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ─── SECTION 4: SUBSTANTIVE LEGAL & REGULATORY MATRIX ─── */}
            {(displayMode === "divided" || ["patent", "regulatory", "fto"].includes(activeTab)) && (
              <div
                id="sec-analysis"
                className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-4 shadow-lg"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                    <span className="text-amber-400 text-lg">⚖️</span>
                    <span>Divided Section: Substantive Legal Analysis Matrix</span>
                  </h3>
                  <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                    Territoriality · Regulatory · FTO
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Pillar 1: Patent Territoriality */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
                        <span>📜</span>
                        <span>Patent Territoriality</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                        {response.patent_analysis}
                      </p>
                    </div>
                    <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-800/80">
                      Standard: 35 U.S.C. / EPC / JPO Territoriality
                    </div>
                  </div>

                  {/* Pillar 2: Regulatory Classification */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1">
                        <span>🏛️</span>
                        <span>Regulatory Standards</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                        {response.regulatory_analysis}
                      </p>
                    </div>
                    <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-800/80">
                      Standard: FDA 21 CFR 111 / MHLW / EMA
                    </div>
                  </div>

                  {/* Pillar 3: Freedom to Operate (FTO) */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
                        <span>🛡️</span>
                        <span>IP / FTO Risk Analysis</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                        {response.ip_fto_analysis}
                      </p>
                    </div>
                    <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-800/80">
                      Standard: Zero False Clearance Guarantee
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ─── SECTION 5: ACTIONABLE CONDITIONS & NEXT STEPS ─── */}
            {(displayMode === "divided" || activeTab === "steps") && (
              <div
                id="sec-conditions"
                className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-4 shadow-lg"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                    <span className="text-amber-400 text-lg">📋</span>
                    <span>Divided Section: Actionable Governance & Conditions</span>
                  </h3>
                  <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                    Mandatory Directives
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column: Conditions Precedent */}
                  <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-3">
                    <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                      <span>⚠️ Mandatory Conditions Precedent:</span>
                    </h4>
                    <ul className="space-y-2.5">
                      {response.conditions.map((c, idx) => (
                        <li key={idx} className="text-xs text-slate-300 flex items-start gap-2.5">
                          <span className="text-amber-400 font-bold mt-0.5">•</span>
                          <span className="leading-relaxed">{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Right Column: Required Next Steps */}
                  <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-3">
                    <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                      <span>✅ Required Action Plan & Next Steps:</span>
                    </h4>
                    <ol className="space-y-2.5">
                      {response.required_next_steps.map((step, idx) => (
                        <li key={idx} className="text-xs text-slate-300 flex items-start gap-2.5">
                          <span className="text-emerald-400 font-bold mt-0.5 min-w-[16px]">
                            {idx + 1}.
                          </span>
                          <span className="leading-relaxed">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            )}

            {/* ─── SECTION 6: PARTITIONED EVIDENCE CITATIONS ─── */}
            {(displayMode === "divided" || activeTab === "evidence") && (
              <div
                id="sec-evidence"
                className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-4 shadow-lg"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                    <span className="text-amber-400 text-lg">📚</span>
                    <span>Divided Section: Authoritative Evidence Partition</span>
                  </h3>
                  <span className="text-xs text-amber-400 font-mono font-semibold">
                    {response.evidence.length} Total Retrieved Citations
                  </span>
                </div>

                {/* Target Evidence Sub-Section */}
                {response.target_evidence && response.target_evidence.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                        <span>🎯 Target Decision Evidence ({response.target_jurisdiction || response.decision_jurisdiction})</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          Governing Market Authority
                        </span>
                      </h4>
                      <span className="text-xs text-slate-400">{response.target_evidence.length} citation(s)</span>
                    </div>

                    <div className="space-y-3">
                      {response.target_evidence.map((c: any, idx: number) => (
                        <div
                          key={idx}
                          className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 space-y-2 hover:border-amber-500/50 transition-colors"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="text-xs font-bold text-amber-300">
                              [{c.citation_id || idx + 1}] {c.publication_number}
                            </span>
                            <div className="flex gap-2">
                              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                                {c.jurisdiction}
                              </span>
                              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                                {c.section}
                              </span>
                              {c.source_url && (
                                <a
                                  href={c.source_url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-[10px] text-amber-400 underline hover:text-amber-300"
                                >
                                  View Source ↗
                                </a>
                              )}
                            </div>
                          </div>
                          <div className="text-xs font-semibold text-white">
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

                {/* Origin Evidence Sub-Section */}
                {response.origin_evidence && response.origin_evidence.length > 0 && (
                  <div className="space-y-3 pt-3 border-t border-slate-800">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-2">
                        <span>📍 Origin Context Evidence ({response.origin_jurisdiction})</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          Context Only
                        </span>
                      </h4>
                      <span className="text-xs text-slate-400">{response.origin_evidence.length} citation(s)</span>
                    </div>

                    <div className="space-y-3">
                      {response.origin_evidence.map((c: any, idx: number) => (
                        <div
                          key={idx}
                          className="p-4 rounded-xl bg-slate-950 border border-blue-500/30 space-y-2"
                        >
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
                          <div className="text-xs font-semibold text-slate-200">
                            {c.title || "Origin Patent Specification"}
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                            {c.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Cross-Jurisdiction Sub-Section */}
                {response.cross_jurisdiction_evidence && response.cross_jurisdiction_evidence.length > 0 && (
                  <div className="space-y-3 pt-3 border-t border-slate-800">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
                        <span>🌐 International & Treaty Prior Art (WIPO / PCT)</span>
                      </h4>
                      <span className="text-xs text-slate-400">
                        {response.cross_jurisdiction_evidence.length} citation(s)
                      </span>
                    </div>

                    <div className="space-y-3">
                      {response.cross_jurisdiction_evidence.map((c: any, idx: number) => (
                        <div
                          key={idx}
                          className="p-4 rounded-xl bg-slate-950 border border-purple-500/30 space-y-2"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="text-xs font-bold text-purple-300">
                              [{c.citation_id || idx + 1}] {c.publication_number}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                              {c.jurisdiction}
                            </span>
                          </div>
                          <div className="text-xs font-semibold text-slate-200">{c.title}</div>
                          <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">{c.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ─── SECTION 7: STATUTORY NOTICE & AUDIT TRAIL ─── */}
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3 text-xs text-slate-400 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-amber-400 font-bold flex items-center gap-2">
                  <span>⚖️ Statutory Notice & Disclaimer:</span>
                </span>
                <span className="text-[10px] text-slate-500">AYURLEX Engine v7.0</span>
              </div>
              <p className="leading-relaxed text-slate-300">{response.disclaimer}</p>
              <div className="pt-3 border-t border-slate-800/80 flex flex-wrap gap-4 text-[11px] text-slate-400">
                <span>Total Pipeline: {response.latencies_ms.total_decision_pipeline_ms}ms</span>
                {response.latencies_ms.retrieval_ms !== undefined && (
                  <span>Retrieval: {response.latencies_ms.retrieval_ms}ms</span>
                )}
                {response.latencies_ms.crag_ms !== undefined && (
                  <span>CRAG: {response.latencies_ms.crag_ms}ms</span>
                )}
                {response.latencies_ms.decision_engine_ms !== undefined && (
                  <span>Rule Engine: {response.latencies_ms.decision_engine_ms}ms</span>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
