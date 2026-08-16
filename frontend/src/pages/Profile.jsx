import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Building,
  Briefcase,
  Calendar,
  ShieldCheck,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Save,
  Clock,
  Sparkles,
  Lock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';
import { Loading } from '../components/Loading';

export const Profile = () => {
  const { user, login } = useAuth();

  const [formData, setFormData] = useState({
    full_name: '',
    company_name: '',
    role: '',
    new_password: '',
    confirm_password: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        full_name: user.full_name || '',
        company_name: user.company_name || '',
        role: user.role || 'Executive User',
        new_password: '',
        confirm_password: ''
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.new_password && formData.new_password.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }

    if (formData.new_password && formData.new_password !== formData.confirm_password) {
      setError('Password confirmation does not match.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        full_name: formData.full_name,
        company_name: formData.company_name,
        role: formData.role,
        ...(formData.new_password ? { new_password: formData.new_password } : {})
      };

      const updated = await apiService.updateProfile(payload);
      setSuccess('Profile updated successfully.');
      setFormData(prev => ({ ...prev, new_password: '', confirm_password: '' }));
      // Update local stored user
      localStorage.setItem('ai_bcc_user', JSON.stringify(updated));
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const createdFormatted = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'Active Since 2026';

  return (
    <div className="content-area animate-fade-in">
      {/* Header Banner */}
      <div className="glass-panel" style={{
        padding: '24px 28px',
        marginBottom: '24px',
        background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.12), rgba(99, 102, 241, 0.12))',
        border: '1px solid rgba(2, 132, 199, 0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #0284c7, #6366f1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.4rem',
            fontWeight: '800',
            color: '#ffffff',
            boxShadow: '0 4px 18px rgba(2, 132, 199, 0.35)'
          }}>
            {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>
              {user?.full_name || 'Enterprise Executive'}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.86rem', color: 'var(--accent-blue)', fontWeight: '600' }}>
                {user?.role || 'Executive User'}
              </span>
              <span style={{ color: 'var(--text-muted)' }}>•</span>
              <span style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
                {user?.company_name || 'Global Enterprise'}
              </span>
              <span className="badge badge-emerald" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <ShieldCheck size={12} /> Active Enterprise Account
              </span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
        {/* Left Column: Account Details & Status */}
        <div className="glass-panel" style={{ padding: '24px', height: 'fit-content' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '18px' }}>
            Account Overview
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-app)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-blue)' }}>
                <Mail size={18} />
              </div>
              <div>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</span>
                <p style={{ fontSize: '0.88rem', fontWeight: '600', color: 'var(--text-primary)' }}>{user?.email || 'N/A'}</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-app)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-indigo)' }}>
                <Building size={18} />
              </div>
              <div>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Organization</span>
                <p style={{ fontSize: '0.88rem', fontWeight: '600', color: 'var(--text-primary)' }}>{user?.company_name || 'Enterprise'}</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-app)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-emerald)' }}>
                <Calendar size={18} />
              </div>
              <div>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Member Since</span>
                <p style={{ fontSize: '0.88rem', fontWeight: '600', color: 'var(--text-primary)' }}>{createdFormatted}</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-app)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                <ShieldCheck size={18} />
              </div>
              <div>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Security Tier</span>
                <p style={{ fontSize: '0.88rem', fontWeight: '600', color: '#10b981' }}>JWT Authenticated / Active</p>
              </div>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '20px 0' }} />

          <div style={{ background: 'var(--bg-app)', padding: '14px', borderRadius: 'var(--radius-md)', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>
              <Sparkles size={14} style={{ display: 'inline', marginRight: '4px', color: 'var(--accent-blue)' }} />
              Role Permissions:
            </strong>
            Full access to ML predictions, financial forecasts, churn mitigation models, and executive exports.
          </div>
        </div>

        {/* Right Column: Edit Profile Form */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '6px' }}>
            Edit Profile & Credentials
          </h3>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
            Update your executive information and security settings.
          </p>

          {success && (
            <div className="alert alert-success" style={{ marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle2 size={18} color="#10b981" />
              <span style={{ fontSize: '0.86rem' }}>{success}</span>
            </div>
          )}

          {error && (
            <div className="alert alert-danger" style={{ marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <AlertCircle size={18} />
              <span style={{ fontSize: '0.86rem' }}>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Full Name</label>
                <div className="input-with-icon">
                  <User size={16} className="input-icon" />
                  <input
                    type="text"
                    name="full_name"
                    className="form-input"
                    value={formData.full_name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Organization Name</label>
                <div className="input-with-icon">
                  <Building size={16} className="input-icon" />
                  <input
                    type="text"
                    name="company_name"
                    className="form-input"
                    value={formData.company_name}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label">Executive Role / Designation</label>
              <div className="input-with-icon">
                <Briefcase size={16} className="input-icon" />
                <input
                  type="text"
                  name="role"
                  className="form-input"
                  value={formData.role}
                  onChange={handleChange}
                  placeholder="e.g. Chief Executive Officer"
                />
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '22px 0' }} />

            <h4 style={{ fontSize: '0.94rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <KeyRound size={16} color="var(--accent-blue)" /> Change Password (Optional)
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '22px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">New Password</label>
                <div className="input-with-icon">
                  <Lock size={16} className="input-icon" />
                  <input
                    type="password"
                    name="new_password"
                    className="form-input"
                    placeholder="Min 6 characters"
                    value={formData.new_password}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Confirm New Password</label>
                <div className="input-with-icon">
                  <Lock size={16} className="input-icon" />
                  <input
                    type="password"
                    name="confirm_password"
                    className="form-input"
                    placeholder="Repeat new password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              {loading ? (
                <span>Saving updates...</span>
              ) : (
                <>
                  <Save size={16} />
                  <span>Save Profile Changes</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
