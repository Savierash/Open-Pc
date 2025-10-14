import React, { useState, useEffect } from 'react';
import '../styles/Login.css';
import ComputerLogo1 from '../assets/LOGO1.png';
import LockLogo from '../assets/Lock.png';
import PersonLogo from '../assets/Person.png';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [activeLink, setActiveLink] = useState(''); // No default active for login page

  useEffect(() => {
    // Set initial active link based on current URL path
    setActiveLink(window.location.pathname);
  }, []);

  const handleNavClick = (path) => {
    setActiveLink(path);
    // Enable navigation for better UX
    window.location.href = path;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login attempt:', { username, password });
  };

  const handleSignupClick = () => {
    window.location.href = '/signup';
  };

  const handleForgotPasswordClick = () => {
    window.location.href = '/forgot-password'; // Assuming a forgot password route
  };

  return (
    <div className="login">
      {/* Navigation Bar */}
      <header className="top-bar-login">
        <div className="logo">
          <img src={ComputerLogo1} alt="PC LOGO" className="computer-logo" />
          <span className="logo-text">OpenPC</span>
          <span className="logo-line">|</span>
        </div>
        <nav className="nav-links-login">
          <a 
            href="/" 
            className={`nav-link-login ${activeLink === '/' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('/');
            }}
          >
            Home
          </a>
          <a 
            href="/about" 
            className={`nav-link-login ${activeLink === '/about' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('/about');
            }}
          >
            About
          </a>
          <a 
            href="/services" 
            className={`nav-link-login ${activeLink === '/services' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('/services');
            }}
          >
            Services
          </a>
        </nav>
        <div className="nav-actions">
          <button className="btn-signup" onClick={handleSignupClick}>Sign Up</button>
        </div>
      </header>

      {/* Login Form */}
      <main className="main">
        <h1 className="welcome-title">Good to see you again</h1>
        <div className="login-container">
          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-wrapper">
              <input
                type="text"
                id="username"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input"
                required
              />
              <img src={PersonLogo} alt="User icon" className="input-icon" />
            </div>
            <div className="input-wrapper">
              <input
                type="password"
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                required
              />
              <img src={LockLogo} alt="Lock icon" className="input-icon" />
            </div>
            <button type="submit" className="login-button">
              Login
            </button>
          </form>
          <div className="links-container">
            <a href="#" className="link" onClick={(e) => { e.preventDefault(); handleSignupClick(); }}>
              Don't have an account?
            </a>
            <a href="#" className="link" onClick={(e) => { e.preventDefault(); handleForgotPasswordClick(); }}>
              Forgot Password?
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;