path = "backend/tests/test_health.py"
content = open(path, encoding="utf-8").read()
# Update "citations" -> "cited_passages" if present
content = content.replace('"citations"', '"cited_passages"')
open(path, "w", encoding="utf-8").write(content)
print("Health test updated")
