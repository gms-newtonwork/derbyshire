import { describe, expect, it } from 'vitest';
import { getPerformanceLevers } from './performanceLevers';
import { computeOutputs } from './model/calculations';
import { defaultHistoricalInputs, defaultScenarioInputs } from './model/defaultData';

describe('getPerformanceLevers', () => {
  const outputs = computeOutputs(defaultHistoricalInputs, defaultScenarioInputs);
  const levers = getPerformanceLevers(defaultScenarioInputs, outputs);

  it('returns one length-of-stay and one effectiveness lever per cohort', () => {
    expect(levers).toHaveLength(6);
    expect(levers.filter((l) => l.leverType === 'lengthOfStay')).toHaveLength(3);
    expect(levers.filter((l) => l.leverType === 'effectiveness')).toHaveLength(3);
  });

  it('is sorted by hours saved, descending', () => {
    for (let i = 1; i < levers.length; i++) {
      expect(levers[i - 1].hoursSavedPerWeek).toBeGreaterThanOrEqual(levers[i].hoursSavedPerWeek);
    }
  });

  it('matches the hand-derived sensitivity for the medium cohort length of stay', () => {
    // d(avgTotalVisitHoursPerStart)/d(LoS) = mix * avgHrsPerPersonPerWeek / 7; countywide impact = demand * that.
    const medium = defaultScenarioInputs.needProfile.medium;
    const avgHrsPerPersonPerWeek = (medium.startHrsPerWeek + medium.endHrsPerWeek * 3) / 4;
    const expected = (defaultScenarioInputs.demandPerWeek * medium.mix * avgHrsPerPersonPerWeek) / 7;
    const lever = levers.find((l) => l.leverType === 'lengthOfStay' && l.cohort === 'medium');
    expect(lever?.hoursSavedPerWeek).toBeCloseTo(expected, 9);
  });

  it('every lever has a positive hours-saved value given non-trivial demand', () => {
    for (const lever of levers) {
      expect(lever.hoursSavedPerWeek).toBeGreaterThan(0);
    }
  });
});
