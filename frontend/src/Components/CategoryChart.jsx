import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;

  const d = payload[0].payload;

  return (
    <div className="bg-[hsl(220,25%,13%)] border border-border rounded-lg p-3 shadow-xl text-xs">
      <p className="font-semibold text-foreground mb-1">
        {d.category}
      </p>

      <p className="text-muted-foreground">
        GHC {Number(d.revenue || 0).toLocaleString()} ({d.percentage || 0}%)
      </p>
    </div>
  );
};

const COLORS = ["#22c55e", "#06b6d4", "#f59e0b", "#ef4444"];

export default function CategoryChart({ data = [] }) {
  if (!data.length) {
    return (
      <div className="h-52 flex items-center justify-center text-sm text-muted-foreground">
        No category data available
      </div>
    );
  }

  const safeData = data.map(d => ({
    ...d,
    revenue: Number(d.revenue) || 0,
  }));

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-center">
      {/* PIE */}
      <div className="w-full lg:w-52 h-52 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={safeData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={85}
              paddingAngle={3}
              dataKey="revenue"
            >
              {safeData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={entry.color || COLORS[index % COLORS.length]}
                  stroke="transparent"
                />
              ))}
            </Pie>

            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* LEGEND */}
      <div className="flex-1 space-y-3 w-full">
        {safeData.slice(0, 6).map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{
                background:
                  item.color || COLORS[i % COLORS.length],
              }}
            />

            <span className="text-sm text-muted-foreground flex-1 truncate">
              {item.category}
            </span>

            <span className="text-sm font-mono text-foreground">
              GHC {Number(item.revenue || 0).toLocaleString()}
            </span>

            <span className="text-xs text-muted-foreground w-10 text-right">
              {item.percentage || 0}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
