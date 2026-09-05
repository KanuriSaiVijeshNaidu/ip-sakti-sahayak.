"use client";
import { Scale, Globe } from "lucide-react";
import { LanguageCode } from "@/types";
import { getTranslation } from "@/lib/i18n";

interface HeaderProps {
  language: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
}

const LANGUAGES: { code: LanguageCode; label: string }[] = [
  { code: "en", label: "English" },
  { code: "te", label: "తెలుగు (Telugu)" },
  { code: "hi", label: "हिन्दी (Hindi)" },
  { code: "ta", label: "தமிழ் (Tamil)" },
  { code: "kn", label: "ಕನ್ನಡ (Kannada)" },
  { code: "ml", label: "മലയാളം (Malayalam)" },
];

export default function Header({ language, onLanguageChange }: HeaderProps) {
  const t = getTranslation(language);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-2xs">
      <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-600 to-emerald-700 flex items-center justify-center shadow-xs">
            <Scale className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-900 leading-tight">{t.title}</h1>
            <p className="text-[11px] text-gray-500 leading-none">{t.subtitle} · {t.tagline}</p>
          </div>
        </div>

        {/* Language selector */}
        <div className="ml-auto flex items-center gap-2">
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
