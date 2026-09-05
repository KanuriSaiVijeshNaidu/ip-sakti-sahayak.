import { ChatRequest, ChatResponse } from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api";

// Client-side instant LRU cache for 0ms repeated responses
const clientCache = new Map<string, ChatResponse>();

export async function sendChatMessage(req: ChatRequest): Promise<ChatResponse> {
  const cacheKey = `${(req.query || "").trim().toLowerCase()}_${req.language || "en"}_${req.domain || "auto"}`;
  if (clientCache.has(cacheKey)) {
    return clientCache.get(cacheKey)!;
  }
  const res = await fetch(`${API_BASE}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Chat API error ${res.status}: ${err}`);
  }
  const data = (await res.json()) as ChatResponse;
  clientCache.set(cacheKey, data);
  return data;
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
