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

const isCompletedTransaction = (transaction) =>
  transaction.status === "completed";

export default function Dashboard() {
  const [range, setRange] = useState("monthly");
  const [showAddTx, setShowAddTx] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [milestones, setMilestones] = useState([]);

  useEffect(() => {
    let mounted = true;

    Promise.all([transactionsDb.getAll(), milestonesDb.getAll()])
      .then(([txs, goals]) => {
        if (!mounted) return;
        setTransactions(txs);
        setMilestones(goals);
      })
      .catch((err) => toast.error(getApiError(err, "Could not load dashboard")));

    return () => {
      mounted = false;
    };
  }, []);

  const addTransaction = async (transaction) => {
    try {
      const newTx = await transactionsDb.add(transaction);
      setTransactions((prev) => [newTx, ...prev]);
      toast.success("Transaction added");
    } catch (err) {
      toast.error(getApiError(err, "Could not add transaction"));
    }
  };

  const stats = useMemo(() => {
    const completed = transactions.filter(isCompletedTransaction);

    const totalRevenue = completed.reduce(
      (sum, t) => sum + Number(t.amount || 0),
      0
    );

    const totalOrders = completed.length;

    const totalCustomers = new Set(
      completed.map((t) => t.customerName).filter(Boolean)
    ).size;

    return {
      totalRevenue,
      totalCustomers,
      totalOrders,
      avgOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
      revenueChange: 12.5,
      customerChange: 8.2,
      ordersChange: 15.1,
      avgOrderChange: 4.3,
    };
  }, [transactions]);

  const chartData = useMemo(() => {
    return transactions.filter(isCompletedTransaction).slice(0, 7).map((t) => ({
      date: t.product,
      revenue: Number(t.amount || 0),
      orders: 1,
    }));
  }, [transactions]);

  const categoryData = useMemo(() => {
    const grouped = {};

    transactions.filter(isCompletedTransaction).forEach((t) => {
      const category = normalizeCategory(t.category);
      grouped[category] = (grouped[category] || 0) + Number(t.amount || 0);
    });

    const total = Object.values(grouped).reduce((sum, value) => sum + value, 0);

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
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
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
            title="Total Orders"
            value={stats.totalOrders}
            change={stats.ordersChange}
            icon={ShoppingCart}
            format="number"
            color="amber"
          />

          <StatCard
            title="Avg Order Value"
            value={stats.avgOrderValue}
            change={stats.avgOrderChange}
            icon={TrendingUp}
            format="currency"
            color="cyan"
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="xl:col-span-2 bg-gray-900 border border-slate-700 rounded-xl p-5">
            <RevenueChart data={chartData} type="line" />
          </div>

          <div className="bg-gray-900 border border-slate-700 rounded-xl p-5">
            <CategoryChart data={categoryData} />
          </div>
        </div>

        {activeMilestones.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {activeMilestones.map((m) => (
              <MilestoneCard key={m._id || m.id} milestone={m} />
            ))}
          </div>
        )}

        <div className="bg-gray-900 border border-slate-700 rounded-xl">
          <div className="flex justify-between px-5 py-4 border-b border-gray-700">
            <h2 className="text-sm font-semibold text-white">
              Recent Transactions
            </h2>

            <button
              onClick={() => setShowAddTx(true)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cyan-500 text-xs"
            >
              <Plus size={12} />
              Add
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
