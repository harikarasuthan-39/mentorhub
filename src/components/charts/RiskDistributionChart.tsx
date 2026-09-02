import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const COLORS: Record<string, string> = {
  LOW: "#059669",
  MEDIUM: "#D97706",
  HIGH: "#DC2626",
  CRITICAL: "#991B1B",
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-navy text-white text-xs px-3 py-2 rounded-xl shadow-panel border border-white/10">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: data.payload.fill }} />
          <p className="font-semibold text-white/90">{data.name} Risk</p>
        </div>
        <p className="text-white/80 mt-0.5 font-mono">
          <span className="font-medium text-white/60">Students: </span>
          {data.value}
        </p>
      </div>
    );
  }
  return null;
};

export function RiskDistributionChart({
  data,
  height = 220,
}: {
  data: Record<string, number>;
  height?: number;
}) {
  const chartData = Object.entries(data).map(([name, value]) => ({
    name,
    value,
    fill: COLORS[name] ?? "#64748B",
  }));

  const total = Object.values(data).reduce((a, b) => a + b, 0);

  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            innerRadius={55}
            outerRadius={82}
            paddingAngle={3}
            strokeWidth={0}
          >
            {chartData.map((d) => (
              <Cell key={d.name} fill={d.fill} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="circle"
            iconSize={8}
            formatter={(value) => (
              <span className="text-xs font-medium text-slate-muted capitalize">{value.toLowerCase()}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute top-[38%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
        <p className="font-display text-xl font-bold text-navy leading-none">{total}</p>
        <p className="text-[10px] text-slate-muted uppercase tracking-wider font-semibold mt-0.5">Total</p>
      </div>
    </div>
  );
}

