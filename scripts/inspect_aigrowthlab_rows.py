import requests

url = "https://huggingface.co/datasets/AI-Growth-Lab/patents_claims_1.5m_traim_test/resolve/main/df_claim_test_1M_pre_duplicates_removed_663.csv"
headers = {"Range": "bytes=0-10000"}

try:
    r = requests.get(url, headers=headers, timeout=10)
    lines = r.text.split("\n")
    for l in lines[1:6]:
        parts = l.split(",")
        print("Row preview - id:", parts[0], "date:", parts[1], "text preview:", parts[2][:100] if len(parts)>2 else "")
except Exception as e:
    print("Error:", e)
