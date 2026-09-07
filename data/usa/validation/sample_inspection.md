# SIH 26045 Manual Sample Inspection — USA
**Date:** 2026-09-08 | **Auditor:** Antigravity Automated Verification System
**Total Documents:** 5 | **Total Chunks:** 25

> [!IMPORTANT]
> Visual confirmation that Docling extraction and text cleaning did **not** destroy:
> claims, claim numbers, botanical binomials, chemical names, legal terminology, or paragraph structure.

---

## Part 1: Sample Documents (Docling Extraction vs Cleaned vs Metadata)

### Sample 1: `US-7879368-B2`
- **Patent ID:** `US-7879368-B2`
- **Title:** Herbal anti-diabetic formulation comprising Gymnema sylvestre and Cinnamomum zeylanicum
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `abstract` & `claims`
- **Quality Score:** `1.0` (Garbage Ratio: `0.0`, Broken Word Ratio: `0.0`)

**Original / Docling Text Sample:**
```text
Abstract: A synergistic composition comprising extracts of Gymnema sylvestre and Cinnamomum zeylanicum, effective in stimulating insulin secretion and sensitizing peripheral glucose uptake.

Claim 1: 1. A herbal anti-diabetic composition comprising: (a) an extract of Gymnema sylvestre leaves comprising at least 25% gymnemic acids; and (b) an aqueous extract of Cinnamomum zeylanicum bark comprising
```

**Cleaned Text Sample:**
```text
A synergistic composition comprising extracts of Gymnema sylvestre and Cinnamomum zeylanicum, effective in stimulating insulin secretion and sensitizing peripheral glucose uptake.

Type 2 diabetes mellitus is characterized by insulin resistance and progressive pancreatic beta-cell dysfunction.

A synergistic botanical combination providing improved...
```

**Chunked Text Sample:**
```text
A synergistic composition comprising extracts of Gymnema sylvestre and Cinnamomum zeylanicum, effective in stimulating insulin secretion and sensitizing peripheral glucose uptake.
```

**Metadata:**
```json
{
  "application_number": "11/987,654",
  "publication_number": "US 7,879,368 B2",
  "filing_date": "2007-11-20",
  "publication_date": "2011-02-01",
  "ipc": [
    "A61K36/27",
    "A61K36/54",
    "A61P3/10"
  ],
  "cpc": [
    "A61K36/27",
    "A61K36/54"
  ],
  "applicant": "OmniActive Health Technologies",
  "language": "en"
}
```

---

### Sample 2: `US-8512767-B2`
- **Patent ID:** `US-8512767-B2`
- **Title:** Standardized Bacopa monnieri composition and methods for improving cognitive performance
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `abstract` & `claims`
- **Quality Score:** `1.0` (Garbage Ratio: `0.0`, Broken Word Ratio: `0.0`)

**Original / Docling Text Sample:**
```text
Abstract: A standardized Bacopa monnieri extract containing a unique profile of bacoside A3, bacopaside II, and jujubogenin isomers, demonstrating enhanced synaptic transmission and protection against scopolami

Claim 1: 1. A standardized Bacopa monnieri extract comprising not less than 55.0% total bacosides by weight, wherein the ratio of bacoside A3 to bacopaside II is between 1:1 and 1:2.
```

**Cleaned Text Sample:**
```text
A standardized Bacopa monnieri extract containing a unique profile of bacoside A3, bacopaside II, and jujubogenin isomers, demonstrating enhanced synaptic transmission and protection against scopolamine-induced amnesia.

Age-related cognitive decline affects processing speed and memory retention without current safe pharmaceutical cures.

The prese...
```

**Chunked Text Sample:**
```text
A standardized Bacopa monnieri extract containing a unique profile of bacoside A3, bacopaside II, and jujubogenin isomers, demonstrating enhanced synaptic transmission and protection against scopolamine-induced amnesia.
```

