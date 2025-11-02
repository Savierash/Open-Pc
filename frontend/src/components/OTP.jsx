import React, { useState, useEffect } from 'react';
import api from '../api';
import axios from 'axios';
import '../styles/OTP.css';
import { useNavigate, useLocation } from 'react-router-dom';
import ComputerLogo1 from '../assets/LOGO1.png';

const apiBase = import.meta.env.VITE_APP_API_URL || 'http://localhost:5000';

const OTP = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [activeLink, setActiveLink] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location.pathname]);

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    if (element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  const code = otp.join('');

  try {
    const res = await axios.post(`${apiBase}/api/auth/verify-otp`, { email, otp: code });


    console.log('✅ OTP verification success:', res.data);

    // ✅ Save token + user object
    const { token, user } = res.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    alert('✅ Your account has been successfully verified!');

    // Redirect based on user role
    switch (user.role) {
      case 'technician':
        navigate('/Dashboard-technician');
        break;
      case 'auditor':
        navigate('/Dashboard');
        break;
      case 'admin':
        navigate('/Dashboard-Admin');
        break;
      default:
        navigate('/');
    }

  } catch (err) {
    console.error('❌ OTP verification failed:', err);
    setError(err.response?.data?.message || 'OTP verification failed');
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
        <div className="nav-actions"></div>
      </header>

      <main className="main">
        <h1 className="welcome-title">Get started with your account</h1>

        <div className="otp-container">
          <form onSubmit={handleSubmit} className="otp-form">
            <div className="otp-input-fields">
              {otp.map((data, index) => (
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
              ))}
            </div>
            <p className="otp-instruction">Check your email for the verification code</p>

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
