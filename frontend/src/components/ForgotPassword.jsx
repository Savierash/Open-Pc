import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/ForgotPassword.css';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import ComputerLogo1 from '../assets/LOGO1.png';
import PersonLogo from '../assets/Person.png';
import LockLogo from '../assets/Lock.png';
import WifiLogo from '../assets/wifi_logo.png';
import ChatLogo from '../assets/chat_logo.png';
import BroadcastLogo from '../assets/broadcast_logo.png';
import ToolsLogo from '../assets/tools_logo.png';

const apiBase = import.meta.env.VITE_APP_API_URL || 'http://localhost:5000';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [activeLink, setActiveLink] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { sendOtp } = useAuth();

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location.pathname]);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
  // Send request to backend to send OTP
  const response = await sendOtp(email);
  console.log(response);
  alert('✅ OTP has been sent to your email.');
  // Navigate to the OTP page (you can pass email to verify later)
  navigate('/forgot-password-otp', { state: { email } });
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

      {/* Background decorative logos */}
      <img src={WifiLogo} alt="" className="bg-logo bg-logo-top-left" />
      <img src={ChatLogo} alt="" className="bg-logo bg-logo-top-right" />
      <img src={BroadcastLogo} alt="" className="bg-logo bg-logo-bottom-left" />
      <img src={ToolsLogo} alt="" className="bg-logo bg-logo-bottom-right" />

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
