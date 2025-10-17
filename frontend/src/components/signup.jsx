import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Signup.css';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import ComputerLogo1 from '../assets/LOGO1.png';
import PersonLogo from '../assets/Person.png';
import LockLogo from '../assets/Lock.png';

const apiBase = import.meta.env.VITE_APP_API_URL || 'http://localhost:5000';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${apiBase}/api/auth/register`, {
        email,
        username,
        password,
        confirmPassword
      });
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      window.location.href = '/';
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || 'Signup failed';
      setError(msg);
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

      <main className="main">
        <h1 className="welcome-title">Get started with your account</h1>

        <div className="signup-container">
          <form onSubmit={handleSubmit} className="signup-form">
            <div className="input-wrapper">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="Enter your email"
                required
              />
              <img src={PersonLogo} alt="Email icon" className="input-icon" />
            </div>

            <div className="input-wrapper">
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input"
                placeholder="Enter your username"
                required
              />
              <img src={PersonLogo} alt="Username icon" className="input-icon" />
            </div>

            <div className="input-wrapper">
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="Enter your password"
                required
              />
              <img src={LockLogo} alt="Password icon" className="input-icon" />
            </div>

            <div className="input-wrapper">
              <input
                type="password"
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input"
                placeholder="Confirm your password"
                required
              />
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
