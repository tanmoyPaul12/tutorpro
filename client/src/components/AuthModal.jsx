import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Sparkles, Mail, Lock, User, Phone, CheckCircle2 } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, initialMode = 'login', onSuccess }) {
  const [mode, setMode] = useState(initialMode);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    userType: 'INDIVIDUAL_TUTOR',
    academyName: ''
  });
  const [error, setError] = useState('');
  const { login, register, switchDemoPersona, loading } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (mode === 'login') {
        await login(formData.email, formData.password);
      } else {
        await register(formData);
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication failed');
    }
  };

  const handleQuickDemo = async (persona) => {
    try {
      await switchDemoPersona(persona);
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message || 'Demo switcher failed');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '460px' }}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.25rem' }}>🎓</span>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
              {mode === 'login' ? 'Welcome back to TutorPro' : 'Create your TutorPro account'}
            </h3>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Quick Demo Shortcuts for College Viva */}
          <div style={{
            background: 'var(--primary-light)',
            border: '1px solid var(--primary-border)',
            borderRadius: '12px',
            padding: '12px 14px',
            marginBottom: '18px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '8px' }}>
              <Sparkles size={14} />
              <span>COLLEGE DEMO 1-CLICK INSTANT LOGIN</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button
                type="button"
                onClick={() => handleQuickDemo('tutor')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.75rem', padding: '6px', justifyContent: 'center' }}
              >
                👨‍🏫 Tanmoy (Tutor)
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('parent')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.75rem', padding: '6px', justifyContent: 'center' }}
              >
                👨‍👩‍👦 Amit Das (Parent)
              </button>
            </div>
          </div>

          {error && (
            <div style={{
              background: 'var(--danger-light)',
              color: 'var(--danger)',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              marginBottom: '16px'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {mode === 'register' && (
              <>
                {/* User Type Choice */}
                <div style={{ marginBottom: '14px' }}>
                  <label className="form-label">I am a...</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '6px' }}>
                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px',
                      borderRadius: '8px',
                      border: formData.userType === 'INDIVIDUAL_TUTOR' ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                      background: formData.userType === 'INDIVIDUAL_TUTOR' ? 'var(--primary-light)' : 'transparent',
                      cursor: 'pointer',
                      fontSize: '0.82rem',
                      fontWeight: 600
                    }}>
                      <input
                        type="radio"
                        name="userType"
                        checked={formData.userType === 'INDIVIDUAL_TUTOR'}
                        onChange={() => setFormData({ ...formData, userType: 'INDIVIDUAL_TUTOR' })}
                      />
                      <span>Individual Tutor</span>
                    </label>

                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px',
                      borderRadius: '8px',
                      border: formData.userType === 'COACHING_CENTRE' ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                      background: formData.userType === 'COACHING_CENTRE' ? 'var(--primary-light)' : 'transparent',
                      cursor: 'pointer',
                      fontSize: '0.82rem',
                      fontWeight: 600
                    }}>
                      <input
                        type="radio"
                        name="userType"
                        checked={formData.userType === 'COACHING_CENTRE'}
                        onChange={() => setFormData({ ...formData, userType: 'COACHING_CENTRE' })}
                      />
                      <span>Coaching Centre</span>
                    </label>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tanmoy Paul"
                    className="form-input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="e.g. 9876543210"
                    className="form-input"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </>
            )}

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                required
                placeholder="you@tutorpro.com"
                className="form-input"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                className="form-input"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '8px', padding: '12px' }}
            >
              {loading ? 'Please wait...' : mode === 'login' ? 'Login to TutorPro' : 'Create Account'}
            </button>
          </form>

          {/* Switch Mode */}
          <div style={{ textAlign: 'center', marginTop: '18px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {mode === 'login' ? (
              <span>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  style={{ color: 'var(--primary)', fontWeight: 700 }}
                >
                  Create account
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  style={{ color: 'var(--primary)', fontWeight: 700 }}
                >
                  Login
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
