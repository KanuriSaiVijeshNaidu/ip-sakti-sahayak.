# SIH 26045 Manual Sample Inspection — INDIA
**Date:** 2026-09-08 | **Auditor:** Antigravity Automated Verification System
**Total Documents:** 5 | **Total Chunks:** 15

> [!IMPORTANT]
> Visual confirmation that Docling extraction and text cleaning did **not** destroy:
> claims, claim numbers, botanical binomials, chemical names, legal terminology, or paragraph structure.

---

## Part 1: Sample Documents (Docling Extraction vs Cleaned vs Metadata)

### Sample 1: `IN-243763-B`
- **Patent ID:** `IN-243763-B`
- **Title:** A process for preparation of standardized extract from Withania somnifera with enhanced withanolide glycosides content
- **Country:** `INDIA`
- **Source:** `Indian Patent Office (IPO / InPASS) & TKDL Patent Corpus`
- **Section:** `abstract` & `claims`
- **Quality Score:** `1.0` (Garbage Ratio: `0.0`, Broken Word Ratio: `0.0`)

**Original / Docling Text Sample:**
```text
Abstract: The invention discloses an improved industrial extraction process for Withania somnifera roots yielding a dry extract containing >= 8.0% withanolide glycosides and <= 0.1% withaferin A, free of cytoto

Claim 1: 1. An industrial process for obtaining an adaptogenic standardized extract of Withania somnifera roots comprising: (a) extracting dried roots with a 70:30 v/v ethanol-water solvent at 40°C to 45°C; (b
```

**Cleaned Text Sample:**
```text
The invention discloses an improved industrial extraction process for Withania somnifera roots yielding a dry extract containing >= 8.0% withanolide glycosides and <= 0.1% withaferin A, free of cytotoxic aglycones, exhibiting superior anxiolytic and adaptogenic efficacy.

Claim 1: 1. An industrial process for obtaining an adaptogenic standardized e...
```

**Chunked Text Sample:**
```text
The invention discloses an improved industrial extraction process for Withania somnifera roots yielding a dry extract containing >= 8.0% withanolide glycosides and <= 0.1% withaferin A, free of cytotoxic aglycones, exhibiting superior anxiolytic and adaptogenic efficacy.
```

**Metadata:**
```json
{
  "application_number": "890/DEL/2005",
  "publication_number": "IN 243763 B",
  "filing_date": "2005-04-12",
  "publication_date": "2010-10-29",
  "ipc": [
    "A61K36/81",
    "B01D15/00",
    "A61P25/22"
  ],
  "cpc": [
    "A61K36/81",
    "B01D15/00"
  ],
  "applicant": "Dabur Research Foundation",
  "language": "en"
}
```

---

### Sample 2: `IN-268685-B`
- **Patent ID:** `IN-268685-B`
- **Title:** A novel synergistic herbal formulation for management of metabolic disorders comprising extracts of Tinospora cordifolia, Salacia reticulata, and Curcuma longa
- **Country:** `INDIA`
- **Source:** `Indian Patent Office (IPO / InPASS) & TKDL Patent Corpus`
- **Section:** `abstract` & `claims`
- **Quality Score:** `1.0` (Garbage Ratio: `0.0`, Broken Word Ratio: `0.0`)

**Original / Docling Text Sample:**
```text
Abstract: The invention relates to a synergistic pharmaceutical and nutraceutical composition for management of Type-2 diabetes and insulin resistance, comprising aqueous-ethanolic extracts of Tinospora cordifo

Claim 1: 1. A novel synergistic herbal formulation for management of metabolic syndrome and Type-2 diabetes comprising: (a) 20% to 35% by weight of a hydroalcoholic extract of Tinospora cordifolia stems standa
```

**Cleaned Text Sample:**
```text
The invention relates to a synergistic pharmaceutical and nutraceutical composition for management of Type-2 diabetes and insulin resistance, comprising aqueous-ethanolic extracts of Tinospora cordifolia (15-30% w/w), Salacia reticulata (20-40% w/w), and Curcuma longa (10-25% w/w), demonstrating superior inhibition of alpha-glucosidase and reductio...
```

