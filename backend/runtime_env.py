"""Minimal local .env loader for the Flask service; values are never logged."""

import os
from pathlib import Path


def load_local_env() -> None:
    root = Path(__file__).resolve().parent.parent
    for path in (root / ".env", Path(__file__).resolve().parent / ".env"):
        if not path.exists():
            continue
        for line in path.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, value = line.split("=", 1)
            key, value = key.strip(), value.strip().strip('"').strip("'")
            if key and key not in os.environ:
                os.environ[key] = value


load_local_env()
