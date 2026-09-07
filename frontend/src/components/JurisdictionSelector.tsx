"use client";

import React from "react";
import { Globe2 } from "react-bootstrap-icons";
import { JurisdictionType } from "@/types";

interface Props {
  selected: JurisdictionType | "COMPARE";
  onChange: (val: JurisdictionType | "COMPARE") => void;
}

const JURISDICTIONS = [
  { code: "IN", label: "India (CGPDTM)", flag: "🇮🇳" },
  { code: "US", label: "United States (USPTO)", flag: "🇺🇸" },
  { code: "EU", label: "Germany / Europe (EPO)", flag: "🇪🇺" },
  { code: "WO", label: "WIPO / PCT", flag: "🌐" },
  { code: "COMPARE", label: "Compare Matrix", flag: "⚖️" },
];

export default function JurisdictionSelector({ selected, onChange }: Props) {
  return (
    <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 border border-slate-800 rounded-xl overflow-x-auto max-w-full text-xs">
      <div className="px-2 py-1 text-slate-400 font-bold flex items-center gap-1 shrink-0 text-[11px]">
        <Globe2 className="w-3.5 h-3.5 text-emerald-400" />
        <span className="hidden sm:inline">Jurisdiction:</span>
      </div>

      {JURISDICTIONS.map((j) => {
        const isActive = selected === j.code;
        return (
          <button
            key={j.code}
            type="button"
            onClick={() => onChange(j.code as any)}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
              isActive
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-300 hover:text-white hover:bg-slate-800/80"
            }`}
          >
            <span>{j.flag}</span>
            <span>{j.label}</span>
          </button>
        );
      })}
    </div>
  );
}
