"""
scripts/test_multilingual_jurisdictions.py
───────────────────────────────────────────
Automated Test Suite for SIH 26045 Master Upgrade:
1. Localization dictionary completeness (DE, TE, HI, EN).
2. Docling document schema and dataset audit report verification.
3. German/EU statutory corpus indexing and retrieval verification.
4. Jurisdiction boundary isolation (DE vs US vs IN).
5. Cross-language and decoupling verification (Language != Country != Jurisdiction).
6. Insufficient authoritative evidence guardrail.
"""
import asyncio
import json
import re
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

PASSED_TESTS = 0
FAILED_TESTS = 0


def record_result(name: str, passed: bool, detail: str = ""):
    global PASSED_TESTS, FAILED_TESTS
    if passed:
        PASSED_TESTS += 1
        print(f"  [PASS] {name} {detail}")
    else:
        FAILED_TESTS += 1
        print(f"  [FAIL] {name} - {detail}")


def test_localization_completeness():
    print("\n--- Test 1: Localization Completeness (DE, TE, HI, EN) ---")
    locales_dir = BASE_DIR / "frontend" / "src" / "locales"

    # Verify files exist
    for lang in ["en", "te", "hi", "de"]:
        path = locales_dir / f"{lang}.ts"
        record_result(f"Locale file exists: {lang}.ts", path.exists(), str(path))

    # Test key presence via regex in ts files
    required_sections = [
        "title", "subtitle", "tagline", "welcomeDesc", "inputPlaceholder", "legalDisclaimer",
        "domains", "referredSources", "viewQuoted", "hideQuoted", "sourceDoc", "genTime",
        "searchingCorpus", "suggestions", "jurisdictionSuggestions", "nav", "citations",
        "locationPage", "chat", "profilePage"
    ]

    for lang in ["en", "te", "hi", "de"]:
        ts_content = (locales_dir / f"{lang}.ts").read_text(encoding="utf-8")
        all_found = True
        missing = []
        for sec in required_sections:
            if f"{sec}:" not in ts_content:
                all_found = False
                missing.append(sec)
        record_result(
            f"All schema sections present in {lang}.ts",
            all_found,
            f"Missing: {missing}" if missing else "All 20 sections confirmed"
        )

        # Verify jurisdictionSuggestions has US, EU, DE, WO, IN
        for jur in ["US", "EU", "DE", "WO", "IN"]:
            jur_found = f"{jur}:" in ts_content
            record_result(
                f"Jurisdiction suggestions present for {jur} in {lang}.ts",
                jur_found
            )


def test_docling_and_dataset_report():
    print("\n--- Test 2: Docling Documents & Dataset Quality Report ---")
    docling_dir = BASE_DIR / "data" / "docling"
    report_file = BASE_DIR / "data" / "germany_eu_dataset_report.json"

    expected_docs = [
        "de_dpma_patent_act",
        "de_amg_medicines_act",
        "de_markeng_trademarks",
        "de_bfarm_commission_e",
        "de_abs_nagoya_protocol",
        "eu_thmpd_directive_2004_24_ec",
        "eu_epc_medicinal_patents",
    ]

    for doc in expected_docs:
        json_path = docling_dir / f"{doc}.json"
        md_path = docling_dir / f"{doc}.md"
        record_result(f"Docling JSON exists: {doc}.json", json_path.exists())
        record_result(f"Docling MD exists: {doc}.md", md_path.exists())

        if json_path.exists():
            data = json.loads(json_path.read_text(encoding="utf-8"))
            valid_schema = data.get("schema_name") == "DoclingDocument" and data.get("version") == "1.10.0"
            record_result(f"Valid Docling 1.10.0 schema: {doc}.json", valid_schema)

    record_result("Dataset quality report exists", report_file.exists())
    if report_file.exists():
        rep = json.loads(report_file.read_text(encoding="utf-8"))
        record_result(
            "Report covers all 7 German/EU documents",
            rep.get("total_documents") == 7,
            f"Total documents: {rep.get('total_documents')}, Total sections: {rep.get('total_sections')}"
        )


