import { HISTORICAL_COLOR, SCENARIO_COLOR } from '../../lib/identityColors';
import { NEUTRAL_BAR_COLOR } from '../../lib/statusColors';

const ENTRIES = [
  { label: 'Historical', color: HISTORICAL_COLOR },
  { label: 'Scenario', color: SCENARIO_COLOR },
  { label: 'Required to meet demand', color: NEUTRAL_BAR_COLOR },
];

/** Fixed-order legend for the historical/scenario/required overview charts — recharts' auto legend sorts by dataKey, which doesn't match the bars' left-to-right order. */
export function ThreeSeriesLegend() {
  return (
    <ul className="chart-legend">
      {ENTRIES.map((entry) => (
        <li key={entry.label}>
          <span className="chart-legend-swatch" style={{ background: entry.color }} />
          {entry.label}
        </li>
      ))}
    </ul>
  );
}
