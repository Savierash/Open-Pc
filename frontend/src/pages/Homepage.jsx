import React, { useState, useEffect } from 'react';
import '../styles/Homepage.css';
import ComputerLogo1 from '../assets/LOGO1.png';
import ComputerLogo from '../assets/LOGO.png';
import DashboardBackground from '../assets/Dashboard page 4.png';

const Homepage = () => {
  const [activeLink, setActiveLink] = useState('/');

  useEffect(() => {
    setActiveLink(window.location.pathname);
  }, []);

  const handleNavClick = (path) => {
    setActiveLink(path);
    window.location.href = path;
  };

  return (
    <div className="homepage">
      <header className="top-bar-homepage">
        <div className="logo-and-nav">
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
        </div>
        <div className="nav-actions">
          <button className="btn-login" onClick={() => window.location.href = '/login'}>Login</button>
          <button className="btn-signup" onClick={() => window.location.href = '/signup'}>Sign Up</button>
        </div>
      </header>

      <main className="content">
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title0">
              <span className="hero-logo-wrapper">
                <img src={ComputerLogo} alt="PC LOGO" className="hero-computer-logo" />
              </span>
              OpenPC
            </h1>
            <h1 className="hero-title1">Monitor Smarter.</h1>
            <p className="hero-subtitle">Computer Monitoring and Management System.</p>
          </div>
        </section>
        <button className="hero-button" onClick={() => window.location.href ='/signup'}>Get Started</button>
        <div className="dashboard-background-overlay">
          {/* The background image will be applied via CSS */}
        </div>
        <div className="dashboard-background-overlay-right">
          {/* The background image for the right side will be applied via CSS */}
        </div>
      </main>
    </div>
  );
};

export default Homepage;