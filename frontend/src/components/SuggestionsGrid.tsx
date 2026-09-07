"use client";
import { LanguageCode, DomainType, JurisdictionType } from "@/types";
import { getTranslation } from "@/lib/i18n";
import { DOMAIN_DATA } from "@/lib/domainData";

interface SuggestionsGridProps {
  onSelect: (s: string) => void;
  language?: LanguageCode;
  domain?: DomainType | "auto";
  jurisdiction?: JurisdictionType;
}

export default function SuggestionsGrid({
  onSelect,
  language = "en",
  domain = "auto",
  jurisdiction = "IN",
}: SuggestionsGridProps) {
  const t = getTranslation(language);

  let suggestions: { emoji: string; text: string }[] = [];

  // 1. If domain is specifically selected and has custom prompts, prioritize domain prompts
  if (domain && domain !== "auto") {
    const langPack = DOMAIN_DATA[language] || DOMAIN_DATA["en"];
    const domainInfo = langPack ? langPack[domain] : null;
    if (domainInfo?.prompts && domainInfo.prompts.length > 0) {
      suggestions = domainInfo.prompts;
    }
  }

  // 2. Otherwise use localized jurisdiction-specific suggestions
  if (suggestions.length === 0 && jurisdiction && t.jurisdictionSuggestions) {
    if (t.jurisdictionSuggestions[jurisdiction]) {
      suggestions = t.jurisdictionSuggestions[jurisdiction];
    } else if (jurisdiction === "GLOBAL" && t.jurisdictionSuggestions.WO) {
      suggestions = t.jurisdictionSuggestions.WO;
    }
  }

  // 3. Fallback to general localized suggestions
  if (suggestions.length === 0) {
    suggestions = t.suggestions || [];
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 max-w-2xl w-full mx-auto">
      {suggestions.map((s) => (
        <button
          key={s.text}
          onClick={() => onSelect(s.text)}
          className="flex items-start gap-3 p-3.5 sm:p-4 rounded-2xl border border-zinc-800 bg-zinc-950/80 backdrop-blur-md hover:border-zinc-500 hover:bg-zinc-900/90 text-left text-xs sm:text-sm text-zinc-200 hover:text-white card-motion group shadow-lg cursor-pointer select-none"
        >
          <span className="text-xl mt-0.5 group-hover:scale-110 transition-transform duration-200 shrink-0">
            {s.emoji}
          </span>
          <span className="leading-snug font-semibold text-zinc-300 group-hover:text-white">
            {s.text}
          </span>
        </button>
      ))}
    </div>
  );
}
