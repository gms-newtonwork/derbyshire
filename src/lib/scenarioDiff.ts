import { AREAS, COHORTS, COHORT_LABELS, type HistoricalInputs, type ScenarioInputs } from './model/types';
import { formatHours, formatPercent } from './format';

export interface ScenarioChange {
  label: string;
  before: string;
  after: string;
}

const EPSILON = 1e-9;

function differs(a: number, b: number): boolean {
  return Math.abs(a - b) > EPSILON;
}

/**
 * Human-readable diff of every scenario lever against the historical baseline,
 * so users can see the story their edits are telling as they explore.
 */
export function diffScenario(historical: HistoricalInputs, scenario: ScenarioInputs): ScenarioChange[] {
  const changes: ScenarioChange[] = [];

  if (differs(historical.demandPerWeek, scenario.demandPerWeek)) {
    changes.push({
      label: 'Total demand (referrals/wk)',
      before: formatHours(historical.demandPerWeek),
      after: formatHours(scenario.demandPerWeek),
    });
  }

  if (differs(historical.absenceTarget, scenario.absenceTarget)) {
    changes.push({
      label: 'Target absence rate',
      before: formatPercent(historical.absenceTarget, 0),
      after: formatPercent(scenario.absenceTarget, 0),
    });
  }

  if (differs(historical.utilisationTarget, scenario.utilisationTarget)) {
    changes.push({
      label: 'Target utilisation rate',
      before: formatPercent(historical.utilisationTarget, 0),
      after: formatPercent(scenario.utilisationTarget, 0),
    });
  }

  for (const area of AREAS) {
    if (differs(historical.areaSplit[area], scenario.areaSplit[area])) {
      changes.push({
        label: `Referral split — ${area}`,
        before: formatPercent(historical.areaSplit[area], 1),
        after: formatPercent(scenario.areaSplit[area], 1),
      });
    }
  }

  for (const key of COHORTS) {
    const h = historical.needProfile[key];
    const s = scenario.needProfile[key];
    const label = COHORT_LABELS[key];
    if (differs(h.mix, s.mix)) {
      changes.push({ label: `${label} — mix`, before: formatPercent(h.mix, 1), after: formatPercent(s.mix, 1) });
    }
    if (differs(h.startHrsPerWeek, s.startHrsPerWeek)) {
      changes.push({
        label: `${label} — hrs/wk at start`,
        before: formatHours(h.startHrsPerWeek, 1),
        after: formatHours(s.startHrsPerWeek, 1),
      });
    }
    if (differs(h.endHrsPerWeek, s.endHrsPerWeek)) {
      changes.push({
        label: `${label} — hrs/wk at end`,
        before: formatHours(h.endHrsPerWeek, 1),
        after: formatHours(s.endHrsPerWeek, 1),
      });
    }
    if (differs(h.lengthOfStayDays, s.lengthOfStayDays)) {
      changes.push({
        label: `${label} — length of stay (days)`,
        before: formatHours(h.lengthOfStayDays, 1),
        after: formatHours(s.lengthOfStayDays, 1),
      });
    }
    if (differs(h.finisherRate, s.finisherRate)) {
      changes.push({
        label: `${label} — finisher rate`,
        before: formatPercent(h.finisherRate, 1),
        after: formatPercent(s.finisherRate, 1),
      });
    }
  }

  return changes;
}
