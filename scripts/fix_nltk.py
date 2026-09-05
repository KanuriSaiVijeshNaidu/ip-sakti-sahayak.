path = "backend/app/retrieval/bm25_retriever.py"
content = open(path, encoding="utf-8").read()

old = """# Download NLTK data once (idempotent)
def _ensure_nltk():
    for resource in ["punkt_tab", "stopwords"]:
        try:
            nltk.data.find(f"tokenizers/{resource}" if resource == "punkt_tab" else f"corpora/{resource}")
        except LookupError:
            nltk.download(resource, quiet=True)

_ensure_nltk()

from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize"""

new = """# Download NLTK data once (idempotent, safe to call repeatedly)
import nltk as _nltk_mod
_nltk_mod.download("punkt_tab", quiet=True)
_nltk_mod.download("punkt", quiet=True)
_nltk_mod.download("stopwords", quiet=True)

from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize"""

if old in content:
    content = content.replace(old, new)
    open(path, "w", encoding="utf-8").write(content)
    print("Fixed _ensure_nltk")
else:
    print("Pattern not found")
    # Show the section
    for i, line in enumerate(content.splitlines()[38:55], start=39):
        print(f"L{i}: {repr(line)}")