**Chunked Text Sample:**
```text
The invention relates to a synergistic pharmaceutical and nutraceutical composition for management of Type-2 diabetes and insulin resistance, comprising aqueous-ethanolic extracts of Tinospora cordifolia (15-30% w/w), Salacia reticulata (20-40% w/w), and Curcuma longa (10-25% w/w), demonstrating superior inhibition of alpha-glucosidase and reductio...
```

**Metadata:**
```json
{
  "application_number": "1456/DEL/2008",
  "publication_number": "IN 268685 B",
  "filing_date": "2008-06-18",
  "publication_date": "2015-09-11",
  "ipc": [
    "A61K36/59",
    "A61K36/9066",
    "A61K36/37",
    "A61P3/10"
  ],
  "cpc": [
    "A61K36/59",
    "A61K36/9066"
  ],
  "applicant": "Council of Scientific and Industrial Research (CSIR) & CCRAS",
  "language": "en"
}
```

---

### Sample 3: `IN-284123-B`
- **Patent ID:** `IN-284123-B`
- **Title:** Polyherbal formulation for hepatoprotective activity comprising Phyllanthus amarus, Picrorhiza kurroa, and Boerhavia diffusa
- **Country:** `INDIA`
- **Source:** `Indian Patent Office (IPO / InPASS) & TKDL Patent Corpus`
- **Section:** `abstract` & `claims`
- **Quality Score:** `1.0` (Garbage Ratio: `0.0`, Broken Word Ratio: `0.0`)

**Original / Docling Text Sample:**
```text
Abstract: A synergistic polyherbal therapeutic composition for treatment of drug-induced liver injury and hepatitis, comprising standardized extract fractions of Phyllanthus amarus (phyllanthin >= 2%), Picrorhi

Claim 1: 1. A polyherbal hepatoprotective pharmaceutical composition comprising: (a) 30% to 40% w/w of standardized Phyllanthus amarus extract containing at least 2.0% phyllanthin; (b) 25% to 35% w/w of standa
```

**Cleaned Text Sample:**
```text
A synergistic polyherbal therapeutic composition for treatment of drug-induced liver injury and hepatitis, comprising standardized extract fractions of Phyllanthus amarus (phyllanthin >= 2%), Picrorhiza kurroa (kutkoside and picroside >= 10%), and Boerhavia diffusa (punarnavoside >= 1.5%).

Claim 1: 1. A polyherbal hepatoprotective pharmaceutical c...
```

**Chunked Text Sample:**
```text
A synergistic polyherbal therapeutic composition for treatment of drug-induced liver injury and hepatitis, comprising standardized extract fractions of Phyllanthus amarus (phyllanthin >= 2%), Picrorhiza kurroa (kutkoside and picroside >= 10%), and Boerhavia diffusa (punarnavoside >= 1.5%).
```

**Metadata:**
```json
{
  "application_number": "2104/MUM/2009",
  "publication_number": "IN 284123 B",
  "filing_date": "2009-09-15",
  "publication_date": "2017-06-09",
  "ipc": [
    "A61K36/47",
    "A61K36/68",
    "A61K36/185",
    "A61P1/16"
  ],
  "cpc": [
    "A61K36/47",
    "A61K36/68"
  ],
  "applicant": "Himalaya Drug Company / Himalaya Global Holdings",
  "language": "en"
}
```

---

### Sample 4: `IN-324590-B`
- **Patent ID:** `IN-324590-B`
- **Title:** Synergistic botanical composition comprising Boswellia serrata and Commiphora mukul for inflammatory joint diseases
- **Country:** `INDIA`
- **Source:** `Indian Patent Office (IPO / InPASS) & TKDL Patent Corpus`
- **Section:** `abstract` & `claims`
- **Quality Score:** `1.0` (Garbage Ratio: `0.0`, Broken Word Ratio: `0.0`)

**Original / Docling Text Sample:**
```text
Abstract: A synergistic anti-arthritic oral composition combining standardized 3-O-acetyl-11-keto-beta-boswellic acid (AKBA >= 30%) with guggulsterones E and Z (>= 2.5%) from Commiphora mukul, significantly inh

Claim 1: 1. A synergistic oral botanical composition comprising: (a) a standardized extract of Boswellia serrata resin comprising at least 30.0% by weight of 3-O-acetyl-11-keto-beta-boswellic acid (AKBA); and 
```

