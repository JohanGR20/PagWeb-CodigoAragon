"""Datos de demostración para el panel de Código Aragón.

Uso:
    python -m app.seed --reset

Los datos representan una distribuidora de abarrotes ficticia y sirven para
mostrar los módulos que Código Aragón puede construir para un negocio local.
"""

from __future__ import annotations

import argparse
import calendar
import random
from datetime import date, datetime, timedelta
from decimal import Decimal

from sqlalchemy import select

from app.core.database import Base, SessionLocal, engine
from app.core.utils import money
from app.models import (
    ActivityLog,
    Category,
    Client,
    ContactMessage,
    Inventory,
    InventoryMovement,
    Invoice,
    Payment,
    Product,
    Purchase,
    PurchaseItem,
    Quote,
    QuoteItem,
    Sale,
    SaleItem,
    User,
    Warehouse,
)

RNG = random.Random(20261124)
TAX_RATE = Decimal("0.16")

USERS = [
    ("Cristian Daniel De Lucio Lira", "cristian.delucio@codigoaragon.mx", "direccion"),
    ("Johan Sánchez", "johan.sanchez@codigoaragon.mx", "desarrollo"),
    ("Eduardo Martínez", "eduardo.martinez@codigoaragon.mx", "diseño"),
    ("Iván Vicente", "ivan.vicente@codigoaragon.mx", "operaciones"),
]

CLIENTS = [
    ("Laura Méndez", "Papelería El Lápiz", "laura@ellapiz.mx", "5512345678", "Av. Universidad 1200, Coyoacán"),
    ("Diego Ramírez", "Café La Esquina", "diego@laesquina.mx", "5523456789", "Calle 5 de Mayo 42, Centro"),
    ("María González", "Abarrotes Doña Mary", "maria@donamary.mx", "5534567890", "Av. Central 318, Nezahualcóyotl"),
    ("Sofía Torres", "Estética Bella Vista", "sofia@bellavista.mx", "5545678901", "Calle 12 sur 87, Puebla"),
    ("Jorge Herrera", "Taller Mecánico Aragón", "jorge@talleraragon.mx", "5556789012", "Av. 535 210, Gustavo A. Madero"),
    ("Ana López", "Fondita La Tía", "ana@fonditalatia.mx", "5567890123", "Calle Hidalgo 19, Iztapalapa"),
    ("Jesús Hernández", "Tienda Don Chuy", "jesus@donchuy.mx", "5578901234", "Av. Pantitlán 78, Nezahualcóyotl"),
    ("Carmen Ruiz", "Restaurante El Fogón", "carmen@elfogon.mx", "5589012345", "Calle 16 de Septiembre 33, Texcoco"),
]

CATEGORIES = [
    ("Abarrotes", "Productos de consumo diario y despensa."),
    ("Bebidas", "Aguas, jugos y refrescos."),
    ("Limpieza", "Artículos de aseo para el hogar y negocio."),
    ("Papelería", "Material escolar y de oficina."),
    ("Botanas", "Productos para venta al detalle."),
]

PRODUCTS = [
    ("ABR-001", "Café molido 500 g", "Abarrotes", 95, 62, "pieza"),
    ("ABR-002", "Arroz grano largo 1 kg", "Abarrotes", 28, 19, "kg"),
    ("ABR-003", "Frijol negro 1 kg", "Abarrotes", 34, 24, "kg"),
    ("ABR-004", "Aceite vegetal 900 ml", "Abarrotes", 45, 33, "pieza"),
    ("ABR-005", "Azúcar estándar 1 kg", "Abarrotes", 26, 18, "kg"),
    ("ABR-006", "Leche entera 1 L", "Abarrotes", 27, 21, "pieza"),
    ("BEB-007", "Agua natural 1.5 L", "Bebidas", 15, 9, "pieza"),
    ("BEB-008", "Refresco de cola 2 L", "Bebidas", 38, 27, "pieza"),
    ("BEB-009", "Jugo de naranja 1 L", "Bebidas", 32, 23, "pieza"),
    ("LIM-010", "Limpiador multiusos 500 ml", "Limpieza", 42, 28, "pieza"),
    ("LIM-011", "Jabón en polvo 1 kg", "Limpieza", 39, 27, "pieza"),
    ("LIM-012", "Papel higiénico 4 rollos", "Limpieza", 36, 25, "paquete"),
    ("PAP-013", "Cuaderno profesional 100 hojas", "Papelería", 32, 21, "pieza"),
    ("PAP-014", "Bolígrafo tinta negra", "Papelería", 12, 7, "pieza"),
    ("PAP-015", "Papel bond carta 500 hojas", "Papelería", 95, 70, "paquete"),
    ("BOT-016", "Galletas de avena 120 g", "Botanas", 18, 11, "pieza"),
    ("BOT-017", "Cacahuates salados 150 g", "Botanas", 22, 14, "pieza"),
    ("BEB-018", "Agua mineral 600 ml", "Bebidas", 12, 7, "pieza"),
    ("ABR-019", "Café soluble 200 g", "Abarrotes", 68, 49, "pieza"),
    ("LIM-020", "Detergente líquido 1 L", "Limpieza", 54, 37, "pieza"),
]

