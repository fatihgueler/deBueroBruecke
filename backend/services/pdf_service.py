"""PDF-Textextraktion via PyMuPDF mit OCR-Fallback für bildbasierte PDFs."""
from __future__ import annotations

import io
from pathlib import Path

import fitz  # PyMuPDF
from PIL import Image

from services.ocr_service import ocr_image_bytes


def extract_pdf_text(path: Path) -> str:
    """Extrahiert Text aus einem PDF. Fallback zu OCR pro Seite, wenn keine Textebene vorhanden ist."""
    text_parts: list[str] = []

    with fitz.open(path) as doc:
        for page in doc:
            page_text = page.get_text("text").strip()
            if page_text:
                text_parts.append(page_text)
                continue

            # Bild-basierte Seite -> als Bild rendern und OCR ausführen
            pix = page.get_pixmap(dpi=220)
            img_bytes = pix.tobytes("png")
            try:
                img = Image.open(io.BytesIO(img_bytes))
                ocr_text = ocr_image_bytes(img)
                if ocr_text.strip():
                    text_parts.append(ocr_text)
            except Exception:
                continue

    return "\n\n".join(text_parts).strip()
