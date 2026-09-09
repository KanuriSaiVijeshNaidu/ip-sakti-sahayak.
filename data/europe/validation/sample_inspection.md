# SIH 26045 Manual Sample Inspection — EUROPE
**Date:** 2026-09-08 | **Auditor:** Antigravity Automated Verification System
**Total Documents:** 646 | **Total Chunks:** 1912

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

### Sample 6: `EP-CLAIM-00090`
- **Patent ID:** `EP-CLAIM-00090`
- **Title:** European Patent Claim: The pharmaceutical composition according to claim 12, which is a cell growth inhibitor
- **Country:** `EUROPE`
- **Source:** `EPO Patent All Claims & Authoritative EP Granted Specifications`
- **Section:** `abstract` & `claims`
- **Quality Score:** `1.0` (Garbage Ratio: `0.0`, Broken Word Ratio: `0.0`)

**Original / Docling Text Sample:**
```text
Abstract: European patent claim specification under EPC: The pharmaceutical composition according to claim 12, which is a cell growth inhibitor....

Claim 1: The pharmaceutical composition according to claim 12, which is a cell growth inhibitor.
```

**Cleaned Text Sample:**
```text
European patent claim specification under EPC: The pharmaceutical composition according to claim 12, which is a cell growth inhibitor....

Claim 1: The pharmaceutical composition according to claim 12, which is a cell growth inhibitor.

European Patent Office (EPO) published claim record under EPC Article 69:

The pharmaceutical composition accordi...
```

**Chunked Text Sample:**
```text
European patent claim specification under EPC: The pharmaceutical composition according to claim 12, which is a cell growth inhibitor....
```

**Metadata:**
```json
{
  "application_number": "EP-APP-00090",
  "publication_number": "EP 2000090 A1",
  "filing_date": "2015-06-15",
  "publication_date": "2017-01-20",
  "ipc": [
    "A61K36/00",
    "A61P29/00"
  ],
  "cpc": [
    "A61K36/00"
  ],
  "applicant": "European Patent Applicant",
  "language": "en"
}
```

---

### Sample 7: `EP-CLAIM-00223`
- **Patent ID:** `EP-CLAIM-00223`
- **Title:** European Patent Claim: The pharmaceutical composition according to claim 1, wherein the increased amount of the c
- **Country:** `EUROPE`
- **Source:** `EPO Patent All Claims & Authoritative EP Granted Specifications`
- **Section:** `abstract` & `claims`
- **Quality Score:** `1.0` (Garbage Ratio: `0.0`, Broken Word Ratio: `0.0`)

**Original / Docling Text Sample:**
```text
Abstract: European patent claim specification under EPC: The pharmaceutical composition according to claim 1, wherein the increased amount of the compound represented by formula (III) in said pharmaceutical com

Claim 1: The pharmaceutical composition according to claim 1, wherein the increased amount of the compound represented by formula (III) in said pharmaceutical composition is less than 0.05 %, and the increased
```

**Cleaned Text Sample:**
```text
European patent claim specification under EPC: The pharmaceutical composition according to claim 1, wherein the increased amount of the compound represented by formula (III) in said pharmaceutical composition is less than 0.05 %, and the increased amount of the compound represented by formula (IV...

Claim 1: The pharmaceutical composition accordin...
```

**Chunked Text Sample:**
```text
European patent claim specification under EPC: The pharmaceutical composition according to claim 1, wherein the increased amount of the compound represented by formula (III) in said pharmaceutical composition is less than 0.05 %, and the increased amount of the compound represented by formula (IV...
```

**Metadata:**
```json
{
  "application_number": "EP-APP-00223",
  "publication_number": "EP 2000223 A1",
  "filing_date": "2015-06-15",
  "publication_date": "2017-01-20",
  "ipc": [
    "A61K36/00",
    "A61P29/00"
  ],
  "cpc": [
    "A61K36/00"
  ],
  "applicant": "European Patent Applicant",
  "language": "en"
}
```

---

### Sample 8: `EP-CLAIM-00508`
- **Patent ID:** `EP-CLAIM-00508`
- **Title:** European Patent Claim: The pharmaceutical composition of claim 13, further comprising a pharmaceutically acceptab
- **Country:** `EUROPE`
- **Source:** `EPO Patent All Claims & Authoritative EP Granted Specifications`
- **Section:** `abstract` & `claims`
- **Quality Score:** `1.0` (Garbage Ratio: `0.0`, Broken Word Ratio: `0.0`)

**Original / Docling Text Sample:**
```text
Abstract: European patent claim specification under EPC: The pharmaceutical composition of claim 13, further comprising a pharmaceutically acceptable carrier wherein the pharmaceutically acceptable carrier is a

Claim 1: The pharmaceutical composition of claim 13, further comprising a pharmaceutically acceptable carrier wherein the pharmaceutically acceptable carrier is a lipid formulation.
```

**Cleaned Text Sample:**
```text
European patent claim specification under EPC: The pharmaceutical composition of claim 13, further comprising a pharmaceutically acceptable carrier wherein the pharmaceutically acceptable carrier is a lipid formulation....

Claim 1: The pharmaceutical composition of claim 13, further comprising a pharmaceutically acceptable carrier wherein the phar...
```

**Chunked Text Sample:**
```text
European patent claim specification under EPC: The pharmaceutical composition of claim 13, further comprising a pharmaceutically acceptable carrier wherein the pharmaceutically acceptable carrier is a lipid formulation....
```

**Metadata:**
```json
{
  "application_number": "EP-APP-00508",
  "publication_number": "EP 2000508 A1",
  "filing_date": "2015-06-15",
  "publication_date": "2017-01-20",
  "ipc": [
    "A61K36/00",
    "A61P29/00"
  ],
  "cpc": [
    "A61K36/00"
  ],
  "applicant": "European Patent Applicant",
  "language": "en"
}
```

---

### Sample 9: `EP-CLAIM-00615`
- **Patent ID:** `EP-CLAIM-00615`
- **Title:** European Patent Claim: A compressed tablet, according to any of the previous claims, which comprises more than 80
- **Country:** `EUROPE`
- **Source:** `EPO Patent All Claims & Authoritative EP Granted Specifications`
- **Section:** `abstract` & `claims`
- **Quality Score:** `1.0` (Garbage Ratio: `0.0`, Broken Word Ratio: `0.0`)

**Original / Docling Text Sample:**
```text
Abstract: European patent claim specification under EPC: A compressed tablet, according to any of the previous claims, which comprises more than 80% sucroferric oxyhydroxide of the total weight of the pharmaceu

Claim 1: A compressed tablet, according to any of the previous claims, which comprises more than 80% sucroferric oxyhydroxide of the total weight of the pharmaceutical composition (by weight on a dry weight ba
```

