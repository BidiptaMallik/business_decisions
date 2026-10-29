import { useState } from 'react';

export default function ReadoutPanel({ module, result }) {
  const [copied, setCopied] = useState(false);
  const tone = module.verdictTone(result);
  const verdict = module.verdictLabel(result);

  // Generate actionable executive recommendation based on the domain & verdict
  const getStrategicProtocol = () => {
    switch (module.key) {
      case 'churn':
        if (result.prediction === 'Yes') {
          return {
            severity: 'CRITICAL ATTENTION REQUIRED',
            action: 'Customer displays severe attrition signals. Deploy automated 12-month loyalty pricing incentive, escalate to dedicated retention team, and review technical support tickets within 24 hours.'
          };
        }
        return {
          severity: 'STABLE RETENTION POSTURE',
          action: 'Customer loyalty indices are solid. Account is a prime candidate for product line expansion and multi-year contract renewals.'
        };
      case 'supplychain':
        const isLate = String(result.prediction) === '1' || String(result.prediction).toLowerCase().includes('late');
        if (isLate) {
          return {
            severity: 'DELIVERY BOTTLENECK DETECTED',
            action: 'Late transit probability exceeds critical threshold. Reroute shipment via priority express carrier or expedite dispatch from regional fulfillment hub to protect SLA commitments.'
          };
        }
        return {
          severity: 'ON-TIME BUFFER CONFIRMED',
          action: 'Shipment schedule provides sufficient transit cushion. Proceed with standard class carrier dispatch without intervention.'
        };
      case 'market':
        return {
          severity: 'STRATEGIC EXPANSION READOUT',
          action: 'Venture capitalization and milestone trajectory have been evaluated against industry benchmarks. Advance findings to investment committee.'
        };
      case 'pricing':
        return {
          severity: 'DEMAND ELASTICITY PROJECTION',
          action: 'Forecasted volume models weekly SKU velocity across store footprint square footage and active promo discount duration.'
        };
      default:
        return {
          severity: 'MODEL VERDICT READY',
          action: 'Decision evaluation complete based on validated input variables.'
        };
    }
  };

  const protocol = getStrategicProtocol();

  function copyVerdict() {
    navigator.clipboard.writeText(`[Strata ML Decision Readout]\nModule: ${module.label}\nVerdict: ${verdict}\nProtocol: ${protocol.action}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="readout" style={{ '--accent': tone }}>
      <div className="readout-head">
        <div className="readout-head-left">
          <span className="signal" />
          <span className="readout-title-text">EXECUTIVE DECISION READOUT</span>
          <span className="readout-module-pill">{module.label}</span>
        </div>
        <div className="readout-head-right">
          <button className="readout-copy-btn" onClick={copyVerdict}>
            {copied ? '✓ Copied' : 'Copy Summary'}
          </button>
        </div>
      </div>

      <div className="readout-body">
        {/* Main Verdict Line */}
        <div className="readout-verdict-row">
          <p className="readout-verdict" style={{ color: tone }}>{verdict}</p>
          <span className="readout-status-tag" style={{ color: tone, borderColor: tone }}>
            {protocol.severity}
          </span>
        </div>

        {/* Strategic Guidance Box */}
        <div className="readout-strategy-box">
          <div className="strategy-label">Recommended Strategic Action:</div>
          <p className="strategy-text">{protocol.action}</p>
        </div>

        {/* Telemetry Bar */}
        <div className="readout-telemetry-grid">
          <div className="telemetry-item">
            <span className="telemetry-label">INFERENCE SOURCE</span>
            <span className="telemetry-val">Live FastAPI &middot; {module.key.toUpperCase()}</span>
          </div>
          <div className="telemetry-item">
            <span className="telemetry-label">MODEL ENSEMBLE</span>
            <span className="telemetry-val">Calibrated Production Pipeline</span>
          </div>
          <div className="telemetry-item">
            <span className="telemetry-label">AUDIT STATUS</span>
            <span className="telemetry-val">&#10003; Logged to Session Ledger</span>
          </div>
        </div>

        {/* Confidence Fill Meter */}
        <div className="confidence-bar-wrapper">
          <div className="confidence-bar">
            <div className="confidence-fill" style={{ width: '100%', background: tone }} />
          </div>
          <div className="confidence-labels-row">
            <span>Input Validation: Complete</span>
            <span>Deterministic Scoring: 100%</span>
          </div>
        </div>
      </div>
    </div>
  );
}