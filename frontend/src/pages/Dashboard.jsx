import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DollarSign,
  TrendingUp,
  ShoppingBag,
  Users,
  Percent,
  Receipt,
  UserCheck,
  UserX,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Zap,
  BrainCircuit
} from 'lucide-react';

import apiService from '../services/api';
import KPICard from '../components/KPICard';
import {
  SalesTrendChart,
  ProfitTrendChart,
  RevenueVsProfitChart,
  RegionalBarChart,
  CategoryBarChart,
  CustomerSegmentationDonut,
  CustomerChurnDonut
} from '../components/Charts';
import AIInsightCard from '../components/AIInsightCard';
import { SkeletonCard, ErrorMessage } from '../components/Loading';

export const Dashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiService.getDashboard();
      setData(res);
    } catch (err) {
      console.error('Error loading dashboard:', err);
      setError(err.message || 'Failed to connect to backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="content-area animate-fade-in">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px', marginBottom: '24px' }}>
          {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="content-area">
        <ErrorMessage message={error} onRetry={fetchDashboardData} />
      </div>
    );
  }

  const kpis = data?.kpis || {};
  const insights = data?.ai_insights || [];

  return (
    <div className="content-area animate-fade-in">
      {/* Top Banner / Executive Welcome */}
      <div className="glass-panel" style={{
        padding: '24px 28px',
        marginBottom: '24px',
        background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.12), rgba(99, 102, 241, 0.12))',
        border: '1px solid rgba(56, 189, 248, 0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, #0284c7, #6366f1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 4px 14px rgba(2, 132, 199, 0.4)'
          }}>
            <BrainCircuit size={26} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              AI Business Command Center
            </h2>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
              Real-time BI telemetry, scikit-learn forecasting, and autonomous decision optimization.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => navigate('/ai-advisor')}
            className="btn-primary"
            style={{ padding: '8px 16px', fontSize: '0.84rem' }}
          >
            <Sparkles size={15} /> Launch AI Advisor
          </button>
          <button
            onClick={fetchDashboardData}
            className="btn-secondary"
            style={{ padding: '8px 12px', fontSize: '0.84rem' }}
            title="Refresh Live Data"
          >
            <RefreshCw size={15} />
          </button>
        </div>
      </div>

      {/* Primary KPI Grid (8 Cards) */}
      <div className="kpi-grid">
        <KPICard
          title="Total Revenue"
          value={`₹${(kpis.revenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          change={kpis.sales_growth}
          icon={DollarSign}
          iconBg="rgba(56, 189, 248, 0.15)"
          iconColor="#38bdf8"
        />
        <KPICard
          title="Total Profit"
          value={`₹${(kpis.profit || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          change={kpis.profit_growth}
          icon={TrendingUp}
          iconBg="rgba(16, 185, 129, 0.15)"
          iconColor="#10b981"
        />
        <KPICard
          title="Total Orders"
          value={(kpis.orders || 0).toLocaleString()}
          icon={ShoppingBag}
          iconBg="rgba(99, 102, 241, 0.15)"
          iconColor="#6366f1"
          subtext="Processed lifetime"
        />
        <KPICard
          title="Total Customers"
          value={(kpis.customers || 0).toLocaleString()}
          icon={Users}
          iconBg="rgba(244, 114, 182, 0.15)"
          iconColor="#f472b6"
          subtext="Unique buyer accounts"
        />
        <KPICard
          title="Profit Margin"
          value={`${(kpis.profit_margin || 0).toFixed(1)}%`}
          isPositive={kpis.profit_margin >= 20}
          icon={Percent}
          iconBg="rgba(245, 158, 11, 0.15)"
          iconColor="#f59e0b"
          subtext="Blended net margin"
        />
        <KPICard
          title="Avg Order Value"
          value={`₹${(kpis.average_order_value || 0).toFixed(2)}`}
          icon={Receipt}
          iconBg="rgba(6, 182, 212, 0.15)"
          iconColor="#06b6d4"
          subtext="Revenue per checkout"
        />
        <KPICard
          title="Customer Retention"
          value={`${(kpis.customer_retention || 0).toFixed(1)}%`}
          isPositive={kpis.customer_retention >= 75}
          icon={UserCheck}
          iconBg="rgba(16, 185, 129, 0.15)"
          iconColor="#10b981"
          subtext="Loyalty index"
        />
        <KPICard
          title="Churn Rate"
          value={`${(kpis.churn_rate || 0).toFixed(1)}%`}
          isPositive={kpis.churn_rate < 15}
          icon={UserX}
          iconBg="rgba(244, 63, 94, 0.15)"
          iconColor="#f43f5e"
          subtext="Vulnerability share"
        />
      </div>

      {/* AI Insights Section */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} color="var(--accent-blue)" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              Real-Time AI Business Insights
            </h3>
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Autonomously generated from multi-variable regressions
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {insights.map(ins => (
            <AIInsightCard
              key={ins.id}
              type={ins.type}
              title={ins.title}
              message={ins.message}
              metric={ins.metric}
              impact={ins.impact}
              onActionClick={() => navigate('/ai-advisor')}
            />
          ))}
        </div>
      </div>

      {/* Charts Row 1: Sales Trend & Profit Trend */}
      <div className="charts-grid-2">
        <div className="glass-panel" style={{ padding: '22px' }}>
          <div className="card-title-bar">
            <div className="card-title-group">
              <h3>Sales Revenue Trend</h3>
              <p>Monthly gross sales trajectory over time</p>
            </div>
            <span className="badge badge-blue">Time Series</span>
          </div>
          <SalesTrendChart data={data?.sales_trend} height={260} />
        </div>

        <div className="glass-panel" style={{ padding: '22px' }}>
          <div className="card-title-bar">
            <div className="card-title-group">
              <h3>Net Profit Realization</h3>
              <p>Monthly net profit margins after costs & marketing</p>
            </div>
            <span className="badge badge-emerald">Profitability</span>
          </div>
          <ProfitTrendChart data={data?.profit_trend} height={260} />
        </div>
      </div>

      {/* Charts Row 2: Revenue vs Profit & Regional Sales */}
      <div className="charts-grid-2">
        <div className="glass-panel" style={{ padding: '22px' }}>
          <div className="card-title-bar">
            <div className="card-title-group">
              <h3>Revenue vs. Profit Comparison</h3>
              <p>Correlation between total gross billings and net take-home</p>
            </div>
            <span className="badge badge-blue">Comparative</span>
          </div>
          <RevenueVsProfitChart data={data?.sales_trend} height={260} />
        </div>

        <div className="glass-panel" style={{ padding: '22px' }}>
          <div className="card-title-bar">
            <div className="card-title-group">
              <h3>Regional Performance</h3>
              <p>Sales revenue distribution across North, South, East, West</p>
            </div>
            <span className="badge badge-amber">Territory</span>
          </div>
          <RegionalBarChart data={data?.regional_sales} height={260} />
        </div>
      </div>

      {/* Charts Row 3: Category Performance, Customer Segmentation, Customer Churn */}
      <div className="charts-grid-3">
        <div className="glass-panel" style={{ padding: '22px' }}>
          <div className="card-title-bar">
            <div className="card-title-group">
              <h3>Category Sales</h3>
              <p>Revenue breakdown by catalog category</p>
            </div>
          </div>
          <CategoryBarChart data={data?.category_sales} height={250} />
        </div>

        <div className="glass-panel" style={{ padding: '22px' }}>
          <div className="card-title-bar">
            <div className="card-title-group">
              <h3>Customer Segmentation</h3>
              <p>RFM behavioral distribution</p>
            </div>
          </div>
          <CustomerSegmentationDonut data={data?.customer_segmentation} height={250} />
        </div>

        <div className="glass-panel" style={{ padding: '22px' }}>
          <div className="card-title-bar">
            <div className="card-title-group">
              <h3>Customer Health & Churn</h3>
              <p>Active vs. At-Risk vs. Churned accounts</p>
            </div>
          </div>
          <CustomerChurnDonut data={data?.customer_churn} height={250} />
        </div>
      </div>

      {/* Quick Launch ML Simulators Footer Banner */}
      <div className="glass-panel" style={{
        padding: '24px',
        background: 'var(--bg-card)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h4 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)' }}>
            Predictive Machine Learning Workbenches
          </h4>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
            Simulate business outcomes using trained RandomForest regressors and classifiers.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/sales-prediction')} className="btn-secondary" style={{ fontSize: '0.82rem' }}>
            <TrendingUp size={14} color="#38bdf8" /> Sales Model
          </button>
          <button onClick={() => navigate('/profit-prediction')} className="btn-secondary" style={{ fontSize: '0.82rem' }}>
            <DollarSign size={14} color="#10b981" /> Profit Model
          </button>
          <button onClick={() => navigate('/customer-churn')} className="btn-secondary" style={{ fontSize: '0.82rem' }}>
            <UserX size={14} color="#f43f5e" /> Churn Model
          </button>
          <button onClick={() => navigate('/customer-segmentation')} className="btn-secondary" style={{ fontSize: '0.82rem' }}>
            <Users size={14} color="#6366f1" /> Segmentation
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
