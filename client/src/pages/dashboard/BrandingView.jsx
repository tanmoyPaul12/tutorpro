import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Palette, Globe, Sparkles, CheckCircle2, Save, Layout, Megaphone } from 'lucide-react';

export default function BrandingView() {
  const { token, user } = useAuth();
  const [branding, setBranding] = useState({
    logoUrl: '',
    tagline: 'Empowering Next-Gen Scholars through Conceptual Mastery',
    primaryColor: '#4f46e5',
    customDomain: 'apexacademy.tutorpro.in',
    announcement: 'Registrations open for Class 10 Board Revision & Test Series!'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetch('/api/institute/settings', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data) setBranding(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [token]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/institute/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(branding)
      });
      if (!res.ok) throw new Error('Failed to save branding settings');
      setSuccessMsg('Academy branding and custom domain updated successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Custom Academy Branding & White-Labeling</h2>
          <span className="badge" style={{ background: '#E1F5EE', color: '#0F6E56', fontWeight: 700, fontSize: '0.72rem' }}>
            Institute Plan Exclusive
          </span>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '4px' }}>
          Personalize your institute portal, custom subdomain, student portal announcement banners, and brand aesthetics.
        </p>
      </div>

      {successMsg && (
        <div style={{
          padding: '14px 20px',
          borderRadius: '12px',
          background: 'var(--success-light)',
          color: 'var(--success)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.875rem',
          fontWeight: 600,
          border: '1px solid rgba(16, 185, 129, 0.3)'
        }}>
          <CheckCircle2 size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '24px',
        alignItems: 'flex-start'
      }}>
        {/* Settings Form */}
        <div className="card" style={{ padding: '26px' }}>
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div className="form-group">
              <label className="form-label">Academy Official Tagline</label>
              <input
                type="text"
                className="form-input"
                value={branding.tagline}
                onChange={(e) => setBranding({ ...branding, tagline: e.target.value })}
                placeholder="e.g. Conceptual Excellence & Board Mastery"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Custom Subdomain / Web Address</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Globe size={18} color="var(--primary)" />
                <input
                  type="text"
                  className="form-input"
                  value={branding.customDomain}
                  onChange={(e) => setBranding({ ...branding, customDomain: e.target.value })}
                  placeholder="e.g. apex.tutorpro.in"
                />
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                Included in Institute Plan: Free SSL certificate and custom domain mapping.
              </span>
            </div>

            <div className="form-group">
              <label className="form-label">Primary Brand Theme Color</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <input
                  type="color"
                  value={branding.primaryColor || '#4f46e5'}
                  onChange={(e) => setBranding({ ...branding, primaryColor: e.target.value })}
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle)',
                    cursor: 'pointer'
                  }}
                />
                <input
                  type="text"
                  className="form-input"
                  style={{ width: '120px' }}
                  value={branding.primaryColor || '#4f46e5'}
                  onChange={(e) => setBranding({ ...branding, primaryColor: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Active Student Portal Notice / Announcement</label>
              <textarea
                className="form-input"
                rows="3"
                value={branding.announcement}
                onChange={(e) => setBranding({ ...branding, announcement: e.target.value })}
                placeholder="Broadcast a note to all parents and students in their portal view..."
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary"
              style={{ marginTop: '8px', padding: '12px' }}
            >
              <Save size={16} />
              <span>{saving ? 'Saving Changes...' : 'Save Branding Configuration'}</span>
            </button>
          </form>
        </div>

        {/* Live Preview Card */}
        <div className="card" style={{ padding: '26px', background: 'var(--bg-app)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Layout size={18} color="var(--primary)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Live White-Label Preview</h3>
          </div>

          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '18px' }}>
            This is how your academy's branded banner appears to enrolled parents and visiting students.
          </p>

          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-md)'
          }}>
            {/* Mock Header */}
            <div style={{
              background: `linear-gradient(135deg, ${branding.primaryColor || '#4f46e5'}, #06b6d4)`,
              color: '#ffffff',
              padding: '20px 24px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1.5rem' }}>🎓</span>
                  <div>
                    <h4 style={{ fontSize: '1.15rem', fontWeight: 800 }}>
                      {user?.academyName || "Apex Academy"}
                    </h4>
                    <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>
                      {branding.tagline}
                    </div>
                  </div>
                </div>
                <span className="badge" style={{ background: 'rgba(255,255,255,0.25)', color: '#ffffff', fontSize: '0.7rem' }}>
                  {branding.customDomain}
                </span>
              </div>
            </div>

            {/* Announcement Banner */}
            {branding.announcement && (
              <div style={{
                background: 'rgba(245, 158, 11, 0.1)',
                borderBottom: '1px solid rgba(245, 158, 11, 0.25)',
                padding: '10px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.78rem',
                color: '#d97706',
                fontWeight: 600
              }}>
                <Megaphone size={14} />
                <span>{branding.announcement}</span>
              </div>
            )}

            <div style={{ padding: '20px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>Official Web Address:</span>
                <strong style={{ color: 'var(--text-primary)' }}>https://{branding.customDomain}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Branding Mode:</span>
                <span className="badge badge-success" style={{ fontSize: '0.68rem' }}>100% White-Labeled</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
