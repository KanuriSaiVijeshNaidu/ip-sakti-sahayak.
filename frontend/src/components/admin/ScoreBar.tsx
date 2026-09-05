"use client";

interface Props {
  label: string;
  value?: number;
  max?: number;
  color?: string;
}

export default function ScoreBar({ label, value, max = 1, color = "bg-blue-500" }: Props) {
  if (value === undefined || value === null) {
    return (
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <span className="w-16 text-right">{label}</span>
        <span className="text-gray-300">—</span>
      </div>
    );
  }
  const pct = Math.min(100, Math.abs(value / max) * 100);
  const display = Math.abs(value) < 0.001 ? value.toExponential(2) : value.toFixed(4);
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-16 text-right text-gray-500 font-mono shrink-0">{label}</span>
      <div className="flex-1 bg-gray-100 rounded-full h-2 min-w-0">
        <div
          className={`h-2 rounded-full transition-all ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-16 font-mono text-gray-700 tabular-nums">{display}</span>
    </div>
  );
}
