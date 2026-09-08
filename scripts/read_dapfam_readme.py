from huggingface_hub import hf_hub_download

readme_path = hf_hub_download(repo_id="datalyes/DAPFAM_patent", filename="README.md", repo_type="dataset")
with open(readme_path, "r", encoding="utf-8") as f:
    print(f.read()[:3000])
