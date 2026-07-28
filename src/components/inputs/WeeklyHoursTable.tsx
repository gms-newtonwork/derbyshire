import { AREAS, type AreaHoursInput, type AreaName } from '../../lib/model/types';
import { formatHours, formatPercent } from '../../lib/format';
import { NumberField } from '../shared/NumberField';

interface WeeklyHoursTableProps {
  areaHours: Record<AreaName, AreaHoursInput>;
  onChange?: (area: AreaName, field: keyof AreaHoursInput, value: number) => void;
  editable?: boolean;
}

export function WeeklyHoursTable({ areaHours, onChange, editable = false }: WeeklyHoursTableProps) {
  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>Area</th>
          <th>Actual available visit hrs/wk</th>
          <th>Actual absent hrs/wk</th>
          <th>Total available hrs/wk (calc)</th>
          <th>Actual absence % (calc)</th>
        </tr>
      </thead>
      <tbody>
        {AREAS.map((area) => {
          const row = areaHours[area];
          const total = row.availableHrsPerWeek + row.absentHrsPerWeek;
          const absencePct = total ? row.absentHrsPerWeek / total : 0;
          return (
            <tr key={area}>
              <td>{area}</td>
              <td>
                {editable ? (
                  <NumberField
                    label=""
                    value={row.availableHrsPerWeek}
                    step={1}
                    onChange={(v) => onChange?.(area, 'availableHrsPerWeek', v)}
                  />
                ) : (
                  formatHours(row.availableHrsPerWeek)
                )}
              </td>
              <td>
                {editable ? (
                  <NumberField
                    label=""
                    value={row.absentHrsPerWeek}
                    step={1}
                    onChange={(v) => onChange?.(area, 'absentHrsPerWeek', v)}
                  />
                ) : (
                  formatHours(row.absentHrsPerWeek)
                )}
              </td>
              <td className="calc-cell">{formatHours(total)}</td>
              <td className="calc-cell">{formatPercent(absencePct, 1)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
