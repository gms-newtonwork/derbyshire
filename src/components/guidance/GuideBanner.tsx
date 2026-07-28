import { getGuidedScenario, type GuideId } from '../../lib/guidedScenarios';

interface GuideBannerProps {
  guideId: GuideId;
  onDismiss: () => void;
}

export function GuideBanner({ guideId, onDismiss }: GuideBannerProps) {
  const guide = getGuidedScenario(guideId);

  return (
    <div className="guide-banner">
      <div>
        <strong>{guide.question}</strong>
        <p>{guide.whatToLookAt}</p>
        <ul>
          {guide.firstSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ul>
      </div>
      <button type="button" className="guide-banner-dismiss" onClick={onDismiss} aria-label="Dismiss guidance">
        ✕
      </button>
    </div>
  );
}
