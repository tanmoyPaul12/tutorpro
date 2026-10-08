import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Bell, Search, UserCheck, Sparkles, ArrowLeft, Menu, X, LogOut } from 'lucide-react';

import OverviewView from './dashboard/OverviewView';
import StudentsView from './dashboard/StudentsView';
import BatchesView from './dashboard/BatchesView';
import AttendanceView from './dashboard/AttendanceView';
import FeesView from './dashboard/FeesView';
import TestsView from './dashboard/TestsView';
import ParentPortalView from './dashboard/ParentPortalView';
import SubscriptionView from './dashboard/SubscriptionView';
import WhatsAppAlertModal from '../components/WhatsAppAlertModal';

export default function DashboardLayout({ onBackHome }) {
  const { user, switchDemoPersona, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const isParent = user?.role === 'PARENT';
  const plan = user?.subscriptionPlan || 'STARTER';
  const isPro = plan === 'PRO' || plan === 'INSTITUTE';

  const [activeTab, setActiveTab] = useState(() => {
    if (isParent) return 'parent-portal';
    const saved = localStorage.getItem('tutorpro_active_tab');
    if (saved) {
      if ((saved === 'tests' || saved === 'parent-portal') && !isPro) {
        return 'overview';
      }
      return saved;
    }
    return 'overview';
  });

  React.useEffect(() => {
    localStorage.setItem('tutorpro_active_tab', activeTab);
  }, [activeTab]);

  // If plan is downgraded/switched and on tests or parent-portal, return to overview
  React.useEffect(() => {
    if (!isParent && (activeTab === 'tests' || activeTab === 'parent-portal') && !isPro) {
      setActiveTab('overview');
    }
  }, [isPro, isParent, activeTab]);

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  React.useEffect(() => {
    setMobileSidebarOpen(false);
  }, [activeTab]);

  const [whatsAppData, setWhatsAppData] = useState(null);

  const openWhatsAppModal = (data) => {
    setWhatsAppData(data);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-app)' }}>
      {/* Mobile Drawer Backdrop */}
      {mobileSidebarOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setMobileSidebarOpen(false)}
          aria-label="Close sidebar menu"
        />
      )}

      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onBackHome={onBackHome}
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main Workspace */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflowX: 'hidden' }}>
        {/* Top Header Bar */}
        <header
          className="dashboard-header-container"
          style={{
            height: '68px',
            background: 'var(--bg-glass)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderBottom: '1px solid var(--border-glass)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 32px',
            position: 'sticky',
            top: 0,
            zIndex: 30
          }}
        >
          {/* Left Group: Mobile Menu Button + Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button
              className="mobile-menu-trigger"
              onClick={() => setMobileSidebarOpen(true)}
              title="Open Navigation Menu"
              aria-label="Open Navigation Menu"
            >
              <Menu size={18} />
            </button>

            {/* Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="header-breadcrumb-prefix" style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>TutorPro OS /</span>
              <span style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'capitalize', color: 'var(--text-primary)' }}>
                {activeTab.replace('-', ' ')}
              </span>
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="header-controls-group" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Persona Switcher (Tutor / Parent) */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '10px',
              padding: '3px',
              gap: '2px'
            }}>
              <button
                type="button"
                onClick={async () => {
                  if (isParent) {
                    await switchDemoPersona('tutor');
                    setActiveTab('overview');
                  }
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '5px 12px',
                  borderRadius: '7px',
                  border: 'none',
                  fontSize: '0.78rem',
                  fontWeight: !isParent ? 700 : 500,
                  background: !isParent ? 'var(--primary)' : 'transparent',
                  color: !isParent ? '#ffffff' : 'var(--text-secondary)',
                  cursor: isParent ? 'pointer' : 'default',
                  transition: 'all var(--transition-fast)'
                }}
                title="Switch to Tutor View"
              >
                <span>Tutor</span>
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (!isParent) {
                    await switchDemoPersona('parent');
                    setActiveTab('parent-portal');
                  }
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '5px 12px',
                  borderRadius: '7px',
                  border: 'none',
                  fontSize: '0.78rem',
                  fontWeight: isParent ? 700 : 500,
                  background: isParent ? 'var(--primary)' : 'transparent',
                  color: isParent ? '#ffffff' : 'var(--text-secondary)',
                  cursor: !isParent ? 'pointer' : 'default',
                  transition: 'all var(--transition-fast)'
                }}
                title="Switch to Parent View"
              >
                <span>Parent</span>
              </button>
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="btn btn-secondary btn-sm"
              style={{ borderRadius: '50%', width: '36px', height: '36px', padding: 0 }}
              title="Toggle Theme"
              id="dashboard-theme-toggle"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={16} color="#fbbf24" /> : <Moon size={16} color="#6366f1" />}
            </button>

            {/* Notification Indicator */}
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                position: 'relative'
              }}
              onClick={() => alert('Recent Notifications: 1 WhatsApp Absent Alert delivered, 1 Fee Reminder logged.')}
              title="Notifications"
              aria-label="Notifications"
            >
              <Bell size={16} color="var(--text-secondary)" />
              <span style={{
                position: 'absolute',
                top: '6px',
                right: '6px',
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: '#10b981'
              }} />
            </div>

            {/* Back to Landing Page Icon Button */}
            <button
              onClick={onBackHome}
              className="btn btn-secondary btn-sm"
              style={{
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Back to Landing Page"
              id="dashboard-back-btn"
              aria-label="Back to Landing Page"
            >
              <ArrowLeft size={16} color="var(--text-secondary)" />
            </button>

            {/* Log Out Icon Button */}
            <button
              onClick={() => {
                logout();
                onBackHome?.();
              }}
              className="btn btn-secondary btn-sm"
              style={{
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--danger)'
              }}
              title="Log Out"
              id="dashboard-logout-btn"
              aria-label="Log Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </header>

        {/* Dynamic View Canvas */}
        <main className="dashboard-main-canvas" style={{ flex: 1, padding: 'clamp(14px, 3vw, 32px)', maxWidth: '1400px', width: '100%', margin: '0 auto' }}>
          {activeTab === 'overview' && <OverviewView onNavigateTab={setActiveTab} />}
          {activeTab === 'students' && <StudentsView onOpenWhatsAppModal={openWhatsAppModal} />}
          {activeTab === 'batches' && <BatchesView />}
          {activeTab === 'attendance' && <AttendanceView onOpenWhatsAppModal={openWhatsAppModal} />}
          {activeTab === 'fees' && <FeesView onOpenWhatsAppModal={openWhatsAppModal} />}
          {activeTab === 'tests' && <TestsView />}
          {activeTab === 'parent-portal' && <ParentPortalView />}
          {activeTab === 'subscription' && <SubscriptionView />}
        </main>
      </div>

      {/* WhatsApp Modal Trigger */}
      <WhatsAppAlertModal
        isOpen={!!whatsAppData}
        onClose={() => setWhatsAppData(null)}
        data={whatsAppData}
      />
    </div>
  );
}
