import React, { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  Percent,
  Sparkles,
  Sliders,
  Play,
  CheckCircle2,
  AlertTriangle,
  Lightbulb
} from 'lucide-react';
import apiService from '../services/api';
import PredictionCard from '../components/PredictionCard';
import { Loading, ErrorMessage } from '../components/Loading';

const CATEGORIES = ["Electronics", "Furniture", "Clothing", "Grocery", "Home & Kitchen", "Fitness"];
const REGIONS = ["North", "South", "East", "West"];

export const ProfitPrediction = () => {
  const [formData, setFormData] = useState({
    unit_price: 800.0,
    quantity: 2,
    cost: 450.0,
    discount: 8.0,
    marketing_spend: 2500.0,
    customer_satisfaction: 4.6,
    delivery_time: 2,
    returned: 0,
    category: 'Electronics',
    region: 'North'
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' || type === 'range' ? parseFloat(value) || 0 : value
    }));
  };

  const handlePredict = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await apiService.predictProfit(formData);
      setResult(res);
    } catch (err) {
      console.error('Profit prediction error:', err);
      setError(err.message || 'Unable to generate profit prediction.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content-area animate-fade-in">
      <div className="prediction-layout">
        {/* Left Side: Form Controls */}
        <div className="glass-panel" style={{ padding: '26px', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-emerald)'
            }}>
              <DollarSign size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                Cost & Profit Margin Parameters
              </h3>
              <p style={{ fontSize: '0.80rem', color: 'var(--text-muted)' }}>
                Simulate net profit realization and evaluate pricing elasticity
              </p>
            </div>
          </div>

          <form onSubmit={handlePredict}>
            <div className="form-section-grid" style={{ marginBottom: '18px' }}>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select name="category" value={formData.category} onChange={handleChange} className="input-field">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Region</label>
                <select name="region" value={formData.region} onChange={handleChange} className="input-field">
                  {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Unit Price (₹)</label>
                <input type="number" name="unit_price" value={formData.unit_price} onChange={handleChange} className="input-field" min="1" step="0.5" required />
              </div>

              <div className="form-group">
                <label className="form-label">Unit Cost (₹)</label>
                <input type="number" name="cost" value={formData.cost} onChange={handleChange} className="input-field" min="0" step="0.5" required />
              </div>

              <div className="form-group">
                <label className="form-label">Order Quantity</label>
                <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} className="input-field" min="1" max="100" required />
              </div>

              <div className="form-group">
                <label className="form-label">Marketing Allocation (₹)</label>
                <input type="number" name="marketing_spend" value={formData.marketing_spend} onChange={handleChange} className="input-field" min="0" step="100" />
              </div>

              <div className="form-group">
                <label className="form-label">Delivery SLA (Days)</label>
                <input type="number" name="delivery_time" value={formData.delivery_time} onChange={handleChange} className="input-field" min="1" max="30" />
              </div>

              <div className="form-group">
                <label className="form-label">Customer Satisfaction</label>
                <input type="number" name="customer_satisfaction" value={formData.customer_satisfaction} onChange={handleChange} className="input-field" min="1.0" max="5.0" step="0.1" required />
              </div>
            </div>

            {/* Interactive Scenario Sliders */}
            <div style={{ background: 'var(--bg-app)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.82rem' }}>
                <span style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>Discount Rate Slider:</span>
                <strong style={{ color: 'var(--accent-blue)' }}>{formData.discount}%</strong>
              </div>
              <input
                type="range"
                name="discount"
                min="0"
                max="50"
                step="1"
                value={formData.discount}
                onChange={handleChange}
                style={{ width: '100%', accentColor: '#38bdf8' }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ width: '100%', padding: '12px' }}
            >
              {loading ? (
                <span>Calculating Profit Dynamics...</span>
              ) : (
                <>
                  <Sparkles size={16} /> Run Profit & Margin Simulation
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Side: Prediction Result Hero or Empty State */}
        <div>
          {loading && <Loading text="Preprocessing profit features and scoring RandomForest model..." />}
          {error && <ErrorMessage message={error} onRetry={handlePredict} />}

          {!loading && !error && result && (
            <div className="prediction-result-hero animate-fade-in">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={20} color="var(--accent-emerald)" />
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                    Net Profit Realization Model
                  </h3>
                </div>
                <span className="badge badge-emerald">{result.model_status}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
                <div className="result-display-box">
                  <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '600' }}>
                    Predicted Net Profit
                  </span>
                  <div className="result-amount" style={{ color: 'var(--accent-emerald)' }}>
                    ₹{result.predicted_profit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>

                <div className="result-display-box">
                  <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '600' }}>
                    Realized Profit Margin
                  </span>
                  <div className="result-amount" style={{ color: result.profit_margin_pct >= 20 ? 'var(--accent-emerald)' : 'var(--accent-amber)' }}>
                    {result.profit_margin_pct.toFixed(1)}%
                  </div>
                </div>
              </div>

              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '14px 16px' }}>
                <h5 style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
                  Business Interpretation
                </h5>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                  {result.business_interpretation}
                </p>
              </div>

              <div style={{
                backgroundColor: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                display: 'flex',
                gap: '12px',
                alignItems: 'flex-start'
              }}>
                <Lightbulb size={20} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <h5 style={{ fontSize: '0.86rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
                    Profit Maximization Strategy
                  </h5>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.45' }}>
                    {result.recommendation}
                  </p>
                </div>
              </div>
            </div>
          )}

          {!loading && !error && !result && (
            <div className="glass-panel" style={{ padding: '48px 32px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <DollarSign size={48} style={{ margin: '0 auto 16px', color: 'var(--accent-emerald)', opacity: 0.6 }} />
              <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '6px' }}>
                Awaiting Profit Simulation
              </h4>
              <p style={{ fontSize: '0.84rem', maxWidth: '380px', margin: '0 auto 20px', lineHeight: '1.45' }}>
                Tune pricing, costs, and promotional discounts to evaluate estimated net take-home margin.
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

export default ProfitPrediction;
