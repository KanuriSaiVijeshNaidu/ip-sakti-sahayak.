"use client";
import { CitedPassage } from "@/types";
import { JournalBookmarkFill, Globe2, Percent } from "react-bootstrap-icons";

const DOMAIN_COLORS: Record<string, string> = {
  patents:    "bg-blue-100 text-blue-800",
  trademarks: "bg-purple-100 text-purple-800",
  gi:         "bg-emerald-100 text-emerald-800",
  fssai:      "bg-orange-100 text-orange-800",
  ayush:      "bg-teal-100 text-teal-800",
};

function cleanText(text: string): string {
  // Remove non-printable / garbled box-drawing chars; keep newlines
  return text.replace(/[^\x20-\x7E\n]/g, "").replace(/\n{3,}/g, "\n\n").trim();
}

function cleanTitle(title: string): string {
  const cleaned = cleanText(title);
  // Remove leading ??? artifacts at start of section title
  return cleaned.replace(/^[?=\-_\s]+/, "").trim() || title.trim();
}

export default function CitationCard({ passages }: { passages: CitedPassage[] }) {
  if (!passages || passages.length === 0) return null;

  return (
    <div className="mt-1 space-y-2">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1 px-1">
        <JournalBookmarkFill className="w-3 h-3 text-green-700" /> Legal Sources Referenced
      </p>

      {passages.map((p, i) => {
        const domain = (p.domain || "").toLowerCase();
        const badgeClass = DOMAIN_COLORS[domain] ?? "bg-gray-100 text-gray-700";
        const sectionTitle = cleanTitle(p.section || "");
        const passageText = cleanText(p.passage_text || "");
        const sourceName = p.source_title || "Indian Legal Corpus";
        const pct = Math.round((p.relevance_score ?? 0) * 100);

        return (
          <div
            key={i}
            className="bg-white border border-gray-200/90 rounded-2xl p-3.5 space-y-2 text-xs card-motion shadow-2xs"
          >
            {/* Top row: citation key + domain + jurisdiction + match */}
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-mono font-bold text-gray-500">[src-{i + 1}]</span>
                {domain && (
                  <span className={`px-2 py-0.5 rounded-full font-semibold text-[11px] uppercase ${badgeClass}`}>
                    {domain}
                  </span>
                )}
                {p.jurisdiction && p.jurisdiction !== "auto" && (
                  <span className="flex items-center gap-0.5 text-gray-400">
                    <Globe2 className="w-3 h-3" />
                    {p.jurisdiction}
                  </span>
                )}
              </div>
              <span className="flex items-center gap-0.5 text-gray-400 font-mono">
                <Percent className="w-3 h-3" />
                {pct}% match
              </span>
            </div>

            {/* Section title */}
            {sectionTitle && (
              <p className="font-semibold text-gray-800 leading-snug">{sectionTitle}</p>
            )}

            {/* Passage text */}
            {passageText ? (
              <p className="text-gray-600 leading-relaxed line-clamp-4">{passageText}</p>
            ) : (
              <p className="text-gray-400 italic">Passage text unavailable.</p>
            )}

            {/* Source name */}
            <p className="text-gray-400 italic text-[11px]">
              Source: {sourceName}
            </p>
          </div>
        );
      })}
    </div>
  );
}
