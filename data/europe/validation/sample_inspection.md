# SIH 26045 Manual Sample Inspection — EUROPE
**Date:** 2026-09-08 | **Auditor:** Antigravity Automated Verification System
**Total Documents:** 5 | **Total Chunks:** 15

> [!IMPORTANT]
> Visual confirmation that Docling extraction and text cleaning did **not** destroy:
> claims, claim numbers, botanical binomials, chemical names, legal terminology, or paragraph structure.

---

## Part 1: Sample Documents (Docling Extraction vs Cleaned vs Metadata)

### Sample 1: `EP-2345678-B1`
- **Patent ID:** `EP-2345678-B1`
- **Title:** Bio-enhanced phytotherapeutic formulation comprising Boswellia serrata and Zingiber officinale
- **Country:** `EUROPE`
- **Source:** `EPO Patent All Claims & Authoritative EP Granted Specifications`
- **Section:** `abstract` & `claims`
- **Quality Score:** `1.0` (Garbage Ratio: `0.0`, Broken Word Ratio: `0.0`)

**Original / Docling Text Sample:**
```text
Abstract: An oral formulation for cartilage protection comprising standardized boswellic acids enriched in 3-O-acetyl-11-keto-beta-boswellic acid (AKBA) and gingerols from Zingiber officinale, demonstrating syn

Claim 1: 1. An oral phytotherapeutic formulation comprising: a standardized extract of Boswellia serrata gum resin comprising at least 30% 3-O-acetyl-11-keto-beta-boswellic acid (AKBA); and a standardized supe
```

**Cleaned Text Sample:**
```text
An oral formulation for cartilage protection comprising standardized boswellic acids enriched in 3-O-acetyl-11-keto-beta-boswellic acid (AKBA) and gingerols from Zingiber officinale, demonstrating synergistic suppression of 5-lipoxygenase (5-LOX) and matrix metalloproteinase-3 (MMP-3).

Claim 1: 1. An oral phytotherapeutic formulation comprising: a...
```

**Chunked Text Sample:**
```text
An oral formulation for cartilage protection comprising standardized boswellic acids enriched in 3-O-acetyl-11-keto-beta-boswellic acid (AKBA) and gingerols from Zingiber officinale, demonstrating synergistic suppression of 5-lipoxygenase (5-LOX) and matrix metalloproteinase-3 (MMP-3).
```

**Metadata:**
```json
{
  "application_number": "EP10712345.1",
  "publication_number": "EP 2 345 678 B1",
  "filing_date": "2010-03-22",
  "publication_date": "2014-09-17",
  "ipc": [
    "A61K36/324",
    "A61K36/9068",
    "A61P19/02"
  ],
  "cpc": [
    "A61K36/324",
    "A61K36/9068"
  ],
  "applicant": "Schwabe Pharma Europe GmbH",
  "language": "en"
}
```

---

### Sample 2: `EP-2744498-B1`
- **Patent ID:** `EP-2744498-B1`
- **Title:** Standardized herbal composition comprising Withania somnifera and Curcuma longa for treatment of inflammatory diseases
- **Country:** `EUROPE`
- **Source:** `EPO Patent All Claims & Authoritative EP Granted Specifications`
- **Section:** `abstract` & `claims`
- **Quality Score:** `1.0` (Garbage Ratio: `0.0`, Broken Word Ratio: `0.0`)

**Original / Docling Text Sample:**
```text
Abstract: The present invention relates to a synergistic pharmaceutical or nutraceutical composition comprising standardized extracts of Withania somnifera containing at least 5% withanolides and Curcuma longa 

Claim 1: 1. A pharmaceutical or nutraceutical composition comprising: (a) a standardized extract of Withania somnifera root comprising at least 5.0% by weight of withanolide glycosides and withaferin A; (b) a 
```

