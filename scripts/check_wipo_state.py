import os
os.environ["PYTHONUTF8"] = "1"
from huggingface_hub import hf_hub_download
import pyarrow as pa
import pyarrow.ipc as ipc

try:
    # download state.json first
    p_state = hf_hub_download(repo_id="NekoNeko512/wipo-semiconductors", filename="state.json", repo_type="dataset")
    with open(p_state, "r", encoding="utf-8") as f:
        print("state.json:", f.read())
except Exception as e:
    print(f"Error state.json: {e}")
