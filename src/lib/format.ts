export function formatPercent(value: number, digits = 0): string {
  return `${(value * 100).toFixed(digits)}%`;
}

export function formatHours(value: number, digits = 0): string {
  return value.toLocaleString('en-GB', { maximumFractionDigits: digits, minimumFractionDigits: digits });
}

export function formatNumber(value: number, digits = 1): string {
  return value.toLocaleString('en-GB', { maximumFractionDigits: digits, minimumFractionDigits: 0 });
}

export function formatSigned(value: number, digits = 0): string {
  const formatted = formatHours(Math.abs(value), digits);
  if (value > 0) return `+${formatted}`;
  if (value < 0) return `-${formatted}`;
  return formatted;
}
