"""OCR-Service mit pytesseract, mit Deutsch als Primärsprache."""
from __future__ import annotations

from pathlib import Path

import pytesseract
from PIL import Image

DEFAULT_OCR_LANGS = "deu+eng"


def ocr_image_bytes(image: Image.Image) -> str:
    """Führt OCR auf einem geöffneten PIL-Bild aus."""
    try:
        return pytesseract.image_to_string(image, lang=DEFAULT_OCR_LANGS)
    except pytesseract.TesseractError:
        # Falls die deutschen Sprachpakete nicht installiert sind: Fallback auf default.
        return pytesseract.image_to_string(image)


def extract_image_text(path: Path) -> str:
    """OCR für eine Bilddatei (jpg/png)."""
    with Image.open(path) as img:
        img = img.convert("RGB")
        return ocr_image_bytes(img).strip()
