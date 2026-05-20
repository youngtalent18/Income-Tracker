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
        w-full
        grid
        grid-cols-1
        md:grid-cols-[48px_minmax(0,1fr)_110px_130px_110px_90px]
        gap-3
        items-center
        px-4
        py-4
        border-b border-slate-800/60
        hover:bg-slate-800/40
        transition-all
      `}
    >
      {/* MOBILE LAYOUT */}
      <div className="flex items-start gap-3 md:hidden w-full">
        {/* AVATAR */}
        <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
          <span className="text-xs font-bold text-emerald-400">
            {t.customerName?.charAt(0)?.toUpperCase() || "?"}
          </span>
        </div>

        {/* CONTENT */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {t.customerName || "Unknown Customer"}
              </p>

              <p className="text-xs text-slate-400 truncate mt-0.5">
                {t.product || "No product"}
              </p>
            </div>

            <div className="text-right shrink-0">
              <p className="text-sm font-bold text-white font-mono">
                {formatAmount(t.amount)}
              </p>

              <p className="text-[11px] text-slate-500 mt-0.5">
                {formatDate(t.date)}
              </p>
            </div>
          </div>

          {/* BOTTOM ROW */}
          <div className="flex items-center justify-between mt-3 gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              {/* CATEGORY */}
              {!compact && (
                <span className="px-2 py-1 rounded-full text-[10px] font-medium bg-slate-800 text-slate-300">
                  {category}
                </span>
              )}

              {/* STATUS */}
              <span
                className={`px-2 py-1 rounded-full text-[10px] font-medium capitalize ${
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
              <div className="flex items-center gap-1">
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
        </div>
      </div>

      {/* DESKTOP LAYOUT */}
      <>
        {/* AVATAR */}
        <div className="hidden md:flex w-10 h-10 rounded-full bg-emerald-500/10 items-center justify-center shrink-0">
          <span className="text-xs font-bold text-emerald-400">
            {t.customerName?.charAt(0)?.toUpperCase() || "?"}
          </span>
        </div>

        {/* CUSTOMER */}
        <div className="hidden md:block min-w-0">
          <p className="text-sm font-medium text-white truncate">
            {t.customerName || "Unknown Customer"}
          </p>

          <p className="text-xs text-slate-400 truncate mt-0.5">
            {t.product || "No product"}
          </p>
        </div>

        {/* CATEGORY */}
        {!compact && (
          <div className="hidden md:flex justify-center">
            <span className="px-2.5 py-1 rounded-full text-xs bg-slate-800 text-slate-300 truncate max-w-full">
              {category}
            </span>
          </div>
        )}

        {/* AMOUNT */}
        <div className="hidden md:block text-right">
          <p className="text-sm font-semibold text-white font-mono truncate">
            {formatAmount(t.amount)}
          </p>

          <p className="text-[11px] text-slate-400 mt-0.5">
            {formatDate(t.date)}
          </p>
        </div>

        {/* STATUS */}
        <div className="hidden md:flex justify-center">
          <span
            className={`px-2.5 py-1 rounded-full text-[11px] font-medium capitalize whitespace-nowrap ${
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
          <div className="hidden md:flex items-center justify-end gap-1">
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
      </>
    </div>
  );
}