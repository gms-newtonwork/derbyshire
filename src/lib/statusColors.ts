import type { HoursStatus, StartsStatus } from './model/calculations';

export const STATUS_COLORS: Record<HoursStatus | StartsStatus, string> = {
  short: '#d1453b',
  balanced: '#2f9e58',
  surplus: '#3b6fd1',
  headroom: '#d99a1b',
  '—': '#9aa4ad',
};

export const NEUTRAL_BAR_COLOR = '#9aa4ad';
