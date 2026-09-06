import time
import json
import torch
from sentence_transformers.cross_encoder import CrossEncoder
from backend.app.retrieval.reranker import CrossEncoderReranker
from backend.app.retrieval.fusion import FusedCandidate
from backend.app.core.config import settings

print('================================================================')
print('TEST SUITE 1: DIRECT BAAI/bge-reranker-v2-m3 (568M) BENCHMARK')
print('================================================================')

t0 = time.time()
model = CrossEncoder('BAAI/bge-reranker-v2-m3', max_length=512, device='cpu')
load_time = time.time() - t0
print(f'Model loaded successfully in {load_time:.2}s')

# Multilingual Test Pairs
test_cases = [
    {
        'category': 'English Statutory Law',
        'query': 'Can a synergistic herbal combination of Curcuma longa and Piperine be patented under Section 3(e)?',
        'passages': [
            ('Highly Relevant', 'Under Section 3(e) of the Patents Act, 1970, a substance obtained by a mere admixture resulting only in the aggregation of the properties of the components is not patentable. However, if experimental pharmacological data proves a synergistic effect (e.g. enhanced bioavailability of Curcumin via Piperine), it overcomes the Section 3(e) bar.'),
            ('Partially Relevant', 'Section 3(p) excludes an invention which in effect is traditional knowledge or which is an aggregation or duplication of known properties of traditionally known component or components.'),
            ('Irrelevant Distractor', 'The French patent office requires European unitary patent filing for automotive engine component certifications under the EPO framework.')
        ]
    },
    {
        'category': 'Hindi Multilingual Query',
        'query': '‡§ï‡•ç‡§Ø‡§æ ‡§¨‡§ø‡§®‡§æ ‡§™‡ßá‡§ü‡ßá‡§Ç‡§ü ‡§ï‡•á ‡§Ü‡§¨)`x),8)cx)-x)a
Jn
K˛
ñ´
X
Hû
JN
Xﬁ
JÆ
KÓ
Jn
JŒ
KÓ
IŒ
KÓ
K
JÓ
X~
H"
JŒ
öÆ
X~
IÆ
KÓ
IŒ
KÓ
Ké
I^
JN
K‚
Kû
XÇr¿¢w76vW2s¢∞¢ÇtÜñvÜ«í&V∆WfÁBÑVÊv∆ó6Çír¬uñW2¬óW'fVFñ2&ˆGV7G26‚∆Vv∆«í&R÷ÁVf7GW&VBÊB6ˆ∆BFó&V7F«íFÚ6ˆÁ7V÷W'2vóFÜ˜WBFVÁB‚FVÁBw&ÁG2ÊVvFófR÷ˆÊ˜ˆ«í&ñváG2¬vÜW&V2FÜR&ñváBFÚ÷ÁVf7GW&RÊB6ˆ÷÷W&6ñ∆ó¶R‚óW'fVFñ2f˜&◊V∆Fñˆ‚&WVó&W2‚ïU4Ç÷ÁVf7GW&ñÊr∆ñ6VÁ6RÑf˜&“#TB˜"#TRíÊB6ˆ◊∆ñÊ6RvóFÇ66ÜVGV∆RBt’‚rí¿¢ÇtÜñvÜ«í&V∆WfÁBÑÜñÊFíír¬~
Ké
X.
K
HnW'fVFñ2
Hû
JN
Xﬁ
JÆ
KÓ
Jn
Xæ
H"
I^
X≤
JŒ
K˛
Jé
K‚
JÆ
X~
I˛
X~
 æ
IÚ
I^
K
KÓ
HR
Jﬁ
X
I^
KÓ
Jé
X.
Jé
X
K
X.
J¢
Ké
xr
JŒ
X~
IÆ
K‚
IŒ
KÓ
Ké
I^
JN
K‚
Kû
Xé
JB‚
Hn
J¬ñÇñÉÇí◊ÇíˇÇí∑Çí˚Çí\ÉÇí„ÇñÉÇí√Çí˚Çí∞§á (Form 25D/25E) sought.'),
            ('Irrelevant Distractor', 'Machine learning algorithms optimized using gradient descent with Adam optimizer converge in sub-quadratic time on convex loss surfaces.')
        ]
    },
    {
        'category': 'Sanskrit / AYUSH Specific Knowledge',
        'query': 'What is the role of Tridoshas (Vata, Pitta, Kapha) in Ayurvedic formulation standards?',
        'passages': [
            ('Highly Relevant', 'Ayurveda is based on the Tridosha doctrine (Vata, Pitta, Kapha), the Panchamahabhuta elements, and Sapta Dhatus. In classical ASU medicine formulations, standardization must respect authentic classical texts listed in the First Schedule of the Drugs and Cosmetics Act, 1940.'),
            ('Irrelevant Distractor', 'Baking artisan sourdough bread requires lactic acid bacteria fermentation at 24 degrees Celsius.')
        ]
    }
]

