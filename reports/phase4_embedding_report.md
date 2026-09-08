# Phase 4 — BGE-M3 Multilingual Embedding Report
## AYURLEX / IP-SAKTI Sahayak (SIH 26045)

---

### 1. Overview & Verification Summary
In Phase 4, multilingual dense embeddings were generated across the entire active production corpus of **70,608 chunks** using **BAAI/bge-m3** with hardware acceleration on an **NVIDIA GeForce RTX 4050 Laptop GPU (6.00 GB VRAM)**.

### 2. Input Specifications & Provenance
- **Canonical Input Path**: data/embedding_ready/canonical_chunks.jsonl
- **Input Checksum (SHA-256)**: 6fd6b01ed0d8e2b1ec1fd07a5e90c6288c381ce6250dd3460e146f98964753b7
- **Total Canonical Chunks**: **70,608**
- **Unique Chunks**: **70,608** (0 duplicates)
- **Unique Documents**: **2,833** deduplicated patent documents (US: 1,123, EP: 636, WO: 339, JP: 735)
- **Jurisdictions**:
  - US: 29,003 chunks
  - EP: 1,912 chunks
  - WO: 13,652 chunks
  - JP: 26,041 chunks
  - IN: 0 (Deferred)
  - DE: 0 (Removed from active scope)
- **Languages**:
  - English (en): 44,567 chunks
  - Japanese (ja): 26,041 chunks (100% original text preserved)

### 3. Model & Hardware Architecture
- **Model**: BAAI/bge-m3
- **Embedding Dimension**: 1024
- **Sequence Length**: 512
- **Normalization**: True (
ormalize_embeddings=True)
- **Dtype**: loat32
- **Hardware Device**: cuda (NVIDIA GeForce RTX 4050 Laptop GPU)
- **Environment**: PyTorch 2.6.0+cu124, Sentence-Transformers 3.0.1
- **Batch Size**: 48
- **Processing Rate**: ~12.1–14.5 chunks/second

### 4. Resumable Checkpoint Execution & Vector Integrity
- **Persistence Strategy**: Flushed every 2,000 vectors as .npy and .jsonl pairs across 36 checkpoint batches in data/embeddings/bge_m3/checkpoints/.
- **Final Output Artifacts**:
  - data/embeddings/bge_m3/embeddings.npy (275.81 MB, shape: 70608 x 1024)
  - data/embeddings/bge_m3/metadata.jsonl (70,608 rows, exact 1:1 row alignment)
- **Vector Validation Metrics**:
  - Total Vectors: **70,608**
  - NaN Count: **0**
  - Inf Count: **0**
  - Norm Statistics: Min = 1.000000, Max = 1.000000, Mean = 1.000000
  - Dtype: loat32

### 5. Conclusion
Embeddings are deterministically aligned with metadata, verified 100% free of numerical anomalies or cross-jurisdiction leakage, and ready for vector indexing.
