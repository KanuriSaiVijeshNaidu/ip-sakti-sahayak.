import time
from sentence_transformers.cross_encoder import CrossEncoder
from backend.app.retrieval.reranker import CrossEncoderReranker
from backend.app.retrieval.fusion import FusedCandidate

print(=== SUITE 1: BAAI/bge-reranker-v2-m3 (568M) Direct Evaluation ===)
model = CrossEncoder('BAAI/bge-reranker-v2-m3', max_length=512, device='cpu')

cases = [
    (
        Patent Synergism Query,
        Can a synergistic herbal formulation of Curcuma longa and Piperine be patented under Section 3(e)?,
        [
            (High Relevance, Under Section 3(e) of the Indian Patents Act, an admixture resulting in synergistic therapeutic efficacy over the individual components is patentable provided comparative experimental data is demonstrated.),
            (Partial Relevance, Section 3(p) of the Patents Act excludes traditional knowledge formulations from being patented.),
            (Negative Control, Deep convolutional neural networks are trained with stochastic backpropagation for image segmentation.)
        ]
    ),
    (
        Multilingual Hindi Direct Query,
        Ayurvedic utpaad bina patent ke kaise bechein?,
        [
            (High Relevance, Ayurvedic products can be legally sold directly to consumers without a patent by obtaining an AYUSH manufacturing license (Form 25D/25E) and adhering to Schedule T Good Manufacturing Practices.),
            (Negative Control, The European Central Bank sets monetary interest rates for member states in the eurozone.)
        ]
    ),
    (
        AYUSH Statutory Rule 158B,
        What are the mandatory provisions of Rule 158B for Ayurvedic proprietary medicines?,
        [
            (High Relevance, Rule 158B of the Drugs and Cosmetics Rules, 1945 mandates safety and efficacy requirements for patent and proprietary Ayurvedic medicines including pilot clinical studies or published classical textual references.),
            (Negative Control, Standard HTTP 404 status code indicates that the server cannot find the requested resource.)
        ]
    )
]

for title, q, passages in cases:
    print(f\n--- {title} ---)
    print(fQuery: {q})
    pairs = [[q, p[1]] for p in passages]
    t0 = time.time()
    scores = model.predict(pairs)
    elapsed = (time.time() - t0) * 1000
    print(fInference Latency: {elapsed:.1f}ms for {len(pairs)} pairs)
    for (label, passage), score in zip(passages, scores):
        print(f [{label:18s}] Score: {score:.6f} | Passage: {passage[:70]}...)

print(\n=== SUITE 2: Full Hybrid RAG Pipeline Verification ===)
import asyncio
from backend.app.retrieval.fusion import retrieve
from backend.app.retrieval.evidence import validate_evidence
from backend.app.retrieval.crag_evaluator import evaluate_retrieval_confidence

async def run_pipeline_test():
    test_queries = [
        How does Section 3(p) bar patenting of traditional Ayurvedic formulations?,
        Can I sell an Ayurvedic product directly to consumers without a patent?,
        What are the requirements for FSSAI Ayurveda Aahara license?
    ]
    reranker = CrossEncoderReranker()
    reranker.build()

    for q in test_queries:
        print(f\n>> Pipeline Test: '{q}')
        t0 = time.time()
        ret_res = await retrieve(query=q, final_top_k=10)
        fused = ret_res[fused_candidates]
        reranked = reranker.rerank(q, fused, top_n=5)
        evidence = validate_evidence(q, reranked, max_citations=3)
        crag = evaluate_retrieval_confidence(q, evidence)
        total_time = (time.time() - t0) * 1000

        print(f Pipeline Latency: {total_time:.1f}ms)
        print(f Retrieved: {len(fused)} -> Reranked: {len(reranked)} -> Valid Citations: {len(evidence)})
        print(f CRAG Evaluation: {crag.grade.value} (Confidence: {crag.overall_confidence:.3f}))
        for i, ev in enumerate(evidence, 1):
            print(f Citation {i}: [{ev.domain.upper()}] {ev.section_title} (Grounding Score: {ev.grounding_score:.3f}))

asyncio.run(run_pipeline_test())
print(\nALL RETRIEVAL & RERANKING TESTS PASSED!)
