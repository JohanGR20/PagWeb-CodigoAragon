from __future__ import annotations

from datetime import date, datetime
from decimal import Decimal
from typing import Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator


class ORMModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)


# ---------------------------------------------------------------------------
# Contacto
# ---------------------------------------------------------------------------
ServiceInterest = Literal[
    "Presencia web",
    "Automatización de ventas",
    "Software a medida + IA",
    "Diagnóstico general",
]
BudgetRange = Literal[
    "Menos de $5,000",
    "$5,000 – $15,000",
    "$15,000 – $30,000",
    "Más de $30,000",
    "Por definir",
]


class ContactCreate(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    business_name: str | None = Field(default=None, max_length=160)
    email: EmailStr
    phone: str = Field(min_length=10, max_length=20, pattern=r"^[0-9+()\-\s]+$")
    service_interest: ServiceInterest
    budget: BudgetRange | None = None
    message: str = Field(min_length=10, max_length=2000)
    consent: bool

    @field_validator("name", "business_name", "message", mode="before")
    @classmethod
    def strip_text(cls, value: str | None) -> str | None:
        return value.strip() if isinstance(value, str) else value

    @field_validator("consent")
    @classmethod
    def must_consent(cls, value: bool) -> bool:
        if not value:
            raise ValueError("Debes aceptar el aviso de privacidad para continuar.")
        return value


class ContactOut(ORMModel):
    id: int
    name: str
    business_name: str | None
    email: EmailStr
    phone: str
    service_interest: str
    budget: str | None
    message: str
    status: str
    created_at: datetime


class ContactCreated(BaseModel):
    id: int
    message: str


# ---------------------------------------------------------------------------
# Clientes
# ---------------------------------------------------------------------------
class ClientCreate(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    business_name: str = Field(min_length=2, max_length=160)
    email: EmailStr | None = None
    phone: str | None = Field(default=None, max_length=30)
    address: str | None = Field(default=None, max_length=255)
    rfc: str | None = Field(default=None, max_length=20)
    notes: str | None = Field(default=None, max_length=1000)

    @field_validator("name", "business_name", "address", "notes", mode="before")
    @classmethod
    def strip_text(cls, value: str | None) -> str | None:
        return value.strip() if isinstance(value, str) else value


class ClientOut(ORMModel):
    id: int
    name: str
    business_name: str
    email: str | None
    phone: str | None
    address: str | None
    rfc: str | None
    notes: str | None
    created_at: datetime


# ---------------------------------------------------------------------------
# Catálogo e inventario
# ---------------------------------------------------------------------------
class CategoryOut(ORMModel):
    id: int
    name: str
    description: str | None


class ProductOut(BaseModel):
    id: int
    sku: str
    name: str
    category_id: int
    category_name: str
    unit_price: float
    cost_price: float
    unit: str
    is_active: bool


class WarehouseOut(ORMModel):
    id: int
    name: str
    location: str | None
    is_active: bool


class InventoryOut(BaseModel):
    id: int
    product_id: int
    product_name: str
    sku: str
    category_name: str
    warehouse_id: int
    warehouse_name: str
    quantity: int
    min_stock: int
    unit_price: float
    stock_value: float
    status: Literal["agotado", "bajo", "medio", "ok"]


class MovementCreate(BaseModel):
    product_id: int
    warehouse_id: int
    movement_type: Literal["entrada", "salida", "ajuste"]
    quantity: int = Field(gt=0, le=100000)
    notes: str | None = Field(default=None, max_length=500)


class MovementOut(BaseModel):
    id: int
    product_name: str
    warehouse_name: str
    movement_type: str
    quantity: int
    reference: str | None
    notes: str | None
    created_at: datetime


# ---------------------------------------------------------------------------
# Ventas, facturas y pagos
# ---------------------------------------------------------------------------
class SaleOut(BaseModel):
    id: int
    folio: str
    client_name: str
    sale_date: datetime
    subtotal: float
    tax: float
    total: float
    status: str
    payment_method: str
    items_count: int


class InvoiceOut(BaseModel):
    id: int
    folio: str
    client_name: str
    sale_folio: str | None
    issue_date: date
    due_date: date
    subtotal: float
    tax: float
    total: float
    paid_amount: float
    status: str


# ---------------------------------------------------------------------------
# Cotizaciones
# ---------------------------------------------------------------------------
class QuoteItemCreate(BaseModel):
    product_id: int | None = None
    description: str = Field(min_length=2, max_length=200)
    quantity: int = Field(gt=0, le=10000)
    unit_price: Decimal = Field(ge=0, le=1000000)


class QuoteCreate(BaseModel):
    client_id: int
    valid_until: date
    notes: str | None = Field(default=None, max_length=1000)
    tax_rate: Decimal = Field(default=Decimal("0.16"), ge=0, le=1)
    items: list[QuoteItemCreate] = Field(min_length=1, max_length=50)


class QuoteItemOut(BaseModel):
    id: int
    product_id: int | None
    description: str
    quantity: int
    unit_price: float
    subtotal: float


class QuoteClientOut(BaseModel):
    id: int
    name: str
    business_name: str
    email: str | None
    phone: str | None


class QuoteOut(BaseModel):
    id: int
    folio: str
    client_id: int
    client: QuoteClientOut
    issue_date: datetime
    valid_until: date
    subtotal: float
    tax: float
    total: float
    status: str
    notes: str | None
    items: list[QuoteItemOut]


# ---------------------------------------------------------------------------
# Panel
# ---------------------------------------------------------------------------
class SalesPoint(BaseModel):
    month: str
    label: str
    total: float
    count: int


class CategorySlice(BaseModel):
    name: str
    value: float


class TopProduct(BaseModel):
    name: str
    quantity: int
    total: float


class LowStockItem(BaseModel):
    product: str
    sku: str
    warehouse: str
    quantity: int
    min_stock: int


class RecentSale(BaseModel):
    id: int
    folio: str
    client: str
    total: float
    status: str
    sale_date: datetime


class ActivityOut(BaseModel):
    id: int
    action: str
    description: str
    created_at: datetime


class DashboardSummary(BaseModel):
    generated_at: datetime
    revenue_month: float
    revenue_delta_pct: float | None
    sales_month: int
    sales_delta_pct: float | None
    active_products: int
    low_stock_count: int
    pending_quotes: int
    clients_count: int
    accounts_receivable: float
    sales_series: list[SalesPoint]
    category_series: list[CategorySlice]
    top_products: list[TopProduct]
    low_stock: list[LowStockItem]
    recent_sales: list[RecentSale]
    recent_activity: list[ActivityOut]


class HealthOut(BaseModel):
    status: str
    service: str
    version: str
    environment: str
