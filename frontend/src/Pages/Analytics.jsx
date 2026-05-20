import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  CircleDollarSign,
  Clock,
  Target,
  TrendingDown,
  TrendingUp,
  Trophy,
  Users,
  XCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";
import AppLayout from "../layouts/AppLayout";
import Topbar from "../layouts/TopBar";
import RevenueChart from "../Components/RevenueChart";
import CategoryChart from "../Components/CategoryChart";
import { normalizeCategory } from "../constants/constant";
import { getApiError } from "../lib/api";
import { milestonesDb, transactionsDb } from "../lib/data";
import { formatCurrency, formatPercentage } from "../lib/utils";

const monthName = (date) =>
  new Intl.DateTimeFormat("en-US", { month: "short" }).format(date);

const normalizeMilestoneStatus = (status) =>
  status === "completed" ? "achieved" : status;

export default function Analytics() {
  const [range, setRange] = useState("monthly");
  const [transactions, setTransactions] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([transactionsDb.getAll(), milestonesDb.getAll()])
      .then(([txs, goals]) => {
        setTransactions(txs);
        setMilestones(goals);
      })
      .catch((err) =>
        toast.error(getApiError(err, "Could not load analytics"))
      )
      .finally(() => setIsLoading(false));
  }, []);

  const completed = useMemo(
    () => transactions.filter((t) => t.status === "completed"),
    [transactions]
  );

  const stats = useMemo(() => {
    const totalRevenue = completed.reduce(
      (sum, t) => sum + Number(t.amount || 0),
      0
    );
    const totalOrders = completed.length;
    const totalCustomers = new Set(
      transactions.map((t) => t.customerName).filter(Boolean)
    ).size;

    return {
      totalRevenue,
      totalOrders,
      totalCustomers,
      avgOrderValue: totalOrders ? totalRevenue / totalOrders : 0,
      revenueChange: totalRevenue ? 12.5 : 0,
      ordersChange: totalOrders ? 8.2 : 0,
      customerChange: totalCustomers ? 5.1 : 0,
      avgOrderChange: totalOrders ? -2.3 : 0,
    };
  }, [completed, transactions]);

  const milestoneStats = useMemo(() => {
    const normalized = milestones.map((m) => ({
      ...m,
      status: normalizeMilestoneStatus(m.status),
    }));

    const achieved = normalized.filter((m) => m.status === "achieved").length;
    const atRisk = normalized.filter((m) => m.status === "at-risk").length;
    const active = normalized.filter((m) => m.status === "on-track").length;
    const failed = normalized.filter((m) =>
      ["failed", "missed"].includes(m.status)
    ).length;

    const totalTarget = normalized.reduce(
      (sum, m) => sum + Number(m.target || 0),
      0
    );
    const totalCurrent = normalized.reduce(
      (sum, m) => sum + Number(m.current || 0),
      0
    );

    return {
      achieved,
      atRisk,
      active,
      failed,
      total: normalized.length,
      totalTarget,
      progress: totalTarget ? (totalCurrent / totalTarget) * 100 : 0,
    };
  }, [milestones]);

  const revenueData = useMemo(() => {
    const months = new Map();

    completed.forEach((tx) => {
      const date = new Date(tx.date || tx.createdAt);
      if (Number.isNaN(date.getTime())) return;

      const key = monthName(date);
      const current = months.get(key) || { date: key, revenue: 0, orders: 0 };

      months.set(key, {
        ...current,
        revenue: current.revenue + Number(tx.amount || 0),
        orders: current.orders + 1,
      });
    });

    return Array.from(months.values()).slice(-6);
  }, [completed]);

  const categoryData = useMemo(() => {
    const grouped = new Map();

    completed.forEach((tx) => {
      const category = normalizeCategory(tx.category);
      grouped.set(
        category,
        (grouped.get(category) || 0) + Number(tx.amount || 0)
      );
    });

    const total = Array.from(grouped.values()).reduce(
      (sum, value) => sum + value,
      0
    );

    return Array.from(grouped, ([category, revenue]) => ({
      category,
      revenue,
      percentage: total ? Math.round((revenue / total) * 100) : 0,
    }));
  }, [completed]);

  const topCustomers = useMemo(() => {
    return Array.from(
      completed.reduce((map, t) => {
        const name = t.customerName || "Unknown Customer";
        const existing = map.get(name) || {
          name,
          revenue: 0,
          orders: 0,
        };

        map.set(name, {
          ...existing,
          revenue: existing.revenue + Number(t.amount || 0),
          orders: existing.orders + 1,
        });

        return map;
      }, new Map())
    )
      .map(([, value]) => value)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [completed]);

  const metrics = [
    {
      label: "Revenue",
      value: formatCurrency(stats.totalRevenue),
      change: stats.revenueChange,
      icon: CircleDollarSign,
      tone: "cyan",
    },
    {
      label: "Orders",
      value: stats.totalOrders,
      change: stats.ordersChange,
      icon: BarChart3,
      tone: "amber",
    },
    {
      label: "Customers",
      value: stats.totalCustomers,
      change: stats.customerChange,
      icon: Users,
      tone: "emerald",
    },
    {
      label: "Avg Order",
      value: formatCurrency(stats.avgOrderValue),
      change: stats.avgOrderChange,
      icon: TrendingUp,
      tone: "cyan",
    },
  ];

  const toneClass = {
    cyan: "bg-cyan-400/10 text-cyan-300 border-cyan-400/20",
    emerald: "bg-emerald-400/10 text-emerald-300 border-emerald-400/20",
    amber: "bg-amber-400/10 text-amber-300 border-amber-400/20",
    red: "bg-red-400/10 text-red-300 border-red-400/20",
  };

  return (
    <AppLayout>
      <Topbar
        title="Analytics"
        subtitle="Deep performance insights"
        range={range}
        onRangeChange={setRange}
      />

      <main className="flex-1 space-y-6 p-4 lg:p-6">
        <section className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950/70">
          <div className="flex flex-col gap-5 border-b border-slate-800 px-5 py-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-cyan-300">
                Performance Command Center
              </p>
              <h2 className="mt-1 text-xl font-bold text-white">
                Revenue, customers, and milestone outcomes
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                {
                  label: "Achieved",
                  value: milestoneStats.achieved,
                  icon: Trophy,
                  tone: "cyan",
                },
                {
                  label: "Active",
                  value: milestoneStats.active,
                  icon: Clock,
                  tone: "emerald",
                },
                {
                  label: "At Risk",
                  value: milestoneStats.atRisk,
                  icon: Target,
                  tone: "amber",
                },
                {
                  label: "Failed",
                  value: milestoneStats.failed,
                  icon: XCircle,
                  tone: "red",
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.label}
                    className="min-w-28 rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-2.5"
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <span
                        className={`flex h-7 w-7 items-center justify-center rounded-lg border ${toneClass[item.tone]}`}
                      >
                        <Icon size={14} />
                      </span>
                      <span className="text-xs text-slate-400">
                        {item.label}
                      </span>
                    </div>
                    <p className="font-mono text-xl font-bold text-white">
                      {item.value}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid gap-4 p-4 lg:grid-cols-[1fr_260px]">
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {metrics.map((m) => {
                const Icon = m.icon;
                const isPositive = m.change >= 0;

                return (
                  <div
                    key={m.label}
                    className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm transition hover:border-cyan-400/30"
                  >
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <p className="text-xs font-medium text-slate-400">
                        {m.label}
                      </p>
                      <span
                        className={`flex h-9 w-9 items-center justify-center rounded-lg border ${toneClass[m.tone]}`}
                      >
                        <Icon size={16} />
                      </span>
                    </div>

                    <p className="font-mono text-2xl font-bold text-white">
                      {m.value}
                    </p>

                    <div
                      className={`mt-3 flex items-center gap-1 text-xs ${
                        isPositive ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      {isPositive ? (
                        <TrendingUp size={12} />
                      ) : (
                        <TrendingDown size={12} />
                      )}
                      {formatPercentage(m.change)}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-400">
                    Milestone Progress
                  </p>
                  <p className="mt-1 font-mono text-2xl font-bold text-white">
                    {milestoneStats.progress.toFixed(1)}%
                  </p>
                </div>
                <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-cyan-400/20 bg-cyan-400/10 text-cyan-300">
                  <Target size={18} />
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-linear-to-r from-cyan-400 to-emerald-400"
                  style={{
                    width: `${Math.min(100, milestoneStats.progress)}%`,
                  }}
                />
              </div>

              <p className="mt-3 text-xs text-slate-400">
                {formatCurrency(milestoneStats.totalTarget)} total target
              </p>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 rounded-lg bg-cyan-400/10">
                <TrendingUp size={16} />
              </div>
              <h2 className="text-sm font-semibold">
                Revenue Trend
              </h2>
            </div>
            <RevenueChart data={revenueData} type="line" isLoading={isLoading} />
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 rounded-lg bg-cyan-400/10">
                <BarChart3 size={16} />
              </div>
              <h2 className="text-sm font-semibold">
                Monthly Revenue
              </h2>
            </div>
            <RevenueChart data={revenueData} type="bar" isLoading={isLoading} />
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-6 shadow-sm">
            <h2 className="text-sm font-semibold mb-6">
              Revenue by Category
            </h2>
            <CategoryChart data={categoryData} />
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-6 shadow-sm">
            <h2 className="text-sm font-semibold mb-6">
              Top Customers
            </h2>

            {topCustomers.length === 0 ? (
              <div className="py-12 text-center text-sm text-slate-400">
                Add completed transactions to see customer rankings.
              </div>
            ) : (
              <div className="space-y-4">
                {topCustomers.map((c, i) => {
                  const max = topCustomers[0]?.revenue || 1;
                  const pct = (c.revenue / max) * 100;

                  return (
                    <div key={c.name} className="p-3 rounded-lg hover:bg-muted/40 transition">
                      <div className="flex justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold ${
                            i === 0
                              ? "bg-amber-400/20 text-amber-400"
                              : "bg-cyan-400/10 text-cyan-400"
                          }`}>
                            #{i + 1}
                          </div>

                          <div>
                            <p className="text-sm font-medium">
                              {c.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {c.orders} orders
                            </p>
                          </div>
                        </div>

                        <p className="text-sm font-semibold font-mono">
                          {formatCurrency(c.revenue)}
                        </p>
                      </div>

                      <div className="h-2 bg-muted rounded-full">
                        <div
                          className="h-full bg-linear-to-r from-cyan-400 to-emerald-400 rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </AppLayout>
  );
}
