import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Role.css';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import ComputerLogo1 from '../assets/LOGO1.png';
import AuditorButton from '../assets/AUDITOR BUTTON.png'; // Import Auditor image
import TechButton from '../assets/TECH BUTTON.png';     // Import Tech image

const apiBase = import.meta.env.VITE_APP_API_URL || 'http://localhost:5000';

const Role = () => {
  const [activeLink, setActiveLink] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location.pathname]);

  const handleNavClick = (path) => {
    navigate(path);
  };

  return (
    <div className="role-page">
      <header className="top-bar-role">
        <div className="logo-and-nav">
          <div className="logo">
            <img src={ComputerLogo1} alt="PC LOGO" className="computer-logo" />
            <span className="logo-text">OpenPC</span>
            <span className="logo-line">|</span>
          </div>
          <nav className="nav-links-role">
            <a
              className={`nav-link-role ${activeLink === '/' ? 'active' : ''}`}
              onClick={() => handleNavClick('/')}
            >
              Home
            </a>
            <a
              className={`nav-link-role ${activeLink === '/about' ? 'active' : ''}`}
              onClick={() => handleNavClick('/about')}
            >
              About
            </a>
            <a
              className={`nav-link-role ${activeLink === '/services' ? 'active' : ''}`}
              onClick={() => handleNavClick('/services')}
            >
              Services
            </a>
          </nav>
        </div>
        <div className="nav-actions">
          
        </div>
      </header>

      <main className="main-role">
        <h1 className="welcome-title-role">Get started with your role</h1>

        <div className="role-selection-container">
          <img src={AuditorButton} alt="Auditor" className="role-image" />
          <img src={TechButton} alt="Tech" className="role-image" />
        </div>

        <button type="button" className="create-account-button-role">
          Create Account
        </button>
      </main>
    </div>
  );
};

export default Role;
