import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
import json
import pytest
from pathlib import Path

BASE_DIR = Path('c:/project/ip_sakti1')
DATA_DIR = BASE_DIR / 'data'
REPORTS_DIR = BASE_DIR / 'reports'
EMB_DIR = DATA_DIR / 'embedding_ready'

def test_active_jurisdictions_manifest():
    manifest_path = REPORTS_DIR / 'phase3_final_corpus_manifest.json'
    assert manifest_path.exists()
    with open(manifest_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    assert data['active_jurisdictions'] == ['US', 'EP', 'WO', 'JP']
    assert 'DE' in data['scope_removed_jurisdictions']
    assert 'IN' in data['deferred_jurisdictions']
    assert data['final_readiness_decision'] == 'EMBEDDING-READY'

def test_germany_removed_and_quarantined():
    # Quarantined germany records must remain intact
    quarantine_files = list((DATA_DIR / 'quarantine').glob('*germany*')) + list((DATA_DIR / 'germany' / 'raw').glob('*.json'))
    assert len(quarantine_files) > 0

def test_india_deferred_architecture_intact():
    # Schema must still support IN
    from backend.app.models.schemas import JurisdictionType
    # Typing check: 'IN' is valid
    assert 'IN' in JurisdictionType.__args__

def test_canonical_embedding_corpus():
    canonical_file = EMB_DIR / 'canonical_chunks.jsonl'
    assert canonical_file.exists()
    
    # Read sample chunks
    total = 0
    juris_found = set()
    with open(canonical_file, 'r', encoding='utf-8') as f:
        for i, line in enumerate(f):
            total += 1
            if i < 500:
                c = json.loads(line)
                juris_found.add(c['jurisdiction'])
                assert c['chunk_id']
                assert c['document_id']
                assert c['publication_number']
                assert len(c['text'].strip()) > 0
                assert c['embedding_ready'] is True
                assert c['jurisdiction'] in ['US', 'EP', 'WO', 'JP']
                assert c['jurisdiction'] not in ['DE', 'IN']

def test_pre_embedding_halt():
    manifest_path = REPORTS_DIR / 'phase3_final_corpus_manifest.json'
    with open(manifest_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    assert data['embedding_preparation']['vector_database_halt'] is True
