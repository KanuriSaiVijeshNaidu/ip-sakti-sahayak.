"use client";
import { useState } from "react";
import { fetchAdminTrace } from "@/lib/api";
import { AdminTraceResponse } from "@/types";
import { PlayFill, CheckCircleFill, XCircleFill, ArrowRepeat } from "react-bootstrap-icons";

const BENCHMARK_QUERIES = [
  { query: "Can I patent an Ayurvedic herbal formulation?",             domain: "patents",    expectedDomains: ["patents"],             label: "Patent Q1 (EN)" },
  { query: "What is Section 3(e) of the Patents Act?",                 domain: "patents",    expectedDomains: ["patents"],             label: "Patent Q2 (EN)" },
  { query: "త్రిఫల తో ఆయుర్వేద ఫార్ములేషన్ పేటెంట్ చేయవచ్చా?",          domain: "patents",    expectedDomains: ["patents", "ayush"],     label: "Patent (Telugu)" },
  { query: "क्या मैं त्रिफला के आयुर्वेदिक योग का पेटेंट करा सकता हूँ?", domain: "patents",    expectedDomains: ["patents", "ayush"],     label: "Patent (Hindi)" },
  { query: "திரிபலா ஆயுர்வேத கலவைக்கு காப்புரிமை பெற முடியுமா?",       domain: "patents",    expectedDomains: ["patents", "ayush"],     label: "Patent (Tamil)" },
  { query: "FSSAI labelling requirements for Ashwagandha capsules",    domain: "fssai",      expectedDomains: ["fssai"],               label: "FSSAI Q1" },
  { query: "Prohibited substances in Ayurveda Aahara products",        domain: "fssai",      expectedDomains: ["fssai"],               label: "FSSAI Q2" },
  { query: "How to register a trademark for an Ayurveda brand?",       domain: "trademarks", expectedDomains: ["trademarks"],          label: "TM Q1" },
  { query: "GI tag registration process for traditional medicines",    domain: undefined,    expectedDomains: ["trademarks", "gi"],    label: "GI Q1" },
];

interface Result {
  label: string;
  query: string;
  passed: boolean;
  topDomain: string;
  expectedDomain: string;
  validated: number;
  latency: number;
}

export default function BenchmarkRunner() {
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<Result[]>([]);
  const [progress, setProgress] = useState(0);

  const runBenchmark = async () => {
    setRunning(true);
    setResults([]);
    const out: Result[] = [];
    for (let i = 0; i < BENCHMARK_QUERIES.length; i++) {
      const q = BENCHMARK_QUERIES[i];
      setProgress(i + 1);
      try {
        const t0 = performance.now();
        const trace: AdminTraceResponse = await fetchAdminTrace(q.query, q.domain, "IN");
        const latency = Math.round(performance.now() - t0);
        const topDomain = trace.candidates[0]?.domain ?? "—";
        const isPassed = q.expectedDomains.includes(topDomain);
        out.push({
          label: q.label,
          query: q.query,
          passed: isPassed,
          topDomain,
          expectedDomain: q.expectedDomains.join(" / "),
          validated: trace.validated_count,
          latency,
        });
      } catch {
        out.push({ label: q.label, query: q.query, passed: false, topDomain: "error", expectedDomain: q.expectedDomains.join(" / "), validated: 0, latency: 0 });
      }
    }
    setResults(out);
    setRunning(false);
  };

  const passCount = results.filter((r) => r.passed).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-900">Retrieval Benchmark</h3>
          <p className="text-xs text-gray-500">{BENCHMARK_QUERIES.length} test queries · domain routing accuracy</p>
        </div>
        <button
          onClick={runBenchmark}
          disabled={running}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white rounded-lg text-sm font-medium transition-colors"
        >
          {running ? <ArrowRepeat className="w-4 h-4 animate-spin" /> : <PlayFill className="w-4 h-4" />}
          {running ? `Running ${progress}/${BENCHMARK_QUERIES.length}…` : "Run Benchmark"}
        </button>
      </div>

      {results.length > 0 && (
        <div className="space-y-3">
          {/* Summary */}
          <div className={`rounded-xl px-4 py-3 flex items-center gap-3 ${
            passCount === results.length ? "bg-green-50 border border-green-200" : "bg-amber-50 border border-amber-200"
          }`}>
            {passCount === results.length
              ? <CheckCircleFill className="w-5 h-5 text-green-600" />
              : <XCircleFill className="w-5 h-5 text-amber-600" />}
            <span className="font-semibold text-gray-800">
              {passCount}/{results.length} passed &nbsp;·&nbsp;
              Avg latency {Math.round(results.reduce((a, r) => a + r.latency, 0) / results.length)}ms
            </span>
          </div>

          {/* Result rows */}
          <div className="space-y-2">
            {results.map((r) => (
              <div
                key={r.label}
                className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm"
              >
                {r.passed
                  ? <CheckCircleFill className="w-4 h-4 text-green-500 shrink-0" />
                  : <XCircleFill className="w-4 h-4 text-red-500 shrink-0" />}
                <span className="font-mono text-xs text-gray-400 shrink-0 w-16">{r.label}</span>
                <span className="flex-1 text-gray-700 truncate">{r.query}</span>
                <span className={`font-mono text-xs px-2 py-0.5 rounded ${
                  r.passed ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                }`}>{r.topDomain}</span>
                <span className="text-xs text-gray-400 font-mono w-14 text-right">{r.latency}ms</span>
                <span className="text-xs text-gray-400 w-16 text-right">{r.validated} cites</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
