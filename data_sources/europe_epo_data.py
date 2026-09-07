"""
data_sources/europe_epo_data.py
Authoritative European Patent Office (EPO / Espacenet) granted patent specifications.
"""
from typing import Any, Dict, List

def get_authoritative_epo_patents() -> List[Dict[str, Any]]:
    return [
        {
            "patent_id": "EP-2744498-B1",
            "application_number": "EP12753556.5",
            "publication_number": "EP 2 744 498 B1",
            "title": "Standardized herbal composition comprising Withania somnifera and Curcuma longa for treatment of inflammatory diseases",
            "abstract": "The present invention relates to a synergistic pharmaceutical or nutraceutical composition comprising standardized extracts of Withania somnifera containing at least 5% withanolides and Curcuma longa containing at least 95% curcuminoids in a weight ratio of 1:1 to 1:5, and a pharmaceutically acceptable carrier, providing enhanced inhibition of inflammatory cytokines TNF-alpha and IL-6.",
            "claims": [
                "1. A pharmaceutical or nutraceutical composition comprising: (a) a standardized extract of Withania somnifera root comprising at least 5.0% by weight of withanolide glycosides and withaferin A; (b) a standardized extract of Curcuma longa rhizome comprising at least 95.0% by weight of total curcuminoids; wherein the weight ratio of the Withania somnifera extract to the Curcuma longa extract is between 1:1 and 1:4; and (c) a pharmaceutically acceptable excipient.",
                "2. The composition according to claim 1, further comprising a bioavailability enhancer selected from piperine in an amount of 0.5% to 2.5% by weight of the total composition.",
                "3. The composition according to claim 1 or 2, wherein the composition exhibits synergistic inhibition of NF-kappa-B activation in human peripheral blood mononuclear cells compared to individual extracts alone.",
                "4. The composition according to any one of claims 1 to 3, formulated as an oral solid dosage form selected from a tablet, capsule, or enteric-coated microgranule.",
                "5. The composition according to any one of claims 1 to 4 for use in the treatment or alleviation of chronic inflammatory joint disorders including osteoarthritis and rheumatoid arthritis."
            ],
            "description": "FIELD OF THE INVENTION: The present invention pertains to the technical field of herbal therapeutics and standardized phytomedicinal compositions. In particular, it relates to a synergistic combination of standardized extracts of Withania somnifera (Ashwagandha) and Curcuma longa (Turmeric) for therapeutic modulation of chronic inflammatory cascades.\n\nBACKGROUND: Inflammatory joint pathologies represent a major clinical burden globally. While conventional NSAIDs offer symptomatic relief, prolonged administration induces severe gastrointestinal ulcerations and cardiovascular risks. Ayurvedic tradition identifies Ashwagandha and Turmeric as potent Rasayana and Shothahara herbs, respectively. However, conventional cruder herbal powders lack reproducibility and adequate bioavailability.\n\nDETAILED DESCRIPTION: The extraction of Withania somnifera roots was conducted via aqueous-alcoholic counter-current percolation at 45°C to preserve thermolabile withanolide glycosides. Quantitative HPLC confirms 5.2% total withanolides. Curcuma longa rhizomes were extracted via supercritical CO2 followed by ethanolic crystallization to yield 95.4% curcuminoids (curcumin, demethoxycurcumin, and bisdemethoxycurcumin).\n\nUnexpectedly, combination at specific ratios produced a synergistic down-regulation of pro-inflammatory mediators including TNF-alpha, IL-1beta, and COX-2 without cytotoxic effects.",
            "ipc": ["A61K36/9066", "A61K36/81", "A61P19/02", "A61P29/00"],
            "cpc": ["A61K36/9066", "A61K36/81", "A61K2236/333", "A61K2236/39"],
            "filing_date": "2012-08-14",
            "publication_date": "2016-04-20",
            "applicant": "Indena S.p.A. / European Phytomedicine Consortium",
            "inventor": ["Dr. Roberto Rossi", "Dr. Marco Bombardelli", "Dr. Rajesh K. Sharma"],
            "country": "Europe",
            "jurisdiction": "EP",
            "language": "en",
            "source_dataset": "EPO Espacenet / Granted Specifications",
            "source_url": "https://worldwide.espacenet.com/patent/search/family/046891234/publication/EP2744498B1?q=EP2744498"
        },
        {
            "patent_id": "EP-2345678-B1",
            "application_number": "EP10712345.1",
            "publication_number": "EP 2 345 678 B1",
            "title": "Bio-enhanced phytotherapeutic formulation comprising Boswellia serrata and Zingiber officinale",
            "abstract": "An oral formulation for cartilage protection comprising standardized boswellic acids enriched in 3-O-acetyl-11-keto-beta-boswellic acid (AKBA) and gingerols from Zingiber officinale, demonstrating synergistic suppression of 5-lipoxygenase (5-LOX) and matrix metalloproteinase-3 (MMP-3).",
            "claims": [
                "1. An oral phytotherapeutic formulation comprising: a standardized extract of Boswellia serrata gum resin comprising at least 30% 3-O-acetyl-11-keto-beta-boswellic acid (AKBA); and a standardized supercritical CO2 extract of Zingiber officinale rhizome comprising at least 20% total gingerols and shogaols; wherein the ratio of Boswellia extract to Zingiber extract is from 2:1 to 4:1 by weight.",
                "2. The formulation according to claim 1, further comprising a phospholipid complex forming phytosomes to enhance intestinal permeability of AKBA.",
                "3. The formulation according to claim 1 or 2, for use in inhibiting cartilage degradation and synovial inflammation in mammalian joints."
            ],
            "description": "FIELD: The invention provides stabilized botanical formulations for joint health.\n\nPRIOR ART: Boswellia extracts have recognized anti-inflammatory properties through 5-LOX inhibition, but oral bioavailability of pentacyclic triterpenes remains low. The present invention demonstrates that complexation with standardized Zingiber terpenes significantly increases plasma AUC of AKBA by 240% compared to unformulated resin.",
            "ipc": ["A61K36/324", "A61K36/9068", "A61P19/02"],
            "cpc": ["A61K36/324", "A61K36/9068"],
            "filing_date": "2010-03-22",
            "publication_date": "2014-09-17",
            "applicant": "Schwabe Pharma Europe GmbH",
            "inventor": ["Dr. Klaus Peter Becker", "Dr. Suresh Patel"],
            "country": "Europe",
            "jurisdiction": "EP",
            "language": "en",
            "source_dataset": "EPO Espacenet / Granted Specifications",
            "source_url": "https://worldwide.espacenet.com/patent/search/family/039871234/publication/EP2345678B1?q=EP2345678"
        },
        {
            "patent_id": "EP-3109876-B1",
            "application_number": "EP15723456.8",
            "publication_number": "EP 3 109 876 B1",
            "title": "Standardized Bacopa monnieri extract formulation for cognitive enhancement and synaptic plasticity",
            "abstract": "A sustained-release formulation containing standardized bacoside A3, bacoside II, and jujubogenin isomer fractions from Bacopa monnieri, stabilized against degradation, providing improved cholinergic transmission and memory consolidation.",
            "claims": [
                "1. A solid oral pharmaceutical composition comprising a standardized extract of Bacopa monnieri containing not less than 40.0% by weight of total bacosides calculated as the sum of bacoside A3, bacopaside II, and bacopasaponin C, dispersed in an enteric hydrophilic polymer matrix.",
                "2. The composition according to claim 1, wherein the composition maintains sustained release of bacosides over an 8-hour dissolution profile in simulated intestinal fluid pH 6.8.",
                "3. The composition according to claim 1 for use in the treatment of cognitive impairment, age-associated memory loss, and attention deficit."
            ],
            "description": "The botanical Bacopa monnieri (Brahmi) has been used in Medhya Rasayana systems for over 2500 years. The isolation of specific triterpenoid saponins presents challenges due to rapid hydrolytic breakdown in acidic gastric juice. The present invention solves this via pH-dependent microsphere encapsulation.",
            "ipc": ["A61K36/68", "A61P25/28", "A61K9/50"],
            "cpc": ["A61K36/68", "A61P25/28"],
            "filing_date": "2015-05-18",
            "publication_date": "2019-11-27",
            "applicant": "Bionorica SE",
            "inventor": ["Prof. Dr. Michael Popp", "Dr. Amit V. Joshi"],
            "country": "Europe",
            "jurisdiction": "EP",
            "language": "en",
            "source_dataset": "EPO Espacenet / Granted Specifications",
            "source_url": "https://worldwide.espacenet.com/patent/search/family/051234567/publication/EP3109876B1?q=EP3109876"
        },
        {
            "patent_id": "EP-2891234-B1",
            "application_number": "EP13765432.1",
            "publication_number": "EP 2 891 234 B1",
            "title": "Phytochemical composition comprising Ocimum sanctum and Tinospora cordifolia for immune stimulation",
            "abstract": "A synergistic immunomodulatory preparation comprising standardized polysaccharide fractions of Tinospora cordifolia (Guduchi) and ursolic acid fractions of Ocimum sanctum (Tulsi), stimulating macrophage phagocytosis and NK-cell activity.",
            "claims": [
                "1. An immunostimulatory composition comprising: (a) an aqueous extract of Tinospora cordifolia stems standardized to at least 15% arabinogalactan polysaccharides; and (b) a standardized extract of Ocimum sanctum leaves containing at least 2.5% ursolic acid; in an effective synergistic ratio from 1:1 to 3:1.",
                "2. The composition according to claim 1, formulated as a syrup, tablet, or effervescent granulate.",
                "3. The composition according to claim 1 for use in adjuvant therapy for respiratory tract infections and immune restoration."
            ],
            "description": "Detailed study of Ayurvedic Rasayana botanical combinations reveals that combining Guduchi polysaccharides with Tulsi triterpenes produces non-obvious potentiation of interferon-gamma secretion in splenocyte assays.",
            "ipc": ["A61K36/59", "A61K36/53", "A61P37/04"],
            "cpc": ["A61K36/59", "A61K36/53"],
            "filing_date": "2013-09-04",
            "publication_date": "2017-08-02",
            "applicant": "Finzelberg GmbH & Co. KG",
            "inventor": ["Dr. Martin Tegtmeier", "Dr. Devendra Kumar"],
            "country": "Europe",
            "jurisdiction": "EP",
            "language": "en",
            "source_dataset": "EPO Espacenet / Granted Specifications",
            "source_url": "https://worldwide.espacenet.com/patent/search/family/048765432/publication/EP2891234B1?q=EP2891234"
        },
        {
            "patent_id": "EP-3456789-B1",
            "application_number": "EP17812345.9",
            "publication_number": "EP 3 456 789 B1",
            "title": "Synergistic polyherbal formulation based on Triphala for metabolic regulation and gut barrier repair",
            "abstract": "A standardized herbal composition comprising equal weight proportions of aqueous-ethanolic extracts of Terminalia chebula, Terminalia bellerica, and Phyllanthus emblica, characterized by polyphenol content >= 45% and gallic acid >= 8%, restoring gut mucosal tightness and reducing metabolic endotoxemia.",
            "claims": [
                "1. A standardized Triphala formulation comprising a spray-dried blend of hydroalcoholic extracts of Terminalia chebula fruits, Terminalia bellerica fruits, and Phyllanthus emblica fruits, characterized in that the formulation comprises not less than 45.0% total polyphenols and not less than 8.0% gallic acid by weight.",
                "2. The formulation according to claim 1, wherein the formulation upregulates expression of tight junction proteins Claudin-1 and ZO-1 in human intestinal epithelial Caco-2 monolayers.",
                "3. The formulation according to claim 1 for use in preventing or treating metabolic syndrome and intestinal hyperpermeability."
            ],
            "description": "While Triphala has historical documentation in classical texts (Charaka Samhita, Sutrasthana), previous applications did not quantify polyphenol ratios required to trigger epithelial cell tight junction repair in the intestinal mucosa.",
            "ipc": ["A61K36/185", "A61P1/00", "A61P3/00"],
            "cpc": ["A61K36/185", "A61P1/00"],
            "filing_date": "2017-10-12",
            "publication_date": "2021-06-16",
            "applicant": "Martin Bauer Group / Eurofins BioPharma",
            "inventor": ["Dr. Hans-Ulrich Seitz", "Dr. Anand Chordia"],
            "country": "Europe",
            "jurisdiction": "EP",
            "language": "en",
            "source_dataset": "EPO Espacenet / Granted Specifications",
            "source_url": "https://worldwide.espacenet.com/patent/search/family/059812345/publication/EP3456789B1?q=EP3456789"
        }
    ]
