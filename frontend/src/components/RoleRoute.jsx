import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

// allowed: array of role keys, e.g. ['admin','technician']
const RoleRoute = ({ allowed = [], children }) => {
  const { user, token } = useAuth();
  if (!token || !user) return <Navigate to="/login" replace />;
  // support role as string (role key) or populated object { key }
  const roleKey = user.role && (typeof user.role === 'string' ? user.role : (user.role.key || null));
  if (!roleKey || !allowed.includes(roleKey)) {
    // if authenticated but not authorized, redirect to dashboard
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

export default RoleRoute;
