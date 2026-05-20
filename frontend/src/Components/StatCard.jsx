import {
  TrendingUp,
  TrendingDown,
} from 'lucide-react';

import {
  cn,
  formatCurrency,
  formatCompact,
} from '../lib/utils';

const colorMap = {
  cyan: 'text-cyan-400 bg-cyan-400/10',
  emerald: 'text-emerald-400 bg-emerald-400/10',
  amber: 'text-amber-400 bg-amber-400/10',
  red: 'text-red-400 bg-red-400/10',
};

export default function StatCard({
  title,
  value,
  change,
  icon: Icon,
  format = 'currency',
  color = 'cyan',
  isLoading,
}) {
  const isPositive = change >= 0;

  const formattedValue = () => {
    if (format === 'currency') {
      return formatCurrency(value);
    }

    if (format === 'compact') {
      return formatCompact(value);
    }

    return value.toLocaleString();
  };

  if (isLoading) {
    return (
      <div className="bg-gray-900 border border-slate-700 rounded-xl p-5 animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="h-4 w-24 bg-muted rounded" />

          <div className="w-9 h-9 bg-muted rounded-lg" />
        </div>

        <div className="h-8 w-32 bg-muted rounded mb-2" />

        <div className="h-3 w-20 bg-muted rounded" />
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border border-slate-700 rounded-xl p-5 hover:border-gray-300/40 transition-all duration-200 group">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground font-medium">
          {title}
        </p>

        <div
          className={cn(
            'w-9 h-9 rounded-lg flex items-center justify-center',
            colorMap[color]
          )}
        >
          <Icon size={16} />
        </div>
      </div>

      <p className="text-2xl font-bold text-foreground font-mono tracking-tight mb-2">
        {formattedValue()}
      </p>

      <div className="flex items-center gap-1.5">
        <div
          className={cn(
            'flex items-center gap-0.5 text-xs font-medium',
            isPositive
              ? 'text-emerald-400'
              : 'text-red-400'
          )}
        >
          {isPositive ? (
            <TrendingUp size={12} />
          ) : (
            <TrendingDown size={12} />
          )}

          <span>
            {Math.abs(change).toFixed(1)}%
          </span>
        </div>

        <span className="text-xs text-muted-foreground">
          vs last period
        </span>
      </div>
    </div>
  );
}