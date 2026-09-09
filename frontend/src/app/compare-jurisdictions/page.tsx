"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Globe, Search, Loader2, Sparkles, Scale, AlertTriangle, CheckCircle2 } from "lucide-react";
import { JurisdictionComparisonResponse } from "@/types";
import { compareJurisdictions } from "@/lib/api";
import ActionPlan from "@/components/ActionPlan";
import EvidencePanel from "@/components/EvidencePanel";
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

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6 text-left">
        
        {/* Header */}
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold mb-2 shadow-xs">
            <Sparkles className="w-3 h-3 text-emerald-600" />
            <span>Cross-Border Sovereign Statutory Isolation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Cross-Jurisdiction Statutory Comparative Matrix
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Side-by-side legal comparison between India (CGPDTM & AYUSH), United States (USPTO & FDA), European Union (EPO & EMA), and WIPO/PCT.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleCompare} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm border-b border-slate-100 pb-2.5">
            <Globe className="w-4 h-4 text-emerald-800" />
            <h2>Multi-Market Parameters</h2>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Invention / Formulation Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Ingredients (Latin Binomials)
              </label>
              <input
                type="text"
                value={ingredientsText}
                onChange={(e) => setIngredientsText(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 transition-all"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-2.5 bg-emerald-800 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>{loading ? "Comparing Statutes..." : "Compare Jurisdictions Side-by-Side"}</span>
            </button>
          </div>
        </form>

        {/* Comparison Result */}
        {result && (
          <div className="space-y-6 animate-in fade-in-50 duration-200">
            {/* Overall Summary Card */}
            {result.overall_summary && (
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
                <h3 className="font-bold text-sm text-slate-900">Comparative Legal Summary</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{result.overall_summary}</p>
              </div>
            )}

            {/* Matrix Table */}
            {result.comparison_matrix && result.comparison_matrix.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
                <div className="p-4 border-b border-slate-100 font-bold text-sm text-slate-900 flex items-center justify-between">
                  <span>Cross-Border Statutory Matrix</span>
                  <span className="text-xs text-slate-400 font-normal">India Primary · US · EU · WIPO</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                        <th className="p-3">Dimension</th>
                        <th className="p-3 bg-emerald-50/70 text-emerald-900">🇮🇳 India (CGPDTM)</th>
                        <th className="p-3">🇺🇸 USA (USPTO)</th>
                        <th className="p-3">🇪🇺 Europe (EPO)</th>
                        <th className="p-3">🌐 WIPO (PCT)</th>
                        <th className="p-3">Key Difference</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {result.comparison_matrix.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="p-3 font-semibold text-slate-800">{row.dimension}</td>
                          <td className="p-3 bg-emerald-50/30 font-medium text-emerald-950">{row.india}</td>
                          <td className="p-3 text-slate-600">{row.usa}</td>
                          <td className="p-3 text-slate-600">{row.europe}</td>
                          <td className="p-3 text-slate-600">{row.wipo_pct}</td>
                          <td className="p-3 text-slate-500 text-[11px]">{row.key_statutory_difference}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Action Plan */}
            {result.action_plan && result.action_plan.length > 0 && (
              <ActionPlan steps={result.action_plan} />
            )}

            {/* Evidence Panel */}
            {result.evidence && result.evidence.length > 0 && (
              <EvidencePanel evidence={result.evidence} />
            )}
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