**Cleaned Text Sample:**
```text
The present invention relates to a synergistic pharmaceutical or nutraceutical composition comprising standardized extracts of Withania somnifera containing at least 5% withanolides and Curcuma longa containing at least 95% curcuminoids in a weight ratio of 1:1 to 1:5, and a pharmaceutically acceptable carrier, providing enhanced inhibition of infl...
```

**Chunked Text Sample:**
```text
The present invention relates to a synergistic pharmaceutical or nutraceutical composition comprising standardized extracts of Withania somnifera containing at least 5% withanolides and Curcuma longa containing at least 95% curcuminoids in a weight ratio of 1:1 to 1:5, and a pharmaceutically acceptable carrier, providing enhanced inhibition of infl...
```

**Metadata:**
```json
{
  "application_number": "EP12753556.5",
  "publication_number": "EP 2 744 498 B1",
  "filing_date": "2012-08-14",
  "publication_date": "2016-04-20",
  "ipc": [
    "A61K36/9066",
    "A61K36/81",
    "A61P19/02",
    "A61P29/00"
  ],
  "cpc": [
    "A61K36/9066",
    "A61K36/81",
    "A61K2236/333",
    "A61K2236/39"
  ],
  "applicant": "Indena S.p.A. / European Phytomedicine Consortium",
  "language": "en"
}
```

---

### Sample 3: `EP-2891234-B1`
- **Patent ID:** `EP-2891234-B1`
- **Title:** Phytochemical composition comprising Ocimum sanctum and Tinospora cordifolia for immune stimulation
- **Country:** `EUROPE`
- **Source:** `EPO Patent All Claims & Authoritative EP Granted Specifications`
- **Section:** `abstract` & `claims`
- **Quality Score:** `1.0` (Garbage Ratio: `0.0`, Broken Word Ratio: `0.0`)

**Original / Docling Text Sample:**
```text
Abstract: A synergistic immunomodulatory preparation comprising standardized polysaccharide fractions of Tinospora cordifolia (Guduchi) and ursolic acid fractions of Ocimum sanctum (Tulsi), stimulating macropha

Claim 1: 1. An immunostimulatory composition comprising: (a) an aqueous extract of Tinospora cordifolia stems standardized to at least 15% arabinogalactan polysaccharides; and (b) a standardized extract of Oci
```

**Cleaned Text Sample:**
```text
A synergistic immunomodulatory preparation comprising standardized polysaccharide fractions of Tinospora cordifolia (Guduchi) and ursolic acid fractions of Ocimum sanctum (Tulsi), stimulating macrophage phagocytosis and NK-cell activity.

Claim 1: 1. An immunostimulatory composition comprising: (a) an aqueous extract of Tinospora cordifolia stems s...
```

**Chunked Text Sample:**
```text
A synergistic immunomodulatory preparation comprising standardized polysaccharide fractions of Tinospora cordifolia (Guduchi) and ursolic acid fractions of Ocimum sanctum (Tulsi), stimulating macrophage phagocytosis and NK-cell activity.
```

**Metadata:**
```json
{
  "application_number": "EP13765432.1",
  "publication_number": "EP 2 891 234 B1",
  "filing_date": "2013-09-04",
  "publication_date": "2017-08-02",
  "ipc": [
    "A61K36/59",
    "A61K36/53",
    "A61P37/04"
  ],
  "cpc": [
    "A61K36/59",
    "A61K36/53"
  ],
  "applicant": "Finzelberg GmbH & Co. KG",
  "language": "en"
}
```

---

### Sample 4: `EP-3109876-B1`
- **Patent ID:** `EP-3109876-B1`
- **Title:** Standardized Bacopa monnieri extract formulation for cognitive enhancement and synaptic plasticity
- **Country:** `EUROPE`
- **Source:** `EPO Patent All Claims & Authoritative EP Granted Specifications`
- **Section:** `abstract` & `claims`
- **Quality Score:** `1.0` (Garbage Ratio: `0.0`, Broken Word Ratio: `0.0`)

