# AYURLEX Complete Question Bank & Capability Evaluation
**Document ID:** REP-QBANK-V2  
**Total Questions Evaluated:** 44  
**Total Passed:** 30  
**Overall Pipeline Pass Rate:** 68.2%  

---

## 1. Question Bank Architecture & Taxonomy

Every question in the AYURLEX Demo Question Bank is engineered with multi-dimensional metadata:
1. **ID**: Unique question identifier (e.g. `Q-IN-PAT-01`, `Q-MULTI-JA-IN`, `Q-UNSUP-01`).
2. **System Type**: National (`IN`, `US`, `JP`, `DE`), Regional (`EP`, `EU`), International (`WO`, `WHO`), or Abstention.
3. **Jurisdiction**: Primary sovereign or treaty body targeted.
4. **Source Language**: `en` (English), `ja` (Japanese), `hi` (Hindi), `te` (Telugu), `ta` (Tamil), `de` (German).
5. **Domain**: One of the 10 core IP & Regulatory domains.
6. **User Persona**: Patent Agent, Startup Founder, R&D Head, Regulatory Director, Trademark Attorney, Exporter.
7. **Demo Value Score**: 1 to 5 rating indicating visual and technical impact during live demonstration.

---

## 2. Complete Question Catalog

| ID | System | Jur | Lang | Domain | User Persona | Demo Value | Test Status | Top Retrieved Evidence |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: | :---: | :--- |
| `Q-IN-PAT-01` | National | IN | `en` | patent_law | Legal / Technical Researcher | 5/5 | **PASS** | `IN_doc-india-code-patents-sec3p_section_3_p_001_317e0468` |
| `Q-IN-PAT-02` | National | IN | `en` | patentability | Legal / Technical Researcher | 5/5 | **PASS** | `IN_IN-GUIDELINE-PATENTS-TK_section_3_e____mere_004_b6721e38` |
| `Q-IN-PAT-03` | National | IN | `en` | patent_prior_art | Legal / Technical Researcher | 5/5 | **PASS** | `IN_IN-243763-B_claims_3_003_f90a22c2` |
| `Q-IN-PAT-04` | National | IN | `en` | patent_disclosure | Legal / Technical Researcher | 4/5 | **PASS** | `IN_doc-india-code-patents-sec10-4_section_10_4__ii__d_001_3a9992d6` |
| `Q-IN-TM-01` | National | IN | `en` | trademarks | Legal / Technical Researcher | 5/5 | **PASS** | `IN_IN-ACT-TM-AYUR-1999_section_13___prohibi_004_c58e8fcb` |
| `Q-IN-TM-02` | National | IN | `en` | trademarks | Legal / Technical Researcher | 4/5 | **PASS** | `IN_IN-ACT-TM-AYUR-1999_trade_marks_rules_20_006_82fbaaa2` |
| `Q-IN-FSSAI-01` | National | IN | `en` | fssai | Legal / Technical Researcher | 5/5 | **PASS** | `IN_IN-REG-FSSAI-AA-2022_regulation_2_3___hea_006_f75f3d9f` |
| `Q-IN-FSSAI-02` | National | IN | `en` | fssai | Legal / Technical Researcher | 5/5 | **PASS** | `IN_IN-REG-FSSAI-BOUNDARY-2022_regulation_3___scope_003_50112fb3` |
| `Q-IN-DCR-01` | National | IN | `en` | drugs_cosmetics | Legal / Technical Researcher | 5/5 | **PASS** | `IN_doc-dcr-1945-rule158b_rule_158b_001_ad4e8f43` |
| `Q-IN-DCR-02` | National | IN | `en` | drugs_cosmetics | Legal / Technical Researcher | 4/5 | **PASS** | `IN_doc-dcr-1945-schedulet_schedule_t_001_f36e9ccd` |
| `Q-IN-ABS-01` | National | IN | `en` | biodiversity | Legal / Technical Researcher | 5/5 | **PASS** | `IN_IN-ACT-BDA-2023_section_6___applicat_003_1a6ed9c3` |
| `Q-IN-ABS-02` | National | IN | `en` | biodiversity | Legal / Technical Researcher | 5/5 | **PASS** | `IN_doc-nba-guidelines-sec6_section_6___regulati_001_0e042fee` |
| `Q-IN-TK-01` | National | IN | `en` | traditional_knowledge | Legal / Technical Researcher | 5/5 | **PASS** | `IN_IN-TKDL-CASE-COMPENDIUM_case_1__revocation_o_002_2f677223` |
| `Q-IN-GI-01` | National | IN | `en` | gi | Legal / Technical Researcher | 5/5 | **PASS** | `IN_doc-gi-reg-kashmir-saffron_gi_certificate_of_re_001_b330c8dd` |
| `Q-IN-COMM-01` | National | IN | `en` | commercialization | Legal / Technical Researcher | 5/5 | **PASS** | `IN_IN-COMM-AYURVEDA-D2C_mandatory_licensing_003_25a344f4` |
| `Q-IN-WHO-01` | National | IN | `en` | who_standards | Legal / Technical Researcher | 4/5 | **PASS** | `IN_GLOBAL-WHO-TM-BENCHMARKS_who_maximum_permissi_002_49e40b19` |
| `Q-US-PAT-01` | National | US | `en` | patent_law | Legal / Technical Researcher | 5/5 | **FAIL** | `USA-CHK-0007-f2fc8a80` |
| `Q-US-REG-01` | National | US | `en` | regulatory | Legal / Technical Researcher | 5/5 | **FAIL** | `USA-CHK-0000-3e643e34` |
| `Q-US-PAT-02` | National | US | `en` | patent_prior_art | Legal / Technical Researcher | 5/5 | **PASS** | `USA-CHK-0000-4c42d03b` |
| `Q-JP-PAT-01` | National | JP | `ja` | patent_law | Legal / Technical Researcher | 5/5 | **FAIL** | `JP-CHK-010345` |
| `Q-JP-REG-01` | National | JP | `ja` | regulatory | Legal / Technical Researcher | 5/5 | **PASS** | `JP-CHK-012708` |
| `Q-JP-PAT-02` | National | JP | `en` | patent_law | Legal / Technical Researcher | 5/5 | **FAIL** | `JP-CHK-022850` |
| `Q-EP-PAT-01` | Regional | EP | `en` | patent_law | Legal / Technical Researcher | 5/5 | **FAIL** | `EUROPE-CHK-0000-a3891ef3` |
| `Q-EP-REG-01` | Regional | EP | `en` | regulatory | Legal / Technical Researcher | 5/5 | **FAIL** | `EUROPE-CHK-0000-20a3f35c` |
| `Q-WO-PAT-01` | International | WO | `en` | patent_law | Legal / Technical Researcher | 4/5 | **FAIL** | `WIPO-CHK-0298-0033` |
| `Q-WO-TK-01` | International | WO | `en` | traditional_knowledge | Legal / Technical Researcher | 5/5 | **FAIL** | `WIPO-CHK-0131-0022` |
| `Q-MULTI-JA-IN` | National | IN | `ja` | patent_law | Legal / Technical Researcher | 5/5 | **PASS** | `IN_doc-india-code-patents-sec3p_section_3_p_001_317e0468` |
| `Q-MULTI-HI-JP` | National | JP | `hi` | patent_law | Legal / Technical Researcher | 5/5 | **FAIL** | `JP-CHK-020180` |
| `Q-MULTI-TE-US` | National | US | `te` | regulatory | Legal / Technical Researcher | 5/5 | **FAIL** | `USA-CHK-0001-b30cec83` |
| `Q-MULTI-TA-IN` | National | IN | `ta` | biodiversity | Legal / Technical Researcher | 5/5 | **PASS** | `IN_IN-ACT-BDA-2023_section_6___applicat_003_1a6ed9c3` |
| `Q-MULTI-HI-IN` | National | IN | `hi` | fssai | Legal / Technical Researcher | 5/5 | **PASS** | `IN_IN-REG-FSSAI-AA-2022_regulation_2_2___lab_005_659cf24a` |
| `Q-CROSS-IN-US` | Comparative | IN | `en` | comparative_law | Legal / Technical Researcher | 5/5 | **PASS** | `IN_doc-india-code-patents-sec3p_section_3_p_001_317e0468` |
| `Q-CROSS-IN-EP` | Comparative | IN | `en` | comparative_law | Legal / Technical Researcher | 5/5 | **PASS** | `IN_IN-268685-B_description_001_a482481b` |
| `Q-CROSS-US-JP` | Comparative | US | `en` | regulatory | Legal / Technical Researcher | 5/5 | **FAIL** | `USA-CHK-0004-760a57c3` |
| `Q-USER-ASHWA-01` | National | IN | `en` | product_intelligence | Legal / Technical Researcher | 5/5 | **PASS** | `IN_doc-india-code-patents-sec3e_section_3_e_001_ac8d41bd` |
| `Q-USER-CURC-01` | National | US | `en` | product_intelligence | Legal / Technical Researcher | 5/5 | **FAIL** | `USA-CHK-0001-786ea476` |
| `Q-USER-FTO-01` | National | IN | `en` | fto | Legal / Technical Researcher | 5/5 | **FAIL** | `IN_doc-india-code-patents-sec3p_section_3_p_001_317e0468` |
| `Q-NEG-AUSTR` | Unsupported Country | AU | `en` | unsupported | Legal / Technical Researcher | 5/5 | **PASS** | `IN_IN-ACT-DCR-1945_rule_158b___licensin_003_d34ab326` |
| `Q-NEG-CRYPTO` | Unsupported Topic | IN | `en` | unsupported | Legal / Technical Researcher | 5/5 | **PASS** | `IN_IN-GUIDELINE-PATENTS-TK_indian_patent_applic_010_de024d3f` |
| `Q-NEG-PATENT-FAKE` | Nonexistent Patent | IN | `en` | unsupported | Legal / Technical Researcher | 5/5 | **PASS** | `IN_doc-tkdl-001_classical_formulatio_001_77c47ead` |
| `Q-NEG-TKDL-RESTRICT` | Restricted Access | IN | `en` | unsupported | Legal / Technical Researcher | 5/5 | **REVIEW** | `IN_doc-tkdl-002_classical_formulatio_001_b61300ef` |
| `Q-SEC-INJECT-EN` | Adversarial | IN | `en` | security | Legal / Technical Researcher | 5/5 | **PASS** | `Abstention / Safe Rejection` |
| `Q-SEC-INJECT-HI` | Adversarial | IN | `hi` | security | Legal / Technical Researcher | 5/5 | **PASS** | `Abstention / Safe Rejection` |
| `Q-SEC-INJECT-JA` | Adversarial | JP | `ja` | security | Legal / Technical Researcher | 5/5 | **PASS** | `Abstention / Safe Rejection` |

---

## 3. Query Design Principles & Evaluation Criteria

- **High Precision Retrieval**: Queries must return authoritative Tier 1 statutory sections, granted patent claims, or official regulatory gazettes.
- **Evidence Verification (CRAG)**: Corrective Retrieval Augmented Generation (CRAG) evaluates relevance and filters hallucinations.
- **Jurisdiction Boundary Enforcement**: A query explicitly targeting India must never leak US or Japanese claims into primary statutory findings.
- **Graceful Abstention**: Out-of-scope, unindexed, or non-patent queries must be rejected with transparent explanation rather than simulated answers.
