import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  TrendingUp,
  DollarSign,
  UserX,
  Users,
  Activity,
  Download,
  Search,
  RefreshCw
} from 'lucide-react';
import apiService from '../services/api';
import ReportTable from '../components/ReportTable';
import ExportButtons from '../components/ExportButtons';
import { Loading, ErrorMessage } from '../components/Loading';

export const Reports = () => {
  const [activeTab, setActiveTab] = useState('sales');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const tabs = [
    { id: 'sales', label: 'Sales Transactions', icon: TrendingUp },
    { id: 'profit', label: 'Profit & Cost Audit', icon: DollarSign },
    { id: 'churn', label: 'Customer Retention & Churn', icon: UserX },
    { id: 'segmentation', label: 'Customer Segmentation', icon: Users },
    { id: 'performance', label: 'Executive Performance Summary', icon: Activity },
  ];

  const fetchReportData = async (type) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiService.getReports(type);
      setData(res.data || []);
    } catch (err) {
      console.error('Error loading report data:', err);
      setError(err.message || 'Unable to retrieve report records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData(activeTab);
  }, [activeTab]);

  // Column definitions per tab
  const getColumns = () => {
    switch (activeTab) {
      case 'sales':
        return [
          { key: 'transaction_id', label: 'Tx ID', render: v => <span style={{ fontWeight: '600', color: 'var(--accent-blue)' }}>{v}</span> },
          { key: 'date', label: 'Date' },
          { key: 'customer_id', label: 'Customer' },
          { key: 'category', label: 'Category', render: v => <span className="badge badge-blue">{v}</span> },
          { key: 'region', label: 'Region' },
          { key: 'quantity', label: 'Qty' },
          { key: 'unit_price', label: 'Unit Price', render: v => `₹${v}` },
          { key: 'discount', label: 'Discount', render: v => `${v}%` },
          { key: 'sales', label: 'Total Sales', render: v => <strong style={{ color: 'var(--text-primary)' }}>₹{v?.toLocaleString()}</strong> },
        ];
      case 'profit':
        return [
          { key: 'transaction_id', label: 'Tx ID', render: v => <span style={{ fontWeight: '600', color: 'var(--accent-blue)' }}>{v}</span> },
          { key: 'date', label: 'Date' },
          { key: 'category', label: 'Category' },
          { key: 'region', label: 'Region' },
          { key: 'sales', label: 'Gross Revenue', render: v => `₹${v?.toLocaleString()}` },
          { key: 'cost', label: 'Base Cost', render: v => `₹${v?.toLocaleString()}` },
          { key: 'marketing_spend', label: 'Marketing Spend', render: v => `₹${v?.toLocaleString()}` },
          { key: 'profit', label: 'Net Profit', render: v => (
            <strong style={{ color: v >= 0 ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>
              ₹{v?.toLocaleString()}
            </strong>
          )},
        ];
      case 'churn':
        return [
          { key: 'customer_id', label: 'Customer ID', render: v => <span style={{ fontWeight: '600', color: 'var(--accent-blue)' }}>{v}</span> },
          { key: 'age', label: 'Age' },
          { key: 'region', label: 'Region' },
          { key: 'tenure_months', label: 'Tenure (Mo)' },
          { key: 'purchase_frequency', label: 'Frequency' },
          { key: 'total_purchases', label: 'Total Orders' },
          { key: 'average_order_value', label: 'AOV', render: v => `₹${v}` },
          { key: 'customer_satisfaction', label: 'Rating', render: v => `${v} / 5` },
          { key: 'churn', label: 'Status', render: v => (
            <span className={`badge ${v === 1 ? 'badge-rose' : 'badge-emerald'}`}>
              {v === 1 ? 'Churned' : 'Active'}
            </span>
          )},
        ];
      case 'segmentation':
        return [
          { key: 'customer_id', label: 'Customer ID', render: v => <span style={{ fontWeight: '600', color: 'var(--accent-blue)' }}>{v}</span> },
          { key: 'age', label: 'Age' },
          { key: 'region', label: 'Region' },
          { key: 'total_purchases', label: 'Total Orders' },
          { key: 'average_order_value', label: 'AOV', render: v => `₹${v}` },
          { key: 'customer_satisfaction', label: 'Rating', render: v => `${v} / 5` },
          { key: 'segment', label: 'Assigned Segment', render: v => (
            <span className="badge badge-emerald">{v}</span>
          )},
        ];
      default:
        return Object.keys(data[0] || {}).map(k => ({ key: k, label: k.replace(/_/g, ' ').toUpperCase() }));
    }
  };

  return (
    <div className="content-area animate-fade-in">
      {/* Top Header Bar with Tabs & Exports */}
      <div className="glass-panel" style={{ padding: '20px 24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '18px' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              Enterprise Intelligence & Audit Reports
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Export compliant CSV, Excel spreadsheets, and formatted PDF summaries
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ExportButtons
              data={data}
              fileName={`AI_Command_Center_${activeTab}_report`}
              title={`${activeTab.toUpperCase()} Intelligence Report`}
              columns={getColumns()}
            />
            <button
              onClick={() => fetchReportData(activeTab)}
              className="btn-secondary"
              style={{ padding: '7px 12px', fontSize: '0.80rem' }}
              title="Refresh Records"
            >
              <RefreshCw size={14} />
            </button>
          </div>
        </div>

        {/* Tab Navigation Buttons */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`btn-secondary ${isActive ? 'btn-primary' : ''}`}
                style={{
                  padding: '8px 14px',
                  fontSize: '0.82rem',
                  borderRadius: 'var(--radius-md)',
                  whiteSpace: 'nowrap'
                }}
              >
                <Icon size={14} /> {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {loading && <Loading text="Fetching structured report dataset..." />}
      {error && <ErrorMessage message={error} onRetry={() => fetchReportData(activeTab)} />}

      {!loading && !error && (
        <ReportTable
          columns={getColumns()}
          data={data}
          initialPageSize={15}
          searchPlaceholder={`Search within ${activeTab} records...`}
        />
      )}
    </div>
  );
};

export default Reports;
