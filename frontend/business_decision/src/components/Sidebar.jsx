import { MODULES, MODULE_ORDER } from '../moduleConfig';

export default function Sidebar({ active, onSelect, onHome, onLanding }) {
  return (
    <nav className="sidebar">
      {/* Brand Header */}
      <div className="sidebar-brand-box">
        <button className="brand-btn" onClick={onHome}>
          <div className="brand-icon-wrapper">
            <span className="brand-pulse-dot" />
          </div>
          <div className="brand-text-group">
            <span className="brand-title">STRATA</span>
            <span className="brand-subtitle">Decision Intelligence</span>
          </div>
        </button>
      </div>

      {/* Navigation Groups */}
      <div className="sidebar-section-label">Management</div>

      <button
        className={`module-btn ${active === 'dashboard' ? 'active' : ''}`}
        style={{ '--accent': 'var(--paper)' }}
        onClick={onHome}
      >
        <span className="module-btn-icon">&#9638;</span>
        <span className="module-btn-text">Dashboard</span>
      </button>

      <button
        className={`module-btn ${active === 'overview' ? 'active' : ''}`}
        style={{ '--accent': '#8d96a3' }}
        onClick={() => onSelect('overview')}
      >
        <span className="module-btn-icon">&#10710;</span>
        <span className="module-btn-text">Audit Ledger</span>
      </button>

      <div className="sidebar-divider" />

      <div className="sidebar-section-label">Predictive Engines</div>

      {MODULE_ORDER.map((key, idx) => {
        const m = MODULES[key];
        const isActive = active === key;
        return (
          <button
            key={key}
            className={`module-btn ${isActive ? 'active' : ''}`}
            style={{ '--accent': m.accent }}
            onClick={() => onSelect(key)}
          >
            <span className="module-index">0{idx + 1}</span>
            <span className="dot" style={{ background: m.accent }} />
            <span className="module-btn-text">{m.label}</span>
          </button>
        );
      })}

      <div className="sidebar-divider" />

      {/* Tour / Welcome Page Link */}
      {onLanding && (
        <button
          className="sidebar-landing-btn"
          onClick={onLanding}
        >
          <span className="landing-btn-icon">&#10022;</span>
          <span>Welcome &amp; Overview Tour</span>
        </button>
      )}

      {/* Telemetry Footer */}
      <div className="sidebar-foot">
        <div className="sidebar-telemetry-row">
          <span className="sidebar-telemetry-indicator" />
          <span className="sidebar-telemetry-text">FastAPI &middot; 4 ML Models Live</span>
        </div>
        <div className="sidebar-foot-sub">v2.4.0 Production Ensembles</div>
      </div>
    </nav>
  );
}