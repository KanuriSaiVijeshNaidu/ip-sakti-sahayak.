"use client";

import React from "react";
import { Diagram3Fill, ShieldCheck, BoxArrowUpRight } from "react-bootstrap-icons";

interface Props {
  inventionTitle?: string;
}

export default function PatentFamilyGraph({
  inventionTitle = "Polyherbal Synergistic Composition",
}: Props) {
  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 shadow-2xl backdrop-blur-xl text-left space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Diagram3Fill className="w-4 h-4 text-emerald-400" />
            <span>International Patent Family Lineage</span>
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Priority application, PCT international phase, and national designations
          </p>
        </div>
        <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-purple-950 text-purple-300 border border-purple-800 rounded">
          PCT ARTICLE 8 COMPLIANT
        </span>
      </div>

      {/* Visual Family Tree */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 font-mono text-xs space-y-4">
        {/* Priority */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-950/80 border border-emerald-700 flex items-center justify-center text-emerald-400 font-bold shrink-0">
            IN
          </div>
          <div>
            <div className="font-bold text-white flex items-center gap-2">
              <span>First Priority Filing (India - Form 1/2)</span>
              <span className="text-[10px] text-emerald-400 font-normal">Day 0</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Discloses formulation, Section 10(4) biological source origin, and Form III NBA undertaking.
            </p>
          </div>
        </div>

        <div className="pl-4 text-slate-600">↓ 12-Month Convention Window</div>

        {/* PCT */}
        <div className="flex items-center gap-3 pl-4">
          <div className="w-9 h-9 rounded-xl bg-blue-950/80 border border-blue-700 flex items-center justify-center text-blue-400 font-bold shrink-0">
            WO
          </div>
          <div>
            <div className="font-bold text-white flex items-center gap-2">
              <span>PCT International Phase (WIPO)</span>
              <span className="text-[10px] text-blue-400 font-normal">Month 12</span>
            </div>
            <p className="text-[11px] text-slate-400">
              International Search Authority (ISA) & Written Opinion (IPER) evaluating novelty & inventive step.
            </p>
          </div>
        </div>

        <div className="pl-8 text-slate-600">↓ 30/31-Month National Phase Entry</div>

        {/* National Phases */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pl-8">
          <div className="bg-slate-900 border border-slate-700/80 p-3 rounded-xl space-y-1">
            <div className="font-bold text-white flex items-center gap-1.5">
              <span>🇺🇸 United States (USPTO)</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-snug">
              35 U.S.C. 101 subject matter eligibility & 102 prior art clearance against classical publications.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-700/80 p-3 rounded-xl space-y-1">
            <div className="font-bold text-white flex items-center gap-1.5">
              <span>🇪🇺 Europe (EPO / EPC)</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-snug">
              EPC Article 54 novelty & Article 56 problem-solution approach. Synergistic evidence review.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-700/80 p-3 rounded-xl space-y-1">
            <div className="font-bold text-white flex items-center gap-1.5">
              <span>🇩🇪 Germany (DPMA)</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-snug">
              Direct German national phase / validation under European Patent (DE) validation rules.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
