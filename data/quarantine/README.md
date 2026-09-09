# IP-SAKTI Sahayak — Data Quarantine Policy & Registry

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
