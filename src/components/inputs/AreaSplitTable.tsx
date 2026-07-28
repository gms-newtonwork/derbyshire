import { AREAS, type AreaName } from '../../lib/model/types';
import { areaSplitTotal } from '../../lib/model/calculations';
import { formatPercent } from '../../lib/format';
import { NumberField } from '../shared/NumberField';

interface AreaSplitTableProps {
  areaSplit: Record<AreaName, number>;
  onChange?: (area: AreaName, value: number) => void;
  editable?: boolean;
}

export function AreaSplitTable({ areaSplit, onChange, editable = false }: AreaSplitTableProps) {
  const total = areaSplitTotal(areaSplit);
  const isOk = Math.round(total * 10000) === 10000;

  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>Area</th>
          <th>Referrals (% of county)</th>
        </tr>
      </thead>
      <tbody>
        {AREAS.map((area) => (
          <tr key={area}>
            <td>{area}</td>
            <td>
              {editable ? (
                <NumberField
                  label=""
                  value={areaSplit[area]}
                  displayScale={100}
                  step={1}
                  digits={1}
                  suffix="%"
                  onChange={(value) => onChange?.(area, value)}
                />
              ) : (
                formatPercent(areaSplit[area], 1)
              )}
            </td>
          </tr>
        ))}
        <tr className="total-row">
          <td>Total (must equal 100%)</td>
          <td>{formatPercent(total, 1)}</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colSpan={2} className={isOk ? 'validation-ok' : 'validation-error'}>
            {isOk ? 'OK — totals 100%' : 'Adjust — must total 100%'}
          </td>
        </tr>
      </tfoot>
    </table>
  );
}
