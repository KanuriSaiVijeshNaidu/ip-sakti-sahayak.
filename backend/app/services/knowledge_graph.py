"""
backend/app/services/knowledge_graph.py
───────────────────────────────────────
Lightweight legal knowledge graph representation for Indian statutory relationships:
Act -> Section -> Rule -> Schedule -> Authority -> Procedure -> Evidence.
"""
from __future__ import annotations

from typing import Any, Dict, List, Optional

LEGAL_GRAPH: Dict[str, Dict[str, Any]] = {
    "PATENTS_ACT_1970": {
        "title": "The Patents Act, 1970 (Act No. 39 of 1970)",
        "authority": "Controller General of Patents, Designs and Trade Marks (CGPDTM), DPIIT",
        "jurisdiction": "IN",
        "sections": {
            "3(e)": {
                "title": "Section 3(e) - Mere Admixture Bar",
                "rules": ["Patent Rules, 2003 - Rule 13"],
                "statutory_hurdle": "Prohibits aggregation of properties without unexpected synergy",
                "required_proof": "Comparative pharmacological bioassays / Combination Index (CI < 1.0)",
                "related_sections": ["Section 2(1)(ja) - Inventive Step", "Section 3(d)"]
            },
            "3(p)": {
                "title": "Section 3(p) - Traditional Knowledge Exclusion",
                "statutory_hurdle": "Inventions that are traditional knowledge or duplications thereof are not patentable",
                "authoritative_corpus": ["TKDL", "AFI", "API", "Classical Ayurvedic Samhitas"],
                "related_sections": ["Section 2(1)(l) - Anticipation by Prior Art", "Section 64(1)(p) - Revocation Grounds"]
            },
            "10(4)": {
                "title": "Section 10(4)(ii)(D) - Mandatory Biological Origin Disclosure",
                "statutory_hurdle": "Must disclose source and geographical origin of biological resources",
                "related_acts": ["Biological Diversity Act, 2002 - Section 6"],
                "revocation_consequence": "Absolute ground for pre/post-grant opposition and revocation under Section 64(1)(p)"
            }
        }
    },
    "BIOLOGICAL_DIVERSITY_ACT_2002": {
        "title": "The Biological Diversity Act, 2002 (Act No. 18 of 2003)",
        "authority": "National Biodiversity Authority (NBA, Chennai) & State Biodiversity Boards (SBB)",
        "jurisdiction": "IN",
        "sections": {
            "6": {
                "title": "Section 6 - Prior Approval for Intellectual Property Application",
                "procedure": "Mandatory Form III electronic submission to NBA prior to grant of patent",
                "consequence": "Penalty of up to 5 years imprisonment or INR 10 Lakhs fine for unauthorized commercial access",
                "related_regulations": ["Access and Benefit Sharing (ABS) Regulations, 2014"]
            }
        }
    },
    "DRUGS_AND_COSMETICS_ACT_1940": {
        "title": "The Drugs and Cosmetics Act, 1940 & Rules, 1945",
        "authority": "Ministry of Ayush & State Licensing Authorities (SLA)",
        "jurisdiction": "IN",
        "rules": {
            "158B": {
                "title": "Rule 158B - Regulatory Proof of Safety and Efficacy for ASU Drugs",
                "categories": [
                    "Classical ASU Medicine (AFI/API Referenced)",
                    "Ayurvedic Proprietary Medicine (New combinations with classical safety citations)",
                    "New ASU Drug (Requires full Phase I/II/III clinical trials)"
                ],
                "gmp_requirement": "Schedule T compliance (Quality control, hygiene, machinery, batch testing)"
            }
        }
    },
    "FSSAI_AYURVEDA_AAHARA_2022": {
        "title": "Food Safety and Standards (Ayurveda Aahara) Regulations, 2022",
        "authority": "Food Safety and Standards Authority of India (FSSAI) & Ministry of Ayush",
        "jurisdiction": "IN",
        "provisions": {
            "Formulation Scope": "Food prepared in accordance with classical Ayurveda texts listed in Schedule A",
            "Restrictions": "Cannot make medicinal/disease treatment claims; strictly dietary/nutritional support",
            "Logo": "Mandatory dedicated Ayurveda Aahara logo on product packaging"
        }
    }
}


def query_knowledge_graph(topic_key: str) -> Optional[Dict[str, Any]]:
    """Retrieve structured statutory relationships for a given legal concept or act."""
    t_clean = topic_key.upper().replace(" ", "_")
    for act_key, data in LEGAL_GRAPH.items():
        if t_clean in act_key or act_key in t_clean:
            return data
    return None
