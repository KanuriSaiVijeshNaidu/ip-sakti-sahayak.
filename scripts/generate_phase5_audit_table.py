"""
Generate a detailed markdown table of actual retrieval queries across real corpus chunks.
Captures language, intent, routed jurisdictions, candidate funnel counts,
top 5 publication numbers, top 5 jurisdictions, top 5 sections, scores, and latency.
"""
import json, time
from backend.app.models.retrieval_schemas import RetrievalSearchRequest
from backend.app.retrieval.production_pipeline import production_retrieval_pipeline

pipeline = production_retrieval_pipeline
pipeline.warm_up()

queries = [
    ("US Query", "What are the US patent requirements for rosacea treatments?"),
    ("Japan English", "What patents exist in Japan for formulation compositions?"),
    ("Japan Japanese", "日本における抽出物組成物の特許"),
    ("Europe", "Search European patent specifications for pharmaceuticals"),
    ("WIPO PCT", "PCT international patent applications for medical treatments"),
    ("Cross-lingual US", "米国特許の要件は何ですか？"),
    ("Global", "Novel bioactive formulations and delivery systems"),
]

reports = []

for label, q in queries:
    req = RetrievalSearchRequest(query=q, top_k=5)
    resp = pipeline.search(req)
    
    top_pubs = [r.publication_number for r in resp.results]
    top_jurs = [r.jurisdiction for r in resp.results]
    top_sects = [r.section for r in resp.results]
    top_scores = [f"Rerank:{r.rerank_score:.3f}|RRF:{r.rrf_score:.4f}" if r.rerank_score else f"RRF:{r.rrf_score:.4f}" for r in resp.results]

    reports.append({
        "scenario": label,
        "query": q,
        "detected_language": resp.query_analysis.detected_language,
        "intent": resp.query_analysis.intent,
        "routed_jurisdictions": resp.searched_jurisdictions,
        "dense_count": resp.dense_candidate_count,
        "bm25_count": resp.lexical_candidate_count,
        "rrf_count": resp.fused_candidate_count,
        "reranked_count": resp.reranked_candidate_count,
        "final_count": resp.final_candidate_count,
        "top_5_pubs": top_pubs,
        "top_5_jurisdictions": top_jurs,
        "top_5_sections": top_sects,
        "top_scores": top_scores,
        "total_ms": resp.latencies_ms["total_pipeline_ms"],
    })

with open("scratch/phase5_audit_table.json", "w", encoding="utf-8") as f:
    json.dump(reports, f, indent=2, ensure_ascii=False)

print("Audit table written to scratch/phase5_audit_table.json")
