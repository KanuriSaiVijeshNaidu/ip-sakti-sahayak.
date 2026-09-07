"use client";

import React, { useState } from "react";
import Link from "next/link";
import { HouseDoorFill, Flower1, ShieldCheck, ArrowRight } from "react-bootstrap-icons";
import FormulationAnalyzer from "@/components/FormulationAnalyzer";
import { FormulationAnalysisResponse } from "@/types";

export default function FormulationAnalyzerPage() {
  const [analyzedData, setAnalyzedData] = useState<FormulationAnalysisResponse | null>(null);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center px-4 py-8 relative">
      {/* Top Navbar */}
      <header className="w-full max-w-5xl flex items-center justify-between pb-6 border-b border-slate-800/80 mb-8">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
            अ
          </div>
          <div>
            <h1 className="text-base font-bold text-white flex items-center gap-2">
              <span>AYURLEX</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                FORMULATION ANALYZER
              </span>
            </h1>
            <p className="text-[10px] text-slate-400">Ministry of Ayush · SIH26045</p>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/patentability"
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-700 transition-all"
          >
            <span>Patentability</span>
            <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 rounded-xl border border-slate-700 transition-all"
          >
            <HouseDoorFill className="w-3.5 h-3.5 text-emerald-400" />
            <span>Chat Workspace</span>
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-5xl flex flex-col gap-6">
        <FormulationAnalyzer onAnalyzed={setAnalyzedData} />

        {/* Quick Link to Patentability Assessment */}
        {analyzedData && (
          <div className="bg-emerald-950/30 border border-emerald-800/40 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-300 shadow-xl">
            <div>
              <h4 className="text-sm font-bold text-white">Proceed to Patentability Assessment</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Evaluate Section 3(e) synergistic admixture and Section 3(p) TKDL bars for {analyzedData.formulation_name}
              </p>
            </div>
            <Link
              href="/patentability"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all shadow-md shrink-0 flex items-center gap-2"
            >
              <span>Assess Patentability</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
