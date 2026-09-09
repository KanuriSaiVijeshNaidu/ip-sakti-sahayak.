"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShieldCheck, Search, Loader2, Sparkles, Scale, AlertTriangle } from "lucide-react";
import { PatentabilityResponse } from "@/types";
import { assessPatentability } from "@/lib/api";
import PatentabilityScore from "@/components/PatentabilityScore";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PatentabilityPage() {
  const [inventionTitle, setInventionTitle] = useState("Synergistic Polyherbal Bio-Enhancement Formulation");
  const [abstract, setAbstract] = useState("A synergistic herbal composition comprising Curcuma longa (Turmeric) rhizome extract and Piper nigrum (Black Pepper) fruit extract formulated for enhanced bioavailability and therapeutic synergy.");
  const [ingredientsText, setIngredientsText] = useState("Turmeric, Black Pepper, Dry Ginger");
  const [userRole, setUserRole] = useState("attorney");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PatentabilityResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAssess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inventionTitle.trim()) {
      setError("Please specify the invention title.");
      return;
    }

    setLoading(true);
    setError(null);

    const ingredientsList = ingredientsText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      const res = await assessPatentability({
        invention_title: inventionTitle,
        abstract_or_summary: abstract,
        ingredients: ingredientsList,
        is_combination: ingredientsList.length > 1,
        jurisdiction: "IN",
        user_role: userRole,
      });
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to assess patentability.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col">
      <Navbar />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
        
        {/* Header */}
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold mb-2 shadow-xs">
            <Sparkles className="w-3 h-3 text-emerald-600" />
            <span>Statutory Patentability Screening · India CGPDTM</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Patentability & Prior-Art Assessment
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Screen formulations against Section 3(e) synergistic admixture bars, Section 3(p) TKDL public domain exclusions, and Section 10(4) biological source disclosures.
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleAssess} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 text-left">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm border-b border-slate-100 pb-2.5">
            <Scale className="w-4 h-4 text-emerald-800" />
            <h2>Statutory Screening Parameters</h2>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Invention Title
              </label>
              <input
                type="text"
                value={inventionTitle}
                onChange={(e) => setInventionTitle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Applicant Role
              </label>
              <select
                value={userRole}
                onChange={(e) => setUserRole(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 transition-all"
              >
                <option value="attorney">Patent Attorney / IP Agent</option>
                <option value="vaidya">Ayurvedic Doctor / Vaidya</option>
                <option value="manufacturer">AYUSH Manufacturer / Enterprise</option>
                <option value="researcher">Scientist / R&D Researcher</option>
                <option value="citizen">Citizen / Inventor</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Active Botanical / Mineral Ingredients (Comma-separated)
            </label>
            <input
              type="text"
              value={ingredientsText}
              onChange={(e) => setIngredientsText(e.target.value)}
              placeholder="e.g. Turmeric, Black Pepper, Ashwagandha"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Specification Abstract / Technical Claims Summary
            </label>
            <textarea
              rows={3}
              value={abstract}
              onChange={(e) => setAbstract(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 transition-all resize-none"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-2.5 bg-emerald-800 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>{loading ? "Screening Statutes..." : "Assess Statutory Patentability"}</span>
            </button>
          </div>
        </form>

        {/* Results */}
        {result && <PatentabilityScore res={result} />}
      </main>

      <Footer />
    </div>
  );
}
