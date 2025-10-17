import React, { useState, useEffect } from 'react';
import '../styles/Services.css';
import ComputerLogo1 from '../assets/LOGO1.png';
import StackLogo from '../assets/Stack.png';
import ShieldLogo from '../assets/ShieldLockFill.png';
import ArchiveLogo from '../assets/ArchiveFill.png';

const Services = () => {
  const [activeLink, setActiveLink] = useState('/services');

  useEffect(() => {
    setActiveLink(window.location.pathname);
  }, []);

  const handleNavClick = (path) => {
    setActiveLink(path);
    window.location.href = path; 
  };

  return (
    <div className="services">
      <header className="top-bar-services">
        <div className="logo-and-nav">
          <div className="logo">
            <img src={ComputerLogo1} alt="PC LOGO" className="computer-logo" />
            <span className="logo-text">OpenPC</span>
            <span className="logo-line">|</span>
          </div>
          <nav className="nav-links-services">
            <a 
              href="/" 
              className={`nav-link-services ${activeLink === '/' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('/');
              }}
            >
              Home
            </a>
            <a 
              href="/about" 
              className={`nav-link-services ${activeLink === '/about' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('/about');
              }}
            >
              About
            </a>
            <a 
              href="/services" 
              className={`nav-link-services ${activeLink === '/services' ? 'active' : ''}`}
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
      <main className="main">
        <section className="services-section">
          <div className="services-header-box">
            <div className="services-header">
              <img src={StackLogo} alt="Stack Logo" className="stack-logo" />
              <h1 className="services-title">Our Services</h1>
            </div>
            <p className="services-description">
              At OpenPC, we provide a smarter and more efficient way to manage computer laboratories.
              Our web-based system is designed to assist auditors, administrators, and IT staff in monitoring,
              maintaining, and organizing computer units – all in one centralized platform.
            </p>
          </div>
          <div className="cards-container">
            <div className="card-service">
              <div className="card-header">
                <img src={ShieldLogo} alt="Shield Logo" className="shield-logo" />
                <h2 className="card-title">User Management Service</h2>
              </div>
              <p className="card-description">
                Ensure secure access for every user. The system provides role-based login for auditors,
                technicians, and administrators, granting each role specific permissions and functionalities
                to maintain data integrity and accountability.
              </p>
            </div>
            <div className="card-service">
              <div className="card-header">
                <h2 className="card-title">Computer Status Monitoring Service</h2>
              </div>
              <p className="card-description">
                 Provides a centralized and real-time overview of all computer units within the laboratory. Through this service, auditors can easily identify the operational status of each workstation, whether it is functional, under maintenance, or out of order.
              </p>
            </div>
            <div className="card-service">
              <div className="card-header">
                <img src={ArchiveLogo} alt="Archive Logo" className="archive-logo" />
                <h2 className="card-title">Inventory Management Service</h2>
              </div>
              <p className="card-description">
                Serves as a digital inventory database, storing essential information such as the computer ID, laboratory location, hardware specifications, operating system, and current status of each unit.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Services;