from collections import defaultdict
from datetime import date, datetime
from decimal import Decimal

from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.orm import Session, joinedload, selectinload

from app.core.database import get_db
from app.core.utils import percent_change
from app.models import (
    ActivityLog,
    Client,
    Inventory,
    Invoice,
    Product,
    Quote,
    Sale,
    SaleItem,
)
from app.schemas import (
    ActivityOut,
    CategorySlice,
    DashboardSummary,
    LowStockItem,
    RecentSale,
    SalesPoint,
    TopProduct,
)

router = APIRouter(prefix="/dashboard", tags=["Panel"])

MONTHS_ES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"]


def shift_month(year: int, month: int, delta: int) -> tuple[int, int]:
    index = year * 12 + (month - 1) + delta
    return index // 12, index % 12 + 1


def month_start(year: int, month: int) -> datetime:
    return datetime(year, month, 1)


@router.get("/summary", response_model=DashboardSummary)
def dashboard_summary(db: Session = Depends(get_db)) -> DashboardSummary:
    now = datetime.now()
    current_year, current_month = now.year, now.month
    current_start = month_start(current_year, current_month)
    next_year, next_month = shift_month(current_year, current_month, 1)
    next_start = month_start(next_year, next_month)
    prev_year, prev_month = shift_month(current_year, current_month, -1)
    prev_start = month_start(prev_year, prev_month)

    first_year, first_month = shift_month(current_year, current_month, -5)
    series_start = month_start(first_year, first_month)

    sales_rows = db.execute(
        select(Sale.sale_date, Sale.total, Sale.status)
        .where(
            Sale.sale_date >= series_start,
            Sale.sale_date < next_start,
            Sale.status != "cancelada",
        )
        .order_by(Sale.sale_date)
    ).all()

    buckets: dict[tuple[int, int], dict[str, float | int]] = defaultdict(
        lambda: {"total": 0.0, "count": 0}
    )
    for sale_date, total, _status in sales_rows:
        buckets[(sale_date.year, sale_date.month)]["total"] += float(total)
        buckets[(sale_date.year, sale_date.month)]["count"] += 1

    sales_series: list[SalesPoint] = []
    for offset in range(5, -1, -1):
        year, month = shift_month(current_year, current_month, -offset)
        bucket = buckets.get((year, month), {"total": 0.0, "count": 0})
        sales_series.append(
            SalesPoint(
                month=f"{year}-{month:02d}",
                label=f"{MONTHS_ES[month - 1].capitalize()} {str(year)[2:]}",
                total=round(float(bucket["total"]), 2),
                count=int(bucket["count"]),
            )
        )

    current_point = sales_series[-1]
    previous_point = sales_series[-2] if len(sales_series) > 1 else None
    previous_total = previous_point.total if previous_point else 0
    previous_count = previous_point.count if previous_point else 0

    # Detalle del mes actual para categorías y productos.
    current_items = db.scalars(
        select(SaleItem)
        .join(SaleItem.sale)
        .where(
            Sale.sale_date >= current_start,
            Sale.sale_date < next_start,
            Sale.status != "cancelada",
        )
        .options(joinedload(SaleItem.product).joinedload(Product.category))
    ).unique().all()

    category_totals: dict[str, float] = defaultdict(float)
    product_totals: dict[str, dict[str, float]] = defaultdict(lambda: {"quantity": 0, "total": 0.0})
    for item in current_items:
        if item.product is None:
            continue
        category_totals[item.product.category.name] += float(item.subtotal)
        product_totals[item.product.name]["quantity"] += item.quantity
        product_totals[item.product.name]["total"] += float(item.subtotal)

    category_series = [
        CategorySlice(name=name, value=round(value, 2))
        for name, value in sorted(category_totals.items(), key=lambda pair: pair[1], reverse=True)
    ]
    top_products = [
        TopProduct(
            name=name,
            quantity=int(data["quantity"]),
            total=round(data["total"], 2),
        )
        for name, data in sorted(
            product_totals.items(), key=lambda pair: pair[1]["quantity"], reverse=True
        )[:5]
    ]

    active_products = db.scalar(
        select(func.count(Product.id)).where(Product.is_active.is_(True))
    ) or 0
    low_stock_count = db.scalar(
        select(func.count(Inventory.id)).where(Inventory.quantity <= Inventory.min_stock)
    ) or 0
    pending_quotes = db.scalar(
        select(func.count(Quote.id)).where(Quote.status.in_(["borrador", "enviada"]))
    ) or 0
    clients_count = db.scalar(select(func.count(Client.id))) or 0

    low_stock_rows = db.scalars(
        select(Inventory)
        .join(Inventory.product)
        .options(joinedload(Inventory.product), joinedload(Inventory.warehouse))
        .where(Inventory.quantity <= Inventory.min_stock)
        .order_by(Inventory.quantity.asc())
        .limit(6)
    ).unique().all()

    recent_sales_rows = db.scalars(
        select(Sale)
        .options(joinedload(Sale.client))
        .order_by(Sale.sale_date.desc())
        .limit(6)
    ).unique().all()

    recent_activity = db.scalars(
        select(ActivityLog).order_by(ActivityLog.created_at.desc()).limit(6)
    ).all()

    unpaid_invoices = db.scalars(
        select(Invoice)
        .where(Invoice.status != "pagada")
        .options(selectinload(Invoice.payments))
    ).unique().all()
    accounts_receivable = 0.0
    for invoice in unpaid_invoices:
        paid = sum((float(payment.amount) for payment in invoice.payments), start=0.0)
        accounts_receivable += max(float(invoice.total) - paid, 0.0)

    return DashboardSummary(
        generated_at=now,
        revenue_month=round(current_point.total, 2),
        revenue_delta_pct=percent_change(current_point.total, previous_total),
        sales_month=current_point.count,
        sales_delta_pct=percent_change(current_point.count, previous_count),
        active_products=int(active_products),
        low_stock_count=int(low_stock_count),
        pending_quotes=int(pending_quotes),
        clients_count=int(clients_count),
        accounts_receivable=round(accounts_receivable, 2),
        sales_series=sales_series,
        category_series=category_series,
        top_products=top_products,
        low_stock=[
            LowStockItem(
                product=row.product.name,
                sku=row.product.sku,
                warehouse=row.warehouse.name,
                quantity=row.quantity,
                min_stock=row.min_stock,
            )
            for row in low_stock_rows
        ],
        recent_sales=[
            RecentSale(
                id=sale.id,
                folio=sale.folio,
                client=sale.client.business_name if sale.client else "Público general",
                total=float(sale.total),
                status=sale.status,
                sale_date=sale.sale_date,
            )
            for sale in recent_sales_rows
        ],
        recent_activity=[
            ActivityOut(
                id=activity.id,
                action=activity.action,
                description=activity.description,
                created_at=activity.created_at,
            )
            for activity in recent_activity
        ],
    )
