"""
tests/test_language_localization.py
───────────────────────────────────
Automated tests for language ordering, user-controlled localization,
Japanese first-class support, and German complete exclusion.
"""
import pytest
import os
import json


def test_language_definitions_in_frontend():
    # Read frontend types
    with open("frontend/src/types/index.ts", "r", encoding="utf-8") as f:
        types_content = f.read()

    # German must not be in LanguageCode
    assert '"de"' not in types_content.split("export type LanguageCode =")[1].split(";")[0]

    # Core languages must be present in order: en, te, hi, ja
    lang_line = types_content.split("export type LanguageCode =")[1].split(";")[0]
    for code in ['"en"', '"te"', '"hi"', '"ja"']:
        assert code in lang_line, f"Expected {code} in LanguageCode"


def test_german_file_removed():
    # frontend/src/locales/de.ts must NOT exist
    assert not os.path.exists("frontend/src/locales/de.ts")


def test_japanese_locale_complete():
    # frontend/src/locales/ja.ts must exist and contain required keys
    assert os.path.exists("frontend/src/locales/ja.ts")
    with open("frontend/src/locales/ja.ts", "r", encoding="utf-8") as f:
        ja_content = f.read()

    assert "AYURLEX" in ja_content
    assert "特許" in ja_content
    assert "公報番号" in ja_content
    assert "CRAG" in ja_content
    assert "原文保持" in ja_content


def test_header_language_selector_order():
    with open("frontend/src/components/Header.tsx", "r", encoding="utf-8") as f:
        header_content = f.read()

    # Extract LANGUAGES array block
    assert "const LANGUAGES" in header_content
    lang_block = header_content.split("const LANGUAGES")[1].split("];")[0]

    # Order check: en, te, hi, ja
    pos_en = lang_block.find('"en"')
    pos_te = lang_block.find('"te"')
    pos_hi = lang_block.find('"hi"')
    pos_ja = lang_block.find('"ja"')

    assert pos_en != -1 and pos_te != -1 and pos_hi != -1 and pos_ja != -1
    assert pos_en < pos_te < pos_hi < pos_ja, f"Order must be en < te < hi < ja: got en={pos_en}, te={pos_te}, hi={pos_hi}, ja={pos_ja}"

    # German must not appear in LANGUAGES
    assert '"de"' not in lang_block
    assert "Deutsch" not in lang_block
    assert "German" not in lang_block


def test_combined_evaluation_inventory_structure():
    assert os.path.exists("evaluation/combined_evaluation_inventory.json")
    with open("evaluation/combined_evaluation_inventory.json", "r", encoding="utf-8") as f:
        inv = json.load(f)

    tree = inv.get("tree", {})
    assert "OLD_DATA" in tree
    assert "NEW_DATA" in tree
    assert "COMBINED_TOTALS" in tree

    old_data = tree["OLD_DATA"]
    assert "USA" in old_data
    assert "EUROPE" in old_data
    assert "WIPO" in old_data
    assert "JAPAN" in old_data
    assert "INDIA" in old_data
    assert "GERMANY" in old_data
    assert "QUARANTINED" in old_data["GERMANY"].get("status", "")

    new_data = tree["NEW_DATA"]
    assert "NEW_US_EP_WO_JP" in new_data
    assert "NEW_JAPAN_LANGUAGE" in new_data
    assert "NEW_INDIA_GENUINE" in new_data

    totals = tree["COMBINED_TOTALS"]
    assert totals["total_active_evaluation_queries"] >= 400


def test_combined_eval_dataset_jsonl_exists():
    assert os.path.exists("evaluation/combined_eval_dataset.jsonl")
    with open("evaluation/combined_eval_dataset.jsonl", "r", encoding="utf-8") as f:
        lines = [json.loads(l) for l in f if l.strip()]

    assert len(lines) >= 400

    cats = {l["dataset_category"] for l in lines}
    assert "OLD_DATA" in cats
    assert "NEW_DATA" in cats

    jurs = {l["jurisdiction"] for l in lines}
    assert "US" in jurs
    assert "EP" in jurs
    assert "WO" in jurs
    assert "JP" in jurs
    assert "IN" in jurs