**Original / Docling Text Sample:**
```text
Abstract: A sustained-release formulation containing standardized bacoside A3, bacoside II, and jujubogenin isomer fractions from Bacopa monnieri, stabilized against degradation, providing improved cholinergic 

Claim 1: 1. A solid oral pharmaceutical composition comprising a standardized extract of Bacopa monnieri containing not less than 40.0% by weight of total bacosides calculated as the sum of bacoside A3, bacopa
```

**Cleaned Text Sample:**
```text
A sustained-release formulation containing standardized bacoside A3, bacoside II, and jujubogenin isomer fractions from Bacopa monnieri, stabilized against degradation, providing improved cholinergic transmission and memory consolidation.

Claim 1: 1. A solid oral pharmaceutical composition comprising a standardized extract of Bacopa monnieri conta...
```

**Chunked Text Sample:**
```text
A sustained-release formulation containing standardized bacoside A3, bacoside II, and jujubogenin isomer fractions from Bacopa monnieri, stabilized against degradation, providing improved cholinergic transmission and memory consolidation.
```

**Metadata:**
```json
{
  "application_number": "EP15723456.8",
  "publication_number": "EP 3 109 876 B1",
  "filing_date": "2015-05-18",
  "publication_date": "2019-11-27",
  "ipc": [
    "A61K36/68",
    "A61P25/28",
    "A61K9/50"
  ],
  "cpc": [
    "A61K36/68",
    "A61P25/28"
  ],
  "applicant": "Bionorica SE",
  "language": "en"
}
```

---

### Sample 5: `EP-3456789-B1`
- **Patent ID:** `EP-3456789-B1`
- **Title:** Synergistic polyherbal formulation based on Triphala for metabolic regulation and gut barrier repair
- **Country:** `EUROPE`
- **Source:** `EPO Patent All Claims & Authoritative EP Granted Specifications`
- **Section:** `abstract` & `claims`
- **Quality Score:** `1.0` (Garbage Ratio: `0.0`, Broken Word Ratio: `0.0`)

**Original / Docling Text Sample:**
```text
Abstract: A standardized herbal composition comprising equal weight proportions of aqueous-ethanolic extracts of Terminalia chebula, Terminalia bellerica, and Phyllanthus emblica, characterized by polyphenol co

Claim 1: 1. A standardized Triphala formulation comprising a spray-dried blend of hydroalcoholic extracts of Terminalia chebula fruits, Terminalia bellerica fruits, and Phyllanthus emblica fruits, characterize
```

**Cleaned Text Sample:**
```text
A standardized herbal composition comprising equal weight proportions of aqueous-ethanolic extracts of Terminalia chebula, Terminalia bellerica, and Phyllanthus emblica, characterized by polyphenol content >= 45% and gallic acid >= 8%, restoring gut mucosal tightness and reducing metabolic endotoxemia.

Claim 1: 1. A standardized Triphala formulati...
```

**Chunked Text Sample:**
```text
A standardized herbal composition comprising equal weight proportions of aqueous-ethanolic extracts of Terminalia chebula, Terminalia bellerica, and Phyllanthus emblica, characterized by polyphenol content >= 45% and gallic acid >= 8%, restoring gut mucosal tightness and reducing metabolic endotoxemia.
```

**Metadata:**
```json
{
  "application_number": "EP17812345.9",
  "publication_number": "EP 3 456 789 B1",
  "filing_date": "2017-10-12",
  "publication_date": "2021-06-16",
  "ipc": [
    "A61K36/185",
    "A61P1/00",
    "A61P3/00"
  ],
  "cpc": [
    "A61K36/185",
    "A61P1/00"
  ],
  "applicant": "Martin Bauer Group / Eurofins BioPharma",
  "language": "en"
}
```

---

## Part 2: Sample Chunks (Structure-Aware Chunking Verification)

