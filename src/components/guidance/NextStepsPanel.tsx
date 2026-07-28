import { useModelStore } from '../../store/useModelStore';
import { getNextStepSuggestions } from '../../lib/nextSteps';

export function NextStepsPanel() {
  const historical = useModelStore((s) => s.historical);
  const scenario = useModelStore((s) => s.scenario);
  const outputs = useModelStore((s) => s.outputs);
  const suggestions = getNextStepSuggestions(historical, scenario, outputs);

  if (suggestions.length === 0) return null;

  return (
    <div className="next-steps-panel">
      <h3>What to try next</h3>
      <ul>
        {suggestions.map((s) => (
          <li key={s.id}>{s.message}</li>
        ))}
      </ul>
    </div>
  );
}
