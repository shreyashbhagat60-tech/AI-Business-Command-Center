import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const KPICard = ({
  title,
  value,
  change,
  isPositive = true,
  icon: Icon,
  iconBg = 'rgba(56, 189, 248, 0.15)',
  iconColor = '#38bdf8',
  subtext = 'vs previous period'
}) => {
  const isUp = change ? parseFloat(change) >= 0 : isPositive;

  return (
    <div className="kpi-card">
      <div className="kpi-header">
        <span className="kpi-title">{title}</span>
        {Icon && (
          <div className="kpi-icon-wrapper" style={{ backgroundColor: iconBg, color: iconColor }}>
            <Icon size={18} />
          </div>
        )}
      </div>

      <div className="kpi-value">{value}</div>

      <div className="kpi-footer">
        {change !== undefined && change !== null && (
          <span className={`trend-pill ${isUp ? 'positive' : 'negative'}`}>
            {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {isUp ? `+${change}%` : `${change}%`}
          </span>
        )}
        <span className="kpi-subtext">{subtext}</span>
      </div>
    </div>
  );
};

export default KPICard;