**Cleaned Text Sample:**
```text
European patent claim specification under EPC: A compressed tablet, according to any of the previous claims, which comprises more than 80% sucroferric oxyhydroxide of the total weight of the pharmaceutical composition (by weight on a dry weight basis)....

Claim 1: A compressed tablet, according to any of the previous claims, which comprises more t...
```

**Chunked Text Sample:**
```text
European patent claim specification under EPC: A compressed tablet, according to any of the previous claims, which comprises more than 80% sucroferric oxyhydroxide of the total weight of the pharmaceutical composition (by weight on a dry weight basis)....
```

**Metadata:**
```json
{
  "application_number": "EP-APP-00615",
  "publication_number": "EP 2000615 A1",
  "filing_date": "2015-06-15",
  "publication_date": "2017-01-20",
  "ipc": [
    "A61K36/00",
    "A61P29/00"
  ],
  "cpc": [
    "A61K36/00"
  ],
  "applicant": "European Patent Applicant",
  "language": "en"
}
```

---

### Sample 10: `EP-CLAIM-00654`
- **Patent ID:** `EP-CLAIM-00654`
- **Title:** European Patent Claim: The pre-filled syringe or autoinjector according to any one of claims 15 or 17 to 19 or th
- **Country:** `EUROPE`
- **Source:** `EPO Patent All Claims & Authoritative EP Granted Specifications`
- **Section:** `abstract` & `claims`
- **Quality Score:** `1.0` (Garbage Ratio: `0.0`, Broken Word Ratio: `0.0`)

**Original / Docling Text Sample:**
```text
Abstract: European patent claim specification under EPC: The pre-filled syringe or autoinjector according to any one of claims 15 or 17 to 19 or the pharmaceutical composition for use according to any one of cl

Claim 1: The pre-filled syringe or autoinjector according to any one of claims 15 or 17 to 19 or the pharmaceutical composition for use according to any one of claims 16 to 19, wherein the anti-CGRP receptor a
```

**Cleaned Text Sample:**
```text
European patent claim specification under EPC: The pre-filled syringe or autoinjector according to any one of claims 15 or 17 to 19 or the pharmaceutical composition for use according to any one of claims 16 to 19, wherein the anti-CGRP receptor antibody comprises a heavy chain variable region (V...

Claim 1: The pre-filled syringe or autoinjector ...
```

**Chunked Text Sample:**
```text
European patent claim specification under EPC: The pre-filled syringe or autoinjector according to any one of claims 15 or 17 to 19 or the pharmaceutical composition for use according to any one of claims 16 to 19, wherein the anti-CGRP receptor antibody comprises a heavy chain variable region (V...
```

**Metadata:**
```json
{
  "application_number": "EP-APP-00654",
  "publication_number": "EP 2000654 A1",
  "filing_date": "2015-06-15",
  "publication_date": "2017-01-20",
  "ipc": [
    "A61K36/00",
    "A61P29/00"
  ],
  "cpc": [
    "A61K36/00"
  ],
  "applicant": "European Patent Applicant",
  "language": "en"
}
```

---

### Sample 11: `EP-CLAIM-00660`
- **Patent ID:** `EP-CLAIM-00660`
- **Title:** European Patent Claim: The pharmaceutical composition of claim 1 or 2, wherein the bacterium further comprises a 
- **Country:** `EUROPE`
- **Source:** `EPO Patent All Claims & Authoritative EP Granted Specifications`
- **Section:** `abstract` & `claims`
- **Quality Score:** `1.0` (Garbage Ratio: `0.0`, Broken Word Ratio: `0.0`)

**Original / Docling Text Sample:**
```text
Abstract: European patent claim specification under EPC: The pharmaceutical composition of claim 1 or 2, wherein the bacterium further comprises a genetic modification that reduces endogenous biosynthesis of a 

Claim 1: The pharmaceutical composition of claim 1 or 2, wherein the bacterium further comprises a genetic modification that reduces endogenous biosynthesis of a branched chain amino acid in the bacterium.
```

**Cleaned Text Sample:**
```text
European patent claim specification under EPC: The pharmaceutical composition of claim 1 or 2, wherein the bacterium further comprises a genetic modification that reduces endogenous biosynthesis of a branched chain amino acid in the bacterium....

Claim 1: The pharmaceutical composition of claim 1 or 2, wherein the bacterium further comprises a gen...
```

**Chunked Text Sample:**
```text
European patent claim specification under EPC: The pharmaceutical composition of claim 1 or 2, wherein the bacterium further comprises a genetic modification that reduces endogenous biosynthesis of a branched chain amino acid in the bacterium....
```

**Metadata:**
```json
{
  "application_number": "EP-APP-00660",
  "publication_number": "EP 2000660 A1",
  "filing_date": "2015-06-15",
  "publication_date": "2017-01-20",
  "ipc": [
    "A61K36/00",
    "A61P29/00"
  ],
  "cpc": [
    "A61K36/00"
  ],
  "applicant": "European Patent Applicant",
  "language": "en"
}
```

---

### Sample 12: `EP-CLAIM-00792`
- **Patent ID:** `EP-CLAIM-00792`
- **Title:** European Patent Claim: A pharmaceutical composition comprising at least one compound according to any one of clai
- **Country:** `EUROPE`
- **Source:** `EPO Patent All Claims & Authoritative EP Granted Specifications`
- **Section:** `abstract` & `claims`
- **Quality Score:** `1.0` (Garbage Ratio: `0.0`, Broken Word Ratio: `0.0`)

**Original / Docling Text Sample:**
```text
Abstract: European patent claim specification under EPC: A pharmaceutical composition comprising at least one compound according to any one of claims 1 to 9 or a conjugate according to claim 11....

Claim 1: A pharmaceutical composition comprising at least one compound according to any one of claims 1 to 9 or a conjugate according to claim 11.
```

**Cleaned Text Sample:**
```text
European patent claim specification under EPC: A pharmaceutical composition comprising at least one compound according to any one of claims 1 to 9 or a conjugate according to claim 11....

Claim 1: A pharmaceutical composition comprising at least one compound according to any one of claims 1 to 9 or a conjugate according to claim 11.

European Pate...
```

**Chunked Text Sample:**
```text
European patent claim specification under EPC: A pharmaceutical composition comprising at least one compound according to any one of claims 1 to 9 or a conjugate according to claim 11....
```

**Metadata:**
```json
{
  "application_number": "EP-APP-00792",
  "publication_number": "EP 2000792 A1",
  "filing_date": "2015-06-15",
  "publication_date": "2017-01-20",
  "ipc": [
    "A61K36/00",
    "A61P29/00"
  ],
  "cpc": [
    "A61K36/00"
  ],
  "applicant": "European Patent Applicant",
  "language": "en"
}
```

