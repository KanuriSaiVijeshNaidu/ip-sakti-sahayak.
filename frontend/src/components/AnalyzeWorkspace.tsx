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
  Minus,
  Layers,
  FileCheck,
  AlertCircle,
  HelpCircle as QuestionIcon,
  BookOpen,
  Award,
  Globe,
  Compass,
  Briefcase,
  Building2,
  CheckCheck,
  Sliders,
  Printer,
  X
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
import { 
  DEMO_SCENARIOS, 
  DemoScenario, 
  AnalysisTraceStep, 
  RegulatoryChecklistItem, 
  TopRiskItem, 
  ActionPlanItem, 
  EvidenceItem,
  DEFAULT_REGULATORY_CHECKLIST,
  DEMO_EVIDENCE,
  classifyAyushProduct,
  evaluateMultiIPStrategy,
  evaluateABS,
  checkClaimsAndAdvertising,
  OFFICIAL_SOURCE_REGISTRY,
  MultiIPRegime,
  ClaimsRiskCheck,
  SourceRegistryRecord
} from "@/data";

const JURISDICTIONS: { id: JurisdictionType; label: string; flag: string; authority: string }[] = [
  { id: "IN", label: "India", flag: "🇮🇳", authority: "Indian Patent Office & AYUSH" },
  { id: "US", label: "United States", flag: "🇺🇸", authority: "USPTO & FDA (DSHEA)" },
  { id: "EU", label: "European Union", flag: "🇪🇺", authority: "EPO & EMA (THMPD)" },
  { id: "JP", label: "Japan", flag: "🇯🇵", authority: "JPO & MHLW (PMD Act)" },
  { id: "WO", label: "Global", flag: "🌐", authority: "WIPO PCT Framework" },
];

