"""
backend/tests/test_chat.py
────────────────────────────
Phase 5 integration tests for /api/chat and /api/product-guidance.

Uses FastAPI TestClient (sync) so no running server needed.
All retrieval and LLM calls are real — the mock LLM ensures
deterministic responses without any API keys.
"""
from __future__ import annotations

import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app, raise_server_exceptions=True)


# ─── Health ───────────────────────────────────────────────────────────────────

def test_health_ok():
    resp = client.get("/api/health")
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "ok"
    assert "version" in data


# ─── Chat endpoint ────────────────────────────────────────────────────────────

def test_chat_returns_200():
    resp = client.post("/api/chat", json={
        "query": "Can I patent an Ayurvedic herbal formulation?",
        "domain": "patents",
        "jurisdiction": "IN",
        "language": "en",
    })
    assert resp.status_code == 200


def test_chat_response_has_answer():
    resp = client.post("/api/chat", json={
        "query": "What are the grounds for patent refusal in India?",
        "domain": "patents",
    })
    data = resp.json()
    assert "answer" in data
    assert len(data["answer"]) > 20


def test_chat_response_has_cited_passages():
    resp = client.post("/api/chat", json={
        "query": "What is Section 3(e) of the Patents Act?",
        "domain": "patents",
        "jurisdiction": "IN",
    })
    data = resp.json()
    assert "cited_passages" in data
    assert isinstance(data["cited_passages"], list)


def test_chat_cited_passages_have_required_fields():
    resp = client.post("/api/chat", json={
        "query": "Trademark filing process for Ayurveda products",
        "domain": "trademarks",
    })
    data = resp.json()
    for passage in data.get("cited_passages", []):
        assert "passage_text" in passage
        assert "domain" in passage
        assert "jurisdiction" in passage
        assert "relevance_score" in passage
        assert 0.0 <= passage["relevance_score"] <= 1.0


def test_chat_has_latency_fields():
    resp = client.post("/api/chat", json={
        "query": "FSSAI labelling requirements for herbal products",
    })
    data = resp.json()
    assert "total_latency_ms" in data
    assert isinstance(data["total_latency_ms"], int)


def test_chat_empty_query_returns_400():
    resp = client.post("/api/chat", json={"query": "  "})
    # Either 422 (Pydantic min_length) or 400 (our manual check)
    assert resp.status_code in (400, 422)


def test_chat_model_used_field():
    resp = client.post("/api/chat", json={
        "query": "Patent term in India for pharmaceutical inventions",
        "domain": "patents",
    })
    data = resp.json()
    assert "model_used" in data
    assert data["model_used"] == "mock-v1"


def test_chat_corpus_version_in_response():
    resp = client.post("/api/chat", json={
        "query": "GI tag for Ayurvedic products",
        "corpus_version": "v1",
    })
    data = resp.json()
    assert data.get("corpus_version") == "v1"


def test_chat_no_domain_filter_works():
    """Query without domain should still return results across all corpora."""
    resp = client.post("/api/chat", json={
        "query": "What are the compliance requirements for herbal products in India?",
    })
    assert resp.status_code == 200
    data = resp.json()
    assert len(data["answer"]) > 10


# ─── Product Guidance endpoint ────────────────────────────────────────────────

def test_product_guidance_returns_200():
    resp = client.post("/api/product-guidance", json={
        "product_name": "Ashwagandha Capsules",
        "query": "What FSSAI labelling is required?",
        "jurisdiction": "IN",
    })
    assert resp.status_code == 200


def test_product_guidance_has_guidance():
    resp = client.post("/api/product-guidance", json={
        "product_name": "Triphala Churna",
        "query": "Can I make health claims on the label?",
    })
    data = resp.json()
    assert "guidance" in data
    assert len(data["guidance"]) > 20


def test_product_guidance_has_cited_passages():
    resp = client.post("/api/product-guidance", json={
        "product_name": "Brahmi Extract",
        "query": "Labelling and packaging requirements",
    })
    data = resp.json()
    assert "cited_passages" in data
    assert isinstance(data["cited_passages"], list)


def test_product_guidance_has_applicable_regulations():
    resp = client.post("/api/product-guidance", json={
        "product_name": "Chyawanprash",
        "query": "Which FSSAI regulations apply?",
    })
    data = resp.json()
    assert "applicable_regulations" in data
    assert isinstance(data["applicable_regulations"], list)


def test_product_guidance_empty_returns_400():
    resp = client.post("/api/product-guidance", json={})
    assert resp.status_code in (400, 422)


def test_product_guidance_product_name_in_response():
    resp = client.post("/api/product-guidance", json={
        "product_name": "Shatavari Powder",
        "query": "Permitted ingredients and classification",
    })
    data = resp.json()
    assert data.get("product_name") == "Shatavari Powder"
