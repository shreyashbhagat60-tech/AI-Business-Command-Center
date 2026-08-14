import React, { useState, useEffect } from 'react';
import {
  Filter,
  BarChart3,
  DollarSign,
  TrendingUp,
  Package,
  Star,
  Target,
  RefreshCw,
  Search
} from 'lucide-react';
import apiService from '../services/api';
import KPICard from '../components/KPICard';
import { Loading, ErrorMessage } from '../components/Loading';

const CATEGORIES = ["All", "Electronics", "Furniture", "Clothing", "Grocery", "Home & Kitchen", "Fitness"];
const REGIONS = ["All", "North", "South", "East", "West"];
const SEGMENTS = ["All", "High Value Customer", "Loyal Customer", "Regular Customer", "At-Risk Customer", "Low Value Customer"];

export const Analytics = () => {
  const [filters, setFilters] = useState({
    region: 'All',
    category: 'All',
    segment: 'All',
    start_date: '',
    end_date: ''
  });

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiService.filterAnalytics(filters);
      setData(res);
    } catch (err) {
      console.error('Analytics fetch error:', err);
      setError(err.message || 'Failed to fetch analytics data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [filters.region, filters.category, filters.segment]);

  const handleResetFilters = () => {
    setFilters({
      region: 'All',
      category: 'All',
      segment: 'All',
      start_date: '',
      end_date: ''
    });
  };

  return (
    <div className="content-area animate-fade-in">
      {/* Header Filter Panel */}
      <div className="glass-panel" style={{ padding: '22px 24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={18} color="var(--accent-blue)" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              Multidimensional Business Filters
            </h3>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={handleResetFilters} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.80rem' }}>
              Reset Filters
            </button>
            <button onClick={fetchAnalytics} className="btn-primary" style={{ padding: '6px 14px', fontSize: '0.80rem' }}>
              <RefreshCw size={13} /> Apply Slices
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
          <div className="form-group">
            <label className="form-label">Sales Region</label>
            <select
              className="input-field"
              value={filters.region}
              onChange={e => setFilters(f => ({ ...f, region: e.target.value }))}
            >
              {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Product Category</label>
            <select
              className="input-field"
              value={filters.category}
              onChange={e => setFilters(f => ({ ...f, category: e.target.value }))}
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Customer Segment</label>
            <select
              className="input-field"
              value={filters.segment}
              onChange={e => setFilters(f => ({ ...f, segment: e.target.value }))}
            >
              {SEGMENTS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Start Date</label>
            <input
              type="date"
              className="input-field"
              value={filters.start_date}
              onChange={e => setFilters(f => ({ ...f, start_date: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label className="form-label">End Date</label>
            <input
              type="date"
              className="input-field"
              value={filters.end_date}
              onChange={e => setFilters(f => ({ ...f, end_date: e.target.value }))}
            />
          </div>
        </div>
      </div>

      {loading && <Loading text="Aggregating filtered business dimensions..." />}
      {error && <ErrorMessage message={error} onRetry={fetchAnalytics} />}

      {!loading && !error && data && (
        <>
          {/* Filtered Metrics Summary */}
          <div className="kpi-grid">
            <KPICard
              title="Filtered Revenue"
              value={`₹${(data.total_revenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              icon={DollarSign}
              iconBg="rgba(56, 189, 248, 0.15)"
              iconColor="#38bdf8"
              subtext={`${data.filtered_records_count || 0} matching orders`}
            />
            <KPICard
              title="Filtered Profit"
              value={`₹${(data.total_profit || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              icon={TrendingUp}
              iconBg="rgba(16, 185, 129, 0.15)"
              iconColor="#10b981"
              subtext="Net realization"
            />
            <KPICard
              title="Segment Profit Margin"
              value={`${(data.profit_margin || 0).toFixed(1)}%`}
              isPositive={data.profit_margin >= 20}
              icon={Target}
              iconBg="rgba(245, 158, 11, 0.15)"
              iconColor="#f59e0b"
              subtext="Operating margin"
            />
            <KPICard
              title="Units Moved"
              value={(data.total_quantity || 0).toLocaleString()}
              icon={Package}
              iconBg="rgba(99, 102, 241, 0.15)"
              iconColor="#6366f1"
              subtext="Physical volume"
            />
            <KPICard
              title="Avg Satisfaction"
              value={`${(data.avg_satisfaction || 0).toFixed(1)} / 5.0`}
              isPositive={data.avg_satisfaction >= 4.0}
              icon={Star}
              iconBg="rgba(244, 114, 182, 0.15)"
              iconColor="#f472b6"
              subtext="Customer sentiment"
            />
            <KPICard
              title="Marketing ROI"
              value={`${(data.marketing_roi || 0).toFixed(2)}x`}
              isPositive={data.marketing_roi >= 3.0}
              icon={BarChart3}
              iconBg="rgba(6, 182, 212, 0.15)"
              iconColor="#06b6d4"
              subtext="Revenue per ad spend"
            />
          </div>

          {/* Sample Sliced Transactions Table */}
          <div className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                  Filtered Data Sample Preview
                </h4>
                <p style={{ fontSize: '0.80rem', color: 'var(--text-muted)' }}>
                  Showing top records matching the active regional and category slices
                </p>
              </div>
              <span className="badge badge-blue">{data.raw_preview?.length || 0} Sample Rows</span>
            </div>

            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Tx ID</th>
                    <th>Date</th>
                    <th>Category</th>
                    <th>Region</th>
                    <th>Qty</th>
                    <th>Unit Price</th>
                    <th>Discount</th>
                    <th>Sales</th>
                    <th>Profit</th>
                    <th>Segment</th>
                  </tr>
                </thead>
                <tbody>
                  {(!data.raw_preview || data.raw_preview.length === 0) ? (
                    <tr>
                      <td colSpan={10} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                        No records match the selected filter criteria.
                      </td>
                    </tr>
                  ) : (
                    data.raw_preview.map((row, idx) => (
                      <tr key={row.transaction_id || idx}>
                        <td style={{ fontWeight: '600', color: 'var(--accent-blue)' }}>{row.transaction_id}</td>
                        <td>{row.date}</td>
                        <td><span className="badge badge-blue">{row.category}</span></td>
                        <td>{row.region}</td>
                        <td>{row.quantity}</td>
                        <td>₹{row.unit_price}</td>
                        <td>{row.discount}%</td>
                        <td style={{ fontWeight: '600' }}>₹{row.sales}</td>
                        <td style={{ color: row.profit >= 0 ? 'var(--accent-emerald)' : 'var(--accent-rose)', fontWeight: '600' }}>
                          ₹{row.profit}
                        </td>
                        <td><span className="badge badge-emerald">{row.segment}</span></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Analytics;
