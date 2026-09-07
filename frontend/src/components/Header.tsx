"use client";

import { useState } from "react";
import {
  ShieldShaded,
  HouseDoorFill,
  ClockHistory,
  PersonBadgeFill,
  KeyFill,
  Globe2,
  List,
  XLg,
  ChevronDown,
  LayersFill,
} from "react-bootstrap-icons";
import { JurisdictionType, LanguageCode, UserProfile } from "@/types";
import { getTranslation } from "@/lib/i18n";
import Link from "next/link";

interface HeaderProps {
  language: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  jurisdiction?: JurisdictionType;
  onJurisdictionChange?: (jur: JurisdictionType) => void;
  sessionCount: number;
  onOpenHistory: () => void;
  onOpenCompare: () => void;
  onOpenAuth: () => void;
  userProfile: UserProfile;
  onLogout: () => void;
  onGoHome: () => void;
}

const COUNTRIES: Record<string, { label: string; flag: string; sub: string }> = {
  US: { label: "USA", flag: "🇺🇸", sub: "USPTO / FDA" },
  IN: { label: "India", flag: "🇮🇳", sub: "CGPDTM / AYUSH" },
  EU: { label: "Europe", flag: "🇪🇺", sub: "EPO / EMA" },
  DE: { label: "Germany", flag: "🇩🇪", sub: "DPMA / BfArM" },
  WO: { label: "Global", flag: "🌐", sub: "WIPO PCT" },
};

const LANGUAGES: { code: LanguageCode; label: string }[] = [
  { code: "en", label: "English" },
  { code: "te", label: "తెలుగు (Telugu)" },
  { code: "hi", label: "हिन्दी (Hindi)" },
  { code: "de", label: "Deutsch (German)" },
  { code: "ta", label: "தமிழ் (Tamil)" },
  { code: "kn", label: "ಕನ್ನಡ (Kannada)" },
  { code: "ml", label: "മലയാളം (Malayalam)" },
];

