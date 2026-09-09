"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BookOpen, Search, Loader2, Sparkles, ShieldAlert, AlertTriangle } from "lucide-react";
import { TKRiskResponse } from "@/types";
import { assessTKRisk } from "@/lib/api";
import TKRiskPanel from "@/components/TKRiskPanel";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TKRiskPage() {
  const [ingredientsText, setIngredientsText] = useState("Turmeric, Black Pepper, Ashwagandha");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TKRiskResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAssess = async (e: React.FormEvent) => {
    e.preventDefault();
    const list = ingredientsText.split(",").map((s) => s.trim()).filter(Boolean);
    if (list.length === 0) {
      setError("Please add at least one ingredient.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await assessTKRisk({
        ingredients: list,
      });
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to assess TK risk.");
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
            <span>Traditional Knowledge & Classical Treatises Screening</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Traditional Knowledge & TKDL Risk Auditor
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Screen herbal ingredients against Charaka Samhita, Sushruta Samhita, Ashtanga Hridaya, Bhavaprakasha, and CSIR-TKDL public domain codifications.
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleAssess} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 text-left">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm border-b border-slate-100 pb-2.5">
            <BookOpen className="w-4 h-4 text-emerald-800" />
            <h2>Botanical Ingredients Input</h2>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Active Botanical / Mineral Ingredients (Comma-separated)
            </label>
            <input
              type="text"
              value={ingredientsText}
              onChange={(e) => setIngredientsText(e.target.value)}
              placeholder="e.g. Turmeric, Black Pepper, Ashwagandha"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 transition-all"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-2.5 bg-emerald-800 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>{loading ? "Searching Samhitas..." : "Audit Traditional Knowledge Overlap"}</span>
            </button>
          </div>
        </form>

        {/* Results */}
        {result && <TKRiskPanel data={result} />}
      </main>

      <Footer />
    </div>
  );
}
