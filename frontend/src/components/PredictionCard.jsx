import React from 'react';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Gauge,
  TrendingUp,
  Cpu
} from 'lucide-react';

export const PredictionCard = ({
  title = 'Predicted Value',
  value,
  currency = '₹',
  confidence = 0.92,
  modelStatus = 'Connected (RandomForest)',
  isDemo = false,
  recommendation,
  interpretation,
  featureImpacts = [],
  inputs = {}
}) => {
  return (
    <div className="prediction-result-hero animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={20} color="var(--accent-blue)" />
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)' }}>
            ML Intelligence Prediction
          </h3>
        </div>
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          padding: '4px 10px',
          borderRadius: 'var(--radius-full)',
          background: isDemo ? 'var(--badge-amber-bg)' : 'var(--badge-emerald-bg)',
          color: isDemo ? 'var(--badge-amber-text)' : 'var(--badge-emerald-text)',
          fontSize: '0.75rem',
          fontWeight: '600'
        }}>
          <Cpu size={12} />
          {modelStatus}
        </span>
      </div>

      <div className="result-display-box">
        <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', fontWeight: '600' }}>
          {title}
        </span>
        <div className="result-amount">
          {currency}{typeof value === 'number' ? value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : value}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.80rem', color: 'var(--text-secondary)' }}>
          <Gauge size={14} color="var(--accent-blue)" />
          <span>Model Prediction Confidence: <strong>{(confidence * 100).toFixed(0)}%</strong></span>
        </div>
      </div>

      {interpretation && (
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '14px 16px'
        }}>
          <h5 style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
            Model Interpretation
          </h5>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
            {interpretation}
          </p>
        </div>
      )}

      {featureImpacts && featureImpacts.length > 0 && (
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '14px 16px'
        }}>
          <h5 style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' }}>
            Key Feature Sensitivity & Weights
          </h5>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
            {featureImpacts.map((feat, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '6px 10px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--bg-app)',
                  fontSize: '0.78rem'
                }}
              >
                <span style={{ color: 'var(--text-secondary)' }}>{feat.feature}</span>
                <strong style={{ color: feat.direction === 'negative' ? 'var(--accent-rose)' : 'var(--accent-emerald)' }}>
                  {feat.impact}
                </strong>
              </div>
            ))}
          </div>
        </div>
      )}

      {recommendation && (
        <div style={{
          backgroundColor: 'rgba(56, 189, 248, 0.08)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          display: 'flex',
          gap: '12px',
          alignItems: 'flex-start'
        }}>
          <Lightbulb size={20} color="#38bdf8" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <h5 style={{ fontSize: '0.86rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
              Strategic AI Recommendation
            </h5>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.45' }}>
              {recommendation}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PredictionCard;
