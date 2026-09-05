import urllib.request, json, sys

req = urllib.request.Request(
    "http://127.0.0.1:8000/api/chat",
    data=json.dumps({"query": "क्या मैं अश्वगंधा के साथ आयुर्वेदिक फॉर्मूलेशन को पेटेंट करा सकता हूँ?", "language": "hi"}).encode("utf-8"),
    headers={"Content-Type": "application/json"},
)
with urllib.request.urlopen(req, timeout=10) as resp:
    data = json.loads(resp.read().decode("utf-8"))
    sys.stdout.buffer.write(("STATUS: " + str(resp.status) + "\n").encode("utf-8"))
    sys.stdout.buffer.write(("ANSWER:\n" + data["answer"][:400] + "\n").encode("utf-8"))
    sys.stdout.buffer.write(("CITATIONS:\n").encode("utf-8"))
    for c in data["cited_passages"][:3]:
        line = f"  - {c['section']} | {c['source_title']}\n"
        sys.stdout.buffer.write(line.encode("utf-8"))
