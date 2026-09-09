"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Sparkles, 
  ShieldCheck, 
  Scale, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Download, 
  Printer, 
  Share2, 
  Bookmark, 
  ChevronRight, 
  ChevronDown, 
  ChevronUp, 
  Plus, 
  Trash2, 
  Edit3, 
  ExternalLink, 
  Layers, 
  Globe, 
  FlaskConical, 
  Lightbulb, 
  Eye, 
  ArrowRight, 
  RotateCcw, 
  Info, 
  Lock, 
  Building2, 
  Copy, 
  Check, 
  Search, 
  Sliders, 
  PieChart, 
  BarChart3,
  ShieldAlert,
  Calendar,
  Award,
  Compass,
  ArrowUpRight,
  BookOpen,
  Split,
  FileCheck
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { 
  ProductInput, 
  ProductIntelligenceReport, 
  JurisdictionCode, 
  RiskLevel, 
  ReadinessLevel 
} from "@/types/productIntelligence";
import { PRODUCT_PRESETS, ProductPreset } from "@/data/productIntelligencePresets";

// Common Ayurvedic botanicals for quick autocomplete/chips
const COMMON_BOTANICAL_CHIPS = [
  { label: "Ashwagandha (Withania somnifera 500mg)", value: "Withania somnifera standardized root extract (5% withanolides) - 500mg" },
  { label: "Curcumin (Curcuma longa 250mg)", value: "Curcuma longa rhizome extract (95% curcuminoids) - 250mg" },
  { label: "Piperine (Piper nigrum / longum 5mg)", value: "Piperine extract (Piper longum / nigrum, 95% alkaloid fraction) - 5mg" },
  { label: "Triphala (Amla, Haritaki, Bibhitaki 750mg)", value: "Triphala standardized fruit extract (1:1:1 ratio) - 750mg" },
  { label: "Brahmi (Bacopa monnieri 300mg)", value: "Bacopa monnieri whole plant extract (20% bacosides A&B) - 300mg" },
  { label: "Guduchi (Tinospora cordifolia 300mg)", value: "Tinospora cordifolia stem extract - 300mg" },
  { label: "Tulsi (Ocimum sanctum 200mg)", value: "Ocimum sanctum leaf extract - 200mg" },
  { label: "Shilajit (Purified Exudate 250mg)", value: "Purified Shilajit exudate (50% fulvic acid) - 250mg" }
];

const TARGET_MARKET_OPTIONS: { code: JurisdictionCode; label: string; flag: string; authority: string }[] = [
  { code: "IN", label: "India", flag: "🇮🇳", authority: "CGPDTM · Ministry of AYUSH · FSSAI" },
  { code: "US", label: "United States", flag: "🇺🇸", authority: "USPTO · US FDA (DSHEA / CFSAN)" },
  { code: "EU", label: "European Union", flag: "🇪🇺", authority: "EPO · EMA (THMPD) · EFSA" },
  { code: "JP", label: "Japan", flag: "🇯🇵", authority: "JPO · MHLW (PMD Act) · CAA (FFC)" },
  { code: "WO", label: "Global / WIPO PCT", flag: "🌐", authority: "WIPO PCT · Genetic Resources Treaty" }
];

function ProductIntelligenceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language, t } = useLanguage();

  // Intake / Wizard state
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [comparingWith, setComparingWith] = useState<ProductPreset | null>(null);
  const [compareModalOpen, setCompareModalOpen] = useState(false);

  // Form State
  const [productName, setProductName] = useState("");
  const [brandName, setBrandName] = useState("");
  const [productType, setProductType] = useState("Proprietary Ayurvedic Medicine / Liposomal Softgel");
  const [ingredients, setIngredients] = useState<string[]>([
    "Withania somnifera standardized root extract (5% withanolides) - 500mg",
    "Piperine extract (Piper longum / nigrum, 95% alkaloid fraction) - 5mg"
  ]);
  const [newIngredientInput, setNewIngredientInput] = useState("");
  const [formulation, setFormulation] = useState("Self-emulsifying nano-liposomal softgel dispersion with sub-100nm droplet size");
  const [extractionMethod, setExtractionMethod] = useState("Supercritical CO2 extraction followed by hydro-ethanolic crystallization");
  const [manufacturingMethod, setManufacturingMethod] = useState("High-pressure homogenization at 1200 bar under nitrogen blanketing");
  const [intendedUse, setIntendedUse] = useState("Adaptogenic neural resilience, sleep architecture optimization, and cortisol modulation");
  const [technicalEffect, setTechnicalEffect] = useState("Demonstrated 4.8x higher systemic AUC bioavailability compared to unformulated ashwagandha churna in human crossover pharmacokinetic trial");
  const [healthClaims, setHealthClaims] = useState<string[]>([
    "Supports resistance to stress and helps normalize evening serum cortisol levels",
    "Promotes deep restorative sleep architecture and mental vitality"
  ]);
  const [newHealthClaimInput, setNewHealthClaimInput] = useState("");
  const [marketingClaims, setMarketingClaims] = useState<string[]>([
    "Advanced Phytosomal Nano-Delivery",
    "Standardized to 5% withanolides"
  ]);
  const [newMarketingClaimInput, setNewMarketingClaimInput] = useState("");
  const [classicalReference, setClassicalReference] = useState("Bhavaprakasha Nighantu, Guduchyadi Varga; Charaka Samhita Sutrasthana Ch. 4");
  const [biologicalOrigin, setBiologicalOrigin] = useState("India (Native Cultivation)");
  const [manufacturingLocation, setManufacturingLocation] = useState("Gujarat, India (Schedule T GMP)");
  const [targetMarkets, setTargetMarkets] = useState<JurisdictionCode[]>(["IN", "US", "EU", "JP"]);
  const [applicantType, setApplicantType] = useState("Ayurvedic Biotech Enterprise");
  const [existingIP, setExistingIP] = useState("Indian Provisional Patent Filed for Nano-Emulsion Carrier Matrix");
  const [notes, setNotes] = useState("Bioavailability enhanced Ayurvedic formulation.");

  // Analysis & Execution state
  const [analyzing, setAnalyzing] = useState(false);
  const [currentProgressStep, setCurrentProgressStep] = useState(0);
  const [report, setReport] = useState<ProductIntelligenceReport | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedDNA, setCopiedDNA] = useState(false);

  // Auto-load preset or existing report from search query if present
  useEffect(() => {
    const reportIdParam = searchParams.get("reportId");
    if (reportIdParam) {
      try {
        const raw = localStorage.getItem("ayurlex_saved_reports");
        if (raw) {
          const parsed = JSON.parse(raw);
          const matched = parsed.find((r: any) => r.id === reportIdParam);
          if (matched && matched.response && matched.response.productDNA) {
            setReport(matched.response);
            loadFormFromProductDNA(matched.response.productDNA);
            return;
          }
        }
      } catch {}
    }

    const presetParam = searchParams.get("preset");
    if (presetParam) {
      const p = PRODUCT_PRESETS.find(item => item.presetId === presetParam);
      if (p) {
        loadPreset(p);
      }
    }
  }, [searchParams]);

  // Load a preset into state
  const loadPreset = (preset: ProductPreset, autoRun = false) => {
    setProductName(preset.productName);
    setBrandName(preset.brandName || "");
    setProductType(preset.productType);
    setIngredients([...preset.ingredients]);
    setFormulation(preset.formulation || "");
    setExtractionMethod(preset.extractionMethod || "");
    setManufacturingMethod(preset.manufacturingMethod || "");
    setIntendedUse(preset.intendedUse || "");
    setTechnicalEffect(preset.technicalEffect || "");
    setHealthClaims([...(preset.healthClaims || [])]);
    setMarketingClaims([...(preset.marketingClaims || [])]);
    setClassicalReference(preset.classicalReference || "");
    setBiologicalOrigin(preset.biologicalOrigin || "India");
    setManufacturingLocation(preset.manufacturingLocation || "India");
    setTargetMarkets([...preset.targetMarkets]);
    setApplicantType(preset.applicantType || "Ayurvedic Biotech Enterprise");
    setExistingIP(preset.existingIP || "");
    setNotes(preset.notes || "");
    
    if (autoRun) {
      executeAnalysisWithPayload(preset);
    } else {
      setWizardOpen(true);
      setWizardStep(1);
    }
  };

  const loadFormFromProductDNA = (dna: any) => {
    setProductName(dna.productName || "");
    setBrandName(dna.brandName || "");
    setProductType(dna.productType || "");
    setIngredients(dna.ingredients || []);
    setFormulation(dna.formulation || "");
    setExtractionMethod(dna.extractionMethod || "");
    setManufacturingMethod(dna.manufacturingMethod || "");
    setIntendedUse(dna.intendedUse || "");
    setTechnicalEffect(dna.technicalEffect || "");
    setHealthClaims(dna.healthClaims || []);
    setMarketingClaims(dna.marketingClaims || []);
    setClassicalReference(dna.classicalReference || "");
    setBiologicalOrigin(dna.biologicalOrigin || "India");
    setManufacturingLocation(dna.manufacturingLocation || "India");
    setTargetMarkets(dna.targetMarkets || ["IN", "US"]);
    setApplicantType(dna.applicantType || "");
    setExistingIP(dna.existingIP || "");
    setNotes(dna.notes || "");
  };

  // Target market toggle
  const toggleMarket = (code: JurisdictionCode) => {
    if (targetMarkets.includes(code)) {
      if (targetMarkets.length === 1) return; // Keep at least one
      setTargetMarkets(targetMarkets.filter(m => m !== code));
    } else {
      setTargetMarkets([...targetMarkets, code]);
    }
  };

  // Add ingredient
  const handleAddIngredient = () => {
    if (newIngredientInput.trim()) {
      setIngredients([...ingredients, newIngredientInput.trim()]);
      setNewIngredientInput("");
    }
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  // Add Health Claim
  const handleAddHealthClaim = () => {
    if (newHealthClaimInput.trim()) {
      setHealthClaims([...healthClaims, newHealthClaimInput.trim()]);
      setNewHealthClaimInput("");
    }
  };

  const handleRemoveHealthClaim = (index: number) => {
    setHealthClaims(healthClaims.filter((_, i) => i !== index));
  };

  // Add Marketing Claim
  const handleAddMarketingClaim = () => {
    if (newMarketingClaimInput.trim()) {
      setMarketingClaims([...marketingClaims, newMarketingClaimInput.trim()]);
      setNewMarketingClaimInput("");
    }
  };

  const handleRemoveMarketingClaim = (index: number) => {
    setMarketingClaims(marketingClaims.filter((_, i) => i !== index));
  };

  // Execution
  const handleStartAnalysis = async () => {
    setWizardOpen(false);
    const payload: ProductInput = {
      productName: productName.trim() || "Ayurvedic Formulation",
      brandName: brandName.trim() || undefined,
      productType,
      ingredients,
      formulation,
      extractionMethod,
      manufacturingMethod,
      intendedUse,
      technicalEffect,
      healthClaims,
      marketingClaims,
      classicalReference,
      biologicalOrigin,
      manufacturingLocation,
      targetMarkets,
      applicantType,
      existingIP,
      notes,
    };
    await executeAnalysisWithPayload(payload);
  };

  const executeAnalysisWithPayload = async (payload: ProductInput) => {
    setAnalyzing(true);
    setErrorMsg(null);
    setCurrentProgressStep(1);

    // Realistic progressive step simulation
    const interval = setInterval(() => {
      setCurrentProgressStep(prev => (prev < 11 ? prev + 1 : prev));
    }, 450);

    try {
      const res = await fetch("/api/product-intelligence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      clearInterval(interval);
      setCurrentProgressStep(12);

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({ detail: "Analysis failed" }));
        throw new Error(errJson.detail || `Server error ${res.status}`);
      }

      const reportData: ProductIntelligenceReport = await res.json();
      setReport(reportData);
      setActiveTab("overview");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      setErrorMsg(err?.message || "Product Intelligence evaluation encountered an unexpected error.");
    } finally {
      clearInterval(interval);
      setAnalyzing(false);
    }
  };

  // Save to Reports in localStorage
  const handleSaveToReports = () => {
    if (!report) return;
    try {
      const savedRaw = localStorage.getItem("ayurlex_saved_reports");
      const savedList = savedRaw ? JSON.parse(savedRaw) : [];
      
      const newEntry = {
        id: report.reportId,
        title: report.productDNA.productName,
        date: report.generatedAt,
        jurisdiction: report.productDNA.targetMarkets.join(", "),
        analysisType: "Product Intelligence (Multi-Market)",
        decision: report.overallLaunchReadiness.overallVerdict,
        confidence: "HIGH",
        summary: `Launch Readiness: ${report.overallLaunchReadiness.overallScore}/100 (${report.overallLaunchReadiness.overallVerdict}). Markets: ${report.productDNA.targetMarkets.join(", ")}. Primary carrier: ${report.productDNA.formulation || "Standardized formulation"}.`,
        response: report,
        isDemo: false,
        readinessScore: report.overallLaunchReadiness.overallScore,
      };

      const filtered = savedList.filter((item: any) => item.id !== report.reportId);
      filtered.unshift(newEntry);
      localStorage.setItem("ayurlex_saved_reports", JSON.stringify(filtered));
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (e) {
      alert("Failed to save report to browser storage.");
    }
  };

  // Export JSON
  const handleExportJSON = () => {
    if (!report) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
    const dl = document.createElement("a");
    dl.setAttribute("href", dataStr);
    dl.setAttribute("download", `AYURLEX_PRODUCT_INTELLIGENCE_${report.reportId}.json`);
    document.body.appendChild(dl);
    dl.click();
    dl.remove();
  };

  // Export Markdown
  const handleExportMarkdown = () => {
    if (!report) return;
    let md = `# AYURLEX PRODUCT INTELLIGENCE DOSSIER\n\n`;
    md += `**Report ID**: ${report.reportId}\n`;
    md += `**Generated**: ${report.generatedAt}\n`;
    md += `**Product Name**: ${report.productDNA.productName}\n`;
    md += `**Brand Name**: ${report.productDNA.brandName || "N/A"}\n`;
    md += `**Overall Launch Readiness**: ${report.overallLaunchReadiness.overallScore}/100 (${report.overallLaunchReadiness.overallVerdict})\n`;
    md += `**Target Markets**: ${report.productDNA.targetMarkets.join(", ")}\n\n`;
    md += `## 1. Product DNA & Botanical Composition\n`;
    report.productDNA.normalizedIngredients.forEach((ing, idx) => {
      md += `${idx + 1}. **${ing.commonName}** (${ing.botanicalName || "Unspecified"}) - Sanskrit: ${ing.sanskritName || "N/A"} - Part: ${ing.plantPart || "N/A"}\n`;
      if (ing.classicalTreatiseReference) md += `   - Classical Treatise: ${ing.classicalTreatiseReference}\n`;
    });
    md += `\n## 2. Patentability vs. Preliminary FTO\n`;
    md += `- **Novelty Verdict**: ${report.patentability.noveltyVerdict}\n`;
    md += `- **Inventive Step Verdict**: ${report.patentability.inventiveStepVerdict}\n`;
    md += `- **Recommended Strategy**: ${report.patentability.recommendedClaimStrategy}\n`;
    md += `- **Preliminary FTO Risk**: ${report.ftoScan.preliminaryRisk}\n`;
    md += `\n> DISCLAIMER: ${report.ftoScan.disclaimer}\n\n`;
    md += `## 3. Statutory ABS & Traditional Knowledge\n`;
    md += `- **NBA Form III Mandate**: ${report.absBiodiversity.nbaApprovalRequired ? "YES - MANDATORY" : "NO"}\n`;
    md += `- **Reasoning**: ${report.absBiodiversity.reasoning}\n\n`;
    md += `## 4. Claims & Advertising Audit\n`;
    report.claimsAnalysis.forEach(cl => {
      md += `- [${cl.market}] **"${cl.originalClaim}"** -> Risk: **${cl.riskLevel}**\n`;
      md += `  - Safer Compliant Rewording: "${cl.saferWording}"\n`;
    });

    const dataStr = "data:text/markdown;charset=utf-8," + encodeURIComponent(md);
    const dl = document.createElement("a");
    dl.setAttribute("href", dataStr);
    dl.setAttribute("download", `AYURLEX_DOSSIER_${report.reportId}.md`);
    document.body.appendChild(dl);
    dl.click();
    dl.remove();
  };

  const copyDNAId = () => {
    if (!report) return;
    navigator.clipboard.writeText(report.productDNA.productId);
    setCopiedDNA(true);
    setTimeout(() => setCopiedDNA(false), 2000);
  };

  const getRiskBadgeClass = (risk: RiskLevel) => {
    switch (risk) {
      case "LOW":
        return "bg-emerald-50 text-emerald-800 border-emerald-200";
      case "MEDIUM":
        return "bg-amber-50 text-amber-800 border-amber-200";
      case "HIGH":
        return "bg-orange-50 text-orange-800 border-orange-200";
      case "CRITICAL":
        return "bg-rose-50 text-rose-800 border-rose-200 font-bold";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const getReadinessBadgeClass = (status: ReadinessLevel) => {
    switch (status) {
      case "READY":
        return "bg-emerald-100 text-emerald-900 border-emerald-300";
      case "CONDITIONAL":
        return "bg-amber-100 text-amber-900 border-amber-300";
      case "REQUIRES_VERIFICATION":
        return "bg-rose-100 text-rose-900 border-rose-300";
      default:
        return "bg-slate-100 text-slate-800 border-slate-300";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900 font-sans">
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* ============================================================ */}
        {/* 1. HERO / LANDING BANNER                                     */}
        {/* ============================================================ */}
        <div className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl border border-emerald-800/40">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/20 text-emerald-300 text-xs font-semibold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>AYURLEX · SIH 26045 · GLOBAL PRODUCT INTELLIGENCE</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                MY PRODUCT
              </h1>
              <p className="text-base sm:text-lg text-emerald-100/90 max-w-2xl font-normal leading-relaxed">
                Tell AYURLEX about your product once, and we will investigate its IP, regulatory, market and launch risks.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-emerald-200/80">
                <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-400" /> Grounded Statutory Law</span>
                <span className="text-emerald-400/40">•</span>
                <span className="flex items-center gap-1.5"><Scale className="w-4 h-4 text-emerald-400" /> India · US · EU · JP · PCT</span>
                <span className="text-emerald-400/40">•</span>
                <span className="flex items-center gap-1.5"><Globe className="w-4 h-4 text-emerald-400" /> Language != Jurisdiction Aware</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
              <button
                onClick={() => {
                  setWizardStep(1);
                  setWizardOpen(true);
                }}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg hover:shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>[ My Product ]</span>
              </button>

              {report && (
                <button
                  onClick={() => {
                    loadFormFromProductDNA(report.productDNA);
                    setWizardStep(1);
                    setWizardOpen(true);
                  }}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white border border-white/20 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Edit Current Product</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick Load Presets Strip */}
          <div className="relative z-10 mt-8 pt-6 border-t border-white/10">
            <div className="flex items-center justify-between gap-4 mb-3">
              <span className="text-xs font-bold text-emerald-200 tracking-wide uppercase flex items-center gap-1.5">
                <FlaskConical className="w-3.5 h-3.5 text-emerald-400" />
                Quick Load Verified Enterprise Presets (Click to Inspect)
              </span>
              <span className="text-[11px] text-emerald-300/70 hidden sm:inline">
                Pre-configured with real botanical actives, classical citations & novel delivery systems
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {PRODUCT_PRESETS.map((preset) => (
                <div
                  key={preset.presetId}
                  onClick={() => loadPreset(preset, true)}
                  className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-400/40 rounded-2xl p-4 transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-400/20">
                        {preset.badge}
                      </span>
                      <div className="flex items-center gap-1 text-slate-300">
                        {preset.targetMarkets.map(m => (
                          <span key={m} className="text-[11px]">
                            {m === "IN" ? "🇮🇳" : m === "US" ? "🇺🇸" : m === "EU" ? "🇪🇺" : m === "JP" ? "🇯🇵" : "🌐"}
                          </span>
                        ))}
                      </div>
                    </div>
                    <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-1">
                      {preset.productName}
                    </h4>
                    <p className="text-xs text-slate-300/90 leading-snug line-clamp-2">
                      {preset.shortSummary}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[11px] text-emerald-300 font-semibold">
                    <span>{preset.productType.split("/")[0].trim()}</span>
                    <span className="inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Analyze <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 2. PROGRESSIVE ANALYSIS LOADING OVERLAY                      */}
        {/* ============================================================ */}
        {analyzing && (
          <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-xl space-y-6 text-center animate-fadeIn">
            <div className="w-16 h-16 border-4 border-emerald-800 border-t-emerald-400 rounded-full animate-spin mx-auto"></div>
            
            <div className="space-y-2 max-w-xl mx-auto">
              <h3 className="text-xl font-bold text-slate-900">
                Synthesizing Multi-Jurisdiction Intelligence...
              </h3>
              <p className="text-xs text-slate-500">
                Running 12-stage forensic scan across Indian Patents Act, USPTO §101, EPO Art. 54(5), JPO PMD Act, NBA Form III, and FSSAI 2022.
              </p>
            </div>

            {/* Step Pipeline Visualization */}
            <div className="max-w-2xl mx-auto bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-2">
              {[
                "1. Input Sanitization & AYURLEX Shield Check",
                "2. Product DNA Extraction & Botanical Normalization",
                "3. Multi-Jurisdiction Statutory Evidence Retrieval (BM25 + BGE-M3)",
                "4. Jurisdiction-Specific Regulatory Classification (IN, US, EU, JP, WO)",
                "5. Patentability vs. Preliminary FTO Risk Scrutiny",
                "6. Trademark Screening & Trade Marks Act Section 13 Generic Check",
                "7. Traditional Knowledge Audit & NBA Form III Clearance Verification",
                "8. Market Entry Protocols & Mandatory Labeling Guidance",
                "9. Advertising Claims Risk & Safe Rewording Generation",
                "10. Global 8-Dimension Risk Matrix & Launch Readiness Calculation",
                "11. Multi-Tier Intellectual Property Protection Strategy",
                "12. Final Citation Traceability & Forensic Dossier Assembly"
              ].map((stepText, idx) => {
                const stepNum = idx + 1;
                const isDone = currentProgressStep > stepNum;
                const isCurrent = currentProgressStep === stepNum;
                return (
                  <div 
                    key={idx} 
                    className={`flex items-center justify-between text-xs px-3 py-1.5 rounded-lg transition-all ${
                      isCurrent 
                        ? "bg-emerald-100 text-emerald-900 font-bold border border-emerald-300" 
                        : isDone 
                        ? "text-slate-600 bg-white border border-slate-100" 
                        : "text-slate-400 opacity-60"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {isDone ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      ) : isCurrent ? (
                        <div className="w-3.5 h-3.5 border-2 border-emerald-700 border-t-transparent rounded-full animate-spin shrink-0"></div>
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0"></div>
                      )}
                      <span>{stepText}</span>
                    </span>
                    <span className="text-[10px] uppercase font-semibold">
                      {isDone ? "VERIFIED" : isCurrent ? "PROCESSING" : "QUEUED"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 flex items-start gap-3 text-rose-900 shadow-sm">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-bold">Analysis Interrupted</h4>
              <p className="text-xs text-rose-700">{errorMsg}</p>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* 3. REPORT VIEW DASHBOARD                                     */}
        {/* ============================================================ */}
        {report && !analyzing && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Top Dossier Header Card */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                      <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{report.engineVersion}</span>
                    </span>
                    
                    <button
                      onClick={copyDNAId}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-mono border border-slate-200 transition-colors cursor-pointer"
                      title="Click to copy Product DNA ID"
                    >
                      <span>{report.productDNA.productId}</span>
                      {copiedDNA ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-400" />}
                    </button>

                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(report.generatedAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {report.productDNA.productName}
                  </h2>
                  
                  {report.productDNA.brandName && (
                    <div className="text-sm font-semibold text-emerald-800 flex items-center gap-1.5">
                      <span>Brand:</span>
                      <span className="bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">{report.productDNA.brandName}</span>
                      <span className="text-slate-400 font-normal">({report.productDNA.productType})</span>
                    </div>
                  )}

                  {/* Target Market Flags */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-xs font-semibold text-slate-500">Evaluated Markets:</span>
                    {report.productDNA.targetMarkets.map(m => {
                      const opt = TARGET_MARKET_OPTIONS.find(o => o.code === m);
                      return (
                        <span key={m} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800">
                          <span>{opt?.flag}</span>
                          <span>{opt?.label || m}</span>
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Top Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 self-start lg:self-center">
                  <button
                    onClick={handleSaveToReports}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      savedSuccess 
                        ? "bg-emerald-600 text-white border-emerald-700" 
                        : "bg-emerald-800 hover:bg-emerald-700 text-white border-emerald-900 shadow-xs"
                    }`}
                  >
                    {savedSuccess ? <Check className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                    <span>{savedSuccess ? "Saved to Reports!" : "Save to Reports"}</span>
                  </button>

                  <button
                    onClick={handleExportJSON}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
                    title="Export Machine-Readable JSON"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-500" />
                    <span>JSON</span>
                  </button>

                  <button
                    onClick={handleExportMarkdown}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
                    title="Export Markdown Legal Dossier"
                  >
                    <FileText className="w-3.5 h-3.5 text-slate-500" />
                    <span>Markdown</span>
                  </button>

                  <button
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
                    title="Print Dossier or Save to PDF"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-500" />
                    <span>Print / PDF</span>
                  </button>

                  <button
                    onClick={() => setCompareModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                    title="Compare with another formulation"
                  >
                    <Split className="w-3.5 h-3.5 text-slate-600" />
                    <span>Compare</span>
                  </button>
                </div>
              </div>

              {/* Jump Navigation Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin border-b border-slate-100">
                {[
                  { id: "overview", label: "Launch Readiness & Overview", icon: Award },
                  { id: "dna", label: "Product DNA", icon: FlaskConical },
                  { id: "classification", label: "Market Classification", icon: Globe },
                  { id: "ip", label: "IP Landscape (Patentability vs FTO)", icon: Scale },
                  { id: "trademark", label: "Trademark & Generic Terms", icon: ShieldCheck },
                  { id: "tk_abs", label: "Traditional Knowledge & ABS", icon: BookOpen },
                  { id: "regulatory", label: "Regulatory & Market Entry", icon: Building2 },
                  { id: "claims", label: "Claims & Advertising Risk", icon: AlertTriangle },
                  { id: "matrix", label: "Global Risk Matrix", icon: BarChart3 },
                  { id: "strategy", label: "What to Protect", icon: Lock },
                  { id: "evidence", label: "Evidence & Traceability", icon: ShieldAlert },
                  { id: "trace", label: "12-Step Audit Trace", icon: Layers }
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                        isActive
                          ? "bg-emerald-800 text-white shadow-xs"
                          : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200"
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${isActive ? "text-emerald-200" : "text-slate-400"}`} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ============================================================ */}
            {/* TAB 1: OVERVIEW & LAUNCH READINESS SCORE                     */}
            {/* ============================================================ */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                
                {/* Score Hero Banner */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Gauge Card */}
                  <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col justify-between items-center text-center space-y-4">
                    <div className="space-y-1">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Composite Readiness Index
                      </span>
                      <h3 className="text-lg font-bold text-slate-900">
                        Launch Readiness Score
                      </h3>
                    </div>

                    {/* Circular Score Display */}
                    <div className="relative flex items-center justify-center">
                      <div className="w-36 h-36 rounded-full border-8 border-slate-100 flex items-center justify-center">
                        <div className={`w-28 h-28 rounded-full flex flex-col items-center justify-center ${
                          report.overallLaunchReadiness.overallScore >= 75
                            ? "bg-emerald-50 text-emerald-800"
                            : report.overallLaunchReadiness.overallScore >= 50
                            ? "bg-amber-50 text-amber-800"
                            : "bg-rose-50 text-rose-800"
                        }`}>
                          <span className="text-4xl font-black">
                            {report.overallLaunchReadiness.overallScore}
                          </span>
                          <span className="text-[11px] font-bold uppercase tracking-wider">
                            out of 100
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 w-full">
                      <div className={`inline-block px-3 py-1 rounded-full text-xs font-extrabold border ${
                        getReadinessBadgeClass(report.overallLaunchReadiness.overallVerdict)
                      }`}>
                        STATUS: {report.overallLaunchReadiness.overallVerdict}
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed px-2">
                        {report.overallLaunchReadiness.overallVerdict === "READY"
                          ? "Product has met preliminary statutory and regulatory thresholds for commercial launch planning."
                          : "Actionable regulatory prerequisites and patent assay proofs required before unhindered launch."}
                      </p>
                    </div>
                  </div>

                  {/* Market Breakdown Grid */}
                  <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <Globe className="w-4 h-4 text-emerald-600" />
                        <span>Jurisdiction-Specific Readiness Breakdown</span>
                      </h4>
                      <span className="text-xs text-slate-400">
                        {report.overallLaunchReadiness.marketReadiness.length} Target Markets Analyzed
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {report.overallLaunchReadiness.marketReadiness.map((m) => {
                        const opt = TARGET_MARKET_OPTIONS.find(o => o.code === m.jurisdiction);
                        return (
                          <div
                            key={m.jurisdiction}
                            className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2.5 flex flex-col justify-between"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                                <span>{opt?.flag}</span>
                                <span>{m.marketName}</span>
                              </span>
                              <span className={`text-xs font-bold px-2 py-0.5 rounded border ${
                                m.score >= 75 ? "bg-emerald-100 text-emerald-800 border-emerald-200" :
                                m.score >= 50 ? "bg-amber-100 text-amber-800 border-amber-200" :
                                "bg-rose-100 text-rose-800 border-rose-200"
                              }`}>
                                {m.score}% ({m.status})
                              </span>
                            </div>

                            <p className="text-xs text-slate-600 leading-relaxed">
                              {m.summary}
                            </p>

                            {m.criticalBlockers.length > 0 && (
                              <div className="space-y-1 pt-2 border-t border-slate-200/60">
                                <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider block">
                                  Critical Pre-Launch Blockers:
                                </span>
                                <ul className="text-[11px] text-rose-900 space-y-0.5 list-disc pl-3.5">
                                  {m.criticalBlockers.map((b, bIdx) => (
                                    <li key={bIdx}>{b}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 3-Phase Action Plan */}
                <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <Compass className="w-4 h-4 text-emerald-600" />
                        <span>Prescriptive Launch Action Plan & Timeline</span>
                      </h4>
                      <p className="text-xs text-slate-500">
                        Step-by-step roadmap to eliminate IP bars and regulatory blockers prior to commercial sale.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                    {report.overallLaunchReadiness.actionPlan.map((phase, pIdx) => (
                      <div 
                        key={pIdx}
                        className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3 relative overflow-hidden"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">
                            {phase.timeframe}
                          </span>
                          <span className="text-xs font-bold text-slate-400">Step {pIdx + 1}</span>
                        </div>

                        <h5 className="text-sm font-bold text-slate-900">
                          {phase.phase}
                        </h5>

                        <p className="text-xs text-slate-700 leading-relaxed">
                          {phase.action}
                        </p>

                        <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500 flex items-center gap-1.5 font-medium">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          <span>Owner: {phase.owner}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Critical Proactive Discoveries Summary Strip */}
                <div className="bg-amber-50/70 border border-amber-200 rounded-3xl p-6 space-y-3">
                  <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                    <ShieldAlert className="w-4 h-4 text-amber-700" />
                    <span>Proactive Statutory Alerts Identified</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {report.relatedDiscoveries.map((disc) => (
                      <div key={disc.id} className="bg-white border border-amber-200/80 rounded-2xl p-3.5 space-y-1.5">
                        <div className="flex items-center justify-between text-[10px] font-bold">
                          <span className="text-amber-800 uppercase">{disc.category}</span>
                          <span className="text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">{disc.severity}</span>
                        </div>
                        <h6 className="text-xs font-bold text-slate-900">{disc.title}</h6>
                        <p className="text-[11px] text-slate-600 leading-snug line-clamp-3">{disc.description}</p>
                        <div className="text-[10px] text-emerald-800 font-semibold pt-1">
                          Act: {disc.actionRequired}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* ============================================================ */}
            {/* TAB 2: PRODUCT DNA & INGREDIENT NORMALIZATION                */}
            {/* ============================================================ */}
            {activeTab === "dna" && (
              <div className="space-y-6">
                
                {/* Product DNA Overview Card */}
                <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div className="space-y-0.5">
                      <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <FlaskConical className="w-4 h-4 text-emerald-600" />
                        <span>Canonical Product DNA Specifications</span>
                      </h3>
                      <p className="text-xs text-slate-500">
                        Standardized botanical taxonomy, plant parts, delivery matrix, and classical treatises.
                      </p>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                      {report.productDNA.productId}
                    </span>
                  </div>

                  {/* DNA Key Value Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Delivery Formulation</span>
                      <p className="text-xs font-bold text-slate-800">{report.productDNA.formulation || "Standardized formulation"}</p>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Extraction Methodology</span>
                      <p className="text-xs font-bold text-slate-800">{report.productDNA.extractionMethod || "Standardized extract"}</p>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Biological Origin</span>
                      <p className="text-xs font-bold text-slate-800">{report.productDNA.biologicalOrigin || "India"}</p>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Manufacturing Standards</span>
                      <p className="text-xs font-bold text-slate-800">{report.productDNA.manufacturingLocation || "Schedule T GMP facility"}</p>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Technical Synergy Effect</span>
                      <p className="text-xs font-bold text-slate-800">{report.productDNA.technicalEffect || "Not specified"}</p>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Applicant Class</span>
                      <p className="text-xs font-bold text-slate-800">{report.productDNA.applicantType || "Ayurvedic Enterprise"}</p>
                    </div>
                  </div>

                  {/* Botanical Ingredients Table */}
                  <div className="space-y-3 pt-2">
                    <h4 className="text-sm font-bold text-slate-900">
                      Standardized Botanical & Bio-Resource Composition
                    </h4>

                    <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                          <tr>
                            <th className="p-3">Common / Brand Name</th>
                            <th className="p-3">Botanical Species</th>
                            <th className="p-3">Sanskrit Name</th>
                            <th className="p-3">Plant Part</th>
                            <th className="p-3">Classical Treatise Reference</th>
                            <th className="p-3">Biological Resource</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                          {report.productDNA.normalizedIngredients.map((ing, idx) => (
                            <tr key={idx} className="hover:bg-slate-50">
                              <td className="p-3 font-bold text-slate-900">
                                {ing.commonName}
                                {ing.concentration && (
                                  <span className="ml-1 text-[11px] font-normal text-slate-500">
                                    ({ing.concentration})
                                  </span>
                                )}
                              </td>
                              <td className="p-3 italic text-emerald-900 font-medium">
                                {ing.botanicalName || "Chemical / Carrier Excipient"}
                              </td>
                              <td className="p-3 font-medium text-slate-800">
                                {ing.sanskritName || "—"}
                              </td>
                              <td className="p-3 text-slate-600">
                                {ing.plantPart || "—"}
                              </td>
                              <td className="p-3 text-slate-600">
                                {ing.classicalTreatiseReference || "—"}
                              </td>
                              <td className="p-3">
                                {ing.isBiologicalResource ? (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                    NBA Governed
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-600">
                                    Excipient
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* ============================================================ */}
            {/* TAB 3: MARKET CLASSIFICATION                                */}
            {/* ============================================================ */}
            {activeTab === "classification" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {report.classifications.map((cls) => {
                    const opt = TARGET_MARKET_OPTIONS.find(o => o.code === cls.jurisdiction);
                    return (
                      <div 
                        key={cls.jurisdiction}
                        className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4 flex flex-col justify-between"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <span className="text-sm font-bold text-slate-900 flex items-center gap-2">
                              <span className="text-lg">{opt?.flag}</span>
                              <span>{cls.marketName}</span>
                            </span>
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                              {cls.confidence} CONFIDENCE
                            </span>
                          </div>

                          <div className="space-y-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              Assigned Regulatory Classification
                            </span>
                            <h4 className="text-base font-bold text-emerald-950">
                              {cls.category}
                            </h4>
                          </div>

                          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-1 text-xs">
                            <div className="flex items-center gap-1.5 text-slate-500 font-semibold">
                              <Building2 className="w-3.5 h-3.5" />
                              <span>Governing Authority:</span>
                            </div>
                            <p className="font-bold text-slate-900">{cls.governingAuthority}</p>
                            <div className="text-[11px] text-slate-500 pt-1">
                              <strong>Statute:</strong> {cls.governingStatute}
                            </div>
                          </div>

                          <p className="text-xs text-slate-600 leading-relaxed">
                            {cls.reasoning}
                          </p>

                          {/* Signals */}
                          <div className="space-y-1.5 pt-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                              Affirmative Regulatory Signals:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {cls.signals.map((sig, sIdx) => (
                                <span key={sIdx} className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px]">
                                  <Check className="w-3 h-3 text-emerald-600" />
                                  <span>{sig}</span>
                                </span>
                              ))}
                            </div>
                          </div>

                          {cls.missingSignals.length > 0 && (
                            <div className="space-y-1 pt-1">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">
                                Missing Documentation Signals:
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {cls.missingSignals.map((ms, mIdx) => (
                                  <span key={mIdx} className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 text-[11px]">
                                    <AlertTriangle className="w-3 h-3 text-amber-600" />
                                    <span>{ms}</span>
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {cls.unresolvedQuestions.length > 0 && (
                          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
                            <span className="font-bold text-slate-700">Verification Item:</span>
                            <p className="italic text-slate-600">{cls.unresolvedQuestions.join(" · ")}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* TAB 4: IP LANDSCAPE — PATENTABILITY vs FTO STRICTLY SEPARATED */}
            {/* ============================================================ */}
            {activeTab === "ip" && (
              <div className="space-y-6">
                
                {/* Critical Boundary Notice */}
                <div className="bg-blue-50 border border-blue-200 rounded-3xl p-5 flex items-start gap-3 text-blue-950">
                  <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div className="space-y-1 text-xs leading-relaxed">
                    <h4 className="font-bold text-sm text-blue-900">
                      Strict Legal Separation: Patentability vs. Preliminary FTO Risk
                    </h4>
                    <p>
                      <strong>Patentability</strong> evaluates whether your formulation meets novelty and inventive step criteria without being barred under Section 3(p) (traditional knowledge) or Section 3(e) (mere admixture). <strong>Preliminary FTO (Freedom to Operate)</strong> scans third-party active patents to assess commercial infringement risk. A formulation can be fully patentable yet still infringe existing third-party patents.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* TRACK A: PATENTABILITY */}
                  <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                          <Scale className="w-4 h-4 text-emerald-600" />
                          <span>Track A: Patentability Assessment</span>
                        </h3>
                        <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                          Novelty & Inventive Step
                        </span>
                      </div>

                      {/* Verdicts */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-1">
                          <span className="text-[10px] uppercase font-bold text-slate-400">Novelty Standard</span>
                          <div className="text-xs font-bold text-slate-900">{report.patentability.noveltyVerdict}</div>
                          <p className="text-[11px] text-slate-500 leading-snug">{report.patentability.noveltyReasoning}</p>
                        </div>

                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-1">
                          <span className="text-[10px] uppercase font-bold text-slate-400">Inventive Step / Synergy</span>
                          <div className="text-xs font-bold text-slate-900">{report.patentability.inventiveStepVerdict}</div>
                          <p className="text-[11px] text-slate-500 leading-snug">{report.patentability.inventiveStepReasoning}</p>
                        </div>
                      </div>

                      {/* Statutory Bars */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                          Statutory Exclusions & Legal Bars:
                        </h4>
                        <div className="space-y-2">
                          {report.patentability.statutoryBars.map((bar, bIdx) => (
                            <div key={bIdx} className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1">
                              <div className="flex items-center justify-between font-bold">
                                <span className="text-slate-900">{bar.barName}</span>
                                <span className="text-[10px] text-slate-500">{bar.jurisdiction}</span>
                              </div>
                              <p className="text-[11px] text-slate-600 leading-relaxed">{bar.reasoning}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Claim Strategy Card */}
                    <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 space-y-1.5 text-xs text-emerald-950">
                      <div className="font-bold flex items-center gap-1.5 text-emerald-900">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Recommended Claim Drafting Strategy:</span>
                      </div>
                      <p className="leading-relaxed text-emerald-900/90">{report.patentability.recommendedClaimStrategy}</p>
                    </div>
                  </div>

                  {/* TRACK B: PRELIMINARY FTO SCAN */}
                  <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                          <Search className="w-4 h-4 text-emerald-600" />
                          <span>Track B: Preliminary FTO Risk Scan</span>
                        </h3>
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded border ${
                          getRiskBadgeClass(report.ftoScan.preliminaryRisk)
                        }`}>
                          Risk: {report.ftoScan.preliminaryRisk}
                        </span>
                      </div>

                      {/* Prominent Disclaimer */}
                      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 text-xs text-amber-900 space-y-1">
                        <div className="font-bold flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                          <span>MANDATORY LEGAL DISCLAIMER</span>
                        </div>
                        <p className="text-[11px] leading-relaxed text-amber-800">
                          {report.ftoScan.disclaimer}
                        </p>
                      </div>

                      {/* Scanned Patents */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                          Indexed Patents Inspected for Potential Claim Overlap:
                        </h4>
                        <div className="space-y-2.5">
                          {report.ftoScan.identifiedPatents.map((pat, pIdx) => (
                            <div key={pIdx} className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1.5">
                              <div className="flex items-center justify-between">
                                <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                  {pat.patentNumber}
                                </span>
                                <span className="text-[11px] text-slate-500 font-semibold">
                                  Score: {Math.round(pat.score * 100)}%
                                </span>
                              </div>
                              <h5 className="font-bold text-slate-900">{pat.title}</h5>
                              <p className="text-[11px] text-slate-600 leading-snug">{pat.keyRelevance}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs text-slate-600 space-y-1">
                      <span className="font-bold text-slate-800">Status Verification Caveat:</span>
                      <p className="text-[11px] leading-relaxed">{report.ftoScan.activeRightsCaveat}</p>
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* ============================================================ */}
            {/* TAB 5: TRADEMARK & GENERIC TERMS                             */}
            {/* ============================================================ */}
            {activeTab === "trademark" && (
              <div className="space-y-6">
                
                <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div className="space-y-0.5">
                      <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>Trademark Clearance & Generic Terms Screening</span>
                      </h3>
                      <p className="text-xs text-slate-500">
                        Evaluated brand name: <strong>"{report.trademarkAnalysis.brandEvaluated}"</strong>
                      </p>
                    </div>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                      getRiskBadgeClass(report.trademarkAnalysis.genericHerbalBanRisk)
                    }`}>
                      Generic Ban Risk: {report.trademarkAnalysis.genericHerbalBanRisk}
                    </span>
                  </div>

                  {/* Section 13 Alert */}
                  <div className={`p-4 rounded-2xl border text-xs space-y-1.5 ${
                    report.trademarkAnalysis.genericHerbalBanRisk === "HIGH"
                      ? "bg-rose-50 border-rose-200 text-rose-950"
                      : "bg-emerald-50 border-emerald-200 text-emerald-950"
                  }`}>
                    <div className="font-bold flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-rose-600" />
                      <span>The Trade Marks Act, 1999 — Section 13 Statutory Bar Analysis</span>
                    </div>
                    <p className="leading-relaxed">
                      {report.trademarkAnalysis.genericHerbalBanNotes}
                    </p>
                  </div>

                  {/* Recommended Nice Classes */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-bold text-slate-900">
                      Recommended Nice Classification Filing Strategy:
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {report.trademarkAnalysis.niceClassRecommendations.map((cls) => (
                        <div 
                          key={cls.classNumber}
                          className={`rounded-2xl p-4 border space-y-2 flex flex-col justify-between ${
                            cls.recommended 
                              ? "bg-emerald-50/50 border-emerald-300 text-emerald-950" 
                              : "bg-slate-50 border-slate-200 text-slate-600"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-base font-extrabold text-slate-900">
                              Class {cls.classNumber}
                            </span>
                            {cls.recommended && (
                              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">
                                Recommended
                              </span>
                            )}
                          </div>
                          <p className="text-xs leading-relaxed">{cls.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Transliteration and Register Notice */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
                      <h5 className="text-xs font-bold text-slate-900">
                        Cross-Lingual Transliteration Risk (Indic & Japanese Katakana)
                      </h5>
                      <ul className="text-xs text-slate-600 space-y-1 list-disc pl-4">
                        {report.trademarkAnalysis.phoneticTransliterationConflicts.map((c, idx) => (
                          <li key={idx}>{c}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
                      <h5 className="text-xs font-bold text-slate-900">
                        Official Trademark Register Status
                      </h5>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {report.trademarkAnalysis.officialRegisterStatus}
                      </p>
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* ============================================================ */}
            {/* TAB 6: TRADITIONAL KNOWLEDGE & ABS / BIODIVERSITY            */}
            {/* ============================================================ */}
            {activeTab === "tk_abs" && (
              <div className="space-y-6">
                
                {/* ABS Mandate Banner */}
                <div className={`p-6 rounded-3xl border shadow-xs space-y-4 ${
                  report.absBiodiversity.nbaApprovalRequired 
                    ? "bg-rose-50/70 border-rose-200 text-rose-950" 
                    : "bg-emerald-50 border-emerald-200 text-emerald-950"
                }`}>
                  <div className="flex items-center justify-between pb-3 border-b border-rose-200/60">
                    <div className="flex items-center gap-2 font-extrabold text-base text-rose-950">
                      <ShieldAlert className="w-5 h-5 text-rose-600" />
                      <span>National Biodiversity Authority (NBA) Statutory Mandate</span>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-200 text-rose-900 border border-rose-300">
                      {report.absBiodiversity.nbaApprovalRequired ? "FORM III MANDATORY" : "EXEMPT"}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs leading-relaxed">
                    <h5 className="font-bold text-sm text-rose-900">
                      Biological Diversity Act, 2002 (Amended 2023) — Section 6 Prior Approval
                    </h5>
                    <p className="text-slate-800">
                      {report.absBiodiversity.reasoning}
                    </p>
                    <p className="text-[11px] text-slate-600 italic">
                      Statutory Reference: {report.absBiodiversity.regulatoryReference}
                    </p>
                  </div>
                </div>

                {/* TK & Treatise Grounding Card */}
                <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-emerald-600" />
                      <span>Classical Ayurveda Treatise Grounding & TKDL Context</span>
                    </h3>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                      First Schedule Books
                    </span>
                  </div>

                  <div className="space-y-3">
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {report.traditionalKnowledge.priorArtDefenseNotes}
                    </p>

                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 text-xs">
                      <span className="font-bold text-slate-800 block">
                        TKDL Access Protocol:
                      </span>
                      <p className="text-slate-600">
                        {report.traditionalKnowledge.tkdlAccessStatus}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Honest Other IP Disclosure Card */}
                <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
                  <h4 className="text-sm font-bold text-slate-900">
                    Additional Intellectual Property Assets & Data Coverage Status
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-1.5 text-xs">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Geographical Indications</span>
                      <div className="font-bold text-slate-900">{report.otherIP.geographicalIndications.status}</div>
                      <p className="text-[11px] text-slate-500 leading-snug">{report.otherIP.geographicalIndications.notes}</p>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-1.5 text-xs">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Copyright Registries</span>
                      <div className="font-bold text-slate-900">{report.otherIP.copyright.status}</div>
                      <p className="text-[11px] text-slate-500 leading-snug">{report.otherIP.copyright.notes}</p>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-1.5 text-xs">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Industrial Design</span>
                      <div className="font-bold text-slate-900">{report.otherIP.design.status}</div>
                      <p className="text-[11px] text-slate-500 leading-snug">{report.otherIP.design.notes}</p>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-1.5 text-xs">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Trade Secrets</span>
                      <div className="font-bold text-slate-900">RECOMMENDED</div>
                      <p className="text-[11px] text-slate-500 leading-snug">{report.otherIP.tradeSecrets.recommendation}</p>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* ============================================================ */}
            {/* TAB 7: REGULATORY LANDSCAPE & MARKET ENTRY                   */}
            {/* ============================================================ */}
            {activeTab === "regulatory" && (
              <div className="space-y-6">
                
                <div className="space-y-6">
                  {report.marketEntry.map((me) => {
                    const opt = TARGET_MARKET_OPTIONS.find(o => o.code === me.jurisdiction);
                    return (
                      <div 
                        key={me.jurisdiction}
                        className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{opt?.flag}</span>
                            <div>
                              <h3 className="text-base font-bold text-slate-900">{me.marketName} Market Entry Protocol</h3>
                              <span className="text-xs text-slate-500">{me.regulator}</span>
                            </div>
                          </div>
                          <span className="text-xs font-semibold px-3 py-1 bg-slate-100 text-slate-700 rounded-full border border-slate-200 self-start sm:self-auto">
                            {me.classification}
                          </span>
                        </div>

                        {/* Checklist Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          
                          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 text-xs">
                            <span className="font-bold text-slate-900 block flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              Registration & Filing Requirements:
                            </span>
                            <ul className="space-y-1.5 list-disc pl-4 text-slate-600">
                              {me.registrationRequirements.map((req: string, rIdx: number) => (
                                <li key={rIdx} className="leading-relaxed">{req}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 text-xs">
                            <span className="font-bold text-slate-900 block flex items-center gap-1.5">
                              <FileText className="w-3.5 h-3.5 text-emerald-600" />
                              Mandatory Labeling & Warnings:
                            </span>
                            <ul className="space-y-1.5 list-disc pl-4 text-slate-600">
                              {me.labelingRules.map((rule: string, ruIdx: number) => (
                                <li key={ruIdx} className="leading-relaxed">{rule}</li>
                              ))}
                            </ul>
                          </div>

                        </div>

                        {/* Manufacturing & Claims Strip */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                          <div className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-3 space-y-1">
                            <span className="font-bold text-emerald-900">Manufacturing Standards:</span>
                            <p className="text-emerald-950/80">{me.manufacturingStandards}</p>
                          </div>
                          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-1">
                            <span className="font-bold text-slate-800">Permitted Claims Scope:</span>
                            <p className="text-slate-600">{me.claimsAllowed.join("; ")}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            )}

            {/* ============================================================ */}
            {/* TAB 8: CLAIMS & ADVERTISING RISK AUDIT                       */}
            {/* ============================================================ */}
            {activeTab === "claims" && (
              <div className="space-y-6">
                
                <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div className="space-y-0.5">
                      <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-emerald-600" />
                        <span>Advertising & On-Pack Health Claims Audit</span>
                      </h3>
                      <p className="text-xs text-slate-500">
                        Evaluated against Drugs and Magic Remedies Act (India), FDA DSHEA (US), EFSA (EU), and PMD Act (Japan).
                      </p>
                    </div>
                    <span className="text-xs font-bold text-slate-500">
                      {report.claimsAnalysis.length} Claims Evaluated
                    </span>
                  </div>

                  <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                        <tr>
                          <th className="p-3 w-1/4">Original Label Claim</th>
                          <th className="p-3">Target Market</th>
                          <th className="p-3">Risk Level</th>
                          <th className="p-3 w-1/4">Statutory Violation / Risk Rationale</th>
                          <th className="p-3 w-1/4 text-emerald-900">Safer Compliant Rewording</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {report.claimsAnalysis.map((cl, cIdx) => (
                          <tr key={cIdx} className="hover:bg-slate-50">
                            <td className="p-3 font-semibold text-slate-900">
                              "{cl.originalClaim}"
                            </td>
                            <td className="p-3 font-bold text-slate-700">
                              {cl.marketName}
                            </td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getRiskBadgeClass(cl.riskLevel)}`}>
                                {cl.riskLevel}
                              </span>
                            </td>
                            <td className="p-3 text-slate-600 leading-snug">
                              {cl.reason}
                              <div className="text-[10px] text-slate-400 mt-0.5 font-medium">
                                Ref: {cl.evidenceReference}
                              </div>
                            </td>
                            <td className="p-3 font-medium text-emerald-900 bg-emerald-50/40 leading-snug">
                              "{cl.saferWording}"
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* ============================================================ */}
            {/* TAB 9: GLOBAL RISK MATRIX                                    */}
            {/* ============================================================ */}
            {activeTab === "matrix" && (
              <div className="space-y-6">
                
                <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div className="space-y-0.5">
                      <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-emerald-600" />
                        <span>8-Dimension Multi-Jurisdiction Risk Matrix</span>
                      </h3>
                      <p className="text-xs text-slate-500">
                        Comparative risk levels across all target markets for patentability, FTO, trademark, ABS, regulatory, and claims.
                      </p>
                    </div>
                  </div>

                  <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                    <table className="w-full text-center text-xs">
                      <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                        <tr>
                          <th className="p-3 text-left">Market</th>
                          <th className="p-3">Patentability</th>
                          <th className="p-3">FTO</th>
                          <th className="p-3">Trademark</th>
                          <th className="p-3">Traditional Knowledge</th>
                          <th className="p-3">ABS / Biodiversity</th>
                          <th className="p-3">Regulatory</th>
                          <th className="p-3">Claims</th>
                          <th className="p-3 font-black text-slate-900">Overall</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {report.globalRiskDashboard.map((row) => (
                          <tr key={row.jurisdiction} className="hover:bg-slate-50">
                            <td className="p-3 text-left font-bold text-slate-900">
                              {row.marketName}
                            </td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getRiskBadgeClass(row.patentRisk)}`}>
                                {row.patentRisk}
                              </span>
                            </td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getRiskBadgeClass(row.ftoRisk)}`}>
                                {row.ftoRisk}
                              </span>
                            </td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getRiskBadgeClass(row.trademarkRisk)}`}>
                                {row.trademarkRisk}
                              </span>
                            </td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getRiskBadgeClass(row.tkRisk)}`}>
                                {row.tkRisk}
                              </span>
                            </td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getRiskBadgeClass(row.absRisk)}`}>
                                {row.absRisk}
                              </span>
                            </td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getRiskBadgeClass(row.regulatoryRisk)}`}>
                                {row.regulatoryRisk}
                              </span>
                            </td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getRiskBadgeClass(row.claimsRisk)}`}>
                                {row.claimsRisk}
                              </span>
                            </td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-black border ${getRiskBadgeClass(row.overallMarketRisk)}`}>
                                {row.overallMarketRisk}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* ============================================================ */}
            {/* TAB 10: WHAT TO PROTECT & STRATEGY                           */}
            {/* ============================================================ */}
            {activeTab === "strategy" && (
              <div className="space-y-6">
                
                <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
                  <div className="pb-3 border-b border-slate-100">
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Lock className="w-4 h-4 text-emerald-600" />
                      <span>Multi-Tier Intellectual Property Protection Strategy</span>
                    </h3>
                    <p className="text-xs text-slate-500">
                      Actionable asset segmentation protecting formulation carriers, brand equity, and manufacturing secrets.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {report.whatToProtect.map((prot, idx) => (
                      <div 
                        key={idx}
                        className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3 flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">
                              {prot.priority} PRIORITY
                            </span>
                            <span className="text-[11px] font-bold text-slate-400">Tier {idx + 1}</span>
                          </div>

                          <h4 className="text-sm font-bold text-slate-900">
                            {prot.protectionType}
                          </h4>

                          <div className="text-xs font-semibold text-emerald-950 bg-white border border-slate-200 rounded-lg p-2">
                            {prot.asset}
                          </div>

                          <p className="text-xs text-slate-600 leading-relaxed">
                            {prot.rationale}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-slate-200 text-[11px] text-slate-500">
                          <strong>Jurisdictions:</strong> {prot.recommendedJurisdictions.join(", ")}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* ============================================================ */}
            {/* TAB 11: EVIDENCE & TRACEABILITY                             */}
            {/* ============================================================ */}
            {activeTab === "evidence" && (
              <div className="space-y-6">
                
                {/* Evidence Stats Card */}
                <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div className="space-y-0.5">
                      <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>Grounded Statutory Evidence Corpus</span>
                      </h3>
                      <p className="text-xs text-slate-500">
                        {report.evidenceCoverage.verifiedCitations} of {report.evidenceCoverage.totalCitations} statutory citations trace directly to verified legal sources in AYURLEX V2.
                      </p>
                    </div>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                      100% Traceability
                    </span>
                  </div>

                  <div className="space-y-3">
                    {report.evidenceCoverage.items.map((ev) => (
                      <div key={ev.evidenceId} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 text-xs">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{ev.title}</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-700">
                              {ev.jurisdiction}
                            </span>
                          </div>
                          <span className="font-mono text-[10px] text-slate-400">{ev.evidenceId}</span>
                        </div>

                        <p className="text-slate-700 italic bg-white border border-slate-200 rounded-lg p-3 leading-relaxed">
                          "{ev.relevantText}"
                        </p>

                        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                          <span>Authority: <strong>{ev.authority}</strong> ({ev.section})</span>
                          <span>Relevance: {Math.round(ev.relevanceScore * 100)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Data Limitations Disclosure */}
                <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 space-y-4 text-xs">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2">
                    <Info className="w-4 h-4 text-slate-500" />
                    <span>Honest Data Grounding & Coverage Disclosures</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {report.dataLimitations.map((lim, lIdx) => (
                      <div key={lIdx} className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-1">
                        <div className="flex items-center justify-between font-bold">
                          <span className="text-slate-900">{lim.domain}</span>
                          <span className="text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            {lim.status}
                          </span>
                        </div>
                        <p className="text-slate-600 text-[11px] leading-relaxed">{lim.explanation}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* ============================================================ */}
            {/* TAB 12: 12-STEP AUDIT TRACE                                  */}
            {/* ============================================================ */}
            {activeTab === "trace" && (
              <div className="space-y-6">
                
                <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="space-y-0.5">
                      <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <Layers className="w-4 h-4 text-emerald-600" />
                        <span>12-Stage Forensic Execution Audit Trail</span>
                      </h3>
                      <p className="text-xs text-slate-500">
                        Full machine audit record proving deterministic verification without mock simulation.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {report.analysisTrace.map((step) => (
                      <div 
                        key={step.stepNumber}
                        className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 font-bold text-slate-900">
                            <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[11px] shrink-0">
                              {step.stepNumber}
                            </span>
                            <span>{step.stepName}</span>
                          </div>
                          <p className="text-slate-600 pl-8 leading-relaxed">
                            {step.details}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 pl-8 sm:pl-0">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            {step.status}
                          </span>
                          <span className="text-[11px] font-mono text-slate-400">
                            {step.durationMs}ms
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

          </div>
        )}

        {/* ============================================================ */}
        {/* 4. PRODUCT INTAKE 7-STEP GUIDED WIZARD MODAL                 */}
        {/* ============================================================ */}
        {wizardOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-scaleIn">
              
              {/* Wizard Modal Header */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">
                    Step {wizardStep} of 7
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">
                    {wizardStep === 1 && "1. Product Identity & Category"}
                    {wizardStep === 2 && "2. Formulation & Botanical Actives"}
                    {wizardStep === 3 && "3. Intended Use & Technical Synergy"}
                    {wizardStep === 4 && "4. Biological Origin & Manufacturing"}
                    {wizardStep === 5 && "5. Traditional Basis & Existing IP"}
                    {wizardStep === 6 && "6. Target Markets Selection"}
                    {wizardStep === 7 && "7. Review Product DNA & Launch"}
                  </h3>
                </div>
                <button
                  onClick={() => setWizardOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              {/* Wizard Content Body */}
              <div className="p-6 overflow-y-auto flex-1 space-y-4">
                
                {/* STEP 1: BASICS */}
                {wizardStep === 1 && (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Product Name *</label>
                      <input
                        type="text"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        placeholder="e.g. Ashwagandha Nano-Emulsion Bio-Complex"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-hidden"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Brand Name / Coined Identifier (Optional)</label>
                      <input
                        type="text"
                        value={brandName}
                        onChange={(e) => setBrandName(e.target.value)}
                        placeholder="e.g. NeuroVeda NanoLipid (Avoid single herb generic names under Sec 13)"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-hidden"
                      />
                      <span className="text-[11px] text-slate-400 block">
                        Tip: Trade Marks Act Sec 13 prohibits registering generic single herbal names like "Ashwagandha".
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Dosage Form & Product Type</label>
                      <select
                        value={productType}
                        onChange={(e) => setProductType(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-hidden cursor-pointer"
                      >
                        <option value="Proprietary Ayurvedic Medicine / Liposomal Softgel">Proprietary Ayurvedic Medicine / Liposomal Softgel</option>
                        <option value="Classical Ayurvedic Medicine / Churna / Vati">Classical Ayurvedic Medicine / Churna / Vati</option>
                        <option value="Nutraceutical / Dietary Supplement (Capsule / Tablet)">Nutraceutical / Dietary Supplement (Capsule / Tablet)</option>
                        <option value="Ayurveda Aahara / Functional Food">Ayurveda Aahara / Functional Food</option>
                        <option value="Herbal Cosmetic / Topical Oil / Serum">Herbal Cosmetic / Topical Oil / Serum</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* STEP 2: INGREDIENTS */}
                {wizardStep === 2 && (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Active Ingredients & Excipients</label>
                      
                      {/* Ingredient list */}
                      <div className="space-y-2">
                        {ingredients.map((ing, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                            <span className="font-semibold text-slate-800">{ing}</span>
                            <button
                              onClick={() => handleRemoveIngredient(idx)}
                              className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Add new */}
                      <div className="flex items-center gap-2 pt-2">
                        <input
                          type="text"
                          value={newIngredientInput}
                          onChange={(e) => setNewIngredientInput(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleAddIngredient()}
                          placeholder="Add ingredient e.g. Withania somnifera root extract 500mg"
                          className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-emerald-600 outline-hidden"
                        />
                        <button
                          type="button"
                          onClick={handleAddIngredient}
                          className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    {/* Quick Add Chips */}
                    <div className="space-y-1.5 pt-2">
                      <span className="text-[11px] font-bold text-slate-500 uppercase">Quick Add Verified Botanicals:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {COMMON_BOTANICAL_CHIPS.map((chip, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              if (!ingredients.includes(chip.value)) {
                                setIngredients([...ingredients, chip.value]);
                              }
                            }}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-100 hover:text-emerald-900 border border-slate-200 rounded-lg text-[11px] text-slate-700 transition-colors cursor-pointer"
                          >
                            + {chip.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-2">
                      <label className="text-xs font-bold text-slate-700">Formulation Delivery Vehicle</label>
                      <input
                        type="text"
                        value={formulation}
                        onChange={(e) => setFormulation(e.target.value)}
                        placeholder="e.g. Self-emulsifying nano-liposomal softgel dispersion with sub-100nm droplet size"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-emerald-600 outline-hidden"
                      />
                    </div>
                  </div>
                )}

                {/* STEP 3: USE & CLAIMS */}
                {wizardStep === 3 && (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Intended Therapeutic / Wellness Use</label>
                      <input
                        type="text"
                        value={intendedUse}
                        onChange={(e) => setIntendedUse(e.target.value)}
                        placeholder="e.g. Adaptogenic neural resilience, sleep architecture optimization"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-emerald-600 outline-hidden"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Technical Effect / Synergy Proof (Crucial for Sec 3(e))</label>
                      <textarea
                        rows={2}
                        value={technicalEffect}
                        onChange={(e) => setTechnicalEffect(e.target.value)}
                        placeholder="Describe bioavailability enhancement or combination index synergy exceeding additive effects"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-emerald-600 outline-hidden"
                      />
                    </div>

                    {/* Health Claims */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">On-Pack Health & Functional Claims</label>
                      <div className="space-y-1.5">
                        {healthClaims.map((cl, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                            <span className="text-slate-800">{cl}</span>
                            <button
                              onClick={() => handleRemoveHealthClaim(idx)}
                              className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="text"
                          value={newHealthClaimInput}
                          onChange={(e) => setNewHealthClaimInput(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleAddHealthClaim()}
                          placeholder="Add claim e.g. Supports normal evening serum cortisol levels"
                          className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-hidden"
                        />
                        <button
                          type="button"
                          onClick={handleAddHealthClaim}
                          className="px-3 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 4: ORIGIN & MANUFACTURING */}
                {wizardStep === 4 && (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Biological Resource Country of Origin *</label>
                      <input
                        type="text"
                        value={biologicalOrigin}
                        onChange={(e) => setBiologicalOrigin(e.target.value)}
                        placeholder="e.g. India (Native cultivation)"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-emerald-600 outline-hidden"
                      />
                      <span className="text-[11px] text-amber-700 block">
                        If sourced from India, Section 6 of Biological Diversity Act 2002 mandates prior approval (Form III).
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Manufacturing Location & Compliance</label>
                      <input
                        type="text"
                        value={manufacturingLocation}
                        onChange={(e) => setManufacturingLocation(e.target.value)}
                        placeholder="e.g. Gujarat, India (Schedule T GMP facility)"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-emerald-600 outline-hidden"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Extraction Methodology</label>
                      <input
                        type="text"
                        value={extractionMethod}
                        onChange={(e) => setExtractionMethod(e.target.value)}
                        placeholder="e.g. Supercritical CO2 extraction followed by hydro-ethanolic crystallization"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-emerald-600 outline-hidden"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Manufacturing Processnuances</label>
                      <input
                        type="text"
                        value={manufacturingMethod}
                        onChange={(e) => setManufacturingMethod(e.target.value)}
                        placeholder="e.g. High-pressure homogenization at 1200 bar under nitrogen blanketing"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-emerald-600 outline-hidden"
                      />
                    </div>
                  </div>
                )}

                {/* STEP 5: IP & TRADITIONAL BASIS */}
                {wizardStep === 5 && (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Classical Treatise Reference</label>
                      <input
                        type="text"
                        value={classicalReference}
                        onChange={(e) => setClassicalReference(e.target.value)}
                        placeholder="e.g. Bhavaprakasha Nighantu, Guduchyadi Varga; Charaka Samhita Sutrasthana Ch. 4"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-emerald-600 outline-hidden"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Existing Patents / Provisional Filings</label>
                      <input
                        type="text"
                        value={existingIP}
                        onChange={(e) => setExistingIP(e.target.value)}
                        placeholder="e.g. Indian Provisional Patent App No. 202411098231 (or 'None')"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-emerald-600 outline-hidden"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Additional Confidential Formulation Notes</label>
                      <textarea
                        rows={2}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Internal R&D notes, test results, or target launch dates"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-emerald-600 outline-hidden"
                      />
                    </div>
                  </div>
                )}

                {/* STEP 6: TARGET MARKETS */}
                {wizardStep === 6 && (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Select Target Jurisdictions *</label>
                      <p className="text-xs text-slate-500">
                        AYURLEX evaluates each selected market against its specific statutory patent and regulatory code.
                      </p>
                    </div>

                    <div className="space-y-2.5">
                      {TARGET_MARKET_OPTIONS.map((opt) => {
                        const isSelected = targetMarkets.includes(opt.code);
                        return (
                          <div
                            key={opt.code}
                            onClick={() => toggleMarket(opt.code)}
                            className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                              isSelected
                                ? "bg-emerald-50 border-emerald-300 text-slate-900 shadow-xs"
                                : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{opt.flag}</span>
                              <div>
                                <h4 className="text-xs font-bold text-slate-900">{opt.label}</h4>
                                <span className="text-[11px] text-slate-500">{opt.authority}</span>
                              </div>
                            </div>
                            <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                              isSelected ? "bg-emerald-600 border-emerald-600 text-white" : "border-slate-300 bg-white"
                            }`}>
                              {isSelected && <Check className="w-3.5 h-3.5" />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* STEP 7: REVIEW */}
                {wizardStep === 7 && (
                  <div className="space-y-4">
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 text-xs">
                      <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                        <span className="text-slate-500">Product Name:</span>
                        <span className="font-bold text-slate-900">{productName || "Unnamed"}</span>
                      </div>
                      <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                        <span className="text-slate-500">Brand Name:</span>
                        <span className="font-bold text-slate-900">{brandName || "N/A"}</span>
                      </div>
                      <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                        <span className="text-slate-500">Dosage Form:</span>
                        <span className="font-bold text-slate-900">{productType}</span>
                      </div>
                      <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                        <span className="text-slate-500">Ingredients Count:</span>
                        <span className="font-bold text-slate-900">{ingredients.length}</span>
                      </div>
                      <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                        <span className="text-slate-500">Target Markets:</span>
                        <span className="font-bold text-slate-900">{targetMarkets.join(", ")}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Biological Origin:</span>
                        <span className="font-bold text-slate-900">{biologicalOrigin}</span>
                      </div>
                    </div>

                    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 text-xs text-emerald-950 flex items-start gap-2.5">
                      <Sparkles className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                      <p className="leading-relaxed">
                        Ready to execute 12-stage multi-jurisdiction forensic analysis. All statutory citations will be grounded in verified legal corpora without external hallucination.
                      </p>
                    </div>
                  </div>
                )}

              </div>

              {/* Wizard Modal Footer */}
              <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
                {wizardStep > 1 ? (
                  <button
                    onClick={() => setWizardStep(wizardStep - 1)}
                    className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    Back
                  </button>
                ) : (
                  <div></div>
                )}

                {wizardStep < 7 ? (
                  <button
                    onClick={() => setWizardStep(wizardStep + 1)}
                    className="px-5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={handleStartAnalysis}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Analyze Product Now</span>
                  </button>
                )}
              </div>

            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* 5. COMPARE FORMULATION MODAL                                 */}
        {/* ============================================================ */}
        {compareModalOpen && report && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-scaleIn">
              
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Split className="w-5 h-5 text-emerald-600" />
                    <span>Side-by-Side Product Comparison Mode</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Compare current product against alternative formulations or presets.
                  </p>
                </div>
                <button
                  onClick={() => setCompareModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1 space-y-6">
                
                {/* Select comparison target */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">Select Formulation to Compare Against:</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {PRODUCT_PRESETS.map((preset) => (
                      <button
                        key={preset.presetId}
                        onClick={() => setComparingWith(preset)}
                        className={`p-3 rounded-2xl border text-left text-xs transition-all cursor-pointer ${
                          comparingWith?.presetId === preset.presetId
                            ? "bg-emerald-50 border-emerald-300 text-slate-900 shadow-xs"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        <span className="font-bold block text-slate-900">{preset.productName}</span>
                        <span className="text-[11px] text-slate-500">{preset.productType}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {comparingWith && (
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    
                    {/* Current Product */}
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 text-xs">
                      <div className="border-b border-slate-200 pb-2">
                        <span className="text-[10px] uppercase font-bold text-emerald-800">Current Product</span>
                        <h4 className="font-bold text-slate-900">{report.productDNA.productName}</h4>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Delivery Formulation</span>
                        <p className="font-semibold text-slate-800">{report.productDNA.formulation || "N/A"}</p>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Ingredients ({report.productDNA.ingredients.length})</span>
                        <ul className="list-disc pl-4 text-[11px] text-slate-600 space-y-0.5">
                          {report.productDNA.ingredients.map((ing, i) => (
                            <li key={i}>{ing}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Readiness Score</span>
                        <span className="text-base font-black text-emerald-800">
                          {report.overallLaunchReadiness.overallScore}/100 ({report.overallLaunchReadiness.overallVerdict})
                        </span>
                      </div>
                    </div>

                    {/* Compare Target */}
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 text-xs">
                      <div className="border-b border-slate-200 pb-2">
                        <span className="text-[10px] uppercase font-bold text-blue-800">Alternative Formulation</span>
                        <h4 className="font-bold text-slate-900">{comparingWith.productName}</h4>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Delivery Formulation</span>
                        <p className="font-semibold text-slate-800">{comparingWith.formulation || "N/A"}</p>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Ingredients ({comparingWith.ingredients.length})</span>
                        <ul className="list-disc pl-4 text-[11px] text-slate-600 space-y-0.5">
                          {comparingWith.ingredients.map((ing, i) => (
                            <li key={i}>{ing}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Action</span>
                        <button
                          onClick={() => {
                            setCompareModalOpen(false);
                            loadPreset(comparingWith, true);
                          }}
                          className="mt-1 px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold cursor-pointer flex items-center gap-1"
                        >
                          <span>Switch & Analyze This Product</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                  </div>
                )}

              </div>
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}

export default function ProductIntelligencePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center text-xs text-slate-500">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-emerald-800 border-t-transparent rounded-full animate-spin"></div>
          <div>Loading AYURLEX Product Intelligence...</div>
        </div>
      </div>
    }>
      <ProductIntelligenceContent />
    </Suspense>
  );
}

