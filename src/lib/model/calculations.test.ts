import { describe, expect, it } from 'vitest';
import { computeOutputs } from './calculations';
import { defaultHistoricalInputs, defaultScenarioInputs } from './defaultData';

// Expected values below are read directly (data_only=True) from
// Targets_Refresh_Tool_V3.xlsx — Outputs tab. Any change to calculations.ts
// must keep these passing, or the web app has drifted from the source model.

describe('blended assumptions (Outputs section 1)', () => {
  const { baselineBlended, scenarioBlended } = computeOutputs(defaultHistoricalInputs, defaultScenarioInputs);

  it('matches Outputs!B6/C6 avg total visit hours per start', () => {
    expect(baselineBlended.avgTotalVisitHoursPerStart).toBeCloseTo(20.428757142857144, 9);
    expect(scenarioBlended.avgTotalVisitHoursPerStart).toBeCloseTo(20.691142857142857, 9);
  });

  it('matches Outputs!B7/C7 weighted avg length of stay', () => {
    expect(baselineBlended.weightedAvgLengthOfStayDays).toBeCloseTo(20.334, 9);
    expect(scenarioBlended.weightedAvgLengthOfStayDays).toBeCloseTo(20.5, 9);
  });

  it('matches Outputs!B8/C8 avg effectiveness hrs', () => {
    expect(baselineBlended.avgEffectivenessHrs).toBeCloseTo(7.42, 9);
    expect(scenarioBlended.avgEffectivenessHrs).toBeCloseTo(7.42, 9);
  });

  it('matches Outputs!B9/C9 blended finisher rate', () => {
    expect(baselineBlended.blendedFinisherRate).toBeCloseTo(0.83, 9);
    expect(scenarioBlended.blendedFinisherRate).toBeCloseTo(0.83, 9);
  });
});

describe('countywide summary (Outputs section 2)', () => {
  const { baselineCountywide, scenarioCountywide } = computeOutputs(
    defaultHistoricalInputs,
    defaultScenarioInputs
  );

  it('matches baseline B13:B17', () => {
    expect(baselineCountywide.demandPerWeek).toBe(132);
    expect(baselineCountywide.requiredHrsPerWeek).toBe(2697);
    expect(baselineCountywide.availableHrsPerWeek).toBe(2403);
    expect(baselineCountywide.netGapHrsPerWeek).toBe(-294);
    expect(baselineCountywide.finishersPerWeek).toBe(109.6);
  });

  it('matches scenario C13:C17', () => {
    expect(scenarioCountywide.demandPerWeek).toBe(132);
    expect(scenarioCountywide.requiredHrsPerWeek).toBe(2731);
    expect(scenarioCountywide.availableHrsPerWeek).toBe(2647);
    expect(scenarioCountywide.netGapHrsPerWeek).toBe(-84);
    expect(scenarioCountywide.finishersPerWeek).toBe(109.6);
  });
});

