from huggingface_hub import HfApi

api = HfApi()

search_queries = [
    "patent", "patent claims", "patent description", "patent full text",
    "indian patent", "german patent", "wipo patent", "pct patent",
    "patents", "dapfam"
]

found = {}

for q in search_queries:
    try:
        results = api.list_datasets(search=q, limit=25)
        for r in results:
            if r.id not in found:
                found[r.id] = {
                    "id": r.id,
                    "downloads": getattr(r, "downloads", 0),
                    "likes": getattr(r, "likes", 0),
                    "tags": getattr(r, "tags", []),
                    "created_at": str(getattr(r, "created_at", "")),
                    "last_modified": str(getattr(r, "last_modified", ""))
                }
    except Exception as e:
        print(f"Error querying '{q}': {e}")

print(f"Total unique patent datasets found on Hugging Face: {len(found)}")
for k, v in sorted(found.items(), key=lambda x: x[1].get('downloads', 0) or 0, reverse=True)[:35]:
    print(f"- {k} (downloads: {v['downloads']}, likes: {v['likes']})")
