"use client";

import React, { Suspense } from "react";
import AnalyzeWorkspace from "@/components/AnalyzeWorkspace";

export default function AnalyzePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center text-xs text-slate-500">
        Loading AYURLEX Analysis Workspace...
      </div>
    }>
      <AnalyzeWorkspace />
    </Suspense>
  );
}
