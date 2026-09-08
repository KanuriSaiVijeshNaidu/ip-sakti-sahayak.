import gzip
import json
import glob
import re
import sys
import os

sys.stdout.reconfigure(encoding='utf-8')

cached_files = glob.glob(r'C:/Users/kanur/.cache/huggingface/hub/datasets--Podtech--llm-jp-corpus-v4-ja_patent/**/*.jsonl.gz', recursive=True)
gz_path = cached_files[0]
print(f"Analyzing {gz_path}...", flush=True)

# Define AYURLEX Japanese keywords
# High-priority natural / botanical / herbal / traditional medicine concepts
AYURLEX_KEYWORDS = [
    "アーユルヴェーダ", "漢方", "伝統医学", "生薬", "薬草", "薬用植物",
    "植物エキス", "植物抽出物", "ハーブ", "天然成分", "天然物", "植物由来",
    "植物成分", "抽出エキス", "抽出物", "薬用組成物", "医薬組成物", "医薬品",
    "健康食品", "サプリメント", "栄養補助食品", "化粧品", "生薬エキス"
]

total_records = 0
matched_records = []
total_uncompressed_bytes = 0
matched_uncompressed_bytes = 0

with gzip.open(gz_path, 'rt', encoding='utf-8') as gz:
    for line in gz:
        total_records += 1
        line_bytes = len(line.encode('utf-8'))
        total_uncompressed_bytes += line_bytes
        
        data = json.loads(line)
        text = data.get('text', '')
        
        # Check matching keywords in text (first 3000 chars or whole text)
        matched_kw = [kw for kw in AYURLEX_KEYWORDS if kw in text]
        
        # We require at least 2 keywords or 1 strong botanical/herbal keyword
        strong_botanical = any(k in matched_kw for k in ["生薬", "薬草", "薬用植物", "植物エキス", "植物抽出物", "漢方", "アーユルヴェーダ", "ハーブ", "生薬エキス"])
        is_relevant = strong_botanical or (len(matched_kw) >= 2 and any(k in matched_kw for k in ["抽出物", "天然成分", "植物由来", "抽出エキス"]))
        
        if is_relevant:
            matched_uncompressed_bytes += line_bytes
            if len(matched_records) < 10:
                # Extract title or abstract snippet
                abs_match = re.search(r'【要約】\s*([^\n]+)', text)
                matched_records.append({
                    'index': total_records,
                    'path': data.get('meta', {}).get('local_path'),
                    'matched_keywords': matched_kw[:5],
                    'abstract_snippet': abs_match.group(1)[:100] if abs_match else text[:100],
                    'text_length': len(text)
                })

print(f"\n=== ANALYSIS OF 0000.jsonl.gz ===")
print(f"Total records in shard: {total_records}")
print(f"Total uncompressed size: {total_uncompressed_bytes / (1024*1024):.2f} MB")
print(f"Relevant records matched: {len(matched_records)} (showing sample) | Total estimated matches in shard: {total_records}")
print(f"Total relevant uncompressed size in shard: {matched_uncompressed_bytes / (1024*1024):.2f} MB")
print(f"Relevance hit rate: {matched_uncompressed_bytes / total_uncompressed_bytes * 100:.2f}% of bytes")

print("\nSample Matched AYURLEX Patents:")
for s in matched_records[:5]:
    print(f"\n- Index {s['index']} ({s['path']}):")
    print(f"  Keywords: {s['matched_keywords']}")
    print(f"  Snippet: {s['abstract_snippet']}")
    print(f"  Chars: {s['text_length']}")
