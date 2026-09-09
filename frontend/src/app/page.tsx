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

const EXAMPLE_QUESTIONS = [
  { label: "US Patent Novelty", query: "Can I patent this herbal formulation in the US?", type: "patentability" },
  { label: "Japan Export Clearance", query: "Can I sell this product in Japan?", type: "market_entry" },
  { label: "Traditional Prior Art", query: "Is this formulation already known in classical texts?", type: "traditional_knowledge" },
  { label: "Regulatory Standards", query: "What regulatory requirements apply to export herbal dietary supplements?", type: "regulatory" },
];

const PRIMARY_ACTIONS = [
  {
    title: "Patentability",
    desc: "Determine whether a formulation or invention may qualify for patent protection.",
    icon: FileText,
    type: "patentability",
    href: "/analyze?type=patentability",
  },
  {
    title: "Market Entry",
    desc: "Understand whether and how a product can be sold in another country.",
    icon: Globe,
    type: "market_entry",
    href: "/analyze?type=market_entry",
  },
  {
    title: "Traditional Knowledge",
    desc: "Check traditional-use and prior-art considerations to avoid rejection.",
    icon: BookOpen,
    type: "traditional_knowledge",
    href: "/analyze?type=traditional_knowledge",
  },
  {
    title: "Regulatory Check",
    desc: "Identify applicable regulatory standards, DSHEA, and food/drug rules.",
    icon: Scale,
    type: "regulatory",
    href: "/analyze?type=regulatory",
  },
];

const PILLARS = [
  {
    title: "Evidence Grounded",
    desc: "Every conclusion cites official statutory provisions and active patent claims with zero hallucination.",
  },
  {
    title: "Jurisdiction Aware",
    desc: "Evaluates strict territorial laws across US, India, Japan, EU, and WIPO without legal cross-contamination.",
  },
  {
    title: "Official Sources",
    desc: "Direct integration with USPTO, InPASS, JPO, EPO, and CSIR-TKDL legal databases.",
  },
  {
    title: "Explainable Decisions",
    desc: "Deterministic rule engine guarantees transparent, reproducible legal reasoning.",
  },
];

export default function HomePage() {
  const router = useRouter();
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

  const handleExampleClick = (query: string, type: string) => {
    router.push(`/analyze?q=${encodeURIComponent(query)}&type=${type}&market=${market}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      <Navbar />

      <main className="flex-1">
        
        {/* 1. HERO SECTION */}
        <section className="pt-16 pb-14 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Powered IP & Regulatory Intelligence</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Know whether your Ayurvedic product <br className="hidden sm:inline" />
            can be patented, protected, and sold.
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            AI-powered intellectual property and regulatory intelligence grounded in verified legal and regulatory sources.
          </p>

          {/* PRIMARY INTERACTION BOX */}
          <div className="pt-4 max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-7 text-left space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">What do you want to know?</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Ask about patents, trademarks, export rules, regulatory requirements, or traditional knowledge.
                </p>
              </div>

              <form onSubmit={handleSearchSubmit} className="space-y-3">
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Ask AYURLEX anything..."
                    className="w-full text-sm text-slate-900 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-600/10 transition-all placeholder:text-slate-400 pr-28"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Analyze</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>

              {/* 4 Concise Example Questions */}
              <div className="pt-2 border-t border-slate-100">
                <div className="text-[11px] font-medium text-slate-400 mb-2">Try asking:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {EXAMPLE_QUESTIONS.map((ex, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleExampleClick(ex.query, ex.type)}
                      className="w-full text-left p-2 rounded-lg bg-slate-50 hover:bg-emerald-50/60 border border-slate-100 hover:border-emerald-200 text-xs text-slate-700 transition-colors flex items-center justify-between group cursor-pointer"
                    >
                      <span className="truncate pr-2">• {ex.query}</span>
                      <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-emerald-700 shrink-0 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </section>

        {/* 2. PRIMARY ACTIONS SECTION (4 Compact Cards) */}
        <section className="py-12 bg-white border-y border-slate-200/80">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                What can AYURLEX help with?
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Authoritative legal & regulatory pathways for herbal formulations.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {PRIMARY_ACTIONS.map((action, idx) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={idx}
                    href={action.href}
                    className="p-5 rounded-xl border border-slate-200 bg-[#f8fafc]/50 hover:bg-white hover:border-slate-300 hover:shadow-sm transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center mb-3 group-hover:bg-emerald-800 group-hover:text-white transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 mb-1">
                        {action.title}
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {action.desc}
                      </p>
                    </div>

                    <div className="pt-4 flex items-center text-xs font-semibold text-emerald-800 group-hover:text-emerald-900 gap-1">
                      <span>Explore</span>
                      <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* 3. WHY AYURLEX? SECTION */}
        <section className="py-14 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Why AYURLEX?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Designed specifically for Ayurvedic innovators, researchers, and global exporters.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {PILLARS.map((pillar, idx) => (
              <div key={idx} className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1.5">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{pillar.title}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pl-6">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
