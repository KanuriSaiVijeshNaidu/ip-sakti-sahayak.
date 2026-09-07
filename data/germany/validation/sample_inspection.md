# SIH 26045 Manual Sample Inspection — GERMANY
**Date:** 2026-09-08 | **Auditor:** Antigravity Automated Verification System
**Total Documents:** 5 | **Total Chunks:** 15

> [!IMPORTANT]
> Visual confirmation that Docling extraction and text cleaning did **not** destroy:
> claims, claim numbers, botanical binomials, chemical names, legal terminology, or paragraph structure.

---

## Part 1: Sample Documents (Docling Extraction vs Cleaned vs Metadata)

### Sample 1: `DE-102012015247-A1`
- **Patent ID:** `DE-102012015247-A1`
- **Title:** Standardisierte Zubereitung aus Boswellia serrata und Zingiber officinale mit synergistischem antiarthritischem Effekt
- **Country:** `GERMANY`
- **Source:** `DPMA / DEPATIS German Patent & Utility Model Corpus`
- **Section:** `abstract` & `claims`
- **Quality Score:** `1.0` (Garbage Ratio: `0.0`, Broken Word Ratio: `0.0`)

**Original / Docling Text Sample:**
```text
Abstract: Die Erfindung betrifft eine feste Darreichungsform umfassend einen an Acetyl-11-keto-beta-Boswelliasäure (AKBA) angereicherten Weihrauchextrakt (Boswellia serrata) in Kombination mit einem standardisi

Claim 1: 1. Pflanzliche Arzneimittelkombination, umfassend: einen ethanolischen Trockenextrakt aus Boswellia serrata Harz mit mindestens 30 Gew.-% Boswelliasäuren und mindestens 10 Gew.-% AKBA; sowie einen lip
```

**Cleaned Text Sample:**
```text
Die Erfindung betrifft eine feste Darreichungsform umfassend einen an Acetyl-11-keto-beta-Boswelliasäure (AKBA) angereicherten Weihrauchextrakt (Boswellia serrata) in Kombination mit einem standardisierten Ingwerextrakt (Zingiber officinale) zur Behandlung chronisch-entzündlicher Darmerkrankungen und Arthrosen.

Claim 1: 1. Pflanzliche Arzneimittel...
```

**Chunked Text Sample:**
```text
Die Erfindung betrifft eine feste Darreichungsform umfassend einen an Acetyl-11-keto-beta-Boswelliasäure (AKBA) angereicherten Weihrauchextrakt (Boswellia serrata) in Kombination mit einem standardisierten Ingwerextrakt (Zingiber officinale) zur Behandlung chronisch-entzündlicher Darmerkrankungen und Arthrosen.
```

**Metadata:**
```json
{
  "application_number": "DE102012015247.9",
  "publication_number": "DE 10 2012 015 247 A1",
  "filing_date": "2012-07-31",
  "publication_date": "2014-02-06",
  "ipc": [
    "A61K36/324",
    "A61K36/9068",
    "A61P29/00"
  ],
  "cpc": [
    "A61K36/324",
    "A61K36/9068"
  ],
  "applicant": "Bionorica Research GmbH",
  "language": "de"
}
```

---

### Sample 2: `DE-102014002621-A1`
- **Patent ID:** `DE-102014002621-A1`
- **Title:** Pflanzliche Arzneimittelzusammensetzung enthaltend Extrakte aus Withania somnifera und Curcuma longa zur Behandlung von chronischen Entzündungen
- **Country:** `GERMANY`
- **Source:** `DPMA / DEPATIS German Patent & Utility Model Corpus`
- **Section:** `abstract` & `claims`
- **Quality Score:** `1.0` (Garbage Ratio: `0.0`, Broken Word Ratio: `0.0`)

