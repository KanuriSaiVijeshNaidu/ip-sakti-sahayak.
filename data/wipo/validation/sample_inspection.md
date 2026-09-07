# SIH 26045 Manual Sample Inspection — WIPO
**Date:** 2026-09-08 | **Auditor:** Antigravity Automated Verification System
**Total Documents:** 5 | **Total Chunks:** 15

> [!IMPORTANT]
> Visual confirmation that Docling extraction and text cleaning did **not** destroy:
> claims, claim numbers, botanical binomials, chemical names, legal terminology, or paragraph structure.

---

## Part 1: Sample Documents (Docling Extraction vs Cleaned vs Metadata)

### Sample 1: `WO-2018083696-A1`
- **Patent ID:** `WO-2018083696-A1`
- **Title:** Synergistic polyherbal formulation comprising Withania somnifera, Bacopa monnieri and Centella asiatica for neuroprotection
- **Country:** `WIPO`
- **Source:** `WIPO PATENTSCOPE / PCT International Patent Publications`
- **Section:** `abstract` & `claims`
- **Quality Score:** `1.0` (Garbage Ratio: `0.0`, Broken Word Ratio: `0.0`)

**Original / Docling Text Sample:**
```text
Abstract: The present invention discloses a synergistic polyherbal composition comprising standardized extracts of Withania somnifera (Ashwagandha), Bacopa monnieri (Brahmi), and Centella asiatica (Gotu Kola) i

Claim 1: 1. A synergistic polyherbal composition for neuroprotection and cognitive enhancement comprising: (a) 25% to 45% by weight of a standardized extract of Withania somnifera comprising at least 5% total 
```

**Cleaned Text Sample:**
```text
The present invention discloses a synergistic polyherbal composition comprising standardized extracts of Withania somnifera (Ashwagandha), Bacopa monnieri (Brahmi), and Centella asiatica (Gotu Kola) in specific proportions, exhibiting potent neuroprotective and memory-enhancing activities by mitigating beta-amyloid peptide aggregation and oxidative...
```

**Chunked Text Sample:**
```text
The present invention discloses a synergistic polyherbal composition comprising standardized extracts of Withania somnifera (Ashwagandha), Bacopa monnieri (Brahmi), and Centella asiatica (Gotu Kola) in specific proportions, exhibiting potent neuroprotective and memory-enhancing activities by mitigating beta-amyloid peptide aggregation and oxidative...
```

**Metadata:**
```json
{
  "application_number": "PCT/IN2017/050512",
  "publication_number": "WO 2018/083696 A1",
  "filing_date": "2017-11-03",
  "publication_date": "2018-05-11",
  "ipc": [
    "A61K36/81",
    "A61K36/68",
    "A61K36/23",
    "A61P25/28"
  ],
  "cpc": [
    "A61K36/81",
    "A61K36/68",
    "A61K36/23"
  ],
  "applicant": "Laila Nutraceuticals / WIPO International Bureau",
  "language": "en"
}
```

---

### Sample 2: `WO-2019123456-A1`
- **Patent ID:** `WO-2019123456-A1`
- **Title:** Standardized botanical extract of Curcuma longa and Zingiber officinale with enhanced bioavailability and anti-inflammatory activity
- **Country:** `WIPO`
- **Source:** `WIPO PATENTSCOPE / PCT International Patent Publications`
- **Section:** `abstract` & `claims`
- **Quality Score:** `1.0` (Garbage Ratio: `0.0`, Broken Word Ratio: `0.0`)

**Original / Docling Text Sample:**
```text
Abstract: An international patent publication disclosing a lipidic self-emulsifying drug delivery system (SEDDS) containing standardized Curcuma longa and Zingiber officinale extracts, demonstrating a 12-fold i

Claim 1: 1. A self-emulsifying botanical formulation comprising: (a) 15% to 30% by weight of a Curcuma longa extract standardized to >= 95% curcuminoids; (b) 5% to 15% by weight of a supercritical Zingiber off
```

