from datetime import date, timedelta

from fastapi.testclient import TestClient


def test_health(client: TestClient) -> None:
    response = client.get("/api/health")
    assert response.status_code == 200
    payload = response.json()
    assert payload["status"] == "ok"
    assert payload["environment"] == "test"


def test_contact_requires_consent(client: TestClient) -> None:
    response = client.post(
        "/api/contact",
        json={
            "name": "Cliente Prueba",
            "email": "cliente@example.com",
            "phone": "5512345678",
            "service_interest": "Presencia web",
            "message": "Necesito una página para mi negocio.",
            "consent": False,
        },
    )
    assert response.status_code == 422


def test_contact_is_stored(client: TestClient) -> None:
    response = client.post(
        "/api/contact",
        json={
            "name": "Cliente Prueba",
            "business_name": "Negocio Prueba",
            "email": "cliente@example.com",
            "phone": "5512345678",
            "service_interest": "Automatización de ventas",
            "budget": "$5,000 – $15,000",
            "message": "Necesito control de inventario y ventas.",
            "consent": True,
        },
    )
    assert response.status_code == 201
    payload = response.json()
    assert payload["id"] > 0
    assert "24 horas" in payload["message"]


def test_clients_and_duplicate_email(client: TestClient) -> None:
    listing = client.get("/api/clients")
    assert listing.status_code == 200
    assert any(item["business_name"] == "Papelería El Lápiz" for item in listing.json())

    payload = {
        "name": "Nuevo Contacto",
        "business_name": "Negocio Nuevo",
        "email": "nuevo@example.com",
        "phone": "5511223344",
        "address": "CDMX",
    }
    created = client.post("/api/clients", json=payload)
    assert created.status_code == 201
    assert created.json()["business_name"] == "Negocio Nuevo"

    duplicate = client.post(
        "/api/clients",
        json={**payload, "business_name": "Sucursal Nueva"},
    )
    assert duplicate.status_code == 409


def test_inventory_and_products(client: TestClient) -> None:
    products = client.get("/api/products")
    assert products.status_code == 200
    assert products.json()[0]["category_name"] == "Abarrotes"

    inventory = client.get("/api/inventory")
    assert inventory.status_code == 200
    assert inventory.json()[0]["quantity"] == 10
    assert inventory.json()[0]["status"] in {"ok", "medio", "bajo", "agotado"}


def test_inventory_movement_updates_stock(client: TestClient) -> None:
    inventory = client.get("/api/inventory").json()[0]
    response = client.post(
        "/api/inventory/movements",
        json={
            "product_id": inventory["product_id"],
            "warehouse_id": inventory["warehouse_id"],
            "movement_type": "entrada",
            "quantity": 5,
            "notes": "Reposición de prueba",
        },
    )
    assert response.status_code == 201
    updated = client.get("/api/inventory").json()[0]
    assert updated["quantity"] == inventory["quantity"] + 5


def test_quote_totals_are_calculated(client: TestClient) -> None:
    clients = client.get("/api/clients").json()
    products = client.get("/api/products").json()
    payload = {
        "client_id": clients[0]["id"],
        "valid_until": (date.today() + timedelta(days=15)).isoformat(),
        "notes": "Cotización de prueba",
        "tax_rate": 0.16,
        "items": [
            {
                "product_id": products[0]["id"],
                "description": "Café molido 500 g",
                "quantity": 3,
                "unit_price": 100,
            }
        ],
    }
    response = client.post("/api/quotes", json=payload)
    assert response.status_code == 201
    quote = response.json()
    assert quote["subtotal"] == 300.0
    assert quote["tax"] == 48.0
    assert quote["total"] == 348.0
    assert quote["folio"].startswith("COT-")
    assert quote["items"][0]["subtotal"] == 300.0


def test_dashboard_summary(client: TestClient) -> None:
    response = client.get("/api/dashboard/summary")
    assert response.status_code == 200
    data = response.json()
    assert len(data["sales_series"]) == 6
    assert data["clients_count"] >= 1
    assert data["active_products"] >= 1
    assert isinstance(data["low_stock"], list)
    assert isinstance(data["recent_activity"], list)
    assert data["sales_month"] >= 1


def test_sales_and_invoices(client: TestClient) -> None:
    sales = client.get("/api/sales")
    assert sales.status_code == 200
    assert sales.json()[0]["folio"].startswith("VTA-")

    invoices = client.get("/api/invoices")
    assert invoices.status_code == 200
    assert invoices.json()[0]["paid_amount"] >= 0
