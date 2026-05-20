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

  const [filterStatus, setFilterStatus] =
    useState("all");

  const [filterCategory, setFilterCategory] =
    useState("all");

  const [transactions, setTransactions] =
    useState([]);

  const [isLoading, setIsLoading] =
    useState(true);

  // LOAD TRANSACTIONS
  useEffect(() => {
    transactionsDb
      .getAll()
      .then(setTransactions)
      .catch((err) =>
        toast.error(
          getApiError(
            err,
            "Could not load transactions"
          )
        )
      )
      .finally(() => setIsLoading(false));
  }, []);

  // FILTERED DATA
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
        filterStatus === "all" ||
        t.status === filterStatus;

      const matchCategory =
        filterCategory === "all" ||
        normalizeCategory(t.category) ===
          filterCategory;

      return (
        matchSearch &&
        matchStatus &&
        matchCategory
      );
    });
  }, [
    transactions,
    search,
    filterStatus,
    filterCategory,
  ]);

  // TOTAL
  const totalFiltered = filtered
    .filter((t) => t.status === "completed")
    .reduce(
      (sum, t) => sum + Number(t.amount || 0),
      0
    );

  // STYLES
  const selectCls =
    "w-full sm:w-auto bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500";

  // DELETE TRANSACTION
  const handleDelete = async (id) => {
    try {
      await transactionsDb.remove(id);

      setTransactions((prev) =>
        prev.filter(
          (t) => (t._id || t.id) !== id
        )
      );

      toast.success("Transaction deleted");
    } catch (err) {
      toast.error(
        getApiError(
          err,
          "Could not delete transaction"
        )
      );
    }
  };

  // MARK COMPLETED
  const handleMarkDone = async (id) => {
    try {
      const updated =
        await transactionsDb.update(id, {
          status: "completed",
        });

      setTransactions((prev) =>
        prev.map((t) =>
          (t._id || t.id) === id
            ? updated
            : t
        )
      );

      toast.success(
        "Transaction marked completed"
      );
    } catch (err) {
      toast.error(
        getApiError(
          err,
          "Could not update transaction"
        )
      );
    }
  };

  // ADD TRANSACTION
  const handleAddTransaction = async (tx) => {
    try {
      const newTx =
        await transactionsDb.add(tx);

      setTransactions((prev) => [
        newTx,
        ...prev,
      ]);

      toast.success("Transaction added");
    } catch (err) {
      toast.error(
        getApiError(
          err,
          "Could not add transaction"
        )
      );
    }
  };

  return (
    <AppLayout>
      <Topbar
        title="Transactions"
        subtitle={`${filtered.length} records · ${formatCurrency(
          totalFiltered
        )} total`}
      />

      <main className="flex-1 p-3 sm:p-4 lg:p-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">

          {/* TOOLBAR */}
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 px-4 sm:px-5 py-4 border-b border-slate-800">

            {/* SEARCH */}
            <div className="relative w-full xl:max-w-sm">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search customer, product..."
                className="
                  w-full
                  pl-9
                  pr-3
                  py-2.5
                  bg-slate-800
                  border
                  border-slate-700
                  rounded-xl
                  text-sm
                  text-white
                  placeholder:text-slate-400
                  focus:outline-none
                  focus:ring-2
                  focus:ring-cyan-500
                "
              />
            </div>

            {/* FILTERS */}
            <div className="flex flex-col sm:flex-row gap-2 w-full xl:w-auto">

              {/* STATUS */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter
                  size={14}
                  className="text-slate-400 hidden sm:block"
                />

                <select
                  className={selectCls}
                  value={filterStatus}
                  onChange={(e) =>
                    setFilterStatus(e.target.value)
                  }
                >
                  <option value="all">
                    All Status
                  </option>

                  {TRANSACTION_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* CATEGORY */}
              <select
                className={selectCls}
                value={filterCategory}
                onChange={(e) =>
                  setFilterCategory(
                    e.target.value
                  )
                }
              >
                <option value="all">
                  All Categories
                </option>

                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              {/* ADD BUTTON */}
              <button
                onClick={() => setShowAdd(true)}
                className="
                  flex
                  items-center
                  justify-center
                  gap-2
                  px-4
                  py-2.5
                  rounded-xl
                  bg-linear-to-r
                  from-cyan-400
                  to-emerald-500
                  text-black
                  text-sm
                  font-semibold
                  hover:opacity-90
                  transition-all
                  shadow-lg
                  shadow-cyan-500/10
                "
              >
                <Plus size={15} />
                New Transaction
              </button>
            </div>
          </div>

          {/* DESKTOP HEADER */}
          <div className="hidden md:grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-3 px-4 py-3 border-b border-slate-800 text-[11px] font-medium tracking-wider text-slate-400 uppercase bg-slate-950/40">
            <div className="w-8" />

            <div>Customer / Product</div>

            <div className="w-24 text-center">
              Category
            </div>

            <div className="w-32 text-right">
              Amount
            </div>

            <div className="w-24 text-center">
              Status
            </div>

            <div className="w-20 text-center">
              Actions
            </div>
          </div>

          {/* ROWS */}
          {isLoading ? (
            <div className="py-20 text-center text-sm text-slate-400">
              Loading transactions...
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-sm text-slate-400">
                No transactions found
              </p>

              <button
                onClick={() => setShowAdd(true)}
                className="mt-4 text-cyan-400 text-sm hover:underline"
              >
                Add your first transaction
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-800">
              {filtered.map((tx) => (
                <TransactionRow
                  key={tx._id || tx.id}
                  transaction={tx}
                  onDelete={handleDelete}
                  onMarkDone={handleMarkDone}
                />
              ))}
            </div>
          )}

          {/* FOOTER */}
          {filtered.length > 0 && (
            <div className="px-4 sm:px-5 py-3 border-t border-slate-800 bg-slate-950/30">
              <div className="flex flex-col sm:flex-row gap-1 sm:items-center sm:justify-between text-xs">
                <span className="text-slate-400">
                  Showing {filtered.length} of{" "}
                  {transactions.length} transactions
                </span>

                <span className="font-semibold text-white">
                  {formatCurrency(totalFiltered)}{" "}
                  completed revenue
                </span>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ADD MODAL */}
      <AddTransactionModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onAdd={handleAddTransaction}
      />
    </AppLayout>
  );
}