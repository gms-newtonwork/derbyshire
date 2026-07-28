import { AREAS, type AreaName, type VacancyAreaInput } from '../../lib/model/types';
import type { ScenarioAreaHours } from '../../lib/model/calculations';
import { formatHours, formatPercent } from '../../lib/format';
import { NumberField } from '../shared/NumberField';
import { HelpLabel } from '../shared/InfoTooltip';

interface VacancyTableProps {
  vacancyData: Record<AreaName, VacancyAreaInput>;
  derivedHours: Record<AreaName, ScenarioAreaHours>;
  vacancyTarget: number;
  onChange?: (area: AreaName, field: keyof VacancyAreaInput, value: number) => void;
  editable?: boolean;
}

export function VacancyTable({ vacancyData, derivedHours, vacancyTarget, onChange, editable = false }: VacancyTableProps) {
  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>Area</th>
          <th><HelpLabel term="totalBudgetedHrs">Total budgeted hrs</HelpLabel></th>
          <th><HelpLabel term="vacancyRate">Current vacancy % (calc)</HelpLabel></th>
          <th><HelpLabel term="availableHours">Modelled total available hrs/wk (calc)</HelpLabel></th>
        </tr>
      </thead>
      <tbody>
        {AREAS.map((area) => {
          const row = vacancyData[area];
          const derived = derivedHours[area];
          const aboveTarget = derived.actualVacancyRate > vacancyTarget + 0.005;
          return (
            <tr key={area}>
              <td>{area}</td>
              <td>
                {editable ? (
                  <NumberField
                    label=""
                    value={row.totalBudgetedHrs}
                    step={1}
                    digits={1}
                    onChange={(v) => onChange?.(area, 'totalBudgetedHrs', v)}
                  />
                ) : (
                  formatHours(row.totalBudgetedHrs, 1)
                )}
              </td>
              <td className={aboveTarget ? 'calc-cell cell-warning' : 'calc-cell'}>
                {formatPercent(derived.actualVacancyRate, 1)}
                {aboveTarget && <span className="field-warning-inline">above your {formatPercent(vacancyTarget, 0)} target</span>}
              </td>
              <td className="calc-cell">{formatHours(derived.totalAvailableHrsPerWeek)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
