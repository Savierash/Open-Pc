import React, { useState, useEffect } from 'react';
import ComputerLogo from '../assets/LOGO.png';

const Services = () => {
  const [activeLink, setActiveLink] = useState('/dashboard'); // Default to Dashboard as active

  useEffect(() => {
    // Set initial active link based on current URL path
    setActiveLink(window.location.pathname);
  }, []);

  const handleNavClick = (path) => {
    setActiveLink(path);
    window.location.href = path; // Navigate to the path
  };

  return (
    <div className="services">
      {/* Top Navigation Bar */}
      <header className="top-bar">
        <div className="logo">
           <img src={ComputerLogo} alt="PC LOGO" className="computer-logo" />
          <span className="logo-text">OpenPC</span>
        </div>
        <nav className="nav-links">
          <a 
            href="/" 
            className={`nav-link ${activeLink === '/' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('/');
            }}
          >
            Home
          </a>
          <a 
            href="/services" 
            className={`nav-link ${activeLink === '/services' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('/services');
            }}
          >
            Services
          </a>
          <a 
            href="/faq" 
            className={`nav-link ${activeLink === '/faq' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('/faq');
            }}
          >
            FAQs
          </a>
          <a 
            href="/dashboard" 
            className={`nav-link ${activeLink === '/dashboard' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('/dashboard');
            }}
          >
            Dashboard
          </a>
        </nav>
        <div className="auth-buttons">
          <button className="auth-btn login" onClick={() => window.location.href = '/login'}>Login</button>
          <button className="auth-btn signup" onClick={() => window.location.href = '/signup'}>Sign Up</button>
        </div>
      </header>
      </div>
  );
};

export default Services;