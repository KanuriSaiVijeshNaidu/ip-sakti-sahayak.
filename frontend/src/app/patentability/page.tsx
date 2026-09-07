"use client";

import React, { useState } from "react";
import Link from "next/link";
import { HouseDoorFill, Search, ArrowRepeat, ShieldLockFill, CheckCircleFill } from "react-bootstrap-icons";
import { PatentabilityResponse } from "@/types";
import { assessPatentability } from "@/lib/api";
import PatentabilityScore from "@/components/PatentabilityScore";

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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center px-4 py-8 relative">
      {/* Header */}
      <header className="w-full max-w-5xl flex items-center justify-between pb-6 border-b border-slate-800/80 mb-8">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
            अ
          </div>
          <div>
            <h1 className="text-base font-bold text-white flex items-center gap-2">
              <span>AYURLEX</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                PATENTABILITY ENGINE
              </span>
            </h1>
            <p className="text-[10px] text-slate-400">Ministry of Ayush · SIH26045</p>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/compare-jurisdictions"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-700 transition-all"
          >
            <span>Compare Jurisdictions</span>
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
        {/* Input Form */}
        <form onSubmit={handleAssess} className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 shadow-2xl backdrop-blur-xl space-y-4 text-left">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldLockFill className="w-5 h-5 text-emerald-400" />
              <span>Statutory Patentability Assessment Form</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Evaluates Section 3(e) admixture, Section 3(p) TKDL, Section 10(4) origin disclosure, and BDA Form III
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-800 text-xs text-red-300">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Invention Title
              </label>
              <input
                type="text"
                value={inventionTitle}
                onChange={(e) => setInventionTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Applicant Role
              </label>
              <select
                value={userRole}
                onChange={(e) => setUserRole(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
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
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Active Ingredients (Comma-separated)
            </label>
            <input
              type="text"
              value={ingredientsText}
              onChange={(e) => setIngredientsText(e.target.value)}
              placeholder="e.g. Turmeric, Black Pepper, Ashwagandha"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Specification Abstract / Technical Claims
            </label>
            <textarea
              rows={3}
              value={abstract}
              onChange={(e) => setAbstract(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-sans"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? <ArrowRepeat className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>Assess Statutory Patentability</span>
            </button>
          </div>
        </form>

        {/* Results */}
        {result && <PatentabilityScore res={result} />}
      </main>
    </div>
  );
}
