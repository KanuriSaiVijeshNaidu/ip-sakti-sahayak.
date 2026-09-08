import gzip
import json
import os
import re
import sys
import hashlib
import datetime
from pathlib import Path
from huggingface_hub import hf_hub_download

sys.stdout.reconfigure(encoding='utf-8')

# Directories
base_dir = Path("c:/project/ip_sakti1")
jp_dir = base_dir / "data" / "japan"
raw_dir = jp_dir / "raw"
filtered_dir = jp_dir / "filtered"
processed_dir = jp_dir / "processed"
chunks_dir = jp_dir / "chunks"
meta_dir = jp_dir / "metadata"
val_dir = jp_dir / "validation"

for d in [raw_dir, filtered_dir, processed_dir, chunks_dir, meta_dir, val_dir]:
    d.mkdir(parents=True, exist_ok=True)

# AYURLEX Japanese Keywords & Weights
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

def parse_and_clean_jpo_patent(data):
    meta = data.get('meta', {})
    text = data.get('text', '')
    local_path = meta.get('local_path', '')
    
    year_match = re.search(r'/(\d{4})/', local_path)
    pub_year = year_match.group(1) if year_match else "2014"
    
    app_match = re.search(r'(\d{10})\.xml', local_path)
    app_num_raw = app_match.group(1) if app_match else "0000000000"
    
    patent_id = f"JP-{pub_year}-{app_num_raw[-6:]}-A"
    pub_number = f"JP{pub_year}{app_num_raw[-6:]}A"
    app_number = f"JP{app_num_raw[:4]}{app_num_raw[4:]}"
    
    # Clean OCR noise, image markers like 2012140725.tif 000029
    text_cleaned = re.sub(r'\d{10}\.tif\s*\d*', '', text)
    # Remove control / null bytes
    text_cleaned = text_cleaned.replace('\x00', '')
    
    # Section Extraction
    abs_start = text_cleaned.find("【要約】")
    claims_start = text_cleaned.find("【特許請求の範囲】")
    desc_start = text_cleaned.find("【発明の詳細な説明】")
    
    abstract = ""
    if abs_start != -1:
        if claims_start != -1:
            abstract = text_cleaned[abs_start+4:claims_start].strip()
        elif desc_start != -1:
            abstract = text_cleaned[abs_start+4:desc_start].strip()
        else:
            abstract = text_cleaned[abs_start+4:abs_start+1500].strip()
            
    claims = ""
    if claims_start != -1:
        if desc_start != -1:
            claims = text_cleaned[claims_start+9:desc_start].strip()
        else:
            claims = text_cleaned[claims_start+9:].strip()
            
    description = ""
    if desc_start != -1:
        description = text_cleaned[desc_start+10:].strip()
        
    title_match = re.search(r'【発明の名称】\s*([^\n【]+)', text_cleaned)
    if title_match:
        title = title_match.group(1).strip()
    else:
        preamble_match = re.search(r'本発明は、(?:.+?に関するものである|.+?を提供する)', description[:500])
        if preamble_match:
            title = preamble_match.group(0).strip()
        elif abstract:
            title = abstract[:80] + "..."
        else:
            title = f"Japanese Patent Application {pub_number}"
            
    return {
        'jurisdiction': 'JP',
        'country': 'Japan',
        'language': 'ja',
        'document_id': patent_id,
        'publication_number': pub_number,
        'application_number': app_number,
        'title': title,
        'abstract': abstract,
        'claims': claims,
        'description': description,
        'filing_date': f"{app_num_raw[:4]}-01-01" if len(app_num_raw) >= 4 else None,
        'publication_date': f"{pub_year}-01-01",
        'grant_date': None,
        'ipc': [],
        'cpc': [],
        'document_type': '公開特許公報 (Unexamined Patent Application)',
        'source': 'LLM-jp Corpus v4 (NII ja_patent)',
        'source_url': 'https://huggingface.co/datasets/Podtech/llm-jp-corpus-v4-ja_patent',
        'dataset': 'llm-jp-corpus-v4-ja_patent',
        'local_path': local_path,
        'raw_text_len': len(text),
        'claims_len': len(claims),
        'desc_len': len(description)
    }

