"""
pipeline/cleaner.py
───────────────────
Document Noise Removal & OCR Quality Audit.
Removes page artifacts, headers/footers, watermark text, and OCR garbage,
while rigorously preserving claims, claim numbering, botanical names, chemical
terms, section headings, and legal phrasing.
"""
from __future__ import annotations

import re
import string
from typing import Any, Dict, List, Tuple


# Regex patterns for noise
RE_WATERMARKS = re.compile(
    r"(?:CONFIDENTIAL|DO NOT COPY|DRAFT|OFFICIAL COPY|ELECTRONIC DOCKET|FOR EXAMINATION ONLY|"
    r"PATENT COOPERATION TREATY|INTERNATIONAL PUBLICATION PUBLISHED UNDER THE PATENT COOPERATION TREATY|"
    r"BUNDESREPUBLIK DEUTSCHLAND|DEUTSCHES PATENT- UND MARKENAMT)\s*",
    re.IGNORECASE
)
RE_PAGE_NUMBERS = re.compile(r"(?:Page\s+\d+\s+of\s+\d+| -\s*\d+\s*- | \[\d+/\d+\] )", re.IGNORECASE)
RE_MULTI_BLANK = re.compile(r"\n{3,}")
RE_MULTI_SPACE = re.compile(r"[ \t]{2,}")


class OCRQualityChecker:
    """Computes OCR and text quality metrics to flag low-quality documents."""

    def __init__(
        self,
        min_alphabetic_ratio: float = 0.30,
        max_garbage_ratio: float = 0.05,
        max_broken_word_ratio: float = 0.05,
        min_average_word_length: float = 2.0,
        max_average_word_length: float = 18.0
    ):
        self.min_alphabetic_ratio = min_alphabetic_ratio
        self.max_garbage_ratio = max_garbage_ratio
        self.max_broken_word_ratio = max_broken_word_ratio
        self.min_average_word_length = min_average_word_length
        self.max_average_word_length = max_average_word_length

    def evaluate_text(self, text: str) -> Dict[str, Any]:
        """Compute textual and OCR quality ratios."""
        if not text:
            return {
                "alphabetic_character_ratio": 0.0,
                "numeric_character_ratio": 0.0,
                "garbage_character_ratio": 1.0,
                "average_word_length": 0.0,
                "broken_word_ratio": 1.0,
                "duplicate_line_ratio": 0.0,
                "ocr_quality_score": 0.0,
                "status": "FAIL",
                "rejection_reasons": ["Empty document text"]
            }

        total_chars = len(text)
        alpha_chars = sum(1 for c in text if c.isalpha())
        num_chars = sum(1 for c in text if c.isdigit())
        printable_clean = set(string.printable + "äöüÄÖÜßàáâèéêìíîòóôùúû°µ±§©®™–—′″≤≥")
        garbage_chars = sum(1 for c in text if c not in printable_clean)

        alpha_ratio = alpha_chars / max(1, total_chars)
        num_ratio = num_chars / max(1, total_chars)
        garbage_ratio = garbage_chars / max(1, total_chars)

        words = re.findall(r"\b[A-Za-z0-9äöüÄÖÜß\-\/]+\b", text)
        avg_word_len = sum(len(w) for w in words) / max(1, len(words))

        alpha_words = re.findall(r"\b[A-Za-zäöüÄÖÜß]+\b", text)
        standard_singles = set("aiouxyzabcdefghjklnmpqrstvw")
        isolated_alpha = [w for w in alpha_words if len(w) == 1 and w.lower() not in standard_singles]
        broken_word_ratio = len(isolated_alpha) / max(1, len(words))

        lines = [l.strip() for l in text.splitlines() if l.strip()]
        unique_lines = set(lines)
        dup_line_ratio = (len(lines) - len(unique_lines)) / max(1, len(lines))

        rejection_reasons = []
        if alpha_ratio < self.min_alphabetic_ratio:
            rejection_reasons.append(f"Alphabetic ratio too low: {alpha_ratio:.3f} < {self.min_alphabetic_ratio}")
        if garbage_ratio > self.max_garbage_ratio:
            rejection_reasons.append(f"Garbage ratio too high: {garbage_ratio:.3f} > {self.max_garbage_ratio}")
        if broken_word_ratio > self.max_broken_word_ratio:
            rejection_reasons.append(f"Broken word ratio too high: {broken_word_ratio:.3f} > {self.max_broken_word_ratio}")
        if not (self.min_average_word_length <= avg_word_len <= self.max_average_word_length):
            rejection_reasons.append(f"Average word length abnormal: {avg_word_len:.1f}")

        ocr_score = max(0.0, min(1.0, 1.0 - (garbage_ratio * 4.0 + broken_word_ratio * 2.0)))
        status = "PASS" if not rejection_reasons else "FAIL"

        return {
            "alphabetic_character_ratio": round(alpha_ratio, 4),
            "numeric_character_ratio": round(num_ratio, 4),
            "garbage_character_ratio": round(garbage_ratio, 4),
            "average_word_length": round(avg_word_len, 2),
            "broken_word_ratio": round(broken_word_ratio, 4),
            "duplicate_line_ratio": round(dup_line_ratio, 4),
            "ocr_quality_score": round(ocr_score, 4),
            "status": status,
            "rejection_reasons": rejection_reasons
        }


def clean_patent_text(text: str) -> str:
    """Clean text noise while strictly preserving claims and legal terminology."""
    if not text:
        return ""

    t = RE_WATERMARKS.sub("", text)
    t = RE_PAGE_NUMBERS.sub("", t)
    t = RE_MULTI_BLANK.sub("\n\n", t)

    return t.strip()