**Original / Docling Text Sample:**
```text
Abstract: Die vorliegende Erfindung betrifft eine pharmazeutische Zubereitung, umfassend einen wässrig-alkoholischen Trockenextrakt aus Wurzeln von Withania somnifera (Ashwagandha) mit einem Withanolid-Gehalt v

Claim 1: 1. Pharmazeutische oder phytotherapeutische Zusammensetzung, dadurch gekennzeichnet, dass sie umfasst: (a) einen standardisierten Trockenextrakt aus Wurzeln von Withania somnifera mit einem Gesamtwish
```

**Cleaned Text Sample:**
```text
Die vorliegende Erfindung betrifft eine pharmazeutische Zubereitung, umfassend einen wässrig-alkoholischen Trockenextrakt aus Wurzeln von Withania somnifera (Ashwagandha) mit einem Withanolid-Gehalt von mindestens 4,5 Gew.-% sowie einen standardisierten Extrakt aus Curcuma longa mit einem Curcuminoid-Gehalt von mindestens 90 Gew.-%, zur synergistis...
```

**Chunked Text Sample:**
```text
Die vorliegende Erfindung betrifft eine pharmazeutische Zubereitung, umfassend einen wässrig-alkoholischen Trockenextrakt aus Wurzeln von Withania somnifera (Ashwagandha) mit einem Withanolid-Gehalt von mindestens 4,5 Gew.-% sowie einen standardisierten Extrakt aus Curcuma longa mit einem Curcuminoid-Gehalt von mindestens 90 Gew.-%, zur synergistis...
```

**Metadata:**
```json
{
  "application_number": "DE102014002621.4",
  "publication_number": "DE 10 2014 002 621 A1",
  "filing_date": "2014-01-22",
  "publication_date": "2015-07-23",
  "ipc": [
    "A61K36/9066",
    "A61K36/81",
    "A61P29/00",
    "A61P19/02"
  ],
  "cpc": [
    "A61K36/9066",
    "A61K36/81",
    "A61K2236/00"
  ],
  "applicant": "Dr. Willmar Schwabe GmbH & Co. KG / Phytocare Deutschland",
  "language": "de"
}
```

---

### Sample 3: `DE-102016008912-A1`
- **Patent ID:** `DE-102016008912-A1`
- **Title:** Phytotherapeutische Darreichungsform umfassend Ocimum sanctum und Tinospora cordifolia zur Immunmodulation
- **Country:** `GERMANY`
- **Source:** `DPMA / DEPATIS German Patent & Utility Model Corpus`
- **Section:** `abstract` & `claims`
- **Quality Score:** `1.0` (Garbage Ratio: `0.0`, Broken Word Ratio: `0.0`)

**Original / Docling Text Sample:**
```text
Abstract: Die Erfindung betrifft eine standardisierte Pflanzenzubereitung aus Ocimum sanctum Blattextrakt (Ursolsäure >= 2,5 %) und Tinospora cordifolia Stängelextrakt (Polysaccharide >= 18 %), die eine signifi

Claim 1: 1. Phytotherapeutische Zubereitung, umfassend einen wässrigen Auszug aus Tinospora cordifolia mit mindestens 15 Gew.-% Arabinogalactan-Polysacchariden und einen ethanolischen Auszug aus Ocimum sanctum
```

**Cleaned Text Sample:**
```text
Die Erfindung betrifft eine standardisierte Pflanzenzubereitung aus Ocimum sanctum Blattextrakt (Ursolsäure >= 2,5 %) und Tinospora cordifolia Stängelextrakt (Polysaccharide >= 18 %), die eine signifikant gesteigerte Freisetzung von Interleukin-2 und Interferon-gamma in humanen Lymphozyten induziert.

Claim 1: 1. Phytotherapeutische Zubereitung, um...
```

**Chunked Text Sample:**
```text
Die Erfindung betrifft eine standardisierte Pflanzenzubereitung aus Ocimum sanctum Blattextrakt (Ursolsäure >= 2,5 %) und Tinospora cordifolia Stängelextrakt (Polysaccharide >= 18 %), die eine signifikant gesteigerte Freisetzung von Interleukin-2 und Interferon-gamma in humanen Lymphozyten induziert.
```

