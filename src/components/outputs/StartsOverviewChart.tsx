import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { AreaRow } from '../../lib/model/calculations';
import { HISTORICAL_COLOR, SCENARIO_COLOR } from '../../lib/identityColors';
import { NEUTRAL_BAR_COLOR } from '../../lib/statusColors';
import { ThreeSeriesLegend } from './ThreeSeriesLegend';

export function StartsOverviewChart({ rows }: { rows: AreaRow[] }) {
  const data = rows.map((row) => ({
    area: row.area.replace('Derbyshire ', '').replace(' Derbyshire', ''),
    historical: Number(row.baselineStartsSupportable.toFixed(1)),
    scenario: Number(row.scenarioStartsSupportable.toFixed(1)),
    required: Number(row.scenarioStartsDemand.toFixed(1)),
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="area" tick={{ fontSize: 11 }} interval={0} angle={-20} textAnchor="end" height={60} />
        <YAxis tick={{ fontSize: 11 }} label={{ value: 'starts/wk', angle: -90, position: 'insideLeft', fontSize: 11 }} />
        <Tooltip formatter={(value) => Number(value).toLocaleString('en-GB')} />
        <Legend verticalAlign="top" height={28} content={<ThreeSeriesLegend />} />
        <Bar dataKey="historical" name="Historical" fill={HISTORICAL_COLOR} radius={[3, 3, 0, 0]} />
        <Bar dataKey="scenario" name="Scenario" fill={SCENARIO_COLOR} radius={[3, 3, 0, 0]} />
        <Bar dataKey="required" name="Required to meet demand" fill={NEUTRAL_BAR_COLOR} radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
