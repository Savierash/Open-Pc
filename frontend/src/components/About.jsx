import React, { useState } from 'react';
import '../styles/About.css';
import ComputerLogo from '../assets/LOGO.png';
import ComputerLogo1 from '../assets/LOGO1.png';

function About() {
  const [activeLink, setActiveLink] = useState('/about');

  const handleNavClick = (path) => {
    setActiveLink(path);
    window.location.href = path; 

  };

  return (
      <div className="about">
        {/* Top Navigation Bar */}
        <header className="top-bar-about">
          <div className="logo">
             <img src={ComputerLogo1} alt="PC LOGO" className="computer-logo" />
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
              href="/about" 
              className={`nav-link ${activeLink === '/about' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('/about');
              }}
            >
              About
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
          </nav>
        <div className="auth-buttons">
          <button className="btn-login" onClick={() => window.location.href = '/login'}>Login</button>
          <button className="btn-signup" onClick={() => window.location.href = '/signup'}>Sign Up</button>
        </div>
      </header>
      <main className="main-content">
        <div className="hero-section">
          <h1 className="title">
            <h1 className="pc-text">OpenPC<span className="hero-computer-logo"><img src={ComputerLogo} alt="PC LOGO" className="hero-computer-logo" /></span></h1>
          </h1>
          <p className="subtitle">
            OpenPC is a innovative web-based platform dedicated to revolutionizing computer lab management. Founded in 2023, our mission is to empower educators and IT administrators with cutting-edge tools for seamless oversight and maintenance.
          </p>
          <p className="description">
            Our team of developers and domain experts brings years of experience in software engineering and educational technology. We are committed to continuous improvement, ensuring our system evolves with the needs of modern learning environments.
          </p>
        </div>
      </main>
    </div>
  );
}

export default About;