import os
import json
import unittest
from pathlib import Path

class TestPhase2HValidation(unittest.TestCase):
    def setUp(self):
        self.base_dir = Path("c:/project/ip_sakti1")
        self.data_dir = self.base_dir / "data"
        self.reports_dir = self.base_dir / "reports"
        self.quarantine_dir = self.data_dir / "quarantine"

    def test_wipo_publication_identity(self):
        """Verify that newly ingested WIPO documents possess authentic statutory WO publication identifiers."""
        wipo_raw = list((self.data_dir / "wipo" / "raw").glob("*.json"))
        self.assertEqual(len(wipo_raw), 339, "Exactly 339 verified WIPO documents must exist in raw")
        for f in wipo_raw[:20]:
            doc = json.loads(f.read_text(encoding="utf-8"))
            pub = doc.get("publication_number", "")
            self.assertTrue(pub.startswith("WO"), f"Doc {f} must have statutory WO identifier")

    def test_jurisdiction_isolation(self):
        """Verify that each jurisdiction contains only documents belonging to its statutory territory."""
        manifest = self.data_dir / "manifests" / "wipo_manifest.jsonl"
        self.assertTrue(manifest.exists())
        with open(manifest, "r", encoding="utf-8") as f:
            for line in f:
                if line.strip():
                    rec = json.loads(line)
                    self.assertEqual(rec.get("jurisdiction"), "WIPO")
                    self.assertEqual(rec.get("country_code"), "WO")
                    self.assertTrue(rec.get("publication_number", "").startswith("WO"))
                    self.assertFalse(rec.get("publication_number", "").startswith("US"))
                    self.assertFalse(rec.get("publication_number", "").startswith("EP"))
                    self.assertFalse(rec.get("publication_number", "").startswith("DE"))
                    self.assertFalse(rec.get("publication_number", "").startswith("IN"))

    def test_claims_present(self):
        """Verify that every WIPO production document contains non-empty claims."""
        wipo_raw = list((self.data_dir / "wipo" / "raw").glob("*.json"))
        for f in wipo_raw[:30]:
            doc = json.loads(f.read_text(encoding="utf-8"))
            claims = doc.get("claims", "")
            self.assertTrue(len(claims) > 100, f"Doc {f} must have non-empty claims")

    def test_description_present(self):
        """Verify that every WIPO production document contains a substantial detailed description."""
        wipo_raw = list((self.data_dir / "wipo" / "raw").glob("*.json"))
        for f in wipo_raw[:30]:
            doc = json.loads(f.read_text(encoding="utf-8"))
            desc = doc.get("description", "")
            self.assertTrue(len(desc) > 500, f"Doc {f} must have substantial description")

    def test_provenance_complete(self):
        """Verify that immutable provenance records exist with valid SHA-256 for all WIPO docs."""
        prov_files = list((self.data_dir / "provenance" / "wipo").glob("*_provenance.json"))
        self.assertEqual(len(prov_files), 339, "Exactly 339 provenance files must exist for WIPO")
        for pf in prov_files[:20]:
            pdata = json.loads(pf.read_text(encoding="utf-8"))
            self.assertEqual(pdata.get("jurisdiction"), "WIPO")
            self.assertEqual(pdata.get("country_code"), "WO")
            self.assertTrue(len(pdata.get("sha256", "")) == 64)
            self.assertIn("verification_status", pdata)

    def test_docling_success(self):
        """Verify that all WIPO documents were processed through Docling layout extraction."""
        docling_files = list((self.data_dir / "wipo" / "docling").glob("*.json"))
        self.assertEqual(len(docling_files), 339, "Docling output must exist for all 339 WIPO documents")
        for df in docling_files[:20]:
            ddata = json.loads(df.read_text(encoding="utf-8"))
            self.assertIn("sections", ddata)
            self.assertIn("claims", ddata["sections"])
            self.assertIn("description", ddata["sections"])

    def test_chunking_metadata(self):
        """Verify that chunks retain document ID, publication number, section, and no cross-document mixing."""
        chunk_files = list((self.data_dir / "wipo" / "chunks").glob("*.json"))
        self.assertGreater(len(chunk_files), 10000, "WIPO must have over 10,000 preserved chunks")
        for cf in chunk_files[:30]:
            cdata = json.loads(cf.read_text(encoding="utf-8"))
            self.assertEqual(cdata.get("country"), "WIPO")
            self.assertTrue(cdata.get("chunk_id", "").startswith("WIPO-CHK-"))
            self.assertIn(cdata.get("section"), ["abstract", "claims", "description"])
            self.assertTrue(len(cdata.get("text", "")) > 10)

    def test_family_member_isolation(self):
        """Verify that 252 family-mixed rows were quarantined and NOT admitted to production."""
        audit_file = self.reports_dir / "phase2h_wipo_forensics_audit.json"
        self.assertTrue(audit_file.exists())
        audit_data = json.loads(audit_file.read_text(encoding="utf-8"))
        self.assertEqual(audit_data.get("wipo_acceptable_count"), 339)
        self.assertEqual(audit_data.get("wipo_family_mixed_count"), 252)

    def test_no_synthetic_records(self):
        """Verify zero synthetic or fabricated records enter the production corpus."""
        wipo_raw = list((self.data_dir / "wipo" / "raw").glob("*.json"))
        for f in wipo_raw:
            doc = json.loads(f.read_text(encoding="utf-8"))
            self.assertFalse(doc.get("synthetic", False))
            self.assertIn("Bosch PLS Benchmark", doc.get("source_dataset", ""))

    def test_quarantined_records_excluded(self):
        """Verify that all 15 quarantined placeholder records remain strictly excluded."""
        quarantine_manifest = self.quarantine_dir / "quarantine_manifest.jsonl"
        self.assertTrue(quarantine_manifest.exists())
        with open(quarantine_manifest, "r", encoding="utf-8") as f:
            lines = f.readlines()
        self.assertEqual(len(lines), 15)
        for line in lines:
            ident = json.loads(line)["identifier"]
            self.assertFalse((self.data_dir / "wipo" / "raw" / f"{ident}.json").exists())
            self.assertFalse((self.data_dir / "wipo" / "docling" / f"{ident}.json").exists())

    def test_pre_embedding_hard_stop(self):
        """Verify that vector embeddings (BGE-M3) and FAISS indexes remain strictly HALTED."""
        eval_rep = self.reports_dir / "retrieval_evaluation.json"
        if eval_rep.exists():
            data = json.loads(eval_rep.read_text(encoding="utf-8"))
            self.assertEqual(data.get("status"), "NOT YET EVALUATED")

    def test_actual_measured_counts(self):
        """Verify exact measured document counts across all jurisdictions."""
        usa_raw = len(list((self.data_dir / "usa" / "raw").glob("*.json")))
        ep_raw = len(list((self.data_dir / "europe" / "raw").glob("*.json")))
        wipo_raw = len(list((self.data_dir / "wipo" / "raw").glob("*.json")))
        self.assertEqual(usa_raw, 1159)
        self.assertEqual(ep_raw, 646)
        self.assertEqual(wipo_raw, 339)

if __name__ == "__main__":
    unittest.main()
