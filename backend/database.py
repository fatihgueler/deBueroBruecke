"""Datenbank-Engine, Session-Factory und Basisklasse für SQLAlchemy 2.0 (async)."""
from __future__ import annotations

from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

try:
    from config import get_settings
except ImportError:
    from backend.config import get_settings

settings = get_settings()

engine = create_async_engine(
    settings.database_url,
    echo=False,
    future=True,
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
)


class Base(DeclarativeBase):
    """Gemeinsame deklarative Basisklasse für alle ORM-Modelle."""


async def init_db() -> None:
    """Erstellt alle Tabellen beim App-Start (idempotent)."""
    try:
        import models  # noqa: F401  --  Modelle registrieren
    except ImportError:
        import backend.models  # noqa: F401  --  Modelle registrieren

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """FastAPI-Dependency, die eine DB-Session pro Request bereitstellt."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
