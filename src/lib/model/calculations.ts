import {
  AREAS,
  COHORTS,
  type AreaName,
  type CohortProfile,
  type HistoricalInputs,
  type NeedProfile,
  type ScenarioInputs,
  type VacancyAreaInput,
} from './types';

/** Excel ROUND(x, digits) — round-half-away-from-zero, not banker's rounding. */
export function excelRound(value: number, digits = 0): number {
  const factor = 10 ** digits;
  return Math.sign(value) * Math.round(Math.abs(value) * factor) / factor;
}

// ---------------------------------------------------------------------------
// Section 1: blended assumptions (Historical/Scenario Inputs section 3 -> Outputs section 1)
// ---------------------------------------------------------------------------

/**
 * Avg weekly hrs/person across their whole journey — a 25/75 weighted midpoint of
 * start and end need, weighted toward ending need because people spend more of
 * their time in service closer to discharge than to admission.
 * Historical/Scenario Inputs column G: =(start + end*3)/4
 */
export function avgHrsPerPersonPerWeek(cohort: CohortProfile): number {
  return (cohort.startHrsPerWeek + cohort.endHrsPerWeek * 3) / 4;
}

/** Reduction in weekly need from start to end of episode. Column H: =start-end */
export function effectivenessHrs(cohort: CohortProfile): number {
  return cohort.startHrsPerWeek - cohort.endHrsPerWeek;
}

export interface BlendedAssumptions {
  /** Outputs B6/C6: SUMPRODUCT(mix, avg hrs/person/wk, LoS days) / 7 */
  avgTotalVisitHoursPerStart: number;
  /** Outputs B7/C7: SUMPRODUCT(mix, LoS days) */
  weightedAvgLengthOfStayDays: number;
  /** Outputs B8/C8: SUMPRODUCT(mix, effectiveness hrs) */
  avgEffectivenessHrs: number;
  /** Outputs B9/C9: SUMPRODUCT(mix, finisher rate) */
  blendedFinisherRate: number;
}

export function blendedAssumptions(profile: NeedProfile): BlendedAssumptions {
  let hoursPerStartWeighted = 0;
  let lengthOfStayWeighted = 0;
  let effectivenessWeighted = 0;
  let finisherRateWeighted = 0;

  for (const key of COHORTS) {
    const cohort = profile[key];
    hoursPerStartWeighted += cohort.mix * avgHrsPerPersonPerWeek(cohort) * cohort.lengthOfStayDays;
    lengthOfStayWeighted += cohort.mix * cohort.lengthOfStayDays;
    effectivenessWeighted += cohort.mix * effectivenessHrs(cohort);
    finisherRateWeighted += cohort.mix * cohort.finisherRate;
  }

  return {
    avgTotalVisitHoursPerStart: hoursPerStartWeighted / 7,
    weightedAvgLengthOfStayDays: lengthOfStayWeighted,
    avgEffectivenessHrs: effectivenessWeighted,
    blendedFinisherRate: finisherRateWeighted,
  };
}

// ---------------------------------------------------------------------------
// Scenario-only: derive area hours from vacancy/FTE data (Scenario Inputs section 4+5)
// ---------------------------------------------------------------------------

export interface ScenarioAreaHours {
  totalAvailableHrsPerWeek: number; // Scenario Inputs D31:D38
  availableHrsPerWeek: number; // B31:B38
  absentHrsPerWeek: number; // C31:C38
  /** Vacancy % implied by comparing HR budgeted hours to Historical Inputs' actual delivered hours. */
  actualVacancyRate: number; // G42:G49
}

/**
 * Scenario Inputs D31: =IF(G42<$B$8, D42*(1-G42), D42*(1-$B$8))
 * Models "recruit down to your target vacancy rate, but never worse than what
 * you already have" — capped by the *historical* delivered hours for the area,
 * not by anything in Scenario Inputs itself.
 */
export function scenarioAreaHours(
  vacancy: VacancyAreaInput,
  historicalTotalHrsPerWeek: number,
  absenceTarget: number,
  vacancyTarget: number
): ScenarioAreaHours {
  const actualVacancyRate = 1 - historicalTotalHrsPerWeek / vacancy.totalBudgetedHrs;
  const totalAvailableHrsPerWeek =
    actualVacancyRate < vacancyTarget
      ? vacancy.totalBudgetedHrs * (1 - actualVacancyRate)
      : vacancy.totalBudgetedHrs * (1 - vacancyTarget);
  const absentHrsPerWeek = totalAvailableHrsPerWeek * absenceTarget;
  const availableHrsPerWeek = totalAvailableHrsPerWeek - absentHrsPerWeek;
  return { totalAvailableHrsPerWeek, availableHrsPerWeek, absentHrsPerWeek, actualVacancyRate };
}

