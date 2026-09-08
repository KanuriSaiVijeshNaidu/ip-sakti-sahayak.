from huggingface_hub import HfApi, hf_hub_download

api = HfApi()
info = api.repo_info(repo_id="datalyes/DAPFAM_patent", repo_type="dataset", files_metadata=True)

for sibling in info.siblings:
    print(f"File: {sibling.rfilename}, size: {sibling.size / (1024*1024):.2f} MB")