---

### Sample 13: `EP-CLAIM-00914`
- **Patent ID:** `EP-CLAIM-00914`
- **Title:** European Patent Claim: A pharmaceutical composition comprising a compound for use as claimed in any one of claims
- **Country:** `EUROPE`
- **Source:** `EPO Patent All Claims & Authoritative EP Granted Specifications`
- **Section:** `abstract` & `claims`
- **Quality Score:** `1.0` (Garbage Ratio: `0.0`, Broken Word Ratio: `0.0`)

**Original / Docling Text Sample:**
```text
Abstract: European patent claim specification under EPC: A pharmaceutical composition comprising a compound for use as claimed in any one of claims 1 to 9 and a pharmaceutically acceptable carrier....

Claim 1: A pharmaceutical composition comprising a compound for use as claimed in any one of claims 1 to 9 and a pharmaceutically acceptable carrier.
```

**Cleaned Text Sample:**
```text
European patent claim specification under EPC: A pharmaceutical composition comprising a compound for use as claimed in any one of claims 1 to 9 and a pharmaceutically acceptable carrier....

Claim 1: A pharmaceutical composition comprising a compound for use as claimed in any one of claims 1 to 9 and a pharmaceutically acceptable carrier.

Europea...
```

**Chunked Text Sample:**
```text
European patent claim specification under EPC: A pharmaceutical composition comprising a compound for use as claimed in any one of claims 1 to 9 and a pharmaceutically acceptable carrier....
```

**Metadata:**
```json
{
  "application_number": "EP-APP-00914",
  "publication_number": "EP 2000914 A1",
  "filing_date": "2015-06-15",
  "publication_date": "2017-01-20",
  "ipc": [
    "A61K36/00",
    "A61P29/00"
  ],
  "cpc": [
    "A61K36/00"
  ],
  "applicant": "European Patent Applicant",
  "language": "en"
}
```

---

### Sample 14: `EP-CLAIM-01162`
- **Patent ID:** `EP-CLAIM-01162`
- **Title:** European Patent Claim: Method according to claim 1, characterized in that the composition of portion A is in the 
- **Country:** `EUROPE`
- **Source:** `EPO Patent All Claims & Authoritative EP Granted Specifications`
- **Section:** `abstract` & `claims`
- **Quality Score:** `1.0` (Garbage Ratio: `0.0`, Broken Word Ratio: `0.0`)

**Original / Docling Text Sample:**
```text
Abstract: European patent claim specification under EPC: Method according to claim 1, characterized in that the composition of portion A is in the form of one or more compressed tablet(s) and/or the active ingr

Claim 1: Method according to claim 1, characterized in that the composition of portion A is in the form of one or more compressed tablet(s) and/or the active ingredient composition of portion A is embedded in 
```

**Cleaned Text Sample:**
```text
European patent claim specification under EPC: Method according to claim 1, characterized in that the composition of portion A is in the form of one or more compressed tablet(s) and/or the active ingredient composition of portion A is embedded in a wax and/or embedded in a polymer and/or that the...

Claim 1: Method according to claim 1, characteri...
```

**Chunked Text Sample:**
```text
European patent claim specification under EPC: Method according to claim 1, characterized in that the composition of portion A is in the form of one or more compressed tablet(s) and/or the active ingredient composition of portion A is embedded in a wax and/or embedded in a polymer and/or that the...
```

**Metadata:**
```json
{
  "application_number": "EP-APP-01162",
  "publication_number": "EP 2001162 A1",
  "filing_date": "2015-06-15",
  "publication_date": "2017-01-20",
  "ipc": [
    "A61K36/00",
    "A61P29/00"
  ],
  "cpc": [
    "A61K36/00"
  ],
  "applicant": "European Patent Applicant",
  "language": "en"
}
```

---

### Sample 15: `EP-CLAIM-01492`
- **Patent ID:** `EP-CLAIM-01492`
- **Title:** European Patent Claim: A compound according to any one of claims 1-12, or a pharmaceutically acceptable salt, a s
- **Country:** `EUROPE`
- **Source:** `EPO Patent All Claims & Authoritative EP Granted Specifications`
- **Section:** `abstract` & `claims`
- **Quality Score:** `1.0` (Garbage Ratio: `0.0`, Broken Word Ratio: `0.0`)

**Original / Docling Text Sample:**
```text
Abstract: European patent claim specification under EPC: A compound according to any one of claims 1-12, or a pharmaceutically acceptable salt, a solvate, deuterated analog, a tautomer or a stereoisomer thereof

Claim 1: A compound according to any one of claims 1-12, or a pharmaceutically acceptable salt, a solvate, deuterated analog, a tautomer or a stereoisomer thereof, or a pharmaceutical composition according to 
```

**Cleaned Text Sample:**
```text
European patent claim specification under EPC: A compound according to any one of claims 1-12, or a pharmaceutically acceptable salt, a solvate, deuterated analog, a tautomer or a stereoisomer thereof, or a pharmaceutical composition according to any one of claims 13-15 for use in the treatment o...

Claim 1: A compound according to any one of clai...
```

**Chunked Text Sample:**
```text
European patent claim specification under EPC: A compound according to any one of claims 1-12, or a pharmaceutically acceptable salt, a solvate, deuterated analog, a tautomer or a stereoisomer thereof, or a pharmaceutical composition according to any one of claims 13-15 for use in the treatment o...
```

**Metadata:**
```json
{
  "application_number": "EP-APP-01492",
  "publication_number": "EP 2001492 A1",
  "filing_date": "2015-06-15",
  "publication_date": "2017-01-20",
  "ipc": [
    "A61K36/00",
    "A61P29/00"
  ],
  "cpc": [
    "A61K36/00"
  ],
  "applicant": "European Patent Applicant",
  "language": "en"
}
```

---

### Sample 16: `EP-CLAIM-01546`
- **Patent ID:** `EP-CLAIM-01546`
- **Title:** European Patent Claim: The composition for use according to claim 2, wherein the therapeutic composition consists
- **Country:** `EUROPE`
- **Source:** `EPO Patent All Claims & Authoritative EP Granted Specifications`
- **Section:** `abstract` & `claims`
- **Quality Score:** `1.0` (Garbage Ratio: `0.0`, Broken Word Ratio: `0.0`)

**Original / Docling Text Sample:**
```text
Abstract: European patent claim specification under EPC: The composition for use according to claim 2, wherein the therapeutic composition consists essentially of free amino acids L-lysine, L-glycine, L-threoni

Claim 1: The composition for use according to claim 2, wherein the therapeutic composition consists essentially of free amino acids L-lysine, L-glycine, L-threonine, L-valine, L-tyrosine, L-aspartic acid, L-is
```

