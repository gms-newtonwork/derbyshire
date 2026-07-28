import { COHORTS, COHORT_LABELS, type CohortKey, type CohortProfile, type NeedProfile } from '../../lib/model/types';
import { avgHrsPerPersonPerWeek, effectivenessHrs, needProfileMixTotal } from '../../lib/model/calculations';
import { formatNumber, formatPercent } from '../../lib/format';
import { NumberField } from '../shared/NumberField';

interface NeedProfileTableProps {
  needProfile: NeedProfile;
  onChange?: (cohort: CohortKey, field: keyof CohortProfile, value: number) => void;
  editable?: boolean;
}

export function NeedProfileTable({ needProfile, onChange, editable = false }: NeedProfileTableProps) {
  const mixTotal = needProfileMixTotal(needProfile);
  const isOk = Math.round(mixTotal * 10000) === 10000;

  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>Cohort</th>
          <th>Mix (% of starts)</th>
          <th>Avg weekly hrs at start</th>
          <th>Avg weekly hrs at end</th>
          <th>Avg length of stay (days)</th>
          <th>Successful finisher rate</th>
          <th>Avg hrs/person/wk (calc)</th>
          <th>Effectiveness (calc)</th>
        </tr>
      </thead>
      <tbody>
        {COHORTS.map((key) => {
          const cohort = needProfile[key];
          return (
            <tr key={key}>
              <td>{COHORT_LABELS[key]}</td>
              <td>
                {editable ? (
                  <NumberField
                    label=""
                    value={cohort.mix}
                    displayScale={100}
                    digits={1}
                    suffix="%"
                    onChange={(v) => onChange?.(key, 'mix', v)}
                  />
                ) : (
                  formatPercent(cohort.mix, 1)
                )}
              </td>
              <td>
                {editable ? (
                  <NumberField
                    label=""
                    value={cohort.startHrsPerWeek}
                    digits={1}
                    step={0.1}
                    onChange={(v) => onChange?.(key, 'startHrsPerWeek', v)}
                  />
                ) : (
                  formatNumber(cohort.startHrsPerWeek)
                )}
              </td>
              <td>
                {editable ? (
                  <NumberField
                    label=""
                    value={cohort.endHrsPerWeek}
                    digits={1}
                    step={0.1}
                    onChange={(v) => onChange?.(key, 'endHrsPerWeek', v)}
                  />
                ) : (
                  formatNumber(cohort.endHrsPerWeek)
                )}
              </td>
              <td>
                {editable ? (
                  <NumberField
                    label=""
                    value={cohort.lengthOfStayDays}
                    digits={1}
                    step={1}
                    onChange={(v) => onChange?.(key, 'lengthOfStayDays', v)}
                  />
                ) : (
                  formatNumber(cohort.lengthOfStayDays)
                )}
              </td>
              <td>
                {editable ? (
                  <NumberField
                    label=""
                    value={cohort.finisherRate}
                    displayScale={100}
                    digits={1}
                    suffix="%"
                    onChange={(v) => onChange?.(key, 'finisherRate', v)}
                  />
                ) : (
                  formatPercent(cohort.finisherRate, 1)
                )}
              </td>
              <td className="calc-cell">{formatNumber(avgHrsPerPersonPerWeek(cohort), 2)}</td>
              <td className="calc-cell">{formatNumber(effectivenessHrs(cohort), 2)}</td>
            </tr>
          );
        })}
        <tr className="total-row">
          <td>Mix total (must equal 100%)</td>
          <td>{formatPercent(mixTotal, 1)}</td>
          <td colSpan={5} />
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colSpan={8} className={isOk ? 'validation-ok' : 'validation-error'}>
            {isOk ? 'OK — totals 100%' : 'Adjust — must total 100%'}
          </td>
        </tr>
      </tfoot>
    </table>
  );
}
