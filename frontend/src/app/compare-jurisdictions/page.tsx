"use client";

import React, { useState } from "react";
import Link from "next/link";
import { HouseDoorFill, Globe2, Search, ArrowRepeat, CheckCircleFill } from "react-bootstrap-icons";
import { JurisdictionComparisonResponse } from "@/types";
import { compareJurisdictions } from "@/lib/api";
import ActionPlan from "@/components/ActionPlan";
import EvidencePanel from "@/components/EvidencePanel";
import PatentFamilyGraph from "@/components/PatentFamilyGraph";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function CompareJurisdictionsPage() {
  const [title, setTitle] = useState("Synergistic Polyherbal Anti-Inflammatory Formulation");
  const [ingredientsText, setIngredientsText] = useState("Curcuma longa, Piper nigrum, Zingiber officinale");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<JurisdictionComparisonResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCompare = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const list = ingredientsText.split(",").map((s) => s.trim()).filter(Boolean);

    try {
      const res = await compareJurisdictions({
        invention_title: title,
        ingredients: list,
      });
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to compare jurisdictions.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col">
      <Navbar />

      <main className="w-full max-w-5xl flex flex-col gap-6 text-left p-4 sm:p-6">
        {/* Form */}
        <form onSubmit={handleCompare} className="bg-white border border-[#e0e3d8] rounded-3xl p-6 shadow-soft space-y-4">
          <div>
            <h2 className="text-base font-bold text-[#2e412e] flex items-center gap-2">
              <Globe2 className="w-5 h-5 text-blue-400" />
              <span>Cross-Jurisdiction Statutory Comparative Matrix</span>
            </h2>
            <p className="text-xs text-[#6b7280] mt-0.5">
              Side-by-side legal analysis comparing India (CGPDTM), USA (USPTO), Europe (EPO), and WIPO/PCT
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-800 text-xs text-red-300">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-[#374e37] block mb-1">
                Invention Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#fbfbf9] border border-[#e0e3d8] rounded-full px-4 py-2 text-xs text-[#2e412e] focus:outline-none focus:border-[#6d976d] focus:ring-2 focus:ring-[#6d976d]/20 transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#374e37] block mb-1">
                Ingredients (Comma-separated)
              </label>
              <input
                type="text"
                value={ingredientsText}
                onChange={(e) => setIngredientsText(e.target.value)}
                className="w-full bg-[#fbfbf9] border border-[#e0e3d8] rounded-full px-4 py-2 text-xs text-[#2e412e] focus:outline-none focus:border-[#6d976d] focus:ring-2 focus:ring-[#6d976d]/20 transition-all"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-2.5 bg-[#436143] hover:bg-[#374e37] text-white font-semibold text-xs rounded-full transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? <ArrowRepeat className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>Compare Across IN, US, EP & WIPO</span>
            </button>
          </div>
        </form>

        {/* Results */}
        {result && (
          <div className="space-y-6">
            {/* Overall Summary */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 text-xs text-slate-200 leading-relaxed shadow-xl space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-400 block">
                Comparative Executive Summary
              </span>
              <p>{result.overall_summary}</p>
            </div>

            {/* Side-by-Side Matrix Table */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 shadow-2xl backdrop-blur-xl overflow-x-auto">
              <h3 className="text-sm font-bold text-white mb-4">
                Statutory Comparison Matrix
              </h3>
              <table className="w-full text-xs text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                    <th className="py-2.5 pr-4">Dimension</th>
                    <th className="py-2.5 px-3 bg-slate-950/40 rounded-t-lg">🇮🇳 India (CGPDTM)</th>
                    <th className="py-2.5 px-3">🇺🇸 United States (USPTO)</th>
                    <th className="py-2.5 px-3 bg-slate-950/40 rounded-t-lg">🇪🇺 Europe (EPO)</th>
                    <th className="py-2.5 pl-3">🌐 WIPO / PCT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {result.comparison_matrix.map((row, idx) => (
                    <tr key={idx} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 pr-4 font-bold text-slate-200 align-top max-w-[160px]">
                        <div>{row.dimension}</div>
                        <div className="text-[10px] font-mono text-emerald-400/80 mt-1">
                          {row.evidence_citation}
                        </div>
                      </td>
                      <td className="py-3 px-3 bg-slate-950/30 text-slate-300 align-top leading-snug">
                        {row.india}
                      </td>
                      <td className="py-3 px-3 text-slate-300 align-top leading-snug">
                        {row.usa}
                      </td>
                      <td className="py-3 px-3 bg-slate-950/30 text-slate-300 align-top leading-snug">
                        {row.europe}
                      </td>
                      <td className="py-3 pl-3 text-slate-300 align-top leading-snug">
                        {row.wipo_pct}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Patent Family Lineage */}
            <PatentFamilyGraph inventionTitle={result.invention_title} />

            {/* Action Plan */}
            <ActionPlan steps={result.action_plan} />

            {/* Evidence Panel */}
            <EvidencePanel evidence={result.evidence} />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
