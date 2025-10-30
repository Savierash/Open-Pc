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
  try {
    const code = otp.join('');
    console.log('📩 Submitting OTP:', code);

    const res = await axios.post('http://localhost:5000/api/auth/verify-otp', {
      email,
      otp: code,
    });
    console.log(response.data.message);
    alert('✅ OTP has been sent to your email.');

    console.log('✅ OTP verification success:', res.data);
    const userRole = res.data.user.role;

    if (userRole === 'technician') navigate('/Dashboard-Technician');
    else if (userRole === 'auditor') navigate('/Dashboard-Auditor');
    else if (userRole === 'admin') navigate('/Dashboard-Admin');
    else navigate('/');

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
