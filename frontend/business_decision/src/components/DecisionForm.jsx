import { useState, useEffect } from 'react';
import { predictSingle } from '../api';
import ReadoutPanel from './ReadoutPanel';

function defaultValueFor(field) {
  if (field.default !== undefined) return field.default;
  if (field.type === 'checkbox') return false;
  if (field.type === 'select') {
    const first = field.options[0];
    return typeof first === 'object' ? first.v : first;
  }
  return '';
}

function initialState(module) {
  const state = {};
  module.groups.forEach((g) =>
    g.fields.forEach((f) => {
      state[f.name] = defaultValueFor(f);
    })
  );
  return state;
}

const PRESETS = {
  churn: {
    highRisk: {
      label: 'High Attrition Danger Scenario',
      values: {
        gender: 'Female',
        SeniorCitizen: 1,
        Partner: 'No',
        Dependents: 'No',
        tenure: 3,
        PhoneService: 'Yes',
        MultipleLines: 'No',
        InternetService: 'Fiber optic',
        OnlineSecurity: 'No',
        OnlineBackup: 'No',
        DeviceProtection: 'No',
        TechSupport: 'No',
        StreamingTV: 'Yes',
        StreamingMovies: 'Yes',
        Contract: 'Month-to-month',
        PaperlessBilling: 'Yes',
        PaymentMethod: 'Electronic check',
        MonthlyCharges: 98.5,
        TotalCharges: 295.5
      }
    },
    loyal: {
      label: 'Stable Enterprise Subscriber',
      values: {
        gender: 'Male',
        SeniorCitizen: 0,
        Partner: 'Yes',
        Dependents: 'Yes',
        tenure: 48,
        PhoneService: 'Yes',
        MultipleLines: 'Yes',
        InternetService: 'DSL',
        OnlineSecurity: 'Yes',
        OnlineBackup: 'Yes',
        DeviceProtection: 'Yes',
        TechSupport: 'Yes',
        StreamingTV: 'No',
        StreamingMovies: 'No',
        Contract: 'Two year',
        PaperlessBilling: 'No',
        PaymentMethod: 'Credit card (automatic)',
        MonthlyCharges: 52.0,
        TotalCharges: 2496.0
      }
    }
  },
  pricing: {
    promoLift: {
      label: 'Discount Promotion Campaign',
      values: {
        division: 'Div1',
        format: 'Format-1',
        city: 'City1',
        dept_name: 'Dept1',
        group_name: 'Group1',
        subclass_name: 'ПОДУШЕЧКИ',
        item_type: 'Лимонады',
        store_id: 1,
        area: 750,
        weight_volume: 1.0,
        weight_netto: 1.0,
        fatness: 3.2,
        price_base: 120,
        sale_price_before_promo: 120,
        sale_price_time_promo: 89.9,
        promo_type_code: 1,
        number_disc_day: 6,
        start_date: '2023-01-01',
        end_date: '2023-01-07'
      }
    },
    standard: {
      label: 'Standard Non-Promo Baseline',
      values: {
        division: 'Div1',
        format: 'Format-1',
        city: 'City1',
        dept_name: 'Dept1',
        group_name: 'Group1',
        subclass_name: 'ПОДУШЕЧКИ',
        item_type: 'Лимонады',
        store_id: 1,
        area: 450,
        weight_volume: 1.0,
        weight_netto: 1.0,
        fatness: 3.2,
        price_base: 100,
        sale_price_before_promo: 100,
        sale_price_time_promo: 100,
        promo_type_code: 0,
        number_disc_day: 0,
        start_date: '2023-01-01',
        end_date: '2023-01-07'
      }
    }
  },
  market: {
    topVenture: {
      label: 'Top-Tier Seeded Syndicate',
      values: {
        state_code: 'CA',
        city: 'San Francisco',
        latitude: 37.7749,
        longitude: -122.4194,
        category_code: 'enterprise',
        is_top500: true,
        funding_rounds: 4,
        funding_total_usd: 12500000,
        milestones: 3,
        relationships: 8,
        avg_participants: 3.2,
        age_first_funding_year: 1.2,
        age_last_funding_year: 3.5,
        age_first_milestone_year: 0.8,
        age_last_milestone_year: 2.9,
        has_VC: true,
        has_angel: true,
        has_roundA: true,
        has_roundB: true,
        has_roundC: false,
        has_roundD: false
      }
    },
    earlyStage: {
      label: 'Early-Stage Pre-Series A',
      values: {
        state_code: 'NY',
        city: 'New York',
        latitude: 40.7128,
        longitude: -74.006,
        category_code: 'mobile',
        is_top500: false,
        funding_rounds: 1,
        funding_total_usd: 450000,
        milestones: 1,
        relationships: 2,
        avg_participants: 1.0,
        age_first_funding_year: 0.8,
        age_last_funding_year: 0.8,
        age_first_milestone_year: 0.5,
        age_last_milestone_year: 0.5,
        has_VC: false,
        has_angel: true,
        has_roundA: false,
        has_roundB: false,
        has_roundC: false,
        has_roundD: false
      }
    }
  },
  supplychain: {
    lateHazard: {
      label: 'High-Risk Delayed Corridor',
      values: {
        Type: 'PAYMENT',
        'Days for shipment (scheduled)': 2,
        'Shipping Mode': 'Standard Class',
        'Order Status': 'PROCESSING',
        'Customer Segment': 'Consumer',
        'Customer City': 'Los Angeles',
        'Customer State': 'CA',
        'Customer Country': 'EE. UU.',
        'Order City': 'Miami',
        'Order State': 'Florida',
        'Order Country': 'United States',
        'Order Region': 'East of USA',
        Market: 'USCA',
        Latitude: 25.7617,
        Longitude: -80.1918,
        'Product Name': "Nike Men's Dri-FIT Victory Golf Polo",
        'Category Name': 'Sporting Goods',
        'Department Name': 'Fitness',
        'Product Price': 120,
        'Product Status': 0,
        'Order Item Quantity': 3,
        Sales: 360,
        'Sales per customer': 360,
        'Order Item Total': 306,
        'Order Item Product Price': 120,
        'Order Item Discount': 54,
        'Order Item Discount Rate': 0.15,
        'Order Item Profit Ratio': 0.08,
        'Order Profit Per Order': 24.48,
        'Benefit per order': 24.48
      }
    },
    onTimeSafe: {
      label: 'Low-Risk Expedited Delivery',
      values: {
        Type: 'DEBIT',
        'Days for shipment (scheduled)': 5,
        'Shipping Mode': 'First Class',
        'Order Status': 'COMPLETE',
        'Customer Segment': 'Corporate',
        'Customer City': 'San Jose',
        'Customer State': 'CA',
        'Customer Country': 'EE. UU.',
        'Order City': 'San Jose',
        'Order State': 'California',
        'Order Country': 'United States',
        'Order Region': 'West of USA',
        Market: 'Pacific Asia',
        Latitude: 37.3382,
        Longitude: -121.8863,
        'Product Name': "Nike Men's Dri-FIT Victory Golf Polo",
        'Category Name': 'Sporting Goods',
        'Department Name': 'Fitness',
        'Product Price': 100,
        'Product Status': 0,
        'Order Item Quantity': 2,
        Sales: 200,
        'Sales per customer': 250,
        'Order Item Total': 190,
        'Order Item Product Price': 100,
        'Order Item Discount': 10,
        'Order Item Discount Rate': 0.05,
        'Order Item Profit Ratio': 0.22,
        'Order Profit Per Order': 41.8,
        'Benefit per order': 45.5
      }
    }
  }
};

