import { useState, useMemo, useEffect } from 'react';
import { Plus, Search, Filter } from 'lucide-react';

import AppLayout from '../layouts/AppLayout';
import Topbar from '../layouts/TopBar';
import TransactionRow from '../Components/TransactionRow';
import AddTransactionModal from '../Components/AddTransactionModal';

import {
  CATEGORIES,
  normalizeCategory,
  TRANSACTION_STATUSES,
} from '../constants/constant';

import {
  cn,
  formatCurrency,
} from '../lib/utils';

import { toast } from 'react-hot-toast';
import { transactionsDb } from '../lib/data';
import { getApiError } from '../lib/api';

export default function Transactions() {
  const [showAdd, setShowAdd] = useState(false);

  const [search, setSearch] = useState('');

  const [filterStatus, setFilterStatus] =
    useState('all');

  const [filterCategory, setFilterCategory] =
    useState('all');

  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    transactionsDb
      .getAll()
      .then(setTransactions)
      .catch((err) => toast.error(getApiError(err, 'Could not load transactions')))
      .finally(() => setIsLoading(false));
  }, []);

  const addTransaction = async (transaction) => {
    const newTransaction = await transactionsDb.add(transaction);
    setTransactions((prev) => [newTransaction, ...prev]);
  };

  const deleteTransaction = async (id) => {
    await transactionsDb.remove(id);
    setTransactions((prev) => prev.filter((t) => (t._id || t.id) !== id));
  };

  const updateTransaction = async (id, updates) => {
    const updated = await transactionsDb.update(id, updates);
    setTransactions((prev) =>
      prev.map((t) => ((t._id || t.id) === id ? updated : t))
    );
  };

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const matchSearch =
        !search ||
        (t.customerName || '')
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        (t.product || '')
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        (t.customerEmail || '')
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchStatus =
        filterStatus === 'all' ||
        t.status === filterStatus;

      const matchCategory =
        filterCategory === 'all' ||
        normalizeCategory(t.category) === filterCategory;

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

  const totalFiltered = filtered
    .filter((t) => t.status === 'completed')
    .reduce((s, t) => s + Number(t.amount || 0), 0);

  const handleDelete = async (id) => {
    try {
      await deleteTransaction(id);
      toast.success('Transaction deleted');
    } catch (err) {
      toast.error(getApiError(err, 'Could not delete transaction'));
    }
  };

  const handleMarkDone = async (id) => {
    try {
      await updateTransaction(id, { status: 'completed' });
      toast.success('Transaction marked done');
    } catch (err) {
      toast.error(getApiError(err, 'Could not update transaction'));
    }
  };

  const selectCls =
    'bg-gray-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary';

  return (
    <AppLayout>
      <Topbar
        title="Transactions"
        subtitle={`${filtered.length} records · ${formatCurrency(
          totalFiltered
        )} total`}
      />

      <main className="flex-1 p-4 lg:p-6">
        <div className="bg-gray-900 border border-slate-700 rounded-xl">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 px-5 py-4 border-b border-slate-700">
            <div className="relative flex-1 w-full sm:max-w-xs">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />

              <input
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search customer, product..."
                className="w-full pl-8 pr-3 py-2 bg-gray-800 border border-slate-700 rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Filter
                size={14}
                className="text-gray-300"
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
                    {s.charAt(0).toUpperCase() +
                      s.slice(1)}
                  </option>
                ))}
              </select>

              <select
                className={selectCls}
                value={filterCategory}
                onChange={(e) =>
                  setFilterCategory(e.target.value)
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

              <button
                onClick={() => setShowAdd(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-linear-to-br from-cyan-400 to-emerald-500 text-gray-200 text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                <Plus size={14} />
                New
              </button>
            </div>
          </div>

          {/* Header Row */}
          <div className="hidden md:grid grid-cols-[auto_1fr_auto_auto_auto_auto] items-center gap-3 px-4 py-2.5 border-b border-slate-700 text-xs font-medium text-muted-foreground uppercase tracking-wide">
            <div className="w-8" />

            <div>Customer / Product</div>

            <div className="w-20 text-center">
              Category
            </div>

            <div className="w-28 text-right">
              Amount
            </div>

            <div className="w-24 text-center">
              Status
            </div>

            <div className="w-8" />
          </div>

          {/* Rows */}
          {isLoading ? (
            <div className="py-16 text-center text-muted-foreground text-sm">
              Loading transactions...
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-muted-foreground text-sm">
                No transactions found
              </p>

              <button
                onClick={() => setShowAdd(true)}
                className="mt-3 text-sm text-gray-300 hover:underline"
              >
                Add first transaction
              </button>
            </div>
          ) : (
            <div>
              {filtered.map((tx) => (
                <TransactionRow
                  key={tx._id || tx.id}
                  transaction={tx}
                  onMarkDone={handleMarkDone}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}

          {filtered.length > 0 && (
            <div
              className={cn(
                'px-5 py-3 border-t border-slate-600 text-xs text-muted-foreground flex items-center justify-between'
              )}
            >
              <span>
                Showing {filtered.length} of{' '}
                {transactions.length} transactions
              </span>

              <span className="font-medium text-foreground">
                {formatCurrency(totalFiltered)} total
                (completed)
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
            await addTransaction(tx);
            toast.success('Transaction added');
          } catch (err) {
            toast.error(getApiError(err, 'Could not add transaction'));
          }
        }}
      />
    </AppLayout>
  );
}