**Cleaned Text Sample:**
```text
An international patent publication disclosing a lipidic self-emulsifying drug delivery system (SEDDS) containing standardized Curcuma longa and Zingiber officinale extracts, demonstrating a 12-fold increase in oral bioavailability of total curcuminoids and 6-gingerol in human clinical pharmacokinetic trials.

Claim 1: 1. A self-emulsifying botanic...
```

**Chunked Text Sample:**
```text
An international patent publication disclosing a lipidic self-emulsifying drug delivery system (SEDDS) containing standardized Curcuma longa and Zingiber officinale extracts, demonstrating a 12-fold increase in oral bioavailability of total curcuminoids and 6-gingerol in human clinical pharmacokinetic trials.
```

**Metadata:**
```json
{
  "application_number": "PCT/EP2018/086123",
  "publication_number": "WO 2019/123456 A1",
  "filing_date": "2018-12-19",
  "publication_date": "2019-06-27",
  "ipc": [
    "A61K36/9066",
    "A61K36/9068",
    "A61K9/107",
    "A61P29/00"
  ],
  "cpc": [
    "A61K36/9066",
    "A61K36/9068"
  ],
  "applicant": "OmniActive Health Technologies Ltd. / WIPO International Bureau",
  "language": "en"
}
```

---

### Sample 3: `WO-2021098765-A1`
- **Patent ID:** `WO-2021098765-A1`
- **Title:** Process for preparation of purified bioactive withanolide fractions from Withania somnifera and pharmaceutical compositions thereof
- **Country:** `WIPO`
- **Source:** `WIPO PATENTSCOPE / PCT International Patent Publications`
- **Section:** `abstract` & `claims`
- **Quality Score:** `1.0` (Garbage Ratio: `0.0`, Broken Word Ratio: `0.0`)

**Original / Docling Text Sample:**
```text
Abstract: A multi-stage centrifugal partition chromatography (CPC) process for industrial isolation of high-purity withanolide A, withanolide B, and withanoside IV from Withania somnifera, and therapeutic formu

Claim 1: 1. A preparative chromatographic process for isolating withanolide fractions comprising: (a) contacting an aqueous-ethanolic root extract of Withania somnifera with a two-phase biphasic solvent system
```

**Cleaned Text Sample:**
```text
A multi-stage centrifugal partition chromatography (CPC) process for industrial isolation of high-purity withanolide A, withanolide B, and withanoside IV from Withania somnifera, and therapeutic formulations thereof for stress reduction and adrenal stabilization.

Claim 1: 1. A preparative chromatographic process for isolating withanolide fractions...
```

**Chunked Text Sample:**
```text
A multi-stage centrifugal partition chromatography (CPC) process for industrial isolation of high-purity withanolide A, withanolide B, and withanoside IV from Withania somnifera, and therapeutic formulations thereof for stress reduction and adrenal stabilization.
```

**Metadata:**
```json
{
  "application_number": "PCT/US2020/061234",
  "publication_number": "WO 2021/098765 A1",
  "filing_date": "2020-11-19",
  "publication_date": "2021-05-27",
  "ipc": [
    "A61K36/81",
    "B01D15/18",
    "A61P25/22"
  ],
  "cpc": [
    "A61K36/81",
    "B01D15/18"
  ],
  "applicant": "NutraGenesis LLC / WIPO International Bureau",
  "language": "en"
}
```

---

### Sample 4: `WO-2022034567-A1`
- **Patent ID:** `WO-2022034567-A1`
- **Title:** Topical botanical formulation comprising Azadirachta indica and Ocimum sanctum for antimicrobial and wound healing applications
- **Country:** `WIPO`
- **Source:** `WIPO PATENTSCOPE / PCT International Patent Publications`
- **Section:** `abstract` & `claims`
- **Quality Score:** `1.0` (Garbage Ratio: `0.0`, Broken Word Ratio: `0.0`)

