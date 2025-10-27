// src/pages/Login.jsx (updated for Vite + React Router v6)
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import '../styles/Login.css';
import ComputerLogo1 from '../assets/LOGO1.png';
import LockLogo from '../assets/Lock.png';
import PersonLogo from '../assets/Person.png';

// Vite env var (remember: VITE_ prefix)
const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Login = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Optional: keep track of active path for styling
  const [activeLink, setActiveLink] = useState(location.pathname);
  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location.pathname]);

  const handleNavClick = (path) => {
    // use React Router navigation to avoid full reloads
    navigate(path);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post(`${apiBase}/api/auth/login`, {
        usernameOrEmail,
        password,
      }, {
        // send credentials if your backend uses cookies/sessions
        withCredentials: true,
      });

      const { token, user } = res.data ?? {};

      if (token) {
        // store token & user (adjust storage strategy as needed)
        localStorage.setItem('token', token);
      }
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      }

      // navigate to home or where you want
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      // handle possible shapes of error response
      const serverMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.data?.msg ||
        null;

      // axios network error vs server error
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
        <div className="logo" onClick={() => handleNavClick('/')}>
          <img src={ComputerLogo1} alt="PC LOGO" className="computer-logo" />
          <span className="logo-text">OpenPC</span>
          <span className="logo-line">|</span>
        </div>

        <nav className="nav-links-login">
          <button
            type="button"
            className={`nav-link-login ${activeLink === '/' ? 'active' : ''}`}
            onClick={() => handleNavClick('/')}
          >
            Home
          </button>
          <button
            type="button"
            className={`nav-link-login ${activeLink === '/about' ? 'active' : ''}`}
            onClick={() => handleNavClick('/about')}
          >
            About
          </button>
          <button
            type="button"
            className={`nav-link-login ${activeLink === '/services' ? 'active' : ''}`}
            onClick={() => handleNavClick('/services')}
          >
            Services
          </button>
        </nav>

        <div className="nav-actions">
          <button className="btn-signup" onClick={() => handleNavClick('/signup')}>
            Sign Up
          </button>
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
