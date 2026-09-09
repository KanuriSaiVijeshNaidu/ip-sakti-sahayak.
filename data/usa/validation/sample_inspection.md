# SIH 26045 Manual Sample Inspection — USA
**Date:** 2026-09-08 | **Auditor:** Antigravity Automated Verification System
**Total Documents:** 1159 | **Total Chunks:** 29003

> [!IMPORTANT]
> Visual confirmation that Docling extraction and text cleaning did **not** destroy:
> claims, claim numbers, botanical binomials, chemical names, legal terminology, or paragraph structure.

---

## Part 1: Sample Documents (Docling Extraction vs Cleaned vs Metadata)

### Sample 1: `US-13144833`
- **Patent ID:** `US-13144833`
- **Title:** ROSACEA TREATMENTS AND KITS FOR PERFORMING THEM
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `abstract` & `claims`
- **Quality Score:** `0.9946` (Garbage Ratio: `0.0014`, Broken Word Ratio: `0.0`)

**Original / Docling Text Sample:**
```text
Abstract: Regimen for the treatment of rosacea include the application of an anti-redness composition to at least a portion of the cleansed area of skin afflicted with rosacea. The regimen may include the appli

Claim 1: 1. A treatment regimen comprising: cleansing at least a portion of an area of skin afflicted with rosacea with an antimicrobial or cleanser; applying an anti-redness composition to at least a portion 
```

**Cleaned Text Sample:**
```text
Regimen for the treatment of rosacea include the application of an anti-redness composition to at least a portion of the cleansed area of skin afflicted with rosacea. The regimen may include the application of one or more of a polymetal complex, a composition containing metronidazole, and/or a protective composition. Kits containing components usef...
```

**Chunked Text Sample:**
```text
Regimen for the treatment of rosacea include the application of an anti-redness composition to at least a portion of the cleansed area of skin afflicted with rosacea. The regimen may include the application of one or more of a polymetal complex, a composition containing metronidazole, and/or a protective composition. Kits containing components usef...
```

**Metadata:**
```json
{
  "application_number": "13144833",
  "publication_number": "US20160184354A1-20160630",
  "filing_date": "20160122",
  "publication_date": "20160630",
  "ipc": [
    "A61K3334",
    "A61K818",
    "A61K827",
    "A61K867",
    "A61Q1704",
    "A61K31203",
    "A61K4506",
    "A61Q1900",
    "A61Q1910",
    "A61K900",
    "A61K314164",
    "A61K31327"
  ],
  "cpc": [
    "A61K3334",
    "A61K314164",
    "A61K818",
    "A61K827",
    "A61K8671",
    "A61K867",
    "A61K31327",
    "A61K31203",
    "A61K4506",
    "A61Q19007",
    "A61Q1910",
    "A61K90014",
    "A61Q1704"
  ],
  "applicant": "USPTO Applicant",
  "language": "en"
}
```

---

### Sample 2: `US-14655041`
- **Patent ID:** `US-14655041`
- **Title:** VACCINES AGAINST HEPATITIS B VIRUS
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `abstract` & `claims`
- **Quality Score:** `0.9925` (Garbage Ratio: `0.0019`, Broken Word Ratio: `0.0`)

**Original / Docling Text Sample:**
```text
Abstract: A pharmaceutical composition comprising at least two peptides of from 15 to 60 amino acids in length, selected from peptides comprising a sequence of at least 15 contiguous amino acids of one of the s

Claim 1: 1. A pharmaceutical composition comprising at least two peptides of from 15 to 60 amino acids in length, selected from peptides comprising a sequence of at least 15 contiguous amino acids of one of th
```

**Cleaned Text Sample:**
```text
A pharmaceutical composition comprising at least two peptides of from 15 to 60 amino acids in length, selected from peptides comprising a sequence of at least 15 contiguous amino acids of one of the sequences shown in SEQ ID NOs: 1 to 4 or of a sequence having at least 80% identity to one of the sequences shown in SEQ ID NOs: to 4, wherein each pep...
```

**Chunked Text Sample:**
```text
A pharmaceutical composition comprising at least two peptides of from 15 to 60 amino acids in length, selected from peptides comprising a sequence of at least 15 contiguous amino acids of one of the sequences shown in SEQ ID NOs: 1 to 4 or of a sequence having at least 80% identity to one of the sequences shown in SEQ ID NOs: to 4, wherein each pep...
```

**Metadata:**
```json
{
  "application_number": "14655041",
  "publication_number": "US20160106830A1-20160421",
  "filing_date": "20160107",
  "publication_date": "20160421",
  "ipc": [
    "A61K3929",
    "C07K14005",
    "A61K4506",
    "C12N700"
  ],
  "cpc": [
    "A61K39292",
    "C12N700",
    "C07K14005",
    "A61K4506",
    "A61K203958"
  ],
  "applicant": "USPTO Applicant",
  "language": "en"
}
```

---

### Sample 3: `US-14770850`
- **Patent ID:** `US-14770850`
- **Title:** PHARMACEUTICAL COMPOUNDS AND USE OF SAME IN CANCER AND TAUOPATHIES
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `abstract` & `claims`
- **Quality Score:** `0.9954` (Garbage Ratio: `0.0012`, Broken Word Ratio: `0.0`)

**Original / Docling Text Sample:**
```text
Abstract: Disclosed are compounds of formula (1)-(V): where the substituents are as provided herein. Further disclosed are methods of inhibiting tau aggregation, treating or ameliorating a tauopathy or cancer b

Claim 1: 1. A compound having a structure of formula (I): wherein R1, R2, and R3 are each selected from the group consisting of hydrogen, fluoro, chloro, methoxy, methyl, or trifluoromethyl, R4 and R5 are each
```

**Cleaned Text Sample:**
```text
Disclosed are compounds of formula (1)-(V): where the substituents are as provided herein. Further disclosed are methods of inhibiting tau aggregation, treating or ameliorating a tauopathy or cancer by administration of such a compound. Tau is a microtubule-binding protein that accumulates in a number of neurodegenerative disorders, including front...
```

**Chunked Text Sample:**
```text
Disclosed are compounds of formula (1)-(V): where the substituents are as provided herein. Further disclosed are methods of inhibiting tau aggregation, treating or ameliorating a tauopathy or cancer by administration of such a compound. Tau is a microtubule-binding protein that accumulates in a number of neurodegenerative disorders, including front...
```

**Metadata:**
```json
{
  "application_number": "14770850",
  "publication_number": "US20160000770A1-20160107",
  "filing_date": "20160112",
  "publication_date": "20160107",
  "ipc": [
    "A61K314439",
    "A61K31428",
    "C07D41714",
    "C07D27764",
    "A61K3805",
    "A61K31395"
  ],
  "cpc": [
    "A61K314439",
    "A61K3805",
    "A61K31395",
    "C07D41714",
    "C07D27764",
    "A61K31428"
  ],
  "applicant": "USPTO Applicant",
  "language": "en"
}
```

---

### Sample 4: `US-14772473`
- **Patent ID:** `US-14772473`
- **Title:** THERAPEUTIC AGENT FOR A DISEASE ACCOMPANIED BY EPILEPTIFORM DISCHARGES
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `abstract` & `claims`
- **Quality Score:** `0.9982` (Garbage Ratio: `0.0004`, Broken Word Ratio: `0.0`)

**Original / Docling Text Sample:**
```text
Abstract: Provided is a therapeutic agent for a disease accompanied by epileptiform discharges, which is easily-handled, has a low side effect, and has a fast acting property. By controlling the concentration o

Claim 1: 1-7. (canceled)
```

**Cleaned Text Sample:**
```text
Provided is a therapeutic agent for a disease accompanied by epileptiform discharges, which is easily-handled, has a low side effect, and has a fast acting property. By controlling the concentration of carbon dioxide of inhaled air, it is possible to change the pH in body fluids to an acidic side to reduce epileptiform discharges. Carbon dioxide is...
```

**Chunked Text Sample:**
```text
Provided is a therapeutic agent for a disease accompanied by epileptiform discharges, which is easily-handled, has a low side effect, and has a fast acting property. By controlling the concentration of carbon dioxide of inhaled air, it is possible to change the pH in body fluids to an acidic side to reduce epileptiform discharges. Carbon dioxide is...
```

**Metadata:**
```json
{
  "application_number": "14772473",
  "publication_number": "US20160166605A1-20160616",
  "filing_date": "20160122",
  "publication_date": "20160616",
  "ipc": [
    "A61K3300",
    "A61M1500",
    "A61K900"
  ],
  "cpc": [
    "A61K3300",
    "A61K9007",
    "A61M1500",
    "A61M22020225"
  ],
  "applicant": "USPTO Applicant",
  "language": "en"
}
```

---

### Sample 5: `US-14774293`
- **Patent ID:** `US-14774293`
- **Title:** ANTIBODY CONSTRUCTS FOR INFLUENZA M2 AND CD3
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `abstract` & `claims`
- **Quality Score:** `0.9915` (Garbage Ratio: `0.0021`, Broken Word Ratio: `0.0`)

**Original / Docling Text Sample:**
```text
Abstract: The present invention relates to an antibody construct comprising a first human binding domain specific for the extracellular part of the influenza envelope protein M2 (M2e) and a second domain specif

Claim 1: 1. An antibody construct comprising: (a) a first human binding domain specific for the extracellular part of the influenza envelope protein M2 (M2e), characterized by a CDR-H1 as depicted in SEQ ID NO
```

**Cleaned Text Sample:**
```text
The present invention relates to an antibody construct comprising a first human binding domain specific for the extracellular part of the influenza envelope protein M2 (M2e) and a second domain specific for CD3. Moreover, the invention provides a nucleic acid molecule encoding the antibody construct, a vector comprising said nucleic acid molecule a...
```

