"use client";
import { LanguageCode, DomainType } from "@/types";
import { getTranslation } from "@/lib/i18n";
import { DOMAIN_DATA } from "@/lib/domainData";
import { ArrowUpRight } from "react-bootstrap-icons";

export default function SuggestionsGrid({
  onSelect,
  language = "en",
  domain = "auto",
}: {
  onSelect: (s: string) => void;
  language?: LanguageCode;
  domain?: DomainType | "auto";
}) {
  const t = getTranslation(language);

  // Retrieve domain-specific questions for the selected domain & language
  const langPack = DOMAIN_DATA[language] || DOMAIN_DATA["en"];
  const domainInfo = langPack ? (langPack[domain] || langPack["auto"]) : null;
  const suggestions =
    domainInfo?.prompts && domainInfo.prompts.length > 0
      ? domainInfo.prompts
      : t.suggestions;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl w-full mx-auto">
      {suggestions.map((s, idx) => (
        <button
          key={idx}
          onClick={() => onSelect(s.text)}
          className="group flex items-start justify-between gap-3 p-3.5 rounded-xl border border-white/10 bg-slate-900/40 hover:bg-slate-900/80 hover:border-emerald-500/40 text-left transition-all duration-200 shadow-sm hover:shadow-emerald-glow"
        >
          <div className="flex items-start gap-2.5">
            <span className="text-lg shrink-0 mt-0.5 group-hover:scale-115 transition-transform">
              {s.emoji}
            </span>
            <span className="text-xs text-slate-300 group-hover:text-white leading-relaxed font-medium">
              {s.text}
            </span>
          </div>
          <ArrowUpRight className="w-3 h-3 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0 mt-1" />
        </button>
      ))}
    </div>
  );
}
