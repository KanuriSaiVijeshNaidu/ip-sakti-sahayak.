"use client";
import { DomainType, LanguageCode } from "@/types";
import { getTranslation } from "@/lib/i18n";

const DOMAIN_KEYS: { value: DomainType | "auto"; emoji: string }[] = [
  { value: "auto",       emoji: "🔍" },
  { value: "patents",    emoji: "💡" },
  { value: "trademarks", emoji: "™️" },
  { value: "gi",         emoji: "🌿" },
  { value: "fssai",      emoji: "🏷️" },
  { value: "ayush",      emoji: "🌺" },
];

interface Props {
  value: DomainType | "auto";
  onChange: (d: DomainType | "auto") => void;
  language?: LanguageCode;
}

export default function DomainSelector({ value, onChange, language = "en" }: Props) {
  const t = getTranslation(language);

  return (
    <div className="flex flex-wrap gap-2">
      {DOMAIN_KEYS.map((d) => (
        <button
          key={d.value}
          onClick={() => onChange(d.value as DomainType | "auto")}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
            value === d.value
              ? "bg-green-600 text-white border-green-600 shadow-sm font-semibold"
              : "bg-white text-gray-700 border-gray-300 hover:border-green-400 hover:text-green-800"
          }`}
        >
          {d.emoji} {t.domains[d.value] || d.value}
        </button>
      ))}
    </div>
  );
}
