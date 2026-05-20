import {
  Shield,
  Users,
  DollarSign,
  Activity,
  Database,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import AppLayout from "../layouts/AppLayout";
import Topbar from "../layouts/TopBar";
import { getApiError } from "../lib/api";
import { adminDb } from "../lib/data";

// ---------------- FORMAT ----------------
const formatCurrency = (num) =>
  `GHC ${Number(num || 0).toLocaleString()}`;

export default function AdminPanel() {
  const [overview, setOverview] = useState({
    stats: {
      totalUsers: 0,
      totalCustomers: 0,
      totalTransactions: 0,
      totalRevenue: 0,
      completionRate: 0,
      pendingCount: 0,
      failedCount: 0,
    },
    recentTransactions: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    adminDb
      .overview()
      .then(setOverview)
      .catch((err) => toast.error(getApiError(err, "Could not load admin data")))
      .finally(() => setIsLoading(false));
  }, []);

  const { stats, recentTransactions: transactions } = overview;

  const systemStats = [
    {
      label: "Total Transactions",
      value: stats.totalTransactions,
      icon: Database,
      color: "cyan",
    },
    {
      label: "Total Revenue",
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      color: "emerald",
    },
    {
      label: "Total Customers",
      value: stats.totalCustomers,
      icon: Users,
      color: "amber",
    },
    {
      label: "Total Users",
      value: stats.totalUsers,
      icon: Shield,
      color: "emerald",
    },
    {
      label: "Completion Rate",
      value: `${stats.completionRate}%`,
      icon: Activity,
      color: "cyan",
    },
  ];

  const colorMap = {
    cyan: "text-cyan-400 bg-cyan-400/10",
    emerald: "text-emerald-400 bg-emerald-400/10",
    amber: "text-amber-400 bg-amber-400/10",
  };

  return (
    <AppLayout>
      <Topbar
        title="Admin Panel"
        subtitle="System overview & management"
      />

      <main className="flex-1 p-4 lg:p-6 space-y-6">
        {isLoading && (
          <div className="text-sm text-slate-400">Loading admin overview...</div>
        )}

        {/* ADMIN BANNER */}
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
            <Shield size={20} className="text-emerald-400" />
          </div>

          <div>
            <h2 className="font-semibold text-white">
              Administrator Access
            </h2>

            <p className="text-sm text-slate-400">
              You have full access to all system data and settings
            </p>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 xl:grid-cols-5 gap-4">
          {systemStats.map(
            ({ label, value, icon: Icon, color }) => (
              <div
                key={label}
                className="bg-slate-900 border border-slate-800 rounded-xl p-4"
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${colorMap[color]}`}
                >
                  <Icon size={15} />
                </div>

                <p className="text-xs text-slate-400 mb-1">
                  {label}
                </p>

                <p className="text-xl font-bold text-white">
                  {value}
                </p>
              </div>
            )
          )}
        </div>

        {/* ALERTS + ACTIVITY */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* ALERTS */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-white mb-4">
              Transaction Alerts
            </h3>

            <div className="space-y-3">

              {stats.pendingCount > 0 && (
                <div className="flex justify-between p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <span className="text-amber-400">Pending</span>
                  <span className="text-amber-400 font-bold">
                    {stats.pendingCount}
                  </span>
                </div>
              )}

              {stats.failedCount > 0 && (
                <div className="flex justify-between p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                  <span className="text-red-400">Failed</span>
                  <span className="text-red-400 font-bold">
                    {stats.failedCount}
                  </span>
                </div>
              )}

              {stats.pendingCount === 0 && stats.failedCount === 0 && (
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  All transactions nominal
                </div>
              )}
            </div>
          </div>

          {/* RECENT ACTIVITY */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-white mb-4">
              Recent Activity
            </h3>

            {transactions.length === 0 ? (
              <p className="text-slate-400 text-sm">
                No transactions yet
              </p>
            ) : (
              transactions.slice(0, 5).map((t) => (
                <div
                  key={t._id || t.id}
                  className="flex justify-between text-sm mb-2"
                >
                  <span className="text-white">
                    {t.customerName}
                  </span>

                  <span className="text-white">
                    {formatCurrency(t.amount)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">

          <div className="px-5 py-4 border-b border-slate-800">
            <h3 className="text-sm font-semibold text-white">
              All Transactions
            </h3>
          </div>

          <table className="w-full text-sm">
            <thead className="bg-slate-800/50 text-slate-400">
              <tr>
                <th className="px-5 py-3 text-left">Customer</th>
                <th className="px-4 py-3 text-left">Product</th>
                <th className="px-4 py-3 text-right">Amount</th>
              </tr>
            </thead>

            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td
                    colSpan="3"
                    className="text-center py-6 text-slate-400"
                  >
                    No transactions found
                  </td>
                </tr>
              ) : (
                transactions.map((t) => (
                  <tr
                    key={t._id || t.id}
                    className="border-b border-slate-800"
                  >
                    <td className="px-5 py-3 text-white">
                      {t.customerName}
                    </td>

                    <td className="px-4 py-3 text-slate-400">
                      {t.product}
                    </td>

                    <td className="px-4 py-3 text-right text-white">
                      {formatCurrency(t.amount)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </main>
    </AppLayout>
  );
}
