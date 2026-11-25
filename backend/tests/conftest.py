import os
import tempfile
from datetime import date, datetime, timedelta
from decimal import Decimal
from pathlib import Path

import pytest

TEST_DB = Path(tempfile.gettempdir()) / "codigo_aragon_pytest.db"
if TEST_DB.exists():
    TEST_DB.unlink()

os.environ["DATABASE_URL"] = f"sqlite:///{TEST_DB.as_posix()}"
os.environ["AUTO_CREATE_TABLES"] = "false"
os.environ["ENVIRONMENT"] = "test"

from fastapi.testclient import TestClient  # noqa: E402

from app.core.database import Base, SessionLocal, engine  # noqa: E402
from app.main import app  # noqa: E402
from app.models import (  # noqa: E402
    ActivityLog,
    Category,
    Client,
    ContactMessage,
    Inventory,
    Invoice,
    Payment,
    Product,
    Quote,
    QuoteItem,
    Sale,
    SaleItem,
    User,
    Warehouse,
)


@pytest.fixture(scope="session", autouse=True)
def database():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    now = datetime.now()
    user = User(full_name="Admin Demo", email="admin@codigoaragon.test", role="admin")
    client = Client(
        name="Laura Méndez",
        business_name="Papelería El Lápiz",
        email="laura@example.test",
        phone="5512345678",
    )
    category = Category(name="Abarrotes", description="Demo")
    product = Product(
        sku="ABR-001",
        name="Café molido 500 g",
        category=category,
        unit_price=Decimal("50.00"),
        cost_price=Decimal("30.00"),
    )
    warehouse = Warehouse(name="Almacén central", location="CDMX")
    db.add_all([user, client, category, product, warehouse])
    db.flush()

    db.add(Inventory(product=product, warehouse=warehouse, quantity=10, min_stock=5))

    sale = Sale(
        folio="VTA-TEST-0001",
        client=client,
        user=user,
        sale_date=now,
        subtotal=Decimal("100.00"),
        tax=Decimal("16.00"),
        total=Decimal("116.00"),
        status="pagada",
        payment_method="efectivo",
        items=[
            SaleItem(
                product=product,
                quantity=2,
                unit_price=Decimal("50.00"),
                subtotal=Decimal("100.00"),
            )
        ],
    )
    db.add(sale)
    db.flush()
    invoice = Invoice(
        folio="FAC-TEST-0001",
        sale=sale,
        client=client,
        issue_date=date.today(),
        due_date=date.today() + timedelta(days=15),
        subtotal=Decimal("100.00"),
        tax=Decimal("16.00"),
        total=Decimal("116.00"),
        status="pagada",
    )
    db.add(invoice)
    db.flush()
    db.add(
        Payment(
            invoice=invoice,
            amount=Decimal("116.00"),
            method="efectivo",
            reference="PAGO-TEST",
        )
    )

    quote = Quote(
        folio="COT-TEST-0001",
        client=client,
        user=user,
        issue_date=now,
        valid_until=date.today() + timedelta(days=10),
        subtotal=Decimal("100.00"),
        tax=Decimal("16.00"),
        total=Decimal("116.00"),
        status="enviada",
        items=[
            QuoteItem(
                product=product,
                description="Café molido 500 g",
                quantity=2,
                unit_price=Decimal("50.00"),
                subtotal=Decimal("100.00"),
            )
        ],
    )
    db.add(quote)
    db.add(
        ActivityLog(
            user_id=user.id,
            action="venta",
            entity="sale",
            entity_id=sale.id,
            description="Venta de prueba registrada",
        )
    )
    db.add(
        ContactMessage(
            name="Rosa",
            business_name="Papelería Rosita",
            email="rosa@example.test",
            phone="5598765432",
            service_interest="Presencia web",
            message="Quiero información sobre un catálogo.",
            consent=True,
        )
    )
    db.commit()
    db.close()

    yield

    Base.metadata.drop_all(bind=engine)
    engine.dispose()
    if TEST_DB.exists():
        TEST_DB.unlink()


@pytest.fixture()
def client():
    with TestClient(app) as test_client:
        yield test_client