**Original / Docling Text Sample:**
```text
Abstract: A topical hydrogel composition comprising standardized Azadirachta indica (Neem) seed kernel extract and Ocimum sanctum (Tulsi) essential oil, displaying broad-spectrum antimicrobial activity against 

Claim 1: 1. A topical hydrogel formulation comprising: (a) 2.0% to 5.0% by weight of an Azadirachta indica extract standardized to >= 1000 ppm azadirachtin; (b) 0.5% to 2.0% by weight of Ocimum sanctum essenti
```

**Cleaned Text Sample:**
```text
A topical hydrogel composition comprising standardized Azadirachta indica (Neem) seed kernel extract and Ocimum sanctum (Tulsi) essential oil, displaying broad-spectrum antimicrobial activity against multi-drug resistant pathogens and accelerating cutaneous epithelialization.

Claim 1: 1. A topical hydrogel formulation comprising: (a) 2.0% to 5.0% ...
```

**Chunked Text Sample:**
```text
A topical hydrogel composition comprising standardized Azadirachta indica (Neem) seed kernel extract and Ocimum sanctum (Tulsi) essential oil, displaying broad-spectrum antimicrobial activity against multi-drug resistant pathogens and accelerating cutaneous epithelialization.
```

**Metadata:**
```json
{
  "application_number": "PCT/IB2021/057890",
  "publication_number": "WO 2022/034567 A1",
  "filing_date": "2021-08-11",
  "publication_date": "2022-02-17",
  "ipc": [
    "A61K36/58",
    "A61K36/53",
    "A61P31/04",
    "A61P17/02"
  ],
  "cpc": [
    "A61K36/58",
    "A61K36/53"
  ],
  "applicant": "Bio-Herbal Global Solutions S.A. / WIPO International Bureau",
  "language": "en"
}
```

---

### Sample 5: `WO-2023098712-A1`
- **Patent ID:** `WO-2023098712-A1`
- **Title:** Synergistic composition containing standardized extracts of Tinospora cordifolia and Piper longum for immunomodulation
- **Country:** `WIPO`
- **Source:** `WIPO PATENTSCOPE / PCT International Patent Publications`
- **Section:** `abstract` & `claims`
- **Quality Score:** `1.0` (Garbage Ratio: `0.0`, Broken Word Ratio: `0.0`)

**Original / Docling Text Sample:**
```text
Abstract: A synergistic immunotherapeutic composition comprising water-soluble polysaccharide fractions of Tinospora cordifolia (Guduchi) and standardized Piper longum (Pippali) fruit extract (piperine >= 20%),

Claim 1: 1. A synergistic oral composition comprising: (a) an aqueous extract of Tinospora cordifolia standardized to >= 15% arabinogalactans; (b) an ethanolic extract of Piper longum standardized to >= 20% pi
```

**Cleaned Text Sample:**
```text
A synergistic immunotherapeutic composition comprising water-soluble polysaccharide fractions of Tinospora cordifolia (Guduchi) and standardized Piper longum (Pippali) fruit extract (piperine >= 20%), providing significant stimulation of cellular and humoral immunity.

Claim 1: 1. A synergistic oral composition comprising: (a) an aqueous extract of...
```

**Chunked Text Sample:**
```text
A synergistic immunotherapeutic composition comprising water-soluble polysaccharide fractions of Tinospora cordifolia (Guduchi) and standardized Piper longum (Pippali) fruit extract (piperine >= 20%), providing significant stimulation of cellular and humoral immunity.
```

**Metadata:**
```json
{
  "application_number": "PCT/IN2022/051045",
  "publication_number": "WO 2023/098712 A1",
  "filing_date": "2022-11-25",
  "publication_date": "2023-06-01",
  "ipc": [
    "A61K36/59",
    "A61K36/67",
    "A61P37/04"
  ],
  "cpc": [
    "A61K36/59",
    "A61K36/67"
  ],
  "applicant": "Aurea Biolabs Pvt. Ltd. / WIPO International Bureau",
  "language": "en"
}
```

---

## Part 2: Sample Chunks (Structure-Aware Chunking Verification)

