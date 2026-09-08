import gzip
import json
from huggingface_hub import hf_hub_download

repo_id = 'Podtech/llm-jp-corpus-v4-ja_patent'
file_name = '0000.jsonl.gz'

print(f'Downloading {file_name} from {repo_id}...', flush=True)
gz_path = hf_hub_download(repo_id=repo_id, filename=file_name, repo_type='dataset')
print(f'Downloaded to {gz_path}', flush=True)

import os
size_mb = os.path.getsize(gz_path) / (1024 * 1024)
print(f'Compressed file size: {size_mb:.2f} MB', flush=True)

print('\nReading first 5 records...', flush=True)
with gzip.open(gz_path, 'rt', encoding='utf-8') as gz:
    for i in range(5):
        line = gz.readline()
        if not line:
            break
        data = json.loads(line)
        print(f'\n================ RECORD {i+1} ================')
        print('Keys:', data.keys())
        meta = data.get('meta', {})
        print('Meta keys:', meta.keys() if isinstance(meta, dict) else type(meta))
        print('Meta content:', json.dumps(meta, indent=2, ensure_ascii=False)[:300])
        text = data.get('text', '')
        print(f'Text length: {len(text)} characters')
        print('Text sample (first 400 chars):')
        print(text[:400])
        print('--- End sample ---')