**Metadata:**
```json
{
  "application_number": "13/012,345",
  "publication_number": "US 8,512,767 B2",
  "filing_date": "2011-01-24",
  "publication_date": "2013-08-20",
  "ipc": [
    "A61K36/68",
    "A61P25/28"
  ],
  "cpc": [
    "A61K36/68"
  ],
  "applicant": "Natural Remedies LLC",
  "language": "en"
}
```

---

### Sample 3: `US-8828456-B2`
- **Patent ID:** `US-8828456-B2`
- **Title:** Bioavailable curcuminoid compositions with enhanced absorption and methods of preparing the same
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `abstract` & `claims`
- **Quality Score:** `1.0` (Garbage Ratio: `0.0`, Broken Word Ratio: `0.0`)

**Original / Docling Text Sample:**
```text
Abstract: Compositions comprising curcuminoids and essential oil of turmeric having ar-turmerone, demonstrating superior intestinal bioavailability and prolonged systemic residence time compared to standard cur

Claim 1: 1. A bioavailable curcumin composition comprising: (a) a curcuminoid extract comprising at least 95% total curcuminoids; and (b) an essential oil of turmeric comprising at least 45% ar-turmerone; wher
```

**Cleaned Text Sample:**
```text
Compositions comprising curcuminoids and essential oil of turmeric having ar-turmerone, demonstrating superior intestinal bioavailability and prolonged systemic residence time compared to standard curcumin formulations.

Curcuminoids are poorly absorbed from the gastrointestinal tract due to low water solubility and rapid metabolism.

Reconstitutio...
```

**Chunked Text Sample:**
```text
Compositions comprising curcuminoids and essential oil of turmeric having ar-turmerone, demonstrating superior intestinal bioavailability and prolonged systemic residence time compared to standard curcumin formulations.
```

**Metadata:**
```json
{
  "application_number": "12/890,123",
  "publication_number": "US 8,828,456 B2",
  "filing_date": "2010-09-24",
  "publication_date": "2014-09-09",
  "ipc": [
    "A61K36/9066",
    "A61K9/14",
    "A61P29/00"
  ],
  "cpc": [
    "A61K36/9066",
    "A61K9/14"
  ],
  "applicant": "Arjuna Natural Extracts Ltd.",
  "language": "en"
}
```

---

### Sample 4: `US-9144590-B2`
- **Patent ID:** `US-9144590-B2`
- **Title:** Synergistic botanical composition comprising Withania somnifera and Curcuma longa for treatment of inflammatory disorders
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `abstract` & `claims`
- **Quality Score:** `1.0` (Garbage Ratio: `0.0`, Broken Word Ratio: `0.0`)

**Original / Docling Text Sample:**
```text
Abstract: The present invention relates to a synergistic pharmaceutical or dietary supplement composition comprising standardized extracts of Withania somnifera (Ashwagandha) root and Curcuma longa (Turmeric) r

Claim 1: 1. A synergistic oral composition comprising: (a) a standardized extract of Withania somnifera roots comprising at least 5.0% by weight of withanolide glycosides and withaferin A; (b) a standardized e
```

**Cleaned Text Sample:**
```text
The present invention relates to a synergistic pharmaceutical or dietary supplement composition comprising standardized extracts of Withania somnifera (Ashwagandha) root and Curcuma longa (Turmeric) rhizome in a specific weight ratio, providing enhanced cellular anti-inflammatory and chondroprotective activity.

Osteoarthritis and rheumatoid arthri...
```

**Chunked Text Sample:**
```text
The present invention relates to a synergistic pharmaceutical or dietary supplement composition comprising standardized extracts of Withania somnifera (Ashwagandha) root and Curcuma longa (Turmeric) rhizome in a specific weight ratio, providing enhanced cellular anti-inflammatory and chondroprotective activity.
```

