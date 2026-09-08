import json
import time
import os
import sys
import hashlib
import datetime
from pathlib import Path
import numpy as np
import torch
from sentence_transformers import SentenceTransformer

sys.stdout.reconfigure(encoding='utf-8')

# ── Paths ──────────────────────────────────────────────────────────────────────
BASE_DIR = Path('c:/project/ip_sakti1')
INPUT_FILE = BASE_DIR / 'data' / 'embedding_ready' / 'canonical_chunks.jsonl'
EMB_DIR = BASE_DIR / 'data' / 'embeddings' / 'bge_m3'
CKPT_DIR = EMB_DIR / 'checkpoints'
LOG_DIR = EMB_DIR / 'logs'

for p in [EMB_DIR, CKPT_DIR, LOG_DIR]:
    p.mkdir(parents=True, exist_ok=True)

FINAL_EMB_PATH = EMB_DIR / 'embeddings.npy'
FINAL_META_PATH = EMB_DIR / 'metadata.jsonl'
MANIFEST_PATH = EMB_DIR / 'embedding_manifest.json'

BATCH_SIZE = 48
SAVE_INTERVAL = 2000  # Save every 2,000 chunks into a chunked npy part
MAX_SEQ_LENGTH = 512

# ── 1. Calculate Input SHA-256 Checksum ────────────────────────────────────────
print(f'Calculating SHA-256 checksum for {INPUT_FILE}...', flush=True)
sha256 = hashlib.sha256()
with open(INPUT_FILE, 'rb') as f:
    while chunk := f.read(1024*1024*8):
        sha256.update(chunk)
input_checksum = sha256.hexdigest()
print(f'Canonical Input SHA-256: {input_checksum}', flush=True)

# ── 2. Check Existing Checkpoints for Resumption ───────────────────────────────
completed_chunks = 0
existing_parts = sorted(CKPT_DIR.glob('part_*.npy'))
if existing_parts:
    for ep in existing_parts:
        parts = ep.stem.split('_')
        end_idx = int(parts[2])
        if end_idx > completed_chunks:
            completed_chunks = end_idx
    print(f'Found existing checkpoints up to chunk index: {completed_chunks}', flush=True)
else:
    print('Starting fresh embedding generation (0 checkpoints found).', flush=True)

# ── 3. Load Model on CUDA ──────────────────────────────────────────────────────
device = 'cuda' if torch.cuda.is_available() else 'cpu'
print(f'Loading BAAI/bge-m3 on {device}...', flush=True)
model = SentenceTransformer('BAAI/bge-m3', device=device)
model.max_seq_length = MAX_SEQ_LENGTH
print(f'Model loaded successfully on {device} with max_seq_length={model.max_seq_length}!', flush=True)

# ── 4. Stream & Encode ─────────────────────────────────────────────────────────
total_processed = completed_chunks
current_batch_texts = []
current_batch_metas = []
current_part_embs = []
current_part_start = completed_chunks

part_meta_file = CKPT_DIR / f'meta_{completed_chunks:06d}.jsonl'
meta_out = open(part_meta_file, 'a', encoding='utf-8')

t_start = time.time()

