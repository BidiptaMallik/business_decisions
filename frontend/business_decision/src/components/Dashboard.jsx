import { MODULES, MODULE_ORDER } from '../moduleConfig';

export default function Dashboard({ onSelect, historyCount }) {
  const moduleThumbnails = {
    churn: '/images/retention.jpg',
    supplychain: '/images/supplychain.jpg',
    market: '/images/market.jpg',
    pricing: null,
  };

  const moduleAlgorithms = {
    churn: 'XGBoost Classification &middot; 96.4% Precision',
    pricing: 'Elasticity Regression &middot; Volume Estimator',
    market: 'Multi-Round Syndicate Classifier &middot; Top-500',
    supplychain: 'Logistic Risk Radar &middot; Trans-Corridor'
  };

  return (
    <div className="dashboard-view">
      <div className="dash-hero-banner">
        <div className="dash-hero-left">
          <span className="eyebrow" style={{ '--accent': 'var(--churn)' }}>
            Operational Command Center
          </span>
          <h1 className="dash-title">Executive Decision Intelligence</h1>
          <p className="dash-desc">
            Deploy calibrated machine learning ensembles across four high-impact corporate domains.
            All predictions are processed in real-time by the connected FastAPI microservice with persistent audit logging.
          </p>

          <div className="dash-stats-strip">
            <div className="dash-stat-pill">
              <span className="dash-pill-indicator green" />
              <span>4 Production Ensembles Live</span>
            </div>
            <div className="dash-stat-pill">
              <span className="dash-pill-indicator blue" />
              <span>{historyCount} Decisions Logged This Session</span>
            </div>
            <div className="dash-stat-pill">
              <span className="dash-pill-indicator amber" />
              <span>Zero-Leakage Architecture</span>
            </div>
          </div>
        </div>
      </div>

      <div className="dash-section-header">
        <h2 className="dash-section-title">Specialized Decision Engines</h2>
        <span className="dash-section-sub">Select an engine to enter operational parameters</span>
      </div>

      <div className="dash-card-grid">
        {MODULE_ORDER.map((key, idx) => {
          const m = MODULES[key];
          const img = moduleThumbnails[key];
          const algo = moduleAlgorithms[key];

          return (
            <div
              key={key}
              className="dash-module-card"
              style={{ '--accent': m.accent }}
              onClick={() => onSelect(key)}
            >
              <div className="dash-card-media">
                {img ? (
                  <img src={img} alt={m.label} className="dash-card-img" />
                ) : (
                  <div className="dash-card-graphic">
                    <div className="dash-mini-bars">
                      <div className="mini-bar b1" />
                      <div className="mini-bar b2" />
                      <div className="mini-bar b3" />
                      <div className="mini-bar b4" />
                    </div>
                    <span className="dash-graphic-tag">ELASTICITY CURVE</span>
                  </div>
                )}
                <span className="dash-card-badge">MODULE 0{idx + 1}</span>
              </div>

              <div className="dash-card-body">
                <div className="dash-card-header-row">
                  <span className="dash-dot" style={{ background: m.accent }} />
                  <span className="dash-algo-pill" dangerouslySetInnerHTML={{ __html: algo }} />
                </div>

                <h3 className="dash-card-name">{m.label}</h3>
                <h4 className="dash-card-question">{m.title}</h4>
                <p className="dash-card-desc">{m.description}</p>

                <div className="dash-card-footer">
                  <span className="dash-cta-link">
                    Launch Model &rarr;
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="dash-audit-banner" onClick={() => onSelect('overview')}>
        <div className="dash-audit-left">
          <div className="dash-audit-icon-box">&#10710;</div>
          <div>
            <h3 className="dash-audit-title">Session Audit Ledger</h3>
            <p className="dash-audit-desc">
              Track and compare model outputs generated during this executive session.
            </p>
          </div>
        </div>
        <div className="dash-audit-right">
          <div className="dash-audit-counter">
            <span className="counter-num">{historyCount}</span>
            <span className="counter-label">EVALUATIONS LOGGED</span>
          </div>
          <button className="dash-audit-btn">
            View Ledger &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}
