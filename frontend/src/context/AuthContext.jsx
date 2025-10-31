import React, { createContext, useContext, useEffect, useState } from 'react';
import api, { setAuthToken } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'));
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) setAuthToken(token);
  }, [token]);

  // if we have a token but no user loaded, fetch profile once on mount
  useEffect(() => {
    let mounted = true;
    async function initProfile() {
      if (token && !user) {
        try {
          const res = await api.get('/auth/profile');
          if (!mounted) return;
          if (res?.data?.user) {
            setUser(res.data.user);
            localStorage.setItem('user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          console.warn('Failed to fetch profile on init', err);
          // if token invalid, clear it
          try { setAuthToken(null); } catch(e){}
        }
      }
    }
    initProfile();
    return () => { mounted = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // listen to global auth events dispatched by api.setAuthToken
  useEffect(() => {
    function onLogout() {
      setToken(null);
      setUser(null);
    }
    function onLogin() {
      const t = localStorage.getItem('token');
      if (t) setToken(t);
    }
    window.addEventListener('auth:logout', onLogout);
    window.addEventListener('auth:login', onLogin);
    return () => {
      window.removeEventListener('auth:logout', onLogout);
      window.removeEventListener('auth:login', onLogin);
    };
  }, []);

  const register = async (payload) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/register', payload);
      const t = res.data.token;
      if (t) {
        setToken(t);
        setAuthToken(t);
      }
      if (res.data.user) {
        setUser(res.data.user);
        localStorage.setItem('user', JSON.stringify(res.data.user));
      }
      return res.data;
    } finally {
      setLoading(false);
    }
  };

  const login = async (payload) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', payload);
      const t = res.data.token;
      if (t) {
        setToken(t);
        setAuthToken(t);
      }
      if (res.data.user) {
        setUser(res.data.user);
        localStorage.setItem('user', JSON.stringify(res.data.user));
      }
      return res.data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setAuthToken(null);
    localStorage.removeItem('user');
  };

  const fetchProfile = async () => {
    const res = await api.get('/auth/profile');
    if (res.data.user) {
      setUser(res.data.user);
      localStorage.setItem('user', JSON.stringify(res.data.user));
    }
    return res.data;
  };

  const updateProfile = async (payload) => {
    const res = await api.post('/auth/profile', payload);
    if (res.data.user) {
      setUser(res.data.user);
      localStorage.setItem('user', JSON.stringify(res.data.user));
    }
    return res.data;
  };

  const sendOtp = async (email) => {
    const res = await api.post('/forgot-password/send-otp', { email });
    return res.data;
  };

  const resetPassword = async ({ email, otp, newPassword }) => {
    const res = await api.post('/forgot-password/reset-password', { email, otp, newPassword });
    return res.data;
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, register, login, logout, fetchProfile, updateProfile, sendOtp, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
