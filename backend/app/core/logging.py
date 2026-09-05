"""
backend/app/core/logging.py
───────────────────────────
Structured JSON logging via structlog.
Import `logger` from here; never use print() or the stdlib logging module
directly in application code.
"""
from __future__ import annotations

import logging
import sys

import structlog
from structlog.types import EventDict, WrappedLogger

from backend.app.core.config import settings


def _add_app_info(
    logger: WrappedLogger, method_name: str, event_dict: EventDict
) -> EventDict:
    """Inject constant fields into every log record."""
    event_dict["app"] = settings.app_name
    event_dict["version"] = settings.app_version
    event_dict["env"] = settings.app_env
    return event_dict


def configure_logging() -> None:
    """Configure structlog + stdlib root logger.  Call once at startup."""
    if sys.platform == "win32":
        try:
            sys.stdout.reconfigure(encoding="utf-8", errors="replace")
            sys.stderr.reconfigure(encoding="utf-8", errors="replace")
        except Exception:
            pass

    log_level = logging.DEBUG if settings.debug else logging.INFO

    # ── stdlib root ─────────────────────────────────────────────────────────
    logging.basicConfig(
        format="%(message)s",
        stream=sys.stdout,
        level=log_level,
    )
    # Silence noisy third-party loggers
    for noisy in ("uvicorn.access", "sqlalchemy.engine"):
        logging.getLogger(noisy).setLevel(logging.WARNING)

    # ── structlog ───────────────────────────────────────────────────────────
    shared_processors: list = [
        structlog.contextvars.merge_contextvars,
        _add_app_info,
        structlog.processors.add_log_level,
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
    ]

    if settings.debug:
        renderer = structlog.dev.ConsoleRenderer()
    else:
        renderer = structlog.processors.JSONRenderer()

    structlog.configure(
        processors=shared_processors + [renderer],
        wrapper_class=structlog.make_filtering_bound_logger(log_level),
        context_class=dict,
        logger_factory=structlog.PrintLoggerFactory(),
        cache_logger_on_first_use=True,
    )


# Module-level logger used by all other modules
logger = structlog.get_logger()