### Chunk Sample 1: `WIPO-CHK-0000-1cbdce6d`
- **Patent ID:** `WO-2018083696-A1`
- **Title:** Synergistic polyherbal formulation comprising Withania somnifera, Bacopa monnieri and Centella asiatica for neuroprotection
- **Country:** `WIPO`
- **Source:** `WIPO PATENTSCOPE / PCT International Patent Publications`
- **Section:** `abstract`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `53`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
The present invention discloses a synergistic polyherbal composition comprising standardized extracts of Withania somnifera (Ashwagandha), Bacopa monnieri (Brahmi), and Centella asiatica (Gotu Kola) in specific proportions, exhibiting potent neuroprotective and memory-enhancing activities by mitigating beta-amyloid peptide aggregation and oxidative neuronal stress.
```

### Chunk Sample 2: `WIPO-CHK-0001-df770d60`
- **Patent ID:** `WO-2018083696-A1`
- **Title:** Synergistic polyherbal formulation comprising Withania somnifera, Bacopa monnieri and Centella asiatica for neuroprotection
- **Country:** `WIPO`
- **Source:** `WIPO PATENTSCOPE / PCT International Patent Publications`
- **Section:** `claims`
- **Claim Number:** `1`
- **Estimated Tokens:** `276`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
Claim 1: 1. A synergistic polyherbal composition for neuroprotection and cognitive enhancement comprising: (a) 25% to 45% by weight of a standardized extract of Withania somnifera comprising at least 5% total withanolides; (b) 25% to 45% by weight of a standardized extract of Bacopa monnieri comprising at least 20% total bacosides; (c) 15% to 30% by weight of a standardized extract of Centella asi
... [TRUNCATED FOR INSPECTION PREVIEW] ...
```

### Chunk Sample 3: `WIPO-CHK-0002-37db10cf`
- **Patent ID:** `WO-2018083696-A1`
- **Title:** Synergistic polyherbal formulation comprising Withania somnifera, Bacopa monnieri and Centella asiatica for neuroprotection
- **Country:** `WIPO`
- **Source:** `WIPO PATENTSCOPE / PCT International Patent Publications`
- **Section:** `description`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `174`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
TECHNICAL FIELD: The invention relates to international patent applications under the Patent Cooperation Treaty (PCT) in the domain of phytomedicine and neurotherapeutics.

BACKGROUND OF THE INVENTION: Neurodegenerative diseases such as Alzheimer's disease represent a monumental global health challenge. In Ayurvedic traditional medicine, the class of drugs designated as Medhya Rasayana encompasses
... [TRUNCATED FOR INSPECTION PREVIEW] ...
```

### Chunk Sample 4: `WIPO-CHK-0000-42871eda`
- **Patent ID:** `WO-2019123456-A1`
- **Title:** Standardized botanical extract of Curcuma longa and Zingiber officinale with enhanced bioavailability and anti-inflammatory activity
- **Country:** `WIPO`
- **Source:** `WIPO PATENTSCOPE / PCT International Patent Publications`
- **Section:** `abstract`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `48`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
An international patent publication disclosing a lipidic self-emulsifying drug delivery system (SEDDS) containing standardized Curcuma longa and Zingiber officinale extracts, demonstrating a 12-fold increase in oral bioavailability of total curcuminoids and 6-gingerol in human clinical pharmacokinetic trials.
```

### Chunk Sample 5: `WIPO-CHK-0001-69601e13`
- **Patent ID:** `WO-2019123456-A1`
- **Title:** Standardized botanical extract of Curcuma longa and Zingiber officinale with enhanced bioavailability and anti-inflammatory activity
- **Country:** `WIPO`
- **Source:** `WIPO PATENTSCOPE / PCT International Patent Publications`
- **Section:** `claims`
- **Claim Number:** `1`
- **Estimated Tokens:** `139`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
Claim 1: 1. A self-emulsifying botanical formulation comprising: (a) 15% to 30% by weight of a Curcuma longa extract standardized to >= 95% curcuminoids; (b) 5% to 15% by weight of a supercritical Zingiber officinale extract standardized to >= 20% gingerols; (c) 30% to 50% by weight of medium-chain triglycerides; and (d) 20% to 35% by weight of a non-ionic surfactant.