**Chunked Text Sample:**
```text
The present invention relates to an antibody construct comprising a first human binding domain specific for the extracellular part of the influenza envelope protein M2 (M2e) and a second domain specific for CD3. Moreover, the invention provides a nucleic acid molecule encoding the antibody construct, a vector comprising said nucleic acid molecule a...
```

**Metadata:**
```json
{
  "application_number": "14774293",
  "publication_number": "US20160039948A1-20160211",
  "filing_date": "20160129",
  "publication_date": "20160211",
  "ipc": [
    "C07K1646",
    "A61K3942",
    "A61K4506"
  ],
  "cpc": [
    "C07K16468",
    "A61K4506",
    "A61K3942",
    "C07K231731",
    "C07K231714",
    "C07K2317622",
    "C07K231792",
    "C07K231773",
    "A61K2039505"
  ],
  "applicant": "USPTO Applicant",
  "language": "en"
}
```

---

### Sample 6: `US-14777214`
- **Patent ID:** `US-14777214`
- **Title:** DNAI FOR THE MODULATION OF GENES
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `abstract` & `claims`
- **Quality Score:** `0.9984` (Garbage Ratio: `0.0004`, Broken Word Ratio: `0.0`)

**Original / Docling Text Sample:**
```text
Abstract: The present invention relates to methods and compositions for the inhibition of gene expression. In particular, the present invention provides oligonucleotide-based therapeutics for the inhibition gen

Claim 1: 1. An oligonucleotide that hybridizes to a non-coding region in or upstream of a promoter for a target gene, wherein the oligonucleotide comprises: a length of 20-34 bases; at least one CG pair; at le
```

**Cleaned Text Sample:**
```text
The present invention relates to methods and compositions for the inhibition of gene expression. In particular, the present invention provides oligonucleotide-based therapeutics for the inhibition genes implicated in many diseases.

<SOH> BACKGROUND OF THE INVENTION <EOH>The expression of gene products in cancer, e.g. oncogenes has become the centr...
```

**Chunked Text Sample:**
```text
The present invention relates to methods and compositions for the inhibition of gene expression. In particular, the present invention provides oligonucleotide-based therapeutics for the inhibition genes implicated in many diseases.
```

**Metadata:**
```json
{
  "application_number": "14777214",
  "publication_number": "US20160040163A1-20160211",
  "filing_date": "20160129",
  "publication_date": "20160211",
  "ipc": [
    "C12N15113",
    "A61K4506",
    "A61K317088",
    "A61K9127"
  ],
  "cpc": [
    "C12N15113",
    "A61K9127",
    "A61K4506",
    "A61K317088",
    "C12N151135",
    "C12N2310113",
    "C12N2310531",
    "C12N23103341"
  ],
  "applicant": "USPTO Applicant",
  "language": "en"
}
```

---

### Sample 7: `US-14778906`
- **Patent ID:** `US-14778906`
- **Title:** Method for Preparing Protein Cage, and In Situ Method for Preparing Hydrophobic Additive-supported Core-shell Structured Polymer-protein Particles
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `abstract` & `claims`
- **Quality Score:** `0.9968` (Garbage Ratio: `0.0008`, Broken Word Ratio: `0.0`)

**Original / Docling Text Sample:**
```text
Abstract: The present invention relates to a method for preparing a protein cage which comprises: a 1st step of preparing an amphiphilic polymer comprising a 1st hydrophobic polymer and a 1st hydrophilic functi

Claim 1: 1. A method for preparing a protein cage which comprises: a 1st step of preparing an amphiphilic polymer comprising a 1st hydrophobic polymer and a 1st hydrophilic functional group; a 2nd step of prep
```

**Cleaned Text Sample:**
```text
The present invention relates to a method for preparing a protein cage which comprises: a 1st step of preparing an amphiphilic polymer comprising a 1st hydrophobic polymer and a 1st hydrophilic functional group; a 2nd step of preparing a hydrophilic protein comprising a 2nd functional group binding to the 1st functional group; a 3rd step of forming...
```

**Chunked Text Sample:**
```text
The present invention relates to a method for preparing a protein cage which comprises: a 1st step of preparing an amphiphilic polymer comprising a 1st hydrophobic polymer and a 1st hydrophilic functional group; a 2nd step of preparing a hydrophilic protein comprising a 2nd functional group binding to the 1st functional group; a 3rd step of forming...
```

**Metadata:**
```json
{
  "application_number": "14778906",
  "publication_number": "US20160120814A1-20160505",
  "filing_date": "20160113",
  "publication_date": "20160505",
  "ipc": [
    "A61K948",
    "C07K1475",
    "A61Q1900",
    "A61K4900",
    "A61K866",
    "C07K14435",
    "A61K864"
  ],
  "cpc": [
    "A61K94825",
    "C07K1443504",
    "C07K1475",
    "A61K864",
    "A61K490056",
    "A61K866",
    "A61Q1900"
  ],
  "applicant": "USPTO Applicant",
  "language": "en"
}
```

---

### Sample 8: `US-14780616`
- **Patent ID:** `US-14780616`
- **Title:** COMPOSITE CONTAINING CATALYTIC METAL NANOPARTICLES, AND USE FOR SAME
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `abstract` & `claims`
- **Quality Score:** `0.999` (Garbage Ratio: `0.0003`, Broken Word Ratio: `0.0`)

**Original / Docling Text Sample:**
```text
Abstract: Provided is a material that, when compared with SAPd, exhibits the similar activity in cross-coupling (CC) reactions, can decrease the amount of catalytic metal that is mixed into the reaction product

Claim 1: 1-17. (canceled)
```

**Cleaned Text Sample:**
```text
Provided is a material that, when compared with SAPd, exhibits the similar activity in cross-coupling (CC) reactions, can decrease the amount of catalytic metal that is mixed into the reaction product, and increases the number of times use can be repeated. Provided are a catalyst and a catalyst precursor that use a catalytic metal other than Pd and...
```

**Chunked Text Sample:**
```text
Provided is a material that, when compared with SAPd, exhibits the similar activity in cross-coupling (CC) reactions, can decrease the amount of catalytic metal that is mixed into the reaction product, and increases the number of times use can be repeated. Provided are a catalyst and a catalyst precursor that use a catalytic metal other than Pd and...
```

**Metadata:**
```json
{
  "application_number": "14780616",
  "publication_number": "US20160152583A1-20160602",
  "filing_date": "20160119",
  "publication_date": "20160602",
  "ipc": [
    "C07D295033",
    "B01J3128",
    "B01J3106"
  ],
  "cpc": [
    "C07D295033",
    "B01J3106",
    "B01J3128",
    "B01J22314211",
    "B01J22314205"
  ],
  "applicant": "USPTO Applicant",
  "language": "en"
}
```

---

### Sample 9: `US-14783447`
- **Patent ID:** `US-14783447`
- **Title:** NOVEL USE FOR PAI-1 INHIBITOR
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `abstract` & `claims`
- **Quality Score:** `0.992` (Garbage Ratio: `0.002`, Broken Word Ratio: `0.0`)

**Original / Docling Text Sample:**
```text
Abstract: Provided is a novel use of a plasminogen activator inhibitor-1 inhibitor (PAI-1 inhibitor) that is used as an active ingredient of an agent for controlling a tumor stem cell, an agent for enhancing th

Claim 1: 1-15. (canceled)
```

**Cleaned Text Sample:**
```text
Provided is a novel use of a plasminogen activator inhibitor-1 inhibitor (PAI-1 inhibitor) that is used as an active ingredient of an agent for controlling a tumor stem cell, an agent for enhancing the antitumor effect of an antitumor agent, an agent for tumor chemotherapy, a stem-cell protecting drug, or a hematopoietic disorder improving agent.

...
```

**Chunked Text Sample:**
```text
Provided is a novel use of a plasminogen activator inhibitor-1 inhibitor (PAI-1 inhibitor) that is used as an active ingredient of an agent for controlling a tumor stem cell, an agent for enhancing the antitumor effect of an antitumor agent, an agent for tumor chemotherapy, a stem-cell protecting drug, or a hematopoietic disorder improving agent.
```

**Metadata:**
```json
{
  "application_number": "14783447",
  "publication_number": "US20160158188A1-20160609",
  "filing_date": "20160119",
  "publication_date": "20160609",
  "ipc": [
    "A61K31341",
    "A61K3147",
    "A61K31192",
    "A61K4506",
    "A61K31495"
  ],
  "cpc": [
    "A61K31341",
    "A61K4506",
    "A61K31495",
    "A61K31192",
    "A61K3147"
  ],
  "applicant": "USPTO Applicant",
  "language": "en"
}
```

---

### Sample 10: `US-14786395`
- **Patent ID:** `US-14786395`
- **Title:** COLOR MATERIAL, COLOR MATERIAL DISPERSION LIQUID, COLOR RESIN COMPOSITION FOR COLOR FILTERS, COLOR FILTER, LIQUID CRYSTAL DISPLAY DEVICE AND ORGANIC LIGHT-EMITTING DISPLAY DEVICE
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `abstract` & `claims`
- **Quality Score:** `0.9911` (Garbage Ratio: `0.0022`, Broken Word Ratio: `0.0`)

**Original / Docling Text Sample:**
```text
Abstract: The present invention is to provide a color material dispersion liquid which is able to form a high-luminance coating film having excellent heat resistance, with adjusting the color tone of the coatin

Claim 1: 1. A color material dispersion liquid comprising: (A) a color material, (B) a dispersant and (C) a solvent, wherein the color material (A) contains a color material (A-1) in which at least a cation re
```

