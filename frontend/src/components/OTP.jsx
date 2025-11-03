import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; // ✅ import context
import axios from 'axios';
import '../styles/OTP.css';
import { useNavigate, useLocation } from 'react-router-dom';
import ComputerLogo1 from '../assets/LOGO1.png';
import WifiLogo from '../assets/wifi_logo.png';
import ChatLogo from '../assets/chat_logo.png';
import BroadcastLogo from '../assets/broadcast_logo.png';
import ToolsLogo from '../assets/tools_logo.png';

const apiBase = import.meta.env.VITE_APP_API_URL || 'http://localhost:5000';

const OTP = () => {
  const { login } = useAuth(); // ✅ use login only
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
    if (isNaN(element.value)) return;
    setOtp((prev) => prev.map((d, idx) => (idx === index ? element.value : d)));
    if (element.nextSibling) element.nextSibling.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const code = otp.join('');

    try {
      const res = await axios.post(`${apiBase}/api/auth/verify-otp`, { email, otp: code });

      console.log('✅ OTP verification success:', res.data);

      const { token, user } = res.data;

      // ✅ Save token + user using context
      login(user, token);

      alert('✅ Your account has been successfully verified!');

      // ✅ Redirect based on role
      const roleKey =
        typeof user?.role === 'string'
          ? user.role.toLowerCase()
          : user.role?.key?.toLowerCase();

      switch (roleKey) {
        case 'technician':
          navigate('/dashboard-technician');
          break;
        case 'auditor':
          navigate('/dashboard');
          break;
        case 'admin':
          navigate('/dashboard-admin');
          break;
        default:
          console.warn(`⚠️ Unknown role: ${roleKey}, redirecting home...`);
          navigate('/');
      }

    } catch (err) {
      console.error('❌ OTP verification failed:', err);
      setError(err.response?.data?.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleNavClick = (path) => navigate(path);

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
      </header>

      {/* Background decorative logos */}
      <img src={WifiLogo} alt="" className="bg-logo bg-logo-top-left" />
      <img src={ChatLogo} alt="" className="bg-logo bg-logo-top-right" />
      <img src={BroadcastLogo} alt="" className="bg-logo bg-logo-bottom-left" />
      <img src={ToolsLogo} alt="" className="bg-logo bg-logo-bottom-right" />

      <main className="main">
        <h1 className="welcome-title">Verify Your Account</h1>

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