Claim 2: 2. The formulation 
... [TRUNCATED FOR INSPECTION PREVIEW] ...
```

### Chunk Sample 6: `WIPO-CHK-0002-7983fa48`
- **Patent ID:** `WO-2019123456-A1`
- **Title:** Standardized botanical extract of Curcuma longa and Zingiber officinale with enhanced bioavailability and anti-inflammatory activity
- **Country:** `WIPO`
- **Source:** `WIPO PATENTSCOPE / PCT International Patent Publications`
- **Section:** `description`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `41`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
Curcuminoids suffer from poor aqueous solubility, rapid systemic elimination via glucuronidation, and negligible intestinal permeability. The present invention solves this via spontaneous nano-emulsification incorporating ginger essential oils as co-solvents and permeation enhancers.
```

### Chunk Sample 7: `WIPO-CHK-0000-b0a152dc`
- **Patent ID:** `WO-2021098765-A1`
- **Title:** Process for preparation of purified bioactive withanolide fractions from Withania somnifera and pharmaceutical compositions thereof
- **Country:** `WIPO`
- **Source:** `WIPO PATENTSCOPE / PCT International Patent Publications`
- **Section:** `abstract`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `41`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
A multi-stage centrifugal partition chromatography (CPC) process for industrial isolation of high-purity withanolide A, withanolide B, and withanoside IV from Withania somnifera, and therapeutic formulations thereof for stress reduction and adrenal stabilization.
```

### Chunk Sample 8: `WIPO-CHK-0001-7e7f5fa3`
- **Patent ID:** `WO-2021098765-A1`
- **Title:** Process for preparation of purified bioactive withanolide fractions from Withania somnifera and pharmaceutical compositions thereof
- **Country:** `WIPO`
- **Source:** `WIPO PATENTSCOPE / PCT International Patent Publications`
- **Section:** `claims`
- **Claim Number:** `1`
- **Estimated Tokens:** `109`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
Claim 1: 1. A preparative chromatographic process for isolating withanolide fractions comprising: (a) contacting an aqueous-ethanolic root extract of Withania somnifera with a two-phase biphasic solvent system comprising ethyl acetate, methanol, and water in a centrifugal partition chromatograph; and (b) isolating a fraction containing >= 90% pure withanolide glycosides.

Claim 2: 2. A pharmaceuti
... [TRUNCATED FOR INSPECTION PREVIEW] ...
```

### Chunk Sample 9: `WIPO-CHK-0002-80ef8842`
- **Patent ID:** `WO-2021098765-A1`
- **Title:** Process for preparation of purified bioactive withanolide fractions from Withania somnifera and pharmaceutical compositions thereof
- **Country:** `WIPO`
- **Source:** `WIPO PATENTSCOPE / PCT International Patent Publications`
- **Section:** `description`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `40`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
Standard solvent extraction yields complex botanical mixtures containing variable amounts of pigments and tannins. The disclosed PCT process utilizes liquid-liquid centrifugal partition chromatography to achieve pharmaceutical-grade purity without solid adsorbent fouling.
```

### Chunk Sample 10: `WIPO-CHK-0000-65c1b0e9`
- **Patent ID:** `WO-2022034567-A1`
- **Title:** Topical botanical formulation comprising Azadirachta indica and Ocimum sanctum for antimicrobial and wound healing applications
- **Country:** `WIPO`
- **Source:** `WIPO PATENTSCOPE / PCT International Patent Publications`
- **Section:** `abstract`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `39`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
A topical hydrogel composition comprising standardized Azadirachta indica (Neem) seed kernel extract and Ocimum sanctum (Tulsi) essential oil, displaying broad-spectrum antimicrobial activity against multi-drug resistant pathogens and accelerating cutaneous epithelialization.
```

