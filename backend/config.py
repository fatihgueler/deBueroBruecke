"""Zentrale Anwendungskonfiguration aus Umgebungsvariablen."""
from __future__ import annotations

from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

# Absoluter Pfad zu diesem Verzeichnis (backend/) — unabhängig vom Startverzeichnis
_BACKEND_DIR = Path(__file__).parent.resolve()


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=_BACKEND_DIR / ".env",   # immer backend/.env, egal aus welchem Verzeichnis
        env_file_encoding="utf-8",
        extra="ignore",
    )

    anthropic_api_key: str = ""
    secret_key: str = "change_me_change_me_change_me_change_me_change_me"

    # Absolute Pfade als Default — werden von .env überschrieben wenn gesetzt
    database_url: str = f"sqlite+aiosqlite:///{_BACKEND_DIR / 'buerbruecke.db'}"
    upload_dir: str = str(_BACKEND_DIR / "uploads")

    max_file_size_mb: int = 10
    cors_origins: str = "http://localhost:5173,http://127.0.0.1:5173"
    environment: str = "development"

    jwt_algorithm: str = "HS256"
    jwt_expire_days: int = 30
    claude_model: str = "claude-opus-4-5"

    # SMTP E-Mail-Konfiguration (optional)
    smtp_host:     str  = ""
    smtp_port:     int  = 465
    smtp_user:     str  = ""
    smtp_password: str  = ""
    smtp_from:     str  = "noreply@buerobruecke.de"
    smtp_tls:      bool = True
    app_base_url:  str  = "http://localhost:5173"

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]

    @property
    def upload_path(self) -> Path:
        path = Path(self.upload_dir).resolve()
        path.mkdir(parents=True, exist_ok=True)
        return path

    @property
    def max_file_size_bytes(self) -> int:
        return self.max_file_size_mb * 1024 * 1024


@lru_cache
def get_settings() -> Settings:
    return Settings()
