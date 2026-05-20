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
    return new Date(date).toLocaleDateString();
  };

  const formatAmount = (amount) => {
    const num = Number(amount || 0);
    return `GHC ${num.toLocaleString()}`;
  };

  return (
    <div
      className={`
        flex items-center gap-3 px-4 hover:bg-slate-800/40 transition-colors group border-b border-slate-800/50 last:border-b-0
        ${compact ? "py-2.5" : "py-3"}
      `}
    >
      {/* AVATAR */}
      <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
        <span className="text-xs font-bold text-emerald-400">
          {t.customerName?.charAt(0)?.toUpperCase() || "?"}
        </span>
      </div>

      {/* CUSTOMER */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">
          {t.customerName || "Unknown"}
        </p>

        <p className="text-xs text-slate-400 truncate">
          {t.product || "-"}
        </p>
      </div>

      {/* CATEGORY */}
      {!compact && (
        <div className="hidden md:block text-xs text-slate-400 w-20 text-center">
          {category}
        </div>
      )}

      {/* AMOUNT + DATE */}
      <div className="text-right">
        <p className="text-sm font-semibold text-white font-mono">
          {formatAmount(t.amount)}
        </p>

        <p className="text-xs text-slate-400">
          {formatDate(t.date)}
        </p>
      </div>

      {/* STATUS */}
      <span
        className={`hidden sm:inline-flex px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
          t.status === "completed"
            ? "bg-emerald-400/10 text-emerald-300"
            : t.status === "failed"
            ? "bg-red-400/10 text-red-300"
            : "bg-amber-400/10 text-amber-300"
        }`}
      >
        {t.status || "pending"}
      </span>

      {/* ACTIONS */}
      {(onMarkDone || onDelete) && (
        <div className="flex items-center gap-1">
          {onMarkDone && t.status !== "completed" && (
            <button
              type="button"
              onClick={() => onMarkDone(t._id || t.id)}
              className="p-1.5 rounded-lg text-slate-400 opacity-0 transition-all hover:bg-emerald-500/10 hover:text-emerald-400 group-hover:opacity-100"
              title="Mark done"
              aria-label="Mark transaction done"
            >
              <CheckCircle2 size={14} />
            </button>
          )}

          {onDelete && (
        <button
              type="button"
          onClick={() => onDelete(t._id || t.id)}
          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-500/10 hover:text-red-400 text-slate-400 transition-all"
              title="Delete transaction"
              aria-label="Delete transaction"
        >
          <Trash2 size={13} />
        </button>
      )}
        </div>
      )}
    </div>
  );
}
