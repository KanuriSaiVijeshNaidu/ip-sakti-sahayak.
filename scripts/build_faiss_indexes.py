import json
import time
import os
import sys
from pathlib import Path
import numpy as np
import faiss

sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = Path('c:/project/ip_sakti1')
EMB_DIR = BASE_DIR / 'data' / 'embeddings' / 'bge_m3'
INDEX_DIR = BASE_DIR / 'data' / 'indexes' / 'faiss'
INDEX_DIR.mkdir(parents=True, exist_ok=True)

for sub in ['us', 'ep', 'wo', 'jp']:
    (INDEX_DIR / sub).mkdir(parents=True, exist_ok=True)

emb_file = EMB_DIR / 'embeddings.npy'
meta_file = EMB_DIR / 'metadata.jsonl'

assert emb_file.exists(), 'embeddings.npy not found!'
assert meta_file.exists(), 'metadata.jsonl not found!'

print('Loading embeddings.npy...')
embeddings = np.load(emb_file)
print(f'Loaded embeddings: shape={embeddings.shape}, dtype={embeddings.dtype}')
assert embeddings.dtype == np.float32, 'Embeddings must be float32!'
dim = embeddings.shape[1]
assert dim == 1024, f'Expected dim 1024, got {dim}'

print('Loading metadata.jsonl...')
metadata = []
with open(meta_file, 'r', encoding='utf-8') as f:
    for line in f:
        metadata.append(json.loads(line))
print(f'Loaded {len(metadata)} metadata rows.')
assert len(metadata) == embeddings.shape[0], 'Mismatch between embeddings and metadata rows!'

# 1. Build Global FAISS Index (IndexFlatIP)
print('Building Global IndexFlatIP...')
global_index = faiss.IndexFlatIP(dim)
global_index.add(embeddings)
assert global_index.ntotal == embeddings.shape[0]
global_index_path = INDEX_DIR / 'bge_m3_global_flatip.faiss'
faiss.write_index(global_index, str(global_index_path))
print(f'Global index written to {global_index_path} with {global_index.ntotal} vectors.')

# 2. Build Jurisdiction-Specific Indexes
jur_indices = {'US': [], 'EP': [], 'WO': [], 'JP': []}
for idx, m in enumerate(metadata):
    jur = m['jurisdiction']
    if jur in jur_indices:
        jur_indices[jur].append(idx)
    else:
        raise ValueError(f'Unexpected jurisdiction: {jur}')

for jur, row_ids in jur_indices.items():
    sub_dir = INDEX_DIR / jur.lower()
    sub_embs = embeddings[row_ids]
    sub_index = faiss.IndexFlatIP(dim)
    sub_index.add(sub_embs)
    sub_index_path = sub_dir / f'bge_m3_{jur.lower()}_flatip.faiss'
    faiss.write_index(sub_index, str(sub_index_path))
    
    # Write jurisdiction row mapping
    sub_meta_path = sub_dir / f'{jur.lower()}_mapping.jsonl'
    with open(sub_meta_path, 'w', encoding='utf-8') as sf:
        for faiss_id, orig_row_id in enumerate(row_ids):
            m_copy = dict(metadata[orig_row_id])
            m_copy['faiss_id'] = faiss_id
            sf.write(json.dumps(m_copy, ensure_ascii=False) + '\n')
            
    print(f'{jur} Index: {sub_index.ntotal} vectors written to {sub_index_path}')

print('=== ALL FAISS INDEXES BUILT SUCCESSFULLY ===')
