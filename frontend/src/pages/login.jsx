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

  const navigate = useNavigate();
  const location = useLocation();

  const [activeLink, setActiveLink] = useState(location.pathname);
  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location.pathname]);

  const handleNavClick = (path) => navigate(path);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await api.post('/api/auth/login', {
  usernameOrEmail,
  password,
});

    try {
      // Use the api instance created above; DO NOT send withCredentials unless configured
      const res = await api.post('/api/auth/login', {
        usernameOrEmail,
        password,
      });

      const { token, user } = res.data ?? {};

      if (token) localStorage.setItem('token', token);
      if (user) localStorage.setItem('user', JSON.stringify(user));

      // Redirect to dashboard (replace so they can't go back to login)
      navigate('/dashboard', { replace: true });
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

            <div className="input-wrapper">
              <input
                type="password"
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                required
              />
              <img src={LockLogo} alt="Lock icon" className="input-icon" />
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
