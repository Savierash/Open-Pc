import React, { useState, useEffect } from 'react';
import '../styles/Dashboard.css'; 
import ComputerLogo1 from '../assets/LOGO1.png';
import HouseLogo from '../assets/HouseFill.png';
import GraphLogo from '../assets/GraphUp.png';
import PcDisplayLogo from '../assets/PcDisplayHorizontal.png';
import ClipboardLogo from '../assets/ClipboardCheck.png';
import GearLogo from '../assets/GearFill.png';
import OctagonLogo from '../assets/XOctagonFill.png';
import PersonLogo from '../assets/PersonCircle.png';

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
         <img src={PersonLogo} alt="Person LOGO" className="person-icon" />
      </header>

      {/* Main Layout */}
      <div className="main-layout">
        {/* Sidebar */}
        <aside className="sidebar">
          <ul className="sidebar-menu">
            <li className={activeLink === '/dashboard' ? 'active' : ''}>
              <img src={HouseLogo} alt="Home Icon" className="menu-icon" />
              <span onClick={() => handleNavClick('/dashboard')}>Dashboard</span>
            </li>
            <li className={activeLink === '/analytics' ? 'active' : ''}>
              <img src={GraphLogo} alt="Graph Icon" className="menu-icon" />
              <span onClick={() => handleNavClick('/analytics')}>Analytics</span>
            </li>
            <li className={activeLink === '/total-units' ? 'active' : ''}>
              <img src={PcDisplayLogo} alt="PC Display Icon" className="menu-icon" />
              <span onClick={() => handleNavClick('/total-units')}>Total Units</span>
            </li>
            <li className={activeLink === '/functional' ? 'active' : ''}>
              <img src={ClipboardLogo} alt="Clipboard Icon" className="menu-icon" />
              <span onClick={() => handleNavClick('/functional')}>Functional</span>
            </li>
            <li className={activeLink === '/maintenance' ? 'active' : ''}>
              <img src={GearLogo} alt="Gear Icon" className="menu-icon" />
              <span onClick={() => handleNavClick('/maintenance')}>Maintenance</span>
            </li>
            <li className={activeLink === '/out-of-order' ? 'active' : ''}>
              <img src={OctagonLogo} alt="Octagon Icon" className="menu-icon" />
              <span onClick={() => handleNavClick('/out-of-order')}>Out of Order</span>
            </li>
          </ul>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          <div className="content-placeholder">
            {/* Dashboard Cards */}
            <div className="dashboard-cards">
              {/* Total Units Card */}
              <div className="card total-units">
                <div className="card-header">
                  <img src={PcDisplayLogo} alt="PC Display Icon" className="card-icon" />
                  <h3>Total Units</h3>
                </div>
                <div className="card-body">
                  <p className="stat-number">150</p>
                </div>
              </div>

              {/* Functional Card */}
              <div className="card functional">
                <div className="card-header">
                  <img src={ClipboardLogo} alt="Clipboard Icon" className="card-icon" />
                  <h3>Functional</h3>
                </div>
                <div className="card-body">
                  <p className="stat-number">120 / 150</p>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '80%' }}></div>
                  </div>
                </div>
              </div>

              {/* Out of Order Card */}
              <div className="card out-of-order">
                <div className="card-header">
                  <img src={OctagonLogo} alt="Octagon Icon" className="card-icon" />
                  <h3>Out of Order</h3>
                </div>
                <div className="card-body">
                  <p className="stat-number">30</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;