from huggingface_hub import HfApi, hf_hub_download
import json

api = HfApi()

dataset_id = "datalyes/DAPFAM_patent"

try:
    files = api.list_repo_files(repo_id=dataset_id, repo_type="dataset")
    print(f"Files in {dataset_id}:")
    for f in files:
        print(f" - {f}")
except Exception as e:
    print(f"Error listing files: {e}")
