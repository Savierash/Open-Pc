import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

const Maintenance = () => {
  const [activeLink, setActiveLink] = useState(window.location.pathname);

  useEffect(() => {
    setActiveLink(window.location.pathname);
  }, []);

  const navigate = useNavigate();

  const handleNavClick = (path) => {
    setActiveLink(path);
    navigate(path);
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
          <div className="page-header-container">
            <button className="back-button" onClick={() => navigate('/dashboard')}>BACK</button>
            <h2 className="page-title" style={{ marginLeft: 'auto' }}>Maintenance Units</h2>
          </div>

          <div className="new-layout-content">
            <div className="horizontal-card">
              <h3>Laboratories</h3>
              {/* Placeholder for laboratories content */}
              <div className="lab-filter-grid">
                <div className="lab-filter-card active">ITS 300</div>
                <div className="lab-filter-card">PTC 201</div>
                <div className="lab-filter-card">MACLAB</div>
              </div>
            </div>

            <div className="horizontal-card">
              <h3>Unit Counts</h3>
              {/* Placeholder for unit counts content */}
              <div className="unit-summary-item">
                <img src={PcDisplayLogo} alt="PC Display Icon" className="menu-icon" />
                <span>ITS 300</span>
                <span className="count">55</span>
              </div>
              <div className="unit-summary-item">
                <img src={PcDisplayLogo} alt="PC Display Icon" className="menu-icon" />
                <span>PTC 201</span>
                <span className="count">43</span>
              </div>
              <div className="unit-summary-item">
                <img src={PcDisplayLogo} alt="PC Display Icon" className="menu-icon" />
                <span>MCLAB</span>
                <span className="count">30</span>
              </div>
              <p className="total-units-text" style={{ marginTop: 'auto' }}>Total Units: 128</p>
            </div>

            <div className="horizontal-card" style={{ flex: '2' }}>
              <h3>TOTAL UNITS</h3>
              
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Maintenance;