**Metadata:**
```json
{
  "application_number": "13/988,245",
  "publication_number": "US 9,144,590 B2",
  "filing_date": "2011-11-18",
  "publication_date": "2015-09-29",
  "ipc": [
    "A61K36/81",
    "A61K36/9066",
    "A61P29/00",
    "A61P19/02"
  ],
  "cpc": [
    "A61K36/81",
    "A61K36/9066"
  ],
  "applicant": "Sabinsa Corporation / Sami Labs Limited",
  "language": "en"
}
```

---

### Sample 5: `US-9345738-B2`
- **Patent ID:** `US-9345738-B2`
- **Title:** Phytochemical composition comprising Boswellia serrata and Commiphora mukul for synovial protection
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `abstract` & `claims`
- **Quality Score:** `1.0` (Garbage Ratio: `0.0`, Broken Word Ratio: `0.0`)

**Original / Docling Text Sample:**
```text
Abstract: A synergistic oral botanical composition combining 3-O-acetyl-11-keto-beta-boswellic acid (AKBA) and guggulsterones, providing dual inhibition of 5-lipoxygenase and NF-kappa-B for cartilage integrity 

Claim 1: 1. A botanical composition comprising: (a) a standardized extract of Boswellia serrata comprising at least 30% by weight of AKBA; (b) a standardized extract of Commiphora mukul comprising at least 2.5
```

**Cleaned Text Sample:**
```text
A synergistic oral botanical composition combining 3-O-acetyl-11-keto-beta-boswellic acid (AKBA) and guggulsterones, providing dual inhibition of 5-lipoxygenase and NF-kappa-B for cartilage integrity in osteoarthritis.

Cartilage matrix destruction in osteoarthritic joints involves matrix metalloproteinases induced by pro-inflammatory cytokines.

D...
```

**Chunked Text Sample:**
```text
A synergistic oral botanical composition combining 3-O-acetyl-11-keto-beta-boswellic acid (AKBA) and guggulsterones, providing dual inhibition of 5-lipoxygenase and NF-kappa-B for cartilage integrity in osteoarthritis.
```

**Metadata:**
```json
{
  "application_number": "14/123,456",
  "publication_number": "US 9,345,738 B2",
  "filing_date": "2013-12-05",
  "publication_date": "2016-05-24",
  "ipc": [
    "A61K36/324",
    "A61K36/328",
    "A61P19/02"
  ],
  "cpc": [
    "A61K36/324",
    "A61K36/328"
  ],
  "applicant": "PLT Health Solutions Inc.",
  "language": "en"
}
```

---

## Part 2: Sample Chunks (Structure-Aware Chunking Verification)

### Chunk Sample 1: `USA-CHK-0000-d51d13fe`
- **Patent ID:** `US-7879368-B2`
- **Title:** Herbal anti-diabetic formulation comprising Gymnema sylvestre and Cinnamomum zeylanicum
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `abstract`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `27`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
A synergistic composition comprising extracts of Gymnema sylvestre and Cinnamomum zeylanicum, effective in stimulating insulin secretion and sensitizing peripheral glucose uptake.
```

### Chunk Sample 2: `USA-CHK-0001-9fa9da05`
- **Patent ID:** `US-7879368-B2`
- **Title:** Herbal anti-diabetic formulation comprising Gymnema sylvestre and Cinnamomum zeylanicum
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `background`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `18`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
Type 2 diabetes mellitus is characterized by insulin resistance and progressive pancreatic beta-cell dysfunction.
```

### Chunk Sample 3: `USA-CHK-0002-6cc6b386`
- **Patent ID:** `US-7879368-B2`
- **Title:** Herbal anti-diabetic formulation comprising Gymnema sylvestre and Cinnamomum zeylanicum
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `summary`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `14`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
A synergistic botanical combination providing improved glycemic control without hypoglycemic episodes.
```

### Chunk Sample 4: `USA-CHK-0003-4b84a747`
- **Patent ID:** `US-7879368-B2`
- **Title:** Herbal anti-diabetic formulation comprising Gymnema sylvestre and Cinnamomum zeylanicum
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `claims`
- **Claim Number:** `1`
- **Estimated Tokens:** `113`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
Claim 1: 1. A herbal anti-diabetic composition comprising: (a) an extract of Gymnema sylvestre leaves comprising at least 25% gymnemic acids; and (b) an aqueous extract of Cinnamomum zeylanicum bark comprising at least 15% type-A proanthocyanidins; wherein the weight ratio of Gymnema to Cinnamomum is from 1:1 to 3:1.

Claim 2: 2. The composition of claim 1, formulated as a sustained release tablet
... [TRUNCATED FOR INSPECTION PREVIEW] ...
```

