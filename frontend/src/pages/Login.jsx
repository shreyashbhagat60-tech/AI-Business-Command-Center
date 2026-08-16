import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  BrainCircuit,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import AuthLayout from '../components/AuthLayout';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/dashboard';
  const registeredNotice = location.state?.registered;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please verify your email and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
  };

  return (
    <AuthLayout>
      <div className="auth-card-inner animate-fade-in">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(135deg, #0284c7, #6366f1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 4px 18px rgba(2, 132, 199, 0.35)'
          }}>
            <BrainCircuit size={28} color="#ffffff" />
          </div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>
            Welcome Back
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            Sign in to access your Enterprise AI Command Center
          </p>
        </div>

        {/* Success registration banner if redirected from Register */}
        {registeredNotice && (
          <div className="alert alert-success" style={{ marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldCheck size={18} color="#10b981" />
            <span style={{ fontSize: '0.86rem' }}>Account created successfully. Please log in below.</span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="alert alert-danger" style={{ marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertCircle size={18} />
            <span style={{ fontSize: '0.86rem' }}>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '18px' }}>
            <label className="form-label">Corporate Email</label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                className="form-input"
                placeholder="admin@commandcenter.ai"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label className="form-label">Password</label>
            <div className="input-with-icon" style={{ position: 'relative' }}>
              <Lock size={18} className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Remember me & Forgot password */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '22px',
            fontSize: '0.84rem'
          }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--text-secondary)' }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ accentColor: 'var(--accent-blue)', cursor: 'pointer' }}
              />
              Remember me
            </label>

            <Link
              to="/forgot-password"
              style={{ color: 'var(--accent-blue)', textDecoration: 'none', fontWeight: '500' }}
            >
              Forgot Password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', padding: '12px', fontSize: '0.96rem', marginBottom: '20px' }}
            disabled={loading}
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In to Command Center</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Demo Fast-Fill Shortcuts */}
        <div style={{
          background: 'rgba(2, 132, 199, 0.06)',
          border: '1px solid rgba(2, 132, 199, 0.18)',
          borderRadius: 'var(--radius-md)',
          padding: '14px',
          marginBottom: '20px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.78rem',
            fontWeight: '700',
            color: 'var(--accent-blue)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '10px'
          }}>
            <Sparkles size={14} />
            <span>Instant Evaluation Accounts (1-Click)</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button
              type="button"
              onClick={() => handleFillDemo('admin@commandcenter.ai', 'AdminPassword123!')}
              className="btn-secondary"
              style={{ padding: '8px 10px', fontSize: '0.78rem', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '2px' }}
            >
              <strong style={{ color: 'var(--text-primary)' }}>👑 Executive CEO</strong>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>admin@commandcenter.ai</span>
            </button>

            <button
              type="button"
              onClick={() => handleFillDemo('demo@company.com', 'Demo1234!')}
              className="btn-secondary"
              style={{ padding: '8px 10px', fontSize: '0.78rem', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '2px' }}
            >
              <strong style={{ color: 'var(--text-primary)' }}>🔬 AI Scientist</strong>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>demo@company.com</span>
            </button>
          </div>
        </div>

        {/* Register Link */}
        <div style={{ textAlign: 'center', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
          Don't have an account?{' '}
          <Link
            to="/register"
            style={{ color: 'var(--accent-blue)', fontWeight: '700', textDecoration: 'none' }}
          >
            Create Account
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login;
