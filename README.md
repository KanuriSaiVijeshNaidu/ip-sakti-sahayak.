# AYURLEX : IP-SAKTI Sahayak (SIH26045)
### Sovereign AI Legal, Intellectual Property & Regulatory Compliance Engine for AYUSH & TKDL

[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2014%20App%20Router-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI%200.110-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Supabase](https://img.shields.io/badge/Auth%20%26%20DB-Supabase%20Cloud%20(RLS)-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)
[![PyTorch](https://img.shields.io/badge/Reranker-BAAI%2Fbge--reranker--v2--m3%20(568M)-EE4C2C?style=flat-square&logo=pytorch)](https://huggingface.co/BAAI/bge-reranker-v2-m3)
[![License](https://img.shields.io/badge/Ministry-Ministry%20of%20Ayush%20%7C%20SIH26045-orange?style=flat-square)](https://ayush.gov.in/)
[![Status](https://img.shields.io/badge/Vercel%20Production-Ready%20%E2%9C%93-brightgreen?style=flat-square&logo=vercel)](https://vercel.com/)

---

## 📖 Table of Contents
1. [Executive Overview & Problem Statement](#-executive-overview--problem-statement)
2. [Key Innovations & Technical Highlights](#-key-innovations--technical-highlights)
3. [Complete System Architecture](#-complete-system-architecture)
4. [4-Stage Multilingual Hybrid RAG Engine](#-4-stage-multilingual-hybrid-rag-engine)
5. [Docling-Powered Structured Document Extraction](#-docling-powered-structured-document-extraction)
6. [Supabase Authentication & User Profile System](#-supabase-authentication--user-profile-system)
7. [SHA-256 Blockchain Ledger & Audit Provenance](#-sha-256-blockchain-ledger--audit-provenance)
8. [Authoritative Datasets & Statutory Corpora](#-authoritative-datasets--statutory-corpora)
9. [Project Directory Layout](#-project-directory-layout)
10. [Quickstart & Local Installation](#-quickstart--local-installation)
11. [Environment Configuration (`.env`)](#-environment-configuration-env)
12. [API Reference & Endpoints](#-api-reference--endpoints)
13. [Verification & Automated Test Suites](#-verification--automated-test-suites)
14. [Production Deployment Guide](#-production-deployment-guide)

---

## 🏛️ Executive Overview & Problem Statement

In the domain of traditional Indian medicine (Ayurveda, Siddha, Unani, Sowa-Rigpa, and Homoeopathy) and modern patent law, practitioners, patent attorneys, and startups face severe statutory complexity:
- **Biopiracy & TKDL Violations**: Inadvertent claims on centuries-old traditional knowledge codified under Section 3(p) of the Patents Act, 1970.
- **Section 3(e) Synergistic Efficacy Hurdles**: Mere admixtures are non-patentable unless synergistic bio-efficacy is empirically proven.
- **Regulatory Fragmentation**: Interlocking compliance across the **Drugs and Cosmetics Act, 1940**, **Rule 158B (Proof of Safety & Efficacy)**, **Schedule T (GMP)**, **Biological Diversity Act, 2002 (Form III Approval)**, and **FSSAI (Ayurveda Aahara Regulations)**.
- **Zero-Tolerance for Hallucinations**: Generic Large Language Models (LLMs) hallucinate nonexistent patent sections and incorrect classical formulation recipes.

**AYURLEX (IP-SAKTI Sahayak)** is an enterprise-grade, sovereign AI regulatory co-pilot engineered for the **Ministry of Ayush (Problem Statement SIH26045)**. It enforces **100% grounded legal retrieval**, strict cross-encoder reranking, multilingual concept mapping, user-profile isolation, and SHA-256 cryptographic audit trails.

---

## ⚡ Key Innovations & Technical Highlights

- **4-Stage Hybrid Retrieval Pipeline**: Dual BM25 sparse + FAISS dense retrieval combined via Reciprocal Rank Fusion (RRF), passed through state-of-the-art **BAAI/bge-reranker-v2-m3** (568M parameters).
- **Docling Document Ingestion**: Structure-aware parsing preserving tables, legal schedules, formulation ingredient ratios, and classical Sanskrit slokas.
- **Supabase Cloud Authentication**:
  - First-time login: Instant Gmail OTP verification.
  - Return login: Secure Username & Password verification.
  - Dedicated User Details & Profile Page (`/profile`) displaying full legal name, verified email, professional position, and username.
- **Statutory Cryptographic Receipts**: Every generated legal opinion produces a verifiable SHA-256 blockchain audit hash tied to canonical gazette passage IDs.
- **Comprehensive Multilingual Support**: Cross-lingual semantic query matching across English, Hindi, Sanskrit, Telugu, Tamil, Kannada, and Malayalam.

---

## 🏗️ Complete System Architecture

```mermaid
graph TD
    User([Practitioner / Attorney / Citizen]) -->|HTTPS / Next.js 14 UI| FE[Frontend Client - Next.js 14]
    
    subgraph Frontend [Next.js App Router (Port 3000)]
        FE --> AuthModal[Supabase Auth Engine]
        FE --> ProfilePage[User Profile & Details Page (/profile)]
        FE --> ChatWorkspace[Real-Time Multilingual Workspace (/)]
        FE --> AdminView[Admin Grounding & Trace View (/admin)]
    end

    AuthModal -->|OAuth / OTP / RLS| SupabaseCloud[(Supabase Cloud DB)]
    ProfilePage -->|Fetch / Upsert Profile| SupabaseCloud

    FE -->|JSON REST API| Gateway[FastAPI Backend Gateway (Port 8000)]

    subgraph Backend [FastAPI RAG Core (Port 8000)]
        Gateway --> QueryEngine[Multilingual Query Normalizer]
        QueryEngine -->|Sanskrit/Vernacular Expansion| TermOntology[(Terminology Ontology)]
        
        subgraph Stage1 [Stage 1: Dual Lexical & Dense Retrieval]
            QueryEngine --> BM25Engine[BM25 Okapi Sparse Search]
            QueryEngine --> FAISSEngine[FAISS Dense Vector Search]
        end

        Stage1 --> RRF[Stage 2: Reciprocal Rank Fusion - k=60]
        
        subgraph Stage3 [Stage 3: Deep Neural Cross-Encoder]
            RRF --> BGE[BAAI/bge-reranker-v2-m3 (568M Params / 1024 Tokens)]
        end

        BGE --> Filter[Top-K Passage Threshold Filter]
        
        subgraph Stage4 [Stage 4: Grounding & Blockchain Ledger]
            Filter --> LLM[Grounded Context Generator]
            LLM --> Ledger[SHA-256 Statutory Audit Ledger]
        end
    end

    subgraph Storage [Authoritative Knowledge Corpora]
        BM25Engine --> Chunks[data/chunks/chunks.jsonl]
        FAISSEngine --> Chunks
        Docling[Docling PDF Parser] --> Chunks
    end

    Ledger -->|Verified Response + Blockchain Receipt| FE
```

---

## 🔬 4-Stage Multilingual Hybrid RAG Engine

AYURLEX does not feed raw user prompts directly into a generative model. Instead, it runs an exact 4-stage pipeline:

```
[User Query]
     │
     ▼
[Stage 1: Dual Retrieval]
  ├── Sparse: BM25 Okapi lexical scoring over tokenized legal terms
  └── Dense: 768-dim vector embeddings over multilingual semantic space
     │
     ▼
[Stage 2: Reciprocal Rank Fusion (RRF)]
  └── Score = Σ (1 / (60 + Rank_bm25)) + Σ (1 / (60 + Rank_dense))
     │
     ▼
[Stage 3: Deep Cross-Encoder Reranking]
  └── Model: BAAI/bge-reranker-v2-m3 (568 Million Parameters)
  └── Context Window: 1024 tokens (full cross-attention between query & candidate)
  └── Multi-lingual: Joint multilingual cross-attention across 100+ languages
     │
     ▼
[Stage 4: Legal Grounding & Provenance]
  └── Grounding confidence score calculation
  └── SHA-256 cryptographic receipt generation
  └── Cited passage attribution (Section, Schedule, Source URL)
```

---

## 📑 Docling-Powered Structured Document Extraction

Ayurvedic texts, pharmacopoeias, and patent gazettes contain complex structures (multi-column tables, botanical classifications, ingredient formulas in Latin and Sanskrit). 

AYURLEX integrates **IBM Docling** to extract and convert official gazette PDFs into lossless Markdown and structured JSONL chunks:
* **Table Reconstruction**: Preserves ingredient percentages, classical text references (*Charaka Samhita*, *Sushruta Samhita*, *Bhaishajya Ratnavali*), and clinical trial outcomes.
* **Hierarchical Chunking**: Respects Chapter, Section, Sub-section, and Schedule boundaries to ensure chunks are never severed midway through a statutory clause.
* **Metadata Tagging**: Enriches every chunk with `domain`, `jurisdiction`, `source_title`, `section`, `canonical_url`, and `sha256_hash`.

---

## 🔐 Supabase Authentication & User Profile System

AYURLEX implements an authentication system backed by **Supabase Cloud** with Row-Level Security (RLS):

### Dual-Method Authentication Flow:
1. **First-Time Sign-Up / Login**:
   - User inputs their official Gmail address.
   - A 6-digit cryptographic OTP is generated and verified via Supabase Auth.
   - User profile is registered in the cloud database table `ayurlex_users`.
2. **Returning Login**:
   - User logs in directly using their unique `@username` and password.
   - Enforces unique username collision checks and SHA-256 salted password digests.

### Dedicated User Details Page (`/profile`):
- **Full Legal Name**: Displayed with in-place profile update controls.
- **Verified Gmail**: Linked with official Supabase verification badge.
- **Professional Role / Position**:
  - *Ayurvedic Doctor / Vaidya* (ISM Registered Practitioner)
  - *Patent Attorney / IP Agent* (CGPDTM Bar Registered)
  - *Regulatory Auditor / FSSAI Officer* (State Licensing Authority)
  - *AYUSH Enterprise / Scientist* (R&D Scholar / Herbal Exporter)
  - *Public Citizen / Researcher* (General Statutory Inquirer)
- **Username (`@username`)**: Permanent handle for instant password-based logins.
- **AYUR-ID & Institution**: Affiliation details and statutory registration records.
- **Bottom Sign Out**: The Sign Out action is located at the **very bottom of the Profile page** and removed from the top navigation.

---

## ⛓️ SHA-256 Blockchain Ledger & Audit Provenance

To satisfy legal admissibility and regulatory auditing standards, every response generated by AYURLEX is stamped with a **Statutory Blockchain Receipt**:

```json
{
  "receipt_id": "RCPT-2026-9B3C84DF",
  "sha256_hash": "a4f59e1208d98c17b8971fbe9d6e8721c5f3b761a298e3b1c6742918df9102c4",
  "timestamp": "2026-09-07T01:40:00.000Z",
  "consensus_status": "VALIDATED",
  "block_height": 14209,
  "node_validator": "AYURLEX-CONSENSUS-NODE-01",
  "grounded_score": 0.984
}
```

This ensures that statutory advice delivered to patent examiners or Ayurvedic drug manufacturers can be forensically audited and verified against the exact gazette version cited.

---

## 📚 Authoritative Datasets & Statutory Corpora

AYURLEX operates strictly over verified, official government and statutory repositories:

| Corpus Code | Statutory Source | Legal / Technical Scope |
| :--- | :--- | :--- |
| **TKDL** | Traditional Knowledge Digital Library | 300,000+ classical formulations, CSIR biopiracy defense records |
| **API** | Ayurvedic Pharmacopoeia of India | Official monographs, thin-layer chromatography (TLC), physicochemical standards |
| **AFI** | Ayurvedic Formulary of India | Classical recipe formulations (*Asava, Arishta, Churna, Bhasma, Taila*) |
| **IP-ACT** | Patents Act, 1970 | Sections 3(e), 3(p), 10(4), Form 18A expedited examination rules |
| **D&C-1940** | Drugs & Cosmetics Act, 1940 | Chapter IV-A, Sec 33EE (Misbranded), Sec 33EEB (Patent/Proprietary) |
| **D&C-1945** | Drugs & Cosmetics Rules, 1945 | Rule 158B licensing protocols, Schedule T GMP specifications |
| **BDA-2002** | Biological Diversity Act, 2002 | Section 6 NBA approval, Form III bioresource access, ABS exemptions |
| **FSSAI** | Food Safety & Standards (Ayurveda Aahara) | Regulations 2022, botanical identity, permissible daily allowances |
| **GI-REG** | Indian Geographical Indications Registry | Indigenous medicinal crops (*Kashmir Saffron, Navara Rice, Darjeeling Tea*) |
| **WIPO-IGC** | WIPO Intergovernmental Committee | Diplomatic treaty drafts on genetic resources and associated traditional knowledge |

---

## 📁 Project Directory Layout

```
ip_sakti1/
├── README.md                          # Master Project Documentation (This File)
├── DATA_PIPELINE_README.md            # Knowledge Pipeline & Data Audit Spec
├── pyproject.toml                     # Python Package Dependencies
├── render.yaml                        # Render Cloud Backend Deployment Config
│
├── backend/                           # FastAPI Core Engine
│   ├── app/
│   │   ├── main.py                    # FastAPI Entrypoint & Middleware
│   │   ├── core/                      # Configuration, Security, Logging
│   │   ├── api/                       # API Routers (/chat, /health, /admin)
│   │   ├── models/                    # Pydantic Schemas & Types
│   │   └── services/
│   │       ├── rag_service.py         # 4-Stage Multilingual RAG Orchestrator
│   │       ├── reranker.py            # BAAI/bge-reranker-v2-m3 Engine
│   │       ├── bm25_search.py         # BM25 Lexical Index
│   │       ├── vector_search.py       # Dense FAISS Retrieval Index
│   │       ├── docling_parser.py      # Docling Document Parsing Engine
│   │       └── blockchain.py          # SHA-256 Ledger & Audit Receipts
│   └── tests/                         # Backend Unit & Integration Tests
│
├── frontend/                          # Next.js 14 App Router UI
│   ├── package.json                   # Node.js Dependencies
│   ├── tsconfig.json                  # TypeScript Configuration
│   ├── tailwind.config.js             # Tailwind Styling Configuration
│   ├── public/                        # Static Assets, Wallpapers & README download
│   └── src/
│       ├── app/
│       │   ├── layout.tsx             # Root Application Layout
│       │   ├── page.tsx               # Primary Chat & Advisory Interface
│       │   ├── login/page.tsx         # Supabase OTP & Username/Password Login
│       │   ├── profile/page.tsx       # Dedicated User Details & Profile Page
│       │   ├── admin/page.tsx         # Statutory RAG Trace & Retrieval Inspector
│       │   └── api/                   # Next.js API Routes (Auth, OTP, Sync)
│       ├── components/
│       │   ├── Header.tsx             # Clean Navigation Bar
│       │   ├── ChatBubble.tsx         # Grounded Legal Citations & Blockchain Badge
│       │   ├── ChatInput.tsx          # Multilingual Voice & Text Input
│       │   ├── DomainSelector.tsx     # Patent / Trademark / GI / AYUSH / FSSAI Filter
│       │   ├── SuggestionsGrid.tsx    # Curated Statutory Scenarios
│       │   └── LiveNatureWallpaper.tsx# Responsive Background Aesthetic
│       ├── lib/
│       │   ├── api.ts                 # Backend Client Interface
│       │   ├── supabase.ts            # Supabase Cloud Client, Auth & Profile Helpers
│       │   ├── domainData.ts          # Statutory Metadata & Cross-References
│       │   └── i18n.ts                # Multilingual Translations (7 Languages)
│       └── types/
│           └── index.ts               # Core TypeScript Domain Models
│
└── data/                              # Canonical Knowledge Base
    ├── raw/                           # Original Gazette Acts, Rules & Pharmacopoeias
    ├── processed/                     # Structured JSON & JSONL Documents
    ├── chunks/                        # Structure-Aware Document Chunks
    └── metadata/                      # Multilingual Terminology Ontologies
```

---

## 🚀 Quickstart & Local Installation

### Prerequisites:
- **Python 3.10+ / 3.11+**
- **Node.js 18+ / 20+** and **npm**
- **Git**

### Step 1: Clone the Repository
```bash
git clone https://github.com/KanuriSaiVijeshNaidu/ip-sakti-sahayak..git
cd ip_sakti1
```

### Step 2: Set Up Python Backend Virtual Environment
```bash
# Create virtual environment
python -m venv .venv

# Activate virtual environment
# On Windows (PowerShell):
.venv\Scripts\Activate.ps1
# On Linux / macOS:
source .venv/bin/activate

# Install backend dependencies
pip install -r requirements.txt
# Or via pyproject.toml
pip install -e .
```

### Step 3: Set Up Next.js Frontend
```bash
cd frontend
npm install
cd ..
```

### Step 4: Run the Full System Locally

#### Terminal 1: Launch FastAPI Backend
```bash
# Activate virtual environment
.venv\Scripts\activate

# Launch uvicorn server on port 8000
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```
*Backend API Docs will be available at:* `http://127.0.0.1:8000/docs`

#### Terminal 2: Launch Next.js Frontend
```bash
cd frontend
npm run dev
```
*Frontend Web Application will be available at:* `http://localhost:3000`

---

## ⚙️ Environment Configuration (`.env`)

Create a `.env` file in the root directory or configure `.env.local` inside `frontend/`:

```env
# ==========================================
# AYURLEX Master Environment Configuration
# ==========================================

# ── Backend Configuration ─────────────────
API_PORT=8000
API_HOST=127.0.0.1
ENVIRONMENT=production
CORS_ORIGINS=http://localhost:3000,https://*.vercel.app

# ── Reranker & Model Settings ──────────────
RERANKER_MODEL=BAAI/bge-reranker-v2-m3
USE_GPU=false
RETRIEVAL_TOP_K=25
RERANK_TOP_K=5

# ── Supabase Cloud Authentication ─────────
NEXT_PUBLIC_SUPABASE_URL=https://aqosnjagwmliqzndzwwg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_73gYVyuH3sCsBNiIBcicbw_8Jd2WTGH
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_if_applicable

# ── Frontend API Bridge ───────────────────
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

---

## 📡 API Reference & Endpoints

### 1. Statutory Consultation Chat
* **Endpoint**: `POST /api/v1/chat`
* **Request Payload**:
  ```json
  {
    "query": "Can an Ayurvedic herbal extract with Turmeric and Black Pepper be patented under Section 3(e)?",
    "domain": "patents",
    "jurisdiction": "IN",
    "language": "en"
  }
  ```
* **Response Payload**:
  ```json
  {
    "answer": "Under Section 3(e) of the Indian Patents Act, 1970, a mere admixture resulting only in aggregation of properties is non-patentable. However, if synergistic bio-enhancement (such as Piperine augmenting Curcumin bioavailability) is demonstrated through quantitative bioassays and a Combination Index (CI < 1), a patent claim may be sustained, subject to Section 3(p) TKDL and Section 6 Biological Diversity Act compliance.",
    "cited_passages": [
      {
        "passage_text": "Section 3(e): A substance obtained by a mere admixture resulting only in the aggregation of the properties of the components thereof or a process for producing such substance is not an invention...",
        "source_title": "The Patents Act, 1970 (Act No. 39 of 1970)",
        "section": "Section 3(e)",
        "domain": "patents",
        "relevance_score": 0.984
      }
    ],
    "blockchain_receipt": {
      "receipt_id": "RCPT-2026-9B3C84DF",
      "sha256_hash": "a4f59e1208d98c17b8971fbe9d6e8721c5f3b761a298e3b1c6742918df9102c4",
      "consensus_status": "VALIDATED"
    },
    "total_latency_ms": 114
  }
  ```

### 2. Retrieval Trace & Grounding Audit
* **Endpoint**: `POST /api/v1/admin/trace`
* **Description**: Returns all unpruned BM25, FAISS, RRF, and Cross-Encoder candidate scores for transparency and auditing.

---

## 🧪 Verification & Automated Test Suites

The repository contains automated diagnostic and performance benchmark test suites:

```bash
# Run backend integration tests
pytest backend/tests/

# Run live system diagnostics & cross-encoder verification
python -m pytest tests/test_reranker.py

# Test Next.js production build and TypeScript validity
cd frontend
npm run build
```

---

## 🌐 Production Deployment Guide

### Deploying Frontend to Vercel
1. Connect your GitHub repository to [Vercel](https://vercel.com).
2. Set Root Directory to `frontend`.
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_API_URL` (URL of your deployed backend)
4. Deploy! Builds are automatically validated on every git push.

### Deploying Backend to Render / Cloud
1. Create a **Web Service** on [Render](https://render.com) using the root `render.yaml`.
2. Set Environment to `Python 3`.
3. Build Command: `pip install -r requirements.txt`
4. Start Command: `uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT`

---

## 👥 Authors & Acknowledgments

- **Developed for**: Smart India Hackathon (SIH26045)
- **Problem Statement**: AI-Powered Intellectual Property & Regulatory Co-Pilot for AYUSH & Indian Medicine
- **Supported by**: Ministry of Ayush & Intellectual Property India (CGPDTM)
- **Primary Maintainer**: [Kanuri Sai Vijesh Naidu](https://github.com/KanuriSaiVijeshNaidu)

---
*AYURLEX is an AI decision-support platform designed to assist legal practitioners, researchers, and drug manufacturers. Final statutory submissions must be reviewed by an accredited patent attorney or registered state licensing authority.*
