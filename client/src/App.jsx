import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import DashboardLayout from './pages/DashboardLayout';
import AuthModal from './components/AuthModal';
import OnboardingModal from './components/OnboardingModal';

function MainApp() {
  const [view, setView] = useState(() => {
    return localStorage.getItem('tutorpro_view') || 'landing';
  });
  const [authModal, setAuthModal] = useState({ open: false, mode: 'login' });
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const { switchDemoPersona } = useAuth();

  React.useEffect(() => {
    localStorage.setItem('tutorpro_view', view);
  }, [view]);

  const handleOpenAuth = (mode = 'login') => {
    setAuthModal({ open: true, mode });
  };

  const handleOpenOnboarding = () => {
    setOnboardingOpen(true);
  };

  const handleEnterDemo = async () => {
    // Automatically sign in as Demo Tutor and open dashboard
    try {
      await switchDemoPersona('tutor');
      setView('dashboard');
    } catch (err) {
      console.error(err);
      setView('dashboard');
    }
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navbar is visible on landing page, Dashboard has its own sidebar layout */}
      {view === 'landing' && (
        <Navbar
          onOpenAuth={handleOpenAuth}
          onOpenOnboarding={handleOpenOnboarding}
          onNavigateSection={scrollToSection}
          currentView={view}
          setView={setView}
        />
      )}

      {/* Main Views */}
      {view === 'landing' ? (
        <LandingPage
          onOpenAuth={handleOpenAuth}
          onOpenOnboarding={handleOpenOnboarding}
          onEnterDemo={handleEnterDemo}
        />
      ) : (
        <DashboardLayout
          onBackHome={() => setView('landing')}
        />
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModal.open}
        initialMode={authModal.mode}
        onClose={() => setAuthModal({ ...authModal, open: false })}
        onSuccess={() => setView('dashboard')}
      />

      {/* Onboarding Wizard Modal */}
      <OnboardingModal
        isOpen={onboardingOpen}
        onClose={() => setOnboardingOpen(false)}
        onComplete={() => setView('dashboard')}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ThemeProvider>
  );
}
