"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import type { CategorySlice } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";

const COLORS = ["#0e7490", "#c9a24a", "#12415f", "#2cc0d9", "#8a9aa8", "#e5cd8e"];

export function CategoryDonut({ data }: { data: CategorySlice[] }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  if (data.length === 0) {
    return (
      <div className="flex h-[250px] items-center justify-center text-xs text-muted-foreground">
        Sin ventas registradas este mes.
      </div>
    );
  }

  return (
    <div className="px-5 pb-5">
      <div className="relative h-[210px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={58}
              outerRadius={84}
              paddingAngle={3}
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => formatCurrency(Number(value))}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #e2ddd2",
                fontSize: 12,
                boxShadow: "0 12px 30px -18px rgba(7,27,51,.25)",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-navy-400">
            Este mes
          </span>
          <span className="mt-1 font-display text-xl font-semibold text-navy-950">
            {formatCurrency(total, true)}
          </span>
        </div>
      </div>

      <div className="mt-2 space-y-2">
        {data.slice(0, 5).map((item, index) => (
          <div key={item.name} className="flex items-center gap-2 text-[11px]">
            <span
              className="size-2 rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="flex-1 truncate text-navy-600">{item.name}</span>
            <span className="font-semibold text-navy-950">{formatCurrency(item.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
