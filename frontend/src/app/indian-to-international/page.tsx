"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Globe2,
  ShieldCheck,
  CalendarCheck,
  CheckCircleFill,
  ExclamationTriangleFill,
  XCircleFill,
  HouseDoorFill,
  ClockHistory,
  FileEarmarkTextFill,
  CashCoin,
  ArrowRightCircleFill,
  Building,
  ClipboardCheck,
  InfoCircleFill,
} from "react-bootstrap-icons";
import {
  IndianToInternationalRequest,
  IndianToInternationalResponse,
  StatutoryDeadline,
} from "@/types";
import { convertIndianToInternational } from "@/lib/api";

export default function IndianToInternationalPage() {
  // Input form state
  const [appNumber, setAppNumber] = useState("IN202511019284");
  const [priorityDate, setPriorityDate] = useState("2025-10-15");
  const [title, setTitle] = useState(
    "Synergistic Curcumin and Piperine Polyherbal Extract for Enhanced Bioavailability"
  );
  const [ipType, setIpType] = useState<"PATENT" | "TRADEMARK" | "FORMULATION">("PATENT");
  const [bioMaterials, setBioMaterials] = useState<string>("Curcuma longa L., Piper nigrum L.");
  const [hasFFL, setHasFFL] = useState(false);
  const [hasNBA, setHasNBA] = useState(false);
  const [applicantType, setApplicantType] = useState<
    "NATURAL_PERSON" | "STARTUP_SME" | "LARGE_ENTITY"
  >("STARTUP_SME");
  const [targetJurisdictions, setTargetJurisdictions] = useState<string[]>([
    "WO",
    "US",
    "EP",
    "DE",
  ]);

  // Response state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<IndianToInternationalResponse | null>(null);
  const [copied, setCopied] = useState(false);

  const toggleJurisdiction = (j: string) => {
    if (targetJurisdictions.includes(j)) {
      setTargetJurisdictions(targetJurisdictions.filter((item) => item !== j));
    } else {
      setTargetJurisdictions([...targetJurisdictions, j]);
    }
  };

  const handleConvert = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const materials = bioMaterials
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const req: IndianToInternationalRequest = {
      indian_application_number: appNumber,
      priority_date: priorityDate,
      title,
      ip_type: ipType,
      biological_materials: materials,
      has_foreign_filing_license: hasFFL,
      has_nba_approval: hasNBA,
      target_jurisdictions: targetJurisdictions,
      applicant_type: applicantType,
    };

    try {
      const res = await convertIndianToInternational(req);
      setResult(res);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate international filing roadmap."
      );
    } finally {
      setLoading(false);
    }
  };

  const copyDossier = () => {
    if (!result) return;
    const text = `AYURLEX INDIAN IP TO INTERNATIONAL CONVERSION DOSSIER
======================================================
Application Number : ${result.indian_application_number}
Invention Title    : ${result.title}
Priority Date      : ${result.priority_date}
Readiness Score    : ${result.transition_readiness_score}% (${result.overall_status})

STATUTORY DEADLINES:
${result.deadlines
  .map(
    (d) =>
      `* ${d.milestone} (${d.months_from_priority}M): ${d.deadline_date} [${d.status}] - ${d.days_remaining} days remaining`
  )
  .join("\n")}

CLEARANCE CHECKS:
${result.clearances
  .map((c) => `* ${c.requirement}: [${c.status}] ${c.governing_statute}\n  Details: ${c.details}`)
  .join("\n")}

REQUIRED DOCUMENTS:
${result.required_documents.map((doc, idx) => `${idx + 1}. ${doc}`).join("\n")}

ACTION PLAN:
${result.action_plan
  .map((s) => `Step ${s.step_number}: ${s.title} [${s.urgency}] - ${s.authority_or_portal}`)
  .join("\n")}
`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center px-3 sm:px-6 py-6 sm:py-8">
      {/* Top Header */}
      <header className="w-full max-w-6xl flex items-center justify-between pb-6 border-b border-slate-800/80 mb-8">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Globe2 className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span>AYURLEX</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800">
                IN → INTERNATIONAL GATEWAY
              </span>
            </h1>
            <p className="text-[11px] text-slate-400">
              Indian IP to PCT / USPTO / EPO Statutory Transition System
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/compare-jurisdictions"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-700/80 transition-all"
          >
            <span>Compare Matrix</span>
          </Link>
          <Link
            href="/patentability"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-700/80 transition-all"
          >
            <span>Patentability</span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-800/90 hover:bg-slate-700 rounded-xl border border-slate-700 transition-all"
          >
            <HouseDoorFill className="w-3.5 h-3.5 text-emerald-400" />
            <span>Chat Workspace</span>
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-6xl flex flex-col gap-8 text-left">
        {/* Banner */}
        <div className="bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/60 border border-blue-800/40 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/40 text-blue-300 border border-blue-700/50 text-xs font-semibold">
              <Globe2 className="w-3.5 h-3.5 text-blue-400" />
              <span>Sovereign Indian IP to Global Jurisdiction Gateway</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Transition Your Indian Patent, Trademark, or AYUSH IP to International Filings
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Ensure strict statutory compliance before applying abroad: automatically calculate
              Paris Convention / PCT 12-month deadlines, verify mandatory Section 39 Foreign Filing
              License (FFL) requirements, and secure National Biodiversity Authority (NBA Form III)
              clearances to prevent invalidation.
            </p>
          </div>
        </div>

        {/* Input Configuration Form */}
        <div className="bg-slate-900/80 border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-xl backdrop-blur-md">
          <h3 className="text-sm sm:text-base font-bold text-white mb-5 flex items-center gap-2">
            <FileEarmarkTextFill className="w-4 h-4 text-blue-400" />
            <span>Enter Your Indian IP Application Details</span>
          </h3>

          <form onSubmit={handleConvert} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Indian Application Number *
                </label>
                <input
                  type="text"
                  value={appNumber}
                  onChange={(e) => setAppNumber(e.target.value)}
                  placeholder="e.g. IN202411019284"
                  required
                  className="w-full bg-slate-950 border border-slate-700/90 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Priority / Indian Filing Date *
                </label>
                <input
                  type="date"
                  value={priorityDate}
                  onChange={(e) => setPriorityDate(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-700/90 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Applicant Entity Type
                </label>
                <select
                  value={applicantType}
                  onChange={(e) =>
                    setApplicantType(
                      e.target.value as "NATURAL_PERSON" | "STARTUP_SME" | "LARGE_ENTITY"
                    )
                  }
                  className="w-full bg-slate-950 border border-slate-700/90 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="NATURAL_PERSON">Natural Person / Individual (Up to 80% Fee Reduction)</option>
                  <option value="STARTUP_SME">DPIIT-Recognized Startup / SME (50-80% Fee Concession)</option>
                  <option value="LARGE_ENTITY">Large Corporate Entity (Standard Fee)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Invention / Trademark / Formulation Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title as filed with the Indian Patent Office (Form 1)"
                required
                className="w-full bg-slate-950 border border-slate-700/90 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Biological Resources / Flora Utilized (Comma Separated)
                </label>
                <input
                  type="text"
                  value={bioMaterials}
                  onChange={(e) => setBioMaterials(e.target.value)}
                  placeholder="e.g. Curcuma longa, Piper nigrum, Withania somnifera"
                  className="w-full bg-slate-950 border border-slate-700/90 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Mandatory for Section 6 Biological Diversity Act (BDA) approval check.
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  IP Category
                </label>
                <select
                  value={ipType}
                  onChange={(e) =>
                    setIpType(e.target.value as "PATENT" | "TRADEMARK" | "FORMULATION")
                  }
                  className="w-full bg-slate-950 border border-slate-700/90 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="PATENT">Patent (Indian Patents Act, 1970 → PCT / Paris Route)</option>
                  <option value="TRADEMARK">Trademark (Trade Marks Act, 1999 → WIPO Madrid System)</option>
                  <option value="FORMULATION">Polyherbal Formulation (Classical AFI / TKDL Pre-Clearance)</option>
                </select>
              </div>
            </div>

            {/* Compliance Toggles */}
            <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Indian Statutory Clearance Declarations
              </h4>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-xs text-slate-300">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={hasFFL}
                    onChange={(e) => setHasFFL(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 bg-slate-900 border-slate-700"
                  />
                  <span>Form 25 Foreign Filing License (FFL) already granted by CGPDTM</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={hasNBA}
                    onChange={(e) => setHasNBA(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 bg-slate-900 border-slate-700"
                  />
                  <span>Form III approval granted by National Biodiversity Authority (NBA)</span>
                </label>
              </div>
            </div>

            {/* Target Jurisdictions */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-2">
                Target International Jurisdictions & Treaties
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: "WO", label: "WIPO PCT (157 States)", desc: "PCT International Phase" },
                  { id: "US", label: "United States (USPTO)", desc: "35 U.S.C. 101/102/103" },
                  { id: "EP", label: "Europe (EPO)", desc: "EPC Articles 52/54/56" },
                  { id: "DE", label: "Germany (DPMA)", desc: "German PatG § 1/34" },
                ].map((j) => (
                  <button
                    key={j.id}
                    type="button"
                    onClick={() => toggleJurisdiction(j.id)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      targetJurisdictions.includes(j.id)
                        ? "bg-blue-900/30 border-blue-500 text-white shadow-xs"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold">{j.label}</span>
                      {targetJurisdictions.includes(j.id) ? (
                        <CheckCircleFill className="w-3.5 h-3.5 text-blue-400" />
                      ) : (
                        <span className="w-3.5 h-3.5 rounded-full border border-slate-700" />
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 block leading-none">{j.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-600/30 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Verifying Statutory Deadlines & Clearances...</span>
              ) : (
                <>
                  <Globe2 className="w-4 h-4" />
                  <span>Generate International Transition Roadmap & Clearance Audit</span>
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-3 bg-red-950/60 border border-red-800 text-red-300 rounded-xl text-xs flex items-center gap-2">
              <XCircleFill className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Results Section */}
        {result && (
          <div className="space-y-8 animate-fade-in">
            {/* Transition Readiness Bar */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-1 text-center md:text-left">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                  Global Transition Readiness Index
                </span>
                <h3 className="text-xl font-extrabold text-white flex items-center justify-center md:justify-start gap-2">
                  <span>{result.overall_status}</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Application: <span className="font-mono text-blue-400">{result.indian_application_number}</span> · Priority Date: <span className="text-slate-200">{result.priority_date}</span>
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-black border shadow-xl ${
                      result.transition_readiness_score >= 80
                        ? "bg-emerald-950/60 border-emerald-500 text-emerald-400"
                        : result.transition_readiness_score >= 50
                        ? "bg-amber-950/60 border-amber-500 text-amber-400"
                        : "bg-red-950/60 border-red-500 text-red-400"
                    }`}
                  >
                    {result.transition_readiness_score}%
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 mt-1">Readiness Score</span>
                </div>

                <button
                  onClick={copyDossier}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold border border-slate-700 transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <ClipboardCheck className="w-4 h-4 text-blue-400" />
                  <span>{copied ? "Copied Dossier!" : "Export Dossier"}</span>
                </button>
              </div>
            </div>

            {/* Deadlines Timeline Countdown */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-md space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <CalendarCheck className="w-4 h-4 text-emerald-400" />
                  <span>Statutory Deadlines & Urgency Countdown</span>
                </h3>
                <span className="text-[11px] text-slate-400 font-mono">
                  Calculated from Priority Date ({result.priority_date})
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-semibold text-[11px]">
                      <th className="py-2.5 px-3">Milestone</th>
                      <th className="py-2.5 px-3">Deadline Date</th>
                      <th className="py-2.5 px-3">Time Window</th>
                      <th className="py-2.5 px-3">Countdown</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Statutory Provision</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {result.deadlines.map((d, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3 px-3 font-semibold text-slate-200">
                          <div>{d.milestone}</div>
                          <div className="text-[10px] text-slate-400 font-normal leading-tight mt-0.5">
                            {d.description}
                          </div>
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-300 whitespace-nowrap">
                          {d.deadline_date}
                        </td>
                        <td className="py-3 px-3 text-slate-400 font-mono whitespace-nowrap">
                          {d.months_from_priority} Months
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          {d.days_remaining > 0 ? (
                            <span
                              className={`font-mono font-bold ${
                                d.days_remaining <= 60 ? "text-amber-400" : "text-emerald-400"
                              }`}
                            >
                              {d.days_remaining} Days Left
                            </span>
                          ) : (
                            <span className="font-mono text-red-400 font-semibold">Expired</span>
                          )}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              d.status === "PASSED"
                                ? "bg-red-950 text-red-400 border-red-800"
                                : d.status === "URGENT"
                                ? "bg-amber-950 text-amber-300 border-amber-800 animate-pulse"
                                : "bg-emerald-950 text-emerald-400 border-emerald-800"
                            }`}
                          >
                            {d.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-400 text-[11px]">
                          {d.statutory_basis}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mandatory Clearances */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-md space-y-4">
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <span>Mandatory Indian Statutory Clearance Checks</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {result.clearances.map((c, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border flex flex-col justify-between ${
                      c.status === "COMPLIANT"
                        ? "bg-emerald-950/20 border-emerald-800/60 text-slate-200"
                        : c.status === "CRITICAL_BAR"
                        ? "bg-red-950/20 border-red-800/80 text-slate-200"
                        : "bg-amber-950/20 border-amber-800/60 text-slate-200"
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{c.requirement}</span>
                        <span
                          className={`text-[9px] font-mono px-1.5 py-0.5 rounded-md font-bold uppercase ${
                            c.status === "COMPLIANT"
                              ? "bg-emerald-900 text-emerald-300"
                              : c.status === "CRITICAL_BAR"
                              ? "bg-red-900 text-red-300"
                              : "bg-amber-900 text-amber-300"
                          }`}
                        >
                          {c.status}
                        </span>
                      </div>
                      <div className="text-[10px] text-blue-400 font-mono">{c.governing_statute}</div>
                      <p className="text-xs text-slate-300 leading-relaxed">{c.details}</p>
                    </div>

                    {c.remedy_step && (
                      <div className="mt-3 pt-3 border-t border-slate-800 text-[11px] text-amber-300/90 font-medium">
                        💡 Remedy: {c.remedy_step}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Jurisdiction Roadmaps */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-md space-y-4">
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-blue-400" />
                <span>Selected International Jurisdiction Roadmaps</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.roadmaps.map((r, idx) => (
                  <div
                    key={idx}
                    className="p-5 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-white">{r.jurisdiction_name}</h4>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                          {r.jurisdiction}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 font-medium">
                        Route: <span className="text-slate-200">{r.filing_route}</span>
                      </div>

                      <ul className="space-y-1.5 pt-2">
                        {r.key_statutory_requirements.map((req, rIdx) => (
                          <li
                            key={rIdx}
                            className="text-xs text-slate-300 flex items-start gap-2 leading-tight"
                          >
                            <span className="text-blue-400 mt-0.5">•</span>
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Est. Official Fee</span>
                        <span className="font-mono text-emerald-400 font-bold">
                          {r.estimated_official_fee}
                        </span>
                      </div>
                      <span className="text-[11px] text-blue-300/90 font-medium text-right max-w-[50%]">
                        {r.recommended_action}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Estimated Fees & Documents Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Fees */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <CashCoin className="w-4 h-4 text-emerald-400" />
                  <span>Estimated Official Filing Fees</span>
                </h4>
                <div className="space-y-2 text-xs divide-y divide-slate-800/60">
                  {Object.entries(result.estimated_fees).map(([key, val]) => (
                    <div key={key} className="pt-2 flex items-center justify-between">
                      <span className="text-slate-400 capitalize">
                        {key.replace(/_/g, " ")}
                      </span>
                      <span className="font-mono text-slate-200 font-semibold">{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Checklist */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <ClipboardCheck className="w-4 h-4 text-blue-400" />
                  <span>Required Documents Checklist</span>
                </h4>
                <div className="space-y-1.5 text-xs">
                  {result.required_documents.map((doc, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-slate-300">
                      <CheckCircleFill className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{doc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Plan */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-md space-y-4">
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <ArrowRightCircleFill className="w-4 h-4 text-blue-400" />
                <span>Recommended Procedural Action Plan</span>
              </h3>

              <div className="space-y-3">
                {result.action_plan.map((step) => (
                  <div
                    key={step.step_number}
                    className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-start gap-3.5"
                  >
                    <div className="w-7 h-7 rounded-xl bg-blue-900/50 text-blue-300 font-mono font-bold text-xs flex items-center justify-center shrink-0 border border-blue-700/50">
                      {step.step_number}
                    </div>
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-200">{step.title}</span>
                        <span
                          className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                            step.urgency === "REQUIRED"
                              ? "bg-red-950 text-red-300 border border-red-800"
                              : step.urgency === "RECOMMENDED"
                              ? "bg-blue-950 text-blue-300 border border-blue-800"
                              : "bg-slate-900 text-slate-400 border border-slate-700"
                          }`}
                        >
                          {step.urgency}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">{step.description}</p>
                      <div className="text-[10px] text-slate-500 font-mono pt-1">
                        Portal: {step.authority_or_portal} · Statutory Basis: {step.statutory_basis}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Statutory Evidence Citations */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800/80 text-xs text-slate-400 space-y-2">
              <div className="flex items-center gap-1.5 text-slate-300 font-semibold text-xs">
                <InfoCircleFill className="w-3.5 h-3.5 text-blue-400" />
                <span>Statutory References & Authoritative Sources</span>
              </div>
              <ul className="space-y-1 text-[11px] list-disc list-inside">
                {result.evidence.map((ev, idx) => (
                  <li key={idx}>
                    <span className="font-semibold text-slate-300">{ev.source_title}</span> ({ev.section}): {ev.passage_text.slice(0, 140)}...
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
