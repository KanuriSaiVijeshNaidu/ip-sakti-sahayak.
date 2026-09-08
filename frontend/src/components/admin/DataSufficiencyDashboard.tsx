"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  ExclamationTriangleFill,
  FileEarmarkTextFill,
  CheckCircleFill,
  LayersFill,
  ChevronDown,
  ChevronUp,
  HddFill,
  DatabaseFillCheck
} from "react-bootstrap-icons";

interface JurisdictionAudit {
  name: string;
  flag: string;
  stage: string;
  pipelineStatus: string;
  datasetStatus: string;
  dataSufficiency: "SUFFICIENT" | "INSUFFICIENT";
  documents: number;
  minDocsTarget: number;
  chunks: number;
  minChunksTarget: number;
  rawSizeMb: number;
  cleanedSizeMb: number;
  ocrScore: number;
  metadataCompleteness: string;
  claimsCoverage: string;
  sourceOrg: string;
  reason: string;
}

const AUDIT_DATA: JurisdictionAudit[] = [
  {
    name: "USA",
    flag: "🇺🇸",
    stage: "PRODUCTION DATASET VALIDATION",
    pipelineStatus: "PIPELINE PASS",
    datasetStatus: "DATASET PASS",
    dataSufficiency: "SUFFICIENT",
    documents: 1159,
    minDocsTarget: 1000,
    chunks: 29003,
    minChunksTarget: 4000,
    rawSizeMb: 524.15,
    cleanedSizeMb: 313.44,
    ocrScore: 0.9944,
    metadataCompleteness: "100.0%",
    claimsCoverage: "100.0%",
    sourceOrg: "USPTO / Harvard USPTO Patent Dataset (HUPD)",
    reason: "Production dataset acquired: 1,159 relevant utility applications (524.2 MB raw archive, 29,003 chunks). Criteria: Documents: 1,159 >= 1,000 [PASS] | Chunks: 29,003 >= 4,000 [PASS] | Metadata completeness: 100.0% [PASS] | OCR Quality: 0.9944 [PASS]."
  },
  {
    name: "Europe",
    flag: "🇪🇺",
    stage: "PRODUCTION DATASET VALIDATION",
    pipelineStatus: "PIPELINE PASS",
    datasetStatus: "DATASET PASS",
    dataSufficiency: "SUFFICIENT",
    documents: 646,
    minDocsTarget: 500,
    chunks: 1912,
    minChunksTarget: 1500,
    rawSizeMb: 18.97,
    cleanedSizeMb: 3.35,
    ocrScore: 0.9989,
    metadataCompleteness: "100.0%",
    claimsCoverage: "100.0%",
    sourceOrg: "European Patent Office (EPO) & ep-patent-all-claims",
    reason: "Production dataset acquired: 646 European patent documents (authoritative granted specs + 641 distinct verified EP claims from mhurhangee/ep-patent-all-claims). Criteria: Documents: 646 >= 500 [PASS] | Chunks: 1,912 >= 1,500 [PASS] | Metadata completeness: 100.0% [PASS] | Claims coverage: 100.0% [PASS]."
  },
  {
    name: "India",
    flag: "🇮🇳",
    stage: "PRODUCTION DATASET VALIDATION",
    pipelineStatus: "PIPELINE PASS",
    datasetStatus: "DATASET PASS",
    dataSufficiency: "INSUFFICIENT",
    documents: 5,
    minDocsTarget: 2000,
    chunks: 15,
    minChunksTarget: 4000,
    rawSizeMb: 0.01,
    cleanedSizeMb: 0.03,
    ocrScore: 1.0000,
    metadataCompleteness: "100.0%",
    claimsCoverage: "100.0%",
    sourceOrg: "Indian Patent Office (IPO / InPASS) & CSIR-TKDL",
    reason: "Corpus contains 5 authoritative statutory patent documents. Audit Breakdown: Documents: 5 / 2,000 minimum [UNMET] | Chunks: 15 / 4,000 minimum [UNMET] | Metadata completeness: 100.0% [PASS] | Claims coverage: 100.0% [PASS]. Reason: Official public repositories (IP India InPASS portal) lack open bulk REST dumps without commercial subscription keys. Supplementary authoritative data acquisition recommended for large-scale production."
  },
  {
    name: "Germany",
    flag: "🇩🇪",
    stage: "PRODUCTION DATASET VALIDATION",
    pipelineStatus: "PIPELINE PASS",
    datasetStatus: "DATASET PASS",
    dataSufficiency: "INSUFFICIENT",
    documents: 5,
    minDocsTarget: 2000,
    chunks: 15,
    minChunksTarget: 4000,
    rawSizeMb: 0.01,
    cleanedSizeMb: 0.03,
    ocrScore: 1.0000,
    metadataCompleteness: "100.0%",
    claimsCoverage: "100.0%",
    sourceOrg: "Deutsches Patent- und Markenamt (DPMA / DEPATISnet)",
    reason: "Corpus contains 5 authoritative statutory patent documents in original German. Audit Breakdown: Documents: 5 / 2,000 minimum [UNMET] | Chunks: 15 / 4,000 minimum [UNMET] | Metadata completeness: 100.0% [PASS] | German language coverage: 100.0% [PASS]. Reason: DPMAregister and DEPATISnet provide dynamic web queries without public bulk download APIs without specialized agreements. Supplementary authoritative data acquisition recommended for large-scale production."
  },
  {
    name: "WIPO",
    flag: "🌐",
    stage: "PRODUCTION DATASET VALIDATION",
    pipelineStatus: "PIPELINE PASS",
    datasetStatus: "DATASET PASS",
    dataSufficiency: "INSUFFICIENT",
    documents: 5,
    minDocsTarget: 2000,
    chunks: 15,
    minChunksTarget: 4000,
    rawSizeMb: 0.01,
    cleanedSizeMb: 0.03,
    ocrScore: 1.0000,
    metadataCompleteness: "100.0%",
    claimsCoverage: "100.0%",
    sourceOrg: "WIPO PATENTSCOPE / PCT International Bureau",
    reason: "Corpus contains 5 authoritative statutory patent documents. Audit Breakdown: Documents: 5 / 2,000 minimum [UNMET] | Chunks: 15 / 4,000 minimum [UNMET] | Metadata completeness: 100.0% [PASS] | Claims coverage: 100.0% [PASS]. Reason: WIPO PATENTSCOPE does not offer a free public REST API for bulk PCT downloads. Supplementary authoritative data acquisition recommended for large-scale production."
  }
];

