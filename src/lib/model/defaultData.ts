import type { HistoricalInputs, ScenarioInputs } from './types';
import { placeholderHistoricalInputs, placeholderScenarioInputs } from './placeholderData';

/**
 * Historical Inputs tab, as of the latest dashboard refresh captured in
 * Targets_Refresh_Tool_V3.xlsx. This is the factual baseline — only replace
 * these figures when refreshing with new dashboard data.
 */
const derbyshireHistoricalInputs: HistoricalInputs = {
  demandPerWeek: 132,
  absenceTarget: 0.22,
  utilisationTarget: 0.55,
  areaSplit: {
    'Amber Valley': 0.17,
    Bolsover: 0.09,
    Chesterfield: 0.13,
    'Derbyshire Dales': 0.11,
    Erewash: 0.16,
    'High Peak': 0.11,
    'North East Derbyshire': 0.11,
    'South Derbyshire': 0.12,
  },
  needProfile: {
    low: { mix: 0.5, startHrsPerWeek: 6.3, endHrsPerWeek: 1.1, lengthOfStayDays: 17.4, finisherRate: 0.83 },
    medium: { mix: 0.42, startHrsPerWeek: 13.4, endHrsPerWeek: 2.8, lengthOfStayDays: 21.7, finisherRate: 0.83 },
    high: { mix: 0.08, startHrsPerWeek: 32.2, endHrsPerWeek: 27.6, lengthOfStayDays: 31.5, finisherRate: 0.83 },
  },
  areaHours: {
    'Amber Valley': { availableHrsPerWeek: 684, absentHrsPerWeek: 186 },
    Bolsover: { availableHrsPerWeek: 480, absentHrsPerWeek: 234 },
    Chesterfield: { availableHrsPerWeek: 534, absentHrsPerWeek: 216 },
    'Derbyshire Dales': { availableHrsPerWeek: 324, absentHrsPerWeek: 120 },
    Erewash: { availableHrsPerWeek: 576, absentHrsPerWeek: 312 },
    'High Peak': { availableHrsPerWeek: 462, absentHrsPerWeek: 168 },
    'North East Derbyshire': { availableHrsPerWeek: 618, absentHrsPerWeek: 96 },
    'South Derbyshire': { availableHrsPerWeek: 396, absentHrsPerWeek: 198 },
  },
};

/**
 * Scenario Inputs tab, as captured in the workbook — starts as a near-copy of
 * Historical Inputs, with a target vacancy rate and HR FTE data added.
 */
const derbyshireScenarioInputs: ScenarioInputs = {
  demandPerWeek: 132,
  absenceTarget: 0.22,
  utilisationTarget: 0.55,
  vacancyTarget: 0.15,
  areaSplit: {
    'Amber Valley': 0.17,
    Bolsover: 0.09,
    Chesterfield: 0.13,
    'Derbyshire Dales': 0.11,
    Erewash: 0.16,
    'High Peak': 0.11,
    'North East Derbyshire': 0.11,
    'South Derbyshire': 0.12,
  },
  needProfile: {
    low: { mix: 0.5, startHrsPerWeek: 6.3, endHrsPerWeek: 1.1, lengthOfStayDays: 17.4, finisherRate: 0.83 },
    medium: { mix: 0.42, startHrsPerWeek: 13.4, endHrsPerWeek: 2.8, lengthOfStayDays: 22, finisherRate: 0.83 },
    high: { mix: 0.08, startHrsPerWeek: 32.2, endHrsPerWeek: 27.6, lengthOfStayDays: 32, finisherRate: 0.83 },
  },
  vacancyData: {
    'Amber Valley': { totalBudgetedHrs: 1101.0375 },
    Bolsover: { totalBudgetedHrs: 736.3875 },
    Chesterfield: { totalBudgetedHrs: 985.425 },
    'Derbyshire Dales': { totalBudgetedHrs: 723.5625 },
    Erewash: { totalBudgetedHrs: 1173.0375 },
    'High Peak': { totalBudgetedHrs: 784.725 },
    'North East Derbyshire': { totalBudgetedHrs: 844.4625 },
    'South Derbyshire': { totalBudgetedHrs: 808.9875 },
  },
};

/** True only for the public demo build (`npm run build:demo`) — never for local dev, tests, or the normal build. */
export const isDemoDataBuild = import.meta.env.VITE_DEMO_DATA === 'true';

export const defaultHistoricalInputs: HistoricalInputs = isDemoDataBuild
  ? placeholderHistoricalInputs
  : derbyshireHistoricalInputs;

export const defaultScenarioInputs: ScenarioInputs = isDemoDataBuild
  ? placeholderScenarioInputs
  : derbyshireScenarioInputs;
