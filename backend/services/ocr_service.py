"""OCR-Service mit pytesseract – findet Tesseract automatisch."""
from __future__ import annotations

import os
import shutil
from pathlib import Path

import pytesseract
from PIL import Image

DEFAULT_OCR_LANGS = "deu+eng"

# ── Tesseract automatisch finden ──────────────────────────────────────────────
_SEARCH_PATHS: list[str] = [
    # Windows – Standard-Installationsorte
    r"C:\Program Files\Tesseract-OCR\tesseract.exe",
    r"C:\Program Files (x86)\Tesseract-OCR\tesseract.exe",
    str(Path.home() / "AppData" / "Local" / "Programs" / "Tesseract-OCR" / "tesseract.exe"),
    r"C:\Tesseract-OCR\tesseract.exe",
    # Linux / macOS
    "/usr/bin/tesseract",
    "/usr/local/bin/tesseract",
    "/opt/homebrew/bin/tesseract",
]

def _resolve_tesseract() -> str | None:
    # 1. Umgebungsvariable hat Priorität
    env = os.environ.get("TESSERACT_CMD", "").strip()
    if env and Path(env).exists():
        return env
    # 2. Im System-PATH suchen
    which = shutil.which("tesseract")
    if which:
        return which
    # 3. Bekannte Windows-Pfade durchprobieren
    for p in _SEARCH_PATHS:
        if Path(p).exists():
            return p
    return None

_tesseract_cmd = _resolve_tesseract()
if _tesseract_cmd:
    pytesseract.pytesseract.tesseract_cmd = _tesseract_cmd
# ─────────────────────────────────────────────────────────────────────────────


def ocr_image_bytes(image: Image.Image) -> str:
    """OCR auf einem PIL-Bild ausführen."""
    if not _tesseract_cmd:
        return ""
    try:
        return pytesseract.image_to_string(image, lang=DEFAULT_OCR_LANGS)
    except pytesseract.TesseractError:
        try:
            return pytesseract.image_to_string(image)
        except Exception:
            return ""
    except Exception:
        return ""


def extract_image_text(path: Path) -> str:
    """OCR für eine Bilddatei (jpg/png)."""
    with Image.open(path) as img:
        img = img.convert("RGB")
        return ocr_image_bytes(img).strip()
