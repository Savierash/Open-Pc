import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import '../styles/ResetPassword.css';
import ComputerLogo1 from '../assets/LOGO1.png';
import LockLogo from '../assets/Lock.png';
import WifiLogo from '../assets/wifi_logo.png';
import ChatLogo from '../assets/chat_logo.png';
import BroadcastLogo from '../assets/broadcast_logo.png';
import ToolsLogo from '../assets/tools_logo.png';

const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const [activeLink, setActiveLink] = useState(location.pathname);
  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location.pathname]);

  const handleNavClick = (path) => {
    navigate(path);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);

    try {
      // Here, you would send the new password to your backend for reset
      console.log('Resetting password with new password:', newPassword);
      // On success, navigate to a login page or success message
      navigate('/login'); 
    } catch (err) {
      console.error('Password reset error:', err);
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
        setError('Password reset failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password">
      <header className="top-bar-reset-password">
        <div className="logo-and-nav">
          <div className="logo" onClick={() => handleNavClick('/')}>
            <img src={ComputerLogo1} alt="PC LOGO" className="computer-logo" />
            <span className="logo-text">OpenPC</span>
            <span className="logo-line">|</span>
          </div>

          <nav className="nav-links-reset-password">
            <a
              className={`nav-link-reset-password ${activeLink === '/' ? 'active' : ''}`}
              onClick={() => handleNavClick('/')}
            >
              Home
            </a>
            <a
              className={`nav-link-reset-password ${activeLink === '/about' ? 'active' : ''}`}
              onClick={() => handleNavClick('/about')}
            >
              About
            </a>
            <a
              className={`nav-link-reset-password ${activeLink === '/services' ? 'active' : ''}`}
              onClick={() => handleNavClick('/services')}
            >
              Services
            </a>
          </nav>
        </div>
        <div className="nav-actions">
          
        </div>
      </header>

      {/* Background decorative logos */}
      <img src={WifiLogo} alt="" className="bg-logo bg-logo-top-left" />
      <img src={ChatLogo} alt="" className="bg-logo bg-logo-top-right" />
      <img src={BroadcastLogo} alt="" className="bg-logo bg-logo-bottom-left" />
      <img src={ToolsLogo} alt="" className="bg-logo bg-logo-bottom-right" />

      <main className="main">
        <h1 className="welcome-title">Reset your password</h1>

        <div className="reset-password-container">
          <form onSubmit={handleSubmit} className="reset-password-form">
            <div className="input-wrapper" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type={showPasswords ? 'text' : 'password'}
                id="new-password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="input"
                required
                style={{ flex: 1 }}
              />
              <button
                type="button"
                aria-label={showPasswords ? 'Hide passwords' : 'Show passwords'}
                onClick={() => setShowPasswords((s) => !s)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
              >
                {showPasswords ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 3L21 21" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10.58 10.58C10.2 10.95 10 11.44 10 12C10 13.66 11.34 15 13 15c.56 0 1.05-.2 1.42-.58" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14.12 14.12C15.06 13.18 15.6 12.13 15.6 12c0-2.21-1.79-4-4-4-.13 0-1.18.54-2.12 1.48" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2.5 12C3.9 7.5 7.7 4 12 4c1.39 0 2.71.26 3.95.74" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="12" r="3" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
            </div>

            {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}

            <button type="submit" className="change-password-button" disabled={loading}>
              {loading ? 'Changing Password...' : 'Change Password'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ResetPassword;
