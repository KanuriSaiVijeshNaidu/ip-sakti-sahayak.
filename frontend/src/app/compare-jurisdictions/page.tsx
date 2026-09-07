"use client";

import React, { useState } from "react";
import Link from "next/link";
import { HouseDoorFill, Globe2, Search, ArrowRepeat, CheckCircleFill } from "react-bootstrap-icons";
import { JurisdictionComparisonResponse } from "@/types";
import { compareJurisdictions } from "@/lib/api";
import ActionPlan from "@/components/ActionPlan";
import EvidencePanel from "@/components/EvidencePanel";
import PatentFamilyGraph from "@/components/PatentFamilyGraph";

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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center px-4 py-8 relative">
      <header className="w-full max-w-5xl flex items-center justify-between pb-6 border-b border-slate-800/80 mb-8">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
            अ
          </div>
          <div>
            <h1 className="text-base font-bold text-white flex items-center gap-2">
              <span>AYURLEX</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                MULTI-JURISDICTION ENGINE
              </span>
            </h1>
            <p className="text-[10px] text-slate-400">Ministry of Ayush · SIH26045</p>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/international"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-700 transition-all"
          >
            <span>Patent Family</span>
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

      <main className="w-full max-w-5xl flex flex-col gap-6 text-left">
        {/* Form */}
        <form onSubmit={handleCompare} className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 shadow-2xl backdrop-blur-xl space-y-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Globe2 className="w-5 h-5 text-blue-400" />
              <span>Cross-Jurisdiction Statutory Comparative Matrix</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
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
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Invention Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Ingredients (Comma-separated)
              </label>
              <input
                type="text"
                value={ingredientsText}
                onChange={(e) => setIngredientsText(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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
    </div>
  );
}
