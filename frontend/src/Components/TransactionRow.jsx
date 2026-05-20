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
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatAmount = (amount) => {
    const num = Number(amount || 0);

    return `GHC ${num.toLocaleString()}`;
  };

  return (
    <div
      className={`
        grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-3
        px-3 sm:px-4
        border-b border-slate-800/60
        hover:bg-slate-800/40
        transition-colors
        ${compact ? "py-3" : "py-4"}
      `}
    >
      {/* AVATAR */}
      <div className="w-9 h-9 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
        <span className="text-xs font-bold text-emerald-400">
          {t.customerName?.charAt(0)?.toUpperCase() || "?"}
        </span>
      </div>

      {/* CUSTOMER INFO */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">
          {t.customerName || "Unknown Customer"}
        </p>

        <p className="text-xs text-slate-400 truncate">
          {t.product || "No product"}
        </p>

        {/* MOBILE CATEGORY */}
        {!compact && (
          <div className="md:hidden mt-1">
            <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-800 text-slate-300">
              {category}
            </span>
          </div>
        )}
      </div>

      {/* CATEGORY */}
      {!compact && (
        <div className="hidden md:flex w-24 justify-center shrink-0">
          <span className="px-2 py-1 rounded-full text-xs bg-slate-800 text-slate-300">
            {category}
          </span>
        </div>
      )}

      {/* AMOUNT + DATE */}
      <div className="text-right shrink-0">
        <p className="text-sm sm:text-base font-semibold text-white font-mono">
          {formatAmount(t.amount)}
        </p>

        <p className="text-[11px] text-slate-400">
          {formatDate(t.date)}
        </p>
      </div>

      {/* STATUS */}
      <div className="hidden sm:flex shrink-0">
        <span
          className={`px-2.5 py-1 rounded-full text-[11px] font-medium capitalize ${
            t.status === "completed"
              ? "bg-emerald-500/10 text-emerald-400"
              : t.status === "failed"
              ? "bg-red-500/10 text-red-400"
              : "bg-amber-500/10 text-amber-400"
          }`}
        >
          {t.status || "pending"}
        </span>
      </div>

      {/* ACTIONS */}
      {(onDelete || onMarkDone) && (
        <div className="flex items-center gap-1 shrink-0">
          {/* MARK DONE */}
          {onMarkDone && t.status !== "completed" && (
            <button
              type="button"
              onClick={() => onMarkDone(t._id || t.id)}
              className="
                p-2
                rounded-lg
                text-slate-400
                hover:bg-emerald-500/10
                hover:text-emerald-400
                transition-all
              "
              title="Mark done"
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
                p-2
                rounded-lg
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