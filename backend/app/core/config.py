from functools import lru_cache
from pathlib import Path

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

ENV_FILE = Path(__file__).resolve().parents[2] / ".env"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=str(ENV_FILE),
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=False,
    )

    app_name: str = "Código Aragón API"
    app_version: str = "1.0.0"
    environment: str = "development"
    api_prefix: str = "/api"

    database_url: str = (
        "postgresql+psycopg://codigo_aragon:codigo_aragon@localhost:5544/codigo_aragon"
    )
    auto_create_tables: bool = True
    postgres_bin: str | None = None

    cors_origins: str = "http://localhost:3000,http://127.0.0.1:3000"
    cors_origin_regex: str | None = None

    company_email: str = "codigoaragon845@gmail.com"
    company_phone: str = "5615431206"
    whatsapp_number: str = "5215615431206"

    redis_url: str | None = None
    celery_broker_url: str | None = None
    celery_result_backend: str | None = None
    enable_background_tasks: bool = False

    @field_validator("database_url", mode="before")
    @classmethod
    def normalize_database_url(cls, value: str) -> str:
        if isinstance(value, str):
            if value.startswith("postgres://"):
                return "postgresql+psycopg://" + value[len("postgres://") :]
            if value.startswith("postgresql://"):
                return "postgresql+psycopg://" + value[len("postgresql://") :]
        return value

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
