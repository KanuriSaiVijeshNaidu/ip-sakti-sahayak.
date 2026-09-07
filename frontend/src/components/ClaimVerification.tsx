"use client";

import React from "react";
import { CheckCircleFill, ExclamationTriangleFill, XCircleFill } from "react-bootstrap-icons";
import { ClaimVerification as ClaimType } from "@/types";

interface Props {
  verifications: ClaimType[];
}

export default function ClaimVerification({ verifications }: Props) {
  if (!verifications || verifications.length === 0) return null;

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 shadow-xl backdrop-blur-xl text-left space-y-4">
      <div>
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <span>Statutory Proposition Entailment Audit</span>
        </h3>
        <p className="text-[11px] text-slate-400 mt-0.5">
          Verification of legal assertions directly against retrieved gazette text
        </p>
      </div>

      <div className="space-y-2.5">
        {verifications.map((claim, idx) => {
          const isSupported = claim.status === "SUPPORTED";
          const isPartial = claim.status === "PARTIALLY_SUPPORTED";

          const statusBadge = isSupported
            ? "bg-emerald-950/80 text-emerald-300 border-emerald-700/60"
            : isPartial
            ? "bg-amber-950/80 text-amber-300 border-amber-700/60"
            : "bg-red-950/80 text-red-300 border-red-700/60";

          const icon = isSupported ? (
            <CheckCircleFill className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          ) : isPartial ? (
            <ExclamationTriangleFill className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          ) : (
            <XCircleFill className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          );

          return (
            <div
              key={idx}
              className="bg-slate-950/60 border border-slate-800/90 rounded-xl p-3 text-xs space-y-2"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  {icon}
                  <span className="font-semibold text-slate-200">{claim.claim_text}</span>
                </div>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border shrink-0 ${statusBadge}`}>
                  {claim.status}
                </span>
              </div>

              {claim.supporting_passage && (
                <div className="pl-6 text-[11px] text-slate-400 font-mono bg-black/30 p-2.5 rounded-lg border border-white/5">
                  <p className="text-slate-300 italic">"{claim.supporting_passage}"</p>
                  {claim.source_title && (
                    <p className="mt-1 text-emerald-400/80 text-[10px]">
                      Source: {claim.source_title} {claim.section ? `(${claim.section})` : ""}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
