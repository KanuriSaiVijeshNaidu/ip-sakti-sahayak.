# AYURLEX (IP-SAKTI Sahayak) — Updated RAG Architecture Specification

**System Version:** 2.0 (Docling-Enhanced Hybrid Architecture)  
**Corpus Domain:** Indian Intellectual Property Law (CGPDTM Patents, Trademarks, GI Tags) & AYUSH / FSSAI Statutory Frameworks (Drugs & Cosmetics Act 1940, Rule 158B, Schedule T GMP, Ayurveda Aahara 2022, Biological Diversity Act 2002)

---

## 1. High-Level Architectural Diagram

```mermaid
flowchart TD
    subgraph INGESTION["1. Offline Ingestion & Knowledge Indexing (Docling Pipeline)"]
        A1["Raw Statutory PDFs, Acts & Gazette Notifications"] --> A2["Docling Ingestion Engine (IBM Docling)"]
        A2 -->|Layout Analysis & Table Extraction| A3["Clean Markdown Chunks (52 Chunks, 0 Noise)"]
        A3 --> A4["Metadata Enrichment (Section, Source URL, Act, Domain)"]
        A4 --> A5[("SQLite Database (Document & Chunk Tables)")]
        A4 --> A6["Lexical Index (Rank-BM25 Tokenized)"]
        A4 --> A7["Dense Embedding Model (BAAI/bge-m3 1024-dim)"]
        A7 --> A8[("FAISS Dense Vector Store (index.faiss)")]
    end

    subgraph QUERY["2. User Query & Retrieval Orchestration"]
        B1["User Legal / Regulatory Query"] --> B2{"Language Script Detection & Intent Classifier"}
        B2 -->|Parallel Search| C1["Lexical BM25 Search (Exact Sections, Form IDs)"]
        B2 -->|Parallel Search| C2["Dense Vector Search (Semantic Intent, BGE-M3)"]
    end

    subgraph FUSION["3. Fusion, Reranking & Evidence Validation"]
        C1 & C2 --> D1["Reciprocal Rank Fusion (RRF, k=60)"]
        D1 -->|Top-10 Fused Candidates| D2["Cross-Encoder Reranker (BAAI/bge-reranker-v2-m3 568M)"]
        D2 -->|Top-5 Re-scored Passages| D3["Evidence Validator (Heuristic Grounding & Dedup)"]
        D3 -->|Grounding Threshold >= 0.15| D4["Validated Evidence Block ([src-1] ... [src-N])"]
        D3 -->|Empty / Out-of-Domain| D5["Strict Zero-Hallucination Fallback Notice"]
    end

    subgraph GENERATION["4. Synthesis, Intent Routing & Conversational Continuity"]
        D4 --> E1{"Query Intent Router"}
        E1 -->|Definitional: 'trade mark', 'what is patent'| E2["Two-Layer Answer: Plain Language + Statutory Provisions"]
        E2 --> E3["💡 Proactive Conversational Continuation (Roadmap & Next Steps)"]
        E1 -->|Procedural: 'how to register trademark'| E4["6-Step Statutory Workflow (Forms, Fees, Timeline)"]
        E1 -->|Patentability: 'Ashwagandha', 'Section 3(e)/(p)'| E5["Patentability Analysis (Synergy CI < 1.0, NBA Form III)"]
        E1 -->|FSSAI: 'Ayurveda Aahara'| E6["Labelling Regulations & Schedule II Metal Limits"]
        D5 --> E7["⚠️ Insufficient Statutory Resources (Zero Plans Generated)"]
    end

    subgraph DELIVERY["5. Multi-Channel Client Presentation"]
        E3 & E4 & E5 & E6 & E7 --> F1["FastAPI /api/chat Response Payload"]
        F1 --> F2["Next.js Responsive Web UI (Citations & Clean Typography)"]
    end
```

---

## 2. Ingestion & Document Processing Pipeline (Docling)

### Why Docling?
Legal gazettes, statutory acts, and pharmacopoeias contain intricate tables, nested sections, and hierarchical schedules. Standard regex or naive PDF text extraction produces fragmented text, broken tables, and missing citation anchors.

