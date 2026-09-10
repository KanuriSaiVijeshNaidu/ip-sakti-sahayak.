# AYURLEX Top 10 WOW Questions
**Showcase Demonstrations Guaranteed to Impress Technical Judges & Industry Executives**  

---

## The 10 WOW Features at a Glance

| # | Code | Feature Highlight | Source -> Target | Why This Leaves the Audience Stunned |
| :-: | :--- | :--- | :---: | :--- |
| **1** | `WOW-01` | **Japanese -> India TK Prior Art** | `ja -> IN` | A Japanese query directly retrieves Indian Patents Act Section 3(p) statutory exclusions with perfect 1.000 confidence score. |
| **2** | `WOW-02` | **Dual Section 3(p) + 3(e) Synergistic Defense** | `en -> IN` | Distinguishes between a non-patentable mere admixture and a patentable synergistic combination with experimental isobologram proof. |
| **3** | `WOW-03` | **Hindi -> Japan Cross-Lingual Patent Discovery** | `hi -> JP` | A Hindi query searches the Japanese JPO Kokai Tokkyo Koho patent database across 26,041 Japanese documents. |
| **4** | `WOW-04` | **Ayurvedic Botanical Trademark Bar under Section 13** | `en -> IN` | Explains that generic names of single medicinal herbs cannot be monopolized as private trademarks under Indian law. |
| **5** | `WOW-05` | **Cross-Border Regulatory Conflict: FSSAI vs US FDA DSHEA** | `en -> IN / US` | Compares Indian disease risk reduction restrictions against US structure-function statements requiring DSHEA disclaimers. |
| **6** | `WOW-06` | **WIPO 2024 Genetic Resources Treaty Compliance** | `en -> WO` | Surfaces cutting-edge international treaty requirements adopted in Geneva in May 2024 requiring patent applicants to disclose genetic origin. |
| **7** | `WOW-07` | **Telugu -> Dual Licensing Regulatory Clearance** | `te -> IN` | Telugu regional language query resolves complex regulatory boundary between D&C Rule 158B and FSSAI Ayurveda Aahara. |
| **8** | `WOW-08` | **European EPC Article 54(5) Second Medical Use vs Section 3(d)** | `en -> IN / EP` | Demonstrates deep comparative patent law expertise contrasting EPO second medical use claim strategies with Indian efficacy hurdles. |
| **9** | `WOW-09` | **Truthful Refusal of Out-of-Scope Australian TGA** | `en -> AU` | Refuses to hallucinate on unindexed Australian regulations, clearly directing the user to official TGA ARTG sources. |
| **10** | `WOW-10` | **Adversarial Prompt Injection & Jailbreak Defeat** | `en -> SEC` | Completely neutralizes prompt injection attempt, reaffirms strict Section 3(p) traditional knowledge exclusions, and provides legal disclaimers. |

---

## Deep Dive Walkthroughs of the Top 3 WOW Demos

### WOW-01: Japanese -> India Cross-Lingual Semantic Retrieval
- **Query:** `インド特許法第3条(p)における伝統的知識の特許除外規定はどのようなものですか？`
- **Behind the Scenes:**
  1. The query analyzer classifies the query language as `ja` (Japanese).
  2. BGE-M3 projects the Japanese text into a 1024-dimensional multilingual vector space.
  3. The vector matches the canonical English/Sanskrit Indian statutory chunk `IN_doc-india-code-patents-sec3p_section_3_p_001_317e0468`.
  4. The system returns the Indian Patents Act Section 3(p) analysis with a relevance score of `1.000` and latency under 1000ms.
- **Audience Impact:** Shows that international investors and patent offices can cross-examine Indian traditional knowledge prior art in their own language without barriers.

### WOW-02: Section 3(p) + Section 3(e) Dual Patent Defense
- **Query:** `How is therapeutic synergy demonstrated to overcome Section 3(e) mere admixture rejection for synergistic Ayurvedic combinations?`
- **Behind the Scenes:**
  1. The query touches both Section 3(p) (traditional knowledge) and Section 3(e) (mere admixture).
  2. AYURLEX retrieves the legal standard: proving that the combination produces a synergistic effect greater than the sum of its individual components (e.g. combination index < 1.0 via Chou-Talalay method).
  3. Highlights that simple mixtures of known herbs are barred under 3(e), but novel synergistic extracts with statistical proof of efficacy are eligible.
- **Audience Impact:** Solves the #1 rejection reason faced by Indian biotechnology and herbal pharmaceutical companies at the patent office.

### WOW-05: FSSAI Ayurveda Aahara vs US FDA DSHEA Cross-Border Clearance
- **Query:** `What are the differences in allowable health claims between FSSAI Ayurveda Aahara (2022) and US FDA DSHEA (1994)?`
- **Behind the Scenes:**
  1. Compares India's domestic food safety rules with US dietary supplement export rules.
  2. India FSSAI Ayurveda Aahara: strictly prohibits claiming disease prevention, diagnosis, treatment, or cure; requires specific "Ayurveda Aahara" logo and cautionary statements.
  3. US FDA DSHEA: allows structure-function claims (e.g. "supports healthy joint function") provided it carries the mandatory DSHEA disclaimer: *"These statements have not been evaluated by the FDA..."*
- **Audience Impact:** Direct commercial value for Ayurvedic exporters entering the lucrative $50B US dietary supplements market.
