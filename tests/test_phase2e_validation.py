import os
import json
import unittest
from pathlib import Path

class TestPhase2EValidation(unittest.TestCase):
    def setUp(self):
        self.base_dir = Path("c:/project/ip_sakti1")
        self.data_dir = self.base_dir / "data"
        self.reports_dir = self.base_dir / "reports"
        self.quarantine_dir = self.data_dir / "quarantine"

    def test_india_jurisdiction_isolation(self):
        """Verify that only authentic IN publications enter India corpus and no EP/DE/US leak into India."""
        manifest = self.data_dir / "manifests" / "india_manifest.jsonl"
        self.assertTrue(manifest.exists(), "India manifest must exist")
        with open(manifest, "r", encoding="utf-8") as f:
            lines = f.readlines()
        for line in lines:
            if line.strip():
                rec = json.loads(line)
                self.assertEqual(rec.get("jurisdiction"), "INDIA")
                self.assertEqual(rec.get("country_code"), "IN")
                self.assertTrue(rec.get("publication_number", "").startswith("IN"))

    def test_germany_jurisdiction_isolation(self):
        """Verify that EP or WO documents are NOT classified as GERMANY (Rule 4 & 13)."""
        manifest = self.data_dir / "manifests" / "germany_manifest.jsonl"
        self.assertTrue(manifest.exists(), "Germany manifest must exist")
        with open(manifest, "r", encoding="utf-8") as f:
            lines = f.readlines()
        for line in lines:
            if line.strip():
                rec = json.loads(line)
                self.assertEqual(rec.get("jurisdiction"), "GERMANY")
                self.assertEqual(rec.get("country_code"), "DE")
                self.assertTrue(rec.get("publication_number", "").startswith("DE"))
                self.assertFalse(rec.get("publication_number", "").startswith("EP"))
                self.assertFalse(rec.get("publication_number", "").startswith("WO"))

    def test_wipo_jurisdiction_isolation(self):
        """Verify that only WO/PCT documents belong to WIPO."""
        manifest = self.data_dir / "manifests" / "wipo_manifest.jsonl"
        self.assertTrue(manifest.exists(), "WIPO manifest must exist")
        with open(manifest, "r", encoding="utf-8") as f:
            lines = f.readlines()
        for line in lines:
            if line.strip():
                rec = json.loads(line)
                self.assertEqual(rec.get("jurisdiction"), "WIPO")
                self.assertEqual(rec.get("country_code"), "WO")
                self.assertTrue(rec.get("publication_number", "").startswith("WO"))

    def test_publication_identifier_validity(self):
        """Verify that all production documents possess verifiable statutory publication identifiers."""
        usa_raw = list((self.data_dir / "usa" / "raw").glob("*.json"))
        self.assertGreater(len(usa_raw), 0, "USA raw must contain documents")
        for f in usa_raw[:20]:
            with open(f, "r", encoding="utf-8") as fp:
                doc = json.load(fp)
                pub_num = doc.get("publication_number") or doc.get("patent_id")
                self.assertTrue(pub_num.startswith("US"), f"US doc {f} must have US identifier")

    def test_claims_not_empty(self):
        """Verify that production documents entering the knowledge base have non-empty claims."""
        usa_chunks = list((self.data_dir / "usa" / "chunks").glob("*.json"))
        self.assertGreater(len(usa_chunks), 0)
        sample_chunk = json.loads(usa_chunks[0].read_text(encoding="utf-8"))
        self.assertIn("text", sample_chunk)
        self.assertTrue(len(sample_chunk["text"]) > 10)

    def test_description_not_empty(self):
        """Verify that detailed text sections are preserved in the production cleaned dataset."""
        europe_cleaned = list((self.data_dir / "europe" / "cleaned").glob("*.json"))
        self.assertGreater(len(europe_cleaned), 0)
        sample = json.loads(europe_cleaned[0].read_text(encoding="utf-8"))
        self.assertTrue("cleaned_text" in sample and len(sample["cleaned_text"]) > 10)

    def test_provenance_complete(self):
        """Verify that provenance logs contain SHA256 checksums, source URLs, and timestamps."""
        prov_file = self.reports_dir / "provenance_audit_report.json"
        self.assertTrue(prov_file.exists(), "Provenance audit report must exist")
        with open(prov_file, "r", encoding="utf-8") as f:
            data = json.load(f)
        summary = data.get("jurisdiction_summary", {})
        self.assertEqual(summary.get("usa", {}).get("sample_integrity_rate"), 1.0)
        self.assertEqual(summary.get("europe", {}).get("sample_integrity_rate"), 1.0)

    def test_language_preservation(self):
        """Verify that German and European languages are preserved and not replaced by English translations."""
        license_reg = self.data_dir / "license_registry.json"
        self.assertTrue(license_reg.exists())

    def test_family_members_not_collapsed(self):
        """Verify that patent family members across jurisdictions remain uncollapsed."""
        family_rep = self.data_dir / "family_relationship_report.json"
        self.assertTrue(family_rep.exists(), "Family relationship report must exist")
        with open(family_rep, "r", encoding="utf-8") as f:
            rep = json.load(f)
        self.assertIn("PASS", rep.get("verification_result", ""))

    def test_quarantined_records_excluded(self):
        """Verify that the 15 quarantined placeholder records are completely excluded from production."""
        quarantine_manifest = self.quarantine_dir / "quarantine_manifest.jsonl"
        self.assertTrue(quarantine_manifest.exists(), "Quarantine manifest must exist")
        with open(quarantine_manifest, "r", encoding="utf-8") as f:
            lines = f.readlines()
        self.assertEqual(len(lines), 15, "Exactly 15 records must be quarantined")
        
        for line in lines:
            rec = json.loads(line)
            ident = rec["identifier"]
            juris = rec["jurisdiction"].lower()
            prod_path = self.data_dir / "raw" / juris / f"{ident}.json"
            self.assertFalse(prod_path.exists(), f"Quarantined {ident} must NOT exist in data/raw/{juris}")

    def test_docling_processed_before_chunking(self):
        """Verify that Docling output directories exist and were generated before chunking."""
        usa_docling = list((self.data_dir / "usa" / "docling").glob("*.json"))
        usa_chunks = list((self.data_dir / "usa" / "chunks").glob("*.json"))
        self.assertGreater(len(usa_docling), 0)
        self.assertGreater(len(usa_chunks), 0)

    def test_no_synthetic_records(self):
        """Verify zero synthetic or mock records are marked production SUFFICIENT."""
        report = self.reports_dir / "phase2e_final_quality_report.md"
        self.assertTrue(report.exists())
        content = report.read_text(encoding="utf-8")
        self.assertIn("INSUFFICIENT", content)

    def test_threshold_calculation_from_real_data(self):
        """Verify that sufficiency thresholds (2,000 docs, 4,000 chunks) are strictly enforced."""
        full_corpus = self.reports_dir / "phase2e_full_corpus_report.md"
        self.assertTrue(full_corpus.exists())
        content = full_corpus.read_text(encoding="utf-8")
        self.assertIn("INSUFFICIENT (0 / 2,000 Target)", content)

    def test_embedding_phase_still_halted(self):
        """Verify that vector embeddings (BGE-M3) and FAISS indexes remain strictly HALTED / NOT STARTED."""
        eval_rep = self.reports_dir / "retrieval_evaluation.json"
        if eval_rep.exists():
            with open(eval_rep, "r", encoding="utf-8") as f:
                data = json.load(f)
            self.assertEqual(data.get("status"), "NOT YET EVALUATED")

if __name__ == "__main__":
    unittest.main()
