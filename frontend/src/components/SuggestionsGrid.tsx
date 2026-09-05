"use client";
import { LanguageCode, DomainType } from "@/types";
import { getTranslation } from "@/lib/i18n";
import { DOMAIN_DATA } from "@/lib/domainData";

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
  const suggestions = domainInfo?.prompts && domainInfo.prompts.length > 0
    ? domainInfo.prompts
    : t.suggestions;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl w-full mx-auto">
      {suggestions.map((s) => (
        <button
          key={s.text}
          onClick={() => onSelect(s.text)}
          className="flex items-start gap-3.5 p-4 rounded-2xl border border-gray-200/90 bg-white hover:border-emerald-400/90 hover:bg-emerald-50/30 text-left text-xs sm:text-sm text-gray-800 card-motion group shadow-2xs cursor-pointer select-none"
        >
          <span className="text-xl mt-0.5 group-hover:scale-115 transition-transform duration-200 shrink-0">
            {s.emoji}
          </span>
          <span className="leading-snug font-semibold text-gray-800 group-hover:text-emerald-950">
            {s.text}
          </span>
        </button>
      ))}
    </div>
  );
}
