import { Bar, BarChart, CartesianGrid, Cell, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { AreaRow } from '../../lib/model/calculations';
import { NEUTRAL_BAR_COLOR, STATUS_COLORS } from '../../lib/statusColors';

interface CapacityChartProps {
  rows: AreaRow[];
  mode: 'baseline' | 'scenario';
}

export function CapacityChart({ rows, mode }: CapacityChartProps) {
  const data = rows.map((row) => ({
    area: row.area.replace('Derbyshire ', '').replace(' Derbyshire', ''),
    available: mode === 'baseline' ? row.baselineAvailableHrsPerWeek : row.scenarioAvailableHrsPerWeek,
    required: mode === 'baseline' ? row.baselineRequiredHrsPerWeek : row.scenarioRequiredHrsPerWeek,
    status: mode === 'baseline' ? row.baselineStatus : row.scenarioStatus,
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="area" tick={{ fontSize: 11 }} interval={0} angle={-20} textAnchor="end" height={60} />
        <YAxis tick={{ fontSize: 11 }} label={{ value: 'hrs/wk', angle: -90, position: 'insideLeft', fontSize: 11 }} />
        <Tooltip formatter={(value) => Number(value).toLocaleString('en-GB')} />
        <Legend verticalAlign="top" height={28} />
        <Bar dataKey="available" name="Available hrs/wk" fill={STATUS_COLORS.balanced} radius={[3, 3, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={`available-${index}`} fill={STATUS_COLORS[entry.status]} />
          ))}
        </Bar>
        <Bar dataKey="required" name="Required hrs/wk" fill={NEUTRAL_BAR_COLOR} radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
