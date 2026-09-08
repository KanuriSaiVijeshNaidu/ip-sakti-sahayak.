import time, json
from backend.app.models.retrieval_schemas import RetrievalSearchRequest
from backend.app.retrieval.production_pipeline import production_retrieval_pipeline

pipeline = production_retrieval_pipeline
pipeline.warm_up()

queries = [
    ("US Query", "What are the US patent requirements for rosacea treatments?"),
    ("Japan English Query", "What patents exist in Japan for formulation compositions?"),
    ("Japan Japanese Query", "日本における抽出物組成物の特許"),
    ("Europe Query", "Search European patent specifications for pharmaceuticals"),
    ("WIPO PCT Query", "PCT international patent applications for medical treatments"),
    ("Comparison Query", "Compare patent requirements in Japan and the US"),
    ("Cross-Lingual US Query", "米国特許の要件は何ですか？"),
    ("Global Unspecified Query", "Novel bioactive formulations and delivery systems"),
]

latencies_summary = []
print("=== MEASURING PHASE 5 RETRIEVAL TECHNICAL LATENCIES ===")
for label, q in queries:
    req = RetrievalSearchRequest(query=q, top_k=5)
    resp = pipeline.search(req)
    latencies_summary.append({
        "scenario": label,
        "query": q,
        "detected_language": resp.query_analysis.detected_language,
        "jurisdictions": resp.searched_jurisdictions,
        "routing_mode": resp.query_analysis.routing_mode,
        "dense_candidates": resp.dense_candidate_count,
        "lexical_candidates": resp.lexical_candidate_count,
        "fused_candidates": resp.fused_candidate_count,
        "reranked_candidates": resp.reranked_candidate_count,
        "final_evidence_count": resp.final_candidate_count,
        "latencies_ms": resp.latencies_ms
    })
    print(f"[{label}] total={resp.latencies_ms['total_pipeline_ms']}ms | query_analysis={resp.latencies_ms['query_analysis_ms']}ms | dense={resp.latencies_ms['dense_retrieval_ms']}ms | bm25={resp.latencies_ms['lexical_retrieval_ms']}ms | rerank={resp.latencies_ms['reranking_ms']}ms")

with open("scratch/phase5_benchmark_latencies.json", "w", encoding="utf-8") as f:
    json.dump(latencies_summary, f, indent=2, ensure_ascii=False)
print("Benchmark latency measurements saved to scratch/phase5_benchmark_latencies.json")
