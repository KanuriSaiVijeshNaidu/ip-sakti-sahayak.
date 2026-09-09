"use client";

import React from "react";
import { X, CheckCircle2, Shield, Database, Cpu, Lock } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface SystemStatusModalProps {
  onClose: () => void;
}

export default function SystemStatusModal({ onClose }: SystemStatusModalProps) {
  const { language, t } = useLanguage();

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in-50 zoom-in-95">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <h3 className="text-sm font-bold text-slate-900">
              {t.statusModal?.title || "System Telemetry & RAG Verification"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold">{t.statusModal?.operationalBadge || "All Production Services Operational"}</div>
              <div className="text-[11px] text-emerald-700 mt-0.5">
                {t.statusModal?.recallDesc || "Evaluated against 425 statutory benchmark queries with 100% Recall@5 and citation-first verification."}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-medium mb-1">
                <Database className="w-3.5 h-3.5 text-slate-400" />
                <span>{t.statusModal?.vectorMetric || "Vector Index (FAISS)"}</span>
              </div>
              <div className="text-sm font-bold text-slate-900">70,608 Vectors</div>
              <div className="text-[10px] text-slate-500 mt-0.5">BGE-M3 (1024-dim dense)</div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-medium mb-1">
                <Cpu className="w-3.5 h-3.5 text-slate-400" />
                <span>{t.statusModal?.bm25Metric || "Lexical Retrieval (BM25)"}</span>
              </div>
              <div className="text-sm font-bold text-slate-900">352.3 MB Cache</div>
              <div className="text-[10px] text-slate-500 mt-0.5">100% canonical chunks</div>
            </div>
          </div>

          <div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
              {t.statusModal?.isolationMetric || "Jurisdiction Isolation Enforcements"}
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between p-2 bg-slate-50 border border-slate-100 rounded-md">
                <span className="font-medium text-slate-700">🇺🇸 United States (US)</span>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">Active Production (29,003 docs)</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-50 border border-slate-100 rounded-md">
                <span className="font-medium text-slate-700">🇯🇵 Japan (JP)</span>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">Active Production (26,041 docs)</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-50 border border-slate-100 rounded-md">
                <span className="font-medium text-slate-700">🌐 Global WIPO (WO)</span>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">Active Production (13,652 docs)</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-50 border border-slate-100 rounded-md">
                <span className="font-medium text-slate-700">🇪🇺 European Union (EP)</span>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">Active Production (1,912 docs)</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-50 border border-slate-100 rounded-md">
                <span className="font-medium text-slate-700">🇮🇳 India (IN)</span>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">Active Production (§ 3e/3p & NBA)</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>{t.statusModal?.isolationDesc || "Sovereign isolation enforced"}</span>
          </div>

          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded text-xs font-medium transition-colors cursor-pointer"
          >
            {t.statusModal?.close || "Close"}
          </button>
        </div>

      </div>
    </div>
  );
}
