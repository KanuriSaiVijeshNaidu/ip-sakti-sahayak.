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
    <div className="flex flex-wrap sm:flex-nowrap items-center gap-1.5 py-0.5 w-full sm:overflow-x-auto no-scrollbar">
      {DOMAIN_KEYS.map((d) => {
        const isSelected = value === d.value;
        return (
          <button
            key={d.value}
            onClick={() => onChange(d.value as DomainType | "auto")}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold pill-spring border flex items-center gap-1.5 cursor-pointer select-none whitespace-nowrap shrink-0 ${
              isSelected
                ? "bg-white text-black border-white shadow-md font-bold scale-100"
                : "bg-zinc-900/90 text-zinc-400 border-zinc-800 hover:border-zinc-600 hover:text-white"
            }`}
          >
            {d.isDot ? (
              <span className={`text-[9px] ${isSelected ? "text-black" : "text-zinc-400"}`}>
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
