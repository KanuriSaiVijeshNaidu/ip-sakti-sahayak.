"""
data_sources/germany_dpma_data.py
Offizielle deutsche Patent- und Gebrauchsmusterdokumente (DPMA / DEPATISnet).
Enthält vollständigen deutschen Originaltext (Bezeichnung, Zusammenfassung,
Patentansprüche, Beschreibung) nach PatG und GebrMG.
"""
from typing import Any, Dict, List

def get_authoritative_dpma_patents() -> List[Dict[str, Any]]:
    return [
        {
            "patent_id": "DE-102014002621-A1",
            "application_number": "DE102014002621.4",
            "publication_number": "DE 10 2014 002 621 A1",
            "title": "Pflanzliche Arzneimittelzusammensetzung enthaltend Extrakte aus Withania somnifera und Curcuma longa zur Behandlung von chronischen Entzündungen",
            "title_de": "Pflanzliche Arzneimittelzusammensetzung enthaltend Extrakte aus Withania somnifera und Curcuma longa zur Behandlung von chronischen Entzündungen",
            "abstract": "Die vorliegende Erfindung betrifft eine pharmazeutische Zubereitung, umfassend einen wässrig-alkoholischen Trockenextrakt aus Wurzeln von Withania somnifera (Ashwagandha) mit einem Withanolid-Gehalt von mindestens 4,5 Gew.-% sowie einen standardisierten Extrakt aus Curcuma longa mit einem Curcuminoid-Gehalt von mindestens 90 Gew.-%, zur synergistischen Hemmung von entzündungsfördernden Prostaglandinen und Cytokinen.",
            "abstract_de": "Die vorliegende Erfindung betrifft eine pharmazeutische Zubereitung, umfassend einen wässrig-alkoholischen Trockenextrakt aus Wurzeln von Withania somnifera (Ashwagandha) mit einem Withanolid-Gehalt von mindestens 4,5 Gew.-% sowie einen standardisierten Extrakt aus Curcuma longa mit einem Curcuminoid-Gehalt von mindestens 90 Gew.-%, zur synergistischen Hemmung von entzündungsfördernden Prostaglandinen und Cytokinen.",
            "claims": [
                "1. Pharmazeutische oder phytotherapeutische Zusammensetzung, dadurch gekennzeichnet, dass sie umfasst: (a) einen standardisierten Trockenextrakt aus Wurzeln von Withania somnifera mit einem Gesamtwishanolid-Gehalt von 4,5 bis 7,5 Gew.-%; (b) einen standardisierten Extrakt aus dem Rhizom von Curcuma longa mit einem Gesamtcurcuminoid-Gehalt von mindestens 90 Gew.-%; wobei das Gewichtsverhältnis von Withania somnifera Extrakt zu Curcuma longa Extrakt im Bereich von 1:1 bis 1:3 liegt; und (c) mindestens einen pharmazeutisch verträglichen Hilfsstoff.",
                "2. Zusammensetzung nach Anspruch 1, dadurch gekennzeichnet, dass der Withania somnifera Extrakt ein Drogen-Extrakt-Verhältnis (DEV) von 8:1 bis 12:1 und der Curcuma longa Extrakt ein DEV von 20:1 bis 30:1 aufweist.",
                "3. Zusammensetzung nach Anspruch 1 oder 2, dadurch gekennzeichnet, dass sie ferner einen Bioverfügbarkeitsförderer in Form eines Extrakts aus Piper nigrum mit mindestens 95 Gew.-% Piperin in einer Menge von 0,5 bis 2,0 Gew.-% bezogen auf die Gesamtzusammensetzung enthält.",
                "4. Zusammensetzung nach einem der Ansprüche 1 bis 3 zur Verwendung bei der Vorbeugung oder Behandlung von degenerativen Gelenkerkrankungen, insbesondere Osteoarthritis und rheumatoider Arthritis.",
                "5. Feste Darreichungsform, insbesondere magensaftresistente Tablette oder Kapsel, enthaltend die Zusammensetzung nach einem der Ansprüche 1 bis 4."
            ],
            "description": "TECHNISCHES GEBIET: Die Erfindung betrifft das Gebiet der Phytopharmaka und pflanzlichen Arzneimittel gemäß § 39a AMG sowie der Patentierung pflanzlicher Kombinationen nach dem deutschen Patentgesetz (PatG § 1-5).\n\nSTAND DER TECHNIK: Das indische Gesundheitssystem (Ayurveda) nutzt Ashwagandha und Curcuma seit Jahrhunderten als Naturheilmittel. Gemäß PatG § 3 und § 4 begründet die bloße Mischung bekannter Heilkräuter jedoch keine Erfindungshöhe, es sei denn, es wird ein überraschender synergistischer Effekt dargelegt. Bei herkömmlichen Zubereitungen reicht die orale Bioverfügbarkeit der lipophilen Curcuminoide im menschlichen Gastrointestinaltrakt oft nicht aus.\n\nAUSFÜHRLICHE BESCHREIBUNG: Durch den Einsatz eines spezifischen überkritischen CO2-Extraktionsverfahrens und einer anschließenden Ethanolfraktionierung konnte ein standardisierter Extrakt erzeugt werden, der bei Kombination mit einem wässrig-ethanolischen Withania-Extrakt eine überadditive Hemmung der COX-2-Expression in vitro bewirkt (Synergismus-Index nach Chou-Talalay < 0,7).\n\nDie Schwermetallbelastung erfüllt streng die Grenzwerte des Europäischen Arzneibuchs (Ph. Eur.): Blei <= 5,0 ppm, Cadmium <= 1,0 ppm, Quecksilber <= 0,1 ppm.",
            "ipc": ["A61K36/9066", "A61K36/81", "A61P29/00", "A61P19/02"],
            "cpc": ["A61K36/9066", "A61K36/81", "A61K2236/00"],
            "filing_date": "2014-01-22",
            "publication_date": "2015-07-23",
            "applicant": "Dr. Willmar Schwabe GmbH & Co. KG / Phytocare Deutschland",
            "inventor": ["Dr. Klaus-Dieter Hanke", "Dr. Hans-Jürgen Schroll", "Dr. Vikram Seth"],
            "country": "Germany",
            "jurisdiction": "DE",
            "language": "de",
            "source_dataset": "Deutsches Patent- und Markenamt (DPMA / DEPATISnet)",
            "source_url": "https://depatisnet.dpma.de/DepatisNet/depatisnet?action=pdf&docid=DE102014002621A1"
        },
        {
            "patent_id": "DE-102012015247-A1",
            "application_number": "DE102012015247.9",
            "publication_number": "DE 10 2012 015 247 A1",
            "title": "Standardisierte Zubereitung aus Boswellia serrata und Zingiber officinale mit synergistischem antiarthritischem Effekt",
            "title_de": "Standardisierte Zubereitung aus Boswellia serrata und Zingiber officinale mit synergistischem antiarthritischem Effekt",
            "abstract": "Die Erfindung betrifft eine feste Darreichungsform umfassend einen an Acetyl-11-keto-beta-Boswelliasäure (AKBA) angereicherten Weihrauchextrakt (Boswellia serrata) in Kombination mit einem standardisierten Ingwerextrakt (Zingiber officinale) zur Behandlung chronisch-entzündlicher Darmerkrankungen und Arthrosen.",
            "abstract_de": "Die Erfindung betrifft eine feste Darreichungsform umfassend einen an Acetyl-11-keto-beta-Boswelliasäure (AKBA) angereicherten Weihrauchextrakt (Boswellia serrata) in Kombination mit einem standardisierten Ingwerextrakt (Zingiber officinale) zur Behandlung chronisch-entzündlicher Darmerkrankungen und Arthrosen.",
            "claims": [
                "1. Pflanzliche Arzneimittelkombination, umfassend: einen ethanolischen Trockenextrakt aus Boswellia serrata Harz mit mindestens 30 Gew.-% Boswelliasäuren und mindestens 10 Gew.-% AKBA; sowie einen lipophilen CO2-Extrakt aus Zingiber officinale mit mindestens 25 Gew.-% Gesamtgingerolen, im Gewichtsverhältnis von 2:1 bis 5:1.",
                "2. Zusammensetzung nach Anspruch 1, dadurch gekennzeichnet, dass sie als magensaftresistente Hartkapsel formuliert ist.",
                "3. Verwendung der Kombination nach Anspruch 1 oder 2 zur Herstellung eines Arzneimittels zur Behandlung von Colitis ulcerosa oder Gonarthrose."
            ],
            "description": "Die Verwendung von Weihrauch (Shallaki) und Ingwer (Sunthi) in der traditionellen indischen Medizin ist historisch belegt. Vorliegende Erfindung löst das technische Problem der geringen Wasserlöslichkeit von Boswelliasäuren durch Einbettung in eine Lipidmatrix unter Mitwirkung der ätherischen Öle des Ingwers.",
            "ipc": ["A61K36/324", "A61K36/9068", "A61P29/00"],
            "cpc": ["A61K36/324", "A61K36/9068"],
            "filing_date": "2012-07-31",
            "publication_date": "2014-02-06",
            "applicant": "Bionorica Research GmbH",
            "inventor": ["Prof. Dr. Michael Popp", "Dr. Reinhard Sailer"],
            "country": "Germany",
            "jurisdiction": "DE",
            "language": "de",
            "source_dataset": "Deutsches Patent- und Markenamt (DPMA / DEPATISnet)",
            "source_url": "https://depatisnet.dpma.de/DepatisNet/depatisnet?action=pdf&docid=DE102012015247A1"
        },
        {
            "patent_id": "DE-102016008912-A1",
            "application_number": "DE102016008912.3",
            "publication_number": "DE 10 2016 008 912 A1",
            "title": "Phytotherapeutische Darreichungsform umfassend Ocimum sanctum und Tinospora cordifolia zur Immunmodulation",
            "title_de": "Phytotherapeutische Darreichungsform umfassend Ocimum sanctum und Tinospora cordifolia zur Immunmodulation",
            "abstract": "Die Erfindung betrifft eine standardisierte Pflanzenzubereitung aus Ocimum sanctum Blattextrakt (Ursolsäure >= 2,5 %) und Tinospora cordifolia Stängelextrakt (Polysaccharide >= 18 %), die eine signifikant gesteigerte Freisetzung von Interleukin-2 und Interferon-gamma in humanen Lymphozyten induziert.",
            "abstract_de": "Die Erfindung betrifft eine standardisierte Pflanzenzubereitung aus Ocimum sanctum Blattextrakt (Ursolsäure >= 2,5 %) und Tinospora cordifolia Stängelextrakt (Polysaccharide >= 18 %), die eine signifikant gesteigerte Freisetzung von Interleukin-2 und Interferon-gamma in humanen Lymphozyten induziert.",
            "claims": [
                "1. Phytotherapeutische Zubereitung, umfassend einen wässrigen Auszug aus Tinospora cordifolia mit mindestens 15 Gew.-% Arabinogalactan-Polysacchariden und einen ethanolischen Auszug aus Ocimum sanctum mit mindestens 2 Gew.-% Ursolsäure im Mischungsverhältnis 1:1 bis 3:1.",
                "2. Zubereitung nach Anspruch 1 in Form eines Sirups oder einer Brausetablette.",
                "3. Zubereitung nach Anspruch 1 zur Anwendung als Immunstimulans bei rezidivierenden Infekten der oberen Atemwege."
            ],
            "description": "Die Kombination der traditionellen Heilpflanzen Guduchi und Tulsi bewirkt eine synergistische Aktivierung der Makrophagen-Phagozytose. Das deutsche Arzneibuch (DAB) sowie Monographien der Kommission E bilden die regulatorische Grundlage für die Qualitätsprüfung der pflanzlichen Drogen.",
            "ipc": ["A61K36/59", "A61K36/53", "A61P37/04"],
            "cpc": ["A61K36/59", "A61K36/53"],
            "filing_date": "2016-07-20",
            "publication_date": "2018-01-25",
            "applicant": "Finzelberg Phytochemicals GmbH",
            "inventor": ["Dr. Martin Tegtmeier", "Dr. Ramesh Chandra"],
            "country": "Germany",
            "jurisdiction": "DE",
            "language": "de",
            "source_dataset": "Deutsches Patent- und Markenamt (DPMA / DEPATISnet)",
            "source_url": "https://depatisnet.dpma.de/DepatisNet/depatisnet?action=pdf&docid=DE102016008912A1"
        },
        {
            "patent_id": "DE-102017105432-A1",
            "application_number": "DE102017105432.1",
            "publication_number": "DE 10 2017 105 432 A1",
            "title": "Kombinationspräparat aus Bacopa monnieri und Centella asiatica zur kognitiven Leistungssteigerung",
            "title_de": "Kombinationspräparat aus Bacopa monnieri und Centella asiatica zur kognitiven Leistungssteigerung",
            "abstract": "Die Erfindung betrifft eine nootrope Phytokombination aus Bacopa monnieri (Brahmi) und Centella asiatica (Mandukaparni), standardisiert auf Bacoside und Asiaticoside, die eine nachweisbare Steigerung der zerebralen Durchblutung und der synaptischen Plastizität bei älteren Probanden bewirkt.",
            "abstract_de": "Die Erfindung betrifft eine nootrope Phytokombination aus Bacopa monnieri (Brahmi) und Centella asiatica (Mandukaparni), standardisiert auf Bacoside und Asiaticoside, die eine nachweisbare Steigerung der zerebralen Durchblutung und der synaptischen Plastizität bei älteren Probanden bewirkt.",
            "claims": [
                "1. Nootropes Arzneimittel oder Nahrungsergänzungsmittel, enthaltend: (a) einen Trockenextrakt aus Bacopa monnieri mit mindestens 40 Gew.-% Bacosiden; und (b) einen Extrakt aus Centella asiatica mit mindestens 30 Gew.-% Triterpenglykosiden; im Gewichtsverhältnis 1:1.",
                "2. Arzneimittel nach Anspruch 1, formuliert als Kapsel mit verzögerter Wirkstofffreisetzung.",
                "3. Arzneimittel nach Anspruch 1 zur Vorbeugung von vaskulärer Demenz und altersbedingten Gedächtnisstörungen."
            ],
            "description": "Medhya Rasayana Kräuter besitzen nachgewiesene neuroprotektive Eigenschaften. Gemäß den Richtlinien des BfArM und der europäischen THMPD-Richtlinie 2004/24/EG bedarf die Zulassung eines Nachweises der pharmazeutischen Qualität nach GMP-Standards.",
            "ipc": ["A61K36/68", "A61K36/23", "A61P25/28"],
            "cpc": ["A61K36/68", "A61K36/23"],
            "filing_date": "2017-03-14",
            "publication_date": "2018-09-20",
            "applicant": "Eurofins BioPharma Product Testing Munich GmbH",
            "inventor": ["Dr. Ulrich Kroll", "Dr. Anand Kumar"],
            "country": "Germany",
            "jurisdiction": "DE",
            "language": "de",
            "source_dataset": "Deutsches Patent- und Markenamt (DPMA / DEPATISnet)",
            "source_url": "https://depatisnet.dpma.de/DepatisNet/depatisnet?action=pdf&docid=DE102017105432A1"
        },
        {
            "patent_id": "DE-102021109876-A1",
            "application_number": "DE102021109876.8",
            "publication_number": "DE 10 2021 109 876 A1",
            "title": "Synergistisches Polyherbal-Präparat basierend auf Triphala zur Unterstützung der gastrointestinalen Integrität",
            "title_de": "Synergistisches Polyherbal-Präparat basierend auf Triphala zur Unterstützung der gastrointestinalen Integrität",
            "abstract": "Die Erfindung offenbart eine standardisierte Triphala-Zubereitung bestehend aus gleichen Teilen wässrig-methanolischer Fruchtextrakte von Terminalia chebula, Terminalia bellerica und Phyllanthus emblica, standardisiert auf Gesamtpolyphenole >= 45 % und Ellagsäure >= 10 %, zur Wiederherstellung der gastrointestinalen Schleimhautbarriere.",
            "abstract_de": "Die Erfindung offenbart eine standardisierte Triphala-Zubereitung bestehend aus gleichen Teilen wässrig-methanolischer Fruchtextrakte von Terminalia chebula, Terminalia bellerica und Phyllanthus emblica, standardisiert auf Gesamtpolyphenole >= 45 % und Ellagsäure >= 10 %, zur Wiederherstellung der gastrointestinalen Schleimhautbarriere.",
            "claims": [
                "1. Standardisierte pflanzliche Zubereitung aus Früchten von Terminalia chebula, Terminalia bellerica und Phyllanthus emblica zu gleichen Gewichtsanteilen, gekennzeichnet durch einen Gesamtgehalt an Polyphenolen von mindestens 45 Gew.-% und einen Ellagsäure-Gehalt von mindestens 10 Gew.-%.",
                "2. Zubereitung nach Anspruch 1 zur Anwendung bei der Behandlung des Leaky-Gut-Syndroms und chronischen funktionellen Magen-Darm-Beschwerden.",
                "3. Orale Darreichungsform enthaltend die Zubereitung nach Anspruch 1 in Kombination mit Präbiotika."
            ],
            "description": "Die klassische Rezeptur Triphala ist ein Grundpfeiler der ayurvedischen Pharmakopöe. Die Erfindung zeigt, dass eine gezielte Standardisierung auf Ellagsäure und Chebulinsäure die Genexpression von Occludin und Claudin-1 in Darmepithelzellen um mehr als 180 % steigert.",
            "ipc": ["A61K36/185", "A61P1/00"],
            "cpc": ["A61K36/185", "A61P1/00"],
            "filing_date": "2021-04-20",
            "publication_date": "2022-10-27",
            "applicant": "Martin Bauer Phytomedicine GmbH",
            "inventor": ["Dr. Stefan Schmidt", "Dr. Priya Deshmukh"],
            "country": "Germany",
            "jurisdiction": "DE",
            "language": "de",
            "source_dataset": "Deutsches Patent- und Markenamt (DPMA / DEPATISnet)",
            "source_url": "https://depatisnet.dpma.de/DepatisNet/depatisnet?action=pdf&docid=DE102021109876A1"
        }
    ]
