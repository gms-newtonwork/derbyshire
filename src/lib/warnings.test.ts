import { describe, expect, it } from 'vitest';
import { getScenarioWarnings } from './warnings';
import { defaultScenarioInputs } from './model/defaultData';

describe('scenario warnings', () => {
  it('flags no warnings for the shipped default scenario', () => {
    expect(getScenarioWarnings(defaultScenarioInputs)).toHaveLength(0);
  });

  it('flags a utilisation target of 80% or above', () => {
    const scenario = { ...defaultScenarioInputs, utilisationTarget: 0.8 };
    const warnings = getScenarioWarnings(scenario);
    expect(warnings.some((w) => w.id === 'utilisation-high')).toBe(true);
  });

  it('does not flag utilisation just below 80%', () => {
    const scenario = { ...defaultScenarioInputs, utilisationTarget: 0.79 };
    const warnings = getScenarioWarnings(scenario);
    expect(warnings.some((w) => w.id === 'utilisation-high')).toBe(false);
  });

  it('flags a cohort length of stay below 10 days', () => {
    const scenario = {
      ...defaultScenarioInputs,
      needProfile: {
        ...defaultScenarioInputs.needProfile,
        low: { ...defaultScenarioInputs.needProfile.low, lengthOfStayDays: 8 },
      },
    };
    const warnings = getScenarioWarnings(scenario);
    expect(warnings.some((w) => w.id === 'los-low-low')).toBe(true);
  });
});
