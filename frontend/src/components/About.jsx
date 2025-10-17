import React, { useState, useEffect } from 'react';
import '../styles/About.css';
import ComputerLogo from '../assets/LOGO.png';
import ComputerLogo1 from '../assets/LOGO1.png';

function About() {
  const [activeLink, setActiveLink] = useState('/about');

  useEffect(() => {
    setActiveLink(window.location.pathname);
  }, []);

  const handleNavClick = (path) => {
    setActiveLink(path);
    window.location.href = path; 
  };

  return (
    <div className="about">
      <header className="top-bar-about">
        <div className="logo-and-nav">
          <div className="logo">
            <img src={ComputerLogo1} alt="PC LOGO" className="computer-logo" />
            <span className="logo-text">OpenPC</span>
            <span className="logo-line">|</span>
          </div>
          <nav className="nav-links-about">
            <a 
              href="/" 
              className={`nav-link-about ${activeLink === '/' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('/');
              }}
            >
              Home
            </a>
            <a 
              href="/about" 
              className={`nav-link-about ${activeLink === '/about' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('/about');
              }}
            >
              About
            </a>
            <a 
              href="/services" 
              className={`nav-link-about ${activeLink === '/services' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('/services');
              }}
            >
              Services
            </a>
          </nav>
        </div>
        <div className="auth-buttons">
          <button className="btn-login" onClick={() => window.location.href = '/login'}>Login</button>
          <button className="btn-signup" onClick={() => window.location.href = '/signup'}>Sign Up</button>
        </div>
      </header>
      <main className="main-container-about">
        <section className="about-section">
          <div className="about-header-box">
            <div className="about-header">
              <h1 className="about-title">
                OpenPC
                <span className="about-logo-wrapper">
                  <img src={ComputerLogo} alt="Computer Logo" className="computer-logo-about" />
                </span>
              </h1>
            </div>
            <p className="about-description">
              A web-based computer monitoring and management system designed to assist computer laboratory auditors in efficiently tracking and maintaining computer units. Our platform provides a smarter, faster, and more reliable way to monitor the operational status of each computer within a lab environment.
              We aim to eliminate manual record keeping and provide real-time visibility of computer conditions — whether a unit is functional, requires maintenance, or is out of order.
            </p>
          </div>
          <div className="cards-container-about">
            <div className="card-about">
              <h2 className="card-title-about">Our Mission</h2>
              <p className="card-description-about">
                Ensure secure access for every user. The system provides role-based login for auditors,
                technicians, and administrators, granting each role specific permissions and functionalities
                to maintain data integrity and accountability.
              </p>
            </div>
            <div className="card-about">
              <h2 className="card-title-about">Our Vision</h2>
              <p className="card-description-about">
                Provides a centralized and real-time overview of all computer units within the laboratory.
                Through this service, auditors can easily identify the operational status of each workstation,
                whether it is functional, under maintenance, or out of order.
              </p>
            </div>
            <div className="card-about">
              <h2 className="card-title-about">Core Values</h2>
              <p className="card-description-about">
                Serves as a digital inventory database, storing essential information such as computer ID,
                laboratory location, hardware specifications, operating system, and current status of each unit.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default About;