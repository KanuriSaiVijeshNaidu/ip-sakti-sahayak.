import asyncio, logging, sys
logging.disable(logging.WARNING)

async def test_multilingual():
    from backend.app.retrieval.bm25_retriever import bm25_retriever
    from backend.app.retrieval.vector_retriever import vector_retriever
    from backend.app.retrieval.fusion import retrieve

    await bm25_retriever.build()
    await vector_retriever.build()

    queries = [
        ("Hindi (Ashwagandha Patent)", "क्या मैं अश्वगंधा के साथ आयुर्वेदिक फॉर्मूलेशन को पेटेंट करा सकता हूँ?"),
        ("Hindi (What is a patent)", "पेटेंट क्या है और इसके क्या अधिकार हैं?"),
        ("Tamil (Ayurveda Patent)", "அஸ்வகந்தா ஆயுர்வேத மருந்துக்கு காப்புரிமை பெற முடியுமா?"),
        ("Telugu (FSSAI Labelling)", "ఆయుర్వేద ఆహార ఉత్పత్తులకు FSSAI లేబులింగ్ నియమాలు ఏమిటి?"),
    ]

    for label, q in queries:
        print("="*60)
        print(f"TEST: {label}")
        print(f"QUERY: {q}")
        res = await retrieve(q, final_top_k=3)
        b_count = len(res["bm25_candidates"])
        v_count = len(res["vector_candidates"])
        print(f"BM25 hits: {b_count} | Vector hits: {v_count}")
        for i, c in enumerate(res["fused_candidates"][:3]):
            print(f"  Top {i+1}: {c.section_title} | Doc: {c.source_title}")
            print(f"         RRF: {c.rrf_score:.4f} | Vec: {c.vector_score:.4f} | BM25: {c.bm25_score:.4f}")

asyncio.run(test_multilingual())
