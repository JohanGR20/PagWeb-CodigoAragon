from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models import Client
from app.schemas import ClientCreate, ClientOut

router = APIRouter(prefix="/clients", tags=["Clientes"])


@router.get("", response_model=list[ClientOut])
def list_clients(
    search: str | None = Query(default=None, max_length=100),
    limit: int = Query(default=100, ge=1, le=200),
    db: Session = Depends(get_db),
) -> list[Client]:
    stmt = select(Client).order_by(Client.business_name.asc()).limit(limit)
    if search:
        term = f"%{search.strip()}%"
        stmt = stmt.where(
            or_(
                Client.business_name.ilike(term),
                Client.name.ilike(term),
                Client.email.ilike(term),
            )
        )
    return list(db.scalars(stmt).unique())


@router.post("", response_model=ClientOut, status_code=status.HTTP_201_CREATED)
def create_client(payload: ClientCreate, db: Session = Depends(get_db)) -> Client:
    if payload.email:
        existing = db.scalar(select(Client).where(Client.email == str(payload.email)))
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Ya existe un cliente con ese correo electrónico.",
            )

    client = Client(**payload.model_dump(mode="json"))
    db.add(client)
    db.commit()
    db.refresh(client)
    return client
