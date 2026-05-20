import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

// 🔥 FIXED TOOLTIP
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-[hsl(220,25%,13%)] border border-border rounded-lg p-3 shadow-xl text-xs">
      <p className="text-muted-foreground mb-2 font-medium">
        {label}
      </p>

      {payload.map((p, i) => (
        <div key={i} className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: p.color }}
            />
            <span className="text-muted-foreground capitalize">
              {p.dataKey}
            </span>
          </div>

          <span className="font-semibold text-foreground">
            {typeof p.value === "number"
              ? p.value.toLocaleString()
              : p.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function RevenueChart({
  data = [],
  type = "line",
  isLoading = false,
}) {
  if (isLoading) {
    return (
      <div className="w-full h-64 bg-muted/30 rounded-lg animate-pulse" />
    );
  }

  if (!data.length) {
    return (
      <div className="w-full h-64 flex items-center justify-center text-sm text-muted-foreground">
        No revenue data available
      </div>
    );
  }

  const Chart = type === "bar" ? BarChart : LineChart;

  return (
    <ResponsiveContainer width="100%" height={280}>
      <Chart
        data={data}
        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
      >
        {/* GRID */}
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="hsl(220,18%,16%)"
          vertical={false}
        />

        {/* X AXIS */}
        <XAxis
          dataKey="date"
          tick={{ fill: "hsl(215,15%,50%)", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />

        {/* Y AXIS */}
        <YAxis
          tick={{ fill: "hsl(215,15%,50%)", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={50}
          tickFormatter={(v) =>
            v >= 1000 ? `GHC ${(v / 1000).toFixed(0)}k` : `GHC ${v}`
          }
        />

        {/* TOOLTIP */}
        <Tooltip content={<CustomTooltip />} />

        {/* LEGEND */}
        <Legend
          wrapperStyle={{
            fontSize: "12px",
            color: "hsl(215,15%,55%)",
          }}
        />

        {/* LINE MODE */}
        {type === "line" && (
          <>
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#22c55e"
              strokeWidth={2.5}
              dot={false}
            />

            {data.some((d) => d.orders !== undefined) && (
              <Line
                type="monotone"
                dataKey="orders"
                stroke="#06b6d4"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
            )}
          </>
        )}

        {/* BAR MODE */}
        {type === "bar" && (
          <Bar
            dataKey="revenue"
            fill="#22c55e"
            radius={[4, 4, 0, 0]}
            maxBarSize={30}
          />
        )}
      </Chart>
    </ResponsiveContainer>
  );
}
