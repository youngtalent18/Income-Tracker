import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  amount,
  currency = 'GHC'
) {
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(amount || 0));

  return `${currency} ${formatted}`;
}

export function formatDate(dateStr, options = {}) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    ...options,
  }).format(new Date(dateStr));
}

export function formatRelativeTime(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';

  if (minutes < 60) return `${minutes}m ago`;

  if (hours < 24) return `${hours}h ago`;

  if (days < 7) return `${days}d ago`;

  return formatDate(dateStr);
}

export function formatPercentage(value) {
  const sign = value >= 0 ? '+' : '';

  return `${sign}${value.toFixed(1)}%`;
}

export function formatCompact(value) {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }

  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }

  return value.toString();
}

export function getStatusColor(status) {
  const map = {
    completed: 'text-emerald-400 bg-emerald-400/10',
    pending: 'text-amber-400 bg-amber-400/10',
    failed: 'text-red-400 bg-red-400/10',
    refunded: 'text-blue-400 bg-blue-400/10',

    'on-track':
      'text-emerald-400 bg-emerald-400/10',

    'at-risk':
      'text-amber-400 bg-amber-400/10',

    achieved: 'text-cyan-400 bg-cyan-400/10',

    missed: 'text-red-400 bg-red-400/10',

    active: 'text-emerald-400 bg-emerald-400/10',

    inactive: 'text-muted-foreground bg-muted',
  };

  return map[status] || 'text-muted-foreground bg-muted';
}
