import { ChatRequest, ChatResponse } from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api";

// Client-side instant LRU cache for 0ms repeated responses
const clientCache = new Map<string, ChatResponse>();

export async function sendChatMessage(req: ChatRequest): Promise<ChatResponse> {
  const cacheKey = `${(req.query || "").trim().toLowerCase()}_${req.language || "en"}_${req.domain || "auto"}`;
  if (clientCache.has(cacheKey)) {
    return clientCache.get(cacheKey)!;
  }

  // Multi-tier resilient fallback: try same-origin /api/chat first, then configured base, then localhost fallback
  const endpoints: string[] = ["/api/chat"];
  if (API_BASE && API_BASE !== "/api" && !API_BASE.includes("ayurlex.in")) {
    endpoints.push(`${API_BASE}/chat`);
  }
  if (typeof window !== "undefined" && window.location.hostname === "localhost") {
    endpoints.push("http://127.0.0.1:8000/api/chat");
  }

  let lastError: Error | null = null;

  for (const url of endpoints) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req),
      });

      if (res.ok) {
        const data = (await res.json()) as ChatResponse;
        clientCache.set(cacheKey, data);
        return data;
      }
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
    }
  }

  throw new Error(
    lastError?.message || "Failed to fetch statutory answer. Please check your internet connection."
  );
}

export async function fetchAdminTrace(
  query: string,
  domain?: string,
  jurisdiction?: string
): Promise<import("@/types").AdminTraceResponse> {
  const params = new URLSearchParams({ query });
  if (domain && domain !== "auto") params.set("domain", domain);
  if (jurisdiction && jurisdiction !== "auto") params.set("jurisdiction", jurisdiction);
  const res = await fetch(`${API_BASE}/admin/trace?${params}`, { method: "POST" });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Admin trace API error ${res.status}: ${err}`);
  }
  return res.json();
}

export async function analyzeFormulation(
  req: import("@/types").FormulationAnalysisRequest
): Promise<import("@/types").FormulationAnalysisResponse> {
  const endpoints = ["/api/formulation/analyze"];
  if (API_BASE && API_BASE !== "/api") endpoints.push(`${API_BASE}/formulation/analyze`);
  if (typeof window !== "undefined" && window.location.hostname === "localhost") {
    endpoints.push("http://127.0.0.1:8000/api/formulation/analyze");
  }

  for (const url of endpoints) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req),
      });
      if (res.ok) return await res.json();
    } catch {}
  }
  throw new Error("Formulation analysis service temporarily unavailable.");
}

export async function assessTKRisk(
  req: import("@/types").TKRiskRequest
): Promise<import("@/types").TKRiskResponse> {
  const endpoints = ["/api/tk-risk/assess"];
  if (API_BASE && API_BASE !== "/api") endpoints.push(`${API_BASE}/tk-risk/assess`);
  if (typeof window !== "undefined" && window.location.hostname === "localhost") {
    endpoints.push("http://127.0.0.1:8000/api/tk-risk/assess");
  }

  for (const url of endpoints) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req),
      });
      if (res.ok) return await res.json();
    } catch {}
  }
  throw new Error("Traditional Knowledge risk service temporarily unavailable.");
}

export async function assessPatentability(
  req: import("@/types").PatentabilityRequest
): Promise<import("@/types").PatentabilityResponse> {
  const endpoints = ["/api/patentability/assess"];
  if (API_BASE && API_BASE !== "/api") endpoints.push(`${API_BASE}/patentability/assess`);
  if (typeof window !== "undefined" && window.location.hostname === "localhost") {
    endpoints.push("http://127.0.0.1:8000/api/patentability/assess");
  }

  for (const url of endpoints) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req),
      });
      if (res.ok) return await res.json();
    } catch {}
  }
  throw new Error("Patentability assessment service temporarily unavailable.");
}

export async function compareJurisdictions(
  req: import("@/types").JurisdictionComparisonRequest
): Promise<import("@/types").JurisdictionComparisonResponse> {
  const endpoints = ["/api/compare/jurisdictions"];
  if (API_BASE && API_BASE !== "/api") endpoints.push(`${API_BASE}/compare/jurisdictions`);
  if (typeof window !== "undefined" && window.location.hostname === "localhost") {
    endpoints.push("http://127.0.0.1:8000/api/compare/jurisdictions");
  }

  for (const url of endpoints) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req),
      });
      if (res.ok) return await res.json();
    } catch {}
  }
  throw new Error("Jurisdiction comparison service temporarily unavailable.");
}

export async function fetchEvaluationMetrics(jurisdiction = "ALL"): Promise<any> {
  const endpoints = [`/api/evaluation/metrics?jurisdiction=${jurisdiction}`];
  if (API_BASE && API_BASE !== "/api") endpoints.push(`${API_BASE}/evaluation/metrics?jurisdiction=${jurisdiction}`);
  if (typeof window !== "undefined" && window.location.hostname === "localhost") {
    endpoints.push(`http://127.0.0.1:8000/api/evaluation/metrics?jurisdiction=${jurisdiction}`);
  }

  for (const url of endpoints) {
    try {
      const res = await fetch(url);
      if (res.ok) return await res.json();
    } catch {}
  }
  throw new Error("Evaluation metrics service temporarily unavailable.");
}

