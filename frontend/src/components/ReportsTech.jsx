import React, { useState, useEffect } from 'react';
import '../styles/ReportsTech.css';
import ComputerLogo1 from '../assets/LOGO1.png';
import PersonLogo from '../assets/Person.png';

const ReportsTech = () => {
  const [activeLink, setActiveLink] = useState(window.location.pathname);

  useEffect(() => {
    setActiveLink(window.location.pathname);
  }, []);

  const handleNavClick = (path) => {
    setActiveLink(path);
    window.location.href = path;
  };

  return (
    <div className="reports-page">
      <header className="top-bar">
        <div className="logo-and-nav">
          <div className="logo">
            <img src={ComputerLogo1} alt="PC LOGO" className="computer-logo" />
            <span className="logo-text">OpenPC</span>
            <span className="logo-line">|</span>
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
            <a 
              href="/reports-tech" 
              className={`nav-link ${activeLink === '/reports-tech' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('/reports-tech');
              }}
            >
              Reports
            </a>
          </nav>
        </div>
        <div className="nav-actions">
          <img 
            src={PersonLogo} 
            alt="Profile Icon" 
            className="profile-icon"
          />
        </div>
      </header>

      <div className="reports-content">
        <div className="left-column">
          <div className="card computer-identification">
            <h3>Computer Identification & Lab</h3>
            <input type="text" placeholder="Assets Tag/ID"/>
            <input type="text" placeholder="Location"/>
            <label>Location</label>
            <div className="location-cards-container">
              <div className="location-card">PTC 300</div>
              <div className="location-card">ITS 201</div>
            </div>
          </div>
        </div>

        <div className="middle-column">
          <div className="card report-details">
            <input type="text" />
            <label>Subject</label>
            <input type="text" />
            <label>Detailed Description</label>
            <textarea placeholder="Describe The issue, When to start..."></textarea>
            <div className="send-report-button-wrapper">
              <button className="send-report-btn">Send Report</button>
            </div>
          </div>
          <div className="card empty-card-1"></div>
        </div>

        <div className="right-column">
          <div className="card report-details">
            <h3>Report Details</h3>
            <input type="text" placeholder=""/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsTech;
