import { COHORTS, COHORT_LABELS, type CohortKey, type ScenarioInputs } from './model/types';
import { avgHrsPerPersonPerWeek } from './model/calculations';
import type { ModelOutputs } from './model/calculations';
import { formatHours, formatNumber } from './format';

export interface PerformanceLever {
  id: string;
  cohort: CohortKey;
  leverType: 'lengthOfStay' | 'effectiveness';
  hoursSavedPerWeek: number;
  message: string;
}

/**
 * Countywide capacity is driven by more than recruitment: the need profile's
 * length of stay and ending-need ("effectiveness") figures set how many hours
 * every start actually consumes. This quantifies each cohort's marginal
 * leverage — a 1-day LoS cut, or a 1 hr/wk cut to ending need — using the
 * partial derivatives of the blended hours-per-start formula, so recruitment
 * isn't the only option surfaced for closing a capacity gap.
 */
export function getPerformanceLevers(scenario: ScenarioInputs, outputs: ModelOutputs): PerformanceLever[] {
  const demand = scenario.demandPerWeek;
  const hoursPerStart = outputs.scenarioBlended.avgTotalVisitHoursPerStart;
  const levers: PerformanceLever[] = [];

  for (const key of COHORTS) {
    const cohort = scenario.needProfile[key];
    const label = COHORT_LABELS[key];

    // d(avgTotalVisitHoursPerStart)/d(LoS) = mix * avgHrsPerPersonPerWeek / 7
    const losHoursSaved = (demand * cohort.mix * avgHrsPerPersonPerWeek(cohort)) / 7;
    const losStartsEquivalent = hoursPerStart ? losHoursSaved / hoursPerStart : 0;
    levers.push({
      id: `los-${key}`,
      cohort: key,
      leverType: 'lengthOfStay',
      hoursSavedPerWeek: losHoursSaved,
      message: `Cutting 1 day off the ${label} cohort's length of stay would free up ~${formatHours(losHoursSaved)} hrs/wk countywide — roughly ${formatNumber(losStartsEquivalent, 1)} more starts/wk of capacity.`,
    });

    // d(avgTotalVisitHoursPerStart)/d(endHrs) = mix * LoS * (3/4) / 7
    const effectivenessHoursSaved = (demand * cohort.mix * cohort.lengthOfStayDays * 0.75) / 7;
    const effectivenessStartsEquivalent = hoursPerStart ? effectivenessHoursSaved / hoursPerStart : 0;
    levers.push({
      id: `effectiveness-${key}`,
      cohort: key,
      leverType: 'effectiveness',
      hoursSavedPerWeek: effectivenessHoursSaved,
      message: `Cutting 1 hr/wk off the ${label} cohort's ending need would free up ~${formatHours(effectivenessHoursSaved)} hrs/wk countywide — roughly ${formatNumber(effectivenessStartsEquivalent, 1)} more starts/wk.`,
    });
  }

  return levers.sort((a, b) => b.hoursSavedPerWeek - a.hoursSavedPerWeek);
}