export default function DecisionForm({ module, onResult, onBack }) {
  const [values, setValues] = useState(() => initialState(module));
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [inferenceTime, setInferenceTime] = useState(null);

  useEffect(() => {
    setValues(initialState(module));
    setResult(null);
    setError(null);
    setInferenceTime(null);
  }, [module]);

  function handleChange(field, raw) {
    let v = raw;
    if (field.type === 'checkbox') v = raw;
    else if (field.type === 'number' || field.numeric) v = raw === '' ? '' : Number(raw);
    setValues((prev) => ({ ...prev, [field.name]: v }));
  }

  function applyPreset(presetValues) {
    setValues((prev) => ({ ...prev, ...presetValues }));
    setResult(null);
    setError(null);
  }

  function handleReset() {
    setValues(initialState(module));
    setResult(null);
    setError(null);
    setInferenceTime(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    const start = performance.now();
    try {
      const payload = module.buildPayload ? module.buildPayload(values) : values;
      const res = await predictSingle(module.key, payload);
      const elapsed = Math.round(performance.now() - start);
      setInferenceTime(elapsed);
      setResult(res);
      if (onResult) {
        onResult({
          moduleKey: module.key,
          verdict: module.verdictLabel(res),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        });
      }
    } catch (err) {
      setError(err.message || 'Something went wrong reaching the model.');
    } finally {
      setLoading(false);
    }
  }

  const modulePresets = PRESETS[module.key];

  return (
    <div className="form-view-container" style={{ '--accent': module.accent }}>

      <div className="form-top-actions">
        {onBack && (
          <button className="back-to-dash-btn" onClick={onBack}>
            &larr; Return to Dashboard
          </button>
        )}
        <div className="form-engine-pill">
          <span className="engine-pulse" style={{ background: module.accent }} />
          <span>Module: {module.key.toUpperCase()} &middot; Online</span>
        </div>
      </div>

      <div className="form-header-card">
        <p className="eyebrow">{module.eyebrow}</p>
        <h1 className="module-title">{module.title}</h1>
        <p className="module-desc">{module.description}</p>

        {module.note && (
          <div className="module-special-note">
            <span className="note-icon">&#9432;</span>
            <span>{module.note}</span>
          </div>
        )}

        {modulePresets && (
          <div className="form-presets-bar">
            <span className="presets-label">Quick Scenario Presets:</span>
            <div className="presets-group">
              {Object.entries(modulePresets).map(([pKey, pData]) => (
                <button
                  type="button"
                  key={pKey}
                  className="preset-btn"
                  onClick={() => applyPreset(pData.values)}
                >
                  <span>&#10022;</span> {pData.label}
                </button>
              ))}
              <button
                type="button"
                className="preset-reset-btn"
                onClick={handleReset}
              >
                Reset Fields
              </button>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="decision-form-element">
        {module.groups.map((group, gIdx) => (
          <div className="form-group" key={group.title}>
            <div className="form-group-head">
              <span className="group-num">0{gIdx + 1}</span>
              <h3>{group.title}</h3>
            </div>

            <div className="field-grid">
              {group.fields.map((field) => (
                <div
                  className={field.type === 'checkbox' ? 'field-checkbox' : 'field'}
                  key={field.name}
                >
                  {field.type === 'checkbox' ? (
                    <>
                      <input
                        type="checkbox"
                        id={field.name}
                        checked={!!values[field.name]}
                        onChange={(e) => handleChange(field, e.target.checked)}
                      />
                      <label htmlFor={field.name}>{field.label}</label>
                    </>
                  ) : (
                    <>
                      <label htmlFor={field.name}>{field.label}</label>
                      {field.type === 'select' ? (
                        <select
                          id={field.name}
                          value={values[field.name]}
                          onChange={(e) => handleChange(field, e.target.value)}
                        >
                          {field.options.map((opt) => {
                            const val = typeof opt === 'object' ? opt.v : opt;
                            const lbl = typeof opt === 'object' ? opt.l : opt;
                            return (
                              <option key={val} value={val}>
                                {lbl}
                              </option>
                            );
                          })}
                        </select>
                      ) : (
                        <input
                          id={field.name}
                          type={field.type}
                          step={field.step}
                          value={values[field.name]}
                          onChange={(e) => handleChange(field, e.target.value)}
                        />
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="submit-row">
          <button className="submit-btn" type="submit" disabled={loading}>
            {loading ? (
              <span className="loading-state">
                <span className="spinner-dot" />
                Executing Model Inference&hellip;
              </span>
            ) : (
              <span>Run Model Inference &rarr;</span>
            )}
          </button>

          {inferenceTime && (
            <span className="inference-speed-pill">
              Latency: {inferenceTime}ms &middot; HTTP 200 OK
            </span>
          )}
        </div>
      </form>

      {error && (
        <div className="error-note">
          <span className="error-icon">&#9888;</span>
          <div>
            <strong>Inference Request Failed:</strong> {error}
            <div className="error-hint">Ensure the Python FastAPI backend is running on http://localhost:8000.</div>
          </div>
        </div>
      )}

      {result && <ReadoutPanel module={module} result={result} />}
    </div>
  );
}
