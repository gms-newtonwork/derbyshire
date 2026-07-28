import { useModelStore } from '../../store/useModelStore';
import { getStaffingActions } from '../../lib/staffingActions';

export function StaffingActionsPanel() {
  const historical = useModelStore((s) => s.historical);
  const scenario = useModelStore((s) => s.scenario);
  const outputs = useModelStore((s) => s.outputs);
  const actions = getStaffingActions(historical, scenario, outputs);

  if (actions.length === 0) return null;

  return (
    <section className="staffing-actions-panel">
      <h2>Staffing actions</h2>
      <p className="section-note">
        Areas currently running a higher vacancy rate than your scenario's target — recruiting here would
        add capacity directly.
      </p>
      <ul>
        {actions.map((action) => (
          <li key={action.area}>{action.message}</li>
        ))}
      </ul>
    </section>
  );
}
