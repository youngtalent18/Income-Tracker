import {
  Trash2,
  Trophy,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

import {
  cn,
  formatCurrency,
  formatDate,
  getStatusColor,
} from '../lib/utils';

const statusIcons = {
  'on-track': Clock,
  'at-risk': AlertTriangle,
  achieved: Trophy,
  completed: CheckCircle2,
  failed: XCircle,
  missed: AlertTriangle,
};

const statusActions = [
  { value: 'achieved', label: 'Achieved' },
  { value: 'at-risk', label: 'At Risk' },
  { value: 'completed', label: 'Completed' },
  { value: 'failed', label: 'Failed' },
];

export default function MilestoneCard({
  milestone: m,
  onDelete,
  onStatusChange,
}) {
  const dueDate = m.deadline || m.dueDate;
  const pct = m.target > 0 ? Math.min(100, (m.current / m.target) * 100) : 0;

  const StatusIcon = statusIcons[m.status] || Clock;

  return (
    <div className="bg-gray-900 border border-slate-700 rounded-xl p-5 hover:border-primary/30 transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0 pr-3">
          <h3 className="font-semibold text-foreground text-sm truncate">
            {m.title}
          </h3>

          <p className="text-xs text-muted-foreground mt-0.5 capitalize">
            {m.period || 'goal'} · Due {formatDate(dueDate)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={cn(
              'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
              getStatusColor(m.status)
            )}
          >
            <StatusIcon size={10} />
            {m.status.replace('-', ' ')}
          </span>

          {onDelete && (
            <button
              onClick={() => onDelete(m._id || m.id)}
              className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-all"
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>
      </div>

      <div className="mb-3">
        <div className="flex items-end justify-between mb-2">
          <span className="text-xl font-bold text-foreground font-mono">
            {formatCurrency(m.current)}
          </span>

          <span className="text-sm text-muted-foreground">
            of {formatCurrency(m.target)}
          </span>
        </div>

        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-500',
              m.status === 'achieved' || m.status === 'completed'
                ? 'bg-cyan-400'
                : m.status === 'at-risk'
                ? 'bg-amber-400'
                : m.status === 'failed' || m.status === 'missed'
                ? 'bg-red-400'
                : 'bg-emerald-400'
            )}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{pct.toFixed(1)}% complete</span>

        <span>
          {formatCurrency(
            Math.max(0, m.target - m.current)
          )}{' '}
          remaining
        </span>
      </div>

      {onStatusChange && (
        <div className="mt-4 grid grid-cols-2 gap-2 border-t border-slate-800 pt-4">
          {statusActions.map((status) => (
            <button
              key={status.value}
              type="button"
              disabled={m.status === status.value}
              onClick={() => onStatusChange(m._id || m.id, status.value)}
              className="rounded-lg border border-slate-700 px-2 py-1.5 text-xs font-medium text-slate-300 transition hover:border-cyan-400/50 hover:text-cyan-300 disabled:cursor-not-allowed disabled:border-slate-800 disabled:text-slate-600"
            >
              {status.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
