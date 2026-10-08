import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { CreditCard, CheckCircle2, Zap, ArrowRight, ShieldCheck, Sparkles, Lock } from 'lucide-react';

export default function SubscriptionView() {
  const { user, updatePlan } = useAuth();
  const currentPlan = user?.subscriptionPlan || 'STARTER';
  const [successMsg, setSuccessMsg] = useState('');

  const plans = [
    {
      id: 'FREE',
      name: 'Free Tier',
      price: '₹0',
      period: '/month',
      students: 'Up to 15 students',
      status: 'AVAILABLE',
      features: ['Attendance roll-call', 'Student directory', 'Basic dashboard']
    },
    {
      id: 'STARTER',
      name: 'Starter Plan',
      price: '₹199',
      period: '/month',
      popular: true,
      students: 'Up to 75 students',
      status: 'ACTIVE_TIER',
      features: [
        'Everything in Free',
        'Batch & timetable scheduling',
        'Fee tracking & WhatsApp reminders',
        'CSV student data import'
      ]
    },
    {
      id: 'PRO',
      name: 'Pro Plan',
      price: '₹599',
      period: '/month',
      students: 'Up to 300 students',
      status: 'FUTURE_SCOPE',
      badge: 'FUTURE SCOPE (ROADMAP)',
      features: [
        'Everything in Starter',
        'Unit tests & auto class ranks',
        'Parent Portal Simulator',
        'Instant WhatsApp absent alerts',
        'Multiple faculty accounts'
      ]
    },
    {
      id: 'INSTITUTE',
      name: 'Institute Plan',
      price: '₹1,499',
      period: '/month',
      students: 'Up to 1,000 students',
      status: 'FUTURE_SCOPE',
      badge: 'FUTURE SCOPE (ROADMAP)',
      features: [
        'Everything in Pro',
        'Multi-branch management',
        'Custom branded academy app',
        'Priority phone support'
      ]
    }
  ];

  const handleSelectPlan = async (planId) => {
    await updatePlan(planId);
    if (planId === 'PRO') {
      setSuccessMsg('🎉 Pro Tier activated for college demo! "Tests & Results" and "Parent Portal Simulator" are now unlocked in your sidebar menu.');
    } else if (planId === 'STARTER') {
      setSuccessMsg('Switched back to Starter Tier (₹199/mo). Pro modules are now gated.');
    } else {
      setSuccessMsg(`Switched to ${planId} plan.`);
    }
    setTimeout(() => setSuccessMsg(''), 5000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Subscription & Billing Tiers</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          TutorPro SaaS pricing engine. Current implemented plans: <strong>Free</strong> & <strong>Starter</strong>. Pro & Institute tiers represent planned future SaaS expansion.
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

      {/* Plan Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '20px'
      }}>
        {plans.map(p => {
          const isActive = currentPlan === p.id;
          const isFuture = p.status === 'FUTURE_SCOPE';

          return (
            <div
              key={p.id}
              className="card"
              style={{
                padding: '28px 22px',
                display: 'flex',
                flexDirection: 'column',
                border: isActive ? '2px solid var(--primary)' : isFuture ? '1px dashed var(--border-strong)' : '1px solid var(--border-subtle)',
                position: 'relative',
                boxShadow: isActive ? 'var(--shadow-glow)' : 'var(--shadow-sm)',
                opacity: isFuture && !isActive ? 0.92 : 1
              }}
            >
              {p.popular && !isActive && (
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'var(--primary)',
                  color: '#ffffff',
                  padding: '2px 12px',
                  borderRadius: '12px',
                  fontSize: '0.7rem',
                  fontWeight: 800
                }}>
                  CURRENT MOST POPULAR
                </div>
              )}

              {p.badge && (
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: '#EEEDFE',
                  color: '#534AB7',
                  border: '1px solid rgba(83, 74, 183, 0.3)',
                  padding: '2px 10px',
                  borderRadius: '12px',
                  fontSize: '0.65rem',
                  fontWeight: 800
                }}>
                  {p.badge}
                </div>
              )}

              <div style={{ marginBottom: '16px' }}>
                <span className={isActive ? 'badge badge-primary' : 'badge badge-neutral'} style={{ marginBottom: '8px' }}>
                  {p.name}
                </span>
                <div style={{ fontSize: '2rem', fontWeight: 800 }}>
                  {p.price}<span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{p.period}</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px', fontWeight: 600 }}>
                  {p.students}
                </div>
              </div>

              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '26px', flex: 1, fontSize: '0.8125rem' }}>
                {p.features.map((feat, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={15} color="var(--success)" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              {/* Action Button */}
              {isActive ? (
                <div style={{
                  padding: '10px',
                  textAlign: 'center',
                  background: 'var(--primary-light)',
                  color: 'var(--primary)',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.85rem'
                }}>
                  ✓ Current Active Plan
                </div>
              ) : p.id === 'PRO' ? (
                <button
                  onClick={() => handleSelectPlan('PRO')}
                  className="btn btn-secondary"
                  style={{ width: '100%', fontSize: '0.82rem', borderColor: '#534AB7', color: '#534AB7', background: '#EEEDFE' }}
                  title="Test Pro features for presentation"
                >
                  <Sparkles size={14} />
                  <span>⚡ Preview Pro in Demo Mode</span>
                </button>
              ) : p.id === 'STARTER' ? (
                <button
                  onClick={() => handleSelectPlan('STARTER')}
                  className="btn btn-primary"
                  style={{ width: '100%', fontSize: '0.85rem' }}
                >
                  Activate Starter Plan
                </button>
              ) : p.id === 'FREE' ? (
                <button
                  onClick={() => handleSelectPlan('FREE')}
                  className="btn btn-secondary"
                  style={{ width: '100%', fontSize: '0.85rem' }}
                >
                  Switch to Free
                </button>
              ) : (
                <button
                  disabled
                  className="btn btn-secondary"
                  style={{ width: '100%', fontSize: '0.85rem', opacity: 0.6, cursor: 'not-allowed' }}
                >
                  Roadmap Tier (Coming Soon)
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