### Docling Pipeline Workflow:
1. **Document Parsing:** Powered by `DoclingDocument`, parsing structural hierarchy (headers, sub-clauses, table borders).
2. **Section-Aware Chunking:** Chunks are split along logical statutory boundaries (`Section`, `Rule`, `Schedule`) rather than fixed arbitrary character counts.
3. **Noise Elimination:**
   - Empty/stub chunks (< 120 chars): **0**.
   - Missing citation metadata (`source_url`, `source_title`): **0%**.
   - Near-duplicate passages: **Suppressed (< 0.85 similarity threshold)**.
   - Text encoding (mojibake): **0 errors**.
4. **Storage Sync:** Chunks are indexed in SQLite (`DocumentModel` and `ChunkModel`) with relational integrity.

---

## 3. Hybrid Retrieval Architecture (Dense + Lexical)

Rather than relying purely on vector embeddings (which often miss exact alphanumeric section numbers like `Section 3(e)` or `Form TM-A`), AYURLEX employs a complementary **Hybrid Dual-Retriever**:

| Component | Technology | Primary Function |
| :--- | :--- | :--- |
| **Dense Vector Retriever** | `BAAI/bge-m3` (1024-dim) + `FAISS` Index | Understands semantic intent, natural language phrasing, synonyms, and conceptual relationships. |
| **Lexical Retriever** | `Rank-BM25` (Okapi BM25) | Exact token matching for Act names, section numbers (`2(1)(zb)`), form names (`TM-A`, `Form 24D`), and technical terms. |
| **Score Fusion** | **Reciprocal Rank Fusion (RRF)** | Merges rank lists with constant $k=60$: $RRF(d) = \sum_{r \in \{BM25, Dense\}} \frac{1}{k + rank_r(d)}$. |
| **Cross-Encoder Reranker** | `BAAI/bge-reranker-v2-m3` (568M params) | Performs joint query-document multilingual cross-attention scoring on the fused candidates to eliminate false positives. |

---

## 4. Evidence Validation & Citation Grounding

Before context is sent to the LLM synthesis layer, the **Evidence Validator** executes deterministic validation:
1. **Grounding Score Calculation:** Computes a composite metric combining cross-encoder logit confidence and query keyword overlap.
2. **Citation Key Assignment:** Assigns immutable tags (`[src-1]`, `[src-2]`, etc.) mapped to verified statutory sources and source URLs.
3. **Out-of-Scope Detection:** Queries asking for non-statutory topics (e.g., cryptocurrency, coding, weather) or having zero domain grounding trigger an immediate fallback.

---

## 5. Intent-Based Synthesis & Conversational Continuation

AYURLEX formats legal guidance into actionable tiers depending on detected user intent:

### A. Simple / Definitional Queries (`"trade mark"`, `"what is a patent"`, `"ayurveda"`)
- **Layer 1: Plain Layperson Explanation:** Everyday, intuitive analogy explaining why the protection matters (brand trust, preventing counterfeits).
- **Layer 2: Technical & Statutory Provisions:** Official definition under the statute (e.g., Section 2(1)(zb) Trade Marks Act 1999, Nice Classification classes, exclusive monopoly rights).
- **Layer 3: Proactive Continuous Follow-Up:** Proactively offers the logical next step:
  - *"💡 Recommended Next Step: How to Get / Register Your Trademark"*
  - Summarizes the filing form (Form TM-A), fees (₹4,500 for MSMEs), and immediate ™ symbol protection.
  - Prompts the user: *"Would you like the complete step-by-step guide? Ask: 'How do I register a trademark in India?'"*

### B. Procedural / How-To Queries (`"how to get the trademark"`, `"how do i register my product"`)
- Outlines the practical statutory roadmap with official government portals (`ipindia.gov.in`, `e-aushadhi.gov.in`, `FoSCoS`), exact form numbers, fees, mandatory enclosures, examination timelines, and final registration certificates.

### C. Insufficient Statutory Data (Strict Zero-Hallucination Guardrail)
- When the AYURLEX corpus does not contain verified statutory grounding:
  - Generates: `### ⚠️ Insufficient Statutory Resources in AYURLEX Corpus`
  - Recommends official portals for primary verification.
  - **Does NOT invent any rules, speculate, or generate procedural plans.**

---

## 6. Supported Multilingual Governance
- **English**, **Hindi (हिंदी)**, **Telugu (తెలుగు)**, and **Tamil (தமிழ்)**.
- Script-aware routing dynamically detects Devanagari, Telugu, or Tamil scripts and provides fully localized statutory terminology without code-switching.
