import React, { useState } from 'react';
import {
  UserX,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
  Play,
  HeartHandshake
} from 'lucide-react';
import apiService from '../services/api';
import { Loading, ErrorMessage } from '../components/Loading';

const REGIONS = ["North", "South", "East", "West"];

export const CustomerChurn = () => {
  const [formData, setFormData] = useState({
    age: 45,
    tenure_months: 8,
    purchase_frequency: 2,
    total_purchases: 6,
    average_order_value: 95.0,
    customer_satisfaction: 2.2,
    returned: 1,
    discount: 20.0,
    delivery_time: 7,
    region: 'South'
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handlePredict = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await apiService.predictChurn(formData);
      setResult(res);
    } catch (err) {
      console.error('Churn prediction error:', err);
      setError(err.message || 'Unable to calculate customer churn risk.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content-area animate-fade-in">
      <div className="prediction-layout">
        {/* Left: Customer Behavioral Features Form */}
        <div className="glass-panel" style={{ padding: '26px', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(244, 63, 94, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-rose)'
            }}>
              <UserX size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                Customer Account Telemetry
              </h3>
              <p style={{ fontSize: '0.80rem', color: 'var(--text-muted)' }}>
                Predict customer retention risk using RandomForest classification
              </p>
            </div>
          </div>

          <form onSubmit={handlePredict}>
            <div className="form-section-grid" style={{ marginBottom: '18px' }}>
              <div className="form-group">
                <label className="form-label">Customer Age</label>
                <input type="number" name="age" value={formData.age} onChange={handleChange} className="input-field" min="18" max="90" required />
              </div>

              <div className="form-group">
                <label className="form-label">Customer Region</label>
                <select name="region" value={formData.region} onChange={handleChange} className="input-field">
                  {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Tenure (Months)</label>
                <input type="number" name="tenure_months" value={formData.tenure_months} onChange={handleChange} className="input-field" min="1" max="120" required />
              </div>

              <div className="form-group">
                <label className="form-label">Annual Order Frequency</label>
                <input type="number" name="purchase_frequency" value={formData.purchase_frequency} onChange={handleChange} className="input-field" min="1" max="50" required />
              </div>

              <div className="form-group">
                <label className="form-label">Total Lifetime Purchases</label>
                <input type="number" name="total_purchases" value={formData.total_purchases} onChange={handleChange} className="input-field" min="1" max="500" required />
              </div>

              <div className="form-group">
                <label className="form-label">Average Order Value (₹)</label>
                <input type="number" name="average_order_value" value={formData.average_order_value} onChange={handleChange} className="input-field" min="1" step="5" required />
              </div>

              <div className="form-group">
                <label className="form-label">Satisfaction Score (1.0 - 5.0)</label>
                <input type="number" name="customer_satisfaction" value={formData.customer_satisfaction} onChange={handleChange} className="input-field" min="1.0" max="5.0" step="0.1" required />
              </div>

              <div className="form-group">
                <label className="form-label">Delivery SLA Experienced (Days)</label>
                <input type="number" name="delivery_time" value={formData.delivery_time} onChange={handleChange} className="input-field" min="1" max="30" />
              </div>

              <div className="form-group">
                <label className="form-label">Average Discount Rate (%)</label>
                <input type="number" name="discount" value={formData.discount} onChange={handleChange} className="input-field" min="0" max="90" />
              </div>

              <div className="form-group">
                <label className="form-label">Recent Returns Flag</label>
                <select name="returned" value={formData.returned} onChange={handleChange} className="input-field">
                  <option value={0}>0 - No Returns Logged</option>
                  <option value={1}>1 - Product Return Experienced</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ width: '100%', padding: '12px' }}
            >
              {loading ? (
                <span>Evaluating Churn Vulnerability...</span>
              ) : (
                <>
                  <Sparkles size={16} /> Evaluate Customer Churn Risk
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right: Churn Risk Gauge & Retention Playbook */}
        <div>
          {loading && <Loading text="Executing Churn Classifier & retention decision trees..." />}
          {error && <ErrorMessage message={error} onRetry={handlePredict} />}

          {!loading && !error && result && (
            <div className="prediction-result-hero animate-fade-in">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldAlert size={20} color={result.risk_color} />
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                    Customer Retention Risk Assessment
                  </h3>
                </div>
                <span className="badge" style={{ backgroundColor: `${result.risk_color}22`, color: result.risk_color }}>
                  {result.model_status}
                </span>
              </div>

              <div className="result-display-box" style={{ borderColor: result.risk_color }}>
                <span style={{ fontSize: '0.80rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '700', letterSpacing: '0.06em' }}>
                  Risk Classification Tier
                </span>
                <div className="result-amount" style={{ color: result.risk_color }}>
                  {result.risk_level.toUpperCase()} CHURN RISK
                </div>
                <div style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)', marginTop: '4px' }}>
                  Estimated Churn Probability: <strong>{(result.churn_probability * 100).toFixed(0)}%</strong>
                </div>
              </div>

              {result.key_drivers && result.key_drivers.length > 0 && (
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
                  <h5 style={{ fontSize: '0.84rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' }}>
                    Identified Risk Factors & Drivers
                  </h5>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {result.key_drivers.map((driver, idx) => (
                      <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: result.risk_color }} />
                        {driver}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {result.recommended_actions && result.recommended_actions.length > 0 && (
                <div style={{
                  backgroundColor: 'rgba(56, 189, 248, 0.08)',
                  border: '1px solid rgba(56, 189, 248, 0.25)',
                  borderRadius: 'var(--radius-md)',
                  padding: '18px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <HeartHandshake size={18} color="#38bdf8" />
                    <h5 style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                      AI Retention Playbook & Action Plan
                    </h5>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {result.recommended_actions.map((act, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '10px',
                          padding: '8px 12px',
                          background: 'var(--bg-card)',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.80rem',
                          color: 'var(--text-primary)'
                        }}
                      >
                        <span style={{ fontWeight: '700', color: 'var(--accent-blue)' }}>{idx + 1}.</span>
                        <span>{act}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {!loading && !error && !result && (
            <div className="glass-panel" style={{ padding: '48px 32px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <UserX size={48} style={{ margin: '0 auto 16px', color: 'var(--accent-rose)', opacity: 0.6 }} />
              <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '6px' }}>
                Awaiting Account Evaluation
              </h4>
              <p style={{ fontSize: '0.84rem', maxWidth: '380px', margin: '0 auto 20px', lineHeight: '1.45' }}>
                Input customer history and satisfaction metrics to compute risk probability and trigger proactive retention plays.
              </p>
              <button onClick={handlePredict} className="btn-secondary">
                <Play size={14} /> Quick Demo Run
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerChurn;
