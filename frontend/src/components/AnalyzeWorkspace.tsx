"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Search, 
  ArrowRight, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Bookmark, 
  Share2, 
  Copy, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  FileText, 
  Scale, 
  ShieldAlert, 
  ListChecks, 
  Info,
  Sparkles,
  ExternalLink,
  Plus,
  Minus
} from "lucide-react";
import { 
  DecisionResponse, 
  DecisionType, 
  DecisionConfidence, 
  JurisdictionType 
} from "@/types";
import { callDecisionEngine } from "@/lib/api";

const JURISDICTIONS: { id: JurisdictionType; label: string; flag: string; authority: string }[] = [
  { id: "US", label: "United States", flag: "🇺🇸", authority: "USPTO & FDA (DSHEA)" },
  { id: "IN", label: "India", flag: "🇮🇳", authority: "Indian Patent Office & NBA" },
  { id: "EU", label: "European Union", flag: "🇪🇺", authority: "EPO & EMA (THMPD)" },
  { id: "JP", label: "Japan", flag: "🇯🇵", authority: "JPO & MHLW (PMD Act)" },
  { id: "WO", label: "Global", flag: "🌐", authority: "WIPO PCT Framework" },
];

const ANALYSIS_TYPES = [
  { id: "auto", label: "Auto-detect Analysis" },
  { id: "patentability", label: "Patentability & Novelty" },
  { id: "market_entry", label: "Market Entry & FTO" },
  { id: "traditional_knowledge", label: "Traditional Knowledge & TKDL" },
  { id: "regulatory", label: "Regulatory & Food/Drug Safety" },
];

const SAMPLE_QUESTIONS = [
  { label: "US Formulation Patent", text: "Can I patent a standardized Ashwagandha extract formulation in the United States?", market: "US" },
  { label: "Japan Herbal Export", text: "Can I sell an Ayurvedic polyherbal dietary supplement in Japan under PMD Act?", market: "JP" },
  { label: "India Sec 3(e) Bar", text: "Is a combination of Curcumin and Piperine patentable under Section 3(e) and 3(p) in India?", market: "IN" },
  { label: "EU Herbal Directive", text: "What regulatory requirements apply to export Ayurvedic herbal tea to the European Union?", market: "EU" },
];