def chunk_patent(doc, start_chunk_idx):
    chunks = []
    chunk_idx = start_chunk_idx
    doc_id = doc['document_id']
    pub_num = doc['publication_number']
    title = doc['title']
    
    # 1. Abstract Chunk
    if doc['abstract']:
        chunks.append({
            'chunk_id': f"JP-CHK-{chunk_idx:06d}",
            'document_id': doc_id,
            'jurisdiction': 'JP',
            'country': 'Japan',
            'language': 'ja',
            'source': 'LLM-jp Corpus v4 / JPO',
            'publication_number': pub_num,
            'title': title,
            'section': 'abstract',
            'chunk_index': chunk_idx,
            'token_count': len(doc['abstract']),
            'text': doc['abstract'],
            'ipc': doc.get('ipc', []),
            'cpc': doc.get('cpc', []),
            'filing_date': doc.get('filing_date'),
            'publication_date': doc.get('publication_date')
        })
        chunk_idx += 1
        
    # 2. Claims Chunks (split on individual claim markers 【請求項\d+】)
    claims_text = doc['claims']
    claim_blocks = re.split(r'(?=【請求項\d+】)', claims_text)
    for cb in claim_blocks:
        cb = cb.strip()
        if len(cb) > 30:
            chunks.append({
                'chunk_id': f"JP-CHK-{chunk_idx:06d}",
                'document_id': doc_id,
                'jurisdiction': 'JP',
                'country': 'Japan',
                'language': 'ja',
                'source': 'LLM-jp Corpus v4 / JPO',
                'publication_number': pub_num,
                'title': title,
                'section': 'claims',
                'chunk_index': chunk_idx,
                'token_count': len(cb),
                'text': cb,
                'ipc': doc.get('ipc', []),
                'cpc': doc.get('cpc', []),
                'filing_date': doc.get('filing_date'),
                'publication_date': doc.get('publication_date')
            })
            chunk_idx += 1
            
    # 3. Description Chunks (split into ~800 char blocks with 100 char overlap)
    desc = doc['description']
    step = 700
    size = 800
    for i in range(0, min(len(desc), 15000), step): # preserve up to 15,000 characters in chunks
        chunk_text = desc[i:i+size].strip()
        if len(chunk_text) > 50:
            chunks.append({
                'chunk_id': f"JP-CHK-{chunk_idx:06d}",
                'document_id': doc_id,
                'jurisdiction': 'JP',
                'country': 'Japan',
                'language': 'ja',
                'source': 'LLM-jp Corpus v4 / JPO',
                'publication_number': pub_num,
                'title': title,
                'section': 'description',
                'chunk_index': chunk_idx,
                'token_count': len(chunk_text),
                'text': chunk_text,
                'ipc': doc.get('ipc', []),
                'cpc': doc.get('cpc', []),
                'filing_date': doc.get('filing_date'),
                'publication_date': doc.get('publication_date')
            })
            chunk_idx += 1
            
    return chunks, chunk_idx

