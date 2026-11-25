from fastapi import APIRouter, Depends

from app.core.config import settings
from app.schemas import HealthOut

router = APIRouter(tags=["Sistema"])


@router.get("/health", response_model=HealthOut)
def health() -> HealthOut:
    return HealthOut(
        status="ok",
        service=settings.app_name,
        version=settings.app_version,
        environment=settings.environment,
    )
