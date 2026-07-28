import type { HistoricalInputs, ScenarioInputs } from './types';

/**
 * Entirely synthetic illustrative figures — no real service data. Used for
 * the public demo build (VITE_DEMO_DATA=true) so the shareable link never
 * carries real client numbers. Area names are public geography, not
 * sensitive; only the figures below are fabricated round numbers.
 */
export const placeholderHistoricalInputs: HistoricalInputs = {
  demandPerWeek: 100,
  absenceTarget: 0.2,
  utilisationTarget: 0.6,
  areaSplit: {
    'Amber Valley': 0.15,
    Bolsover: 0.1,
    Chesterfield: 0.15,
    'Derbyshire Dales': 0.1,
    Erewash: 0.15,
    'High Peak': 0.1,
    'North East Derbyshire': 0.1,
    'South Derbyshire': 0.15,
  },
  needProfile: {
    low: { mix: 0.5, startHrsPerWeek: 8, endHrsPerWeek: 2, lengthOfStayDays: 15, finisherRate: 0.8 },
    medium: { mix: 0.35, startHrsPerWeek: 16, endHrsPerWeek: 4, lengthOfStayDays: 20, finisherRate: 0.8 },
    high: { mix: 0.15, startHrsPerWeek: 30, endHrsPerWeek: 20, lengthOfStayDays: 30, finisherRate: 0.8 },
  },
  areaHours: {
    'Amber Valley': { availableHrsPerWeek: 500, absentHrsPerWeek: 125 },
    Bolsover: { availableHrsPerWeek: 400, absentHrsPerWeek: 100 },
    Chesterfield: { availableHrsPerWeek: 480, absentHrsPerWeek: 120 },
    'Derbyshire Dales': { availableHrsPerWeek: 300, absentHrsPerWeek: 75 },
    Erewash: { availableHrsPerWeek: 450, absentHrsPerWeek: 150 },
    'High Peak': { availableHrsPerWeek: 350, absentHrsPerWeek: 90 },
    'North East Derbyshire': { availableHrsPerWeek: 420, absentHrsPerWeek: 80 },
    'South Derbyshire': { availableHrsPerWeek: 380, absentHrsPerWeek: 120 },
  },
};

export const placeholderScenarioInputs: ScenarioInputs = {
  demandPerWeek: 100,
  absenceTarget: 0.2,
  utilisationTarget: 0.6,
  vacancyTarget: 0.15,
  areaSplit: {
    'Amber Valley': 0.15,
    Bolsover: 0.1,
    Chesterfield: 0.15,
    'Derbyshire Dales': 0.1,
    Erewash: 0.15,
    'High Peak': 0.1,
    'North East Derbyshire': 0.1,
    'South Derbyshire': 0.15,
  },
  needProfile: {
    low: { mix: 0.5, startHrsPerWeek: 8, endHrsPerWeek: 2, lengthOfStayDays: 15, finisherRate: 0.8 },
    medium: { mix: 0.35, startHrsPerWeek: 16, endHrsPerWeek: 4, lengthOfStayDays: 20, finisherRate: 0.8 },
    high: { mix: 0.15, startHrsPerWeek: 30, endHrsPerWeek: 20, lengthOfStayDays: 30, finisherRate: 0.8 },
  },
  vacancyData: {
    'Amber Valley': { totalBudgetedHrs: 750 },
    Bolsover: { totalBudgetedHrs: 562.5 },
    Chesterfield: { totalBudgetedHrs: 675 },
    'Derbyshire Dales': { totalBudgetedHrs: 450 },
    Erewash: { totalBudgetedHrs: 675 },
    'High Peak': { totalBudgetedHrs: 487.5 },
    'North East Derbyshire': { totalBudgetedHrs: 562.5 },
    'South Derbyshire': { totalBudgetedHrs: 525 },
  },
};
