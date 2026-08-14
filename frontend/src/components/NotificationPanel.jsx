import React from 'react';
import { Bell, CheckCircle2, AlertTriangle, TrendingUp, Info, X } from 'lucide-react';

export const NotificationPanel = ({ isOpen, onClose, notifications = [], onClear }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'absolute',
      top: '65px',
      right: '28px',
      width: '380px',
      maxWidth: 'calc(100vw - 32px)',
      background: 'var(--bg-card)',
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-lg)',
      zIndex: 100,
      animation: 'fadeIn 0.2s ease-out'
    }}>
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Bell size={18} color="var(--accent-blue)" />
          <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-primary)' }}>
            System Intelligence Alerts
          </h4>
        </div>
        <button
          onClick={onClose}
          style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
        >
          <X size={18} />
        </button>
      </div>

      <div style={{ maxHeight: '380px', overflowY: 'auto', padding: '12px' }}>
        {notifications.length === 0 ? (
          <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <CheckCircle2 size={32} style={{ margin: '0 auto 8px', color: 'var(--accent-emerald)', opacity: 0.8 }} />
            <p style={{ fontSize: '0.85rem' }}>All business systems operating smoothly.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {notifications.map((notif, idx) => (
              <div
                key={notif.id || idx}
                style={{
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-app)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  gap: '12px'
                }}
              >
                <div style={{ marginTop: '2px' }}>
                  {notif.type === 'warning' ? (
                    <AlertTriangle size={18} color="#f59e0b" />
                  ) : notif.type === 'alert' ? (
                    <AlertTriangle size={18} color="#f43f5e" />
                  ) : notif.type === 'opportunity' ? (
                    <TrendingUp size={18} color="#38bdf8" />
                  ) : (
                    <Info size={18} color="#10b981" />
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <h5 style={{ fontSize: '0.84rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                      {notif.title}
                    </h5>
                    <span style={{ fontSize: '0.70rem', color: 'var(--text-muted)' }}>{notif.time || 'Just now'}</span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: '1.4' }}>
                    {notif.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {notifications.length > 0 && onClear && (
        <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border-color)', textAlign: 'center' }}>
          <button
            onClick={onClear}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--accent-blue)',
              fontSize: '0.80rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Mark all alerts as read
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;
