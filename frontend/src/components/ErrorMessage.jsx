import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export const ErrorMessage = ({ message = 'Unable to complete request. Please verify inputs or ensure backend server is online.', onRetry }) => {
  return (
    <div className="glass-panel" style={{
      padding: '20px 24px',
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
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '50%',
          backgroundColor: 'rgba(244, 63, 94, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <AlertCircle size={20} color="#f43f5e" />
        </div>
        <div>
          <h4 style={{ color: 'var(--text-primary)', fontWeight: '600', fontSize: '0.95rem' }}>Execution Warning</h4>
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
};

export default ErrorMessage;
