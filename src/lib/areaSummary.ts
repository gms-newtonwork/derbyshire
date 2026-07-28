import type { AreaRow } from './model/calculations';
import { formatNumber } from './format';

export interface AreaCardSummary {
  headline: string;
  unit: string;
  takeaway: string;
}

const EPSILON = 1e-9;

/** A compact "at a glance" headline + one-liner per area, for card-based scanning. */
export function getAreaCardSummary(row: AreaRow): AreaCardSummary {
  if (row.scenarioStartsStatus === 'short') {
    const gap = row.scenarioStartsDemand - row.scenarioStartsSupportable;
    return {
      headline: `-${formatNumber(gap, 1)}`,
      unit: 'starts/wk short',
      takeaway: 'Cannot absorb current demand.',
    };
  }

  if (row.scenarioStartsStatus === 'headroom') {
    const spare = row.scenarioStartsSupportable - row.scenarioStartsDemand;
    return {
      headline: `+${formatNumber(spare, 1)}`,
      unit: 'starts/wk headroom',
      takeaway: 'Spare capacity — could take referrals from a short area.',
    };
  }

  if (row.scenarioStartsStatus === 'surplus') {
    const spare = row.scenarioStartsSupportable - row.scenarioStartsDemand;
    return {
      headline: `+${formatNumber(spare, 1)}`,
      unit: 'starts/wk surplus',
      takeaway: 'A modest cushion above what demand needs.',
    };
  }

  const diff = row.scenarioStartsSupportable - row.scenarioStartsDemand;
  return {
    headline: Math.abs(diff) < EPSILON ? '±0.0' : diff > 0 ? `+${formatNumber(diff, 1)}` : formatNumber(diff, 1),
    unit: 'starts/wk vs demand',
    takeaway: 'Capacity and demand are in step.',
  };
}