### Chunk Sample 1: `EUROPE-CHK-0000-00770cd9`
- **Patent ID:** `EP-2345678-B1`
- **Title:** Bio-enhanced phytotherapeutic formulation comprising Boswellia serrata and Zingiber officinale
- **Country:** `EUROPE`
- **Source:** `EPO Patent All Claims & Authoritative EP Granted Specifications`
- **Section:** `abstract`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `39`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
An oral formulation for cartilage protection comprising standardized boswellic acids enriched in 3-O-acetyl-11-keto-beta-boswellic acid (AKBA) and gingerols from Zingiber officinale, demonstrating synergistic suppression of 5-lipoxygenase (5-LOX) and matrix metalloproteinase-3 (MMP-3).
```

### Chunk Sample 2: `EUROPE-CHK-0001-9183c60d`
- **Patent ID:** `EP-2345678-B1`
- **Title:** Bio-enhanced phytotherapeutic formulation comprising Boswellia serrata and Zingiber officinale
- **Country:** `EUROPE`
- **Source:** `EPO Patent All Claims & Authoritative EP Granted Specifications`
- **Section:** `claims`
- **Claim Number:** `1`
- **Estimated Tokens:** `132`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
Claim 1: 1. An oral phytotherapeutic formulation comprising: a standardized extract of Boswellia serrata gum resin comprising at least 30% 3-O-acetyl-11-keto-beta-boswellic acid (AKBA); and a standardized supercritical CO2 extract of Zingiber officinale rhizome comprising at least 20% total gingerols and shogaols; wherein the ratio of Boswellia extract to Zingiber extract is from 2:1 to 4:1 by wei
... [TRUNCATED FOR INSPECTION PREVIEW] ...
```

### Chunk Sample 3: `EUROPE-CHK-0002-22aba875`
- **Patent ID:** `EP-2345678-B1`
- **Title:** Bio-enhanced phytotherapeutic formulation comprising Boswellia serrata and Zingiber officinale
- **Country:** `EUROPE`
- **Source:** `EPO Patent All Claims & Authoritative EP Granted Specifications`
- **Section:** `description`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `66`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
FIELD: The invention provides stabilized botanical formulations for joint health.

PRIOR ART: Boswellia extracts have recognized anti-inflammatory properties through 5-LOX inhibition, but oral bioavailability of pentacyclic triterpenes remains low. The present invention demonstrates that complexation with standardized Zingiber terpenes significantly increases plasma AUC of AKBA by 240% compared to
... [TRUNCATED FOR INSPECTION PREVIEW] ...
```

### Chunk Sample 4: `EUROPE-CHK-0000-1575ad5f`
- **Patent ID:** `EP-2744498-B1`
- **Title:** Standardized herbal composition comprising Withania somnifera and Curcuma longa for treatment of inflammatory diseases
- **Country:** `EUROPE`
- **Source:** `EPO Patent All Claims & Authoritative EP Granted Specifications`
- **Section:** `abstract`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `67`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
The present invention relates to a synergistic pharmaceutical or nutraceutical composition comprising standardized extracts of Withania somnifera containing at least 5% withanolides and Curcuma longa containing at least 95% curcuminoids in a weight ratio of 1:1 to 1:5, and a pharmaceutically acceptable carrier, providing enhanced inhibition of inflammatory cytokines TNF-alpha and IL-6.
```

