"use client";
import { DomainType, LanguageCode } from "@/types";
import { getTranslation } from "@/lib/i18n";

const DOMAIN_KEYS: { value: DomainType | "auto"; emoji: string; label: string }[] = [
  { value: "auto",       emoji: "✦",  label: "All Domains" },
  { value: "patents",    emoji: "💡", label: "Patents" },
  { value: "trademarks", emoji: "™️",  label: "Trademarks" },
  { value: "gi",         emoji: "🌿", label: "GI Tags" },
  { value: "fssai",      emoji: "🏷️",  label: "FSSAI" },
  { value: "ayush",      emoji: "🌺", label: "AYUSH" },
];

interface Props {
  value: DomainType | "auto";
  onChange: (d: DomainType | "auto") => void;
  language?: LanguageCode;
}

export default function DomainSelector({ value, onChange, language = "en" }: Props) {
  const t = getTranslation(language);

  return (
    <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-950/70 border border-white/10 rounded-2xl backdrop-blur-md">
      {DOMAIN_KEYS.map((d) => {
        const isSelected = value === d.value;
        return (
          <button
            key={d.value}
            onClick={() => onChange(d.value as DomainType | "auto")}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
              isSelected
                ? "bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-semibold shadow-emerald-glow border border-emerald-400/40 scale-102"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent"
            }`}
          >
            <span className="text-xs">{d.emoji}</span>
            <span>{t.domains[d.value] || d.label}</span>
          </button>
        );
      })}
    </div>
  );
}
