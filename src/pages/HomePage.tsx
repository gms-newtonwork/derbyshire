import { GUIDED_SCENARIOS, type GuideId } from '../lib/guidedScenarios';
import { GuideCard } from '../components/guidance/GuideCard';

interface HomePageProps {
  onNavigate: (tab: 'historical' | 'scenario' | 'outputs') => void;
  onSelectGuide: (id: GuideId) => void;
}

export function HomePage({ onNavigate, onSelectGuide }: HomePageProps) {
  return (
    <div className="page">
      <h1>Enablement capacity &amp; demand modelling</h1>
      <p className="page-intro">
        This tool shows whether your home-based enablement service has the right amount of resource in the
        right places, and lets you model what performance improvements would unlock.
      </p>

      <section>
        <h2>What kind of question are you trying to answer today?</h2>
        <div className="guide-card-grid">
          {GUIDED_SCENARIOS.map((guide) => (
            <GuideCard key={guide.id} guide={guide} onSelect={onSelectGuide} />
          ))}
        </div>
      </section>

      <section>
        <h2>Or go straight to a tab</h2>
        <ul className="home-list">
          <li>
            <button type="button" className="link-button" onClick={() => onNavigate('historical')}>
              Historical Inputs
            </button>{' '}
            — your factual baseline, from the client's dashboard.
          </li>
          <li>
            <button type="button" className="link-button" onClick={() => onNavigate('scenario')}>
              Scenario Inputs
            </button>{' '}
            — your playground. Change these to test a what-if.
          </li>
          <li>
            <button type="button" className="link-button" onClick={() => onNavigate('outputs')}>
              Outputs
            </button>{' '}
            — every figure calculated, Baseline vs Scenario vs Change.
          </li>
        </ul>
      </section>
    </div>
  );
}