export default function Header({
  language,
  onLanguageChange,
  jurisdiction = "IN",
  sessionCount,
  onOpenHistory,
  userProfile,
  onGoHome,
}: HeaderProps) {
  const t = getTranslation(language);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeMarket = COUNTRIES[jurisdiction] || COUNTRIES.IN;

  return (
    <header className="bg-black/90 backdrop-blur-xl border-b border-zinc-800/90 sticky top-0 z-30 shadow-2xl">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between gap-2">
        {/* Clickable Logo & Title to return home */}
        <button
          onClick={onGoHome}
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

        {/* Desktop Navigation Items */}
        <div className="hidden md:flex items-center gap-2">
          {/* Active Market Pill -> Links to /location */}
          <Link
            href="/location"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-200 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 rounded-xl transition-all shadow-sm cursor-pointer"
            title={`${t.nav.activeMarket} - ${t.nav.changeMarket}`}
          >
            <span className="text-sm">{activeMarket.flag}</span>
            <span className="font-bold text-white">{activeMarket.label}</span>
            <span className="text-[10px] font-mono text-zinc-400">({activeMarket.sub})</span>
          </Link>

          {/* Home Button */}
          <button
            onClick={onGoHome}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white bg-zinc-900/80 hover:bg-zinc-800 rounded-xl transition-all border border-zinc-800 shadow-sm cursor-pointer"
            title="Return to Home Screen"
          >
            <HouseDoorFill className="w-3.5 h-3.5 text-zinc-400" />
            <span>{t.nav.home}</span>
          </button>

          {/* History Drawer Trigger */}
          <button
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white bg-zinc-900/80 hover:bg-zinc-800 rounded-xl transition-all border border-zinc-800 shadow-sm cursor-pointer"
            title={t.nav.consultationHistory}
          >
            <ClockHistory className="w-3.5 h-3.5 text-zinc-400" />
            <span>{t.nav.history}</span>
            <span className="w-4 h-4 rounded-full bg-white text-black text-[10px] font-bold flex items-center justify-center font-mono">
              {sessionCount}
            </span>
          </button>

          {/* Specialized Diagnostic Engines */}
          <Link
            href="/formulation-analyzer"
            className="px-2.5 py-1.5 text-xs font-semibold text-zinc-400 hover:text-white bg-zinc-900/50 hover:bg-zinc-800 rounded-xl transition-all border border-zinc-800/80"
          >
            {t.nav.formulations}
          </Link>

          <Link
            href="/patentability"
            className="px-2.5 py-1.5 text-xs font-semibold text-zinc-400 hover:text-white bg-zinc-900/50 hover:bg-zinc-800 rounded-xl transition-all border border-zinc-800/80"
          >
            {t.nav.patentability}
          </Link>

          <Link
            href="/tk-risk"
            className="px-2.5 py-1.5 text-xs font-semibold text-zinc-400 hover:text-white bg-zinc-900/50 hover:bg-zinc-800 rounded-xl transition-all border border-zinc-800/80"
          >
            {t.nav.tkRisk}
          </Link>

          <Link
            href="/compare-jurisdictions"
            className="px-2.5 py-1.5 text-xs font-semibold text-zinc-400 hover:text-white bg-zinc-900/50 hover:bg-zinc-800 rounded-xl transition-all border border-zinc-800/80"
          >
            {t.nav.compare}
          </Link>

          {/* Language Selector */}
          <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 rounded-xl px-2.5 py-1.5 text-xs text-zinc-300">
            <Globe2 className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value as LanguageCode)}
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

          {/* User Profile / Login */}
          {userProfile.isLoggedIn ? (
            <Link
              href="/profile"
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-black bg-white hover:bg-zinc-200 rounded-xl transition-all shadow-md shrink-0 cursor-pointer"
              title="View User Details & Security Profile"
            >
              <div className="w-5 h-5 rounded-full bg-black text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : "U"}
              </div>
              <span className="max-w-[120px] truncate text-xs">
                {userProfile.name || `@${userProfile.username || "user"}`}
              </span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-black bg-white hover:bg-zinc-200 rounded-xl shadow-md transition-all shrink-0 cursor-pointer"
              title="Sign In with Official Email & OTP"
            >
              <KeyFill className="w-3.5 h-3.5" />
              <span>{t.nav.signIn}</span>
            </Link>
          )}
        </div>

        {/* Mobile Controls (Clean & Non-Scrolling) */}
        <div className="flex md:hidden items-center gap-2">
          {/* Active Market Quick Tap to /location */}
          <Link
            href="/location"
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-white bg-zinc-900 border border-zinc-700 rounded-xl shadow-sm"
            title={t.nav.changeMarket}
          >
            <span>{activeMarket.flag}</span>
            <span className="text-[11px] font-bold">{activeMarket.label}</span>
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-zinc-300 hover:text-white bg-zinc-900 border border-zinc-800 rounded-xl transition-colors cursor-pointer"
            aria-label="Toggle Mobile Menu"
          >
            {mobileMenuOpen ? <XLg className="w-4 h-4" /> : <List className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Vertical Drawer Menu (Zero horizontal scrolling! Clean practical vertical stacking) */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-zinc-950 border-t border-zinc-800 px-4 py-4 space-y-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex flex-col gap-2 text-left">
            {/* User Profile / Sign In at Top of Menu */}
            {userProfile.isLoggedIn ? (
              <Link
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl bg-zinc-900 border border-zinc-700 text-white"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-white text-black font-bold flex items-center justify-center text-sm">
                    {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div>
                    <span className="text-sm font-bold block leading-tight">{userProfile.name}</span>
                    <span className="text-[11px] text-zinc-400 block">{userProfile.email}</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300 border border-zinc-700">
                  {t.nav.profile} →
                </span>
              </Link>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-white text-black font-bold text-xs shadow-md"
              >
                <KeyFill className="w-4 h-4" />
                <span>{t.nav.signIn}</span>
              </Link>
            )}

            {/* Change Jurisdiction / Location Option */}
            <Link
              href="/location"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/90 border border-zinc-800 text-zinc-200 hover:text-white"
            >
              <div className="flex items-center gap-2.5">
                <Globe2 className="w-4 h-4 text-white" />
                <span className="text-xs font-semibold">{t.nav.changeMarket}</span>
              </div>
              <span className="text-xs font-bold text-white px-2 py-0.5 bg-black border border-zinc-700 rounded-lg flex items-center gap-1">
                <span>{activeMarket.flag}</span>
                <span>{activeMarket.label}</span>
              </span>
            </Link>

            {/* Return to Chat / Home */}
            <button
              onClick={() => {
                onGoHome();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2.5 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 text-zinc-200 hover:text-white text-xs font-semibold text-left cursor-pointer"
            >
              <HouseDoorFill className="w-4 h-4 text-zinc-400" />
              <span>{t.nav.chatWorkspace}</span>
            </button>

            {/* Consultation History */}
            <button
              onClick={() => {
                onOpenHistory();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 text-zinc-200 hover:text-white text-xs font-semibold text-left cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <ClockHistory className="w-4 h-4 text-zinc-400" />
                <span>{t.nav.consultationHistory}</span>
              </div>
              <span className="w-5 h-5 rounded-full bg-white text-black text-[11px] font-bold flex items-center justify-center font-mono">
                {sessionCount}
              </span>
            </button>

            {/* Vertical Module Tools Stack */}
            <div className="pt-2 border-t border-zinc-800/80 space-y-1.5">
              <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold px-1">
                {t.nav.specializedEngines}
              </span>

              <Link
                href="/formulation-analyzer"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900/40 hover:bg-zinc-900 border border-zinc-800/60 text-xs text-zinc-300"
              >
                <span>🧬 {t.nav.formulations}</span>
                <span className="text-zinc-400 text-[11px]">→</span>
              </Link>

              <Link
                href="/patentability"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900/40 hover:bg-zinc-900 border border-zinc-800/60 text-xs text-zinc-300"
              >
                <span>💡 {t.nav.patentability}</span>
                <span className="text-zinc-400 text-[11px]">→</span>
              </Link>

              <Link
                href="/tk-risk"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900/40 hover:bg-zinc-900 border border-zinc-800/60 text-xs text-zinc-300"
              >
                <span>🌿 {t.nav.tkRisk}</span>
                <span className="text-zinc-400 text-[11px]">→</span>
              </Link>

              <Link
                href="/compare-jurisdictions"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900/40 hover:bg-zinc-900 border border-zinc-800/60 text-xs text-zinc-300"
              >
                <span>⚖️ {t.nav.compare}</span>
                <span className="text-zinc-400 text-[11px]">→</span>
              </Link>
            </div>

            {/* Mobile Language Selector */}
            <div className="pt-2 border-t border-zinc-800/80">
              <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold block mb-1 px-1">
                {t.nav.selectLanguage}
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      onLanguageChange(l.code);
                      setMobileMenuOpen(false);
                    }}
                    className={`py-2 px-2.5 rounded-xl text-xs font-semibold text-center transition-all cursor-pointer ${
                      language === l.code
                        ? "bg-white text-black font-bold shadow-sm"
                        : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
