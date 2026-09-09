"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  HouseDoorFill,
  Globe2,
  Diagram3Fill,
  Search,
  ShieldCheck,
  CheckCircleFill,
  LightningChargeFill,
  LayersFill,
  ChatQuoteFill,
  ExclamationTriangleFill,
  XCircleFill,
  ChevronDown,
  ChevronUp,
  BoxArrowUpRight,
} from "react-bootstrap-icons";
import PatentFamilyGraph from "@/components/PatentFamilyGraph";
import { searchRetrievalPipeline, generateRAGAnswer } from "@/lib/api";
import { Phase5RetrievalSearchResponse, RAGAnswerResponse, CitationInfo, LanguageCode } from "@/types";
import { getTranslation } from "@/lib/i18n";
import UnifiedHubNav from "@/components/UnifiedHubNav";

const LANGUAGES: { code: LanguageCode; label: string }[] = [
  { code: "en", label: "English" },
  { code: "te", label: "తెలుగు" },
  { code: "hi", label: "हिन्दी" },
  { code: "ja", label: "日本語" },
  { code: "ta", label: "தமிழ்" },
  { code: "kn", label: "ಕನ್ನಡ" },
  { code: "ml", label: "മലയാളം" },
];

export default function InternationalPage() {
  const [language, setLanguage] = useState<LanguageCode>("en");
  const t = getTranslation(language);

  const [activeTab, setActiveTab] = useState<"rag" | "retrieval" | "family">("rag");
  const [invention, setInvention] = useState("Synergistic Polyherbal Composition");

  // Query state
  const [query, setQuery] = useState("What are the US patent requirements for rosacea treatments?");
  const [jurisdiction, setJurisdiction] = useState<string>("AUTO");
  const [topK, setTopK] = useState<number>(5);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Results state
  const [retrievalResponse, setRetrievalResponse] = useState<Phase5RetrievalSearchResponse | null>(null);
  const [ragResponse, setRagResponse] = useState<RAGAnswerResponse | null>(null);

  // Evidence Viewer Drawer Modal State
  const [selectedCitation, setSelectedCitation] = useState<CitationInfo | null>(null);
  const [expandedClaims, setExpandedClaims] = useState<boolean>(false);

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem("ayurlex_language") as LanguageCode;
      if (savedLang && ["en", "te", "hi", "ja", "ta", "kn", "ml"].includes(savedLang)) {
        setLanguage(savedLang);
      } else {
        setLanguage("en");
      }
    } catch {
      setLanguage("en");
    }
  }, []);

  const handleLanguageChange = (lang: LanguageCode) => {
    setLanguage(lang);
    try {
      localStorage.setItem("ayurlex_language", lang);
    } catch {}
  };

  const handleSearchAndGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const jurOverride = jurisdiction === "AUTO" ? undefined : jurisdiction;
      // Execute Phase 6 Grounded RAG Generation (which calls Phase 5 internally)
      const data = await generateRAGAnswer({
        query: query.trim(),
        jurisdiction: jurOverride,
        top_k: topK,
      });
      setRagResponse(data);
    } catch (err: any) {
      setError(err.message || "Failed to generate grounded RAG answer");
    } finally {
      setLoading(false);
    }
  };

  const handleRetrievalOnly = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const jurOverride = jurisdiction === "AUTO" ? undefined : jurisdiction;
      const data = await searchRetrievalPipeline({
        query: query.trim(),
        jurisdiction: jurOverride,
        top_k: topK,
      });
      setRetrievalResponse(data);
      setActiveTab("retrieval");
    } catch (err: any) {
      setError(err.message || "Failed to execute hybrid retrieval");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fbfbf9] text-[#27272a] flex flex-col items-center relative">
      <UnifiedHubNav
        language={language}
        onLanguageChange={(l) => setLanguage(l)}
      />

      <main className="w-full max-w-6xl flex flex-col gap-6 text-left p-4 sm:p-6">
        {/* Search & Configuration Card */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 shadow-2xl backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ChatQuoteFill className="w-5 h-5 text-emerald-400" />
              <h2 className="text-base font-bold text-white">{t.international.pageTitle}</h2>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> CITATION-BOUND RAG
            </span>
          </div>

          <p className="text-xs text-slate-400">
            {t.welcomeDesc}
          </p>

          <form onSubmit={handleSearchAndGenerate} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                {t.international.searchPlaceholder}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t.international.searchPlaceholder}
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all"
                >
                  {loading ? (
                    <span>{t.international.generatingAnswer}</span>
                  ) : (
                    <>
                      <Search className="w-3.5 h-3.5" />
                      <span>{t.international.searchAndGenerateBtn}</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleRetrievalOnly}
                  disabled={loading}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-all"
                >
                  <LayersFill className="w-3.5 h-3.5 text-blue-400" />
                  <span>{t.international.retrievalOnlyBtn}</span>
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <label className="text-slate-400">{t.international.jurisdictionFilter}:</label>
                <select
                  value={jurisdiction}
                  onChange={(e) => setJurisdiction(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="AUTO">{t.international.autoDetect}</option>
                  <option value="US">USA (US)</option>
                  <option value="JP">Japan (JP)</option>
                  <option value="EP">Europe (EP)</option>
                  <option value="WO">WIPO / PCT (WO)</option>
                  <option value="GLOBAL">Global (US · JP · EP · WO)</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-slate-400">{t.international.topKLabel}</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={topK}
                  onChange={(e) => setTopK(parseInt(e.target.value) || 5)}
                  className="w-16 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-200 text-center focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="text-[11px] text-slate-500 flex items-center gap-1">
                <span>Suggestions:</span>
                <button
                  type="button"
                  onClick={() => { setQuery("What are the US patent requirements for rosacea treatments?"); setJurisdiction("AUTO"); }}
                  className="text-emerald-400 hover:underline"
                >
                  US Rosacea
                </button>
                <span>·</span>
                <button
                  type="button"
                  onClick={() => { setQuery("日本における抽出物組成物の特許"); setJurisdiction("AUTO"); }}
                  className="text-emerald-400 hover:underline"
                >
                  JP Composition
                </button>
                <span>·</span>
                <button
                  type="button"
                  onClick={() => { setQuery("米国特許の要件は何ですか？"); setJurisdiction("AUTO"); }}
                  className="text-emerald-400 hover:underline"
                >
                  Japanese → US
                </button>
                <span>·</span>
                <button
                  type="button"
                  onClick={() => { setQuery("Can I legally sell this product in the USA?"); setJurisdiction("US"); }}
                  className="text-amber-400 hover:underline"
                >
                  Legal Safety Guard
                </button>
              </div>
            </div>
          </form>

          {error && (
            <div className="p-3 rounded-xl bg-red-950/70 border border-red-800 text-red-300 text-xs flex items-center gap-2">
              <XCircleFill className="w-4 h-4 flex-shrink-0" />
              <span><strong>Error:</strong> {error}</span>
            </div>
          )}
        </div>

        {/* Tab 1: AI-Grounded Answer */}
        {activeTab === "rag" && ragResponse && (
          <div className="space-y-6">
            {/* Answer Section */}
            <div className="bg-slate-900/70 border border-slate-800/90 rounded-2xl p-6 shadow-2xl backdrop-blur-xl space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">{t.international.auditedAnswerTitle}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 font-mono">
                    Language: {ragResponse.detected_language.toUpperCase()}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono">
                    Jurisdiction: {ragResponse.jurisdictions.join(", ")}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                      ragResponse.crag_status === "GOOD"
                        ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                        : ragResponse.crag_status === "PARTIAL"
                        ? "bg-amber-950 text-amber-400 border border-amber-800"
                        : "bg-red-950 text-red-400 border border-red-800"
                    }`}
                  >
                    CRAG: {ragResponse.crag_status === "GOOD" ? t.crag.good : ragResponse.crag_status === "PARTIAL" ? t.crag.partial : ragResponse.crag_status === "INVALID" ? t.crag.invalid : t.crag.insufficient}
                  </span>
                </div>

                <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2">
                  <LightningChargeFill className="w-3.5 h-3.5 text-amber-400" />
                  <span>Total: {ragResponse.latencies_ms.total_rag_pipeline_ms}ms</span>
                  <span>(Retrieval: {ragResponse.latencies_ms.retrieval_ms}ms · LLM: {ragResponse.latencies_ms.llm_generation_ms}ms)</span>
                </div>
              </div>

              {/* Formatted Answer Output */}
              <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap font-sans bg-slate-950/50 p-5 rounded-xl border border-slate-800/80">
                {ragResponse.answer}
              </div>

              {/* Clickable Citations Bar */}
              <div className="space-y-2 pt-1">
                <div className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>{t.international.evidenceSelectedTitle} ({ragResponse.citations.length})</span>
                  <span className="text-[10px] text-slate-500 font-normal">{t.international.clickToInspect}</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {ragResponse.citations.map((c) => (
                    <button
                      key={c.citation_id}
                      onClick={() => setSelectedCitation(c)}
                      className={`px-3 py-1.5 rounded-xl border text-xs text-left transition-all flex items-center gap-2 ${
                        selectedCitation?.citation_id === c.citation_id
                          ? "bg-emerald-900/60 border-emerald-500 text-white shadow-md"
                          : "bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700"
                      }`}
                    >
                      <span className="w-5 h-5 rounded bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
                        {c.citation_id}
                      </span>
                      <span className="font-semibold text-[11px]">{c.publication_number}</span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] bg-slate-800 text-slate-400 font-mono">
                        {c.jurisdiction}
                      </span>
                      <span className="text-[10px] text-slate-400 truncate max-w-[140px]">{c.title || c.section}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Limitations / Caveats */}
              {ragResponse.limitations.length > 0 && (
                <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-800/70 text-amber-200 text-xs space-y-1">
                  <div className="font-semibold flex items-center gap-1.5 text-amber-300">
                    <ExclamationTriangleFill className="w-3.5 h-3.5" />
                    <span>{t.crag.legalCaveatNotice}</span>
                  </div>
                  <ul className="list-disc list-inside space-y-0.5 text-[11px] text-amber-300/90">
                    {ragResponse.limitations.map((lim, i) => (
                      <li key={i}>{lim}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Claim-Level Validation Breakdown (Collapsible) */}
              <div className="border border-slate-800 rounded-xl overflow-hidden text-xs">
                <button
                  type="button"
                  onClick={() => setExpandedClaims(!expandedClaims)}
                  className="w-full px-4 py-2.5 bg-slate-950 flex items-center justify-between text-slate-300 hover:text-white"
                >
                  <span className="font-semibold flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>{t.international.claimValidationTitle} ({ragResponse.claims.length} claims audited)</span>
                  </span>
                  {expandedClaims ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {expandedClaims && (
                  <div className="p-4 bg-slate-950/70 space-y-2 border-t border-slate-800">
                    {ragResponse.claims.map((claim, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg border border-slate-800/80 bg-slate-900/40 space-y-1"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded font-mono ${
                              claim.status === "SUPPORTED"
                                ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                                : claim.status === "PARTIALLY_SUPPORTED"
                                ? "bg-amber-950 text-amber-300 border border-amber-800"
                                : "bg-red-950 text-red-300 border border-red-800"
                            }`}
                          >
                            {claim.status}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            Citations: {claim.citations.length > 0 ? claim.citations.join(", ") : "None"}
                          </span>
                        </div>
                        <p className="text-slate-300 text-[11px] italic">"{claim.text}"</p>
                        <p className="text-slate-500 text-[10px]">{claim.reason}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Statutory Disclaimer */}
              <div className="text-[11px] text-slate-500 italic border-t border-slate-800/80 pt-3">
                {ragResponse.disclaimer}
              </div>
            </div>

            {/* Modal / Drawer for Selected Citation */}
            {selectedCitation && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                      {selectedCitation.citation_id}
                    </span>
                    <h3 className="text-xs font-bold text-white">
                      {selectedCitation.publication_number} ({selectedCitation.jurisdiction})
                    </h3>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 uppercase font-mono">
                      {selectedCitation.section || "Specification"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedCitation.source_url && (
                      <a
                        href={selectedCitation.source_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-emerald-400 hover:underline flex items-center gap-1 bg-emerald-950/50 border border-emerald-800 px-2.5 py-0.5 rounded"
                      >
                        <span>{t.evidenceViewer.viewOnGooglePatents}</span>
                        <BoxArrowUpRight className="w-3 h-3" />
                      </a>
                    )}
                    <button
                      onClick={() => setSelectedCitation(null)}
                      className="text-xs text-slate-400 hover:text-white px-2.5 py-0.5 rounded bg-slate-800"
                    >
                      {t.evidenceViewer.close}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[10px] text-slate-400">
                  <div><strong>Doc ID:</strong> {selectedCitation.document_id}</div>
                  <div><strong>{t.evidenceViewer.jurisdiction}:</strong> {selectedCitation.jurisdiction}</div>
                  <div><strong>{t.evidenceViewer.filingDate}:</strong> {selectedCitation.filing_date || "N/A"}</div>
                  <div><strong>{t.evidenceViewer.pubDate}:</strong> {selectedCitation.publication_date || "N/A"}</div>
                  <div><strong>{t.evidenceViewer.sourceUrl}:</strong> {selectedCitation.source}</div>
                  <div><strong>{t.evidenceViewer.relevanceScore}:</strong> {selectedCitation.rerank_score?.toFixed(4) || "N/A"}</div>
                  <div><strong>Dense Score:</strong> {selectedCitation.dense_score?.toFixed(4) || "N/A"}</div>
                  <div><strong>RRF Score:</strong> {selectedCitation.rrf_score?.toFixed(4) || "N/A"}</div>
                </div>

                {selectedCitation.title && (
                  <div className="text-xs font-semibold text-slate-200">
                    Title: {selectedCitation.title}
                  </div>
                )}

                {/* Strict Invariant Banner: Patent evidence text preserved in original source language */}
                <div className="p-2 rounded-lg bg-blue-950/40 border border-blue-800/60 text-[10px] text-blue-300">
                  {t.evidenceViewer.originalTextNotice}
                </div>

                <div className="text-xs text-slate-300 leading-relaxed font-sans bg-slate-950 p-4 rounded-xl border border-slate-800 max-h-60 overflow-y-auto whitespace-pre-wrap">
                  {selectedCitation.text}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Retrieval Preview */}
        {activeTab === "retrieval" && retrievalResponse && (
          <div className="space-y-4">
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-xl">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                Phase 5 Retrieval Candidates ({retrievalResponse.results.length} Chunks)
              </h3>
              <div className="space-y-3">
                {retrievalResponse.results.map((r) => (
                  <div key={r.chunk_id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-200">{r.publication_number} ({r.jurisdiction})</span>
                      <span className="font-mono text-[10px] text-slate-400">Rerank: {r.rerank_score?.toFixed(4)}</span>
                    </div>
                    <p className="text-xs text-slate-300 line-clamp-3">{r.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: PCT Lineage */}
        {activeTab === "family" && (
          <div className="space-y-4">
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 shadow-2xl backdrop-blur-xl space-y-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Globe2 className="w-5 h-5 text-blue-400" />
                <span>International Patent Family Lineage & PCT Filing Protocol</span>
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                AYURLEX international patent intelligence tracks Indian priority filings across the WIPO Patent Cooperation Treaty (PCT) framework, United States Patent & Trademark Office (USPTO), European Patent Office (EPO), and Japan Patent Office (JPO).
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
          </div>
        )}
      </main>
    </div>
  );
}