**Cleaned Text Sample:**
```text
European patent claim specification under EPC: The composition for use according to claim 2, wherein the therapeutic composition consists essentially of free amino acids L-lysine, L-glycine, L-threonine, L-valine, L-tyrosine, L-aspartic acid, L-isoleucine, L-tryptophan, and L-serine; and optional...

Claim 1: The composition for use according to cl...
```

**Chunked Text Sample:**
```text
European patent claim specification under EPC: The composition for use according to claim 2, wherein the therapeutic composition consists essentially of free amino acids L-lysine, L-glycine, L-threonine, L-valine, L-tyrosine, L-aspartic acid, L-isoleucine, L-tryptophan, and L-serine; and optional...
```

**Metadata:**
```json
{
  "application_number": "EP-APP-01546",
  "publication_number": "EP 2001546 A1",
  "filing_date": "2015-06-15",
  "publication_date": "2017-01-20",
  "ipc": [
    "A61K36/00",
    "A61P29/00"
  ],
  "cpc": [
    "A61K36/00"
  ],
  "applicant": "European Patent Applicant",
  "language": "en"
}
```

---

### Sample 17: `EP-CLAIM-01644`
- **Patent ID:** `EP-CLAIM-01644`
- **Title:** European Patent Claim: The pharmaceutical composition for use in preventing or treating skin infections of claim 
- **Country:** `EUROPE`
- **Source:** `EPO Patent All Claims & Authoritative EP Granted Specifications`
- **Section:** `abstract` & `claims`
- **Quality Score:** `1.0` (Garbage Ratio: `0.0`, Broken Word Ratio: `0.0`)

**Original / Docling Text Sample:**
```text
Abstract: European patent claim specification under EPC: The pharmaceutical composition for use in preventing or treating skin infections of claim 1, wherein the composition is used for an animal....

Claim 1: The pharmaceutical composition for use in preventing or treating skin infections of claim 1, wherein the composition is used for an animal.
```

**Cleaned Text Sample:**
```text
European patent claim specification under EPC: The pharmaceutical composition for use in preventing or treating skin infections of claim 1, wherein the composition is used for an animal....

Claim 1: The pharmaceutical composition for use in preventing or treating skin infections of claim 1, wherein the composition is used for an animal.

European ...
```

**Chunked Text Sample:**
```text
European patent claim specification under EPC: The pharmaceutical composition for use in preventing or treating skin infections of claim 1, wherein the composition is used for an animal....
```

**Metadata:**
```json
{
  "application_number": "EP-APP-01644",
  "publication_number": "EP 2001644 A1",
  "filing_date": "2015-06-15",
  "publication_date": "2017-01-20",
  "ipc": [
    "A61K36/00",
    "A61P29/00"
  ],
  "cpc": [
    "A61K36/00"
  ],
  "applicant": "European Patent Applicant",
  "language": "en"
}
```

---

### Sample 18: `EP-CLAIM-01735`
- **Patent ID:** `EP-CLAIM-01735`
- **Title:** European Patent Claim: The method according to any one of patent claims 1 to 6, characterized in that prior to fr
- **Country:** `EUROPE`
- **Source:** `EPO Patent All Claims & Authoritative EP Granted Specifications`
- **Section:** `abstract` & `claims`
- **Quality Score:** `1.0` (Garbage Ratio: `0.0`, Broken Word Ratio: `0.0`)

**Original / Docling Text Sample:**
```text
Abstract: European patent claim specification under EPC: The method according to any one of patent claims 1 to 6, characterized in that prior to fractionation in the case of any large volume sample at first the

Claim 1: The method according to any one of patent claims 1 to 6, characterized in that prior to fractionation in the case of any large volume sample at first the total nucleic acid is concentrated according t
```

**Cleaned Text Sample:**
```text
European patent claim specification under EPC: The method according to any one of patent claims 1 to 6, characterized in that prior to fractionation in the case of any large volume sample at first the total nucleic acid is concentrated according to a known method, and subsequently the nucleic aci...

Claim 1: The method according to any one of pate...
```

**Chunked Text Sample:**
```text
European patent claim specification under EPC: The method according to any one of patent claims 1 to 6, characterized in that prior to fractionation in the case of any large volume sample at first the total nucleic acid is concentrated according to a known method, and subsequently the nucleic aci...
```

**Metadata:**
```json
{
  "application_number": "EP-APP-01735",
  "publication_number": "EP 2001735 A1",
  "filing_date": "2015-06-15",
  "publication_date": "2017-01-20",
  "ipc": [
    "A61K36/00",
    "A61P29/00"
  ],
  "cpc": [
    "A61K36/00"
  ],
  "applicant": "European Patent Applicant",
  "language": "en"
}
```

---

### Sample 19: `EP-CLAIM-01773`
- **Patent ID:** `EP-CLAIM-01773`
- **Title:** European Patent Claim: Alcoholic extract according to Claim 1 or 2, characterized in that hesperidin, nobiletin a
- **Country:** `EUROPE`
- **Source:** `EPO Patent All Claims & Authoritative EP Granted Specifications`
- **Section:** `abstract` & `claims`
- **Quality Score:** `1.0` (Garbage Ratio: `0.0`, Broken Word Ratio: `0.0`)

**Original / Docling Text Sample:**
```text
Abstract: European patent claim specification under EPC: Alcoholic extract according to Claim 1 or 2, characterized in that hesperidin, nobiletin and isosinensetin are present in a hesperidin/nobiletin/isosinen

Claim 1: Alcoholic extract according to Claim 1 or 2, characterized in that hesperidin, nobiletin and isosinensetin are present in a hesperidin/nobiletin/isosinensetin weight ratio that is between 0.5/1/1.5 an
```

**Cleaned Text Sample:**
```text
European patent claim specification under EPC: Alcoholic extract according to Claim 1 or 2, characterized in that hesperidin, nobiletin and isosinensetin are present in a hesperidin/nobiletin/isosinensetin weight ratio that is between 0.5/1/1.5 and 1.5/3/4 and is preferably 1.1/1.4/0.7....

Claim 1: Alcoholic extract according to Claim 1 or 2, char...
```

**Chunked Text Sample:**
```text
European patent claim specification under EPC: Alcoholic extract according to Claim 1 or 2, characterized in that hesperidin, nobiletin and isosinensetin are present in a hesperidin/nobiletin/isosinensetin weight ratio that is between 0.5/1/1.5 and 1.5/3/4 and is preferably 1.1/1.4/0.7....
```

