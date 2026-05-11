"""E-Mail-Service: SMTP-basiertes Versenden von Benachrichtigungen und Kontaktnachrichten."""
from __future__ import annotations

import logging
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import Optional

try:
    from config import get_settings
except ImportError:
    from backend.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()


def _build_smtp() -> Optional[smtplib.SMTP]:
    if not settings.smtp_host or not settings.smtp_user or not settings.smtp_password:
        logger.warning("SMTP nicht konfiguriert – E-Mails werden nicht gesendet.")
        return None
    try:
        if settings.smtp_tls:
            smtp = smtplib.SMTP_SSL(settings.smtp_host, settings.smtp_port, timeout=10)
        else:
            smtp = smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=10)
            smtp.starttls()
        smtp.login(settings.smtp_user, settings.smtp_password)
        return smtp
    except Exception as exc:
        logger.error("SMTP-Verbindung fehlgeschlagen: %s", exc)
        return None


def _send(to: str, subject: str, html: str, text: str) -> bool:
    smtp = _build_smtp()
    if smtp is None:
        logger.info("E-Mail-Simulation – Betreff: %s | An: %s", subject, to)
        return False
    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"]    = f"BüroBrücke <{settings.smtp_from}>"
        msg["To"]      = to
        msg.attach(MIMEText(text, "plain", "utf-8"))
        msg.attach(MIMEText(html, "html",  "utf-8"))
        smtp.sendmail(settings.smtp_from, [to], msg.as_string())
        smtp.quit()
        logger.info("E-Mail gesendet an %s | Betreff: %s", to, subject)
        return True
    except Exception as exc:
        logger.error("E-Mail-Versand fehlgeschlagen: %s", exc)
        return False


# ── Öffentliche API ──────────────────────────────────────────────────────────

def send_deadline_reminder(
    to_email: str,
    filename: str,
    authority: str,
    deadline: str,
    days_left: int,
    result_url: str,
) -> bool:
    subject = f"⚠ Frist in {days_left} Tag(en): {authority}"
    html = f"""
    <div style="font-family:sans-serif;max-width:520px;margin:auto;background:#0f1c35;color:#e2e8f0;padding:32px;border-radius:16px">
      <h1 style="color:#818cf8;font-size:22px;margin:0 0 8px">BüroBrücke – Frist-Erinnerung</h1>
      <p style="color:#94a3b8;font-size:14px;margin:0 0 24px">Automatische Benachrichtigung</p>
      <div style="background:#1a2845;border-radius:12px;padding:20px;margin-bottom:20px">
        <p style="margin:0 0 8px"><strong style="color:#fff">Datei:</strong> <span style="color:#94a3b8">{filename}</span></p>
        <p style="margin:0 0 8px"><strong style="color:#fff">Behörde:</strong> <span style="color:#94a3b8">{authority}</span></p>
        <p style="margin:0 0 8px"><strong style="color:#fff">Frist:</strong> <span style="color:#f59e0b">{deadline}</span></p>
        <p style="margin:0"><strong style="color:#ef4444">Noch {days_left} Tag(e)!</strong></p>
      </div>
      <a href="{result_url}" style="display:inline-block;background:#4F6EF7;color:#fff;padding:12px 24px;border-radius:10px;text-decoration:none;font-weight:600">
        Brief jetzt ansehen →
      </a>
      <p style="color:#475569;font-size:12px;margin-top:24px">
        BüroBrücke · <a href="https://buerobruecke.de/datenschutz" style="color:#818cf8">Datenschutz</a>
      </p>
    </div>
    """
    text = f"BüroBrücke – Frist-Erinnerung\n\nFrist in {days_left} Tag(en): {authority}\nDatei: {filename}\nFrist: {deadline}\n\nJetzt ansehen: {result_url}"
    return _send(to_email, subject, html, text)


def send_contact_notification(name: str, email: str, message: str, category: str) -> bool:
    subject = f"[BüroBrücke Kontakt] {category} – {name}"
    html = f"""
    <div style="font-family:sans-serif;max-width:520px;margin:auto;padding:32px">
      <h2>Neue Kontaktanfrage – BüroBrücke</h2>
      <table style="width:100%;border-collapse:collapse">
        <tr><td style="padding:8px;font-weight:bold;width:120px">Name</td><td style="padding:8px">{name}</td></tr>
        <tr><td style="padding:8px;font-weight:bold">E-Mail</td><td style="padding:8px"><a href="mailto:{email}">{email}</a></td></tr>
        <tr><td style="padding:8px;font-weight:bold">Kategorie</td><td style="padding:8px">{category}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;vertical-align:top">Nachricht</td><td style="padding:8px;white-space:pre-wrap">{message}</td></tr>
      </table>
    </div>
    """
    text = f"Neue Kontaktanfrage\nName: {name}\nE-Mail: {email}\nKategorie: {category}\n\n{message}"
    to = settings.smtp_from or "kontakt@buerobruecke.de"
    return _send(to, subject, html, text)


def send_reset_email(to_email: str, reset_url: str) -> bool:
    subject = "BüroBrücke – Passwort zurücksetzen"
    html = f"""
    <div style="font-family:sans-serif;max-width:520px;margin:auto;background:#0f1c35;color:#e2e8f0;padding:32px;border-radius:16px">
      <h1 style="color:#818cf8;font-size:22px">Passwort zurücksetzen</h1>
      <p style="color:#94a3b8">Du hast eine Passwort-Zurücksetzen-Anfrage gestellt. Klicke auf den Button:</p>
      <a href="{reset_url}" style="display:inline-block;background:#4F6EF7;color:#fff;padding:12px 24px;border-radius:10px;text-decoration:none;font-weight:600;margin:16px 0">
        Passwort zurücksetzen →
      </a>
      <p style="color:#475569;font-size:12px">Dieser Link ist 1 Stunde gültig. Falls du keine Anfrage gestellt hast, ignoriere diese E-Mail.</p>
    </div>
    """
    text = f"Passwort zurücksetzen: {reset_url}\n\nDieser Link ist 1 Stunde gültig."
    return _send(to_email, subject, html, text)