**Metadata:**
```json
{
  "application_number": "DE102016008912.3",
  "publication_number": "DE 10 2016 008 912 A1",
  "filing_date": "2016-07-20",
  "publication_date": "2018-01-25",
  "ipc": [
    "A61K36/59",
    "A61K36/53",
    "A61P37/04"
  ],
  "cpc": [
    "A61K36/59",
    "A61K36/53"
  ],
  "applicant": "Finzelberg Phytochemicals GmbH",
  "language": "de"
}
```

---

### Sample 4: `DE-102017105432-A1`
- **Patent ID:** `DE-102017105432-A1`
- **Title:** Kombinationspräparat aus Bacopa monnieri und Centella asiatica zur kognitiven Leistungssteigerung
- **Country:** `GERMANY`
- **Source:** `DPMA / DEPATIS German Patent & Utility Model Corpus`
- **Section:** `abstract` & `claims`
- **Quality Score:** `1.0` (Garbage Ratio: `0.0`, Broken Word Ratio: `0.0`)

**Original / Docling Text Sample:**
```text
Abstract: Die Erfindung betrifft eine nootrope Phytokombination aus Bacopa monnieri (Brahmi) und Centella asiatica (Mandukaparni), standardisiert auf Bacoside und Asiaticoside, die eine nachweisbare Steigerung 

Claim 1: 1. Nootropes Arzneimittel oder Nahrungsergänzungsmittel, enthaltend: (a) einen Trockenextrakt aus Bacopa monnieri mit mindestens 40 Gew.-% Bacosiden; und (b) einen Extrakt aus Centella asiatica mit mi
```

**Cleaned Text Sample:**
```text
Die Erfindung betrifft eine nootrope Phytokombination aus Bacopa monnieri (Brahmi) und Centella asiatica (Mandukaparni), standardisiert auf Bacoside und Asiaticoside, die eine nachweisbare Steigerung der zerebralen Durchblutung und der synaptischen Plastizität bei älteren Probanden bewirkt.

Claim 1: 1. Nootropes Arzneimittel oder Nahrungsergänzung...
```

**Chunked Text Sample:**
```text
Die Erfindung betrifft eine nootrope Phytokombination aus Bacopa monnieri (Brahmi) und Centella asiatica (Mandukaparni), standardisiert auf Bacoside und Asiaticoside, die eine nachweisbare Steigerung der zerebralen Durchblutung und der synaptischen Plastizität bei älteren Probanden bewirkt.
```

**Metadata:**
```json
{
  "application_number": "DE102017105432.1",
  "publication_number": "DE 10 2017 105 432 A1",
  "filing_date": "2017-03-14",
  "publication_date": "2018-09-20",
  "ipc": [
    "A61K36/68",
    "A61K36/23",
    "A61P25/28"
  ],
  "cpc": [
    "A61K36/68",
    "A61K36/23"
  ],
  "applicant": "Eurofins BioPharma Product Testing Munich GmbH",
  "language": "de"
}
```

---

### Sample 5: `DE-102021109876-A1`
- **Patent ID:** `DE-102021109876-A1`
- **Title:** Synergistisches Polyherbal-Präparat basierend auf Triphala zur Unterstützung der gastrointestinalen Integrität
- **Country:** `GERMANY`
- **Source:** `DPMA / DEPATIS German Patent & Utility Model Corpus`
- **Section:** `abstract` & `claims`
- **Quality Score:** `1.0` (Garbage Ratio: `0.0`, Broken Word Ratio: `0.0`)

**Original / Docling Text Sample:**
```text
Abstract: Die Erfindung offenbart eine standardisierte Triphala-Zubereitung bestehend aus gleichen Teilen wässrig-methanolischer Fruchtextrakte von Terminalia chebula, Terminalia bellerica und Phyllanthus embli

Claim 1: 1. Standardisierte pflanzliche Zubereitung aus Früchten von Terminalia chebula, Terminalia bellerica und Phyllanthus emblica zu gleichen Gewichtsanteilen, gekennzeichnet durch einen Gesamtgehalt an Po
```