**Metadata:**
```json
{
  "application_number": "EP-APP-01773",
  "publication_number": "EP 2001773 A1",
  "filing_date": "2015-06-15",
  "publication_date": "2017-01-20",
  "ipc": [
    "A61K36/00",
    "A61P29/00"
  ],
  "cpc": [
    "A61K36/00"
  ],
  "applicant": "European Patent Applicant",
  "language": "en"
}
```

---

### Sample 20: `EP-CLAIM-01797`
- **Patent ID:** `EP-CLAIM-01797`
- **Title:** European Patent Claim: A pharmaceutical composition comprising the nucleic acid of any of Claims 1 or 3 to 9, the
- **Country:** `EUROPE`
- **Source:** `EPO Patent All Claims & Authoritative EP Granted Specifications`
- **Section:** `abstract` & `claims`
- **Quality Score:** `1.0` (Garbage Ratio: `0.0`, Broken Word Ratio: `0.0`)

**Original / Docling Text Sample:**
```text
Abstract: European patent claim specification under EPC: A pharmaceutical composition comprising the nucleic acid of any of Claims 1 or 3 to 9, the vector of Claims 10 or 11, or the polypeptide of any of Claims

Claim 1: A pharmaceutical composition comprising the nucleic acid of any of Claims 1 or 3 to 9, the vector of Claims 10 or 11, or the polypeptide of any of Claims 2 to 8 or 12.
```

**Cleaned Text Sample:**
```text
European patent claim specification under EPC: A pharmaceutical composition comprising the nucleic acid of any of Claims 1 or 3 to 9, the vector of Claims 10 or 11, or the polypeptide of any of Claims 2 to 8 or 12....

Claim 1: A pharmaceutical composition comprising the nucleic acid of any of Claims 1 or 3 to 9, the vector of Claims 10 or 11, or t...
```

**Chunked Text Sample:**
```text
European patent claim specification under EPC: A pharmaceutical composition comprising the nucleic acid of any of Claims 1 or 3 to 9, the vector of Claims 10 or 11, or the polypeptide of any of Claims 2 to 8 or 12....
```

**Metadata:**
```json
{
  "application_number": "EP-APP-01797",
  "publication_number": "EP 2001797 A1",
  "filing_date": "2015-06-15",
  "publication_date": "2017-01-20",
  "ipc": [
    "A61K36/00",
    "A61P29/00"
  ],
  "cpc": [
    "A61K36/00"
  ],
  "applicant": "European Patent Applicant",
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

### Chunk Sample 16: `EUROPE-CHK-0000-fcef73b9`
- **Patent ID:** `EP-CLAIM-00090`
- **Title:** European Patent Claim: The pharmaceutical composition according to claim 12, which is a cell growth inhibitor
- **Country:** `EUROPE`
- **Source:** `EPO Patent All Claims & Authoritative EP Granted Specifications`
- **Section:** `abstract`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `24`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
European patent claim specification under EPC: The pharmaceutical composition according to claim 12, which is a cell growth inhibitor....
```

### Chunk Sample 17: `EUROPE-CHK-0001-71f86b73`
- **Patent ID:** `EP-CLAIM-00090`
- **Title:** European Patent Claim: The pharmaceutical composition according to claim 12, which is a cell growth inhibitor
- **Country:** `EUROPE`
- **Source:** `EPO Patent All Claims & Authoritative EP Granted Specifications`
- **Section:** `claims`
- **Claim Number:** `1`
- **Estimated Tokens:** `19`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
Claim 1: The pharmaceutical composition according to claim 12, which is a cell growth inhibitor.
```

### Chunk Sample 18: `EUROPE-CHK-0002-bb00c41e`
- **Patent ID:** `EP-CLAIM-00090`
- **Title:** European Patent Claim: The pharmaceutical composition according to claim 12, which is a cell growth inhibitor
- **Country:** `EUROPE`
- **Source:** `EPO Patent All Claims & Authoritative EP Granted Specifications`
- **Section:** `description`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `44`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
European Patent Office (EPO) published claim record under EPC Article 69:

The pharmaceutical composition according to claim 12, which is a cell growth inhibitor.

Evaluated for therapeutic and medicinal formulation relevance under SIH 26045.
```

