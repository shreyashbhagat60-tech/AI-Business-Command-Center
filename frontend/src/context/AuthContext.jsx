import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ai_bcc_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('ai_bcc_token') || null;
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('ai_bcc_token');
      if (storedToken) {
        try {
          const profile = await apiService.getProfile();
          setUser(profile);
          localStorage.setItem('ai_bcc_user', JSON.stringify(profile));
        } catch (err) {
          console.warn('Session expired or invalid, clearing auth...');
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await apiService.login({ email, password });
    setToken(res.access_token);
    setUser(res.user);
    localStorage.setItem('ai_bcc_token', res.access_token);
    localStorage.setItem('ai_bcc_user', JSON.stringify(res.user));
    return res.user;
  };

  const register = async (data) => {
    const res = await apiService.register(data);
    setToken(res.access_token);
    setUser(res.user);
    localStorage.setItem('ai_bcc_token', res.access_token);
    localStorage.setItem('ai_bcc_user', JSON.stringify(res.user));
    return res.user;
  };

  const logout = async () => {
    try {
      await apiService.logout();
    } catch (e) {
      // Ignore logout network errors
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('ai_bcc_token');
      localStorage.removeItem('ai_bcc_user');
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated: !!user && !!token,
      loading,
      login,
      register,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
