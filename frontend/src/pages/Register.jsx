import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BrainCircuit,
  Lock,
  Mail,
  User,
  Building,
  Briefcase,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import AuthLayout from '../components/AuthLayout';
import { useAuth } from '../context/AuthContext';

const ROLES = [
  "Chief Executive Officer",
  "Chief Operating Officer",
  "VP of Sales & Growth",
  "Lead Data Scientist / AI Engineer",
  "Head of Marketing Analytics",
  "Financial Controller"
];

export const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirm_password: '',
    company_name: '',
    role: 'Chief Executive Officer',
    accept_terms: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.full_name || !formData.email || !formData.password || !formData.confirm_password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match. Please verify.');
      return;
    }

    if (!formData.accept_terms) {
      setError('Please accept the Terms of Service to continue.');
      return;
    }

    setLoading(true);
    try {
      await register({
        full_name: formData.full_name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        company_name: formData.company_name || 'Enterprise Global Corp'
      });
      // Redirect to login with success indicator
      navigate('/login', { state: { registered: true }, replace: true });
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="auth-card-inner animate-fade-in">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(135deg, #6366f1, #0284c7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px',
            boxShadow: '0 4px 18px rgba(99, 102, 241, 0.35)'
          }}>
            <BrainCircuit size={26} color="#ffffff" />
          </div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>
            Create Executive Account
          </h2>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
            Join the Enterprise AI Business Command Center
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="alert alert-danger" style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={16} />
            <span style={{ fontSize: '0.84rem' }}>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.8rem' }}>Full Name *</label>
              <div className="input-with-icon">
                <User size={16} className="input-icon" />
                <input
                  type="text"
                  name="full_name"
                  className="form-input"
                  placeholder="Alexander Vance"
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.8rem' }}>Company / Org</label>
              <div className="input-with-icon">
                <Building size={16} className="input-icon" />
                <input
                  type="text"
                  name="company_name"
                  className="form-input"
                  placeholder="Apex Retail Corp"
                  value={formData.company_name}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '14px' }}>
            <label className="form-label" style={{ fontSize: '0.8rem' }}>Corporate Email *</label>
            <div className="input-with-icon">
              <Mail size={16} className="input-icon" />
              <input
                type="email"
                name="email"
                className="form-input"
                placeholder="vance@apexretail.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '14px' }}>
            <label className="form-label" style={{ fontSize: '0.8rem' }}>Business Role</label>
            <div className="input-with-icon">
              <Briefcase size={16} className="input-icon" />
              <select
                name="role"
                className="form-select"
                value={formData.role}
                onChange={handleChange}
              >
                {ROLES.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.8rem' }}>Password *</label>
              <div className="input-with-icon" style={{ position: 'relative' }}>
                <Lock size={16} className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className="form-input"
                  placeholder="Min 6 chars"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '2px'
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.8rem' }}>Confirm Password *</label>
              <div className="input-with-icon" style={{ position: 'relative' }}>
                <Lock size={16} className="input-icon" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirm_password"
                  className="form-input"
                  placeholder="Repeat password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '2px'
                  }}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '18px', fontSize: '0.82rem' }}>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', cursor: 'pointer', color: 'var(--text-secondary)' }}>
              <input
                type="checkbox"
                name="accept_terms"
                checked={formData.accept_terms}
                onChange={handleChange}
                style={{ accentColor: 'var(--accent-blue)', marginTop: '2px', cursor: 'pointer' }}
                required
              />
              <span>
                I agree to the Enterprise Terms of Service, Confidentiality Protocol, and AI Analytics Governance policies.
              </span>
            </label>
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', padding: '12px', fontSize: '0.94rem', marginBottom: '16px' }}
            disabled={loading}
          >
            {loading ? (
              <span>Creating Account...</span>
            ) : (
              <>
                <span>Complete Registration</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Login Link */}
        <div style={{ textAlign: 'center', fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
          Already have an enterprise account?{' '}
          <Link
            to="/login"
            style={{ color: 'var(--accent-blue)', fontWeight: '700', textDecoration: 'none' }}
          >
            Sign In
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Register;
