import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  LineChart,
  TrendingUp,
  DollarSign,
  UserX,
  Users,
  BrainCircuit,
  FileSpreadsheet,
  Settings as SettingsIcon,
  Sparkles,
  Activity,
  X
} from 'lucide-react';

export const Sidebar = ({ mobileOpen, setMobileOpen, systemHealth }) => {
  const navItems = [
    { section: 'Overview' },
    { to: '/dashboard', label: 'Command Center', icon: LayoutDashboard, badge: 'Live' },
    { to: '/analytics', label: 'Analytics Explorer', icon: LineChart },
    
    { section: 'Predictive Intelligence' },
    { to: '/sales-prediction', label: 'Sales Prediction', icon: TrendingUp, badge: 'ML' },
    { to: '/profit-prediction', label: 'Profit Prediction', icon: DollarSign, badge: 'ML' },
    { to: '/customer-churn', label: 'Customer Churn', icon: UserX, badge: 'ML' },
    { to: '/customer-segmentation', label: 'Segmentation', icon: Users, badge: 'ML' },
    
    { section: 'Decision Support & Ops' },
    { to: '/ai-advisor', label: 'AI Advisor', icon: BrainCircuit, badge: 'AI' },
    { to: '/reports', label: 'Business Reports', icon: FileSpreadsheet },
    { to: '/settings', label: 'System Settings', icon: SettingsIcon },
  ];

  const handleNavClick = () => {
    if (mobileOpen && setMobileOpen) {
      setMobileOpen(false);
    }
  };

  return (
    <aside className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <BrainCircuit size={22} />
        </div>
        <div className="sidebar-brand-text">
          <span className="sidebar-brand-title">AI COMMAND CENTER</span>
          <span className="sidebar-brand-subtitle">Business Intelligence</span>
        </div>
        {mobileOpen && (
          <button
            onClick={() => setMobileOpen(false)}
            style={{ marginLeft: 'auto', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        )}
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item, idx) => {
          if (item.section) {
            return (
              <div key={`sec-${idx}`} className="nav-section-title">
                {item.section}
              </div>
            );
          }
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={handleNavClick}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
              {item.badge && <span className="nav-badge">{item.badge}</span>}
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-status-card">
          <div className="status-dot" style={{
            background: systemHealth?.models?.sales ? 'var(--accent-emerald)' : 'var(--accent-amber)',
            boxShadow: `0 0 8px ${systemHealth?.models?.sales ? 'var(--accent-emerald)' : 'var(--accent-amber)'}`
          }} />
          <div>
            <div className="status-text">AI Models Active</div>
            <div className="status-sub">
              {systemHealth?.model_details ? '4/4 Models Online' : 'Connecting to Core...'}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
