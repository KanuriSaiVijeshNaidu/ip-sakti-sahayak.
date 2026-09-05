path = "backend/tests/test_health.py"
content = open(path, encoding="utf-8").read()

# Fix 1: services["api"] -> services["llm"] which now exists
old1 = 'assert body["services"]["api"] == "ok"'
new1 = 'assert body["status"] == "ok"\n    assert "llm" in body["services"]'

# Fix 2: stub 501 -> real endpoint with proper payload  
old2 = '''def test_chat_stub_returns_501(client):
    response = client.post("/api/chat", json={})
    assert response.status_code == 501'''
new2 = '''def test_chat_returns_200(client):
    response = client.post("/api/chat", json={
        "query": "What is a patent?", "domain": "patents"
    })
    assert response.status_code == 200
    assert "answer" in response.json()'''

# Fix 3: product-guidance stub -> real endpoint
old3 = '''def test_product_guidance_stub_returns_501(client):
    response = client.post("/api/product-guidance", json={})
    assert response.status_code == 501'''
new3 = '''def test_product_guidance_returns_200(client):
    response = client.post("/api/product-guidance", json={
        "product_name": "Ashwagandha", "query": "FSSAI requirements"
    })
    assert response.status_code == 200
    assert "guidance" in response.json()'''

for old, new in [(old1, new1), (old2, new2), (old3, new3)]:
    if old in content:
        content = content.replace(old, new)
        print(f"Fixed: {old[:40]}...")
    else:
        print(f"NOT FOUND: {old[:40]}...")

open(path, "w", encoding="utf-8").write(content)
