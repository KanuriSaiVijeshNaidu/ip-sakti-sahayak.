"use client";

import React, { useState } from "react";
import Link from "next/link";
import { HouseDoorFill, Flower1, ShieldCheck, ArrowRight } from "react-bootstrap-icons";
import FormulationAnalyzer from "@/components/FormulationAnalyzer";
import { FormulationAnalysisResponse } from "@/types";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function FormulationAnalyzerPage() {
  const [analyzedData, setAnalyzedData] = useState<FormulationAnalysisResponse | null>(null);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col">
      <Navbar />

      {/* Main Container */}
      <main className="w-full max-w-5xl flex flex-col gap-6 p-4 sm:p-6">
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
      <Footer />
    </div>
  );
}