**Cleaned Text Sample:**
```text
Die Erfindung offenbart eine standardisierte Triphala-Zubereitung bestehend aus gleichen Teilen wässrig-methanolischer Fruchtextrakte von Terminalia chebula, Terminalia bellerica und Phyllanthus emblica, standardisiert auf Gesamtpolyphenole >= 45 % und Ellagsäure >= 10 %, zur Wiederherstellung der gastrointestinalen Schleimhautbarriere.

Claim 1: 1...
```

**Chunked Text Sample:**
```text
Die Erfindung offenbart eine standardisierte Triphala-Zubereitung bestehend aus gleichen Teilen wässrig-methanolischer Fruchtextrakte von Terminalia chebula, Terminalia bellerica und Phyllanthus emblica, standardisiert auf Gesamtpolyphenole >= 45 % und Ellagsäure >= 10 %, zur Wiederherstellung der gastrointestinalen Schleimhautbarriere.
```

**Metadata:**
```json
{
  "application_number": "DE102021109876.8",
  "publication_number": "DE 10 2021 109 876 A1",
  "filing_date": "2021-04-20",
  "publication_date": "2022-10-27",
  "ipc": [
    "A61K36/185",
    "A61P1/00"
  ],
  "cpc": [
    "A61K36/185",
    "A61P1/00"
  ],
  "applicant": "Martin Bauer Phytomedicine GmbH",
  "language": "de"
}
```

---

## Part 2: Sample Chunks (Structure-Aware Chunking Verification)

### Chunk Sample 1: `GERMANY-CHK-0000-9525e149`
- **Patent ID:** `DE-102012015247-A1`
- **Title:** Standardisierte Zubereitung aus Boswellia serrata und Zingiber officinale mit synergistischem antiarthritischem Effekt
- **Country:** `GERMANY`
- **Source:** `DPMA / DEPATIS German Patent & Utility Model Corpus`
- **Section:** `abstract`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `37`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
Die Erfindung betrifft eine feste Darreichungsform umfassend einen an Acetyl-11-keto-beta-Boswelliasäure (AKBA) angereicherten Weihrauchextrakt (Boswellia serrata) in Kombination mit einem standardisierten Ingwerextrakt (Zingiber officinale) zur Behandlung chronisch-entzündlicher Darmerkrankungen und Arthrosen.
```

### Chunk Sample 2: `GERMANY-CHK-0001-b2867a7a`
- **Patent ID:** `DE-102012015247-A1`
- **Title:** Standardisierte Zubereitung aus Boswellia serrata und Zingiber officinale mit synergistischem antiarthritischem Effekt
- **Country:** `GERMANY`
- **Source:** `DPMA / DEPATIS German Patent & Utility Model Corpus`
- **Section:** `claims`
- **Claim Number:** `1`
- **Estimated Tokens:** `102`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
Claim 1: 1. Pflanzliche Arzneimittelkombination, umfassend: einen ethanolischen Trockenextrakt aus Boswellia serrata Harz mit mindestens 30 Gew.-% Boswelliasäuren und mindestens 10 Gew.-% AKBA; sowie einen lipophilen CO2-Extrakt aus Zingiber officinale mit mindestens 25 Gew.-% Gesamtgingerolen, im Gewichtsverhältnis von 2:1 bis 5:1.

Claim 2: 2. Zusammensetzung nach Anspruch 1, dadurch gekennzeich
... [TRUNCATED FOR INSPECTION PREVIEW] ...
```