**Cleaned Text Sample:**
```text
A synergistic anti-arthritic oral composition combining standardized 3-O-acetyl-11-keto-beta-boswellic acid (AKBA >= 30%) with guggulsterones E and Z (>= 2.5%) from Commiphora mukul, significantly inhibiting joint swelling and pro-inflammatory TNF-alpha in adjuvant-induced arthritis models.

Claim 1: 1. A synergistic oral botanical composition comp...
```

**Chunked Text Sample:**
```text
A synergistic anti-arthritic oral composition combining standardized 3-O-acetyl-11-keto-beta-boswellic acid (AKBA >= 30%) with guggulsterones E and Z (>= 2.5%) from Commiphora mukul, significantly inhibiting joint swelling and pro-inflammatory TNF-alpha in adjuvant-induced arthritis models.
```

**Metadata:**
```json
{
  "application_number": "345/KOL/2011",
  "publication_number": "IN 324590 B",
  "filing_date": "2011-03-24",
  "publication_date": "2019-11-08",
  "ipc": [
    "A61K36/324",
    "A61K36/328",
    "A61P29/00",
    "A61P19/02"
  ],
  "cpc": [
    "A61K36/324",
    "A61K36/328"
  ],
  "applicant": "National Botanical Research Institute (CSIR-NBRI)",
  "language": "en"
}
```

---

### Sample 5: `IN-348215-B`
- **Patent ID:** `IN-348215-B`
- **Title:** Standardized herbal anti-diabetic composition comprising Gymnema sylvestre, Momordica charantia, and Cinnamomum zeylanicum
- **Country:** `INDIA`
- **Source:** `Indian Patent Office (IPO / InPASS) & TKDL Patent Corpus`
- **Section:** `abstract` & `claims`
- **Quality Score:** `1.0` (Garbage Ratio: `0.0`, Broken Word Ratio: `0.0`)

**Original / Docling Text Sample:**
```text
Abstract: A novel standardized herbal composition for insulin sensitization and beta-cell protection comprising extracts of Gymnema sylvestre (gymnemic acids >= 25%), Momordica charantia (charantin >= 1.5%), an

Claim 1: 1. A standardized anti-diabetic herbal formulation comprising: (a) 30% to 45% w/w of a standardized extract of Gymnema sylvestre containing not less than 25% gymnemic acids; (b) 25% to 35% w/w of a st
```

**Cleaned Text Sample:**
```text
A novel standardized herbal composition for insulin sensitization and beta-cell protection comprising extracts of Gymnema sylvestre (gymnemic acids >= 25%), Momordica charantia (charantin >= 1.5%), and Cinnamomum zeylanicum (proanthocyanidins >= 10%), demonstrating enhanced glucose uptake in skeletal muscle.

Claim 1: 1. A standardized anti-diabeti...
```

**Chunked Text Sample:**
```text
A novel standardized herbal composition for insulin sensitization and beta-cell protection comprising extracts of Gymnema sylvestre (gymnemic acids >= 25%), Momordica charantia (charantin >= 1.5%), and Cinnamomum zeylanicum (proanthocyanidins >= 10%), demonstrating enhanced glucose uptake in skeletal muscle.
```

**Metadata:**
```json
{
  "application_number": "1892/CHE/2012",
  "publication_number": "IN 348215 B",
  "filing_date": "2012-05-14",
  "publication_date": "2020-09-30",
  "ipc": [
    "A61K36/27",
    "A61K36/42",
    "A61K36/54",
    "A61P3/10"
  ],
  "cpc": [
    "A61K36/27",
    "A61K36/42"
  ],
  "applicant": "Natural Remedies Pvt. Ltd. & Rajiv Gandhi University",
  "language": "en"
}
```

---

## Part 2: Sample Chunks (Structure-Aware Chunking Verification)

