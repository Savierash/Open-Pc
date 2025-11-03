import axios from 'axios';

// Normalize base URL
function ensureApiBase(raw) {
  if (!raw) return 'http://localhost:5000/api';
  const trimmed = String(raw).trim();
  if (trimmed.endsWith('/api')) return trimmed;
  if (trimmed.endsWith('/')) return trimmed + 'api';
  return trimmed + '/api';
}

const API_BASE = ensureApiBase(import.meta.env.VITE_API_BASE || import.meta.env.VITE_API_URL);

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
});

// ✅ Manage auth token globally
export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('accessToken', token); // ✅ consistent key
  } else {
    delete api.defaults.headers.common['Authorization'];
    localStorage.removeItem('accessToken'); // ✅ consistent key
  }
}

// ✅ Initialize from localStorage
const existing = localStorage.getItem('accessToken');
if (existing) setAuthToken(existing);

// ✅ Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      setAuthToken(null);
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export default api;
