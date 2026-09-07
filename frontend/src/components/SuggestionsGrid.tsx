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

const US_SUGGESTIONS = [
  { emoji: "🇺🇸", text: "Can I patent an herbal extract under 35 U.S.C. § 101 in the US?" },
  { emoji: "💊", text: "What are FDA DSHEA rules for dietary supplement structure/function claims?" },
  { emoji: "🏷️", text: "How do I register a trademark with the USPTO under the Lanham Act?" },
  { emoji: "📚", text: "Can Indian traditional medicine (TKDL) be cited as prior art against a US patent?" },
];

const EU_SUGGESTIONS = [
  { emoji: "🇪🇺", text: "What are EPC Articles 52 and 54 novelty rules for botanical extracts at the EPO?" },
  { emoji: "🔬", text: "How does the EPO evaluate inventive step using the Problem-Solution Approach?" },
  { emoji: "🏥", text: "Are second medical use claims allowed for herbal formulations under EPC Article 54(5)?" },
  { emoji: "🇩🇪", text: "What are the patent requirements for phytopharmaceuticals under the German Patent Act (PatG)?" },
];

const WO_SUGGESTIONS = [
  { emoji: "🌐", text: "How does PCT Article 33 international preliminary examination work?" },
  { emoji: "📜", text: "What are the mandatory disclosure rules under the WIPO Genetic Resources Treaty (2024)?" },
  { emoji: "⏱️", text: "What are the 12-month priority and 30-month national phase entry deadlines under the PCT?" },
  { emoji: "🛡️", text: "How to claim priority from an Indian patent application under PCT Article 8?" },
];

const IN_FOREIGN_SUGGESTIONS = [
  { emoji: "🌐", text: "I am an American company. How can I register and sell my herbal product in India?" },
  { emoji: "⚖️", text: "What are the Section 3(e) and 3(p) patentability bars under The Patents Act, 1970?" },
  { emoji: "🏷️", text: "How do I register a trademark under The Trade Marks Act, 1999?" },
  { emoji: "🥗", text: "What are the FSSAI Ayurveda Aahara 2022 labelling and logo standards?" },
];

export default function SuggestionsGrid({
  onSelect,
  language = "en",
  domain = "auto",
  jurisdiction = "IN",
}: SuggestionsGridProps) {
  const t = getTranslation(language);

  let suggestions = t.suggestions;

  if (jurisdiction === "US") {
    suggestions = US_SUGGESTIONS;
  } else if (jurisdiction === "EU" || jurisdiction === "DE") {
    suggestions = EU_SUGGESTIONS;
  } else if (jurisdiction === "WO") {
    suggestions = WO_SUGGESTIONS;
  } else if (jurisdiction === "IN") {
    suggestions = IN_FOREIGN_SUGGESTIONS;
  } else {
    const langPack = DOMAIN_DATA[language] || DOMAIN_DATA["en"];
    const domainInfo = langPack ? (langPack[domain] || langPack["auto"]) : null;
    if (domainInfo?.prompts && domainInfo.prompts.length > 0) {
      suggestions = domainInfo.prompts;
    }
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
