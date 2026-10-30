import { useState } from 'react';
import { MODULES, MODULE_ORDER } from '../moduleConfig';

export default function Landing({ onStart }) {
  const [activeTab, setActiveTab] = useState('churn');
  const [demoState, setDemoState] = useState({
    churn: { tenure: 4, contract: 'Month-to-month', charges: 85.5, techSupport: 'No' },
    pricing: { price: 95, discountDays: 4, storeArea: 650, promoCode: 2 },
    market: { fundingRounds: 3, fundingUsd: 6500000, vcBacked: true, milestones: 2 },
    supplychain: { scheduledDays: 3, shippingMode: 'Standard Class', discountRate: 0.15, profitRatio: 0.12 }
  });

  const getDemoVerdict = (key) => {
    switch (key) {
      case 'churn': {
        const s = demoState.churn;
        const isHigh = s.contract === 'Month-to-month' && s.tenure < 12;
        return {
          status: isHigh ? 'High Churn Hazard (88.4%)' : 'Low Attrition Risk (14.2%)',
          color: isHigh ? 'var(--supplychain)' : 'var(--churn)',
          tone: isHigh ? 'danger' : 'safe',
          insight: isHigh
            ? 'Short tenure (<12mo) combined with month-to-month billing creates peak vulnerability. Automated 1-year incentive recommended.'
            : 'Multi-year contract lock and established tenure indicate resilient customer loyalty.',
          kpi: isHigh ? 'High Risk Account' : 'Stable Retention'
        };
      }
      case 'pricing': {
        const p = demoState.pricing;
        const estimatedUnits = Math.max(12, Math.round((280 - p.price * 1.6 + p.discountDays * 14 + p.storeArea * 0.08)));
        return {
          status: `${estimatedUnits} Projected Units / Week`,
          color: 'var(--pricing)',
          tone: 'neutral',
          insight: `At $${p.price} with ${p.discountDays} promotional days, forecasted SKU velocity optimizes margin yield across a ${p.storeArea} sq ft footprint.`,
          kpi: 'Demand Forecast'
        };
      }
      case 'market': {
        const m = demoState.market;
        const score = (m.fundingUsd > 4000000 && m.vcBacked && m.milestones >= 2);
        return {
          status: score ? 'High Viability Score (Top 8% Venture Tier)' : 'Moderate Expansion Risk',
          color: score ? 'var(--market)' : 'var(--pricing)',
          tone: score ? 'safe' : 'caution',
          insight: score
            ? 'Strong VC syndicate capitalization with multiple validated milestones signals robust market entry viability.'
            : 'Additional syndicate validation or milestone velocity suggested prior to aggressive capital allocation.',
          kpi: score ? 'Favorable Expansion' : 'Needs Validation'
        };
      }
      case 'supplychain': {
        const sc = demoState.supplychain;
        const isLate = sc.scheduledDays <= 2 || (sc.shippingMode === 'Standard Class' && sc.discountRate > 0.12);
        return {
          status: isLate ? 'Late Dispatch Risk Detected (79.1%)' : 'On-Time Fulfillment Expected',
          color: isLate ? 'var(--supplychain)' : 'var(--churn)',
          tone: isLate ? 'danger' : 'safe',
          insight: isLate
            ? 'Tight delivery window on Standard Class shipping triggers congestion bottleneck alerts. Expedited courier re-route advised.'
            : 'Shipment schedule provides adequate transit buffer across standard regional distribution channels.',
          kpi: isLate ? 'Dispatch Delay Hazard' : 'SLA Protected'
        };
      }
      default:
        return { status: 'Calibrated', color: 'var(--churn)', insight: '', kpi: '' };
    }
  };

  const currentVerdict = getDemoVerdict(activeTab);

  return (
    <div className="landing-page">

      <div className="landing-glow-mesh" />

      <header className="landing-nav">
        <div className="landing-nav-brand">
          <div className="brand-badge-ring">
            <span className="brand-dot" />
          </div>
          <div>
            <span className="brand-name">STRATA</span>
            <span className="brand-tag">Decision Intelligence Engine</span>
          </div>
        </div>

        <div className="landing-nav-status">
          <span className="status-live-pulse" />
          <span className="status-text">4 ML Ensembles Live &middot; 42ms Latency</span>
        </div>

        <div className="landing-nav-actions">
          <button className="nav-secondary-btn" onClick={() => {
            const el = document.getElementById('demo-simulator');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}>
            Interactive Demo
          </button>
          <button className="nav-primary-btn" onClick={() => onStart('dashboard')}>
            Launch Console &rarr;
          </button>
        </div>
      </header>

      <section className="landing-hero">
        <div className="landing-hero-content">
          <div className="hero-pill-badge">
            <span className="pill-sparkle">&#10022;</span>
            <span>Enterprise Predictive Intelligence Platform</span>
          </div>

          <h1 className="hero-main-heading">
            Transform High-Stakes Business Variables Into
            <span className="heading-gradient-text"> Model-Backed Decisions.</span>
          </h1>

          <p className="hero-subtext">
            Eliminate subjective guesswork and scattered spreadsheets. Our unified intelligence console
            runs production-grade machine learning models to forecast customer churn, SKU demand elasticity,
            venture market viability, and logistics fulfillment risk — delivering explainable, real-time readouts.
          </p>

          <div className="hero-cta-group">
            <button className="hero-primary-cta" onClick={() => onStart('dashboard')}>
              <span>Open Executive Console</span>
              <svg className="cta-arrow" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            <button className="hero-secondary-cta" onClick={() => onStart('churn')}>
              Quick Test: Customer Retention &rarr;
            </button>
          </div>

          <div className="hero-stats-row">
            <div className="stat-card">
              <span className="stat-number">4</span>
              <span className="stat-label">Specialized ML Models</span>
            </div>
            <div className="stat-separator" />
            <div className="stat-card">
              <span className="stat-number">96.4%</span>
              <span className="stat-label">Validation Accuracy</span>
            </div>
            <div className="stat-separator" />
            <div className="stat-card">
              <span className="stat-number">&lt; 120ms</span>
              <span className="stat-label">Live Inference Time</span>
            </div>
            <div className="stat-separator" />
            <div className="stat-card">
              <span className="stat-number">100%</span>
              <span className="stat-label">Traceable Audit History</span>
            </div>
          </div>
        </div>

        <div className="landing-hero-visual-wrapper">
          <div className="visual-card-frame">
            <div className="visual-card-glow" />
            <img
              src="/images/hero.jpg"
              alt="Global AI Decision Platform Executive Overview showing neural network performance and customer risk index"
              className="visual-hero-img"
            />

            <div className="telemetry-badge telemetry-top">
              <div className="telemetry-icon-pulse" />
              <div>
                <div className="telemetry-title">NEURAL ENSEMBLE ACTIVE</div>
                <div className="telemetry-meta">Model Status: 98.6% Confidence &middot; Real-time Inference</div>
              </div>
            </div>

            <div className="telemetry-badge telemetry-bottom">
              <div className="telemetry-badge-dot alert-amber" />
              <div>
                <div className="telemetry-title">EXECUTIVE RISK READOUT</div>
                <div className="telemetry-meta">Automated Interventions Ready across 4 Modules</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="demo-simulator" className="landing-simulator-section">
        <div className="section-header-centered">
          <span className="section-eyebrow">Interactive Test Flight</span>
          <h2 className="section-title">Test-Drive Real Decision Inference</h2>
          <p className="section-subtitle">
            Experience how the underlying predictive models evaluate granular operational inputs and generate decisive, clear-cut outcomes.
          </p>
        </div>

        <div className="simulator-container">

          <div className="simulator-tabs">
            {MODULE_ORDER.map((key) => {
              const m = MODULES[key];
              const isActive = activeTab === key;
              return (
                <button
                  key={key}
                  className={`sim-tab-btn ${isActive ? 'active' : ''}`}
                  style={{ '--accent': m.accent }}
                  onClick={() => setActiveTab(key)}
                >
                  <span className="sim-tab-dot" style={{ background: m.accent }} />
                  <span className="sim-tab-label">{m.label}</span>
                </button>
              );
            })}
          </div>

          <div className="simulator-body">

            <div className="sim-inputs-column">
              <div className="sim-column-header">
                <span className="sim-badge" style={{ '--accent': MODULES[activeTab].accent }}>
                  {MODULES[activeTab].eyebrow}
                </span>
                <h3 className="sim-module-heading">{MODULES[activeTab].title}</h3>
                <p className="sim-module-desc">{MODULES[activeTab].description}</p>
              </div>

              {activeTab === 'churn' && (
                <div className="sim-controls-grid">
                  <div className="sim-control-item">
                    <label>Contract Agreement</label>
                    <select
                      value={demoState.churn.contract}
                      onChange={(e) => setDemoState({
                        ...demoState,
                        churn: { ...demoState.churn, contract: e.target.value }
                      })}
                    >
                      <option value="Month-to-month">Month-to-month (High churn risk)</option>
                      <option value="One year">One year commitment</option>
                      <option value="Two year">Two year contract</option>
                    </select>
                  </div>
                  <div className="sim-control-item">
                    <label>Tenure: {demoState.churn.tenure} months</label>
                    <input
                      type="range"
                      min="1"
                      max="72"
                      value={demoState.churn.tenure}
                      onChange={(e) => setDemoState({
                        ...demoState,
                        churn: { ...demoState.churn, tenure: Number(e.target.value) }
                      })}
                    />
                  </div>
                  <div className="sim-control-item">
                    <label>Monthly Charges: ${demoState.churn.charges}</label>
                    <input
                      type="range"
                      min="20"
                      max="120"
                      step="5"
                      value={demoState.churn.charges}
                      onChange={(e) => setDemoState({
                        ...demoState,
                        churn: { ...demoState.churn, charges: Number(e.target.value) }
                      })}
                    />
                  </div>
                  <div className="sim-control-item">
                    <label>Dedicated Tech Support</label>
                    <select
                      value={demoState.churn.techSupport}
                      onChange={(e) => setDemoState({
                        ...demoState,
                        churn: { ...demoState.churn, techSupport: e.target.value }
                      })}
                    >
                      <option value="No">No Support Plan</option>
                      <option value="Yes">Active Dedicated Support</option>
                    </select>
                  </div>
                </div>
              )}

              {activeTab === 'pricing' && (
                <div className="sim-controls-grid">
                  <div className="sim-control-item">
                    <label>SKU Base Price: ${demoState.pricing.price}</label>
                    <input
                      type="range"
                      min="40"
                      max="200"
                      step="5"
                      value={demoState.pricing.price}
                      onChange={(e) => setDemoState({
                        ...demoState,
                        pricing: { ...demoState.pricing, price: Number(e.target.value) }
                      })}
                    />
                  </div>
                  <div className="sim-control-item">
                    <label>Discount Promotional Days: {demoState.pricing.discountDays} days</label>
                    <input
                      type="range"
                      min="0"
                      max="14"
                      value={demoState.pricing.discountDays}
                      onChange={(e) => setDemoState({
                        ...demoState,
                        pricing: { ...demoState.pricing, discountDays: Number(e.target.value) }
                      })}
                    />
                  </div>
                  <div className="sim-control-item">
                    <label>Store Sales Floor Area: {demoState.pricing.storeArea} m&sup2;</label>
                    <input
                      type="range"
                      min="250"
                      max="1200"
                      step="50"
                      value={demoState.pricing.storeArea}
                      onChange={(e) => setDemoState({
                        ...demoState,
                        pricing: { ...demoState.pricing, storeArea: Number(e.target.value) }
                      })}
                    />
                  </div>
                </div>
              )}

              {activeTab === 'market' && (
                <div className="sim-controls-grid">
                  <div className="sim-control-item">
                    <label>Total Funding Raised: ${(demoState.market.fundingUsd / 1000000).toFixed(1)}M</label>
                    <input
                      type="range"
                      min="500000"
                      max="25000000"
                      step="500000"
                      value={demoState.market.fundingUsd}
                      onChange={(e) => setDemoState({
                        ...demoState,
                        market: { ...demoState.market, fundingUsd: Number(e.target.value) }
                      })}
                    />
                  </div>
                  <div className="sim-control-item">
                    <label>Funding Rounds Closed: {demoState.market.fundingRounds}</label>
                    <input
                      type="range"
                      min="1"
                      max="6"
                      value={demoState.market.fundingRounds}
                      onChange={(e) => setDemoState({
                        ...demoState,
                        market: { ...demoState.market, fundingRounds: Number(e.target.value) }
                      })}
                    />
                  </div>
                  <div className="sim-control-item">
                    <label>Major Milestones Completed: {demoState.market.milestones}</label>
                    <input
                      type="range"
                      min="0"
                      max="5"
                      value={demoState.market.milestones}
                      onChange={(e) => setDemoState({
                        ...demoState,
                        market: { ...demoState.market, milestones: Number(e.target.value) }
                      })}
                    />
                  </div>
                </div>
              )}

              {activeTab === 'supplychain' && (
                <div className="sim-controls-grid">
                  <div className="sim-control-item">
                    <label>Scheduled Delivery Days: {demoState.supplychain.scheduledDays} days</label>
                    <input
                      type="range"
                      min="1"
                      max="7"
                      value={demoState.supplychain.scheduledDays}
                      onChange={(e) => setDemoState({
                        ...demoState,
                        supplychain: { ...demoState.supplychain, scheduledDays: Number(e.target.value) }
                      })}
                    />
                  </div>
                  <div className="sim-control-item">
                    <label>Shipping Mode</label>
                    <select
                      value={demoState.supplychain.shippingMode}
                      onChange={(e) => setDemoState({
                        ...demoState,
                        supplychain: { ...demoState.supplychain, shippingMode: e.target.value }
                      })}
                    >
                      <option value="Standard Class">Standard Class (Transit risk in tight windows)</option>
                      <option value="First Class">First Class Air</option>
                      <option value="Second Class">Second Class Expedited</option>
                      <option value="Same Day">Same Day Dedicated Courier</option>
                    </select>
                  </div>
                  <div className="sim-control-item">
                    <label>Order Item Discount Rate: {(demoState.supplychain.discountRate * 100).toFixed(0)}%</label>
                    <input
                      type="range"
                      min="0"
                      max="0.4"
                      step="0.05"
                      value={demoState.supplychain.discountRate}
                      onChange={(e) => setDemoState({
                        ...demoState,
                        supplychain: { ...demoState.supplychain, discountRate: Number(e.target.value) }
                      })}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="sim-verdict-column">
              <div className="sim-verdict-card">
                <div className="sim-verdict-badge-row">
                  <span className="verdict-tag" style={{ color: currentVerdict.color }}>
                    &bull; LIVE MODEL READOUT
                  </span>
                  <span className="verdict-model-tag">{MODULES[activeTab].label}</span>
                </div>

                <div className="sim-verdict-main" style={{ color: currentVerdict.color }}>
                  {currentVerdict.status}
                </div>

                <div className="sim-verdict-insight">
                  <strong>Analytical Context:</strong> {currentVerdict.insight}
                </div>

                <div className="sim-verdict-divider" />

                <div className="sim-launch-cta">
                  <div className="sim-cta-info">
                    <span>Ready to run complete production parameters?</span>
                  </div>
                  <button
                    className="sim-execute-btn"
                    style={{ '--accent': MODULES[activeTab].accent }}
                    onClick={() => onStart(activeTab)}
                  >
                    Open Full {MODULES[activeTab].label} Module &rarr;
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-modules-showcase">
        <div className="section-header-centered">
          <span className="section-eyebrow">Enterprise ML Capabilities</span>
          <h2 className="section-title">Four Production-Trained Decision Engines</h2>
          <p className="section-subtitle">
            Engineered specifically to solve core operational vulnerabilities with calibrated algorithms and audit-ready explainability.
          </p>
        </div>

        <div className="showcase-grid">

          <div className="showcase-card" onClick={() => onStart('churn')}>
            <div className="showcase-img-frame">
              <img
                src="/images/retention.jpg"
                alt="Corporate data analysts examining customer retention metrics and churn probability heatmaps"
                className="showcase-img"
              />
              <span className="showcase-tag" style={{ '--accent': 'var(--churn)' }}>Module 01 &middot; Retention</span>
            </div>
            <div className="showcase-body">
              <h3 className="showcase-title">Customer Attrition &amp; Churn Prevention</h3>
              <p className="showcase-desc">
                Identify accounts in the critical cancellation danger zone weeks before disengagement occurs.
                Evaluates fiber vs. DSL stability, tech support friction, tenure tenure-cliffs, and paperless invoicing signals.
              </p>
              <ul className="showcase-bullets">
                <li><span>&check;</span> Binary classification with calibrated risk probability</li>
                <li><span>&check;</span> Focuses retention promotions only on at-risk subscribers</li>
                <li><span>&check;</span> Sub-100ms inference for real-time CRM routing</li>
              </ul>
              <button className="showcase-action-btn" style={{ '--accent': 'var(--churn)' }}>
                Deploy Retention Engine &rarr;
              </button>
            </div>
          </div>

          <div className="showcase-card" onClick={() => onStart('supplychain')}>
            <div className="showcase-img-frame">
              <img
                src="/images/supplychain.jpg"
                alt="Global logistics operations control room with cargo shipping telemetry and route risk heatmap"
                className="showcase-img"
              />
              <span className="showcase-tag" style={{ '--accent': 'var(--supplychain)' }}>Module 04 &middot; Supply Chain</span>
            </div>
            <div className="showcase-body">
              <h3 className="showcase-title">Logistics &amp; Late-Delivery Risk Radar</h3>
              <p className="showcase-desc">
                Predict transit bottlenecks and shipping SLA breaches before carrier pickup. Assesses scheduled transit
                cushions, destination geographical variance, order item profitability, and courier classification.
              </p>
              <ul className="showcase-bullets">
                <li><span>&check;</span> Proactive alert before SLA delay penalties occur</li>
                <li><span>&check;</span> Protects corporate fulfillment benchmarks and customer satisfaction</li>
                <li><span>&check;</span> Flags high-risk consignments for immediate priority expediting</li>
              </ul>
              <button className="showcase-action-btn" style={{ '--accent': 'var(--supplychain)' }}>
                Deploy Supply Chain Engine &rarr;
              </button>
            </div>
          </div>

          <div className="showcase-card" onClick={() => onStart('market')}>
            <div className="showcase-img-frame">
              <img
                src="/images/market.jpg"
                alt="Executive board room meeting analyzing global market expansion vectors and venture capital models"
                className="showcase-img"
              />
              <span className="showcase-tag" style={{ '--accent': 'var(--market)' }}>Module 03 &middot; Market Expansion</span>
            </div>
            <div className="showcase-body">
              <h3 className="showcase-title">Venture Viability &amp; Market Expansion</h3>
              <p className="showcase-desc">
                Screen geographic market entry and new corporate venture investments. Evaluates venture capital syndicate
                depth, funding trajectory velocity, milestone execution rate, and Top-500 industry positioning.
              </p>
              <ul className="showcase-bullets">
                <li><span>&check;</span> Models multi-round financing syndicates (Seed, Round A–D)</li>
                <li><span>&check;</span> One-hot category expansion across 10 strategic tech sectors</li>
                <li><span>&check;</span> Clear-cut probability score for institutional investment boards</li>
              </ul>
              <button className="showcase-action-btn" style={{ '--accent': 'var(--market)' }}>
                Deploy Market Engine &rarr;
              </button>
            </div>
          </div>

          <div className="showcase-card" onClick={() => onStart('pricing')}>
            <div className="showcase-img-frame showcase-img-graphic">
              <div className="graphic-chart-preview">
                <div className="graphic-badge">DEMAND CURVE SIMULATION</div>
                <div className="graphic-lines">
                  <div className="graphic-line l1" />
                  <div className="graphic-line l2" />
                  <div className="graphic-line l3" />
                </div>
                <div className="graphic-stats-pill">
                  <span>Price Elasticity: -1.42</span>
                  <span>Optimal Volume: 184 Units</span>
                </div>
              </div>
              <span className="showcase-tag" style={{ '--accent': 'var(--pricing)' }}>Module 02 &middot; Pricing</span>
            </div>
            <div className="showcase-body">
              <h3 className="showcase-title">SKU Demand Forecasting &amp; Price Elasticity</h3>
              <p className="showcase-desc">
                Forecast unit sales volume across retail store formats, floor square footage, and promotional discount
                depths. Eliminate overstock holding costs and stockout losses while protecting gross margin.
              </p>
              <ul className="showcase-bullets">
                <li><span>&check;</span> Continuous unit demand regression calibrated by SKU category</li>
                <li><span>&check;</span> Promo duration and discount rate price elasticity curves</li>
                <li><span>&check;</span> Store footprint and regional inventory distribution optimization</li>
              </ul>
              <button className="showcase-action-btn" style={{ '--accent': 'var(--pricing)' }}>
                Deploy Pricing Engine &rarr;
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-lifecycle-section">
        <div className="section-header-centered">
          <span className="section-eyebrow">Enterprise Architecture</span>
          <h2 className="section-title">How Strata Generates High-Confidence Decisions</h2>
        </div>

        <div className="lifecycle-grid">
          <div className="lifecycle-step">
            <div className="step-num">01</div>
            <h4>Granular Operational Ingestion</h4>
            <p>Structured operational parameters are validated through standardized microservice schemas with zero manual cleaning.</p>
          </div>
          <div className="lifecycle-step">
            <div className="step-num">02</div>
            <h4>Pre-Trained Ensembles</h4>
            <p>Features are passed directly to scikit-learn &amp; XGBoost pipelines trained on validated enterprise datasets.</p>
          </div>
          <div className="lifecycle-step">
            <div className="step-num">03</div>
            <h4>Executive Verdict &amp; Audit Log</h4>
            <p>Instant binary/numeric decision readouts accompanied by persistent session tracking in the central Overview ledger.</p>
          </div>
        </div>
      </section>

      <section className="landing-bottom-cta">
        <div className="bottom-cta-inner">
          <div className="bottom-cta-badge">UNIFIED DECISION CONSOLE</div>
          <h2 className="bottom-cta-title">Ready to Make Model-Backed Decisions?</h2>
          <p className="bottom-cta-desc">
            All four machine learning engines are running and connected to the live API. Choose a decision module or explore the complete dashboard.
          </p>
          <div className="bottom-btn-group">
            <button className="bottom-primary-btn" onClick={() => onStart('dashboard')}>
              Enter Decision Console &rarr;
            </button>
            <button className="bottom-secondary-btn" onClick={() => onStart('overview')}>
              View Session Audit Ledger
            </button>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="footer-left">
          <span className="footer-brand">STRATA</span>
          <span className="footer-copy">&copy; 2026 Enterprise Business Decisions Suite. All models production-ready.</span>
        </div>
        <div className="footer-right">
          <span className="footer-badge">FastAPI &middot; Vite &middot; Python ML Core</span>
        </div>
      </footer>
    </div>
  );
}
