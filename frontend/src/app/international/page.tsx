"use client";

import React, { useState } from "react";
import Link from "next/link";
import { HouseDoorFill, Globe2, Diagram3Fill } from "react-bootstrap-icons";
import PatentFamilyGraph from "@/components/PatentFamilyGraph";

export default function InternationalPage() {
  const [invention, setInvention] = useState("Synergistic Polyherbal Composition");

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
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800">
                INTERNATIONAL IP & PCT
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
            <span>Compare Matrix</span>
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
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 shadow-2xl backdrop-blur-xl space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Globe2 className="w-5 h-5 text-blue-400" />
            <span>International Patent Family Lineage & PCT Filing Protocol</span>
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            AYURLEX international patent intelligence tracks Indian priority filings across the WIPO Patent Cooperation Treaty (PCT) framework, United States Patent & Trademark Office (USPTO), and European Patent Office (EPO).
          </p>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Invention Title
            </label>
            <input
              type="text"
              value={invention}
              onChange={(e) => setInvention(e.target.value)}
              className="w-full max-w-lg bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <PatentFamilyGraph inventionTitle={invention} />
      </main>
    </div>
  );
}
