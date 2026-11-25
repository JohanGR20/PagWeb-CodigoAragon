"""Modelo de datos de Código Aragón.

El panel de demostración representa la operación de un negocio tipo
distribuidora de abarrotes, con el fin de mostrar los módulos de inventario,
ventas, compras, cotizaciones y facturación que Código Aragón puede adaptar.
"""

from __future__ import annotations

from datetime import date, datetime
from decimal import Decimal
from typing import Optional

from sqlalchemy import (
    Boolean,
    Date,
    DateTime,
    ForeignKey,
    Integer,
    Numeric,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.core.utils import utcnow


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    full_name: Mapped[str] = mapped_column(String(120))
    email: Mapped[str] = mapped_column(String(160), unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String(255), default="demo-no-auth")
    role: Mapped[str] = mapped_column(String(40), default="operador")
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow)

    sales: Mapped[list[Sale]] = relationship(back_populates="user")
    quotes: Mapped[list[Quote]] = relationship(back_populates="user")


class Client(Base):
    __tablename__ = "clients"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120))
    business_name: Mapped[str] = mapped_column(String(160))
    email: Mapped[Optional[str]] = mapped_column(String(160), nullable=True)
    phone: Mapped[Optional[str]] = mapped_column(String(30), nullable=True)
    address: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    rfc: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow)

    sales: Mapped[list[Sale]] = relationship(back_populates="client")
    quotes: Mapped[list[Quote]] = relationship(back_populates="client")
    invoices: Mapped[list[Invoice]] = relationship(back_populates="client")


class Category(Base):
    __tablename__ = "categories"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(80), unique=True)
    description: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)

    products: Mapped[list[Product]] = relationship(back_populates="category")


class Product(Base):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(primary_key=True)
    sku: Mapped[str] = mapped_column(String(40), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(160))
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    category_id: Mapped[int] = mapped_column(ForeignKey("categories.id"))
    unit_price: Mapped[Decimal] = mapped_column(Numeric(12, 2), default=0)
    cost_price: Mapped[Decimal] = mapped_column(Numeric(12, 2), default=0)
    unit: Mapped[str] = mapped_column(String(20), default="pieza")
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow)

    category: Mapped[Category] = relationship(back_populates="products", lazy="joined")
    inventory: Mapped[list[Inventory]] = relationship(back_populates="product")
    movements: Mapped[list[InventoryMovement]] = relationship(back_populates="product")
    sale_items: Mapped[list[SaleItem]] = relationship(back_populates="product")
    purchase_items: Mapped[list[PurchaseItem]] = relationship(back_populates="product")
    quote_items: Mapped[list[QuoteItem]] = relationship(back_populates="product")


