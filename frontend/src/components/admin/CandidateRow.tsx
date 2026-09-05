"use client";
import { RetrievalCandidate } from "@/types";
import ScoreBar from "./ScoreBar";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const DOMAIN_BADGE: Record<string, string> = {
  patents:    "bg-blue-100 text-blue-700",
  trademarks: "bg-purple-100 text-purple-700",
  gi:         "bg-emerald-100 text-emerald-700",
  fssai:      "bg-orange-100 text-orange-700",
  ayush:      "bg-teal-100 text-teal-700",
};

interface Props { candidate: RetrievalCandidate; rank: number; }

export default function CandidateRow({ candidate: c, rank }: Props) {
  const [expanded, setExpanded] = useState(false);
  const badgeClass = DOMAIN_BADGE[c.domain] ?? "bg-gray-100 text-gray-600";

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
      {/* Header row */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
      >
        {/* Rank badge */}
        <span className="w-7 h-7 rounded-full bg-gray-800 text-white text-xs font-bold flex items-center justify-center shrink-0">
          {rank}
        </span>
        {/* Domain */}
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${badgeClass}`}>
          {c.domain.toUpperCase()}
        </span>
        {/* Section title & Source */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-800 truncate">
            {c.section_title || "Statutory Section"}
          </p>
          {c.source_title && (
            <p className="text-xs text-gray-500 truncate font-normal">
              📄 {c.source_title}
            </p>
          )}
        </div>
        {/* Score pills */}
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          {c.rrf_score !== undefined && (
            <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-xs font-mono">
              RRF {c.rrf_score.toFixed(4)}
            </span>
          )}
          {c.reranker_score !== undefined && (
            <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded text-xs font-mono">
              CE {c.reranker_score.toFixed(2)}
            </span>
          )}
          {c.grounding_score !== undefined && (
            <span className={`px-2 py-0.5 rounded text-xs font-mono ${
              c.grounding_score > 0.5 ? "bg-green-50 text-green-700" : "bg-gray-50 text-gray-500"
            }`}>
              G {c.grounding_score.toFixed(2)}
            </span>
          )}
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />}
      </button>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-gray-100 px-4 py-4 space-y-4 bg-gray-50">
          {/* Score breakdown */}
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Score Breakdown</p>
            <ScoreBar label="BM25"     value={c.bm25_score}     max={20}  color="bg-sky-500" />
            <ScoreBar label="Vector"   value={c.vector_score}   max={1}   color="bg-violet-500" />
            <ScoreBar label="RRF"      value={c.rrf_score}      max={0.1} color="bg-indigo-500" />
            <ScoreBar label="Reranker" value={c.reranker_score} max={10}  color="bg-amber-500" />
            <ScoreBar label="Grounding" value={c.grounding_score} max={1} color="bg-green-500" />
          </div>
          {/* Passage text */}
          <div className="space-y-1">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Passage</p>
            <p className="text-xs text-gray-700 leading-relaxed bg-white rounded-lg p-3 border border-gray-200 whitespace-pre-wrap">
              {c.text}
            </p>
          </div>
          {/* Metadata */}
          <div className="flex flex-wrap gap-2 text-xs text-gray-400 font-mono">
            <span>id: {c.chunk_id.slice(0,12)}…</span>
            <span>·</span>
            <span>jurisdiction: {c.jurisdiction}</span>
            <span>·</span>
            <span>corpus: {c.corpus_version}</span>
          </div>
        </div>
      )}
    </div>
  );
}
