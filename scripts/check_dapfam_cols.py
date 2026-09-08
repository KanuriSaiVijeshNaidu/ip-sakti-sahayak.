import pyarrow.parquet as pq
from huggingface_hub import hf_hub_download

p = hf_hub_download(repo_id="datalyes/DAPFAM_patent", filename="queries.parquet", repo_type="dataset")
table = pq.read_table(p)
print("Columns in queries.parquet:")
for col in table.column_names:
    print(f" - {col}")
