"use client";

import React from "react";
import { ExclamationTriangleFill, ArrowLeftCircleFill } from "react-bootstrap-icons";
import Link from "next/link";

interface Props {
  message?: string;
}

export default function AbstentionPanel({
  message = "AYURLEX cannot establish a reliable legal conclusion from the currently available authoritative sources.",
}: Props) {
  return (
    <div className="bg-amber-950/30 border border-amber-600/50 rounded-2xl p-5 text-left shadow-lg backdrop-blur-md space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
          <ExclamationTriangleFill className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-amber-200">Statutory Abstention Active</h4>
          <p className="text-xs text-amber-300/80">
            Evidence-Grounded AI Policy: Verification Required
          </p>
        </div>
      </div>

      <p className="text-xs text-slate-300 leading-relaxed bg-black/40 p-3 rounded-xl border border-white/5 font-mono">
        {message}
      </p>

      <div className="text-[11px] text-slate-400 space-y-1">
        <p>
          <strong>Why this happened:</strong> To protect inventors and practitioners from unlawful assertions, AYURLEX prefers transparent abstention rather than producing unsupported statutory advice.
        </p>
      </div>

      <div className="pt-2 flex items-center gap-2">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600/30 hover:bg-amber-600/50 border border-amber-500 text-amber-200 text-xs font-semibold rounded-xl transition-all"
        >
          <ArrowLeftCircleFill className="w-3.5 h-3.5" />
          <span>Refine Legal Query</span>
        </Link>
      </div>
    </div>
  );
}
