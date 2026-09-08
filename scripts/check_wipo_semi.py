import os, json
os.environ["PYTHONUTF8"] = "1"
from huggingface_hub import hf_hub_download

try:
    p = hf_hub_download(repo_id="NekoNeko512/wipo-semiconductors", filename="dataset_info.json", repo_type="dataset")
    with open(p, "r", encoding="utf-8") as f:
        print(f.read()[:2000])
except Exception as e:
    print(f"Error: {e}")
