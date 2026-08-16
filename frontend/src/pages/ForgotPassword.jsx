import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle, Sparkles, KeyRound } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';
import apiService from '../services/api';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState('');
  const [demoNote, setDemoNote] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await apiService.forgotPassword({ email });
      setSubmitted(true);
      setMessage(res.message || 'Password recovery instructions have been sent.');
      setDemoNote(res.demo_note || '');
    } catch (err) {
      setError(err.message || 'Failed to process password recovery.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="auth-card-inner animate-fade-in">
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
            <KeyRound size={26} color="#ffffff" />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>
            Reset Your Password
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            Enter your corporate email address to receive secure reset credentials.
          </p>
        </div>

        {error && (
          <div className="alert alert-danger" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertCircle size={18} />
            <span style={{ fontSize: '0.86rem' }}>{error}</span>
          </div>
        )}

        {submitted ? (
          <div className="animate-fade-in" style={{ textAlign: 'center', padding: '12px 0' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              color: '#10b981'
            }}>
              <CheckCircle2 size={32} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' }}>
              Request Received
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: '1.5' }}>
              {message}
            </p>

            {demoNote && (
              <div style={{
                background: 'rgba(2, 132, 199, 0.1)',
                border: '1px solid rgba(2, 132, 199, 0.25)',
                borderRadius: 'var(--radius-md)',
                padding: '14px',
                marginBottom: '20px',
                textAlign: 'left',
                fontSize: '0.82rem',
                color: 'var(--text-secondary)'
              }}>
                <strong style={{ color: 'var(--accent-blue)', display: 'block', marginBottom: '4px' }}>
                  <Sparkles size={14} style={{ display: 'inline', marginRight: '4px' }} />
                  Demo Mode Tip:
                </strong>
                {demoNote}
              </div>
            )}

            <Link to="/login" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '100%', gap: '8px', textDecoration: 'none' }}>
              <ArrowLeft size={16} />
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group" style={{ marginBottom: '22px' }}>
              <label className="form-label">Email Address</label>
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

            <button
              type="submit"
              className="btn-primary"
              style={{ width: '100%', marginBottom: '18px' }}
              disabled={loading}
            >
              {loading ? (
                <span>Generating recovery link...</span>
              ) : (
                <>
                  <span>Send Recovery Instructions</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            <div style={{ textAlign: 'center' }}>
              <Link to="/login" style={{ fontSize: '0.86rem', color: 'var(--accent-blue)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: '600' }}>
                <ArrowLeft size={14} />
                Back to Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;
