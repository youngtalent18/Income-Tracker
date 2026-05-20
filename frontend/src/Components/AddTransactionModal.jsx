import { useEffect, useState } from "react";
import { X } from "lucide-react";
import {
  CATEGORIES,
  CURRENCIES,
  TRANSACTION_STATUSES,
} from "../constants/constant";

const DEFAULT_CATEGORY = CATEGORIES[0] || "MTN";

export default function AddTransactionModal({ open, onClose, onAdd }) {
  const [form, setForm] = useState({
    customerName: "",
    product: "",
    amount: "",
    currency: "GHC",
    status: "completed",
    category: DEFAULT_CATEGORY,
    notes: "",
  });

  // lock background scroll (important UX fix)
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
    return () => (document.body.style.overflow = "auto");
  }, [open]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.customerName || !form.product || !form.amount) return;

    onAdd({
      id: `tx-${Date.now()}`,
      customerId: `c-${Date.now()}`,
      customerName: form.customerName,
      product: form.product,
      amount: Number(form.amount),
      currency: form.currency,
      status: form.status,
      category: form.category,
      date: new Date().toISOString(),
      notes: form.notes || "",
    });

    setForm({
      customerName: "",
      product: "",
      amount: "",
      currency: "GHC",
      status: "completed",
      category: DEFAULT_CATEGORY,
      notes: "",
    });

    onClose();
  };

  const inputCls =
    "w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-3 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500";

  const labelCls = "block text-xs font-medium text-slate-400 mb-1.5";

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* MODAL */}
      <div className="
        relative bg-slate-900 border border-slate-800 shadow-2xl
        w-full sm:max-w-md sm:rounded-xl
        h-[92vh] sm:h-auto
        flex flex-col
      ">

        {/* HEADER (sticky for mobile) */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-4 sm:px-5 py-4 border-b border-slate-800 bg-slate-900">
          <h2 className="font-semibold text-white text-sm sm:text-base">
            Add Transaction
          </h2>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1"
        >
          {/* CUSTOMER */}
          <div>
            <label className={labelCls}>Customer Name *</label>
            <input
              required
              className={inputCls}
              placeholder="Acme Corp"
              value={form.customerName}
              onChange={(e) =>
                setForm({ ...form, customerName: e.target.value })
              }
            />
          </div>

          {/* PRODUCT */}
          <div>
            <label className={labelCls}>Product *</label>
            <input
              required
              className={inputCls}
              placeholder="Pro License"
              value={form.product}
              onChange={(e) =>
                setForm({ ...form, product: e.target.value })
              }
            />
          </div>

          {/* GRID → STACK ON MOBILE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Amount *</label>
              <input
                required
                type="number"
                min="0"
                step="0.01"
                className={inputCls}
                placeholder="299.00"
                value={form.amount}
                onChange={(e) =>
                  setForm({ ...form, amount: e.target.value })
                }
              />
            </div>

            <div>
              <label className={labelCls}>Currency</label>
              <select
                className={inputCls}
                value={form.currency}
                onChange={(e) =>
                  setForm({ ...form, currency: e.target.value })
                }
              >
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelCls}>Category</label>
              <select
                className={inputCls}
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelCls}>Status</label>
              <select
                className={inputCls}
                value={form.status}
                onChange={(e) =>
                  setForm({ ...form, status: e.target.value })
                }
              >
                {TRANSACTION_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* NOTES */}
          <div>
            <label className={labelCls}>Notes</label>
            <textarea
              rows={3}
              className={inputCls}
              placeholder="Optional notes..."
              value={form.notes}
              onChange={(e) =>
                setForm({ ...form, notes: e.target.value })
              }
            />
          </div>
        </form>

        {/* FOOTER (sticky actions) */}
        <div className="sticky bottom-0 flex gap-3 p-4 border-t border-slate-800 bg-slate-900">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-lg border border-slate-700 text-sm text-slate-300 hover:bg-slate-800"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="flex-1 py-3 rounded-lg bg-emerald-500 text-black text-sm font-semibold hover:bg-emerald-400"
          >
            Add Transaction
          </button>
        </div>
      </div>
    </div>
  );
}