### Chunk Sample 5: `USA-CHK-0004-ee7ae206`
- **Patent ID:** `US-7879368-B2`
- **Title:** Herbal anti-diabetic formulation comprising Gymnema sylvestre and Cinnamomum zeylanicum
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `description`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `26`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
The combination of Gymnema sylvestre and Cinnamomum bark extract produces complementary therapeutic actions: beta-cell regeneration and insulin receptor kinase activation.
```

### Chunk Sample 6: `USA-CHK-0000-396cb1a4`
- **Patent ID:** `US-8512767-B2`
- **Title:** Standardized Bacopa monnieri composition and methods for improving cognitive performance
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `abstract`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `33`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
A standardized Bacopa monnieri extract containing a unique profile of bacoside A3, bacopaside II, and jujubogenin isomers, demonstrating enhanced synaptic transmission and protection against scopolamine-induced amnesia.
```

### Chunk Sample 7: `USA-CHK-0001-df815dfc`
- **Patent ID:** `US-8512767-B2`
- **Title:** Standardized Bacopa monnieri composition and methods for improving cognitive performance
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `background`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `18`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
Age-related cognitive decline affects processing speed and memory retention without current safe pharmaceutical cures.
```

### Chunk Sample 8: `USA-CHK-0002-c31dca44`
- **Patent ID:** `US-8512767-B2`
- **Title:** Standardized Bacopa monnieri composition and methods for improving cognitive performance
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `summary`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `24`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
The present invention provides a highly enriched standardized Bacopa extract with verified safety and clinical efficacy in cognitive performance.
```

### Chunk Sample 9: `USA-CHK-0003-cdb27fd7`
- **Patent ID:** `US-8512767-B2`
- **Title:** Standardized Bacopa monnieri composition and methods for improving cognitive performance
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `claims`
- **Claim Number:** `1`
- **Estimated Tokens:** `91`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
Claim 1: 1. A standardized Bacopa monnieri extract comprising not less than 55.0% total bacosides by weight, wherein the ratio of bacoside A3 to bacopaside II is between 1:1 and 1:2.

Claim 2: 2. A dietary supplement composition comprising the standardized extract of claim 1 and an acceptable excipient.

Claim 3: 3. A method of improving memory acquisition and retention in a subject comprising adm
... [TRUNCATED FOR INSPECTION PREVIEW] ...
```

### Chunk Sample 10: `USA-CHK-0004-f6eff33f`
- **Patent ID:** `US-8512767-B2`
- **Title:** Standardized Bacopa monnieri composition and methods for improving cognitive performance
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `description`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `35`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
Bacopa monnieri has historical utilization as a Medhya Rasayana botanical. Modern standardized processing ensures removal of non-specific glycosides while maintaining exact ratios of memory-active dammarane-type triterpenoid saponins.
```

### Chunk Sample 11: `USA-CHK-0000-650c3dc2`
- **Patent ID:** `US-8828456-B2`
- **Title:** Bioavailable curcuminoid compositions with enhanced absorption and methods of preparing the same
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `abstract`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `31`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
Compositions comprising curcuminoids and essential oil of turmeric having ar-turmerone, demonstrating superior intestinal bioavailability and prolonged systemic residence time compared to standard curcumin formulations.
```

### Chunk Sample 12: `USA-CHK-0001-d949be29`
- **Patent ID:** `US-8828456-B2`
- **Title:** Bioavailable curcuminoid compositions with enhanced absorption and methods of preparing the same
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `background`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `20`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
Curcuminoids are poorly absorbed from the gastrointestinal tract due to low water solubility and rapid metabolism.
```

