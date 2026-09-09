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
    switch (decision) {
      case "YES":
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800">Approved</span>;
      case "CONDITIONAL_YES":
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-900">Approved w/ Conditions</span>;
      case "CONDITIONAL_NO":
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-orange-100 text-orange-900">Obstacles Identified</span>;
      case "NO":
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-100 text-rose-900">Prohibited</span>;
      case "INSUFFICIENT_EVIDENCE":
      default:
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-200 text-slate-700">Insufficient Evidence</span>;
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
              My Reports
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Save and revisit your IP and regulatory analyses.
            </p>
          </div>

          <Link
            href="/analyze"
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg shadow-sm transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>New Analysis</span>
          </Link>
        </div>

        {/* Reports List or Empty State */}
        {loading ? (
          <div className="py-20 text-center text-xs text-slate-400">
            Loading saved reports...
          </div>
        ) : reports.length === 0 ? (
          <div className="py-20 bg-white rounded-xl border border-slate-200 text-center p-8 space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Bookmark className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-900">You haven't saved any reports yet.</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Run an inquiry in the Analyze workspace to generate evidence-grounded reports.
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/analyze"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
              >
                <span>Run your first analysis</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <div
                key={report.id}
                className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm space-y-3 hover:border-slate-300 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    {getDecisionBadge(report.decision)}
                    <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {report.jurisdiction}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {new Date(report.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      onClick={() => handleDownload(report)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                      title="Download JSON Report"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(report.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                      title="Delete Report"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-900 leading-snug">
                  {report.title}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {report.summary}
                </p>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    Scope: {report.analysisType}
                  </span>
                  <Link
                    href={`/analyze?q=${encodeURIComponent(report.title)}&market=${report.jurisdiction}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 hover:text-emerald-900"
                  >
                    <span>Open in Analyze</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
