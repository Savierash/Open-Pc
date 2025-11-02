// src/pages/Signup.jsx
import { useSearchParams } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import api from '../api';
import React, { useState, useEffect } from 'react';
import '../styles/Signup.css';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import ComputerLogo1 from '../assets/LOGO1.png';
import PersonLogo from '../assets/Person.png';
import LockLogo from '../assets/Lock.png';
import PhoneIcon from '../assets/Telephone.png';
import WifiLogo from '../assets/wifi_logo.png';
import ChatLogo from '../assets/chat_logo.png';
import BroadcastLogo from '../assets/broadcast_logo.png';
import ToolsLogo from '../assets/tools_logo.png';
import axios from 'axios';

const Signup = () => {
  const [searchParams] = useSearchParams();
  const rawRole = searchParams.get('role'); // e.g. 'tech'
  const roleMap = {
    tech: 'technician',
    auditor: 'auditor',
    admin: 'admin',
  };
  const roleKey = roleMap[rawRole] ?? null; // ✅ capture role from query
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
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
      const payload = {
        username,
        firstName,
        lastName,
        contactNumber: phoneNumber,
        email,
        gender,
        password,
        confirmPassword,
        roleKey,
      };

      // ✅ Always log this so we can debug
      console.log('📦 Sending payload:', payload);


      // Fallback: call API directly
      const res = await api.post('/auth/register', payload);

      alert('✅ OTP has been sent to your email.');
      navigate('/otp', { state: { email } });

    } catch (err) {
      console.error("Signup error:", JSON.stringify(err.response?.data, null, 2) || err.message);
      setError(err.response?.data?.message || 'Signup failed');
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

      <img src={WifiLogo} alt="" className="bg-logo bg-logo-top-left" />
      <img src={ChatLogo} alt="" className="bg-logo bg-logo-top-right" />
      <img src={BroadcastLogo} alt="" className="bg-logo bg-logo-bottom-left" />
      <img src={ToolsLogo} alt="" className="bg-logo bg-logo-bottom-right" />

      <main className="main">
        <h1 className="welcome-title">Get started with your account</h1>

        <div className="signup-container">
          <form onSubmit={handleSubmit} className="signup-form">
            {/* Name Fields */}
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

            {/* Phone Number */}
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

            {/* Email */}
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

            {/* Gender */}
            <div className="input-wrapper">
              <select
                id="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="input"
                required
              >
                <option value="" disabled>Select gender</option>
                <option value="male">male</option>
                <option value="female">female</option>
                <option value="other">other</option>
              </select>
              <img src={PersonLogo} alt="Gender icon" className="input-icon" />
            </div>

            {/* Password */}
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

            {/* Confirm Password */}
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
