import { useEffect, useMemo, useState } from "react";
import { Search, Crown, Users as UsersIcon } from "lucide-react";

import AppLayout from "../layouts/AppLayout";
import Topbar from "../layouts/TopBar";

import { formatCurrency, formatDate } from "../lib/utils";
import { customersDb } from "../lib/data";
import { getApiError } from "../lib/api";
import { toast } from "react-hot-toast";

const getStatusColor = (status) => {
  if (status === "active") {
    return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
  }
  return "bg-slate-500/10 text-slate-400 border-slate-600/20";
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

        const savedByName = new Map(
          saved.map((c) => [c.name, c])
        );

        setCustomers(
          summaries.map((summary) => {
            const savedCustomer = savedByName.get(summary._id) || {};

            return {
              id: savedCustomer._id || summary._id,
              name: summary._id || savedCustomer.name || "Unknown",
              email: savedCustomer.email || "",
              totalSpent: summary.totalSpent || 0,
              transactionCount: summary.transactionCount || 0,
              lastPurchase: summary.lastPurchase,
              status: savedCustomer.status || "active",
            };
          })
        );
      })
      .catch((err) =>
        toast.error(getApiError(err, "Could not load customers"))
      );
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
    (sum, c) => sum + (c.totalSpent || 0),
    0
  );

  const topCustomer = customers[0];

  return (
    <AppLayout>
      <Topbar
        title="Customers"
        subtitle={`${customers.length} total customers`}
      />

      <main className="flex-1 p-3 sm:p-4 lg:p-6 space-y-6">

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-slate-400">
                Total Customers
              </p>
              <UsersIcon size={15} className="text-cyan-400" />
            </div>
            <p className="text-2xl font-bold text-white">
              {customers.length}
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-slate-400">
                Top Customer
              </p>
              <Crown size={15} className="text-emerald-400" />
            </div>

            <p className="text-sm sm:text-lg font-bold text-white truncate">
              {topCustomer?.name || "-"}
            </p>

            <p className="text-xs text-slate-400">
              {topCustomer
                ? formatCurrency(topCustomer.totalSpent)
                : ""}
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-slate-400">
                Total Revenue
              </p>
              <span className="text-amber-400 text-xs font-bold">
                GHC
              </span>
            </div>

            <p className="text-2xl font-bold text-white">
              {formatCurrency(totalRevenue)}
            </p>
          </div>
        </div>

        {/* TABLE WRAPPER */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">

          {/* SEARCH */}
          <div className="p-3 sm:p-4 border-b border-slate-800">
            <div className="relative w-full sm:max-w-sm">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search customers..."
                className="w-full pl-8 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white"
              />
            </div>
          </div>

          {/* DESKTOP HEADER */}
          <div className="hidden md:grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-5 py-2 text-xs text-slate-400 uppercase border-b border-slate-800">
            <div>Customer</div>
            <div className="text-right">Spent</div>
            <div className="text-center">Orders</div>
            <div className="text-center">Last</div>
            <div className="text-center">Status</div>
          </div>

          {/* LIST */}
          {filtered.length === 0 ? (
            <div className="py-16 text-center text-sm text-slate-400">
              No customers found
            </div>
          ) : (
            <div className="divide-y divide-slate-800">

              {filtered.map((c, i) => (
                <div
                  key={c.id}
                  className="
                    flex flex-col gap-2
                    md:grid md:grid-cols-[1fr_auto_auto_auto_auto]
                    md:gap-4
                    px-4 sm:px-5 py-4
                    hover:bg-slate-800/40 transition
                  "
                >

                  {/* CUSTOMER */}
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${
                        i === 0
                          ? "bg-amber-400/20 text-amber-400"
                          : "bg-emerald-500/10 text-emerald-400"
                      }`}
                    >
                      {i === 0 ? (
                        <Crown size={14} />
                      ) : (
                        c.name.charAt(0)
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm text-white truncate">
                        {c.name}
                      </p>
                      <p className="text-xs text-slate-400 truncate">
                        {c.email || "No email"}
                      </p>
                    </div>
                  </div>

                  {/* SPENT */}
                  <div className="md:text-right text-white font-mono text-sm">
                    {formatCurrency(c.totalSpent)}
                  </div>

                  {/* ORDERS */}
                  <div className="md:text-center text-white text-sm">
                    {c.transactionCount}
                  </div>

                  {/* DATE */}
                  <div className="md:text-center text-slate-400 text-xs">
                    {c.lastPurchase
                      ? formatDate(c.lastPurchase)
                      : "-"}
                  </div>

                  {/* STATUS */}
                  <div className="md:text-center">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-xs border ${getStatusColor(
                        c.status
                      )}`}
                    >
                      {c.status}
                    </span>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </AppLayout>
  );
}