"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Search, 
  ArrowRight, 
  FileText, 
  Globe, 
  BookOpen, 
  ShieldCheck, 
  Scale, 
  CheckCircle2, 
  Check, 
  Sparkles,
  Layers,
  HelpCircle
} from "lucide-react";
import { JurisdictionType } from "@/types";
import { useLanguage } from "@/context/LanguageContext";

export default function HomePage() {
  const router = useRouter();
  const { language, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [market, setMarket] = useState<JurisdictionType>("US");

  useEffect(() => {
    try {
      const savedJur = localStorage.getItem("ayurlex_jurisdiction") as JurisdictionType;
      if (savedJur && ["US", "IN", "EU", "JP", "WO"].includes(savedJur)) {
        setMarket(savedJur);
      }
    } catch {}
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/analyze?q=${encodeURIComponent(searchQuery)}&market=${market}`);
  };

  const handlePromptClick = (promptText: string, promptMarket?: string) => {
    router.push(`/analyze?q=${encodeURIComponent(promptText)}&market=${promptMarket || market}`);
  };

  const actionCards = [
    {
      id: "patentability",
      title: t.home?.actionCards?.patentability?.title || "Patentability",
      desc: t.home?.actionCards?.patentability?.desc || "Determine whether a formulation or invention may qualify for patent protection.",
      link: t.home?.actionCards?.patentability?.link || "Check patentability",
      icon: FileText,
      href: "/analyze?type=patentability",
    },
    {
      id: "market_entry",
      title: t.home?.actionCards?.marketEntry?.title || "Market Entry",
      desc: t.home?.actionCards?.marketEntry?.desc || "Understand whether and how a product can be sold in another country.",
      link: t.home?.actionCards?.marketEntry?.link || "Analyze market entry",
      icon: Globe,
      href: "/analyze?type=market_entry",
    },
    {
      id: "traditional_knowledge",
      title: t.home?.actionCards?.traditionalKnowledge?.title || "Traditional Knowledge",
      desc: t.home?.actionCards?.traditionalKnowledge?.desc || "Check traditional-use and prior-art considerations to avoid rejection.",
      link: t.home?.actionCards?.traditionalKnowledge?.link || "Check TK risk",
      icon: BookOpen,
      href: "/analyze?type=traditional_knowledge",
    },
    {
      id: "regulatory",
      title: t.home?.actionCards?.regulatoryCheck?.title || "Regulatory Check",
      desc: t.home?.actionCards?.regulatoryCheck?.desc || "Identify applicable regulatory standards, DSHEA, and food/drug rules.",
      link: t.home?.actionCards?.regulatoryCheck?.link || "Review regulations",
      icon: Scale,
      href: "/analyze?type=regulatory",
    },
  ];

  const pillars = [
    {
      title: t.home?.pillars?.evidenceGrounded?.title || "Evidence Grounded",
      desc: t.home?.pillars?.evidenceGrounded?.desc || "Every conclusion cites official statutory provisions and active patent claims with zero hallucination.",
    },
    {
      title: t.home?.pillars?.jurisdictionAware?.title || "Jurisdiction Aware",
      desc: t.home?.pillars?.jurisdictionAware?.desc || "Evaluates strict territorial laws across US, India, Japan, EU, and WIPO without legal cross-contamination.",
    },
    {
      title: t.home?.pillars?.officialSources?.title || "Official Sources",
      desc: t.home?.pillars?.officialSources?.desc || "Direct integration with USPTO, InPASS, JPO, EPO, and CSIR-TKDL legal databases.",
    },
    {
      title: t.home?.pillars?.explainableDecisions?.title || "Explainable Decisions",
      desc: t.home?.pillars?.explainableDecisions?.desc || "Deterministic rule engine guarantees transparent, reproducible legal reasoning.",
    },
  ];

  const examples = t.home?.examples || [
    { label: "US Patent Novelty", text: "Can I patent a standardized Ashwagandha extract formulation in the United States?", market: "US" },
    { label: "Japan Export Clearance", text: "Can I sell an Ayurvedic polyherbal dietary supplement in Japan under PMD Act?", market: "JP" },
    { label: "India Sec 3(e) Bar", text: "Is a combination of Curcumin and Piperine patentable under Section 3(e) and 3(p) in India?", market: "IN" },
    { label: "EU Herbal Directive", text: "What regulatory requirements apply to export Ayurvedic herbal tea to the European Union?", market: "EU" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-800">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>SIH26045 · Ministry of Ayush · Verified Intelligence</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15] mb-5">
            {t.home?.heroTitle || "Know whether your Ayurvedic product can be patented, protected, and sold."}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            {t.home?.heroSubtitle || "AI-powered intellectual property and regulatory intelligence grounded in verified legal and regulatory sources."}
          </p>

          {/* PRIMARY INTERACTION BOX */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_4px_20px_rgba(0,0,0,0.05)] p-5 sm:p-7 text-left max-w-3xl mx-auto">
            <div className="mb-4">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                {t.home?.askCardTitle || "What do you want to know?"}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                {t.home?.askCardDesc || "Ask about patents, trademarks, export rules, regulatory requirements, or traditional knowledge."}
              </p>
            </div>

            <form onSubmit={handleSearchSubmit} className="relative flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.home?.askPlaceholder || "Ask AYURLEX anything... (e.g. Can I patent an Ashwagandha formulation in the US?)"}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-emerald-800 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
              >
                <span>{t.home?.analyzeBtn || "Analyze →"}</span>
              </button>
            </form>

            {/* EXAMPLE QUESTION PROMPT CHIPS */}
            <div className="mt-4 pt-4 border-t border-slate-100">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                {t.workspace?.sampleQuestionsLabel || "Example Queries"}
              </div>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {examples.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handlePromptClick(item.text, item.market)}
                    className="text-xs bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 border border-slate-200/80 hover:border-emerald-300 rounded-lg px-2.5 py-1.5 transition-all text-left flex items-center gap-1.5 group cursor-pointer"
                  >
                    <span className="font-medium text-slate-800 group-hover:text-emerald-900">{item.label}</span>
                    <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-emerald-700 transition-transform group-hover:translate-x-0.5" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 4 PRIMARY ACTION CARDS */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-slate-200/60">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {actionCards.map((card) => {
              const IconComponent = card.icon;
              return (
                <Link
                  key={card.id}
                  href={card.href}
                  className="group bg-white rounded-xl border border-slate-200 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:border-emerald-600 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center mb-3.5 group-hover:bg-emerald-800 group-hover:text-white transition-colors">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-900 mb-1.5 transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed mb-4">
                      {card.desc}
                    </p>
                  </div>
                  <div className="text-xs font-semibold text-emerald-800 flex items-center gap-1 group-hover:gap-1.5 transition-all pt-2 border-t border-slate-100">
                    <span>{card.link}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* WHY AYURLEX 4 PILLARS */}
        <section className="py-14 bg-white border-y border-slate-200 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">
                {t.home?.whyTitle || "Why AYURLEX?"}
              </h2>
              <p className="text-sm text-slate-500">
                {t.home?.whySubtitle || "Built specifically for Ayurvedic, herbal, and natural product innovators."}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {pillars.map((pillar, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs mb-3">
                    ✓
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1.5">
                    {pillar.title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
