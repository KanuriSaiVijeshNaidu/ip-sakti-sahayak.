import os, json
os.environ["PYTHONUTF8"] = "1"
from huggingface_hub import HfApi, hf_hub_download

try:
    p = hf_hub_download(repo_id="patent/AIPD_nlp_granted_claims", filename="README.md", repo_type="dataset")
    with open(p, "r", encoding="utf-8", errors="ignore") as f:
        print(f.read()[:2000])
except Exception as e:
    print(f"Error README: {e}")