**Cleaned Text Sample:**
```text
The present invention is to provide a color material dispersion liquid which is able to form a high-luminance coating film having excellent heat resistance, with adjusting the color tone of the coating film to a desired color tone. Disclosed is a color material dispersion liquid containing: (A) a color material, (B) a dispersant and (C) a solvent, ...
```

**Chunked Text Sample:**
```text
The present invention is to provide a color material dispersion liquid which is able to form a high-luminance coating film having excellent heat resistance, with adjusting the color tone of the coating film to a desired color tone. Disclosed is a color material dispersion liquid containing: (A) a color material, (B) a dispersant and (C) a solvent, ...
```

**Metadata:**
```json
{
  "application_number": "14786395",
  "publication_number": "US20160187547A1-20160630",
  "filing_date": "20160104",
  "publication_date": "20160630",
  "ipc": [
    "G02B522",
    "H01L2732",
    "G02F11335",
    "C07D31182",
    "C09B6906"
  ],
  "cpc": [
    "G02B5223",
    "C07D31182",
    "C09B6906",
    "G02F1133514",
    "H01L27322"
  ],
  "applicant": "USPTO Applicant",
  "language": "en"
}
```

---

### Sample 11: `US-14786721`
- **Patent ID:** `US-14786721`
- **Title:** METHOD FOR OBTAINING A STABLE GEL OF HYALURONIC ACID AND OF A FREE FORM OF VITAMIN C AND/OR A SALT THEREOF
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `abstract` & `claims`
- **Quality Score:** `0.9993` (Garbage Ratio: `0.0002`, Broken Word Ratio: `0.0`)

**Original / Docling Text Sample:**
```text
Abstract: The invention relates to a process for producing an aqueous gel comprising hyaluronic acid, vitamin C, and a stabilizing agent selected from the metabisulfites. According to the invention, such a proc

Claim 1: 1. Process for producing an aqueous gel comprising hyaluronic acid, vitamin C, and a stabilizing agent selected from the metabisulfites, comprising the following steps: a. preparing a mixture comprisi
```

**Cleaned Text Sample:**
```text
The invention relates to a process for producing an aqueous gel comprising hyaluronic acid, vitamin C, and a stabilizing agent selected from the metabisulfites. According to the invention, such a process comprises the steps of a) preparing a mixture comprising crosslinked or non-crosslinked hyaluronic acid and/or a salt thereof with a molar mass of...
```

**Chunked Text Sample:**
```text
The invention relates to a process for producing an aqueous gel comprising hyaluronic acid, vitamin C, and a stabilizing agent selected from the metabisulfites. According to the invention, such a process comprises the steps of a) preparing a mixture comprising crosslinked or non-crosslinked hyaluronic acid and/or a salt thereof with a molar mass of...
```

**Metadata:**
```json
{
  "application_number": "14786721",
  "publication_number": "US20160106707A1-20160421",
  "filing_date": "20160106",
  "publication_date": "20160421",
  "ipc": [
    "A61K31375",
    "A61K4506",
    "A61K906",
    "A61Q1900",
    "A61K873",
    "A61K867",
    "A61K819",
    "A61K804",
    "A61K900",
    "A61K4736"
  ],
  "cpc": [
    "A61K31375",
    "A61K90019",
    "A61K4506",
    "A61K906",
    "A61K4736",
    "A61K8735",
    "A61K8676",
    "A61K819",
    "A61K8042",
    "A61Q1900",
    "A61K280052",
    "A61K2800805",
    "A61K280091",
    "A61K280074",
    "A61K2800592"
  ],
  "applicant": "USPTO Applicant",
  "language": "en"
}
```

---

### Sample 12: `US-14787097`
- **Patent ID:** `US-14787097`
- **Title:** HIGHLY CONCENTRATED FORMULATIONS OF SOLUBLE Fc RECEPTORS
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `abstract` & `claims`
- **Quality Score:** `0.9857` (Garbage Ratio: `0.0036`, Broken Word Ratio: `0.0`)

**Original / Docling Text Sample:**
```text
Abstract: The present invention relates to novel formulations of soluble Fc receptors and especially to formulations containing high concentrations of soluble FcγRIIB receptor. The invention further relates to 

Claim 1: 1. Formulation containing a soluble Fc receptor (sFcR) in an aqueous buffered solution, wherein the concentration of the Fc receptor is greater than 50 mg/ml and wherein it contains a physiologically 
```

**Cleaned Text Sample:**
```text
The present invention relates to novel formulations of soluble Fc receptors and especially to formulations containing high concentrations of soluble FcγRIIB receptor. The invention further relates to the use of such formulations as pharmaceutical compounds for the treatment of autoimmune diseases, infections and other conditions where the immune sy...
```

**Chunked Text Sample:**
```text
The present invention relates to novel formulations of soluble Fc receptors and especially to formulations containing high concentrations of soluble FcγRIIB receptor. The invention further relates to the use of such formulations as pharmaceutical compounds for the treatment of autoimmune diseases, infections and other conditions where the immune sy...
```

**Metadata:**
```json
{
  "application_number": "14787097",
  "publication_number": "US20160095895A1-20160407",
  "filing_date": "20160108",
  "publication_date": "20160407",
  "ipc": [
    "A61K3800"
  ],
  "cpc": [
    "A61K3800"
  ],
  "applicant": "USPTO Applicant",
  "language": "en"
}
```

---

### Sample 13: `US-14787100`
- **Patent ID:** `US-14787100`
- **Title:** METHOD FOR DEPILATION BY PHOTOTHERMOLYSIS WITH MELANIN
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `abstract` & `claims`
- **Quality Score:** `0.996` (Garbage Ratio: `0.001`, Broken Word Ratio: `0.0`)

**Original / Docling Text Sample:**
```text
Abstract: Improved melanin-enhanced photothermolysis hair removal method, which includes the application of liposome-encapsulated melanin solutions as a chromophore onto the skin and the use of mechanical devic

Claim 1: 1. An improved melanin-enhanced photothermolysis hair removal method for photoepilation of an area of skin having white, gray or blond hair, comprising the steps of: applying a melanin solution onto t
```

**Cleaned Text Sample:**
```text
Improved melanin-enhanced photothermolysis hair removal method, which includes the application of liposome-encapsulated melanin solutions as a chromophore onto the skin and the use of mechanical devices having microneedles to favor absorption thereof by the hair follicles.

<SOH> BACKGROUND OF THE INVENTION <EOH>The fundamental principle of laser h...
```

**Chunked Text Sample:**
```text
Improved melanin-enhanced photothermolysis hair removal method, which includes the application of liposome-encapsulated melanin solutions as a chromophore onto the skin and the use of mechanical devices having microneedles to favor absorption thereof by the hair follicles.
```

**Metadata:**
```json
{
  "application_number": "14787100",
  "publication_number": "US20160135889A1-20160519",
  "filing_date": "20160121",
  "publication_date": "20160519",
  "ipc": [
    "A61B1820",
    "A61Q904",
    "A61K872"
  ],
  "cpc": [
    "A61B18203",
    "A61K872",
    "A61Q904",
    "A61B201800476"
  ],
  "applicant": "USPTO Applicant",
  "language": "en"
}
```

---

### Sample 14: `US-14787391`
- **Patent ID:** `US-14787391`
- **Title:** USE OF INSTANT ASPARAGUS POWDER IN FOOD, MEDICINE AND HEALTH FOOD
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `abstract` & `claims`
- **Quality Score:** `0.9984` (Garbage Ratio: `0.0004`, Broken Word Ratio: `0.0`)

**Original / Docling Text Sample:**
```text
Abstract: Disclosed is use of an asparagus powder in medicines, food, and health foods for treatment of anxiety and depressive mental disorders, with active ingredients in the asparagus powder including: 15.0% 

Claim 1: 1. Use of an asparagus powder in preparing medicines for treatment of anxiety and depressive mental disorders, with active ingredients in the asparagus powder including: 15.0% or more of an asparagus 
```

**Cleaned Text Sample:**
```text
Disclosed is use of an asparagus powder in medicines, food, and health foods for treatment of anxiety and depressive mental disorders, with active ingredients in the asparagus powder including: 15.0% or more of an asparagus saponin, 8% or more of a polysaccharide, 3.0% or more of a polyphenol, and 2.0% or more of a flavone.

<SOH> BACKGROUND ART <E...
```

**Chunked Text Sample:**
```text
Disclosed is use of an asparagus powder in medicines, food, and health foods for treatment of anxiety and depressive mental disorders, with active ingredients in the asparagus powder including: 15.0% or more of an asparagus saponin, 8% or more of a polysaccharide, 3.0% or more of a polyphenol, and 2.0% or more of a flavone.
```

**Metadata:**
```json
{
  "application_number": "14787391",
  "publication_number": "US20160129067A1-20160512",
  "filing_date": "20160126",
  "publication_date": "20160512",
  "ipc": [
    "A61K368965",
    "A61K919"
  ],
  "cpc": [
    "A61K368965",
    "A61K919",
    "A23L13002",
    "A23L12121",
    "A61K223637",
    "A61K223651",
    "A23V200200"
  ],
  "applicant": "USPTO Applicant",
  "language": "en"
}
```

---

### Sample 15: `US-14889822`
- **Patent ID:** `US-14889822`
- **Title:** DIKETOPYRROLOPYRROLE POLYMER AND ORGANIC ELECTRONIC DEVICE CONTAINING SAME
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `abstract` & `claims`
- **Quality Score:** `0.9961` (Garbage Ratio: `0.001`, Broken Word Ratio: `0.0`)

