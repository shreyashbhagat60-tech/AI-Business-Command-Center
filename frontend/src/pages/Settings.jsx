import React, { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  Sun,
  Moon,
  Cpu,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Server,
  Database,
  BellRing,
  Sliders,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import apiService from '../services/api';
import { Loading, ErrorMessage } from '../components/Loading';

export const Settings = () => {
  const { theme, setTheme } = useTheme();
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reloading, setReloading] = useState(false);
  const [reloadMsg, setReloadMsg] = useState(null);

  const [notificationPrefs, setNotificationPrefs] = useState({
    churnAlerts: true,
    inventoryWarnings: true,
    salesSpikes: true,
    aiRecommendations: true
  });

  const fetchHealth = async () => {
    setLoading(true);
    try {
      const res = await apiService.getHealth();
      setHealthData(res);
    } catch (err) {
      console.error('Failed to load system diagnostics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  const handleReloadModels = async () => {
    setReloading(true);
    setReloadMsg(null);
    try {
      const res = await apiService.reloadModels();
      setReloadMsg(res.message || 'Models and dataset reloaded into memory.');
      await fetchHealth();
    } catch (err) {
      setReloadMsg(`Error reloading: ${err.message}`);
    } finally {
      setReloading(false);
    }
  };

  return (
    <div className="content-area animate-fade-in">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        
        {/* 1. Appearance & Theme Settings */}
        <div className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <Sun size={20} color="var(--accent-amber)" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              Appearance & Theme
            </h3>
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '18px' }}>
            Configure visual styling for presentation and high-contrast environments.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            <button
              onClick={() => setTheme('dark')}
              className={`btn-secondary ${theme === 'dark' ? 'btn-primary' : ''}`}
              style={{ padding: '14px', flexDirection: 'column', gap: '6px' }}
            >
              <Moon size={20} />
              <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Dark AI Theme</span>
            </button>

            <button
              onClick={() => setTheme('light')}
              className={`btn-secondary ${theme === 'light' ? 'btn-primary' : ''}`}
              style={{ padding: '14px', flexDirection: 'column', gap: '6px' }}
            >
              <Sun size={20} />
              <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Light Clean Theme</span>
            </button>
          </div>
        </div>

        {/* 2. Notification Preferences */}
        <div className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <BellRing size={20} color="var(--accent-blue)" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              AI Telemetry Alerts
            </h3>
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Choose which automated business risk events generate desktop and navbar alerts.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { key: 'churnAlerts', label: 'High Churn Account Vulnerability' },
              { key: 'inventoryWarnings', label: 'Low Inventory & Stockout Warnings' },
              { key: 'salesSpikes', label: 'Surge in Category Volume' },
              { key: 'aiRecommendations', label: 'Periodic AI Decision Recommendations' },
            ].map(item => (
              <label key={item.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.86rem', color: 'var(--text-primary)', cursor: 'pointer' }}>
                <span>{item.label}</span>
                <input
                  type="checkbox"
                  checked={notificationPrefs[item.key]}
                  onChange={e => setNotificationPrefs(p => ({ ...p, [item.key]: e.target.checked }))}
                  style={{ width: '18px', height: '18px', accentColor: '#0284c7' }}
                />
              </label>
            ))}
          </div>
        </div>

        {/* 3. ML Model Diagnostics & Live Status */}
        <div className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--radius-lg)', gridColumn: '1 / -1' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Cpu size={20} color="var(--accent-emerald)" />
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                  Scikit-Learn ML Model Diagnostics
                </h3>
                <p style={{ fontSize: '0.80rem', color: 'var(--text-muted)' }}>
                  Real-time connection status of Joblib model binaries and feature encoders
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={handleReloadModels}
                disabled={reloading}
                className="btn-primary"
                style={{ padding: '8px 16px', fontSize: '0.82rem' }}
              >
                <RefreshCw size={14} className={reloading ? 'spin' : ''} />
                <span>{reloading ? 'Reloading Model Binaries...' : 'Hot Reload ML Artifacts'}</span>
              </button>
            </div>
          </div>

          {reloadMsg && (
            <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-md)', background: 'var(--bg-app)', border: '1px solid var(--border-color)', fontSize: '0.82rem', marginBottom: '16px', color: 'var(--accent-blue)' }}>
              {reloadMsg}
            </div>
          )}

          {loading ? (
            <Loading text="Scanning ML model binary paths..." />
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
              {healthData?.model_details && Object.entries(healthData.model_details).map(([name, status]) => {
                const isOnline = status === 'CONNECTED';
                return (
                  <div
                    key={name}
                    style={{
                      padding: '16px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-app)',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.86rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                        {name.replace('_', ' ').toUpperCase()}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        scikit-learn binary
                      </div>
                    </div>

                    <span className={`badge ${isOnline ? 'badge-emerald' : 'badge-amber'}`}>
                      {isOnline ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                      {status}
                    </span>
                  </div>
                );
              })}

              {healthData?.auxiliary && Object.entries(healthData.auxiliary).map(([name, status]) => {
                const isOnline = status === 'CONNECTED';
                return (
                  <div
                    key={name}
                    style={{
                      padding: '16px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-app)',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.86rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                        {name.toUpperCase()} (META)
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        Feature schema / scaler
                      </div>
                    </div>

                    <span className={`badge ${isOnline ? 'badge-emerald' : 'badge-amber'}`}>
                      {isOnline ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                      {status}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 4. System Environment Info */}
        <div className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--radius-lg)', gridColumn: '1 / -1' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <Server size={20} color="var(--accent-blue)" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              Platform Architecture & Runtime
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', fontSize: '0.84rem' }}>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Backend Engine:</span>
              <div style={{ fontWeight: '600', color: 'var(--text-primary)', marginTop: '2px' }}>FastAPI + Uvicorn (Python 3.14)</div>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Frontend Client:</span>
              <div style={{ fontWeight: '600', color: 'var(--text-primary)', marginTop: '2px' }}>React 19 + Vite + Recharts</div>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Active Dataset Records:</span>
              <div style={{ fontWeight: '600', color: 'var(--text-primary)', marginTop: '2px' }}>
                {healthData?.dataset?.record_count ? `${healthData.dataset.record_count.toLocaleString()} Records Loaded` : 'Ready'}
              </div>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>API Base Endpoint:</span>
              <div style={{ fontWeight: '600', color: 'var(--accent-blue)', marginTop: '2px' }}>http://127.0.0.1:8000</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
