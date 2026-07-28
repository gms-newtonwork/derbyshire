import { Bar, BarChart, CartesianGrid, Cell, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { AreaRow } from '../../lib/model/calculations';
import { NEUTRAL_BAR_COLOR, STATUS_COLORS } from '../../lib/statusColors';

export function StartsChart({ rows }: { rows: AreaRow[] }) {
  const data = rows.map((row) => ({
    area: row.area.replace('Derbyshire ', '').replace(' Derbyshire', ''),
    supportable: Number(row.scenarioStartsSupportable.toFixed(1)),
    demand: Number(row.scenarioStartsDemand.toFixed(1)),
    status: row.scenarioStartsStatus,
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="area" tick={{ fontSize: 11 }} interval={0} angle={-20} textAnchor="end" height={60} />
        <YAxis tick={{ fontSize: 11 }} label={{ value: 'starts/wk', angle: -90, position: 'insideLeft', fontSize: 11 }} />
        <Tooltip formatter={(value) => Number(value).toLocaleString('en-GB')} />
        <Legend verticalAlign="top" height={28} />
        <Bar dataKey="supportable" name="Starts supportable (scenario)" fill={STATUS_COLORS.balanced} radius={[3, 3, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={`supportable-${index}`} fill={STATUS_COLORS[entry.status]} />
          ))}
        </Bar>
        <Bar dataKey="demand" name="Scenario demand (starts)" fill={NEUTRAL_BAR_COLOR} radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