### Chunk Sample 13: `USA-CHK-0002-0d13d3bf`
- **Patent ID:** `US-8828456-B2`
- **Title:** Bioavailable curcuminoid compositions with enhanced absorption and methods of preparing the same
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `summary`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `19`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
Reconstitution of purified curcuminoids with volatile sesquiterpenoid fractions of Curcuma longa produces unexpected pharmacokinetic synergy.
```

### Chunk Sample 14: `USA-CHK-0003-9d5db264`
- **Patent ID:** `US-8828456-B2`
- **Title:** Bioavailable curcuminoid compositions with enhanced absorption and methods of preparing the same
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `claims`
- **Claim Number:** `1`
- **Estimated Tokens:** `123`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
Claim 1: 1. A bioavailable curcumin composition comprising: (a) a curcuminoid extract comprising at least 95% total curcuminoids; and (b) an essential oil of turmeric comprising at least 45% ar-turmerone; wherein the weight ratio of curcuminoids to essential oil of turmeric is from 10:1 to 15:1.

Claim 2: 2. The composition of claim 1, wherein the oral bioavailability in humans is at least 7-fold 
... [TRUNCATED FOR INSPECTION PREVIEW] ...
```

### Chunk Sample 15: `USA-CHK-0004-f10a3a70`
- **Patent ID:** `US-8828456-B2`
- **Title:** Bioavailable curcuminoid compositions with enhanced absorption and methods of preparing the same
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `description`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `65`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
FIELD: The invention provides compositions of curcuminoids with essential oils from Curcuma rhizomes for enhanced oral bioavailability.

DISCUSSION: Curcumin has extensive preclinical documentation for anti-inflammatory, antioxidant, and chemoprotective properties, but exhibits rapid intestinal and hepatic metabolism. Addition of natural turmeric essential oil sesquiterpenes delays glucuronidation
... [TRUNCATED FOR INSPECTION PREVIEW] ...
```

### Chunk Sample 16: `USA-CHK-0000-4c42d03b`
- **Patent ID:** `US-9144590-B2`
- **Title:** Synergistic botanical composition comprising Withania somnifera and Curcuma longa for treatment of inflammatory disorders
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `abstract`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `48`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
The present invention relates to a synergistic pharmaceutical or dietary supplement composition comprising standardized extracts of Withania somnifera (Ashwagandha) root and Curcuma longa (Turmeric) rhizome in a specific weight ratio, providing enhanced cellular anti-inflammatory and chondroprotective activity.
```

### Chunk Sample 17: `USA-CHK-0001-4e37ba5e`
- **Patent ID:** `US-9144590-B2`
- **Title:** Synergistic botanical composition comprising Withania somnifera and Curcuma longa for treatment of inflammatory disorders
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `background`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `27`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
Osteoarthritis and rheumatoid arthritis represent degenerative and inflammatory conditions of joints with substantial healthcare costs. Long-term NSAID therapy produces gastrointestinal toxicity.
```

### Chunk Sample 18: `USA-CHK-0002-0ea24d4b`
- **Patent ID:** `US-9144590-B2`
- **Title:** Synergistic botanical composition comprising Withania somnifera and Curcuma longa for treatment of inflammatory disorders
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `summary`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `31`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
The invention provides a synergistic botanical composition of standardized Withania somnifera root extract and Curcuma longa rhizome extract exhibiting enhanced anti-inflammatory and cartilage-protective properties.
```

