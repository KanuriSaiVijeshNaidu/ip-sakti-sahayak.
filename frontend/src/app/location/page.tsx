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
import { JurisdictionType, LanguageCode } from "@/types";
import { getTranslation } from "@/lib/i18n";

const MARKET_METADATA: { code: JurisdictionType; flag: string }[] = [
  { code: "US", flag: "🇺🇸" },
  { code: "JP", flag: "🇯🇵" },
  { code: "EU", flag: "🇪🇺" },
  { code: "WO", flag: "🌐" },
  { code: "IN", flag: "🇮🇳" },
];

export default function LocationPage() {
  const router = useRouter();
  const [selectedMarket, setSelectedMarket] = useState<JurisdictionType>("US");
  const [confirmedMarket, setConfirmedMarket] = useState<JurisdictionType>("US");
  const [language, setLanguage] = useState<LanguageCode>("en");

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem("ayurlex_language") as LanguageCode;
      if (savedLang && ["en", "te", "hi", "ja", "ta", "kn", "ml"].includes(savedLang)) {
        setLanguage(savedLang);
      } else {
        setLanguage("en");
      }

      const saved = localStorage.getItem("ayurlex_jurisdiction") as JurisdictionType;
      if (saved && ["US", "JP", "EU", "WO", "IN"].includes(saved)) {
        setSelectedMarket(saved);
        setConfirmedMarket(saved);
      }
    } catch {}
  }, []);

  const t = getTranslation(language);

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

  const currentMarketDetails = t.locationPage.markets[confirmedMarket] || t.locationPage.markets.US;
  const currentMarketFlag = MARKET_METADATA.find((m) => m.code === confirmedMarket)?.flag || "🇺🇸";

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
              <span>{t.title}</span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                PRO
              </span>
            </h1>
            <p className="text-[10px] text-zinc-400 hidden sm:block">{t.subtitle}</p>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/profile"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-300 bg-zinc-900 hover:bg-zinc-800 rounded-xl border border-zinc-800 transition-all"
          >
            <PersonBadgeFill className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden sm:inline">{t.nav.profile}</span>
          </Link>

          <Link
            href="/"
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-black bg-white hover:bg-zinc-200 rounded-xl transition-all shadow-md"
          >
            <HouseDoorFill className="w-3.5 h-3.5 text-black" />
            <span>{t.locationPage.backToChat}</span>
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
              <span>{t.tagline}</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">
              {t.locationPage.title}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-2 leading-relaxed">
              {t.locationPage.subtitle}
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-zinc-300">
              <span className="text-zinc-500 font-mono">{t.locationPage.currentActiveMarket}:</span>
              <span className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-700 font-bold text-white flex items-center gap-1.5">
                <span>{currentMarketFlag}</span>
                <span>{currentMarketDetails?.country}</span>
              </span>
            </div>

            <button
              onClick={() => router.push("/")}
              className="px-4 py-1.5 text-xs font-bold text-black bg-white hover:bg-zinc-200 rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer ml-auto"
            >
              <span>{t.locationPage.backToChat}</span>
              <ArrowRightCircleFill className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Vertical Market Cards List (Mobile-Optimized Vertical Stacking) */}
        <div className="flex flex-col gap-4">
          {/* Production Jurisdictions Header */}
          <div className="flex items-center gap-2 pt-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Active Production Retrieval Jurisdictions (US · JP · EP · WO)
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
              Live Corpus
            </span>
          </div>

          {MARKET_METADATA.filter((meta) => meta.code !== "IN").map((meta) => {
            const m = t.locationPage.markets[meta.code];
            if (!m) return null;
            const isSelected = selectedMarket === meta.code;

            return (
              <div
                key={meta.code}
                onClick={() => handleSelectMarket(meta.code)}
                className={`w-full p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left ${
                  isSelected
                    ? "bg-zinc-900/90 border-white shadow-xl ring-1 ring-white/30"
                    : "bg-zinc-950/70 border-zinc-800/80 hover:border-zinc-600 hover:bg-zinc-900/40"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-2xl sm:text-3xl shrink-0 shadow-inner">
                    {meta.flag}
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
                          <CheckCircleFill className="w-3 h-3" /> {t.locationPage.activeBadge}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-zinc-300 leading-snug">
                      {m.tagline}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1.5">
                      {m.statutes?.map((s, idx) => (
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
                      handleConfirmAndGo(meta.code);
                    }}
                    className={`w-full sm:w-36 py-2 px-3 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? "bg-white text-black hover:bg-zinc-200"
                        : "bg-zinc-800 text-zinc-200 hover:bg-zinc-700 border border-zinc-700"
                    }`}
                  >
                    <span>{isSelected ? t.locationPage.activeBadge : t.locationPage.setActiveButton}</span>
                    <ArrowRightCircleFill className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}

          {/* Evaluation-Only India Section */}
          <div className="flex items-center gap-2 pt-4">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Evaluation & Statutory Benchmark (Evaluation-Only)
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">
              Non-Production
            </span>
          </div>

          {MARKET_METADATA.filter((meta) => meta.code === "IN").map((meta) => {
            const m = t.locationPage.markets[meta.code];
            if (!m) return null;
            const isSelected = selectedMarket === meta.code;

            return (
              <div
                key={meta.code}
                onClick={() => handleSelectMarket(meta.code)}
                className={`w-full p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left ${
                  isSelected
                    ? "bg-zinc-900/90 border-amber-500 shadow-xl ring-1 ring-amber-500/30"
                    : "bg-zinc-950/70 border-zinc-800/80 hover:border-amber-600/50 hover:bg-zinc-900/40"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-2xl sm:text-3xl shrink-0 shadow-inner">
                    {meta.flag}
                  </div>

                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base sm:text-lg font-bold text-white">
                        {m.country}
                      </h3>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        EVALUATION ONLY
                      </span>
                      {isSelected && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-black shrink-0">
                          <CheckCircleFill className="w-3 h-3" /> Selected for Evaluation
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-zinc-300 leading-snug">
                      {m.tagline}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1.5">
                      {m.statutes?.map((s, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-mono text-amber-300/80 bg-black/60 border border-amber-900/40 px-2 py-0.5 rounded-md"
                        >
                          {s}
                        </span>
                      ))}
                    </div>

                    <p className="text-[11px] font-mono text-amber-400/90 pt-1">
                      {m.isolationNotice}
                    </p>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center justify-between sm:justify-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-800/80">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleConfirmAndGo(meta.code);
                    }}
                    className={`w-full sm:w-36 py-2 px-3 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? "bg-amber-400 text-black hover:bg-amber-300"
                        : "bg-zinc-800 text-zinc-200 hover:bg-zinc-700 border border-zinc-700"
                    }`}
                  >
                    <span>{isSelected ? "Evaluation Active" : "Select for Evaluation"}</span>
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
              <strong>{t.locationPage.strictIsolation}:</strong> {t.locationPage.subtitle}
            </span>
          </div>
          <Link
            href="/"
            className="w-full sm:w-auto text-center px-4 py-2 bg-white hover:bg-zinc-200 text-black font-bold rounded-xl transition-all shadow-sm shrink-0"
          >
            {t.locationPage.backToChat}
          </Link>
        </div>
      </main>
    </div>
  );
}
