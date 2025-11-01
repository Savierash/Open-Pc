// src/components/Pending.jsx
import React, { useState, useEffect } from 'react';
import '../styles/Pending.css';
import { useNavigate, useLocation } from 'react-router-dom';
import ComputerLogo1 from '../assets/LOGO1.png';
import MissionLogo from '../assets/mission_logo.png';
import WifiLogo from '../assets/wifi_logo.png';
import ChatLogo from '../assets/chat_logo.png';
import BroadcastLogo from '../assets/broadcast_logo.png';
import ToolsLogo from '../assets/tools_logo.png';

const Pending = () => {
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
    <div className="pending">
      <header className="top-bar-pending">
        <div className="logo-and-nav">
          <div className="logo">
            <img src={ComputerLogo1} alt="PC LOGO" className="computer-logo" />
            <span className="logo-text">OpenPC</span>
            <span className="logo-line">|</span>
          </div>
          <nav className="nav-links-pending">
            <a
              className={`nav-link-pending ${activeLink === '/' ? 'active' : ''}`}
              onClick={() => handleNavClick('/')}
            >
              Home
            </a>
            <a
              className={`nav-link-pending ${activeLink === '/about' ? 'active' : ''}`}
              onClick={() => handleNavClick('/about')}
            >
              About
            </a>
            <a
              className={`nav-link-pending ${activeLink === '/services' ? 'active' : ''}`}
              onClick={() => handleNavClick('/services')}
            >
              Services
            </a>
          </nav>
        </div>
      </header>

      {/* Background decorative logos */}
      <img src={WifiLogo} alt="" className="bg-logo bg-logo-top-left" />
      <img src={ChatLogo} alt="" className="bg-logo bg-logo-top-right" />
      <img src={BroadcastLogo} alt="" className="bg-logo bg-logo-bottom-left" />
      <img src={ToolsLogo} alt="" className="bg-logo bg-logo-bottom-right" />

      <main className="main-pending">
        <h1 className="pending-title">PENDING REQUEST</h1>
        <p className="pending-subtitle">Waiting for Approval...</p>
        
        <div className="pending-icon-container">
          <img src={MissionLogo} alt="Loading" className="pending-logo" />
        </div>
      </main>
    </div>
  );
};

export default Pending;
