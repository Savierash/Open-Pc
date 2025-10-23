import React, { useState, useEffect } from 'react';
import '../styles/Dashboard.css'; 
import ComputerLogo1 from '../assets/LOGO1.png';
import HouseLogo from '../assets/HouseFill.png';
import GraphLogo from '../assets/GraphUp.png';
import PcDisplayLogo from '../assets/PcDisplayHorizontal.png';
import ClipboardLogo from '../assets/ClipboardCheck.png';
import GearLogo from '../assets/GearFill.png';
import OctagonLogo from '../assets/XOctagonFill.png';
import StackLogo from '../assets/Stack.png';
import PersonLogo from '../assets/Person.png';
import ToolsLogo from '../assets/tools_logo.png'; // Import Tools Logo

const Dashboard = () => {
  const [activeLink, setActiveLink] = useState(window.location.pathname);

  useEffect(() => {
    setActiveLink(window.location.pathname);
  }, []);

  const handleNavClick = (path) => {
    setActiveLink(path);
    window.location.href = path;
  };

  return (
    <div className="dashboard">
      <header className="top-bar-dashboard">
        <div className="logo-and-nav">
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
            <a 
              href="/dashboard" 
              className={`nav-link-dashboard active`}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('/dashboard');
              }}
            >
              Dashboard
            </a>
          </nav>
        </div>
        <div className="nav-actions">
          <img 
            src={PersonLogo} 
            alt="Profile Icon" 
            className="profile-icon-dashboard"
          />
        </div>
      </header>

      <div className="main-layout">
        <aside className="sidebar">
          <ul className="sidebar-menu">
            <li>
              <a 
                href="/dashboard" 
                className={`sidebar-link ${activeLink === '/dashboard' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('/dashboard');
                }}
              >
                <img src={HouseLogo} alt="Home Icon" className="menu-icon" />
                <span>Dashboard</span>
              </a>
            </li>
            <li>
              <a 
                href="/inventory" 
                className={`sidebar-link ${activeLink === '/inventory' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('/inventory');
                }}
              >
                <img src={StackLogo} alt="Inventory Icon" className="menu-icon" />
                <span>Inventory</span>
              </a>
            </li>
            <li>
              <a 
                href="/total-units" 
                className={`sidebar-link ${activeLink === '/total-units' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('/total-units');
                }}
              >
                <img src={PcDisplayLogo} alt="PC Display Icon" className="menu-icon" />
                <span>Total Units</span>
              </a>
            </li>
            <li>
              <a 
                href="/functional" 
                className={`sidebar-link ${activeLink === '/functional' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('/functional');
                }}
              >
                <img src={ClipboardLogo} alt="Clipboard Icon" className="menu-icon" />
                <span>Functional</span>
              </a>
            </li>
            <li>
              <a 
                href="/maintenance" 
                className={`sidebar-link ${activeLink === '/maintenance' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('/maintenance');
                }}
              >
                <img src={GearLogo} alt="Gear Icon" className="menu-icon" />
                <span>Maintenance</span>
              </a>
            </li>
            <li>
              <a 
                href="/out-of-order" 
                className={`sidebar-link ${activeLink === '/out-of-order' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('/out-of-order');
                }}
              >
                <img src={OctagonLogo} alt="Octagon Icon" className="menu-icon" />
                <span>Out of Order</span>
              </a>
            </li>
            <li>
              <a 
                href="/reports-auditor" 
                className={`sidebar-link ${activeLink === '/reports-auditor' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('/reports-auditor');
                }}
              >
                <img src={ClipboardLogo} alt="Reports Icon" className="menu-icon" />
                <span>Reports</span>
              </a>
            </li>
            <li>
              <a 
                href="/technicians" 
                className={`sidebar-link ${activeLink === '/technicians' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('/technicians');
                }}
              >
                <img src={ToolsLogo} alt="Technicians Icon" className="menu-icon" />
                <span>Technicians</span>
              </a>
            </li>
          </ul>
        </aside>

        <main className="main-content">
          <div className="dashboard-main-content">
            
            <div className="dashboard-cards">
              <div className="card total-units">
                <div className="card-header">
                  <img src={PcDisplayLogo} alt="PC Display Icon" className="card-icon" />
                  <h3>Total Units</h3>
                </div>
                <div className="card-body">
                  <p className="stat-number">150</p>
                </div>
              </div>

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
            
            <div className="dashboard-bottom-row">
              <div className="recent-activity-card">
                <h3>Recent Activity</h3>
              </div>
              <div className="system-status-card">
                <h3>System Status</h3>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;