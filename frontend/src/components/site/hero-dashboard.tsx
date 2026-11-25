"use client";

import Image from "next/image";
import { ArrowUpRight, BadgeCheck, Boxes, CircleDollarSign, Sparkles } from "lucide-react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

import { formatCurrency } from "@/lib/utils";

const data = [
  { mes: "Jun", ventas: 3200 },
  { mes: "Jul", ventas: 4400 },
  { mes: "Ago", ventas: 4100 },
  { mes: "Sep", ventas: 5900 },
  { mes: "Oct", ventas: 6800 },
  { mes: "Nov", ventas: 10400 },
];

export function HeroDashboard() {
  return (
    <div className="relative mx-auto w-full max-w-[520px] lg:ml-auto">
      <div className="absolute -inset-12 -z-10 rounded-full bg-aqua-400/15 blur-3xl" />
      <div className="absolute right-8 top-8 -z-10 size-64 rounded-full border border-gold-400/15" />
      <div className="absolute right-20 top-20 -z-10 size-40 rounded-full border border-white/10" />

      <div className="animate-float-slow relative rounded-[30px] border border-white/15 bg-white/[0.07] p-3 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.9)] backdrop-blur-xl">
        <div className="flex items-center justify-between px-2.5 pb-3 pt-1.5">
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-rose-400/70" />
            <span className="size-2 rounded-full bg-amber-300/70" />
            <span className="size-2 rounded-full bg-emerald-400/70" />
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
            Panel de tu negocio
          </span>
          <span className="flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-emerald-300">
            <span className="size-1.5 animate-pulse rounded-full bg-emerald-400" />
            En vivo
          </span>
        </div>

        <div className="rounded-[22px] bg-[#fbfaf6] p-5 text-navy-950 shadow-xl sm:p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-navy-500">
                Ventas del mes
              </p>
              <p className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-[34px]">
                {formatCurrency(10347.2)}
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600">
                <ArrowUpRight className="size-3.5" />
                +53.0% vs. mes anterior
              </p>
            </div>
            <span className="flex size-10 items-center justify-center rounded-xl bg-navy-950 text-gold-300">
              <Sparkles className="size-4" />
            </span>
          </div>

          <div className="mt-3 h-[132px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="heroArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2cc0d9" stopOpacity={0.42} />
                    <stop offset="100%" stopColor="#2cc0d9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="mes"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#7c8b99", fontSize: 9, fontWeight: 600 }}
                  dy={4}
                />
                <Tooltip
                  cursor={{ stroke: "#c9a24a", strokeDasharray: "3 3" }}
                  formatter={(value) => [formatCurrency(Number(value)), "Ventas"]}
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #e2ddd2",
                    fontSize: 11,
                    boxShadow: "0 12px 30px -12px rgba(7,27,51,.25)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="ventas"
                  stroke="#0e7490"
                  strokeWidth={2.5}
                  fill="url(#heroArea)"
                  activeDot={{ r: 4, fill: "#c9a24a", stroke: "#fff", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-2 grid grid-cols-2 gap-2.5">
            <div className="rounded-xl border border-navy-950/[0.06] bg-white p-3">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-navy-500">
                  Productos
                </span>
                <Boxes className="size-3.5 text-aqua-500" />
              </div>
              <p className="mt-1.5 text-lg font-bold">20 activos</p>
            </div>
            <div className="rounded-xl border border-navy-950/[0.06] bg-white p-3">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-navy-500">
                  Por cobrar
                </span>
                <CircleDollarSign className="size-3.5 text-gold-500" />
              </div>
              <p className="mt-1.5 text-lg font-bold">{formatCurrency(1671.56)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute -left-6 -top-12 hidden animate-float sm:block">
        <div className="flex size-[86px] items-center justify-center rounded-full border border-gold-400/30 bg-white/95 p-1.5 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)] backdrop-blur">
          <Image
            src="/emblem.png"
            alt="Emblema Código Aragón"
            width={78}
            height={78}
            className="size-full rounded-full object-contain"
          />
        </div>
      </div>

      <div className="absolute -right-5 top-[56%] hidden animate-float items-center gap-2.5 rounded-2xl border border-white/15 bg-navy-900/90 px-3.5 py-3 shadow-2xl backdrop-blur sm:flex">
        <span className="flex size-8 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300">
          <BadgeCheck className="size-4" />
        </span>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-white/40">
            Cotización
          </p>
          <p className="text-xs font-semibold text-white">Enviada con éxito</p>
        </div>
      </div>

      <div className="absolute -bottom-6 -left-4 hidden items-center gap-2.5 rounded-2xl border border-gold-400/20 bg-navy-900/90 px-3.5 py-3 shadow-2xl backdrop-blur sm:flex">
        <span className="flex size-8 items-center justify-center rounded-full bg-gold-400/15 text-gold-300">
          <Boxes className="size-4" />
        </span>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-white/40">
            Inventario
          </p>
          <p className="text-xs font-semibold text-white">6 alertas de stock</p>
        </div>
      </div>
    </div>
  );
}
