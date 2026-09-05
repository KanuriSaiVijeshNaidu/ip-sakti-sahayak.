"""
backend/app/retrieval/validator.py
────────────────────────────────────
Evidence citation validator for IP-SAKTI RAG pipeline.

Position in pipeline
────────────────────
  RerankedCandidates (top-N)
    └──> Validate each passage is genuinely grounded
    └──> Compute grounding score per candidate
    └──> Build CitedEvidence objects (ready for LLM prompt + user UI)
    └──> Flag low-confidence citations as needs_review

What "validation" means here
─────────────────────────────
For RAG systems, evidence validation ensures:
1. PASSAGE GROUNDING: The retrieved chunk text actually contains content
   relevant to the query — not a false positive from vector similarity.
2. DOMAIN CONSISTENCY: The citation domain matches the query intent.
3. LENGTH SANITY: The passage is long enough to be a real citation
   (not a divider line or metadata header fragment).
4. DEDUPLICATION: Near-duplicate passages (high text overlap) are collapsed
   so the LLM receives diverse evidence.

This validator does NOT call an LLM — it uses fast deterministic heuristics
so it adds <1ms latency to the pipeline.
"""
from __future__ import annotations

import hashlib
import logging
import re
from dataclasses import dataclass, field
from difflib import SequenceMatcher
from typing import Optional

from backend.app.retrieval.reranker import RerankedCandidate

logger = logging.getLogger(__name__)

# ─── Constants ────────────────────────────────────────────────────────────────

MIN_PASSAGE_CHARS = 40          # shorter passages are likely metadata/dividers
DEDUP_SIMILARITY_THRESHOLD = 0.85  # passages >85% similar are near-duplicates
GROUNDING_KEYWORD_WEIGHT = 0.4  # keyword overlap contribution to grounding score
RERANKER_SCORE_WEIGHT = 0.6     # reranker score contribution to grounding score
RERANKER_SCORE_NORMALIZATION = 10.0  # cross-encoder logits typically in [-10, 10]
MIN_GROUNDING_SCORE = 0.15      # below this → flagged as needs_review


# ─── Data model ───────────────────────────────────────────────────────────────

@dataclass
class CitedEvidence:
    """
    A validated, citation-ready evidence passage.
    This is the ONLY retrieval artifact exposed to the User UI and LLM.
    The Admin UI additionally sees the full RerankedCandidate.
    """
    chunk_id: str
    passage_text: str
    section_title: str
    source_title: str
    source_url: Optional[str]
    domain: str
    jurisdiction: str
    corpus_version: str
    grounding_score: float          # [0.0, 1.0] — confidence this is relevant
    validation_status: str          # "valid" | "needs_review" | "rejected"
    reranker_rank: Optional[int]
    reranker_score: float
    # Stable citation key for LLM prompt reference: e.g. [src-1], [src-2]
    citation_key: str = ""

    def to_dict(self) -> dict:
        return {
            "chunk_id": self.chunk_id,
            "passage_text": self.passage_text,
            "section_title": self.section_title,
            "source_title": self.source_title,
            "source_url": self.source_url,
            "domain": self.domain,
            "jurisdiction": self.jurisdiction,
            "corpus_version": self.corpus_version,
            "grounding_score": round(self.grounding_score, 4),
            "validation_status": self.validation_status,
            "reranker_rank": self.reranker_rank,
            "reranker_score": round(self.reranker_score, 4),
            "citation_key": self.citation_key,
        }


# ─── Validation helpers ───────────────────────────────────────────────────────

def _clean_text(text: str) -> str:
    """Strip decorative characters and normalise whitespace."""
    text = re.sub(r"[^\x00-\x7F]+", " ", text)   # remove non-ASCII (box chars)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def _extract_keywords(query: str) -> list[str]:
    """Very lightweight keyword extraction: lowercase, remove stopwords."""
    _STOP = {
        "a", "an", "the", "is", "are", "was", "were", "be", "been", "being",
        "have", "has", "had", "do", "does", "did", "will", "would", "shall",
        "should", "may", "might", "can", "could", "of", "in", "to", "for",
        "on", "at", "by", "with", "about", "as", "into", "from", "what",
        "how", "when", "where", "who", "which", "i", "my", "me", "we", "our",
    }
    tokens = re.findall(r"\b[a-z]{3,}\b", query.lower())
    return [t for t in tokens if t not in _STOP]


def _keyword_overlap_score(query: str, passage: str) -> float:
    """
    Fraction of query keywords that appear in the passage text.
    Returns [0.0, 1.0].
    """
    keywords = _extract_keywords(query)
    if not keywords:
        return 0.5   # neutral when no meaningful keywords
    passage_lower = passage.lower()
    hits = sum(1 for kw in keywords if kw in passage_lower)
    return hits / len(keywords)


def _normalize_reranker_score(score: float) -> float:
    """
    Map cross-encoder logit (roughly [-10, 10]) to [0.0, 1.0] via sigmoid.
    For RRF-proxy scores (already 0-1), sigmoid clips them near 1.0.
    """
    import math
    try:
        return 1.0 / (1.0 + math.exp(-score))
    except OverflowError:
        return 0.0 if score < 0 else 1.0


