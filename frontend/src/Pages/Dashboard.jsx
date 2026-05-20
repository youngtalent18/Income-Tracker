import { useEffect, useMemo, useState } from "react";

import {
  DollarSign,
  Users,
  ShoppingCart,
  TrendingUp,
  Plus,
} from "lucide-react";
import { toast } from "react-hot-toast";

import AppLayout from "../layouts/AppLayout";
import Topbar from "../layouts/TopBar";

import StatCard from "../Components/StatCard";
import RevenueChart from "../Components/RevenueChart";
import CategoryChart from "../Components/CategoryChart";
import TransactionRow from "../Components/TransactionRow";
import AddTransactionModal from "../Components/AddTransactionModal";
import MilestoneCard from "../features/MilestoneCard";

import { normalizeCategory } from "../constants/constant";
import { milestonesDb, transactionsDb } from "../lib/data";
import { getApiError } from "../lib/api";

const isCompleted = (t) => t?.status === "completed";

export default function Dashboard() {
  const [range, setRange] = useState("monthly");
  const [showAddTx, setShowAddTx] = useState(false);

  const [transactions, setTransactions] = useState([]);
  const [milestones, setMilestones] = useState([]);

  // ---------------- LOAD ----------------
  useEffect(() => {
    let mounted = true;

    Promise.all([
      transactionsDb.getAll(),
      milestonesDb.getAll(),
    ])
      .then(([txs, goals]) => {
        if (!mounted) return;
        setTransactions(txs || []);
        setMilestones(goals || []);
      })
      .catch((err) =>
        toast.error(getApiError(err, "Dashboard load failed"))
      );

    return () => {
      mounted = false;
    };
  }, []);

  // ---------------- ADD TRANSACTION ----------------
  const addTransaction = async (tx) => {
    try {
      const newTx = await transactionsDb.add(tx);
      setTransactions((prev) => [newTx, ...prev]);
      toast.success("Transaction added");
    } catch (err) {
      toast.error(getApiError(err, "Add failed"));
    }
  };

  // ---------------- STATS ----------------
  const stats = useMemo(() => {
    const completed = transactions.filter(isCompleted);

    const totalRevenue = completed.reduce(
      (sum, t) => sum + Number(t?.amount || 0),
      0
    );

    const totalOrders = completed.length;

    const totalCustomers = new Set(
      completed
        .map((t) => t?.customerName)
        .filter(Boolean)
    ).size;

    return {
      totalRevenue,
      totalCustomers,
      totalOrders,
      avgOrderValue:
        totalOrders > 0 ? totalRevenue / totalOrders : 0,
      revenueChange: 12.5,
      customerChange: 8.2,
      ordersChange: 15.1,
      avgOrderChange: 4.3,
    };
  }, [transactions]);

  // ---------------- CHART ----------------
  const chartData = useMemo(() => {
    return transactions
      .filter(isCompleted)
      .slice(0, 7)
      .map((t) => ({
        date: t?.product || "N/A",
        revenue: Number(t?.amount || 0),
        orders: 1,
      }));
  }, [transactions]);

  // ---------------- CATEGORY ----------------
  const categoryData = useMemo(() => {
    const grouped = {};

    transactions.filter(isCompleted).forEach((t) => {
      const key = normalizeCategory(t?.category);
      grouped[key] = (grouped[key] || 0) + Number(t?.amount || 0);
    });

    const total = Object.values(grouped).reduce(
      (s, v) => s + v,
      0
    );

    return Object.entries(grouped).map(([category, revenue]) => ({
      category,
      revenue,
      percentage: total ? Math.round((revenue / total) * 100) : 0,
    }));
  }, [transactions]);

  const recentTxs = transactions.slice(0, 8);
  const activeMilestones = milestones.slice(0, 3);

  return (
    <AppLayout>
      <Topbar
        title="Dashboard"
        subtitle="Revenue overview & key metrics"
        range={range}
        onRangeChange={setRange}
      />

      <main className="flex-1 p-4 lg:p-6 space-y-6">

        {/* ---------------- STATS ---------------- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            title="Total Revenue"
            value={stats.totalRevenue}
            change={stats.revenueChange}
            icon={DollarSign}
            format="currency"
            color="cyan"
          />

          <StatCard
            title="Customers"
            value={stats.totalCustomers}
            change={stats.customerChange}
            icon={Users}
            format="number"
            color="emerald"
          />

          <StatCard
            title="Orders"
            value={stats.totalOrders}
            change={stats.ordersChange}
            icon={ShoppingCart}
            format="number"
            color="amber"
          />

          <StatCard
            title="Avg Order"
            value={stats.avgOrderValue}
            change={stats.avgOrderChange}
            icon={TrendingUp}
            format="currency"
            color="cyan"
          />
        </div>

        {/* ---------------- CHARTS ---------------- */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="xl:col-span-2 bg-gray-900 border border-slate-700 rounded-xl p-5 overflow-hidden">
            <RevenueChart data={chartData} type="line" />
          </div>

          <div className="bg-gray-900 border border-slate-700 rounded-xl p-5">
            <CategoryChart data={categoryData} />
          </div>
        </div>

        {/* ---------------- MILESTONES ---------------- */}
        {activeMilestones.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {activeMilestones.map((m) => (
              <MilestoneCard
                key={m._id || m.id}
                milestone={m}
              />
            ))}
          </div>
        )}

        {/* ---------------- TRANSACTIONS ---------------- */}
        <div className="bg-gray-900 border border-slate-700 rounded-xl overflow-hidden">

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-700">
            <h2 className="text-sm font-semibold text-white">
              Recent Transactions
            </h2>

            <button
              onClick={() => setShowAddTx(true)}
              className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-cyan-500 text-xs font-medium hover:opacity-90 transition w-full sm:w-auto"
            >
              <Plus size={12} />
              Add Transaction
            </button>
          </div>

          {recentTxs.length === 0 ? (
            <div className="p-10 text-center text-slate-400">
              No transactions yet
            </div>
          ) : (
            <div className="divide-y divide-slate-800">
              {recentTxs.map((tx) => (
                <TransactionRow
                  key={tx._id || tx.id}
                  transaction={tx}
                  compact
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <AddTransactionModal
        open={showAddTx}
        onClose={() => setShowAddTx(false)}
        onAdd={addTransaction}
      />
    </AppLayout>
  );
}