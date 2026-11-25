from datetime import date

from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload, selectinload

from app.core.database import get_db
from app.models import Invoice, Sale
from app.schemas import InvoiceOut, SaleOut

router = APIRouter(tags=["Ventas y facturación"])


@router.get("/sales", response_model=list[SaleOut])
def list_sales(
    status_filter: str | None = Query(default=None, alias="status", max_length=20),
    limit: int = Query(default=50, ge=1, le=200),
    db: Session = Depends(get_db),
) -> list[SaleOut]:
    stmt = (
        select(Sale)
        .options(joinedload(Sale.client), selectinload(Sale.items))
        .order_by(Sale.sale_date.desc())
        .limit(limit)
    )
    if status_filter:
        stmt = stmt.where(Sale.status == status_filter)

    sales = db.scalars(stmt).unique().all()
    return [
        SaleOut(
            id=sale.id,
            folio=sale.folio,
            client_name=sale.client.business_name if sale.client else "Público general",
            sale_date=sale.sale_date,
            subtotal=float(sale.subtotal),
            tax=float(sale.tax),
            total=float(sale.total),
            status=sale.status,
            payment_method=sale.payment_method,
            items_count=len(sale.items),
        )
        for sale in sales
    ]


@router.get("/invoices", response_model=list[InvoiceOut])
def list_invoices(
    limit: int = Query(default=50, ge=1, le=200),
    db: Session = Depends(get_db),
) -> list[InvoiceOut]:
    stmt = (
        select(Invoice)
        .options(
            joinedload(Invoice.client),
            joinedload(Invoice.sale),
            selectinload(Invoice.payments),
        )
        .order_by(Invoice.issue_date.desc())
        .limit(limit)
    )
    invoices = db.scalars(stmt).unique().all()
    today = date.today()
    results: list[InvoiceOut] = []

    for invoice in invoices:
        paid = sum((payment.amount for payment in invoice.payments), start=0)
        paid_float = float(paid)
        total_float = float(invoice.total)
        computed_status = invoice.status
        if paid_float >= total_float and total_float > 0:
            computed_status = "pagada"
        elif invoice.status != "pagada" and invoice.due_date < today:
            computed_status = "vencida"

        results.append(
            InvoiceOut(
                id=invoice.id,
                folio=invoice.folio,
                client_name=invoice.client.business_name,
                sale_folio=invoice.sale.folio if invoice.sale else None,
                issue_date=invoice.issue_date,
                due_date=invoice.due_date,
                subtotal=float(invoice.subtotal),
                tax=float(invoice.tax),
                total=total_float,
                paid_amount=paid_float,
                status=computed_status,
            )
        )
    return results