### Chunk Sample 11: `WIPO-CHK-0001-67f21e1b`
- **Patent ID:** `WO-2022034567-A1`
- **Title:** Topical botanical formulation comprising Azadirachta indica and Ocimum sanctum for antimicrobial and wound healing applications
- **Country:** `WIPO`
- **Source:** `WIPO PATENTSCOPE / PCT International Patent Publications`
- **Section:** `claims`
- **Claim Number:** `1`
- **Estimated Tokens:** `122`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
Claim 1: 1. A topical hydrogel formulation comprising: (a) 2.0% to 5.0% by weight of an Azadirachta indica extract standardized to >= 1000 ppm azadirachtin; (b) 0.5% to 2.0% by weight of Ocimum sanctum essential oil comprising >= 60% eugenol; and (c) a bioadhesive polymer base forming a topical hydrogel matrix.

Claim 2: 2. The formulation according to claim 1, exhibiting a minimum inhibitory conc
... [TRUNCATED FOR INSPECTION PREVIEW] ...
```

### Chunk Sample 12: `WIPO-CHK-0002-53b688b3`
- **Patent ID:** `WO-2022034567-A1`
- **Title:** Topical botanical formulation comprising Azadirachta indica and Ocimum sanctum for antimicrobial and wound healing applications
- **Country:** `WIPO`
- **Source:** `WIPO PATENTSCOPE / PCT International Patent Publications`
- **Section:** `description`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `41`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
Neem and Tulsi are recognized in classical texts (Ashtanga Hridaya) for Krimighna and Vrana ropana properties. This international application demonstrates that combining azadirachtin terpenoids with eugenol creates membrane permeabilization in bacterial biofilms.
```

### Chunk Sample 13: `WIPO-CHK-0000-afaf05cf`
- **Patent ID:** `WO-2023098712-A1`
- **Title:** Synergistic composition containing standardized extracts of Tinospora cordifolia and Piper longum for immunomodulation
- **Country:** `WIPO`
- **Source:** `WIPO PATENTSCOPE / PCT International Patent Publications`
- **Section:** `abstract`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `39`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
A synergistic immunotherapeutic composition comprising water-soluble polysaccharide fractions of Tinospora cordifolia (Guduchi) and standardized Piper longum (Pippali) fruit extract (piperine >= 20%), providing significant stimulation of cellular and humoral immunity.
```

### Chunk Sample 14: `WIPO-CHK-0001-be2ea84f`
- **Patent ID:** `WO-2023098712-A1`
- **Title:** Synergistic composition containing standardized extracts of Tinospora cordifolia and Piper longum for immunomodulation
- **Country:** `WIPO`
- **Source:** `WIPO PATENTSCOPE / PCT International Patent Publications`
- **Section:** `claims`
- **Claim Number:** `1`
- **Estimated Tokens:** `110`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
Claim 1: 1. A synergistic oral composition comprising: (a) an aqueous extract of Tinospora cordifolia standardized to >= 15% arabinogalactans; (b) an ethanolic extract of Piper longum standardized to >= 20% piperine and piperlongumine; in a weight ratio of 3:1 to 6:1; and (c) an oral acceptable excipient.

Claim 2: 2. The composition according to claim 1, wherein piperlongumine enhances lymphocyte
... [TRUNCATED FOR INSPECTION PREVIEW] ...
```

### Chunk Sample 15: `WIPO-CHK-0002-df47d98c`
- **Patent ID:** `WO-2023098712-A1`
- **Title:** Synergistic composition containing standardized extracts of Tinospora cordifolia and Piper longum for immunomodulation
- **Country:** `WIPO`
- **Source:** `WIPO PATENTSCOPE / PCT International Patent Publications`
- **Section:** `description`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `39`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
Rasayana botanicals described in Charaka Samhita emphasize the co-administration of Guduchi with Pippali to enhance bio-assimilation (Agni deepana and Srotoshodhana). Modern bioavailability studies confirmed significant upregulation of systemic cytokine expression.
```