**Original / Docling Text Sample:**
```text
Abstract: The present invention relates to a diketopyrrolopyrrole polymer, which is an organic semiconductor compound for an organic electronic device, and a use thereof. The diketopyrrolopyrrole polymer accord

Claim 1: 1. A diketopyrrolopyrrole polymer represented by the following Chemical Formula 1. [In Chemical Formula 1, R1 and R2 are R11 and R12 are each independently (C10-C50)alkyl, and z is an integer of 3 to 
```

**Cleaned Text Sample:**
```text
The present invention relates to a diketopyrrolopyrrole polymer, which is an organic semiconductor compound for an organic electronic device, and a use thereof. The diketopyrrolopyrrole polymer according to the present invention is a novel organic semiconductor compound having high π-electron stacking by introducing an electron donor compound, and ...
```

**Chunked Text Sample:**
```text
The present invention relates to a diketopyrrolopyrrole polymer, which is an organic semiconductor compound for an organic electronic device, and a use thereof. The diketopyrrolopyrrole polymer according to the present invention is a novel organic semiconductor compound having high π-electron stacking by introducing an electron donor compound, and ...
```

**Metadata:**
```json
{
  "application_number": "14889822",
  "publication_number": "US20160118588A1-20160428",
  "filing_date": "20160119",
  "publication_date": "20160428",
  "ipc": [
    "H01L5100",
    "C08G6112",
    "C07D48704"
  ],
  "cpc": [
    "H01L510036",
    "C07D48704",
    "C08G61126",
    "C08G61124",
    "C08G61123",
    "H01L510043",
    "C08G226118",
    "C08G22613223",
    "C08G22613241",
    "C08G22613225",
    "C08G22613327",
    "C08G226192",
    "C08G2261592",
    "C08G2261124",
    "H01L510545"
  ],
  "applicant": "USPTO Applicant",
  "language": "en"
}
```

---

### Sample 16: `US-14890005`
- **Patent ID:** `US-14890005`
- **Title:** CURABLE EPOXY RESIN COMPOSITION AND CURED PRODUCT THEREOF, DIOLEFIN COMPOUND AND PRODUCTION METHOD THEREFOR, AND PRODUCTION METHOD FOR DIEPOXY COMPOUND
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `abstract` & `claims`
- **Quality Score:** `0.9919` (Garbage Ratio: `0.002`, Broken Word Ratio: `0.0`)

**Original / Docling Text Sample:**
```text
Abstract: An object of the present invention is to provide a curable epoxy resin composition, which is cured to provide a cured product having a high glass-transition temperature and particularly having excelle

Claim 1: 1. A curable epoxy resin composition comprising an alicyclic epoxy compound (A) represented by the following formula (1): wherein R1 to R22, which may be the same or different, each represent a hydrog
```

**Cleaned Text Sample:**
```text
An object of the present invention is to provide a curable epoxy resin composition, which is cured to provide a cured product having a high glass-transition temperature and particularly having excellent balance between heat resistance and transparency. The present invention relates to a curable epoxy resin composition comprising an alicyclic epoxy ...
```

**Chunked Text Sample:**
```text
An object of the present invention is to provide a curable epoxy resin composition, which is cured to provide a cured product having a high glass-transition temperature and particularly having excellent balance between heat resistance and transparency. The present invention relates to a curable epoxy resin composition comprising an alicyclic epoxy ...
```

**Metadata:**
```json
{
  "application_number": "14890005",
  "publication_number": "US20160122466A1-20160505",
  "filing_date": "20160119",
  "publication_date": "20160505",
  "ipc": [
    "C08G5926",
    "C07C43162",
    "C07C4116",
    "C07D30103"
  ],
  "cpc": [
    "C08G5926",
    "C07D30103",
    "C07C43162",
    "C07C4116",
    "C07C210116"
  ],
  "applicant": "USPTO Applicant",
  "language": "en"
}
```

---

### Sample 17: `US-14890445`
- **Patent ID:** `US-14890445`
- **Title:** METHOD FOR PREPARATION OF 1-CYCLOPROPYL-6-FLUORO-1,4-DIHYDRO-8-METHOXY-7-[(4AS,7AS)-OCTAHYDRO-6H-PYRROLO[3,4-B]PYRIDIN-6-YL]-4-OXO-3-QUINOLINECARBOXYLIC ACID
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `abstract` & `claims`
- **Quality Score:** `0.9997` (Garbage Ratio: `0.0001`, Broken Word Ratio: `0.0`)

**Original / Docling Text Sample:**
```text
Abstract: This invention relates to methods for preparation of chemical compound 1-cyclopropyl-6-fluoro-1,4-dihydro-8-methoxy-7-[(4a8,7aS)-octahydro-6H-pyrrolo[3,4-b]pyridin-6-yl]-4-oxo-3-quinolinecarboxylic ac

Claim 1: 1. A method for preparation of a compound of formula (6) comprising the steps of: a) introducing tert-butyloctahydro-1H-pyrrolo[3,4b]pyridine-1-carboxylate into the compound of formula (1) to form a c
```

**Cleaned Text Sample:**
```text
This invention relates to methods for preparation of chemical compound 1-cyclopropyl-6-fluoro-1,4-dihydro-8-methoxy-7-[(4a8,7aS)-octahydro-6H-pyrrolo[3,4-b]pyridin-6-yl]-4-oxo-3-quinolinecarboxylic acid, which comprise addition of heterocyclic amine containing protecting group, to ethyl-3-oxo-3-(2,4,5-trifluoro-3-methoxyphenyl)propanoate, followed ...
```

**Chunked Text Sample:**
```text
This invention relates to methods for preparation of chemical compound 1-cyclopropyl-6-fluoro-1,4-dihydro-8-methoxy-7-[(4a8,7aS)-octahydro-6H-pyrrolo[3,4-b]pyridin-6-yl]-4-oxo-3-quinolinecarboxylic acid, which comprise addition of heterocyclic amine containing protecting group, to ethyl-3-oxo-3-(2,4,5-trifluoro-3-methoxyphenyl)propanoate, followed ...
```

**Metadata:**
```json
{
  "application_number": "14890445",
  "publication_number": "US20160159788A1-20160609",
  "filing_date": "20160127",
  "publication_date": "20160609",
  "ipc": [
    "C07D47104"
  ],
  "cpc": [
    "C07D47104"
  ],
  "applicant": "USPTO Applicant",
  "language": "en"
}
```

---

### Sample 18: `US-14891054`
- **Patent ID:** `US-14891054`
- **Title:** METHOD FOR SCREEING CANCER METASTASIS INHIBITOR USING CULTURE OF CELLS OR SPHEROIDICALLY AGGREGATED CELLS IN WHICH LYSYL-TRNA SYNTHETASE IS REGULATED TO BE EXPRESSED OR UNEXPRESSED
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `abstract` & `claims`
- **Quality Score:** `0.9951` (Garbage Ratio: `0.0012`, Broken Word Ratio: `0.0`)

**Original / Docling Text Sample:**
```text
Abstract: The present invention relates to a method for scanning a cancer metastasis inhibitor by analyzing the activity of lysyl-tRNA synthetase (KRS) in a cancer cell line cultured in a three-dimensional coll

Claim 1: 1. A method for screening a cancer metastasis inhibitor comprising the following steps: 1) culturing a cancer cell line or aggregated cancer cells wherein lysyl-tRNA synthetase (KRS) is regulated to b
```

**Cleaned Text Sample:**
```text
The present invention relates to a method for scanning a cancer metastasis inhibitor by analyzing the activity of lysyl-tRNA synthetase (KRS) in a cancer cell line cultured in a three-dimensional collagen gel environment, and to a method for monitoring the dissemination of cancer cells from aggregated cancer cells, and the epithelial-mesenchymal tr...
```

**Chunked Text Sample:**
```text
The present invention relates to a method for scanning a cancer metastasis inhibitor by analyzing the activity of lysyl-tRNA synthetase (KRS) in a cancer cell line cultured in a three-dimensional collagen gel environment, and to a method for monitoring the dissemination of cancer cells from aggregated cancer cells, and the epithelial-mesenchymal tr...
```

**Metadata:**
```json
{
  "application_number": "14891054",
  "publication_number": "US20160146815A1-20160526",
  "filing_date": "20160104",
  "publication_date": "20160526",
  "ipc": [
    "G01N33573",
    "G01N33574",
    "C12Q168"
  ],
  "cpc": [
    "G01N33573",
    "C12Q16886",
    "G01N33574",
    "G01N23339015",
    "G01N23334704",
    "C12Q2600136",
    "C12Q2600158",
    "G01N250010",
    "G01N250004"
  ],
  "applicant": "USPTO Applicant",
  "language": "en"
}
```

---

### Sample 19: `US-14891792`
- **Patent ID:** `US-14891792`
- **Title:** DESIGNED ANKYRIN REPEAT PROTEINS BINDING TO HEPATOCYTE GROWTH FACTOR
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `abstract` & `claims`
- **Quality Score:** `0.9944` (Garbage Ratio: `0.0014`, Broken Word Ratio: `0.0`)

**Original / Docling Text Sample:**
```text
Abstract: New designed ankyrin repeat proteins with binding specificity for HGF are described, as well as nucleic acids encoding such HGF binding proteins, pharmaceutical compositions comprising such proteins a

Claim 1: 1. A recombinant binding protein comprising at least one ankyrin repeat domain, wherein said ankyrin repeat domain binds HGF in PBS with a dissociation constant (KD) below 10−7M. 2-15. (canceled)
```

