import os, json
os.environ["PYTHONUTF8"] = "1"
from huggingface_hub import HfApi, hf_hub_download

api = HfApi()

for repo in ["pakuvis/PatentMatch", "BNNT/PatentMatch"]:
    try:
        info = api.repo_info(repo_id=repo, repo_type="dataset", files_metadata=True)
        print(f"Repo {repo}:")
        for s in info.siblings:
            print(f"  - {s.rfilename} ({s.size} bytes)")
    except Exception as e:
        print(f"Error {repo}: {e}")
