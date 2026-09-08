import os, json
os.environ["PYTHONUTF8"] = "1"
from huggingface_hub import hf_hub_download

p = hf_hub_download(repo_id="BNNT/PatentMatch", filename="PatentMatch_en.json", repo_type="dataset")
with open(p, "r", encoding="utf-8") as f:
    data = json.load(f)

print(f"Total entries in PatentMatch_en.json: {len(data)}")
print("Sample entry 0:")
sample = data[0] if isinstance(data, list) else list(data.items())[0]
print(json.dumps(sample, indent=2)[:1000])
