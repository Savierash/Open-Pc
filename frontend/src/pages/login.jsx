// src/pages/Login.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import '../styles/Login.css';
import ComputerLogo1 from '../assets/LOGO1.png';
import LockLogo from '../assets/Lock.png';
import PersonLogo from '../assets/Person.png';

// Vite env var (remember: VITE_ prefix)
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create an axios instance with credentials enabled
const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  withCredentials: true, // important for cookie-based login
});

const Login = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const [activeLink, setActiveLink] = useState(location.pathname);
  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location.pathname]);

  const handleNavClick = (path) => navigate(path);

  // --- Helper: Extract roles from the returned user object ---
  const extractRoles = (user) => {
    if (!user) return [];

    const roles = [];

    // Common shapes:
    // user.role: 'admin'   OR user.role: { key: 'admin' } OR user.roles: ['admin'] OR user.roles: [{key:'auditor'}]
    if (typeof user.role === 'string') roles.push(user.role.toLowerCase());
    if (user.role && typeof user.role === 'object') {
      if (user.role.key) roles.push(String(user.role.key).toLowerCase());
      if (user.role.name) roles.push(String(user.role.name).toLowerCase());
    }

    if (Array.isArray(user.roles)) {
      user.roles.forEach((r) => {
        if (!r) return;
        if (typeof r === 'string') roles.push(r.toLowerCase());
        else if (r.key) roles.push(String(r.key).toLowerCase());
        else if (r.name) roles.push(String(r.name).toLowerCase());
      });
    }

    // Some backends put role info inside user.roleKey or user.roleName
    if (user.roleKey) roles.push(String(user.roleKey).toLowerCase());
    if (user.roleName) roles.push(String(user.roleName).toLowerCase());

    return Array.from(new Set(roles)); // dedupe
  };

  // --- Map roles to pages (priority-aware) ---
  // Priority: admin > auditor > tech > default
  const getDashboardPath = (roles) => {
    if (!roles || roles.length === 0) return '/dashboard';

    const lower = roles.map(r => String(r).toLowerCase());

    if (lower.includes('admin') || lower.includes('administrator')) return '/dashboard-admin';
    if (lower.includes('auditor')) return '/inventory'; // <-- per your request auditor -> /inventory
    if (lower.includes('tech') || lower.includes('technician')) return '/dashboard-tech';

    return '/dashboard';
  };

  // --- Login Submit ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/api/auth/login', { usernameOrEmail, password });

      const { token, user } = res.data || {};

      if (token) localStorage.setItem('token', token);
      if (user) localStorage.setItem('user', JSON.stringify(user));

      // extract roles and redirect accordingly
      const userRoles = extractRoles(user);
      const dashboardPath = getDashboardPath(userRoles);

      navigate(dashboardPath, { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      const serverMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.data?.msg ||
        null;

      if (!err.response) {
        setError('Network error — check backend server and CORS settings.');
      } else if (serverMsg) {
        setError(serverMsg);
      } else {
        setError('Login failed — please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <header className="top-bar-login">
        <div className="logo-and-nav">
          <div className="logo" onClick={() => handleNavClick('/')}>
            <img src={ComputerLogo1} alt="PC LOGO" className="computer-logo" />
            <span className="logo-text">OpenPC</span>
            <span className="logo-line">|</span>
          </div>

          <nav className="nav-links-login">
            <a className={`nav-link-login ${activeLink === '/' ? 'active' : ''}`} onClick={() => handleNavClick('/')}>Home</a>
            <a className={`nav-link-login ${activeLink === '/about' ? 'active' : ''}`} onClick={() => handleNavClick('/about')}>About</a>
            <a className={`nav-link-login ${activeLink === '/services' ? 'active' : ''}`} onClick={() => handleNavClick('/services')}>Services</a>
          </nav>
        </div>
        <div className="nav-actions">
          <button className="btn-signup" onClick={() => handleNavClick('/signup')}>Sign Up</button>
        </div>
      </header>

      <main className="main">
        <h1 className="welcome-title">Good to see you again</h1>

        <div className="login-container">
          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-wrapper">
              <input
                type="text"
                id="usernameOrEmail"
                placeholder="Username or Email"
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                className="input"
                required
              />
              <img src={PersonLogo} alt="User icon" className="input-icon" />
            </div>

            {/* password input with toggle placed inside the input */}
            <div className="input-wrapper" style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                required
                style={{ paddingRight: 40 }} // space for the toggle
              />
              <button
                type="button"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword((s) => !s)}
                style={{
                  position: 'absolute',
                  right: 8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 3L21 21" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10.58 10.58C10.2 10.95 10 11.44 10 12C10 13.66 11.34 15 13 15c.56 0 1.05-.2 1.42-.58" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="12" r="3" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
              <img src={LockLogo} alt="Password icon" className="input-icon" />
            </div>

            {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="links-container">
            <Link to="/signup" className="link">Don't have an account?</Link>
            <Link to="/forgot-password" className="link">Forgot Password?</Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
  