path = "backend/app/core/config.py"
content = open(path, encoding="utf-8").read()

# Check what fields exist
missing = []
checks = [
    ("llm_provider", "llm_provider: str"),
    ("openai_api_key", "openai_api_key"),
    ("openai_model", "openai_model"),
    ("ollama_base_url", "ollama_base_url"),
    ("ollama_model", "ollama_model"),
    ("reranker_model", "reranker_model"),
    ("reranker_top_n", "reranker_top_n"),
    ("embed_dim", "embed_dim"),
    ("embed_device", "embed_device"),
    ("embed_model", "embed_model"),
    ("embed_batch_size", "embed_batch_size"),
    ("bm25_top_k", "bm25_top_k"),
    ("vector_top_k", "vector_top_k"),
    ("rrf_k", "rrf_k"),
    ("final_top_k", "final_top_k"),
]
for key, pattern in checks:
    if pattern not in content:
        missing.append(key)

print("Missing fields:", missing)
