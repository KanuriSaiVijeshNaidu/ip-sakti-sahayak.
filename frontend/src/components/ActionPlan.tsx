"use client";

import React from "react";
import { CheckCircleFill, ExclamationCircleFill, ArrowRightCircleFill } from "react-bootstrap-icons";
import { ActionPlanStep } from "@/types";

interface Props {
  steps: ActionPlanStep[];
}

export default function ActionPlan({ steps }: Props) {
  if (!steps || steps.length === 0) return null;

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 shadow-xl backdrop-blur-xl text-left space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <CheckCircleFill className="w-4 h-4 text-emerald-400" />
            <span>Recommended Statutory Action Plan</span>
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Sequential compliance and examination steps ordered by statutory urgency
          </p>
        </div>
        <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 rounded">
          {steps.length} ACTIONABLE STEPS
        </span>
      </div>

      <div className="space-y-3">
        {steps.map((step) => {
          const isReq = step.urgency === "REQUIRED";
          const urgencyBadge = isReq
            ? "bg-red-950/60 text-red-300 border-red-800/80"
            : "bg-blue-950/60 text-blue-300 border-blue-800/80";

          return (
            <div
              key={step.step_number}
              className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-xs font-mono font-bold text-emerald-400 shrink-0 mt-0.5">
                  {step.step_number}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-2 flex-wrap">
                    <span>{step.title}</span>
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${urgencyBadge}`}>
                      {step.urgency}
                    </span>
                  </h4>
                  <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                    {step.description}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-400 flex-wrap">
                    <span className="text-emerald-400/90 font-medium">Authority: {step.authority_or_portal}</span>
                    {step.statutory_basis && (
                      <span className="font-mono bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                        {step.statutory_basis}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
