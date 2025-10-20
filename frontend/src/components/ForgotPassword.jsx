import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/ForgotPassword.css';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import ComputerLogo1 from '../assets/LOGO1.png';
import PersonLogo from '../assets/Person.png';
import LockLogo from '../assets/Lock.png';

const apiBase = import.meta.env.VITE_APP_API_URL || 'http://localhost:5000';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
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
    setLoading(true);
    try {
      // Here you would typically send the email to your backend to initiate password reset
      console.log('Forgot password request submitted for email:', email);
      // Simulate a successful request
      navigate('/forgot-password-otp'); // Redirect to Forgot Password OTP page after successful request (placeholder)
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || 'Password reset request failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleNavClick = (path) => {
    navigate(path);
  };

  return (
    <div className="forgot-password-page">
      <header className="top-bar-forgot-password">
        <div className="logo-and-nav">
          <div className="logo">
            <img src={ComputerLogo1} alt="PC LOGO" className="computer-logo" />
            <span className="logo-text">OpenPC</span>
            <span className="logo-line">|</span>
          </div>
          <nav className="nav-links-forgot-password">
            <a
              className={`nav-link-forgot-password ${activeLink === '/' ? 'active' : ''}`}
              onClick={() => handleNavClick('/')}
            >
              Home
            </a>
            <a
              className={`nav-link-forgot-password ${activeLink === '/about' ? 'active' : ''}`}
              onClick={() => handleNavClick('/about')}
            >
              About
            </a>
            <a
              className={`nav-link-forgot-password ${activeLink === '/services' ? 'active' : ''}`}
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
        <h1 className="welcome-title">Forgotten Your Password?</h1>

        <div className="forgot-password-container">
          <form onSubmit={handleSubmit} className="forgot-password-form">
            <div className="input-group">
              <input
                type="email"
                placeholder="e.g.username123@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="email-input"
                required
              />
            </div>

            {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}

            <button type="submit" className="reset-password-button" disabled={loading}>
              {loading ? 'Sending...' : 'Reset Password'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ForgotPassword;
