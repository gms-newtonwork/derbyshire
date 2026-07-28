export const AREAS = [
  'Amber Valley',
  'Bolsover',
  'Chesterfield',
  'Derbyshire Dales',
  'Erewash',
  'High Peak',
  'North East Derbyshire',
  'South Derbyshire',
] as const;

export type AreaName = (typeof AREAS)[number];

export const COHORTS = ['low', 'medium', 'high'] as const;

export type CohortKey = (typeof COHORTS)[number];

export const COHORT_LABELS: Record<CohortKey, string> = {
  low: 'Low (start ≤10 hrs/wk)',
  medium: 'Medium (start 10-20 hrs/wk)',
  high: 'High (start >20 hrs/wk)',
};

/** One cohort's row in the "starting need profile" table (Historical/Scenario Inputs, section 3). */
export interface CohortProfile {
  /** % of starts in this cohort. Mix across all cohorts must sum to 1. */
  mix: number;
  startHrsPerWeek: number;
  endHrsPerWeek: number;
  lengthOfStayDays: number;
  /** % of starts in this cohort who finish successfully. */
  finisherRate: number;
}

export type NeedProfile = Record<CohortKey, CohortProfile>;

/** Historical Inputs, section 4: dashboard-sourced hours per area. */
export interface AreaHoursInput {
  availableHrsPerWeek: number;
  absentHrsPerWeek: number;
}

export interface HistoricalInputs {
  demandPerWeek: number;
  absenceTarget: number;
  utilisationTarget: number;
  areaSplit: Record<AreaName, number>;
  needProfile: NeedProfile;
  areaHours: Record<AreaName, AreaHoursInput>;
}

/**
 * Scenario Inputs, section 5: budgeted hours per area, used to derive scenario
 * capacity. Vacancy % isn't typed in directly — it's calculated by comparing
 * this to Historical Inputs' actual delivered hours for the same area.
 */
export interface VacancyAreaInput {
  totalBudgetedHrs: number;
}

export interface ScenarioInputs {
  demandPerWeek: number;
  absenceTarget: number;
  utilisationTarget: number;
  /** Target vacancy rate (ESW hours only) — Scenario Inputs B8. */
  vacancyTarget: number;
  areaSplit: Record<AreaName, number>;
  needProfile: NeedProfile;
  vacancyData: Record<AreaName, VacancyAreaInput>;
}
