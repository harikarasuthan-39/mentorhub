import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface SimpleLineChartProps {
  data: { name: string; value: number }[];
  color?: string;
  height?: number;
}

export function SimpleLineChart({
  data,
  color = "#7E22CE",
  height = 240,
}: SimpleLineChartProps) {
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
          <XAxis
            dataKey="name"
            tickLine={false}
            axisLine={{ stroke: "#E2E8F0" }}
            tick={{ fill: "#64748B", fontSize: 11 }}
          />
          <YAxis
            domain={[6, 10]}
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
            formatter={(value: any) => [`${value} GPA`, "Grade"]}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={3}
            dot={{ r: 4, fill: color, strokeWidth: 2, stroke: "#fff" }}
            activeDot={{ r: 6, fill: "#fff", stroke: color, strokeWidth: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
