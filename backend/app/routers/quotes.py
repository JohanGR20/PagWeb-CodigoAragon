from datetime import date
from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session, joinedload, selectinload

from app.core.database import get_db
from app.core.utils import money, utcnow
from app.models import ActivityLog, Client, Product, Quote, QuoteItem
from app.schemas import QuoteCreate, QuoteOut

router = APIRouter(prefix="/quotes", tags=["Cotizaciones"])


def serialize_quote(quote: Quote) -> QuoteOut:
    return QuoteOut(
        id=quote.id,
        folio=quote.folio,
        client_id=quote.client_id,
        client={
            "id": quote.client.id,
            "name": quote.client.name,
            "business_name": quote.client.business_name,
            "email": quote.client.email,
            "phone": quote.client.phone,
        },
        issue_date=quote.issue_date,
        valid_until=quote.valid_until,
        subtotal=float(quote.subtotal),
        tax=float(quote.tax),
        total=float(quote.total),
        status=quote.status,
        notes=quote.notes,
        items=[
            {
                "id": item.id,
                "product_id": item.product_id,
                "description": item.description,
                "quantity": item.quantity,
                "unit_price": float(item.unit_price),
                "subtotal": float(item.subtotal),
            }
            for item in quote.items
        ],
    )


@router.get("", response_model=list[QuoteOut])
def list_quotes(
    limit: int = Query(default=50, ge=1, le=200),
    db: Session = Depends(get_db),
) -> list[QuoteOut]:
    stmt = (
        select(Quote)
        .options(joinedload(Quote.client), selectinload(Quote.items))
        .order_by(Quote.issue_date.desc())
        .limit(limit)
    )
    quotes = db.scalars(stmt).unique().all()
    return [serialize_quote(quote) for quote in quotes]


@router.post("", response_model=QuoteOut, status_code=status.HTTP_201_CREATED)
def create_quote(payload: QuoteCreate, db: Session = Depends(get_db)) -> QuoteOut:
    client = db.get(Client, payload.client_id)
    if client is None:
        raise HTTPException(status_code=404, detail="Cliente no encontrado.")

    product_ids = {item.product_id for item in payload.items if item.product_id}
    products: dict[int, Product] = {}
    if product_ids:
        products = {
            product.id: product
            for product in db.scalars(select(Product).where(Product.id.in_(product_ids))).all()
        }
        missing = product_ids - products.keys()
        if missing:
            raise HTTPException(status_code=404, detail="Uno de los productos ya no está disponible.")

    subtotal = Decimal("0.00")
    quote_items: list[QuoteItem] = []
    for item in payload.items:
        product = products.get(item.product_id) if item.product_id else None
        description = item.description.strip()
        if product and not description:
            description = product.name
        line_subtotal = money(item.unit_price * item.quantity)
        subtotal += line_subtotal
        quote_items.append(
            QuoteItem(
                product_id=item.product_id,
                description=description,
                quantity=item.quantity,
                unit_price=money(item.unit_price),
                subtotal=line_subtotal,
            )
        )

    subtotal = money(subtotal)
    tax = money(subtotal * payload.tax_rate)
    total = money(subtotal + tax)

    next_id = (db.scalar(select(func.max(Quote.id))) or 0) + 1
    quote = Quote(
        folio=f"COT-{date.today():%Y}-{next_id:04d}",
        client_id=payload.client_id,
        issue_date=utcnow(),
        valid_until=payload.valid_until,
        subtotal=subtotal,
        tax=tax,
        total=total,
        status="enviada",
        notes=payload.notes,
        items=quote_items,
    )
    db.add(quote)
    db.flush()

    db.add(
        ActivityLog(
            action="cotizacion",
            entity="quote",
            entity_id=quote.id,
            description=f"Cotización {quote.folio} enviada a {client.business_name}",
        )
    )
    db.commit()

    created = db.scalar(
        select(Quote)
        .options(joinedload(Quote.client), selectinload(Quote.items))
        .where(Quote.id == quote.id)
    )
    if created is None:  # pragma: no cover - protección defensiva
        raise HTTPException(status_code=500, detail="No fue posible recuperar la cotización.")
    return serialize_quote(created)
