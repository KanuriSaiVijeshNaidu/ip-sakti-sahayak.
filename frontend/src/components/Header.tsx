"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldShaded,
  HouseDoorFill,
  ClockHistory,
  PersonBadgeFill,
  KeyFill,
  Globe2,
  List,
  XLg,
  LayersFill,
} from "react-bootstrap-icons";
import { JurisdictionType, LanguageCode, UserProfile } from "@/types";
import { getTranslation } from "@/lib/i18n";
import Link from "next/link";

export interface HeaderProps {
  language?: LanguageCode;
  onLanguageChange?: (lang: LanguageCode) => void;
  jurisdiction?: JurisdictionType;
  onJurisdictionChange?: (jur: JurisdictionType) => void;
  sessionCount?: number;
  onOpenHistory?: () => void;
  onOpenCompare?: () => void;
  onOpenAuth?: () => void;
  userProfile?: UserProfile;
  onLogout?: () => void;
  onGoHome?: () => void;
}

const COUNTRIES: Record<string, { label: string; flag: string; sub: string }> = {
  US: { label: "USA", flag: "🇺🇸", sub: "USPTO / FDA" },
  JP: { label: "Japan", flag: "🇯🇵", sub: "JPO / PMDA" },
  EU: { label: "Europe", flag: "🇪🇺", sub: "EPO / EMA" },
  WO: { label: "Global", flag: "🌐", sub: "WIPO PCT" },
  IN: { label: "India", flag: "🇮🇳", sub: "Evaluation Only" },
};

const LANGUAGES: { code: LanguageCode; label: string }[] = [
  { code: "en", label: "English" },
  { code: "te", label: "తెలుగు" },
  { code: "hi", label: "हिन्दी" },
  { code: "ja", label: "日本語" },
  { code: "ta", label: "தமிழ்" },
  { code: "kn", label: "ಕನ್ನಡ" },
  { code: "ml", label: "മലയാളം" },
];

