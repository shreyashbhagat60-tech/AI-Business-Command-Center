import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Menu,
  Sun,
  Moon,
  Bell,
  Search,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Layers
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import NotificationPanel from './NotificationPanel';

const PAGE_TITLES = {
  '/dashboard': { title: 'Executive Command Center', subtitle: 'Live business performance, predictive KPIs, and real-time trends' },
  '/analytics': { title: 'Multidimensional Analytics Explorer', subtitle: 'Interactive data filtering across regions, categories, and channels' },
  '/sales-prediction': { title: 'ML Sales Revenue Predictor', subtitle: 'RandomForestRegressor forecasting based on enterprise parameters' },
  '/profit-prediction': { title: 'Profit & Margin Simulator', subtitle: 'Cost-volume-profit analytics and pricing elasticity optimization' },
  '/customer-churn': { title: 'Customer Churn Risk Classifier', subtitle: 'Retention vulnerability modeling and proactive AI intervention' },
  '/customer-segmentation': { title: 'Customer Segmentation Engine', subtitle: 'Behavioral clustering and high-value customer lifecycle management' },
  '/ai-advisor': { title: 'AI Business Advisor & Health Score', subtitle: 'Strategic SWOT analysis and actionable AI decision recommendations' },
  '/reports': { title: 'Enterprise Business Reports', subtitle: 'Comprehensive audit tables with CSV, Excel, and PDF export' },
  '/settings': { title: 'System Diagnostics & Configuration', subtitle: 'ML model status, API parameters, and environment preferences' },
};

export const Navbar = ({ setMobileOpen, systemHealth }) => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'opportunity', title: 'Sales Surge in West Region', message: 'Electronics category recorded +14.2% week-over-week revenue velocity.', time: '10m ago' },
    { id: 2, type: 'warning', title: 'Low Inventory Alert', message: 'Fitness apparel stock at regional warehouse is below 25 units.', time: '1h ago' },
    { id: 3, type: 'alert', title: 'High Churn Cluster Detected', message: '3 accounts in South region flagged with churn probability > 75%.', time: '3h ago' },
    { id: 4, type: 'info', title: 'ML Pipeline Re-calibrated', message: 'RandomForest models successfully loaded with latest feature schemas.', time: '5h ago' }
  ]);

  const currentPage = PAGE_TITLES[location.pathname] || {
    title: 'AI Business Command Center',
    subtitle: 'Decision intelligence platform'
  };

  const handleClearNotifications = () => {
    setNotifications([]);
  };

  const isHealthy = systemHealth?.status === 'healthy';

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button
          className="menu-toggle-btn"
          onClick={() => setMobileOpen(prev => !prev)}
          title="Toggle Navigation Menu"
        >
          <Menu size={20} />
        </button>

        <div className="page-header-info">
          <h1>{currentPage.title}</h1>
          <p>{currentPage.subtitle}</p>
        </div>
      </div>

      <div className="navbar-right">
        {/* System Health Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 10px',
            borderRadius: 'var(--radius-full)',
            background: isHealthy ? 'var(--badge-emerald-bg)' : 'var(--badge-amber-bg)',
            color: isHealthy ? 'var(--badge-emerald-text)' : 'var(--badge-amber-text)',
            fontSize: '0.75rem',
            fontWeight: '600'
          }}
          title="ML Engine & Data Pipeline Status"
        >
          {isHealthy ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />}
          <span>{isHealthy ? 'AI Core: Online' : 'Core: Standby'}</span>
        </div>

        {/* Theme Switch Button */}
        <button
          className="nav-icon-btn"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#6366f1" />}
        </button>

        {/* Notifications Toggle */}
        <div style={{ position: 'relative' }}>
          <button
            className="nav-icon-btn"
            onClick={() => setShowNotifications(prev => !prev)}
            title="Notifications & AI Alerts"
          >
            <Bell size={18} />
            {notifications.length > 0 && <span className="notification-badge-dot" />}
          </button>

          <NotificationPanel
            isOpen={showNotifications}
            onClose={() => setShowNotifications(false)}
            notifications={notifications}
            onClear={handleClearNotifications}
          />
        </div>

        {/* Executive User Profile */}
        <div className="user-profile-badge">
          <div className="user-avatar">
            <span>BC</span>
          </div>
          <div className="user-info">
            <span className="user-name">Executive Suite</span>
            <span className="user-role">Enterprise Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
