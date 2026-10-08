import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('tutorpro_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('tutorpro_token') || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      localStorage.setItem('tutorpro_token', token);
    } else {
      localStorage.removeItem('tutorpro_token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('tutorpro_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('tutorpro_user');
    }
  }, [user]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      setToken(data.token);
      setUser(data.user);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      setToken(data.token);
      setUser(data.user);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const switchDemoPersona = async (persona = 'tutor') => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/switch-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ persona })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Persona switch failed');
      setToken(data.token);
      setUser(data.user);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const updateOnboarding = async (onboardingData) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(onboardingData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Onboarding failed');
      setUser(data.user);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const updatePlan = async (plan) => {
    try {
      if (token) {
        const res = await fetch('/api/auth/plan', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ plan })
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          return data.user;
        }
      }
    } catch (err) {
      console.error('Error updating plan:', err);
    }
    // Fallback local update
    setUser(prev => {
      if (!prev) return prev;
      const updated = { ...prev, subscriptionPlan: plan };
      localStorage.setItem('tutorpro_user', JSON.stringify(updated));
      return updated;
    });
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('tutorpro_token');
    localStorage.removeItem('tutorpro_user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      register,
      switchDemoPersona,
      updateOnboarding,
      updatePlan,
      logout,
      isAuthenticated: !!token
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
