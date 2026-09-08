import os, json
os.environ["PYTHONUTF8"] = "1"
from huggingface_hub import HfApi, hf_hub_download

api = HfApi()

check_list = [
    "cwinkler/green_patents",
    "ccdv/patent-classification",
    "AI-Growth-Lab/patents_claims_1.5m_traim_test",
    "mhurhangee/ep-patent-all-claims"
]

results = {}

for cid in check_list:
    try:
        info = api.repo_info(repo_id=cid, repo_type="dataset", files_metadata=True)
        files = [{"path": s.rfilename, "size_mb": round(s.size / (1024*1024), 2) if s.size else 0} for s in info.siblings]
        card = ""
        try:
            cp = hf_hub_download(repo_id=cid, filename="README.md", repo_type="dataset")
            with open(cp, "r", encoding="utf-8", errors="ignore") as f:
                card = f.read()[:1500]
        except Exception:
            pass
        results[cid] = {
            "author": info.author,
            "downloads": info.downloads,
            "tags": info.tags,
            "files": files,
            "card": card
        }
    except Exception as e:
        results[cid] = {"error": str(e)}

with open("reports/check_more_hf.json", "w", encoding="utf-8") as f:
    json.dump(results, f, indent=2)

print("Saved to reports/check_more_hf.json")
