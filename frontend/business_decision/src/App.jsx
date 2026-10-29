import { useState } from 'react';
import Sidebar from './components/Sidebar';
import DecisionForm from './components/DecisionForm';
import Landing from './components/Landing';
import Dashboard from './components/Dashboard';
import Overview from './components/Overview';
import { MODULES } from './moduleConfig';

// view is one of: 'landing' | 'dashboard' | 'overview' | a module key
export default function App() {
  const [view, setView] = useState('landing');
  const [history, setHistory] = useState([]);

  function addToHistory(entry) {
    setHistory((prev) => [entry, ...prev]);
  }

  if (view === 'landing') {
    return <Landing onStart={(target = 'dashboard') => setView(target)} />;
  }

  const isModule = Boolean(MODULES[view]);

  // Current view title & accent
  const currentTitle = isModule
    ? MODULES[view].label
    : view === 'overview'
    ? 'Session Audit Ledger'
    : 'Executive Dashboard';

  const currentAccent = isModule
    ? MODULES[view].accent
    : view === 'overview'
    ? '#8d96a3'
    : 'var(--paper)';

  return (
    <div className="app-shell">
      <Sidebar
        active={view}
        onSelect={setView}
        onHome={() => setView('dashboard')}
        onLanding={() => setView('landing')}
      />

      <div className="content-container">
        {/* Top App Header */}
        <header className="app-topbar">
          <div className="topbar-breadcrumbs">
            <span className="crumb-root" onClick={() => setView('dashboard')}>Console</span>
            <span className="crumb-slash">/</span>
            <span className="crumb-current" style={{ color: currentAccent }}>{currentTitle}</span>
          </div>

          <div className="topbar-right">
            <div className="topbar-status-pill">
              <span className="topbar-pulse-dot" />
              <span>FastAPI &middot; Port 8000 Live</span>
            </div>

            <button
              className="topbar-tour-btn"
              onClick={() => setView('landing')}
              title="Return to Presentation &amp; Features Tour"
            >
              <span>&#10022; Welcome Tour</span>
            </button>
          </div>
        </header>

        {/* Main View Area */}
        <main className="main">
          {view === 'dashboard' && <Dashboard onSelect={setView} historyCount={history.length} />}
          {view === 'overview' && <Overview history={history} onSelect={setView} />}
          {isModule && (
            <DecisionForm
              key={view}
              module={MODULES[view]}
              onResult={addToHistory}
              onBack={() => setView('dashboard')}
            />
          )}
        </main>
      </div>
    </div>
  );
}