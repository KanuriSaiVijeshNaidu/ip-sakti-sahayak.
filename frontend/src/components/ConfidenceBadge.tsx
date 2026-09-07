"use client";

import React from "react";
import { ShieldCheck, ShieldExclamation, ShieldX, InfoCircleFill } from "react-bootstrap-icons";
import { ConfidenceExplanation } from "@/types";

interface Props {
  confidence: ConfidenceExplanation;
}

export default function ConfidenceBadge({ confidence }: Props) {
  const isHigh = confidence.level === "HIGH";
  const isMed = confidence.level === "MEDIUM";

  const badgeColor = isHigh
    ? "bg-emerald-950/40 border-emerald-500/60 text-emerald-300"
    : isMed
    ? "bg-amber-950/40 border-amber-500/60 text-amber-300"
    : "bg-red-950/40 border-red-500/60 text-red-300";

  const icon = isHigh ? (
    <ShieldCheck className="w-4 h-4 text-emerald-400" />
  ) : isMed ? (
    <ShieldExclamation className="w-4 h-4 text-amber-400" />
  ) : (
    <ShieldX className="w-4 h-4 text-red-400" />
  );

  return (
    <div className={`p-3 rounded-xl border text-xs ${badgeColor} space-y-2`}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 font-bold tracking-wide uppercase">
          {icon}
          <span>Statutory Grounding Confidence: {confidence.level} ({Math.round(confidence.score * 100)}%)</span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 border border-current">
          Cross-Checked
        </span>
      </div>

      {confidence.reasons_positive && confidence.reasons_positive.length > 0 && (
        <ul className="text-[11px] text-slate-300 space-y-0.5 list-disc list-inside">
          {confidence.reasons_positive.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      )}

      {confidence.warnings && confidence.warnings.length > 0 && (
        <div className="pt-1 border-t border-white/10 text-[11px] text-amber-300/90 space-y-0.5">
          <div className="font-semibold flex items-center gap-1">
            <InfoCircleFill className="w-3 h-3 text-amber-400" />
            <span>Evidentiary Cautions:</span>
          </div>
          <ul className="list-disc list-inside text-[10px] text-amber-200/80">
            {confidence.warnings.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