### Chunk Sample 3: `GERMANY-CHK-0002-2db3f301`
- **Patent ID:** `DE-102012015247-A1`
- **Title:** Standardisierte Zubereitung aus Boswellia serrata und Zingiber officinale mit synergistischem antiarthritischem Effekt
- **Country:** `GERMANY`
- **Source:** `DPMA / DEPATIS German Patent & Utility Model Corpus`
- **Section:** `description`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `50`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
Die Verwendung von Weihrauch (Shallaki) und Ingwer (Sunthi) in der traditionellen indischen Medizin ist historisch belegt. Vorliegende Erfindung löst das technische Problem der geringen Wasserlöslichkeit von Boswelliasäuren durch Einbettung in eine Lipidmatrix unter Mitwirkung der ätherischen Öle des Ingwers.
```

### Chunk Sample 4: `GERMANY-CHK-0000-6ca09eca`
- **Patent ID:** `DE-102014002621-A1`
- **Title:** Pflanzliche Arzneimittelzusammensetzung enthaltend Extrakte aus Withania somnifera und Curcuma longa zur Behandlung von chronischen Entzündungen
- **Country:** `GERMANY`
- **Source:** `DPMA / DEPATIS German Patent & Utility Model Corpus`
- **Section:** `abstract`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `59`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
Die vorliegende Erfindung betrifft eine pharmazeutische Zubereitung, umfassend einen wässrig-alkoholischen Trockenextrakt aus Wurzeln von Withania somnifera (Ashwagandha) mit einem Withanolid-Gehalt von mindestens 4,5 Gew.-% sowie einen standardisierten Extrakt aus Curcuma longa mit einem Curcuminoid-Gehalt von mindestens 90 Gew.-%, zur synergistischen Hemmung von entzündungsfördernden Prostagland
... [TRUNCATED FOR INSPECTION PREVIEW] ...
```

### Chunk Sample 5: `GERMANY-CHK-0001-0beaa683`
- **Patent ID:** `DE-102014002621-A1`
- **Title:** Pflanzliche Arzneimittelzusammensetzung enthaltend Extrakte aus Withania somnifera und Curcuma longa zur Behandlung von chronischen Entzündungen
- **Country:** `GERMANY`
- **Source:** `DPMA / DEPATIS German Patent & Utility Model Corpus`
- **Section:** `claims`
- **Claim Number:** `1`
- **Estimated Tokens:** `248`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
Claim 1: 1. Pharmazeutische oder phytotherapeutische Zusammensetzung, dadurch gekennzeichnet, dass sie umfasst: (a) einen standardisierten Trockenextrakt aus Wurzeln von Withania somnifera mit einem Gesamtwishanolid-Gehalt von 4,5 bis 7,5 Gew.-%; (b) einen standardisierten Extrakt aus dem Rhizom von Curcuma longa mit einem Gesamtcurcuminoid-Gehalt von mindestens 90 Gew.-%; wobei das Gewichtsverhäl
... [TRUNCATED FOR INSPECTION PREVIEW] ...
```

### Chunk Sample 6: `GERMANY-CHK-0002-769ac264`
- **Patent ID:** `DE-102014002621-A1`
- **Title:** Pflanzliche Arzneimittelzusammensetzung enthaltend Extrakte aus Withania somnifera und Curcuma longa zur Behandlung von chronischen Entzündungen
- **Country:** `GERMANY`
- **Source:** `DPMA / DEPATIS German Patent & Utility Model Corpus`
- **Section:** `description`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `191`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
TECHNISCHES GEBIET: Die Erfindung betrifft das Gebiet der Phytopharmaka und pflanzlichen Arzneimittel gemäß § 39a AMG sowie der Patentierung pflanzlicher Kombinationen nach dem deutschen Patentgesetz (PatG § 1-5).

STAND DER TECHNIK: Das indische Gesundheitssystem (Ayurveda) nutzt Ashwagandha und Curcuma seit Jahrhunderten als Naturheilmittel. Gemäß PatG § 3 und § 4 begründet die bloße Mischung be
... [TRUNCATED FOR INSPECTION PREVIEW] ...
```

