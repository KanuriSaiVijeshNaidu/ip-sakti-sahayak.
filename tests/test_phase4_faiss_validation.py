import json
import pytest
from pathlib import Path
import numpy as np
import faiss

BASE_DIR = Path('c:/project/ip_sakti1')
REPORTS_DIR = BASE_DIR / 'reports'
EMB_DIR = BASE_DIR / 'data' / 'embeddings' / 'bge_m3'
INDEX_DIR = BASE_DIR / 'data' / 'indexes' / 'faiss'

def test_phase4_manifest():
    manifest_path = REPORTS_DIR / 'phase4_embedding_manifest.json'
    assert manifest_path.exists()
    with open(manifest_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    assert data['final_decision'] == 'PHASE 4 COMPLETE'
    assert data['embedding']['total_vectors'] == 70608
    assert data['embedding']['nan_count'] == 0
    assert data['embedding']['inf_count'] == 0
    assert data['faiss']['global_vector_count'] == 70608
    assert data['faiss']['in_vector_count'] == 0
    assert data['faiss']['de_vector_count'] == 0

def test_embeddings_file_integrity():
    embs_path = EMB_DIR / 'embeddings.npy'
    assert embs_path.exists()
    embs = np.load(embs_path)
    assert embs.shape == (70608, 1024)
    assert embs.dtype == np.float32
    assert not np.isnan(embs).any()
    assert not np.isinf(embs).any()

def test_faiss_indexes_and_mappings():
    global_idx = faiss.read_index(str(INDEX_DIR / 'bge_m3_global_flatip.faiss'))
    assert global_idx.ntotal == 70608
    
    counts = {'us': 29003, 'ep': 1912, 'wo': 13652, 'jp': 26041}
    for jur, cnt in counts.items():
        sub_idx = faiss.read_index(str(INDEX_DIR / jur / f'bge_m3_{jur}_flatip.faiss'))
        assert sub_idx.ntotal == cnt
        mapping_file = INDEX_DIR / jur / f'{jur}_mapping.jsonl'
        assert mapping_file.exists()
        lines = sum(1 for _ in open(mapping_file, 'r', encoding='utf-8'))
        assert lines == cnt

def test_isolation_invariants():
    for jur in ['us', 'ep', 'wo', 'jp']:
        mapping_file = INDEX_DIR / jur / f'{jur}_mapping.jsonl'
        with open(mapping_file, 'r', encoding='utf-8') as f:
            for i, line in enumerate(f):
                if i >= 100: break
                rec = json.loads(line)
                assert rec['jurisdiction'].upper() == jur.upper()
                assert rec['jurisdiction'].upper() not in ['DE', 'IN']
