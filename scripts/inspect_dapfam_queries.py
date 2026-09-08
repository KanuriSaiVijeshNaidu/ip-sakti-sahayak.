import os
os.environ["PYTHONUTF8"] = "1"
from huggingface_hub import hf_hub_download
import pyarrow.parquet as pq
import pandas as pd

try:
    p = hf_hub_download(repo_id="datalyes/DAPFAM_patent", filename="queries.parquet", repo_type="dataset")
    table = pq.read_table(p)
    print("Schema of queries.parquet:")
    print(table.schema)
    df = table.to_pandas().head(10)
    print("\nColumns:", df.columns.tolist())
    print("\nSample IDs and fields:")
    for idx, row in df.iterrows():
        print(f"Row {idx}:")
        for col in df.columns:
            val = str(row[col])
            print(f"  {col}: {val[:120]}")
except Exception as e:
    print("Error:", e)
