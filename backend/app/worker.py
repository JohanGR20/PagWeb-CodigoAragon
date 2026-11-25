"""Tareas opcionales de Celery.

Se ejecutan solo cuando ENABLE_BACKGROUND_TASKS=true y Redis está disponible.
"""

import logging

from celery import Celery

from app.core.config import settings

logger = logging.getLogger("codigo_aragon.worker")

celery_app = Celery(
    "codigo_aragon",
    broker=settings.celery_broker_url or "redis://localhost:6379/0",
    backend=settings.celery_result_backend or settings.celery_broker_url or "redis://localhost:6379/1",
)

celery_app.conf.update(
    task_serializer="json",
    result_serializer="json",
    accept_content=["json"],
    timezone="America/Mexico_City",
    enable_utc=True,
)


@celery_app.task(name="codigo_aragon.notify_contact")
def send_contact_notification(contact_id: int, payload: dict) -> str:
    logger.info(
        "Contacto #%s recibido para %s (%s). Destinatario: %s",
        contact_id,
        payload.get("name"),
        payload.get("email"),
        settings.company_email,
    )
    return f"contacto-{contact_id}-registrado"
