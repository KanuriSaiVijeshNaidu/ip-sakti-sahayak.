import requests

url = "https://huggingface.co/datasets/AI-Growth-Lab/patents_claims_1.5m_traim_test/resolve/main/df_claim_test_1M_pre_duplicates_removed_663.csv"
headers = {"Range": "bytes=0-2048"}

try:
    r = requests.get(url, headers=headers, timeout=10)
    print("Status code:", r.status_code)
    print("Content preview:")
    print(r.text[:1000])
except Exception as e:
    print("Error:", e)
