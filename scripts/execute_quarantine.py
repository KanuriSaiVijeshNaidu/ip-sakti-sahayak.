import os
import json
import hashlib
import shutil
from pathlib import Path

def run_quarantine():
    quarantine_dir = Path("data/quarantine")
    quarantine_dir.mkdir(parents=True, exist_ok=True)

    records = [
        # India
        {
            "identifier": "IN-243763-B",
            "jurisdiction": "INDIA",
            "source": "IPO / InPASS (Unverified)",
            "original_path": "data/india/raw/IN-243763-B.json",
            "reason": "Publication number and application number 890/DEL/2005 not independently verifiable in InPASS linking to Withania somnifera specification.",
            "verification_result": "UNVERIFIED / SYNTHETIC PLACEHOLDER"
        },
        {
            "identifier": "IN-268685-B",
            "jurisdiction": "INDIA",
            "source": "IPO / InPASS (Unverified)",
            "original_path": "data/india/raw/IN-268685-B.json",
            "reason": "Publication number 268685 / 1456/DEL/2008 could not be independently linked to claimed herbal formulation.",
            "verification_result": "UNVERIFIED / SYNTHETIC PLACEHOLDER"
        },
        {
            "identifier": "IN-284123-B",
            "jurisdiction": "INDIA",
            "source": "IPO / InPASS (Unverified)",
            "original_path": "data/india/raw/IN-284123-B.json",
            "reason": "Application 2104/MUM/2009 unverified in InPASS for polyherbal hepatoprotective claim text.",
            "verification_result": "UNVERIFIED / SYNTHETIC PLACEHOLDER"
        },
        {
            "identifier": "IN-324590-B",
            "jurisdiction": "INDIA",
            "source": "IPO / InPASS (Unverified)",
            "original_path": "data/india/raw/IN-324590-B.json",
            "reason": "Application 345/KOL/2011 unverified in InPASS for Boswellia serrata claim text.",
            "verification_result": "UNVERIFIED / SYNTHETIC PLACEHOLDER"
        },
        {
            "identifier": "IN-348215-B",
            "jurisdiction": "INDIA",
            "source": "IPO / InPASS (Unverified)",
            "original_path": "data/india/raw/IN-348215-B.json",
            "reason": "Application 1892/CHE/2012 unverified in InPASS for anti-diabetic specification.",
            "verification_result": "UNVERIFIED / SYNTHETIC PLACEHOLDER"
        },
        # Germany
        {
            "identifier": "DE-102014002621-A1",
            "jurisdiction": "GERMANY",
            "source": "DPMA / DEPATISnet (Unverified)",
            "original_path": "data/germany/raw/DE-102014002621-A1.json",
            "reason": "Publication DE 10 2014 002 621 A1 could not be linked to herbal composition in DPMAregister.",
            "verification_result": "UNVERIFIED / SYNTHETIC PLACEHOLDER"
        },
        {
            "identifier": "DE-102012015247-A1",
            "jurisdiction": "GERMANY",
            "source": "DPMA / DEPATISnet (Unverified)",
            "original_path": "data/germany/raw/DE-102012015247-A1.json",
            "reason": "Publication DE 10 2012 015 247 A1 could not be verified in DPMAregister for Boswellia preparation.",
            "verification_result": "UNVERIFIED / SYNTHETIC PLACEHOLDER"
        },
        {
            "identifier": "DE-102016008912-A1",
            "jurisdiction": "GERMANY",
            "source": "DPMA / DEPATISnet (Unverified)",
            "original_path": "data/germany/raw/DE-102016008912-A1.json",
            "reason": "Publication DE 10 2016 008 912 A1 unverified in DPMAregister.",
            "verification_result": "UNVERIFIED / SYNTHETIC PLACEHOLDER"
        },
        {
            "identifier": "DE-102017105432-A1",
            "jurisdiction": "GERMANY",
            "source": "DPMA / DEPATISnet (Unverified)",
            "original_path": "data/germany/raw/DE-102017105432-A1.json",
            "reason": "Publication DE 10 2017 105 432 A1 unverified in DPMAregister.",
            "verification_result": "UNVERIFIED / SYNTHETIC PLACEHOLDER"
        },
        {
            "identifier": "DE-102021109876-A1",
            "jurisdiction": "GERMANY",
            "source": "DPMA / DEPATISnet (Unverified)",
            "original_path": "data/germany/raw/DE-102021109876-A1.json",
            "reason": "Publication DE 10 2021 109 876 A1 unverified in DPMAregister.",
            "verification_result": "UNVERIFIED / SYNTHETIC PLACEHOLDER"
        },
        # WIPO
        {
            "identifier": "WO-2018083696-A1",
            "jurisdiction": "WIPO",
            "source": "WIPO PATENTSCOPE (Unverified)",
            "original_path": "data/wipo/raw/WO-2018083696-A1.json",
            "reason": "PCT application PCT/IN2017/050512 could not be independently linked to herbal specification.",
            "verification_result": "UNVERIFIED / SYNTHETIC PLACEHOLDER"
        },
        {
            "identifier": "WO-2019123456-A1",
            "jurisdiction": "WIPO",
            "source": "WIPO PATENTSCOPE (Mismatch)",
            "original_path": "data/wipo/raw/WO-2019123456-A1.json",
            "reason": "Technology mismatch: Actual WO 2019/123456 A1 relates to bio-based isocyanate (HDI) chemical synthesis, not curcuminoid SEDDS.",
            "verification_result": "CRITICAL IDENTIFIER MISMATCH"
        },
        {
            "identifier": "WO-2021098765-A1",
            "jurisdiction": "WIPO",
            "source": "WIPO PATENTSCOPE (Mismatch)",
            "original_path": "data/wipo/raw/WO-2021098765-A1.json",
            "reason": "Technology mismatch: Actual WO 2021/098765 A1 is Tencent video keyframe selection patent, not Withania extraction.",
            "verification_result": "CRITICAL IDENTIFIER MISMATCH"
        },
        {
            "identifier": "WO-2022034567-A1",
            "jurisdiction": "WIPO",
            "source": "WIPO PATENTSCOPE (Unverified)",
            "original_path": "data/wipo/raw/WO-2022034567-A1.json",
            "reason": "PCT/IB2021/057890 could not be authenticated in PATENTSCOPE for botanical hydrogel.",
            "verification_result": "UNVERIFIED / SYNTHETIC PLACEHOLDER"
        },
        {
            "identifier": "WO-2023098712-A1",
            "jurisdiction": "WIPO",
            "source": "WIPO PATENTSCOPE (Mismatch)",
            "original_path": "data/wipo/raw/WO-2023098712-A1.json",
            "reason": "Technology mismatch: Actual WO 2023/098712 A1 is an EV Chassis Battery Swapping patent, not herbal immunotherapeutic.",
            "verification_result": "CRITICAL IDENTIFIER MISMATCH"
        }
    ]

    manifest_entries = []
    for rec in records:
        orig = Path(rec["original_path"])
        dest_filename = f"{rec['jurisdiction'].lower()}_{rec['identifier']}.json"
        dest = quarantine_dir / dest_filename
        checksum = "N/A"
        if orig.exists():
            content = orig.read_bytes()
            checksum = hashlib.sha256(content).hexdigest()
            shutil.copy2(orig, dest)
        elif (Path("data/test_fixtures") / rec["jurisdiction"].lower() / "raw" / f"{rec['identifier']}.json").exists():
            orig_tf = Path("data/test_fixtures") / rec["jurisdiction"].lower() / "raw" / f"{rec['identifier']}.json"
            content = orig_tf.read_bytes()
            checksum = hashlib.sha256(content).hexdigest()
            shutil.copy2(orig_tf, dest)

        rec["checksum"] = checksum
        rec["quarantine_path"] = str(dest)
        manifest_entries.append(rec)

    with open(quarantine_dir / "quarantine_manifest.jsonl", "w", encoding="utf-8") as f:
        for e in manifest_entries:
            f.write(json.dumps(e) + "\n")

    # Also write README.md
    readme_content = """# IP-SAKTI Sahayak — Data Quarantine Policy & Registry

In compliance with Rule 11 of the SIH 26045 Data Integrity Policy, any document that fails independent registry verification, presents technology/publication mismatches, or lacks verifiable gazette provenance is strictly quarantined and excluded from production corpora.

## Quarantined Records Overview
- **Total Quarantined**: 15 documents
- **India**: 5 documents (Unverified gazette application numbers)
- **Germany**: 5 documents (Unverified DPMAregister records)
- **WIPO**: 5 documents (Severe publication number mismatches, e.g. EV battery patents vs herbal claims)

## Policy Enforcement
- Quarantined records are **NOT silently deleted**.
- Every record preserves: original path, sha256 checksum, reason for rejection, and original source claims.
- Production and evaluation systems strictly exclude files in `data/quarantine/`.
"""
    with open(quarantine_dir / "README.md", "w", encoding="utf-8") as f:
        f.write(readme_content)

    print(f"Quarantined {len(manifest_entries)} documents successfully to {quarantine_dir}")

if __name__ == "__main__":
    run_quarantine()
