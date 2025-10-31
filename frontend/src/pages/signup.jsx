// src/pages/Signup.jsx
import React, { useState, useEffect } from 'react';
import '../styles/Signup.css';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import ComputerLogo1 from '../assets/LOGO1.png';
import PersonLogo from '../assets/Person.png';
import LockLogo from '../assets/Lock.png';
import { useAuth } from '../context/AuthContext';
import api from '../services/api'; // <-- IMPORTANT: import centralized api client

// use shared auth context via useAuth (AuthContext handles token and api)

const Signup = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [activeLink, setActiveLink] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { register: registerWithContext, setAuthToken } = useAuth() || {}; // optional helpers from context

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location.pathname]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const username = `${firstName.trim()} ${lastName.trim()}`.trim();

      // Read role from query param (e.g. /signup?role=auditor)
      const query = new URLSearchParams(location.search);
      const selectedRole = query.get('role') || 'user';

      // If your AuthContext provides a register helper, prefer using it
      if (typeof registerWithContext === 'function') {
        // Some register helpers return the token/user — adapt as needed
        const result = await registerWithContext({
          username,
          firstName,
          lastName,
          phoneNumber,
          email,
          password,
          confirmPassword,
          role: selectedRole,
        });

        // If context's register returned a token/user, redirect accordingly
        const token = result?.token || result?.data?.token;
        const user = result?.user || result?.data?.user || null;
        if (token && typeof setAuthToken === 'function') {
          setAuthToken(token);
        } else if (token) {
          localStorage.setItem('token', token);
        }
        if (user) localStorage.setItem('user', JSON.stringify(user));

        // decide redirect path like below
        const userRole = (user && user.role) ? String(user.role).toLowerCase() : String(selectedRole).toLowerCase();
        let redirectPath = '/dashboard';
        if (userRole === 'admin') redirectPath = '/dashboard-adminpanel';
        else if (userRole === 'auditor') redirectPath = '/dashboard-admin';
        else if (userRole === 'tech' || userRole === 'technician') redirectPath = '/dashboard-technician';
        navigate(redirectPath, { replace: true });
        return;
      }

      // Fallback: call API directly using centralized `api` client.
      // NOTE: api base already includes "/api", so call '/auth/register'
      const res = await api.post('/auth/register', {
        username,
        firstName,
        lastName,
        phoneNumber,
        email,
        password,
        confirmPassword,
        role: selectedRole,
      });

      const { token, user } = res.data || {};
      if (token) {
        // set token in localStorage and in api client (if setAuthToken is available use it)
        if (typeof setAuthToken === 'function') {
          setAuthToken(token);
        } else {
          localStorage.setItem('token', token);
          // also assign header for immediate requests
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
      }
      if (user) localStorage.setItem('user', JSON.stringify(user));

      // Determine redirect path based on user.role returned from backend (fallback to selectedRole)
      const userRole = (user && user.role) ? String(user.role).toLowerCase() : String(selectedRole).toLowerCase();

      let redirectPath = '/dashboard'; // fallback

      if (userRole === 'admin') {
        redirectPath = '/dashboard-adminpanel';
      } else if (userRole === 'auditor') {
        redirectPath = '/dashboard-admin';
      } else if (userRole === 'tech' || userRole === 'technician') {
        redirectPath = '/dashboard-technician';
      } else {
        redirectPath = '/dashboard';
      }

      navigate(redirectPath, { replace: true });
    } catch (err) {
      console.error('Signup error', err);
      if (!err.response) {
        setError(`Network error: ${err.message}`);
      } else {
        setError(err.response?.data?.message || 'Signup failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNavClick = (path) => {
    navigate(path);
  };

  return (
    <div className="signup">
      <header className="top-bar-signup">
        <div className="logo-and-nav">
          <div className="logo">
            <img src={ComputerLogo1} alt="PC LOGO" className="computer-logo" />
            <span className="logo-text">OpenPC</span>
            <span className="logo-line">|</span>
          </div>
          <nav className="nav-links-signup">
            <a
              className={`nav-link-signup ${activeLink === '/' ? 'active' : ''}`}
              onClick={() => handleNavClick('/')}
            >
              Home
            </a>
            <a
              className={`nav-link-signup ${activeLink === '/about' ? 'active' : ''}`}
              onClick={() => handleNavClick('/about')}
            >
              About
            </a>
            <a
              className={`nav-link-signup ${activeLink === '/services' ? 'active' : ''}`}
              onClick={() => handleNavClick('/services')}
            >
              Services
            </a>
          </nav>
        </div>
        <div className="nav-actions">
          <button className="btn-login" onClick={() => handleNavClick('/login')}>
            Login
          </button>
        </div>
      </header>

      <main className="main">
        <h1 className="welcome-title">Get started with your account</h1>

        <div className="signup-container">
          <form onSubmit={handleSubmit} className="signup-form">
            <div style={{ display: 'flex', gap: '16px' }}>
              <div className="input-wrapper" style={{ flex: 1 }}>
                <input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="input"
                  placeholder="First name"
                  required
                />
                <img src={PersonLogo} alt="First Name icon" className="input-icon" />
              </div>

              <div className="input-wrapper" style={{ flex: 1 }}>
                <input
                  type="text"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="input"
                  placeholder="Last name"
                  required
                />
                <img src={PersonLogo} alt="Last Name icon" className="input-icon" />
              </div>
            </div>

            <div className="input-wrapper">
              <input
                type="tel"
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="input"
                placeholder="Phone number"
                required
              />
              <img src={PersonLogo} alt="Phone Number icon" className="input-icon" />
            </div>

            <div className="input-wrapper">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="Email Address"
                required
              />
              <img src={PersonLogo} alt="Email icon" className="input-icon" />
            </div>

            <div className="input-wrapper" style={{ position: 'relative' }}>
              <input
                type={showPasswords ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="Enter password"
                required
                style={{ paddingRight: 40 }}
              />
              <button
                type="button"
                aria-label={showPasswords ? 'Hide password' : 'Show password'}
                onClick={() => setShowPasswords((s) => !s)}
                style={{
                  position: 'absolute',
                  right: 8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                {showPasswords ? 'Hide' : 'Show'}
              </button>
              <img src={LockLogo} alt="Password icon" className="input-icon" />
            </div>

            <div className="input-wrapper" style={{ position: 'relative' }}>
              <input
                type={showPasswords ? 'text' : 'password'}
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input"
                placeholder="Confirm password"
                required
                style={{ paddingRight: 40 }}
              />
              <button
                type="button"
                aria-label={showPasswords ? 'Hide password' : 'Show password'}
                onClick={() => setShowPasswords((s) => !s)}
                style={{
                  position: 'absolute',
                  right: 8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                {showPasswords ? 'Hide' : 'Show'}
              </button>
              <img src={LockLogo} alt="Confirm Password icon" className="input-icon" />
            </div>

            {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}

            <button type="submit" className="signup-button" disabled={loading}>
              {loading ? 'Signing up...' : 'Signup'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Signup;
