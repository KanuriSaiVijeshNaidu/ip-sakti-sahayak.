"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldShaded,
  HouseDoorFill,
  CheckCircleFill,
  Globe2,
  ShieldCheck,
  ArrowRightCircleFill,
  PersonBadgeFill,
} from "react-bootstrap-icons";
import { JurisdictionType } from "@/types";

interface MarketOption {
  code: JurisdictionType;
  country: string;
  flag: string;
  authority: string;
  tagline: string;
  statutes: string[];
  isolationNotice: string;
}

const MARKETS: MarketOption[] = [
  {
    code: "US",
    country: "United States",
    flag: "🇺🇸",
    authority: "USPTO · FDA · Lanham Act",
    tagline: "Dietary supplements, natural product patentability bars, and US federal trademarks.",
    statutes: [
      "35 U.S.C. §§ 101, 102, 103, 112 (Alice/Mayo Framework)",
      "FDA Dietary Supplement Health and Education Act (DSHEA 1994)",
      "Lanham Act (15 U.S.C. § 1051 et seq.) Trademark Registers",
      "Prior Art Defense with TKDL Database Citations",
    ],
    isolationNotice: "STRICT ISOLATION: Answers strictly grounded in US Code and FDA CFR. Indian statutory acts strictly excluded.",
  },
  {
    code: "IN",
    country: "India (Domestic & Foreign Inbound)",
    flag: "🇮🇳",
    authority: "CGPDTM · AYUSH · FSSAI · NBA",
    tagline: "Ayurvedic formulations, Section 3(e)/3(p) patent bars, and mandatory NBA approval.",
    statutes: [
      "The Patents Act, 1970 (Section 3(e) Synergism & 3(p) TK)",
      "Drugs and Cosmetics Act, 1940 (Rule 158B Proof of Effectiveness)",
      "FSSAI Food Safety & Standards (Ayurveda Aahara) Regulations, 2022",
      "Biological Diversity Act (Section 6 Form III Prior Approval)",
    ],
    isolationNotice: "STRICT ISOLATION: Answers strictly grounded in Indian Law. Inbound foreign commercial guidance active.",
  },
  {
    code: "EU",
    country: "European Union",
    flag: "🇪🇺",
    authority: "EPO · EMA · HMPC",
    tagline: "European Patent Convention and EMA Traditional Herbal Medicinal Products.",
    statutes: [
      "EPC Articles 52, 53(c), 54(5) Novelty & Second Medical Use",
      "Problem-Solution Approach for botanical inventive step (Art. 56)",
      "EMA Traditional Herbal Medicinal Products Directive (2004/24/EC)",
      "European Community Trademark (EUIPO Nice Classes 3, 5, 30)",
    ],
    isolationNotice: "STRICT ISOLATION: Answers grounded in EPC Articles and EPO Board of Appeal case law.",
  },
  {
    code: "DE",
    country: "Germany",
    flag: "🇩🇪",
    authority: "DPMA · BfArM · Commission E",
    tagline: "German national patent law and phytopharmaceutical monograph standards.",
    statutes: [
      "German Patent Act (Patentgesetz - PatG § 1-5)",
      "Federal Institute for Drugs and Medical Devices (BfArM)",
      "German Commission E Phytotherapy Monographs",
      "DPMA national patent & utility model (Gebrauchsmuster) filings",
    ],
    isolationNotice: "STRICT ISOLATION: Answers grounded in German national jurisdiction and DPMA examination guidelines.",
  },
  {
    code: "WO",
    country: "International / Global",
    flag: "🌐",
    authority: "WIPO · PCT · Genetic Resources",
    tagline: "International patent cooperation, priority claims, and 30-month national phase entry.",
    statutes: [
      "Patent Cooperation Treaty (PCT Articles 8, 19, 33, 34)",
      "WIPO Treaty on IP, Genetic Resources & Associated TK (2024)",
      "Paris Convention for the Protection of Industrial Property (12-Mo Priority)",
      "Madrid System for the International Registration of Marks",
    ],
    isolationNotice: "STRICT ISOLATION: Answers grounded in WIPO treaties, PCT guidelines, and international filing protocols.",
  },
];