async def test_retrieval_and_jurisdiction_isolation():
    print("\n--- Test 3: German/EU Statutory Retrieval & Strict Isolation ---")
    from backend.app.retrieval.bm25_retriever import bm25_retriever
    from backend.app.retrieval.vector_retriever import vector_retriever
    from backend.app.retrieval.fusion import retrieve

    if not bm25_retriever.is_built():
        await bm25_retriever.build()
    if not vector_retriever.is_built():
        await vector_retriever.build()

    # Test A: German jurisdiction query
    de_res = await retrieve(
        query="What are the requirements for registration of traditional herbal medicinal products under AMG § 39a?",
        jurisdiction="DE",
        final_top_k=5
    )
    fused_de = de_res["fused_candidates"]
    record_result("Retrieved candidates for German AMG query", len(fused_de) > 0, f"Found {len(fused_de)} candidates")

    de_statutes = [c.jurisdiction for c in fused_de]
    is_strictly_de_eu = all(j in ("DE", "EU") for j in de_statutes)
    record_result("Strict Germany isolation (only DE or EU, no IN/US)", is_strictly_de_eu, f"Jurisdictions: {de_statutes}")

    de_matched_amg = any("39a" in c.text.lower() or "amg" in c.text.lower() or "herbal" in c.text.lower() for c in fused_de)
    record_result("Retrieved AMG § 39a statutory content", de_matched_amg)

    # Test B: US jurisdiction isolation
    us_res = await retrieve(
        query="Can I patent a natural botanical extract under 35 U.S.C. 101?",
        jurisdiction="US",
        final_top_k=5
    )
    fused_us = us_res["fused_candidates"]
    record_result("Retrieved candidates for US query", len(fused_us) > 0, f"Found {len(fused_us)} candidates")
    us_statutes = [c.jurisdiction for c in fused_us]
    is_strictly_us = all(j == "US" for j in us_statutes)
    record_result("Strict US isolation (only US, zero IN/DE)", is_strictly_us, f"Jurisdictions: {us_statutes}")

    # Test C: India jurisdiction isolation
    in_res = await retrieve(
        query="What is Section 3(e) and 3(p) regarding traditional knowledge?",
        jurisdiction="IN",
        final_top_k=5
    )
    fused_in = in_res["fused_candidates"]
    record_result("Retrieved candidates for India query", len(fused_in) > 0, f"Found {len(fused_in)} candidates")
    in_statutes = [c.jurisdiction for c in fused_in]
    is_strictly_in = all(j == "IN" for j in in_statutes)
    record_result("Strict India isolation (only IN)", is_strictly_in, f"Jurisdictions: {in_statutes}")


async def test_cross_language_and_decoupling():
    print("\n--- Test 4: Multilingual Decoupling (Language != Country != Jurisdiction) ---")
    from backend.app.llm.mock_llm import MockLLMAdapter

    llm = MockLLMAdapter()

    # 1. German language query about Germany
    resp_de = await llm.generate(
        query="Welche Anforderungen stellt AMG § 39a an die Registrierung traditioneller pflanzlicher Arzneimittel?",
        context="[src-1] AMG § 39a | Arzneimittelgesetz | ayush | DE\nTraditionelle pflanzliche Arzneimittel bedürfen einer Registrierung durch das BfArM. Nachweis 30 Jahre traditional use davon 15 Jahre in der EU.",
        language="de",
        jurisdiction="DE"
    )
    record_result("German answer generated in German", "§ 39a" in resp_de.answer and "Arzneimittel" in resp_de.answer)
    record_result("German answer cites German statutory authority", "BfArM" in resp_de.answer or "AMG" in resp_de.answer)

    # 2. German language query about India (Language = German, Jurisdiction = India)
    resp_de_in = await llm.generate(
        query="Wie kann ich eine ayurvedische Rezeptur in Indien patentieren?",
        context="[src-1] Section 3(e) & 3(p) | The Patents Act, 1970 | patents | IN\nMere admixtures are not patentable. Synergistic effect required. Section 3(p) excludes traditional knowledge.",
        language="de",
        jurisdiction="IN"
    )
    record_result(
        "German answer for Indian jurisdiction is in German citing Indian law",
        ("Section 3" in resp_de_in.answer or "Patents Act" in resp_de_in.answer) and "Rechtsrahmen" in resp_de_in.answer
    )

    # 3. Telugu query about Germany (Language = Telugu, Jurisdiction = Germany)
    resp_te_de = await llm.generate(
        query="జర్మనీలో సాంప్రదాయ మూలికా ఔషధాల నమోదు కొరకు చట్టపరమైన నిబంధనలు ఏమిటి?",
        context="[src-1] AMG § 39a | Arzneimittelgesetz | ayush | DE\n30 years traditional use required with 15 years in EU. Module 3 quality dossier required.",
        language="te",
        jurisdiction="DE"
    )
    record_result(
        "Telugu answer for German jurisdiction is in Telugu citing German law",
        ("జర్మనీ" in resp_te_de.answer or "AMG" in resp_te_de.answer) and "30" in resp_te_de.answer
    )

    # 4. English query about Germany (Language = English, Jurisdiction = Germany)
    resp_en_de = await llm.generate(
        query="What are the simplified registration requirements under AMG § 39a in Germany?",
        context="[src-1] AMG § 39a | Arzneimittelgesetz | ayush | DE\nRequirements of registration for traditional herbal medicinal products.",
        language="en",
        jurisdiction="DE"
    )
    record_result(
        "English answer for German jurisdiction cites AMG and BfArM",
        "AMG § 39a" in resp_en_de.answer and "BfArM" in resp_en_de.answer
    )

    # 5. Insufficient evidence guardrail test
    resp_empty = await llm.generate(
        query="What is the patent law in Antarctica?",
        context="",
        language="de",
        jurisdiction="DE"
    )
    record_result(
        "Zero hallucination disclaimer in German when context is empty",
        "Unzureichende amtliche Rechtsquellen" in resp_empty.answer or "Null-Halluzinations-Garantie" in resp_empty.answer
    )


async def main():
    print("=" * 70)
    print("AYURLEX SIH26045 — MULTILINGUAL JURISDICTION VERIFICATION SUITE")
    print("=" * 70)

    test_localization_completeness()
    test_docling_and_dataset_report()
    await test_retrieval_and_jurisdiction_isolation()
    await test_cross_language_and_decoupling()

    print("\n" + "=" * 70)
    print(f"SUMMARY: Total Passed: {PASSED_TESTS} | Total Failed: {FAILED_TESTS}")
    print("=" * 70)

    if FAILED_TESTS > 0:
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(main())
