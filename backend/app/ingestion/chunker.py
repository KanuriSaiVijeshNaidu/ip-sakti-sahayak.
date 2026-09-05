"""
backend/app/ingestion/chunker.py
?????????????????????????????????
Domain-aware legal text chunker for IP-SAKTI Sahayak.

Design principles
-----------------
1. SECTION-BOUNDARY AWARE: Splits on legal section headings first
   (e.g. "Section 3(e)", "Regulation 2.1", "Chapter 4") so chunks
   never cut across a logical legal unit.
2. TOKEN-BUDGET CONTROLLED: Uses tiktoken (cl100k_base) to ensure
   each chunk stays within MAX_TOKENS. Long sections are recursively
   split on sentence boundaries with OVERLAP tokens of context.
3. METADATA RICH: Every chunk carries domain, jurisdiction, section
   title, page/paragraph index, and corpus version ? ready for the
   metadata filter step in the RAG pipeline.
4. PURE PYTHON: No external services required. Works on plain text,
   PDF (via pypdf), and DOCX (via python-docx).
"""
from __future__ import annotations

import re
import uuid
from dataclasses import dataclass, field
from pathlib import Path
from typing import List, Optional

import tiktoken

# ?????????????????????????????????????????????????????????????????????????????
# Constants
# ?????????????????????????????????????????????????????????????????????????????

MAX_TOKENS = 400        # hard limit per chunk (fits well in BGE-M3 512-token window)
OVERLAP_TOKENS = 60     # token overlap between consecutive sub-chunks
TOKENIZER = tiktoken.get_encoding("cl100k_base")

# Legal section heading patterns ? ordered most-specific ? least-specific
SECTION_PATTERNS: list[re.Pattern] = [
    re.compile(r'(?m)^(Section\s+\d+[\w().\-]*.*?)$', re.IGNORECASE),
    re.compile(r'(?m)^(Regulation\s+\d+[\w().\-]*.*?)$', re.IGNORECASE),
    re.compile(r'(?m)^(CHAPTER\s+\d+[\w\s\-]*)$', re.IGNORECASE),
    re.compile(r'(?m)^(={10,})$'),
    re.compile(r'(?m)^(PRACTICAL\s+GUIDANCE[:\s].+)$', re.IGNORECASE),
    re.compile(r'(?m)^((?:Step\s+)?\d+[.)-]\s+[A-Z].+)$'),
]

# Metadata header fields embedded at the top of each corpus file
HEADER_FIELDS = {
    "source": re.compile(r"^Source:\s*(.+)$", re.MULTILINE),
    # Jurisdiction line may be "Jurisdiction: IN | Domain: patents | Corpus Version: v1"
    "jurisdiction": re.compile(r"Jurisdiction:\s*([A-Z]+)", re.MULTILINE),
    "domain": re.compile(r"Domain:\s*(\w+)", re.MULTILINE | re.IGNORECASE),
    "corpus_version": re.compile(r"Corpus Version:\s*(\w+)", re.MULTILINE | re.IGNORECASE),
}


# ?????????????????????????????????????????????????????????????????????????????
# Data models
# ?????????????????????????????????????????????????????????????????????????????

@dataclass
class Chunk:
    """A single chunk ready for embedding and storage."""
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    text: str = ""
    section_title: str = ""
    chunk_index: int = 0
    token_count: int = 0
    # Metadata for filtering
    source_title: str = ""
    source_url: Optional[str] = None
    domain: str = "unknown"
    jurisdiction: str = "IN"
    corpus_version: str = "v1"
    language: str = "en"
    page_number: Optional[int] = None

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "text": self.text,
            "section_title": self.section_title,
            "chunk_index": self.chunk_index,
            "token_count": self.token_count,
            "source_title": self.source_title,
            "source_url": self.source_url,
            "domain": self.domain,
            "jurisdiction": self.jurisdiction,
            "corpus_version": self.corpus_version,
            "language": self.language,
            "page_number": self.page_number,
        }


# ?????????????????????????????????????????????????????????????????????????????
# Helpers
# ?????????????????????????????????????????????????????????????????????????????

def _token_count(text: str) -> int:
    return len(TOKENIZER.encode(text))


def _split_by_sentences(text: str) -> list[str]:
    """Naively split on sentence-ending punctuation + newlines."""
    parts = re.split(r"(?<=[.;:!?])\s+|\n{2,}", text)
    return [p.strip() for p in parts if p.strip()]


