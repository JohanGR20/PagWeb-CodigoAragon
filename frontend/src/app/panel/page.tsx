"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  Boxes,
  CircleDollarSign,
  FileText,
  MessageCircle,
  PackageSearch,
  ReceiptText,
  TrendingUp,
  Wallet,
} from "lucide-react";

import { CategoryDonut } from "@/components/panel/category-donut";
import { KpiCard } from "@/components/panel/kpi-card";
import { SalesAreaChart } from "@/components/panel/sales-area-chart";
import { DataError, DemoBanner, PanelCard } from "@/components/panel/shared";
import { StatusBadge } from "@/components/panel/status-badge";
import { TopProductsChart } from "@/components/panel/top-products-chart";
import { Button } from "@/components/ui/button";
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
import { cn, formatCurrency, formatDateTime, formatNumber, formatRelative } from "@/lib/utils";

const activityStyles: Record<string, { icon: React.ElementType; className: string }> = {
  venta: { icon: ReceiptText, className: "bg-emerald-50 text-emerald-600" },
  cotizacion: { icon: FileText, className: "bg-sky-50 text-sky-600" },
  inventario: { icon: Boxes, className: "bg-amber-50 text-amber-600" },
  contacto: { icon: MessageCircle, className: "bg-violet-50 text-violet-600" },
};

