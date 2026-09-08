import os, json
os.environ["PYTHONUTF8"] = "1"
from huggingface_hub import hf_hub_download

p = hf_hub_download(repo_id="BNNT/PatentMatch", filename="PatentMatch_en.json", repo_type="dataset")
with open(p, "r", encoding="utf-8") as f:
    line1 = f.readline()
    data = json.loads(line1)
    print("Keys in PatentMatch line 1:")
    for k, v in data.items():
        val_str = str(v)
        print(f" - {k}: {val_str[:120]}")
