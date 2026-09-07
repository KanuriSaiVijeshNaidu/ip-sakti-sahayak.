"use client";

import React from "react";
import { ShieldExclamation, CheckCircleFill, ExclamationTriangleFill, BookHalf, BookmarkCheckFill } from "react-bootstrap-icons";
import { TKRiskResponse } from "@/types";

interface Props {
  data: TKRiskResponse;
}

export default function TKRiskPanel({ data }: Props) {
  const isConfirmed = data.overall_tk_risk === "CONFIRMED";
  const isLikely = data.overall_tk_risk === "LIKELY";
  const isPossible = data.overall_tk_risk === "POSSIBLE";

  const riskColor = isConfirmed
    ? "bg-red-950/40 border-red-800/80 text-red-300"
    : isLikely
    ? "bg-amber-950/40 border-amber-800/80 text-amber-300"
    : isPossible
    ? "bg-yellow-950/40 border-yellow-800/80 text-yellow-300"
    : "bg-emerald-950/40 border-emerald-800/80 text-emerald-300";

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 shadow-xl backdrop-blur-xl text-left space-y-5">
      {/* Header Banner */}
      <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${riskColor}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-black/40 flex items-center justify-center text-current border border-current shrink-0">
            <ShieldExclamation className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Traditional Knowledge Risk Tier: {data.overall_tk_risk}
            </h3>
            <p className="text-xs opacity-90 mt-0.5 font-mono">
              Defensive codification under Section 3(p) Patents Act & TKDL
            </p>
          </div>
        </div>
        <span className="text-xs font-mono font-bold px-3 py-1 rounded bg-black/60 border border-current">
          {data.overall_tk_risk}
        </span>
      </div>

      {/* Synthesis description */}
      <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 leading-relaxed">
        <p>{data.potential_traditional_knowledge_overlap}</p>
      </div>

      {/* Ingredient Overlap Table */}
      <div className="space-y-2.5">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <BookmarkCheckFill className="w-3.5 h-3.5 text-emerald-400" />
          <span>Ingredient-Level Classical Corroboration</span>
        </h4>

        <div className="space-y-2">
          {data.ingredient_risks.map((item, idx) => {
            const isHerbHigh = item.risk_level === "CONFIRMED" || item.risk_level === "LIKELY";
            const herbBadge = isHerbHigh
              ? "bg-red-950/70 text-red-300 border-red-800"
              : item.risk_level === "POSSIBLE"
              ? "bg-amber-950/70 text-amber-300 border-amber-800"
              : "bg-slate-800 text-slate-300 border-slate-700";

            return (
              <div
                key={idx}
                className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="font-bold text-white flex items-center gap-2 flex-wrap">
                    <span>{item.ingredient}</span>
                    <span className="text-[11px] font-mono text-emerald-400/90 italic">
                      ({item.botanical_name})
                    </span>
                    <span className="text-[10px] text-amber-300/90 font-mono">
                      {item.traditional_name}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">{item.rationale}</p>
                  {item.classical_source && (
                    <span className="inline-block mt-1 text-[10px] font-mono text-purple-300 bg-purple-950/50 px-2 py-0.5 rounded border border-purple-800/40">
                      Classical Source: {item.classical_source}
                    </span>
                  )}
                </div>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border shrink-0 ${herbBadge}`}>
                  {item.risk_level}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Classical Formulation Matches */}
      {data.classical_formulation_matches && data.classical_formulation_matches.length > 0 && (
        <div className="space-y-2 bg-purple-950/20 border border-purple-800/40 rounded-xl p-4 text-xs">
          <h4 className="font-bold text-purple-200 flex items-center gap-2">
            <BookHalf className="w-4 h-4 text-purple-400" />
            <span>Classical Ayurvedic Formulation Matches (AFI / Charaka / Sushruta)</span>
          </h4>
          <ul className="list-disc list-inside space-y-1 text-[11px] text-purple-300/90">
            {data.classical_formulation_matches.map((cfm, idx) => (
              <li key={idx}>{cfm}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Historical Revocation Precedents */}
      {data.historical_revocation_precedents && data.historical_revocation_precedents.length > 0 && (
        <div className="space-y-2 bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-xs">
          <h4 className="font-bold text-slate-300 flex items-center gap-2 text-[11px] uppercase tracking-wider">
            <span>Historical CSIR / TKDL Revocation Precedents</span>
          </h4>
          <ul className="space-y-1 text-[11px] text-slate-400 list-disc list-inside font-mono">
            {data.historical_revocation_precedents.map((prec, idx) => (
              <li key={idx}>{prec}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
