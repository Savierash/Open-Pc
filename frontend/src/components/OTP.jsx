import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/OTP.css';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import ComputerLogo1 from '../assets/LOGO1.png';
import PersonLogo from '../assets/Person.png';
import LockLogo from '../assets/Lock.png';

const apiBase = import.meta.env.VITE_APP_API_URL || 'http://localhost:5000';

const OTP = () => {
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
      // Here you would typically send the OTP to your backend for verification
      // For now, let's just simulate a successful verification
      console.log('OTP submitted:', otp.join(''));
      // if (otp.join('') === '123456') { // Example hardcoded OTP
      //   navigate('/dashboard');
      // } else {
      //   setError('Invalid OTP');
      // }
      navigate('/'); // Redirect to homepage after successful OTP verification (placeholder)
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
    <div className="otp-page">
      <header className="top-bar-otp">
        <div className="logo-and-nav">
          <div className="logo">
            <img src={ComputerLogo1} alt="PC LOGO" className="computer-logo" />
            <span className="logo-text">OpenPC</span>
            <span className="logo-line">|</span>
          </div>
          <nav className="nav-links-otp">
            <a
              className={`nav-link-otp ${activeLink === '/' ? 'active' : ''}`}
              onClick={() => handleNavClick('/')}
            >
              Home
            </a>
            <a
              className={`nav-link-otp ${activeLink === '/about' ? 'active' : ''}`}
              onClick={() => handleNavClick('/about')}
            >
              About
            </a>
            <a
              className={`nav-link-otp ${activeLink === '/services' ? 'active' : ''}`}
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
        <h1 className="welcome-title">Get started with your account</h1>

        <div className="otp-container">
          <form onSubmit={handleSubmit} className="otp-form">
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

            <button type="submit" className="create-account-button" disabled={loading}>
              {loading ? 'Verifying...' : 'Create Account'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default OTP;
