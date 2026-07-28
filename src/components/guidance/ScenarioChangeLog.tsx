import { useModelStore } from '../../store/useModelStore';
import { diffScenario } from '../../lib/scenarioDiff';
import { formatPercent } from '../../lib/format';

export function ScenarioChangeLog() {
  const historical = useModelStore((s) => s.historical);
  const scenario = useModelStore((s) => s.scenario);
  const changes = diffScenario(historical, scenario);

  return (
    <div className="scenario-change-log">
      <h3>Your scenario changes so far</h3>
      {changes.length === 0 ? (
        <p className="change-log-empty">No changes yet — Scenario Inputs still matches Historical Inputs.</p>
      ) : (
        <table className="change-log-table">
          <thead>
            <tr>
              <th>Lever</th>
              <th className="col-historical">Historical</th>
              <th className="col-scenario">Scenario</th>
            </tr>
          </thead>
          <tbody>
            {changes.map((change) => (
              <tr key={change.label}>
                <td>{change.label}</td>
                <td>{change.before}</td>
                <td>{change.after}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <p className="change-log-note">
        Vacancy target: {formatPercent(scenario.vacancyTarget, 0)} — modelled only in Scenario Inputs; Historical
        Inputs has no equivalent to compare against.
      </p>
    </div>
  );
}
