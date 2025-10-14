import React, { useState, useEffect } from 'react';
import '../styles/FQs.css';
import ComputerLogo1 from '../assets/LOGO1.png';

const FQs = () => {
  const [activeLink, setActiveLink] = useState('/faq'); // Default to FAQ as active

  useEffect(() => {
    // Set initial active link based on current URL path
    setActiveLink(window.location.pathname);
  }, []);

  const handleNavClick = (path) => {
    setActiveLink(path);
    window.location.href = path; // Navigate to the path
  };

  return (
    <div className="fqs">
      {/* Top Navigation Bar */}
      <header className="top-bar-fqs">
        <div className="logo">
          <img src={ComputerLogo1} alt="PC LOGO" className="computer-logo" />
          <span className="logo-text">OpenPC</span>
          <span className="logo-line">|</span>
        </div>
        <nav className="nav-links-fqs">
          <a 
            href="/" 
            className={`nav-link-fqs ${activeLink === '/' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('/');
            }}
          >
            Home
          </a>
          <a 
            href="/services" 
            className={`nav-link-fqs ${activeLink === '/services' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('/services');
            }}
          >
            Services
          </a>
          <a 
            href="/faq" 
            className={`nav-link-fqs ${activeLink === '/faq' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('/faq');
            }}
          >
            FAQs
          </a>
          <a 
            href="/dashboard" 
            className={`nav-link-fqs ${activeLink === '/dashboard' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('/dashboard');
            }}
          >
            Dashboard
          </a>
        </nav>
        <div className="nav-actions">
          <button className="btn-login" onClick={() => window.location.href = '/login'}>Login</button>
          <button className="btn-signup" onClick={() => window.location.href = '/signup'}>Sign Up</button>
        </div>
      </header>

      <main className="main">
        <section className="faqs-section">
          <div className="faqs-header">
            <h1 className="faqs-title">Frequently Asked Questions</h1>
            <p className="faqs-subtitle">Find answers to common questions about OpenPC</p>
          </div>
          <div className="faqs-container">
            <div className="faq-item">
              <h2 className="faq-question">What is OpenPC?</h2>
              <p className="faq-answer">OpenPC is a web-based computer monitoring and management system designed to assist in tracking and maintaining computer units in lab environments.</p>
            </div>
            <div className="faq-item">
              <h2 className="faq-question">How do I get started?</h2>
              <p className="faq-answer">Sign up for an account and log in to access the dashboard where you can monitor computer status in real-time.</p>
            </div>
            <div className="faq-item">
              <h2 className="faq-question">What features does it offer?</h2>
              <p className="faq-answer">Features include user management, computer status monitoring, and inventory management for efficient lab oversight.</p>
            </div>
            <div className="faq-item">
              <h2 className="faq-question">Is it secure?</h2>
              <p className="faq-answer">Yes, OpenPC uses role-based access control to ensure secure and accountable usage.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default FQs;