**Cleaned Text Sample:**
```text
New designed ankyrin repeat proteins with binding specificity for HGF are described, as well as nucleic acids encoding such HGF binding proteins, pharmaceutical compositions comprising such proteins and the use of such proteins in the treatment of diseases.

<SOH> BACKGROUND OF THE INVENTION <EOH>The MET proto-oncogene encodes a receptor tyrosine k...
```

**Chunked Text Sample:**
```text
New designed ankyrin repeat proteins with binding specificity for HGF are described, as well as nucleic acids encoding such HGF binding proteins, pharmaceutical compositions comprising such proteins and the use of such proteins in the treatment of diseases.
```

**Metadata:**
```json
{
  "application_number": "14891792",
  "publication_number": "US20160251404A1-20160901",
  "filing_date": "20160119",
  "publication_date": "20160901",
  "ipc": [
    "C07K1447"
  ],
  "cpc": [
    "C07K1447",
    "C07K231820",
    "A61K3800"
  ],
  "applicant": "USPTO Applicant",
  "language": "en"
}
```

---

### Sample 20: `US-14893430`
- **Patent ID:** `US-14893430`
- **Title:** NOVEL COMPOUND DERIVED FROM PLANT OF GENUS QUAMOCLIT AND COMPOSITION CONTAINING SAME AS ACTIVE INGREDIENT FOR PREVENTING OR TREATING DIABETES
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `abstract` & `claims`
- **Quality Score:** `0.998` (Garbage Ratio: `0.0005`, Broken Word Ratio: `0.0`)

**Original / Docling Text Sample:**
```text
Abstract: The present invention provides a novel compound isolated from a plant of the genus Quamoclit and a method for preparing a novel compound isolated from a plant of the genus Quamoclit through chemical s

Claim 1: 1. A compound represented by the following chemical formula 1: wherein R1 and R2 are each independently hydrogen, C1-20 alkyl, C6-30 aryl, C2-20 allyl, or C6-30 arylalkyl or acyl, and wherein the alky
```

**Cleaned Text Sample:**
```text
The present invention provides a novel compound isolated from a plant of the genus Quamoclit and a method for preparing a novel compound isolated from a plant of the genus Quamoclit through chemical synthesis, and relates to a novel compound and a composition containing the novel compound as an active ingredient for preventing or treating diabetes ...
```

**Chunked Text Sample:**
```text
The present invention provides a novel compound isolated from a plant of the genus Quamoclit and a method for preparing a novel compound isolated from a plant of the genus Quamoclit through chemical synthesis, and relates to a novel compound and a composition containing the novel compound as an active ingredient for preventing or treating diabetes ...
```

**Metadata:**
```json
{
  "application_number": "14893430",
  "publication_number": "US20160130293A1-20160512",
  "filing_date": "20160115",
  "publication_date": "20160512",
  "ipc": [
    "C07H1504",
    "C12P1944",
    "A61K3639",
    "A61K317028",
    "A61K4506"
  ],
  "cpc": [
    "C07H1504",
    "A61K317028",
    "A61K4506",
    "A61K3639",
    "C12P1944",
    "A23L13002",
    "A23V200200"
  ],
  "applicant": "USPTO Applicant",
  "language": "en"
}
```

---

## Part 2: Sample Chunks (Structure-Aware Chunking Verification)

### Chunk Sample 1: `USA-CHK-0000-7feed9f7`
- **Patent ID:** `US-13144833`
- **Title:** ROSACEA TREATMENTS AND KITS FOR PERFORMING THEM
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `abstract`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `78`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
Regimen for the treatment of rosacea include the application of an anti-redness composition to at least a portion of the cleansed area of skin afflicted with rosacea. The regimen may include the application of one or more of a polymetal complex, a composition containing metronidazole, and/or a protective composition. Kits containing components useful in performing such regimens are also described.
```

### Chunk Sample 2: `USA-CHK-0001-fc191b6f`
- **Patent ID:** `US-13144833`
- **Title:** ROSACEA TREATMENTS AND KITS FOR PERFORMING THEM
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `background`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `768`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
<SOH> BACKGROUND <EOH>Rosacea is a chronic inflammatory disease that occurs primarily in fair skinned people. By some recent estimates rosacea afflicts 13 million Americans. It usually first appears as subtle reddening on the face. Over time this may develop into inflammation, be accompanied by skin eruptions, and in the appearance of red lines which result from swollen or damaged veins and capill
... [TRUNCATED FOR INSPECTION PREVIEW] ...
```

### Chunk Sample 3: `USA-CHK-0002-418f4e6c`
- **Patent ID:** `US-13144833`
- **Title:** ROSACEA TREATMENTS AND KITS FOR PERFORMING THEM
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `summary`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `374`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
<SOH> SUMMARY <EOH>The present disclosure provides a treatment regimen including cleansing at least a portion of an area of skin afflicted with rosacea with a cleanser; applying a composition containing metronidazole to at least a portion of the afflicted area; and applying an anti-redness composition to at least a portion of the cleansed and metronidazole-treated area. The present disclosure also
... [TRUNCATED FOR INSPECTION PREVIEW] ...
```

### Chunk Sample 4: `USA-CHK-0003-14b90af4`
- **Patent ID:** `US-13144833`
- **Title:** ROSACEA TREATMENTS AND KITS FOR PERFORMING THEM
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `claims`
- **Claim Number:** `1`
- **Estimated Tokens:** `1297`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
Claim 1: 1. A treatment regimen comprising: cleansing at least a portion of an area of skin afflicted with rosacea with an antimicrobial or cleanser; applying an anti-redness composition to at least a portion of the cleansed area; and applying a protective composition to at least a portion of the cleansed, and moisturized area.

Claim 2: 2. A treatment regimen as in claim 1 further comprising the 
... [TRUNCATED FOR INSPECTION PREVIEW] ...
```

### Chunk Sample 5: `USA-CHK-0004-3841ec45`
- **Patent ID:** `US-13144833`
- **Title:** ROSACEA TREATMENTS AND KITS FOR PERFORMING THEM
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `claims`
- **Claim Number:** `38`
- **Estimated Tokens:** `141`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
Claim 38: 38. A method of treating skin afflicted with rosacea comprising sequentially applying a cleanser, an anti-redness composition, and a protective composition to at least a portion of the afflicted area.

Claim 39: 39. The method of claim of claim 38 further comprising applying a composition containing metronidazole to at least a portion of the afflicted area.

Claim 40: 40. The method of c
... [TRUNCATED FOR INSPECTION PREVIEW] ...
```

### Chunk Sample 6: `USA-CHK-0005-fa6774e6`
- **Patent ID:** `US-13144833`
- **Title:** ROSACEA TREATMENTS AND KITS FOR PERFORMING THEM
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `description`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `1185`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
CROSS REFERENCE TO RELATED APPLICATION This application claims priority benefit of U.S. Application No. 61/146,960 filed Jan. 23, 2009 and U.S. Application No. 61/225,041 filed Jul. 13, 2009, the entire disclosures of which are incorporated herein by this reference. TECHNICAL FIELD The present disclosure relates to compositions and methods for the treatment of rosacea. BACKGROUND Rosacea is a chro
... [TRUNCATED FOR INSPECTION PREVIEW] ...
```

### Chunk Sample 7: `USA-CHK-0006-200f2ea0`
- **Patent ID:** `US-13144833`
- **Title:** ROSACEA TREATMENTS AND KITS FOR PERFORMING THEM
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `description`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `1199`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
The kit includes a cleanser; a composition containing a polymetal complex; and a protective composition. DETAILED DESCRIPTION OF PREFERRED EMBODIMENTS The present disclosure describes methods for treating skin afflicted with rosacea which include the sequential application of certain products. In embodiments, the disclosure includes sequential application of: a) a cleanser; b) a composition contai
... [TRUNCATED FOR INSPECTION PREVIEW] ...
```

### Chunk Sample 8: `USA-CHK-0007-4f4e4802`
- **Patent ID:** `US-13144833`
- **Title:** ROSACEA TREATMENTS AND KITS FOR PERFORMING THEM
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `description`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `1177`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
Generally any agent offering protection against ultraviolet radiation by absorbing, scattering or reflecting the ultraviolet radiation may be used herein. The sunscreen agents used herein may offer protection against one or more of the following forms of solar radiation: UVA; UVB; UVC; visible light; and infrared radiation. Generally the sunprotection factor (SPF) of the final formulation varies b
... [TRUNCATED FOR INSPECTION PREVIEW] ...
```

### Chunk Sample 9: `USA-CHK-0008-f9735232`
- **Patent ID:** `US-13144833`
- **Title:** ROSACEA TREATMENTS AND KITS FOR PERFORMING THEM
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `description`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `1192`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
In embodiments, the polymetal complex, e.g., Cu/Zn malonate is combined with a moisturizer and applied to the afflicted skin. The polymetal complex may be applied alone, following cleansing, or as a moisturizer. When used in the present regimens as a moisturizer, the polymetal complex improves capillary elasticity. The polymetal complex can be the reaction product of a polyfunctional compound with
... [TRUNCATED FOR INSPECTION PREVIEW] ...
```

### Chunk Sample 10: `USA-CHK-0009-23264f54`
- **Patent ID:** `US-13144833`
- **Title:** ROSACEA TREATMENTS AND KITS FOR PERFORMING THEM
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `description`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `1172`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
Suitable non-limiting examples of elements listed in group IB of The Periodic Table of Elements include copper, silver, and gold. Suitable non-limiting examples of coordination elements include aluminum, scandium, titanium, vanadium, chromium, manganese, iron, cobalt, nickel, copper, zinc, gallium, yttrium, zirconium, niobium, molybdenum, technetium, ruthenium, rhodium, palladium, silver, cadmium,
... [TRUNCATED FOR INSPECTION PREVIEW] ...
```

