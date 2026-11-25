import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const currencyFormatter = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const compactCurrencyFormatter = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  notation: "compact",
  maximumFractionDigits: 1,
});

const numberFormatter = new Intl.NumberFormat("es-MX");

export function formatCurrency(value: number | string | null | undefined, compact = false) {
  const numeric = typeof value === "string" ? Number(value) : (value ?? 0);
  if (!Number.isFinite(numeric)) return "$0";
  return (compact ? compactCurrencyFormatter : currencyFormatter).format(numeric);
}

export function formatNumber(value: number | string | null | undefined) {
  const numeric = typeof value === "string" ? Number(value) : (value ?? 0);
  if (!Number.isFinite(numeric)) return "0";
  return numberFormatter.format(numeric);
}

export function parseDate(value: string | Date) {
  if (value instanceof Date) return value;
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split("-").map(Number);
    return new Date(year, month - 1, day);
  }
  return new Date(value);
}

export function formatDate(
  value: string | Date | null | undefined,
  options: Intl.DateTimeFormatOptions = { day: "2-digit", month: "short", year: "numeric" },
) {
  if (!value) return "—";
  const date = parseDate(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("es-MX", options).format(date);
}

export function formatDateTime(value: string | Date | null | undefined) {
  return formatDate(value, {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatRelative(value: string | Date) {
  const date = parseDate(value);
  const diff = Date.now() - date.getTime();
  const minutes = Math.round(diff / 60000);
  if (minutes < 1) return "Ahora";
  if (minutes < 60) return `Hace ${minutes} min`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `Hace ${hours} h`;
  const days = Math.round(hours / 24);
  if (days === 1) return "Ayer";
  if (days < 30) return `Hace ${days} días`;
  return formatDate(date);
}

export function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function formatPercent(value: number | null | undefined) {
  if (value === null || value === undefined) return "Sin comparativa";
  const prefix = value > 0 ? "+" : "";
  return `${prefix}${value.toFixed(1)}%`;
}

export function toDateInput(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function futureDateInput(days = 15) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return toDateInput(date);
}

export const statusStyles: Record<string, string> = {
  pagada: "border-emerald-200 bg-emerald-50 text-emerald-700",
  pendiente: "border-amber-200 bg-amber-50 text-amber-700",
  cancelada: "border-rose-200 bg-rose-50 text-rose-700",
  aceptada: "border-emerald-200 bg-emerald-50 text-emerald-700",
  enviada: "border-sky-200 bg-sky-50 text-sky-700",
  borrador: "border-slate-200 bg-slate-50 text-slate-600",
  rechazada: "border-rose-200 bg-rose-50 text-rose-700",
  vencida: "border-amber-200 bg-amber-50 text-amber-700",
  emitida: "border-sky-200 bg-sky-50 text-sky-700",
  ok: "border-emerald-200 bg-emerald-50 text-emerald-700",
  medio: "border-amber-200 bg-amber-50 text-amber-700",
  bajo: "border-orange-200 bg-orange-50 text-orange-700",
  agotado: "border-rose-200 bg-rose-50 text-rose-700",
};

export function statusLabel(status: string) {
  const labels: Record<string, string> = {
    pagada: "Pagada",
    pendiente: "Pendiente",
    cancelada: "Cancelada",
    aceptada: "Aceptada",
    enviada: "Enviada",
    borrador: "Borrador",
    rechazada: "Rechazada",
    vencida: "Vencida",
    emitida: "Emitida",
    ok: "Disponible",
    medio: "Stock medio",
    bajo: "Stock bajo",
    agotado: "Agotado",
    entrada: "Entrada",
    salida: "Salida",
    ajuste: "Ajuste",
  };
  return labels[status] ?? status;
}
