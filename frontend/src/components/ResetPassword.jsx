import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import '../styles/ResetPassword.css';
import ComputerLogo1 from '../assets/LOGO1.png';
import LockLogo from '../assets/Lock.png';

const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

      <main className="main">
        <h1 className="welcome-title">Reset your password</h1>

        <div className="reset-password-container">
          <form onSubmit={handleSubmit} className="reset-password-form">
            <div className="input-wrapper">
              <input
                type="password"
                id="new-password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="input"
                required
              />
              <img src={LockLogo} alt="Lock icon" className="input-icon" />
            </div>

            <div className="input-wrapper">
              <input
                type="password"
                id="confirm-password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input"
                required
              />
              <img src={LockLogo} alt="Lock icon" className="input-icon" />
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
