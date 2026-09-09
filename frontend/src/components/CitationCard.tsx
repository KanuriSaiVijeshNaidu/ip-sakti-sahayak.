"use client";
import { useState } from "react";
import { CitedPassage, LanguageCode } from "@/types";
import {
  JournalBookmarkFill,
  Globe2,
  Percent,
  FileEarmarkTextFill,
  XLg,
  ShieldCheck,
  Check2,
  Copy,
} from "react-bootstrap-icons";
import { getTranslation } from "@/lib/i18n";

const DOMAIN_COLORS: Record<string, string> = {
  patents: "bg-blue-950/80 text-blue-300 border-blue-800",
  trademarks: "bg-purple-950/80 text-purple-300 border-purple-800",
  gi: "bg-emerald-950/80 text-emerald-300 border-emerald-800",
  fssai: "bg-amber-950/80 text-amber-300 border-amber-800",
  ayush: "bg-teal-950/80 text-teal-300 border-teal-800",
};

function cleanText(text: string): string {
  return text.replace(/[^\x20-\x7E\n]/g, "").replace(/\n{3,}/g, "\n\n").trim();
}

function cleanTitle(title: string): string {
  const cleaned = cleanText(title);
  return cleaned.replace(/^[?=\-_\s]+/, "").trim() || title.trim();
}

interface CitationCardProps {
  passages: CitedPassage[];
  language?: LanguageCode;
}

export default function CitationCard({ passages, language = "en" }: CitationCardProps) {
  const [selectedPassage, setSelectedPassage] = useState<CitedPassage | null>(null);
  const [copied, setCopied] = useState(false);
  const t = getTranslation(language);

  if (!passages || passages.length === 0) return null;

  const handleCopySourceText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-2 space-y-2.5">
      <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5 px-1">
        <JournalBookmarkFill className="w-3.5 h-3.5 text-white" />
        <span>{t.citations.sourcesReferenced}</span>
      </p>

      {passages.map((p, i) => {
        const domain = (p.domain || "").toLowerCase();
        const badgeClass =
          DOMAIN_COLORS[domain] ?? "bg-zinc-800 text-zinc-300 border-zinc-700";
        const sectionTitle = cleanTitle(p.section || "");
        const passageText = cleanText(p.passage_text || "");
        const sourceName = p.source_title || t.sourceDoc;
        const pct = Math.round((p.relevance_score ?? 0) * 100);

        return (
          <div
            key={i}
            className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-3.5 space-y-2 text-xs card-motion shadow-lg text-left"
          >
            {/* Top row: citation key + domain + jurisdiction + match */}
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-mono font-bold text-white bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-700">
                  [src-{i + 1}]
                </span>
                {domain && (
                  <span
                    className={`px-2 py-0.5 rounded-full font-semibold text-[10px] uppercase border ${badgeClass}`}
                  >
                    {domain}
                  </span>
                )}
                {p.jurisdiction && p.jurisdiction !== "auto" && (
                  <span className="flex items-center gap-1 text-zinc-400 bg-black/60 px-2 py-0.5 rounded-md border border-zinc-800 text-[11px] font-mono">
                    <Globe2 className="w-3 h-3 text-white" />
                    {p.jurisdiction}
                  </span>
                )}
              </div>
              <span className="flex items-center gap-0.5 text-zinc-400 font-mono text-[11px]">
                <Percent className="w-3 h-3" />
                {pct}% {t.citations.matchScore}
              </span>
            </div>

            {/* Section title */}
            {sectionTitle && (
              <p className="font-bold text-white leading-snug text-xs sm:text-sm">
                {sectionTitle}
              </p>
            )}

            {/* Passage snippet */}
            {passageText ? (
              <p className="text-zinc-300 leading-relaxed line-clamp-4 font-normal">
                {passageText}
              </p>
            ) : (
              <p className="text-zinc-500 italic">{t.citations.passageUnavailable}</p>
            )}

            {/* Footer with source name and View Original Source button */}
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-zinc-800/80 flex-wrap">
              <p className="text-zinc-400 text-[11px] truncate max-w-[280px]">
                <span className="text-zinc-500">{t.citations.source}: </span>
                <span className="font-medium text-zinc-300">{sourceName}</span>
              </p>

              <button
                onClick={() => setSelectedPassage(p)}
                className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-white bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg transition-colors cursor-pointer"
                title={t.citations.viewOriginalSource}
              >
                <FileEarmarkTextFill className="w-3 h-3 text-white" />
                <span>{t.citations.viewOriginalSource}</span>
              </button>
            </div>
          </div>
        );
      })}

      {/* Modal for Authentic Statutory Source & Provenance */}
      {selectedPassage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl max-w-2xl w-full p-4 sm:p-6 space-y-4 shadow-2xl relative max-h-[85vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 border-b border-zinc-800 pb-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-white" />
                  <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                    {t.citations.originalSourceModalTitle}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  {cleanTitle(selectedPassage.section || selectedPassage.source_title)}
                </h3>
                <p className="text-xs text-zinc-400">
                  {selectedPassage.source_title} ·{" "}
                  <span className="font-mono text-zinc-300">{selectedPassage.jurisdiction}</span>
                </p>
              </div>

              <button
                onClick={() => setSelectedPassage(null)}
                className="p-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-colors cursor-pointer shrink-0"
                aria-label={t.citations.close}
              >
                <XLg className="w-4 h-4" />
              </button>
            </div>

            {/* Authentic Statutory Content Body */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                  {t.citations.authenticText}
                </span>
                <button
                  onClick={() => handleCopySourceText(selectedPassage.passage_text)}
                  className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check2 className="w-3 h-3 text-white" />
                      <span>{t.citations.copied}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>{t.citations.copyHash}</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-3.5 bg-black rounded-xl border border-zinc-800 text-zinc-200 text-xs sm:text-sm font-serif leading-relaxed whitespace-pre-wrap select-text">
                {selectedPassage.passage_text}
              </div>
            </div>

            {/* Statutory Grounding Guarantee */}
            <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800 text-[11px] flex items-center justify-between text-zinc-400 font-mono">
              <span className="flex items-center gap-1.5 text-zinc-300">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                {t.citations.evidenceGrounded}
              </span>
              <span>Relevance Score: {Math.round((selectedPassage.relevance_score ?? 0) * 100)}%</span>
            </div>

            {/* Close Button */}
            <div className="flex justify-end pt-1">
              <button
                onClick={() => setSelectedPassage(null)}
                className="px-4 py-2 bg-white hover:bg-zinc-200 text-black font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
              >
                {t.citations.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
