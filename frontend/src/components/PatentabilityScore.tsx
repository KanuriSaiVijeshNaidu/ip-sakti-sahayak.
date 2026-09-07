"use client";

import React from "react";
import { ShieldExclamation, CheckCircleFill, ExclamationTriangleFill, ShieldLockFill, LightbulbFill } from "react-bootstrap-icons";
import { PatentabilityResponse } from "@/types";
import ConfidenceBadge from "./ConfidenceBadge";
import AbstentionPanel from "./AbstentionPanel";
import ClaimVerification from "./ClaimVerification";
import ActionPlan from "./ActionPlan";
import EvidencePanel from "./EvidencePanel";

interface Props {
  res: PatentabilityResponse;
}

export default function PatentabilityScore({ res }: Props) {
  if (res.confidence.abstain) {
    return <AbstentionPanel message={res.confidence.abstention_message} />;
  }

  const isOverallHigh = res.overall_risk === "HIGH";
  const isOverallMed = res.overall_risk === "MEDIUM";

  const overallColor = isOverallHigh
    ? "from-red-950/60 via-red-900/30 to-slate-900 border-red-800/80 text-red-300"
    : isOverallMed
    ? "from-amber-950/60 via-amber-900/30 to-slate-900 border-amber-800/80 text-amber-300"
    : "from-emerald-950/60 via-emerald-900/30 to-slate-900 border-emerald-800/80 text-emerald-300";

  return (
    <div className="w-full space-y-5 text-left">
      {/* Hero Assessment Card */}
      <div className={`p-6 rounded-2xl border bg-gradient-to-br ${overallColor} shadow-2xl backdrop-blur-xl space-y-4`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-black/40 border border-current">
                Statutory Assessment
              </span>
              <span className="text-[10px] font-mono text-slate-400">Jurisdiction: IN (Patents Act 1970)</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white mt-1">
              {res.invention_title}
            </h2>
          </div>

          <div className="text-right shrink-0">
            <div className="text-[10px] uppercase font-bold tracking-wider opacity-80">
              Overall Rejection Risk
            </div>
            <div className="text-2xl font-black font-mono mt-0.5 tracking-tight">
              {res.overall_risk}
            </div>
          </div>
        </div>

        {/* 4 Pillars Statutory Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 text-center">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
              Section 3(e) Admixture
            </span>
            <span className={`text-sm font-bold font-mono block mt-1 ${res.section_3e_risk === "HIGH" ? "text-red-400" : "text-emerald-400"}`}>
              {res.section_3e_risk}
            </span>
            <span className="text-[9px] text-slate-400 mt-0.5 block">Synergy Threshold</span>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 text-center">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
              Section 3(p) TK Bar
            </span>
            <span className={`text-sm font-bold font-mono block mt-1 ${res.section_3p_risk === "HIGH" ? "text-red-400" : "text-emerald-400"}`}>
              {res.section_3p_risk}
            </span>
            <span className="text-[9px] text-slate-400 mt-0.5 block">TKDL Exclusions</span>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 text-center">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
              Novelty Risk
            </span>
            <span className={`text-sm font-bold font-mono block mt-1 ${res.novelty_risk === "HIGH" ? "text-red-400" : "text-emerald-400"}`}>
              {res.novelty_risk}
            </span>
            <span className="text-[9px] text-slate-400 mt-0.5 block">Prior-Art Clearance</span>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 text-center">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
              TK Overlap Tier
            </span>
            <span className="text-sm font-bold font-mono text-purple-300 block mt-1">
              {res.tk_risk}
            </span>
            <span className="text-[9px] text-slate-400 mt-0.5 block">Classical Treatises</span>
          </div>
        </div>

        {/* Biodiversity Box */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-300 leading-relaxed space-y-1">
          <div className="flex items-center gap-2 font-bold text-amber-300 text-[11px] uppercase tracking-wider">
            <ShieldLockFill className="w-3.5 h-3.5" />
            <span>Biological Diversity Act (BDA 2002) Audit</span>
          </div>
          <p className="text-[11px] text-slate-300">{res.biodiversity_review}</p>
        </div>

        {/* Role adapted guidance */}
        {res.role_adapted_guidance && (
          <div className="bg-emerald-950/30 border border-emerald-800/40 rounded-xl p-3.5 text-xs text-emerald-200 leading-relaxed space-y-1">
            <div className="flex items-center gap-2 font-bold text-emerald-300 text-[11px] uppercase tracking-wider">
              <LightbulbFill className="w-3.5 h-3.5 text-emerald-400" />
              <span>Tailored Professional Advisory Workflow</span>
            </div>
            <p className="text-[11px]">{res.role_adapted_guidance}</p>
          </div>
        )}
      </div>

      {/* Confidence Badge */}
      <ConfidenceBadge confidence={res.confidence} />

      {/* Claim Verifications */}
      <ClaimVerification verifications={res.claim_verifications} />

      {/* Action Plan */}
      <ActionPlan steps={res.action_plan} />

      {/* Evidence Panel */}
      <EvidencePanel evidence={res.evidence} />
    </div>
  );
}