describe('by-area capacity vs demand (Outputs section 3)', () => {
  const { byArea } = computeOutputs(defaultHistoricalInputs, defaultScenarioInputs);
  const byName = Object.fromEntries(byArea.map((row) => [row.area, row]));

  it('Amber Valley: short on hours and starts, both baseline and scenario', () => {
    const row = byName['Amber Valley'];
    expect(row.baselineAvailableHrsPerWeek).toBe(373);
    expect(row.baselineRequiredHrsPerWeek).toBe(458);
    expect(row.baselineStatus).toBe('short');
    expect(row.scenarioAvailableHrsPerWeek).toBe(401);
    expect(row.scenarioRequiredHrsPerWeek).toBe(464);
    expect(row.scenarioStatus).toBe('short');
    expect(row.scenarioStartsStatus).toBe('short');
  });

  it('Bolsover: surplus on baseline hours, headroom on scenario starts', () => {
    const row = byName.Bolsover;
    expect(row.baselineAvailableHrsPerWeek).toBe(306);
    expect(row.baselineRequiredHrsPerWeek).toBe(243);
    expect(row.baselineStatus).toBe('surplus');
    expect(row.scenarioAvailableHrsPerWeek).toBe(306);
    expect(row.scenarioRequiredHrsPerWeek).toBe(246);
    expect(row.scenarioStatus).toBe('surplus');
    expect(row.scenarioStartsStatus).toBe('headroom');
  });

  it('Chesterfield: short baseline, balanced scenario', () => {
    const row = byName.Chesterfield;
    expect(row.baselineAvailableHrsPerWeek).toBe(322);
    expect(row.baselineRequiredHrsPerWeek).toBe(351);
    expect(row.baselineStatus).toBe('short');
    expect(row.scenarioAvailableHrsPerWeek).toBe(359);
    expect(row.scenarioRequiredHrsPerWeek).toBe(355);
    expect(row.scenarioStatus).toBe('balanced');
  });

  it('North East Derbyshire: balanced baseline and scenario', () => {
    const row = byName['North East Derbyshire'];
    expect(row.baselineAvailableHrsPerWeek).toBe(306);
    expect(row.baselineRequiredHrsPerWeek).toBe(297);
    expect(row.baselineStatus).toBe('balanced');
    expect(row.scenarioAvailableHrsPerWeek).toBe(308);
    expect(row.scenarioRequiredHrsPerWeek).toBe(300);
    expect(row.scenarioStatus).toBe('balanced');
  });

  it('county totals match Outputs!B30/C30/F30/G30', () => {
    const baselineAvailableTotal = byArea.reduce((s, r) => s + r.baselineAvailableHrsPerWeek, 0);
    const baselineRequiredTotal = byArea.reduce((s, r) => s + r.baselineRequiredHrsPerWeek, 0);
    const scenarioAvailableTotal = byArea.reduce((s, r) => s + r.scenarioAvailableHrsPerWeek, 0);
    const scenarioRequiredTotal = byArea.reduce((s, r) => s + r.scenarioRequiredHrsPerWeek, 0);
    expect(baselineAvailableTotal).toBe(2403);
    expect(baselineRequiredTotal).toBe(2698);
    expect(scenarioAvailableTotal).toBe(2647);
    expect(scenarioRequiredTotal).toBe(2730);
  });

  it('starts view totals match Outputs!J30/K30/N30/O30', () => {
    const startsSupportableTotal = byArea.reduce((s, r) => s + r.baselineStartsSupportable, 0);
    const startsNeededTotal = byArea.reduce((s, r) => s + r.baselineStartsNeeded, 0);
    const scenarioStartsSupportableTotal = byArea.reduce((s, r) => s + r.scenarioStartsSupportable, 0);
    const realisticStartsTotal = byArea.reduce((s, r) => s + r.realisticStartsTarget, 0);
    expect(startsSupportableTotal).toBeCloseTo(117.62830128117717, 6);
    expect(startsNeededTotal).toBeCloseTo(132, 9);
    expect(scenarioStartsSupportableTotal).toBeCloseTo(127.92913461936784, 6);
    expect(realisticStartsTotal).toBeCloseTo(124.46418260401275, 6);
  });
});

describe('scenario vacancy-derived area hours', () => {
  const { scenarioAreaHours } = computeOutputs(defaultHistoricalInputs, defaultScenarioInputs);

  it('matches Scenario Inputs!D31/G42 for Amber Valley', () => {
    const row = scenarioAreaHours['Amber Valley'];
    expect(row.actualVacancyRate).toBeCloseTo(0.2098361772419196, 9);
    expect(row.totalAvailableHrsPerWeek).toBeCloseTo(935.881875, 6);
  });

  it('matches Scenario Inputs!D32/G43 for Bolsover (actual vacancy better than target)', () => {
    const row = scenarioAreaHours.Bolsover;
    expect(row.actualVacancyRate).toBeCloseTo(0.03040179253450126, 9);
    expect(row.totalAvailableHrsPerWeek).toBeCloseTo(714, 6);
  });
});
