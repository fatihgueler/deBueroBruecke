"""Claude API Integration: Analyse von Behördenbriefen und Generierung von Antwortentwürfen."""
from __future__ import annotations

import asyncio
import json
import logging
import re
from typing import Any

from anthropic import APIError, APITimeoutError, AsyncAnthropic

try:
    from config import get_settings
except ImportError:
    from backend.config import get_settings

logger = logging.getLogger(__name__)

settings = get_settings()

LANGUAGE_NAMES: dict[str, str] = {
    "de": "Deutsch",
    "tr": "Türkisch (Türkçe)",
    "ar": "Arabisch (العربية)",
    "ru": "Russisch (Русский)",
    "ku": "Kurdisch / Kurmancî",
    "uk": "Ukrainisch (Українська)",
    "fa": "Persisch / Farsi (فارسی)",
    "sq": "Albanisch (Shqip)",
    "sr": "Serbisch (Srpski / Српски)",
}

ANALYSIS_REQUIRED_KEYS = {
    "authority_type",
    "letter_type",
    "demand",
    "deadline",
    "consequence",
    "action_required",
    "full_explanation",
    "urgency_level",
}

ALLOWED_URGENCY = {"low", "medium", "high", "critical"}


def _build_analysis_prompt(text: str, language: str, *, stricter: bool = False) -> str:
    language_name = LANGUAGE_NAMES.get(language, "Deutsch")
    strict_hint = (
        "\nWICHTIG: Deine letzte Antwort war kein valides JSON. "
        "Antworte AUSSCHLIESSLICH mit einem einzigen JSON-Objekt – kein Markdown, "
        "keine Code-Blöcke, keine Erklärung davor oder danach."
        if stricter
        else ""
    )
    return (
        "Du bist ein Experte für deutsche Behördenpost und hilfst Menschen mit Migrationshintergrund, "
        "deutsche Behördenbriefe zu verstehen. Deine Antwort muss IMMER ein valides JSON-Objekt sein.\n\n"
        "Analysiere den folgenden deutschen Behördenbrief und extrahiere diese Informationen:\n\n"
        "{\n"
        '  "authority_type": "Name der Behörde (z.B. Finanzamt, Jobcenter, Ausländerbehörde, Krankenkasse, etc.)",\n'
        '  "letter_type": "Art des Briefes (z.B. Steuerbescheid, Zahlungsaufforderung, Einladung, Mahnschreiben)",\n'
        '  "demand": "Was konkret gefordert oder mitgeteilt wird (kurz und klar)",\n'
        '  "deadline": "Frist als ISO-Datum (YYYY-MM-DD) oder null wenn keine",\n'
        '  "consequence": "Was passiert wenn man nicht reagiert oder zahlt",\n'
        '  "action_required": "Konkrete Handlungsempfehlung in 1-3 Sätzen",\n'
        f'  "full_explanation": "Vollständige, einfache Erklärung des Briefes in der Sprache: {language_name}. '
        'Benutze einfache Sprache, kein Juristendeutsch. Max. 300 Wörter.",\n'
        '  "urgency_level": "low | medium | high | critical"\n'
        "}\n\n"
        "Antworte NUR mit dem JSON-Objekt, ohne Markdown, ohne Präambel."
        f"{strict_hint}\n\n"
        "---- BRIEF-TEXT ----\n"
        f"{text}\n"
        "---- ENDE ----"
    )


def _extract_json(raw: str) -> dict[str, Any]:
    """Versucht, ein JSON-Objekt aus einer Modellantwort zu extrahieren."""
    cleaned = raw.strip()
    # Markdown-Code-Blöcke entfernen
    fence = re.match(r"^```(?:json)?\s*(.+?)\s*```$", cleaned, re.DOTALL | re.IGNORECASE)
    if fence:
        cleaned = fence.group(1).strip()

    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        pass

    # Erste {...}-Sequenz im String greifen
    match = re.search(r"\{.*\}", cleaned, re.DOTALL)
    if match:
        return json.loads(match.group(0))

    raise ValueError("Antwort enthielt kein valides JSON.")


