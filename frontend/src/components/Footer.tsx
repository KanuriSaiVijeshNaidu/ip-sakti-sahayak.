"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShieldCheck, Activity, CheckCircle2 } from "lucide-react";
import SystemStatusModal from "./SystemStatusModal";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const { language, t } = useLanguage();

  return (
    <>
      <footer className="w-full bg-slate-900 text-slate-400 border-t border-slate-800 text-xs mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-white font-bold text-base mb-1">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <span>AYURLEX</span>
              </div>
              <p className="text-slate-400 text-xs max-w-md leading-relaxed">
                {t.welcomeDesc || "AI-powered intellectual property & regulatory decision-support workspace for AYUSH & Ayurvedic innovations. Grounded in authoritative statutes and patent prior art."}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs">
              <Link href="/analyze" className="hover:text-white transition-colors">
                {t.nav?.analyze || "Analyze"}
              </Link>
              <Link href="/reports" className="hover:text-white transition-colors">
                {t.nav?.reports || "Reports"}
              </Link>
              <Link href="/compare-jurisdictions" className="hover:text-white transition-colors">
                {t.nav?.compare || "Compare"}
              </Link>
              <button
                onClick={() => setStatusModalOpen(true)}
                className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
              >
                <Activity className="w-3.5 h-3.5" />
                <span>{t.footer?.systemStatus || "System Status"}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
              </button>
            </div>
          </div>

          <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
            <div>
              {t.footer?.attribution || "SIH26045 · Ministry of AYUSH · Official Sources • Evidence Grounded • Deterministic Decisions"}
            </div>
            <div className="text-center md:text-right max-w-xl text-slate-500 leading-normal">
              {t.footer?.disclaimer || "AYURLEX provides AI-assisted decision support based on retrieved legal and regulatory sources. It does not constitute professional legal advice."}
            </div>
          </div>
        </div>
      </footer>

      {statusModalOpen && (
        <SystemStatusModal onClose={() => setStatusModalOpen(false)} />
      )}
    </>
  );
}
