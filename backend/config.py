"""Zentrale Anwendungskonfiguration aus Umgebungsvariablen."""
from __future__ import annotations

from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    anthropic_api_key: str = ""
    secret_key: str = "change_me_change_me_change_me_change_me_change_me"
    database_url: str = "sqlite+aiosqlite:///./buerbruecke.db"
    upload_dir: str = "./uploads"
    max_file_size_mb: int = 10
    cors_origins: str = "http://localhost:5173"
    environment: str = "development"

    jwt_algorithm: str = "HS256"
    jwt_expire_days: int = 30
    claude_model: str = "claude-opus-4-5"

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]

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
