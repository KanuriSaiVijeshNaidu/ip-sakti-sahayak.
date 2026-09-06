"use client";
import {
  ShieldShaded,
  HouseDoorFill,
  ClockHistory,
  ColumnsGap,
  KeyFill,
  BoxArrowRight,
  Globe2,
} from "react-bootstrap-icons";
import { LanguageCode, UserProfile } from "@/types";
import { getTranslation } from "@/lib/i18n";
import Link from "next/link";

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
  const t = getTranslation(language);

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-gray-200/80 sticky top-0 z-30 shadow-2xs">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between gap-2 sm:gap-3">
        {/* Clickable Logo & Title to return home */}
        <button
          onClick={onGoHome}
          className="flex items-center gap-2 sm:gap-2.5 text-left hover:opacity-90 transition-opacity select-none group cursor-pointer shrink-0"
          title="Return to AYURLEX Home / New Inquiry"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-green-700 flex items-center justify-center shadow-sm shadow-emerald-700/20 group-hover:scale-105 transition-transform duration-200 shrink-0">
            <ShieldShaded className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-bold text-gray-900 leading-tight flex items-center gap-1.5">
              <span>{t.title}</span>
              <span className="text-[9px] sm:text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-200 leading-none">
                PRO
              </span>
            </h1>
            <p className="text-[11px] text-gray-500 leading-none mt-0.5 hidden sm:block">
              SIH26045 · Ministry of Ayush · Multilingual Legal RAG
            </p>
          </div>
        </button>

        {/* Action Buttons & Profile Controls with smooth touch-scroll on mobile */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1 max-w-[62%] sm:max-w-none ml-auto shrink-0">
          {/* Home Button */}
          <button
            onClick={onGoHome}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 rounded-xl transition-all border border-gray-200/90 shadow-2xs btn-spring shrink-0 cursor-pointer"
            title="Return to Home Screen"
          >
            <HouseDoorFill className="w-3.5 h-3.5 text-emerald-700" />
            <span className="hidden sm:inline">Home</span>
          </button>

          {/* History Drawer Trigger with Badge */}
          <button
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 rounded-xl transition-all border border-gray-200/90 shadow-2xs btn-spring shrink-0 cursor-pointer"
            title="Open Consultation History"
          >
            <ClockHistory className="w-3.5 h-3.5 text-emerald-700" />
            <span className="hidden sm:inline">History</span>
            <span className="w-4 h-4 rounded-full bg-emerald-700 text-white text-[10px] font-bold flex items-center justify-center font-mono">
              {sessionCount}
            </span>
          </button>

          {/* Compare Mode Trigger (Visible on mobile & desktop) */}
          <button
            onClick={onOpenCompare}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50/80 hover:bg-emerald-100/80 border border-emerald-200/80 rounded-xl transition-all shadow-2xs btn-spring shrink-0 cursor-pointer"
            title="Open Statutory Compare Mode"
          >
            <ColumnsGap className="w-3.5 h-3.5 text-emerald-700" />
            <span className="hidden sm:inline">Compare</span>
          </button>

          {/* User Profile / Login Button - No Account Details clutter, only clean Sign Out when logged in */}
          {userProfile.isLoggedIn ? (
            <button
              onClick={() => {
                if (confirm("Sign out of AYURLEX?")) {
                  onLogout();
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200/80 rounded-xl transition-all btn-spring shrink-0 cursor-pointer"
              title="Sign Out"
            >
              <BoxArrowRight className="w-3.5 h-3.5" />
              <span className="text-xs">Sign Out</span>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs transition-all btn-spring shrink-0 cursor-pointer"
              title="Sign In with Official Email & OTP"
            >
              <KeyFill className="w-3.5 h-3.5" />
              <span className="text-xs">Sign In</span>
            </button>
          )}

          {/* Language selector - Full icon and dropdown size preserved */}
          <div className="flex items-center gap-1.5 bg-white border border-gray-200/90 rounded-xl px-2.5 py-1.5 text-xs hover:border-emerald-400 transition-colors shadow-2xs btn-spring shrink-0">
            <Globe2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value as LanguageCode)}
              aria-label="Select Language"
              className="bg-transparent text-gray-700 font-semibold outline-none cursor-pointer text-xs pr-1"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
}