### Chunk Sample 1: `INDIA-CHK-0000-a32c71d2`
- **Patent ID:** `IN-243763-B`
- **Title:** A process for preparation of standardized extract from Withania somnifera with enhanced withanolide glycosides content
- **Country:** `INDIA`
- **Source:** `Indian Patent Office (IPO / InPASS) & TKDL Patent Corpus`
- **Section:** `abstract`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `46`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
The invention discloses an improved industrial extraction process for Withania somnifera roots yielding a dry extract containing >= 8.0% withanolide glycosides and <= 0.1% withaferin A, free of cytotoxic aglycones, exhibiting superior anxiolytic and adaptogenic efficacy.
```

### Chunk Sample 2: `INDIA-CHK-0001-0cda8b21`
- **Patent ID:** `IN-243763-B`
- **Title:** A process for preparation of standardized extract from Withania somnifera with enhanced withanolide glycosides content
- **Country:** `INDIA`
- **Source:** `Indian Patent Office (IPO / InPASS) & TKDL Patent Corpus`
- **Section:** `claims`
- **Claim Number:** `1`
- **Estimated Tokens:** `161`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
Claim 1: 1. An industrial process for obtaining an adaptogenic standardized extract of Withania somnifera roots comprising: (a) extracting dried roots with a 70:30 v/v ethanol-water solvent at 40°C to 45°C; (b) treating the hydroalcoholic extract with a food-grade macroporous adsorbent resin to selectively retain withanolide glycosides; (c) eluting with 90% ethanol; and (d) spray-drying the eluate
... [TRUNCATED FOR INSPECTION PREVIEW] ...
```

### Chunk Sample 3: `INDIA-CHK-0002-2d9208d2`
- **Patent ID:** `IN-243763-B`
- **Title:** A process for preparation of standardized extract from Withania somnifera with enhanced withanolide glycosides content
- **Country:** `INDIA`
- **Source:** `Indian Patent Office (IPO / InPASS) & TKDL Patent Corpus`
- **Section:** `description`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `49`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
BACKGROUND: Traditional churna powders contain low (0.2-0.5%) active withanolides and vary widely between agricultural batches. Furthermore, withaferin A at high concentrations exhibits cytotoxic rather than adaptogenic properties. The present process selectively enriches withanolide glycosides while depleting cytotoxic aglycones.
```

### Chunk Sample 4: `INDIA-CHK-0000-8da7fad0`
- **Patent ID:** `IN-268685-B`
- **Title:** A novel synergistic herbal formulation for management of metabolic disorders comprising extracts of Tinospora cordifolia, Salacia reticulata, and Curcuma longa
- **Country:** `INDIA`
- **Source:** `Indian Patent Office (IPO / InPASS) & TKDL Patent Corpus`
- **Section:** `abstract`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `59`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
The invention relates to a synergistic pharmaceutical and nutraceutical composition for management of Type-2 diabetes and insulin resistance, comprising aqueous-ethanolic extracts of Tinospora cordifolia (15-30% w/w), Salacia reticulata (20-40% w/w), and Curcuma longa (10-25% w/w), demonstrating superior inhibition of alpha-glucosidase and reduction of HbA1c without hypoglycemia.
```

### Chunk Sample 5: `INDIA-CHK-0001-6bc214d7`
- **Patent ID:** `IN-268685-B`
- **Title:** A novel synergistic herbal formulation for management of metabolic disorders comprising extracts of Tinospora cordifolia, Salacia reticulata, and Curcuma longa
- **Country:** `INDIA`
- **Source:** `Indian Patent Office (IPO / InPASS) & TKDL Patent Corpus`
- **Section:** `claims`
- **Claim Number:** `1`
- **Estimated Tokens:** `258`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
Claim 1: 1. A novel synergistic herbal formulation for management of metabolic syndrome and Type-2 diabetes comprising: (a) 20% to 35% by weight of a hydroalcoholic extract of Tinospora cordifolia stems standardized to 2.5% tinosporide; (b) 25% to 45% by weight of an aqueous extract of Salacia reticulata roots standardized to 1.5% salacinol and kotalanol; (c) 15% to 30% by weight of a standardized
... [TRUNCATED FOR INSPECTION PREVIEW] ...
```

### Chunk Sample 6: `INDIA-CHK-0002-ac5737b4`
- **Patent ID:** `IN-268685-B`
- **Title:** A novel synergistic herbal formulation for management of metabolic disorders comprising extracts of Tinospora cordifolia, Salacia reticulata, and Curcuma longa
- **Country:** `INDIA`
- **Source:** `Indian Patent Office (IPO / InPASS) & TKDL Patent Corpus`
- **Section:** `description`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `161`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
FIELD OF INVENTION: The present invention relates to herbal medicinal chemistry and pharmacology, specifically to a synergistic botanical composition for glycemic control and metabolic syndrome.

COMPLIANCE WITH SECTION 3(p) & 3(e): Traditional Knowledge Digital Library (TKDL) references recognize individual herbs for Prameha (diabetes). However, under Section 3(e) of the Indian Patents Act 1970, 
... [TRUNCATED FOR INSPECTION PREVIEW] ...
```

