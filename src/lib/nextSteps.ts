import type { ModelOutputs } from './model/calculations';
import type { HistoricalInputs, ScenarioInputs } from './model/types';
import { formatPercent } from './format';

const EPSILON = 1e-9;

function differs(a: number, b: number): boolean {
  return Math.abs(a - b) > EPSILON;
}

function needProfileUnchanged(historical: HistoricalInputs, scenario: ScenarioInputs): boolean {
  return (['low', 'medium', 'high'] as const).every((key) => {
    const h = historical.needProfile[key];
    const s = scenario.needProfile[key];
    return (
      !differs(h.mix, s.mix) &&
      !differs(h.startHrsPerWeek, s.startHrsPerWeek) &&
      !differs(h.endHrsPerWeek, s.endHrsPerWeek) &&
      !differs(h.lengthOfStayDays, s.lengthOfStayDays) &&
      !differs(h.finisherRate, s.finisherRate)
    );
  });
}

function areaSplitUnchanged(historical: HistoricalInputs, scenario: ScenarioInputs): boolean {
  return (Object.keys(historical.areaSplit) as (keyof typeof historical.areaSplit)[]).every(
    (area) => !differs(historical.areaSplit[area], scenario.areaSplit[area])
  );
}

export interface NextStepSuggestion {
  id: string;
  message: string;
}

/**
 * Suggests an untried lever based on what the user has already changed,
 * and how much of the baseline gap their current scenario has closed.
 */
export function getNextStepSuggestions(
  historical: HistoricalInputs,
  scenario: ScenarioInputs,
  outputs: ModelOutputs
): NextStepSuggestion[] {
  const suggestions: NextStepSuggestion[] = [];
  const { baselineCountywide, scenarioCountywide } = outputs;

  const absenceTried = differs(historical.absenceTarget, scenario.absenceTarget);
  const utilisationTried = differs(historical.utilisationTarget, scenario.utilisationTarget);
  const vacancyTried = differs(scenario.vacancyTarget, 0.15) || false;
  const needProfileTried = !needProfileUnchanged(historical, scenario);
  const areaSplitTried = !areaSplitUnchanged(historical, scenario);

  if (baselineCountywide.netGapHrsPerWeek < -EPSILON) {
    const closedPct = Math.round(
      ((scenarioCountywide.netGapHrsPerWeek - baselineCountywide.netGapHrsPerWeek) /
        -baselineCountywide.netGapHrsPerWeek) *
        100
    );
    if (closedPct > 0 && closedPct < 100) {
      suggestions.push({
        id: 'progress',
        message: `You've closed ${closedPct}% of the countywide gap so far.`,
      });
    }
  }

  if (!absenceTried) {
    suggestions.push({
      id: 'try-absence',
      message: `You haven't yet modelled tightening the absence target (currently ${formatPercent(scenario.absenceTarget, 0)}). Would you like to see what hitting a lower absence rate would unlock?`,
    });
  }

  if (!utilisationTried) {
    suggestions.push({
      id: 'try-utilisation',
      message: `Would you like to try what happens if utilisation also improves? It's still at your baseline ${formatPercent(scenario.utilisationTarget, 0)} target.`,
    });
  }

  if (!vacancyTried) {
    suggestions.push({
      id: 'try-vacancy',
      message: `You haven't changed the vacancy target from its default ${formatPercent(scenario.vacancyTarget, 0)}. Recruiting further would raise capacity directly in areas with high current vacancy.`,
    });
  }

  if (!needProfileTried) {
    suggestions.push({
      id: 'try-need-profile',
      message: 'Try shortening length of stay or lowering intensity for a cohort — this reduces the hours every start consumes, countywide.',
    });
  }

  if (!areaSplitTried) {
    suggestions.push({
      id: 'try-rebalance',
      message: 'If some areas are short while others have surplus, try shifting a few points of referral share between them.',
    });
  }

  return suggestions.slice(0, 3);
}