export default function LocationPage() {
  const router = useRouter();
  const [selectedMarket, setSelectedMarket] = useState<JurisdictionType>("IN");
  const [confirmedMarket, setConfirmedMarket] = useState<JurisdictionType>("IN");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("ayurlex_jurisdiction") as JurisdictionType;
      if (saved && ["US", "IN", "EU", "DE", "WO"].includes(saved)) {
        setSelectedMarket(saved);
        setConfirmedMarket(saved);
      }
    } catch {}
  }, []);

  const handleSelectMarket = (code: JurisdictionType) => {
    setSelectedMarket(code);
    setConfirmedMarket(code);
    try {
      localStorage.setItem("ayurlex_jurisdiction", code);
    } catch {}
  };

  const handleConfirmAndGo = (code: JurisdictionType) => {
    handleSelectMarket(code);
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-3 sm:p-6 relative overflow-x-hidden">
      {/* Top Navbar */}
      <header className="w-full max-w-5xl flex items-center justify-between py-3 px-4 bg-zinc-950/90 backdrop-blur-xl border border-zinc-800/90 rounded-2xl mb-6 shadow-2xl">
        <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
          <div className="w-8 h-8 rounded-xl bg-white text-black flex items-center justify-center font-bold shadow-md shrink-0">
            <ShieldShaded className="w-4 h-4 text-black" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white leading-tight flex items-center gap-1.5">
              <span>AYURLEX</span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                MARKET SELECTOR
              </span>
            </h1>
            <p className="text-[10px] text-zinc-400 hidden sm:block">Ministry of Ayush · SIH26045</p>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/profile"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-300 bg-zinc-900 hover:bg-zinc-800 rounded-xl border border-zinc-800 transition-all"
          >
            <PersonBadgeFill className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden sm:inline">User Profile</span>
          </Link>

          <Link
            href="/"
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-black bg-white hover:bg-zinc-200 rounded-xl transition-all shadow-md"
          >
            <HouseDoorFill className="w-3.5 h-3.5 text-black" />
            <span>Chat Workspace</span>
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-5xl flex flex-col gap-6">
        {/* Hero Section */}
        <div className="bg-zinc-950/90 border border-zinc-800 rounded-2xl p-5 sm:p-7 shadow-2xl relative overflow-hidden backdrop-blur-xl text-left">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-xs text-zinc-300 mb-3">
              <Globe2 className="w-3.5 h-3.5 text-white" />
              <span>Multi-Jurisdiction Regulatory Co-Pilot</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">
              Select Operating Jurisdiction & Regulatory Market
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-2 leading-relaxed">
              AYURLEX uses strict jurisdictional boundary isolation. When you choose a country, all queries, patentability checks, prior art citations, and regulatory guidelines are exclusively powered by that country's legal framework without cross-contamination.
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-zinc-300">
              <span className="text-zinc-500 font-mono">Currently Active:</span>
              <span className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-700 font-bold text-white flex items-center gap-1.5">
                <span>{MARKETS.find((m) => m.code === confirmedMarket)?.flag}</span>
                <span>{MARKETS.find((m) => m.code === confirmedMarket)?.country}</span>
              </span>
            </div>

            <button
              onClick={() => router.push("/")}
              className="px-4 py-1.5 text-xs font-bold text-black bg-white hover:bg-zinc-200 rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer ml-auto"
            >
              <span>Continue to Chat</span>
              <ArrowRightCircleFill className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Vertical Market Cards List (Mobile-Optimized Vertical Stacking) */}
        <div className="flex flex-col gap-4">
          {MARKETS.map((m) => {
            const isSelected = selectedMarket === m.code;
            return (
              <div
                key={m.code}
                onClick={() => handleSelectMarket(m.code)}
                className={`w-full p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left ${
                  isSelected
                    ? "bg-zinc-900/90 border-white shadow-xl ring-1 ring-white/30"
                    : "bg-zinc-950/70 border-zinc-800/80 hover:border-zinc-600 hover:bg-zinc-900/40"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-2xl sm:text-3xl shrink-0 shadow-inner">
                    {m.flag}
                  </div>

                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base sm:text-lg font-bold text-white">
                        {m.country}
                      </h3>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                        {m.authority}
                      </span>
                      {isSelected && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-black shrink-0">
                          <CheckCircleFill className="w-3 h-3" /> ACTIVE
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-zinc-300 leading-snug">
                      {m.tagline}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1.5">
                      {m.statutes.map((s, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-mono text-zinc-400 bg-black/60 border border-zinc-800 px-2 py-0.5 rounded-md"
                        >
                          {s}
                        </span>
                      ))}
                    </div>

                    <p className="text-[11px] font-mono text-zinc-400 pt-1">
                      {m.isolationNotice}
                    </p>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center justify-between sm:justify-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-800/80">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleConfirmAndGo(m.code);
                    }}
                    className={`w-full sm:w-36 py-2 px-3 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? "bg-white text-black hover:bg-zinc-200"
                        : "bg-zinc-800 text-zinc-200 hover:bg-zinc-700 border border-zinc-700"
                    }`}
                  >
                    <span>{isSelected ? "Active Market" : "Select Market"}</span>
                    <ArrowRightCircleFill className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Security & Boundary Compliance Badge */}
        <div className="bg-zinc-950/70 border border-zinc-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-400 mb-6 text-left">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-white shrink-0" />
            <span>
              <strong>Zero Cross-Contamination Architecture:</strong> In accordance with SIH26045 Phase 2 standards, selecting a market isolates the retrieval vector index, statutory corpus, and legal validation prompts.
            </span>
          </div>
          <Link
            href="/"
            className="w-full sm:w-auto text-center px-4 py-2 bg-white hover:bg-zinc-200 text-black font-bold rounded-xl transition-all shadow-sm shrink-0"
          >
            Launch Chat Workspace
          </Link>
        </div>
      </main>
    </div>
  );
}
