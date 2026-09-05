-- docker/init.sql
-- Bootstraps the pgvector extension and the core schema for IP-SAKTI.
-- This script is executed once when the Postgres container is first created.

CREATE EXTENSION IF NOT EXISTS vector;

-- ─── Corpus documents (raw metadata) ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS documents (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title           TEXT NOT NULL,
    source_url      TEXT,
    domain          TEXT NOT NULL,          -- patents | trademarks | gi | ayush | fssai
    jurisdiction    TEXT NOT NULL,          -- IN | WO | EU | GLOBAL
    corpus_version  TEXT NOT NULL DEFAULT 'v1',
    language        TEXT NOT NULL DEFAULT 'en',
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Text chunks with dense vector ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS chunks (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id     UUID REFERENCES documents(id) ON DELETE CASCADE,
    chunk_index     INTEGER NOT NULL,
    text            TEXT NOT NULL,
    embedding       VECTOR(1024),           -- BGE-M3 produces 1024-dim vectors
    section_title   TEXT,
    page_number     INTEGER,
    domain          TEXT NOT NULL,
    jurisdiction    TEXT NOT NULL,
    corpus_version  TEXT NOT NULL DEFAULT 'v1',
    metadata        JSONB DEFAULT '{}',
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─── HNSW index for fast ANN search ─────────────────────────────────────────
CREATE INDEX IF NOT EXISTS chunks_embedding_hnsw
    ON chunks USING hnsw (embedding vector_cosine_ops)
    WITH (m = 16, ef_construction = 64);

-- ─── Domain / jurisdiction filters ───────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_chunks_domain          ON chunks(domain);
CREATE INDEX IF NOT EXISTS idx_chunks_jurisdiction    ON chunks(jurisdiction);
CREATE INDEX IF NOT EXISTS idx_chunks_corpus_version  ON chunks(corpus_version);

-- ─── Query / evaluation log (used by Admin UI) ───────────────────────────────
CREATE TABLE IF NOT EXISTS query_logs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    query_text      TEXT NOT NULL,
    language        TEXT,
    domain          TEXT,
    jurisdiction    TEXT,
    bm25_scores     JSONB DEFAULT '[]',
    vector_scores   JSONB DEFAULT '[]',
    rrf_scores      JSONB DEFAULT '[]',
    reranked_scores JSONB DEFAULT '[]',
    llm_response    TEXT,
    latency_ms      INTEGER,
    corpus_version  TEXT DEFAULT 'v1',
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
