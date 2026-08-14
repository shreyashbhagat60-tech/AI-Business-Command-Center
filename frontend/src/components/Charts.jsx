import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useTheme } from '../context/ThemeContext';

const SEGMENT_COLORS = {
  'High Value Customer': '#38bdf8',
  'Loyal Customer': '#10b981',
  'Regular Customer': '#6366f1',
  'At-Risk Customer': '#f59e0b',
  'Low Value Customer': '#94a3b8'
};

const CHURN_COLORS = {
  'Active Customers': '#10b981',
  'At Risk': '#f59e0b',
  'Churned': '#f43f5e'
};

const CATEGORY_COLORS = ['#38bdf8', '#818cf8', '#34d399', '#f472b6', '#fbbf24', '#a78bfa'];

// Custom Tooltip with Theme Awareness
export const CustomTooltip = ({ active, payload, label, prefix = '₹' }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-md)',
        padding: '10px 14px',
        boxShadow: 'var(--shadow-md)',
        fontSize: '0.82rem',
        zIndex: 50
      }}>
        <p style={{ fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
          {label}
        </p>
        {payload.map((entry, index) => (
          <div key={`item-${index}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '3px 0' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: entry.color }} />
            <span style={{ color: 'var(--text-secondary)' }}>{entry.name}:</span>
            <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
              {typeof entry.value === 'number'
                ? `${prefix}${entry.value.toLocaleString()}`
                : entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// 1. Sales Trend Line Chart
export const SalesTrendChart = ({ data = [], height = 300 }) => {
  const { theme } = useTheme();
  const strokeGrid = theme === 'dark' ? 'rgba(255, 255, 255, 0.06)' : '#e2e8f0';

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={strokeGrid} vertical={false} />
        <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} tickLine={false} />
        <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
        <Tooltip content={<CustomTooltip />} />
        <Area type="monotone" dataKey="sales" name="Sales Revenue" stroke="#38bdf8" strokeWidth={2.5} fillOpacity={1} fill="url(#salesGrad)" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

// 2. Profit Trend Area Chart
export const ProfitTrendChart = ({ data = [], height = 300 }) => {
  const { theme } = useTheme();
  const strokeGrid = theme === 'dark' ? 'rgba(255, 255, 255, 0.06)' : '#e2e8f0';

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.45} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={strokeGrid} vertical={false} />
        <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} tickLine={false} />
        <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
        <Tooltip content={<CustomTooltip />} />
        <Area type="monotone" dataKey="profit" name="Net Profit" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#profitGrad)" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

// 3. Revenue vs Profit Comparison Chart
export const RevenueVsProfitChart = ({ data = [], height = 300 }) => {
  const { theme } = useTheme();
  const strokeGrid = theme === 'dark' ? 'rgba(255, 255, 255, 0.06)' : '#e2e8f0';

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={strokeGrid} vertical={false} />
        <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} tickLine={false} />
        <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: '0.80rem', paddingTop: '10px' }} />
        <Bar dataKey="sales" name="Revenue" fill="#38bdf8" radius={[4, 4, 0, 0]} />
        <Bar dataKey="profit" name="Profit" fill="#10b981" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

// 4. Regional Performance Bar Chart
export const RegionalBarChart = ({ data = [], height = 280 }) => {
  const { theme } = useTheme();
  const strokeGrid = theme === 'dark' ? 'rgba(255, 255, 255, 0.06)' : '#e2e8f0';

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={strokeGrid} vertical={false} />
        <XAxis dataKey="region" stroke="var(--text-muted)" fontSize={12} tickLine={false} />
        <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="sales" name="Regional Sales" fill="#6366f1" radius={[4, 4, 0, 0]}>
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

// 5. Category Performance Chart
export const CategoryBarChart = ({ data = [], height = 280 }) => {
  const { theme } = useTheme();
  const strokeGrid = theme === 'dark' ? 'rgba(255, 255, 255, 0.06)' : '#e2e8f0';

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout="vertical" margin={{ top: 10, right: 20, left: 30, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={strokeGrid} horizontal={false} />
        <XAxis type="number" stroke="var(--text-muted)" fontSize={12} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
        <YAxis type="category" dataKey="category" stroke="var(--text-muted)" fontSize={12} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="sales" name="Category Sales" fill="#38bdf8" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

// 6. Customer Segmentation Donut Chart
export const CustomerSegmentationDonut = ({ data = [], height = 280 }) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          dataKey="count"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={85}
          paddingAngle={3}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={SEGMENT_COLORS[entry.name] || CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
            />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, name, props) => [`${value} Customers (${props.payload.percentage}%)`, name]}
          contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', borderRadius: '8px' }}
        />
        <Legend wrapperStyle={{ fontSize: '0.75rem', paddingTop: '10px' }} />
      </PieChart>
    </ResponsiveContainer>
  );
};

// 7. Customer Churn Donut Chart
export const CustomerChurnDonut = ({ data = [], height = 280 }) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          dataKey="count"
          nameKey="status"
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={85}
          paddingAngle={3}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={CHURN_COLORS[entry.status] || '#94a3b8'}
            />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, name, props) => [`${value} Accounts (${props.payload.percentage}%)`, name]}
          contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', borderRadius: '8px' }}
        />
        <Legend wrapperStyle={{ fontSize: '0.75rem', paddingTop: '10px' }} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default {
  SalesTrendChart,
  ProfitTrendChart,
  RevenueVsProfitChart,
  RegionalBarChart,
  CategoryBarChart,
  CustomerSegmentationDonut,
  CustomerChurnDonut
};
