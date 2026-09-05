path = "backend/app/ingestion/chunker.py"
lines = open(path, encoding="utf-8").readlines()

# Find start and end of SECTION_PATTERNS block
start_i = None
end_i = None
for i, line in enumerate(lines):
    if "SECTION_PATTERNS: list[re.Pattern] = [" in line:
        start_i = i
    if start_i is not None and i > start_i and line.strip() == "]":
        end_i = i
        break

if start_i is None or end_i is None:
    print(f"Block not found: start={start_i} end={end_i}")
    exit(1)

print(f"Found block: lines {start_i+1} to {end_i+1}")

new_block = [
    "SECTION_PATTERNS: list[re.Pattern] = [\n",
    "    re.compile(r'(?m)^(Section\\s+\\d+[\\w().\\-]*.*?)$', re.IGNORECASE),\n",
    "    re.compile(r'(?m)^(Regulation\\s+\\d+[\\w().\\-]*.*?)$', re.IGNORECASE),\n",
    "    re.compile(r'(?m)^(CHAPTER\\s+\\d+[\\w\\s\\-]*)$', re.IGNORECASE),\n",
    "    re.compile(r'(?m)^(={10,})$'),\n",
    "    re.compile(r'(?m)^(PRACTICAL\\s+GUIDANCE[:\\s].+)$', re.IGNORECASE),\n",
    "    re.compile(r'(?m)^((?:Step\\s+)?\\d+[.)-]\\s+[A-Z].+)$'),\n",
    "]\n",
]

new_lines = lines[:start_i] + new_block + lines[end_i+1:]
open(path, "w", encoding="utf-8").writelines(new_lines)
print("Block replaced successfully")

import ast
try:
    ast.parse(open(path, encoding="utf-8").read())
    print("Syntax OK")
except SyntaxError as e:
    print(f"Syntax error: {e}")
