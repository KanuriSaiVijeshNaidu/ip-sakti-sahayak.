"use client";

import React from "react";
import { JournalBookmarkFill, ShieldLockFill, BoxArrowUpRight } from "react-bootstrap-icons";
import { CitedPassage } from "@/types";

interface Props {
  evidence: CitedPassage[];
}

export default function EvidencePanel({ evidence }: Props) {
  if (!evidence || evidence.length === 0) return null;

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 shadow-xl backdrop-blur-xl text-left space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <JournalBookmarkFill className="w-4 h-4 text-emerald-400" />
            <span>Authoritative Legal & Gazette Passages</span>
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Verified statutory clauses supporting current evaluation
          </p>
        </div>
        <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-slate-800 text-slate-300 rounded border border-slate-700">
          {evidence.length} CITATIONS
        </span>
      </div>

      <div className="space-y-3">
        {evidence.map((p, idx) => (
          <div
            key={idx}
            className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 space-y-2 text-xs hover:border-slate-700 transition-colors"
          >
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="font-bold text-slate-200 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-300 font-mono text-[10px] flex items-center justify-center border border-emerald-800">
                  {idx + 1}
                </span>
                <span>{p.source_title}</span>
              </div>
              <div className="flex items-center gap-2">
                {p.section && (
                  <span className="text-[10px] font-mono bg-emerald-950/60 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800/50">
                    {p.section}
                  </span>
                )}
                <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded">
                  Score: {Math.round(p.relevance_score * 100)}%
                </span>
              </div>
            </div>

            <p className="text-slate-300/90 leading-relaxed italic bg-black/30 p-2.5 rounded-lg border border-white/5 font-sans">
              "{p.passage_text}"
            </p>

            {p.source_url && (
              <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400">
                <span className="font-mono text-slate-500">Official Repository</span>
                <a
                  href={p.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
                >
                  <span>Official Gazette Link</span>
                  <BoxArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
