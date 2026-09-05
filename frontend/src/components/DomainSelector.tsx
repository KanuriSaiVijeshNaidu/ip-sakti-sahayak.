"use client";
import { DomainType, LanguageCode } from "@/types";
import { getTranslation } from "@/lib/i18n";

const DOMAIN_KEYS: { value: DomainType | "auto"; emoji: string; isDot?: boolean }[] = [
  { value: "auto", emoji: "●", isDot: true },
  { value: "patents", emoji: "💡" },
  { value: "trademarks", emoji: "™" },
  { value: "gi", emoji: "🌿" },
  { value: "fssai", emoji: "🏷️" },
  { value: "ayush", emoji: "🌸" },
];

interface Props {
  value: DomainType | "auto";
  onChange: (d: DomainType | "auto") => void;
  language?: LanguageCode;
}

export default function DomainSelector({ value, onChange, language = "en" }: Props) {
  const t = getTranslation(language);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {DOMAIN_KEYS.map((d) => {
        const isSelected = value === d.value;
        return (
          <button
            key={d.value}
            onClick={() => onChange(d.value as DomainType | "auto")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold pill-spring border flex items-center gap-1.5 cursor-pointer select-none ${
              isSelected
                ? "bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-600/30 scale-100"
                : "bg-white text-gray-700 border-gray-200/90 hover:border-emerald-400 hover:text-emerald-800 shadow-2xs"
            }`}
          >
            {d.isDot ? (
              <span className={`text-[9px] ${isSelected ? "text-teal-200" : "text-emerald-600"}`}>
                ●
              </span>
            ) : (
              <span className="text-xs">{d.emoji}</span>
            )}
            <span>{t.domains[d.value] || d.value}</span>
          </button>
        );
      })}
    </div>
  );
}
