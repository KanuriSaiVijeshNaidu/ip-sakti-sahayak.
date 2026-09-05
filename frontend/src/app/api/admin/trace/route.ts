import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const url = new URL(req.url);
  const query = url.searchParams.get("query") || "Ayurvedic patent inquiry";
  const domain = url.searchParams.get("domain") || "patents";
  const jurisdiction = url.searchParams.get("jurisdiction") || "IN";

  return NextResponse.json({
    query,
    domain,
    jurisdiction,
    bm25_count: 5,
    vector_count: 5,
    fused_count: 5,
    reranked_count: 3,
    validated_count: 3,
    candidates: [
      {
        chunk_id: "chk-india-patents-sec3p",
        text: "The Patents Act, 1970 - Section 3(p): Traditional knowledge exclusion from patentability.",
        section_title: "Section 3(p)",
        source_title: "The Patents Act, 1970 (India Code)",
        domain: domain === "auto" ? "patents" : domain,
        jurisdiction: "IN",
        corpus_version: "v1.0.0",
        rrf_score: 0.032,
        reranker_score: 0.94,
        grounding_score: 0.98,
      }
    ]
  });
}
