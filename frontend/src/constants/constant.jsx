export const CATEGORIES = [
  'MTN',
  'AT',
  'Telecel',
];

const CATEGORY_ALIASES = {
  mtn: 'MTN',
  at: 'AT',
  airteltigo: 'AT',
  airtel: 'AT',
  tigo: 'AT',
  telecel: 'Telecel',
};

export const normalizeCategory = (category) => {
  const value = String(category || '').trim();
  if (!value) return CATEGORIES[0];

  const normalizedValue = value.toLowerCase().replace(/\s+/g, '');

  return CATEGORY_ALIASES[normalizedValue] || CATEGORIES[0];
};

export const CURRENCIES = ['GHC'];

export const TRANSACTION_STATUSES = ['completed', 'pending', 'failed'];

export const DATE_RANGES = [
  { label: 'Today', value: 'daily' },
  { label: 'This Week', value: 'weekly' },
  { label: 'This Month', value: 'monthly' },
  { label: 'This Year', value: 'yearly' },
];

export const NAV_ITEMS = [
  { label: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
  { label: 'Transactions', path: '/transactions', icon: 'ArrowLeftRight' },
  { label: 'Customers', path: '/customers', icon: 'Users' },
  { label: 'Analytics', path: '/analytics', icon: 'BarChart3' },
  { label: 'Milestones', path: '/milestones', icon: 'Target' },
];

export const ADMIN_NAV_ITEMS = [
  { label: 'Admin Panel', path: '/admin', icon: 'Shield' },
];