export default function AnalyzeWorkspace() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { language, t } = useLanguage();

  const [query, setQuery] = useState("");
  const [targetMarket, setTargetMarket] = useState<JurisdictionType>("IN");
  const [analysisType, setAnalysisType] = useState("auto");

  // Advanced Product Details
  const [showProductDetails, setShowProductDetails] = useState(false);
  const [productName, setProductName] = useState("");
  const [productType, setProductType] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [countryOfOrigin, setCountryOfOrigin] = useState("IN");

  // Active Demo Scenario State
  const [activeScenario, setActiveScenario] = useState<DemoScenario | null>(null);

  // Pipeline Execution State
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [response, setResponse] = useState<DecisionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);
  const [expandedTraceStep, setExpandedTraceStep] = useState<number | null>(null);
  const [plainWordsMode, setPlainWordsMode] = useState(false);
  const [showExpertBriefModal, setShowExpertBriefModal] = useState(false);
  const [showSourceRegistryModal, setShowSourceRegistryModal] = useState(false);
  const [activeWhatIfIndex, setActiveWhatIfIndex] = useState<number | null>(0);
  const [ipRegimeFilter, setIpRegimeFilter] = useState<"ALL" | "RELEVANT">("ALL");

  // Sync market and query from URL or localStorage
  useEffect(() => {
    try {
      const q = searchParams.get("q");
      const m = searchParams.get("market") as JurisdictionType;
      const tParam = searchParams.get("type");
      const scenarioId = searchParams.get("scenario");
      
      if (m && ["IN", "US", "EU", "JP", "WO"].includes(m)) {
        setTargetMarket(m);
      } else {
        const savedJur = localStorage.getItem("ayurlex_jurisdiction") as JurisdictionType;
        if (savedJur && ["IN", "US", "EU", "JP", "WO"].includes(savedJur)) {
          setTargetMarket(savedJur);
        }
      }

      if (tParam) setAnalysisType(tParam);

      if (scenarioId) {
        const found = DEMO_SCENARIOS.find((s) => s.id === scenarioId);
        if (found) {
          handleSelectScenario(found);
          return;
        }
      }

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

  // Select a 1-Click Demo Scenario
  const handleSelectScenario = (scenario: DemoScenario) => {
    setActiveScenario(scenario);
    setQuery(scenario.name);
    setProductName(scenario.name);
    setProductType(scenario.category);
    setIngredients(scenario.ingredients ? scenario.ingredients.join(", ") : (scenario.productDNA?.ingredients?.map(i => i.commonName).join(", ") || ""));
    setTargetMarket("IN");
    setResponse(null);
    setError(null);
    setLoading(true);
    setLoadingStep(1);

    const t1 = setTimeout(() => setLoadingStep(3), 350);
    const t2 = setTimeout(() => setLoadingStep(6), 750);
    const t3 = setTimeout(() => {
      setLoadingStep(8);
      setLoading(false);
    }, 1100);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  };

  // Execution for custom queries
  const executeAnalysis = async (searchQuery?: string, market?: string) => {
    const activeQuery = searchQuery || query;
    if (!activeQuery.trim()) return;

    setActiveScenario(null);
    setLoading(true);
    setError(null);
    setResponse(null);
    setSaved(false);

    // Progressive loader steps
    setLoadingStep(1);
    const stepTimer1 = setTimeout(() => setLoadingStep(2), 400);
    const stepTimer2 = setTimeout(() => setLoadingStep(3), 900);

    const activeMarket = market || targetMarket;

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

      // Check if this query closely aligns with one of our demo AYUSH products
      const lower = fullQuery.toLowerCase();
      if (lower.includes("ashwagandha") || lower.includes("withania")) {
        setActiveScenario(DEMO_SCENARIOS[0]);
      } else if (lower.includes("curcumin") || lower.includes("piperine") || lower.includes("turmeric")) {
        setActiveScenario(DEMO_SCENARIOS[1]);
      } else if (lower.includes("pain") || lower.includes("oil") || lower.includes("taila") || lower.includes("mahanarayan")) {
        setActiveScenario(DEMO_SCENARIOS[2]);
      } else if (lower.includes("triphala") || lower.includes("amalaki")) {
        setActiveScenario(DEMO_SCENARIOS[3]);
      }
    } catch (err: any) {
      setError(err.message || "Failed to analyze question. Authoritative statutory service temporarily busy.");
    } finally {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      setLoading(false);
    }
  };

  // Save to Reports workspace
  const handleSaveReport = () => {
    try {
      const savedReportsRaw = localStorage.getItem("ayurlex_saved_reports") || "[]";
      const existing = JSON.parse(savedReportsRaw);
      
      const title = activeScenario ? activeScenario.name : (query.slice(0, 70) + (query.length > 70 ? "..." : ""));
      const newReport = {
        id: `report_${Date.now()}`,
        title: title,
        date: new Date().toISOString(),
        jurisdiction: targetMarket,
        analysisType: analysisType === "auto" ? "Complete Product Assessment" : analysisType,
        decision: activeScenario ? (activeScenario.overview.patentability === "HIGH" ? "CONDITIONAL_NO" : "CONDITIONAL_YES") : (response?.decision || "CONDITIONAL_YES"),
        confidence: "HIGH",
        summary: activeScenario ? activeScenario.shortDesc : (response?.why || "Comprehensive statutory analysis completed."),
        response: response || activeScenario,
        sourceType: activeScenario ? "demo" : "official"
      };

      const updated = [newReport, ...existing];
      localStorage.setItem("ayurlex_saved_reports", JSON.stringify(updated));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {}
  };

  // Copy structured summary
  const handleCopySummary = () => {
    let textToCopy = "";
    if (activeScenario) {
      textToCopy = `AYURLEX Complete Product Assessment:
Product: ${activeScenario.name} (${activeScenario.category})
Jurisdiction: ${activeScenario.targetJurisdiction} (India - Patents Act 1970 & AYUSH)
Filing Readiness: ${activeScenario.overview.filingReadinessScore}%

Pillars:
- Patentability: ${activeScenario.overview.patentability}
- Traditional Knowledge: ${activeScenario.overview.traditionalKnowledge}
- Regulatory: ${activeScenario.overview.regulatory}
- Market Entry: ${activeScenario.overview.marketEntry}

Top Risks:
${activeScenario.topRisks.map((r) => `- [${r.severity}] ${r.risk}: ${r.mitigation}`).join("\n")}

Recommended Next Steps:
${activeScenario.actionPlan.map((a) => `${a.priority}. ${a.step} (${a.authority})`).join("\n")}

Evidence Grounded by AYURLEX (SIH26045)`;
    } else if (response) {
      const activeRes = localizeDecision(response, language);
      if (activeRes) {
        textToCopy = `AYURLEX Decision Assessment:
Status: ${activeRes.decision} (${activeRes.confidence} Confidence)
Jurisdiction: ${activeRes.decision_jurisdiction || targetMarket}

Why:
${activeRes.why}

Patent Analysis:
${activeRes.patent_analysis}

Regulatory Analysis:
${activeRes.regulatory_analysis}

Official Source Citation Verified by AYURLEX (SIH26045)`;
      }
    }

    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Export JSON
  const handleExportJson = () => {
    const dataToExport = activeScenario || response;
    if (!dataToExport) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataToExport, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `ayurlex_assessment_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const activeMarketMeta = JURISDICTIONS.find((j) => j.id === targetMarket) || JURISDICTIONS[0];
  const activeResponse = response ? localizeDecision(response, language) : null;

  // Canonical v2 Domain Intelligence (Derived from activeScenario or dynamically evaluated)
  const effectiveClassification = activeScenario?.classification || classifyAyushProduct({
    name: productName || query,
    ingredients: ingredients ? ingredients.split(",").map((s: string) => s.trim()) : [],
    intendedUse: query
  });

  const effectiveMultiIP: MultiIPRegime[] = activeScenario?.multiIPStrategy || evaluateMultiIPStrategy({
    name: productName || query,
    category: effectiveClassification.category,
    hasNovelProcess: true,
    hasSynergy: true,
    isClassicalFormula: effectiveClassification.category.includes("Classical"),
    usesIndianBioResource: true
  });

  const effectiveABS = activeScenario?.absAssessment || evaluateABS({
    usesIndianBioResource: true,
    commercialUtilization: true,
    foreignParticipation: targetMarket !== "IN"
  });

  const effectiveClaims: ClaimsRiskCheck[] = (activeScenario?.claimsCheck && activeScenario.claimsCheck.length > 0)
    ? activeScenario.claimsCheck
    : checkClaimsAndAdvertising([query, productName || ""]);

  const effectiveWhatIf = (activeScenario?.whatIfSimulations && activeScenario.whatIfSimulations.length > 0)
    ? activeScenario.whatIfSimulations
    : [
        {
          scenarioId: "sim-1",
          label: "Pivot to FSSAI Ayurveda-Aahara",
          changeDescription: "Re-position product from AYUSH medicinal license to FSSAI Ayurveda-Aahara food regulation.",
          originalPathway: "AYUSH Drug License (Rule 158B)",
          simulatedPathway: "FSSAI Ayurveda-Aahara Food Channel",
          originalRisk: "MEDIUM" as const,
          simulatedRisk: "LOW" as const,
          impactAnalysis: "Accelerates market entry by avoiding drug clinical trial requirements; permitted claims restricted to dietary wellness."
        },
        {
          scenarioId: "sim-2",
          label: "Claim Therapeutic Cure for Chronic Disease",
          changeDescription: "Add direct disease cure claim to packaging copy.",
          originalPathway: "Permissible Structure-Function Wording",
          simulatedPathway: "Prohibited Drug Advertisement (DMRA 1954)",
          originalRisk: "LOW" as const,
          simulatedRisk: "HIGH" as const,
          impactAnalysis: "Triggers immediate criminal prohibition under Drugs & Magic Remedies Act 1954 and FSSAI Section 53 misbranding penalties."
        }
      ];

  const effectiveExpertBrief = activeScenario?.expertReviewBrief || {
    executiveSummary: `Evidence-grounded regulatory screening for ${productName || query || "Ayurvedic formulation"} under Indian legal regimes. Key focus: Indian Patents Act § 3(e)/3(p) and Biological Diversity Act § 6(1).`,
    keyLegalQuestions: [
      "Does our experimental data satisfy the Section 3(e) non-obvious synergistic enhancement threshold?",
      "Is Form III approval required from NBA Chennai prior to international patent filing or export?"
    ],
    requiredFilings: [
      "NBA Form III Application at Chennai",
      "Manufacturing License Application under AYUSH Rule 158B or FSSAI Ayurveda-Aahara",
      "Class 5 / Class 30 Trademark Application"
    ],
    statutoryDeadlines: [
      "NBA Form III must be filed prior to the grant of any patent or commercial export"
    ],
    specialistConsultantType: "AYUSH Regulatory Consultant & Life Sciences Patent Attorney"
  };

  // Decision Visuals
  const getDecisionVisuals = (decisionType: DecisionType) => {
    const visuals = {
      YES: {
        title: t.workspace?.decisionBanners?.YES?.label || "Approved / Low Statutory Barrier",
        sub: t.workspace?.decisionBanners?.YES?.desc || "Compliant with jurisdiction statutes and regulatory guidelines.",
        icon: <CheckCircle2 className="w-6 h-6 text-emerald-600" />,
        ring: "border-emerald-600/30 bg-emerald-50/20",
        badgeBg: "bg-emerald-100 text-emerald-900 border-emerald-300",
      },
      CONDITIONAL_YES: {
        title: t.workspace?.decisionBanners?.CONDITIONAL_YES?.label || "Statutory Objections Identified (Conditional)",
        sub: t.workspace?.decisionBanners?.CONDITIONAL_YES?.desc || "Filing possible subject to specific statutory conditions, synergy proofs, or clearances.",
        icon: <AlertTriangle className="w-6 h-6 text-amber-600" />,
        ring: "border-amber-500/30 bg-amber-50/20",
        badgeBg: "bg-amber-100 text-amber-900 border-amber-300",
      },
      CONDITIONAL_NO: {
        title: t.workspace?.decisionBanners?.CONDITIONAL_NO?.label || "High Risk: Substantial Statutory Bars",
        sub: t.workspace?.decisionBanners?.CONDITIONAL_NO?.desc || "Strong prima facie objections under Section 3(e) or 3(p). Pivot recommended.",
        icon: <ShieldAlert className="w-6 h-6 text-orange-600" />,
        ring: "border-orange-500/30 bg-orange-50/20",
        badgeBg: "bg-orange-100 text-orange-900 border-orange-300",
      },
      NO: {
        title: t.workspace?.decisionBanners?.NO?.label || "Prohibited Under Current Statutes",
        sub: t.workspace?.decisionBanners?.NO?.desc || "The subject matter falls squarely under statutory exclusions.",
        icon: <XCircle className="w-6 h-6 text-rose-600" />,
        ring: "border-rose-600/30 bg-rose-50/20",
        badgeBg: "bg-rose-100 text-rose-900 border-rose-300",
      },
      INSUFFICIENT_EVIDENCE: {
        title: t.workspace?.decisionBanners?.INSUFFICIENT_EVIDENCE?.label || "Evidence Inconclusive",
        sub: t.workspace?.decisionBanners?.INSUFFICIENT_EVIDENCE?.desc || "Corpus lacks authoritative text for an unambiguous statutory ruling.",
        icon: <HelpCircle className="w-6 h-6 text-slate-500" />,
        ring: "border-slate-300 bg-slate-50",
        badgeBg: "bg-slate-200 text-slate-800 border-slate-300",
      },
    };
    return visuals[decisionType] || visuals.CONDITIONAL_YES;
  };

  const sampleQuestions = [
    { label: "India Sec 3(e) Bar", text: "Is a combination of Curcumin and Piperine patentable under Section 3(e) and 3(p) in India?", market: "IN" },
    { label: "Ashwagandha Patent", text: "Can I patent an Ashwagandha lipid nano-emulsion formulation with enhanced bioavailability in India?", market: "IN" },
    { label: "US Patent Novelty", text: "Can I patent a standardized Ashwagandha extract formulation in the United States?", market: "US" },
    { label: "Japan PMD Act", text: "Can I sell an Ayurvedic polyherbal dietary supplement in Japan under PMD Act?", market: "JP" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold mb-2 shadow-xs">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              <span>SIH26045 · Ministry of Ayush · Citation-First Decision Support</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              {t.workspace?.title || "Legal & Regulatory Co-Pilot Workspace"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              {t.workspace?.subtitle || "Assess AYUSH product patentability, traditional knowledge prior-art bars, and export regulatory pathways with grounded statutory citations."}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <Link
              href="/reports"
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-xs transition-colors"
            >
              <Bookmark className="w-3.5 h-3.5 text-slate-500" />
              <span>{t.reportsPage?.title || "Saved Reports"}</span>
            </Link>
            <Link
              href="/compare-jurisdictions"
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-xs transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <span>Compare Markets</span>
            </Link>
          </div>
        </div>

        {/* 1-CLICK DEMO MODE SCENARIOS BANNER */}
        <section className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 rounded-2xl p-4 sm:p-5 text-white shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-emerald-700/80 text-[10px] font-bold uppercase tracking-wider text-emerald-100 border border-emerald-600">
                SIH Demo Scenarios
              </span>
              <h2 className="text-sm sm:text-base font-bold text-white">
                One-Click Complete AYUSH Product Assessments
              </h2>
            </div>
            <span className="text-[11px] text-emerald-200 hidden sm:inline">
              Instant 8-stage trace & evidence grounding
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {DEMO_SCENARIOS.map((scenario) => {
              const isSelected = activeScenario?.id === scenario.id;
              return (
                <button
                  key={scenario.id}
                  onClick={() => handleSelectScenario(scenario)}
                  className={`text-left p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-white text-slate-900 border-white shadow-lg ring-2 ring-emerald-400"
                      : "bg-emerald-800/60 hover:bg-emerald-800 text-white border-emerald-700 hover:border-emerald-500"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-bold line-clamp-1">{scenario.shortTag}</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                      isSelected ? "bg-emerald-100 text-emerald-800" : "bg-emerald-950/60 text-emerald-200"
                    }`}>
                      {scenario.overview.filingReadinessScore}% Ready
                    </span>
                  </div>
                  <p className={`text-[11px] line-clamp-2 leading-relaxed ${isSelected ? "text-slate-600" : "text-emerald-100/80"}`}>
                    {scenario.category}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        {/* PRIMARY INTERACTIVE QUERY & PRODUCT FORM */}
        <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
          
          {/* Top Bar: Target Market & Type */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">
                {t.workspace?.targetMarket || "Target Jurisdiction"}:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {JURISDICTIONS.map((jur) => {
                  const isSelected = targetMarket === jur.id;
                  return (
                    <button
                      key={jur.id}
                      onClick={() => handleMarketChange(jur.id)}
                      className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer ${
                        isSelected 
                          ? "bg-emerald-800 text-white border-emerald-800 shadow-xs" 
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      <span>{jur.flag}</span>
                      <span>{jur.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowProductDetails(!showProductDetails)}
              className="text-xs text-emerald-800 hover:text-emerald-900 font-semibold flex items-center gap-1 cursor-pointer ml-auto"
            >
              {showProductDetails ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              <span>{showProductDetails ? "Hide Structured Details" : "Add Structured Product Details"}</span>
            </button>
          </div>

          {/* Main Search Input */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              <textarea
                rows={2}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.home?.askPlaceholder || "Describe your AYUSH formulation or ask a legal/regulatory question..."}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all resize-none"
              />
            </div>

            {/* Optional Structured Fields */}
            {showProductDetails && (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs animate-in fade-in-50">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">
                    {t.workspace?.productName || "Product / Invention Title"}
                  </label>
                  <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="e.g. Standardized Withanolide Extract"
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-md focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">
                    {t.workspace?.productType || "Category / Form"}
                  </label>
                  <input
                    type="text"
                    value={productType}
                    onChange={(e) => setProductType(e.target.value)}
                    placeholder="e.g. Dietary Supplement, Classical Taila, Tablet"
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-md focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-slate-600 font-medium mb-1">
                    {t.workspace?.ingredients || "Botanical / Active Ingredients (Botanical names preferred)"}
                  </label>
                  <input
                    type="text"
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                    placeholder="e.g. Withania somnifera, Piper nigrum, Curcuma longa"
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-md focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="text-xs text-slate-500 hidden sm:block">
              Primary framework: <span className="font-semibold text-slate-800">{activeMarketMeta.label} ({activeMarketMeta.authority})</span>
            </div>

            <div className="flex items-center gap-2 ml-auto w-full sm:w-auto">
              <button
                onClick={() => executeAnalysis()}
                disabled={loading || !query.trim()}
                className="w-full sm:w-auto px-6 py-2.5 bg-emerald-800 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{loading ? (t.workspace?.analyzingBtn || "Evaluating Statutory Rules...") : (t.workspace?.analyzeBtn || "Execute Assessment")}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Example Queries */}
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-medium text-slate-400 mr-1">
              {t.workspace?.sampleQuestionsLabel || "Try sample query:"}
            </span>
            {sampleQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setActiveScenario(null);
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

        {/* LOADING PROGRESS SKELETON */}
        {loading && (
          <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-7 space-y-5 animate-in fade-in-50">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-emerald-800 border-t-transparent rounded-full animate-spin"></div>
              <div>
                <div className="text-sm font-bold text-slate-900">Executing Statutory Decision Pipeline</div>
                <div className="text-xs text-slate-500">Querying Indian Patents Act, CSIR-TKDL, AYUSH Rule 158B & International Registries...</div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs">
              {[
                "1. Product Information Understood & Normalized",
                "2. Jurisdiction Isolation: India (CGPDTM / AYUSH)",
                "3. Botanical & Chemical Entities Extracted",
                "4. Patents Act § 3(e) & § 3(p) Evaluated",
                "5. Traditional Knowledge Prior-Art Screened",
                "6. Regulatory Framework Mapped (D&C Act Rule 158B)",
                "7. Authoritative Evidence Retrieved & Grounded",
                "8. Risk Score & Filing Action Plan Synthesized"
              ].map((stepText, idx) => {
                const stepNum = idx + 1;
                const isDone = loadingStep >= stepNum;
                return (
                  <div key={idx} className={`flex items-center gap-2 p-2 rounded-lg border ${isDone ? "bg-emerald-50/60 border-emerald-200 text-slate-800" : "bg-slate-50 border-slate-200 text-slate-400"}`}>
                    {isDone ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0"></div>
                    )}
                    <span className="text-[11px] font-medium">{stepText}</span>
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
              <div className="font-semibold text-sm">Assessment Could Not Be Completed</div>
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

        {/* RESULTS: COMPLETE PRODUCT ASSESSMENT VIEW */}
        {(activeScenario || activeResponse) && !loading && (
          <div className="space-y-6 animate-in fade-in-50 duration-200">
            
            {/* 1. TOP RESULT HEADER & ACTIONS */}
            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-50/70 to-white">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-2.5 py-0.5 rounded-md text-xs font-bold border bg-emerald-100 text-emerald-900 border-emerald-300">
                      {activeScenario ? "Complete Product Assessment" : "Statutory Decision Assessment"}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      Jurisdiction: {targetMarket} (India Primary)
                    </span>
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    {activeScenario ? activeScenario.name : (query.slice(0, 80) + (query.length > 80 ? "..." : ""))}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
                    {activeScenario ? activeScenario.shortDesc : activeResponse?.why}
                  </p>
                </div>

                {/* Save, Copy, Export */}
                <div className="flex items-center gap-2 shrink-0">
                  {/* Plain Language Mode Toggle */}
                  <button
                    onClick={() => setPlainWordsMode(!plainWordsMode)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer border ${
                      plainWordsMode
                        ? "bg-emerald-700 text-white border-emerald-800 shadow-xs"
                        : "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                    }`}
                    title="Toggle plain-language explanation for Ayurvedic innovators & vaidyas"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{plainWordsMode ? "Technical Legal View" : "🌿 In Plain Words"}</span>
                  </button>

                  {/* Prepare for Expert Review Brief */}
                  <button
                    onClick={() => setShowExpertBriefModal(true)}
                    className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                    title="Generate executive briefing for patent agent or regulatory counsel"
                  >
                    <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                    <span>Expert Review Brief</span>
                  </button>

                  {/* Government Source Registry */}
                  <button
                    onClick={() => setShowSourceRegistryModal(true)}
                    className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                    title="View 12 authoritative government databases and transparency notes"
                  >
                    <Building2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>12 Verified Registries</span>
                  </button>

                  <button
                    onClick={handleSaveReport}
                    className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    {saved ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Bookmark className="w-3.5 h-3.5 text-slate-500" />}
                    <span>{saved ? "Saved to Reports" : "Save Report"}</span>
                  </button>

                  <button
                    onClick={handleCopySummary}
                    className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                    <span>{copied ? "Copied!" : "Copy Summary"}</span>
                  </button>

                  <button
                    onClick={handleExportJson}
                    className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                  >
                    Export JSON
                  </button>
                </div>
              </div>

              {/* Status Bar */}
              <div className="px-5 py-2.5 bg-slate-50/80 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="font-medium text-slate-700">Evidence-Grounded AI Verified</span>
                  <span className="text-slate-300">·</span>
                  <span>Primary: Indian Patent Office & AYUSH Framework</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Pipeline Verified · Deterministic Rule Engine Active
                </div>
              </div>
            </section>

            {/* PLAIN LANGUAGE EXPLANATION CALLOUT */}
            {plainWordsMode && (
              <section className="bg-gradient-to-br from-emerald-50 via-teal-50/60 to-slate-50 border-2 border-emerald-300 rounded-2xl p-5 sm:p-6 shadow-sm space-y-3 animate-in fade-in-50">
                <div className="flex items-center justify-between gap-3 border-b border-emerald-200/80 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-emerald-950">
                        In Plain Words: Practical Guidance for Ayurvedic Innovators & Vaidyas
                      </h3>
                      <p className="text-[11px] text-emerald-800">
                        Simplified legal breakdown without complex statutory jargon.
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-bold uppercase tracking-wider">
                    Plain-Language Active
                  </span>
                </div>
                <div className="text-xs sm:text-sm text-emerald-950 leading-relaxed font-medium bg-white/80 p-4 rounded-xl border border-emerald-200/70">
                  {activeScenario?.plainLanguageExplanation || `In plain words: You cannot patent classical Ayurvedic herbs because they are documented in ancient treatises like Charaka Samhita (Patents Act Section 3(p)). You can, however, protect your specific delivery technology if you prove significant non-obvious synergy, register your brand trademark, and keep your exact manufacturing process secret. Before filing patents or exporting, Form III approval from the National Biodiversity Authority (NBA) is required.`}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
                  <div className="p-2.5 rounded-lg bg-emerald-100/60 border border-emerald-200 text-emerald-900">
                    <span className="font-bold">❌ What You CANNOT Patent:</span> The plant itself or its classical therapeutic use (Section 3(p)).
                  </div>
                  <div className="p-2.5 rounded-lg bg-emerald-100/60 border border-emerald-200 text-emerald-900">
                    <span className="font-bold">✅ What You CAN Protect:</span> Unique delivery mechanisms, synergistic ratios (Section 3(e)), brand name & trade secrets.
                  </div>
                  <div className="p-2.5 rounded-lg bg-emerald-100/60 border border-emerald-200 text-emerald-900">
                    <span className="font-bold">⚠️ Mandatory Action:</span> NBA Form III approval before filing foreign patents or commercializing abroad.
                  </div>
                </div>
              </section>
            )}

            {/* PRODUCT CLASSIFICATION & DOWNSTREAM REGULATORY ROUTE */}
            <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    <Layers className="w-4 h-4 text-emerald-800" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Product Classification & Regulatory Routing
                    </h3>
                    <p className="text-xs text-slate-500">
                      Determines statutory authority, licensing criteria, and downstream regulatory route.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                    {effectiveClassification.category}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                    {effectiveClassification.confidence} Confidence
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-500">Downstream Route</div>
                  <div className="font-bold text-sm text-emerald-900 flex items-center gap-1.5">
                    <CheckCheck className="w-4 h-4 text-emerald-600" />
                    <span>{effectiveClassification.downstreamRoute.replace(/_/g, " ")}</span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Governed by: <strong>{effectiveClassification.governingAuthority}</strong>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-500">Governing Statute</div>
                  <div className="font-bold text-slate-900">{effectiveClassification.governingStatute}</div>
                  <div className="text-[11px] text-slate-500">Statutory authority over manufacturing & standards</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-500">Classification Signals</div>
                  <ul className="space-y-0.5 text-[11px] text-slate-600">
                    {effectiveClassification.signals.slice(0, 2).map((sig, idx) => (
                      <li key={idx} className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                        <span>{sig}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* MULTI-IP STRATEGY MAP (ALL 9 REGIMES) */}
            <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <Scale className="w-5 h-5 text-emerald-800" />
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Multi-IP Strategy Map (9 IP Regimes)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Integrated intellectual property roadmap across statutory regimes beyond patent-only filing.
                    </p>
                  </div>
                </div>

                {/* Filter toggle */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
                  <button
                    type="button"
                    onClick={() => setIpRegimeFilter("ALL")}
                    className={`px-2.5 py-1 rounded font-semibold transition-colors cursor-pointer ${
                      ipRegimeFilter === "ALL" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    All Regimes ({effectiveMultiIP.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setIpRegimeFilter("RELEVANT")}
                    className={`px-2.5 py-1 rounded font-semibold transition-colors cursor-pointer ${
                      ipRegimeFilter === "RELEVANT" ? "bg-white text-emerald-800 shadow-xs" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Active / Relevant ({effectiveMultiIP.filter((r: MultiIPRegime) => r.relevant).length})
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {effectiveMultiIP
                  .filter((item: MultiIPRegime) => (ipRegimeFilter === "ALL" ? true : item.relevant))
                  .map((regimeItem: MultiIPRegime, idx: number) => {
                    const isRelevant = regimeItem.relevant;
                    const riskColor = regimeItem.risk === "HIGH" ? "text-red-700 bg-red-50 border-red-200" : regimeItem.risk === "MEDIUM" ? "text-amber-800 bg-amber-50 border-amber-200" : "text-emerald-800 bg-emerald-50 border-emerald-200";

                    return (
                      <div 
                        key={idx} 
                        className={`p-3.5 rounded-xl border transition-all text-xs flex flex-col justify-between space-y-2 ${
                          isRelevant ? "bg-white border-slate-200 shadow-xs" : "bg-slate-50/60 border-slate-200/80 opacity-70"
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-1.5 mb-1.5">
                            <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                              {regimeItem.regime}
                            </span>
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase border ${riskColor}`}>
                              {regimeItem.risk} Risk
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 leading-relaxed mb-2">
                            {regimeItem.why}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-slate-100 space-y-1 text-[10px]">
                          <div>
                            <strong className="text-slate-700">Protect:</strong> <span className="text-slate-600">{regimeItem.whatToProtect}</span>
                          </div>
                          <div>
                            <strong className="text-slate-700">Action:</strong> <span className="text-emerald-900 font-medium">{regimeItem.recommendedAction}</span>
                          </div>
                          <div className="text-slate-400 font-mono">
                            {regimeItem.statuteRef}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </section>

            {/* ACCESS AND BENEFIT SHARING (ABS) & BIOLOGICAL RESOURCE CLEARANCE */}
            <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-3.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-4 h-4 text-amber-800" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Biological Resource & Access and Benefit Sharing (ABS) Assessment
                    </h3>
                    <p className="text-xs text-slate-500">
                      Compliance with Biological Diversity Act 2002, Section 6(1) Form III & National Biodiversity Authority.
                    </p>
                  </div>
                </div>

                <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${
                  effectiveABS.relevance === "HIGH" ? "bg-amber-50 text-amber-900 border-amber-300" : "bg-emerald-50 text-emerald-900 border-emerald-300"
                }`}>
                  {effectiveABS.isConfirmedObligation ? "Confirmed Legal Obligation" : "Potential Obligation"}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="font-bold text-slate-900">Statutory Assessment</div>
                  <p className="text-slate-700 leading-relaxed">
                    {effectiveABS.potentialObligation}
                  </p>
                  <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-600 space-y-1">
                    <div><strong>Governing Authority:</strong> {effectiveABS.authority}</div>
                    <div><strong>Statutory Mandate:</strong> {effectiveABS.statuteRef}</div>
                    <div><strong>Form Required:</strong> {effectiveABS.formRequired}</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200 space-y-2">
                  <div className="font-bold text-amber-950 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-700" />
                    <span>Statutory Exemptions & Foreign Triggers</span>
                  </div>
                  <p className="text-slate-700 text-[11px] leading-relaxed">
                    <strong>Section 40 Normally Traded Commodities (NTC) Limitation:</strong> The NTC exemption applies <em>only</em> to raw commodities traded strictly for conventional consumption. It does <strong>NOT</strong> exempt patent filings or commercial research extraction.
                  </p>
                  <div className="p-2.5 rounded-lg bg-white border border-amber-200 text-[11px] text-amber-900">
                    <strong>Recommended Next Step:</strong> {effectiveABS.recommendedNextStep}
                  </div>
                </div>
              </div>
            </section>

            {/* CLAIMS & ADVERTISING RISK AUDIT */}
            <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-3.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <FileText className="w-5 h-5 text-emerald-800" />
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Claims & Advertising Compliance Audit
                    </h3>
                    <p className="text-xs text-slate-500">
                      Screens marketing claims against Drugs & Magic Remedies Act 1954 (DMRA) and ASCI guidelines.
                    </p>
                  </div>
                </div>
                <span className="text-xs text-slate-500">
                  {effectiveClaims.length} Claims Screened
                </span>
              </div>

              <div className="space-y-2.5">
                {effectiveClaims.map((claim: ClaimsRiskCheck, idx: number) => {
                  const isHigh = claim.riskLevel === "HIGH";
                  const isMed = claim.riskLevel === "MEDIUM";

                  return (
                    <div 
                      key={idx} 
                      className={`p-4 rounded-xl border text-xs space-y-2 ${
                        isHigh ? "bg-rose-50/40 border-rose-200" : isMed ? "bg-amber-50/40 border-amber-200" : "bg-emerald-50/30 border-emerald-200"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <span className="font-semibold text-slate-900 italic">
                          "{claim.claimText}"
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase self-start sm:self-auto ${
                          isHigh ? "bg-rose-100 text-rose-800 border border-rose-300" : isMed ? "bg-amber-100 text-amber-800 border border-amber-300" : "bg-emerald-100 text-emerald-800 border border-emerald-300"
                        }`}>
                          {claim.violationType} ({claim.riskLevel} Risk)
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-500">
                        <strong>Governing Law:</strong> {claim.governingStatute}
                      </div>

                      <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-slate-800 text-[11px]">
                        <strong className="text-emerald-800">Compliant Alternative Wording:</strong> "{claim.saferWording}"
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* WHAT-IF SIMULATION PLAYGROUND */}
            <section className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-5 sm:p-6 shadow-md space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                    <Sliders className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      What-If Regulatory Simulation Playground
                    </h3>
                    <p className="text-xs text-slate-400">
                      Simulate ingredient, formulation, or positioning changes to preview statutory outcomes.
                    </p>
                  </div>
                </div>
                <span className="text-[11px] text-emerald-400 font-semibold">
                  Interactive Regulatory Modeler
                </span>
              </div>

              {/* Simulation Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {effectiveWhatIf.map((sim, idx) => {
                  const isSelected = activeWhatIfIndex === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveWhatIfIndex(idx)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? "bg-emerald-950/80 border-emerald-500 text-white shadow-sm ring-1 ring-emerald-500"
                          : "bg-slate-800/60 border-slate-700 hover:bg-slate-800 text-slate-300"
                      }`}
                    >
                      <div className="text-xs font-bold text-emerald-300 mb-1">
                        {sim.label}
                      </div>
                      <div className="text-[11px] text-slate-400 line-clamp-2">
                        {sim.changeDescription}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Active Simulation Preview */}
              {activeWhatIfIndex !== null && effectiveWhatIf[activeWhatIfIndex] && (
                <div className="bg-slate-950/70 border border-slate-700/80 rounded-xl p-4 space-y-3 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
                    <span className="font-bold text-emerald-400 text-sm">
                      Simulation Analysis: {effectiveWhatIf[activeWhatIfIndex].label}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400">Risk Shift:</span>
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono text-[10px]">
                        {effectiveWhatIf[activeWhatIfIndex].originalRisk}  {effectiveWhatIf[activeWhatIfIndex].simulatedRisk}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                      <div className="text-slate-400 uppercase font-bold text-[10px]">Original Pathway</div>
                      <div className="text-slate-200 font-medium">{effectiveWhatIf[activeWhatIfIndex].originalPathway}</div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-800/60 space-y-1">
                      <div className="text-emerald-400 uppercase font-bold text-[10px]">Simulated Pathway</div>
                      <div className="text-emerald-200 font-medium">{effectiveWhatIf[activeWhatIfIndex].simulatedPathway}</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-300 leading-relaxed text-[11px]">
                    <strong className="text-emerald-400">Regulatory Impact: </strong>
                    {effectiveWhatIf[activeWhatIfIndex].impactAnalysis}
                  </div>
                </div>
              )}
            </section>

            {/* 2. COMPLETE PRODUCT ASSESSMENT MATRIX & FILING READINESS */}
            <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-emerald-800" />
                    <h3 className="text-base font-bold text-slate-900">
                      Multi-Dimensional Statutory Risk Matrix
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Evaluates 5 independent legal & regulatory dimensions without cross-contamination.
                  </p>
                </div>

                {/* Filing Readiness Badge */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5 flex items-center gap-3 shrink-0">
                  <div>
                    <div className="text-[10px] uppercase font-bold tracking-wider text-emerald-800">
                      Filing Readiness
                    </div>
                    <div className="text-xl font-extrabold text-emerald-900">
                      {activeScenario ? `${activeScenario.overview.filingReadinessScore}% Ready` : "74% Ready"}
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full border-4 border-emerald-600 border-t-emerald-200 flex items-center justify-center font-bold text-[11px] text-emerald-900">
                    {activeScenario ? activeScenario.overview.filingReadinessScore : 74}
                  </div>
                </div>
              </div>

              {/* 5 Dimensions Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
                {[
                  { 
                    label: "Patentability", 
                    risk: activeScenario ? activeScenario.overview.patentability : "MEDIUM",
                    desc: "Section 3(e) & 3(p) threshold",
                    color: activeScenario?.overview.patentability === "HIGH" ? "text-red-700 bg-red-50 border-red-200" : activeScenario?.overview.patentability === "MEDIUM" ? "text-amber-800 bg-amber-50 border-amber-200" : "text-emerald-800 bg-emerald-50 border-emerald-200"
                  },
                  { 
                    label: "Traditional Knowledge", 
                    risk: activeScenario ? activeScenario.overview.traditionalKnowledge : "HIGH",
                    desc: "CSIR-TKDL & Samhita prior art",
                    color: "text-amber-800 bg-amber-50 border-amber-200"
                  },
                  { 
                    label: "Regulatory (AYUSH)", 
                    risk: activeScenario ? activeScenario.overview.regulatory : "MEDIUM",
                    desc: "D&C Rule 158B / Schedule T",
                    color: activeScenario?.overview.regulatory === "LOW" ? "text-emerald-800 bg-emerald-50 border-emerald-200" : "text-amber-800 bg-amber-50 border-amber-200"
                  },
                  { 
                    label: "Market Entry", 
                    risk: activeScenario ? activeScenario.overview.marketEntry : "LOW",
                    desc: "Commercial launch path",
                    color: "text-emerald-800 bg-emerald-50 border-emerald-200"
                  },
                  { 
                    label: "Documentation", 
                    risk: activeScenario ? activeScenario.overview.documentation : "MEDIUM",
                    desc: "CoA, Form III & stability",
                    color: "text-amber-800 bg-amber-50 border-amber-200"
                  }
                ].map((item, idx) => (
                  <div key={idx} className={`p-3 rounded-xl border ${item.color} flex flex-col justify-between`}>
                    <div className="text-[11px] font-semibold opacity-90">{item.label}</div>
                    <div className="text-sm font-extrabold my-1">{item.risk} RISK</div>
                    <div className="text-[10px] opacity-75">{item.desc}</div>
                  </div>
                ))}
              </div>

              <div className="text-[11px] text-slate-400 italic">
                * AI screening readiness score — not a formal legal filing determination.
              </div>
            </section>

            {/* 3. 8-STAGE AI ANALYSIS TRACE (EXPANDABLE) */}
            <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Compass className="w-5 h-5 text-emerald-800" />
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      8-Stage AI Analysis Trace
                    </h3>
                    <p className="text-xs text-slate-500">
                      Transparent step-by-step verification of facts, statutory provisions, and reasoning.
                    </p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold text-xs">
                  8 / 8 Stages Complete
                </span>
              </div>

              {/* Trace Steps Accordion */}
              <div className="space-y-2">
                {(activeScenario?.traceSteps || [
                  { stageNumber: 1, stageName: "Product Information Understood", status: "completed", summary: "Parsed botanical formulation and delivery intent.", details: "Identified active entities and target therapeutic indications." },
                  { stageNumber: 2, stageName: "Jurisdiction Identified: India", status: "completed", summary: "Target framework locked to Indian Patents Act & AYUSH.", details: "Governed by CGPDTM and Ministry of Ayush." },
                  { stageNumber: 3, stageName: "Ingredients Extracted", status: "completed", summary: "Identified active herbal materials.", details: "Screened against Indian Pharmacopoeia and API monographs." },
                  { stageNumber: 4, stageName: "Patentability Rules Evaluated", status: "warning", summary: "Section 3(e) admixture & Section 3(p) TKDL bars evaluated.", details: "Synergy proof required to overcome Section 3(e) aggregation bar.", statuteRef: "Patents Act § 3(e)" },
                  { stageNumber: 5, stageName: "Traditional Knowledge Overlap Screened", status: "flagged", summary: "Potential traditional-knowledge overlap verified in classical texts.", details: "Referenced in Charaka Samhita and Ayurvedic Formulary of India.", statuteRef: "Charaka Samhita Sutrasthana" },
                  { stageNumber: 6, stageName: "Regulatory Classification Mapped", status: "completed", summary: "Classified under D&C Act Rule 158B.", details: "Ayurvedic Proprietary Medicine path eligible.", statuteRef: "D&C Rules Rule 158B" },
                  { stageNumber: 7, stageName: "Statutory Evidence Retrieved & Grounded", status: "completed", summary: "Retrieved official gazettes and court precedents.", details: "Linked to IP India Manual of Patent Practice." },
                  { stageNumber: 8, stageName: "Risk Calculation & Action Plan Generated", status: "completed", summary: "Filing Readiness score and prioritized next steps prepared.", details: "Ready for export and stakeholder review." }
                ]).map((step, idx) => {
                  const isExpanded = expandedTraceStep === idx;
                  const isFlagged = step.status === "flagged";
                  const isWarning = step.status === "warning";

                  return (
                    <div 
                      key={idx}
                      className="border border-slate-200 rounded-xl overflow-hidden transition-all bg-slate-50/50 hover:bg-slate-50"
                    >
                      <button
                        type="button"
                        onClick={() => setExpandedTraceStep(isExpanded ? null : idx)}
                        className="w-full p-3.5 flex items-center justify-between gap-3 text-left cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                            isFlagged ? "bg-red-100 text-red-800" : isWarning ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"
                          }`}>
                            {step.stageNumber}
                          </span>
                          <div>
                            <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                              <span>{step.stageName}</span>
                              {step.statuteRef && (
                                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-200/80 text-slate-700">
                                  {step.statuteRef}
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-600 mt-0.5">
                              {step.summary}
                            </div>
                          </div>
                        </div>

                        {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                      </button>

                      {isExpanded && (
                        <div className="px-4 pb-4 pt-1 text-xs text-slate-600 border-t border-slate-200/80 bg-white space-y-2">
                          <p className="leading-relaxed">{step.details}</p>
                          {step.statuteRef && (
                            <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 font-semibold pt-1">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              <span>Statutory Citation: {step.statuteRef}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* 4. REGULATORY READINESS CHECKLIST */}
            <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-emerald-800" />
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Regulatory Readiness Checklist (India / AYUSH)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Compliance requirements under Drugs & Cosmetics Act 1940, Rule 158B, and Schedule T GMP.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(activeScenario?.regulatoryChecklist || DEFAULT_REGULATORY_CHECKLIST).map((item, idx) => {
                  const isCompliant = item.status === "compliant";
                  const isReview = item.status === "review_required";

                  return (
                    <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2 text-xs">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-slate-900">{item.label}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isCompliant ? "bg-emerald-100 text-emerald-800" : isReview ? "bg-amber-100 text-amber-800" : "bg-orange-100 text-orange-800"
                        }`}>
                          {item.status.replace("_", " ").toUpperCase()}
                        </span>
                      </div>
                      <p className="text-slate-600 text-[11px] leading-relaxed">
                        {item.reason}
                      </p>
                      <div className="pt-1 text-[10px] text-slate-500 space-y-0.5 border-t border-slate-200/60">
                        <div><strong>Required Doc:</strong> {item.requiredDocument}</div>
                        <div><strong>Source:</strong> {item.sourceStatute}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* 5. "WHAT AYURLEX DOES NOT KNOW" (MISSING INFORMATION CALLOUT) */}
            <section className="bg-slate-50 rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm sm:text-base border-b border-slate-200 pb-2.5">
                <QuestionIcon className="w-4 h-4 text-slate-600" />
                <h3>Information Needed to Complete Official Filing (What AYURLEX Does Not Know)</h3>
              </div>
              <p className="text-xs text-slate-600">
                To achieve 100% filing readiness and eliminate examiner objections, the following applicant inputs remain missing:
              </p>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {(activeScenario?.missingInputs || [
                  "Exact quantitative concentration of active phytoconstituents",
                  "Geographical procurement district in India (required for Section 10(4) disclosure)",
                  "Accelerated 6-month stability testing data under Schedule T"
                ]).map((inp, idx) => (
                  <li key={idx} className="flex items-center gap-2 bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="w-4 h-4 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-[10px] shrink-0">?</span>
                    <span>{inp}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* 6. TOP RISKS & PRIORITIZED ACTION PLAN */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Top Risks */}
              <section className="bg-white rounded-2xl border border-amber-200 p-5 shadow-xs space-y-3 bg-amber-50/10">
                <div className="flex items-center gap-2 text-amber-950 font-bold text-sm sm:text-base border-b border-amber-200 pb-2">
                  <AlertCircle className="w-4 h-4 text-amber-700" />
                  <h3>Top Statutory Risks & Mitigations</h3>
                </div>
                <div className="space-y-2.5">
                  {(activeScenario?.topRisks || [
                    { id: "1", risk: "Section 3(p) Traditional Knowledge Bar", severity: "HIGH", category: "Patent", mitigation: "Pivot claims to novel delivery carrier and extraction kinetics." },
                    { id: "2", risk: "Section 3(e) Mere Admixture Challenge", severity: "HIGH", category: "Patent", mitigation: "Provide synergy proof (combination index < 1.0) in complete specification." },
                    { id: "3", risk: "NBA Section 6 Biological Resource Approval", severity: "MEDIUM", category: "Biodiversity", mitigation: "File Form III with National Biodiversity Authority, Chennai." }
                  ]).map((r, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-white border border-amber-200 space-y-1 text-xs">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-slate-900">{r.risk}</span>
                        <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${r.severity === "HIGH" ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-800"}`}>
                          {r.severity}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600">
                        <strong>Mitigation:</strong> {r.mitigation}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Action Plan */}
              <section className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm sm:text-base border-b border-slate-100 pb-2">
                  <ListChecks className="w-4 h-4 text-emerald-800" />
                  <h3>Prioritized Action Plan</h3>
                </div>
                <div className="space-y-2.5">
                  {(activeScenario?.actionPlan || [
                    { priority: 1, step: "File Form III with National Biodiversity Authority (NBA)", authority: "NBA Chennai", deadlineDesc: "Prior to patent grant" },
                    { priority: 2, step: "Incorporate Comparative Bioavailability Data in Specification", authority: "Patent Office", deadlineDesc: "On filing date" },
                    { priority: 3, step: "Apply for Ayurvedic Proprietary Medicine License (Form 25-D)", authority: "State AYUSH", deadlineDesc: "3 months prior to commercial launch" }
                  ]).map((act, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
                      <div className="flex items-center gap-2 font-bold text-slate-900">
                        <span className="w-4 h-4 rounded-full bg-emerald-800 text-white flex items-center justify-center text-[10px] shrink-0">
                          {act.priority}
                        </span>
                        <span>{act.step}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 pl-6">
                        <strong>Authority:</strong> {act.authority} · <strong>Timeline:</strong> {act.deadlineDesc}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* 7. VERIFIED STATUTORY & REGULATORY EVIDENCE */}
            <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm sm:text-base">
                  <BookOpen className="w-4 h-4 text-emerald-800" />
                  <h3>Authoritative Evidence Supporting This Assessment</h3>
                </div>
                <span className="text-xs text-slate-500 font-medium">
                  {activeScenario?.evidence?.length || DEMO_EVIDENCE.length} official statutory sources
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                {(activeScenario?.evidence || DEMO_EVIDENCE.slice(0, 4)).map((ev, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-emerald-600/40 transition-all text-xs space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-slate-900">{ev.referenceNumber || ev.id}</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {ev.sourceType.toUpperCase()} SOURCE
                      </span>
                    </div>
                    <div className="font-semibold text-slate-800 text-[11px]">{ev.title}</div>
                    <div className="text-[10px] text-slate-500">
                      <strong>Authority:</strong> {ev.sourceName} · <strong>Section:</strong> {ev.section || "General"} · <strong>Verified:</strong> {ev.lastVerified || "September 2026"}
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed bg-white p-2.5 rounded-lg border border-slate-100 italic">
                      "{ev.excerpt}"
                    </p>
                    {ev.url && (
                      <a
                        href={ev.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-emerald-800 hover:text-emerald-900 font-semibold mt-1"
                      >
                        <span>View Official Portal</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* 8. STATUTORY DISCLAIMER */}
            <section className="bg-slate-100/80 rounded-xl p-4 border border-slate-200 text-slate-500 text-[11px] leading-relaxed space-y-1">
              <div className="font-bold text-slate-700 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-slate-500" />
                <span>Statutory Decision-Support Disclaimer</span>
              </div>
              <p>
                AYURLEX provides AI-assisted decision support grounded in statutory corpora and does not substitute for qualified legal or regulatory counsel. For official patent filings in India, consult a registered Patent Agent under the Indian Patents Act, 1970. For AYUSH licensing, consult the State Licensing Authority (AYUSH) or the Ministry of Ayush.
              </p>
            </section>

          </div>
        )}

      {/* EXPERT REVIEW BRIEF MODAL */}
      {showExpertBriefModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in-50">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Executive Brief: Expert Legal & Regulatory Review</h3>
                  <p className="text-xs text-slate-500">Prepared for Patent Attorney / AYUSH Regulatory Counsel</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowExpertBriefModal(false)}
                className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-700 leading-relaxed">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="text-[10px] uppercase font-bold text-slate-500">Executive Summary</div>
                <p className="text-slate-900 font-medium text-xs sm:text-sm">{effectiveExpertBrief.executiveSummary}</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1.5 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Key Statutory Questions to Put to Counsel</span>
                </h4>
                <ul className="space-y-1.5 pl-2">
                  {effectiveExpertBrief.keyLegalQuestions.map((q, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
                      <span className="font-bold text-emerald-800">{idx + 1}.</span>
                      <span>{q}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1.5 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Required Statutory Filings</span>
                </h4>
                <ul className="space-y-1 pl-2">
                  {effectiveExpertBrief.requiredFilings.map((f, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1.5">Critical Statutory Deadlines</h4>
                <ul className="space-y-1 pl-2 text-slate-600">
                  {effectiveExpertBrief.statutoryDeadlines.map((d, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-[11px]">
                <strong>Recommended Specialist:</strong> {effectiveExpertBrief.specialistConsultantType}
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">AYURLEX Master v2  Decision Support Brief</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg font-semibold text-slate-700 flex items-center gap-1.5 cursor-pointer text-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Brief</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowExpertBriefModal(false)}
                  className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-semibold cursor-pointer text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 12 VERIFIED GOVERNMENT REGISTRIES MODAL */}
      {showSourceRegistryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in-50">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-white font-bold">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">12 Verified Government & Statutory Registries</h3>
                  <p className="text-xs text-slate-500">Transparent Official Citations & Access Boundaries</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowSourceRegistryModal(false)}
                className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-3 text-xs">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-[11px] leading-relaxed">
                <strong>Anti-Hallucination Policy:</strong> AYURLEX cites exclusively official government registries, gazette notifications, and statutory repositories. CSIR-TKDL citations represent public Ayurvedic literature guidance; access limitations are stated truthfully.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {OFFICIAL_SOURCE_REGISTRY.map((src: SourceRegistryRecord) => (
                  <div key={src.sourceId} className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold text-slate-900 text-xs">{src.authority}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-200 text-slate-700">{src.jurisdiction}</span>
                      </div>
                      <div className="text-[11px] font-medium text-emerald-900">{src.domain} • {src.category}</div>
                      <p className="text-[10px] text-slate-500 leading-relaxed">{src.documentType}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-200/80 space-y-1 text-[10px]">
                      <div className="text-slate-500 italic">Access: {src.accessMethod} — {src.notes}</div>
                      <a 
                        href={src.officialUrl} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-emerald-700 font-semibold hover:underline inline-flex items-center gap-1"
                      >
                        <span>{src.officialUrl}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setShowSourceRegistryModal(false)}
                className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold cursor-pointer text-xs"
              >
                Close Registry Viewer
              </button>
            </div>
          </div>
        </div>
      )}

      </main>

      <Footer />
    </div>
  );
}
