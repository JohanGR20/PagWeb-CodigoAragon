"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowUpRight,
  Boxes,
  ChevronRight,
  CreditCard,
  FileText,
  LayoutDashboard,
  Menu,
  ReceiptText,
  Users,
  X,
} from "lucide-react";

import { Logo } from "@/components/site/logo";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

const navigation = [
  { href: "/panel", label: "Resumen", icon: LayoutDashboard, exact: true },
  { href: "/panel/inventario", label: "Inventario", icon: Boxes },
  { href: "/panel/ventas", label: "Ventas", icon: ReceiptText },
  { href: "/panel/cotizaciones", label: "Cotizaciones", icon: FileText },
  { href: "/panel/clientes", label: "Clientes", icon: Users },
  { href: "/panel/facturacion", label: "Facturación", icon: CreditCard },
];

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  "/panel": { title: "Resumen general", subtitle: "Así se ve la operación de tu negocio hoy." },
  "/panel/inventario": { title: "Inventario", subtitle: "Existencias, almacenes y movimientos." },
  "/panel/ventas": { title: "Ventas", subtitle: "Pedidos, tickets y métodos de pago." },
  "/panel/cotizaciones": { title: "Cotizaciones", subtitle: "Propuestas enviadas y su seguimiento." },
  "/panel/clientes": { title: "Clientes", subtitle: "Directorio de negocios y contactos." },
  "/panel/facturacion": { title: "Facturación", subtitle: "Facturas, pagos y cuentas por cobrar." },
};

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <>
      <div className="px-5 pb-6 pt-6">
        <Logo variant="light" compact href="/" />
      </div>

      <div className="mx-4 mb-6 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-3">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/35">
            Negocio de ejemplo
          </p>
          <span className="rounded-full border border-gold-400/25 bg-gold-400/10 px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.15em] text-gold-300">
            Demo
          </span>
        </div>
        <p className="mt-1 text-xs font-semibold text-white/85">Distribuidora La Esquina</p>
        <p className="mt-0.5 text-[10px] text-white/35">Datos ficticios · CDMX</p>
      </div>

      <nav className="flex-1 space-y-1 px-3" aria-label="Navegación del panel">
        {navigation.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition",
                active
                  ? "bg-white/[0.08] text-white"
                  : "text-white/50 hover:bg-white/[0.04] hover:text-white/85",
              )}
            >
              {active && (
                <span className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-gold-400" />
              )}
              <Icon
                className={cn(
                  "size-[18px] transition",
                  active ? "text-gold-300" : "text-white/35 group-hover:text-white/60",
                )}
              />
              {item.label}
              {active && <ChevronRight className="ml-auto size-3.5 text-white/30" />}
            </Link>
          );
        })}
      </nav>

      <div className="m-4 mt-6 rounded-2xl border border-gold-400/20 bg-gradient-to-br from-gold-400/[0.12] to-transparent p-4">
        <p className="font-display text-lg leading-tight text-white">¿Te gusta lo que ves?</p>
        <p className="mt-1.5 text-[11px] leading-relaxed text-white/45">
          Este panel se puede adaptar a tu negocio.
        </p>
        <Button asChild variant="gold" size="sm" className="mt-3 w-full">
          <Link href="/#contacto">
            Hablemos
            <ArrowUpRight className="size-3.5" />
          </Link>
        </Button>
      </div>

      <div className="border-t border-white/10 px-5 py-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-[11px] font-medium text-white/35 transition hover:text-white/70"
        >
          <ArrowUpRight className="size-3.5 rotate-[-135deg]" />
          Volver al sitio
        </Link>
      </div>
    </>
  );
}

export function PanelShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [today, setToday] = useState("");

  const { data: health, isError } = useQuery({
    queryKey: ["health"],
    queryFn: api.health,
    retry: 0,
    refetchInterval: 60_000,
  });

  useEffect(() => {
    const formatted = new Intl.DateTimeFormat("es-MX", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date());
    setToday(formatted.charAt(0).toUpperCase() + formatted.slice(1));
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const meta = pageTitles[pathname] ?? pageTitles["/panel"];

  return (
    <div className="min-h-screen bg-[#f3f5f7]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[260px] flex-col bg-navy-950 lg:flex">
        <SidebarContent />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Cerrar menú"
            className="absolute inset-0 bg-navy-950/70 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative flex h-full w-[280px] flex-col bg-navy-950 shadow-2xl">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="absolute right-3 top-3 rounded-full p-2 text-white/50 hover:bg-white/10 hover:text-white"
              aria-label="Cerrar menú"
            >
              <X className="size-4" />
            </button>
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <div className="lg:pl-[260px]">
        <header className="sticky top-0 z-30 border-b border-navy-950/[0.06] bg-white/90 backdrop-blur-xl">
          <div className="flex h-[72px] items-center gap-4 px-4 sm:px-6 lg:px-8">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="rounded-xl border border-navy-950/10 p-2 text-navy-700 transition hover:bg-cream lg:hidden"
              aria-label="Abrir menú"
            >
              <Menu className="size-5" />
            </button>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-navy-400">
                <span>Panel</span>
                <ChevronRight className="size-3" />
                <span className="truncate text-navy-600">{meta.title}</span>
              </div>
              <h1 className="mt-0.5 truncate font-display text-[22px] leading-tight text-navy-950">
                {meta.title}
              </h1>
            </div>

            <div className="hidden items-center gap-5 md:flex">
              <div className="text-right">
                <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-navy-400">
                  Hoy
                </p>
                <p className="text-[11px] font-medium text-navy-700">{today}</p>
              </div>
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-wider",
                  isError
                    ? "border-rose-200 bg-rose-50 text-rose-600"
                    : "border-emerald-200 bg-emerald-50 text-emerald-700",
                )}
                title={health ? `API ${health.version}` : "Estado de la API"}
              >
                <span
                  className={cn(
                    "size-1.5 rounded-full",
                    isError ? "bg-rose-500" : "bg-emerald-500",
                  )}
                />
                {isError ? "API sin conexión" : "API conectada"}
              </span>
            </div>

            <Link
              href="/"
              className="hidden items-center gap-1.5 rounded-full border border-navy-950/10 px-3.5 py-2 text-[11px] font-semibold text-navy-700 transition hover:border-navy-950/25 hover:bg-cream sm:inline-flex"
            >
              Ver sitio
              <ArrowUpRight className="size-3.5" />
            </Link>
          </div>
        </header>

        <main className="mx-auto max-w-[1500px] p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
