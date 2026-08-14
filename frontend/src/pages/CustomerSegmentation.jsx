import React, { useState } from 'react';
import {
  Users,
  Sparkles,
  Award,
  ShieldCheck,
  Zap,
  Target,
  Play,
  Layers,
  Crown
} from 'lucide-react';
import apiService from '../services/api';
import { Loading, ErrorMessage } from '../components/Loading';

export const CustomerSegmentation = () => {
  const [formData, setFormData] = useState({
    age: 38,
    tenure_months: 24,
    purchase_frequency: 8,
    total_purchases: 45,
    average_order_value: 420.0,
    customer_satisfaction: 4.6,
    discount: 8.0
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
      const res = await apiService.predictSegment(formData);
      setResult(res);
    } catch (err) {
      console.error('Segmentation error:', err);
      setError(err.message || 'Unable to classify customer segment.');
    } finally {
      setLoading(false);
    }
  };

  const getSegmentColor = (seg) => {
    switch (seg) {
      case 'High Value Customer': return '#38bdf8';
      case 'Loyal Customer': return '#10b981';
      case 'Regular Customer': return '#6366f1';
      case 'At-Risk Customer': return '#f59e0b';
      default: return '#94a3b8';
    }
  };

  return (
    <div className="content-area animate-fade-in">
      <div className="prediction-layout">
        {/* Left: RFM & Behavioral Features */}
        <div className="glass-panel" style={{ padding: '26px', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(99, 102, 241, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-indigo)'
            }}>
              <Layers size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                RFM & Profile Telemetry
              </h3>
              <p style={{ fontSize: '0.80rem', color: 'var(--text-muted)' }}>
                Categorize customer into strategic tiers via ML clustering
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
                <label className="form-label">Tenure (Months)</label>
                <input type="number" name="tenure_months" value={formData.tenure_months} onChange={handleChange} className="input-field" min="1" max="120" required />
              </div>

              <div className="form-group">
                <label className="form-label">Annual Purchase Frequency</label>
                <input type="number" name="purchase_frequency" value={formData.purchase_frequency} onChange={handleChange} className="input-field" min="1" max="50" required />
              </div>

              <div className="form-group">
                <label className="form-label">Cumulative Orders</label>
                <input type="number" name="total_purchases" value={formData.total_purchases} onChange={handleChange} className="input-field" min="1" max="500" required />
              </div>

              <div className="form-group">
                <label className="form-label">Average Order Value (₹)</label>
                <input type="number" name="average_order_value" value={formData.average_order_value} onChange={handleChange} className="input-field" min="1" step="5" required />
              </div>

              <div className="form-group">
                <label className="form-label">Satisfaction Rating</label>
                <input type="number" name="customer_satisfaction" value={formData.customer_satisfaction} onChange={handleChange} className="input-field" min="1.0" max="5.0" step="0.1" required />
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Average Promotional Discount Used (%)</label>
                <input type="number" name="discount" value={formData.discount} onChange={handleChange} className="input-field" min="0" max="90" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ width: '100%', padding: '12px' }}
            >
              {loading ? (
                <span>Segmenting with AI Engine...</span>
              ) : (
                <>
                  <Sparkles size={16} /> Classify Customer Segment
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right: Assigned Segment Persona & Strategic Playbook */}
        <div>
          {loading && <Loading text="Executing RFM segmentation & feature clustering..." />}
          {error && <ErrorMessage message={error} onRetry={handlePredict} />}

          {!loading && !error && result && (
            <div className="prediction-result-hero animate-fade-in">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Crown size={20} color={getSegmentColor(result.segment)} />
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                    Customer Segment Classification
                  </h3>
                </div>
                <span className="badge" style={{ backgroundColor: `${getSegmentColor(result.segment)}22`, color: getSegmentColor(result.segment) }}>
                  {result.model_status}
                </span>
              </div>

              <div className="result-display-box" style={{ borderColor: getSegmentColor(result.segment) }}>
                <span style={{ fontSize: '0.80rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '700', letterSpacing: '0.06em' }}>
                  Assigned Segment Tier
                </span>
                <div className="result-amount" style={{ color: getSegmentColor(result.segment), fontSize: '2rem' }}>
                  {result.segment.toUpperCase()}
                </div>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
                  {result.segment_description}
                </p>
              </div>

              {/* RFM Score Matrix */}
              {result.rfm_score && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                  <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '12px', textAlign: 'center' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Recency</span>
                    <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--accent-blue)', marginTop: '2px' }}>
                      {result.rfm_score.recency_score} / 5
                    </div>
                  </div>
                  <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '12px', textAlign: 'center' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Frequency</span>
                    <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--accent-emerald)', marginTop: '2px' }}>
                      {result.rfm_score.frequency_score} / 5
                    </div>
                  </div>
                  <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '12px', textAlign: 'center' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Monetary</span>
                    <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--accent-purple)', marginTop: '2px' }}>
                      {result.rfm_score.monetary_score} / 5
                    </div>
                  </div>
                </div>
              )}

              {/* Characteristics */}
              {result.characteristics && (
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
                  <h5 style={{ fontSize: '0.84rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' }}>
                    Segment Characteristics & Profile
                  </h5>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                    {result.characteristics.map((char, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                        <ShieldCheck size={14} color="var(--accent-blue)" />
                        <span>{char}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Strategic Playbook */}
              {result.recommended_strategy && (
                <div style={{
                  backgroundColor: 'rgba(99, 102, 241, 0.08)',
                  border: '1px solid rgba(99, 102, 241, 0.25)',
                  borderRadius: 'var(--radius-md)',
                  padding: '18px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <Target size={18} color="#6366f1" />
                    <h5 style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                      Recommended Growth & Retention Strategy
                    </h5>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {result.recommended_strategy.map((strat, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '8px 12px',
                          background: 'var(--bg-card)',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.80rem',
                          color: 'var(--text-primary)'
                        }}
                      >
                        <Zap size={13} color="#6366f1" />
                        <span>{strat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {!loading && !error && !result && (
            <div className="glass-panel" style={{ padding: '48px 32px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Users size={48} style={{ margin: '0 auto 16px', color: 'var(--accent-indigo)', opacity: 0.6 }} />
              <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '6px' }}>
                Awaiting Customer Telemetry
              </h4>
              <p style={{ fontSize: '0.84rem', maxWidth: '380px', margin: '0 auto 20px', lineHeight: '1.45' }}>
                Enter customer behavioral records to classify RFM segment and unlock tailored personalization strategies.
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

export default CustomerSegmentation;
