"""Utilidades compartidas."""

from datetime import datetime, timezone
from decimal import Decimal, ROUND_HALF_UP


def utcnow() -> datetime:
    """UTC sin tzinfo para mantener compatibilidad entre PostgreSQL y SQLite."""
    return datetime.now(timezone.utc).replace(tzinfo=None)


def money(value: Decimal | float | int | None) -> Decimal:
    if value is None:
        return Decimal("0.00")
    return Decimal(str(value)).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)


def percent_change(current: Decimal | float, previous: Decimal | float) -> float | None:
    previous_value = float(previous or 0)
    if previous_value == 0:
        return None
    return round(((float(current) - previous_value) / previous_value) * 100, 1)