export default function Header({
  language: propLanguage,
  onLanguageChange: propOnLanguageChange,
  jurisdiction: propJurisdiction,
  sessionCount = 0,
  onOpenHistory,
  userProfile = { name: "", email: "", role: "guest", isLoggedIn: false },
  onGoHome,
}: HeaderProps) {
  const router = useRouter();
  const [internalLang, setInternalLang] = useState<LanguageCode>("en");
  const [internalJur, setInternalJur] = useState<JurisdictionType>("US");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Sync / load saved settings
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem("ip_sakti_lang") || localStorage.getItem("ayurlex_language");
      if (savedLang && ["en", "te", "hi", "ja", "ta", "kn", "ml"].includes(savedLang)) {
        setInternalLang(savedLang as LanguageCode);
      }
      const savedJur = localStorage.getItem("ayurlex_jurisdiction");
      if (savedJur && ["US", "JP", "EU", "WO", "IN"].includes(savedJur)) {
        setInternalJur(savedJur as JurisdictionType);
      }
    } catch {}
  }, []);

  const language = propLanguage || internalLang;
  const jurisdiction = propJurisdiction || internalJur;

  const handleLangChange = (newLang: LanguageCode) => {
    setInternalLang(newLang);
    try {
      localStorage.setItem("ip_sakti_lang", newLang);
      localStorage.setItem("ayurlex_language", newLang);
    } catch {}
    if (propOnLanguageChange) {
      propOnLanguageChange(newLang);
    }
  };

  const handleReturnHome = () => {
    if (onGoHome) {
      onGoHome();
    } else {
      router.push("/");
    }
    setMenuOpen(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const t = getTranslation(language);
  const activeMarket = COUNTRIES[jurisdiction] || COUNTRIES.US;

  return (
    <header className="bg-black/90 backdrop-blur-xl border-b border-zinc-800/90 sticky top-0 z-40 shadow-2xl" ref={menuRef}>
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between gap-3">
        {/* Left: Logo & Title */}
        <button
          onClick={handleReturnHome}
          className="flex items-center gap-2 sm:gap-2.5 text-left hover:opacity-90 transition-opacity select-none group cursor-pointer shrink-0"
          title="Return to AYURLEX Home"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white text-black flex items-center justify-center font-bold shadow-md group-hover:scale-105 transition-transform duration-200 shrink-0">
            <ShieldShaded className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-bold text-white leading-tight flex items-center gap-1.5">
              <span>{t.title}</span>
              <span className="text-[9px] sm:text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300 font-bold border border-zinc-700 leading-none">
                PRO
              </span>
            </h1>
            <p className="text-[10px] sm:text-[11px] text-zinc-400 leading-none mt-0.5 hidden sm:block">
              {t.subtitle} · {t.tagline}
            </p>
          </div>
        </button>

        {/* Right: ONLY Region, Language, and Three Lines Menu (☰) */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* 1. Region / Active Market (Visible on Bar) */}
          <Link
            href="/location"
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-zinc-200 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 rounded-xl transition-all shadow-sm cursor-pointer"
            title={`${t.nav.activeMarket} - ${t.nav.changeMarket}`}
          >
            <span className="text-sm">{activeMarket.flag}</span>
            <span className="font-bold text-white hidden xs:inline sm:inline">{activeMarket.label}</span>
            <span className="text-[10px] font-mono text-zinc-400 hidden md:inline">({activeMarket.sub})</span>
          </Link>

          {/* 2. Language Selector (Visible on Bar) */}
          <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 rounded-xl px-2 sm:px-2.5 py-1.5 text-xs text-zinc-300">
            <Globe2 className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            <select
              value={language}
              onChange={(e) => handleLangChange(e.target.value as LanguageCode)}
              aria-label={t.nav.selectLanguage}
              className="bg-transparent text-zinc-200 font-semibold outline-none cursor-pointer text-xs pr-1"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code} className="bg-black text-white">
                  {l.label}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Three Lines Menu Button (☰ / List Icon) containing ALL Main Pages Options */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-all border shadow-sm cursor-pointer ${
              menuOpen
                ? "bg-white text-black border-white"
                : "bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white border-zinc-800 hover:border-zinc-700"
            }`}
            aria-label="Toggle Navigation Menu"
            title="Main Pages Menu"
          >
            {menuOpen ? <XLg className="w-4 h-4" /> : <List className="w-4 h-4" />}
            <span className="hidden sm:inline font-bold">Menu</span>
          </button>
        </div>
      </div>

      {/* THREE LINES MENU (☰): ALL WEBSITE MAIN PAGES IN VERTICAL FORMAT */}
      {menuOpen && (
        <div className="bg-zinc-950/98 border-t border-zinc-800 px-4 py-4 shadow-2xl animate-in fade-in slide-in-from-top-2 backdrop-blur-2xl">
          <div className="max-w-6xl mx-auto space-y-4">
            {/* User Profile / Auth Status Bar */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/80 border border-zinc-800">
              {userProfile.isLoggedIn ? (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white text-black font-bold flex items-center justify-center text-xs">
                    {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block leading-tight">{userProfile.name}</span>
                    <span className="text-[10px] text-zinc-400 block">{userProfile.email}</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-400">Not signed in</span>
                </div>
              )}

              <div className="flex items-center gap-2">
                {userProfile.isLoggedIn ? (
                  <Link
                    href="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold border border-zinc-700"
                  >
                    {t.nav.profile} →
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-1 px-3 py-1 rounded-lg bg-white hover:bg-zinc-200 text-black text-xs font-bold shadow-sm"
                  >
                    <KeyFill className="w-3 h-3" />
                    <span>{t.nav.signIn}</span>
                  </Link>
                )}
              </div>
            </div>

            {/* Vertical Main Pages Options */}
            <div>
              <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold px-1 block mb-2">
                Website Main Pages (Vertical)
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {/* 1. Home / Chat Workspace */}
                <button
                  onClick={handleReturnHome}
                  className="w-full text-left p-3 rounded-xl bg-zinc-900/70 hover:bg-zinc-800/90 border border-zinc-800 hover:border-zinc-700 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-zinc-800 text-zinc-200 group-hover:text-white">
                      <HouseDoorFill className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">{t.nav.home}</span>
                      <span className="text-[10px] text-zinc-400 block">AI Statutory Q&A Workspace</span>
                    </div>
                  </div>
                  <span className="text-zinc-500 group-hover:text-white text-xs font-mono">→</span>
                </button>

                {/* 2. Phase 7 Decision Engine */}
                <Link
                  href="/decision"
                  onClick={() => setMenuOpen(false)}
                  className="w-full text-left p-3 rounded-xl bg-amber-950/30 hover:bg-amber-950/60 border border-amber-800/50 hover:border-amber-700 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                      ⚖️
                    </div>
                    <div>
                      <span className="text-xs font-bold text-amber-300 block">Phase 7 Decision Engine</span>
                      <span className="text-[10px] text-amber-400/70 block">Cross-Border Jurisdiction Reasoning</span>
                    </div>
                  </div>
                  <span className="text-amber-400/60 group-hover:text-amber-300 text-xs font-mono">→</span>
                </Link>

                {/* 3. Formulation Analyzer */}
                <Link
                  href="/formulation-analyzer"
                  onClick={() => setMenuOpen(false)}
                  className="w-full text-left p-3 rounded-xl bg-zinc-900/70 hover:bg-zinc-800/90 border border-zinc-800 hover:border-zinc-700 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-zinc-800 text-emerald-400">
                      🧬
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">{t.nav.formulations}</span>
                      <span className="text-[10px] text-zinc-400 block">Herbal Ingredient & Admixture Check</span>
                    </div>
                  </div>
                  <span className="text-zinc-500 group-hover:text-white text-xs font-mono">→</span>
                </Link>

                {/* 4. Patentability Assessment */}
                <Link
                  href="/patentability"
                  onClick={() => setMenuOpen(false)}
                  className="w-full text-left p-3 rounded-xl bg-zinc-900/70 hover:bg-zinc-800/90 border border-zinc-800 hover:border-zinc-700 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-zinc-800 text-cyan-400">
                      💡
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">{t.nav.patentability}</span>
                      <span className="text-[10px] text-zinc-400 block">Section 3(e)/3(p) & Statutory Bars</span>
                    </div>
                  </div>
                  <span className="text-zinc-500 group-hover:text-white text-xs font-mono">→</span>
                </Link>

                {/* 5. Traditional Knowledge (TK) Risk */}
                <Link
                  href="/tk-risk"
                  onClick={() => setMenuOpen(false)}
                  className="w-full text-left p-3 rounded-xl bg-zinc-900/70 hover:bg-zinc-800/90 border border-zinc-800 hover:border-zinc-700 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-zinc-800 text-emerald-400">
                      🌿
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">{t.nav.tkRisk}</span>
                      <span className="text-[10px] text-zinc-400 block">TKDL Prior Art & NBA Compliance</span>
                    </div>
                  </div>
                  <span className="text-zinc-500 group-hover:text-white text-xs font-mono">→</span>
                </Link>

                {/* 6. Compare Jurisdictions */}
                <Link
                  href="/compare-jurisdictions"
                  onClick={() => setMenuOpen(false)}
                  className="w-full text-left p-3 rounded-xl bg-zinc-900/70 hover:bg-zinc-800/90 border border-zinc-800 hover:border-zinc-700 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-zinc-800 text-blue-400">
                      ⚖️
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">{t.nav.compare}</span>
                      <span className="text-[10px] text-zinc-400 block">Cross-Market Statutory Comparison</span>
                    </div>
                  </div>
                  <span className="text-zinc-500 group-hover:text-white text-xs font-mono">→</span>
                </Link>

                {/* 7. Data Knowledge Base & Audit */}
                <Link
                  href="/admin"
                  onClick={() => setMenuOpen(false)}
                  className="w-full text-left p-3 rounded-xl bg-zinc-900/70 hover:bg-zinc-800/90 border border-zinc-800 hover:border-zinc-700 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-zinc-800 text-sky-400">
                      📊
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">Data Audit & Sufficiency</span>
                      <span className="text-[10px] text-zinc-400 block">Corpus Integrity & Pipeline Trace</span>
                    </div>
                  </div>
                  <span className="text-zinc-500 group-hover:text-white text-xs font-mono">→</span>
                </Link>

                {/* 8. Consultation History */}
                {onOpenHistory && (
                  <button
                    onClick={() => {
                      onOpenHistory();
                      setMenuOpen(false);
                    }}
                    className="w-full text-left p-3 rounded-xl bg-zinc-900/70 hover:bg-zinc-800/90 border border-zinc-800 hover:border-zinc-700 transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-zinc-800 text-zinc-300">
                        <ClockHistory className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white block">{t.nav.history}</span>
                          <span className="px-1.5 py-0.2 rounded-full bg-white text-black font-mono text-[9px] font-bold">
                            {sessionCount}
                          </span>
                        </div>
                        <span className="text-[10px] text-zinc-400 block">Past Saved Consultations</span>
                      </div>
                    </div>
                    <span className="text-zinc-500 group-hover:text-white text-xs font-mono">→</span>
                  </button>
                )}

                {/* 9. Change Operating Jurisdiction */}
                <Link
                  href="/location"
                  onClick={() => setMenuOpen(false)}
                  className="w-full text-left p-3 rounded-xl bg-zinc-900/70 hover:bg-zinc-800/90 border border-zinc-800 hover:border-zinc-700 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-zinc-800 text-amber-400">
                      📍
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white block">{t.nav.changeMarket}</span>
                        <span className="text-[10px] font-mono text-amber-400">({activeMarket.flag} {activeMarket.label})</span>
                      </div>
                      <span className="text-[10px] text-zinc-400 block">Switch Active Production Market</span>
                    </div>
                  </div>
                  <span className="text-zinc-500 group-hover:text-white text-xs font-mono">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
