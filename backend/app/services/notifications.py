import logging

from app.core.config import settings

logger = logging.getLogger("codigo_aragon.notifications")


def notify_new_contact(contact_id: int, payload: dict) -> None:
    """Notifica internamente un nuevo contacto.

    El envío real de correo queda fuera del alcance del demo. Si Celery y Redis
    están habilitados, la tarea se encola; en caso contrario se registra en logs
    para no bloquear la respuesta al usuario.
    """
    logger.info(
        "Nuevo contacto #%s · %s · %s · %s",
        contact_id,
        payload.get("name"),
        payload.get("email"),
        payload.get("service_interest"),
    )

    if not settings.enable_background_tasks:
        return

    try:
        from app.worker import send_contact_notification

        send_contact_notification.delay(contact_id, payload)
    except Exception:  # pragma: no cover - depende de infraestructura opcional
        logger.exception("No fue posible encolar la notificación de contacto")