def _sub_chunk(text: str, section_title: str, base_index: int,
               meta: dict) -> list[Chunk]:
    """
    Recursively split a text block that exceeds MAX_TOKENS into
    sentence-boundary-aligned sub-chunks with OVERLAP_TOKENS overlap.
    """
    sentences = _split_by_sentences(text)
    chunks: list[Chunk] = []
    buffer: list[str] = []
    buf_tokens = 0
    chunk_idx = base_index

    for sentence in sentences:
        s_tokens = _token_count(sentence)
        # Single sentence longer than MAX_TOKENS ? hard-cut by words
        if s_tokens > MAX_TOKENS:
            words = sentence.split()
            sub_buf: list[str] = []
            sub_tok = 0
            for word in words:
                w_tok = _token_count(word)
                if sub_tok + w_tok > MAX_TOKENS and sub_buf:
                    chunks.append(Chunk(
                        text=" ".join(sub_buf),
                        section_title=section_title,
                        chunk_index=chunk_idx,
                        token_count=sub_tok,
                        **meta,
                    ))
                    chunk_idx += 1
                    # keep overlap
                    overlap_words = sub_buf[max(0, len(sub_buf) - 5):]
                    sub_buf = overlap_words + [word]
                    sub_tok = _token_count(" ".join(sub_buf))
                else:
                    sub_buf.append(word)
                    sub_tok += w_tok
            if sub_buf:
                chunks.append(Chunk(
                    text=" ".join(sub_buf),
                    section_title=section_title,
                    chunk_index=chunk_idx,
                    token_count=sub_tok,
                    **meta,
                ))
                chunk_idx += 1
            continue

        if buf_tokens + s_tokens > MAX_TOKENS and buffer:
            chunk_text = " ".join(buffer)
            chunks.append(Chunk(
                text=chunk_text,
                section_title=section_title,
                chunk_index=chunk_idx,
                token_count=buf_tokens,
                **meta,
            ))
            chunk_idx += 1
            # Overlap: keep last N tokens worth of sentences
            overlap_buf: list[str] = []
            overlap_tok = 0
            for sent in reversed(buffer):
                t = _token_count(sent)
                if overlap_tok + t > OVERLAP_TOKENS:
                    break
                overlap_buf.insert(0, sent)
                overlap_tok += t
            buffer = overlap_buf + [sentence]
            buf_tokens = _token_count(" ".join(buffer))
        else:
            buffer.append(sentence)
            buf_tokens += s_tokens

    if buffer:
        chunks.append(Chunk(
            text=" ".join(buffer),
            section_title=section_title,
            chunk_index=chunk_idx,
            token_count=buf_tokens,
            **meta,
        ))

    return chunks


# ?????????????????????????????????????????????????????????????????????????????
# File readers
# ?????????????????????????????????????????????????????????????????????????????

def _read_txt(path: Path) -> str:
    return path.read_text(encoding="utf-8", errors="ignore")


def _read_pdf(path: Path) -> str:
    try:
        from pypdf import PdfReader
        reader = PdfReader(str(path))
        pages = []
        for page in reader.pages:
            text = page.extract_text()
            if text:
                pages.append(text)
        return "\n\n".join(pages)
    except Exception as exc:
        raise RuntimeError(f"Failed to read PDF {path}: {exc}") from exc


def _read_docx(path: Path) -> str:
    try:
        from docx import Document
        doc = Document(str(path))
        return "\n\n".join(p.text for p in doc.paragraphs if p.text.strip())
    except Exception as exc:
        raise RuntimeError(f"Failed to read DOCX {path}: {exc}") from exc


def _read_file(path: Path) -> str:
    suffix = path.suffix.lower()
    if suffix == ".pdf":
        return _read_pdf(path)
    elif suffix in (".docx", ".doc"):
        return _read_docx(path)
    else:
        return _read_txt(path)


# ?????????????????????????????????????????????????????????????????????????????
# Metadata extractor
# ?????????????????????????????????????????????????????????????????????????????

