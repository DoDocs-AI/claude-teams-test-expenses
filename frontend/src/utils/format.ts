export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatShortDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export function getMonthName(month: number): string {
  const date = new Date(2026, month - 1);
  return date.toLocaleDateString('en-US', { month: 'long' });
}

export function getShortMonthName(month: number): string {
  const date = new Date(2026, month - 1);
  return date.toLocaleDateString('en-US', { month: 'short' });
}

export function todayString(): string {
  return new Date().toISOString().split('T')[0];
}

export function truncate(str: string, max: number): string {
  if (!str) return '';
  return str.length > max ? str.substring(0, max) + '...' : str;
}
