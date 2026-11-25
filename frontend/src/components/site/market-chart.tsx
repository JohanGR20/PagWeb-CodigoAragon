"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { year: "2018", valor: 3.8 },
  { year: "2023", valor: 6.7 },
];

export function MarketChart() {
  return (
    <div className="h-[190px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 24, right: 8, left: -22, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 5" vertical={false} stroke="rgba(255,255,255,0.08)" />
          <XAxis
            dataKey="year"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 11, fontWeight: 600 }}
            dy={6}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
            tickFormatter={(value) => `${value}%`}
            domain={[0, 8]}
          />
          <Tooltip
            cursor={{ fill: "rgba(255,255,255,0.03)" }}
            formatter={(value) => [`${value}%`, "Vendían por internet"]}
            contentStyle={{
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "#08243a",
              color: "#fff",
              fontSize: 12,
            }}
            labelStyle={{ color: "rgba(255,255,255,.5)" }}
          />
          <Bar dataKey="valor" fill="#d9b65f" radius={[7, 7, 0, 0]} maxBarSize={64}>
            <LabelList
              dataKey="valor"
              position="top"
              formatter={(value) => (value == null ? "" : `${value}%`)}
              style={{ fill: "#f0e2b9", fontSize: 12, fontWeight: 700 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
