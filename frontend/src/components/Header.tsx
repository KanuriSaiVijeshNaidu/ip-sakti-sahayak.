"use client";

import { useState, useEffect } from "react";
import {
  ShieldShaded,
  ClockHistory,
  ColumnsGap,
  KeyFill,
  BoxArrowRight,
  Globe2,
  List,
  X,
  Link45deg,
} from "react-bootstrap-icons";
import { LanguageCode, UserProfile } from "@/types";
import { getTranslation } from "@/lib/i18n";

interface HeaderProps {
  language: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  sessionCount: number;
  onOpenHistory: () => void;
  onOpenCompare: () => void;
  onOpenAuth: () => void;
  userProfile: UserProfile;
  onLogout: () => void;
  onGoHome: () => void;
}

const LANGUAGES: { code: LanguageCode; label: string }[] = [
  { code: "en", label: "English" },
  { code: "te", label: "తెలుగు (Telugu)" },
  { code: "hi", label: "हिन्दी (Hindi)" },
  { code: "ta", label: "தமிழ் (Tamil)" },
  { code: "kn", label: "ಕನ್ನಡ (Kannada)" },
  { code: "ml", label: "മലയാളം (Malayalam)" },
];

export default function Header({
  language,
  onLanguageChange,
  sessionCount,
  onOpenHistory,
  onOpenCompare,
  onOpenAuth,
  userProfile,
  onLogout,
  onGoHome,
}: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = getTranslation(language);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: "Overview", href: "#hero" },
    { label: "Knowledge", href: "#knowledge-worlds" },
    { label: "AI Assistant", href: "#ai-assistant" },
    { label: "Citations", href: "#citations" },
    { label: "Languages", href: "#languages" },
    { label: "Blockchain PoE", href: "#blockchain-provenance" },
    { label: "Why AYURLEX", href: "#why-ayurlex" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#070b0e]/85 backdrop-blur-xl border-b border-white/10 shadow-2xl py-2.5"
          : "bg-transparent py-4 border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            onGoHome();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="flex items-center gap-3 text-left group select-none cursor-pointer"
          title="Return to AYURLEX Home"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-emerald-glow border border-emerald-400/30 group-hover:scale-105 transition-transform">
            <ShieldShaded className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-bold tracking-tight text-white font-sans">
                AYURLEX
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/30">
                PRO
              </span>
            </div>
            <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400 leading-none">
              IP-SAKTI Sahayak
            </p>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-medium text-slate-300">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-emerald-400 transition-colors py-1 relative group"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-500 transition-all group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Action Controls & User Account */}
        <div className="flex items-center gap-2.5">
          {/* Statutory Compare Mode Button */}
          <button
            onClick={onOpenCompare}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/30 rounded-lg transition-all shadow-xs"
            title="Open Statutory Compare Mode"
          >
            <ColumnsGap className="w-3.5 h-3.5 text-emerald-400" />
            <span>Compare</span>
          </button>

          {/* Consultation History Button */}
          <button
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-900/70 hover:bg-slate-800 border border-white/10 rounded-lg transition-all"
            title="Open Consultation History Vault"
          >
            <ClockHistory className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">Vault</span>
            {userProfile.isLoggedIn && (
              <span className="bg-emerald-600 text-white text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold">
                {sessionCount}
              </span>
            )}
          </button>

          {/* Language Selector */}
          <div className="flex items-center gap-1.5 bg-slate-900/70 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs hover:border-emerald-500/40 transition-colors">
            <Globe2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value as LanguageCode)}
              aria-label="Select Language"
              className="bg-transparent text-slate-200 font-medium outline-none cursor-pointer text-xs"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code} className="bg-slate-900 text-slate-200">
                  {l.label}
                </option>
              ))}
            </select>
          </div>

          {/* User Profile / OTP Login */}
          {userProfile.isLoggedIn ? (
            <div className="flex items-center gap-1 bg-slate-900/80 border border-white/15 rounded-lg p-0.5">
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-2 px-2 py-1 text-xs hover:bg-slate-800 rounded-md transition-colors"
                title="View Account Profile"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">
                  {userProfile.name[0]?.toUpperCase() || "U"}
                </div>
                <div className="text-left hidden sm:block">
                  <span className="block text-[11px] font-semibold text-slate-200 leading-tight truncate max-w-[90px]">
                    {userProfile.name}
                  </span>
                  <span className="block text-[8px] text-emerald-400 uppercase font-mono leading-none">
                    {userProfile.role}
                  </span>
                </div>
              </button>
              <button
                onClick={() => {
                  if (confirm("Sign out of AYURLEX? Your local terminal session will end.")) {
                    onLogout();
                  }
                }}
                className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
                title="Sign Out"
              >
                <BoxArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 rounded-lg shadow-emerald-glow transition-all"
              title="Sign In with Official Email & OTP"
            >
              <KeyFill className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Sign In</span>
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-300 hover:text-white bg-slate-900/80 border border-white/10 rounded-lg"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <List className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#070b0e]/95 backdrop-blur-2xl border-b border-white/10 px-4 py-4 space-y-3">
          <nav className="flex flex-col space-y-2 text-sm text-slate-300">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 px-3 rounded-lg hover:bg-slate-800/60 hover:text-emerald-400 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="pt-2 border-t border-white/10 flex items-center gap-2">
            <button
              onClick={() => {
                onOpenCompare();
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-2 text-xs font-semibold text-emerald-300 bg-emerald-950/50 border border-emerald-500/30 rounded-lg text-center"
            >
              Compare Statutes
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
