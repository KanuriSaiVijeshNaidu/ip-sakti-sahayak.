path = "backend/app/api/routes/chat.py"
content = open(path, encoding="utf-8").read()
old = "        include_needs_review=False,"
new = "        include_needs_review=True,   # show needs_review too; UI filters on grounding_score"
content = content.replace(old, new)
open(path, "w", encoding="utf-8").write(content)
print("Fixed chat.py")
