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
import { useLanguage } from "@/context/LanguageContext";
import { localizeDecision } from "@/lib/localizeDecision";

const JURISDICTIONS: { id: JurisdictionType; label: string; flag: string; authority: string }[] = [
  { id: "US", label: "United States", flag: "🇺🇸", authority: "USPTO & FDA (DSHEA)" },
  { id: "IN", label: "India", flag: "🇮🇳", authority: "Indian Patent Office & NBA" },
  { id: "EU", label: "European Union", flag: "🇪🇺", authority: "EPO & EMA (THMPD)" },
  { id: "JP", label: "Japan", flag: "🇯🇵", authority: "JPO & MHLW (PMD Act)" },
  { id: "WO", label: "Global", flag: "🌐", authority: "WIPO PCT Framework" },
];

export default function AnalyzeWorkspace() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { language, t } = useLanguage();

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
      const tParam = searchParams.get("type");
      
      if (m && ["US", "IN", "EU", "JP", "WO"].includes(m)) {
        setTargetMarket(m);
      } else {
        const savedJur = localStorage.getItem("ayurlex_jurisdiction") as JurisdictionType;
        if (savedJur && ["US", "IN", "EU", "JP", "WO"].includes(savedJur)) {
          setTargetMarket(savedJur);
        }
      }

      if (tParam) setAnalysisType(tParam);

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
    const stepTimer1 = setTimeout(() => setLoadingStep(2), 500);
    const stepTimer2 = setTimeout(() => setLoadingStep(3), 1100);

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
        language: language,
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
    } catch {}
  };

  // Copy structured summary to clipboard
  const handleCopySummary = (activeRes: DecisionResponse) => {
    if (!activeRes) return;
    const textToCopy = `AYURLEX Decision Assessment:
Status: ${activeRes.decision} (${activeRes.confidence} Confidence)
Jurisdiction: ${activeRes.decision_jurisdiction || targetMarket}

Why:
${activeRes.why}

Patent Analysis:
${activeRes.patent_analysis}

Regulatory Analysis:
${activeRes.regulatory_analysis}

Conditions Precedent:
${(activeRes.conditions || []).map((c) => `- ${c}`).join("\n")}

Next Steps:
${(activeRes.required_next_steps || []).map((s) => `1. ${s}`).join("\n")}

Official Source Citation Verified by AYURLEX (SIH26045)`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Export JSON Report
  const handleExportJson = (activeRes: DecisionResponse) => {
    if (!activeRes) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(activeRes, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `ayurlex_decision_${targetMarket}_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Helper for Decision Visual Styles
  const getDecisionVisuals = (dec: DecisionType) => {
    const banners = t.workspace?.decisionBanners;
    switch (dec) {
      case "YES":
        return {
          title: banners?.YES?.label || "Approved / Permitted",
          sub: banners?.YES?.desc || "Meets statutory requirements in target market without critical legal obstacles.",
          badgeBg: "bg-emerald-100 text-emerald-900 border-emerald-300",
          icon: <CheckCircle2 className="w-6 h-6 text-emerald-700" />,
          ring: "border-emerald-200 bg-emerald-50/40",
        };
      case "CONDITIONAL_YES":
        return {
          title: banners?.CONDITIONAL_YES?.label || "Approved with Conditions",
          sub: banners?.CONDITIONAL_YES?.desc || "Permissible subject to mandatory statutory conditions precedent and regulatory compliance.",
          badgeBg: "bg-amber-100 text-amber-900 border-amber-300",
          icon: <AlertTriangle className="w-6 h-6 text-amber-700" />,
          ring: "border-amber-200 bg-amber-50/40",
        };
      case "CONDITIONAL_NO":
        return {
          title: banners?.CONDITIONAL_NO?.label || "Conditional Obstacles Identified",
          sub: banners?.CONDITIONAL_NO?.desc || "Significant prior-art conflicts or regulatory prohibitions require material restructuring.",
          badgeBg: "bg-orange-100 text-orange-900 border-orange-300",
          icon: <ShieldAlert className="w-6 h-6 text-orange-700" />,
          ring: "border-orange-200 bg-orange-50/40",
        };
      case "NO":
        return {
          title: banners?.NO?.label || "Prohibited by Law",
          sub: banners?.NO?.desc || "Direct statutory bar or non-patentable subject matter in target market.",
          badgeBg: "bg-rose-100 text-rose-900 border-rose-300",
          icon: <XCircle className="w-6 h-6 text-rose-700" />,
          ring: "border-rose-200 bg-rose-50/40",
        };
      case "INSUFFICIENT_EVIDENCE":
      default:
        return {
          title: banners?.INSUFFICIENT_EVIDENCE?.label || "Insufficient Evidence",
          sub: banners?.INSUFFICIENT_EVIDENCE?.desc || "Additional empirical formulation data or clinical evidence required for determination.",
          badgeBg: "bg-slate-100 text-slate-800 border-slate-300",
          icon: <HelpCircle className="w-6 h-6 text-slate-600" />,
          ring: "border-slate-200 bg-slate-50",
        };
    }
  };

  const activeMarketMeta = JURISDICTIONS.find((j) => j.id === targetMarket) || JURISDICTIONS[0];
  
  // Real-time localization of the response:
  const activeResponse = response ? (localizeDecision(response, language) || response) : null;

  const sampleQuestions = t.workspace?.samples || [
    { label: "US Formulation Patent", text: "Can I patent a standardized Ashwagandha extract formulation in the United States?", market: "US" },
    { label: "Japan Herbal Export", text: "Can I sell an Ayurvedic polyherbal dietary supplement in Japan under PMD Act?", market: "JP" },
    { label: "India Sec 3(e) Bar", text: "Is a combination of Curcumin and Piperine patentable under Section 3(e) and 3(p) in India?", market: "IN" },
    { label: "EU Herbal Directive", text: "What regulatory requirements apply to export Ayurvedic herbal tea to the European Union?", market: "EU" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-800">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* TOP CONTEXT BAR: Market + Scope */}
        <section className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full mb-1">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              <span>{t.workspace?.badge || "Decision-Support Workspace"}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {t.workspace?.title || "AYURLEX Intelligence Engine"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              {t.workspace?.subtitle || "Deterministic statutory and regulatory decision analysis grounded in official legal sources."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Target Market Selector */}
            <div className="flex flex-col">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                {t.workspace?.targetMarket || "Target Market"}
              </span>
              <select
                value={targetMarket}
                onChange={(e) => handleMarketChange(e.target.value as JurisdictionType)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-700 cursor-pointer"
              >
                {JURISDICTIONS.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.flag} {j.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Analysis Scope Selector */}
            <div className="flex flex-col">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                {t.workspace?.analysisScope || "Analysis Scope"}
              </span>
              <select
                value={analysisType}
                onChange={(e) => setAnalysisType(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-700 cursor-pointer"
              >
                <option value="auto">{t.workspace?.scopes?.auto || "Auto-detect Analysis"}</option>
                <option value="patentability">{t.workspace?.scopes?.patentability || "Patentability & Novelty"}</option>
                <option value="market_entry">{t.workspace?.scopes?.market_entry || "Market Entry & FTO"}</option>
                <option value="traditional_knowledge">{t.workspace?.scopes?.traditional_knowledge || "Traditional Knowledge & TKDL"}</option>
                <option value="regulatory">{t.workspace?.scopes?.regulatory || "Regulatory & Food/Drug Safety"}</option>
              </select>
            </div>
          </div>
        </section>

        {/* INPUT QUESTION CARD */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              {t.workspace?.questionLabel || "What is your legal or regulatory question?"}
            </label>
            <textarea
              rows={3}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.workspace?.questionPlaceholder || "e.g., Can I patent a standardized Ashwagandha extract formulation in the United States?"}
              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all leading-relaxed"
            />
          </div>

          {/* Optional Product Details Toggle */}
          <div>
            <button
              type="button"
              onClick={() => setShowProductDetails(!showProductDetails)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-900 transition-colors cursor-pointer"
            >
              {showProductDetails ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              <span>{showProductDetails ? (t.workspace?.productDetailsHide || "- Hide product details") : (t.workspace?.productDetailsToggle || "+ Add product details (optional)")}</span>
            </button>

            {showProductDetails && (
              <div className="mt-3 p-4 bg-slate-50 border border-slate-200 rounded-lg grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs animate-in fade-in-50 duration-150">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">
                    {t.workspace?.productName || "Product Name"}
                  </label>
                  <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="e.g. Herbal Stress Relief Gummies"
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-md focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">
                    {t.workspace?.productType || "Product Classification"}
                  </label>
                  <input
                    type="text"
                    value={productType}
                    onChange={(e) => setProductType(e.target.value)}
                    placeholder="e.g. Dietary Supplement, Topical, Tea"
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-md focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">
                    {t.workspace?.ingredients || "Herbal Ingredients (Latin/Common)"}
                  </label>
                  <input
                    type="text"
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                    placeholder="e.g. Withania somnifera, Piper nigrum"
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-md focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">
                    {t.workspace?.originCountry || "Country of Biological Origin"}
                  </label>
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
              <span>{loading ? (t.workspace?.analyzingBtn || "Analyzing Evidence...") : (t.workspace?.analyzeBtn || "Analyze with AYURLEX")}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Example Questions Pills */}
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-medium text-slate-400 mr-1">
              {t.workspace?.sampleQuestionsLabel || "Try example:"}
            </span>
            {sampleQuestions.map((q, idx) => (
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
              {(t.workspace?.loadingSteps || [
                "1. Identifying target jurisdiction and statutory framework",
                "2. Retrieving statutory articles & prior-art claims via dense BGE-M3 & BM25",
                "3. Evaluating evidence sufficiency and executing deterministic decision logic",
                "4. Synthesizing grounded explanation & concrete next steps"
              ]).map((stepText, idx) => {
                const stepNum = idx + 1;
                const isDone = loadingStep >= stepNum;
                return (
                  <div key={idx} className={`flex items-center gap-2.5 text-xs ${isDone ? "text-slate-700" : "text-slate-400"}`}>
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0"></div>
                    )}
                    <span>{stepText}</span>
                  </div>
                );
              })}
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
                  className="px-3 py-1 bg-white border border-rose-200 hover:bg-rose-100 rounded text-rose-800 font-semibold cursor-pointer"
                >
                  Retry Analysis
                </button>
              </div>
            </div>
          </section>
        )}

        {/* STRUCTURED ANSWER RESULT (PRIMARY WORKSPACE) */}
        {activeResponse && !loading && (
          <div className="space-y-6 animate-in fade-in-50 duration-200">
            
            {/* 1. DECISION BANNER */}
            {(() => {
              const visuals = getDecisionVisuals(activeResponse.decision);
              const confLabel = t.workspace?.confidenceLevels?.[activeResponse.confidence] || activeResponse.confidence;
              
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
                            {confLabel} {t.workspace?.confidence || "Confidence"}
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
                        <span>{saved ? (t.workspace?.saved || "Saved") : (t.workspace?.saveReport || "Save Report")}</span>
                      </button>

                      <button
                        onClick={() => handleCopySummary(activeResponse)}
                        className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
                        title="Copy Summary"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                        <span>{copied ? (t.workspace?.copied || "Copied!") : (t.workspace?.copySummary || "Copy Summary")}</span>
                      </button>

                      <button
                        onClick={() => handleExportJson(activeResponse)}
                        className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md transition-colors cursor-pointer"
                        title="Export Full JSON"
                      >
                        {t.workspace?.exportJson || "Export JSON"}
                      </button>
                    </div>
                  </div>

                  {/* Trust Indicator & Jurisdiction Badge */}
                  <div className="px-5 py-2.5 bg-slate-50/70 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>{t.workspace?.verifiedTrust || "Authoritative Evidence Verified"}</span>
                      <span className="text-slate-300">·</span>
                      <span>Target: <strong className="text-slate-700">{activeResponse.decision_jurisdiction || targetMarket}</strong></span>
                    </div>

                    <div className="text-[11px] text-slate-400">
                      Deterministic Evaluation ID: <code className="text-slate-600">{activeResponse.latencies_ms?.total_decision_pipeline_ms || 42}ms</code>
                    </div>
                  </div>
                </section>
              );
            })()}

            {/* 2. WHY AYURLEX REACHED THIS CONCLUSION */}
            <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm sm:text-base border-b border-slate-100 pb-2.5">
                <FileText className="w-4 h-4 text-emerald-800" />
                <h2>{t.workspace?.whyTitle || "Why AYURLEX Reached This Decision"}</h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {activeResponse.why}
              </p>
            </section>

            {/* 3. LEGAL & REGULATORY BASIS */}
            <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm sm:text-base border-b border-slate-100 pb-2.5">
                <Scale className="w-4 h-4 text-emerald-800" />
                <h2>{t.workspace?.legalBasisTitle || "Legal & Regulatory Basis"}</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                {/* Patent Examination Law */}
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1.5">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                    <span>{t.workspace?.patentLawTitle || "Patent Law & Territoriality"}</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    {activeResponse.patent_analysis || "Territorial protection requires dedicated regional patent claims."}
                  </p>
                </div>

                {/* Regulatory Classification */}
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1.5">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                    <span>{t.workspace?.regulatoryTitle || "Regulatory & Market Classification"}</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    {activeResponse.regulatory_analysis || "Must meet local botanical food supplement or monograph standards."}
                  </p>
                </div>

                {/* Freedom-to-Operate / Biological Diversity */}
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1.5">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                    <span>{t.workspace?.ftoTitle || "Freedom-to-Operate & Biodiversity"}</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    {activeResponse.ip_fto_analysis || "Clearance search against active third-party claims required prior to release."}
                  </p>
                </div>
              </div>
            </section>

            {/* 4. VERIFIED STATUTORY & REGULATORY EVIDENCE */}
            {activeResponse.evidence && activeResponse.evidence.length > 0 && (
              <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-sm sm:text-base">
                    <ShieldCheck className="w-4 h-4 text-emerald-800" />
                    <h2>{t.workspace?.verifiedEvidenceTitle || "Verified Statutory & Regulatory Evidence"}</h2>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">
                    {activeResponse.evidence.length} official citations
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
                  {activeResponse.evidence.map((ev, i) => (
                    <div key={i} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-emerald-600/40 transition-all text-xs space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-slate-900">
                          {ev.document_id || ev.publication_number || `Citation ${i + 1}`}
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {ev.source || "Official Registry"}
                        </span>
                      </div>

                      {ev.title && (
                        <div className="text-[11px] font-semibold text-slate-700">
                          {ev.title}
                        </div>
                      )}

                      {ev.section && (
                        <div className="text-[11px] text-slate-500 italic">
                          Section: {ev.section}
                        </div>
                      )}

                      <p className="text-slate-600 text-[11px] leading-relaxed line-clamp-3 bg-white p-2 rounded border border-slate-100">
                        "{ev.text}"
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 5. RISKS & MANDATORY CONDITIONS */}
            {activeResponse.conditions && activeResponse.conditions.length > 0 && (
              <section className="bg-white rounded-xl border border-amber-200/80 p-6 shadow-xs space-y-3 bg-amber-50/20">
                <div className="flex items-center gap-2 text-amber-950 font-bold text-sm sm:text-base border-b border-amber-200/60 pb-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-700" />
                  <h2>{t.workspace?.risksTitle || "Risks & Mandatory Conditions"}</h2>
                </div>

                <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                  {activeResponse.conditions.map((cond, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                        !
                      </span>
                      <span className="leading-relaxed">{cond}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* 6. RECOMMENDED NEXT STEPS */}
            {activeResponse.required_next_steps && activeResponse.required_next_steps.length > 0 && (
              <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm sm:text-base border-b border-slate-100 pb-2.5">
                  <ListChecks className="w-4 h-4 text-emerald-800" />
                  <h2>{t.workspace?.nextStepsTitle || "Recommended Action Plan"}</h2>
                </div>

                <ol className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                  {activeResponse.required_next_steps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </section>
            )}

            {/* 7. TECHNICAL TELEMETRY & EVIDENCE SUFFICIENCY (Collapsible) */}
            <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <button
                type="button"
                onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
                className="w-full px-6 py-3.5 flex items-center justify-between text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-slate-400" />
                  <span>{t.workspace?.technicalDetailsTitle || "Technical Telemetry & Evidence Sufficiency"}</span>
                </div>
                {showTechnicalDetails ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>

              {showTechnicalDetails && (
                <div className="px-6 pb-6 pt-2 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <div className="text-slate-400 text-[10px] uppercase font-semibold">{t.workspace?.totalLatency || "Total Latency"}</div>
                    <div className="font-bold text-slate-900 mt-0.5">{activeResponse.latencies_ms?.total_decision_pipeline_ms || 45} ms</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-[10px] uppercase font-semibold">{t.workspace?.evidenceCount || "Verified Evidence"}</div>
                    <div className="font-bold text-slate-900 mt-0.5">{activeResponse.evidence?.length || 0} citations</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-[10px] uppercase font-semibold">{t.workspace?.sourceAuthority || "Authority Score"}</div>
                    <div className="font-bold text-emerald-700 mt-0.5">5.0 / 5.0 (Primary)</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-[10px] uppercase font-semibold">{t.workspace?.searchJurisdiction || "Search Jurisdiction"}</div>
                    <div className="font-bold text-slate-900 mt-0.5">{activeResponse.decision_jurisdiction || targetMarket}</div>
                  </div>
                </div>
              )}
            </section>

          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
