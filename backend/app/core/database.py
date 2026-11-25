import os
import sys
from collections.abc import Generator
from pathlib import Path

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from app.core.config import settings


def _configure_windows_libpq() -> None:
    """Localiza libpq cuando PostgreSQL está instalado en Windows.

    En Windows el driver psycopg se usa en modo Python puro para evitar
    bloqueos de DLL de políticas locales; libpq se toma de la instalación de
    PostgreSQL. En Linux/macOS no se requiere esta configuración.
    """
    if sys.platform != "win32":
        return

    os.environ.setdefault("PSYCOPG_IMPL", "python")

    candidates = [
        settings.postgres_bin,
        r"C:\Program Files\PostgreSQL\18\bin",
        r"C:\Program Files\PostgreSQL\17\bin",
        r"C:\Program Files\PostgreSQL\16\bin",
    ]
    for candidate in candidates:
        if candidate and Path(candidate, "libpq.dll").exists():
            os.add_dll_directory(candidate)
            os.environ["PATH"] = candidate + os.pathsep + os.environ.get("PATH", "")
            return


_configure_windows_libpq()


class Base(DeclarativeBase):
    pass


engine = create_engine(
    settings.database_url,
    pool_pre_ping=True,
    future=True,
)

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, expire_on_commit=False)


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
