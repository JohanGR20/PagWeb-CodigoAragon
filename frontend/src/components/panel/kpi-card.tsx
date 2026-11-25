import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";

interface KpiCardProps {
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
  delta?: number | null;
  accent?: "navy" | "gold" | "aqua" | "green";
}

export function KpiCard({
  label,
  value,
  hint,
  icon: Icon,
  delta,
  accent = "navy",
}: KpiCardProps) {
  const positive = (delta ?? 0) >= 0;

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-navy-950/[0.06] bg-white p-5 shadow-[0_18px_50px_-42px_rgba(7,27,51,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_55px_-38px_rgba(7,27,51,0.3)]">
      <div className="flex items-start justify-between">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-navy-400">{label}</p>
        <span
          className={cn(
            "flex size-9 items-center justify-center rounded-xl",
            accent === "navy" && "bg-navy-50 text-navy-700",
            accent === "gold" && "bg-gold-200/50 text-gold-600",
            accent === "aqua" && "bg-cyan-50 text-aqua-500",
            accent === "green" && "bg-emerald-50 text-emerald-600",
          )}
        >
          <Icon className="size-4" />
        </span>
      </div>
      <p className="mt-4 font-display text-[30px] font-semibold leading-none tracking-tight text-navy-950">
        {value}
      </p>
      <div className="mt-3 flex items-center gap-2">
        {delta !== undefined && delta !== null && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[9px] font-bold",
              positive ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-600",
            )}
          >
            {positive ? (
              <ArrowUpRight className="size-2.5" />
            ) : (
              <ArrowDownRight className="size-2.5" />
            )}
            {Math.abs(delta).toFixed(1)}%
          </span>
        )}
        <p className="truncate text-[10px] text-muted-foreground">{hint}</p>
      </div>
    </div>
  );
}
