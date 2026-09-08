import os, sys
os.environ["PYTHONUTF8"] = "1"
from huggingface_hub import HfApi

api = HfApi()

terms = [
    "patent", "patents", "claims", "patent-claims", "patent-text",
    "de-patent", "in-patent", "indian-patent", "german-patent",
    "wipo", "pct", "patentscope", "epo", "uspto"
]

all_datasets = {}

for term in terms:
    try:
        res = api.list_datasets(search=term, limit=50)
        for r in res:
            all_datasets[r.id] = {
                "id": r.id,
                "author": r.author,
                "downloads": getattr(r, "downloads", 0) or 0,
                "likes": getattr(r, "likes", 0) or 0,
                "tags": getattr(r, "tags", []) or [],
                "created_at": str(getattr(r, "created_at", "")),
                "last_modified": str(getattr(r, "last_modified", ""))
            }
    except Exception as e:
        pass

print(f"Total distinct datasets identified: {len(all_datasets)}")

# Write to file to avoid console cp1252 encoding issues
import json
with open("reports/hf_discovered_datasets.json", "w", encoding="utf-8") as f:
    json.dump(all_datasets, f, indent=2)

print("Saved to reports/hf_discovered_datasets.json")
