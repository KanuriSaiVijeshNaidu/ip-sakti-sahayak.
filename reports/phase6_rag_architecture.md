# Phase 6 — Evidence-Validated RAG Answer Generation + CRAG Architecture

## Executive Summary
Phase 6 implements the production generation, evidence validation, and claim-citation auditing layer for **IP-SAKTI Sahayak / AYURLEX (SIH 26045)**. Operating strictly on top of the hardened Phase 5 hybrid retrieval engine (`POST /api/retrieval/search` yielding structured `EvidenceResult[]`), Phase 6 completes the question-answering pipeline with Corrective RAG (CRAG) quality gating, diversified evidence packaging, grounded LLM generation, deterministic citation tagging (`[E1]`, `[E2]`, etc.), and post-generation claim validation.

**Phase 6 Scope Invariants**:
- **Zero Corpus Modification**: Phase 3/4 canonical chunks (70,608 chunks across US, EP, WO, JP) and FAISS indexes are completely untouched.
- **No Second Retrieval Engine**: Directly consumes Phase 5 retrieval output.
- **Deterministic Provenance**: Every statement in the answer must cite valid evidence tags; invalid or fabricated tags (`[E99]`) are automatically detected and purged.
- **Strict Jurisdiction Isolation**: Jurisdiction routing is enforced across all generation stages (`US`, `EP`, `WO`, `JP`); `IN` is deferred and `DE` is permanently quarantined.
- **Language != Jurisdiction**: Query language (e.g. Japanese `ja`) determines the response language without altering the target patent jurisdiction (e.g. US patent search conducted in Japanese yields US patent facts delivered in Japanese).

---

## 1. End-to-End RAG & CRAG Dataflow

```
                             USER QUERY
                                 │
                                 ▼
                     PHASE 5 HYBRID RETRIEVAL
             (Dense BGE-M3 + BM25 Janome + RRF + Reranker)
                                 │
                                 ▼
                         EvidenceResult[]
                                 │
                                 ▼
                     CRAG EVIDENCE EVALUATOR
                   (Status: GOOD/PARTIAL/INSUFFICIENT/INVALID)
                                 │
           ┌─────────────────────┴─────────────────────┐
           │                                           │
  INSUFFICIENT / INVALID                       GOOD / PARTIAL
           │                                           │
           ▼                                           ▼
  SAFE REJECTION / WARNING                    EVIDENCE SELECTOR
  (No hallucinated facts)                   (Diversify by Doc/Section)
                                                       │
                                                       ▼
                                              Packaged Context Block
                                              ([E1], [E2]... + Metadata)
                                                       │
                                                       ▼
                                            GROUNDED LLM GENERATION
                                           (Multilingual Strict Prompt)
                                                       │
                                                       ▼
                                              DRAFT ANSWER TEXT
                                                       │
                                                       ▼
                                            CLAIM & CITATION AUDITOR
                                     ┌─────────────────┴─────────────────┐
                                     │                                   │
                              VALID CITATIONS                     INVALID / PHANTOM
                                (Keep [E1])                      (Purge [E99], Warn)
                                     │                                   │
                                     └─────────────────┬─────────────────┘
                                                       │
                                                       ▼
                                            STRUCTURED RAG RESPONSE
                                           (RAGAnswerResponse Schema)
```

---

## 2. Detailed Component Architecture

### 2.1 CRAG Validator (`backend/app/rag/crag_validator.py`)
The Corrective RAG (CRAG) validator acts as the first defensive quality gate before any LLM generation begins. It analyzes the retrieved candidate set against rigorous technical criteria:
- **Status Evaluation**:
  - `GOOD`: High reranker confidence ($\ge 0.05$), non-empty text chunks, high metadata completeness, and strict jurisdiction alignment.
  - `PARTIAL`: Detected commercial clearance / Freedom-to-Operate (FTO) intent (e.g. "Can I sell this product commercially?"). Patents establish prior art disclosure, not statutory commercial clearance. Appropriate caveats and legal disclaimers are mandated.
  - `INSUFFICIENT`: Retrieval returned zero candidates or all chunks have low relevance / empty text. Pipeline halts generation to prevent hallucination.
  - `INVALID`: Contamination detected (e.g., European patent chunk appearing in a US-only query) or request targets forbidden jurisdictions (`IN`, `DE`).
- **Quality Metrics Evaluated**:
  - `confidence`: Weighted average of normalized reranker scores.
  - `jurisdiction_match`: Boolean ensuring 100% compliance with target jurisdiction filters.
  - `metadata_complete`: Ensures `publication_number`, `jurisdiction`, and `section` are present.
  - `duplicate_ratio`: Computes document duplication among top candidates to enforce diversity.

### 2.2 Evidence Selector (`backend/app/rag/evidence_selector.py`)
Prepares and formats the retrieved chunks for LLM consumption:
- **Document Diversification**: Caps chunks at 2 per patent document (`max_chunks_per_doc = 2`), ensuring multi-document evidence representation.
- **Top-K Selection**: Selects up to `default_top_k = 5` highest-ranked diverse chunks.
- **Citation Structure**: Generates standardized `CitationInfo` objects assigned explicit identifiers: `[E1]`, `[E2]`, ..., `[En]`.
- **Context Block Packaging**: Formats the selected evidence into structured markdown blocks containing:
  ```markdown
  [E1] Publication: US20160184354A1 | Jurisdiction: US | Section: claims | Filing Date: 2016-01-22
  Title: Formulation Kit
  Content: A pharmaceutical topical formulation comprising metronidazole for treating skin disorders...
  ```

