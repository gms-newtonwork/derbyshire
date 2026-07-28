import { useState } from 'react';
import { HomePage } from './pages/HomePage';
import { HistoricalInputsPage } from './pages/HistoricalInputsPage';
import { ScenarioInputsPage } from './pages/ScenarioInputsPage';
import { OutputsPage } from './pages/OutputsPage';
import type { GuideId } from './lib/guidedScenarios';
import { isDemoDataBuild } from './lib/model/defaultData';

type Tab = 'home' | 'historical' | 'scenario' | 'outputs';

const TABS: { id: Tab; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'historical', label: 'Historical Inputs' },
  { id: 'scenario', label: 'Scenario Inputs' },
  { id: 'outputs', label: 'Outputs' },
];

export default function App() {
  const [tab, setTab] = useState<Tab>('home');
  const [activeGuide, setActiveGuide] = useState<GuideId | null>(null);

  return (
    <div className="app-shell">
      <header className="app-header">
        <span className="app-title">Enablement capacity &amp; demand model</span>
        <nav className="app-nav">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={t.id === tab ? 'nav-button active' : 'nav-button'}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </header>
      {isDemoDataBuild && (
        <div className="demo-data-banner">
          Showing placeholder demo data, not real service figures. Enter your own numbers in Historical
          Inputs to try it for real — nothing you type here leaves your browser.
        </div>
      )}
      <main className="app-main">
        {tab === 'home' && (
          <HomePage
            onNavigate={(t) => setTab(t)}
            onSelectGuide={(id) => {
              setActiveGuide(id);
              setTab('scenario');
            }}
          />
        )}
        {tab === 'historical' && <HistoricalInputsPage />}
        {tab === 'scenario' && (
          <ScenarioInputsPage activeGuide={activeGuide} onDismissGuide={() => setActiveGuide(null)} />
        )}
        {tab === 'outputs' && <OutputsPage />}
      </main>
    </div>
  );
}
