"use client";

import React, { useState } from "react";
import Link from "next/link";
import { HouseDoorFill, Search, ArrowRepeat, ShieldExclamation } from "react-bootstrap-icons";
import { TKRiskResponse } from "@/types";
import { assessTKRisk } from "@/lib/api";
import TKRiskPanel from "@/components/TKRiskPanel";

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
                TK RISK ENGINE
              </span>
            </h1>
            <p className="text-[10px] text-slate-400">Ministry of Ayush · SIH26045</p>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/formulation-analyzer"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-700 transition-all"
          >
            <span>Formulation Analyzer</span>
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

      <main className="w-full max-w-5xl flex flex-col gap-6">
        <form onSubmit={handleAssess} className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 shadow-2xl backdrop-blur-xl space-y-4 text-left">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldExclamation className="w-5 h-5 text-purple-400" />
              <span>Traditional Knowledge & TKDL Risk Auditor</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Identifies classical Ayurvedic prior-art overlap across AFI, API, Charaka Samhita, and CSIR-TKDL codifications
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-800 text-xs text-red-300">
              {error}
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Active Botanical / Mineral Ingredients (Comma-separated)
            </label>
            <input
              type="text"
              value={ingredientsText}
              onChange={(e) => setIngredientsText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
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
