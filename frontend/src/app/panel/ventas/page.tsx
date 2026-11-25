"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Banknote,
  CreditCard,
  ReceiptText,
  Search,
  TrendingUp,
  Wallet,
} from "lucide-react";

import { KpiCard } from "@/components/panel/kpi-card";
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
import { formatCurrency, formatDate, formatNumber } from "@/lib/utils";

const paymentLabels: Record<string, string> = {
  efectivo: "Efectivo",
  transferencia: "Transferencia",
  tarjeta: "Tarjeta",
  credito: "Crédito",
};

export default function SalesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("todas");

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["sales"],
    queryFn: api.sales,
  });

  const sales = data ?? [];

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return sales.filter((sale) => {
      if (
        term &&
        !`${sale.folio} ${sale.client_name} ${sale.payment_method}`
          .toLowerCase()
          .includes(term)
      ) {
        return false;
      }
      if (statusFilter !== "todas" && sale.status !== statusFilter) return false;
      return true;
    });
  }, [sales, search, statusFilter]);

  const stats = useMemo(() => {
    const valid = sales.filter((sale) => sale.status !== "cancelada");
    const total = valid.reduce((sum, sale) => sum + sale.total, 0);
    const pending = sales.filter((sale) => sale.status === "pendiente");
    const pendingTotal = pending.reduce((sum, sale) => sum + sale.total, 0);
    const average = valid.length > 0 ? total / valid.length : 0;
    const methods = new Map<string, { count: number; total: number }>();
    for (const sale of valid) {
      const current = methods.get(sale.payment_method) ?? { count: 0, total: 0 };
      methods.set(sale.payment_method, {
        count: current.count + 1,
        total: current.total + sale.total,
      });
    }
    return {
      total,
      count: valid.length,
      average,
      pendingCount: pending.length,
      pendingTotal,
      methods: [...methods.entries()].sort((a, b) => b[1].total - a[1].total),
    };
  }, [sales]);

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
          <Skeleton className="h-[560px] rounded-2xl" />
        </div>
      )}

      {isError && (
        <DataError message={getErrorMessage(error)} onRetry={() => void refetch()} />
      )}

      {!isLoading && !isError && (
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <KpiCard
              label="Ingresos registrados"
              value={formatCurrency(stats.total)}
              icon={TrendingUp}
              hint="ventas no canceladas"
              accent="navy"
            />
            <KpiCard
              label="Tickets"
              value={formatNumber(stats.count)}
              icon={ReceiptText}
              hint={`${sales.length} ventas en total`}
              accent="aqua"
            />
            <KpiCard
              label="Ticket promedio"
              value={formatCurrency(stats.average)}
              icon={Banknote}
              hint="por venta válida"
              accent="gold"
            />
            <KpiCard
              label="Por cobrar"
              value={formatCurrency(stats.pendingTotal)}
              icon={Wallet}
              hint={`${stats.pendingCount} ventas pendientes`}
              accent="green"
            />
          </div>

          <div className="grid gap-5 2xl:grid-cols-[1fr_320px]">
            <PanelCard
              title="Historial de ventas"
              description={`${filtered.length} de ${sales.length} ventas`}
            >
              <div className="flex flex-col gap-3 border-b border-navy-950/[0.06] px-5 py-4 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-navy-300" />
                  <Input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Buscar por folio, cliente o método de pago…"
                    className="h-10 pl-9"
                    aria-label="Buscar ventas"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-10 w-full sm:w-[160px]" aria-label="Filtrar ventas">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas</SelectItem>
                    <SelectItem value="pagada">Pagadas</SelectItem>
                    <SelectItem value="pendiente">Pendientes</SelectItem>
                    <SelectItem value="cancelada">Canceladas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {filtered.length === 0 ? (
                <div className="p-5">
                  <EmptyState message="No encontramos ventas con esos criterios." />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Folio</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead className="hidden md:table-cell">Fecha</TableHead>
                      <TableHead className="hidden text-center sm:table-cell">
                        Piezas
                      </TableHead>
                      <TableHead className="hidden text-right lg:table-cell">
                        Impuestos
                      </TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="hidden text-right md:table-cell">Pago</TableHead>
                      <TableHead className="text-right">Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((sale) => (
                      <TableRow key={sale.id}>
                        <TableCell className="whitespace-nowrap font-mono text-[10px] font-semibold text-navy-700">
                          {sale.folio}
                        </TableCell>
                        <TableCell className="max-w-[180px] truncate text-[11px] font-medium text-navy-950">
                          {sale.client_name}
                        </TableCell>
                        <TableCell className="hidden whitespace-nowrap text-[10px] text-navy-500 md:table-cell">
                          {formatDate(sale.sale_date)}
                        </TableCell>
                        <TableCell className="hidden text-center text-[11px] text-navy-600 sm:table-cell">
                          {sale.items_count}
                        </TableCell>
                        <TableCell className="hidden text-right text-[11px] text-navy-500 lg:table-cell">
                          {formatCurrency(sale.tax)}
                        </TableCell>
                        <TableCell className="text-right text-[11px] font-bold text-navy-950">
                          {formatCurrency(sale.total)}
                        </TableCell>
                        <TableCell className="hidden text-right text-[10px] capitalize text-navy-500 md:table-cell">
                          {paymentLabels[sale.payment_method] ?? sale.payment_method}
                        </TableCell>
                        <TableCell className="text-right">
                          <StatusBadge status={sale.status} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </PanelCard>

            <div className="space-y-5">
              <PanelCard title="Métodos de pago" description="Participación por monto">
                <div className="space-y-4 p-5">
                  {stats.methods.map(([method, info]) => {
                    const share = stats.total > 0 ? (info.total / stats.total) * 100 : 0;
                    return (
                      <div key={method}>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="inline-flex items-center gap-1.5 font-semibold text-navy-800">
                            <CreditCard className="size-3.5 text-navy-400" />
                            {paymentLabels[method] ?? method}
                          </span>
                          <span className="font-bold text-navy-950">
                            {formatCurrency(info.total)}
                          </span>
                        </div>
                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-navy-950/[0.06]">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-aqua-500 to-gold-400"
                            style={{ width: `${Math.max(share, 3)}%` }}
                          />
                        </div>
                        <p className="mt-1 text-[9px] text-navy-400">
                          {info.count} ventas · {share.toFixed(1)}%
                        </p>
                      </div>
                    );
                  })}
                </div>
              </PanelCard>

              <PanelCard title="¿Facturas o remisiones?" description="Cobranza y documentos">
                <div className="p-5">
                  <p className="text-[11px] leading-relaxed text-muted-foreground">
                    Cada venta puede generar su factura y registrar pagos parciales. Revisa
                    el estado de cuenta en el módulo de facturación.
                  </p>
                  <Button asChild variant="outline" size="sm" className="mt-4 w-full">
                    <a href="/panel/facturacion">Ver facturación</a>
                  </Button>
                </div>
              </PanelCard>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
