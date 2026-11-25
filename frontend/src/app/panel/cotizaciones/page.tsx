"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, FileCheck2, FileText, Search, Target, Wallet } from "lucide-react";

import { KpiCard } from "@/components/panel/kpi-card";
import { QuoteDialog } from "@/components/panel/quote-dialog";
import { DataError, DemoBanner, EmptyState, PanelCard } from "@/components/panel/shared";
import { StatusBadge } from "@/components/panel/status-badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { api, getErrorMessage, type Quote } from "@/lib/api";
import { formatCurrency, formatDate, formatNumber } from "@/lib/utils";

const statusFilters = [
  { value: "todas", label: "Todas" },
  { value: "enviada", label: "Enviadas" },
  { value: "aceptada", label: "Aceptadas" },
  { value: "borrador", label: "Borradores" },
  { value: "rechazada", label: "Rechazadas" },
  { value: "vencida", label: "Vencidas" },
];

export default function QuotesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("todas");
  const [selected, setSelected] = useState<Quote | null>(null);

  const quotesQuery = useQuery({ queryKey: ["quotes"], queryFn: api.quotes });
  const clientsQuery = useQuery({ queryKey: ["clients"], queryFn: api.clients });
  const productsQuery = useQuery({ queryKey: ["products"], queryFn: api.products });

  const quotes = quotesQuery.data ?? [];
  const clients = clientsQuery.data ?? [];
  const products = productsQuery.data ?? [];

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return quotes.filter((quote) => {
      if (
        term &&
        !`${quote.folio} ${quote.client.business_name} ${quote.client.name}`
          .toLowerCase()
          .includes(term)
      ) {
        return false;
      }
      if (statusFilter !== "todas" && quote.status !== statusFilter) return false;
      return true;
    });
  }, [quotes, search, statusFilter]);

  const stats = useMemo(() => {
    const total = quotes
      .filter((quote) => quote.status !== "rechazada")
      .reduce((sum, quote) => sum + quote.total, 0);
    const accepted = quotes.filter((quote) => quote.status === "aceptada");
    const acceptedValue = accepted.reduce((sum, quote) => sum + quote.total, 0);
    const pending = quotes.filter(
      (quote) => quote.status === "enviada" || quote.status === "borrador",
    );
    const decided = quotes.filter(
      (quote) => quote.status === "aceptada" || quote.status === "rechazada",
    );
    const rate = decided.length > 0 ? (accepted.length / decided.length) * 100 : 0;
    return { total, acceptedCount: accepted.length, acceptedValue, pending: pending.length, rate };
  }, [quotes]);

  return (
    <>
      <DemoBanner />

      {quotesQuery.isLoading && (
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-[132px] rounded-2xl" />
            ))}
          </div>
          <Skeleton className="h-[520px] rounded-2xl" />
        </div>
      )}

      {quotesQuery.isError && (
        <DataError
          message={getErrorMessage(quotesQuery.error)}
          onRetry={() => void quotesQuery.refetch()}
        />
      )}

      {!quotesQuery.isLoading && !quotesQuery.isError && (
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <KpiCard
              label="Cotizaciones"
              value={formatNumber(quotes.length)}
              icon={FileText}
              hint="histórico de propuestas"
              accent="navy"
            />
            <KpiCard
              label="Valor cotizado"
              value={formatCurrency(stats.total)}
              icon={Wallet}
              hint="sin rechazadas"
              accent="aqua"
            />
            <KpiCard
              label="Aceptadas"
              value={formatNumber(stats.acceptedCount)}
              icon={FileCheck2}
              hint={formatCurrency(stats.acceptedValue)}
              accent="green"
            />
            <KpiCard
              label="Tasa de aceptación"
              value={`${stats.rate.toFixed(0)}%`}
              icon={Target}
              hint={`${stats.pending} por dar seguimiento`}
              accent="gold"
            />
          </div>

          <PanelCard
            title="Propuestas y seguimiento"
            description={`${filtered.length} de ${quotes.length} cotizaciones`}
            action={<QuoteDialog clients={clients} products={products} />}
          >
            <div className="flex flex-col gap-3 border-b border-navy-950/[0.06] px-5 py-4 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-navy-300" />
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Buscar por folio o cliente…"
                  className="h-10 pl-9"
                  aria-label="Buscar cotizaciones"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-10 w-full sm:w-[165px]" aria-label="Filtrar cotizaciones">
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
            </div>

            {filtered.length === 0 ? (
              <div className="p-5">
                <EmptyState message="No hay cotizaciones con esos criterios." />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Folio</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead className="hidden md:table-cell">Emitida</TableHead>
                    <TableHead className="hidden sm:table-cell">Vigencia</TableHead>
                    <TableHead className="hidden text-center lg:table-cell">
                      Partidas
                    </TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-right">Estado</TableHead>
                    <TableHead className="text-right"> </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((quote) => (
                    <TableRow key={quote.id}>
                      <TableCell className="whitespace-nowrap font-mono text-[10px] font-semibold text-navy-700">
                        {quote.folio}
                      </TableCell>
                      <TableCell>
                        <p className="max-w-[180px] truncate text-[11px] font-semibold text-navy-950">
                          {quote.client.business_name}
                        </p>
                        <p className="mt-0.5 text-[9px] text-navy-400">{quote.client.name}</p>
                      </TableCell>
                      <TableCell className="hidden whitespace-nowrap text-[10px] text-navy-500 md:table-cell">
                        {formatDate(quote.issue_date)}
                      </TableCell>
                      <TableCell className="hidden whitespace-nowrap text-[10px] text-navy-500 sm:table-cell">
                        {formatDate(quote.valid_until)}
                      </TableCell>
                      <TableCell className="hidden text-center text-[11px] text-navy-600 lg:table-cell">
                        {quote.items.length}
                      </TableCell>
                      <TableCell className="text-right text-[11px] font-bold text-navy-950">
                        {formatCurrency(quote.total)}
                      </TableCell>
                      <TableCell className="text-right">
                        <StatusBadge status={quote.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <button
                          type="button"
                          onClick={() => setSelected(quote)}
                          className="inline-flex items-center gap-1 rounded-full border border-navy-950/10 px-2.5 py-1 text-[10px] font-semibold text-navy-600 transition hover:border-gold-400 hover:text-navy-950"
                        >
                          Ver
                          <ArrowRight className="size-3" />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </PanelCard>

          <div className="rounded-2xl border border-navy-950/[0.06] bg-white p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-bold text-navy-950">
                  Las cotizaciones se calculan en el servidor
                </p>
                <p className="mt-1 max-w-2xl text-[11px] leading-relaxed text-muted-foreground">
                  La API valida cliente, productos y precios, y guarda subtotal, IVA y total.
                  Así se evita que el navegador altere los importes de una propuesta.
                </p>
              </div>
              <Button asChild variant="outline" size="sm">
                <a href="/panel/clientes">Ver clientes</a>
              </Button>
            </div>
          </div>
        </div>
      )}

      <Dialog open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-2xl">
          {selected && (
            <>
              <DialogHeader>
                <div className="flex flex-wrap items-center gap-2">
                  <DialogTitle>{selected.folio}</DialogTitle>
                  <StatusBadge status={selected.status} />
                </div>
                <DialogDescription>
                  {selected.client.business_name} · {selected.client.name}
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-3 rounded-xl border border-navy-950/[0.07] bg-cream/50 p-4 text-[11px] sm:grid-cols-3">
                <div>
                  <p className="font-bold uppercase tracking-wider text-navy-400">Emitida</p>
                  <p className="mt-1 font-semibold text-navy-900">
                    {formatDate(selected.issue_date)}
                  </p>
                </div>
                <div>
                  <p className="font-bold uppercase tracking-wider text-navy-400">Vigencia</p>
                  <p className="mt-1 font-semibold text-navy-900">
                    {formatDate(selected.valid_until)}
                  </p>
                </div>
                <div>
                  <p className="font-bold uppercase tracking-wider text-navy-400">Contacto</p>
                  <p className="mt-1 truncate font-semibold text-navy-900">
                    {selected.client.email ?? selected.client.phone ?? "Sin datos"}
                  </p>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Descripción</TableHead>
                    <TableHead className="text-center">Cant.</TableHead>
                    <TableHead className="text-right">P. unitario</TableHead>
                    <TableHead className="text-right">Importe</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selected.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="text-[11px] font-medium text-navy-900">
                        {item.description}
                      </TableCell>
                      <TableCell className="text-center text-[11px] text-navy-600">
                        {item.quantity}
                      </TableCell>
                      <TableCell className="text-right text-[11px] text-navy-600">
                        {formatCurrency(item.unit_price)}
                      </TableCell>
                      <TableCell className="text-right text-[11px] font-semibold text-navy-950">
                        {formatCurrency(item.subtotal)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="ml-auto w-full max-w-xs space-y-1.5 text-[11px]">
                <div className="flex justify-between text-navy-600">
                  <span>Subtotal</span>
                  <span className="font-semibold">{formatCurrency(selected.subtotal)}</span>
                </div>
                <div className="flex justify-between text-navy-600">
                  <span>IVA (16%)</span>
                  <span className="font-semibold">{formatCurrency(selected.tax)}</span>
                </div>
                <div className="flex justify-between border-t border-navy-950/10 pt-2 text-sm font-bold text-navy-950">
                  <span>Total</span>
                  <span>{formatCurrency(selected.total)}</span>
                </div>
              </div>

              {selected.notes && (
                <p className="rounded-xl border border-navy-950/[0.07] bg-cream/50 p-3 text-[11px] leading-relaxed text-navy-600">
                  <span className="font-bold text-navy-900">Notas: </span>
                  {selected.notes}
                </p>
              )}

              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <Button variant="ghost" onClick={() => setSelected(null)}>
                  Cerrar
                </Button>
                <Button asChild variant="gold">
                  <a href="/#contacto">
                    Quiero algo así
                    <ArrowRight className="size-4" />
                  </a>
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
