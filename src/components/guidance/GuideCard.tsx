import type { GuidedScenario } from '../../lib/guidedScenarios';

interface GuideCardProps {
  guide: GuidedScenario;
  onSelect: (id: GuidedScenario['id']) => void;
}

export function GuideCard({ guide, onSelect }: GuideCardProps) {
  return (
    <button type="button" className="guide-card" onClick={() => onSelect(guide.id)}>
      <span className="guide-card-question">{guide.question}</span>
      <span className="guide-card-description">{guide.description}</span>
    </button>
  );
}
