import { CheckCircle2, Trash2 } from "lucide-react";
import { normalizeCategory } from "../constants/constant";

export default function TransactionRow({
  transaction,
  onDelete,
  onMarkDone,
  compact = false,
}) {
  const t = transaction || {};
  const category = normalizeCategory(t.category);

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-GH", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatAmount = (amount) => {
    const num = Number(amount || 0);

    return `GHC ${num.toLocaleString()}`;
  };

  const statusStyles = {
    completed:
      "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",

    failed:
      "bg-red-500/10 text-red-400 border border-red-500/20",

    pending:
      "bg-amber-500/10 text-amber-400 border border-amber-500/20",

    processing:
      "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20",
  };

  return (
    <div
      className={`
        flex items-center gap-3 min-w-0 px-4 sm:px-5
        hover:bg-slate-800/40
        transition-all duration-200
        border-b border-slate-800/60
        last:border-b-0
        ${compact ? "py-3" : "py-4"}
      `}
    >
      {/* AVATAR */}
      <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/10 flex items-center justify-center shrink-0">
        <span className="text-sm font-bold text-emerald-400">
          {t.customerName?.charAt(0)?.toUpperCase() || "?"}
        </span>
      </div>

      {/* CUSTOMER + PRODUCT */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-white truncate">
            {t.customerName || "Unknown Customer"}
          </p>

          {!compact && t.status === "completed" && (
            <div className="hidden sm:block w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
          )}
        </div>

        <p className="text-xs text-slate-400 truncate mt-0.5">
          {t.product || "No product"}
        </p>

        {/* MOBILE META */}
        <div className="flex items-center gap-2 mt-1 md:hidden flex-wrap">
          <span className="text-[11px] text-slate-500">
            {category}
          </span>

          <span className="text-slate-600">•</span>

          <span className="text-[11px] text-slate-500">
            {formatDate(t.date)}
          </span>
        </div>
      </div>

      {/* CATEGORY */}
      {!compact && (
        <div className="hidden md:flex w-24 justify-center shrink-0">
          <span className="px-2 py-1 rounded-md bg-slate-800 text-xs text-slate-300 border border-slate-700 truncate">
            {category}
          </span>
        </div>
      )}

      {/* AMOUNT */}
      <div className="text-right shrink-0">
        <p className="text-sm sm:text-base font-bold text-white font-mono">
          {formatAmount(t.amount)}
        </p>

        <p className="hidden sm:block text-xs text-slate-500 mt-0.5">
          {formatDate(t.date)}
        </p>
      </div>

      {/* STATUS */}
      <div className="hidden sm:flex w-28 justify-center shrink-0">
        <span
          className={`
            px-2.5 py-1 rounded-full text-[11px]
            font-medium capitalize
            ${
              statusStyles[t.status] ||
              "bg-slate-700 text-slate-300 border border-slate-600"
            }
          `}
        >
          {t.status || "pending"}
        </span>
      </div>

      {/* ACTIONS */}
      {(onMarkDone || onDelete) && (
        <div className="flex items-center gap-1 shrink-0">
          
          {/* MARK DONE */}
          {onMarkDone && t.status !== "completed" && (
            <button
              type="button"
              onClick={() => onMarkDone(t._id || t.id)}
              className="
                p-2 rounded-lg
                text-slate-400
                hover:bg-emerald-500/10
                hover:text-emerald-400
                transition-all
              "
              title="Mark transaction done"
              aria-label="Mark transaction done"
            >
              <CheckCircle2 size={15} />
            </button>
          )}

          {/* DELETE */}
          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(t._id || t.id)}
              className="
                p-2 rounded-lg
                text-slate-400
                hover:bg-red-500/10
                hover:text-red-400
                transition-all
              "
              title="Delete transaction"
              aria-label="Delete transaction"
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}