import React, { useState, useEffect } from 'react';
import '../styles/Homepage.css';
import ComputerLogo1 from '../assets/LOGO1.png';
import ComputerLogo from '../assets/LOGO.png';

const Homepage = () => {
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
    <div className="homepage">
      {/* Top Navigation Bar */}
      <header className="top-bar-homepage">
        <div className="logo">
           <img src={ComputerLogo1} alt="PC LOGO" className="computer-logo" />
          <span className="logo-text">OpenPC</span>
          <span className="logo-line">|</span>
        </div>
        <nav className="nav-links-homepage">
          <a 
            href="/" 
            className={`nav-link-homepage ${activeLink === '/' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('/');
            }}
          >
            Home
          </a>
          <a 
            href="/about" 
            className={`nav-link-homepage ${activeLink === '/about' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('/about');
            }}
          >
            About
          </a>
          <a 
            href="/services" 
            className={`nav-link-homepage ${activeLink === '/services' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('/services');
            }}
          >
            Services
          </a>
        </nav>
        <div className="nav-actions">
          <button className="btn-login" onClick={() => window.location.href = '/login'}>Login</button>
          <button className="btn-signup" onClick={() => window.location.href = '/signup'}>Sign Up</button>
        </div>
      </header>

      <main className="content">
        {/* Hero Section from the image */}
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title0">OpenPC<span className="hero-computer-logo"><img src={ComputerLogo} alt="PC LOGO" className="hero-computer-logo" /></span></h1>
            <h1 className="hero-title1">Monitor Smarter.</h1>
            <p className="hero-subtitle">Computer Monitoring and Management System.</p>
            <button className="hero-button">Get Started</button>
          </div>
        </section>
      </main>
    </div>
  );
};


export default Homepage;