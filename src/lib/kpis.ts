import type { ModelOutputs } from './model/calculations';
import { formatHours, formatNumber } from './format';

export type KpiTone = 'good' | 'bad' | 'neutral';

export interface KpiTileData {
  label: string;
  value: string;
  delta?: string;
  tone: KpiTone;
}

const EPSILON = 1e-9;

/** The four headline numbers for the top of Outputs — the "what matters" row. */
export function getCountywideKpis(outputs: ModelOutputs): KpiTileData[] {
  const { baselineCountywide, scenarioCountywide, byArea } = outputs;

  const netGap = scenarioCountywide.netGapHrsPerWeek;
  const netGapTile: KpiTileData = {
    label: 'Net gap, hrs/wk',
    value: netGap >= 0 ? `+${formatHours(netGap)}` : formatHours(netGap),
    delta:
      Math.abs(netGap - baselineCountywide.netGapHrsPerWeek) > EPSILON
        ? `vs ${baselineCountywide.netGapHrsPerWeek >= 0 ? '+' : ''}${formatHours(baselineCountywide.netGapHrsPerWeek)} historical`
        : undefined,
    tone: netGap >= 0 ? 'good' : 'bad',
  };

  const shortCount = byArea.filter((r) => r.scenarioStartsStatus === 'short').length;
  const headroomCount = byArea.filter((r) => r.scenarioStartsStatus === 'headroom').length;
  const areasShortTile: KpiTileData = {
    label: 'Areas short',
    value: `${shortCount} of ${byArea.length}`,
    delta: headroomCount > 0 ? `${headroomCount} with headroom` : undefined,
    tone: shortCount === 0 ? 'good' : shortCount <= 2 ? 'neutral' : 'bad',
  };

  let gapClosedTile: KpiTileData;
  if (baselineCountywide.netGapHrsPerWeek < -EPSILON) {
    const closedPct = Math.round(
      ((scenarioCountywide.netGapHrsPerWeek - baselineCountywide.netGapHrsPerWeek) /
        -baselineCountywide.netGapHrsPerWeek) *
        100
    );
    gapClosedTile = {
      label: 'Gap closed by scenario',
      value: `${closedPct}%`,
      tone: closedPct >= 100 ? 'good' : closedPct > 0 ? 'neutral' : 'bad',
    };
  } else {
    gapClosedTile = {
      label: 'Gap closed by scenario',
      value: 'n/a',
      delta: 'no historical shortfall',
      tone: 'good',
    };
  }

  const totalRealistic = byArea.reduce((sum, r) => sum + r.realisticStartsTarget, 0);
  const startsAchievableTile: KpiTileData = {
    label: 'Realistic starts achievable',
    value: `${formatNumber(totalRealistic, 1)} of ${formatNumber(scenarioCountywide.demandPerWeek, 0)}/wk`,
    tone: totalRealistic >= scenarioCountywide.demandPerWeek - EPSILON ? 'good' : 'neutral',
  };

  return [netGapTile, areasShortTile, gapClosedTile, startsAchievableTile];
}
