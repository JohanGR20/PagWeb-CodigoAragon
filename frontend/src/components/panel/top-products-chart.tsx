"use client";

import {
  Bar,
  BarChart,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { TopProduct } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";

const COLORS = ["#0e7490", "#177a96", "#2190ab", "#2cc0d9", "#7ee0ee"];

export function TopProductsChart({ data }: { data: TopProduct[] }) {
  if (data.length === 0) {
    return (
      <div className="flex h-[250px] items-center justify-center text-xs text-muted-foreground">
        Sin productos vendidos este mes.
      </div>
    );
  }

  return (
    <div className="h-[280px] w-full px-2 pb-2 pt-3">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 4, right: 36, left: 4, bottom: 4 }}
        >
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="name"
            width={120}
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#536577", fontSize: 10, fontWeight: 500 }}
            tickFormatter={(value: string) =>
              value.length > 18 ? `${value.slice(0, 17)}…` : value
            }
          />
          <Tooltip
            cursor={{ fill: "rgba(14,116,144,0.04)" }}
            formatter={(value) => [`${value} piezas`, "Vendidas"]}
            contentStyle={{
              borderRadius: 12,
              border: "1px solid #e2ddd2",
              fontSize: 12,
              boxShadow: "0 12px 30px -18px rgba(7,27,51,.25)",
            }}
          />
          <Bar dataKey="quantity" radius={[0, 6, 6, 0]} barSize={16}>
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
            ))}
            <LabelList
              dataKey="quantity"
              position="right"
              style={{ fill: "#12415f", fontSize: 10, fontWeight: 700 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