function DashboardSkeleton() {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-[132px] rounded-2xl" />
        ))}
      </div>
      <div className="grid gap-5 xl:grid-cols-3">
        <Skeleton className="h-[360px] rounded-2xl xl:col-span-2" />
        <Skeleton className="h-[360px] rounded-2xl" />
      </div>
      <div className="grid gap-5 xl:grid-cols-3">
        <Skeleton className="h-[320px] rounded-2xl" />
        <Skeleton className="h-[320px] rounded-2xl xl:col-span-2" />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["dashboard"],
    queryFn: api.dashboard,
  });

  return (
    <>
      <DemoBanner />

      {isLoading && <DashboardSkeleton />}

      {isError && (
        <DataError message={getErrorMessage(error)} onRetry={() => void refetch()} />
      )}

      {data && (
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <KpiCard
              label="Ventas del mes"
              value={formatCurrency(data.revenue_month)}
              icon={CircleDollarSign}
              delta={data.revenue_delta_pct}
              hint="vs. mes anterior"
              accent="navy"
            />
            <KpiCard
              label="Ventas registradas"
              value={formatNumber(data.sales_month)}
              icon={ReceiptText}
              delta={data.sales_delta_pct}
              hint="tickets este mes"
              accent="aqua"
            />
            <KpiCard
              label="Productos activos"
              value={formatNumber(data.active_products)}
              icon={Boxes}
              hint={`${data.low_stock_count} alertas de stock`}
              accent="gold"
            />
            <KpiCard
              label="Cuentas por cobrar"
              value={formatCurrency(data.accounts_receivable)}
              icon={Wallet}
              hint={`${data.pending_quotes} cotizaciones pendientes`}
              accent="green"
            />
          </div>

          <div className="grid gap-5 xl:grid-cols-3">
            <PanelCard
              className="xl:col-span-2"
              title="Tendencia de ventas"
              description="Últimos 6 meses · ventas no canceladas"
              action={
                <Link
                  href="/panel/ventas"
                  className="inline-flex items-center gap-1 text-[10px] font-bold text-navy-600 hover:text-gold-600"
                >
                  Ver ventas
                  <ArrowRight className="size-3" />
                </Link>
              }
            >
              <SalesAreaChart data={data.sales_series} />
            </PanelCard>

            <PanelCard
              title="Ventas por categoría"
              description="Distribución del mes actual"
            >
              <CategoryDonut data={data.category_series} />
            </PanelCard>
          </div>

          <div className="grid gap-5 xl:grid-cols-3">
            <PanelCard
              title="Productos más vendidos"
              description="Por piezas · mes actual"
            >
              <TopProductsChart data={data.top_products} />
            </PanelCard>

            <PanelCard
              className="xl:col-span-2"
              title="Alertas de inventario"
              description="Productos en o por debajo del mínimo"
              action={
                <Link
                  href="/panel/inventario"
                  className="inline-flex items-center gap-1 text-[10px] font-bold text-navy-600 hover:text-gold-600"
                >
                  Ver inventario
                  <ArrowRight className="size-3" />
                </Link>
              }
            >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead>Almacén</TableHead>
                    <TableHead className="text-center">Stock</TableHead>
                    <TableHead className="text-right">Mínimo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.low_stock.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="py-8 text-center text-xs text-muted-foreground">
                        Sin alertas de inventario. Todo en orden.
                      </TableCell>
                    </TableRow>
                  )}
                  {data.low_stock.map((item) => (
                    <TableRow key={`${item.sku}-${item.warehouse}`}>
                      <TableCell>
                        <p className="text-xs font-semibold text-navy-950">{item.product}</p>
                        <p className="mt-0.5 font-mono text-[9px] text-navy-400">{item.sku}</p>
                      </TableCell>
                      <TableCell className="text-[11px] text-navy-600">{item.warehouse}</TableCell>
                      <TableCell className="text-center">
                        <span
                          className={cn(
                            "inline-flex min-w-9 justify-center rounded-full px-2 py-0.5 text-[10px] font-bold",
                            item.quantity <= 3
                              ? "bg-rose-50 text-rose-700"
                              : "bg-amber-50 text-amber-700",
                          )}
                        >
                          {item.quantity}
                        </span>
                      </TableCell>
                      <TableCell className="text-right text-[11px] text-navy-500">
                        {item.min_stock}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </PanelCard>
          </div>

          <div className="grid gap-5 xl:grid-cols-3">
            <PanelCard
              className="xl:col-span-2"
              title="Ventas recientes"
              description="Últimos movimientos registrados"
              action={
                <Link
                  href="/panel/ventas"
                  className="inline-flex items-center gap-1 text-[10px] font-bold text-navy-600 hover:text-gold-600"
                >
                  Ver todas
                  <ArrowRight className="size-3" />
                </Link>
              }
            >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Folio</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead className="hidden sm:table-cell">Fecha</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-right">Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.recent_sales.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell className="font-mono text-[10px] font-semibold text-navy-700">
                        {sale.folio}
                      </TableCell>
                      <TableCell className="text-[11px] font-medium text-navy-950">
                        {sale.client}
                      </TableCell>
                      <TableCell className="hidden text-[10px] text-navy-500 sm:table-cell">
                        {formatDateTime(sale.sale_date)}
                      </TableCell>
                      <TableCell className="text-right text-[11px] font-bold text-navy-950">
                        {formatCurrency(sale.total)}
                      </TableCell>
                      <TableCell className="text-right">
                        <StatusBadge status={sale.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </PanelCard>

            <PanelCard title="Actividad reciente" description="Bitácora de operaciones">
              <div className="space-y-1 p-4">
                {data.recent_activity.map((activity) => {
                  const style = activityStyles[activity.action] ?? {
                    icon: TrendingUp,
                    className: "bg-navy-50 text-navy-600",
                  };
                  const Icon = style.icon;
                  return (
                    <div key={activity.id} className="flex items-start gap-3 rounded-xl px-2 py-2.5 hover:bg-cream/60">
                      <span className={cn("mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg", style.className)}>
                        <Icon className="size-3.5" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-[11px] leading-snug text-navy-800">
                          {activity.description}
                        </p>
                        <p className="mt-0.5 text-[9px] text-navy-400">
                          {formatRelative(activity.created_at)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </PanelCard>
          </div>

          <div className="flex flex-col items-start gap-3 rounded-2xl border border-navy-950/[0.06] bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-xl bg-gold-200/40 text-gold-600">
                <PackageSearch className="size-4" />
              </span>
              <div>
                <p className="text-xs font-bold text-navy-950">¿Quieres este panel para tu negocio?</p>
                <p className="mt-0.5 text-[10px] text-muted-foreground">
                  Lo adaptamos a tu giro, tus productos y tu forma de vender.
                </p>
              </div>
            </div>
            <Button asChild variant="gold" size="sm">
              <Link href="/#contacto">
                Solicitar diagnóstico
                <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
