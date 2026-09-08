import os, json
os.environ["PYTHONUTF8"] = "1"

with open("reports/hf_discovered_datasets.json", "r", encoding="utf-8") as f:
    datasets = json.load(f)

keywords_target = ["de", "germany", "german", "in", "india", "indian", "wipo", "pct", "global", "multilingual", "claims", "description", "fulltext"]

matches = []

for ds_id, data in datasets.items():
    lower_id = ds_id.lower()
    tags_str = " ".join([t.lower() for t in data.get("tags", [])])
    
    # Check if any target keyword matches
    has_target = any(kw in lower_id or kw in tags_str for kw in ["german", "germany", "indian", "india", "wipo", "pct", "claims", "multilingual", "global", "ep-patent", "us-patent", "dapfam", "big_patent"])
    
    if has_target:
        matches.append((ds_id, data))

print(f"Candidate datasets matching target keywords: {len(matches)}")
matches.sort(key=lambda x: x[1].get("downloads", 0) or 0, reverse=True)

with open("reports/hf_candidates_filtered.json", "w", encoding="utf-8") as f:
    json.dump({k: v for k, v in matches}, f, indent=2)

for ds_id, data in matches[:40]:
    print(f"{ds_id:50} | Downloads: {data['downloads']:6} | Likes: {data['likes']:3}")
