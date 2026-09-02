import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-navy text-white text-xs px-3 py-2 rounded-xl shadow-panel border border-white/10">
        <p className="font-semibold text-white/90">{label}</p>
        <p className="text-gold-light mt-0.5 font-mono">
          <span className="font-medium text-white/70">Count: </span>
          {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

export function BarDistributionChart({
  data,
  dataKey = "value",
  nameKey = "name",
  color = "#1C3154",
  height = 220,
}: {
  data: Record<string, any>[];
  dataKey?: string;
  nameKey?: string;
  color?: string;
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
        <XAxis
          dataKey={nameKey}
          tick={{ fontSize: 11, fill: "#64748B", fontWeight: 500 }}
          axisLine={{ stroke: "#E2E8F0" }}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#64748B" }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey={dataKey} fill={color} radius={[6, 6, 0, 0]} maxBarSize={48} />
      </BarChart>
    </ResponsiveContainer>
  );
}

