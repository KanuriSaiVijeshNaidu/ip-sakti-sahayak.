"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import FormulationAnalyzer from "@/components/FormulationAnalyzer";
import { FormulationAnalysisResponse } from "@/types";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function FormulationAnalyzerPage() {
  const [analyzedData, setAnalyzedData] = useState<FormulationAnalysisResponse | null>(null);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col">
      <Navbar />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold mb-2 shadow-xs">
            <Sparkles className="w-3 h-3 text-emerald-600" />
            <span>Classical Botanical Extraction & Admixture Analyzer</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Formulation Composition Analyzer
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Analyze complex polyherbal combinations against AFI monographs, Ayurvedic Pharmacopoeia of India, and modern pharmacological literature.
          </p>
        </div>

        <FormulationAnalyzer onAnalyzed={setAnalyzedData} />

        {analyzedData && (
          <div className="bg-white border border-emerald-200 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs shadow-xs">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Proceed to Patentability Assessment</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Evaluate Section 3(e) synergistic admixture and Section 3(p) TKDL bars for {analyzedData.formulation_name}
              </p>
            </div>
            <Link
              href="/patentability"
              className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-xs shrink-0 flex items-center gap-2"
            >
              <span>Assess Patentability</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
