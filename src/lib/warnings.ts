import { COHORTS, COHORT_LABELS, type NeedProfile, type ScenarioInputs } from './model/types';

export interface ScenarioWarning {
  id: string;
  message: string;
}

export const UTILISATION_WARNING_THRESHOLD = 0.8;
export const LENGTH_OF_STAY_WARNING_THRESHOLD_DAYS = 10;

export function getLengthOfStayWarnings(needProfile: NeedProfile): ScenarioWarning[] {
  const warnings: ScenarioWarning[] = [];
  for (const key of COHORTS) {
    const cohort = needProfile[key];
    if (cohort.lengthOfStayDays < LENGTH_OF_STAY_WARNING_THRESHOLD_DAYS) {
      warnings.push({
        id: `los-low-${key}`,
        message: `A length of stay of ${cohort.lengthOfStayDays} days for the ${COHORT_LABELS[key]} cohort is very short — most reablement episodes need at least 10 days to safely reduce someone's care needs. Treat this as an aspirational stretch, not a baseline assumption.`,
      });
    }
  }
  return warnings;
}

/**
 * Flags scenario lever combinations that are technically valid inputs but
 * unrealistic in practice, so users don't mistake an aggressive what-if for
 * an achievable target.
 */
export function getScenarioWarnings(scenario: ScenarioInputs): ScenarioWarning[] {
  const warnings: ScenarioWarning[] = [];

  if (scenario.utilisationTarget >= UTILISATION_WARNING_THRESHOLD) {
    warnings.push({
      id: 'utilisation-high',
      message: `A utilisation target of ${(scenario.utilisationTarget * 100).toFixed(0)}% is unrealistic — it leaves almost no time for travel, admin or handover between visits. Real-world reablement services rarely sustain utilisation much above 65–70%.`,
    });
  }

  warnings.push(...getLengthOfStayWarnings(scenario.needProfile));

  return warnings;
}

export function utilisationWarningMessage(utilisationTarget: number): string | undefined {
  if (utilisationTarget < UTILISATION_WARNING_THRESHOLD) return undefined;
  return `${(utilisationTarget * 100).toFixed(0)}% is unrealistic — leaves almost no time for travel, admin or handover. Services rarely sustain utilisation above ~65–70%.`;
}

export function lengthOfStayWarningMessage(lengthOfStayDays: number): string | undefined {
  if (lengthOfStayDays >= LENGTH_OF_STAY_WARNING_THRESHOLD_DAYS) return undefined;
  return `${lengthOfStayDays} days is very short — most episodes need at least ${LENGTH_OF_STAY_WARNING_THRESHOLD_DAYS} to safely reduce care needs.`;
}
