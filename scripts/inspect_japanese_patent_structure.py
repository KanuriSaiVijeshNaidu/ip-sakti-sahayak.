import gzip
import json
import glob
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

cached_files = glob.glob(r'C:/Users/kanur/.cache/huggingface/hub/datasets--Podtech--llm-jp-corpus-v4-ja_patent/**/*.jsonl.gz', recursive=True)
print('Found cached files:', cached_files, flush=True)

inspection_records = []

if cached_files:
    gz_path = cached_files[0]
    with gzip.open(gz_path, 'rt', encoding='utf-8') as gz:
        for i in range(10):
            line = gz.readline()
            if not line:
                break
            data = json.loads(line)
            meta = data.get('meta', {})
            text = data.get('text', '')
            lines = [l.strip() for l in text.split('\n') if l.strip()]
            
            headers_found = [l for l in lines if l.startswith('【') and '】' in l][:25]
            
            # Extract common JPO fields
            title_match = re.search(r'【発明の名称】\s*([^\n【]+)', text)
            pub_match = re.search(r'【公開番号】\s*([^\n【]+)', text)
            app_match = re.search(r'【出願番号】\s*([^\n【]+)', text)
            
            claims_start = text.find('【特許請求の範囲】')
            desc_start = text.find('【発明の詳細な説明】')
            
            info = {
                'record_index': i + 1,
                'local_path': meta.get('local_path'),
                'total_text_chars': len(text),
                'total_lines': len(lines),
                'extracted_title': title_match.group(1).strip() if title_match else None,
                'extracted_pub_number': pub_match.group(1).strip() if pub_match else None,
                'extracted_app_number': app_match.group(1).strip() if app_match else None,
                'has_claims_section': claims_start != -1,
                'has_description_section': desc_start != -1,
                'headers_sample': headers_found,
                'first_5_lines': lines[:5]
            }
            inspection_records.append(info)

with open(r'c:\project\ip_sakti1\reports\jp_patent_structure_inspection.json', 'w', encoding='utf-8') as out:
    json.dump(inspection_records, out, indent=2, ensure_ascii=False)

print(f'Inspected {len(inspection_records)} records successfully.')
for r in inspection_records:
    t = r['extracted_title']
    p = r['extracted_pub_number']
    a = r['extracted_app_number']
    c = r['has_claims_section']
    d = r['has_description_section']
    print(f"Record {r['record_index']}: Title={t} ; Pub={p} ; App={a} ; Claims={c} ; Desc={d}")
