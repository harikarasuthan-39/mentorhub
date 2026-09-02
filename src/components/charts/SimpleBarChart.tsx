import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";

interface SimpleBarChartProps {
  data: { name: string; value: number }[];
  color?: string;
  height?: number;
}

export function SimpleBarChart({
  data,
  color = "#6366F1",
  height = 240,
}: SimpleBarChartProps) {
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
          <XAxis
            dataKey="name"
            tickLine={false}
            axisLine={{ stroke: "#E2E8F0" }}
            tick={{ fill: "#64748B", fontSize: 10 }}
          />
          <YAxis
            domain={[0, 100]}
            tickLine={false}
            axisLine={{ stroke: "#E2E8F0" }}
            tick={{ fill: "#64748B", fontSize: 11 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#110D20",
              border: "1px solid rgba(147, 51, 234, 0.3)",
              borderRadius: "12px",
              color: "#fff",
              fontSize: "12px",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
            }}
            formatter={(value: any) => [`${value}% Attendance`, "Compliance"]}
          />
          <Bar dataKey="value" fill={color} radius={[6, 6, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.value < 75 ? "#EF4444" : entry.value < 85 ? "#F59E0B" : color}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
