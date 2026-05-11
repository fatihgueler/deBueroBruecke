"""Öffentlicher Stats-Endpoint für Landing-Page-Zähler."""
from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

try:
    from database import get_db
    from models import Document, User
except ImportError:
    from backend.database import get_db
    from backend.models import Document, User

router = APIRouter(prefix="/api/stats", tags=["stats"])


@router.get("/")
async def get_stats(db: AsyncSession = Depends(get_db)) -> dict:
    users = await db.scalar(select(func.count(User.id))) or 0
    docs  = await db.scalar(
        select(func.count(Document.id)).where(Document.status == "analyzed")
    ) or 0
    return {
        "documents_analyzed":  docs,
        "users_registered":    users,
        "languages_supported": 9,
    }
