// src/pages/Homepage.jsx
import React, { useState, useEffect } from 'react';
import '../styles/Homepage.css';
import ComputerLogo from '../assets/LOGO.png';
import ComputerLogo1 from '../assets/LOGO1.png';

const Navbar = () => {
  const [activeLink, setActiveLink] = useState('/');

  useEffect(() => {
    setActiveLink(window.location.pathname);
  }, []);

  const handleNavClick = (path) => {
    setActiveLink(path);
    window.location.href = path;
  };

  return (
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
          onClick={(e) => { e.preventDefault(); handleNavClick('/'); }}
        >
          Home
        </a>
        <a
          href="/about"
          className={`nav-link-homepage ${activeLink === '/about' ? 'active' : ''}`}
          onClick={(e) => { e.preventDefault(); handleNavClick('/about'); }}
        >
          About
        </a>
        <a
          href="/services"
          className={`nav-link-homepage ${activeLink === '/services' ? 'active' : ''}`}
          onClick={(e) => { e.preventDefault(); handleNavClick('/services'); }}
        >
          Services
        </a>
      </nav>

      <div className="nav-actions">
        <button className="btn-login" onClick={() => (window.location.href = '/login')}>Login</button>
        <button className="btn-signup" onClick={() => (window.location.href = '/signup')}>Sign Up</button>
      </div>
    </header>
  );
};

const Homepage = () => {
  return (
    // wrapper uses the .homepage class (gives the background gradient)
    <div className="homepage">
      <Navbar />

      <main className="content">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title0">
              OpenPC
              <span className="hero-logo-wrapper">
                <img src={ComputerLogo} alt="PC LOGO" className="hero-computer-logo" />
              </span>
            </h1>
            <h2 className="hero-title1">Monitor Smarter.</h2>
            <p className="hero-subtitle">Computer Monitoring and Management System.</p>

            <div style={{ display: 'flex', gap: 12 }}>
              <button
                className="hero-button"
                onClick={() => (window.location.href = '/signup')}
              >
                Get Started
              </button>
              <button
                className="hero-button"
                onClick={() => (window.location.href = '/login')}
                style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)' }}
              >
                Learn More
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Homepage;
