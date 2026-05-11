"""Fristen-Erinnerungen: manuell auslösbar oder per Cron."""
from __future__ import annotations

import logging
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

try:
    from auth import get_current_user
    from database import get_db
    from models import Analysis, Document, User
    from services.email_service import send_deadline_reminder
    from config import get_settings
except ImportError:
    from backend.auth import get_current_user
    from backend.database import get_db
    from backend.models import Analysis, Document, User
    from backend.services.email_service import send_deadline_reminder
    from backend.config import get_settings

router = APIRouter(prefix="/api/reminders", tags=["reminders"])
logger = logging.getLogger(__name__)
settings = get_settings()


@router.post("/check", status_code=200)
async def check_deadlines(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> dict:
    """Prüft Fristen des eingeloggten Users und sendet Erinnerungen bei Bedarf."""
    now = datetime.now(timezone.utc).date()
    thresholds = [1, 3, 7]

    result = await db.execute(
        select(Document, Analysis)
        .join(Analysis, Document.id == Analysis.document_id)
        .where(Document.user_id == current_user.id)
        .where(Analysis.deadline.isnot(None))
    )
    rows = result.all()

    sent = []
    for doc, analysis in rows:
        if not analysis.deadline:
            continue
        try:
            deadline_date = datetime.strptime(analysis.deadline, "%Y-%m-%d").date()
        except ValueError:
            continue
        days_left = (deadline_date - now).days
        if days_left in thresholds:
            result_url = f"{settings.app_base_url}/result/{doc.id}"
            ok = send_deadline_reminder(
                to_email=current_user.email,
                filename=doc.original_filename,
                authority=analysis.authority_type,
                deadline=analysis.deadline,
                days_left=days_left,
                result_url=result_url,
            )
            if ok:
                sent.append({"document": doc.original_filename, "days_left": days_left})

    return {"checked": len(rows), "reminders_sent": len(sent), "details": sent}