### 2.3 Grounded LLM Generation (`backend/app/rag/answer_generator.py`)
Generates clear, natural-language answers strictly bound to the provided evidence:
- **Multilingual Grounding Prompt**:
  - Enforces response in the user's query language (e.g. Japanese, Hindi, English).
  - Explicitly instructs: *"State ONLY what is supported by [E1], [E2]... Do not invent publication numbers, filing dates, legal statuses, or unmentioned chemical compounds."*
  - Mandates bracketed citation tags after every key statement.
- **Commercial & Legal Clearance Interception**:
  - For legal clearance or commercial authorization queries, automatically prepends a statutory disclaimer:
    > *Disclaimer: Patent documents disclose prior art technical specifications and do not grant regulatory commercial authorization or freedom-to-operate clearance.*
- **Fallback & Resilience**:
  - Supports mock/offline fallback mode when external LLM endpoints are unavailable or during automated unit testing, synthesizing an audited summary directly from the evidence text.

### 2.4 Claim & Citation Auditor (`backend/app/rag/claim_validator.py`)
Performs post-generation verification to ensure factual and citation integrity:
- **Phantom Citation Detection**:
  - Scans answer text using regex `\[E(\d+)\]`.
  - Compares identified tags against the set of valid citation IDs (`{"E1", "E2", ...}`).
  - **Purge Action**: Any fabricated citation tag (e.g. `[E99]`) is stripped from the text and logged in `unsupported_claims`.
- **Jurisdiction Boundary Audit**:
  - Verifies that cited publications match the query's authorized jurisdictions.
- **Temporal & Assertion Audit**:
  - Inspects temporal claims (e.g. patent validity durations such as "valid until 2035").
  - If the year does not appear in the underlying chunk text, marks the claim as `UNSUPPORTED` with a confidence penalty.

### 2.5 Master Pipeline Orchestrator (`backend/app/rag/pipeline.py`)
Integrates all stages end-to-end:
1. Validates jurisdiction inputs (rejecting `IN` and `DE`).
2. Invokes Phase 5 retrieval (`hybrid_retriever.search`).
3. Executes CRAG evaluation (`crag_validator.evaluate`).
4. Selects and diversifies evidence (`evidence_selector.select`).
5. Generates draft grounded response (`answer_generator.generate_answer`).
6. Audits draft for citations and claims (`claim_validator.validate`).
7. Constructs and returns `RAGAnswerResponse`.

---

## 3. Schemas and API Interfaces

### 3.1 Endpoint
- **URL**: `POST /api/answer`
- **Controller**: `backend/app/api/routes/answer.py`
- **Request Body**: `RAGAnswerRequest`
  ```json
  {
    "query": "What are the US patent requirements for rosacea treatments?",
    "target_jurisdictions": ["US"],
    "top_k_evidence": 5,
    "temperature": 0.2
  }
  ```
- **Response Body**: `RAGAnswerResponse`
  ```json
  {
    "query": "What are the US patent requirements for rosacea treatments?",
    "answer": "US patent US20160184354A1 discloses topical formulations comprising metronidazole for skin disorders [E1]...",
    "detected_language": "en",
    "target_jurisdictions": ["US"],
    "crag_assessment": {
      "status": "GOOD",
      "confidence": 0.85,
      "reason": "Sufficient high-quality evidence retrieved matching target jurisdictions.",
      "evidence_count": 5,
      "usable_evidence_count": 5,
      "jurisdiction_match": true,
      "metadata_complete": true,
      "duplicate_ratio": 0.2
    },
    "citations": [
      {
        "citation_id": "E1",
        "publication_number": "US20160184354A1",
        "document_id": "US-20160184354-A1",
        "chunk_id": "chunk_us_1234",
        "jurisdiction": "US",
        "section": "claims",
        "title": "Topical Metronidazole Formulations",
        "source": "USPTO",
        "source_url": "https://patents.google.com/patent/US20160184354A1"
      }
    ],
    "claim_validation": {
      "total_claims": 2,
      "supported_claims": 2,
      "unsupported_claims": 0,
      "phantom_citations_found": [],
      "is_valid": true,
      "validation_notes": "All cited evidence tags are valid and supported."
    },
    "execution_time_ms": 1420.5
  }
  ```

---

## 4. Frontend Integration (`frontend/src/app/international/page.tsx`)
The international patent search user interface is upgraded with:
1. **AI-Grounded Answer Tab**: Displays the validated natural-language answer alongside the raw evidence list.
2. **CRAG Status Badge**: Color-coded indicator (`GOOD` = green, `PARTIAL` = yellow, `INSUFFICIENT` = red, `INVALID` = destructive red).
3. **Interactive Citation Badges**: Clickable `[E1]`, `[E2]` badges within the answer highlight and link to the source citation card.
4. **Claim Validation Breakdown**: Displays total claims, supported count, and audit notes.
5. **Evidence Viewer Drawer**: Allows users to inspect full chunk text, patent section, publication dates, and Google Patents source URLs.