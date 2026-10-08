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

  const parseAuthResponse = async (res, defaultMsg = 'Operation failed') => {
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || defaultMsg);
      return data;
    }
    const text = await res.text();
    if (!res.ok) {
      if (res.status === 404) {
        throw new Error('API server route not found (404). Please check backend server status.');
      }
      if (res.status === 502 || res.status === 503 || res.status === 504) {
        throw new Error('Backend server is waking up on Render. Please wait ~30 seconds and try again.');
      }
      throw new Error(text.slice(0, 100) || `${defaultMsg} (${res.status})`);
    }
    return { message: text };
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await parseAuthResponse(res, 'Login failed');
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
      const data = await parseAuthResponse(res, 'Registration failed');
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
      const data = await parseAuthResponse(res, 'Persona switch failed');
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
      let activeToken = token || localStorage.getItem('tutorpro_token');
      if (!activeToken) {
        const demo = await switchDemoPersona('tutor');
        activeToken = demo.token;
      }
      let res = await fetch('/api/auth/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${activeToken}`
        },
        body: JSON.stringify(onboardingData)
      });

      // If token expired or rejected by server (401), refresh demo session and retry seamlessly
      if (res.status === 401) {
        const demo = await switchDemoPersona('tutor');
        res = await fetch('/api/auth/onboarding', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${demo.token}`
          },
          body: JSON.stringify(onboardingData)
        });
      }

      const data = await parseAuthResponse(res, 'Onboarding failed');
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
          const data = await parseAuthResponse(res, 'Plan update failed');
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
