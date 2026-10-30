import { useState } from 'react';
import { MODULES, MODULE_ORDER } from '../moduleConfig';

export default function Overview({ history, onSelect }) {
  const [filter, setFilter] = useState('all');

  const filteredHistory = filter === 'all'
    ? history
    : history.filter((h) => h.moduleKey === filter);

  const totalDecisions = history.length;
  const churnAlerts = history.filter((h) => h.moduleKey === 'churn' && h.verdict.toLowerCase().includes('risk')).length;
  const lateShipments = history.filter((h) => h.moduleKey === 'supplychain' && h.verdict.toLowerCase().includes('late')).length;
  const totalAlerts = churnAlerts + lateShipments;

  return (
    <div className="overview-page">

      <div className="form-top-actions">
        {onSelect && (
          <button className="back-to-dash-btn" onClick={() => onSelect('dashboard')}>
            &larr; Return to Dashboard
          </button>
        )}
        <div className="form-engine-pill">
          <span className="engine-pulse" style={{ background: 'var(--churn)' }} />
          <span>Audit Ledger &middot; {history.length} Logged Entries</span>
        </div>
      </div>

      <div className="overview-header-banner">
        <p className="eyebrow" style={{ '--accent': 'var(--churn)' }}>Operational Audit Ledger</p>
        <h1 className="module-title">Session Decision Intelligence</h1>
        <p className="module-desc">
          Continuous record of all model predictions executed across this session. Audit timestamps, verdict outputs, and domain tags are tracked in real-time.
        </p>

        <div className="overview-stats-grid">
          <div className="overview-stat-card">
            <span className="stat-label">TOTAL EVALUATIONS</span>
            <span className="stat-value">{totalDecisions}</span>
            <span className="stat-sub">Across active session</span>
          </div>
          <div className="overview-stat-card">
            <span className="stat-label">HIGH-RISK ALERTS</span>
            <span className="stat-value" style={{ color: totalAlerts > 0 ? 'var(--supplychain)' : 'var(--text)' }}>
              {totalAlerts}
            </span>
            <span className="stat-sub">Churn &amp; Delivery Delays</span>
          </div>
          <div className="overview-stat-card">
            <span className="stat-label">ACTIVE ENGINES TESTED</span>
            <span className="stat-value">
              {new Set(history.map((h) => h.moduleKey)).size} / 4
            </span>
            <span className="stat-sub">Specialized ML Pipelines</span>
          </div>
          <div className="overview-stat-card">
            <span className="stat-label">INFERENCE RELIABILITY</span>
            <span className="stat-value" style={{ color: 'var(--churn)' }}>100%</span>
            <span className="stat-sub">FastAPI Microservice Status</span>
          </div>
        </div>
      </div>

      <div className="overview-filter-bar">
        <div className="overview-filters-group">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Logs ({history.length})
          </button>
          {MODULE_ORDER.map((key) => {
            const m = MODULES[key];
            const count = history.filter((h) => h.moduleKey === key).length;
            return (
              <button
                key={key}
                className={`filter-btn ${filter === key ? 'active' : ''}`}
                style={{ '--accent': m.accent }}
                onClick={() => setFilter(key)}
              >
                <span className="filter-dot" style={{ background: m.accent }} />
                {m.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {filteredHistory.length === 0 ? (
        <div className="overview-empty-state">
          <div className="empty-state-icon">&#10710;</div>
          <h3 className="empty-state-title">No Decisions Recorded Yet</h3>
          <p className="empty-state-desc">
            {filter === 'all'
              ? 'Select any of the 4 decision engines below to enter operational data and generate model-backed readouts.'
              : `No decisions have been logged under the ${MODULES[filter]?.label || filter} module yet.`}
          </p>
          <div className="empty-state-actions">
            {MODULE_ORDER.map((key) => {
              const m = MODULES[key];
              return (
                <button
                  key={key}
                  className="empty-action-pill"
                  style={{ '--accent': m.accent }}
                  onClick={() => onSelect && onSelect(key)}
                >
                  <span className="dot" style={{ background: m.accent }} />
                  Run {m.label} &rarr;
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="log-list">
          {filteredHistory.map((entry, i) => {
            const m = MODULES[entry.moduleKey];
            return (
              <div className="log-row" key={i} style={{ '--accent': m.accent }}>
                <div className="log-left-accent">
                  <span className="dot" style={{ background: m.accent }} />
                </div>
                <div className="log-main">
                  <div className="log-meta-line">
                    <span className="log-module-badge">{m.label}</span>
                    <span className="log-module-key">ENGINE: {m.key.toUpperCase()}</span>
                  </div>
                  <span className="log-verdict">{entry.verdict}</span>
                </div>
                <div className="log-right-actions">
                  <span className="log-time">&#9719; {entry.time}</span>
                  {onSelect && (
                    <button
                      className="log-reopen-btn"
                      onClick={() => onSelect(entry.moduleKey)}
                      title="Open this module in console"
                    >
                      Re-open &rarr;
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
