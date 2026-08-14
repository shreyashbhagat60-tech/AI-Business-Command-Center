import React, { useState } from 'react';
import {
  TrendingUp,
  Sparkles,
  DollarSign,
  Package,
  Percent,
  Truck,
  RotateCcw,
  Sliders,
  Play
} from 'lucide-react';
import apiService from '../services/api';
import PredictionCard from '../components/PredictionCard';
import { Loading, ErrorMessage } from '../components/Loading';

const CATEGORIES = ["Electronics", "Furniture", "Clothing", "Grocery", "Home & Kitchen", "Fitness"];
const REGIONS = ["North", "South", "East", "West"];

export const SalesPrediction = () => {
  const [formData, setFormData] = useState({
    age: 32,
    category: 'Electronics',
    quantity: 3,
    unit_price: 650.0,
    discount: 10.0,
    cost: 380.0,
    marketing_spend: 3000.0,
    customer_satisfaction: 4.5,
    region: 'West',
    delivery_time: 3,
    inventory: 150,
    returned: 0
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handlePredict = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await apiService.predictSales(formData);
      setResult(res);
    } catch (err) {
      console.error('Prediction failed:', err);
      setError(err.message || 'Unable to generate sales prediction.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content-area animate-fade-in">
      <div className="prediction-layout">
        {/* Left Side: Input Configuration Form */}
        <div className="glass-panel" style={{ padding: '26px', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(56, 189, 248, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-blue)'
            }}>
              <Sliders size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                Transaction & Market Inputs
              </h3>
              <p style={{ fontSize: '0.80rem', color: 'var(--text-muted)' }}>
                Configure order parameters for RandomForest regression model
              </p>
            </div>
          </div>

          <form onSubmit={handlePredict}>
            <div className="form-section-grid" style={{ marginBottom: '18px' }}>
              <div className="form-group">
                <label className="form-label">Product Category</label>
                <select name="category" value={formData.category} onChange={handleChange} className="input-field">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Sales Region</label>
                <select name="region" value={formData.region} onChange={handleChange} className="input-field">
                  {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Unit Price (₹)</label>
                <input type="number" name="unit_price" value={formData.unit_price} onChange={handleChange} className="input-field" min="1" step="0.5" required />
              </div>

              <div className="form-group">
                <label className="form-label">Order Quantity</label>
                <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} className="input-field" min="1" max="100" required />
              </div>

              <div className="form-group">
                <label className="form-label">Discount Rate (%)</label>
                <input type="number" name="discount" value={formData.discount} onChange={handleChange} className="input-field" min="0" max="90" step="1" required />
              </div>

              <div className="form-group">
                <label className="form-label">Unit Base Cost (₹)</label>
                <input type="number" name="cost" value={formData.cost} onChange={handleChange} className="input-field" min="0" step="0.5" required />
              </div>

              <div className="form-group">
                <label className="form-label">Marketing Spend (₹)</label>
                <input type="number" name="marketing_spend" value={formData.marketing_spend} onChange={handleChange} className="input-field" min="0" step="100" />
              </div>

              <div className="form-group">
                <label className="form-label">Customer Satisfaction (1-5)</label>
                <input type="number" name="customer_satisfaction" value={formData.customer_satisfaction} onChange={handleChange} className="input-field" min="1.0" max="5.0" step="0.1" required />
              </div>

              <div className="form-group">
                <label className="form-label">Customer Age</label>
                <input type="number" name="age" value={formData.age} onChange={handleChange} className="input-field" min="18" max="90" />
              </div>

              <div className="form-group">
                <label className="form-label">Delivery SLA (Days)</label>
                <input type="number" name="delivery_time" value={formData.delivery_time} onChange={handleChange} className="input-field" min="1" max="30" />
              </div>

              <div className="form-group">
                <label className="form-label">Inventory Level</label>
                <input type="number" name="inventory" value={formData.inventory} onChange={handleChange} className="input-field" min="0" />
              </div>

              <div className="form-group">
                <label className="form-label">Return History (0 or 1)</label>
                <select name="returned" value={formData.returned} onChange={handleChange} className="input-field">
                  <option value={0}>0 (No Returns)</option>
                  <option value={1}>1 (Returned/Damaged)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ width: '100%', padding: '12px' }}
            >
              {loading ? (
                <span>Predicting with AI Model...</span>
              ) : (
                <>
                  <Sparkles size={16} /> Run Sales ML Prediction
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Side: Prediction Result Hero or Empty State */}
        <div>
          {loading && <Loading text="Preprocessing features and executing RandomForestRegressor..." />}
          {error && <ErrorMessage message={error} onRetry={handlePredict} />}

          {!loading && !error && result && (
            <PredictionCard
              title="Predicted Sales Revenue"
              value={result.predicted_sales}
              currency="₹"
              confidence={result.confidence_score}
              modelStatus={result.model_status}
              isDemo={result.is_demo}
              recommendation={result.business_recommendation}
              interpretation={`Based on ${formData.quantity} units of ${formData.category} in the ${formData.region} region with a ${formData.discount}% promotional discount, the RandomForest model forecasts ₹${result.predicted_sales.toLocaleString()} in realized revenue.`}
              featureImpacts={result.feature_impacts}
              inputs={formData}
            />
          )}

          {!loading && !error && !result && (
            <div className="glass-panel" style={{ padding: '48px 32px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <TrendingUp size={48} style={{ margin: '0 auto 16px', color: 'var(--accent-blue)', opacity: 0.6 }} />
              <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '6px' }}>
                Awaiting Model Execution
              </h4>
              <p style={{ fontSize: '0.84rem', maxWidth: '380px', margin: '0 auto 20px', lineHeight: '1.45' }}>
                Fill out the business features on the left and click "Run Sales ML Prediction" to generate an instant revenue forecast.
              </p>
              <button onClick={handlePredict} className="btn-secondary">
                <Play size={14} /> Quick Demo Run
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalesPrediction;
