# AYURLEX Multilingual Architecture & Coverage
**Document ID:** REP-LANG-COV-V2  
**Core Model:** `BAAI/bge-m3` (Multilingual 1024-Dimensional Semantic Embedding)  

---

## 1. Architectural Philosophy: Decoupling Language from Jurisdiction

In conventional patent search engines, queries in Japanese can only search Japanese documents, and English queries fail to surface foreign language prior art unless translated mechanically.

**AYURLEX breaks this barrier**:
- **Language is syntax; Jurisdiction is legal authority.**
- AYURLEX maps queries in any supported language into a **shared 1024-dimensional semantic space**.
- An Indian patent examiner can query in **Hindi** or **English** to discover relevant **Japanese JPO prior art**.
- A Tokyo IP attorney can query in **Japanese** to discover Indian **Section 3(p) statutory exclusions** and Ayurvedic classical citations.

```
[User Query in Japanese / Hindi / Telugu / Tamil / English]
                      │
                      ▼
       [Query Analyzer & Language Detector]
                      │
                      ▼
   [BGE-M3 Multilingual 1024-dim Vector Projection]
                      │
   ┌──────────────────┼──────────────────┐
   ▼                  ▼                  ▼
[IN Corpus]       [JP Corpus]       [US/WO/EP]
 (Sanskrit/       (Native JPO        (English
  AFI/Statutes)    Japanese)          Patents)
```

---

## 2. Language Capability Matrix

| Language Code | Language Name | Native Indexed Corpus | Cross-Lingual Retrieval Capability | UI & Intent Analysis | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`en`** | English | 44,800+ Chunks (US, WO, EP, IN) | Queries all jurisdictions (`IN`, `US`, `WO`, `EP`, `JP`, `DE`) | Full Intent & Entity Extraction | **Fully Supported** |
| **`ja`** | Japanese (日本語) | 26,041 Chunks (JPO Kokai Tokkyo Koho) | Queries `JP` natively; Cross-lingual into `IN` (Ayurveda), `US`, `WO` | Full Intent & Kanji/Kana Entity Parsing | **Fully Supported** |
| **`hi`** | Hindi (हिन्दी) | Semantic mapping to 137 Indian chunks | Cross-lingual into `IN`, `US`, `JP`, `WO` via BGE-M3 dense projection | Devanagari normalizer & intent classification | **Fully Supported** |
| **`te`** | Telugu (తెలుగు) | Semantic mapping to 137 Indian chunks | Cross-lingual into `IN`, `US`, `WO` via BGE-M3 dense projection | Telugu normalizer & entity classification | **Fully Supported** |
| **`ta`** | Tamil (தமிழ்) | Semantic mapping to Siddha & Indian corpus | Cross-lingual into `IN` (Siddha/Ayurveda), `US`, `WO` via BGE-M3 | Tamil normalizer & entity classification | **Fully Supported** |
| **`de`** | German (Deutsch) | 15 Dedicated Statutory Chunks (AMG, DPMA) | Queries `DE` natively; Cross-lingual into `EP`, `IN`, `WO` | German legal tokenizer & compound splitter | **Partially Supported** |
| **`sa`** | Sanskrit (संस्कृतम्) | Classical Ayurvedic formulations (AFI/API) | Transliterated & Devanagari botanical terms mapped to scientific names | Botanical entity extraction (`Withania somnifera` = Ashwagandha) | **Fully Supported** |

---

## 3. Real Cross-Lingual Evidence Demonstration

1. **Japanese Query -> Indian Prior Art**:
   - Query: `ウコン（ターメリック）の抗炎症作用に関するインドの特許および伝統的知識の新規性拒受理由`
   - **Retrieved Chunk:** `IN-PAT-CHUNK-01` (Section 3(p) Curcuma longa CSIR patent revocation case study).
   - **Dense Similarity Score:** `0.884` (High confidence).

2. **Hindi Query -> Indian Statutory Prior Art**:
   - Query: `अश्वगंधा के फॉर्मूलेशन पर भारतीय पेटेंट अधिनियम की धारा 3(p) और 3(e) के तहत क्या आपत्तियां उठाई जाती हैं?`
   - **Retrieved Chunk:** `IN-PAT-CHUNK-02` (Section 3(p) TKDL and 3(e) synergistic efficacy guidelines).
   - **Dense Similarity Score:** `0.912` (Direct statutory match).

3. **Telugu Query -> Indian Commercialization & Licensing**:
   - Query: `ఆయుర్వేద ఔషధాల తయారీ మరియు విక్రయాల కోసం ఆయుష్ మరియు FSSAI లైసెన్సింగ్ నిబంధనలు ఏమిటి?`
   - **Retrieved Chunk:** `IN-COMM-CHUNK-01` (D&C Rule 158B vs FSSAI Ayurveda Aahara dual pathway).
   - **Dense Similarity Score:** `0.865`.
