from fastapi import APIRouter, BackgroundTasks, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models import ActivityLog, ContactMessage
from app.schemas import ContactCreate, ContactCreated
from app.services.notifications import notify_new_contact

router = APIRouter(prefix="/contact", tags=["Contacto"])


@router.post("", response_model=ContactCreated, status_code=status.HTTP_201_CREATED)
def create_contact(
    payload: ContactCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
) -> ContactCreated:
    contact = ContactMessage(
        name=payload.name,
        business_name=payload.business_name,
        email=str(payload.email),
        phone=payload.phone,
        service_interest=payload.service_interest,
        budget=payload.budget,
        message=payload.message,
        consent=payload.consent,
    )
    db.add(contact)
    db.flush()

    db.add(
        ActivityLog(
            action="contacto",
            entity="contact_message",
            entity_id=contact.id,
            description=f"Nueva solicitud de {contact.name} · {contact.service_interest}",
        )
    )
    db.commit()

    background_tasks.add_task(notify_new_contact, contact.id, payload.model_dump(mode="json"))

    return ContactCreated(
        id=contact.id,
        message="Recibimos tu mensaje. Te contactaremos en menos de 24 horas hábiles.",
    )
