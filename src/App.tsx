import { useState } from 'react';
import { HomePage } from './pages/HomePage';
import { HistoricalInputsPage } from './pages/HistoricalInputsPage';
import { ScenarioInputsPage } from './pages/ScenarioInputsPage';
import { OutputsPage } from './pages/OutputsPage';

type Tab = 'home' | 'historical' | 'scenario' | 'outputs';

const TABS: { id: Tab; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'historical', label: 'Historical Inputs' },
  { id: 'scenario', label: 'Scenario Inputs' },
  { id: 'outputs', label: 'Outputs' },
];

export default function App() {
  const [tab, setTab] = useState<Tab>('home');

  return (
    <div className="app-shell">
      <header className="app-header">
        <span className="app-title">Reablement capacity &amp; demand model</span>
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
      <main className="app-main">
        {tab === 'home' && <HomePage onNavigate={(t) => setTab(t)} />}
        {tab === 'historical' && <HistoricalInputsPage />}
        {tab === 'scenario' && <ScenarioInputsPage />}
        {tab === 'outputs' && <OutputsPage />}
      </main>
    </div>
  );
}
