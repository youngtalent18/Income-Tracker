import { useState, useMemo, useEffect } from "react";
import { Plus, Search, Filter } from "lucide-react";

import AppLayout from "../layouts/AppLayout";
import Topbar from "../layouts/TopBar";
import TransactionRow from "../Components/TransactionRow";
import AddTransactionModal from "../Components/AddTransactionModal";

import {
  CATEGORIES,
  normalizeCategory,
  TRANSACTION_STATUSES,
} from "../constants/constant";

import { formatCurrency } from "../lib/utils";

import { toast } from "react-hot-toast";
import { transactionsDb } from "../lib/data";
import { getApiError } from "../lib/api";

export default function Transactions() {
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");

  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    transactionsDb
      .getAll()
      .then(setTransactions)
      .catch((err) =>
        toast.error(getApiError(err, "Could not load transactions"))
      )
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const matchSearch =
        !search ||
        (t.customerName || "")
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        (t.product || "")
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        (t.customerEmail || "")
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchStatus =
        filterStatus === "all" || t.status === filterStatus;

      const matchCategory =
        filterCategory === "all" ||
        normalizeCategory(t.category) === filterCategory;

      return matchSearch && matchStatus && matchCategory;
    });
  }, [transactions, search, filterStatus, filterCategory]);

  const totalFiltered = filtered
    .filter((t) => t.status === "completed")
    .reduce((s, t) => s + Number(t.amount || 0), 0);

  const selectCls =
    "w-full sm:w-auto bg-gray-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary";

  return (
    <AppLayout>
      <Topbar
        title="Transactions"
        subtitle={`${filtered.length} records · ${formatCurrency(
          totalFiltered
        )} total`}
      />

      <main className="flex-1 p-3 sm:p-4 lg:p-6">
        <div className="bg-gray-900 border border-slate-700 rounded-xl overflow-hidden">

          {/* TOOLBAR */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-4 sm:px-5 py-4 border-b border-slate-700">

            {/* SEARCH */}
            <div className="relative w-full sm:max-w-xs">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search customer, product..."
                className="w-full pl-8 pr-3 py-2 bg-gray-800 border border-slate-700 rounded-lg text-sm"
              />
            </div>

            {/* FILTERS */}
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">

              <div className="flex items-center gap-2">
                <Filter size={14} className="text-gray-300 hidden sm:block" />

                <select
                  className={selectCls}
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Status</option>
                  {TRANSACTION_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <select
                className={selectCls}
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <button
                onClick={() => setShowAdd(true)}
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-linear-to-br from-cyan-400 to-emerald-500 text-black text-sm font-semibold w-full sm:w-auto"
              >
                <Plus size={14} />
                New
              </button>
            </div>
          </div>

          {/* DESKTOP HEADER */}
          <div className="hidden md:grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-3 px-4 py-2.5 border-b border-slate-700 text-xs text-muted-foreground uppercase">
            <div className="w-8" />
            <div>Customer / Product</div>
            <div className="w-20 text-center">Category</div>
            <div className="w-28 text-right">Amount</div>
            <div className="w-24 text-center">Status</div>
            <div className="w-8" />
          </div>

          {/* ROWS */}
          {isLoading ? (
            <div className="py-16 text-center text-sm text-muted-foreground">
              Loading...
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-sm text-muted-foreground">
              No transactions found
            </div>
          ) : (
            <div className="divide-y divide-slate-800">
              {filtered.map((tx) => (
                <TransactionRow
                  key={tx._id || tx.id}
                  transaction={tx}
                />
              ))}
            </div>
          )}

          {/* FOOTER */}
          {filtered.length > 0 && (
            <div className="px-4 sm:px-5 py-3 border-t border-slate-700 text-xs flex flex-col sm:flex-row gap-1 sm:justify-between text-muted-foreground">
              <span>
                Showing {filtered.length} of {transactions.length}
              </span>
              <span className="text-white font-medium">
                {formatCurrency(totalFiltered)} completed
              </span>
            </div>
          )}
        </div>
      </main>

      <AddTransactionModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onAdd={async (tx) => {
          try {
            const newTx = await transactionsDb.add(tx);
            setTransactions((prev) => [newTx, ...prev]);
            toast.success("Transaction added");
          } catch (err) {
            toast.error(getApiError(err, "Could not add transaction"));
          }
        }}
      />
    </AppLayout>
  );
}