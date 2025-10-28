// src/pages/Signup.jsx
import React, { useState, useEffect } from 'react';
import '../styles/Signup.css';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import ComputerLogo1 from '../assets/LOGO1.png';
import PersonLogo from '../assets/Person.png';
import LockLogo from '../assets/Lock.png';
import PhoneIcon from '../assets/Telephone.png';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// create an axios instance
const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  // withCredentials: true, // enable if backend uses cookies
});

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
      const res = await api.post('/api/auth/register', {
        username,
        firstName,
        lastName,
        phoneNumber,
        email,
        password,
        confirmPassword,
      });
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      // navigate instead of hard reload if you want SPA behavior:
      navigate('/dashboard', { replace: true });
      // or use window.location.href = '/';
    } catch (err) {
      console.error('Signup error', err);
      // Detailed logging for network vs server errors:
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
              <img src={PhoneIcon} alt="Phone Number icon" className="input-icon" />
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

            { /* Changed password input wrapper: place toggle inside input */ }
            <div className="input-wrapper" style={{ position: 'relative' }}>
              <input
                type={showPasswords ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="Enter password"
                required
                style={{ paddingRight: 40 }} // space for the icon
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
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {showPasswords ? (
                  // eye-off
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 3L21 21" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10.58 10.58C10.2 10.95 10 11.44 10 12C10 13.66 11.34 15 13 15c.56 0 1.05-.2 1.42-.58" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14.12 14.12C15.06 13.18 15.6 12.13 15.6 12c0-2.21-1.79-4-4-4-.13 0-1.18.54-2.12 1.48" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2.5 12C3.9 7.5 7.7 4 12 4c1.39 0 2.71.26 3.95.74" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  // eye
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="12" r="3" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
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
                style={{ paddingRight: 40 }} // space for the icon
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
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {showPasswords ? (
                  // eye-off
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 3L21 21" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10.58 10.58C10.2 10.95 10 11.44 10 12C10 13.66 11.34 15 13 15c.56 0 1.05-.2 1.42-.58" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14.12 14.12C15.06 13.18 15.6 12.13 15.6 12c0-2.21-1.79-4-4-4-.13 0-1.18.54-2.12 1.48" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2.5 12C3.9 7.5 7.7 4 12 4c1.39 0 2.71.26 3.95.74" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  // eye
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="12" r="3" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
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