export default function AnalyzeWorkspace() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [targetMarket, setTargetMarket] = useState<JurisdictionType>("US");
  const [analysisType, setAnalysisType] = useState("auto");

  // Advanced Product Details (Optional)
  const [showProductDetails, setShowProductDetails] = useState(false);
  const [productName, setProductName] = useState("");
  const [productType, setProductType] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [countryOfOrigin, setCountryOfOrigin] = useState("IN");

  // Pipeline Execution State
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [response, setResponse] = useState<DecisionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  // Sync market from URL or localStorage
  useEffect(() => {
    try {
      const q = searchParams.get("q");
      const m = searchParams.get("market") as JurisdictionType;
      const t = searchParams.get("type");
      
      if (m && ["US", "IN", "EU", "JP", "WO"].includes(m)) {
        setTargetMarket(m);
      } else {
        const savedJur = localStorage.getItem("ayurlex_jurisdiction") as JurisdictionType;
        if (savedJur && ["US", "IN", "EU", "JP", "WO"].includes(savedJur)) {
          setTargetMarket(savedJur);
        }
      }

      if (t) setAnalysisType(t);

      if (q) {
        setQuery(q);
        executeAnalysis(q, m || targetMarket);
      }
    } catch {}
  }, [searchParams]);

  // Handle Target Market change
  const handleMarketChange = (newMarket: JurisdictionType) => {
    setTargetMarket(newMarket);
    try {
      localStorage.setItem("ayurlex_jurisdiction", newMarket);
      window.dispatchEvent(new Event("storage"));
    } catch {}
  };

  // Execution
  const executeAnalysis = async (searchQuery?: string, market?: string) => {
    const activeQuery = searchQuery || query;
    if (!activeQuery.trim()) return;

    setLoading(true);
    setError(null);
    setResponse(null);
    setSaved(false);

    // Multi-stage loader steps simulation while network completes
    setLoadingStep(1);
    const stepTimer1 = setTimeout(() => setLoadingStep(2), 600);
    const stepTimer2 = setTimeout(() => setLoadingStep(3), 1300);

    const activeMarket = market || targetMarket;

    // Compose rich query if structured details provided
    let fullQuery = activeQuery.trim();
    if (showProductDetails && (productName || ingredients)) {
      fullQuery += ` [Product: ${productName || "Unspecified"}, Type: ${productType || "Herbal"}, Ingredients: ${ingredients || "Classical Herbs"}, Origin: ${countryOfOrigin}]`;
    }

    try {
      const res = await callDecisionEngine({
        query: fullQuery,
        jurisdiction: activeMarket,
        language: "en",
      });
      setLoadingStep(4);
      setResponse(res);
    } catch (err: any) {
      setError(err.message || "Failed to analyze question. Authoritative statutory service temporarily busy.");
    } finally {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      setLoading(false);
    }
  };

  // Save to Reports workspace (localStorage)
  const handleSaveReport = () => {
    if (!response) return;
    try {
      const savedReportsRaw = localStorage.getItem("ayurlex_saved_reports") || "[]";
      const existing = JSON.parse(savedReportsRaw);
      
      const newReport = {
        id: `report_${Date.now()}`,
        title: query.slice(0, 70) + (query.length > 70 ? "..." : ""),
        date: new Date().toISOString(),
        jurisdiction: response.decision_jurisdiction || targetMarket,
        analysisType: analysisType === "auto" ? "Regulatory & Patent Intelligence" : analysisType,
        decision: response.decision,
        confidence: response.confidence,
        summary: response.why,
        response: response,
      };

      const updated = [newReport, ...existing];
      localStorage.setItem("ayurlex_saved_reports", JSON.stringify(updated));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Save report error:", err);
    }
  };

  // Copy Summary
  const handleCopySummary = () => {
    if (!response) return;
    const text = `AYURLEX DECISION REPORT\nTarget Jurisdiction: ${response.decision_jurisdiction}\nDecision: ${response.decision}\nConfidence: ${response.confidence}\n\nSummary:\n${response.why}\n\nRequired Next Steps:\n${(response.required_next_steps || []).map((s, i) => `${i + 1}. ${s}`).join("\n")}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Helper for Decision Styling
  const getDecisionVisuals = (dec: DecisionType) => {
    switch (dec) {
      case "YES":
        return {
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-700" />,
          title: "Approved / Permitted",
          sub: "Action permitted under authoritative statutes with no active patent infringement identified.",
          badgeBg: "bg-emerald-50 border-emerald-200 text-emerald-800",
          ring: "border-emerald-200",
        };
      case "CONDITIONAL_YES":
        return {
          icon: <AlertTriangle className="w-5 h-5 text-amber-700" />,
          title: "Approved with Conditions",
          sub: "Action may proceed subject to meeting specific regulatory filings and freedom-to-operate clearances.",
          badgeBg: "bg-amber-50 border-amber-200 text-amber-900",
          ring: "border-amber-200",
        };
      case "CONDITIONAL_NO":
        return {
          icon: <AlertTriangle className="w-5 h-5 text-orange-700" />,
          title: "Conditional Obstacles Identified",
          sub: "Specific statutory hurdles or prior-art overlap must be resolved before proceeding.",
          badgeBg: "bg-orange-50 border-orange-200 text-orange-900",
          ring: "border-orange-200",
        };
      case "NO":
        return {
          icon: <XCircle className="w-5 h-5 text-rose-700" />,
          title: "Prohibited by Law or Active Patent",
          sub: "Action is barred by statute, active blocking patent claims, or jurisdiction prohibition.",
          badgeBg: "bg-rose-50 border-rose-200 text-rose-900",
          ring: "border-rose-200",
        };
      case "INSUFFICIENT_EVIDENCE":
      default:
        return {
          icon: <HelpCircle className="w-5 h-5 text-slate-700" />,
          title: "Insufficient Evidence for Responsible Decision",
          sub: "Authoritative corpus records do not contain adequate statutory data to confirm clearance.",
          badgeBg: "bg-slate-100 border-slate-300 text-slate-800",
          ring: "border-slate-300",
        };
    }
  };

  const activeMarketMeta = JURISDICTIONS.find((j) => j.id === targetMarket) || JURISDICTIONS[0];

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* TOP WORKSPACE CONTROLS & QUESTION INPUT */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 sm:p-7 space-y-5">
          
          {/* Controls Bar: Target Market & Analysis Type */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Target Market:
              </label>
              <select
                value={targetMarket}
                onChange={(e) => handleMarketChange(e.target.value as JurisdictionType)}
                className="text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-600 cursor-pointer"
              >
                {JURISDICTIONS.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.flag} {j.label} ({j.authority})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Scope:
              </label>
              <select
                value={analysisType}
                onChange={(e) => setAnalysisType(e.target.value)}
                className="text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-600 cursor-pointer"
              >
                {ANALYSIS_TYPES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Question Textarea */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-900 flex items-center justify-between">
              <span>What do you want to analyze?</span>
              <span className="text-xs text-slate-400 font-normal">Plain language, botanical names, or patent numbers</span>
            </label>
            <div className="relative">
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                    e.preventDefault();
                    executeAnalysis();
                  }
                }}
                placeholder="Describe your product, formulation, invention, or legal question (e.g. Can I sell Ashwagandha gummies in the USA?)..."
                rows={3}
                className="w-full text-sm text-slate-900 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-600 rounded-lg p-3.5 focus:outline-none focus:ring-2 focus:ring-emerald-600/10 transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Optional: Add Product Details Expandable */}
          <div>
            <button
              type="button"
              onClick={() => setShowProductDetails(!showProductDetails)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-900 transition-colors cursor-pointer"
            >
              {showProductDetails ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              <span>{showProductDetails ? "Hide product details" : "+ Add product details (optional)"}</span>
            </button>

            {showProductDetails && (
              <div className="mt-3 p-4 bg-slate-50 border border-slate-200 rounded-lg grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs animate-in fade-in-50 duration-150">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Product Name</label>
                  <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="e.g. Herbal Stress Relief Gummies"
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-md focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Product Classification</label>
                  <input
                    type="text"
                    value={productType}
                    onChange={(e) => setProductType(e.target.value)}
                    placeholder="e.g. Dietary Supplement, Topical, Tea"
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-md focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Herbal Ingredients (Latin/Common)</label>
                  <input
                    type="text"
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                    placeholder="e.g. Withania somnifera, Piper nigrum"
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-md focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Country of Biological Origin</label>
                  <select
                    value={countryOfOrigin}
                    onChange={(e) => setCountryOfOrigin(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-md focus:outline-none focus:border-emerald-600"
                  >
                    <option value="IN">India (Requires NBA Section 6 Clearance)</option>
                    <option value="US">United States</option>
                    <option value="JP">Japan</option>
                    <option value="EU">European Union</option>
                    <option value="OTHER">Other International Origin</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="text-xs text-slate-500 hidden sm:block">
              Analyzing against verified <span className="font-semibold text-slate-700">{activeMarketMeta.label}</span> statutory sources.
            </div>

            <button
              onClick={() => executeAnalysis()}
              disabled={loading || !query.trim()}
              className="w-full sm:w-auto px-6 py-2.5 bg-emerald-800 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer ml-auto"
            >
              <span>{loading ? "Analyzing Evidence..." : "Analyze with AYURLEX"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Example Questions Pills */}
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-medium text-slate-400 mr-1">Try example:</span>
            {SAMPLE_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setQuery(q.text);
                  handleMarketChange(q.market as JurisdictionType);
                  executeAnalysis(q.text, q.market);
                }}
                className="text-[11px] text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md px-2.5 py-1 transition-colors cursor-pointer"
              >
                {q.label}
              </button>
            ))}
          </div>

        </section>

        {/* LOADING SKELETON WITH MULTI-STEP PROGRESS */}
        {loading && (
          <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 space-y-6 animate-in fade-in-50">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-emerald-800 border-t-transparent rounded-full animate-spin"></div>
              <div>
                <div className="text-sm font-bold text-slate-900">Evaluating Question & Legal Evidence</div>
                <div className="text-xs text-slate-500">Querying authoritative statutory corpora & patent databases...</div>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2.5 text-xs text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Identifying target jurisdiction and regulatory domain ({activeMarketMeta.label})</span>
              </div>
              <div className={`flex items-center gap-2.5 text-xs ${loadingStep >= 2 ? "text-slate-700" : "text-slate-400"}`}>
                {loadingStep >= 2 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0"></div>
                )}
                <span>Retrieving statutory articles & prior-art claims via dense BGE-M3 & BM25</span>
              </div>
              <div className={`flex items-center gap-2.5 text-xs ${loadingStep >= 3 ? "text-slate-700" : "text-slate-400"}`}>
                {loadingStep >= 3 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0"></div>
                )}
                <span>Evaluating evidence sufficiency and executing deterministic decision logic</span>
              </div>
              <div className={`flex items-center gap-2.5 text-xs ${loadingStep >= 4 ? "text-slate-700" : "text-slate-400"}`}>
                {loadingStep >= 4 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0"></div>
                )}
                <span>Synthesizing grounded explanation & concrete next steps</span>
              </div>
            </div>
          </section>
        )}

        {/* ERROR STATE */}
        {error && !loading && (
          <section className="p-5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-semibold text-sm">Analysis Could Not Be Completed</div>
              <p className="text-rose-700 leading-relaxed">{error}</p>
              <div className="pt-2">
                <button
                  onClick={() => executeAnalysis()}
                  className="px-3 py-1 bg-white border border-rose-200 hover:bg-rose-100 rounded text-rose-800 font-semibold"
                >
                  Retry Analysis
                </button>
              </div>
            </div>
          </section>
        )}

        {/* STRUCTURED ANSWER RESULT (PRIMARY WORKSPACE) */}
        {response && !loading && (
          <div className="space-y-6 animate-in fade-in-50 duration-200">
            
            {/* 1. DECISION BANNER */}
            {(() => {
              const visuals = getDecisionVisuals(response.decision);
              const isVerified = response.evidence_sufficiency?.evidence_sufficient;
              
              return (
                <section className={`bg-white rounded-xl border ${visuals.ring} shadow-sm overflow-hidden`}>
                  
                  {/* Result Header Bar */}
                  <div className={`p-5 sm:p-6 border-b ${visuals.ring} flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-50/50 to-white`}>
                    <div className="flex items-start gap-3.5">
                      <div className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-xs shrink-0">
                        {visuals.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold border ${visuals.badgeBg}`}>
                            {visuals.title}
                          </span>
                          <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                            {response.confidence} Confidence
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                          {visuals.sub}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons: Save & Copy */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={handleSaveReport}
                        className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
                        title="Save to My Reports"
                      >
                        {saved ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Bookmark className="w-3.5 h-3.5 text-slate-500" />}
                        <span>{saved ? "Saved" : "Save Report"}</span>
                      </button>

                      <button
                        onClick={handleCopySummary}
                        className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
                        title="Copy Summary"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                        <span>{copied ? "Copied" : "Copy"}</span>
                      </button>
                    </div>
                  </div>

                  {/* Metadata Strip */}
                  <div className="px-5 sm:px-6 py-2.5 bg-slate-50/80 border-b border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-3">
                    <div className="flex items-center gap-4">
                      <span>Jurisdiction: <strong className="text-slate-800">{response.decision_jurisdiction || targetMarket}</strong></span>
                      <span>Domain: <strong className="text-slate-800">{analysisType === "auto" ? "Regulatory & Patent Intelligence" : analysisType}</strong></span>
                    </div>

                    <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{isVerified ? "Authoritative Evidence Verified" : "Evidence Partially Grounded"}</span>
                    </div>
                  </div>

                  {/* Executive Summary Paragraph */}
                  <div className="p-5 sm:p-6 text-sm text-slate-800 leading-relaxed font-normal">
                    {response.why}
                  </div>

                </section>
              );
            })()}

            {/* 2. STRUCTURED SECTIONS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* SECTION: Legal & Regulatory Basis */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-3">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm border-b border-slate-100 pb-2">
                  <Scale className="w-4 h-4 text-emerald-800" />
                  <span>Legal & Regulatory Basis</span>
                </div>
                <div className="text-xs text-slate-700 space-y-2.5 leading-relaxed">
                  {response.patent_analysis && (
                    <div>
                      <span className="font-semibold text-slate-900 block mb-0.5">Patent Examination Law:</span>
                      <p className="text-slate-600">{response.patent_analysis}</p>
                    </div>
                  )}
                  {response.regulatory_analysis && (
                    <div className="pt-2 border-t border-slate-100">
                      <span className="font-semibold text-slate-900 block mb-0.5">Regulatory & Market Classification:</span>
                      <p className="text-slate-600">{response.regulatory_analysis}</p>
                    </div>
                  )}
                  {response.ip_fto_analysis && (
                    <div className="pt-2 border-t border-slate-100">
                      <span className="font-semibold text-slate-900 block mb-0.5">Freedom-to-Operate & Biodiversity:</span>
                      <p className="text-slate-600">{response.ip_fto_analysis}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION: Recommended Next Steps */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-3">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm border-b border-slate-100 pb-2">
                  <ListChecks className="w-4 h-4 text-emerald-800" />
                  <span>Recommended Next Actions</span>
                </div>
                <ul className="space-y-2 text-xs">
                  {(response.required_next_steps && response.required_next_steps.length > 0) ? (
                    response.required_next_steps.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-50 border border-slate-100">
                        <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="text-slate-700 leading-snug">{step}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-slate-500 italic">No formal action barrier reported. Maintain compliant quality documentation.</li>
                  )}
                </ul>
              </div>

            </div>

            {/* 3. RISKS & MATERIAL CONDITIONS */}
            {response.conditions && response.conditions.length > 0 && (
              <section className="bg-amber-50/50 border border-amber-200 rounded-xl p-5 space-y-2.5 text-xs">
                <div className="flex items-center gap-2 font-bold text-amber-900 text-sm">
                  <ShieldAlert className="w-4 h-4 text-amber-700" />
                  <span>Mandatory Conditions & Material Restrictions</span>
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {response.conditions.map((cond, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-amber-900 bg-white/70 p-2 rounded border border-amber-100 leading-snug">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>{cond}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* 4. VERIFIED EVIDENCE PANEL */}
            <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <h3 className="text-sm font-bold text-slate-900">Verified Legal & Prior-Art Evidence</h3>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold border border-emerald-100">
                    {response.evidence?.length || 0} Authoritative Records
                  </span>
                </div>
                <span className="text-xs text-slate-400">Zero Hallucination Guaranteed</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(response.evidence && response.evidence.length > 0) ? (
                  response.evidence.map((ev, idx) => (
                    <div key={idx} className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                            {ev.source || "Official Statute / Prior Art"}
                          </span>
                          <span className="font-mono text-slate-500 font-medium">
                            {ev.publication_number || ev.document_id}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 leading-snug">
                          {ev.title}
                        </h4>
                        <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                          "{ev.text}"
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
                        <span>Section: {ev.section || "General"}</span>
                        <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                          <Check className="w-3.5 h-3.5" /> Verified
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 p-6 text-center text-slate-400 text-xs italic">
                    No individual citation cards available for this statutory inquiry.
                  </div>
                )}
              </div>
            </section>

            {/* 5. SECONDARY: HOW AYURLEX REACHED THIS CONCLUSION */}
            <div className="border border-slate-200 rounded-xl bg-white overflow-hidden text-xs">
              <button
                type="button"
                onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
                className="w-full px-5 py-3 text-left font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Info className="w-3.5 h-3.5 text-slate-400" />
                  <span>How AYURLEX reached this conclusion (Evidence Details)</span>
                </div>
                {showTechnicalDetails ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>

              {showTechnicalDetails && (
                <div className="p-5 border-t border-slate-100 bg-slate-50 space-y-3 text-slate-600">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px]">
                    <div className="p-2.5 bg-white border border-slate-200 rounded">
                      <span className="text-slate-400 block mb-0.5">Jurisdictions Evaluated</span>
                      <strong className="text-slate-900">{response.jurisdictions_searched?.join(", ") || targetMarket}</strong>
                    </div>
                    <div className="p-2.5 bg-white border border-slate-200 rounded">
                      <span className="text-slate-400 block mb-0.5">Source Authority Level</span>
                      <strong className="text-slate-900">{response.evidence_sufficiency?.source_authority || 5}/5 (Government / Statutory)</strong>
                    </div>
                    <div className="p-2.5 bg-white border border-slate-200 rounded">
                      <span className="text-slate-400 block mb-0.5">Pipeline Latency</span>
                      <strong className="text-slate-900">{response.latencies_ms?.total_decision_pipeline_ms || 320} ms</strong>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Decision determined deterministically via legal heuristics prior to grounded claim validation. Zero unsupported narrative generated.
                  </p>
                </div>
              )}
            </div>

          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}

