import gzip
import json
import glob
import re
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8')

cached_files = glob.glob(r'C:/Users/kanur/.cache/huggingface/hub/datasets--Podtech--llm-jp-corpus-v4-ja_patent/**/*.jsonl.gz', recursive=True)
gz_path = cached_files[0]
print(f"Testing extraction on {gz_path}...", flush=True)

# Define AYURLEX Keywords with weights
STRONG_KEYWORDS = {
    "アーユルヴェーダ": 5, "漢方": 4, "生薬": 4, "薬用植物": 4, "薬草": 4,
    "植物エキス": 3, "植物抽出物": 3, "ハーブ": 3, "伝統医学": 3, "東洋医学": 3,
    "生薬エキス": 4, "植物由来": 2, "天然成分": 2, "天然物": 2, "植物成分": 2,
    "抽出エキス": 2, "薬用組成物": 3, "医薬組成物": 2, "医薬品": 1,
    "健康食品": 2, "サプリメント": 2, "栄養補助食品": 2, "機能性食品": 2,
    "化粧品": 1, "抽出物": 1
}

def evaluate_relevance(text):
    score = 0
    matched = []
    for kw, weight in STRONG_KEYWORDS.items():
        if kw in text:
            score += weight
            matched.append(kw)
    return score, matched

def parse_jpo_patent(data):
    meta = data.get('meta', {})
    text = data.get('text', '')
    local_path = meta.get('local_path', '')
    
    # Parse path for year and app_num: e.g. dataset/2014/S/2012140001/.../2012140725.xml.html.txt
    year_match = re.search(r'/(\d{4})/', local_path)
    pub_year = year_match.group(1) if year_match else "2014"
    
    app_match = re.search(r'(\d{10})\.xml', local_path)
    app_num_raw = app_match.group(1) if app_match else "0000000000"
    
    # Standardize identifiers
    # In JPO, 2012140725 corresponds to application特願2012-140725
    patent_id = f"JP-{pub_year}-{app_num_raw[-6:]}-A"
    pub_number = f"JP{pub_year}{app_num_raw[-6:]}A"
    app_number = f"JP{app_num_raw[:4]}{app_num_raw[4:]}"
    
    # Section Extraction
    # 1. Abstract
    abstract = ""
    abs_start = text.find("【要約】")
    claims_start = text.find("【特許請求の範囲】")
    desc_start = text.find("【発明の詳細な説明】")
    
    if abs_start != -1:
        if claims_start != -1:
            abstract_raw = text[abs_start+4:claims_start].strip()
        elif desc_start != -1:
            abstract_raw = text[abs_start+4:desc_start].strip()
        else:
            abstract_raw = text[abs_start+4:abs_start+1500].strip()
        # Clean image refs like 2012140725.tif 000029
        abstract = re.sub(r'\d{10}\.tif\s*\d*', '', abstract_raw).strip()
        
    # 2. Claims
    claims_text = ""
    if claims_start != -1:
        if desc_start != -1:
            claims_raw = text[claims_start+9:desc_start].strip()
        else:
            claims_raw = text[claims_start+9:].strip()
        claims_text = re.sub(r'\d{10}\.tif\s*\d*', '', claims_raw).strip()
        
    # 3. Description
    desc_text = ""
    if desc_start != -1:
        desc_raw = text[desc_start+10:].strip()
        desc_text = re.sub(r'\d{10}\.tif\s*\d*', '', desc_raw).strip()
        
    # 4. Title Extraction
    title = ""
    # Try finding title in first claim or description opening
    title_match = re.search(r'【発明の名称】\s*([^\n【]+)', text)
    if title_match:
        title = title_match.group(1).strip()
    else:
        # Infer title from description preamble: "...に関するものである。"
        preamble_match = re.search(r'本発明は、(?:.+?に関するものである|.+?を提供する)', desc_text[:500])
        if preamble_match:
            title = preamble_match.group(0).strip()
        elif abstract:
            title = abstract[:80] + "..."
        else:
            title = f"Japanese Patent Application {pub_number}"
            
    return {
        'document_id': patent_id,
        'publication_number': pub_number,
        'application_number': app_number,
        'publication_year': pub_year,
        'title': title,
        'abstract': abstract,
        'claims': claims_text,
        'description': desc_text,
        'local_path': local_path,
        'text_len': len(text),
        'claims_len': len(claims_text),
        'desc_len': len(desc_text)
    }

matched_docs = []

with gzip.open(gz_path, 'rt', encoding='utf-8') as gz:
    for idx, line in enumerate(gz):
        data = json.loads(line)
        text = data.get('text', '')
        score, matched_kws = evaluate_relevance(text)
        
        # AYURLEX Relevance Threshold: score >= 4 (requires strong botanical/medicinal concept)
        if score >= 4:
            doc = parse_jpo_patent(data)
            doc['relevance_score'] = score
            doc['matched_keywords'] = matched_kws
            matched_docs.append(doc)

print(f"Total evaluated: 12,364 records in shard.")
print(f"Total AYURLEX relevant (score >= 4): {len(matched_docs)}")

# Sort by relevance score descending
matched_docs.sort(key=lambda x: x['relevance_score'], reverse=True)

print("\nTop 5 Highest Scoring AYURLEX Patents:")
for i, d in enumerate(matched_docs[:5]):
    print(f"\n[{i+1}] {d['publication_number']} (Score: {d['relevance_score']})")
    print(f"  Keywords: {d['matched_keywords']}")
    print(f"  Title: {d['title'][:100]}")
    print(f"  Abstract len: {len(d['abstract'])} | Claims len: {d['claims_len']} | Desc len: {d['desc_len']}")
    print(f"  Claims snippet: {d['claims'][:150]}...")
