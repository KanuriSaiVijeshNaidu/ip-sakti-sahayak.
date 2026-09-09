"use client";

import React, { useState } from "react";
import Link from "next/link";
import { HouseDoorFill, Search, ArrowRepeat, ShieldExclamation } from "react-bootstrap-icons";
import { TKRiskResponse } from "@/types";
import { assessTKRisk } from "@/lib/api";
import TKRiskPanel from "@/components/TKRiskPanel";
import UnifiedHubNav from "@/components/UnifiedHubNav";

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
    <div className="min-h-screen bg-[#fbfbf9] text-[#27272a] flex flex-col items-center relative">
      <UnifiedHubNav />

      <main className="w-full max-w-5xl flex flex-col gap-6">
        <form onSubmit={handleAssess} className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 shadow-2xl backdrop-blur-xl space-y-4 text-left">
          <div>
            <h2 className="text-base font-bold text-[#2e412e] flex items-center gap-2">
              <ShieldExclamation className="w-5 h-5 text-purple-400" />
              <span>Traditional Knowledge & TKDL Risk Auditor</span>
            </h2>
            <p className="text-xs text-[#6b7280] mt-0.5">
              Identifies classical Ayurvedic prior-art overlap across AFI, API, Charaka Samhita, and CSIR-TKDL codifications
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-800 text-xs text-red-300">
              {error}
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-[#374e37] block mb-1">
              Active Botanical / Mineral Ingredients (Comma-separated)
            </label>
            <input
              type="text"
              value={ingredientsText}
              onChange={(e) => setIngredientsText(e.target.value)}
              className="w-full bg-[#fbfbf9] border border-[#e0e3d8] rounded-full px-4 py-2.5 text-xs text-[#2e412e] focus:outline-none focus:border-[#6d976d] focus:ring-2 focus:ring-[#6d976d]/20 transition-all"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? <ArrowRepeat className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>Audit Traditional Knowledge Overlap</span>
            </button>
          </div>
        </form>

        {result && <TKRiskPanel data={result} />}
      </main>
    </div>
  );
}
