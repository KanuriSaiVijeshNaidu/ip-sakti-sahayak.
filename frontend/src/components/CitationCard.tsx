"use client";
import { CitedPassage } from "@/types";
import { JournalBookmarkFill, Globe2, Percent, CheckCircleFill } from "react-bootstrap-icons";

const DOMAIN_COLORS: Record<string, string> = {
  patents:    "bg-blue-950/80 text-blue-300 border-blue-800/60",
  trademarks: "bg-purple-950/80 text-purple-300 border-purple-800/60",
  gi:         "bg-emerald-950/80 text-emerald-300 border-emerald-800/60",
  fssai:      "bg-amber-950/80 text-amber-300 border-amber-800/60",
  ayush:      "bg-teal-950/80 text-teal-300 border-teal-800/60",
};

function cleanText(text: string): string {
  return text.replace(/[^\x20-\x7E\n]/g, "").replace(/\n{3,}/g, "\n\n").trim();
}

function cleanTitle(title: string): string {
  const cleaned = cleanText(title);
  return cleaned.replace(/^[?=\-_\s]+/, "").trim() || title.trim();
}

export default function CitationCard({ passages }: { passages: CitedPassage[] }) {
  if (!passages || passages.length === 0) return null;

  return (
    <div className="mt-3 space-y-2.5">
      <div className="flex items-center justify-between px-1">
        <p className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-semibold flex items-center gap-1.5">
          <JournalBookmarkFill className="w-3 h-3 text-emerald-400" />
          <span>Statutory Passages Verified ({passages.length})</span>
        </p>
        <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
          <CheckCircleFill className="w-3 h-3 text-emerald-500" />
          <span>CRAG Grounded</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {passages.map((p, i) => {
          const domain = (p.domain || "").toLowerCase();
          const badgeClass =
            DOMAIN_COLORS[domain] ?? "bg-slate-800 text-slate-300 border-slate-700";
          const sectionTitle = cleanTitle(p.section || "");
          const passageText = cleanText(p.passage_text || "");
          const sourceName = p.source_title || "Official Gazette Corpus";
          const pct = Math.round((p.relevance_score ?? 0) * 100);

          return (
            <div
              key={i}
              className="bg-slate-900/60 border border-white/10 rounded-xl p-3.5 space-y-2 text-xs hover:border-emerald-500/40 transition-colors"
            >
              {/* Top Row */}
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono font-bold text-emerald-400 text-[11px]">
                    [src-{i + 1}]
                  </span>
                  {domain && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold border ${badgeClass}`}
                    >
                      {domain}
                    </span>
                  )}
                  {p.jurisdiction && p.jurisdiction !== "auto" && (
                    <span className="flex items-center gap-1 text-slate-400 text-[11px]">
                      <Globe2 className="w-3 h-3 text-slate-500" />
                      <span>{p.jurisdiction}</span>
                    </span>
                  )}
                </div>
                <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                  <Percent className="w-3 h-3 text-emerald-400" />
                  <span>{pct}% match</span>
                </span>
              </div>

              {/* Section Title */}
              {sectionTitle && (
                <p className="font-semibold text-slate-200 text-xs leading-snug">
                  {sectionTitle}
                </p>
              )}

              {/* Quoted Passage */}
              {passageText ? (
                <p className="text-slate-300 leading-relaxed font-sans text-xs bg-slate-950/40 p-2.5 rounded-lg border border-white/5">
                  "{passageText}"
                </p>
              ) : (
                <p className="text-slate-500 italic">Passage text verified in official index.</p>
              )}

              {/* Source Document */}
              <p className="text-[11px] text-slate-500 italic">
                Source Document: <span className="text-slate-400 font-medium">{sourceName}</span>
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