def _extract_file_metadata(text: str, path: Path) -> dict:
    """Parse metadata header embedded in the first 30 lines of corpus files."""
    header = "\n".join(text.splitlines()[:30])
    meta: dict = {
        "source_title": path.stem.replace("_", " ").title(),
        "source_url": None,
        "domain": "unknown",
        "jurisdiction": "IN",
        "corpus_version": "v1",
        "language": "en",
        "page_number": None,
    }
    for field_name, pattern in HEADER_FIELDS.items():
        m = pattern.search(header)
        if m:
            value = m.group(1).strip()
            if field_name == "source":
                meta["source_title"] = value
            elif field_name == "domain":
                # normalise to lowercase, strip whitespace
                meta["domain"] = value.lower().strip()
            elif field_name == "jurisdiction":
                # may be "IN | Domain: patents" style ? take first token
                meta["jurisdiction"] = value.split("|")[0].strip()
            elif field_name == "corpus_version":
                meta["corpus_version"] = value.strip()
    return meta


# ?????????????????????????????????????????????????????????????????????????????
# Section splitter
# ?????????????????????????????????????????????????????????????????????????????

def _split_into_sections(text: str) -> list[tuple[str, str]]:
    """
    Returns list of (section_heading, section_body) pairs.
    Falls back to the entire text as one section if no headings found.
    """
    # Remove divider lines first
    lines = []
    for line in text.splitlines():
        if re.fullmatch(r'^[=\-?_#*]{3,}\s*$', line.strip()):
            continue
        lines.append(line)
    clean_text = '\n'.join(lines)

    pattern = re.compile(
        r'(?m)^((?:SECTION\s+\d+|Section\s+\d+[\w().\-]*|Regulation\s+\d+[\w().\-]*|CHAPTER\s+\d+|PRACTICAL\s+GUIDANCE|Schedule\s+[IVX\d]+|Step\s+\d+)[^\n]*)'
    )
    matches = list(pattern.finditer(clean_text))
    if not matches:
        return [("", clean_text)]

    sections: list[tuple[str, str]] = []
    for i, m in enumerate(matches):
        raw_heading = m.group(1).strip()
        short_heading = raw_heading
        if len(raw_heading) > 75:
            split_h = re.split(r'[:\-\u2013\u2014]', raw_heading, maxsplit=1)
            short_heading = split_h[0].strip()
            if len(split_h) > 1 and len(split_h[1].strip()) < 45:
                short_heading += ' - ' + split_h[1].strip()

        start = m.start()
        end = matches[i + 1].start() if i + 1 < len(matches) else len(clean_text)
        body = clean_text[start:end].strip()
        if body and len(body) > 10:
            sections.append((short_heading, body))

    return sections if sections else [("", clean_text)]


# ?????????????????????????????????????????????????????????????????????????????
# Public API
# ?????????????????????????????????????????????????????????????????????????????

def chunk_file(path: str | Path, override_meta: Optional[dict] = None) -> list[Chunk]:
    """
    Main entry point.  Reads a file, extracts metadata from its header,
    splits on legal section boundaries, sub-chunks long sections, and
    returns a flat list of Chunk objects.

    Parameters
    ----------
    path:           Path to .txt, .pdf, or .docx file.
    override_meta:  Optional dict to override auto-extracted metadata.
                    Keys: domain, jurisdiction, corpus_version, language,
                          source_title, source_url.
    """
    path = Path(path)
    raw_text = _read_file(path)
    meta = _extract_file_metadata(raw_text, path)

    if override_meta:
        meta.update(override_meta)

    sections = _split_into_sections(raw_text)
    all_chunks: list[Chunk] = []
    global_idx = 0

    for heading, body in sections:
        body_tokens = _token_count(body)
        if body_tokens <= MAX_TOKENS:
            all_chunks.append(Chunk(
                text=body,
                section_title=heading,
                chunk_index=global_idx,
                token_count=body_tokens,
                **meta,
            ))
            global_idx += 1
        else:
            sub = _sub_chunk(body, heading, global_idx, meta)
            all_chunks.extend(sub)
            global_idx += len(sub)

    return all_chunks


def chunk_directory(
    directory: str | Path,
    extensions: tuple[str, ...] = (".txt", ".pdf", ".docx"),
    override_meta: Optional[dict] = None,
) -> list[Chunk]:
    """Chunk all matching files in a directory tree."""
    directory = Path(directory)
    all_chunks: list[Chunk] = []
    for path in sorted(directory.rglob("*")):
        if path.suffix.lower() in extensions and path.is_file():
            chunks = chunk_file(path, override_meta)
            all_chunks.extend(chunks)
    return all_chunks