### Chunk Sample 7: `INDIA-CHK-0000-86679baa`
- **Patent ID:** `IN-284123-B`
- **Title:** Polyherbal formulation for hepatoprotective activity comprising Phyllanthus amarus, Picrorhiza kurroa, and Boerhavia diffusa
- **Country:** `INDIA`
- **Source:** `Indian Patent Office (IPO / InPASS) & TKDL Patent Corpus`
- **Section:** `abstract`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `46`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
A synergistic polyherbal therapeutic composition for treatment of drug-induced liver injury and hepatitis, comprising standardized extract fractions of Phyllanthus amarus (phyllanthin >= 2%), Picrorhiza kurroa (kutkoside and picroside >= 10%), and Boerhavia diffusa (punarnavoside >= 1.5%).
```

### Chunk Sample 8: `INDIA-CHK-0001-842fc86b`
- **Patent ID:** `IN-284123-B`
- **Title:** Polyherbal formulation for hepatoprotective activity comprising Phyllanthus amarus, Picrorhiza kurroa, and Boerhavia diffusa
- **Country:** `INDIA`
- **Source:** `Indian Patent Office (IPO / InPASS) & TKDL Patent Corpus`
- **Section:** `claims`
- **Claim Number:** `1`
- **Estimated Tokens:** `145`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
Claim 1: 1. A polyherbal hepatoprotective pharmaceutical composition comprising: (a) 30% to 40% w/w of standardized Phyllanthus amarus extract containing at least 2.0% phyllanthin; (b) 25% to 35% w/w of standardized Picrorhiza kurroa rhizome extract containing at least 10.0% picrosides; (c) 20% to 30% w/w of Boerhavia diffusa root extract containing at least 1.5% punarnavoside; and (d) pharmaceuti
... [TRUNCATED FOR INSPECTION PREVIEW] ...
```

### Chunk Sample 9: `INDIA-CHK-0002-51ca20ff`
- **Patent ID:** `IN-284123-B`
- **Title:** Polyherbal formulation for hepatoprotective activity comprising Phyllanthus amarus, Picrorhiza kurroa, and Boerhavia diffusa
- **Country:** `INDIA`
- **Source:** `Indian Patent Office (IPO / InPASS) & TKDL Patent Corpus`
- **Section:** `description`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `44`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
The classical herbs Bhumyamalaki, Katuki, and Punarnava are revered in Yakrit Roga chikitsa. The present applicants established that a precise ratio produces non-obvious stabilization of the hepatocyte mitochondrial membrane against paracetamol and rifampicin toxicity.
```

### Chunk Sample 10: `INDIA-CHK-0000-ccbab034`
- **Patent ID:** `IN-324590-B`
- **Title:** Synergistic botanical composition comprising Boswellia serrata and Commiphora mukul for inflammatory joint diseases
- **Country:** `INDIA`
- **Source:** `Indian Patent Office (IPO / InPASS) & TKDL Patent Corpus`
- **Section:** `abstract`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `42`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
A synergistic anti-arthritic oral composition combining standardized 3-O-acetyl-11-keto-beta-boswellic acid (AKBA >= 30%) with guggulsterones E and Z (>= 2.5%) from Commiphora mukul, significantly inhibiting joint swelling and pro-inflammatory TNF-alpha in adjuvant-induced arthritis models.
```

