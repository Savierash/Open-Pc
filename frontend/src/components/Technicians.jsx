import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css'; // Changed to Dashboard.css
import ComputerLogo1 from '../assets/LOGO1.png';
import PersonLogo from '../assets/Person.png';
import HouseLogo from '../assets/HouseFill.png';
import GraphLogo from '../assets/GraphUp.png';
import PcDisplayLogo from '../assets/PcDisplayHorizontal.png';
import ClipboardLogo from '../assets/ClipboardCheck.png';
import GearLogo from '../assets/GearFill.png';
import OctagonLogo from '../assets/XOctagonFill.png';
import StackLogo from '../assets/Stack.png';
import ToolsLogo from '../assets/tools_logo.png';
import CopyIcon from '../assets/ClipboardCheck.png'; // Added CopyIcon import

const Technicians = () => {
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
          <span className="profile-name">John Paul</span> {/* Example Name */}
          <span className="profile-role">Auditor</span> {/* Example Role */}
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
                href="/unit-status-auditor" 
                className={`sidebar-link ${activeLink === '/unit-status-auditor' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('/unit-status-auditor');
                }}
              >
                <img src={PcDisplayLogo} alt="Unit Status Icon" className="menu-icon" />
                <span>Unit Status</span>
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
            <li>
              <a 
                href="/auditor-profile" 
                className={`sidebar-link ${activeLink === '/auditor-profile' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('/auditor-profile');
                }}
              >
                <img src={GearLogo} alt="Account Setting Icon" className="menu-icon" />
                <span>Account Setting</span>
              </a>
            </li>
          </ul>
        </aside>

        <main className="technicians-page-main-content">
          <div className="search-bar-container-top">
            <div className="search-text">Search A Technician</div>
            <div className="search-input-wrapper">
              <input type="text" placeholder="Search A Technician" className="search-input" />
              <img src={PersonLogo} alt="Search Icon" className="search-icon" />
            </div>
            <h2 className="page-title">Technicians</h2>
          </div>
          <div className="technicians-page-content">
            <div className="technicians-search-panel">
              <div className="technicians-list">
                <div className="technician-list-item">
                  <img src={PersonLogo} alt="Technician Icon" className="technician-icon" />
                  <div className="technician-name-and-id">
                    <span>Patrick Nethan</span>
                    <span className="technician-id">05729</span>
                  </div>
                </div>
                <div className="technician-list-item">
                  <img src={PersonLogo} alt="Technician Icon" className="technician-icon" />
                  <div className="technician-name-and-id">
                    <span>Kresner Leonardo</span>
                    <span className="technician-id">01593</span>
                  </div>
                </div>
                <div className="technician-list-item">
                  <img src={PersonLogo} alt="Technician Icon" className="technician-icon" />
                  <div className="technician-name-and-id">
                    <span>Prince Brian</span>
                    <span className="technician-id">03259</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="technicians-info-panel">
              <h2>Technician's Information</h2>
              <div className="technician-detail-card">
                <div className="technician-profile-header">
                  <img src={PersonLogo} alt="Profile Icon" className="profile-detail-icon" />
                  <h3>Patrick Nethan</h3>
                </div>
              </div>

              <label className="detail-label">Full name</label>
              <div className="detail-row-name">
                <input type="text" value="Patrick" readOnly className="detail-input" />
                <input type="text" value="Nethan" readOnly className="detail-input" />
              </div>
              
              <label className="detail-label contact-email-label">Contact Information</label>
              <label className="detail-label">Email</label>
              <div className="detail-row">
                <div className="input-with-icon-wrapper">
                  <input type="text" value="PatrickNethan@gmail.com" readOnly className="detail-input" />
                  <img src={CopyIcon} alt="Copy Icon" className="copy-icon" />
                </div>
              </div>
              <label className="detail-label">Contact No.</label>
              <div className="detail-row">
                <div className="input-with-icon-wrapper">
                  <input type="text" value="0932847387" readOnly className="detail-input" />
                  <img src={CopyIcon} alt="Copy Icon" className="copy-icon" />
                </div>
              </div>
              <label className="detail-label">Address</label>
              <div className="detail-row">
                <div className="input-with-icon-wrapper">
                  <input type="text" value="Dagupan USA Chicago" readOnly className="detail-input" />
                </div>
              </div>
              <label className="detail-label">Tech ID:</label>
              <div className="detail-row">
                <div className="input-with-icon-wrapper">
                  <input type="text" value="05729" readOnly className="detail-input" />
                  <img src={CopyIcon} alt="Copy Icon" className="copy-icon" />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Technicians;
