"use client";
import {
  Scale,
  Globe,
  MessageSquare,
  SplitSquareVertical,
  User,
  ShieldCheck,
  Activity,
  LogOut,
  KeyRound,
  Mail,
  Lock,
} from "lucide-react";
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
}: HeaderProps) {
  const t = getTranslation(language);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-2xs">
      <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
        {/* Logo & Title */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-600 to-emerald-700 flex items-center justify-center shadow-xs">
            <Scale className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-900 leading-tight flex items-center gap-1.5">
              <span>{t.title}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
                PRO
              </span>
            </h1>
            <p className="text-[11px] text-gray-500 leading-none">
              {t.subtitle} · {t.tagline}
            </p>
          </div>
        </div>

        {/* Action Buttons & Profile Controls */}
        <div className="flex items-center gap-2">
          {/* Security SSL Status Pill */}
          <div className="hidden lg:flex items-center gap-1 px-2 py-1 text-[11px] font-mono rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
            <Lock className="w-3 h-3 text-emerald-600" />
            <span>TLS 256-Bit</span>
          </div>

          {/* History Drawer Trigger */}
          <button
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100/80 hover:bg-gray-200/80 rounded-lg transition-colors border border-gray-200"
            title="Open Consultation History"
          >
            <MessageSquare className="w-3.5 h-3.5 text-green-700" />
            <span className="hidden sm:inline">History</span>
            <span className="bg-green-700 text-white text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold">
              {sessionCount}
            </span>
          </button>

          {/* Compare Mode Trigger */}
          <button
            onClick={onOpenCompare}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
            title="Open Statutory Compare Mode"
          >
            <SplitSquareVertical className="w-3.5 h-3.5 text-emerald-700" />
            <span className="hidden md:inline">Compare</span>
          </button>

          {/* Admin / Trace link */}
          <Link
            href="/admin"
            className="flex items-center gap-1 px-2 py-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            title="Inspection Trace & LangSmith Evaluation Dashboard"
          >
            <Activity className="w-3.5 h-3.5 text-purple-600" />
            <span className="hidden xl:inline">Trace</span>
          </Link>

          {/* User Profile / Login Button */}
          {userProfile.isLoggedIn ? (
            <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-lg p-0.5">
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-2 py-1 text-xs hover:bg-gray-200/60 rounded-md transition-colors"
                title="View & Edit Professional Profile"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px] font-bold">
                  {userProfile.name[0]?.toUpperCase() || "V"}
                </div>
                <div className="text-left hidden sm:block">
                  <span className="block text-[11px] font-semibold text-gray-800 leading-tight truncate max-w-[100px]">
                    {userProfile.name}
                  </span>
                  <span className="block text-[9px] text-gray-500 uppercase font-mono leading-none">
                    {userProfile.role}
                  </span>
                </div>
              </button>

              {/* Direct Logout Button */}
              <button
                onClick={() => {
                  if (confirm("Sign out of AYURLEX? Your current terminal session will end.")) {
                    onLogout();
                  }
                }}
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                title="Log Out of AYURLEX"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-green-700 hover:bg-green-800 rounded-lg shadow-xs transition-all"
              title="Sign In with Official Email"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}

          {/* Language selector */}
          <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1 text-xs hover:border-green-400 transition-colors">
            <Globe className="w-3.5 h-3.5 text-green-600 shrink-0" />
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value as LanguageCode)}
              aria-label="Select Language"
              className="bg-transparent text-gray-700 font-medium outline-none cursor-pointer text-xs"
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
