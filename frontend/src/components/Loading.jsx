import React from 'react';
import { Loader2, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';

export const Loading = ({ text = 'Loading AI Intelligence...', fullPage = false }) => {
  if (fullPage) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        gap: '16px'
      }}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            border: '3px solid rgba(56, 189, 248, 0.2)',
            borderTopColor: '#38bdf8',
            animation: 'spin 1s linear infinite'
          }} />
          <Sparkles size={24} color="#38bdf8" style={{ position: 'absolute' }} />
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', fontWeight: '500' }}>
          {text}
        </p>
        <style>{`
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px',
      gap: '10px',
      color: 'var(--text-secondary)'
    }}>
      <Loader2 size={20} className="pulse-glow" style={{ animation: 'spin 1.2s linear infinite' }} />
      <span style={{ fontSize: '0.9rem' }}>{text}</span>
      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export const SkeletonCard = () => (
  <div className="glass-panel" style={{ padding: '24px', minHeight: '130px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ width: '40%', height: '14px', background: 'var(--bg-muted)', borderRadius: '4px' }} />
      <div style={{ width: '28px', height: '28px', background: 'var(--bg-muted)', borderRadius: '6px' }} />
    </div>
    <div style={{ width: '60%', height: '28px', background: 'var(--bg-muted)', borderRadius: '6px', margin: '12px 0' }} />
    <div style={{ width: '30%', height: '12px', background: 'var(--bg-muted)', borderRadius: '4px' }} />
  </div>
);

export const ErrorMessage = ({ message = 'An error occurred.', onRetry }) => (
  <div className="glass-panel" style={{
    padding: '24px',
    border: '1px solid rgba(244, 63, 94, 0.3)',
    backgroundColor: 'rgba(244, 63, 94, 0.05)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
    borderRadius: 'var(--radius-lg)',
    margin: '16px 0'
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
      <AlertCircle size={24} color="#f43f5e" />
      <div>
        <h4 style={{ color: 'var(--text-primary)', fontWeight: '600', fontSize: '0.95rem' }}>Unable to load data</h4>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{message}</p>
      </div>
    </div>
    {onRetry && (
      <button onClick={onRetry} className="btn-secondary" style={{ padding: '6px 14px', fontSize: '0.85rem' }}>
        <RefreshCw size={14} /> Retry
      </button>
    )}
  </div>
);

export default Loading;