SUPPLIERS = [
    "Distribuidora del Valle",
    "Comercializadora Azteca",
    "Abarrotes del Centro",
    "Suministros La Merced",
]

CONTACT_MESSAGES = [
    ("Rosa Jiménez", "Papelería Rosita", "rosa.jimenez@example.com", "5511122233", "Presencia web", "Quiero un catálogo en línea para mis clientes."),
    ("Miguel Ángel Soto", "Café Origen", "miguel.soto@example.com", "5522233344", "Automatización de ventas", "Necesito controlar pedidos e inventario; hoy todo lo anoto en papel."),
    ("Fernanda Ríos", "Estética Nube", "fernanda.rios@example.com", "5533344455", "Diagnóstico general", "Me interesa digitalizar las citas y los pagos."),
    ("Ricardo Peña", "Taller Peña", "ricardo.pena@example.com", "5544455566", "Software a medida + IA", "Busco un sistema para órdenes de servicio y recordatorios."),
]


def sale_folio(number: int) -> str:
    return f"VTA-{date.today():%Y}-{number:04d}"


def quote_folio(number: int) -> str:
    return f"COT-{date.today():%Y}-{number:04d}"


def invoice_folio(number: int) -> str:
    return f"FAC-{date.today():%Y}-{number:04d}"


def purchase_folio(number: int) -> str:
    return f"CMP-{date.today():%Y}-{number:04d}"


