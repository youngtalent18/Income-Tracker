import { useState } from "react";
import { X } from "lucide-react";
import {
  CATEGORIES,
  CURRENCIES,
  TRANSACTION_STATUSES,
} from "../constants/constant";

const DEFAULT_CATEGORY = CATEGORIES[0] || "MTN";

export default function AddTransactionModal({
  open,
  onClose,
  onAdd,
}) {
  const [form, setForm] = useState({
    customerName: "",
    product: "",
    amount: "",
    currency: "GHC",
    status: "completed",
    category: DEFAULT_CATEGORY,
    notes: "",
  });

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    // 🔥 basic validation (frontend only)
    if (
      !form.customerName ||
      !form.product ||
      !form.amount
    ) {
      return;
    }

    const newTransaction = {
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
    };

    onAdd(newTransaction);

    // reset form
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
    "w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500";

  const labelCls = "block text-xs font-medium text-slate-400 mb-1.5";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* MODAL */}
      <div className="relative bg-slate-900 border border-slate-800 rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <h2 className="font-semibold text-white">
            Add Transaction
          </h2>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {/* NAME */}
            <div className="col-span-2">
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
            <div className="col-span-2">
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

            {/* AMOUNT */}
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

            {/* CURRENCY */}
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

            {/* CATEGORY */}
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

            {/* STATUS */}
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

            {/* NOTES */}
            <div className="col-span-2">
              <label className={labelCls}>Notes</label>
              <textarea
                rows={2}
                className={inputCls}
                placeholder="Optional notes..."
                value={form.notes}
                onChange={(e) =>
                  setForm({ ...form, notes: e.target.value })
                }
              />
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg border border-slate-700 text-sm text-slate-400 hover:bg-slate-800"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex-1 px-4 py-2.5 rounded-lg bg-emerald-500 text-black text-sm font-semibold hover:bg-emerald-400"
            >
              Add Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
