"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Bookmark, 
  ArrowRight, 
  Trash2, 
  Download, 
  ExternalLink, 
  FileText, 
  Calendar, 
  Globe, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle,
  HelpCircle,
  Plus
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface SavedReport {
  id: string;
  title: string;
  date: string;
  jurisdiction: string;
  analysisType: string;
  decision: string;
  confidence: string;
  summary: string;
  response: any;
}

export default function ReportsPage() {
  const router = useRouter();
  const { language, t } = useLanguage();
  const [reports, setReports] = useState<SavedReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("ayurlex_saved_reports");
      if (raw) {
        setReports(JSON.parse(raw));
      }
    } catch {}
    setLoading(false);
  }, []);

  const handleDelete = (id: string) => {
    const confirmMsg = t.reportsPage?.confirmDelete || "Are you sure you want to delete this saved analysis?";
    if (!window.confirm(confirmMsg)) return;
    const updated = reports.filter((r) => r.id !== id);
    setReports(updated);
    try {
      localStorage.setItem("ayurlex_saved_reports", JSON.stringify(updated));
    } catch {}
  };

  const handleDownload = (report: SavedReport) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `ayurlex_report_${report.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const getDecisionBadge = (decision: string) => {
    const label = t.workspace?.decisionBanners?.[decision]?.label;
    switch (decision) {
      case "YES":
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800">{label || "Approved"}</span>;
      case "CONDITIONAL_YES":
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-900">{label || "Approved w/ Conditions"}</span>;
      case "CONDITIONAL_NO":
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-orange-100 text-orange-900">{label || "Obstacles Identified"}</span>;
      case "NO":
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-100 text-rose-900">{label || "Prohibited"}</span>;
      case "INSUFFICIENT_EVIDENCE":
      default:
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-200 text-slate-700">{label || "Insufficient Evidence"}</span>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {t.reportsPage?.title || "Saved Reports"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {t.reportsPage?.subtitle || "View, review, and export your previous legal and regulatory decision analyses."}
            </p>
          </div>

          <Link
            href="/analyze"
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>{t.reportsPage?.startAnalysisBtn || "New Analysis"}</span>
          </Link>
        </div>

        {/* Reports List */}
        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">
            Loading saved reports...
          </div>
        ) : reports.length === 0 ? (
          /* EMPTY STATE */
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Bookmark className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {t.reportsPage?.emptyTitle || "No saved analyses yet"}
              </h2>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {t.reportsPage?.emptyDesc || "When you run an analysis in the AYURLEX workspace, you can save it here for future reference, audits, and team sharing."}
              </p>
            </div>
            <Link
              href="/analyze"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
            >
              <span>{t.reportsPage?.startAnalysisBtn || "Start Your First Analysis"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="space-y-3.5">
            <div className="text-xs font-medium text-slate-500">
              {(t.reportsPage?.countLabel || "{count} saved analyses").replace("{count}", String(reports.length))}
            </div>

            <div className="grid grid-cols-1 gap-3.5">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      {getDecisionBadge(report.decision)}
                      <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded flex items-center gap-1">
                        <Globe className="w-3 h-3 text-slate-400" />
                        {report.jurisdiction}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {new Date(report.date).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                      {report.title}
                    </h3>

                    {report.summary && (
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {report.summary}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <button
                      onClick={() => router.push(`/analyze?q=${encodeURIComponent(report.title)}&market=${report.jurisdiction}`)}
                      className="px-3 py-1.5 text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>{t.reportsPage?.openBtn || "Open"}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleDownload(report)}
                      className="p-2 text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md transition-colors cursor-pointer"
                      title={t.reportsPage?.downloadBtn || "Download JSON"}
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleDelete(report.id)}
                      className="p-2 text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-md transition-colors cursor-pointer"
                      title={t.reportsPage?.deleteBtn || "Delete"}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