def seed() -> None:
    db = SessionLocal()
    try:
        now = datetime.now()

        users = [
            User(
                full_name=name,
                email=email,
                role=role,
                hashed_password="demo-no-auth",
            )
            for name, email, role in USERS
        ]
        db.add_all(users)

        clients = [
            Client(
                name=name,
                business_name=business,
                email=email,
                phone=phone,
                address=address,
                created_at=now - timedelta(days=RNG.randint(60, 400)),
            )
            for name, business, email, phone, address in CLIENTS
        ]
        db.add_all(clients)

        categories = {name: Category(name=name, description=description) for name, description in CATEGORIES}
        db.add_all(categories.values())

        products = []
        for sku, name, category_name, price, cost, unit in PRODUCTS:
            products.append(
                Product(
                    sku=sku,
                    name=name,
                    description=f"Producto de demostración · {name}.",
                    category=categories[category_name],
                    unit_price=Decimal(str(price)),
                    cost_price=Decimal(str(cost)),
                    unit=unit,
                )
            )
        db.add_all(products)
        db.flush()

        warehouses = [
            Warehouse(name="Almacén central", location="Centro, CDMX"),
            Warehouse(name="Sucursal Aragón", location="Nezahualcóyotl, Edomex"),
        ]
        db.add_all(warehouses)
        db.flush()

        inventory: list[Inventory] = []
        for index, product in enumerate(products):
            for warehouse_index, warehouse in enumerate(warehouses):
                base = RNG.randint(28, 140) if warehouse_index == 0 else RNG.randint(6, 52)
                min_stock = RNG.randint(8, 15) if warehouse_index == 0 else RNG.randint(5, 10)
                inventory.append(
                    Inventory(
                        product=product,
                        warehouse=warehouse,
                        quantity=base,
                        min_stock=min_stock,
                    )
                )
        db.add_all(inventory)
        db.flush()

        # Alertas de stock deliberadas para el panel.
        low_stock_targets = {
            "BEB-018": (2, 10),
            "PAP-015": (4, 12),
            "ABR-019": (3, 8),
            "PAP-013": (6, 10),
            "LIM-012": (5, 8),
        }
        for row in inventory:
            if row.product.sku in low_stock_targets and row.warehouse_id == warehouses[1].id:
                quantity, min_stock = low_stock_targets[row.product.sku]
                row.quantity = quantity
                row.min_stock = min_stock

        db.flush()

        # ------------------------------------------------------------------
        # Ventas, facturas y pagos
        # ------------------------------------------------------------------
        months_back = 6
        counts = [8, 10, 11, 13, 16, 20]
        sale_number = 1
        invoice_number = 1
        all_sales: list[Sale] = []

        for offset in range(months_back - 1, -1, -1):
            year = now.year
            month = now.month - offset
            while month <= 0:
                month += 12
                year -= 1
            days_in_month = calendar.monthrange(year, month)[1]
            max_day = min(now.day, days_in_month) if offset == 0 else days_in_month
            for _ in range(counts[months_back - 1 - offset]):
                day = RNG.randint(1, max(1, max_day))
                max_hour = now.hour - 1 if offset == 0 and day == now.day else 19
                sale_date = datetime(
                    year,
                    month,
                    day,
                    RNG.randint(9, max(10, max_hour)),
                    RNG.choice([0, 10, 15, 25, 30, 40, 45, 50]),
                )
                client = RNG.choice(clients)
                chosen = RNG.sample(products, k=RNG.randint(2, 4))

                subtotal = Decimal("0.00")
                sale_items: list[SaleItem] = []
                for product in chosen:
                    quantity = RNG.randint(1, 6)
                    line_total = money(product.unit_price * quantity)
                    subtotal += line_total
                    sale_items.append(
                        SaleItem(
                            product=product,
                            quantity=quantity,
                            unit_price=product.unit_price,
                            subtotal=line_total,
                        )
                    )
                subtotal = money(subtotal)
                tax = money(subtotal * TAX_RATE)
                total = money(subtotal + tax)

                roll = RNG.random()
                status = "pagada" if roll < 0.86 else "pendiente" if roll < 0.96 else "cancelada"
                sale = Sale(
                    folio=sale_folio(sale_number),
                    client=client,
                    user=users[0],
                    sale_date=sale_date,
                    subtotal=subtotal,
                    tax=tax,
                    total=total,
                    status=status,
                    payment_method=RNG.choice(["efectivo", "transferencia", "tarjeta"]),
                    items=sale_items,
                )
                db.add(sale)
                db.flush()
                all_sales.append(sale)

                if status != "cancelada":
                    invoice = Invoice(
                        folio=invoice_folio(invoice_number),
                        sale=sale,
                        client=client,
                        issue_date=sale_date.date(),
                        due_date=sale_date.date() + timedelta(days=15),
                        subtotal=subtotal,
                        tax=tax,
                        total=total,
                        status="pagada" if status == "pagada" else "emitida",
                        fiscal_uuid=f"DEMO-{invoice_number:08d}",
                    )
                    db.add(invoice)
                    invoice_number += 1
                    if status == "pagada":
                        db.add(
                            Payment(
                                invoice=invoice,
                                payment_date=sale_date + timedelta(days=RNG.randint(0, 3)),
                                amount=total,
                                method=sale.payment_method,
                                reference=f"PAGO-{sale_number:05d}",
                            )
                        )

                # Movimientos de salida para las ventas más recientes.
                if offset <= 1:
                    for item in sale_items:
                        db.add(
                            InventoryMovement(
                                product=item.product,
                                warehouse=warehouses[0],
                                movement_type="salida",
                                quantity=item.quantity,
                                reference=sale.folio,
                                notes="Salida por venta",
                                created_by=users[0].id,
                                created_at=sale_date,
                            )
                        )
                sale_number += 1

        # ------------------------------------------------------------------
        # Compras
        # ------------------------------------------------------------------
        purchase_number = 1
        for index in range(7):
            purchase_date = now - timedelta(days=RNG.randint(5, 150))
            chosen = RNG.sample(products, k=3)
            subtotal = Decimal("0.00")
            items: list[PurchaseItem] = []
            for product in chosen:
                quantity = RNG.randint(10, 60)
                line_total = money(product.cost_price * quantity)
                subtotal += line_total
                items.append(
                    PurchaseItem(
                        product=product,
                        quantity=quantity,
                        unit_cost=product.cost_price,
                        subtotal=line_total,
                    )
                )
            subtotal = money(subtotal)
            tax = money(subtotal * TAX_RATE)
            purchase = Purchase(
                folio=purchase_folio(purchase_number),
                supplier=RNG.choice(SUPPLIERS),
                user_id=users[0].id,
                purchase_date=purchase_date,
                subtotal=subtotal,
                tax=tax,
                total=money(subtotal + tax),
                status="recibida",
                items=items,
            )
            db.add(purchase)
            db.flush()
            for item in items:
                db.add(
                    InventoryMovement(
                        product=item.product,
                        warehouse=warehouses[0],
                        movement_type="entrada",
                        quantity=item.quantity,
                        reference=purchase.folio,
                        notes="Entrada por compra",
                        created_by=users[0].id,
                        created_at=purchase_date,
                    )
                )
            purchase_number += 1

        # ------------------------------------------------------------------
        # Cotizaciones
        # ------------------------------------------------------------------
        quote_statuses = ["aceptada", "enviada", "borrador", "rechazada", "vencida", "enviada", "aceptada"]
        for index, quote_status in enumerate(quote_statuses, start=1):
            client = RNG.choice(clients)
            issue_date = now - timedelta(days=RNG.randint(1, 40))
            chosen = RNG.sample(products, k=RNG.randint(1, 3))
            subtotal = Decimal("0.00")
            quote_items: list[QuoteItem] = []
            for product in chosen:
                quantity = RNG.randint(5, 30)
                line_total = money(product.unit_price * quantity)
                subtotal += line_total
                quote_items.append(
                    QuoteItem(
                        product=product,
                        description=product.name,
                        quantity=quantity,
                        unit_price=product.unit_price,
                        subtotal=line_total,
                    )
                )
            subtotal = money(subtotal)
            tax = money(subtotal * TAX_RATE)
            db.add(
                Quote(
                    folio=quote_folio(index),
                    client=client,
                    user=users[0],
                    issue_date=issue_date,
                    valid_until=issue_date.date() + timedelta(days=15),
                    subtotal=subtotal,
                    tax=tax,
                    total=money(subtotal + tax),
                    status=quote_status,
                    notes="Cotización de demostración sujeta a disponibilidad.",
                    items=quote_items,
                )
            )

        # ------------------------------------------------------------------
        # Contactos y bitácora
        # ------------------------------------------------------------------
        for index, (name, business, email, phone, service, message) in enumerate(CONTACT_MESSAGES):
            db.add(
                ContactMessage(
                    name=name,
                    business_name=business,
                    email=email,
                    phone=phone,
                    service_interest=service,
                    budget=RNG.choice(["Menos de $5,000", "$5,000 – $15,000", "Por definir"]),
                    message=message,
                    consent=True,
                    status="nuevo",
                    created_at=now - timedelta(days=index + 1),
                )
            )

        recent_sales = all_sales[-4:]
        for index, sale in enumerate(reversed(recent_sales)):
            db.add(
                ActivityLog(
                    user_id=users[0].id,
                    action="venta",
                    entity="sale",
                    entity_id=sale.id,
                    description=f"Venta {sale.folio} registrada por {sale.client.business_name}",
                    created_at=now - timedelta(hours=index * 5 + 1),
                )
            )
        db.add(
            ActivityLog(
                user_id=users[2].id,
                action="cotizacion",
                entity="quote",
                entity_id=1,
                description="Cotización COT-2026-0001 enviada a Papelería El Lápiz",
                created_at=now - timedelta(hours=2),
            )
        )
        db.add(
            ActivityLog(
                user_id=users[1].id,
                action="inventario",
                entity="inventory_movement",
                entity_id=1,
                description="Entrada de 40 piezas · Café molido 500 g (Almacén central)",
                created_at=now - timedelta(hours=8),
            )
        )
        db.add(
            ActivityLog(
                user_id=users[0].id,
                action="contacto",
                entity="contact_message",
                entity_id=1,
                description="Nueva solicitud de Rosa Jiménez · Presencia web",
                created_at=now - timedelta(hours=11),
            )
        )

        db.commit()
        print("Datos de demostración creados correctamente.")
        print(f"  Clientes: {len(clients)} · Productos: {len(products)} · Ventas: {sale_number - 1}")
        print(f"  Cotizaciones: {len(quote_statuses)} · Compras: {purchase_number - 1}")
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


def main() -> None:
    parser = argparse.ArgumentParser(description="Carga datos de demostración.")
    parser.add_argument(
        "--reset",
        action="store_true",
        help="Elimina y vuelve a crear todas las tablas antes de cargar los datos.",
    )
    args = parser.parse_args()

    if args.reset:
        Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    with SessionLocal() as db:
        if not args.reset and db.scalar(select(Client.id).limit(1)):
            print("La base ya contiene datos. Usa --reset para regenerarlos.")
            return

    seed()


if __name__ == "__main__":
    main()
