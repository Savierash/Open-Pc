import React, { useState, useEffect } from 'react';
import '../styles/Signup.css';
import ComputerLogo1 from '../assets/LOGO1.png';
import PersonLogo from '../assets/Person.png';
import LockLogo from '../assets/Lock.png';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [activeLink, setActiveLink] = useState(''); // No default active for signup page

  useEffect(() => {
    // Set initial active link based on current URL path
    setActiveLink(window.location.pathname);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add validation here, e.g., if (password !== confirmPassword) return;
    console.log('Signup submitted:', { email, username, password, confirmPassword });
  };

  const handleNavClick = (path) => {
    setActiveLink(path);
    window.location.href = path;
  };

  return (
    <div className="signup">
      {/* Navigation Bar */}
      <header className="top-bar-signup">
        <div className="logo">
          <img src={ComputerLogo1} alt="PC LOGO" className="computer-logo" />
          <span className="logo-text">OpenPC</span>
          <span className="logo-line">|</span>
        </div>
        <nav className="nav-links-signup">
          <a 
            href="/" 
            className={`nav-link-signup ${activeLink === '/' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('/');
            }}
          >
            Home
          </a>
          <a 
            href="/about" 
            className={`nav-link-signup ${activeLink === '/about' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('/about');
            }}
          >
            About
          </a>
          <a 
            href="/services" 
            className={`nav-link-signup ${activeLink === '/services' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('/services');
            }}
          >
            Services
          </a>
        </nav>
        <div className="nav-actions">
          <button className="btn-login" onClick={() => window.location.href = '/login'}>
            Login
          </button>
        </div>
      </header>  

      {/* Main Content */}
      <main className="main">
        <h1 className="welcome-title">Get started with your account</h1>
        
        <div className="signup-container">
          <form onSubmit={handleSubmit} className="signup-form">
            {/* Email Field */}
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

            {/* Username Field */}
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

            {/* Password Field */}
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

            {/* Confirm Password Field */}
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

            {/* Signup Button */}
            <button type="submit" className="signup-button">
              Signup
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Signup;