import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/ForgotPasswordOTP.css';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import ComputerLogo1 from '../assets/LOGO1.png';
import PersonLogo from '../assets/Person.png';
import LockLogo from '../assets/Lock.png';

const apiBase = import.meta.env.VITE_APP_API_URL || 'http://localhost:5000';

const ForgotPasswordOTP = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [activeLink, setActiveLink] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location.pathname]);

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
    if (element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      console.log('OTP submitted for Forgot Password:', otp.join(''));
      // Here, integrate with your backend to verify the OTP for password reset
      // On success, navigate to the ResetPassword page
      navigate('/reset-password'); 
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || 'OTP verification failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleNavClick = (path) => {
    navigate(path);
  };

  return (
    <div className="forgot-password-otp-page">
      <header className="top-bar-forgot-password-otp">
        <div className="logo-and-nav">
          <div className="logo">
            <img src={ComputerLogo1} alt="PC LOGO" className="computer-logo" />
            <span className="logo-text">OpenPC</span>
            <span className="logo-line">|</span>
          </div>
          <nav className="nav-links-forgot-password-otp">
            <a
              className={`nav-link-forgot-password-otp ${activeLink === '/' ? 'active' : ''}`}
              onClick={() => handleNavClick('/')}
            >
              Home
            </a>
            <a
              className={`nav-link-forgot-password-otp ${activeLink === '/about' ? 'active' : ''}`}
              onClick={() => handleNavClick('/about')}
            >
              About
            </a>
            <a
              className={`nav-link-forgot-password-otp ${activeLink === '/services' ? 'active' : ''}`}
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

        <div className="forgot-password-otp-container">
          <form onSubmit={handleSubmit} className="forgot-password-otp-form">
            <div className="otp-input-fields">
              {otp.map((data, index) => {
                return (
                  <input
                    type="text"
                    name="otp"
                    maxLength="1"
                    key={index}
                    value={data}
                    onChange={(e) => handleOtpChange(e.target, index)}
                    onFocus={(e) => e.target.select()}
                    className="otp-input"
                  />
                );
              })}
            </div>
            <p className="otp-instruction">Check Your Email for the verification code</p>

            {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}

            <button type="submit" className="continue-button" disabled={loading}>
              {loading ? 'Verifying...' : 'Continue'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ForgotPasswordOTP;
