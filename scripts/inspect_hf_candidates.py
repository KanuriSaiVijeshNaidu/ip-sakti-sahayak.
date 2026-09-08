import os, json
os.environ["PYTHONUTF8"] = "1"
from huggingface_hub import HfApi

api = HfApi()

datasets_to_check = [
    "NekoNeko512/wipo-semiconductors",
    "FrancophonIA/COVID-19_WIPO",
    "datalyes/DAPFAM_patent",
    "AI-Growth-Lab/patents_claims_1.5m_traim_test",
    "patent/AIPD_nlp_granted_claims",
    "bikashpatra/sample_patent_claims_labelled",
    "mhurhangee/ep-patent-all-claims",
    "NortheasternUniversity/big_patent"
]

report = {}

for ds_id in datasets_to_check:
    try:
        info = api.repo_info(repo_id=ds_id, repo_type="dataset", files_metadata=True)
        files = [{"path": s.rfilename, "size_mb": round(s.size / (1024*1024), 2) if s.size else 0} for s in info.siblings]
        card = ""
        try:
            from huggingface_hub import hf_hub_download
            cp = hf_hub_download(repo_id=ds_id, filename="README.md", repo_type="dataset")
            with open(cp, "r", encoding="utf-8", errors="ignore") as f:
                card = f.read()[:1000]
        except Exception:
            pass
            
        report[ds_id] = {
            "author": info.author,
            "downloads": info.downloads,
            "likes": info.likes,
            "tags": info.tags,
            "files": files,
            "card_preview": card
        }
    except Exception as e:
        report[ds_id] = {"error": str(e)}

with open("reports/hf_detailed_inspection.json", "w", encoding="utf-8") as f:
    json.dump(report, f, indent=2)

print("Inspection completed, saved to reports/hf_detailed_inspection.json")
