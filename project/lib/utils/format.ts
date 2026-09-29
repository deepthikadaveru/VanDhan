export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  // Already formatted in mock data, just return
  return dateStr;
}

export function maskId(value: string): string {
  if (value.length <= 4) return value;
  return value.slice(0, 2) + '****' + value.slice(-4);
}