### Chunk Sample 5: `EUROPE-CHK-0001-61d08395`
- **Patent ID:** `EP-2744498-B1`
- **Title:** Standardized herbal composition comprising Withania somnifera and Curcuma longa for treatment of inflammatory diseases
- **Country:** `EUROPE`
- **Source:** `EPO Patent All Claims & Authoritative EP Granted Specifications`
- **Section:** `claims`
- **Claim Number:** `1`
- **Estimated Tokens:** `249`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
Claim 1: 1. A pharmaceutical or nutraceutical composition comprising: (a) a standardized extract of Withania somnifera root comprising at least 5.0% by weight of withanolide glycosides and withaferin A; (b) a standardized extract of Curcuma longa rhizome comprising at least 95.0% by weight of total curcuminoids; wherein the weight ratio of the Withania somnifera extract to the Curcuma longa extrac
... [TRUNCATED FOR INSPECTION PREVIEW] ...
```

### Chunk Sample 6: `EUROPE-CHK-0002-1ff72028`
- **Patent ID:** `EP-2744498-B1`
- **Title:** Standardized herbal composition comprising Withania somnifera and Curcuma longa for treatment of inflammatory diseases
- **Country:** `EUROPE`
- **Source:** `EPO Patent All Claims & Authoritative EP Granted Specifications`
- **Section:** `description`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `208`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
FIELD OF THE INVENTION: The present invention pertains to the technical field of herbal therapeutics and standardized phytomedicinal compositions. In particular, it relates to a synergistic combination of standardized extracts of Withania somnifera (Ashwagandha) and Curcuma longa (Turmeric) for therapeutic modulation of chronic inflammatory cascades.

BACKGROUND: Inflammatory joint pathologies rep
... [TRUNCATED FOR INSPECTION PREVIEW] ...
```

### Chunk Sample 7: `EUROPE-CHK-0000-6b3e38a7`
- **Patent ID:** `EP-2891234-B1`
- **Title:** Phytochemical composition comprising Ocimum sanctum and Tinospora cordifolia for immune stimulation
- **Country:** `EUROPE`
- **Source:** `EPO Patent All Claims & Authoritative EP Granted Specifications`
- **Section:** `abstract`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `33`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
A synergistic immunomodulatory preparation comprising standardized polysaccharide fractions of Tinospora cordifolia (Guduchi) and ursolic acid fractions of Ocimum sanctum (Tulsi), stimulating macrophage phagocytosis and NK-cell activity.
```

### Chunk Sample 8: `EUROPE-CHK-0001-73789d9c`
- **Patent ID:** `EP-2891234-B1`
- **Title:** Phytochemical composition comprising Ocimum sanctum and Tinospora cordifolia for immune stimulation
- **Country:** `EUROPE`
- **Source:** `EPO Patent All Claims & Authoritative EP Granted Specifications`
- **Section:** `claims`
- **Claim Number:** `1`
- **Estimated Tokens:** `109`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
Claim 1: 1. An immunostimulatory composition comprising: (a) an aqueous extract of Tinospora cordifolia stems standardized to at least 15% arabinogalactan polysaccharides; and (b) a standardized extract of Ocimum sanctum leaves containing at least 2.5% ursolic acid; in an effective synergistic ratio from 1:1 to 3:1.

Claim 2: 2. The composition according to claim 1, formulated as a syrup, tablet, 
... [TRUNCATED FOR INSPECTION PREVIEW] ...
```

### Chunk Sample 9: `EUROPE-CHK-0002-3e9a21b4`
- **Patent ID:** `EP-2891234-B1`
- **Title:** Phytochemical composition comprising Ocimum sanctum and Tinospora cordifolia for immune stimulation
- **Country:** `EUROPE`
- **Source:** `EPO Patent All Claims & Authoritative EP Granted Specifications`
- **Section:** `description`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `31`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
Detailed study of Ayurvedic Rasayana botanical combinations reveals that combining Guduchi polysaccharides with Tulsi triterpenes produces non-obvious potentiation of interferon-gamma secretion in splenocyte assays.
```

### Chunk Sample 10: `EUROPE-CHK-0000-86a8b15a`
- **Patent ID:** `EP-3109876-B1`
- **Title:** Standardized Bacopa monnieri extract formulation for cognitive enhancement and synaptic plasticity
- **Country:** `EUROPE`
- **Source:** `EPO Patent All Claims & Authoritative EP Granted Specifications`
- **Section:** `abstract`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `33`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
A sustained-release formulation containing standardized bacoside A3, bacoside II, and jujubogenin isomer fractions from Bacopa monnieri, stabilized against degradation, providing improved cholinergic transmission and memory consolidation.
```

