"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  BadgeDollarSign,
  CircleDollarSign,
  Clock3,
  ReceiptText,
  Search,
  Wallet,
} from "lucide-react";

import { KpiCard } from "@/components/panel/kpi-card";
import { DataError, DemoBanner, EmptyState, PanelCard } from "@/components/panel/shared";
import { StatusBadge } from "@/components/panel/status-badge";
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
import { api, getErrorMessage, type Invoice } from "@/lib/api";
import { cn, formatCurrency, formatDate, formatNumber, parseDate } from "@/lib/utils";

function displayStatus(invoice: Invoice) {
  if (invoice.status === "pagada") return "pagada";
  const due = parseDate(invoice.due_date).getTime();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (due < today.getTime()) return "vencida";
  if (invoice.paid_amount > 0) return "pendiente";
  return "emitida";
}

export default function BillingPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("todas");

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["invoices"],
    queryFn: api.invoices,
  });

  const invoices = data ?? [];

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return invoices.filter((invoice) => {
      if (
        term &&
        !`${invoice.folio} ${invoice.client_name} ${invoice.sale_folio ?? ""}`
          .toLowerCase()
          .includes(term)
      ) {
        return false;
      }
      if (statusFilter !== "todas" && displayStatus(invoice) !== statusFilter) return false;
      return true;
    });
  }, [invoices, search, statusFilter]);

  const stats = useMemo(() => {
    const total = invoices.reduce((sum, invoice) => sum + invoice.total, 0);
    const paid = invoices.reduce((sum, invoice) => sum + invoice.paid_amount, 0);
    const balance = total - paid;
    const overdue = invoices.filter((invoice) => displayStatus(invoice) === "vencida");
    const overdueTotal = overdue.reduce(
      (sum, invoice) => sum + (invoice.total - invoice.paid_amount),
      0,
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const buckets = [
      { label: "Por vencer", value: 0, count: 0, tone: "bg-emerald-500" },
      { label: "1 – 30 días", value: 0, count: 0, tone: "bg-amber-500" },
      { label: "31 – 60 días", value: 0, count: 0, tone: "bg-orange-500" },
      { label: "Más de 60 días", value: 0, count: 0, tone: "bg-rose-500" },
    ];
    for (const invoice of invoices) {
      const pending = invoice.total - invoice.paid_amount;
      if (pending <= 0.009) continue;
      const due = parseDate(invoice.due_date).getTime();
      const daysLate = Math.floor((today.getTime() - due) / 86_400_000);
      const index = daysLate <= 0 ? 0 : daysLate <= 30 ? 1 : daysLate <= 60 ? 2 : 3;
      buckets[index].value += pending;
      buckets[index].count += 1;
    }

    return { total, paid, balance, overdueCount: overdue.length, overdueTotal, buckets };
  }, [invoices]);

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
          <Skeleton className="h-[540px] rounded-2xl" />
        </div>
      )}

      {isError && <DataError message={getErrorMessage(error)} onRetry={() => void refetch()} />}

      {!isLoading && !isError && (
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <KpiCard
              label="Facturado"
              value={formatCurrency(stats.total)}
              icon={ReceiptText}
              hint={`${invoices.length} facturas`}
              accent="navy"
            />
            <KpiCard
              label="Cobrado"
              value={formatCurrency(stats.paid)}
              icon={BadgeDollarSign}
              hint={`${stats.total > 0 ? ((stats.paid / stats.total) * 100).toFixed(0) : 0}% del total`}
              accent="green"
            />
            <KpiCard
              label="Saldo pendiente"
              value={formatCurrency(stats.balance)}
              icon={Wallet}
              hint="cuentas por cobrar"
              accent="aqua"
            />
            <KpiCard
              label="Facturas vencidas"
              value={formatNumber(stats.overdueCount)}
              icon={Clock3}
              hint={formatCurrency(stats.overdueTotal)}
              accent="gold"
            />
          </div>

          <div className="grid gap-5 2xl:grid-cols-[1fr_320px]">
            <PanelCard
              title="Facturas y pagos"
              description={`${filtered.length} de ${invoices.length} documentos`}
            >
              <div className="flex flex-col gap-3 border-b border-navy-950/[0.06] px-5 py-4 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-navy-300" />
                  <Input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Buscar por folio, cliente o venta…"
                    className="h-10 pl-9"
                    aria-label="Buscar facturas"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-10 w-full sm:w-[160px]" aria-label="Filtrar facturas">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas</SelectItem>
                    <SelectItem value="pagada">Pagadas</SelectItem>
                    <SelectItem value="emitida">Emitidas</SelectItem>
                    <SelectItem value="pendiente">Con pago parcial</SelectItem>
                    <SelectItem value="vencida">Vencidas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {filtered.length === 0 ? (
                <div className="p-5">
                  <EmptyState message="No hay facturas que coincidan con los filtros." />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Factura</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead className="hidden lg:table-cell">Venta</TableHead>
                      <TableHead className="hidden md:table-cell">Emisión</TableHead>
                      <TableHead className="hidden sm:table-cell">Vence</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="hidden text-right md:table-cell">Pagado</TableHead>
                      <TableHead className="text-right">Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((invoice) => {
                      const status = displayStatus(invoice);
                      const balance = invoice.total - invoice.paid_amount;
                      const ratio =
                        invoice.total > 0
                          ? Math.min(100, (invoice.paid_amount / invoice.total) * 100)
                          : 0;
                      return (
                        <TableRow key={invoice.id}>
                          <TableCell>
                            <p className="whitespace-nowrap font-mono text-[10px] font-semibold text-navy-700">
                              {invoice.folio}
                            </p>
                            <div className="mt-1 h-1 w-16 overflow-hidden rounded-full bg-navy-950/[0.06]">
                              <div
                                className={cn(
                                  "h-full rounded-full",
                                  status === "pagada" ? "bg-emerald-500" : "bg-gold-400",
                                )}
                                style={{ width: `${ratio}%` }}
                              />
                            </div>
                          </TableCell>
                          <TableCell className="max-w-[160px] truncate text-[11px] font-medium text-navy-950">
                            {invoice.client_name}
                          </TableCell>
                          <TableCell className="hidden font-mono text-[9px] text-navy-400 lg:table-cell">
                            {invoice.sale_folio ?? "—"}
                          </TableCell>
                          <TableCell className="hidden whitespace-nowrap text-[10px] text-navy-500 md:table-cell">
                            {formatDate(invoice.issue_date)}
                          </TableCell>
                          <TableCell className="hidden whitespace-nowrap text-[10px] text-navy-500 sm:table-cell">
                            {formatDate(invoice.due_date)}
                          </TableCell>
                          <TableCell className="text-right text-[11px] font-bold text-navy-950">
                            {formatCurrency(invoice.total)}
                          </TableCell>
                          <TableCell className="hidden text-right md:table-cell">
                            <p className="text-[11px] font-semibold text-navy-700">
                              {formatCurrency(invoice.paid_amount)}
                            </p>
                            {balance > 0.009 && (
                              <p className="text-[9px] text-navy-400">
                                Saldo {formatCurrency(balance)}
                              </p>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <StatusBadge status={status} />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </PanelCard>

            <div className="space-y-5">
              <PanelCard title="Cobranza" description="Avance sobre lo facturado">
                <div className="p-5">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-navy-400">
                        Cobrado
                      </p>
                      <p className="mt-1 font-display text-2xl font-semibold text-navy-950">
                        {formatCurrency(stats.paid)}
                      </p>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700">
                      {stats.total > 0 ? ((stats.paid / stats.total) * 100).toFixed(0) : 0}%
                    </span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-navy-950/[0.06]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-aqua-400"
                      style={{
                        width: `${stats.total > 0 ? (stats.paid / stats.total) * 100 : 0}%`,
                      }}
                    />
                  </div>
                  <div className="mt-4 flex items-center justify-between rounded-xl bg-cream/60 px-3 py-2.5 text-[11px]">
                    <span className="inline-flex items-center gap-1.5 text-navy-500">
                      <CircleDollarSign className="size-3.5" />
                      Saldo
                    </span>
                    <span className="font-bold text-navy-950">
                      {formatCurrency(stats.balance)}
                    </span>
                  </div>
                </div>
              </PanelCard>

              <PanelCard title="Antigüedad de saldos" description="Cuentas por cobrar">
                <div className="space-y-3.5 p-5">
                  {stats.buckets.map((bucket) => {
                    const max = Math.max(...stats.buckets.map((item) => item.value), 1);
                    return (
                      <div key={bucket.label}>
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="font-semibold text-navy-700">{bucket.label}</span>
                          <span className="font-bold text-navy-950">
                            {formatCurrency(bucket.value)}
                          </span>
                        </div>
                        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-navy-950/[0.06]">
                          <div
                            className={cn("h-full rounded-full", bucket.tone)}
                            style={{ width: `${Math.max((bucket.value / max) * 100, 2)}%` }}
                          />
                        </div>
                        <p className="mt-1 text-[9px] text-navy-400">
                          {bucket.count} facturas
                        </p>
                      </div>
                    );
                  })}
                </div>
              </PanelCard>
            </div>
          </div>

          <p className="px-1 text-[10px] leading-relaxed text-navy-400">
            Los comprobantes fiscales de esta demostración son ficticios y no tienen validez
            ante el SAT. En un proyecto real, la facturación se integra con un PAC autorizado.
          </p>
        </div>
      )}
    </>
  );
}
