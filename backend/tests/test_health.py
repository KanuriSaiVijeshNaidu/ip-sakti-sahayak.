"""
backend/tests/test_health.py
─────────────────────────────
Phase 1 smoke test: verifies the /api/health endpoint returns 200 + expected
JSON shape without any external services (DB / models) being required.
"""
import pytest
from fastapi.testclient import TestClient

from backend.app.main import app

client = TestClient(app)


def test_health_returns_200():
    response = client.get("/api/health")
    assert response.status_code == 200


def test_health_response_schema():
    response = client.get("/api/health")
    body = response.json()
    assert body["status"] == "ok"
    assert "version" in body
    assert "environment" in body
    assert "services" in body
    assert body["status"] == "ok"
    assert "llm" in body["services"]


def test_chat_returns_real_answer():
    """Phase 5: /api/chat now returns a real RAG answer, not a stub."""
    response = client.post("/api/chat", json={
        "query": "What is a patent in India?",
        "domain": "patents",
        "jurisdiction": "IN",
    })
    assert response.status_code == 200
    data = response.json()
    assert "answer" in data
    assert len(data["answer"]) > 20


def test_product_guidance_returns_real_guidance():
    """Phase 5: /api/product-guidance now returns FSSAI guidance, not a stub."""
    response = client.post("/api/product-guidance", json={
        "product_name": "Ashwagandha Capsules",
        "query": "What FSSAI labelling is required?",
    })
    assert response.status_code == 200
    data = response.json()
    assert "guidance" in data
    assert len(data["guidance"]) > 20
