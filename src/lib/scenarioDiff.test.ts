import { describe, expect, it } from 'vitest';
import { diffScenario } from './scenarioDiff';
import { defaultHistoricalInputs, defaultScenarioInputs } from './model/defaultData';

describe('diffScenario', () => {
  it('reports the known differences between the shipped historical and scenario data', () => {
    const changes = diffScenario(defaultHistoricalInputs, defaultScenarioInputs);
    const labels = changes.map((c) => c.label);
    // The shipped scenario data differs from historical only in medium/high LoS.
    expect(labels).toContain('Medium (start 10-20 hrs/wk) — length of stay (days)');
    expect(labels).toContain('High (start >20 hrs/wk) — length of stay (days)');
    expect(changes).toHaveLength(2);
  });

  it('reports no changes when scenario exactly matches historical', () => {
    const changes = diffScenario(defaultHistoricalInputs, {
      ...defaultScenarioInputs,
      needProfile: defaultHistoricalInputs.needProfile,
    });
    expect(changes).toHaveLength(0);
  });

  it('reports a demand change', () => {
    const changes = diffScenario(defaultHistoricalInputs, { ...defaultScenarioInputs, demandPerWeek: 150 });
    expect(changes.some((c) => c.label === 'Total demand (referrals/wk)')).toBe(true);
  });
});