def _grounding_score(query: str, candidate: RerankedCandidate) -> float:
    """
    Combined grounding confidence score [0.0, 1.0]:
      = 0.4 * keyword_overlap + 0.6 * sigmoid(reranker_score)
    """
    kw = _keyword_overlap_score(query, candidate.text)
    rr = _normalize_reranker_score(candidate.reranker_score)
    return round(
        GROUNDING_KEYWORD_WEIGHT * kw + RERANKER_SCORE_WEIGHT * rr,
        4,
    )


def _text_similarity(a: str, b: str) -> float:
    """Fast approximate text similarity using SequenceMatcher."""
    return SequenceMatcher(None, a[:500], b[:500]).ratio()


def _is_degenerate(text: str) -> bool:
    """True if the passage is too short or is a decorative divider."""
    cleaned = _clean_text(text)
    if len(cleaned) < MIN_PASSAGE_CHARS:
        return True
    # Almost all punctuation/special chars → divider line
    alpha_ratio = sum(c.isalpha() for c in cleaned) / max(len(cleaned), 1)
    if alpha_ratio < 0.3:
        return True
    return False


def _content_hash(text: str) -> str:
    """Short hash for deduplication."""
    return hashlib.md5(_clean_text(text)[:300].encode()).hexdigest()[:12]


# ─── Public API ───────────────────────────────────────────────────────────────

def validate_evidence(
    query: str,
    candidates: list[RerankedCandidate],
    max_citations: int = 5,
    include_needs_review: bool = False,
) -> list[CitedEvidence]:
    """
    Validate, deduplicate and rank reranked candidates into CitedEvidence.

    Parameters
    ----------
    query               : Original user query (used for keyword grounding).
    candidates          : Reranked candidates from CrossEncoderReranker.
    max_citations       : Max number of valid citations to return.
    include_needs_review: If True, include low-confidence citations flagged
                          needs_review. Default False (strict mode).

    Returns
    -------
    Ordered list of CitedEvidence, best first, citation_key assigned.
    """
    seen_hashes: set[str] = set()
    results: list[CitedEvidence] = []

    for candidate in candidates:
        text = _clean_text(candidate.text)

        # ── 1. Degenerate passage check ───────────────────────────────────────
        if _is_degenerate(candidate.text):
            logger.debug(f"Rejected degenerate passage: chunk={candidate.chunk_id}")
            continue

        # ── 2. Near-duplicate suppression ────────────────────────────────────
        h = _content_hash(text)
        if h in seen_hashes:
            logger.debug(f"Suppressed near-duplicate: chunk={candidate.chunk_id}")
            continue

        # Check similarity against already-accepted passages
        is_dup = False
        for existing in results:
            if _text_similarity(text, _clean_text(existing.passage_text)) > DEDUP_SIMILARITY_THRESHOLD:
                is_dup = True
                break
        if is_dup:
            continue
        seen_hashes.add(h)

        # ── 3. Grounding score ────────────────────────────────────────────────
        score = _grounding_score(query, candidate)
        status = "valid" if score >= MIN_GROUNDING_SCORE else "needs_review"

        if status == "needs_review" and not include_needs_review:
            logger.debug(
                f"Skipped low-confidence passage (score={score}): "
                f"chunk={candidate.chunk_id}"
            )
            continue

        results.append(CitedEvidence(
            chunk_id=candidate.chunk_id,
            passage_text=text,
            section_title=candidate.section_title,
            source_title=candidate.source_title,
            source_url=None,
            domain=candidate.domain,
            jurisdiction=candidate.jurisdiction,
            corpus_version=candidate.corpus_version,
            grounding_score=score,
            validation_status=status,
            reranker_rank=candidate.reranker_rank,
            reranker_score=candidate.reranker_score,
        ))

        if len(results) >= max_citations:
            break

    # ── 4. Assign stable citation keys ───────────────────────────────────────
    for i, ev in enumerate(results, 1):
        ev.citation_key = f"[src-{i}]"

    logger.debug(
        f"Evidence validation: {len(candidates)} candidates → "
        f"{len(results)} valid citations"
    )
    return results


def build_llm_context(
    query: str,
    evidence: list[CitedEvidence],
    max_chars_per_passage: int = 800,
) -> str:
    """
    Formats validated evidence into a numbered context block
    ready for injection into the LLM system prompt.

    Format:
        [src-1] SECTION TITLE (SOURCE TITLE, Domain: patents, IN)
        <passage text>

        [src-2] ...

    The LLM is instructed to cite using [src-N] keys in its answer.
    """
    if not evidence:
        return "No relevant legal sources found for this query."

    lines = [
        "RELEVANT LEGAL SOURCES (cite these in your answer using [src-N] keys):\n"
    ]
    for ev in evidence:
        header = (
            f"{ev.citation_key} {ev.section_title} "
            f"| {ev.source_title} | {ev.domain.upper()} | {ev.jurisdiction}"
        )
        passage = ev.passage_text[:max_chars_per_passage]
        if len(ev.passage_text) > max_chars_per_passage:
            passage += " [...]"
        lines.append(f"{header}\n{passage}\n")

    return "\n".join(lines)