def _normalize_analysis(data: dict[str, Any], language: str) -> dict[str, Any]:
    missing = ANALYSIS_REQUIRED_KEYS - data.keys()
    if missing:
        raise ValueError(f"Fehlende Felder in der Analyse: {sorted(missing)}")

    urgency = str(data.get("urgency_level", "medium")).lower().strip()
    if urgency not in ALLOWED_URGENCY:
        urgency = "medium"

    deadline = data.get("deadline")
    if isinstance(deadline, str):
        deadline_clean = deadline.strip()
        deadline = deadline_clean if deadline_clean and deadline_clean.lower() != "null" else None
    elif deadline is not None:
        deadline = str(deadline)

    return {
        "authority_type": str(data["authority_type"]).strip(),
        "letter_type": str(data["letter_type"]).strip(),
        "demand": str(data["demand"]).strip(),
        "deadline": deadline,
        "consequence": str(data["consequence"]).strip(),
        "action_required": str(data["action_required"]).strip(),
        "full_explanation": str(data["full_explanation"]).strip(),
        "urgency_level": urgency,
        "language": language,
    }


def _fallback_analysis(language: str) -> dict[str, Any]:
    fallback_texts = {
        "de": {
            "full_explanation": (
                "Die Analyse konnte nicht durchgeführt werden, weil kein Anthropic API-Key gesetzt ist. "
                "Bitte trage ANTHROPIC_API_KEY in backend/.env ein und starte das Backend neu."
            ),
            "action_required": (
                "Trage einen gültigen ANTHROPIC_API_KEY in backend/.env ein und starte das Backend neu."
            ),
        },
        "tr": {
            "full_explanation": (
                "Analiz, Anthropic API anahtarı olmadığı için yapılamadı. "
                "Lütfen backend/.env dosyasına ANTHROPIC_API_KEY ekleyin ve backend'i yeniden başlatın."
            ),
            "action_required": (
                "Geçerli bir ANTHROPIC_API_KEY ekleyin ve backend'i yeniden başlatın."
            ),
        },
        "ar": {
            "full_explanation": (
                "لا يمكن إجراء التحليل لأن مفتاح Anthropic API مفقود. "
                "يرجى إضافة ANTHROPIC_API_KEY في backend/.env وإعادة تشغيل الخادم."
            ),
            "action_required": (
                "أضف ANTHROPIC_API_KEY في backend/.env وأعد تشغيل الخادم."
            ),
        },
        "ru": {
            "full_explanation": (
                "Анализ не может быть выполнен, потому что отсутствует ключ Anthropic API. "
                "Пожалуйста, добавьте ANTHROPIC_API_KEY в backend/.env и перезапустите backend."
            ),
            "action_required": (
                "Добавьте ANTHROPIC_API_KEY в backend/.env и перезапустите backend."
            ),
        },
        "ku": {
            "full_explanation": (
                "Analîz nikare bikaribe, ji ber ku API-Key-a Anthropic tune ye. "
                "Ji kerema xwe ANTHROPIC_API_KEY di backend/.env de zêde bike û backendê paşve bixwaze."
            ),
            "action_required": (
                "Ji bo ku analiza çareser bibe, ANTHROPIC_API_KEY li backend/.env zêde bike û backendê paşve bixwaze."
            ),
        },
        "uk": {
            "full_explanation": (
                "Аналіз не може бути виконаний, тому що відсутній ключ Anthropic API. "
                "Будь ласка, додайте ANTHROPIC_API_KEY у backend/.env та перезапустіть backend."
            ),
            "action_required": (
                "Додайте ANTHROPIC_API_KEY у backend/.env та перезапустіть backend."
            ),
        },
    }
    texts = fallback_texts.get(language, fallback_texts["de"])
    return {
        "authority_type": "Unbekannt",
        "letter_type": "Behördenbrief",
        "demand": "Analyse nicht möglich: Kein API-Key konfiguriert.",
        "deadline": None,
        "consequence": "Die App kann ohne API-Key nicht automatisch erkennen, was passieren wird.",
        "action_required": texts["action_required"],
        "full_explanation": texts["full_explanation"],
        "urgency_level": "medium",
        "language": language,
    }


