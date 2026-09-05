path = "backend/app/ingestion/chunker.py"
content = open(path, encoding="utf-8").read()

old = """HEADER_FIELDS = {
    "source": re.compile(r"^Source:\\s*(.+)$", re.MULTILINE),
    "jurisdiction": re.compile(r"^Jurisdiction:\\s*(.+)$", re.MULTILINE),
    "domain": re.compile(r"^Domain:\\s*(.+)$", re.MULTILINE),
    "corpus_version": re.compile(r"^Corpus Version:\\s*(.+)$", re.MULTILINE),
}"""

new = """HEADER_FIELDS = {
    "source": re.compile(r"^Source:\\s*(.+)$", re.MULTILINE),
    # Jurisdiction line may be "Jurisdiction: IN | Domain: patents | Corpus Version: v1"
    "jurisdiction": re.compile(r"Jurisdiction:\\s*([A-Z]+)", re.MULTILINE),
    "domain": re.compile(r"Domain:\\s*(\\w+)", re.MULTILINE | re.IGNORECASE),
    "corpus_version": re.compile(r"Corpus Version:\\s*(\\w+)", re.MULTILINE | re.IGNORECASE),
}"""

if old in content:
    content = content.replace(old, new)
    open(path, "w", encoding="utf-8").write(content)
    print("HEADER_FIELDS fixed")
else:
    print("Pattern not found - dumping relevant lines:")
    for i, line in enumerate(content.splitlines()):
        if "HEADER_FIELDS" in line or "Source" in line or "Jurisdiction" in line:
            print(f"  L{i+1}: {repr(line)}")

import ast
ast.parse(open(path, encoding="utf-8").read())
print("Syntax OK")
