import { AREAS, type AreaName, type VacancyAreaInput } from '../../lib/model/types';
import type { ScenarioAreaHours } from '../../lib/model/calculations';
import { formatHours, formatPercent } from '../../lib/format';
import { NumberField } from '../shared/NumberField';
import { HelpLabel } from '../shared/InfoTooltip';

interface VacancyTableProps {
  vacancyData: Record<AreaName, VacancyAreaInput>;
  derivedHours: Record<AreaName, ScenarioAreaHours>;
  onChange?: (area: AreaName, field: keyof VacancyAreaInput, value: number) => void;
  editable?: boolean;
}

export function VacancyTable({ vacancyData, derivedHours, onChange, editable = false }: VacancyTableProps) {
  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>Area</th>
          <th>Total ESW FTE (incl. vacancies)</th>
          <th>Vacancies (ESW FTE)</th>
          <th><HelpLabel term="totalBudgetedHrs">Total budgeted hrs</HelpLabel></th>
          <th><HelpLabel term="vacancyRate">Vacancy % (calc)</HelpLabel></th>
          <th><HelpLabel term="availableHours">Modelled total available hrs/wk (calc)</HelpLabel></th>
        </tr>
      </thead>
      <tbody>
        {AREAS.map((area) => {
          const row = vacancyData[area];
          const derived = derivedHours[area];
          return (
            <tr key={area}>
              <td>{area}</td>
              <td>
                {editable ? (
                  <NumberField
                    label=""
                    value={row.totalEswFte}
                    step={0.1}
                    digits={2}
                    onChange={(v) => onChange?.(area, 'totalEswFte', v)}
                  />
                ) : (
                  formatHours(row.totalEswFte, 2)
                )}
              </td>
              <td>
                {editable ? (
                  <NumberField
                    label=""
                    value={row.vacanciesFte}
                    step={0.1}
                    digits={2}
                    onChange={(v) => onChange?.(area, 'vacanciesFte', v)}
                  />
                ) : (
                  formatHours(row.vacanciesFte, 2)
                )}
              </td>
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
              <td className="calc-cell">{formatPercent(derived.actualVacancyRate, 1)}</td>
              <td className="calc-cell">{formatHours(derived.totalAvailableHrsPerWeek)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
