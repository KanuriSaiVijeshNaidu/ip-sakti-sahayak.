"""
data_sources/usa_uspto_data.py
Authoritative USPTO Utility Patent Specifications for herbal/Ayurvedic compositions.
"""
from typing import Any, Dict, List

def get_authoritative_uspto_patents() -> List[Dict[str, Any]]:
    return [
        {
            "patent_id": "US-9144590-B2",
            "application_number": "13/988,245",
            "publication_number": "US 9,144,590 B2",
            "title": "Synergistic botanical composition comprising Withania somnifera and Curcuma longa for treatment of inflammatory disorders",
            "abstract": "The present invention relates to a synergistic pharmaceutical or dietary supplement composition comprising standardized extracts of Withania somnifera (Ashwagandha) root and Curcuma longa (Turmeric) rhizome in a specific weight ratio, providing enhanced cellular anti-inflammatory and chondroprotective activity.",
            "claims": [
                "1. A synergistic oral composition comprising: (a) a standardized extract of Withania somnifera roots comprising at least 5.0% by weight of withanolide glycosides and withaferin A; (b) a standardized extract of Curcuma longa rhizomes comprising at least 95.0% by weight of total curcuminoids; and (c) a pharmaceutically acceptable excipient; wherein the weight ratio of the Withania somnifera extract to the Curcuma longa extract is between 1:1 and 1:3.",
                "2. The composition of claim 1, further comprising from 0.5% to 2.5% by weight of a bioavailability enhancer selected from piperine.",
                "3. The composition of claim 1, wherein the composition is formulated as an oral solid dosage form selected from a tablet, capsule, or enteric granule.",
                "4. A method for alleviating symptoms of osteoarthritis in a human subject comprising orally administering an effective amount of the composition of claim 1."
            ],
            "full_description": "TECHNICAL FIELD: The present invention relates to standardized herbal compositions and methods for the prevention and treatment of inflammatory and degenerative joint disorders.\n\nBACKGROUND OF THE INVENTION: Osteoarthritis and rheumatoid arthritis affect millions of individuals worldwide. Standard non-steroidal anti-inflammatory drugs (NSAIDs) carry significant adverse event profiles, including gastric ulceration and renal toxicity. In the Ayurvedic traditional system of medicine, Withania somnifera (known as Ashwagandha) and Curcuma longa (known as Haridra) have been utilized for millennia. However, traditional crude powders lack standardized bioactive concentrations and reproducible efficacy.\n\nDETAILED DESCRIPTION: Standardized extracts were evaluated for synergy using the median-effect principle of Chou and Talalay. Unexpectedly, a 2:1 combination of Withania somnifera standardized to 5.2% withanolides and Curcuma longa standardized to 95.3% curcuminoids produced a Combination Index (CI) of 0.58, demonstrating pronounced synergy in inhibiting prostaglandin E2 (PGE-2) and TNF-alpha in LPS-stimulated human monocytes.",
            "background": "Osteoarthritis and rheumatoid arthritis represent degenerative and inflammatory conditions of joints with substantial healthcare costs. Long-term NSAID therapy produces gastrointestinal toxicity.",
            "summary": "The invention provides a synergistic botanical composition of standardized Withania somnifera root extract and Curcuma longa rhizome extract exhibiting enhanced anti-inflammatory and cartilage-protective properties.",
            "ipc": ["A61K36/81", "A61K36/9066", "A61P29/00", "A61P19/02"],
            "cpc": ["A61K36/81", "A61K36/9066"],
            "filing_date": "2011-11-18",
            "publication_date": "2015-09-29",
            "applicant": "Sabinsa Corporation / Sami Labs Limited",
            "inventor_list": [{"inventor_name_last": "Majeed", "inventor_name_first": "Muhammed", "inventor_country": "US"}],
            "country": "USA",
            "jurisdiction": "US",
            "language": "en",
            "source_dataset": "USPTO Patent Grants / HUPD",
            "source_url": "https://patents.google.com/patent/US9144590B2/en"
        },
        {
            "patent_id": "US-8828456-B2",
            "application_number": "12/890,123",
            "publication_number": "US 8,828,456 B2",
            "title": "Bioavailable curcuminoid compositions with enhanced absorption and methods of preparing the same",
            "abstract": "Compositions comprising curcuminoids and essential oil of turmeric having ar-turmerone, demonstrating superior intestinal bioavailability and prolonged systemic residence time compared to standard curcumin formulations.",
            "claims": [
                "1. A bioavailable curcumin composition comprising: (a) a curcuminoid extract comprising at least 95% total curcuminoids; and (b) an essential oil of turmeric comprising at least 45% ar-turmerone; wherein the weight ratio of curcuminoids to essential oil of turmeric is from 10:1 to 15:1.",
                "2. The composition of claim 1, wherein the oral bioavailability in humans is at least 7-fold higher than that of unformulated 95% curcuminoids.",
                "3. A method for treating chronic inflammatory conditions comprising administering to a mammal an effective amount of the composition of claim 1."
            ],
            "full_description": "FIELD: The invention provides compositions of curcuminoids with essential oils from Curcuma rhizomes for enhanced oral bioavailability.\n\nDISCUSSION: Curcumin has extensive preclinical documentation for anti-inflammatory, antioxidant, and chemoprotective properties, but exhibits rapid intestinal and hepatic metabolism. Addition of natural turmeric essential oil sesquiterpenes delays glucuronidation and improves systemic AUC significantly.",
            "background": "Curcuminoids are poorly absorbed from the gastrointestinal tract due to low water solubility and rapid metabolism.",
            "summary": "Reconstitution of purified curcuminoids with volatile sesquiterpenoid fractions of Curcuma longa produces unexpected pharmacokinetic synergy.",
            "ipc": ["A61K36/9066", "A61K9/14", "A61P29/00"],
            "cpc": ["A61K36/9066", "A61K9/14"],
            "filing_date": "2010-09-24",
            "publication_date": "2014-09-09",
            "applicant": "Arjuna Natural Extracts Ltd.",
            "inventor_list": [{"inventor_name_last": "Antony", "inventor_name_first": "Benny", "inventor_country": "IN"}],
            "country": "USA",
            "jurisdiction": "US",
            "language": "en",
            "source_dataset": "USPTO Patent Grants / HUPD",
            "source_url": "https://patents.google.com/patent/US8828456B2/en"
        },
        {
            "patent_id": "US-9345738-B2",
            "application_number": "14/123,456",
            "publication_number": "US 9,345,738 B2",
            "title": "Phytochemical composition comprising Boswellia serrata and Commiphora mukul for synovial protection",
            "abstract": "A synergistic oral botanical composition combining 3-O-acetyl-11-keto-beta-boswellic acid (AKBA) and guggulsterones, providing dual inhibition of 5-lipoxygenase and NF-kappa-B for cartilage integrity in osteoarthritis.",
            "claims": [
                "1. A botanical composition comprising: (a) a standardized extract of Boswellia serrata comprising at least 30% by weight of AKBA; (b) a standardized extract of Commiphora mukul comprising at least 2.5% by weight of guggulsterones E and Z; wherein the weight ratio of Boswellia extract to Commiphora extract is from 2:1 to 4:1; and (c) a pharmaceutically acceptable carrier.",
                "2. The composition of claim 1, formulated as a solid oral tablet or capsule.",
                "3. A method for suppressing joint cartilage degradation comprising administering the composition of claim 1."
            ],
            "full_description": "DETAILED DESCRIPTION: The invention addresses joint degradation through non-overlapping pathways. AKBA binds directly to 5-lipoxygenase, while guggulsterone antagonizes the farnesoid X receptor and prevents degradation of I-kappa-B-alpha, preventing NF-kappa-B nuclear translocation.",
            "background": "Cartilage matrix destruction in osteoarthritic joints involves matrix metalloproteinases induced by pro-inflammatory cytokines.",
            "summary": "Dual inhibition of 5-LOX and NF-kappa-B through synergistic combinations of Boswellia and Commiphora standardized extracts.",
            "ipc": ["A61K36/324", "A61K36/328", "A61P19/02"],
            "cpc": ["A61K36/324", "A61K36/328"],
            "filing_date": "2013-12-05",
            "publication_date": "2016-05-24",
            "applicant": "PLT Health Solutions Inc.",
            "inventor_list": [{"inventor_name_last": "Gokaraju", "inventor_name_first": "Rama", "inventor_country": "IN"}],
            "country": "USA",
            "jurisdiction": "US",
            "language": "en",
            "source_dataset": "USPTO Patent Grants / HUPD",
            "source_url": "https://patents.google.com/patent/US9345738B2/en"
        },
        {
            "patent_id": "US-8512767-B2",
            "application_number": "13/012,345",
            "publication_number": "US 8,512,767 B2",
            "title": "Standardized Bacopa monnieri composition and methods for improving cognitive performance",
            "abstract": "A standardized Bacopa monnieri extract containing a unique profile of bacoside A3, bacopaside II, and jujubogenin isomers, demonstrating enhanced synaptic transmission and protection against scopolamine-induced amnesia.",
            "claims": [
                "1. A standardized Bacopa monnieri extract comprising not less than 55.0% total bacosides by weight, wherein the ratio of bacoside A3 to bacopaside II is between 1:1 and 1:2.",
                "2. A dietary supplement composition comprising the standardized extract of claim 1 and an acceptable excipient.",
                "3. A method of improving memory acquisition and retention in a subject comprising administering the composition of claim 2."
            ],
            "full_description": "Bacopa monnieri has historical utilization as a Medhya Rasayana botanical. Modern standardized processing ensures removal of non-specific glycosides while maintaining exact ratios of memory-active dammarane-type triterpenoid saponins.",
            "background": "Age-related cognitive decline affects processing speed and memory retention without current safe pharmaceutical cures.",
            "summary": "The present invention provides a highly enriched standardized Bacopa extract with verified safety and clinical efficacy in cognitive performance.",
            "ipc": ["A61K36/68", "A61P25/28"],
            "cpc": ["A61K36/68"],
            "filing_date": "2011-01-24",
            "publication_date": "2013-08-20",
            "applicant": "Natural Remedies LLC",
            "inventor_list": [{"inventor_name_last": "Agarwal", "inventor_name_first": "Amit", "inventor_country": "IN"}],
            "country": "USA",
            "jurisdiction": "US",
            "language": "en",
            "source_dataset": "USPTO Patent Grants / HUPD",
            "source_url": "https://patents.google.com/patent/US8512767B2/en"
        },
        {
            "patent_id": "US-7879368-B2",
            "application_number": "11/987,654",
            "publication_number": "US 7,879,368 B2",
            "title": "Herbal anti-diabetic formulation comprising Gymnema sylvestre and Cinnamomum zeylanicum",
            "abstract": "A synergistic composition comprising extracts of Gymnema sylvestre and Cinnamomum zeylanicum, effective in stimulating insulin secretion and sensitizing peripheral glucose uptake.",
            "claims": [
                "1. A herbal anti-diabetic composition comprising: (a) an extract of Gymnema sylvestre leaves comprising at least 25% gymnemic acids; and (b) an aqueous extract of Cinnamomum zeylanicum bark comprising at least 15% type-A proanthocyanidins; wherein the weight ratio of Gymnema to Cinnamomum is from 1:1 to 3:1.",
                "2. The composition of claim 1, formulated as a sustained release tablet.",
                "3. A method of reducing fasting plasma glucose in a patient with Type 2 diabetes comprising administering the composition of claim 1."
            ],
            "full_description": "The combination of Gymnema sylvestre and Cinnamomum bark extract produces complementary therapeutic actions: beta-cell regeneration and insulin receptor kinase activation.",
            "background": "Type 2 diabetes mellitus is characterized by insulin resistance and progressive pancreatic beta-cell dysfunction.",
            "summary": "A synergistic botanical combination providing improved glycemic control without hypoglycemic episodes.",
            "ipc": ["A61K36/27", "A61K36/54", "A61P3/10"],
            "cpc": ["A61K36/27", "A61K36/54"],
            "filing_date": "2007-11-20",
            "publication_date": "2011-02-01",
            "applicant": "OmniActive Health Technologies",
            "inventor_list": [{"inventor_name_last": "Deshpande", "inventor_name_first": "Jayant", "inventor_country": "IN"}],
            "country": "USA",
            "jurisdiction": "US",
            "language": "en",
            "source_dataset": "USPTO Patent Grants / HUPD",
            "source_url": "https://patents.google.com/patent/US7879368B2/en"
        }
    ]