### Chunk Sample 19: `USA-CHK-0003-b70a8761`
- **Patent ID:** `US-9144590-B2`
- **Title:** Synergistic botanical composition comprising Withania somnifera and Curcuma longa for treatment of inflammatory disorders
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `claims`
- **Claim Number:** `1`
- **Estimated Tokens:** `189`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
Claim 1: 1. A synergistic oral composition comprising: (a) a standardized extract of Withania somnifera roots comprising at least 5.0% by weight of withanolide glycosides and withaferin A; (b) a standardized extract of Curcuma longa rhizomes comprising at least 95.0% by weight of total curcuminoids; and (c) a pharmaceutically acceptable excipient; wherein the weight ratio of the Withania somnifera
... [TRUNCATED FOR INSPECTION PREVIEW] ...
```

### Chunk Sample 20: `USA-CHK-0004-601bbc45`
- **Patent ID:** `US-9144590-B2`
- **Title:** Synergistic botanical composition comprising Withania somnifera and Curcuma longa for treatment of inflammatory disorders
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `description`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `183`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
TECHNICAL FIELD: The present invention relates to standardized herbal compositions and methods for the prevention and treatment of inflammatory and degenerative joint disorders.

BACKGROUND OF THE INVENTION: Osteoarthritis and rheumatoid arthritis affect millions of individuals worldwide. Standard non-steroidal anti-inflammatory drugs (NSAIDs) carry significant adverse event profiles, including ga
... [TRUNCATED FOR INSPECTION PREVIEW] ...
```

### Chunk Sample 21: `USA-CHK-0000-1927b8e8`
- **Patent ID:** `US-9345738-B2`
- **Title:** Phytochemical composition comprising Boswellia serrata and Commiphora mukul for synovial protection
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `abstract`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `29`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
A synergistic oral botanical composition combining 3-O-acetyl-11-keto-beta-boswellic acid (AKBA) and guggulsterones, providing dual inhibition of 5-lipoxygenase and NF-kappa-B for cartilage integrity in osteoarthritis.
```

### Chunk Sample 22: `USA-CHK-0001-1893d887`
- **Patent ID:** `US-9345738-B2`
- **Title:** Phytochemical composition comprising Boswellia serrata and Commiphora mukul for synovial protection
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `background`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `16`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
Cartilage matrix destruction in osteoarthritic joints involves matrix metalloproteinases induced by pro-inflammatory cytokines.
```

### Chunk Sample 23: `USA-CHK-0002-a6c107b5`
- **Patent ID:** `US-9345738-B2`
- **Title:** Phytochemical composition comprising Boswellia serrata and Commiphora mukul for synovial protection
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `summary`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `19`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
Dual inhibition of 5-LOX and NF-kappa-B through synergistic combinations of Boswellia and Commiphora standardized extracts.
```

### Chunk Sample 24: `USA-CHK-0003-c13346ed`
- **Patent ID:** `US-9345738-B2`
- **Title:** Phytochemical composition comprising Boswellia serrata and Commiphora mukul for synovial protection
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `claims`
- **Claim Number:** `1`
- **Estimated Tokens:** `122`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
Claim 1: 1. A botanical composition comprising: (a) a standardized extract of Boswellia serrata comprising at least 30% by weight of AKBA; (b) a standardized extract of Commiphora mukul comprising at least 2.5% by weight of guggulsterones E and Z; wherein the weight ratio of Boswellia extract to Commiphora extract is from 2:1 to 4:1; and (c) a pharmaceutically acceptable carrier.

Claim 2: 2. The 
... [TRUNCATED FOR INSPECTION PREVIEW] ...
```

### Chunk Sample 25: `USA-CHK-0004-2dadb71b`
- **Patent ID:** `US-9345738-B2`
- **Title:** Phytochemical composition comprising Boswellia serrata and Commiphora mukul for synovial protection
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `description`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `40`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
DETAILED DESCRIPTION: The invention addresses joint degradation through non-overlapping pathways. AKBA binds directly to 5-lipoxygenase, while guggulsterone antagonizes the farnesoid X receptor and prevents degradation of I-kappa-B-alpha, preventing NF-kappa-B nuclear translocation.
```
