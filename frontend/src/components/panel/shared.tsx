import Link from "next/link";
import { AlertCircle, ArrowUpRight, Info } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function DemoBanner() {
  return (
    <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-gold-400/20 bg-gradient-to-r from-navy-950 to-navy-800 px-4 py-3.5 text-white sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-gold-400/15 text-gold-300">
          <Info className="size-4" />
        </span>
        <div>
          <p className="text-xs font-bold">Estás viendo datos de demostración</p>
          <p className="mt-0.5 text-[11px] leading-relaxed text-white/45">
            Este panel simula una distribuidora local y se conecta a la API real del proyecto.
          </p>
        </div>
      </div>
      <Link
        href="/#contacto"
        className="inline-flex shrink-0 items-center gap-1.5 text-[11px] font-bold text-gold-300 transition hover:text-gold-200"
      >
        Quiero algo así
        <ArrowUpRight className="size-3.5" />
      </Link>
    </div>
  );
}

export function DataError({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-rose-200 bg-white p-8 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-rose-50 text-rose-600">
        <AlertCircle className="size-6" />
      </span>
      <h2 className="mt-4 font-display text-xl text-navy-950">No pudimos cargar la información</h2>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" className="mt-5" onClick={onRetry}>
          Reintentar
        </Button>
      )}
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center rounded-xl border border-dashed border-navy-950/15 bg-cream/50 p-8 text-center">
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

export function PanelCard({
  children,
  className,
  title,
  description,
  action,
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <section
      className={cn(
        "min-w-0 overflow-hidden rounded-2xl border border-navy-950/[0.06] bg-white shadow-[0_18px_50px_-40px_rgba(7,27,51,0.35)]",
        className,
      )}
    >
      {(title || action) && (
        <div className="flex flex-col gap-2 border-b border-navy-950/[0.06] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {title && <h2 className="text-[13px] font-bold text-navy-950">{title}</h2>}
            {description && (
              <p className="mt-0.5 text-[11px] text-muted-foreground">{description}</p>
            )}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
