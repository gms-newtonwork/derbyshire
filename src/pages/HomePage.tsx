interface HomePageProps {
  onNavigate: (tab: 'historical' | 'scenario' | 'outputs') => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="page">
      <h1>Reablement capacity &amp; demand modelling</h1>
      <p className="page-intro">
        This tool shows whether your home-based reablement service has the right amount of resource in the
        right places, and lets you model what performance improvements would unlock.
      </p>

      <section>
        <h2>How it's laid out</h2>
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

      <p className="home-note">
        This is layer 1 of the build: the input tabs and core calculations, matching the Excel model exactly.
        Guided prompts, tooltips, auto-generated commentary and warnings come in later layers.
      </p>
    </div>
  );
}
