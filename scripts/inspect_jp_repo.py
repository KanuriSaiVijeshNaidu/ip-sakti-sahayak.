import json
from huggingface_hub import HfApi, hf_hub_download

api = HfApi()
repo_id = 'Podtech/llm-jp-corpus-v4-ja_patent'

print('=== INSPECTING ' + repo_id + ' ===', flush=True)

try:
    info = api.dataset_info(repo_id)
    print('Dataset ID:', info.id)
    print('Author:', getattr(info, 'author', 'N/A'))
    print('SHA / Revision:', getattr(info, 'sha', 'N/A'))
    print('Tags:', getattr(info, 'tags', []))
    print('Description:', getattr(info, 'description', 'N/A'))
    print('Downloads:', getattr(info, 'downloads', 0))
    print('Likes:', getattr(info, 'likes', 0))
except Exception as e:
    print('Error getting dataset info:', e)

try:
    files = api.list_repo_files(repo_id, repo_type='dataset')
    print(f'Total files in repo: {len(files)}')
    print('First 30 files:')
    for fi in files[:30]:
        print('  -', fi)
except Exception as e:
    print('Error listing files:', e)

try:
    readme_path = hf_hub_download(repo_id=repo_id, filename='README.md', repo_type='dataset')
    with open(readme_path, 'r', encoding='utf-8') as rf:
        print('\n=== README.md ===')
        print(rf.read()[:2000])
except Exception as e:
    print('Error downloading README:', e)