### Chunk Sample 11: `USA-CHK-0010-ab05d5d0`
- **Patent ID:** `US-13144833`
- **Title:** ROSACEA TREATMENTS AND KITS FOR PERFORMING THEM
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `description`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `1194`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
TABLE A Ingredient Description (function) Amount Water Phase Distilled Water (solvent, humectant) 69.4940 PHENONIP Phenoxyethanol, Methylparaben, Ethylparaben, 0.8000 Butylparaben, Propylparaben, Isobutylparaben (preservative) Propylene Glycol (humectant) 1.5000 Glycerin (humectant) 2.5000 Veegum Granules Magnesium Aluminum Silicate 0.4000 (suspending agent) Keltrol CG Xanthan Gum 0.6000 (viscosit
... [TRUNCATED FOR INSPECTION PREVIEW] ...
```

### Chunk Sample 12: `USA-CHK-0011-84c5b9d1`
- **Patent ID:** `US-13144833`
- **Title:** ROSACEA TREATMENTS AND KITS FOR PERFORMING THEM
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `description`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `1105`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
The Oil Phase is then added to the Water Phase with continued stirring until a homogeneous dispersion is achieved. The Additional Ingredients are then added with stirring. TABLE B Ingredients Percent INCI Names Functionality Water Phase Distilled Water 54.08 Water Solvent, Moisturizer Phenonip 1.00 Phenoxyethanol, Methylparaben, Ethylparaben, Preservative Butylparaben, Propylparaben, Isobutylparab
... [TRUNCATED FOR INSPECTION PREVIEW] ...
```

### Chunk Sample 13: `USA-CHK-0012-98a1a5c1`
- **Patent ID:** `US-13144833`
- **Title:** ROSACEA TREATMENTS AND KITS FOR PERFORMING THEM
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `description`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `1192`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
TABLE E Ingredients Percent INCI Names Functionality Water Phase Distilled Water 54.08 Water Solvent, Moisturizer Phenonip 1.00 Phenoxyethanol, Methylparaben, Ethylparaben, Preservative Butylparaben, Propylparaben, Isobutylparaben Carbowax 300 2.25 PEG - 6 Humectant, solvent Glycerin 0.50 Glycerin Humectant, skin conditioner Di-Propylene Glycol 2.25 Dipropylene Glycol Humectant, solvent Keltrol CG
... [TRUNCATED FOR INSPECTION PREVIEW] ...
```

### Chunk Sample 14: `USA-CHK-0013-6e734da7`
- **Patent ID:** `US-13144833`
- **Title:** ROSACEA TREATMENTS AND KITS FOR PERFORMING THEM
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `description`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `1073`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
Subjects willing to refrain from excessive sun exposure and refrain from using tanning booths during the entire course of the study. Exclusion Criteria 1. If female of childbearing potential: Pregnant or lactating as determined by urine pregnancy test if not surgically sterile or post-menopausal at least 5 years. 2. Allergy to benzoyl peroxide or salicylic acid. 3. Any facial skin disease, which c
... [TRUNCATED FOR INSPECTION PREVIEW] ...
```

### Chunk Sample 15: `USA-CHK-0014-a1dd615e`
- **Patent ID:** `US-13144833`
- **Title:** ROSACEA TREATMENTS AND KITS FOR PERFORMING THEM
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `description`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `542`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
Scale for Scoring Redness/Irritation 0=No irritation present 1-3=Mild irritation present 4-6=Moderate irritation present 7-9=Severe irritation present Scale for Sensory Evaluation (stinging [S]), burning [B]) (itching [I]) 0 = None - no stinging/burning 0 = No itching 1-3 = Mild - light warm, tingling 1-3 = Mild - occasional, slight sensation, not really bothersome itching 4-6 = Moderate - definit
... [TRUNCATED FOR INSPECTION PREVIEW] ...
```

### Chunk Sample 16: `USA-CHK-0000-bb69f309`
- **Patent ID:** `US-14655041`
- **Title:** VACCINES AGAINST HEPATITIS B VIRUS
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `abstract`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `139`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
A pharmaceutical composition comprising at least two peptides of from 15 to 60 amino acids in length, selected from peptides comprising a sequence of at least 15 contiguous amino acids of one of the sequences shown in SEQ ID NOs: 1 to 4 or of a sequence having at least 80% identity to one of the sequences shown in SEQ ID NOs: to 4, wherein each peptide comprises at least one CD8+ T-cell epitope an
... [TRUNCATED FOR INSPECTION PREVIEW] ...
```

### Chunk Sample 17: `USA-CHK-0001-999992ed`
- **Patent ID:** `US-14655041`
- **Title:** VACCINES AGAINST HEPATITIS B VIRUS
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `background`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `525`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
<SOH> BACKGROUND TO THE INVENTION <EOH>Hepatitis B virus (HBV) infection is a major cause of liver-related morbidity and mortality in Europe and worldwide. An estimated 650,000 individuals die each year from liver failure or hepatocellular carcinoma. Even though vaccination programs have led to declines in de novo HBV infections in many countries, chronic hepatitis B (CHB) is a rapidly growing pro
... [TRUNCATED FOR INSPECTION PREVIEW] ...
```

### Chunk Sample 18: `USA-CHK-0002-96a68716`
- **Patent ID:** `US-14655041`
- **Title:** VACCINES AGAINST HEPATITIS B VIRUS
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `summary`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `1185`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
<SOH> SUMMARY OF THE INVENTION <EOH>The present inventors have identified regions of the HBV proteome that have a high degree of conservation between different HBV genotypes and that have unexpectedly better immunogenic properties compared to other similarly conserved regions of HBV proteins. In particular, the inventors have unexpectedly shown using an in vitro assay that peptide sequences within
... [TRUNCATED FOR INSPECTION PREVIEW] ...
```

### Chunk Sample 19: `USA-CHK-0003-3004cbb4`
- **Patent ID:** `US-14655041`
- **Title:** VACCINES AGAINST HEPATITIS B VIRUS
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `summary`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `68`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
The invention also provides a peptide comprising one of the sequences shown in SEQ ID NOs: 24 to 38, or a sequence having at least 80% identity to one of the sequences shown in SEQ ID NOs: 24 to 38. The peptide of the invention may be covalently linked to a fluorocarbon vector.
```

### Chunk Sample 20: `USA-CHK-0004-6926f1fd`
- **Patent ID:** `US-14655041`
- **Title:** VACCINES AGAINST HEPATITIS B VIRUS
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `claims`
- **Claim Number:** `1`
- **Estimated Tokens:** `1125`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
Claim 1: 1. A pharmaceutical composition comprising at least two peptides of from 15 to 60 amino acids in length, selected from peptides comprising a sequence of at least 15 contiguous amino acids of one of the sequences shown in SEQ ID NOs: 1 to 4 or of a sequence having at least 80% identity to one of the sequences shown in SEQ ID NOs: 1 to 4, wherein each peptide comprises at least one CD8+ T-c
... [TRUNCATED FOR INSPECTION PREVIEW] ...
```

### Chunk Sample 21: `USA-CHK-0005-4f477260`
- **Patent ID:** `US-14655041`
- **Title:** VACCINES AGAINST HEPATITIS B VIRUS
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `claims`
- **Claim Number:** `18`
- **Estimated Tokens:** `859`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
Claim 18: 18. The composition of any one of the preceding claims, which further comprises at least one peptides of from 15 to 60 amino acids in length comprising a sequence of at least 15 contiguous amino acids of the sequence shown in SEQ ID NO: 55 or of a sequence having at least 80% identity to at least 15 contiguous amino acids of the sequence shown in SEQ ID NO: 55, wherein the peptide compri
... [TRUNCATED FOR INSPECTION PREVIEW] ...
```

### Chunk Sample 22: `USA-CHK-0006-e8b0fab5`
- **Patent ID:** `US-14655041`
- **Title:** VACCINES AGAINST HEPATITIS B VIRUS
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `description`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `1176`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
FIELD OF THE INVENTION The present invention relates to an immunogenic HBV peptide composition and to the treatment of HBV using the composition. BACKGROUND TO THE INVENTION Hepatitis B virus (HBV) infection is a major cause of liver-related morbidity and mortality in Europe and worldwide. An estimated 650,000 individuals die each year from liver failure or hepatocellular carcinoma. Even though va
... [TRUNCATED FOR INSPECTION PREVIEW] ...
```

### Chunk Sample 23: `USA-CHK-0007-febf17c8`
- **Patent ID:** `US-14655041`
- **Title:** VACCINES AGAINST HEPATITIS B VIRUS
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `description`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `1175`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
The composition, wherein said composition is capable of eliciting an immune response in PBMC from at least two individuals of different ethnicities and from two individuals infected with different HBV genotypes. The composition may be capable of eliciting an immune response: (a) in PBMC from two, three or all of: an individual infected with HBV genotype A, an individual infected with HBV genotype 
... [TRUNCATED FOR INSPECTION PREVIEW] ...
```

### Chunk Sample 24: `USA-CHK-0008-1f9b4507`
- **Patent ID:** `US-14655041`
- **Title:** VACCINES AGAINST HEPATITIS B VIRUS
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `description`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `1099`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
Following a 10 day culture with an HBV-derived overlapping short peptide pool library (0.1 μg/peptide/mL), PBMC were restimulated in an 18 h IFNγ ELISpot assay with one of pools 24 to 46 of the overlapping peptides, each representing specific regions of the HBV proteome. FIG. 7 shows IFNγ responses to HBV-derived short peptide pools representing 35-40 mer peptides in chronic HBeAg-negative HBV-inf
... [TRUNCATED FOR INSPECTION PREVIEW] ...
```

