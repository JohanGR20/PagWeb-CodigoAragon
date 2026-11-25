from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app import models  # noqa: F401  (registra las tablas en el metadata)
from app.core.config import settings
from app.core.database import Base, engine
from app.routers import catalog, clients, contact, dashboard, health, quotes, sales


@asynccontextmanager
async def lifespan(_: FastAPI):
    if settings.auto_create_tables:
        Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title=settings.app_name,
    description=(
        "API de Código Aragón: contacto, catálogo, inventario, ventas, "
        "cotizaciones, facturación y estadísticas del panel."
    ),
    version=settings.app_version,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

for router in (
    health.router,
    contact.router,
    clients.router,
    catalog.router,
    sales.router,
    quotes.router,
    dashboard.router,
):
    app.include_router(router, prefix=settings.api_prefix)


@app.get("/", tags=["Sistema"])
def root() -> dict[str, str]:
    return {
        "service": settings.app_name,
        "version": settings.app_version,
        "docs": "/docs",
        "health": f"{settings.api_prefix}/health",
    }
