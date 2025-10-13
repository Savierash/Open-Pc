import React, { useState, useEffect } from 'react';
import '../styles/Dashboard.css'; 
import ComputerLogo1 from '../assets/LOGO1.png';
import ComputerLogo from '../assets/LOGO.png';
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
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="logo">
                   <img src={ComputerLogo1} alt="PC LOGO" className="computer-logo" />
          <span>OpenPC</span>
        </div>
        <ul className="nav-menu-dashboard">
          <li>
            <a 
              href="/" 
              className={activeLink === '/' ? 'active' : ''}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('/');
              }}
            >
              Home
            </a>
          </li>
          <li>
            <a 
              href="/about" 
              className={activeLink === '/about' ? 'active' : ''}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('/about');
              }}
            >
              About
            </a>            
          </li>
          <li>
            <a 
              href="/services" 
              className={activeLink === '/services' ? 'active' : ''}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('/services');
              }}
            >
              Services
            </a>
          </li>
        </ul>
        <div className="nav-actions">
          <button className="btn-login" onClick={() => window.location.href = '/login'}>Login</button>
          <button className="btn-signup" onClick={() => window.location.href = '/signup'}>Sign Up</button>
        </div>
      </nav>

      {/* Main Layout */}
      <div className="main-layout">
        {/* Sidebar */}
        <aside className="sidebar">
          <ul className="sidebar-menu">
            <li>
              <img src={HouseLogo} alt="Home Icon" className="home-icon" />
              <span>Dashboard</span>
            </li>
            <li>
              <img src={GraphLogo} alt="Graph Icon" className="graph-icon" />
              <span>Analytics</span>
            </li>
            <li>
              <img src={PcDisplayLogo} alt="PC Display Icon" className="graph-icon" />
              <span>Total Units</span>
            </li>
            <li>
              <img src={ClipboardLogo} alt="Clipboard Icon" className="graph-icon" />
              <span>Functional</span>
            </li>
            <li>
              <img src={GearLogo} alt="Gear Icon" className="graph-icon" />
              <span>Maintenance</span>
            </li>
            <li>
              <img src={OctagonLogo} alt="Octagon Icon" className="graph-icon" />
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