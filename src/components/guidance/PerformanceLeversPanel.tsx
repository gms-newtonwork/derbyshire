import { useModelStore } from '../../store/useModelStore';
import { getPerformanceLevers } from '../../lib/performanceLevers';

const TOP_N = 4;

export function PerformanceLeversPanel() {
  const scenario = useModelStore((s) => s.scenario);
  const outputs = useModelStore((s) => s.outputs);
  const levers = getPerformanceLevers(scenario, outputs).slice(0, TOP_N);

  if (levers.length === 0) return null;

  return (
    <section className="performance-levers-panel">
      <h2>Performance levers</h2>
      <p className="section-note">
        Recruitment isn't the only way to close a gap — these need-profile changes apply countywide, ranked
        by impact.
      </p>
      <ul>
        {levers.map((lever) => (
          <li key={lever.id}>{lever.message}</li>
        ))}
      </ul>
    </section>
  );
}