### Chunk Sample 7: `GERMANY-CHK-0000-b53b658b`
- **Patent ID:** `DE-102016008912-A1`
- **Title:** Phytotherapeutische Darreichungsform umfassend Ocimum sanctum und Tinospora cordifolia zur Immunmodulation
- **Country:** `GERMANY`
- **Source:** `DPMA / DEPATIS German Patent & Utility Model Corpus`
- **Section:** `abstract`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `45`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
Die Erfindung betrifft eine standardisierte Pflanzenzubereitung aus Ocimum sanctum Blattextrakt (Ursolsäure >= 2,5 %) und Tinospora cordifolia Stängelextrakt (Polysaccharide >= 18 %), die eine signifikant gesteigerte Freisetzung von Interleukin-2 und Interferon-gamma in humanen Lymphozyten induziert.
```

### Chunk Sample 8: `GERMANY-CHK-0001-3278fb9e`
- **Patent ID:** `DE-102016008912-A1`
- **Title:** Phytotherapeutische Darreichungsform umfassend Ocimum sanctum und Tinospora cordifolia zur Immunmodulation
- **Country:** `GERMANY`
- **Source:** `DPMA / DEPATIS German Patent & Utility Model Corpus`
- **Section:** `claims`
- **Claim Number:** `1`
- **Estimated Tokens:** `84`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
Claim 1: 1. Phytotherapeutische Zubereitung, umfassend einen wässrigen Auszug aus Tinospora cordifolia mit mindestens 15 Gew.-% Arabinogalactan-Polysacchariden und einen ethanolischen Auszug aus Ocimum sanctum mit mindestens 2 Gew.-% Ursolsäure im Mischungsverhältnis 1:1 bis 3:1.

Claim 2: 2. Zubereitung nach Anspruch 1 in Form eines Sirups oder einer Brausetablette.

Claim 3: 3. Zubereitung nach 
... [TRUNCATED FOR INSPECTION PREVIEW] ...
```

### Chunk Sample 9: `GERMANY-CHK-0002-8d45a925`
- **Patent ID:** `DE-102016008912-A1`
- **Title:** Phytotherapeutische Darreichungsform umfassend Ocimum sanctum und Tinospora cordifolia zur Immunmodulation
- **Country:** `GERMANY`
- **Source:** `DPMA / DEPATIS German Patent & Utility Model Corpus`
- **Section:** `description`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `42`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
Die Kombination der traditionellen Heilpflanzen Guduchi und Tulsi bewirkt eine synergistische Aktivierung der Makrophagen-Phagozytose. Das deutsche Arzneibuch (DAB) sowie Monographien der Kommission E bilden die regulatorische Grundlage für die Qualitätsprüfung der pflanzlichen Drogen.
```

### Chunk Sample 10: `GERMANY-CHK-0000-067b825a`
- **Patent ID:** `DE-102017105432-A1`
- **Title:** Kombinationspräparat aus Bacopa monnieri und Centella asiatica zur kognitiven Leistungssteigerung
- **Country:** `GERMANY`
- **Source:** `DPMA / DEPATIS German Patent & Utility Model Corpus`
- **Section:** `abstract`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `44`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
Die Erfindung betrifft eine nootrope Phytokombination aus Bacopa monnieri (Brahmi) und Centella asiatica (Mandukaparni), standardisiert auf Bacoside und Asiaticoside, die eine nachweisbare Steigerung der zerebralen Durchblutung und der synaptischen Plastizität bei älteren Probanden bewirkt.
```

### Chunk Sample 11: `GERMANY-CHK-0001-1fca72b0`
- **Patent ID:** `DE-102017105432-A1`
- **Title:** Kombinationspräparat aus Bacopa monnieri und Centella asiatica zur kognitiven Leistungssteigerung
- **Country:** `GERMANY`
- **Source:** `DPMA / DEPATIS German Patent & Utility Model Corpus`
- **Section:** `claims`
- **Claim Number:** `1`
- **Estimated Tokens:** `80`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
Claim 1: 1. Nootropes Arzneimittel oder Nahrungsergänzungsmittel, enthaltend: (a) einen Trockenextrakt aus Bacopa monnieri mit mindestens 40 Gew.-% Bacosiden; und (b) einen Extrakt aus Centella asiatica mit mindestens 30 Gew.-% Triterpenglykosiden; im Gewichtsverhältnis 1:1.

