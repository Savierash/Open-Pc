import React, { useState, useEffect } from 'react';
import '../styles/Dashboard.css'; 
import ComputerLogo1 from '../assets/LOGO1.png';
import HouseLogo from '../assets/HouseFill.png';
import GraphLogo from '../assets/GraphUp.png';
import PcDisplayLogo from '../assets/PcDisplayHorizontal.png';
import ClipboardLogo from '../assets/ClipboardCheck.png';
import GearLogo from '../assets/GearFill.png';
import OctagonLogo from '../assets/XOctagonFill.png';

const Dashboard = () => {
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
    <div className="dashboard">
      {/* Top Navigation Bar */}
      <header className="top-bar-dashboard">
        <div className="logo">
          <img src={ComputerLogo1} alt="PC LOGO" className="computer-logo" />
          <span className="logo-text">OpenPC</span>
          <span className="logo-line">|</span>
        </div>
        <nav className="nav-links-dashboard">
          <a 
            href="/" 
            className={`nav-link-dashboard ${activeLink === '/' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('/');
            }}
          >
            Home
          </a>
          <a 
            href="/about" 
            className={`nav-link-dashboard ${activeLink === '/about' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('/about');
            }}
          >
            About
          </a>
          <a 
            href="/services" 
            className={`nav-link-dashboard ${activeLink === '/services' ? 'active' : ''}`}
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

      {/* Main Layout */}
      <div className="main-layout">
        {/* Sidebar */}
        <aside className="sidebar">
          <ul className="sidebar-menu">
            <li>
              <img src={HouseLogo} alt="Home Icon" className="menu-icon" />
              <span>Dashboard</span>
            </li>
            <li>
              <img src={GraphLogo} alt="Graph Icon" className="menu-icon" />
              <span>Analytics</span>
            </li>
            <li>
              <img src={PcDisplayLogo} alt="PC Display Icon" className="menu-icon" />
              <span>Total Units</span>
            </li>
            <li>
              <img src={ClipboardLogo} alt="Clipboard Icon" className="menu-icon" />
              <span>Functional</span>
            </li>
            <li>
              <img src={GearLogo} alt="Gear Icon" className="menu-icon" />
              <span>Maintenance</span>
            </li>
            <li>
              <img src={OctagonLogo} alt="Octagon Icon" className="menu-icon" />
              <span>Out of Order</span>
            </li>
          </ul>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          {/* Empty main area; add your dashboard content here */}
          <div className="content-placeholder">
            {/* Placeholder for future dashboard elements */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;