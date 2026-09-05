"use client";
import { AdminTraceResponse } from "@/types";
import { Search, LayersFill, LightningFill, CheckCircleFill } from "react-bootstrap-icons";

interface Props { trace: AdminTraceResponse; latency?: number; }

export default function PipelineStats({ trace, latency }: Props) {
  const stats = [
    { icon: Search,          label: "BM25 hits",   value: trace.bm25_hit_count,   color: "text-sky-600" },
    { icon: LayersFill,      label: "Vector hits",  value: trace.vector_hit_count, color: "text-violet-600" },
    { icon: LightningFill,   label: "RRF fused",    value: trace.fused_count,      color: "text-indigo-600" },
    { icon: LightningFill,   label: "Reranked",     value: trace.reranked_count,   color: "text-amber-600" },
    { icon: CheckCircleFill, label: "Valid cites",  value: trace.validated_count,  color: "text-green-600" },
  ];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
      {stats.map((s) => (
        <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-3 text-center">
          <s.icon className={`w-5 h-5 mx-auto mb-1 ${s.color}`} />
          <p className="text-2xl font-bold text-gray-900">{s.value}</p>
          <p className="text-xs text-gray-500">{s.label}</p>
        </div>
      ))}
      {latency && (
        <div className="bg-white rounded-xl border border-gray-200 p-3 text-center sm:col-span-5">
          <p className="text-xs text-gray-400">Pipeline latency: <strong className="text-gray-700">{(latency / 1000).toFixed(2)}s</strong></p>
        </div>
      )}
    </div>
  );
}
