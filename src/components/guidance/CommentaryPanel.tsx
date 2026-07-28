import { useModelStore } from '../../store/useModelStore';
import { generateAreaCommentary, generateCountywideCommentary } from '../../lib/commentary';

export function CommentaryPanel() {
  const historical = useModelStore((s) => s.historical);
  const scenario = useModelStore((s) => s.scenario);
  const outputs = useModelStore((s) => s.outputs);

  return (
    <div className="commentary-panel">
      <p className="commentary-countywide">{generateCountywideCommentary(outputs)}</p>
      <ul className="commentary-list">
        {outputs.byArea.map((row) => (
          <li key={row.area}>{generateAreaCommentary(row, historical, scenario, outputs)}</li>
        ))}
      </ul>
    </div>
  );
}
