import { AREAS, type AreaName, type HistoricalInputs, type ScenarioInputs } from './model/types';
import type { ModelOutputs } from './model/calculations';
import { formatHours, formatPercent } from './format';

export interface StaffingAction {
  area: AreaName;
  actualVacancyRate: number;
  targetVacancyRate: number;
  extraHrsIfFilled: number;
  message: string;
}

const VACANCY_GAP_THRESHOLD = 0.005;

/**
 * Areas where current vacancy sits above the scenario's target — i.e. where
 * recruiting would directly unlock more capacity, ranked by how much.
 */
export function getStaffingActions(
  historical: HistoricalInputs,
  scenario: ScenarioInputs,
  outputs: ModelOutputs
): StaffingAction[] {
  const actions: StaffingAction[] = [];

  for (const area of AREAS) {
    const derived = outputs.scenarioAreaHours[area];
    if (derived.actualVacancyRate > scenario.vacancyTarget + VACANCY_GAP_THRESHOLD) {
      const historicalTotalHrs =
        historical.areaHours[area].availableHrsPerWeek + historical.areaHours[area].absentHrsPerWeek;
      const extraHrsIfFilled = derived.totalAvailableHrsPerWeek - historicalTotalHrs;
      actions.push({
        area,
        actualVacancyRate: derived.actualVacancyRate,
        targetVacancyRate: scenario.vacancyTarget,
        extraHrsIfFilled,
        message: `${area} is at ${formatPercent(derived.actualVacancyRate, 0)} vacancy against your ${formatPercent(scenario.vacancyTarget, 0)} target — recruiting to target would add ~${formatHours(extraHrsIfFilled)} hrs/wk.`,
      });
    }
  }

  return actions.sort((a, b) => b.extraHrsIfFilled - a.extraHrsIfFilled);
}
