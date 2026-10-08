import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, Users, Calendar, CheckCircle2, IndianRupee, 
  Award, UserCheck, CreditCard, LogOut, X
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, onBackHome, isOpen, onClose }) {
  const { user, logout } = useAuth();

  const isParent = user?.role === 'PARENT';
  const plan = user?.subscriptionPlan || 'STARTER';
  const isProOrAbove = plan === 'PRO' || plan === 'INSTITUTE';

  const tutorMenuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'batches', label: 'Batches & Timetable', icon: Calendar },
    { id: 'attendance', label: 'Attendance', icon: CheckCircle2 },
    { id: 'fees', label: 'Fees & Payments', icon: IndianRupee },
    ...(isProOrAbove ? [
      { id: 'tests', label: 'Tests & Results', icon: Award, proBadge: true },
      { id: 'parent-portal', label: 'Parent Portal Simulator', icon: UserCheck, highlight: true, proBadge: true }
    ] : []),
    { id: 'subscription', label: 'Subscription & Plans', icon: CreditCard }
  ];

  const parentMenuItems = [
    { id: 'parent-portal', label: 'Child Performance', icon: UserCheck },
    { id: 'overview', label: 'Academy Overview', icon: LayoutDashboard }
  ];

  const menuItems = isParent ? parentMenuItems : tutorMenuItems;

  return (
    <aside
      className={`dashboard-sidebar-wrapper ${isOpen ? 'mobile-open' : ''}`}
      style={{
        width: '260px',
        minWidth: '260px',
        background: 'var(--bg-surface)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
        zIndex: 40
      }}
    >
      {/* Brand Header */}
      <div style={{
        padding: '18px 20px',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, var(--primary), #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.25rem'
          }}>
            🎓
          </div>
          <div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
              TutorPro
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              {isParent ? 'PARENT PORTAL' : 'TUTOR OPERATING SYSTEM'}
            </div>
          </div>
        </div>

        {/* Mobile Close Button */}
        <button
          onClick={onClose}
          className="mobile-menu-trigger"
          style={{ width: '32px', height: '32px', margin: 0, padding: 0 }}
          title="Close Navigation"
          aria-label="Close Navigation"
        >
          <X size={16} />
        </button>
      </div>

      {/* User Badge */}
      <div style={{
        padding: '16px 20px',
        background: 'var(--bg-surface-hover)',
        margin: '12px 14px',
        borderRadius: '14px',
        border: '1px solid var(--border-subtle)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '0.9rem'
          }}>
            {user?.name ? user.name.charAt(0) : 'T'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: '0.875rem',
              fontWeight: 700,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {user?.name || 'Tanmoy Paul'}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              {isParent ? 'Parent Account' : (user?.academyName || "Tanmoy's Academy")}
            </div>
          </div>
          {!isParent && (
            <span className="badge badge-primary" style={{ fontSize: '0.65rem', padding: '2px 6px' }}>
              {user?.subscriptionPlan || 'PRO'}
            </span>
          )}
        </div>
      </div>

      {/* Navigation List */}
      <nav style={{ flex: 1, padding: '8px 14px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                onClose?.();
              }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 14px',
                borderRadius: '10px',
                fontSize: '0.875rem',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? '#ffffff' : 'var(--text-secondary)',
                background: isActive ? 'var(--primary)' : 'transparent',
                transition: 'all var(--transition-fast)',
                textAlign: 'left'
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.background = 'var(--bg-surface-hover)';
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.background = 'transparent';
              }}
            >
              <Icon size={18} color={isActive ? '#ffffff' : 'var(--text-muted)'} />
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.proBadge && !isActive && (
                <span className="badge" style={{ fontSize: '0.62rem', background: '#EEEDFE', color: '#534AB7', fontWeight: 800, padding: '2px 6px' }}>PRO</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div style={{
        padding: '12px 14px',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        {/* <button
          onClick={() => {
            logout();
            onBackHome?.();
          }}
          className="btn btn-ghost btn-sm"
          style={{
            width: '100%',
            justifyContent: 'flex-start',
            gap: '8px',
            color: 'var(--danger)',
            fontSize: '0.8125rem',
            padding: '8px 12px',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
          title="Sign out of TutorPro"
        >
          <LogOut size={15} />
          <span style={{ fontWeight: 600 }}>Log Out</span>
        </button> */}

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.72rem',
          color: 'var(--text-muted)',
          padding: '2px 4px 0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
            <span style={{ fontWeight: 600 }}>TutorPro </span>
          </div>
          <button
            onClick={onBackHome}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              fontSize: '0.72rem',
              padding: 0
            }}
            title="View public landing page"
          >
             &rarr;
          </button>
        </div>
      </div>
    </aside>
  );
}
