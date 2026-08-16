import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  Menu,
  Sun,
  Moon,
  Bell,
  Search,
  CheckCircle2,
  AlertCircle,
  User,
  Settings as SettingsIcon,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
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
  '/profile': { title: 'User Profile & Credentials', subtitle: 'Manage executive account settings and security credentials' },
  '/settings': { title: 'System Diagnostics & Configuration', subtitle: 'ML model status, API parameters, and environment preferences' },
};

export const Navbar = ({ setMobileOpen, systemHealth }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);

  const [notifications, setNotifications] = useState([
    { id: 1, type: 'opportunity', title: 'Sales Surge in West Region', message: 'Electronics category recorded +14.2% week-over-week revenue velocity.', time: '10m ago' },
    { id: 2, type: 'warning', title: 'Low Inventory Alert', message: 'Fitness apparel stock at regional warehouse is below 25 units.', time: '1h ago' },
    { id: 3, type: 'alert', title: 'High Churn Cluster Detected', message: '3 accounts in South region flagged with churn probability > 75%.', time: '3h ago' },
    { id: 4, type: 'info', title: 'ML Pipeline Re-calibrated', message: 'RandomForest models successfully loaded with latest feature schemas.', time: '5h ago' }
  ]);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentPage = PAGE_TITLES[location.pathname] || {
    title: 'AI Business Command Center',
    subtitle: 'Decision intelligence platform'
  };

  const handleClearNotifications = () => {
    setNotifications([]);
  };

  const handleLogout = async () => {
    setShowProfileMenu(false);
    await logout();
    navigate('/login');
  };

  const isHealthy = systemHealth?.status === 'healthy';
  const initial = user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'A';

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

        {/* Executive User Profile Dropdown */}
        <div style={{ position: 'relative' }} ref={profileMenuRef}>
          <button
            onClick={() => setShowProfileMenu(prev => !prev)}
            className="user-profile-badge"
            style={{ cursor: 'pointer', background: 'none', border: 'none', textAlign: 'left' }}
            title="User Profile Menu"
          >
            <div className="user-avatar">
              <span>{initial}</span>
            </div>
            <div className="user-info">
              <span className="user-name">{user?.full_name || 'Executive User'}</span>
              <span className="user-role">{user?.role || 'Enterprise Admin'}</span>
            </div>
            <ChevronDown size={14} style={{ color: 'var(--text-muted)', marginLeft: '4px' }} />
          </button>

          {/* Profile Dropdown Menu */}
          {showProfileMenu && (
            <div className="profile-dropdown glass-panel animate-fade-in" style={{
              position: 'absolute',
              top: 'calc(100% + 10px)',
              right: 0,
              width: '240px',
              padding: '12px',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-xl)',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              zIndex: 1000
            }}>
              <div style={{ padding: '8px 10px', borderBottom: '1px solid var(--border-color)', marginBottom: '8px' }}>
                <p style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
                  {user?.full_name || 'Executive User'}
                </p>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user?.email || 'admin@commandcenter.ai'}
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <Link
                  to="/profile"
                  onClick={() => setShowProfileMenu(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.86rem',
                    color: 'var(--text-secondary)',
                    textDecoration: 'none',
                    transition: 'var(--transition)'
                  }}
                  className="dropdown-item-hover"
                >
                  <User size={16} color="var(--accent-blue)" />
                  <span>My Profile</span>
                </Link>

                <Link
                  to="/settings"
                  onClick={() => setShowProfileMenu(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.86rem',
                    color: 'var(--text-secondary)',
                    textDecoration: 'none',
                    transition: 'var(--transition)'
                  }}
                  className="dropdown-item-hover"
                >
                  <SettingsIcon size={16} color="var(--accent-indigo)" />
                  <span>System Settings</span>
                </Link>

                <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '4px 0' }} />

                <button
                  onClick={handleLogout}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.86rem',
                    color: 'var(--accent-rose)',
                    background: 'none',
                    border: 'none',
                    width: '100%',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'var(--transition)'
                  }}
                  className="dropdown-item-hover"
                >
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
