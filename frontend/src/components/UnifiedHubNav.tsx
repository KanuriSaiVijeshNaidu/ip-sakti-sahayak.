"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  Globe2,
  Search,
  CheckCircleFill,
  ShieldCheck,
  PersonCircle,
} from "react-bootstrap-icons";
import { LanguageCode, JurisdictionType } from "@/types";

export interface UnifiedHubNavProps {
  language?: LanguageCode;
  onLanguageChange?: (lang: LanguageCode) => void;
  jurisdiction?: JurisdictionType;
  onJurisdictionChange?: (jur: JurisdictionType) => void;
}

export interface HubTab {
  id: string;
  name: string;
  badge?: string;
  subTabs: {
    id: string;
    label: string;
    href: string;
    desc: string;
  }[];
}

const HUBS: HubTab[] = [
  {
    id: "export",
    name: "1. Sell and Export",
    badge: "Active",
    subTabs: [
      { id: "decision", label: "Can I Sell My Product?", href: "/decision", desc: "Check international export clearance and FTO" },
      { id: "compare", label: "Compare Countries", href: "/compare-jurisdictions", desc: "Side-by-side US, Japan and EU rules" },
      { id: "markets", label: "Market Guidelines", href: "/location", desc: "Detailed statutory rules for each region" },
      { id: "wipo", label: "Global WIPO Hub", href: "/international", desc: "PCT filing frameworks and international treaties" },
    ],
  },
  {
    id: "patents",
    name: "2. Patents and Novelty",
    subTabs: [
      { id: "patentability", label: "Can I Patent This?", href: "/patentability", desc: "Test novelty and Section 3(e)/3(p) objections" },
      { id: "formulation", label: "Analyze Ingredients and Synergy", href: "/formulation-analyzer", desc: "Decompose polyherbal recipes into active compounds" },
      { id: "convert", label: "Convert Indian Patent to PCT", href: "/indian-to-international", desc: "Reformat claims for USPTO/EPO/JPO" },
    ],
  },
  {
    id: "herbs",
    name: "3. Traditional Herbs",
    subTabs: [
      { id: "tkdl", label: "Traditional Knowledge (TKDL) Risk", href: "/tk-risk", desc: "Screen against CSIR-TKDL and avoid biopiracy challenges" },
      { id: "biodiversity", label: "Biodiversity and NBA Approval", href: "/location", desc: "National Biodiversity Authority Sec 6 compliance" },
    ],
  },
  {
    id: "copilot",
    name: "4. AI Assistant and Tools",
    subTabs: [
      { id: "chat", label: "Ask AyurLex AI", href: "/", desc: "Multilingual 24/7 legal and statutory assistant" },
      { id: "profile", label: "My Saved Reports", href: "/profile", desc: "Saved formulations and export verdicts" },
      { id: "benchmarks", label: "Live System Verification", href: "/admin/evaluation", desc: "Transparent 425-query RAG audit metrics" },
    ],
  },
];

