import gzip
import json
import glob
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

cached_files = glob.glob(r'C:/Users/kanur/.cache/huggingface/hub/datasets--Podtech--llm-jp-corpus-v4-ja_patent/**/*.jsonl.gz', recursive=True)
gz_path = cached_files[0]

with gzip.open(gz_path, 'rt', encoding='utf-8') as gz:
    for idx, line in enumerate(gz):
        if idx + 1 == 43:
            data = json.loads(line)
            meta = data.get('meta', {})
            text = data.get('text', '')
            print(f"=== RECORD 43 ({meta.get('local_path')}) ===")
            print("Total chars:", len(text))
            
            # Print first 2000 chars
            print("\n--- FIRST 2000 CHARS ---")
            print(text[:2000])
            
            # Find claims section
            c_idx = text.find("【特許請求の範囲】")
            if c_idx != -1:
                print("\n--- CLAIMS SECTION SAMPLE (first 1000 chars of claims) ---")
                print(text[c_idx:c_idx+1000])
                
            # Find description section
            d_idx = text.find("【発明の詳細な説明】")
            if d_idx != -1:
                print("\n--- DESCRIPTION SECTION SAMPLE (first 1000 chars of desc) ---")
                print(text[d_idx:d_idx+1000])
            break
