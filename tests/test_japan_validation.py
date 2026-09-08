import json
import pytest
from pathlib import Path

BASE_DIR = Path('c:/project/ip_sakti1')
JP_DIR = BASE_DIR / 'data' / 'japan'

def test_japan_directory_structure():
    assert JP_DIR.exists()
    assert (JP_DIR / 'raw').exists()
    assert (JP_DIR / 'processed').exists()
    assert (JP_DIR / 'chunks').exists()
    assert (JP_DIR / 'validation').exists()
    assert (JP_DIR / 'japan_cleaned.jsonl').exists()
    assert (JP_DIR / 'chunks' / 'japan_chunks.jsonl').exists()
    assert (JP_DIR / 'source_manifest.json').exists()

def test_japan_corpus_counts():
    manifest_path = JP_DIR / 'source_manifest.json'
    with open(manifest_path, 'r', encoding='utf-8') as f:
        manifest = json.load(f)
    assert manifest['retained_patents'] >= 500
    assert manifest['total_chunks'] >= 10000
    assert manifest['jurisdiction'] == 'JP'
    assert manifest['language'] == 'ja'

def test_japan_document_integrity():
    cleaned_file = JP_DIR / 'japan_cleaned.jsonl'
    doc_ids = set()
    with open(cleaned_file, 'r', encoding='utf-8') as f:
        for i, line in enumerate(f):
            if i >= 100: break
            doc = json.loads(line)
            assert doc['jurisdiction'] == 'JP'
            assert doc['country'] == 'Japan'
            assert doc['language'] == 'ja'
            assert doc['document_id'].startswith('JP-')
            assert doc['publication_number'].startswith('JP')
            assert len(doc['title']) > 0
            assert len(doc['description']) > 100
            assert doc['document_id'] not in doc_ids
            doc_ids.add(doc['document_id'])

def test_japan_chunk_metadata_isolation():
    chunks_file = JP_DIR / 'chunks' / 'japan_chunks.jsonl'
    with open(chunks_file, 'r', encoding='utf-8') as f:
        for i, line in enumerate(f):
            if i >= 200: break
            chunk = json.loads(line)
            assert chunk['jurisdiction'] == 'JP'
            assert chunk['country'] == 'Japan'
            assert chunk['language'] == 'ja'
            assert chunk['section'] in ['abstract', 'claims', 'description']
            assert len(chunk['text']) > 15
            assert chunk['chunk_id'].startswith('JP-CHK-')

def test_pre_embedding_halt():
    manifest_path = JP_DIR / 'source_manifest.json'
    with open(manifest_path, 'r', encoding='utf-8') as f:
        manifest = json.load(f)
    assert manifest.get('pre_embedding_halt') is True
