import urllib.request, json, sys

query_te = "ఆయుర్వేద ఆహార ఉత్పత్తులకు FSSAI లేబులింగ్ నియమాలు ఏమిటి?"

req = urllib.request.Request(
    "http://127.0.0.1:8000/api/chat",
    data=json.dumps({"query": query_te, "language": "te"}).encode("utf-8"),
    headers={"Content-Type": "application/json"},
)

with urllib.request.urlopen(req, timeout=10) as resp:
    data = json.loads(resp.read().decode("utf-8"))
    sys.stdout.buffer.write(("STATUS: " + str(resp.status) + "\n\n").encode("utf-8"))
    sys.stdout.buffer.write(("RETRIEVED CITATIONS:\n").encode("utf-8"))
    for c in data["cited_passages"][:3]:
        line = f"  • {c['section']} | Doc: {c['source_title']} ({c['domain'].upper()})\n"
        sys.stdout.buffer.write(line.encode("utf-8"))
    sys.stdout.buffer.write(("\nANSWER PREVIEW:\n" + data["answer"][:400] + "\n").encode("utf-8"))