### Chunk Sample 19: `EUROPE-CHK-0000-031997c5`
- **Patent ID:** `EP-CLAIM-00223`
- **Title:** European Patent Claim: The pharmaceutical composition according to claim 1, wherein the increased amount of the c
- **Country:** `EUROPE`
- **Source:** `EPO Patent All Claims & Authoritative EP Granted Specifications`
- **Section:** `abstract`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `57`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
European patent claim specification under EPC: The pharmaceutical composition according to claim 1, wherein the increased amount of the compound represented by formula (III) in said pharmaceutical composition is less than 0.05 %, and the increased amount of the compound represented by formula (IV...
```

### Chunk Sample 20: `EUROPE-CHK-0001-62eb9af4`
- **Patent ID:** `EP-CLAIM-00223`
- **Title:** European Patent Claim: The pharmaceutical composition according to claim 1, wherein the increased amount of the c
- **Country:** `EUROPE`
- **Source:** `EPO Patent All Claims & Authoritative EP Granted Specifications`
- **Section:** `claims`
- **Claim Number:** `1`
- **Estimated Tokens:** `78`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
Claim 1: The pharmaceutical composition according to claim 1, wherein the increased amount of the compound represented by formula (III) in said pharmaceutical composition is less than 0.05 %, and the increased amount of the compound represented by formula (IV) in said pharmaceutical composition is less than 0.05 % from the start of storage under 25°C for two weeks storage.
```

### Chunk Sample 21: `EUROPE-CHK-0002-07d7a8b3`
- **Patent ID:** `EP-CLAIM-00223`
- **Title:** European Patent Claim: The pharmaceutical composition according to claim 1, wherein the increased amount of the c
- **Country:** `EUROPE`
- **Source:** `EPO Patent All Claims & Authoritative EP Granted Specifications`
- **Section:** `description`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `102`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
European Patent Office (EPO) published claim record under EPC Article 69:

The pharmaceutical composition according to claim 1, wherein the increased amount of the compound represented by formula (III) in said pharmaceutical composition is less than 0.05 %, and the increased amount of the compound represented by formula (IV) in said pharmaceutical composition is less than 0.05 % from the start of 
... [TRUNCATED FOR INSPECTION PREVIEW] ...
```

### Chunk Sample 22: `EUROPE-CHK-0000-6718b4d0`
- **Patent ID:** `EP-CLAIM-00508`
- **Title:** European Patent Claim: The pharmaceutical composition of claim 13, further comprising a pharmaceutically acceptab
- **Country:** `EUROPE`
- **Source:** `EPO Patent All Claims & Authoritative EP Granted Specifications`
- **Section:** `abstract`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `35`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
European patent claim specification under EPC: The pharmaceutical composition of claim 13, further comprising a pharmaceutically acceptable carrier wherein the pharmaceutically acceptable carrier is a lipid formulation....
```

### Chunk Sample 23: `EUROPE-CHK-0001-4c6873d9`
- **Patent ID:** `EP-CLAIM-00508`
- **Title:** European Patent Claim: The pharmaceutical composition of claim 13, further comprising a pharmaceutically acceptab
- **Country:** `EUROPE`
- **Source:** `EPO Patent All Claims & Authoritative EP Granted Specifications`
- **Section:** `claims`
- **Claim Number:** `1`
- **Estimated Tokens:** `29`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
Claim 1: The pharmaceutical composition of claim 13, further comprising a pharmaceutically acceptable carrier wherein the pharmaceutically acceptable carrier is a lipid formulation.
```

### Chunk Sample 24: `EUROPE-CHK-0002-9143bc2c`
- **Patent ID:** `EP-CLAIM-00508`
- **Title:** European Patent Claim: The pharmaceutical composition of claim 13, further comprising a pharmaceutically acceptab
- **Country:** `EUROPE`
- **Source:** `EPO Patent All Claims & Authoritative EP Granted Specifications`
- **Section:** `description`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `54`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
European Patent Office (EPO) published claim record under EPC Article 69:

The pharmaceutical composition of claim 13, further comprising a pharmaceutically acceptable carrier wherein the pharmaceutically acceptable carrier is a lipid formulation.

Evaluated for therapeutic and medicinal formulation relevance under SIH 26045.
```

### Chunk Sample 25: `EUROPE-CHK-0000-87586738`
- **Patent ID:** `EP-CLAIM-00615`
- **Title:** European Patent Claim: A compressed tablet, according to any of the previous claims, which comprises more than 80
- **Country:** `EUROPE`
- **Source:** `EPO Patent All Claims & Authoritative EP Granted Specifications`
- **Section:** `abstract`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `49`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
European patent claim specification under EPC: A compressed tablet, according to any of the previous claims, which comprises more than 80% sucroferric oxyhydroxide of the total weight of the pharmaceutical composition (by weight on a dry weight basis)....
```

### Chunk Sample 26: `EUROPE-CHK-0001-240376e3`
- **Patent ID:** `EP-CLAIM-00615`
- **Title:** European Patent Claim: A compressed tablet, according to any of the previous claims, which comprises more than 80
- **Country:** `EUROPE`
- **Source:** `EPO Patent All Claims & Authoritative EP Granted Specifications`
- **Section:** `claims`
- **Claim Number:** `1`
- **Estimated Tokens:** `44`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
Claim 1: A compressed tablet, according to any of the previous claims, which comprises more than 80% sucroferric oxyhydroxide of the total weight of the pharmaceutical composition (by weight on a dry weight basis).
```

### Chunk Sample 27: `EUROPE-CHK-0002-7d4f054c`
- **Patent ID:** `EP-CLAIM-00615`
- **Title:** European Patent Claim: A compressed tablet, according to any of the previous claims, which comprises more than 80
- **Country:** `EUROPE`
- **Source:** `EPO Patent All Claims & Authoritative EP Granted Specifications`
- **Section:** `description`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `68`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
European Patent Office (EPO) published claim record under EPC Article 69:

A compressed tablet, according to any of the previous claims, which comprises more than 80% sucroferric oxyhydroxide of the total weight of the pharmaceutical composition (by weight on a dry weight basis).

Evaluated for therapeutic and medicinal formulation relevance under SIH 26045.
```

### Chunk Sample 28: `EUROPE-CHK-0000-6caeecfa`
- **Patent ID:** `EP-CLAIM-00654`
- **Title:** European Patent Claim: The pre-filled syringe or autoinjector according to any one of claims 15 or 17 to 19 or th
- **Country:** `EUROPE`
- **Source:** `EPO Patent All Claims & Authoritative EP Granted Specifications`
- **Section:** `abstract`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `63`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
European patent claim specification under EPC: The pre-filled syringe or autoinjector according to any one of claims 15 or 17 to 19 or the pharmaceutical composition for use according to any one of claims 16 to 19, wherein the anti-CGRP receptor antibody comprises a heavy chain variable region (V...
```

### Chunk Sample 29: `EUROPE-CHK-0001-8f9f21ec`
- **Patent ID:** `EP-CLAIM-00654`
- **Title:** European Patent Claim: The pre-filled syringe or autoinjector according to any one of claims 15 or 17 to 19 or th
- **Country:** `EUROPE`
- **Source:** `EPO Patent All Claims & Authoritative EP Granted Specifications`
- **Section:** `claims`
- **Claim Number:** `1`
- **Estimated Tokens:** `91`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
Claim 1: The pre-filled syringe or autoinjector according to any one of claims 15 or 17 to 19 or the pharmaceutical composition for use according to any one of claims 16 to 19, wherein the anti-CGRP receptor antibody comprises a heavy chain variable region (V H ) comprising the sequence of SEQ ID NO:92, and a light chain variable region (V L ) comprising the sequence of SEQ ID NO:80.
```

### Chunk Sample 30: `EUROPE-CHK-0002-8151b595`
- **Patent ID:** `EP-CLAIM-00654`
- **Title:** European Patent Claim: The pre-filled syringe or autoinjector according to any one of claims 15 or 17 to 19 or th
- **Country:** `EUROPE`
- **Source:** `EPO Patent All Claims & Authoritative EP Granted Specifications`
- **Section:** `description`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `115`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
European Patent Office (EPO) published claim record under EPC Article 69:

The pre-filled syringe or autoinjector according to any one of claims 15 or 17 to 19 or the pharmaceutical composition for use according to any one of claims 16 to 19, wherein the anti-CGRP receptor antibody comprises a heavy chain variable region (V H ) comprising the sequence of SEQ ID NO:92, and a light chain variable re
... [TRUNCATED FOR INSPECTION PREVIEW] ...
```

### Chunk Sample 31: `EUROPE-CHK-0000-3a5ffb28`
- **Patent ID:** `EP-CLAIM-00660`
- **Title:** European Patent Claim: The pharmaceutical composition of claim 1 or 2, wherein the bacterium further comprises a 
- **Country:** `EUROPE`
- **Source:** `EPO Patent All Claims & Authoritative EP Granted Specifications`
- **Section:** `abstract`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `45`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
European patent claim specification under EPC: The pharmaceutical composition of claim 1 or 2, wherein the bacterium further comprises a genetic modification that reduces endogenous biosynthesis of a branched chain amino acid in the bacterium....
```

### Chunk Sample 32: `EUROPE-CHK-0001-80d069b1`
- **Patent ID:** `EP-CLAIM-00660`
- **Title:** European Patent Claim: The pharmaceutical composition of claim 1 or 2, wherein the bacterium further comprises a 
- **Country:** `EUROPE`
- **Source:** `EPO Patent All Claims & Authoritative EP Granted Specifications`
- **Section:** `claims`
- **Claim Number:** `1`
- **Estimated Tokens:** `40`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
Claim 1: The pharmaceutical composition of claim 1 or 2, wherein the bacterium further comprises a genetic modification that reduces endogenous biosynthesis of a branched chain amino acid in the bacterium.
```

### Chunk Sample 33: `EUROPE-CHK-0002-ddfde02f`
- **Patent ID:** `EP-CLAIM-00660`
- **Title:** European Patent Claim: The pharmaceutical composition of claim 1 or 2, wherein the bacterium further comprises a 
- **Country:** `EUROPE`
- **Source:** `EPO Patent All Claims & Authoritative EP Granted Specifications`
- **Section:** `description`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `65`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
European Patent Office (EPO) published claim record under EPC Article 69:

The pharmaceutical composition of claim 1 or 2, wherein the bacterium further comprises a genetic modification that reduces endogenous biosynthesis of a branched chain amino acid in the bacterium.

Evaluated for therapeutic and medicinal formulation relevance under SIH 26045.
```

### Chunk Sample 34: `EUROPE-CHK-0000-dbad6276`
- **Patent ID:** `EP-CLAIM-00792`
- **Title:** European Patent Claim: A pharmaceutical composition comprising at least one compound according to any one of clai
- **Country:** `EUROPE`
- **Source:** `EPO Patent All Claims & Authoritative EP Granted Specifications`
- **Section:** `abstract`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `39`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
European patent claim specification under EPC: A pharmaceutical composition comprising at least one compound according to any one of claims 1 to 9 or a conjugate according to claim 11....
```

### Chunk Sample 35: `EUROPE-CHK-0001-e6f95acb`
- **Patent ID:** `EP-CLAIM-00792`
- **Title:** European Patent Claim: A pharmaceutical composition comprising at least one compound according to any one of clai
- **Country:** `EUROPE`
- **Source:** `EPO Patent All Claims & Authoritative EP Granted Specifications`
- **Section:** `claims`
- **Claim Number:** `1`
- **Estimated Tokens:** `33`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
Claim 1: A pharmaceutical composition comprising at least one compound according to any one of claims 1 to 9 or a conjugate according to claim 11.
```

### Chunk Sample 36: `EUROPE-CHK-0002-bec31587`
- **Patent ID:** `EP-CLAIM-00792`
- **Title:** European Patent Claim: A pharmaceutical composition comprising at least one compound according to any one of clai
- **Country:** `EUROPE`
- **Source:** `EPO Patent All Claims & Authoritative EP Granted Specifications`
- **Section:** `description`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `58`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
European Patent Office (EPO) published claim record under EPC Article 69:

A pharmaceutical composition comprising at least one compound according to any one of claims 1 to 9 or a conjugate according to claim 11.

Evaluated for therapeutic and medicinal formulation relevance under SIH 26045.
```

### Chunk Sample 37: `EUROPE-CHK-0000-2b007028`
- **Patent ID:** `EP-CLAIM-00914`
- **Title:** European Patent Claim: A pharmaceutical composition comprising a compound for use as claimed in any one of claims
- **Country:** `EUROPE`
- **Source:** `EPO Patent All Claims & Authoritative EP Granted Specifications`
- **Section:** `abstract`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `37`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
European patent claim specification under EPC: A pharmaceutical composition comprising a compound for use as claimed in any one of claims 1 to 9 and a pharmaceutically acceptable carrier....
```

### Chunk Sample 38: `EUROPE-CHK-0001-bd4d5c47`
- **Patent ID:** `EP-CLAIM-00914`
- **Title:** European Patent Claim: A pharmaceutical composition comprising a compound for use as claimed in any one of claims
- **Country:** `EUROPE`
- **Source:** `EPO Patent All Claims & Authoritative EP Granted Specifications`
- **Section:** `claims`
- **Claim Number:** `1`
- **Estimated Tokens:** `32`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
Claim 1: A pharmaceutical composition comprising a compound for use as claimed in any one of claims 1 to 9 and a pharmaceutically acceptable carrier.
```

### Chunk Sample 39: `EUROPE-CHK-0002-9bf04368`
- **Patent ID:** `EP-CLAIM-00914`
- **Title:** European Patent Claim: A pharmaceutical composition comprising a compound for use as claimed in any one of claims
- **Country:** `EUROPE`
- **Source:** `EPO Patent All Claims & Authoritative EP Granted Specifications`
- **Section:** `description`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `57`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
European Patent Office (EPO) published claim record under EPC Article 69:

A pharmaceutical composition comprising a compound for use as claimed in any one of claims 1 to 9 and a pharmaceutically acceptable carrier.

Evaluated for therapeutic and medicinal formulation relevance under SIH 26045.
```

### Chunk Sample 40: `EUROPE-CHK-0000-324e5b48`
- **Patent ID:** `EP-CLAIM-01162`
- **Title:** European Patent Claim: Method according to claim 1, characterized in that the composition of portion A is in the 
- **Country:** `EUROPE`
- **Source:** `EPO Patent All Claims & Authoritative EP Granted Specifications`
- **Section:** `abstract`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `65`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
European patent claim specification under EPC: Method according to claim 1, characterized in that the composition of portion A is in the form of one or more compressed tablet(s) and/or the active ingredient composition of portion A is embedded in a wax and/or embedded in a polymer and/or that the...
```

### Chunk Sample 41: `EUROPE-CHK-0001-68dab627`
- **Patent ID:** `EP-CLAIM-01162`
- **Title:** European Patent Claim: Method according to claim 1, characterized in that the composition of portion A is in the 
- **Country:** `EUROPE`
- **Source:** `EPO Patent All Claims & Authoritative EP Granted Specifications`
- **Section:** `claims`
- **Claim Number:** `1`
- **Estimated Tokens:** `67`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
Claim 1: Method according to claim 1, characterized in that the composition of portion A is in the form of one or more compressed tablet(s) and/or the active ingredient composition of portion A is embedded in a wax and/or embedded in a polymer and/or that the composition of portion B is non-compressed.
```

### Chunk Sample 42: `EUROPE-CHK-0002-d768bc6c`
- **Patent ID:** `EP-CLAIM-01162`
- **Title:** European Patent Claim: Method according to claim 1, characterized in that the composition of portion A is in the 
- **Country:** `EUROPE`
- **Source:** `EPO Patent All Claims & Authoritative EP Granted Specifications`
- **Section:** `description`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `92`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
European Patent Office (EPO) published claim record under EPC Article 69:

Method according to claim 1, characterized in that the composition of portion A is in the form of one or more compressed tablet(s) and/or the active ingredient composition of portion A is embedded in a wax and/or embedded in a polymer and/or that the composition of portion B is non-compressed.

Evaluated for therapeutic and
... [TRUNCATED FOR INSPECTION PREVIEW] ...
```

### Chunk Sample 43: `EUROPE-CHK-0000-f08df468`
- **Patent ID:** `EP-CLAIM-01492`
- **Title:** European Patent Claim: A compound according to any one of claims 1-12, or a pharmaceutically acceptable salt, a s
- **Country:** `EUROPE`
- **Source:** `EPO Patent All Claims & Authoritative EP Granted Specifications`
- **Section:** `abstract`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `61`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
European patent claim specification under EPC: A compound according to any one of claims 1-12, or a pharmaceutically acceptable salt, a solvate, deuterated analog, a tautomer or a stereoisomer thereof, or a pharmaceutical composition according to any one of claims 13-15 for use in the treatment o...
```

### Chunk Sample 44: `EUROPE-CHK-0001-cc5fb9e2`
- **Patent ID:** `EP-CLAIM-01492`
- **Title:** European Patent Claim: A compound according to any one of claims 1-12, or a pharmaceutically acceptable salt, a s
- **Country:** `EUROPE`
- **Source:** `EPO Patent All Claims & Authoritative EP Granted Specifications`
- **Section:** `claims`
- **Claim Number:** `1`
- **Estimated Tokens:** `328`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
Claim 1: A compound according to any one of claims 1-12, or a pharmaceutically acceptable salt, a solvate, deuterated analog, a tautomer or a stereoisomer thereof, or a pharmaceutical composition according to any one of claims 13-15 for use in the treatment of acute myeloid leukemia, stem cell ablation and myelopreparation for stem cell transplant, primary progressive multiple sclerosis, complex r
... [TRUNCATED FOR INSPECTION PREVIEW] ...
```

### Chunk Sample 45: `EUROPE-CHK-0002-eb1e7d3b`
- **Patent ID:** `EP-CLAIM-01492`
- **Title:** European Patent Claim: A compound according to any one of claims 1-12, or a pharmaceutically acceptable salt, a s
- **Country:** `EUROPE`
- **Source:** `EPO Patent All Claims & Authoritative EP Granted Specifications`
- **Section:** `description`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `353`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
European Patent Office (EPO) published claim record under EPC Article 69:

A compound according to any one of claims 1-12, or a pharmaceutically acceptable salt, a solvate, deuterated analog, a tautomer or a stereoisomer thereof, or a pharmaceutical composition according to any one of claims 13-15 for use in the treatment of acute myeloid leukemia, stem cell ablation and myelopreparation for stem 
... [TRUNCATED FOR INSPECTION PREVIEW] ...
```

### Chunk Sample 46: `EUROPE-CHK-0000-0fe0c294`
- **Patent ID:** `EP-CLAIM-01546`
- **Title:** European Patent Claim: The composition for use according to claim 2, wherein the therapeutic composition consists
- **Country:** `EUROPE`
- **Source:** `EPO Patent All Claims & Authoritative EP Granted Specifications`
- **Section:** `abstract`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `48`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
European patent claim specification under EPC: The composition for use according to claim 2, wherein the therapeutic composition consists essentially of free amino acids L-lysine, L-glycine, L-threonine, L-valine, L-tyrosine, L-aspartic acid, L-isoleucine, L-tryptophan, and L-serine; and optional...
```

### Chunk Sample 47: `EUROPE-CHK-0001-fe8e90b1`
- **Patent ID:** `EP-CLAIM-01546`
- **Title:** European Patent Claim: The composition for use according to claim 2, wherein the therapeutic composition consists
- **Country:** `EUROPE`
- **Source:** `EPO Patent All Claims & Authoritative EP Granted Specifications`
- **Section:** `claims`
- **Claim Number:** `1`
- **Estimated Tokens:** `54`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
Claim 1: The composition for use according to claim 2, wherein the therapeutic composition consists essentially of free amino acids L-lysine, L-glycine, L-threonine, L-valine, L-tyrosine, L-aspartic acid, L-isoleucine, L-tryptophan, and L-serine; and optionally, therapeutically acceptable carriers, electrolytes, buffering agents, and flavoring agents.
```

### Chunk Sample 48: `EUROPE-CHK-0002-de7126a2`
- **Patent ID:** `EP-CLAIM-01546`
- **Title:** European Patent Claim: The composition for use according to claim 2, wherein the therapeutic composition consists
- **Country:** `EUROPE`
- **Source:** `EPO Patent All Claims & Authoritative EP Granted Specifications`
- **Section:** `description`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `79`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
European Patent Office (EPO) published claim record under EPC Article 69:

The composition for use according to claim 2, wherein the therapeutic composition consists essentially of free amino acids L-lysine, L-glycine, L-threonine, L-valine, L-tyrosine, L-aspartic acid, L-isoleucine, L-tryptophan, and L-serine; and optionally, therapeutically acceptable carriers, electrolytes, buffering agents, an
... [TRUNCATED FOR INSPECTION PREVIEW] ...
```

### Chunk Sample 49: `EUROPE-CHK-0000-913fc291`
- **Patent ID:** `EP-CLAIM-01644`
- **Title:** European Patent Claim: The pharmaceutical composition for use in preventing or treating skin infections of claim 
- **Country:** `EUROPE`
- **Source:** `EPO Patent All Claims & Authoritative EP Granted Specifications`
- **Section:** `abstract`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `36`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
European patent claim specification under EPC: The pharmaceutical composition for use in preventing or treating skin infections of claim 1, wherein the composition is used for an animal....
```

### Chunk Sample 50: `EUROPE-CHK-0001-0451d2a3`
- **Patent ID:** `EP-CLAIM-01644`
- **Title:** European Patent Claim: The pharmaceutical composition for use in preventing or treating skin infections of claim 
- **Country:** `EUROPE`
- **Source:** `EPO Patent All Claims & Authoritative EP Granted Specifications`
- **Section:** `claims`
- **Claim Number:** `1`
- **Estimated Tokens:** `31`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
Claim 1: The pharmaceutical composition for use in preventing or treating skin infections of claim 1, wherein the composition is used for an animal.
```
