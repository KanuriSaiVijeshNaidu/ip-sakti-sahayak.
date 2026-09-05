"use client";
import { LanguageCode } from "@/types";
import { getTranslation } from "@/lib/i18n";

export default function SuggestionsGrid({
  onSelect,
  language = "en",
}: {
  onSelect: (s: string) => void;
  language?: LanguageCode;
}) {
  const t = getTranslation(language);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-2xl w-full mx-auto">
      {t.suggestions.map((s) => (
        <button
          key={s.text}
          onClick={() => onSelect(s.text)}
          className="flex items-start gap-3 p-3.5 rounded-xl border border-gray-200 bg-white hover:border-green-400 hover:bg-green-50 text-left text-sm text-gray-800 transition-all group shadow-2xs"
        >
          <span className="text-xl mt-0.5 group-hover:scale-110 transition-transform">{s.emoji}</span>
          <span className="leading-snug font-medium">{s.text}</span>
        </button>
      ))}
    </div>
  );
}
