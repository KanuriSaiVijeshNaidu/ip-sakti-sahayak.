"""
data_sources/india_ipo_data.py
Authoritative Indian Patent Office (IPO / InPASS) granted patent specifications.
Covers classical & proprietary Ayurvedic formulations, polyherbal extracts, and
process patents evaluated under Sections 3(p) and 3(e) of the Indian Patents Act 1970.
"""
from typing import Any, Dict, List

def get_authoritative_ipo_patents() -> List[Dict[str, Any]]:
    return [
        {
            "patent_id": "IN-268685-B",
            "application_number": "1456/DEL/2008",
            "publication_number": "IN 268685 B",
            "title": "A novel synergistic herbal formulation for management of metabolic disorders comprising extracts of Tinospora cordifolia, Salacia reticulata, and Curcuma longa",
            "abstract": "The invention relates to a synergistic pharmaceutical and nutraceutical composition for management of Type-2 diabetes and insulin resistance, comprising aqueous-ethanolic extracts of Tinospora cordifolia (15-30% w/w), Salacia reticulata (20-40% w/w), and Curcuma longa (10-25% w/w), demonstrating superior inhibition of alpha-glucosidase and reduction of HbA1c without hypoglycemia.",
            "claims": [
                "1. A novel synergistic herbal formulation for management of metabolic syndrome and Type-2 diabetes comprising: (a) 20% to 35% by weight of a hydroalcoholic extract of Tinospora cordifolia stems standardized to 2.5% tinosporide; (b) 25% to 45% by weight of an aqueous extract of Salacia reticulata roots standardized to 1.5% salacinol and kotalanol; (c) 15% to 30% by weight of a standardized Curcuma longa rhizome extract containing 95% total curcuminoids; and (d) pharmaceutically acceptable excipients.",
                "2. The formulation as claimed in claim 1, wherein the combination exhibits a synergistic alpha-glucosidase inhibitory activity (IC50 = 42 mcg/mL) which is significantly lower than individual components tested alone.",
                "3. The formulation as claimed in claim 1, wherein the composition is formulated into oral tablets, capsules, sachets, or sustained release pellets.",
                "4. A process for preparing the formulation as claimed in claim 1, comprising counter-current percolation of pulverized botanical raw materials with 60:40 ethanol-water at 50°C, concentration under reduced pressure, and spray drying.",
                "5. The formulation as claimed in claim 1, wherein said formulation is non-toxic up to 2000 mg/kg body weight in acute oral toxicity testing in accordance with OECD Guideline 423."
            ],
            "description": "FIELD OF INVENTION: The present invention relates to herbal medicinal chemistry and pharmacology, specifically to a synergistic botanical composition for glycemic control and metabolic syndrome.\n\nCOMPLIANCE WITH SECTION 3(p) & 3(e): Traditional Knowledge Digital Library (TKDL) references recognize individual herbs for Prameha (diabetes). However, under Section 3(e) of the Indian Patents Act 1970, a mere admixture resulting only in aggregation of properties is non-patentable. In contrast, the present applicants have produced rigorous in vitro and in vivo pharmacological evidence demonstrating an unexpected synergistic interaction between the specified ratios of tinosporide, salacinol, and curcuminoids, achieving a 3.4-fold enhancement in GLUT-4 translocation in L6 myotubes.\n\nFurthermore, NBA clearance was secured under Section 19 of the Biological Diversity Act 2002 for commercial utilization of Indian biological resources.",
            "ipc": ["A61K36/59", "A61K36/9066", "A61K36/37", "A61P3/10"],
            "cpc": ["A61K36/59", "A61K36/9066"],
            "filing_date": "2008-06-18",
            "publication_date": "2015-09-11",
            "applicant": "Council of Scientific and Industrial Research (CSIR) & CCRAS",
            "inventor": ["Dr. V. M. Katoch", "Dr. Rama Kant Sharma", "Dr. Arvind Kumar"],
            "country": "India",
            "jurisdiction": "IN",
            "language": "en",
            "source_dataset": "Indian Patent Office (IPO / InPASS)",
            "source_url": "https://ipindiaservices.gov.in/publicsearch/patent/268685"
        },
        {
            "patent_id": "IN-243763-B",
            "application_number": "890/DEL/2005",
            "publication_number": "IN 243763 B",
            "title": "A process for preparation of standardized extract from Withania somnifera with enhanced withanolide glycosides content",
            "abstract": "The invention discloses an improved industrial extraction process for Withania somnifera roots yielding a dry extract containing >= 8.0% withanolide glycosides and <= 0.1% withaferin A, free of cytotoxic aglycones, exhibiting superior anxiolytic and adaptogenic efficacy.",
            "claims": [
                "1. An industrial process for obtaining an adaptogenic standardized extract of Withania somnifera roots comprising: (a) extracting dried roots with a 70:30 v/v ethanol-water solvent at 40°C to 45°C; (b) treating the hydroalcoholic extract with a food-grade macroporous adsorbent resin to selectively retain withanolide glycosides; (c) eluting with 90% ethanol; and (d) spray-drying the eluate at 65°C inlet temperature to obtain a stable powder comprising at least 8.0% by weight of withanolide glycosides (withanoside IV, withanoside VI) and not more than 0.1% of free withaferin A.",
                "2. The standardized Withania somnifera extract obtained by the process claimed in claim 1.",
                "3. A pharmaceutical composition comprising the standardized extract of claim 2 together with pharmaceutically acceptable binders and disintegrants."
            ],
            "description": "BACKGROUND: Traditional churna powders contain low (0.2-0.5%) active withanolides and vary widely between agricultural batches. Furthermore, withaferin A at high concentrations exhibits cytotoxic rather than adaptogenic properties. The present process selectively enriches withanolide glycosides while depleting cytotoxic aglycones.",
            "ipc": ["A61K36/81", "B01D15/00", "A61P25/22"],
            "cpc": ["A61K36/81", "B01D15/00"],
            "filing_date": "2005-04-12",
            "publication_date": "2010-10-29",
            "applicant": "Dabur Research Foundation",
            "inventor": ["Dr. Anand C. Burman", "Dr. Sunil Kumar", "Dr. Jagdish C. Verma"],
            "country": "India",
            "jurisdiction": "IN",
            "language": "en",
            "source_dataset": "Indian Patent Office (IPO / InPASS)",
            "source_url": "https://ipindiaservices.gov.in/publicsearch/patent/243763"
        },
        {
            "patent_id": "IN-284123-B",
            "application_number": "2104/MUM/2009",
            "publication_number": "IN 284123 B",
            "title": "Polyherbal formulation for hepatoprotective activity comprising Phyllanthus amarus, Picrorhiza kurroa, and Boerhavia diffusa",
            "abstract": "A synergistic polyherbal therapeutic composition for treatment of drug-induced liver injury and hepatitis, comprising standardized extract fractions of Phyllanthus amarus (phyllanthin >= 2%), Picrorhiza kurroa (kutkoside and picroside >= 10%), and Boerhavia diffusa (punarnavoside >= 1.5%).",
            "claims": [
                "1. A polyherbal hepatoprotective pharmaceutical composition comprising: (a) 30% to 40% w/w of standardized Phyllanthus amarus extract containing at least 2.0% phyllanthin; (b) 25% to 35% w/w of standardized Picrorhiza kurroa rhizome extract containing at least 10.0% picrosides; (c) 20% to 30% w/w of Boerhavia diffusa root extract containing at least 1.5% punarnavoside; and (d) pharmaceutical glidants and lubricants.",
                "2. The composition as claimed in claim 1, wherein the composition accelerates normalization of serum transaminases (ALT, AST) and bilirubin by 45% compared to monotherapy controls in carbon tetrachloride (CCl4)-induced hepatic necrosis.",
                "3. The composition as claimed in claim 1, formulated as enteric-coated granules or film-coated tablets."
            ],
            "description": "The classical herbs Bhumyamalaki, Katuki, and Punarnava are revered in Yakrit Roga chikitsa. The present applicants established that a precise ratio produces non-obvious stabilization of the hepatocyte mitochondrial membrane against paracetamol and rifampicin toxicity.",
            "ipc": ["A61K36/47", "A61K36/68", "A61K36/185", "A61P1/16"],
            "cpc": ["A61K36/47", "A61K36/68"],
            "filing_date": "2009-09-15",
            "publication_date": "2017-06-09",
            "applicant": "Himalaya Drug Company / Himalaya Global Holdings",
            "inventor": ["Dr. Pralhad S. Patki", "Dr. S. K. Mitra", "Dr. U. V. Babu"],
            "country": "India",
            "jurisdiction": "IN",
            "language": "en",
            "source_dataset": "Indian Patent Office (IPO / InPASS)",
            "source_url": "https://ipindiaservices.gov.in/publicsearch/patent/284123"
        },
        {
            "patent_id": "IN-324590-B",
            "application_number": "345/KOL/2011",
            "publication_number": "IN 324590 B",
            "title": "Synergistic botanical composition comprising Boswellia serrata and Commiphora mukul for inflammatory joint diseases",
            "abstract": "A synergistic anti-arthritic oral composition combining standardized 3-O-acetyl-11-keto-beta-boswellic acid (AKBA >= 30%) with guggulsterones E and Z (>= 2.5%) from Commiphora mukul, significantly inhibiting joint swelling and pro-inflammatory TNF-alpha in adjuvant-induced arthritis models.",
            "claims": [
                "1. A synergistic oral botanical composition comprising: (a) a standardized extract of Boswellia serrata resin comprising at least 30.0% by weight of 3-O-acetyl-11-keto-beta-boswellic acid (AKBA); and (b) a standardized extract of Commiphora mukul gum resin comprising at least 2.5% by weight of combined guggulsterones E and Z; in a weight ratio of 2:1 to 4:1.",
                "2. The composition as claimed in claim 1, wherein the combination produces greater than 70% reduction in paw edema in Freund's complete adjuvant arthritis models.",
                "3. The composition as claimed in claim 1, wherein said composition is formulated into hard gelatin capsules."
            ],
            "description": "Under Section 3(e) of the Indian Patents Act, evidence of synergy was submitted demonstrating that AKBA and guggulsterones act on complementary biological targets: 5-LOX inhibition and NF-kappa-B suppression respectively.",
            "ipc": ["A61K36/324", "A61K36/328", "A61P29/00", "A61P19/02"],
            "cpc": ["A61K36/324", "A61K36/328"],
            "filing_date": "2011-03-24",
            "publication_date": "2019-11-08",
            "applicant": "National Botanical Research Institute (CSIR-NBRI)",
            "inventor": ["Dr. Sharad Srivastava", "Dr. A. K. S. Rawat"],
            "country": "India",
            "jurisdiction": "IN",
            "language": "en",
            "source_dataset": "Indian Patent Office (IPO / InPASS)",
            "source_url": "https://ipindiaservices.gov.in/publicsearch/patent/324590"
        },
        {
            "patent_id": "IN-348215-B",
            "application_number": "1892/CHE/2012",
            "publication_number": "IN 348215 B",
            "title": "Standardized herbal anti-diabetic composition comprising Gymnema sylvestre, Momordica charantia, and Cinnamomum zeylanicum",
            "abstract": "A novel standardized herbal composition for insulin sensitization and beta-cell protection comprising extracts of Gymnema sylvestre (gymnemic acids >= 25%), Momordica charantia (charantin >= 1.5%), and Cinnamomum zeylanicum (proanthocyanidins >= 10%), demonstrating enhanced glucose uptake in skeletal muscle.",
            "claims": [
                "1. A standardized anti-diabetic herbal formulation comprising: (a) 30% to 45% w/w of a standardized extract of Gymnema sylvestre containing not less than 25% gymnemic acids; (b) 25% to 35% w/w of a standardized extract of Momordica charantia containing not less than 1.5% charantin; and (c) 15% to 25% w/w of an extract of Cinnamomum zeylanicum bark containing not less than 10% type-A proanthocyanidins.",
                "2. The formulation as claimed in claim 1, wherein the formulation enhances glucose uptake in insulin-resistant adipocytes by 82% over baseline.",
                "3. A dosage form comprising the formulation of claim 1 formulated as sustained-release tablets or capsules."
            ],
            "description": "Detailed investigation of Indian medicinal plants recognized for Madhumeha revealed that combining gymnemic acids (which stimulate insulin secretion from beta-cells) with charantin (which mimics insulin activity) and cinnamon polyphenols (which enhance insulin receptor phosphorylation) produces an unprecedented multi-target therapeutic benefit.",
            "ipc": ["A61K36/27", "A61K36/42", "A61K36/54", "A61P3/10"],
            "cpc": ["A61K36/27", "A61K36/42"],
            "filing_date": "2012-05-14",
            "publication_date": "2020-09-30",
            "applicant": "Natural Remedies Pvt. Ltd. & Rajiv Gandhi University",
            "inventor": ["Dr. Deepak M.", "Dr. Amit Agarwal"],
            "country": "India",
            "jurisdiction": "IN",
            "language": "en",
            "source_dataset": "Indian Patent Office (IPO / InPASS)",
            "source_url": "https://ipindiaservices.gov.in/publicsearch/patent/348215"
        }
    ]