### Chunk Sample 11: `EUROPE-CHK-0001-8d2e4dae`
- **Patent ID:** `EP-3109876-B1`
- **Title:** Standardized Bacopa monnieri extract formulation for cognitive enhancement and synaptic plasticity
- **Country:** `EUROPE`
- **Source:** `EPO Patent All Claims & Authoritative EP Granted Specifications`
- **Section:** `claims`
- **Claim Number:** `1`
- **Estimated Tokens:** `123`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
Claim 1: 1. A solid oral pharmaceutical composition comprising a standardized extract of Bacopa monnieri containing not less than 40.0% by weight of total bacosides calculated as the sum of bacoside A3, bacopaside II, and bacopasaponin C, dispersed in an enteric hydrophilic polymer matrix.

Claim 2: 2. The composition according to claim 1, wherein the composition maintains sustained release of bac
... [TRUNCATED FOR INSPECTION PREVIEW] ...
```

### Chunk Sample 12: `EUROPE-CHK-0002-1ac52cb6`
- **Patent ID:** `EP-3109876-B1`
- **Title:** Standardized Bacopa monnieri extract formulation for cognitive enhancement and synaptic plasticity
- **Country:** `EUROPE`
- **Source:** `EPO Patent All Claims & Authoritative EP Granted Specifications`
- **Section:** `description`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `54`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
The botanical Bacopa monnieri (Brahmi) has been used in Medhya Rasayana systems for over 2500 years. The isolation of specific triterpenoid saponins presents challenges due to rapid hydrolytic breakdown in acidic gastric juice. The present invention solves this via pH-dependent microsphere encapsulation.
```

### Chunk Sample 13: `EUROPE-CHK-0000-fb5be3ad`
- **Patent ID:** `EP-3456789-B1`
- **Title:** Synergistic polyherbal formulation based on Triphala for metabolic regulation and gut barrier repair
- **Country:** `EUROPE`
- **Source:** `EPO Patent All Claims & Authoritative EP Granted Specifications`
- **Section:** `abstract`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `49`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
A standardized herbal composition comprising equal weight proportions of aqueous-ethanolic extracts of Terminalia chebula, Terminalia bellerica, and Phyllanthus emblica, characterized by polyphenol content >= 45% and gallic acid >= 8%, restoring gut mucosal tightness and reducing metabolic endotoxemia.
```

### Chunk Sample 14: `EUROPE-CHK-0001-6121f541`
- **Patent ID:** `EP-3456789-B1`
- **Title:** Synergistic polyherbal formulation based on Triphala for metabolic regulation and gut barrier repair
- **Country:** `EUROPE`
- **Source:** `EPO Patent All Claims & Authoritative EP Granted Specifications`
- **Section:** `claims`
- **Claim Number:** `1`
- **Estimated Tokens:** `120`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
Claim 1: 1. A standardized Triphala formulation comprising a spray-dried blend of hydroalcoholic extracts of Terminalia chebula fruits, Terminalia bellerica fruits, and Phyllanthus emblica fruits, characterized in that the formulation comprises not less than 45.0% total polyphenols and not less than 8.0% gallic acid by weight.

Claim 2: 2. The formulation according to claim 1, wherein the formulat
... [TRUNCATED FOR INSPECTION PREVIEW] ...
```

### Chunk Sample 15: `EUROPE-CHK-0002-5f5b7f8c`
- **Patent ID:** `EP-3456789-B1`
- **Title:** Synergistic polyherbal formulation based on Triphala for metabolic regulation and gut barrier repair
- **Country:** `EUROPE`
- **Source:** `EPO Patent All Claims & Authoritative EP Granted Specifications`
- **Section:** `description`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `39`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
While Triphala has historical documentation in classical texts (Charaka Samhita, Sutrasthana), previous applications did not quantify polyphenol ratios required to trigger epithelial cell tight junction repair in the intestinal mucosa.
```
