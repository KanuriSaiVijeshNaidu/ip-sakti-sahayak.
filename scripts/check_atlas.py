import os, json
os.environ["PYTHONUTF8"] = "1"
from huggingface_hub import HfApi

api = HfApi()
try:
    info = api.repo_info(repo_id="lukeslp/accessibility-atlas", repo_type="dataset")
    print("Files in lukeslp/accessibility-atlas:")
    for s in info.siblings:
        if "patent" in s.rfilename.lower():
            print(f" - {s.rfilename} ({s.size} bytes)")
except Exception as e:
    print(f"Error: {e}")
