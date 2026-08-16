import React from 'react';
import {
  BrainCircuit,
  TrendingUp,
  Users,
  Sparkles,
  BarChart3,
  ShieldCheck,
  Sun,
  Moon
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const AuthLayout = ({ children, title, subtitle }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="auth-page-container">
      {/* Theme Toggle in Top Right */}
      <button
        onClick={toggleTheme}
        className="auth-theme-toggle"
        title="Toggle Theme"
        aria-label="Toggle Theme"
      >
        {theme === 'dark' ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#6366f1" />}
      </button>

      <div className="auth-wrapper">
        {/* Left Side: AI Brand Hero Banner */}
        <div className="auth-brand-section">
          <div className="auth-brand-badge">
            <Sparkles size={16} className="text-accent" />
            <span>Next-Gen Enterprise BI</span>
          </div>

          <div className="auth-brand-header">
            <div className="brand-icon-box">
              <BrainCircuit size={32} color="#ffffff" />
            </div>
            <div>
              <h1 className="auth-brand-title">AI Business Command Center</h1>
              <p className="auth-brand-tagline">Intelligent Decision & Predictive Analytics Platform</p>
            </div>
          </div>

          <div className="auth-hero-pitch">
            <h2>Turn Business Data Into Intelligent Decisions.</h2>
            <p>
              Harness cutting-edge Machine Learning, predictive customer intelligence, and automated decision support in one unified executive command center.
            </p>
          </div>

          <div className="auth-features-list">
            <div className="auth-feature-item">
              <div className="feature-dot-icon"><TrendingUp size={16} /></div>
              <div>
                <strong>Predictive Analytics</strong>
                <span>Random Forest forecasting for sales trajectory & net profit margins.</span>
              </div>
            </div>

            <div className="auth-feature-item">
              <div className="feature-dot-icon"><Users size={16} /></div>
              <div>
                <strong>Customer Intelligence</strong>
                <span>Proactive churn classification & behavioral RFM segmentation.</span>
              </div>
            </div>

            <div className="auth-feature-item">
              <div className="feature-dot-icon"><Sparkles size={16} /></div>
              <div>
                <strong>AI Recommendations</strong>
                <span>Strategic SWOT insights, health score diagnostics & decision engine.</span>
              </div>
            </div>

            <div className="auth-feature-item">
              <div className="feature-dot-icon"><BarChart3 size={16} /></div>
              <div>
                <strong>Business Performance</strong>
                <span>Dynamic regional analytics, category audits & verified exports.</span>
              </div>
            </div>
          </div>

          <div className="auth-security-footer">
            <ShieldCheck size={16} color="#10b981" />
            <span>Enterprise Security • Role-Based JWT Auth • High-Precision ML Engine</span>
          </div>
        </div>

        {/* Right Side: Auth Form Container */}
        <div className="auth-form-section">
          <div className="auth-card glass-panel">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