with open(INPUT_FILE, 'r', encoding='utf-8') as f:
    for line_idx, line in enumerate(f):
        if line_idx < completed_chunks:
            continue
            
        rec = json.loads(line)
        text = rec['text']
        meta = {
            'row_id': line_idx,
            'chunk_id': rec['chunk_id'],
            'document_id': rec['document_id'],
            'publication_number': rec['publication_number'],
            'jurisdiction': rec['jurisdiction'],
            'country': rec['country'],
            'language': rec['language'],
            'section': rec['section'],
            'source': rec['source']
        }
        
        current_batch_texts.append(text)
        current_batch_metas.append(meta)
        
        if len(current_batch_texts) >= BATCH_SIZE:
            batch_embs = model.encode(current_batch_texts, batch_size=BATCH_SIZE, normalize_embeddings=True, show_progress_bar=False)
            current_part_embs.append(batch_embs)
            for m in current_batch_metas:
                meta_out.write(json.dumps(m, ensure_ascii=False) + '\n')
                
            total_processed += len(current_batch_texts)
            current_batch_texts = []
            current_batch_metas = []
            
            part_len = sum(len(b) for b in current_part_embs)
            if part_len >= SAVE_INTERVAL:
                part_arr = np.vstack(current_part_embs)
                part_filename = CKPT_DIR / f'part_{current_part_start:06d}_{total_processed:06d}.npy'
                np.save(part_filename, part_arr)
                meta_out.flush()
                meta_out.close()
                
                elapsed = time.time() - t_start
                rate = (total_processed - completed_chunks) / elapsed if elapsed > 0 else 0
                remaining = (70608 - total_processed) / rate if rate > 0 else 0
                print(f'Saved checkpoint: {part_filename.name} | Progress: {total_processed}/70,608 ({total_processed/70608*100:.1f}%) | {rate:.1f} chunks/sec | ETA: {remaining/60:.1f} min', flush=True)
                
                current_part_embs = []
                current_part_start = total_processed
                part_meta_file = CKPT_DIR / f'meta_{total_processed:06d}.jsonl'
                meta_out = open(part_meta_file, 'a', encoding='utf-8')

# Flush remaining batch if any
if current_batch_texts:
    batch_embs = model.encode(current_batch_texts, batch_size=len(current_batch_texts), normalize_embeddings=True, show_progress_bar=False)
    current_part_embs.append(batch_embs)
    for m in current_batch_metas:
        meta_out.write(json.dumps(m, ensure_ascii=False) + '\n')
    total_processed += len(current_batch_texts)

if current_part_embs:
    part_arr = np.vstack(current_part_embs)
    part_filename = CKPT_DIR / f'part_{current_part_start:06d}_{total_processed:06d}.npy'
    np.save(part_filename, part_arr)
    meta_out.flush()
    meta_out.close()
    print(f'Saved final checkpoint part: {part_filename.name} | Total Processed: {total_processed}', flush=True)

# ── 5. Consolidate Checkpoint Parts into Final Artifacts ────────────────────────
print('Consolidating all checkpoint parts into unified embeddings.npy...', flush=True)
all_parts = sorted(CKPT_DIR.glob('part_*.npy'))
print(f'Found {len(all_parts)} parts to concatenate.', flush=True)
arrays = [np.load(p) for p in all_parts]
final_embeddings = np.vstack(arrays)
print(f'Final embeddings shape: {final_embeddings.shape}, dtype: {final_embeddings.dtype}', flush=True)
np.save(FINAL_EMB_PATH, final_embeddings)

print('Consolidating metadata.jsonl...', flush=True)
with open(FINAL_META_PATH, 'w', encoding='utf-8') as out_m:
    for mp in sorted(CKPT_DIR.glob('meta_*.jsonl')):
        with open(mp, 'r', encoding='utf-8') as in_m:
            for line in in_m:
                out_m.write(line)

print(f'Unified metadata written to {FINAL_META_PATH}', flush=True)

# ── 6. Manifest ────────────────────────────────────────────────────────────────
manifest = {
    'model_name': 'BAAI/bge-m3',
    'device': device,
    'max_seq_length': MAX_SEQ_LENGTH,
    'input_checksum': input_checksum,
    'total_embeddings': int(final_embeddings.shape[0]),
    'embedding_dimension': int(final_embeddings.shape[1]),
    'dtype': str(final_embeddings.dtype),
    'normalize_embeddings': True,
    'timestamp': datetime.datetime.now(datetime.timezone.utc).isoformat(),
    'status': 'COMPLETED'
}
with open(MANIFEST_PATH, 'w', encoding='utf-8') as mf:
    json.dump(manifest, mf, indent=2)

print('=== EMBEDDING PIPELINE COMPLETE ===', flush=True)