### Chunk Sample 11: `INDIA-CHK-0001-63ec9bd5`
- **Patent ID:** `IN-324590-B`
- **Title:** Synergistic botanical composition comprising Boswellia serrata and Commiphora mukul for inflammatory joint diseases
- **Country:** `INDIA`
- **Source:** `Indian Patent Office (IPO / InPASS) & TKDL Patent Corpus`
- **Section:** `claims`
- **Claim Number:** `1`
- **Estimated Tokens:** `133`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
Claim 1: 1. A synergistic oral botanical composition comprising: (a) a standardized extract of Boswellia serrata resin comprising at least 30.0% by weight of 3-O-acetyl-11-keto-beta-boswellic acid (AKBA); and (b) a standardized extract of Commiphora mukul gum resin comprising at least 2.5% by weight of combined guggulsterones E and Z; in a weight ratio of 2:1 to 4:1.

Claim 2: 2. The composition a
... [TRUNCATED FOR INSPECTION PREVIEW] ...
```

### Chunk Sample 12: `INDIA-CHK-0002-92836823`
- **Patent ID:** `IN-324590-B`
- **Title:** Synergistic botanical composition comprising Boswellia serrata and Commiphora mukul for inflammatory joint diseases
- **Country:** `INDIA`
- **Source:** `Indian Patent Office (IPO / InPASS) & TKDL Patent Corpus`
- **Section:** `description`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `37`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
Under Section 3(e) of the Indian Patents Act, evidence of synergy was submitted demonstrating that AKBA and guggulsterones act on complementary biological targets: 5-LOX inhibition and NF-kappa-B suppression respectively.
```

### Chunk Sample 13: `INDIA-CHK-0000-c18f4303`
- **Patent ID:** `IN-348215-B`
- **Title:** Standardized herbal anti-diabetic composition comprising Gymnema sylvestre, Momordica charantia, and Cinnamomum zeylanicum
- **Country:** `INDIA`
- **Source:** `Indian Patent Office (IPO / InPASS) & TKDL Patent Corpus`
- **Section:** `abstract`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `49`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
A novel standardized herbal composition for insulin sensitization and beta-cell protection comprising extracts of Gymnema sylvestre (gymnemic acids >= 25%), Momordica charantia (charantin >= 1.5%), and Cinnamomum zeylanicum (proanthocyanidins >= 10%), demonstrating enhanced glucose uptake in skeletal muscle.
```

### Chunk Sample 14: `INDIA-CHK-0001-8f81cb8c`
- **Patent ID:** `IN-348215-B`
- **Title:** Standardized herbal anti-diabetic composition comprising Gymnema sylvestre, Momordica charantia, and Cinnamomum zeylanicum
- **Country:** `INDIA`
- **Source:** `Indian Patent Office (IPO / InPASS) & TKDL Patent Corpus`
- **Section:** `claims`
- **Claim Number:** `1`
- **Estimated Tokens:** `139`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
Claim 1: 1. A standardized anti-diabetic herbal formulation comprising: (a) 30% to 45% w/w of a standardized extract of Gymnema sylvestre containing not less than 25% gymnemic acids; (b) 25% to 35% w/w of a standardized extract of Momordica charantia containing not less than 1.5% charantin; and (c) 15% to 25% w/w of an extract of Cinnamomum zeylanicum bark containing not less than 10% type-A proan
... [TRUNCATED FOR INSPECTION PREVIEW] ...
```

### Chunk Sample 15: `INDIA-CHK-0002-bc9b4a96`
- **Patent ID:** `IN-348215-B`
- **Title:** Standardized herbal anti-diabetic composition comprising Gymnema sylvestre, Momordica charantia, and Cinnamomum zeylanicum
- **Country:** `INDIA`
- **Source:** `Indian Patent Office (IPO / InPASS) & TKDL Patent Corpus`
- **Section:** `description`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `52`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
Detailed investigation of Indian medicinal plants recognized for Madhumeha revealed that combining gymnemic acids (which stimulate insulin secretion from beta-cells) with charantin (which mimics insulin activity) and cinnamon polyphenols (which enhance insulin receptor phosphorylation) produces an unprecedented multi-target therapeutic benefit.
```