### Chunk Sample 25: `USA-CHK-0009-5fc7cf69`
- **Patent ID:** `US-14655041`
- **Title:** VACCINES AGAINST HEPATITIS B VIRUS
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `description`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `1171`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
SEQ ID Reference in Region of virtual HBV HBV NO: Examples proteome sequence protein 1 Pools 2/3 93-186 polymerase 2 Pools 4 to 7 211-426 polymerase 3 Pools 12 and 13 592-700 polymerase 4 Pools 14 to 17 703-912 core 5 Pool 2 93-145 polymerase 6 Pool 3 133-186 polymerase 7 Pool 5 + 260-326 polymerase additional N- terminal residues 8 Pool 6 332-384 polymerase 9 Pools 6/7 332-426 polymerase 10 Pools
... [TRUNCATED FOR INSPECTION PREVIEW] ...
```

### Chunk Sample 26: `USA-CHK-0010-63a1c788`
- **Patent ID:** `US-14655041`
- **Title:** VACCINES AGAINST HEPATITIS B VIRUS
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `description`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `1157`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
Exemplary short peptides within SEQ ID NOs: 1 to 4 are shown in SEQ ID NOs: 80 to 117 and 142 to 184. Preferred exemplary short peptides are shown in SEQ ID NOs: 80 to 83, 86 to 89, 98 to 101, 105 to 112, 146 to 150, 163 to 166 and 169 to 181. A composition of the invention may comprise a peptide comprising one or more of these short sequences. Particularly preferred peptides from these HBV polyme
... [TRUNCATED FOR INSPECTION PREVIEW] ...
```

### Chunk Sample 27: `USA-CHK-0011-dfd607f1`
- **Patent ID:** `US-14655041`
- **Title:** VACCINES AGAINST HEPATITIS B VIRUS
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `description`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `1128`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
For example, the peptide may comprise one or more additional amino acids, typically at the N-terminus and/or the C-terminus to enhance the net positive charge of the peptide and/or to reduce the hydrophobicity of the peptide. The net positive charge may be increased so that the peptide has an isoelectric point greater than or equal to 7. In one aspect of the invention, one or more, such as two or 
... [TRUNCATED FOR INSPECTION PREVIEW] ...
```

### Chunk Sample 28: `USA-CHK-0012-889cea64`
- **Patent ID:** `US-14655041`
- **Title:** VACCINES AGAINST HEPATITIS B VIRUS
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `description`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `1176`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
The invention may comprise peptides comprising a sequence of at least 15 contiguous amino acids of any two, three, four, five or all of SEQ ID NOs: 5, 6, 7, 8 and 9 as described above and/or may comprise peptides comprising a sequence of at least 15 contiguous amino acids of any two, three or all of SEQ ID NOs: 10 to 13 as described above. A peptide present in a composition of the invention may co
... [TRUNCATED FOR INSPECTION PREVIEW] ...
```

### Chunk Sample 29: `USA-CHK-0013-515f566e`
- **Patent ID:** `US-14655041`
- **Title:** VACCINES AGAINST HEPATITIS B VIRUS
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `description`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `1181`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
A composition of the invention that is capable of eliciting an immune response in two, three or all of: an individual infected with HBV genotype A, an individual infected with HBV genotype B, an individual infected with HBV genotype C and an individual infected with HBV genotype D may comprise at least one peptide selected from at least two, preferably three or all of the following groups: (i) a p
... [TRUNCATED FOR INSPECTION PREVIEW] ...
```

### Chunk Sample 30: `USA-CHK-0014-dc05115f`
- **Patent ID:** `US-14655041`
- **Title:** VACCINES AGAINST HEPATITIS B VIRUS
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `description`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `1181`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
Despite such polymorphisms, HLA molecules bind overlapping set of peptides, and therefore, may be grouped accordingly into supertypes (Lund et al (2004) Immunogenetics 55(12):797-810, Sette et al (1999) Immunogenetics 50(3-4):201-212). A supertype is defined as a family of different HLA molecules having similar peptide binding repertoire and consequently sharing overlapping sets of peptides. In ot
... [TRUNCATED FOR INSPECTION PREVIEW] ...
```

### Chunk Sample 31: `USA-CHK-0015-e9208b99`
- **Patent ID:** `US-14655041`
- **Title:** VACCINES AGAINST HEPATITIS B VIRUS
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `description`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `1175`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
Each chain typically has from 3 to 30 carbon atoms, from 5 to 25 carbon atoms, or from 8 to 20 carbon atoms. In order to covalently link the fluorocarbon vector to the peptide, a reactive group, or ligand, for example —CO—, —NH—, S, O or any other suitable group is included in the vector. The use of such ligands for achieving covalent linkages is well known in the art. The reactive group may be lo
... [TRUNCATED FOR INSPECTION PREVIEW] ...
```

### Chunk Sample 32: `USA-CHK-0016-b59998c8`
- **Patent ID:** `US-14655041`
- **Title:** VACCINES AGAINST HEPATITIS B VIRUS
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `description`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `1185`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
These peptides may be any of the HBV polymerase peptides described above with reference to the compositions of the invention. Such peptides are typically from 15 to 60 amino acids in length comprise at least 15 contiguous amino acids of SEQ ID NO: 1 or 2 and elicit an immune response in vitro in PBMC from at least one individual chronically infected with HBV. The peptide may be coupled to a carrie
... [TRUNCATED FOR INSPECTION PREVIEW] ...
```

### Chunk Sample 33: `USA-CHK-0017-74bc1074`
- **Patent ID:** `US-14655041`
- **Title:** VACCINES AGAINST HEPATITIS B VIRUS
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `description`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `1144`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
Sterile filtration may include a 0.45 μm filter followed by a 0.22 μm sterilizing grade filter train. Sterilisation may be carried out before or after addition of any excipients and/or adjuvants. The composition of the invention may be in dried, such as lyophilized, form. The composition of the invention may be an aqueous solution, for example an aqueous solution formed by dissolving a lyophilisat
... [TRUNCATED FOR INSPECTION PREVIEW] ...
```

### Chunk Sample 34: `USA-CHK-0018-49acd3ff`
- **Patent ID:** `US-14655041`
- **Title:** VACCINES AGAINST HEPATITIS B VIRUS
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `description`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `1186`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
For example, the second agent may comprise a further immunogen (such as a globular antigen or a recombinant or naturally occurring antigen), to further stimulate an immune response, for example to stimulate a humoral immune response where the fluorocarbon-linked peptide stimulates a cellular immune response, to HBV. It is understood that the second agent can be a B-cell antigen. Suitable B-cell an
... [TRUNCATED FOR INSPECTION PREVIEW] ...
```

### Chunk Sample 35: `USA-CHK-0019-38b27c6f`
- **Patent ID:** `US-14655041`
- **Title:** VACCINES AGAINST HEPATITIS B VIRUS
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `description`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `1196`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
On Day 4, IL-2 and IL-15 were added to the cultures to final concentrations of 10 IU/mL and 10 ng/mL respectively. On Day 10, cells were washed twice in CM and cultured with 10 IU/mL IL-2 for 1 additional day. On Day 11, cells were washed twice in CM, counted and incorporated in a human IFNγ ELISpot assay or intracellular cytokine staining. Human IFNγ ELISpot Assay Ninety-six well multiscreen PVDF
... [TRUNCATED FOR INSPECTION PREVIEW] ...
```

### Chunk Sample 36: `USA-CHK-0020-ba3003b2`
- **Patent ID:** `US-14655041`
- **Title:** VACCINES AGAINST HEPATITIS B VIRUS
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `description`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `1155`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
IFNγ responses of PBMC from both immune control and treated HBV-infected subjects were subsequently grouped according to HBV genotypes A, B, C and D. Some subjects were not classified into these genotypes due to the sensitivity limitations of the assay and possible rare sera being assessed. These subjects were therefore not included in this assessment. Response profiles between the four genotypes 
... [TRUNCATED FOR INSPECTION PREVIEW] ...
```

### Chunk Sample 37: `USA-CHK-0021-12d1ea45`
- **Patent ID:** `US-14655041`
- **Title:** VACCINES AGAINST HEPATITIS B VIRUS
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `description`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `1084`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
of short peptides in pool 24 74, 75, 76, 77, 78, 79 25 80, 81, 82, 83 26 86, 87, 88, 89 27 94, 95, 96, 97 28 98, 99, 100, 101 29 102, 103, 104 30 105, 106, 107, 108, 109 31 109, 110, 111, 112 32 116, 117, 118, 119 33 120, 121, 122, 123 34 137, 138, 139, 140 35 146, 147, 148, 149, 150 36 150, 151, 152, 153, 154 37 152, 153, 154, 155, 156 38 163, 164, 165, 166 39 169, 170, 171 40 172, 173 41 172, 17
... [TRUNCATED FOR INSPECTION PREVIEW] ...
```

### Chunk Sample 38: `USA-CHK-0022-a7e18f0e`
- **Patent ID:** `US-14655041`
- **Title:** VACCINES AGAINST HEPATITIS B VIRUS
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `description`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `1198`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
25 26 28 30 31 35 38 39 42 43 Peptide P113 P151 P277 P360 P376 P645 P753 P797 P856 P877 SEQ ID 14 15 16 17 18 19 20 21 22 23 NOs: 24 25 60 27 28 29 30 67 32 33 26 35 36 31 38 34 37 Genotype A B A D C B B C A C A B A C A D C D D D D Ethnicity OI C OI OI OI C OI OI OI C C C AA C AA AA AA AA AA Eight pools were selected for further analysis of T-cell responses by intracellular cytokine staining. PBMC
... [TRUNCATED FOR INSPECTION PREVIEW] ...
```