for tc in test_cases:
    print(f"\n--- Category: {tc['category']} ---")
    print(f"Query: {tc['query']}")
    pairs = [[tc['query'], p[1]] for p in tc['passages']]
    t_start = time.time()
    scores = model.predict(pairs)
    infer_time = time.time() - t_start
    print(f"Inference Latency: {infer_time * 1000:.1f}ms for {len(pairs)} pairs")
    for (label, passage), score in zip(tc['qpassages'], scores):
        snippet = passage[:80] + '...' if len(passage) > 80 else passage
        print(f"  [{label:24s}] Score: {score:.6f} | Passage: {snippet}")

print('\n================================================================')
print('TEST SUITE 2: FULL PIPELINE INTEGRATION WITH FAISS + BM25 + RERANKER')
print('================================================================')

import asyncio
from backend.app.retrieval.fusion import retrieve
from backend.app.retrieval.evidence import validate_evidence
from backend.app.retrieval.crag_evaluator import evaluate_retrieval_confidence

async def test_pipeline():
    queries = [
        'How does Section 3(p) interact with TKDL in patent examination of Ayurvedic remedies?',
        'What are the regulatory requirements for Ayurveda Aahara under FSSAI 2022?',
        '‡§Ü‡§Ø‡•Å‡§∞‡•ç‡§µ‡•á‡§¶‡§ø‡§ï ‡§¨‡§æ‡§ú‡§æ‡§∞ ‡§Æ‡ßá‡§Ç ‡§¨‡§ø‡§®‡§æ ‡§¨‡•ç‡§∞‡§æ‡§Ç‡§°‡•Ñ ‡§ï‡•á ‡§ï‡•ç‡§Ø‡§æ ‡§¨‡•à‡§ö‡§æ‡•á!'
    ]
    reranker = CrossEncoderReranker()
    reranker.build()

    for q in queries:
        print(f"\nPipeline Query: q")
        retrieval_res = await retrieve(query=q, final_top_k=10)
        fused = retrieval_res['fused_candidates']
        print(f"  Fused Candidates (BM25 + FAISS): {len(fused)}")
        
        reranked = reranker.rerank(q, fused, top_n=5)
        print(f"  Reranked Candidates (BAAI/bge-reranker-v2-m3): {len(reranked)}")
        for idx, r in enumerate(reranked[:3], 1):
            print(f"    Rank {s{:} Score={r.reranker_score:.4f} | RRF={r.rrf_score:.4f} | Title={r.source_title[:45]} | Section={r.section_title[:35]}")
        
        evidence = validate_evidence(q, reranked, max_citations=3)
        crag = evaluate_retrieval_confidence(q, evidence)
        print(f"  CRAG Assessment: Grade={crag.grade.value} | Confidence={crag.overall_confidence:.3f} | Reason={crag.action_reason}")

asyncio.run(test_pipeline())
print('\nALL MODEL TESTS COMPLETED SUCCESSFU!')
