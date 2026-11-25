"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Boxes,
  CircleDollarSign,
  PackageSearch,
  Search,
  Scale,
  Warehouse,
} from "lucide-react";

import { KpiCard } from "@/components/panel/kpi-card";
import { MovementDialog } from "@/components/panel/movement-dialog";
import { DataError, DemoBanner, EmptyState, PanelCard } from "@/components/panel/shared";
import { StatusBadge } from "@/components/panel/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api, getErrorMessage } from "@/lib/api";
import { cn, formatCurrency, formatDateTime, formatNumber } from "@/lib/utils";

const statusFilters = [
  { value: "todos", label: "Todos" },
  { value: "bajo", label: "Stock bajo" },
  { value: "agotado", label: "Agotados" },
  { value: "ok", label: "Disponibles" },
];

const movementIcons = {
  entrada: ArrowDownToLine,
  salida: ArrowUpFromLine,
  ajuste: Scale,
} as const;

const movementStyles = {
  entrada: "bg-emerald-50 text-emerald-600",
  salida: "bg-rose-50 text-rose-600",
  ajuste: "bg-amber-50 text-amber-600",
} as const;

export default function InventoryPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [warehouseFilter, setWarehouseFilter] = useState("todos");

  const inventoryQuery = useQuery({ queryKey: ["inventory"], queryFn: api.inventory });
  const warehousesQuery = useQuery({ queryKey: ["warehouses"], queryFn: api.warehouses });
  const productsQuery = useQuery({ queryKey: ["products"], queryFn: api.products });
  const movementsQuery = useQuery({
    queryKey: ["movements", 12],
    queryFn: () => api.movements(12),
  });

  const items = inventoryQuery.data ?? [];
  const warehouses = warehousesQuery.data ?? [];
  const products = productsQuery.data ?? [];
  const movements = movementsQuery.data ?? [];

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return items.filter((item) => {
      if (term && !`${item.product_name} ${item.sku}`.toLowerCase().includes(term)) {
        return false;
      }
      if (statusFilter !== "todos" && item.status !== statusFilter) {
        return false;
      }
      if (warehouseFilter !== "todos" && String(item.warehouse_id) !== warehouseFilter) {
        return false;
      }
      return true;
    });
  }, [items, search, statusFilter, warehouseFilter]);

  const totals = useMemo(() => {
    const stockValue = items.reduce((sum, item) => sum + item.stock_value, 0);
    const units = items.reduce((sum, item) => sum + item.quantity, 0);
    const low = items.filter((item) => item.status === "bajo" || item.status === "agotado").length;
    return { stockValue, units, low };
  }, [items]);

  const isLoading = inventoryQuery.isLoading;

  return (
    <>
      <DemoBanner />

      {isLoading && (
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-[132px] rounded-2xl" />
            ))}
          </div>
          <Skeleton className="h-[520px] rounded-2xl" />
        </div>
      )}

      {inventoryQuery.isError && (
        <DataError
          message={getErrorMessage(inventoryQuery.error)}
          onRetry={() => void inventoryQuery.refetch()}
        />
      )}

      {!isLoading && !inventoryQuery.isError && (
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <KpiCard
              label="Valor del inventario"
              value={formatCurrency(totals.stockValue)}
              icon={CircleDollarSign}
              hint="a precio de venta"
              accent="navy"
            />
            <KpiCard
              label="Unidades en stock"
              value={formatNumber(totals.units)}
              icon={Boxes}
              hint={`${items.length} registros de inventario`}
              accent="aqua"
            />
            <KpiCard
              label="Alertas de stock"
              value={formatNumber(totals.low)}
              icon={PackageSearch}
              hint="productos en o bajo el mínimo"
              accent="gold"
            />
            <KpiCard
              label="Almacenes activos"
              value={formatNumber(warehouses.length)}
              icon={Warehouse}
              hint={warehouses.map((warehouse) => warehouse.name).join(" · ") || "Sin almacenes"}
              accent="green"
            />
          </div>

          <PanelCard
            title="Existencias por producto"
            description={`${filtered.length} de ${items.length} registros`}
            action={
              <MovementDialog products={products} warehouses={warehouses} />
            }
          >
            <div className="flex flex-col gap-3 border-b border-navy-950/[0.06] px-5 py-4 lg:flex-row lg:items-center">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-navy-300" />
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Buscar por producto o SKU…"
                  className="h-10 pl-9"
                  aria-label="Buscar en inventario"
                />
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-10 w-full sm:w-[165px]" aria-label="Filtrar por estado">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusFilters.map((filter) => (
                      <SelectItem key={filter.value} value={filter.value}>
                        {filter.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={warehouseFilter} onValueChange={setWarehouseFilter}>
                  <SelectTrigger className="h-10 w-full sm:w-[180px]" aria-label="Filtrar por almacén">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los almacenes</SelectItem>
                    {warehouses.map((warehouse) => (
                      <SelectItem key={warehouse.id} value={String(warehouse.id)}>
                        {warehouse.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="p-5">
                <EmptyState message="No hay registros que coincidan con los filtros seleccionados." />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead className="hidden md:table-cell">Categoría</TableHead>
                    <TableHead className="hidden sm:table-cell">Almacén</TableHead>
                    <TableHead className="text-center">Existencias</TableHead>
                    <TableHead className="hidden text-right lg:table-cell">Mínimo</TableHead>
                    <TableHead className="hidden text-right sm:table-cell">Valor</TableHead>
                    <TableHead className="text-right">Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <p className="text-xs font-semibold text-navy-950">{item.product_name}</p>
                        <p className="mt-0.5 font-mono text-[9px] text-navy-400">{item.sku}</p>
                      </TableCell>
                      <TableCell className="hidden text-[11px] text-navy-600 md:table-cell">
                        {item.category_name}
                      </TableCell>
                      <TableCell className="hidden text-[11px] text-navy-600 sm:table-cell">
                        {item.warehouse_name}
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-xs font-bold text-navy-950">{item.quantity}</span>
                        <span className="ml-1 text-[10px] text-navy-400">
                          / {item.min_stock} mín.
                        </span>
                      </TableCell>
                      <TableCell className="hidden text-right text-[11px] text-navy-500 lg:table-cell">
                        {item.min_stock}
                      </TableCell>
                      <TableCell className="hidden text-right text-[11px] font-semibold text-navy-800 sm:table-cell">
                        {formatCurrency(item.stock_value)}
                      </TableCell>
                      <TableCell className="text-right">
                        <StatusBadge status={item.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </PanelCard>

          <div className="grid gap-5 xl:grid-cols-2">
            <PanelCard
              title="Movimientos recientes"
              description="Entradas, salidas y ajustes de los últimos días"
              action={
                <span className="text-[10px] font-semibold text-navy-400">
                  {movements.length} registros
                </span>
              }
            >
              {movements.length === 0 ? (
                <div className="p-5">
                  <EmptyState message="Todavía no hay movimientos registrados." />
                </div>
              ) : (
                <ul className="divide-y divide-navy-950/[0.05]">
                  {movements.map((movement) => {
                    const Icon =
                      movementIcons[movement.movement_type] ?? movementIcons.ajuste;
                    return (
                      <li key={movement.id} className="flex items-start gap-3 px-5 py-3.5">
                        <span
                          className={cn(
                            "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg",
                            movementStyles[movement.movement_type] ?? movementStyles.ajuste,
                          )}
                        >
                          <Icon className="size-3.5" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] font-semibold text-navy-950">
                            {movement.product_name}
                            <span className="ml-1.5 font-bold text-navy-500">
                              {movement.movement_type === "salida" ? "−" : "+"}
                              {movement.quantity}
                            </span>
                          </p>
                          <p className="mt-0.5 text-[10px] text-navy-400">
                            {movement.warehouse_name} · {formatDateTime(movement.created_at)}
                          </p>
                        </div>
                        {movement.reference && (
                          <span className="hidden font-mono text-[9px] text-navy-300 sm:block">
                            {movement.reference}
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </PanelCard>

            <PanelCard
              title="Almacenes"
              description="Ubicaciones activas de la distribuidora"
            >
              <div className="divide-y divide-navy-950/[0.05]">
                {warehouses.map((warehouse) => {
                  const count = items.filter(
                    (item) => item.warehouse_id === warehouse.id,
                  ).length;
                  const value = items
                    .filter((item) => item.warehouse_id === warehouse.id)
                    .reduce((sum, item) => sum + item.stock_value, 0);
                  return (
                    <div
                      key={warehouse.id}
                      className="flex items-center gap-3 px-5 py-4"
                    >
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-navy-50 text-navy-600">
                        <Warehouse className="size-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-navy-950">{warehouse.name}</p>
                        <p className="mt-0.5 text-[10px] text-navy-400">
                          {warehouse.location ?? "Sin dirección"} · {count} productos
                        </p>
                      </div>
                      <span className="text-[11px] font-bold text-navy-800">
                        {formatCurrency(value)}
                      </span>
                    </div>
                  );
                })}
                <div className="px-5 py-4">
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <a href="/#contacto">¿Necesitas otro almacén? Hablemos</a>
                  </Button>
                </div>
              </div>
            </PanelCard>
          </div>
        </div>
      )}
    </>
  );
}
