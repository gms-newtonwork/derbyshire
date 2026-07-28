import type { HoursStatus, StartsStatus } from '../../lib/model/calculations';

const LABELS: Record<string, string> = {
  short: 'Short',
  balanced: 'Balanced',
  surplus: 'Surplus',
  headroom: 'Headroom',
  '—': '—',
};

export function StatusBadge({ status }: { status: HoursStatus | StartsStatus }) {
  return <span className={`status-badge status-${status === '—' ? 'none' : status}`}>{LABELS[status]}</span>;
}