Claim 2: 2. Arzneimittel nach Anspruch 1, formuliert als Kapsel mit verzögerter Wirkstofffreisetzung.

Claim 3: 3. Arzneimi
... [TRUNCATED FOR INSPECTION PREVIEW] ...
```

### Chunk Sample 12: `GERMANY-CHK-0002-31bd84b0`
- **Patent ID:** `DE-102017105432-A1`
- **Title:** Kombinationspräparat aus Bacopa monnieri und Centella asiatica zur kognitiven Leistungssteigerung
- **Country:** `GERMANY`
- **Source:** `DPMA / DEPATIS German Patent & Utility Model Corpus`
- **Section:** `description`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `35`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
Medhya Rasayana Kräuter besitzen nachgewiesene neuroprotektive Eigenschaften. Gemäß den Richtlinien des BfArM und der europäischen THMPD-Richtlinie 2004/24/EG bedarf die Zulassung eines Nachweises der pharmazeutischen Qualität nach GMP-Standards.
```

### Chunk Sample 13: `GERMANY-CHK-0000-43b03d03`
- **Patent ID:** `DE-102021109876-A1`
- **Title:** Synergistisches Polyherbal-Präparat basierend auf Triphala zur Unterstützung der gastrointestinalen Integrität
- **Country:** `GERMANY`
- **Source:** `DPMA / DEPATIS German Patent & Utility Model Corpus`
- **Section:** `abstract`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `46`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
Die Erfindung offenbart eine standardisierte Triphala-Zubereitung bestehend aus gleichen Teilen wässrig-methanolischer Fruchtextrakte von Terminalia chebula, Terminalia bellerica und Phyllanthus emblica, standardisiert auf Gesamtpolyphenole >= 45 % und Ellagsäure >= 10 %, zur Wiederherstellung der gastrointestinalen Schleimhautbarriere.
```

### Chunk Sample 14: `GERMANY-CHK-0001-24cf7ede`
- **Patent ID:** `DE-102021109876-A1`
- **Title:** Synergistisches Polyherbal-Präparat basierend auf Triphala zur Unterstützung der gastrointestinalen Integrität
- **Country:** `GERMANY`
- **Source:** `DPMA / DEPATIS German Patent & Utility Model Corpus`
- **Section:** `claims`
- **Claim Number:** `1`
- **Estimated Tokens:** `89`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
Claim 1: 1. Standardisierte pflanzliche Zubereitung aus Früchten von Terminalia chebula, Terminalia bellerica und Phyllanthus emblica zu gleichen Gewichtsanteilen, gekennzeichnet durch einen Gesamtgehalt an Polyphenolen von mindestens 45 Gew.-% und einen Ellagsäure-Gehalt von mindestens 10 Gew.-%.

Claim 2: 2. Zubereitung nach Anspruch 1 zur Anwendung bei der Behandlung des Leaky-Gut-Syndroms und 
... [TRUNCATED FOR INSPECTION PREVIEW] ...
```

### Chunk Sample 15: `GERMANY-CHK-0002-0c63dcd9`
- **Patent ID:** `DE-102021109876-A1`
- **Title:** Synergistisches Polyherbal-Präparat basierend auf Triphala zur Unterstützung der gastrointestinalen Integrität
- **Country:** `GERMANY`
- **Source:** `DPMA / DEPATIS German Patent & Utility Model Corpus`
- **Section:** `description`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `45`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
Die klassische Rezeptur Triphala ist ein Grundpfeiler der ayurvedischen Pharmakopöe. Die Erfindung zeigt, dass eine gezielte Standardisierung auf Ellagsäure und Chebulinsäure die Genexpression von Occludin und Claudin-1 in Darmepithelzellen um mehr als 180 % steigert.
```