### Chunk Sample 39: `USA-CHK-0023-b9b57c8e`
- **Patent ID:** `US-14655041`
- **Title:** VACCINES AGAINST HEPATITIS B VIRUS
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `description`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `1192`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
PBMC were cultured in 2 mL culture medium (CM: RPMI-1640 Glutamax supplemented with 5% human AB serum) in 24 well cell culture plates at a concentration of 1×106 cells/mL for a total of 11 days. Cells were stimulated with a mixture of the nine HBV-derived long peptides described in Example 3. Each peptide was used at a final concentration of 0.1 μg/peptide/mL. On Day 4, IL-2 and IL-15 were added t
... [TRUNCATED FOR INSPECTION PREVIEW] ...
```

### Chunk Sample 40: `USA-CHK-0024-a766bb3c`
- **Patent ID:** `US-14655041`
- **Title:** VACCINES AGAINST HEPATITIS B VIRUS
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `description`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `1136`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
Alternatively, splenocytes were stimulated in vitro with 5 μg/mL/peptide of nine individual peptides for 18 hours in an ELISpot assay. The number of IFNγ+ spot forming cells (SFC) was counted. Plates then were washed with PBS, incubated with an IFNγ detection peroxidase-labelled antibody, followed by a substrate, according to the manufacturer's instructions. The developed spots were counted using 
... [TRUNCATED FOR INSPECTION PREVIEW] ...
```

### Chunk Sample 41: `USA-CHK-0025-4856ead7`
- **Patent ID:** `US-14655041`
- **Title:** VACCINES AGAINST HEPATITIS B VIRUS
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `description`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `708`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
(a) represents the total number binding epitopes detected for each long peptide (b) represents the number of alleles for which positive binding was detected for each long peptide Number of Number of Long HLA- HLA- HLA- HLA- HLA- HLA- HLA- HLA alleles peptide A*0201 A*0301 A*1101 A*2402 B*0702 B*0801 B*3501 binders (a) (b) NP113 2 3 5 3 2 3 2 20 7 NP797(K) 6 1 1 5 4 3 2 22 7 NP151 3 4 3 4 3 4 0 21 
... [TRUNCATED FOR INSPECTION PREVIEW] ...
```

### Chunk Sample 42: `USA-CHK-0000-56e4fb28`
- **Patent ID:** `US-14770850`
- **Title:** PHARMACEUTICAL COMPOUNDS AND USE OF SAME IN CANCER AND TAUOPATHIES
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `abstract`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `101`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
Disclosed are compounds of formula (1)-(V): where the substituents are as provided herein. Further disclosed are methods of inhibiting tau aggregation, treating or ameliorating a tauopathy or cancer by administration of such a compound. Tau is a microtubule-binding protein that accumulates in a number of neurodegenerative disorders, including frontotemporal dementia and Alzheimer's disease (AD). T
... [TRUNCATED FOR INSPECTION PREVIEW] ...
```

### Chunk Sample 43: `USA-CHK-0001-79b0c12b`
- **Patent ID:** `US-14770850`
- **Title:** PHARMACEUTICAL COMPOUNDS AND USE OF SAME IN CANCER AND TAUOPATHIES
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `background`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `690`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
<SOH> BACKGROUND <EOH>Tau is a microtubule-binding protein that accumulates in a number of neurodegenerative disorders, including frontotemporal dementia and Alzheimer's disease (AD). The presence of abnormal tau correlates with neuron loss and memory deficits in patients with AD and other neurodegenerative disorders that involve tau accumulation. Therefore, selectively reducing tau levels or tau 
... [TRUNCATED FOR INSPECTION PREVIEW] ...
```

### Chunk Sample 44: `USA-CHK-0002-cfc32a9a`
- **Patent ID:** `US-14770850`
- **Title:** PHARMACEUTICAL COMPOUNDS AND USE OF SAME IN CANCER AND TAUOPATHIES
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `summary`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `1185`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
<SOH> SUMMARY <EOH>Provided herein are compounds and compositions and their use in anticancer and tauopathy applications. More specifically, provided herein are compounds having a formulae of (I)-(V): wherein R 1 , R 2 , and R 3 are each selected from the group consisting of hydrogen, fluoro, chloro, methoxy, methyl, or trifluoromethyl, R 4 and R 5 are each selected from hydrogen, fluoro, and chlo
... [TRUNCATED FOR INSPECTION PREVIEW] ...
```

### Chunk Sample 45: `USA-CHK-0003-bce8e769`
- **Patent ID:** `US-14770850`
- **Title:** PHARMACEUTICAL COMPOUNDS AND USE OF SAME IN CANCER AND TAUOPATHIES
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `summary`
- **Claim Number:** `N/A`
- **Estimated Tokens:** `939`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
The tauopathy can be from Alzheimer's disease, Pick's disease, Progressive Supranuclear Palsy (PSP), fronto-temporal dementia (FTD), parkinsonism linked to chromosome 17 (FTDP-17), disinhibition-dementia-parkinsonism-amyotrophy complex (DDPAC), pallido-ponto-nigral degeneration (PPND), Guam-ALS syndrome, pallido-nigro-luysian degeneration (PNLD), Huntington's disease, Kennedy disease, dentatorubro
... [TRUNCATED FOR INSPECTION PREVIEW] ...
```

### Chunk Sample 46: `USA-CHK-0004-68697916`
- **Patent ID:** `US-14770850`
- **Title:** PHARMACEUTICAL COMPOUNDS AND USE OF SAME IN CANCER AND TAUOPATHIES
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `claims`
- **Claim Number:** `1`
- **Estimated Tokens:** `1336`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
Claim 1: 1. A compound having a structure of formula (I): wherein R1, R2, and R3 are each selected from the group consisting of hydrogen, fluoro, chloro, methoxy, methyl, or trifluoromethyl, R4 and R5 are each selected from hydrogen, fluoro, and chloro, R6 is C1-C4 alkyl or CH2Ar; Ar is aryl; R7 is ethyl, allyl, or benzyl; X is a pharmaceutically acceptable anion, and m is 1, 2, or 3; with the pro
... [TRUNCATED FOR INSPECTION PREVIEW] ...
```

### Chunk Sample 47: `USA-CHK-0005-ad3133cf`
- **Patent ID:** `US-14770850`
- **Title:** PHARMACEUTICAL COMPOUNDS AND USE OF SAME IN CANCER AND TAUOPATHIES
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `claims`
- **Claim Number:** `49`
- **Estimated Tokens:** `1329`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
Claim 49: 49. The compound of claim 48, wherein Ar is phenyl substituted with two substituents.

Claim 50: 50. The compound of claim 48, wherein Ar is phenyl substituted with three or four fluoro.

Claim 51: 51. The compound of claim 48, wherein Ar is phenyl substituted with three or four chloro.

Claim 52: 52. The compound of any one of claims 30 to 51, wherein R7 is ethyl.

Claim 53: 53. The com
... [TRUNCATED FOR INSPECTION PREVIEW] ...
```

### Chunk Sample 48: `USA-CHK-0006-4f376b4a`
- **Patent ID:** `US-14770850`
- **Title:** PHARMACEUTICAL COMPOUNDS AND USE OF SAME IN CANCER AND TAUOPATHIES
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `claims`
- **Claim Number:** `100`
- **Estimated Tokens:** `1228`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
Claim 100: 100. The compound of any one of claims 83 to 97, wherein each of R1, R3, and R8 is hydrogen and R2 is selected from NH2, nitro, fluoro, chloro, trifluoromethyl, methoxy, ethoxy, methyl, ethyl, propyl, isopropyl, SO2Me, and cyano.

Claim 101: 101. The compound of any one of claims 83 to 97, wherein each of R1, R2, and R8 is hydrogen and R3 is selected from NH2, nitro, fluoro, chloro, tri
... [TRUNCATED FOR INSPECTION PREVIEW] ...
```

### Chunk Sample 49: `USA-CHK-0007-fc9e24a4`
- **Patent ID:** `US-14770850`
- **Title:** PHARMACEUTICAL COMPOUNDS AND USE OF SAME IN CANCER AND TAUOPATHIES
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `claims`
- **Claim Number:** `126`
- **Estimated Tokens:** `1320`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
Claim 126: 126. A method of inhibiting tau protein aggregate formation in a cell comprising contacting the cell with the compound of any one of claims 1 to 104 or the composition of claim 105 in an amount effective to inhibit tau protein aggregate formation.

Claim 127: 127. The method of claim 126, wherein the contacting comprises administering to a subject in need thereof.

Claim 128: 128. The m
... [TRUNCATED FOR INSPECTION PREVIEW] ...
```

### Chunk Sample 50: `USA-CHK-0008-74b26752`
- **Patent ID:** `US-14770850`
- **Title:** PHARMACEUTICAL COMPOUNDS AND USE OF SAME IN CANCER AND TAUOPATHIES
- **Country:** `USA`
- **Source:** `Harvard USPTO Patent Dataset (HUPD) - Utility Applications`
- **Section:** `claims`
- **Claim Number:** `168`
- **Estimated Tokens:** `111`
- **Quality Score:** `1.0` (Structure Validated)

**Chunked Text Sample:**
```text
Claim 168: 168. The method of any one of claims 161 to 163, wherein the subject suffers from cancer.

Claim 169: 169. The method of claim 165, wherein the cancer is breast cancer or myeloma.

Claim 170: 170. The method of claim 168 or 169, further comprising administering a second therapeutic, wherein the second therapeutic is a chemotherapeutic, an immunotherapeutic agent, a proteasome inhibitor,
... [TRUNCATED FOR INSPECTION PREVIEW] ...
```