// ---------------------------------------------------------------------------
// Sections 2 & 3: countywide summary and by-area capacity vs demand
// ---------------------------------------------------------------------------

export type HoursStatus = 'short' | 'balanced' | 'surplus' | '—';
export type StartsStatus = 'short' | 'balanced' | 'surplus' | 'headroom' | '—';

/** Outputs D22 / H22 / L22 pattern: 3-way status, ±5% band counts as "balanced". */
export function hoursStatus(available: number, required: number): HoursStatus {
  if (required === 0) return '—';
  if (Math.abs(available - required) < 0.05 * required) return 'balanced';
  return available > required ? 'surplus' : 'short';
}

/** Outputs P22 pattern: adds "headroom" when scenario capacity exceeds demand by >10%. */
export function startsStatus(supportable: number, demand: number): StartsStatus {
  if (demand === 0) return '—';
  if (supportable > demand * 1.1) return 'headroom';
  if (Math.abs(supportable - demand) < 0.05 * demand) return 'balanced';
  return supportable > demand ? 'surplus' : 'short';
}

/** Little's Law: sustainable starts/wk = capacity (hrs/wk) ÷ hours needed per completed start. */
export function sustainableStartsPerWeek(capacityHrsPerWeek: number, hoursPerStart: number): number {
  if (!hoursPerStart) return 0;
  return capacityHrsPerWeek / hoursPerStart;
}

/** Capacity = (delivered + absent hrs) × (1 − absence target) × utilisation target. */
export function areaCapacityHrsPerWeek(
  totalHrsPerWeek: number,
  absenceTarget: number,
  utilisationTarget: number
): number {
  return totalHrsPerWeek * (1 - absenceTarget) * utilisationTarget;
}

export interface AreaRow {
  area: AreaName;
  // Baseline (Outputs columns B/C/D)
  baselineAvailableHrsPerWeek: number;
  baselineRequiredHrsPerWeek: number;
  baselineStatus: HoursStatus;
  // Scenario (columns F/G/H)
  scenarioAvailableHrsPerWeek: number;
  scenarioRequiredHrsPerWeek: number;
  scenarioStatus: HoursStatus;
  // Starts view (columns J/K/L/N/O/P)
  baselineStartsSupportable: number;
  baselineStartsNeeded: number;
  baselineStartsStatus: HoursStatus;
  scenarioStartsSupportable: number;
  scenarioStartsDemand: number;
  realisticStartsTarget: number;
  scenarioStartsStatus: StartsStatus;
}

export interface CountywideSummary {
  demandPerWeek: number;
  requiredHrsPerWeek: number;
  availableHrsPerWeek: number;
  netGapHrsPerWeek: number;
  finishersPerWeek: number;
}

export interface ModelOutputs {
  baselineBlended: BlendedAssumptions;
  scenarioBlended: BlendedAssumptions;
  baselineCountywide: CountywideSummary;
  scenarioCountywide: CountywideSummary;
  byArea: AreaRow[];
  scenarioAreaHours: Record<AreaName, ScenarioAreaHours>;
}

