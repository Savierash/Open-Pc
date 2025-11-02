// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('accessToken'));
  const [loading, setLoading] = useState(true);

  // Fetch user profile on initial load if token exists
  useEffect(() => {
    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [token]);

  const register = async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  };

  const login = async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    const { token, user } = response.data;

    localStorage.setItem('accessToken', token);
    localStorage.setItem('user', JSON.stringify(user));

    setToken(token);
    setUser(user);

    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const fetchProfile = async () => {
    try {
      const response = await api.get('/users/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updatedData) => {
    const response = await api.put('/auth/profile', updatedData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setUser(response.data);
    return response.data;
  };

  const sendOtp = async (email) => {
    const response = await api.post('/auth/send-otp', { email });
    return response.data;
  };

  const resetPassword = async (data) => {
    const response = await api.post('/auth/reset-password', data);
    return response.data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        register,
        login,
        logout,
        fetchProfile,
        updateProfile,
        sendOtp,
        resetPassword,
        setUser,   // ✅ expose setUser for OTP flow
        setToken,  // ✅ expose setToken for OTP flow
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
