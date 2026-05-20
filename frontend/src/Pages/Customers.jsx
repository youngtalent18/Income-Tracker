import { useEffect, useMemo, useState } from "react";
import { Search, Crown, Users as UsersIcon } from "lucide-react";
import AppLayout from "../layouts/AppLayout";
import Topbar from "../layouts/TopBar";
import { formatCurrency, formatDate } from "../lib/utils";
import { customersDb } from "../lib/data";
import { getApiError } from "../lib/api";
import { toast } from "react-hot-toast";

const getStatusColor = (status) => {
  if (status === "active") return "bg-emerald-500/10 text-emerald-400";
  return "bg-slate-500/10 text-slate-400";
};

export default function Customers() {
  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    customersDb
      .getAll()
      .then((data) => {
        const saved = data.customers || [];
        const summaries = data.summaries || [];
        const savedByName = new Map(saved.map((customer) => [customer.name, customer]));

        setCustomers(
          summaries.map((summary) => {
            const savedCustomer = savedByName.get(summary._id) || {};
            return {
              id: savedCustomer._id || summary._id,
              name: summary._id || savedCustomer.name || "Unknown Customer",
              email: savedCustomer.email || "",
              totalSpent: summary.totalSpent || 0,
              transactionCount: summary.transactionCount || 0,
              lastPurchase: summary.lastPurchase,
              status: savedCustomer.status || "active",
            };
          })
        );
      })
      .catch((err) => toast.error(getApiError(err, "Could not load customers")));
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return customers;

    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q)
    );
  }, [customers, search]);

  const totalRevenue = customers.reduce(
    (sum, customer) => sum + customer.totalSpent,
    0
  );
  const topCustomer = customers[0];

  return (
    <AppLayout>
      <Topbar title="Customers" subtitle={`${customers.length} total customers`} />

      <main className="flex-1 p-4 lg:p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-400/10 flex items-center justify-center">
                <UsersIcon size={15} className="text-cyan-400" />
              </div>
              <p className="text-xs text-slate-400 font-medium">Total Customers</p>
            </div>
            <p className="text-2xl font-bold text-white">{customers.length}</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-400/10 flex items-center justify-center">
                <Crown size={15} className="text-emerald-400" />
              </div>
              <p className="text-xs text-slate-400 font-medium">Top Customer</p>
            </div>
            <p className="text-lg font-bold text-white truncate">
              {topCustomer ? topCustomer.name : "-"}
            </p>
            <p className="text-xs text-slate-400">
              {topCustomer ? formatCurrency(topCustomer.totalSpent) : ""}
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-amber-400/10 flex items-center justify-center">
                <span className="text-amber-400 text-xs font-bold">GHC</span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Customer Revenue</p>
            </div>
            <p className="text-2xl font-bold text-white">
              {formatCurrency(totalRevenue)}
            </p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-800">
            <div className="relative flex-1 max-w-xs">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search customers..."
                className="w-full pl-8 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="hidden md:grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-5 py-2.5 border-b border-slate-800 text-xs text-slate-400 uppercase">
            <div>Customer</div>
            <div className="w-24 text-right">Total Spent</div>
            <div className="w-20 text-center">Orders</div>
            <div className="w-28 text-center">Last Purchase</div>
            <div className="w-16 text-center">Status</div>
          </div>

          {filtered.length === 0 ? (
            <div className="py-16 text-center text-sm text-slate-400">
              No customers found
            </div>
          ) : (
            filtered.map((c, i) => (
              <div
                key={c.id}
                className="flex flex-col md:grid md:grid-cols-[1fr_auto_auto_auto_auto] gap-2 md:gap-4 px-5 py-3.5 border-b border-slate-800 hover:bg-slate-800/40 transition"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      i === 0
                        ? "bg-amber-400/20 text-amber-400"
                        : "bg-emerald-500/10 text-emerald-400"
                    }`}
                  >
                    {i === 0 ? <Crown size={14} /> : c.name.charAt(0)}
                  </div>

                  <div>
                    <p className="text-sm text-white">{c.name}</p>
                    <p className="text-xs text-slate-400">
                      {c.email || "No email saved"}
                    </p>
                  </div>
                </div>

                <div className="text-right text-white font-mono">
                  {formatCurrency(c.totalSpent)}
                </div>

                <div className="text-center text-white">
                  {c.transactionCount}
                </div>

                <div className="text-center text-slate-400 text-xs">
                  {c.lastPurchase ? formatDate(c.lastPurchase) : "-"}
                </div>

                <div className="text-center">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(c.status)}`}>
                    {c.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </AppLayout>
  );
}