const COUNTRIES: Record<string, { label: string; flag: string; code: JurisdictionType }> = {
  US: { label: "USA", flag: "🇺🇸", code: "US" },
  JP: { label: "Japan", flag: "🇯🇵", code: "JP" },
  EU: { label: "Europe", flag: "🇪🇺", code: "EU" },
  WO: { label: "Global", flag: "🌐", code: "WO" },
  IN: { label: "India", flag: "🇮🇳", code: "IN" },
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

export default function UnifiedHubNav({
  language: propLanguage,
  onLanguageChange,
  jurisdiction: propJurisdiction,
  onJurisdictionChange,
}: UnifiedHubNavProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [activeLang, setActiveLang] = useState<LanguageCode>("en");
  const [activeJur, setActiveJur] = useState<JurisdictionType>("IN");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem("ip_sakti_lang") || localStorage.getItem("ayurlex_language");
      if (savedLang && ["en", "te", "hi", "ja", "ta", "kn", "ml"].includes(savedLang)) {
        setActiveLang(savedLang as LanguageCode);
      }
      const savedJur = localStorage.getItem("ayurlex_jurisdiction");
      if (savedJur && ["US", "JP", "EU", "WO", "IN"].includes(savedJur)) {
        setActiveJur(savedJur as JurisdictionType);
      }
    } catch {}
  }, []);

  const language = propLanguage || activeLang;
  const jurisdiction = propJurisdiction || activeJur;

  const handleLangChange = (code: LanguageCode) => {
    setActiveLang(code);
    try {
      localStorage.setItem("ip_sakti_lang", code);
      localStorage.setItem("ayurlex_language", code);
    } catch {}
    if (onLanguageChange) onLanguageChange(code);
  };

  const handleJurChange = (jur: JurisdictionType) => {
    setActiveJur(jur);
    try {
      localStorage.setItem("ayurlex_jurisdiction", jur);
    } catch {}
    if (onJurisdictionChange) onJurisdictionChange(jur);
  };

  const getActiveHubIndex = () => {
    if (pathname.includes("decision") || pathname.includes("compare") || pathname.includes("location") || pathname.includes("international")) {
      return 0;
    }
    if (pathname.includes("patentability") || pathname.includes("formulation") || pathname.includes("indian-to-international")) {
      return 1;
    }
    if (pathname.includes("tk-risk")) {
      return 2;
    }
    if (pathname === "/" || pathname.includes("profile") || pathname.includes("admin") || pathname.includes("login")) {
      return 3;
    }
    return 0;
  };

  const [selectedHub, setSelectedHub] = useState<number>(getActiveHubIndex());

  useEffect(() => {
    setSelectedHub(getActiveHubIndex());
  }, [pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/decision?q=${encodeURIComponent(searchQuery)}`);
  };

  const currentHub = HUBS[selectedHub] || HUBS[0];

  return (
    <div className="w-full bg-[#fbfbf9]/95 backdrop-blur-md sticky top-0 z-50 border-b border-[#e6e8e2] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] transition-all">
      {/* 1. TOP GLOBAL BAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        {/* AyurLex Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-9 h-9 rounded-2xl bg-[#436143] text-white flex items-center justify-center shadow-sm group-hover:bg-[#374e37] transition-all">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-bold tracking-tight text-[#243324]">AyurLex</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#eaf0ea] text-[#436143] border border-[#d5e2d5]">
                Intelligence
              </span>
            </div>
            <p className="text-[11px] text-[#6b7280] hidden sm:block leading-none">
              Simple Ayurvedic Patent and Export Platform
            </p>
          </div>
        </Link>

        {/* Global Pill Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xl hidden md:block">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-[#8a918a] absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search herb, formula, or ask: Can I sell Ashwagandha in USA?..."
              className="w-full pl-9 pr-20 py-2 text-xs rounded-full bg-[#f5f6f2] hover:bg-[#eceee7] focus:bg-white text-[#2e412e] placeholder-[#8a918a] border border-[#e0e3d8] focus:border-[#6d976d] focus:outline-none focus:ring-2 focus:ring-[#6d976d]/20 transition-all"
            />
            <button
              type="submit"
              className="absolute right-1.5 px-3 py-1 text-[11px] font-semibold bg-[#436143] text-white rounded-full hover:bg-[#374e37] transition-all cursor-pointer"
            >
              Ask
            </button>
          </div>
        </form>

        {/* Right Controls: Language Selector, Country Badges, User Profile */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Language Capsule */}
          <div className="flex items-center gap-1.5 bg-[#f5f6f2] border border-[#e0e3d8] rounded-full px-2.5 py-1 text-xs text-[#436143]">
            <Globe2 className="w-3.5 h-3.5 text-[#6d976d]" />
            <select
              value={language}
              onChange={(e) => handleLangChange(e.target.value as LanguageCode)}
              className="bg-transparent text-xs font-semibold text-[#2e412e] outline-none cursor-pointer pr-1"
              aria-label="Select Language"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code} className="bg-white text-zinc-900">
                  {l.label}
                </option>
              ))}
            </select>
          </div>

          {/* Active Target Country Badges */}
          <div className="flex items-center gap-1 bg-[#f5f6f2] border border-[#e0e3d8] rounded-full p-0.5">
            {Object.values(COUNTRIES).map((c) => {
              const isSelected = jurisdiction === c.code;
              return (
                <button
                  key={c.code}
                  onClick={() => handleJurChange(c.code)}
                  title={`Active Market: ${c.label}`}
                  className={`flex items-center gap-1 px-2 py-1 text-xs rounded-full transition-all cursor-pointer ${
                    isSelected
                      ? "bg-white text-[#2e412e] font-bold shadow-sm border border-[#d5e2d5]"
                      : "text-[#6b7280] hover:text-[#2e412e]"
                  }`}
                >
                  <span>{c.flag}</span>
                  <span className="hidden lg:inline text-[11px]">{c.label}</span>
                </button>
              );
            })}
          </div>

          {/* Profile Link */}
          <Link
            href="/profile"
            className="p-1.5 rounded-full bg-[#f5f6f2] hover:bg-[#eceee7] border border-[#e0e3d8] text-[#436143] transition-all"
            title="My Account and History"
          >
            <PersonCircle className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* 2. CENTERED FLOATING 4-HUB CAPSULE BAR */}
      <div className="max-w-4xl mx-auto px-4 pb-2">
        <div className="bg-[#f0f3ec] border border-[#dce2d6] rounded-full p-1 flex items-center justify-between gap-1 shadow-inner">
          {HUBS.map((hub, idx) => {
            const isActive = selectedHub === idx;
            return (
              <button
                key={hub.id}
                onClick={() => setSelectedHub(idx)}
                className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-full transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  isActive
                    ? "bg-[#436143] text-white shadow-sm"
                    : "text-[#4b5563] hover:text-[#1f2937] hover:bg-white/60"
                }`}
              >
                <span>{hub.name}</span>
                {hub.badge && !isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#6d976d] inline-block" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. CONTEXTUAL SUB-TABS ROW */}
      <div className="max-w-5xl mx-auto px-4 pb-2.5">
        <div className="flex items-center justify-center flex-wrap gap-1.5 sm:gap-2">
          {currentHub.subTabs.map((sub) => {
            const isSubActive = pathname === sub.href;
            return (
              <Link
                key={sub.id}
                href={sub.href}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 border ${
                  isSubActive
                    ? "bg-[#eaf0ea] text-[#374e37] font-bold border-[#b5cdb5] shadow-sm"
                    : "bg-white text-[#4b5563] hover:bg-[#f5f6f2] hover:text-[#1f2937] border-[#e5e7eb]"
                }`}
                title={sub.desc}
              >
                {isSubActive && <CheckCircleFill className="w-3 h-3 text-[#537953]" />}
                <span>{sub.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
