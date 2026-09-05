"""
scripts/embed_corpus.py
────────────────────────
Re-embeds all chunks in the DB with the configured embedding model
(BAAI/bge-m3 by default) and saves real vectors into FAISS.

Run once after ingestion:
    python -m scripts.embed_corpus
"""
import asyncio
import logging
import sys
import time

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s",
    stream=sys.stdout,
)
logger = logging.getLogger(__name__)


async def main():
    from backend.app.core.config import settings
    from backend.app.retrieval.vector_retriever import vector_retriever

    print("\n╔═══════════════════════════════════════════╗")
    print("║  IP-SAKTI — BGE-M3 Corpus Embedding Tool  ║")
    print("╚═══════════════════════════════════════════╝\n")
    print(f"Model   : {settings.embed_model}")
    print(f"Device  : {settings.embed_device}")
    print(f"FAISS   : {settings.faiss_index_path}")
    print(f"Corpus  : {settings.corpus_version}\n")

    t0 = time.perf_counter()
    await vector_retriever.build(force_reembed=True)
    elapsed = round(time.perf_counter() - t0, 1)

    from backend.app.retrieval.vector_retriever import FAISS_INDEX_FILE
    n = vector_retriever._index.ntotal if vector_retriever._index else 0
    dim = vector_retriever._dim

    print(f"\n✅ Embedding complete!")
    print(f"   Vectors stored : {n}")
    print(f"   Dimensions     : {dim}")
    print(f"   FAISS file     : {FAISS_INDEX_FILE}")
    print(f"   Time taken     : {elapsed}s\n")


if __name__ == "__main__":
    asyncio.run(main())
