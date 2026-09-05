import urllib.request
import re

url = "http://localhost:3000"
req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
with urllib.request.urlopen(req) as resp:
    html = resp.read().decode("utf-8")
    print(f"PAGE STATUS: {resp.status} (Length: {len(html)})")
    css_matches = re.findall(r'href="(/_next/static/css/[^"]+)"', html)
    print("FOUND CSS MATCHES:", css_matches)
    for c in css_matches:
        with urllib.request.urlopen("http://localhost:3000" + c) as cr:
            data = cr.read()
            print(f"  CSS {c}: STATUS {cr.status} ({len(data)} bytes)")
