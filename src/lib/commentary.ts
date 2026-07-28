import type { AreaRow, ModelOutputs } from './model/calculations';
import type { HistoricalInputs, ScenarioInputs } from './model/types';
import { formatHours, formatNumber, formatPercent } from './format';

const EPSILON = 1e-9;

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

/**
 * One interpretive paragraph per area, referencing the user's actual numbers
 * rather than just restating the status flag.
 */
export function generateAreaCommentary(
  row: AreaRow,
  historical: HistoricalInputs,
  scenario: ScenarioInputs,
  outputs: ModelOutputs
): string {
  const area = row.area;
  const baselineGap = round1(row.baselineStartsNeeded - row.baselineStartsSupportable);
  const scenarioGap = round1(row.scenarioStartsDemand - row.scenarioStartsSupportable);

  if (row.scenarioStartsStatus === 'short') {
    const gapClosedPct =
      baselineGap > EPSILON ? Math.round(((baselineGap - scenarioGap) / baselineGap) * 100) : null;

    const progressSentence =
      gapClosedPct !== null && gapClosedPct !== 0
        ? gapClosedPct > 0
          ? ` Your scenario changes have closed ${gapClosedPct}% of that gap so far (from ${formatNumber(baselineGap, 1)} to ${formatNumber(scenarioGap, 1)} starts/wk short).`
          : ` Your scenario changes have actually widened this gap slightly (from ${formatNumber(baselineGap, 1)} to ${formatNumber(scenarioGap, 1)} starts/wk short).`
        : '';

    const scenarioAreaHours = outputs.scenarioAreaHours[area];
    const historicalTotalHrs = historical.areaHours[area].availableHrsPerWeek + historical.areaHours[area].absentHrsPerWeek;
    const recruitingHelps = scenarioAreaHours.actualVacancyRate > scenario.vacancyTarget + 0.005;

    let lever: string;
    if (recruitingHelps) {
      lever = `Recruiting down to your ${formatPercent(scenario.vacancyTarget, 0)} vacancy target here would help — modelled capacity is already ${formatHours(scenarioAreaHours.totalAvailableHrsPerWeek - historicalTotalHrs, 0)} hrs/wk higher than today's actual delivered hours because of it, but it isn't enough on its own.`;
    } else {
      const surplusAreas = outputs.byArea
        .filter((r) => r.area !== area && (r.scenarioStatus === 'surplus' || r.scenarioStatus === 'balanced'))
        .map((r) => r.area);
      lever =
        surplusAreas.length > 0
          ? `Vacancies here are already close to target, so the more realistic lever is rebalancing some referral share from an area with spare capacity, such as ${surplusAreas.slice(0, 2).join(' or ')}.`
          : `Vacancies here are already close to target, so closing this gap will likely need either a shorter length of stay or additional funded hours.`;
    }

    return `${area} cannot absorb its current demand — ${formatNumber(scenarioGap, 1)} starts a week are being missed.${progressSentence} ${lever}`;
  }

  if (row.scenarioStartsStatus === 'headroom') {
    const spare = round1(row.scenarioStartsSupportable - row.scenarioStartsDemand);
    return `${area} now has more capacity than it needs — around ${formatNumber(spare, 1)} starts/wk of headroom under this scenario. That spare capacity could absorb referrals moved from a short area, or be a case for a lower staffing target here.`;
  }

  if (row.scenarioStartsStatus === 'surplus') {
    const spare = round1(row.scenarioStartsSupportable - row.scenarioStartsDemand);
    return `${area} is running a modest surplus — about ${formatNumber(spare, 1)} starts/wk more capacity than its demand needs.`;
  }

  return `${area} is broadly balanced — capacity and demand are within 5% of each other.`;
}

export function generateCountywideCommentary(outputs: ModelOutputs): string {
  const { baselineCountywide, scenarioCountywide, byArea } = outputs;
  const shortCount = byArea.filter((r) => r.scenarioStartsStatus === 'short').length;
  const headroomCount = byArea.filter((r) => r.scenarioStartsStatus === 'headroom').length;

  const baselineGap = baselineCountywide.netGapHrsPerWeek;
  const scenarioGap = scenarioCountywide.netGapHrsPerWeek;

  let gapSentence: string;
  if (baselineGap < -EPSILON) {
    const closedPct = Math.round(((scenarioGap - baselineGap) / -baselineGap) * 100);
    if (scenarioGap >= 0) {
      gapSentence = `Your scenario fully closes the countywide gap — from ${formatHours(Math.abs(baselineGap))} hrs/wk short to a surplus of ${formatHours(scenarioGap)} hrs/wk.`;
    } else {
      gapSentence = `Countywide, you're modelling a net gap of ${formatHours(Math.abs(scenarioGap))} hrs/wk (down from ${formatHours(Math.abs(baselineGap))} hrs/wk historically) — you've closed ${closedPct}% of the shortfall so far.`;
    }
  } else {
    gapSentence = `Countywide capacity already meets demand historically, with ${formatHours(baselineGap)} hrs/wk to spare; your scenario changes leave ${formatHours(scenarioGap)} hrs/wk of headroom.`;
  }

  const areaSentence =
    shortCount === 0
      ? 'No areas are currently flagged short.'
      : `${shortCount} of 8 areas ${shortCount === 1 ? 'is' : 'are'} still short${headroomCount > 0 ? `, while ${headroomCount} ${headroomCount === 1 ? 'has' : 'have'} headroom` : ''}.`;

  return `${gapSentence} ${areaSentence}`;
}