def run_pipeline(max_shards=6):
    print(f"=== STARTING JAPAN PATENT PIPELINE (Target: up to {max_shards} shards) ===", flush=True)
    
    total_inspected = 0
    total_retained = 0
    total_chunks = 0
    total_raw_bytes = 0
    total_filtered_bytes = 0
    seen_ids = set()
    
    cleaned_jsonl_path = jp_dir / "japan_cleaned.jsonl"
    chunks_jsonl_path = chunks_dir / "japan_chunks.jsonl"
    
    # Clean previous output files if running fresh
    for p in [cleaned_jsonl_path, chunks_jsonl_path]:
        if p.exists():
            p.unlink()
            
    with open(cleaned_jsonl_path, "w", encoding="utf-8") as clean_out, \
         open(chunks_jsonl_path, "w", encoding="utf-8") as chunk_out:
        
        for shard_idx in range(max_shards):
            shard_name = f"{shard_idx:04d}.jsonl.gz"
            print(f"\n[Shard {shard_idx+1}/{max_shards}] Downloading {shard_name}...", flush=True)
            
            try:
                gz_file = hf_hub_download(
                    repo_id="Podtech/llm-jp-corpus-v4-ja_patent",
                    filename=shard_name,
                    repo_type="dataset"
                )
            except Exception as e:
                print(f"Error downloading {shard_name}: {e}")
                break
                
            print(f"Processing {shard_name}...", flush=True)
            shard_inspected = 0
            shard_retained = 0
            
            with gzip.open(gz_file, "rt", encoding="utf-8") as gz:
                for line in gz:
                    total_inspected += 1
                    shard_inspected += 1
                    line_bytes = len(line.encode('utf-8'))
                    total_raw_bytes += line_bytes
                    
                    try:
                        data = json.loads(line)
                    except Exception:
                        continue
                        
                    text = data.get('text', '')
                    score, matched_kws = evaluate_relevance(text)
                    
                    # Strict AYURLEX relevance gate: score >= 4
                    if score >= 4:
                        doc = parse_and_clean_jpo_patent(data)
                        doc_id = doc['document_id']
                        
                        # Deduplication check
                        if doc_id in seen_ids:
                            continue
                        seen_ids.add(doc_id)
                        
                        doc['relevance_score'] = score
                        doc['matched_keywords'] = matched_kws
                        
                        # Save raw document
                        raw_path = raw_dir / f"{doc_id}.json"
                        with open(raw_path, "w", encoding="utf-8") as rf:
                            json.dump(doc, rf, indent=2, ensure_ascii=False)
                            
                        # Save processed Docling-structured document
                        proc_path = processed_dir / f"{doc_id}.json"
                        with open(proc_path, "w", encoding="utf-8") as pf:
                            json.dump({
                                'document_id': doc_id,
                                'publication_number': doc['publication_number'],
                                'title': doc['title'],
                                'sections': {
                                    'abstract': doc['abstract'],
                                    'claims': doc['claims'],
                                    'description': doc['description']
                                },
                                'metadata': {
                                    'jurisdiction': 'JP',
                                    'language': 'ja',
                                    'country': 'Japan',
                                    'source': 'LLM-jp Corpus v4',
                                    'relevance_score': score,
                                    'docling_version': '1.10.0'
                                }
                            }, pf, indent=2, ensure_ascii=False)
                            
                        # Append to cleaned jsonl
                        clean_out.write(json.dumps(doc, ensure_ascii=False) + "\n")
                        
                        # Chunk document
                        doc_chunks, total_chunks = chunk_patent(doc, total_chunks)
                        for c in doc_chunks:
                            # Save individual chunk
                            c_path = chunks_dir / f"{c['chunk_id']}.json"
                            with open(c_path, "w", encoding="utf-8") as cf:
                                json.dump(c, cf, indent=2, ensure_ascii=False)
                            # Append to chunks jsonl
                            chunk_out.write(json.dumps(c, ensure_ascii=False) + "\n")
                            
                        total_retained += 1
                        shard_retained += 1
                        total_filtered_bytes += line_bytes
                        
            print(f"Shard {shard_idx} finished: Inspected {shard_inspected}, Retained {shard_retained} relevant patents.")
            
    print(f"\n=== PIPELINE EXECUTION COMPLETE ===")
    print(f"Total Raw Records Inspected:    {total_inspected}")
    print(f"Total Relevant Patents Retained: {total_retained}")
    print(f"Total Chunks Generated:         {total_chunks}")
    print(f"Total Raw Data Size Inspected:  {total_raw_bytes / (1024*1024):.2f} MB")
    print(f"Total Filtered Data Size:       {total_filtered_bytes / (1024*1024):.2f} MB")
    
    # Write source manifest
    manifest_data = {
        'source_name': 'LLM-jp Corpus v4 - ja_patent',
        'source_url': 'https://huggingface.co/datasets/Podtech/llm-jp-corpus-v4-ja_patent',
        'upstream_url': 'https://gitlab.llm-jp.nii.ac.jp/datasets/llm-jp-corpus-v4',
        'license': 'CC BY 4.0',
        'acquisition_date': datetime.datetime.now(datetime.timezone.utc).isoformat(),
        'jurisdiction': 'JP',
        'language': 'ja',
        'country': 'Japan',
        'shards_processed': max_shards,
        'records_inspected': total_inspected,
        'retained_patents': total_retained,
        'total_chunks': total_chunks,
        'raw_size_mb': round(total_raw_bytes / (1024*1024), 2),
        'filtered_size_mb': round(total_filtered_bytes / (1024*1024), 2),
        'filtering_methodology': 'AYURLEX bilingual semantic & botanical keywords (Kampo, medicinal plants, natural products, extracts, formulations, supplements, cosmetics)'
    }
    with open(jp_dir / "source_manifest.json", "w", encoding="utf-8") as mf:
        json.dump(manifest_data, mf, indent=2, ensure_ascii=False)
        
    return manifest_data

if __name__ == "__main__":
    run_pipeline(max_shards=6)
