import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Sun, Moon, Sparkles, LayoutDashboard, UserCheck, ArrowRight, Menu, X, Zap, LogOut } from 'lucide-react';

export default function Navbar({ onOpenAuth, onOpenOnboarding, onNavigateSection, currentView, setView }) {
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, switchDemoPersona, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'var(--bg-glass)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-glass)',
      padding: '12px 24px',
      transition: 'all var(--transition-normal)'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px'
      }}>
        {/* Brand Logo & Tagline */}
        <div 
          onClick={() => setView('landing')}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
        >
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #4f46e5, #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.4rem',
            boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
          }}>
            🎓
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.35rem',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                color: 'var(--text-primary)'
              }}>
                TutorPro
              </span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              Tuition Management Platform
            </div>
          </div>
        </div>

        {/* Center Nav Links (Desktop Only) */}
        {currentView === 'landing' && (
          <nav className="nav-desktop-links">
            <a 
              href="#features" 
              onClick={(e) => { e.preventDefault(); onNavigateSection('features'); }}
              style={{ transition: 'color var(--transition-fast)' }}
              onMouseEnter={(e) => e.target.style.color = 'var(--primary)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
            >
              Features
            </a>
            <a 
              href="#how-it-works" 
              onClick={(e) => { e.preventDefault(); onNavigateSection('how-it-works'); }}
              style={{ transition: 'color var(--transition-fast)' }}
              onMouseEnter={(e) => e.target.style.color = 'var(--primary)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
            >
              How it works
            </a>
            <a 
              href="#pricing" 
              onClick={(e) => { e.preventDefault(); onNavigateSection('pricing'); }}
              style={{ transition: 'color var(--transition-fast)' }}
              onMouseEnter={(e) => e.target.style.color = 'var(--primary)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
            >
              Pricing
            </a>
            <a 
              href="#marketplace" 
              onClick={(e) => { e.preventDefault(); onNavigateSection('marketplace'); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: 'var(--accent)',
                transition: 'color var(--transition-fast)'
              }}
            >
              <Sparkles size={14} />
              Future Scope
            </a>
          </nav>
        )}

        {/* Right CTA Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="btn btn-secondary btn-sm"
            style={{ borderRadius: '50%', width: '38px', height: '38px', padding: 0 }}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            id="theme-toggle-btn"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={17} color="#fbbf24" /> : <Moon size={17} color="#6366f1" />}
          </button>

          {/* Persona Switcher Quick Shortcut (High-Impact Demo Feature) */}
          <button
            onClick={async () => {
              const target = user?.role === 'PARENT' ? 'tutor' : 'parent';
              await switchDemoPersona(target);
              setView('dashboard');
            }}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 10px' }}
            title="Instant Role Toggle"
          >
            <UserCheck size={14} color="var(--primary)" />
            <span><strong style={{ color: 'var(--primary)' }}>{user?.role === 'PARENT' ? 'Parent' : 'Tutor'}</strong></span>
          </button>

          {/* Conditional Navigation / Auth Buttons (Desktop) */}
          {currentView === 'landing' ? (
            <div className="nav-desktop-btn-hide" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => setView('dashboard')}
                    className="btn btn-primary btn-sm"
                    id="go-dashboard-btn"
                  >
                    <LayoutDashboard size={16} />
                    <span>Dashboard</span>
                  </button>
                  <button
                    onClick={logout}
                    className="btn btn-ghost btn-sm"
                    style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '6px' }}
                    title="Sign Out"
                    id="nav-logout-btn"
                  >
                    <LogOut size={15} />
                    <span>Log Out</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => onOpenAuth('login')}
                    className="btn btn-ghost btn-sm"
                    id="nav-login-btn"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => onOpenOnboarding()}
                    className="btn btn-primary btn-sm"
                    id="nav-start-free-btn"
                  >
                    <span>Start Free</span>
                    <ArrowRight size={15} />
                  </button>
                </>
              )}
            </div>
          ) : (
            <button
              onClick={() => setView('landing')}
              className="btn btn-secondary btn-sm"
              id="back-to-landing-btn"
            >
              <span>Home</span>
            </button>
          )}

          {/* Mobile Hamburger Menu Button (Landing View Only) */}
          {currentView === 'landing' && (
            <button
              className="nav-mobile-hamburger"
              onClick={() => setMobileMenuOpen(prev => !prev)}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Slide-Down Drawer */}
      {currentView === 'landing' && mobileMenuOpen && (
        <div className="nav-mobile-drawer" style={{ display: 'flex' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '1rem', fontWeight: 600 }}>
            <a 
              href="#features" 
              onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); onNavigateSection('features'); }}
              style={{ padding: '8px 0', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}
            >
              Features
            </a>
            <a 
              href="#how-it-works" 
              onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); onNavigateSection('how-it-works'); }}
              style={{ padding: '8px 0', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}
            >
              How it works
            </a>
            <a 
              href="#pricing" 
              onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); onNavigateSection('pricing'); }}
              style={{ padding: '8px 0', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}
            >
              Pricing
            </a>
            <a 
              href="#marketplace" 
              onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); onNavigateSection('marketplace'); }}
              style={{ padding: '8px 0', borderBottom: '1px solid var(--border-subtle)', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Sparkles size={16} />
              Future Scope (Marketplace)
            </a>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setView('dashboard');
              }}
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <Zap size={16} />
              <span>Launch Live Demo</span>
            </button>

            {isAuthenticated ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setView('dashboard');
                  }}
                  className="btn btn-secondary"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <LayoutDashboard size={16} />
                  <span>Dashboard</span>
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="btn btn-ghost"
                  style={{ width: '100%', justifyContent: 'center', color: 'var(--danger)', gap: '6px' }}
                >
                  <LogOut size={16} />
                  <span>Log Out</span>
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth('login');
                  }}
                  className="btn btn-secondary"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenOnboarding();
                  }}
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  Start Free
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
