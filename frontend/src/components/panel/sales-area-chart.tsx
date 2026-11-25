"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { SalesPoint } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";

export function SalesAreaChart({ data }: { data: SalesPoint[] }) {
  return (
    <div className="h-[290px] w-full px-2 pb-2 pt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 12, left: -12, bottom: 0 }}>
          <defs>
            <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0e7490" stopOpacity={0.28} />
              <stop offset="100%" stopColor="#0e7490" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 6" vertical={false} stroke="#e8e3d9" />
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#7c8b99", fontSize: 10, fontWeight: 600 }}
            dy={8}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#9aa6b1", fontSize: 10 }}
            tickFormatter={(value) => formatCurrency(value, true)}
            width={62}
          />
          <Tooltip
            cursor={{ stroke: "#c9a24a", strokeDasharray: "3 3" }}
            formatter={(value) => [formatCurrency(Number(value)), "Ventas"]}
            contentStyle={{
              borderRadius: 14,
              border: "1px solid #e2ddd2",
              fontSize: 12,
              boxShadow: "0 16px 40px -20px rgba(7,27,51,.25)",
            }}
          />
          <Area
            type="monotone"
            dataKey="total"
            stroke="#0e7490"
            strokeWidth={2.5}
            fill="url(#salesFill)"
            activeDot={{ r: 4, fill: "#c9a24a", stroke: "#fff", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
