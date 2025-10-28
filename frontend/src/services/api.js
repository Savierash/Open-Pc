import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  withCredentials: true,
});

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token);
    try { window.dispatchEvent(new Event('auth:login')); } catch(e){}
  } else {
    delete api.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
    try { window.dispatchEvent(new Event('auth:logout')); } catch(e){}
  }
}

// initialize from storage
const existing = localStorage.getItem('token');
if (existing) setAuthToken(existing);

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    if (status === 401) {
      // clear token automatically on unauthorized and redirect to login
      try {
        setAuthToken(null);
      } catch (e) {
        console.warn('Failed to clear auth token', e);
      }
      // avoid infinite redirect if already on login
      try {
        if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      } catch (e) {
        console.warn('Failed to redirect to login', e);
      }
    }
    return Promise.reject(err);
  }
);

export default api;
