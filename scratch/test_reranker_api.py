
import urllib.request
import json
import time
import sys

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

print("=" * 70)
print("TEST 1: LIVE API CHAT WITH BAAI/bge-reranker-v2-m3 (568M PARAMS)")
print("=" * 70)

test_cases = [
    {
        "name": "Patent Eligibility & Section 3(p) Traditional Knowledge Bar",
        "payload": {
            "query": "What are the patent criteria for Ayurvedic herbal compositions under Section 3(p)?",
            "language": "en"
        }
    },
    {
        "name": "Direct-to-Consumer (D2C) Commercial Reality Without a Patent",
        "payload": {
            "query": "Can I sell an Ayurvedic product directly to consumers without a patent, and what licenses are needed?",
            "language": "en"
        }
    },
    {
        "name": "Multilingual Devanagari Hindi Query",
        "payload": {
            "query": "आयुर्वेद फॉर्मूलेशन और पेटेंट कानून के नियम क्या हैं?",
            "language": "hi"
        }
    },
    {
        "name": "Section 3(e) Synergistic Combinations vs Mere Admixture",
        "payload": {
            "query": "How does an Ayurvedic formulation overcome Section 3(e) mere admixture bar using synergy?",
            "language": "en"
        }
    }
]

for tc in test_cases:
    print(f"\n--- Testing: {tc['name']} ---")
    print(f"Query: {tc['payload']['query']}")
    req = urllib.request.Request(
        "http://127.0.0.1:8000/api/chat",
        data=json.dumps(tc['payload']).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    t0 = time.time()
    try:
        with urllib.request.urlopen(req, timeout=40) as resp:
            elapsed = (time.time() - t0) * 1000
            data = json.loads(resp.read().decode("utf-8"))
            print(f"  Status: {resp.status} OK | Latency: {elapsed:.0f}ms (Engine reported: {data.get('retrieval_latency_ms')}ms)")
            print(f"  Answer Preview: {data.get('answer', '')[:120]}...")
            passages = data.get("cited_passages", [])
            print(f"  Cited Evidence Passages ({len(passages)}):")
            for i, p in enumerate(passages, 1):
                print(f"    [{i}] [{p.get('domain', 'N/A').upper()}] {p.get('section', 'N/A')[:40]} | Score: {p.get('relevance_score')} | Source: {p.get('source_title', 'N/A')[:45]}")
    except Exception as exc:
        print(f"  ERROR: {exc}")

print("\n" + "=" * 70)
print("TEST 2: DIRECT BAAI/bge-reranker-v2-m3 BENCHMARK")
print("=" * 70)
try:
    from sentence_transformers.cross_encoder import CrossEncoder
    print("Loading CrossEncoder('BAAI/bge-reranker-v2-m3') from local cache...")
    model = CrossEncoder('BAAI/bge-reranker-v2-m3', max_length=512, device='cpu', local_files_only=True)
    print("Model loaded successfully!")
    
    benchmark_pairs = [
        ("Section 3(p) TK Query", "Can Ayurvedic traditional knowledge be patented?", "Under Section 3(p) of the Patents Act, 1970, an invention which in effect is traditional knowledge is excluded from patentability."),
        ("Irrelevant Distractor", "Can Ayurvedic traditional knowledge be patented?", "In baking sourdough, lactic acid bacteria and yeasts produce carbon dioxide.")
    ]
    t0 = time.time()
    scores = model.predict([[b[1], b[2]] for b in benchmark_pairs])
    bench_latency = (time.time() - t0) * 1000
    print(f"Direct Inference Latency: {bench_latency:.1f}ms for {len(benchmark_pairs)} pairs")
    for b, s in zip(benchmark_pairs, scores):
        print(f"  Pair: {b[0]:25s} -> BGE-Reranker Score: {s:.6f}")
except Exception as e:
    print(f"Direct test error: {e}")

print("\nALL MODEL VERIFICATION TESTS COMPLETED!")
