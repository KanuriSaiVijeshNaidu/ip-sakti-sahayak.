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
  Printer,
  ExternalLink, 
  FileText, 
  Calendar, 
  Globe, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  HelpCircle, 
  Plus,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Scale
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { DEMO_SCENARIOS } from "@/data";

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
  isDemo?: boolean;
  readinessScore?: number;
}

const SEEDED_DEMO_REPORTS: SavedReport[] = DEMO_SCENARIOS.map((s, idx) => ({
  id: s.id,
  title: s.name,
  date: new Date(Date.now() - (idx * 3600000 * 24)).toISOString(),
  jurisdiction: s.targetJurisdiction || "IN",
  analysisType: "Complete Product Assessment",
  decision: s.overview.patentability === "HIGH" ? "CONDITIONAL_NO" : "CONDITIONAL_YES",
  confidence: "HIGH",
  summary: s.shortDesc,
  response: s,
  isDemo: true,
  readinessScore: s.overview.filingReadinessScore,
}));

export default function ReportsPage() {
  const router = useRouter();
  const { language, t } = useLanguage();
  const [reports, setReports] = useState<SavedReport[]>([]);
  const [loading, setLoading] = useState(true);

  // Initialize reports from localStorage or fallback to seeded SIH demo reports
  useEffect(() => {
    try {
      const raw = localStorage.getItem("ayurlex_saved_reports");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setReports(parsed);
          setLoading(false);
          return;
        }
      }
    } catch {}
    
    // Seed with realistic demo reports if none exist
    setReports(SEEDED_DEMO_REPORTS);
    try {
      localStorage.setItem("ayurlex_saved_reports", JSON.stringify(SEEDED_DEMO_REPORTS));
    } catch {}
    setLoading(false);
  }, []);

  const handleDelete = (id: string) => {
    const confirmMsg = t.reportsPage?.confirmDelete || "Are you sure you want to delete this report?";
    if (!window.confirm(confirmMsg)) return;
    const updated = reports.filter((r) => r.id !== id);
    setReports(updated);
    try {
      localStorage.setItem("ayurlex_saved_reports", JSON.stringify(updated));
    } catch {}
  };

  const handleResetDemos = () => {
    setReports(SEEDED_DEMO_REPORTS);
    try {
      localStorage.setItem("ayurlex_saved_reports", JSON.stringify(SEEDED_DEMO_REPORTS));
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

  const handlePrint = () => {
    window.print();
  };

  const getDecisionBadge = (decision: string) => {
    switch (decision) {
      case "YES":
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">Approved</span>;
      case "CONDITIONAL_YES":
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-900 border border-amber-200">Conditional / Objections</span>;
      case "CONDITIONAL_NO":
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-orange-100 text-orange-900 border border-orange-200">High Rejection Risk</span>;
      case "NO":
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-100 text-rose-900 border border-rose-200">Prohibited</span>;
      case "INSUFFICIENT_EVIDENCE":
      default:
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-200 text-slate-700">Inconclusive</span>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold mb-2 shadow-xs">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              <span>SIH26045 · Auditable Reports Archive</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              {t.reportsPage?.title || "Saved Decision Reports"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              {t.reportsPage?.subtitle || "Review, compare, and export previously executed statutory patentability and regulatory dossiers."}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
              title="Print Dossier or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Print / PDF</span>
            </button>

            <Link
              href="/analyze"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t.reportsPage?.startAnalysisBtn || "New Analysis"}</span>
            </Link>
          </div>
        </div>

        {/* Reports List */}
        {loading ? (
          <div className="py-16 text-center text-xs text-slate-400 space-y-3">
            <div className="w-6 h-6 border-2 border-emerald-800 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <div>Loading verified reports dossier...</div>
          </div>
        ) : reports.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-2xl border border-slate-200 p-8 space-y-4 shadow-sm">
            <Bookmark className="w-10 h-10 text-slate-300 mx-auto" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">No Reports in Local Storage</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                You haven't saved any custom legal decisions yet. You can restore the pre-seeded SIH evaluation reports below.
              </p>
            </div>
            <button
              onClick={handleResetDemos}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restore 4 SIH Demo Reports</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500 pb-1">
              <span>Displaying <strong>{reports.length}</strong> statutory reports</span>
              <button
                onClick={handleResetDemos}
                className="text-[11px] text-emerald-800 hover:text-emerald-900 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Demo Reports</span>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-emerald-600/50 hover:shadow-md transition-all flex flex-col justify-between gap-4"
                >
                  <div className="space-y-2.5">
                    {/* Top Meta Row */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {getDecisionBadge(report.decision)}
                        <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {report.jurisdiction === "IN" ? "🇮🇳 India (CGPDTM & AYUSH)" : `${report.jurisdiction} Market`}
                        </span>
                        {report.isDemo && (
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                            SIH Demo Report
                          </span>
                        )}
                      </div>

                      <div className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(report.date).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}</span>
                      </div>
                    </div>

                    {/* Report Title */}
                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      {report.title}
                    </h3>

                    {/* Summary */}
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                      {report.summary}
                    </p>
                  </div>

                  {/* Bottom Action Row */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      {report.readinessScore && (
                        <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
                          {report.readinessScore}% Filing Readiness
                        </span>
                      )}
                      <span className="text-[11px] text-slate-500">
                        {report.analysisType}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDownload(report)}
                        className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        title="Download JSON"
                      >
                        <Download className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDelete(report.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete Report"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <Link
                        href={`/analyze?scenario=${report.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
                      >
                        <span>View Full Assessment</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
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
