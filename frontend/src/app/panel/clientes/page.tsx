"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Building2,
  CalendarDays,
  Mail,
  MapPin,
  Phone,
  Search,
  UserRound,
  Users,
} from "lucide-react";

import { ClientDialog } from "@/components/panel/client-dialog";
import { KpiCard } from "@/components/panel/kpi-card";
import { DataError, DemoBanner, EmptyState, PanelCard } from "@/components/panel/shared";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { api, getErrorMessage } from "@/lib/api";
import { formatDate, formatNumber, initials } from "@/lib/utils";

export default function ClientsPage() {
  const [search, setSearch] = useState("");

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["clients"],
    queryFn: api.clients,
  });

  const clients = data ?? [];

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    const list = term
      ? clients.filter((client) =>
          `${client.business_name} ${client.name} ${client.email ?? ""} ${client.phone ?? ""} ${client.rfc ?? ""}`
            .toLowerCase()
            .includes(term),
        )
      : clients;
    return [...list].sort((a, b) => a.business_name.localeCompare(b.business_name, "es"));
  }, [clients, search]);

  const stats = useMemo(() => {
    const withEmail = clients.filter((client) => Boolean(client.email)).length;
    const withRfc = clients.filter((client) => Boolean(client.rfc)).length;
    const monthAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const recent = clients.filter(
      (client) => new Date(client.created_at).getTime() >= monthAgo,
    ).length;
    return { withEmail, withRfc, recent };
  }, [clients]);

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
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-[240px] rounded-2xl" />
            ))}
          </div>
        </div>
      )}

      {isError && (
        <DataError message={getErrorMessage(error)} onRetry={() => void refetch()} />
      )}

      {!isLoading && !isError && (
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <KpiCard
              label="Clientes registrados"
              value={formatNumber(clients.length)}
              icon={Users}
              hint="directorio de la distribuidora"
              accent="navy"
            />
            <KpiCard
              label="Con correo"
              value={formatNumber(stats.withEmail)}
              icon={Mail}
              hint="para enviar cotizaciones"
              accent="aqua"
            />
            <KpiCard
              label="Con RFC"
              value={formatNumber(stats.withRfc)}
              icon={Building2}
              hint="listos para facturar"
              accent="gold"
            />
            <KpiCard
              label="Nuevos (30 días)"
              value={formatNumber(stats.recent)}
              icon={CalendarDays}
              hint="altas recientes"
              accent="green"
            />
          </div>

          <PanelCard
            title="Directorio de clientes"
            description={`${filtered.length} de ${clients.length} negocios`}
            action={<ClientDialog />}
          >
            <div className="border-b border-navy-950/[0.06] px-5 py-4">
              <div className="relative max-w-md">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-navy-300" />
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Buscar por negocio, contacto, correo o RFC…"
                  className="h-10 pl-9"
                  aria-label="Buscar clientes"
                />
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="p-5">
                <EmptyState message="No encontramos clientes con ese criterio." />
              </div>
            ) : (
              <div className="grid gap-4 p-5 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((client, index) => (
                  <article
                    key={client.id}
                    className="group relative flex flex-col rounded-2xl border border-navy-950/[0.07] bg-white p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold-400/40 hover:shadow-[0_20px_45px_-35px_rgba(7,27,51,0.45)]"
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={
                          index % 3 === 0
                            ? "flex size-11 shrink-0 items-center justify-center rounded-xl bg-navy-950 font-display text-sm font-semibold text-gold-300"
                            : index % 3 === 1
                              ? "flex size-11 shrink-0 items-center justify-center rounded-xl bg-aqua-500/10 font-display text-sm font-semibold text-aqua-500"
                              : "flex size-11 shrink-0 items-center justify-center rounded-xl bg-gold-200/60 font-display text-sm font-semibold text-gold-600"
                        }
                      >
                        {initials(client.business_name)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-[13px] font-bold text-navy-950">
                          {client.business_name}
                        </h3>
                        <p className="mt-0.5 flex items-center gap-1 truncate text-[10px] text-navy-400">
                          <UserRound className="size-3" />
                          {client.name}
                        </p>
                      </div>
                      {client.rfc && (
                        <span className="rounded-md bg-cream px-1.5 py-1 font-mono text-[8px] font-semibold uppercase text-navy-500">
                          {client.rfc}
                        </span>
                      )}
                    </div>

                    <div className="mt-4 space-y-1.5 text-[10px]">
                      {client.email ? (
                        <a
                          href={`mailto:${client.email}`}
                          className="flex items-center gap-1.5 truncate text-navy-600 transition hover:text-gold-600"
                        >
                          <Mail className="size-3 shrink-0 text-navy-300" />
                          <span className="truncate">{client.email}</span>
                        </a>
                      ) : (
                        <p className="flex items-center gap-1.5 text-navy-300">
                          <Mail className="size-3 shrink-0" />
                          Sin correo registrado
                        </p>
                      )}
                      {client.phone ? (
                        <a
                          href={`tel:${client.phone.replace(/[^0-9+]/g, "")}`}
                          className="flex items-center gap-1.5 text-navy-600 transition hover:text-gold-600"
                        >
                          <Phone className="size-3 shrink-0 text-navy-300" />
                          {client.phone}
                        </a>
                      ) : (
                        <p className="flex items-center gap-1.5 text-navy-300">
                          <Phone className="size-3 shrink-0" />
                          Sin teléfono
                        </p>
                      )}
                      <p className="flex items-start gap-1.5 text-navy-400">
                        <MapPin className="mt-px size-3 shrink-0 text-navy-300" />
                        <span className="line-clamp-1">
                          {client.address ?? "Dirección no registrada"}
                        </span>
                      </p>
                    </div>

                    {client.notes && (
                      <p className="mt-3 line-clamp-2 rounded-lg bg-cream/60 px-2.5 py-2 text-[10px] leading-relaxed text-navy-500">
                        {client.notes}
                      </p>
                    )}

                    <div className="mt-auto flex items-center justify-between border-t border-navy-950/[0.05] pt-3 text-[9px] text-navy-300">
                      <span>Cliente desde</span>
                      <span className="font-semibold text-navy-400">
                        {formatDate(client.created_at, {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </PanelCard>
        </div>
      )}
    </>
  );
}