class ClaudeService:
    """Asynchroner Wrapper um die Anthropic-API."""

    def __init__(self) -> None:
        if not settings.anthropic_api_key:
            logger.warning(
                "ANTHROPIC_API_KEY ist nicht gesetzt. Analyse-Aufrufe schlagen fehl, "
                "bis ein gültiger Schlüssel in der .env hinterlegt ist."
            )
        self._client = AsyncAnthropic(api_key=settings.anthropic_api_key or "missing")
        self._model = settings.claude_model

    async def analyze_letter(self, raw_text: str, language: str) -> dict[str, Any]:
        if not raw_text.strip():
            raise ValueError("Text konnte nicht erkannt werden. Bitte lade ein klareres Bild oder PDF hoch.")

        if not settings.anthropic_api_key:
            return _fallback_analysis(language)

        last_error: Exception | None = None
        for attempt in range(3):
            prompt = _build_analysis_prompt(raw_text, language, stricter=attempt > 0)
            try:
                response = await self._client.messages.create(
                    model=self._model,
                    max_tokens=2000,
                    temperature=0,
                    messages=[{"role": "user", "content": prompt}],
                )
            except APITimeoutError as exc:
                last_error = exc
                logger.warning("Claude-Timeout (Versuch %s): %s", attempt + 1, exc)
                await asyncio.sleep(1.5 * (attempt + 1))
                continue
            except APIError as exc:
                logger.error("Claude API Fehler: %s", exc)
                raise RuntimeError("KI-Dienst ist gerade nicht verfügbar. Bitte später erneut versuchen.") from exc

            text_blocks = [block.text for block in response.content if getattr(block, "type", None) == "text"]
            raw_output = "".join(text_blocks).strip()
            try:
                parsed = _extract_json(raw_output)
                return _normalize_analysis(parsed, language)
            except (ValueError, json.JSONDecodeError) as exc:
                last_error = exc
                logger.warning("Konnte Claude-Antwort nicht parsen (Versuch %s): %s", attempt + 1, exc)
                continue

        raise RuntimeError(
            "Die KI-Antwort konnte nicht ausgewertet werden. Bitte erneut versuchen."
        ) from last_error

    async def generate_reply(
        self,
        raw_text: str,
        analysis: dict[str, Any],
        language: str,
        additional_context: str | None = None,
    ) -> str:
        language_name = LANGUAGE_NAMES.get(language, "Deutsch")
        extras = (
            f"\nZusätzlicher Kontext vom Nutzer:\n{additional_context.strip()}\n"
            if additional_context
            else ""
        )
        prompt = (
            "Du bist ein deutscher Behördenkorrespondenz-Experte. Schreibe einen höflichen, "
            "förmlichen Antwortbrief auf den folgenden Behördenbrief. Der Brief muss auf DEUTSCH verfasst sein "
            "(da er an eine deutsche Behörde geht), aber:\n"
            f"- Füge am ANFANG eine kurze Zusammenfassung des Briefinhalts auf {language_name} hinzu (max. 3 Sätze).\n"
            "- Trenne diese Zusammenfassung mit '---' vom eigentlichen Brief.\n"
            "- Der eigentliche Antwortbrief ist komplett auf Deutsch.\n"
            "- Lasse Platzhalter für persönliche Daten in eckigen Klammern, z.B. [Vorname Nachname], "
            "[Anschrift], [Aktenzeichen], [Datum].\n"
            "- Verwende die formale Anrede 'Sehr geehrte Damen und Herren,' und schließe mit "
            "'Mit freundlichen Grüßen'.\n"
            "- Antworte ohne Markdown, einfach als reiner Text.\n\n"
            f"Behörde: {analysis.get('authority_type', '')}\n"
            f"Brieftyp: {analysis.get('letter_type', '')}\n"
            f"Forderung: {analysis.get('demand', '')}\n"
            f"Frist: {analysis.get('deadline') or 'keine'}\n"
            f"{extras}\n"
            "---- ORIGINALBRIEF ----\n"
            f"{raw_text}\n"
            "---- ENDE ----"
        )

        if not settings.anthropic_api_key:
            return (
                "Antwortentwurf kann nicht generiert werden, weil kein Anthropic API-Key gesetzt ist. "
                "Bitte trage ANTHROPIC_API_KEY in backend/.env ein und starte das Backend neu."
            )

        try:
            response = await self._client.messages.create(
                model=self._model,
                max_tokens=1500,
                temperature=0.3,
                messages=[{"role": "user", "content": prompt}],
            )
        except APITimeoutError as exc:
            raise RuntimeError("Der KI-Dienst hat zu lange gebraucht. Bitte erneut versuchen.") from exc
        except APIError as exc:
            raise RuntimeError("KI-Dienst ist gerade nicht verfügbar. Bitte später erneut versuchen.") from exc

        text_blocks = [block.text for block in response.content if getattr(block, "type", None) == "text"]
        return "".join(text_blocks).strip()


_service: ClaudeService | None = None


def get_claude_service() -> ClaudeService:
    global _service
    if _service is None:
        _service = ClaudeService()
    return _service
