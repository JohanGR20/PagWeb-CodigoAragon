from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import or_, select
from sqlalchemy.orm import Session, joinedload

from app.core.database import get_db
from app.core.utils import utcnow
from app.models import (
    ActivityLog,
    Category,
    Inventory,
    InventoryMovement,
    Product,
    Warehouse,
)
from app.schemas import (
    CategoryOut,
    InventoryOut,
    MovementCreate,
    MovementOut,
    ProductOut,
    WarehouseOut,
)

router = APIRouter(tags=["Catálogo e inventario"])


def inventory_status(quantity: int, min_stock: int) -> str:
    if quantity <= 0:
        return "agotado"
    if quantity <= min_stock:
        return "bajo"
    if quantity <= min_stock * 2:
        return "medio"
    return "ok"


def to_inventory_out(item: Inventory) -> InventoryOut:
    product = item.product
    return InventoryOut(
        id=item.id,
        product_id=product.id,
        product_name=product.name,
        sku=product.sku,
        category_name=product.category.name,
        warehouse_id=item.warehouse_id,
        warehouse_name=item.warehouse.name,
        quantity=item.quantity,
        min_stock=item.min_stock,
        unit_price=float(product.unit_price),
        stock_value=float(product.unit_price) * item.quantity,
        status=inventory_status(item.quantity, item.min_stock),
    )


@router.get("/categories", response_model=list[CategoryOut])
def list_categories(db: Session = Depends(get_db)) -> list[Category]:
    return list(db.scalars(select(Category).order_by(Category.name)))


@router.get("/products", response_model=list[ProductOut])
def list_products(
    search: str | None = Query(default=None, max_length=100),
    category_id: int | None = None,
    db: Session = Depends(get_db),
) -> list[ProductOut]:
    stmt = select(Product).where(Product.is_active.is_(True)).order_by(Product.name)
    if search:
        term = f"%{search.strip()}%"
        stmt = stmt.where(or_(Product.name.ilike(term), Product.sku.ilike(term)))
    if category_id:
        stmt = stmt.where(Product.category_id == category_id)

    products = db.scalars(stmt).unique().all()
    return [
        ProductOut(
            id=product.id,
            sku=product.sku,
            name=product.name,
            category_id=product.category_id,
            category_name=product.category.name,
            unit_price=float(product.unit_price),
            cost_price=float(product.cost_price),
            unit=product.unit,
            is_active=product.is_active,
        )
        for product in products
    ]


@router.get("/warehouses", response_model=list[WarehouseOut])
def list_warehouses(db: Session = Depends(get_db)) -> list[Warehouse]:
    return list(db.scalars(select(Warehouse).where(Warehouse.is_active.is_(True)).order_by(Warehouse.name)))


@router.get("/inventory", response_model=list[InventoryOut])
def list_inventory(
    search: str | None = Query(default=None, max_length=100),
    warehouse_id: int | None = None,
    low_stock: bool = False,
    db: Session = Depends(get_db),
) -> list[InventoryOut]:
    stmt = (
        select(Inventory)
        .join(Inventory.product)
        .options(
            joinedload(Inventory.product).joinedload(Product.category),
            joinedload(Inventory.warehouse),
        )
        .order_by(Product.name.asc())
    )
    if search:
        term = f"%{search.strip()}%"
        stmt = stmt.where(or_(Product.name.ilike(term), Product.sku.ilike(term)))
    if warehouse_id:
        stmt = stmt.where(Inventory.warehouse_id == warehouse_id)
    if low_stock:
        stmt = stmt.where(Inventory.quantity <= Inventory.min_stock)

    return [to_inventory_out(item) for item in db.scalars(stmt).unique().all()]


@router.get("/movements", response_model=list[MovementOut])
def list_movements(
    limit: int = Query(default=25, ge=1, le=200),
    db: Session = Depends(get_db),
) -> list[MovementOut]:
    stmt = (
        select(InventoryMovement)
        .options(
            joinedload(InventoryMovement.product),
            joinedload(InventoryMovement.warehouse),
        )
        .order_by(InventoryMovement.created_at.desc())
        .limit(limit)
    )
    movements = db.scalars(stmt).unique().all()
    return [
        MovementOut(
            id=movement.id,
            product_name=movement.product.name,
            warehouse_name=movement.warehouse.name,
            movement_type=movement.movement_type,
            quantity=movement.quantity,
            reference=movement.reference,
            notes=movement.notes,
            created_at=movement.created_at,
        )
        for movement in movements
    ]


@router.post("/inventory/movements", response_model=MovementOut, status_code=status.HTTP_201_CREATED)
def create_movement(payload: MovementCreate, db: Session = Depends(get_db)) -> MovementOut:
    product = db.get(Product, payload.product_id)
    warehouse = db.get(Warehouse, payload.warehouse_id)
    if not product or not warehouse:
        raise HTTPException(status_code=404, detail="Producto o almacén no encontrado.")

    inventory = db.scalar(
        select(Inventory)
        .where(
            Inventory.product_id == payload.product_id,
            Inventory.warehouse_id == payload.warehouse_id,
        )
        .with_for_update()
    )
    if inventory is None:
        inventory = Inventory(
            product_id=payload.product_id,
            warehouse_id=payload.warehouse_id,
            quantity=0,
            min_stock=5,
        )
        db.add(inventory)
        db.flush()

    if payload.movement_type == "entrada":
        inventory.quantity += payload.quantity
    elif payload.movement_type == "salida":
        if inventory.quantity < payload.quantity:
            raise HTTPException(
                status_code=400,
                detail=f"Stock insuficiente. Disponible: {inventory.quantity} unidades.",
            )
        inventory.quantity -= payload.quantity
    else:  # ajuste por conteo físico
        inventory.quantity = payload.quantity

    inventory.updated_at = utcnow()

    movement = InventoryMovement(
        product_id=payload.product_id,
        warehouse_id=payload.warehouse_id,
        movement_type=payload.movement_type,
        quantity=payload.quantity,
        reference=f"MOV-{utcnow():%Y%m%d%H%M%S}",
        notes=payload.notes,
    )
    db.add(movement)
    db.flush()
    db.add(
        ActivityLog(
            action="inventario",
            entity="inventory_movement",
            entity_id=movement.id,
            description=(
                f"{payload.movement_type.capitalize()} de {payload.quantity} · "
                f"{product.name} ({warehouse.name})"
            ),
        )
    )
    db.commit()
    db.refresh(movement)

    return MovementOut(
        id=movement.id,
        product_name=product.name,
        warehouse_name=warehouse.name,
        movement_type=movement.movement_type,
        quantity=movement.quantity,
        reference=movement.reference,
        notes=movement.notes,
        created_at=movement.created_at,
    )