export function computeOutputs(historical: HistoricalInputs, scenario: ScenarioInputs): ModelOutputs {
  const baselineBlended = blendedAssumptions(historical.needProfile);
  const scenarioBlended = blendedAssumptions(scenario.needProfile);

  const scenarioAreaHoursByArea: Record<AreaName, ScenarioAreaHours> = {} as Record<
    AreaName,
    ScenarioAreaHours
  >;
  for (const area of AREAS) {
    const historicalTotalHrsPerWeek =
      historical.areaHours[area].availableHrsPerWeek + historical.areaHours[area].absentHrsPerWeek;
    scenarioAreaHoursByArea[area] = scenarioAreaHours(
      scenario.vacancyData[area],
      historicalTotalHrsPerWeek,
      scenario.absenceTarget,
      scenario.vacancyTarget
    );
  }

  const byArea: AreaRow[] = AREAS.map((area) => {
    const historicalTotalHrsPerWeek =
      historical.areaHours[area].availableHrsPerWeek + historical.areaHours[area].absentHrsPerWeek;

    const baselineAvailableHrsPerWeek = excelRound(
      areaCapacityHrsPerWeek(historicalTotalHrsPerWeek, historical.absenceTarget, historical.utilisationTarget)
    );
    const baselineRequiredHrsPerWeek = excelRound(
      historical.demandPerWeek * historical.areaSplit[area] * baselineBlended.avgTotalVisitHoursPerStart
    );
    const baselineStatus = hoursStatus(baselineAvailableHrsPerWeek, baselineRequiredHrsPerWeek);

    const scenarioTotalHrsPerWeek = scenarioAreaHoursByArea[area].totalAvailableHrsPerWeek;
    const scenarioAvailableHrsPerWeek = excelRound(
      areaCapacityHrsPerWeek(scenarioTotalHrsPerWeek, scenario.absenceTarget, scenario.utilisationTarget)
    );
    const scenarioRequiredHrsPerWeek = excelRound(
      scenario.demandPerWeek * scenario.areaSplit[area] * scenarioBlended.avgTotalVisitHoursPerStart
    );
    const scenarioStatus = hoursStatus(scenarioAvailableHrsPerWeek, scenarioRequiredHrsPerWeek);

    const baselineStartsSupportable = sustainableStartsPerWeek(
      baselineAvailableHrsPerWeek,
      baselineBlended.avgTotalVisitHoursPerStart
    );
    const baselineStartsNeeded = historical.demandPerWeek * historical.areaSplit[area];
    const baselineStartsStatus = hoursStatus(baselineStartsSupportable, baselineStartsNeeded);

    const scenarioStartsSupportable = sustainableStartsPerWeek(
      scenarioAvailableHrsPerWeek,
      scenarioBlended.avgTotalVisitHoursPerStart
    );
    const scenarioStartsDemand = scenario.demandPerWeek * scenario.areaSplit[area];
    const realisticStartsTarget = Math.min(scenarioStartsSupportable, scenarioStartsDemand);
    const scenarioStartsStatusValue = startsStatus(scenarioStartsSupportable, scenarioStartsDemand);

    return {
      area,
      baselineAvailableHrsPerWeek,
      baselineRequiredHrsPerWeek,
      baselineStatus,
      scenarioAvailableHrsPerWeek,
      scenarioRequiredHrsPerWeek,
      scenarioStatus,
      baselineStartsSupportable,
      baselineStartsNeeded,
      baselineStartsStatus,
      scenarioStartsSupportable,
      scenarioStartsDemand,
      realisticStartsTarget,
      scenarioStartsStatus: scenarioStartsStatusValue,
    };
  });

  const baselineAvailableTotal = byArea.reduce((sum, row) => sum + row.baselineAvailableHrsPerWeek, 0);
  const scenarioAvailableTotal = byArea.reduce((sum, row) => sum + row.scenarioAvailableHrsPerWeek, 0);

  const baselineCountywide: CountywideSummary = {
    demandPerWeek: historical.demandPerWeek,
    requiredHrsPerWeek: excelRound(historical.demandPerWeek * baselineBlended.avgTotalVisitHoursPerStart),
    availableHrsPerWeek: excelRound(baselineAvailableTotal),
    netGapHrsPerWeek: 0,
    finishersPerWeek: excelRound(historical.demandPerWeek * baselineBlended.blendedFinisherRate, 1),
  };
  baselineCountywide.netGapHrsPerWeek =
    baselineCountywide.availableHrsPerWeek - baselineCountywide.requiredHrsPerWeek;

  const scenarioCountywide: CountywideSummary = {
    demandPerWeek: scenario.demandPerWeek,
    requiredHrsPerWeek: excelRound(scenario.demandPerWeek * scenarioBlended.avgTotalVisitHoursPerStart),
    availableHrsPerWeek: excelRound(scenarioAvailableTotal),
    netGapHrsPerWeek: 0,
    finishersPerWeek: excelRound(scenario.demandPerWeek * scenarioBlended.blendedFinisherRate, 1),
  };
  scenarioCountywide.netGapHrsPerWeek =
    scenarioCountywide.availableHrsPerWeek - scenarioCountywide.requiredHrsPerWeek;

  return {
    baselineBlended,
    scenarioBlended,
    baselineCountywide,
    scenarioCountywide,
    byArea,
    scenarioAreaHours: scenarioAreaHoursByArea,
  };
}

export function areaSplitTotal(areaSplit: Record<AreaName, number>): number {
  return AREAS.reduce((sum, area) => sum + areaSplit[area], 0);
}

export function needProfileMixTotal(profile: NeedProfile): number {
  return COHORTS.reduce((sum, key) => sum + profile[key].mix, 0);
}
