import React from 'react';
import { Sparkles, TrendingUp, AlertTriangle, AlertCircle, ArrowRight } from 'lucide-react';

export const AIInsightCard = ({
  type = 'opportunity',
  title,
  message,
  metric,
  impact = 'High',
  onActionClick
}) => {
  const getBadgeStyle = () => {
    switch (type) {
      case 'warning':
        return { bg: 'var(--badge-amber-bg)', text: 'var(--badge-amber-text)', icon: AlertTriangle, border: 'rgba(245, 158, 11, 0.3)' };
      case 'alert':
        return { bg: 'var(--badge-rose-bg)', text: 'var(--badge-rose-text)', icon: AlertCircle, border: 'rgba(244, 63, 94, 0.3)' };
      case 'optimization':
        return { bg: 'var(--badge-blue-bg)', text: 'var(--badge-blue-text)', icon: Sparkles, border: 'rgba(56, 189, 248, 0.3)' };
      default:
        return { bg: 'var(--badge-emerald-bg)', text: 'var(--badge-emerald-text)', icon: TrendingUp, border: 'rgba(16, 185, 129, 0.3)' };
    }
  };

  const style = getBadgeStyle();
  const Icon = style.icon;

  return (
    <div
      className="glass-panel"
      style={{
        padding: '18px 20px',
        borderLeft: `4px solid ${style.text}`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '12px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '26px',
            height: '26px',
            borderRadius: '6px',
            backgroundColor: style.bg,
            color: style.text,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Icon size={15} />
          </div>
          <h4 style={{ fontSize: '0.92rem', fontWeight: '700', color: 'var(--text-primary)' }}>
            {title}
          </h4>
        </div>
        {metric && (
          <span style={{
            fontSize: '0.72rem',
            fontWeight: '700',
            backgroundColor: style.bg,
            color: style.text,
            padding: '2px 8px',
            borderRadius: 'var(--radius-full)'
          }}>
            {metric}
          </span>
        )}
      </div>

      <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: '1.45' }}>
        {message}
      </p>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '4px' }}>
        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          Impact: <strong style={{ color: 'var(--text-primary)' }}>{impact} Priority</strong>
        </span>
        {onActionClick && (
          <button
            onClick={onActionClick}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--accent-blue)',
              fontSize: '0.78rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer'
            }}
          >
            Review Strategy <ArrowRight size={13} />
          </button>
        )}
      </div>
    </div>
  );
};

export default AIInsightCard;