class Warehouse(Base):
    __tablename__ = "warehouses"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), unique=True)
    location: Mapped[Optional[str]] = mapped_column(String(180), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    inventory: Mapped[list[Inventory]] = relationship(back_populates="warehouse")
    movements: Mapped[list[InventoryMovement]] = relationship(back_populates="warehouse")


class Inventory(Base):
    __tablename__ = "inventory"
    __table_args__ = (UniqueConstraint("product_id", "warehouse_id", name="uq_inventory_product_warehouse"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    product_id: Mapped[int] = mapped_column(ForeignKey("products.id"))
    warehouse_id: Mapped[int] = mapped_column(ForeignKey("warehouses.id"))
    quantity: Mapped[int] = mapped_column(Integer, default=0)
    min_stock: Mapped[int] = mapped_column(Integer, default=5)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow, onupdate=utcnow)

    product: Mapped[Product] = relationship(back_populates="inventory", lazy="joined")
    warehouse: Mapped[Warehouse] = relationship(back_populates="inventory", lazy="joined")


class InventoryMovement(Base):
    __tablename__ = "inventory_movements"

    id: Mapped[int] = mapped_column(primary_key=True)
    product_id: Mapped[int] = mapped_column(ForeignKey("products.id"))
    warehouse_id: Mapped[int] = mapped_column(ForeignKey("warehouses.id"))
    movement_type: Mapped[str] = mapped_column(String(20))  # entrada | salida | ajuste
    quantity: Mapped[int] = mapped_column(Integer)
    reference: Mapped[Optional[str]] = mapped_column(String(60), nullable=True)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_by: Mapped[Optional[int]] = mapped_column(ForeignKey("users.id"), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow)

    product: Mapped[Product] = relationship(back_populates="movements", lazy="joined")
    warehouse: Mapped[Warehouse] = relationship(back_populates="movements", lazy="joined")


class Sale(Base):
    __tablename__ = "sales"

    id: Mapped[int] = mapped_column(primary_key=True)
    folio: Mapped[str] = mapped_column(String(30), unique=True, index=True)
    client_id: Mapped[Optional[int]] = mapped_column(ForeignKey("clients.id"), nullable=True)
    user_id: Mapped[Optional[int]] = mapped_column(ForeignKey("users.id"), nullable=True)
    sale_date: Mapped[datetime] = mapped_column(DateTime, default=utcnow, index=True)
    subtotal: Mapped[Decimal] = mapped_column(Numeric(12, 2), default=0)
    tax: Mapped[Decimal] = mapped_column(Numeric(12, 2), default=0)
    total: Mapped[Decimal] = mapped_column(Numeric(12, 2), default=0)
    status: Mapped[str] = mapped_column(String(20), default="pagada")
    payment_method: Mapped[str] = mapped_column(String(30), default="efectivo")
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    client: Mapped[Optional[Client]] = relationship(back_populates="sales", lazy="joined")
    user: Mapped[Optional[User]] = relationship(back_populates="sales", lazy="joined")
    items: Mapped[list[SaleItem]] = relationship(
        back_populates="sale", cascade="all, delete-orphan", lazy="selectin"
    )
    invoice: Mapped[Optional[Invoice]] = relationship(back_populates="sale", uselist=False)


class SaleItem(Base):
    __tablename__ = "sale_items"

    id: Mapped[int] = mapped_column(primary_key=True)
    sale_id: Mapped[int] = mapped_column(ForeignKey("sales.id", ondelete="CASCADE"))
    product_id: Mapped[int] = mapped_column(ForeignKey("products.id"))
    quantity: Mapped[int] = mapped_column(Integer)
    unit_price: Mapped[Decimal] = mapped_column(Numeric(12, 2))
    subtotal: Mapped[Decimal] = mapped_column(Numeric(12, 2))

    sale: Mapped[Sale] = relationship(back_populates="items")
    product: Mapped[Product] = relationship(back_populates="sale_items", lazy="joined")


class Purchase(Base):
    __tablename__ = "purchases"

    id: Mapped[int] = mapped_column(primary_key=True)
    folio: Mapped[str] = mapped_column(String(30), unique=True, index=True)
    supplier: Mapped[str] = mapped_column(String(160))
    user_id: Mapped[Optional[int]] = mapped_column(ForeignKey("users.id"), nullable=True)
    purchase_date: Mapped[datetime] = mapped_column(DateTime, default=utcnow)
    subtotal: Mapped[Decimal] = mapped_column(Numeric(12, 2), default=0)
    tax: Mapped[Decimal] = mapped_column(Numeric(12, 2), default=0)
    total: Mapped[Decimal] = mapped_column(Numeric(12, 2), default=0)
    status: Mapped[str] = mapped_column(String(20), default="recibida")

    items: Mapped[list[PurchaseItem]] = relationship(
        back_populates="purchase", cascade="all, delete-orphan", lazy="selectin"
    )


class PurchaseItem(Base):
    __tablename__ = "purchase_items"

    id: Mapped[int] = mapped_column(primary_key=True)
    purchase_id: Mapped[int] = mapped_column(ForeignKey("purchases.id", ondelete="CASCADE"))
    product_id: Mapped[int] = mapped_column(ForeignKey("products.id"))
    quantity: Mapped[int] = mapped_column(Integer)
    unit_cost: Mapped[Decimal] = mapped_column(Numeric(12, 2))
    subtotal: Mapped[Decimal] = mapped_column(Numeric(12, 2))

    purchase: Mapped[Purchase] = relationship(back_populates="items")
    product: Mapped[Product] = relationship(back_populates="purchase_items", lazy="joined")


class Quote(Base):
    __tablename__ = "quotes"

    id: Mapped[int] = mapped_column(primary_key=True)
    folio: Mapped[str] = mapped_column(String(30), unique=True, index=True)
    client_id: Mapped[int] = mapped_column(ForeignKey("clients.id"))
    user_id: Mapped[Optional[int]] = mapped_column(ForeignKey("users.id"), nullable=True)
    issue_date: Mapped[datetime] = mapped_column(DateTime, default=utcnow)
    valid_until: Mapped[date] = mapped_column(Date)
    subtotal: Mapped[Decimal] = mapped_column(Numeric(12, 2), default=0)
    tax: Mapped[Decimal] = mapped_column(Numeric(12, 2), default=0)
    total: Mapped[Decimal] = mapped_column(Numeric(12, 2), default=0)
    status: Mapped[str] = mapped_column(String(20), default="enviada")
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    client: Mapped[Client] = relationship(back_populates="quotes", lazy="joined")
    user: Mapped[Optional[User]] = relationship(back_populates="quotes", lazy="joined")
    items: Mapped[list[QuoteItem]] = relationship(
        back_populates="quote", cascade="all, delete-orphan", lazy="selectin"
    )


class QuoteItem(Base):
    __tablename__ = "quote_items"

    id: Mapped[int] = mapped_column(primary_key=True)
    quote_id: Mapped[int] = mapped_column(ForeignKey("quotes.id", ondelete="CASCADE"))
    product_id: Mapped[Optional[int]] = mapped_column(ForeignKey("products.id"), nullable=True)
    description: Mapped[str] = mapped_column(String(200))
    quantity: Mapped[int] = mapped_column(Integer)
    unit_price: Mapped[Decimal] = mapped_column(Numeric(12, 2))
    subtotal: Mapped[Decimal] = mapped_column(Numeric(12, 2))

    quote: Mapped[Quote] = relationship(back_populates="items")
    product: Mapped[Optional[Product]] = relationship(back_populates="quote_items", lazy="joined")


class Invoice(Base):
    __tablename__ = "invoices"

    id: Mapped[int] = mapped_column(primary_key=True)
    folio: Mapped[str] = mapped_column(String(30), unique=True, index=True)
    sale_id: Mapped[Optional[int]] = mapped_column(ForeignKey("sales.id"), unique=True, nullable=True)
    client_id: Mapped[int] = mapped_column(ForeignKey("clients.id"))
    issue_date: Mapped[date] = mapped_column(Date, default=date.today)
    due_date: Mapped[date] = mapped_column(Date)
    subtotal: Mapped[Decimal] = mapped_column(Numeric(12, 2), default=0)
    tax: Mapped[Decimal] = mapped_column(Numeric(12, 2), default=0)
    total: Mapped[Decimal] = mapped_column(Numeric(12, 2), default=0)
    status: Mapped[str] = mapped_column(String(20), default="emitida")
    fiscal_uuid: Mapped[Optional[str]] = mapped_column(String(60), nullable=True)

    client: Mapped[Client] = relationship(back_populates="invoices", lazy="joined")
    sale: Mapped[Optional[Sale]] = relationship(back_populates="invoice")
    payments: Mapped[list[Payment]] = relationship(
        back_populates="invoice", cascade="all, delete-orphan", lazy="selectin"
    )


class Payment(Base):
    __tablename__ = "payments"

    id: Mapped[int] = mapped_column(primary_key=True)
    invoice_id: Mapped[int] = mapped_column(ForeignKey("invoices.id", ondelete="CASCADE"))
    payment_date: Mapped[datetime] = mapped_column(DateTime, default=utcnow)
    amount: Mapped[Decimal] = mapped_column(Numeric(12, 2))
    method: Mapped[str] = mapped_column(String(30), default="transferencia")
    reference: Mapped[Optional[str]] = mapped_column(String(80), nullable=True)

    invoice: Mapped[Invoice] = relationship(back_populates="payments")


class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[Optional[int]] = mapped_column(ForeignKey("users.id"), nullable=True)
    action: Mapped[str] = mapped_column(String(60))
    entity: Mapped[str] = mapped_column(String(40))
    entity_id: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    description: Mapped[str] = mapped_column(String(255))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow, index=True)


class ContactMessage(Base):
    __tablename__ = "contact_messages"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120))
    business_name: Mapped[Optional[str]] = mapped_column(String(160), nullable=True)
    email: Mapped[str] = mapped_column(String(160))
    phone: Mapped[str] = mapped_column(String(30))
    service_interest: Mapped[str] = mapped_column(String(60))
    budget: Mapped[Optional[str]] = mapped_column(String(40), nullable=True)
    message: Mapped[str] = mapped_column(Text)
    consent: Mapped[bool] = mapped_column(Boolean, default=True)
    status: Mapped[str] = mapped_column(String(20), default="nuevo")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow, index=True)