export default function DataSufficiencyDashboard() {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    India: true,
    Germany: true,
    WIPO: true
  });

  const toggleExpand = (name: string) => {
    setExpanded((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-gray-200 pb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <DatabaseFillCheck className="w-5 h-5 text-sky-600" />
            <span>SIH 26045 International Data Sufficiency Audit</span>
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Strict jurisdiction isolation · Stage 2 production metrics · Transparent criteria audit
          </p>
        </div>
        <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-xl text-xs font-semibold text-indigo-900">
          <LayersFill className="w-4 h-4 text-indigo-600" />
          <span>Vector Embedding: NOT STARTED</span>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs text-gray-500 font-medium">Total Documents</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">1,820</p>
          <p className="text-[11px] text-green-600 font-semibold mt-0.5">100% Docling Parsed</p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs text-gray-500 font-medium">Production Chunks</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">30,960</p>
          <p className="text-[11px] text-gray-500 mt-0.5">Structure-aware (≤ 1,400 tok)</p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs text-gray-500 font-medium">Corpus Volume</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">543.2 MB</p>
          <p className="text-[11px] text-gray-500 mt-0.5">316.9 MB Cleaned</p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs text-gray-500 font-medium">Metadata Completeness</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">100.0%</p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">0 Missing IDs / 0 Noise</p>
        </div>
      </div>

      {/* Main Audit Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
            Jurisdiction Sufficiency Status & Criteria Breakdown
          </span>
          <span className="text-[11px] text-gray-500">
            5 Distinct Jurisdictions Isolated
          </span>
        </div>

        <div className="divide-y divide-gray-100">
          {AUDIT_DATA.map((j) => {
            const isSuff = j.dataSufficiency === "SUFFICIENT";
            const isOpen = expanded[j.name] || false;

            return (
              <div key={j.name} className="p-4 transition-colors hover:bg-gray-50/60">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{j.flag}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-gray-900">{j.name}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            isSuff
                              ? "bg-green-100 text-green-800 border border-green-300"
                              : "bg-amber-100 text-amber-800 border border-amber-300"
                          }`}
                        >
                          {j.dataSufficiency}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">
                          {j.pipelineStatus}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Source: <span className="font-medium text-gray-700">{j.sourceOrg}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs">
                    <div className="text-right hidden sm:block">
                      <p className="font-bold text-gray-900">{j.documents.toLocaleString()} docs</p>
                      <p className="text-gray-400 text-[11px]">{j.chunks.toLocaleString()} chunks</p>
                    </div>
                    <div className="text-right hidden sm:block">
                      <p className="font-bold text-gray-900">{j.rawSizeMb} MB</p>
                      <p className="text-gray-400 text-[11px]">Score: {j.ocrScore}</p>
                    </div>

                    <button
                      onClick={() => toggleExpand(j.name)}
                      className="flex items-center gap-1 text-xs font-semibold text-sky-700 hover:text-sky-900 bg-sky-50 px-2.5 py-1.5 rounded-lg border border-sky-200 transition-colors"
                    >
                      <span>Audit Details</span>
                      {isOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                {/* Expandable Section */}
                {isOpen && (
                  <div className="mt-3.5 pt-3.5 border-t border-gray-100 text-xs space-y-2 bg-gray-50/80 p-3 rounded-xl">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-gray-600 pb-2 border-b border-gray-200">
                      <div>
                        <span className="text-gray-400 block">Documents / Target:</span>
                        <strong className="text-gray-800">{j.documents} / {j.minDocsTarget}</strong>
                      </div>
                      <div>
                        <span className="text-gray-400 block">Chunks / Target:</span>
                        <strong className="text-gray-800">{j.chunks} / {j.minChunksTarget}</strong>
                      </div>
                      <div>
                        <span className="text-gray-400 block">Metadata Completeness:</span>
                        <strong className="text-green-700">{j.metadataCompleteness}</strong>
                      </div>
                      <div>
                        <span className="text-gray-400 block">Claims Preservation:</span>
                        <strong className="text-green-700">{j.claimsCoverage}</strong>
                      </div>
                    </div>

                    <div>
                      <span className="font-bold text-gray-700 block mb-0.5">
                        {isSuff ? "Sufficiency Verification:" : "Why Insufficient?"}
                      </span>
                      <p className="text-gray-600 leading-relaxed">{j.reason}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
